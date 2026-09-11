import { syncFromCloud, getAll } from './db.js';

const BUTTON_ID = 'manual-refresh';
const CATEGORY = 'Mis ejercicios';
const OPEN_AFTER_SAVE_KEY = 'campobase.openMyExercises';
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let customExercises = new Map();
let overlay;
let frame;
let pendingViewer = null;
let boardObjectUrl = '';
let boardHtmlPromise = null;
let hydrationPromise = null;

function buttonMarkup() {
  const button = document.createElement('button');
  button.id = BUTTON_ID;
  button.type = 'button';
  button.className = 'secondary compact';
  button.textContent = 'Actualizar';
  button.title = 'Sincronizar datos y recargar CampoBase';
  button.setAttribute('aria-label', 'Actualizar y sincronizar datos');
  return button;
}

async function refreshNow(button) {
  if (button) { button.disabled = true; button.textContent = 'Actualizando…'; }
  try { await syncFromCloud().catch(() => null); } finally { window.location.reload(); }
}

export function installRuntimeRefresh() {
  if (document.getElementById(BUTTON_ID)) return;
  const status = document.querySelector('.topbar .status');
  if (!status) return;
  const button = buttonMarkup();
  const logout = document.getElementById('logout');
  status.insertBefore(button, logout ?? null);
  button.addEventListener('click', () => refreshNow(button));
}

async function getBoardHtml() {
  if (!boardHtmlPromise) {
    boardHtmlPromise = (async () => {
      const response = await fetch('./assets/exercise-board.html.gz', { cache: 'no-store' });
      if (!response.ok) throw new Error('No se pudo cargar la pizarra táctica.');
      const bytes = new Uint8Array(await response.arrayBuffer());
      const isGzip = bytes.length > 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
      if (!isGzip) return new TextDecoder().decode(bytes);
      if (typeof DecompressionStream !== 'function') throw new Error('Este navegador no admite el creador de ejercicios integrado.');
      const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
      return new Response(stream).text();
    })().catch((error) => {
      boardHtmlPromise = null;
      throw error;
    });
  }
  return boardHtmlPromise;
}

function ensureOverlay() {
  if (overlay) return overlay;
  const style = document.createElement('style');
  style.textContent = `
    .exercise-board-overlay{position:fixed;inset:0;z-index:1200;background:#f7f5f0;display:none}
    .exercise-board-overlay.open{display:block}
    .exercise-board-overlay iframe{width:100%;height:100%;border:0;background:#f7f5f0;display:block}
    .custom-board-preview{overflow:hidden;border-radius:14px;background:#15533a;aspect-ratio:16/10;margin-top:.65rem}
    .custom-board-preview svg{width:100%;height:100%;display:block}
    .custom-board-motion-pill{margin-left:.35rem}
    .custom-board-card .exercise-highlights{margin-top:.75rem}
    .custom-board-card .custom-board-preview{max-height:360px}
  `;
  document.head.append(style);
  overlay = document.createElement('div');
  overlay.className = 'exercise-board-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  frame = document.createElement('iframe');
  frame.title = 'Creador de ejercicios CampoBase';
  overlay.append(frame);
  document.body.append(overlay);
  return overlay;
}

function closeOverlay() {
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  frame.src = 'about:blank';
  if (boardObjectUrl) { URL.revokeObjectURL(boardObjectUrl); boardObjectUrl = ''; }
  pendingViewer = null;
}

async function readCustomExercises() {
  const settings = await getAll('settings');
  customExercises = new Map(settings
    .filter((record) => record.recordType === 'exercise' && record.customBoard === true)
    .map((record) => [record.id, record]));
  return [...customExercises.values()];
}

function clearPatchedFlags() {
  document.querySelectorAll('.exercise-card[data-custom-board-patched="1"]').forEach((card) => {
    delete card.dataset.customBoardPatched;
  });
}

async function hydrateCustomExercises({ attempts = 1 } = {}) {
  if (hydrationPromise) return hydrationPromise;
  hydrationPromise = (async () => {
    let cloudReady = false;
    for (let attempt = 0; attempt < Math.max(1, attempts); attempt += 1) {
      const result = await syncFromCloud().catch(() => null);
      if (result?.online === true) { cloudReady = true; break; }
      if (attempt < attempts - 1) await delay(150);
    }
    const records = await readCustomExercises();
    clearPatchedFlags();
    patchSoon();
    return { records, cloudReady };
  })().finally(() => { hydrationPromise = null; });
  return hydrationPromise;
}

function ensureCategoryOption() {
  const select = document.querySelector('#exercise-filters select[name="category"]');
  if (!select) return;
  let option = [...select.options].find((item) => item.value === CATEGORY);
  if (!option) {
    option = document.createElement('option');
    option.value = CATEGORY;
    option.textContent = CATEGORY;
  }
  if (select.lastElementChild !== option) select.append(option);
}

function customBoardCardMarkup(record) {
  const hasMovement = Boolean(record.boardAnimation?.phases?.length > 1);
  const highlights = [
    record.players ? `<span class="player-count">👥 ${escapeHtml(record.players)}</span>` : '',
    Number(record.duration) > 0 ? `<span class="pill accent">${Number(record.duration)} min</span>` : '',
    '<span class="meta">Pizarra táctica</span>',
  ].filter(Boolean).join('');
  const metadata = [
    record.material ? `<p><strong>Material:</strong> ${escapeHtml(record.material)}</p>` : '',
    record.intensity ? `<p><strong>Intensidad:</strong> ${escapeHtml(record.intensity)}</p>` : '',
    record.objective ? `<p><strong>Objetivo:</strong> ${escapeHtml(record.objective)}</p>` : '',
    record.description ? `<p>${escapeHtml(record.description)}</p>` : '',
  ].filter(Boolean).join('');
  const preview = record.boardPreview
    ? `<details class="diagram-details" open><summary>Plano de pizarra</summary><div class="custom-board-preview">${record.boardPreview}</div></details>`
    : '';
  const movementButton = hasMovement
    ? `<button type="button" class="view-exercise-motion secondary" data-exercise-id="${escapeHtml(record.id)}">Ver movimiento</button>`
    : '';
  return `
    <div class="exercise-card-head"><div><span class="pill">Mis ejercicios</span>${hasMovement ? '<span class="pill accent custom-board-motion-pill">▶ Movimiento</span>' : ''}<h3>${escapeHtml(record.name || 'Ejercicio')}</h3></div><button type="button" class="favorite-exercise ${record.favorite ? 'active' : ''}" data-id="${escapeHtml(record.id)}" aria-label="${record.favorite ? 'Quitar de' : 'Añadir a'} favoritos">${record.favorite ? '★' : '☆'}</button></div>
    ${highlights ? `<div class="exercise-highlights">${highlights}</div>` : ''}
    ${metadata}
    ${preview}
    <div class="button-row"><button type="button" class="view-exercise secondary" data-exercise-id="${escapeHtml(record.id)}">Ver ejercicio</button>${movementButton}<button type="button" class="add-exercise-to-session primary" data-id="${escapeHtml(record.id)}">Añadir a sesión</button></div>`;
}

function patchExerciseCards() {
  const list = document.getElementById('exercises-list');
  if (!list || !customExercises.size) return;
  list.querySelectorAll('.exercise-card').forEach((card) => {
    const idButton = card.querySelector('[data-id], [data-exercise-id]');
    const id = idButton?.dataset.id || idButton?.dataset.exerciseId;
    const record = customExercises.get(id);
    if (!record || card.dataset.customBoardPatched === '1') return;
    card.dataset.customBoardPatched = '1';
    card.classList.add('custom-board-card');
    card.innerHTML = customBoardCardMarkup(record);
  });
}

function patchSoon() {
  requestAnimationFrame(() => {
    ensureCategoryOption();
    patchExerciseCards();
  });
}

async function openCreator() {
  const { records } = await hydrateCustomExercises({ attempts: 20 });
  ensureOverlay();
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  pendingViewer = null;
  if (boardObjectUrl) URL.revokeObjectURL(boardObjectUrl);
  const boardHtml = await getBoardHtml();
  boardObjectUrl = URL.createObjectURL(new Blob([boardHtml], { type: 'text/html' }));
  frame.dataset.creatorExerciseCount = String(records.length);
  frame.src = `${boardObjectUrl}#embedded=1&mode=create`;
}

async function openViewer(record, version = 'static') {
  ensureOverlay();
  pendingViewer = { record, version };
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  if (boardObjectUrl) URL.revokeObjectURL(boardObjectUrl);
  const boardHtml = await getBoardHtml();
  boardObjectUrl = URL.createObjectURL(new Blob([boardHtml], { type: 'text/html' }));
  frame.src = `${boardObjectUrl}#embedded=1&mode=view`;
}

async function handleBoardMessage(event) {
  if (!frame || event.source !== frame.contentWindow) return;
  const data = event.data || {};
  if (data.type === 'campobase:close-exercise-board') {
    closeOverlay();
    return;
  }
  if (data.type === 'campobase:exercise-board-ready' && data.mode === 'create') {
    const { records } = await hydrateCustomExercises({ attempts: 3 }).catch(() => ({ records: [...customExercises.values()] }));
    frame.contentWindow.postMessage({ type: 'campobase:init-editor', exercises: records }, '*');
    return;
  }
  if (data.type === 'campobase:exercise-board-ready' && data.mode === 'view' && pendingViewer) {
    frame.contentWindow.postMessage({ type: 'campobase:load-exercise', exercise: pendingViewer.record, version: pendingViewer.version }, '*');
  }
}

function interceptClicks(event) {
  const createButton = event.target.closest('#ejercicios .section-head button[data-dialog="exercise-dialog"]');
  if (createButton) {
    event.preventDefault();
    event.stopImmediatePropagation();
    openCreator().catch((error) => { console.error(error); alert(error.message || 'No se pudo abrir el creador.'); });
    return;
  }
  const movementButton = event.target.closest('.view-exercise-motion[data-exercise-id]');
  if (movementButton) {
    const record = customExercises.get(movementButton.dataset.exerciseId);
    if (!record) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openViewer(record, 'movement').catch((error) => { console.error(error); alert(error.message || 'No se pudo abrir el movimiento.'); });
    return;
  }
  const viewButton = event.target.closest('.view-exercise[data-exercise-id], .session-exercise-link[data-exercise-id]');
  if (viewButton) {
    const record = customExercises.get(viewButton.dataset.exerciseId);
    const card = viewButton.closest('.exercise-card');
    const isMyExerciseCard = card?.querySelector('.pill')?.textContent?.trim() === CATEGORY;
    if (!record && !isMyExerciseCard) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const id = viewButton.dataset.exerciseId;
    (record ? Promise.resolve(record) : hydrateCustomExercises({ attempts: 3 }).then(() => customExercises.get(id)))
      .then((loaded) => {
        if (!loaded) throw new Error('No se encontró el ejercicio de pizarra guardado.');
        return openViewer(loaded, 'static');
      })
      .catch((error) => { console.error(error); alert(error.message || 'No se pudo abrir el ejercicio.'); });
  }
}

function restoreExercisesViewAfterSave() {
  let shouldOpen = false;
  try {
    shouldOpen = sessionStorage.getItem(OPEN_AFTER_SAVE_KEY) === '1';
    if (shouldOpen) sessionStorage.removeItem(OPEN_AFTER_SAVE_KEY);
  } catch { /* sin bloqueo */ }
  if (!shouldOpen) return;
  let attempts = 0;
  const timer = setInterval(() => {
    attempts += 1;
    ensureCategoryOption();
    const nav = document.querySelector('.bottom-nav button[data-view="ejercicios"]');
    const select = document.querySelector('#exercise-filters select[name="category"]');
    if (nav && select && [...select.options].some((option) => option.value === CATEGORY)) {
      nav.click();
      select.value = CATEGORY;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      hydrateCustomExercises({ attempts: 3 }).catch(() => patchSoon());
      clearInterval(timer);
    } else if (attempts > 80) clearInterval(timer);
  }, 100);
}

async function install() {
  ensureOverlay();
  ensureCategoryOption();
  document.addEventListener('click', interceptClicks, true);
  window.addEventListener('message', (event) => { handleBoardMessage(event).catch((error) => console.error(error)); });
  window.addEventListener('campobase:data-changed', async (event) => {
    if (!event.detail?.stores?.includes('settings')) return;
    await readCustomExercises().catch(() => null);
    clearPatchedFlags();
    patchSoon();
  });
  const filterSelect = document.querySelector('#exercise-filters select[name="category"]');
  if (filterSelect) new MutationObserver(ensureCategoryOption).observe(filterSelect, { childList: true });
  const list = document.getElementById('exercises-list');
  if (list) new MutationObserver(patchSoon).observe(list, { childList: true, subtree: true });
  restoreExercisesViewAfterSave();
  hydrateCustomExercises({ attempts: 30 }).catch((error) => {
    console.warn('No se pudieron hidratar Mis ejercicios al arrancar:', error.message);
    return readCustomExercises().then(() => patchSoon()).catch(() => null);
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { installRuntimeRefresh(); install(); }, { once: true });
  else { installRuntimeRefresh(); install(); }
}
