import { buildMutation, mergeCloudRecord } from './sync-core.js';

const DB_NAME = 'campobase';
const DB_VERSION = 2;
export const STORES = ['players', 'callups', 'matches', 'trainings', 'settings'];
const SYNC_QUEUE = 'syncQueue';

let databasePromise;
let cloudStore;
let syncPromise;

export function openDatabase() {
  databasePromise ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
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
  });
  return databasePromise;
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
  const db = await openDatabase();
  return requestResult(db.transaction(store, 'readonly').objectStore(store).getAll());
}

async function localGetOne(store, id) {
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

export async function getAll(store) {
  return localGetAll(store);
}

export async function getOne(store, id) {
  return localGetOne(store, id);
}

export async function put(store, value) {
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
  const db = await openDatabase();
  const transaction = db.transaction([store, SYNC_QUEUE], 'readwrite');
  transaction.objectStore(store).delete(id);
  transaction.objectStore(SYNC_QUEUE).put(buildMutation(store, 'delete', id));
  await transactionDone(transaction);
  await flushSyncQueue().catch(() => false);
}

export async function flushSyncQueue() {
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