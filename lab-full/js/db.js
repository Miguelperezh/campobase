import { buildMutation, mergeCloudRecord, reconcileCloudSnapshot } from './sync-core.js';
import { demoDatabaseName, isDemoSessionActive } from './demo-session.js';

// LABORATORIO FÚTBOLCONTROL: base local independiente y nube desactivada.
// Esta copia nunca lee ni escribe el Supabase real de CampoBase.
const REAL_DB_NAME = 'futbolcontrol-lab-v2';
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
        if (!request.result.objectStoreNames.contains(store)) request.result.createObjectStore(store, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Cierra otras pestañas de FútbolControl Lab para actualizar la base local.'));
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

export function configureCloudStore() {
  // Intencionadamente vacío en el laboratorio: jamás se conecta a Supabase.
  cloudStore = null;
}

export async function uploadVideo() {
  throw new Error('Los vídeos están desactivados en FútbolControl Lab.');
}

export async function removeVideo() {
  throw new Error('Los vídeos están desactivados en FútbolControl Lab.');
}

export async function getAll(store) { return localGetAll(store); }
export async function getOne(store, id) { return localGetOne(store, id); }

export async function put(store, value) {
  if (isDemoDatabase()) {
    demoStores[store].set(value.id, structuredClone(value));
    return value;
  }
  const db = await openDatabase();
  const transaction = db.transaction(store, 'readwrite');
  transaction.objectStore(store).put(value);
  await transactionDone(transaction);
  return value;
}

export async function putBatch(recordsByStore) {
  const storeNames = Object.keys(recordsByStore);
  if (!storeNames.length || storeNames.some((store) => !STORES.includes(store))) throw new TypeError('La operación contiene almacenes no válidos.');
  if (isDemoDatabase()) {
    for (const [storeName, records] of Object.entries(recordsByStore)) {
      if (!Array.isArray(records)) throw new TypeError('Cada lote debe ser una lista.');
      for (const record of records) demoStores[storeName].set(record.id, structuredClone(record));
    }
    return;
  }
  const db = await openDatabase();
  const transaction = db.transaction(storeNames, 'readwrite');
  for (const [storeName, records] of Object.entries(recordsByStore)) {
    if (!Array.isArray(records)) throw new TypeError('Cada lote debe ser una lista.');
    for (const record of records) transaction.objectStore(storeName).put(record);
  }
  await transactionDone(transaction);
}

export async function remove(store, id) {
  if (isDemoDatabase()) {
    demoStores[store].delete(id);
    return;
  }
  const db = await openDatabase();
  const transaction = db.transaction(store, 'readwrite');
  transaction.objectStore(store).delete(id);
  await transactionDone(transaction);
}

export async function flushSyncQueue() { return false; }
export async function syncFromCloud() { return { online: false, pending: 0, lab: true }; }

export async function exportDatabase() {
  const data = {};
  for (const store of STORES) data[store] = await localGetAll(store);
  return { app: 'FútbolControl Lab', version: 2, exportedAt: new Date().toISOString(), data };
}

export async function importDatabase(backup) {
  const db = await openDatabase();
  const transaction = db.transaction(STORES, 'readwrite');
  for (const storeName of STORES) {
    const store = transaction.objectStore(storeName);
    store.clear();
    for (const record of backup.data?.[storeName] ?? []) store.put(record);
  }
  await transactionDone(transaction);
}
