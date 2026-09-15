const SUPABASE_URL = 'https://mdzpygfwugawlmknywxa.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_j7duh_i5pNnMZMtT0YT-fg_l76UA_gH';

const TABLES = Object.freeze({
  players: 'jugadores',
  callups: 'convocatorias',
  matches: 'partidos',
  trainings: 'asistencias',
  settings: 'configuracion',
});

function createReadOnlyClient() {
  if (!globalThis.supabase?.createClient) {
    throw new Error('No se ha podido cargar el cliente oficial de Supabase.');
  }
  return globalThis.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    realtime: { params: { eventsPerSecond: 1 } },
  });
}

async function readStore(client, store) {
  const table = TABLES[store];
  const { data, error } = await client
    .from(table)
    .select('id,payload,updated_at,deleted_at');

  if (error) throw new Error(`No se pudo leer ${store}: ${error.message || error.code || 'error desconocido'}`);
  return (Array.isArray(data) ? data : [])
    .filter((row) => !row.deleted_at && row.payload)
    .map((row) => structuredClone(row.payload));
}

async function loadCloudSnapshot() {
  const client = createReadOnlyClient();
  const entries = await Promise.all(
    Object.keys(TABLES).map(async (store) => [store, await readStore(client, store)]),
  );
  return Object.fromEntries(entries);
}

function showCloudError(error) {
  const message = String(error?.message || error || 'Error desconocido');
  const sync = document.querySelector('#campo-sync');
  if (sync) sync.textContent = 'Error al leer datos';
  const target = document.querySelector('#hoy-content');
  if (target) {
    target.innerHTML = `<div class="campo-card"><h3>No se pudieron cargar los datos de CampoBase</h3><p>Modo Campo está configurado para leer directamente desde Supabase y no usa datos locales. Error: ${message.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])}</p><div class="campo-card-actions"><button type="button" class="campo-btn primary" onclick="location.reload()">Reintentar</button><a class="campo-btn secondary" href="./index.html">Salir Modo Campo</a></div></div>`;
  }
}

try {
  const snapshot = await loadCloudSnapshot();
  window.__CAMPO_PREVIEW_CLOUD__ = snapshot;
  window.__CAMPO_PREVIEW_SOURCE__ = 'cloud';

  await import('./modo-campo-preview.js?v=3');
  await import('./modo-campo-preview-enhancements.js?v=3');
  await import('./modo-campo-preview-attendance.js?v=2');
} catch (error) {
  console.error('[Modo Campo] Falló la lectura directa de Supabase.', error);
  window.__CAMPO_PREVIEW_CLOUD_ERROR__ = String(error?.message || error);
  window.__CAMPO_PREVIEW_SOURCE__ = 'cloud-error';
  showCloudError(error);
}
