import { keeperGoalAllocation, keeperIdsForMatch } from './keeper-goals.js?v=20261018-offline-match-1';
import { POSTGAME_GOAL_TYPES, postgameGoalType, buildPostgameScoreUpdate } from './postgame-goals.js?v=20261021-save-postmatch-1';
import {assertFormValid, showFormSaveError} from './form-save-feedback.js?v=20261021-save-postmatch-1';
import {editableCallupForMatch} from './postmatch-callup.js?v=20261021-save-postmatch-1';
import {postgameFormat, keeperCandidates, performanceFromSavedPlan} from './postgame-plan.js?v=20261018-offline-match-1';
import { getAll, putBatch, currentDatabaseName } from './db.js';
import {getBoundSaasUserId, getPinAccessRevision} from './auth-manager.js';
import {
  derivePlayerMatchStats,
  isPreseasonMatch,
} from './domain.js';
import { inferSubstitutionPositions, lineupForMatch } from './match-calendar-sync.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const MATCH_TYPE_LABELS = { league: 'Liga', friendly: 'Amistoso', tournament: 'Torneo' };

export function postgameScope(match = {}) {
  return isPreseasonMatch(match) ? 'preseason' : 'league';
}

export function rebaseScopeAdjustments(player, scope, oldDisplayed, newAutomatic) {
  const statAdjustments = structuredClone(player.statAdjustments ?? {});
  const current = { ...(statAdjustments[scope] ?? {}) };
  if (Number.isFinite(current.minutes)) {
    const difference = Math.round(Number(oldDisplayed.minutes ?? 0) - Number(newAutomatic.minutes ?? 0));
    if (difference === 0) delete current.minutes;
    else current.minutes = difference;
  }
  if (Number.isFinite(current.averageRating)) {
    const oldTarget = Number(oldDisplayed.averageRating ?? 0);
    const newBase = Number(newAutomatic.averageRating ?? 0);
    const difference = Number((oldTarget - newBase).toFixed(1));
    if (difference === 0) delete current.averageRating;
    else current.averageRating = difference;
  }
  if (Object.keys(current).length) statAdjustments[scope] = current;
  else delete statAdjustments[scope];
  return Object.keys(statAdjustments).length ? statAdjustments : undefined;
}

export function buildPostgameMatchUpdate(match, entries, matchComment = '', duration = 70, playersOnField = 7) {
  if (!match || typeof match !== 'object') throw new TypeError('El partido no es válido.');
  if (!Array.isArray(entries)) throw new TypeError('Los jugadores del partido deben ser una lista.');
  const minuteTotals = { ...(match.minuteTotals ?? {}) };
  const ratings = { ...(match.ratings ?? {}) };
  const playerComments = { ...(match.playerComments ?? {}) };
  let totalPlayerMinutes = 0;
  for (const entry of entries) {
    const playerId = String(entry.playerId ?? '').trim();
    if (!playerId) throw new TypeError('Falta el jugador en una fila del partido.');
    const minutes = Number(entry.minutes);
    if (!Number.isFinite(minutes) || minutes < 0 || minutes > duration || !Number.isInteger(minutes)) {
      throw new RangeError(`Los minutos deben ser enteros entre 0 y ${duration}.`);
    }
    minuteTotals[playerId] = minutes * 60;
    totalPlayerMinutes += minutes;
    if (entry.rating === '' || entry.rating === null || entry.rating === undefined) delete ratings[playerId];
    else {
      const rating = Number(entry.rating);
      if (![1, 2, 3, 4, 5].includes(rating)) throw new RangeError('La puntuación debe estar entre 1 y 5.');
      ratings[playerId] = rating;
    }
    const comment = String(entry.comment ?? '').trim();
    if (comment) playerComments[playerId] = comment;
    else delete playerComments[playerId];
  }
  const maximumPlayerMinutes = duration * playersOnField;
  if (totalPlayerMinutes > maximumPlayerMinutes) {
    throw new RangeError(`La suma de minutos no puede superar ${maximumPlayerMinutes} (${duration} min × ${playersOnField} jugadores en campo).`);
  }
  return {
    ...match,
    minuteTotals,
    ratings,
    playerComments,
    comments: String(matchComment ?? '').trim(),
    status: 'finished',
    updatedAt: Date.now(),
  };
}

const canEdit=()=>['owner','demo'].includes(window.__campobase?.state?.role);
function assertEditorContext(context, openedDatabase) {
  if (!context || context.database !== currentDatabaseName() || (openedDatabase && context.database !== openedDatabase)
    || context.userId !== getBoundSaasUserId() || context.revision !== getPinAccessRevision() || !canEdit()) {
    throw new Error('La cuenta ha cambiado. Vuelve a abrir el partido.');
  }
}
const preparation=(settings,id)=>settings.find(p=>p.recordType==='preparacion'&&String(p.matchId)===String(id));
function participantIds(match, callup) {
  return [...new Set([
    ...(callup?.availableIds ?? []),
    ...Object.keys(match.minuteTotals ?? {}),
    ...Object.keys(match.ratings ?? {}),
    ...Object.keys(match.playerComments ?? {}),
    ...keeperIdsForMatch(match),
    ...(match.goals ?? []).flatMap(goal => [goal.playerId, goal.assistantId]).filter(id => id && id !== '__pp__'),
    ...(match.lineupSnapshot ?? []).map((slot) => slot?.playerId).filter(Boolean),
    ...(match.substitutionEvents ?? []).flatMap((event) => [...(event.outIds ?? []), ...(event.inIds ?? [])]),
  ])];
}

function ensureDialog() {
  let dialog = $('#postgame-performance-dialog');
  if (dialog) return dialog;
  dialog = document.createElement('dialog');
  dialog.id = 'postgame-performance-dialog';
  dialog.innerHTML = `<form id="postgame-performance-form" novalidate>
    <div class="dialog-head"><h2 id="postgame-performance-title">Partido · jugadores</h2><button type="button" data-close-postgame aria-label="Cerrar">×</button></div>
    <p class="meta">Si no pudiste llevar el cronómetro durante el partido, completa aquí los minutos reales. Al guardar se sincronizan el partido, Plantilla, Liga/Pretemporada, medias, temporadas e historiales.</p>
    <label>Comentario general del partido<textarea id="postgame-match-comment" maxlength="1500" placeholder="Lectura general, contexto, sensaciones, aspectos para revisar después"></textarea></label>
    <section id="postgame-plan-editor" class="postgame-section"></section>
    <section id="postgame-score-editor" class="postgame-section"></section>
    <div id="postgame-performance-players" class="stack"></div>
    <div class="button-row"><button class="primary" type="submit">Guardar y sincronizar todo</button><button type="button" class="secondary" data-close-postgame>Cancelar</button></div>
  </form>`;
  document.body.appendChild(dialog);
  dialog.querySelectorAll('[data-close-postgame]').forEach((button) => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', (event) => {
    if (event.target.closest('[data-use-saved-plan]')) applySavedPlan(dialog);
    if (event.target.closest('[data-add-postgame-goal]')) addGoalRow(dialog, {});
    if (event.target.closest('[data-remove-postgame-goal]')) event.target.closest('.postgame-goal-row').remove();
    updateScoreHint(dialog);
  });
  dialog.addEventListener('input', () => updateScoreHint(dialog));
  dialog.querySelector('form').addEventListener('submit', (event) => {
    const editorToken=dialog.__editorToken;
    savePostgame(event).catch(error=>{if(dialog.__editorToken===editorToken)showDialogError(error);});
  });
  return dialog;
}

function scoreBaseline(match) {
  return JSON.stringify([match.minuteTotals,match.ratings,match.playerComments,match.comments,match.goalsFor,match.goalsAgainst,match.goals,match.keeperGoalsAgainst,match.lineupSnapshot,match.substitutionEvents,match.tacticEvents,match.status,match.completed,match.closedAt]);
}
function playerOptions(players, selected, emptyLabel = 'Sin asistencia') {
  const options = [...players];
  if (selected && selected !== '__pp__' && !options.some(p => p.id === selected)) options.push({id:selected,name:'Jugador del registro original'});
  return `<option value="">${emptyLabel}</option>${options.map(p => `<option value="${esc(p.id)}" ${p.id === selected ? 'selected' : ''}>${esc(p.number ? `${p.number} · ${p.name}` : p.name)}</option>`).join('')}`;
}
function addGoalRow(dialog, goal) {
  const row = document.createElement('fieldset');
  row.className = 'panel postgame-goal-row';
  row.dataset.goalId = goal.id || crypto.randomUUID();
  row.__goal = structuredClone(goal);
  row.innerHTML = `<legend>Gol a favor</legend><div class="postgame-player-grid">
    <label>Goleador<select data-goal="player">${playerOptions(dialog.__goalPlayers,goal.playerId,'Elige goleador')}<option value="__pp__" ${goal.playerId === '__pp__' ? 'selected' : ''}>Autogol del rival</option></select></label>
    <label>Asistencia<select data-goal="assistant">${playerOptions(dialog.__goalPlayers,goal.assistantId || goal.assistId)}</select></label>
    <label>Tipo de gol<select data-goal="type">${Object.entries(POSTGAME_GOAL_TYPES).map(([value,label]) => `<option value="${value}" ${postgameGoalType(goal) === value ? 'selected' : ''}>${label}</option>`).join('')}</select></label>
    <label>Minuto<input data-goal="minute" type="number" min="0" max="${dialog.dataset.duration}" step="any" value="${Number(goal.second || 0)/60}"></label>
    <label>Nota<input data-goal="note" value="${esc(goal.note || '')}" maxlength="800"></label>
    <button type="button" class="secondary" data-remove-postgame-goal>Quitar este gol</button></div>`;
  $('#postgame-goal-list',dialog).appendChild(row);
}
function setupScoreEditor(dialog, match, players, available, callup, prep) {
  dialog.__postgameBaseline = scoreBaseline(match);
  dialog.__goalPlayers = available;
  const keeperIds = [...new Set([...keeperIdsForMatch(match,players),...keeperCandidates(match,players,callup,prep)])];
  const allocation = match.goalsAgainst == null ? {assigned:match.keeperGoalsAgainst ?? {}} : keeperGoalAllocation(match,players,keeperIds);
  $('#postgame-score-editor',dialog).innerHTML = `<h3>Marcador y goles</h3><div class="postgame-player-grid">
    <label>Goles a favor<input id="postgame-goals-for" type="number" min="0" step="1" placeholder="Pendiente" value="${match.goalsFor ?? ''}"></label>
    <label>Goles en contra<input id="postgame-goals-against" type="number" min="0" step="1" placeholder="Pendiente" value="${match.goalsAgainst ?? ''}"></label>
    </div><p>Puedes guardar minutos, puntuaciones y comentarios con el marcador pendiente. En blanco no significa cero. Asigna cada gol a su goleador y, si corresponde, a quien dio la asistencia.</p>
    <div id="postgame-goal-list" class="stack"></div><button type="button" class="secondary" data-add-postgame-goal>+ Añadir gol y asistencia</button>
    <h3>Goles encajados por portero</h3><p>El total debe coincidir con los goles en contra. En blanco significa pendiente de asignar; no se reparte automáticamente entre dos porteros.</p>
    <div class="postgame-player-grid">${keeperIds.map(id => { const player=players.find(p=>p.id===id); return `<label>${esc(player ? `${player.number || ''} · ${player.name}` : 'Portero del registro original')}<input data-keeper-conceded="${esc(id)}" type="number" min="0" step="1" placeholder="Sin asignar" value="${allocation.assigned[id] ?? ''}"></label>`; }).join('')}</div>
    ${keeperIds.length ? '' : '<p>No hay porteros identificados en este partido. Marca la posición Portero en su ficha y asígnale sus minutos.</p>'}
    <p id="postgame-score-hint" role="status"></p>`;
  for (const goal of match.goals ?? []) addGoalRow(dialog,goal);
  updateScoreHint(dialog);
}
function updateScoreHint(dialog) {
  const hint = $('#postgame-score-hint',dialog);
  if (!hint) return;
  const goalCount = $$('.postgame-goal-row',dialog).length;
  const gf = $('#postgame-goals-for',dialog).value;
  const ga = $('#postgame-goals-against',dialog).value;
  const assigned = $$('[data-keeper-conceded]',dialog).reduce((sum,input) => sum + Number(input.value || 0),0);
  hint.textContent = `${goalCount} goles con goleador · Goles a favor: ${gf === '' ? 'pendiente' : gf} · ${assigned} goles asignados a porteros · Goles en contra: ${ga === '' ? 'pendiente' : ga}${ga === '' || Number(ga) !== assigned ? ' · Reparto pendiente' : ''}.`;
}

function rowMarkup(player, match, duration) {
  const playerId = player.id;
  const minutes = Number.isFinite(match.minuteTotals?.[playerId]) ? Math.max(0, Math.round(match.minuteTotals[playerId] / 60)) : 0;
  const rating = Number.isFinite(match.ratings?.[playerId]) ? Number(match.ratings[playerId]) : '';
  const comment = String(match.playerComments?.[playerId] ?? '');
  return `<fieldset class="postgame-section postgame-player-row" data-player-id="${esc(playerId)}">
    <legend>${esc(player.number ? `${player.number} · ${player.name}` : player.name)}</legend>
    <div class="postgame-player-grid">
      <label>Minutos<input data-postgame="minutes" type="number" min="0" max="${duration}" step="1" value="${minutes}" required></label>
      <label>Puntuación 1–5<select data-postgame="rating"><option value="">Sin puntuación</option>${[1,2,3,4,5].map((value) => `<option value="${value}" ${rating === value ? 'selected' : ''}>${value}/5</option>`).join('')}</select></label>
      <label class="postgame-comment">Comentario del jugador<textarea data-postgame="comment" maxlength="800" placeholder="Opcional: qué hizo, dónde sufrió, qué mejoró, comportamiento táctico…">${esc(comment)}</textarea></label>
    </div>
  </fieldset>`;
}

async function openPostgame(matchId) {
  if(!canEdit())throw new Error('Solo el entrenador puede completar el postpartido.');
  const context={database:currentDatabaseName(),userId:getBoundSaasUserId(),revision:getPinAccessRevision()};
  const [matches, players, callups, settings] = await Promise.all(['matches', 'players', 'callups', 'settings'].map(getAll));
  assertEditorContext(context);
  const match = matches.find((item) => String(item.id) === String(matchId));
  if (!match) throw new TypeError('No se encontró el partido.');
  const prep=preparation(settings,match.id);
  const callup = editableCallupForMatch(match,matches,callups);
  const ids = [...new Set([...participantIds(match, callup),...keeperCandidates(match,players,callup,prep)])];
  const byId = new Map(players.map((player) => [player.id, player]));
  const available = ids.map((id) => byId.get(id) || {id,name:'Jugador del registro original'})
    .sort((a, b) => Number(a.number ?? 999) - Number(b.number ?? 999) || String(a.name).localeCompare(String(b.name), 'es'));
  if (!available.length) throw new TypeError('El partido no tiene jugadores vinculados.');
  const {duration,playersOnField}=postgameFormat(match,callup,prep);
  const dialog = ensureDialog();
  dialog.dataset.matchId = match.id;
  dialog.dataset.duration = String(duration);
  dialog.dataset.playersOnField = String(playersOnField);
  $('#postgame-performance-title', dialog).textContent = `${MATCH_TYPE_LABELS[match.type] ?? 'Partido'} · ${match.opponent || 'Rival'} · minutos, puntuación y goles`;
  $('#postgame-match-comment', dialog).value = match.comments ?? '';
  dialog.__database=context.database;dialog.__accessContext=context;dialog.__editorToken={};dialog.__saving=false;dialog.__plan=prep;dialog.__callup=callup;dialog.__planApplied=null;dialog.__planBaseline=JSON.stringify(prep || null);dialog.__callupBaseline=JSON.stringify(callup || null);
  $('[type=submit]',dialog).disabled=false;
  let planError='';try{dialog.__planPerformance=performanceFromSavedPlan(match,callup,prep);}catch(error){dialog.__planPerformance=null;planError=error.message;}
  $('#postgame-plan-editor',dialog).innerHTML=`<h3>¿Seguiste tu plan de partido?</h3><p>Carga sus minutos sin iniciar el cronómetro. Puedes revisarlos y corregirlos antes de guardar.</p><button type="button" class="secondary" data-use-saved-plan ${dialog.__planPerformance ? '' : 'disabled'}>He seguido el plan · cargar minutos</button><p data-plan-status role="status">${esc(planError || `${duration} min · ${callup.availableIds.length} convocados · plan guardado disponible`)}</p>`;
  setupScoreEditor(dialog, match, players, available, callup, prep);
  $('#postgame-performance-players', dialog).innerHTML = available.map((player) => rowMarkup(player, match, duration)).join('');
  $('.postgame-performance-error', dialog)?.remove();
  $('#match-detail-dialog')?.close();
  dialog.showModal();
}

function showDialogError(error) {
  const dialog = $('#postgame-performance-dialog');
  if (!dialog?.open) {window.__campobase?.toast?.(error.message || 'No se pudo abrir el partido.');return;}
  showFormSaveError($('form',dialog),error);
  $('[data-save-error]',dialog).classList.add('postgame-performance-error','postgame-section');
}

function applySavedPlan(dialog) {
  if(!dialog.__planPerformance)return;
  const rows=$$('.postgame-player-row',dialog);
  if(rows.some(row=>Number($('[data-postgame="minutes"]',row).value)>0)&&!window.confirm('¿Sustituir los minutos de este formulario por los del plan guardado? Se usarán también sus alineaciones y movimientos. Tus goles, puntuaciones y comentarios se conservan.'))return;
  rows.forEach(row=>$('[data-postgame="minutes"]',row).value=(dialog.__planPerformance.minuteTotals[row.dataset.playerId] || 0)/60);
  dialog.__planApplied=true;
  $('[data-plan-status]',dialog).textContent='Minutos del plan cargados. Revisa los jugadores y el marcador; aún no se ha guardado nada.';
}

async function savePostgame(event) {
  event.preventDefault();
  assertFormValid(event.currentTarget);
  const dialog = event.currentTarget.closest('dialog');
  if(dialog.__saving)return;
  const matchId = dialog.dataset.matchId, accessContext = dialog.__accessContext, editorToken = dialog.__editorToken;
  const assertDraft = (openedDatabase) => {
    assertEditorContext(accessContext,openedDatabase);
    if (!dialog.open || dialog.__editorToken !== editorToken || dialog.dataset.matchId !== matchId) {
      throw new Error('El formulario del partido ha cambiado. El borrador anterior no se ha guardado.');
    }
  };
  if(!canEdit())throw new Error('Solo el entrenador puede guardar el postpartido.');
  assertDraft();
  dialog.__saving=true;const submit=$('[type=submit]',dialog);submit.disabled=true;
  try {
  const duration = Number(dialog.dataset.duration) || 70;
  const playersOnField = Number(dialog.dataset.playersOnField) || 7;
  const [players, matches, callups, settings] = await Promise.all(['players', 'matches', 'callups', 'settings'].map(getAll));
  assertDraft();
  const match = matches.find((item) => String(item.id) === matchId);
  if (!match) throw new TypeError('No se encontró el partido.');
  const entries = $$('.postgame-player-row', dialog).map((row) => ({
    playerId: row.dataset.playerId,
    minutes: Number($('[data-postgame="minutes"]', row).value),
    rating: $('[data-postgame="rating"]', row).value,
    comment: $('[data-postgame="comment"]', row).value,
  }));
  if (dialog.__postgameBaseline !== scoreBaseline(match)) throw new Error('Este partido ha cambiado en otro dispositivo. Cierra y vuelve a abrir para editar la última versión. Tus cambios no se han sobrescrito.');
  const performance = buildPostgameMatchUpdate(match, entries, $('#postgame-match-comment', dialog).value, duration, playersOnField);
  const draft = { goalsFor: $('#postgame-goals-for', dialog).value, goalsAgainst: $('#postgame-goals-against', dialog).value,
    goals: $$('.postgame-goal-row', dialog).map(row => ({original: row.__goal, id: row.dataset.goalId,
      playerId: $('[data-goal=player]', row).value, assistantId: $('[data-goal=assistant]', row).value,
      goalType: $('[data-goal=type]', row).value, minute: $('[data-goal=minute]', row).value, note: $('[data-goal=note]', row).value})),
    keeperGoalsAgainst: Object.fromEntries($$('[data-keeper-conceded]', dialog).map(input => [input.dataset.keeperConceded,input.value])) };
  let updatedMatch = buildPostgameScoreUpdate(performance, draft, duration);
  const currentCallup=editableCallupForMatch(match,matches,callups);
  if(dialog.__planApplied){
    const currentPlan=preparation(settings,match.id);
    if(JSON.stringify(currentPlan || null)!==dialog.__planBaseline || JSON.stringify(currentCallup || null)!==dialog.__callupBaseline)throw new Error('El plan o la convocatoria han cambiado. Conserva tu borrador y vuelve a abrir el partido antes de aplicar el plan.');
    const exact=entries.every(entry=>updatedMatch.minuteTotals[entry.playerId]===(dialog.__planPerformance.minuteTotals[entry.playerId] || 0));
    if(exact)updatedMatch={...updatedMatch,...dialog.__planPerformance};
    updatedMatch.minuteSource={kind:exact?'saved-plan':'adjusted-plan',prepId:dialog.__plan.id,recordedAt:Date.now()};
  }
  updatedMatch={...updatedMatch,completed:true,closedAt:match.closedAt || Date.now(),finishedAt:match.finishedAt || Date.now()};
  const updatedMatches = matches.map((item) => item.id === match.id ? updatedMatch : item);
  const affectedIds = new Set([...entries.map(entry => entry.playerId), ...[...(match.goals ?? []), ...updatedMatch.goals].flatMap(goal => [goal.playerId,goal.assistantId])]);
  const updatedPlayers = players.filter((player) => affectedIds.has(player.id)).map((player) => {
    // Existing statAdjustments remain a delta; an edit must not freeze old totals.
    const derived = derivePlayerMatchStats(player.id, updatedMatches);
    const next = { ...player, ...derived };
    return next;
  });
  const batch={matches:[updatedMatch],players:updatedPlayers,callups:currentCallup ? [{...currentCallup,completed:true,closedAt:currentCallup.closedAt || Date.now(),updatedAt:Date.now()}] : []};
  const live=settings.find(s=>s.id==='live');
  if(String(live?.timer?.matchId)===String(match.id))batch.settings=[{...live,timer:null,updatedAt:Date.now()}];
  if(dialog.__database!==currentDatabaseName() || !canEdit())throw new Error('La cuenta ha cambiado. Vuelve a abrir el partido.');
  await putBatch(batch,{assertContext:assertDraft});
  window.__campobase?.clearLiveForCompletedMatch?.(match.id);
  if (dialog.__editorToken === editorToken) dialog.close();
  if (typeof window.__campobase?.refresh === 'function') {
    await window.__campobase.refresh(true);
  }
  if (typeof window.__campobase?.renderAll === 'function') {
    window.__campobase.renderAll();
  }
  const sync = await window.__campobase?.synchronizeCloud?.().catch(() => null);
  const toastEl = document.getElementById('toast');
  if (toastEl) {
    toastEl.textContent = sync?.online && sync.pending === 0 ? 'Partido guardado y confirmado en la nube.' : 'Partido guardado en este dispositivo. Sincronización pendiente; no cierres la app hasta confirmarla.';
    toastEl.classList.remove('hidden');
    setTimeout(() => toastEl.classList.add('hidden'), 3000);
  }
  } finally {if(dialog.__editorToken === editorToken){dialog.__saving=false;submit.disabled=false;}}
}

function minuteText(second) {
  if (!Number.isFinite(Number(second))) return '—';
  return `${Math.max(0, Math.round(Number(second) / 60))}'`;
}

function matchContextForPlayer(match, playerId, settings) {
  const lineup = lineupForMatch(match, settings);
  const initial = lineup.find((slot) => slot.playerId === playerId);
  const events = inferSubstitutionPositions(match.substitutionEvents ?? [], lineup);
  const changes = [];
  const positions = new Set();
  if (initial?.pos) positions.add(initial.pos);
  for (const event of events) {
    const outIndex = (event.outIds ?? []).indexOf(playerId);
    if (outIndex >= 0) {
      const pos = event.outPositions?.[outIndex] ?? '';
      if (pos) positions.add(pos);
      changes.push(`Sale ${minuteText(event.second)}${pos ? ` · ${pos}` : ''}`);
    }
    const inIndex = (event.inIds ?? []).indexOf(playerId);
    if (inIndex >= 0) {
      const pos = event.inPositions?.[inIndex] ?? '';
      if (pos) positions.add(pos);
      changes.push(`Entra ${minuteText(event.second)}${pos ? ` · ${pos}` : ''}`);
    }
  }
  return { initialPosition: initial?.pos ?? '', positions: [...positions], changes };
}

function localDate(value) {
  if (!value) return '';
  const hasTime = String(value).includes('T');
  return new Intl.DateTimeFormat('es-ES', hasTime
    ? { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }
    : { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(hasTime ? value : `${value}T12:00:00`));
}

function historyMarkup(playerId, matches, settings) {
  const rows = matches.filter((match) => match.status === 'finished').map((match) => {
    const context = matchContextForPlayer(match, playerId, settings);
    const minutes = Number.isFinite(match.minuteTotals?.[playerId]) ? Math.round(match.minuteTotals[playerId] / 60) : null;
    const rating = Number.isFinite(match.ratings?.[playerId]) ? match.ratings[playerId] : null;
    const comment = String(match.playerComments?.[playerId] ?? '').trim();
    const participated = Number(minutes) > 0 || rating !== null || comment || context.initialPosition || context.changes.length;
    if (!participated) return '';
    const positionText = context.positions.length ? context.positions.join(', ') : '—';
    return `<li class="postgame-history-row"><strong>${esc(localDate(match.date))} · ${esc(MATCH_TYPE_LABELS[match.type] ?? match.type ?? 'Partido')} · ${esc(match.opponent || 'Rival')}</strong><span>${minutes ?? '—'} min · ${rating ?? '—'}/5 · Posición/es: ${esc(positionText)}</span>${context.changes.length ? `<span>Cambios: ${esc(context.changes.join(' · '))}</span>` : ''}${comment ? `<span>Comentario: ${esc(comment)}</span>` : ''}</li>`;
  }).filter(Boolean).join('');
  return rows ? `<details class="postgame-player-history"><summary>Partidos: posiciones, cambios y comentarios</summary><ul class="plain-list">${rows}</ul></details>` : '';
}

let historyRunning = false;
async function patchPlayerHistories() {
  const root = $('#players-list');
  if (!root || historyRunning) return;
  historyRunning = true;
  try {
    const [matches, settings] = await Promise.all(['matches', 'settings'].map(getAll));
    for (const card of $$('.card.player', root)) {
      const playerId = $('.edit-player', card)?.dataset.id;
      const performance = $('.player-performance', card);
      if (!playerId || !performance) continue;
      $('.postgame-player-history', performance)?.remove();
      const markup = historyMarkup(playerId, matches, settings);
      if (markup) performance.insertAdjacentHTML('beforeend', markup);
    }
  } finally {
    historyRunning = false;
  }
}

async function patchMatchComments(matchId) {
  const body = $('#match-detail-body');
  if (!body || !matchId || $('.postgame-comments-detail', body)) return;
  const [matches, players] = await Promise.all(['matches', 'players'].map(getAll));
  const match = matches.find((item) => item.id === matchId);
  if (!match) return;
  const byId = new Map(players.map((player) => [player.id, player]));
  const playerRows = Object.entries(match.playerComments ?? {}).filter(([, comment]) => String(comment).trim()).map(([playerId, comment]) => `<li><strong>${esc(byId.get(playerId)?.name ?? 'Jugador eliminado')}:</strong> ${esc(comment)}</li>`).join('');
  if (!match.comments && !playerRows) return;
  body.insertAdjacentHTML('beforeend', `<section class="panel postgame-comments-detail"><h4>Comentarios del partido</h4>${match.comments ? `<p>${esc(match.comments)}</p>` : ''}${playerRows ? `<ul class="plain-list">${playerRows}</ul>` : ''}</section>`);
}

function patchButtons() {
  $$('.edit-match-performance, .rate-match').forEach((button) => {
    button.textContent = 'Editar goles, puntuaciones y minutos';
    button.title = 'Editar marcador, goleadores, asistencias, tipos de gol, goles encajados, minutos y puntuaciones';
  });
}

function injectStyles() {
  if ($('#postgame-editor-style')) return;
  const style = document.createElement('style');
  style.id = 'postgame-editor-style';
  style.textContent = `
    #postgame-performance-dialog .postgame-section{border:1px solid var(--cb-slate-200,#e2e8f0);border-radius:16px;padding:1rem;margin:.8rem 0;color:inherit}#postgame-performance-dialog form{min-width:0}#postgame-performance-dialog select,#postgame-performance-dialog input{width:100%;min-width:0}#postgame-performance-dialog{overflow:auto;width:min(980px,94vw);max-height:92vh}.postgame-player-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.7rem;align-items:start}.postgame-comment textarea{min-height:76px;resize:vertical}.postgame-history-row{display:grid;gap:.2rem;padding:.55rem 0;border-bottom:1px solid #e5ebe8}.postgame-history-row:last-child{border-bottom:0}.postgame-history-row span{font-size:.82rem;color:#5c6963}.postgame-player-history{margin-top:.65rem}.postgame-comments-detail{margin-top:.8rem}
    @media(max-width:720px){.postgame-player-grid{grid-template-columns:1fr 1fr}.postgame-comment{grid-column:1/-1}}
    @media(max-width:480px){.postgame-player-grid{grid-template-columns:1fr}.postgame-comment{grid-column:auto}}
  `;
  document.head.appendChild(style);
}

function bind() {
  if (document.documentElement.dataset.postgameEditorBound === '1') return;
  document.documentElement.dataset.postgameEditorBound = '1';
  injectStyles();
  patchButtons();
  patchPlayerHistories().catch(console.warn);
  document.addEventListener('click', (event) => {
    const edit = event.target.closest('.edit-match-performance, .rate-match, .record-match-postgame');
    if (edit?.dataset.id) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      openPostgame(edit.dataset.id).catch(showDialogError);
      return;
    }
    const detail = event.target.closest('.match-detail');
    if (detail?.dataset.id) window.setTimeout(() => patchMatchComments(detail.dataset.id).catch(console.warn), 100);
  }, true);
  const rootObserver = new MutationObserver(() => {
    patchButtons();
    patchPlayerHistories().catch(console.warn);
  });
  const matches = $('#matches-list');
  const players = $('#players-list');
  if (matches) rootObserver.observe(matches, { childList: true, subtree: false });
  if (players) rootObserver.observe(players, { childList: true, subtree: false });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
  else queueMicrotask(bind);
}
