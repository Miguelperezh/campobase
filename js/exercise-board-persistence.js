import { getAll, put, syncFromCloud } from './db.js';

const CATEGORY = 'Mis ejercicios';
const OPEN_AFTER_SAVE_KEY = 'campobase.openMyExercises';
const FRAME_TITLE = 'Creador de ejercicios CampoBase';

function normalizedRecord(exercise, existing = null) {
  const now = Date.now();
  const duration = Number(exercise.duration);
  const reps = Number(exercise.reps);
  const pause = Number(exercise.pause);
  return {
    ...(existing || {}),
    id: exercise.id || crypto.randomUUID(),
    recordType: 'exercise',
    example: false,
    customBoard: true,
    name: String(exercise.name || 'Ejercicio').trim(),
    category: CATEGORY,
    difficulty: String(exercise.intensity || '').trim(),
    players: String(exercise.players || '').trim(),
    duration: Number.isFinite(duration) && duration > 0 ? duration : 0,
    material: String(exercise.material || '').trim(),
    space: 'Pizarra táctica',
    description: String(exercise.description || '').trim(),
    variants: '',
    objective: String(exercise.objective || '').trim(),
    intensity: String(exercise.intensity || '').trim(),
    favorite: Boolean(existing?.favorite),
    boardSaveMode: exercise.saveMode || 'static',
    boardStatic: exercise.staticBoard ?? null,
    boardAnimation: exercise.animatedBoard || null,
    boardPreview: exercise.preview || '',
    boardCoverSourceType: exercise.coverSourceType || 'phase',
    boardCoverPhaseId: exercise.coverPhaseId || '',
    boardCoverPhaseName: exercise.coverPhaseName || '',
    boardCoverFrameProgress: Number(exercise.coverFrameProgress) || 0,
    boardReps: Number.isFinite(reps) && reps > 0 ? reps : 0,
    boardPause: Number.isFinite(pause) && pause >= 0 ? pause : 0,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

async function customExerciseRecords({ sync = false } = {}) {
  if (sync) {
    const result = await syncFromCloud();
    if (result?.online !== true || Number(result?.pending || 0) !== 0) {
      throw new Error('No se ha podido confirmar la sincronización con Supabase.');
    }
  }
  const settings = await getAll('settings');
  return settings.filter((record) => record.recordType === 'exercise' && record.customBoard === true);
}

async function persistExercise(exercise) {
  const settings = await getAll('settings');
  const existing = settings.find((record) => record.id === exercise.id) || null;
  const record = normalizedRecord(exercise, existing);
  await put('settings', record);

  const syncResult = await syncFromCloud();
  if (syncResult?.online !== true || Number(syncResult?.pending || 0) !== 0) {
    throw new Error('El ejercicio no se ha podido confirmar en Supabase. No se cerrará el editor.');
  }

  const verified = (await getAll('settings')).find((item) => item.id === record.id && item.customBoard === true);
  if (!verified) throw new Error('Supabase no devolvió el ejercicio después de guardarlo.');
  return verified;
}

function closeEmbeddedBoard(frame) {
  const overlay = frame?.closest('.exercise-board-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  frame.src = 'about:blank';
}

function activateEmbeddedBoard(doc) {
  if (doc.body.classList.contains('embedded-create') || doc.body.classList.contains('embedded-view')) return;
  if (doc.getElementById('campobase-embedded-runtime-fix')) return;
  const original = [...doc.scripts].reverse().find((script) => (
    script.textContent.includes('new URLSearchParams(location.search)')
    && script.textContent.includes('campobase:exercise-board-ready')
  ));
  if (!original) throw new Error('No se ha encontrado el puente integrado de la pizarra.');
  const patched = doc.createElement('script');
  patched.id = 'campobase-embedded-runtime-fix';
  patched.textContent = original.textContent.replace(
    'new URLSearchParams(location.search)',
    'new URLSearchParams(location.search || location.hash.slice(1))',
  );
  doc.body.append(patched);
}

function patchEmbeddedFrame(frame) {
  if (!frame || frame.dataset.persistencePatched === '1') return;
  frame.dataset.persistencePatched = '1';
  frame.addEventListener('load', () => {
    if (!frame.src || frame.src === 'about:blank') return;
    let doc;
    try { doc = frame.contentDocument; } catch { return; }
    if (!doc) return;

    try { activateEmbeddedBoard(doc); }
    catch (error) { console.error('No se pudo activar la integración de la pizarra:', error); }

    if (!doc.getElementById('campobase-back-fix-style')) {
      const style = doc.createElement('style');
      style.id = 'campobase-back-fix-style';
      style.textContent = `
        #embeddedBack{
          display:inline-flex!important;align-items:center!important;justify-content:center!important;
          min-height:44px!important;padding:.72rem 1rem!important;border:0!important;border-radius:12px!important;
          background:#c8102e!important;color:#fff!important;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;
          font-size:14px!important;line-height:1.15!important;font-weight:700!important;white-space:nowrap!important;
          box-shadow:none!important;position:relative!important;z-index:60!important
        }
        @media(max-width:860px){
          .topbar{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important}
          #embeddedBack{display:inline-flex!important;flex:0 0 auto!important}
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

function replyToBoard(event, payload) {
  try { event.source?.postMessage(payload, '*'); }
  catch (error) { console.warn('No se pudo responder a la pizarra:', error); }
}

async function handlePersistRequest(event, data) {
  const requestId = data.requestId || '';
  try {
    const record = await persistExercise(data.exercise);
    replyToBoard(event, { type: 'campobase:exercise-persisted', requestId, exercise: record });
    if (!data.stayOpen) {
      try { sessionStorage.setItem(OPEN_AFTER_SAVE_KEY, '1'); } catch { /* no bloquea */ }
      setTimeout(() => window.location.reload(), 300);
    }
  } catch (error) {
    console.error('No se pudo persistir el ejercicio:', error);
    replyToBoard(event, { type: 'campobase:exercise-persist-failed', requestId, message: error?.message || String(error) });
    alert(`No se pudo guardar el ejercicio: ${error?.message || error}`);
  }
}

if (typeof window !== 'undefined') window.addEventListener('message', async (event) => {
  const data = event.data || {};
  if ((data.type === 'campobase:persist-exercise' || data.type === 'campobase:exercise-saved') && data.exercise) {
    event.stopImmediatePropagation();
    await handlePersistRequest(event, data);
    return;
  }
  if (data.type === 'campobase:exercise-board-ready' && data.mode === 'create') {
    try {
      const exercises = await customExerciseRecords({ sync: true });
      replyToBoard(event, { type: 'campobase:init-editor', exercises });
    } catch (error) {
      console.error('No se pudieron cargar Mis ejercicios:', error);
      replyToBoard(event, { type: 'campobase:init-editor', exercises: [], error: error?.message || String(error) });
    }
  }
}, true);
