import {canWriteMutation} from '../supabase/functions/_shared/delegate-policy.mjs';
import { buildMutation, mergeCloudRecord, mergeLocalRecordForWrite, reconcileCloudSnapshot } from './sync-core.js?v=20261009-postgame-sync-1';
import { demoDatabaseName, isDemoSessionActive } from './demo-session-core.js?v=20261022-pilot-safety-1';
import { getBoundSaasUserId, getRememberedSaasAccount, userDatabaseName, getPinAccessRevision } from './auth-manager.js';
import { buildExportManifest, validateBackupForAccount } from './backup-safety.js';

var REAL_DB_NAME = 'campobase';
const DB_VERSION = 3;
const isReadOnlyPreview = () => globalThis.__CAMPOBASE_READONLY_PREVIEW === true;
export const STORES = ['players', 'callups', 'matches', 'trainings', 'settings'];
const SYNC_QUEUE = 'syncQueue';
// A dedicated local store keeps recovery files out of both team records and
// cloud snapshots, including clients that still have older code loaded.
const LOCAL_RECOVERY = 'localRecovery';
const IMPORT_RECOVERY_ID = '__campobase_local_import_recovery__';
const isLocalRecovery = record => record?.id === IMPORT_RECOVERY_ID || record?.recordType === 'localImportRecovery';
const visibleRecords = (store, records) => store === 'settings' ? records.filter(record => !isLocalRecovery(record)) : records;
const PLAYER_PROFILE_FIELDS = Object.freeze([
  'name', 'number', 'positions', 'foot', 'notes',
  'fatherName', 'fatherPhone', 'motherName', 'motherPhone',
  'photo', 'createdAt', 'profileUpdatedAt',
]);

function preservePlayerProfileFields(current, incoming) {
  if (!current || !incoming) return structuredClone(incoming);
  const next = structuredClone(incoming);
  for (const field of PLAYER_PROFILE_FIELDS) {
    if (Object.hasOwn(current, field)) next[field] = structuredClone(current[field]);
    else delete next[field];
  }
  return next;
}

function boundDatabaseName() {
  const userId = typeof getBoundSaasUserId === 'function' ? getBoundSaasUserId() : '';
  return userId ? userDatabaseName(userId) : (REAL_DB_NAME || 'campobase');
}

var databasePromises = new Map();
var activeDatabaseName = null;
var demoSession = null;
var demoStores = null;
var cloudStore = null;
var syncPromise = null;
var syncContextKey = '';
var storageRevision = 0;
var importingDatabase = false;
var demoImportRecovery = null;

function notifyDataChanged(stores, operation = 'write') {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
  const uniqueStores = [...new Set((Array.isArray(stores) ? stores : [stores]).filter(Boolean))];
  if (!uniqueStores.length) return;
  window.dispatchEvent(new CustomEvent('campobase:data-changed', {
    detail: { stores: uniqueStores, operation, at: Date.now() },
  }));
}

function storageContext() {
  return Object.freeze({userId:getBoundSaasUserId(), database:isDemoDatabase() ? activeDatabaseName : boundDatabaseName(), pinRevision:getPinAccessRevision(), demoId:demoSession?.id || '', role:globalThis.__campobase?.state?.role || '', storageRevision});
}
function assertStorageContext(context, openedDatabase) {
  const current=storageContext();
  if (!context || context.userId!==current.userId || context.database!==current.database || context.pinRevision!==current.pinRevision || context.demoId!==current.demoId || context.role!==current.role || context.storageRevision!==current.storageRevision || (openedDatabase && openedDatabase!==context.database)) {
    const error=new Error('La cuenta ha cambiado. Vuelve a abrir la operación; tus datos anteriores se conservan.');
    error.code='CAMPOBASE_CONTEXT_CHANGED';throw error;
  }
}
function operationGuard(context, external) {
  return databaseName=>{external?.(databaseName);assertStorageContext(context,databaseName);};
}
async function contextDatabase(context) {
  assertStorageContext(context);
  activeDatabaseName=context.database;
  const database=await openDatabaseByName(context.database);
  assertStorageContext(context,database.name);
  return database;
}
const cloudOptions=context=>({expectedContext:{userId:context.userId,database:context.database,pinRevision:context.pinRevision}});

export function currentDatabaseName() {
  return activeDatabaseName;
}

export function isDemoDatabase() {
  return Boolean(demoSession);
}

export function configureDemoDatabase(session, now = Date.now()) {
  if (!isDemoSessionActive(session, now)) throw new TypeError('La sesión demo está caducada o no es válida.');
  if (demoSession?.id !== session.id) {
    demoStores = Object.fromEntries(STORES.map((store) => [store, new Map()]));
    demoImportRecovery = null;
  }
  demoSession = structuredClone(session);
  activeDatabaseName = demoDatabaseName(session);
}

export function configureUserDatabase(userId) {
  demoSession = null;
  activeDatabaseName = userDatabaseName(userId);
}

export function configureRealDatabase() {
  demoSession = null;
  activeDatabaseName = boundDatabaseName();
}

export async function deleteDemoDatabase(session) {
  demoDatabaseName(session);
  if (demoSession?.id === session.id) demoStores = Object.fromEntries(STORES.map((store) => [store, new Map()]));
}

function openDatabaseByName(name) {
  if (databasePromises.has(name)) return databasePromises.get(name);
  let opening;
  opening=new Promise((resolve, reject) => {
    let rejected=false;
    const forget=()=>{if(databasePromises.get(name)===opening)databasePromises.delete(name);};
    const fail=error=>{rejected=true;forget();reject(error);};
    const open = name===REAL_DB_NAME && globalThis.__cbNativeIndexedDbOpen ? globalThis.__cbNativeIndexedDbOpen : indexedDB.open.bind(indexedDB);
    const request = open(name, DB_VERSION);
    request.onupgradeneeded = () => {
      for (const store of [...STORES, SYNC_QUEUE, LOCAL_RECOVERY]) {
        if (!request.result.objectStoreNames.contains(store)) {
          request.result.createObjectStore(store, { keyPath: 'id' });
        }
      }
    };
    request.onsuccess = () => {
      const database=request.result;
      if(rejected){database.close();return;}
      database.onversionchange=()=>{database.close();forget();};
      resolve(database);
    };
    request.onerror = () => fail(request.error);
    request.onblocked = () => fail(new Error('Cierra otras pestañas de CampoBase para actualizar la base de datos.'));
  });
  databasePromises.set(name,opening);
  // Also evict synchronous failures from indexedDB.open without removing a
  // later retry that may already be registered for this same database name.
  opening.catch(()=>{if(databasePromises.get(name)===opening)databasePromises.delete(name);});
  return opening;
}

export function openDatabase() {
  // La base real se resuelve en cada apertura. Si una sesión Supabase válida
  // acaba de recuperar campobase.saasUserId durante el arranque, no debemos
  // seguir usando la base legado "campobase" por haberla calculado antes.
  if (!demoSession) activeDatabaseName = boundDatabaseName();
  return openDatabaseByName(activeDatabaseName);
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error ?? new Error('La operación local se canceló.'));
  });
}

async function localGetAll(store, context=storageContext()) {
  assertStorageContext(context);
  if (isDemoDatabase()) return visibleRecords(store,[...demoStores[store].values()].map(value=>structuredClone(value)));
  const db=await contextDatabase(context);
  const result=await requestResult(db.transaction(store,'readonly').objectStore(store).getAll());
  assertStorageContext(context,db.name);return visibleRecords(store,result);
}
async function localGetOne(store,id,context=storageContext()) {
  assertStorageContext(context);
  if (store === 'settings' && id === IMPORT_RECOVERY_ID) return undefined;
  if (isDemoDatabase()) return structuredClone(demoStores[store].get(id));
  const db=await contextDatabase(context);
  const result=await requestResult(db.transaction(store,'readonly').objectStore(store).get(id));
  assertStorageContext(context,db.name);return result;
}

async function removeQueuedMutation(id, acknowledged = null, database = null, context=storageContext()) {
  const db = database || await openDatabase();
  assertStorageContext(context,db.name);
  const transaction = db.transaction(SYNC_QUEUE, 'readwrite');
  const queue = transaction.objectStore(SYNC_QUEUE);
  if (!acknowledged) queue.delete(id);
  else {
    const request = queue.get(id);
    request.onsuccess = () => {
      // A newer save may replace this ID while the old network request is running.
      // Acknowledge only the exact mutation sent, in the same active transaction.
      try {
        assertStorageContext(context,db.name);
        if (JSON.stringify(request.result) === JSON.stringify(acknowledged)) queue.delete(id);
      } catch { transaction.abort(); }
    };
  }
  await transactionDone(transaction);
}

let queuedUploadPromise = null;
let uploadRequestedWhileBusy = false;
function queueCloudUpload(context=storageContext()) {
  try {assertStorageContext(context);} catch {return;}
  if (!canUseCloud()) return;
  uploadRequestedWhileBusy = true;
  if (queuedUploadPromise) return;
  queuedUploadPromise = (async () => {
    // A second batch can replace a queued record while the first request is in
    // flight. Acknowledging the old copy keeps the new one; send it next now,
    // rather than relying on a mobile interval that may be suspended.
    for (let cycle = 0; cycle < 3; cycle++) {
      uploadRequestedWhileBusy = false;
      const uploaded = await flushSyncQueue(cloudOptions(context));
      if (!uploaded || !uploadRequestedWhileBusy) break;
    }
  })().catch(error => console.warn('Cambios guardados en el dispositivo; sincronización pendiente:', error))
    .finally(() => { queuedUploadPromise = null; });
}

function canUseCloud() {
  return !isReadOnlyPreview() && Boolean(cloudStore) && (typeof navigator === 'undefined' || navigator.onLine);
}

async function prepareStorageBindingForWrite(context) {
  if (isDemoDatabase() || getBoundSaasUserId() || typeof cloudStore?.prepare !== 'function') return;
  try {
    // getSession() es local y puede reconstruir el user_id incluso en móvil
    // antes de decidir qué IndexedDB debe recibir el cambio.
    await cloudStore.prepare(undefined,cloudOptions(context));
  } catch (error) {
    if (error?.code !== 'CAMPOBASE_AUTH_REQUIRED' && !error?.message?.includes('Inicia sesión')) {
      console.warn('No se pudo preparar el almacenamiento SaaS para escritura:', error);
    }
    // Sin sesión SaaS válida seguimos permitiendo el modo local legado.
  }
}

export function configureCloudStore(store) {
  cloudStore = store;
}

// Storage de vídeos: delega en el cliente Supabase configurado.
export async function uploadVideo(path, file) {
  const context=storageContext(),adapter=cloudStore;
  assertStorageContext(context);
  if (!adapter?.uploadVideo) throw new Error('El almacenamiento de vídeos no está disponible.');
  const result=await adapter.uploadVideo(path,file,cloudOptions(context));
  assertStorageContext(context);
  if(adapter!==cloudStore) throw new Error('La conexión de la cuenta ha cambiado.');
  return result;
}

export async function removeVideo(path) {
  const context=storageContext(),adapter=cloudStore;
  assertStorageContext(context);
  if (!adapter?.removeVideo) throw new Error('El almacenamiento de vídeos no está disponible.');
  const result=await adapter.removeVideo(path,cloudOptions(context));
  assertStorageContext(context);
  if(adapter!==cloudStore) throw new Error('La conexión de la cuenta ha cambiado.');
  return result;
}

export async function getAll(store) {
  return localGetAll(store);
}

export async function getOne(store, id) {
  return localGetOne(store, id);
}

export async function put(store, value, { assertContext, waitForCloud = true } = {}) {
  const context=storageContext(), guard=operationGuard(context,assertContext);
  guard();
  if (store === 'settings' && isLocalRecovery(value)) throw new TypeError('El respaldo local solo se administra mediante la importación.');
  if (isDemoDatabase()) {
    demoStores[store].set(value.id, structuredClone(value));
    notifyDataChanged(store, 'upsert');
    return value;
  }
  if (!isReadOnlyPreview()) await prepareStorageBindingForWrite(context);
  guard();
  const existing = store === 'players' && value?.id ? await localGetOne(store, value.id,context) : null;
  const genericRecord = mergeLocalRecordForWrite(store, existing, value);
  const recordToStore = store === 'players' && existing
    ? preservePlayerProfileFields(existing, genericRecord)
    : genericRecord;
  const db = await contextDatabase(context);
  guard(db.name);
  const transaction = db.transaction([store, SYNC_QUEUE], 'readwrite');
  transaction.objectStore(store).put(recordToStore);
  transaction.objectStore(SYNC_QUEUE).put(buildMutation(store, 'upsert', recordToStore));
  await transactionDone(transaction);
  queueCloudUpload(context);
  if (waitForCloud && canUseCloud()) await flushSyncQueue(cloudOptions(context));
  notifyDataChanged(store, 'upsert');
  return recordToStore;
}

export async function putPlayerProfile(value, {assertContext} = {}) {
  const context=storageContext(),guard=operationGuard(context,assertContext);guard();
  if (!value?.id) throw new TypeError('La ficha del jugador necesita un identificador.');
  const recordToStore = { ...structuredClone(value), profileUpdatedAt: Date.now() };
  if (isDemoDatabase()) {
    demoStores.players.set(recordToStore.id, structuredClone(recordToStore));
    notifyDataChanged('players', 'profile-upsert');
    return recordToStore;
  }
  if (!isReadOnlyPreview()) await prepareStorageBindingForWrite(context);
  const db = await contextDatabase(context);
  guard(db.name);
  const transaction = db.transaction(['players', SYNC_QUEUE], 'readwrite');
  transaction.objectStore('players').put(recordToStore);
  transaction.objectStore(SYNC_QUEUE).put(buildMutation('players', 'upsert', recordToStore));
  await transactionDone(transaction);
  queueCloudUpload(context);
  if (canUseCloud()) await flushSyncQueue(cloudOptions(context));
  notifyDataChanged('players', 'profile-upsert');
  return recordToStore;
}

export async function putBatch(recordsByStore, { assertContext } = {}) {
  const context=storageContext(), guard=operationGuard(context,assertContext);
  guard();
  const storeNames = Object.keys(recordsByStore);
  if (!storeNames.length || storeNames.some((store) => !STORES.includes(store))) {
    throw new TypeError('La operación contiene almacenes no válidos.');
  }
  if (isDemoDatabase()) {
    for (const [storeName, records] of Object.entries(recordsByStore)) {
      if (!Array.isArray(records)) throw new TypeError('Cada lote debe ser una lista.');
      if (storeName === 'settings' && records.some(isLocalRecovery)) throw new TypeError('El respaldo local solo se administra mediante la importación.');
      for (const record of records) demoStores[storeName].set(record.id, structuredClone(record));
    }
    notifyDataChanged(storeNames, 'batch');
    return;
  }
  if (!isReadOnlyPreview()) await prepareStorageBindingForWrite(context);
  guard();
  const normalizedRecordsByStore = {};
  for (const [storeName, records] of Object.entries(recordsByStore)) {
    if (!Array.isArray(records)) throw new TypeError('Cada lote debe ser una lista.');
    if (storeName === 'settings' && records.some(isLocalRecovery)) throw new TypeError('El respaldo local solo se administra mediante la importación.');
    if (storeName !== 'players') {
      normalizedRecordsByStore[storeName] = records;
      continue;
    }
    normalizedRecordsByStore[storeName] = await Promise.all(records.map(async (record) => {
      const existing = record?.id ? await localGetOne('players', record.id,context) : null;
      const merged = mergeLocalRecordForWrite('players', existing, record);
      return existing ? preservePlayerProfileFields(existing, merged) : merged;
    }));
  }

  const db = await contextDatabase(context);
  guard(db.name);
  const transaction = db.transaction([...storeNames, SYNC_QUEUE], 'readwrite');
  for (const [storeName, records] of Object.entries(normalizedRecordsByStore)) {
    for (const record of records) {
      transaction.objectStore(storeName).put(record);
      transaction.objectStore(SYNC_QUEUE).put(buildMutation(storeName, 'upsert', record));
    }
  }
  await transactionDone(transaction);
  notifyDataChanged(storeNames, 'batch');
  queueCloudUpload(context);
}

export async function remove(store, id, { assertContext, waitForCloud = true } = {}) {
  const context=storageContext(), guard=operationGuard(context,assertContext);
  guard();
  if (store === 'settings' && id === IMPORT_RECOVERY_ID) throw new TypeError('El respaldo local solo se administra mediante la importación.');
  if (isDemoDatabase()) {
    demoStores[store].delete(id);
    notifyDataChanged(store, 'delete');
    return;
  }
  if (!isReadOnlyPreview()) await prepareStorageBindingForWrite(context);
  guard();
  const db = await contextDatabase(context);
  guard(db.name);
  const transaction = db.transaction([store, SYNC_QUEUE], 'readwrite');
  transaction.objectStore(store).delete(id);
  transaction.objectStore(SYNC_QUEUE).put(buildMutation(store, 'delete', id));
  await transactionDone(transaction);
  queueCloudUpload(context);
  if (waitForCloud && canUseCloud()) await flushSyncQueue(cloudOptions(context));
  notifyDataChanged(store, 'delete');
}

let flushPromise = null;
let lastUploadError = null;
let flushContextKey='';
export function flushSyncQueue({expectedContext}={}) {
  const context=storageContext();
  if (expectedContext && (expectedContext.userId!==context.userId || expectedContext.database!==context.database || expectedContext.pinRevision!==context.pinRevision)) return Promise.resolve(false);
  const key=JSON.stringify(context);
  if (flushPromise) return flushContextKey===key ? flushPromise : flushPromise.catch(()=>false).then(()=>flushSyncQueue({expectedContext}));
  flushContextKey=key;
  flushPromise=flushQueuedMutations(context).catch(error=>{if(error?.code==='CAMPOBASE_CONTEXT_CHANGED')return false;throw error;}).finally(()=>{flushPromise=null;flushContextKey='';});
  return flushPromise;
}
async function flushQueuedMutations(context) {
  const adapter=cloudStore;
  const assertActor=()=>{assertStorageContext(context);if(adapter!==cloudStore){const error=new Error('La conexión de la cuenta ha cambiado.');error.code='CAMPOBASE_CONTEXT_CHANGED';throw error;}};
  assertActor();
  lastUploadError = null;
  if (isDemoDatabase() || isReadOnlyPreview()) return false;
  if (!canUseCloud()) return false;
  // Verifica y vincula primero la sesión remota. Es crítico hacerlo ANTES de
  // abrir/leer syncQueue para que una cola de la base legado nunca pueda
  // subirse accidentalmente a una cuenta SaaS recuperada después.
  if (typeof cloudStore?.prepare === 'function') {
    try {
      await adapter.prepare(undefined,cloudOptions(context));
      assertActor();
    } catch (authError) {
      lastUploadError = authError;
      if (authError?.message?.includes('Inicia sesión') || authError?.code === 'CAMPOBASE_AUTH_REQUIRED' || authError?.name === 'TypeError') {
        return false;
      }
      throw authError;
    }
  }
  const queueUserId = context.userId;
  const queueDatabase = await contextDatabase(context);
  const mutations = (await requestResult(queueDatabase.transaction(SYNC_QUEUE, 'readonly').objectStore(SYNC_QUEUE).getAll())).sort((a, b) => a.queuedAt - b.queuedAt);
  assertActor();
  for (const mutation of mutations) {
    assertActor();
    if (getBoundSaasUserId() !== queueUserId) return false;
    if (mutation.blockedAt) continue;
    if (mutation.store === 'settings' && (mutation.recordId === IMPORT_RECOVERY_ID || isLocalRecovery(mutation.payload))) continue;
    try {
      const shouldApply = typeof cloudStore?.shouldApplyMutation === 'function'
        ? await adapter.shouldApplyMutation(mutation,cloudOptions(context))
        : true;
      assertActor();
      if (!shouldApply) {
        // Supabase ya tiene una versión posterior. La cola local está obsoleta:
        // se elimina sin tocar la fila remota y el snapshot cloud la repondrá localmente.
        assertActor();
        await removeQueuedMutation(mutation.id, mutation, queueDatabase,context);
        continue;
      }
      if (mutation.operation === 'delete') await adapter.remove(mutation,cloudOptions(context));
      else await adapter.upsert(mutation,cloudOptions(context));
      assertActor();
        await removeQueuedMutation(mutation.id, mutation, queueDatabase,context);
    } catch (mutationError) {
      if(mutationError?.code==='CAMPOBASE_CONTEXT_CHANGED')throw mutationError;
      assertActor();
      if (mutationError?.code === 'CAMPOBASE_PERMISSION_REVOKED') {
        const tx = queueDatabase.transaction(SYNC_QUEUE,'readwrite');
        const queue = tx.objectStore(SYNC_QUEUE), read = queue.get(mutation.id);
        read.onsuccess = () => {
          try {
            assertActor();
            if (JSON.stringify(read.result) === JSON.stringify(mutation)) queue.put({...read.result,blockedAt:Date.now()});
          } catch { tx.abort(); }
        };
        await transactionDone(tx);
        continue; // Preserve the denied draft, but do not replay it on a later grant.
      }
      if (mutationError?.message?.includes('Inicia sesión') || mutationError?.code === 'CAMPOBASE_AUTH_REQUIRED') {
        return false;
      }
      lastUploadError = mutationError;
      console.warn('Error aplicando mutación cloud; se reintentará luego:', mutationError);
      return false;
    }
  }
  return true;
}

async function replaceLocalStore(store, cloudRecords, deletedIds = [], mirror = null, context=storageContext()) {
  const db = await contextDatabase(context);

  // Safari/iOS puede cerrar una transacción IndexedDB si se cede el control
  // entre las lecturas y las escrituras. Las dos lecturas y el clear/put deben
  // permanecer en la misma transacción atómica y las escrituras se encolan
  // desde el callback onsuccess de la última lectura, mientras sigue activa.
  await new Promise((resolve, reject) => {
    const transaction = db.transaction([store, SYNC_QUEUE], 'readwrite');
    const objectStore = transaction.objectStore(store);
    const queueStore = transaction.objectStore(SYNC_QUEUE);
    const localRequest = objectStore.getAll();
    const pendingRequest = queueStore.getAll();

    let localRecords = [];
    let pendingMutations = [];
    let localReady = false;
    let pendingReady = false;
    let reconciled = false;

    const reconcileAndWrite = () => {
      if (reconciled || !localReady || !pendingReady) return;
      reconciled = true;
      try {assertStorageContext(context,db.name);} catch(error) {transaction.abort();reject(error);return;}

      if (store === 'players' && (!cloudRecords || cloudRecords.length === 0) && localRecords.length > 0 && !deletedIds.length) {
        console.warn('Protección activa: se omite vaciado local de jugadores sin confirmación explícita del servidor.');
        return;
      }

      const localRecovery = store === 'settings' ? localRecords.filter(isLocalRecovery) : [];
      const allowedPending = pendingMutations.filter(m => !m.blockedAt && !(m.store === 'settings' && (m.recordId === IMPORT_RECOVERY_ID || isLocalRecovery(m.payload))) && (!mirror || canWriteMutation(m,mirror.permissions||[])));
      // The delegate receives a filtered replica, never an initial seed or owner settings merge.
      const reconciledRecords = reconcileCloudSnapshot(store, mirror ? [] : visibleRecords(store,localRecords), visibleRecords(store,cloudRecords), allowedPending, deletedIds);
      objectStore.clear();
      for (const record of reconciledRecords) objectStore.put(record);
      for (const record of localRecovery) objectStore.put(record);
    };

    localRequest.onsuccess = () => {
      localRecords = localRequest.result ?? [];
      localReady = true;
      reconcileAndWrite();
    };
    pendingRequest.onsuccess = () => {
      pendingMutations = pendingRequest.result ?? [];
      pendingReady = true;
      reconcileAndWrite();
    };

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('No se pudo reconciliar la copia local.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('La reconciliación local se canceló.'));
  });
}

async function queueInitialRecords(store, records, context=storageContext()) {
  records=visibleRecords(store,records);
  if (!records.length) return;
  const db = await contextDatabase(context);
  const transaction = db.transaction(SYNC_QUEUE, 'readwrite');
  const queue = transaction.objectStore(SYNC_QUEUE);
  for (const record of records) {
    const mutation = buildMutation(store, 'upsert', record);
    const request = queue.get(mutation.id);
    request.onsuccess = () => {try {assertStorageContext(context,db.name);if (!request.result) queue.put(mutation);}catch(error){transaction.abort();}};
  }
  await transactionDone(transaction);
}

export async function syncFromCloud() {
  const context=storageContext(), adapter=cloudStore;
  const assertActor=()=>{assertStorageContext(context);if(adapter!==cloudStore){const error=new Error('La conexión de la cuenta ha cambiado.');error.code='CAMPOBASE_CONTEXT_CHANGED';throw error;}};
  const key=JSON.stringify(context);
  if(syncPromise) {
    if(syncContextKey===key)return syncPromise;
    // Serialize storage work, but never return a previous account's outcome.
    try {await syncPromise;} catch {/* Its original caller owns that error. */}
    assertActor();
    return syncFromCloud();
  }
  syncContextKey=key;
  if (isReadOnlyPreview()) {
    if (!canUseCloud()) return { online:false, pending:0 };
    // The preview uses its own browser database. Serialize reads so two refreshes
    // cannot replace stores in opposite orders and render a partial snapshot.
    if (syncPromise) return syncPromise;
    syncPromise = (async () => {
      try {
        let downloaded = 0;
        for (const store of STORES) {
          assertActor();
          const snapshot = await adapter.getSnapshot(store,cloudOptions(context));
          assertActor();
          await replaceLocalStore(store, snapshot.records, snapshot.deletedIds || [],null,context);
          downloaded += snapshot.records.length;
        }
        return { online:true, pending:0, downloaded, changed:true, readOnly:true };
      } catch (error) {
        if(error?.code==='CAMPOBASE_CONTEXT_CHANGED')return {online:false,changed:false,accessChanged:true};
        if (error?.code === 'CAMPOBASE_AUTH_REQUIRED') return {online:false,pending:0,authRequired:true};
        throw error;
      }
    })();
    try { return await syncPromise; }
    finally { syncPromise = null; }
  }

  if (isDemoDatabase()) return { online: false, pending: 0, demo: true };
  if (!canUseCloud()) return { online: false, pending: (await localGetAll(SYNC_QUEUE)).length };
  if (syncPromise) return syncPromise;
  syncPromise = (async () => {
    try {
      const syncUserId = context.userId;
      assertActor();
      await flushSyncQueue(cloudOptions(context));
      if (queuedUploadPromise) await queuedUploadPromise;
      assertActor();
      if (getBoundSaasUserId() !== syncUserId) return {online:false,changed:false,accessChanged:true};
      let downloaded = 0;
      let hasChanges = false;
      for (const store of STORES) {
          assertActor();
        const snapshot = await adapter.getSnapshot(store,cloudOptions(context));
          assertActor();
        if (getBoundSaasUserId() !== syncUserId) return {online:false,changed:false,accessChanged:true};
        const localRecords = await localGetAll(store,context);
        assertActor();
        if (snapshot.restricted) continue;
        if (snapshot.readOnlyMirror) {
          if (JSON.stringify(localRecords) !== JSON.stringify(snapshot.records)) {
            await replaceLocalStore(store,snapshot.records,snapshot.deletedIds||[],snapshot,context);
            hasChanges = true;
          }
          downloaded += snapshot.records.length;
          continue;
        }
        if (snapshot.rowCount === 0 && localRecords.length) {
          await queueInitialRecords(store, localRecords,context);
          await flushSyncQueue(cloudOptions(context));
          continue;
        }
        if (store === 'players' && localRecords.length && snapshot.records.length) {
          const localById = new Map(localRecords.map((record) => [record.id, record]));
          const repaired = [];
          snapshot.records = snapshot.records.map((cloudRecord) => {
            const merged = mergeCloudRecord('players', localById.get(cloudRecord.id), cloudRecord);
            if (JSON.stringify(merged) !== JSON.stringify(cloudRecord)) repaired.push(merged);
            return merged;
          });
          if (repaired.length) {
            await queueInitialRecords('players', repaired,context);
            await flushSyncQueue(cloudOptions(context));
          }
        }
        if (store === 'settings') {
          const localMain = localRecords.find(({ id }) => id === 'main');
          const cloudMainIndex = snapshot.records.findIndex(({ id }) => id === 'main');
          if (localMain && cloudMainIndex >= 0) {
            const mergedMain = mergeCloudRecord(store, localMain, snapshot.records[cloudMainIndex]);
            if (JSON.stringify(mergedMain) !== JSON.stringify(snapshot.records[cloudMainIndex])) {
              snapshot.records[cloudMainIndex] = mergedMain;
              await queueInitialRecords(store, [mergedMain],context);
              await flushSyncQueue(cloudOptions(context));
            }
          }
        }
        const cloudIds = new Set(snapshot.records.map((r) => r.id));
        const deletedIds = new Set(snapshot.deletedIds || []);
        const missingFromCloud = localRecords.filter((r) => !cloudIds.has(r.id) && !deletedIds.has(r.id));
        if (missingFromCloud.length > 0) {
          await queueInitialRecords(store, missingFromCloud,context);
          await flushSyncQueue(cloudOptions(context));
        }
        const areEquivalent = (() => {
          if (localRecords.length !== snapshot.records.length) return false;
          if (localRecords.length === 0) return true;
          const sortById = (list) => [...list].sort((a, b) => String(a.id || '').localeCompare(String(b.id || '')));
          return JSON.stringify(sortById(localRecords)) === JSON.stringify(sortById(snapshot.records));
        })();
        if (!areEquivalent) {
          hasChanges = true;
          await replaceLocalStore(store, snapshot.records, snapshot.deletedIds || [],null,context);
        }
        downloaded += snapshot.records.length;
      }
      assertActor();
      const pending = (await localGetAll(SYNC_QUEUE,context)).length;
      return { online: true, pending, downloaded, changed: hasChanges, uploadError: pending ? lastUploadError?.message || '' : '' };
    } catch (syncError) {
      if(syncError?.code==='CAMPOBASE_CONTEXT_CHANGED')return {online:false,changed:false,accessChanged:true};
      assertActor();
      if (syncError?.message?.includes('Inicia sesión') || syncError?.code === 'CAMPOBASE_AUTH_REQUIRED') {
        return { online: false, pending: (await localGetAll(SYNC_QUEUE)).length, authRequired: true };
      }
      if (isCloudServiceRestricted(syncError)) {
        if ((await adapter.prepare(undefined,cloudOptions(context)))?.delegate) return {online:false,changed:false,cloudRestricted:true};
        const recovery = await mergeMissingLegacyRecordsIntoBoundDatabase(context).catch((error) => {
          console.warn('No se pudo recuperar la base local anterior:', error);
          return { recovered: 0 };
        });
        return {
          online: false,
          pending: (await localGetAll(SYNC_QUEUE)).length,
          cloudRestricted: true,
          localRecovered: recovery.recovered,
          changed: recovery.recovered > 0,
        };
      }
      throw syncError;
    }
  })().finally(() => { syncPromise = null; });
  return syncPromise;
}

async function queueFromDatabaseName(name) {
  const db = await openDatabaseByName(name);
  return requestResult(db.transaction(SYNC_QUEUE, 'readonly').objectStore(SYNC_QUEUE).getAll());
}

function isRecoverableLegacySetting(record) {
  if (!record?.id) return false;
  if (record.id === 'main' || record.id === 'teamName') return true;
  if (['trainingSession', 'preparacion', 'tactic', 'staffMember'].includes(record.recordType)) return true;
  if (record.recordType !== 'exercise') return false;
  return record.userCreated === true
    || record.customBoard === true
    || record.source === 'personal'
    || String(record.id).startsWith('mine-')
    || String(record.id).startsWith('pdf98-user-');
}

async function legacyDatabaseForOwner(context, explicit=false) {
  assertStorageContext(context);
  if(!context.userId || isDemoDatabase()) {if(explicit)throw new Error('Inicia sesión como titular antes de recuperar datos anteriores.');return null;}
  const legacyDb=await openDatabaseByName(REAL_DB_NAME);
  assertStorageContext(context);
  if(legacyDb.name!==REAL_DB_NAME) {if(explicit)throw new Error('No se ha podido identificar el almacenamiento anterior.');return null;}
  const main=await requestResult(legacyDb.transaction('settings','readonly').objectStore('settings').get('main'));
  assertStorageContext(context);
  if(String(main?.saasUserId || '')!==context.userId) {
    if(explicit)throw new Error('No se puede demostrar que los datos anteriores pertenecen a esta cuenta. Se conservan separados para revisarlos sin mezclarlos.');
    return null;
  }
  return legacyDb;
}
async function mergeMissingLegacyRecordsIntoBoundDatabase(context=storageContext()) {
  const legacyDb=await legacyDatabaseForOwner(context);
  if(!legacyDb)return {recovered:0,unlinkedLegacy:true};
  const targetDb=await contextDatabase(context);
  let recovered=0;
  for(const storeName of STORES) {
    const legacyRecords=await requestResult(legacyDb.transaction(storeName,'readonly').objectStore(storeName).getAll());
    assertStorageContext(context,targetDb.name);
    const sourceRecords=storeName==='settings' ? legacyRecords.filter(isRecoverableLegacySetting) : legacyRecords;
    if(!sourceRecords.length)continue;
    await new Promise((resolve,reject)=>{
      const tx=targetDb.transaction(storeName,'readwrite'),store=tx.objectStore(storeName),read=store.getAll();
      read.onsuccess=()=>{
        try {
          assertStorageContext(context,targetDb.name);
          const current=read.result || [];
          if(storeName!=='settings' && current.length)return;
          if(storeName==='settings' && current.some(record=>['trainingSession','preparacion','tactic','staffMember'].includes(record.recordType) || (record.recordType==='exercise' && isRecoverableLegacySetting(record))))return;
          const ids=new Set(current.map(record=>record.id));
          for(const record of sourceRecords)if(record?.id && !ids.has(record.id)){store.put(structuredClone(record));recovered++;}
        }catch(error){tx.abort();reject(error);}
      };
      tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error || new Error('Recuperación cancelada.'));
    });
  }
  if(recovered)notifyDataChanged(STORES,'legacy-local-recovery');
  return {recovered};
}

function isCloudServiceRestricted(error) {
  const status = Number(error?.status || error?.statusCode || error?.context?.status || 0);
  const message = String(error?.message || '');
  return status === 402
    || /exceed_(cached_)?egress_quota/i.test(message)
    || /service for this project is restricted/i.test(message);
}

export async function getLocalPinSettingsCandidates() {
  if (isDemoDatabase()) return [];
  const context=storageContext(),rememberedId=context.userId ? '' : (getRememberedSaasAccount()?.id || '');
  const expectedUserId=context.userId || rememberedId;
  const assertCandidateContext=()=>{
    assertStorageContext(context);
    if(!context.userId && (getRememberedSaasAccount()?.id || '')!==rememberedId) {
      const error=new Error('La cuenta recordada ha cambiado. Vuelve a entrar.');error.code='CAMPOBASE_CONTEXT_CHANGED';throw error;
    }
  };
  const names=expectedUserId ? [userDatabaseName(expectedUserId),REAL_DB_NAME] : [REAL_DB_NAME];
  const candidates = [];
  for (const name of names) {
    try {
      assertCandidateContext();
      const database = await openDatabaseByName(name);
      assertCandidateContext();
      const settings = await requestResult(
        database.transaction('settings', 'readonly').objectStore('settings').get('main')
      );
      assertCandidateContext();
      const declaredOwner=String(settings?.saasUserId || '');
      if(name===REAL_DB_NAME ? declaredOwner!==expectedUserId : declaredOwner && declaredOwner!==expectedUserId)continue;
      if (settings?.pinSalt && (settings.ownerPinHash || settings.delegatePinHash)) {
        candidates.push({ databaseName: name, userId: expectedUserId, settings: structuredClone(settings) });
      }
    } catch(error) {
      if(error?.code==='CAMPOBASE_CONTEXT_CHANGED')throw error;
      // Una base inexistente o inaccesible no debe bloquear el resto de candidatos.
    }
  }
  assertCandidateContext();
  return candidates;
}

export async function getSyncDiagnostics() {
  const boundUserId = getBoundSaasUserId();
  const activeName = boundUserId ? userDatabaseName(boundUserId) : REAL_DB_NAME;
  const pending = await queueFromDatabaseName(activeName);
  const legacyPending = activeName === REAL_DB_NAME ? pending : await queueFromDatabaseName(REAL_DB_NAME);
  return {
    boundUserId,
    activeDatabase: activeName,
    pending: pending.length,
    legacyPending: activeName === REAL_DB_NAME ? 0 : legacyPending.length,
    online: typeof navigator === 'undefined' ? true : navigator.onLine,
  };
}

export async function recoverLegacyPendingMutations() {
  const context=storageContext(),adapter=cloudStore;
  const principal=await adapter?.prepare?.(undefined,cloudOptions(context));
  assertStorageContext(context);
  if(principal?.delegate || globalThis.__campobase?.state?.role==='delegate')throw new Error('Solo el titular puede recuperar datos anteriores.');
  if(principal?.userId && principal.userId!==context.userId)throw new Error('La cuenta ha cambiado.');
  const legacyDb=await legacyDatabaseForOwner(context,true);
  const legacyMutations=await requestResult(legacyDb.transaction(SYNC_QUEUE,'readonly').objectStore(SYNC_QUEUE).getAll());
  assertStorageContext(context);
  if(!legacyMutations.length)return {recovered:0};
  const targetDb=await contextDatabase(context),candidates=[];let conflicts=0;
  await new Promise((resolve,reject)=>{
    const tx=targetDb.transaction(SYNC_QUEUE,'readwrite'),queue=tx.objectStore(SYNC_QUEUE);
    for(const mutation of legacyMutations){
      const read=queue.get(mutation.id);
      read.onsuccess=()=>{try{assertStorageContext(context,targetDb.name);if(!read.result){queue.put(structuredClone(mutation));candidates.push(mutation);}else if(JSON.stringify(read.result)===JSON.stringify(mutation))candidates.push(mutation);else conflicts++;}catch(error){tx.abort();reject(error);}};
    }
    tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error || new Error('Recuperación cancelada.'));
  });
  const uploaded=await flushSyncQueue(cloudOptions(context));
  assertStorageContext(context);
  if(!uploaded)throw new Error('No se pudo confirmar la recuperación en la nube. Los cambios siguen conservados en ambos almacenamientos; vuelve a sincronizar con conexión.');
  const pending=await requestResult(targetDb.transaction(SYNC_QUEUE,'readonly').objectStore(SYNC_QUEUE).getAll());
  assertStorageContext(context);
  const pendingIds=new Set(pending.map(mutation=>mutation.id));let recovered=0;
  await new Promise((resolve,reject)=>{
    const tx=legacyDb.transaction(SYNC_QUEUE,'readwrite'),queue=tx.objectStore(SYNC_QUEUE);
    for(const mutation of candidates){
      if(pendingIds.has(mutation.id))continue;
      const read=queue.get(mutation.id);
      read.onsuccess=()=>{try{assertStorageContext(context);if(JSON.stringify(read.result)===JSON.stringify(mutation)){queue.delete(mutation.id);recovered++;}}catch(error){tx.abort();reject(error);}};
    }
    tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error || new Error('Recuperación cancelada.'));
  });
  return {recovered,conflicts,pendingLegacy:legacyMutations.length-recovered};
}

async function assertBackupAccess(context, guard) {
  guard();
  if (isReadOnlyPreview()) throw new Error('Las copias están bloqueadas en la preview.');
  if (isDemoDatabase()) {
    if (context.role !== 'demo') throw new Error('Vuelve a entrar en la demo antes de abrir una copia.');
    return;
  }
  if (context.role !== 'owner') throw new Error('Solo el titular puede abrir las copias de seguridad.');
  const adapter = cloudStore;
  if (canUseCloud() && typeof adapter.prepare === 'function') {
    const principal = await adapter.prepare(undefined,cloudOptions(context));
    guard();
    if (adapter !== cloudStore || principal?.delegate || (principal?.userId && principal.userId !== context.userId)) {
      throw new Error('La cuenta o sus permisos han cambiado. Vuelve a entrar antes de abrir una copia.');
    }
  }
  guard();
}

function manifestForContext(data, context) {
  return buildExportManifest(data,{userId:context.userId,database:context.database,mode:context.demoId ? 'demo' : 'real'});
}

// One readonly transaction gives the exported file a coherent view of the team.
async function snapshotDatabase(context, guard) {
  guard();
  if (isDemoDatabase()) return Object.fromEntries(STORES.map(store => [store,visibleRecords(store,[...demoStores[store].values()].map(record=>structuredClone(record)))]));
  const db=await contextDatabase(context);
  guard(db.name);
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORES,'readonly'),data={};
    let failure;
    for(const store of STORES) {
      const read=tx.objectStore(store).getAll();
      read.onsuccess=()=>{
        try {guard(db.name);data[store]=visibleRecords(store,read.result || []);}
        catch(error){failure=error;tx.abort();}
      };
    }
    tx.oncomplete=()=>{try{guard(db.name);resolve(data);}catch(error){reject(error);}};
    tx.onerror=()=>reject(failure || tx.error);
    tx.onabort=()=>reject(failure || tx.error || new Error('La copia se ha cancelado.'));
  });
}

export async function exportDatabase({assertContext} = {}) {
  const context=storageContext(),guard=operationGuard(context,assertContext);
  await assertBackupAccess(context,guard);
  const data=await snapshotDatabase(context,guard);
  guard();
  return manifestForContext(data,context);
}

export async function getImportRecoveryBackup({assertContext} = {}) {
  const context=storageContext(),guard=operationGuard(context,assertContext);
  await assertBackupAccess(context,guard);
  let recovery;
  if (isDemoDatabase()) recovery=demoImportRecovery;
  else {
    const db=await contextDatabase(context);
    guard(db.name);
    recovery=await requestResult(db.transaction(LOCAL_RECOVERY,'readonly').objectStore(LOCAL_RECOVERY).get(IMPORT_RECOVERY_ID));
    guard(db.name);
  }
  if (!recovery) return null;
  if (recovery.database !== context.database || recovery.saasUserId !== context.userId) throw new Error('El respaldo no corresponde a esta cuenta.');
  validateBackupForAccount(recovery.backup,context);
  guard();
  return structuredClone(recovery.backup);
}

export async function importDatabase(backup, {assertContext} = {}) {
  if (importingDatabase) throw new Error('Hay otra importación en curso. Espera a que termine.');
  importingDatabase=true;
  try {
    let context=storageContext(),guard=operationGuard(context,assertContext);
    guard();
    // Copy and validate before any write or asynchronous preparation. A file
    // never supplies an authenticated identity or changes the bound account.
    const incoming=structuredClone(backup);
    const data=validateBackupForAccount(incoming,context);
    if (data.settings.some(isLocalRecovery)) throw new Error('La copia contiene un respaldo interno reservado. No se han cambiado tus datos.');
    const settingsOwner=data.settings.find(record=>record.id==='main')?.saasUserId;
    if (!context.demoId && settingsOwner && settingsOwner !== context.userId) throw new Error('Los ajustes de la copia pertenecen a otra cuenta. No se han cambiado tus datos.');
    await assertBackupAccess(context,guard);
    guard();
    // An accepted restore is a new explicit profile edit. The archived copy
    // keeps its original revision; only the incoming restored records advance.
    const restorationAt=Date.now();
    for(const player of data.players)player.profileUpdatedAt=restorationAt;
    const db=isDemoDatabase() ? null : await contextDatabase(context);
    guard(db?.name);
    // Invalidate old reads/uploads, including a snapshot already in flight.
    // They retain their captured database and may never acknowledge this import.
    storageRevision++;
    context=storageContext();guard=operationGuard(context,assertContext);guard(db?.name);
    if (isDemoDatabase()) {
      const before=await snapshotDatabase(context,guard);
      guard();
      const next=Object.fromEntries(STORES.map(store=>[store,new Map(data[store].map(record=>[record.id,structuredClone(record)]))]));
      demoImportRecovery={database:context.database,saasUserId:context.userId,backup:manifestForContext(before,context)};
      demoStores=next;
    } else {
      await new Promise((resolve,reject)=>{
        const tx=db.transaction([...STORES,SYNC_QUEUE,LOCAL_RECOVERY],'readwrite'),before={},reads=[...STORES,SYNC_QUEUE];
        let remaining=reads.length,failure;
        const finish=()=>{
          if (--remaining) return;
          try {
            guard(db.name);
            const previous=Object.fromEntries(STORES.map(store=>[store,visibleRecords(store,before[store])]));
            const recovery={id:IMPORT_RECOVERY_ID,recordType:'localImportRecovery',database:context.database,saasUserId:context.userId,createdAt:Date.now(),backup:manifestForContext(previous,context),pendingMutations:before[SYNC_QUEUE]};
            const queue=tx.objectStore(SYNC_QUEUE);
            queue.clear();
            for(const storeName of STORES) {
              const store=tx.objectStore(storeName),incomingIds=new Set(data[storeName].map(record=>record.id));
              store.clear();
              // Replacing the local team must not let a previous pending upsert
              // resurrect an omitted row on the next cloud reconciliation.
              const removedIds=new Set(previous[storeName].map(record=>record.id));
              for(const mutation of before[SYNC_QUEUE]) if(mutation.store===storeName && !(storeName==='settings' && mutation.recordId===IMPORT_RECOVERY_ID)) removedIds.add(mutation.recordId);
              for(const id of removedIds) if(!incomingIds.has(id)) queue.put(buildMutation(storeName,'delete',id));
              for(const record of data[storeName]) {
                store.put(record);
                queue.put(buildMutation(storeName,'upsert',record));
              }
            }
            tx.objectStore(LOCAL_RECOVERY).put(recovery);
          } catch(error) {failure=error;tx.abort();}
        };
        for(const store of reads) {
          const read=tx.objectStore(store).getAll();
          read.onsuccess=()=>{before[store]=read.result || [];finish();};
        }
        tx.oncomplete=resolve;
        tx.onerror=()=>reject(failure || tx.error);
        tx.onabort=()=>reject(failure || tx.error || new Error('La importación se ha cancelado. Los datos y la cola anteriores se conservan.'));
      });
    }
    guard(db?.name);
    if (!isDemoDatabase()) {
      try {
        localStorage.setItem('campobase.directFieldCache',JSON.stringify({database:context.database,saasUserId:context.userId,players:data.players,callups:data.callups,matches:data.matches,attendance:data.trainings,settings:data.settings,at:Date.now()}));
      } catch {}
    }
    notifyDataChanged(STORES,'import');
  } finally {importingDatabase=false;}
}
