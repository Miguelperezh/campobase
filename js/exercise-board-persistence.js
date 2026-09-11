import { getAll, put, syncFromCloud } from './db.js';

const CATEGORY = 'Mis ejercicios';
const OPEN_AFTER_SAVE_KEY = 'campobase.openMyExercises';
const FRAME_TITLE = 'Creador de ejercicios CampoBase';

function normalizedRecord(exercise, existing = null) {
  const now = Date.now();
  return {
    ...(existing || {}),
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
    favorite: Boolean(existing?.favorite),
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
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

async function customExerciseRecords({ sync = false } = {}) {
  if (sync) {
    try { await syncFromCloud(); }
    catch (error) { console.warn('Mis ejercicios: sincronización pendiente:', error?.message || error); }
  }
  const settings = await getAll('settings');
  return settings.filter((record) => record.recordType === 'exercise' && record.customBoard === true);
}

async function persistExercise(exercise) {
  const settings = await getAll('settings');
  const existing = settings.find((record) => record.id === exercise.id) || null;
  const record = normalizedRecord(exercise, existing);
  await put('settings', record);

  try { await syncFromCloud(); }
  catch (error) { console.warn('Ejercicio guardado localmente; sincronización con Supabase pendiente:', error?.message || error); }

  const verified = (await getAll('settings')).find((item) => item.id === record.id && item.customBoard === true);
  if (!verified) throw new Error('CampoBase no pudo verificar el ejercicio guardado.');
  return verified;
}

function closeEmbeddedBoard(frame) {
  const overlay = frame?.closest('.exercise-board-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  frame.src = 'about:blank';
}

function patchEmbeddedFrame(frame) {
  if (!frame || frame.dataset.persistencePatched === '1') return;
  frame.dataset.persistencePatched = '1';
  frame.addEventListener('load', () => {
    if (!frame.src || frame.src === 'about:blank') return;
    let doc;
    try { doc = frame.contentDocument; } catch { return; }
    if (!doc) return;

    if (!doc.getElementById('campobase-back-fix-style')) {
      const style = doc.createElement('style');
      style.id = 'campobase-back-fix-style';
      style.textContent = `
        body.embedded-create #embeddedBack{
          display:inline-flex!important;align-items:center!important;justify-content:center!important;
          background:#c8102e!important;border:1px solid #c8102e!important;color:#fff!important;
          border-radius:999px!important;padding:9px 13px!important;min-height:38px!important;
          font-size:12px!important;font-weight:900!important;white-space:nowrap!important;
          box-shadow:0 4px 12px rgba(200,16,46,.18)!important;position:relative!important;z-index:60!important
        }
        @media(max-width:860px){
          body.embedded-create .topbar{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important}
          body.embedded-create #embeddedBack{display:inline-flex!important;flex:0 0 auto!important}
        }
      `;
      doc.head.append(style);
    }

    const back = doc.getElementById('embeddedBack');
    if (back && back.dataset.campobaseBackFixed !== '1') {
      back.dataset.campobaseBackFixed = '1';
      back.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeEmbeddedBoard(frame);
      }, true);
    }
  });
}

function discoverFrames() {
  document.querySelectorAll(`iframe[title="${FRAME_TITLE}"]`).forEach(patchEmbeddedFrame);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', discoverFrames, { once: true });
  else discoverFrames();
  new MutationObserver(discoverFrames).observe(document.documentElement, { childList: true, subtree: true });
}

window.addEventListener('message', async (event) => {
  const data = event.data || {};

  if (data.type === 'campobase:exercise-saved' && data.exercise) {
    event.stopImmediatePropagation();
    try {
      await persistExercise(data.exercise);
      if (!data.stayOpen) {
        try { sessionStorage.setItem(OPEN_AFTER_SAVE_KEY, '1'); } catch { /* no bloquea */ }
        setTimeout(() => window.location.reload(), 100);
      }
    } catch (error) {
      console.error('No se pudo persistir el ejercicio:', error);
      alert(`No se pudo guardar el ejercicio: ${error?.message || error}`);
    }
    return;
  }

  if (data.type === 'campobase:exercise-board-ready' && data.mode === 'create') {
    try {
      const exercises = await customExerciseRecords({ sync: true });
      event.source?.postMessage({ type: 'campobase:init-editor', exercises }, '*');
    } catch (error) {
      console.error('No se pudieron cargar Mis ejercicios:', error);
    }
  }
}, true);
