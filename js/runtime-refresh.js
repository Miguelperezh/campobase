import { syncFromCloud, getAll, put } from './db.js';

const BUTTON_ID = 'manual-refresh';

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

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', installRuntimeRefresh, { once: true });
  else installRuntimeRefresh();
}

const CATEGORY = 'Mis ejercicios';
const OPEN_AFTER_SAVE_KEY = 'campobase.openMyExercises';
let customExercises = new Map();
let overlay;
let frame;
let pendingViewer = null;
let boardObjectUrl = '';
let boardHtmlPromise = null;
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
    .custom-board-preview{overflow:hidden;border-radius:14px;background:#15533a;aspect-ratio:16/10}
    .custom-board-preview svg{width:100%;height:100%;display:block}
    .custom-board-motion-pill{margin-left:.35rem}
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

function patchExerciseCards() {
  const list = document.getElementById('exercises-list');
  if (!list || !customExercises.size) return;
  list.querySelectorAll('.exercise-card').forEach((card) => {
    const idButton = card.querySelector('[data-id], [data-exercise-id]');
    const id = idButton?.dataset.id || idButton?.dataset.exerciseId;
    const record = customExercises.get(id);
    if (!record || card.dataset.customBoardPatched === '1') return;
    card.dataset.customBoardPatched = '1';
    card.querySelector('.edit-exercise')?.remove();
    const details = card.querySelector('.diagram-details');
    if (details && record.boardPreview) {
      details.innerHTML = `<summary>Gráfico tipo pizarra</summary><div class="custom-board-preview">${record.boardPreview}</div>`;
    }
    if (record.boardAnimation?.phases?.length > 1) {
      const head = card.querySelector('.exercise-card-head > div');
      if (head && !head.querySelector('.custom-board-motion-pill')) {
        const pill = document.createElement('span');
        pill.className = 'pill accent custom-board-motion-pill';
        pill.textContent = '▶ Movimiento';
        head.insertBefore(pill, head.querySelector('h3'));
      }
    }
  });
}

function patchSoon() {
  requestAnimationFrame(() => {
    ensureCategoryOption();
    patchExerciseCards();
  });
}

async function openCreator() {
  ensureOverlay();
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  if (boardObjectUrl) URL.revokeObjectURL(boardObjectUrl);
  const boardHtml = await getBoardHtml();
  boardObjectUrl = URL.createObjectURL(new Blob([boardHtml], { type: 'text/html' }));
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

function normalizedRecord(exercise) {
  const now = Date.now();
  return {
    id: exercise.id || crypto.randomUUID(),
    recordType: 'exercise',
    example: false,
    customBoard: true,
    name: String(exercise.name || 'Ejercicio').trim(),
    category: CATEGORY,
    difficulty: exercise.intensity || 'Media',
    players: String(exercise.players || '').trim() || 'Adaptable',
    duration: Math.max(1, Number(exercise.duration) || 10),
    material: String(exercise.material || '').trim() || 'Según pizarra',
    space: 'Pizarra táctica',
    description: String(exercise.description || exercise.objective || '').trim() || 'Ejercicio creado con la pizarra táctica de CampoBase.',
    variants: '',
    objective: String(exercise.objective || '').trim(),
    intensity: exercise.intensity || 'Media',
    favorite: false,
    boardSaveMode: exercise.saveMode || 'static',
    boardStatic: exercise.staticBoard,
    boardAnimation: exercise.animatedBoard || null,
    boardPreview: exercise.preview || '',
    boardCoverSourceType: exercise.coverSourceType || 'phase',
    boardCoverPhaseId: exercise.coverPhaseId || '',
    boardCoverPhaseName: exercise.coverPhaseName || 'Plano fijo',
    boardCoverFrameProgress: Number(exercise.coverFrameProgress) || 0,
    boardReps: Math.max(1, Number(exercise.reps) || 1),
    boardPause: Math.max(0, Number(exercise.pause) || 0),
    createdAt: customExercises.get(exercise.id)?.createdAt ?? now,
    updatedAt: now,
  };
}

async function saveFromBoard(exercise, stayOpen = false) {
  const record = normalizedRecord(exercise);
  await put('settings', { ...customExercises.get(record.id), ...record });
  customExercises.set(record.id, record);
  if (stayOpen) return;
  try { sessionStorage.setItem(OPEN_AFTER_SAVE_KEY, '1'); } catch { /* sin bloqueo */ }
  window.location.reload();
}

function handleBoardMessage(event) {
  if (!frame || event.source !== frame.contentWindow) return;
  const data = event.data || {};
  if (data.type === 'campobase:close-exercise-board') {
    closeOverlay();
    return;
  }
  if (data.type === 'campobase:exercise-board-ready') {
    if (data.mode === 'create') {
      frame.contentWindow.postMessage({ type: 'campobase:init-editor', exercises: [...customExercises.values()] }, '*');
    } else if (data.mode === 'view' && pendingViewer) {
      frame.contentWindow.postMessage({ type: 'campobase:load-exercise', exercise: pendingViewer.record, version: pendingViewer.version }, '*');
    }
    return;
  }
  if (data.type === 'campobase:exercise-saved' && data.exercise) {
    saveFromBoard(data.exercise, Boolean(data.stayOpen)).catch((error) => {
      console.error(error);
      alert(`No se pudo guardar el ejercicio: ${error.message || error}`);
    });
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
  const viewButton = event.target.closest('.view-exercise[data-exercise-id], .session-exercise-link[data-exercise-id]');
  if (viewButton) {
    const record = customExercises.get(viewButton.dataset.exerciseId);
    if (!record) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openViewer(record, 'static').catch((error) => { console.error(error); alert(error.message || 'No se pudo abrir el ejercicio.'); });
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
      patchSoon();
      clearInterval(timer);
    } else if (attempts > 80) clearInterval(timer);
  }, 100);
}

async function install() {
  ensureOverlay();
  await readCustomExercises().catch((error) => console.warn('No se pudieron leer Mis ejercicios:', error.message));
  ensureCategoryOption();
  patchExerciseCards();
  document.addEventListener('click', interceptClicks, true);
  window.addEventListener('message', handleBoardMessage);
  window.addEventListener('campobase:data-changed', async (event) => {
    if (!event.detail?.stores?.includes('settings')) return;
    await readCustomExercises().catch(() => null);
    document.querySelectorAll('.exercise-card[data-custom-board-patched="1"]').forEach((card) => { delete card.dataset.customBoardPatched; });
    patchSoon();
  });
  const filterSelect = document.querySelector('#exercise-filters select[name="category"]');
  if (filterSelect) new MutationObserver(ensureCategoryOption).observe(filterSelect, { childList: true });
  const list = document.getElementById('exercises-list');
  if (list) new MutationObserver(patchSoon).observe(list, { childList: true, subtree: true });
  restoreExercisesViewAfterSave();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
}
