import { buildMutation, mergeCloudRecord } from './sync-core.js';
import { demoDatabaseName, isDemoSessionActive } from './demo-session.js';

const REAL_DB_NAME = 'campobase';
const DB_VERSION = 2;
export const STORES = ['players', 'callups', 'matches', 'trainings', 'settings'];
const SYNC_QUEUE = 'syncQueue';

const databasePromises = new Map();
let activeDatabaseName = REAL_DB_NAME;
let demoSession = null;
let demoStores = null;
let cloudStore;
let syncPromise;

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

export function configureRealDatabase() {
  demoSession = null;
  activeDatabaseName = REAL_DB_NAME;
}

export async function deleteDemoDatabase(session) {
  demoDatabaseName(session);
  if (demoSession?.id === session.id) demoStores = Object.fromEntries(STORES.map((store) => [store, new Map()]));
}

export function openDatabase() {
  const name = activeDatabaseName;
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
    return value;
  }
  const db = await openDatabase();
  const transaction = db.transaction([store, SYNC_QUEUE], 'readwrite');
  transaction.objectStore(store).put(value);
  transaction.objectStore(SYNC_QUEUE).put(buildMutation(store, 'upsert', value));
  await transactionDone(transaction);
  await flushSyncQueue().catch(() => false);
  return value;
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
    return;
  }
  const db = await openDatabase();
  const transaction = db.transaction([...storeNames, SYNC_QUEUE], 'readwrite');
  for (const [storeName, records] of Object.entries(recordsByStore)) {
    if (!Array.isArray(records)) throw new TypeError('Cada lote debe ser una lista.');
    for (const record of records) {
      transaction.objectStore(storeName).put(record);
      transaction.objectStore(SYNC_QUEUE).put(buildMutation(storeName, 'upsert', record));
    }
  }
  await transactionDone(transaction);
  await flushSyncQueue().catch(() => false);
}

export async function remove(store, id) {
  if (isDemoDatabase()) {
    demoStores[store].delete(id);
    return;
  }
  const db = await openDatabase();
  const transaction = db.transaction([store, SYNC_QUEUE], 'readwrite');
  transaction.objectStore(store).delete(id);
  transaction.objectStore(SYNC_QUEUE).put(buildMutation(store, 'delete', id));
  await transactionDone(transaction);
  await flushSyncQueue().catch(() => false);
}

export async function flushSyncQueue() {
  if (isDemoDatabase()) return false;
  if (!canUseCloud()) return false;
  const mutations = (await localGetAll(SYNC_QUEUE)).sort((a, b) => a.queuedAt - b.queuedAt);
  for (const mutation of mutations) {
    if (mutation.operation === 'delete') await cloudStore.remove(mutation);
    else await cloudStore.upsert(mutation);
    await removeQueuedMutation(mutation.id);
  }
  return true;
}

async function replaceLocalStore(store, cloudRecords) {
  const db = await openDatabase();
  const localRecords = await localGetAll(store);
  const localById = new Map(localRecords.map((record) => [record.id, record]));
  const transaction = db.transaction(store, 'readwrite');
  const objectStore = transaction.objectStore(store);
  objectStore.clear();
  for (const record of cloudRecords) {
    objectStore.put(mergeCloudRecord(store, localById.get(record.id), record));
  }
  if (store === 'settings') {
    const localMain = localById.get('main');
    if (localMain && !cloudRecords.some(({ id }) => id === 'main')) objectStore.put(localMain);
  }
  await transactionDone(transaction);
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
}