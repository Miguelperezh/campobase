const STORES = ['players', 'callups', 'matches', 'trainings', 'settings'];

function snapshot() {
  const data = window.__CAMPO_PREVIEW_CLOUD__;
  if (!data) throw new Error('Modo Campo no ha recibido los datos de Supabase.');
  return data;
}

function ensureStore(store) {
  if (!STORES.includes(store)) throw new TypeError(`Almacén no válido en Modo Campo: ${store}`);
}

function clone(value) {
  return value === undefined ? undefined : structuredClone(value);
}

export { STORES };

export function currentDatabaseName() { return 'campobase-cloud-preview'; }
export function isDemoDatabase() { return false; }
export function configureRealDatabase() {}
export function configureDemoDatabase() { throw new Error('Modo Campo aislado no usa base demo.'); }
export async function deleteDemoDatabase() {}
export function configureCloudStore() {}

export async function getAll(store) {
  ensureStore(store);
  return clone(snapshot()[store] || []);
}

export async function getOne(store, id) {
  ensureStore(store);
  const row = (snapshot()[store] || []).find((item) => String(item?.id) === String(id));
  return clone(row);
}

function readOnlyError() {
  throw new Error('Modo Campo está en prueba aislada y es solo lectura.');
}

export async function put() { return readOnlyError(); }
export async function putBatch() { return readOnlyError(); }
export async function remove() { return readOnlyError(); }
export async function uploadVideo() { return readOnlyError(); }
export async function removeVideo() { return readOnlyError(); }
export async function importDatabase() { return readOnlyError(); }
export async function flushSyncQueue() { return false; }
export async function syncFromCloud() { return { online: true, pending: 0, preview: true }; }
export async function openDatabase() { return readOnlyError(); }

export async function exportDatabase() {
  const data = snapshot();
  return {
    app: 'CampoBase · Modo Campo',
    version: 1,
    exportedAt: new Date().toISOString(),
    data: clone(data),
  };
}
