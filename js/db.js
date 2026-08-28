const DB_NAME = 'campobase';
const DB_VERSION = 1;
export const STORES = ['players', 'callups', 'matches', 'trainings', 'settings'];

let databasePromise;

export function openDatabase() {
  databasePromise ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      for (const store of STORES) {
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

export async function getAll(store) {
  const db = await openDatabase();
  return requestResult(db.transaction(store, 'readonly').objectStore(store).getAll());
}

export async function getOne(store, id) {
  const db = await openDatabase();
  return requestResult(db.transaction(store, 'readonly').objectStore(store).get(id));
}

export async function put(store, value) {
  const db = await openDatabase();
  const transaction = db.transaction(store, 'readwrite');
  transaction.objectStore(store).put(value);
  await transactionDone(transaction);
  return value;
}

export async function putBatch(recordsByStore) {
  const storeNames = Object.keys(recordsByStore);
  if (!storeNames.length || storeNames.some((store) => !STORES.includes(store))) {
    throw new TypeError('La operación contiene almacenes no válidos.');
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
  const db = await openDatabase();
  const transaction = db.transaction(store, 'readwrite');
  transaction.objectStore(store).delete(id);
  await transactionDone(transaction);
}

export async function exportDatabase() {
  const data = {};
  for (const store of STORES) data[store] = await getAll(store);
  return { app: 'CampoBase', version: 1, exportedAt: new Date().toISOString(), data };
}

export async function importDatabase(backup) {
  const db = await openDatabase();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES, 'readwrite');
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error ?? new Error('Importación cancelada.'));
    for (const storeName of STORES) {
      const store = transaction.objectStore(storeName);
      store.clear();
      for (const record of backup.data[storeName]) store.put(record);
    }
  });
}
