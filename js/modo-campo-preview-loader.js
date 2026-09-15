const SUPABASE_URL = 'https://mdzpygfwugawlmknywxa.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_j7duh_i5pNnMZMtT0YT-fg_l76UA_gH';

const TABLES = Object.freeze({
  players: 'jugadores',
  callups: 'convocatorias',
  matches: 'partidos',
  trainings: 'asistencias',
  settings: 'configuracion',
});

async function readStore(store) {
  const table = TABLES[store];
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=id,payload,updated_at,deleted_at`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`No se pudo leer ${store} (${response.status}).`);
  const rows = await response.json();
  return (Array.isArray(rows) ? rows : [])
    .filter((row) => !row.deleted_at && row.payload)
    .map((row) => structuredClone(row.payload));
}

async function loadCloudSnapshot() {
  const entries = await Promise.all(Object.keys(TABLES).map(async (store) => [store, await readStore(store)]));
  return Object.fromEntries(entries);
}

function makeAsyncRequest(result) {
  const request = { result: structuredClone(result), error: null, onsuccess: null, onerror: null };
  setTimeout(() => request.onsuccess?.({ target: request }), 0);
  return request;
}

function installReadOnlyPreviewIndexedDb(snapshot) {
  const factory = globalThis.indexedDB;
  if (!factory?.open) throw new Error('IndexedDB no está disponible en este navegador.');
  const originalOpen = factory.open.bind(factory);

  const fakeDb = {
    transaction(store) {
      const storeName = Array.isArray(store) ? store[0] : store;
      return {
        objectStore(name = storeName) {
          return {
            getAll() {
              return makeAsyncRequest(snapshot[name] || []);
            },
            get(id) {
              const row = (snapshot[name] || []).find((item) => String(item?.id) === String(id));
              return makeAsyncRequest(row || undefined);
            },
          };
        },
      };
    },
  };

  Object.defineProperty(factory, 'open', {
    configurable: true,
    writable: true,
    value(name, version) {
      if (name !== 'campobase') return originalOpen(name, version);
      const request = { result: fakeDb, error: null, onsuccess: null, onerror: null, onblocked: null, onupgradeneeded: null };
      setTimeout(() => request.onsuccess?.({ target: request }), 0);
      return request;
    },
  });
}

try {
  const snapshot = await loadCloudSnapshot();
  window.__CAMPO_PREVIEW_CLOUD__ = snapshot;
  installReadOnlyPreviewIndexedDb(snapshot);
  window.__CAMPO_PREVIEW_SOURCE__ = 'cloud';
} catch (error) {
  console.error('[Modo Campo] Falló la lectura cloud; se intentará la caché local.', error);
  window.__CAMPO_PREVIEW_CLOUD_ERROR__ = String(error?.message || error);
  window.__CAMPO_PREVIEW_SOURCE__ = 'local-fallback';
}

await import('./modo-campo-preview.js?v=2');
await import('./modo-campo-preview-enhancements.js?v=2');
await import('./modo-campo-preview-attendance.js?v=1');
