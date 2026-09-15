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
  const snapshot = Object.fromEntries(entries);
  const total = Object.values(snapshot).reduce((sum, records) => sum + (Array.isArray(records) ? records.length : 0), 0);
  if (total === 0) throw new Error('Supabase respondió correctamente, pero no devolvió ningún registro de CampoBase.');
  return snapshot;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function snapshotCounts(snapshot) {
  return Object.fromEntries(Object.entries(snapshot || {}).map(([key, rows]) => [key, Array.isArray(rows) ? rows.length : 0]));
}

function countsText(counts = {}) {
  return `jugadores ${counts.players || 0} · convocatorias ${counts.callups || 0} · partidos ${counts.matches || 0} · asistencias ${counts.trainings || 0} · configuración ${counts.settings || 0}`;
}

function showCloudError(error) {
  const message = String(error?.message || error || 'Error desconocido');
  const counts = window.__CAMPO_PREVIEW_COUNTS__ || {};
  const sync = document.querySelector('#campo-sync');
  if (sync) sync.textContent = 'Error de Modo Campo';
  const target = document.querySelector('#hoy-content');
  if (target) {
    target.innerHTML = `<div class="campo-card"><h3>No se pudieron mostrar los datos de CampoBase</h3><p>Modo Campo usa únicamente Supabase. Error: ${escapeHtml(message)}</p><p><strong>Snapshot recibido:</strong> ${escapeHtml(countsText(counts))}</p><div class="campo-card-actions"><button type="button" class="campo-btn primary" onclick="location.reload()">Reintentar</button><a class="campo-btn secondary" href="./index.html">Salir Modo Campo</a></div></div>`;
  }
}

try {
  const snapshot = await loadCloudSnapshot();
  window.__CAMPO_PREVIEW_CLOUD__ = snapshot;
  window.__CAMPO_PREVIEW_COUNTS__ = snapshotCounts(snapshot);
  window.__CAMPO_PREVIEW_SOURCE__ = 'cloud';

  // Verificación explícita del adaptador exclusivo de la prueba antes de arrancar la interfaz.
  const previewDb = await import('./modo-campo-preview-db.js?v=5');
  const probe = await Promise.all(['players', 'callups', 'matches', 'settings'].map((store) => previewDb.getAll(store)));
  if (!probe.some((rows) => rows.length)) {
    throw new Error('El adaptador cloud no pudo leer el snapshot recibido.');
  }

  await import('./modo-campo-preview.js?v=5');
  await import('./modo-campo-preview-enhancements.js?v=5');
  await import('./modo-campo-preview-attendance.js?v=5');

  setTimeout(() => {
    const visibleText = document.querySelector('#hoy-content')?.textContent || '';
    const syncText = document.querySelector('#campo-sync')?.textContent || '';
    if (/datos locales|abre primero campobase normal/i.test(`${visibleText} ${syncText}`)) {
      showCloudError(new Error(`La interfaz cargó una ruta local antigua. Snapshot cloud correcto: ${countsText(window.__CAMPO_PREVIEW_COUNTS__)}`));
    }
  }, 500);
} catch (error) {
  console.error('[Modo Campo] Falló la lectura directa de Supabase.', error);
  window.__CAMPO_PREVIEW_CLOUD_ERROR__ = String(error?.message || error);
  window.__CAMPO_PREVIEW_SOURCE__ = 'cloud-error';
  showCloudError(error);
}
