import { buildMutation, mergeCloudRecord, mergeLocalRecordForWrite, reconcileCloudSnapshot } from './sync-core.js';
import { demoDatabaseName, isDemoSessionActive } from './demo-session.js';
import { getBoundSaasUserId, userDatabaseName } from './auth-manager.js';

const REAL_DB_NAME = 'campobase';
const DB_VERSION = 2;
export const STORES = ['players', 'callups', 'matches', 'trainings', 'settings'];
const SYNC_QUEUE = 'syncQueue';
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
  const userId = getBoundSaasUserId();
  return userId ? userDatabaseName(userId) : REAL_DB_NAME;
}

var databasePromises = new Map();
var activeDatabaseName = boundDatabaseName();
var demoSession = null;
var demoStores = null;
var cloudStore = null;
var syncPromise = null;

function notifyDataChanged(stores, operation = 'write') {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
  const uniqueStores = [...new Set((Array.isArray(stores) ? stores : [stores]).filter(Boolean))];
  if (!uniqueStores.length) return;
  window.dispatchEvent(new CustomEvent('campobase:data-changed', {
    detail: { stores: uniqueStores, operation, at: Date.now() },
  }));
}

export function currentDatabaseName() {
  return activeDatabaseName;
}

export function isDemoDatabase() {
  return Boolean(demoSession);
}

export function configureDemoDatabase(session, now = Date.now()) {
  if (!isDemoSessionActive(session, now)) throw new TypeError('La sesión demo está caducada o no es válida.');
  if (demoSession?.id !== session.id) demoStores = Object.fromEntries(STORES.map((store) => [store, new Map()]));
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
  if (!databasePromises.has(name)) databasePromises.set(name, new Promise((resolve, reject) => {
    const request = indexedDB.open(name, DB_VERSION);
    request.onupgradeneeded = () => {
      for (const store of [...STORES, SYNC_QUEUE]) {
        if (!request.result.objectStoreNames.contains(store)) {
          request.result.createObjectStore(store, { keyPath: 'id' });
        }
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Cierra otras pestañas de CampoBase para actualizar la base de datos.'));
  }));
  return databasePromises.get(name);
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

async function localGetAll(store) {
  if (isDemoDatabase()) return [...demoStores[store].values()].map((value) => structuredClone(value));
  const db = await openDatabase();
  return requestResult(db.transaction(store, 'readonly').objectStore(store).getAll());
}

async function localGetOne(store, id) {
  if (isDemoDatabase()) return structuredClone(demoStores[store].get(id));
  const db = await openDatabase();
  return requestResult(db.transaction(store, 'readonly').objectStore(store).get(id));
}

async function removeQueuedMutation(id) {
  const db = await openDatabase();
  const transaction = db.transaction(SYNC_QUEUE, 'readwrite');
  transaction.objectStore(SYNC_QUEUE).delete(id);
  await transactionDone(transaction);
}

function canUseCloud() {
  return Boolean(cloudStore) && (typeof navigator === 'undefined' || navigator.onLine);
}

async function prepareStorageBindingForWrite() {
  if (isDemoDatabase() || getBoundSaasUserId() || typeof cloudStore?.prepare !== 'function') return;
  try {
    // getSession() es local y puede reconstruir el user_id incluso en móvil
    // antes de decidir qué IndexedDB debe recibir el cambio.
    await cloudStore.prepare();
  } catch (error) {
    if (error?.code !== 'CAMPOBASE_AUTH_REQUIRED') throw error;
    // Sin sesión SaaS válida seguimos permitiendo el modo local legado.
  }
}

export function configureCloudStore(store) {
  cloudStore = store;
}

// Storage de vídeos: delega en el cliente Supabase configurado.
export async function uploadVideo(path, file) {
  if (!cloudStore?.uploadVideo) throw new Error('El almacenamiento de vídeos no está disponible.');
  return cloudStore.uploadVideo(path, file);
}

export async function removeVideo(path) {
  if (!cloudStore?.removeVideo) throw new Error('El almacenamiento de vídeos no está disponible.');
  return cloudStore.removeVideo(path);
}

export async function getAll(store) {
  return localGetAll(store);
}

export async function getOne(store, id) {
  return localGetOne(store, id);
}

export async function put(store, value) {
  if (isDemoDatabase()) {
    demoStores[store].set(value.id, structuredClone(value));
    notifyDataChanged(store, 'upsert');
    return value;
  }
  await prepareStorageBindingForWrite();
  const existing = store === 'players' && value?.id ? await localGetOne(store, value.id) : null;
  const genericRecord = mergeLocalRecordForWrite(store, existing, value);
  const recordToStore = store === 'players' && existing
    ? preservePlayerProfileFields(existing, genericRecord)
    : genericRecord;
  const db = await openDatabase();
  const transaction = db.transaction([store, SYNC_QUEUE], 'readwrite');
  transaction.objectStore(store).put(recordToStore);
  transaction.objectStore(SYNC_QUEUE).put(buildMutation(store, 'upsert', recordToStore));
  await transactionDone(transaction);
  // Si estamos online y el servidor rechaza la escritura, no ocultamos el fallo:
  // la mutación queda en syncQueue para reintento y la UI no debe decir "guardado".
  if (canUseCloud()) await flushSyncQueue();
  notifyDataChanged(store, 'upsert');
  return recordToStore;
}

export async function putPlayerProfile(value) {
  if (!value?.id) throw new TypeError('La ficha del jugador necesita un identificador.');
  const recordToStore = { ...structuredClone(value), profileUpdatedAt: Date.now() };
  if (isDemoDatabase()) {
    demoStores.players.set(recordToStore.id, structuredClone(recordToStore));
    notifyDataChanged('players', 'profile-upsert');
    return recordToStore;
  }
  await prepareStorageBindingForWrite();
  const db = await openDatabase();
  const transaction = db.transaction(['players', SYNC_QUEUE], 'readwrite');
  transaction.objectStore('players').put(recordToStore);
  transaction.objectStore(SYNC_QUEUE).put(buildMutation('players', 'upsert', recordToStore));
  await transactionDone(transaction);
  if (canUseCloud()) await flushSyncQueue();
  notifyDataChanged('players', 'profile-upsert');
  return recordToStore;
}

export async function putBatch(recordsByStore) {
  const storeNames = Object.keys(recordsByStore);
  if (!storeNames.length || storeNames.some((store) => !STORES.includes(store))) {
    throw new TypeError('La operación contiene almacenes no válidos.');
  }
  if (isDemoDatabase()) {
    for (const [storeName, records] of Object.entries(recordsByStore)) {
      if (!Array.isArray(records)) throw new TypeError('Cada lote debe ser una lista.');
      for (const record of records) demoStores[storeName].set(record.id, structuredClone(record));
    }
    notifyDataChanged(storeNames, 'batch');
    return;
  }
  await prepareStorageBindingForWrite();
  const normalizedRecordsByStore = {};
  for (const [storeName, records] of Object.entries(recordsByStore)) {
    if (!Array.isArray(records)) throw new TypeError('Cada lote debe ser una lista.');
    if (storeName !== 'players') {
      normalizedRecordsByStore[storeName] = records;
      continue;
    }
    normalizedRecordsByStore[storeName] = await Promise.all(records.map(async (record) => {
      const existing = record?.id ? await localGetOne('players', record.id) : null;
      const merged = mergeLocalRecordForWrite('players', existing, record);
      return existing ? preservePlayerProfileFields(existing, merged) : merged;
    }));
  }

  const db = await openDatabase();
  const transaction = db.transaction([...storeNames, SYNC_QUEUE], 'readwrite');
  for (const [storeName, records] of Object.entries(normalizedRecordsByStore)) {
    for (const record of records) {
      transaction.objectStore(storeName).put(record);
      transaction.objectStore(SYNC_QUEUE).put(buildMutation(storeName, 'upsert', record));
    }
  }
  await transactionDone(transaction);
  if (canUseCloud()) await flushSyncQueue();
  notifyDataChanged(storeNames, 'batch');
}

export async function remove(store, id) {
  if (isDemoDatabase()) {
    demoStores[store].delete(id);
    notifyDataChanged(store, 'delete');
    return;
  }
  await prepareStorageBindingForWrite();
  const db = await openDatabase();
  const transaction = db.transaction([store, SYNC_QUEUE], 'readwrite');
  transaction.objectStore(store).delete(id);
  transaction.objectStore(SYNC_QUEUE).put(buildMutation(store, 'delete', id));
  await transactionDone(transaction);
  if (canUseCloud()) await flushSyncQueue();
  notifyDataChanged(store, 'delete');
}

export async function flushSyncQueue() {
  if (isDemoDatabase()) return false;
  if (!canUseCloud()) return false;
  // Verifica y vincula primero la sesión remota. Es crítico hacerlo ANTES de
  // abrir/leer syncQueue para que una cola de la base legado nunca pueda
  // subirse accidentalmente a una cuenta SaaS recuperada después.
  if (typeof cloudStore?.prepare === 'function') await cloudStore.prepare();
  const mutations = (await localGetAll(SYNC_QUEUE)).sort((a, b) => a.queuedAt - b.queuedAt);
  for (const mutation of mutations) {
    const shouldApply = typeof cloudStore?.shouldApplyMutation === 'function'
      ? await cloudStore.shouldApplyMutation(mutation)
      : true;
    if (!shouldApply) {
      // Supabase ya tiene una versión posterior. La cola local está obsoleta:
      // se elimina sin tocar la fila remota y el snapshot cloud la repondrá localmente.
      await removeQueuedMutation(mutation.id);
      continue;
    }
    if (mutation.operation === 'delete') await cloudStore.remove(mutation);
    else await cloudStore.upsert(mutation);
    await removeQueuedMutation(mutation.id);
  }
  return true;
}

async function replaceLocalStore(store, cloudRecords) {
  const db = await openDatabase();
  const transaction = db.transaction([store, SYNC_QUEUE], 'readwrite');
  const completed = transactionDone(transaction);
  const objectStore = transaction.objectStore(store);
  const [localRecords, pendingMutations] = await Promise.all([
    requestResult(objectStore.getAll()),
    requestResult(transaction.objectStore(SYNC_QUEUE).getAll()),
  ]);
  const reconciledRecords = reconcileCloudSnapshot(store, localRecords, cloudRecords, pendingMutations);
  objectStore.clear();
  for (const record of reconciledRecords) objectStore.put(record);
  await completed;
}

async function queueInitialRecords(store, records) {
  if (!records.length) return;
  const db = await openDatabase();
  const transaction = db.transaction(SYNC_QUEUE, 'readwrite');
  const queue = transaction.objectStore(SYNC_QUEUE);
  for (const record of records) queue.put(buildMutation(store, 'upsert', record));
  await transactionDone(transaction);
}

export async function syncFromCloud() {
  if (isDemoDatabase()) return { online: false, pending: 0, demo: true };
  if (!canUseCloud()) return { online: false, pending: (await localGetAll(SYNC_QUEUE)).length };
  if (syncPromise) return syncPromise;
  syncPromise = (async () => {
    await flushSyncQueue();
    let downloaded = 0;
    for (const store of STORES) {
      const snapshot = await cloudStore.getSnapshot(store);
      const localRecords = await localGetAll(store);
      if (snapshot.rowCount === 0 && localRecords.length) {
        await queueInitialRecords(store, localRecords);
        await flushSyncQueue();
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
          await queueInitialRecords('players', repaired);
          await flushSyncQueue();
        }
      }
      if (store === 'settings') {
        const localMain = localRecords.find(({ id }) => id === 'main');
        const cloudMainIndex = snapshot.records.findIndex(({ id }) => id === 'main');
        if (localMain && cloudMainIndex >= 0) {
          const mergedMain = mergeCloudRecord(store, localMain, snapshot.records[cloudMainIndex]);
          if (JSON.stringify(mergedMain) !== JSON.stringify(snapshot.records[cloudMainIndex])) {
            snapshot.records[cloudMainIndex] = mergedMain;
            await queueInitialRecords(store, [mergedMain]);
            await flushSyncQueue();
          }
        }
      }
      await replaceLocalStore(store, snapshot.records);
      downloaded += snapshot.records.length;
    }
    return { online: true, pending: (await localGetAll(SYNC_QUEUE)).length, downloaded };
  })().finally(() => { syncPromise = null; });
  return syncPromise;
}

async function queueFromDatabaseName(name) {
  const db = await openDatabaseByName(name);
  return requestResult(db.transaction(SYNC_QUEUE, 'readonly').objectStore(SYNC_QUEUE).getAll());
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
  const userId = getBoundSaasUserId();
  if (!userId) throw new Error('Inicia sesión en tu cuenta antes de recuperar cambios locales pendientes.');
  const targetName = userDatabaseName(userId);
  if (targetName === REAL_DB_NAME) return { recovered: 0 };

  const legacyDb = await openDatabaseByName(REAL_DB_NAME);
  const legacyMutations = await requestResult(
    legacyDb.transaction(SYNC_QUEUE, 'readonly').objectStore(SYNC_QUEUE).getAll()
  );
  if (!legacyMutations.length) return { recovered: 0 };

  const targetDb = await openDatabaseByName(targetName);
  const writeTx = targetDb.transaction(SYNC_QUEUE, 'readwrite');
  const targetQueue = writeTx.objectStore(SYNC_QUEUE);
  for (const mutation of legacyMutations) targetQueue.put(structuredClone(mutation));
  await transactionDone(writeTx);

  // Solo limpiamos la cola legado después de que Supabase acepte/rechace de forma
  // segura cada mutación mediante las guardas de versión/stale-write.
  await flushSyncQueue();

  const cleanupTx = legacyDb.transaction(SYNC_QUEUE, 'readwrite');
  const legacyQueue = cleanupTx.objectStore(SYNC_QUEUE);
  for (const mutation of legacyMutations) legacyQueue.delete(mutation.id);
  await transactionDone(cleanupTx);

  return { recovered: legacyMutations.length };
}

export async function exportDatabase() {
  const data = {};
  for (const store of STORES) data[store] = await localGetAll(store);
  return { app: 'CampoBase', version: 1, exportedAt: new Date().toISOString(), data };
}

export async function importDatabase(backup) {
  if (isDemoDatabase()) {
    for (const storeName of STORES) {
      demoStores[storeName].clear();
      for (const record of backup.data[storeName]) demoStores[storeName].set(record.id, structuredClone(record));
    }
    notifyDataChanged(STORES, 'import');
    return;
  }
  const db = await openDatabase();
  const transaction = db.transaction([...STORES, SYNC_QUEUE], 'readwrite');
  for (const storeName of STORES) {
    const store = transaction.objectStore(storeName);
    store.clear();
    for (const record of backup.data[storeName]) {
      store.put(record);
      transaction.objectStore(SYNC_QUEUE).put(buildMutation(storeName, 'upsert', record));
    }
  }
  await transactionDone(transaction);
  await flushSyncQueue().catch(() => false);
  notifyDataChanged(STORES, 'import');
}