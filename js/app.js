import { configureCloudStore, configureDemoDatabase, configureRealDatabase, deleteDemoDatabase, getAll, getOne, put, putBatch, remove, exportDatabase, importDatabase, isDemoDatabase, syncFromCloud, uploadVideo, removeVideo } from './db.js';
import { createCampoBaseCloudStore } from './supabase-client.js';
import { calculateMinuteTargets, buildCallupSelection, buildAttendanceRecord, calculateAttendanceStats, applySubstitution, normalizePositions, calculatePlayedSeconds, validateBackup, formatMatchClock, buildPlayerHistory, sortAttendanceRecords, suggestDelegateSubstitution, suggestRepartoSubstitutions, summarizeMinuteTargets, shouldSuggestUrgentSubstitution, accumulateSeasonMinutes, seasonKey, isPreseasonMatch, shouldAutoPause, hashPin, verifyPin, buildPlayerRatings, replacePlayerRatings, sortPlayersByName, sortPlayersBySquadNumber, updateRotationCounters, calledPlayerOptions, adjustLiveScore, addPlayerMatchEvent, buildPlayerSummary, applyPlayerStatAdjustments, setPlayerStatTotals, removeMatchFromPlayerStats, derivePlayerMatchStats, buildPlayerRecord } from './domain.js';
import { EXERCISE_CATEGORIES, INITIAL_EXERCISES, WARMUP_TEMPLATES, PHASE2_V3_EXERCISES, buildExercise, filterExercises, planPhase2V2Seed, planPhase2V3Seed, renderExerciseDiagram, buildTrainingSession, sortTrainingSessions } from './training-domain.js';
import { REAL_EXERCISES, SLIDESHARE_EXERCISES, renderRealDiagram } from './real-exercises.js';
import { addExerciseToSession, buildFlexibleTrainingSession, completeExercise, moveSessionBlock, removeSessionBlock, renderBoardDiagrams, sessionDurationStatus } from './exercise-planning.js';
import { EJERCICIOS_VALIDADOS, toCampoBaseExercise, findValidatedExercise } from './ejercicios-validados.js';
import { renderValidatedExerciseHTML, initValidatedExerciseViewer, attachLightbox } from './ejercicio-viewer.js';
import { buildVideoRecord, initVideoSection, videoPath } from './ejercicio-videos.js';
import { TACTIC_FORMATS, FORMATION_NAMES, FORMATION_GUIDES, TACTIC_TOOLS, buildTactic, createTacticMove, defaultTactic, moveTacticPiece, renderTacticBoard, renderTacticToolIcon, renderTacticArrow, renderTacticArrowDefs, sortTactics } from './tactics.js';
import { LIVE_FORMATIONS, TACTICA_MP4, nombreCorto, playerById, buildLiveState, asignarJugador, cargarFormacion, opcionesPosicion, suplentes, canAssignPlayerToSlot } from './live-tactics.js';
import { TACTICAS_INTERACTIVAS, findTacticaInteractiva } from './tacticas-interactivas.js';
import { renderTacticaInteractivaHTML, initTacticaViewer, attachTacticaLightbox } from './tactica-viewer.js';
import { planSquadSeed } from './squad-seed.js';
import { DEMO_DURATION_MS, createDemoSession, isDemoSessionActive, roleCanUseOwnerFeatures } from './demo-session.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const uid = () => crypto.randomUUID();
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
const safePhoto = (value) => /^data:image\/(png|jpeg|webp|gif);base64,/i.test(value ?? '') ? value : '';
const localDate = (value) => {
  if (!value) return 'Sin fecha';
  const hasTime = value.includes('T');
  return new Intl.DateTimeFormat('es-ES', hasTime
    ? { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }
    : { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(hasTime ? value : `${value}T12:00:00`));
};
const empty = (text) => `<div class="panel empty">${escapeHtml(text)}</div>`;
const FORMATS = { F7: { players: 7, duration: 70, half: 35 }, F11: { players: 11, duration: 90, half: 45 } };
const MATCH_TYPES = { league: 'Liga', friendly: 'Amistoso', tournament: 'Torneo' };
const EXCLUSION_REASONS = { sick: 'Enfermo', injured: 'Lesionado', suspended: 'Sancionado', missed_training: 'No fue a entrenar', discipline: 'Disciplina (notas/padres)', coach_decision: 'Decisión del entrenador', other: 'Otro motivo', rotation: 'Rotación equitativa' };
const MINUTE_REASONS = { discipline: 'Disciplina', absence: 'Falta', illness: 'Enfermedad', goalkeeper_rotation: 'Rotación de porteros', sin_indicar: 'Sin indicar' };

const state = { players: [], callups: [], matches: [], trainings: [], exercises: [], trainingSessions: [], tactics: [], videos: [], settings: {}, format: 'F7', timer: null, liveUpdatedAt: 0, tick: null, role: null, demoSession: null, delegateMode: false, urgentAlertKey: '', repartoAlertKey: '', finishing: false, ratingMatchId: null, cloudConnected: false, cloudError: '' };
const SESSION_ROLE_KEY = 'campobase.sessionRole';
const DEMO_SESSION_KEY = 'campobase.demoSession';
let toastTimer;
let sessionDraftBlocks = [];
let sessionDraftMeta = null;
let pendingExerciseId = '';
let tacticTool = 'select';
let tacticDraft = null;
let liveTactic = null; // estado de la pizarra táctica en vivo (Fase A)
let liveTacticsDocBound = false; // evita acumular el listener global de cierre de popup

function selectOptions(max, step = 1, selected = '', includeEmpty = false) {
  const options = includeEmpty ? '<option value="">—</option>' : '';
  return options + Array.from({ length: Math.ceil(max / step) }, (_, index) => String(index * step).padStart(2, '0'))
    .map((value) => `<option value="${value}" ${value === selected ? 'selected' : ''}>${value}</option>`).join('');
}

function splitTime24(value = '') {
  const match = /^(?:\d{4}-\d{2}-\d{2}T)?([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  return { hour: match?.[1] ?? '', minute: match?.[2] ?? '' };
}

function time24Markup(name, value = '', label = 'Hora') {
  const { hour, minute } = splitTime24(value);
  return `<div class="time-24"><select name="${name}Hour" aria-label="${escapeHtml(label)}, hora de 00 a 23">${selectOptions(24, 1, hour, true)}</select><span aria-hidden="true">:</span><select name="${name}Minute" aria-label="${escapeHtml(label)}, minuto">${selectOptions(60, 1, minute, true)}</select></div>`;
}

function composeTime24(hour, minute, required = false) {
  if (!hour && !minute && !required) return '';
  const value = `${hour}:${minute}`;
  if (!/^([01]\d|2[0-3]):(?:[0-5]\d)$/.test(value)) throw new TypeError('Selecciona una hora válida en formato 24 h.');
  return value;
}

function composeDateTime24(day, hour, minute) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day ?? '')) throw new TypeError('Selecciona una fecha válida.');
  return `${day}T${composeTime24(hour, minute, true)}`;
}

function setDateTimeFields(form, name, value = '') {
  const [day = '', time = ''] = value.split('T');
  const { hour, minute } = splitTime24(time);
  const { year, month, day: dayNum } = splitDate(day);
  form.elements[`${name}Day`].value = dayNum;
  form.elements[`${name}Month`].value = month;
  form.elements[`${name}Year`].value = year;
  form.elements[`${name}Hour`].value = hour || '00';
  form.elements[`${name}Minute`].value = minute || '00';
}

// Fecha en formato España DD/MM/AAAA con selectores propios (independiente del locale del navegador).
function splitDate(value = '') {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? '');
  return { year: match?.[1] ?? '', month: match?.[2] ?? '', day: match?.[3] ?? '' };
}

function dayOptions(selected = '') {
  return '<option value="">Día</option>' + Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map((v) => `<option value="${v}" ${v === selected ? 'selected' : ''}>${v}</option>`).join('');
}
function monthOptions(selected = '') {
  return '<option value="">Mes</option>' + Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((v) => `<option value="${v}" ${v === selected ? 'selected' : ''}>${v}</option>`).join('');
}
function yearOptions(selected = '') {
  const current = new Date().getFullYear();
  return '<option value="">Año</option>' + Array.from({ length: 6 }, (_, i) => String(current - 1 + i)).map((v) => `<option value="${v}" ${v === selected ? 'selected' : ''}>${v}</option>`).join('');
}

function dateMarkup(name, value = '', label = 'Fecha') {
  const { year, month, day } = splitDate(value);
  return `<div class="date-24"><select name="${name}Day" required aria-label="${escapeHtml(label)}, día">${dayOptions(day)}</select><span>/</span><select name="${name}Month" required aria-label="${escapeHtml(label)}, mes">${monthOptions(month)}</select><span>/</span><select name="${name}Year" required aria-label="${escapeHtml(label)}, año">${yearOptions(year)}</select></div>`;
}

function composeDate(day, month, year) {
  if (!/^\d{2}$/.test(day ?? '') || !/^\d{2}$/.test(month ?? '') || !/^\d{4}$/.test(year ?? '')) throw new TypeError('Selecciona una fecha válida (día, mes y año).');
  return `${year}-${month}-${day}`;
}

function askConfirmation({ title = 'Confirmar acción', message, acceptLabel = 'Confirmar', danger = false }) {
  const dialog = $('#confirmation-dialog');
  if (dialog.open) return Promise.resolve(false);
  $('#confirmation-title').textContent = title;
  $('#confirmation-message').textContent = message;
  const accept = $('#confirmation-accept');
  const cancel = $('#confirmation-cancel');
  accept.textContent = acceptLabel;
  accept.className = danger ? 'danger' : 'primary';
  return new Promise((resolve) => {
    const finish = (result) => {
      accept.removeEventListener('click', onAccept);
      cancel.removeEventListener('click', onCancel);
      dialog.removeEventListener('cancel', onCancel);
      dialog.close();
      resolve(result);
    };
    const onAccept = () => finish(true);
    const onCancel = (event) => { event?.preventDefault(); finish(false); };
    accept.addEventListener('click', onAccept);
    cancel.addEventListener('click', onCancel);
    dialog.addEventListener('cancel', onCancel);
    dialog.showModal();
  });
}

function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('show'), 2600);
}

function formObject(form) { return Object.fromEntries(new FormData(form)); }
function checkedValues(name, root = document) { return $$(`input[name="${name}"]:checked`, root).map((input) => input.value); }
function playerName(id) { return state.players.find((player) => player.id === id)?.name ?? 'Jugador eliminado'; }
function matchTypeLabel(type) { return MATCH_TYPES[type] ?? MATCH_TYPES.league; }
function myTeamName() { return state.settings.teamName?.trim() || 'Mi equipo'; }
function matchTeams(match) {
  const away = match?.venue === 'away';
  return { home: away ? match.opponent : myTeamName(), away: away ? myTeamName() : match.opponent, mySide: away ? 'away' : 'home' };
}
function playerPositions(player) { return normalizePositions(player).join(', ') || 'Sin posición'; }
function keeperIdsFromCallup(callup) {
  const ids = callup?.availableIds ?? [];
  return ids.filter((id) => normalizePositions(state.players.find((player) => player.id === id)).includes('Portero'));
}
function playerCardPhoto(player) { return safePhoto(player.photo) ? `<img class="avatar" src="${safePhoto(player.photo)}" alt="Foto de ${escapeHtml(player.name)}">` : `<div class="avatar" aria-hidden="true">${escapeHtml(player.name.slice(0, 2).toUpperCase())}</div>`; }
function showView(viewId) {
  if (state.role === 'demo' && viewId === 'ajustes') return;
  $$('.view').forEach((view) => view.classList.toggle('active', view.id === viewId));
  $$('.bottom-nav button').forEach((item) => item.classList.toggle('active', item.dataset.view === viewId));
  $('#app').focus();
  applyGlobalSearch();
}

// Buscador global: filtra los elementos de la vista activa por nombre o palabra.
function applyGlobalSearch() {
  const input = $('#global-search');
  const query = (input?.value ?? '').trim().toLocaleLowerCase('es');
  const view = document.querySelector('.view.active');
  if (!view) return;
  const containers = view.querySelectorAll('.stack, .card-grid, .exercise-grid, .attendance-grid, .selection-grid');
  containers.forEach((container) => {
    [...container.children].forEach((child) => {
      const text = (child.textContent || '').toLocaleLowerCase('es');
      child.style.display = (!query || text.includes(query)) ? '' : 'none';
    });
  });
}

function isUserInteracting() {
  if (document.querySelector('dialog[open]')) return true;
  if (document.querySelector('details[open]')) return true;
  const active = document.activeElement;
  if (active && active.matches('select, input, textarea')) return true;
  if (document.querySelector('input[name="sub-out"]:checked, input[name="sub-in"]:checked, input[name="delegate-out"]:checked, input[name="delegate-in"]:checked')) return true;
  // Si hay un reproductor de ejercicio en marcha, no re-renderizar (se reiniciaría).
  if ((window.__viewersPlaying || 0) > 0) return true;
  // Si la pizarra táctica en vivo está ampliada (lightbox abierto), no re-renderizar
  // (se cerraría sola y perdería el estado de la pizarra ampliada).
  if (document.querySelector('.live-tactics-lightbox.open')) return true;
  // Si el desplegable de asignación de la pizarra está abierto, no re-renderizar
  // (se cerraría solo y el usuario perdería la selección).
  if (document.querySelector('.live-tactics-popup.open')) return true;
  return false;
}

async function refresh() {
  [state.players, state.callups, state.matches, state.trainings] = await Promise.all(['players', 'callups', 'matches', 'trainings'].map(getAll));
  state.players = sortPlayersByName(state.players);
  const settingRecords = await getAll('settings');
  state.exercises = settingRecords.filter(({ recordType }) => recordType === 'exercise');
  // Los ejercicios validados (formato nuevo) viven en JS y sustituyen a los precargados antiguos.
  state.exercises = [
    ...state.exercises.filter((item) => item.example !== true),
    ...EJERCICIOS_VALIDADOS.map(toCampoBaseExercise),
  ];
  state.trainingSessions = settingRecords.filter(({ recordType }) => recordType === 'trainingSession');
  state.tactics = settingRecords.filter(({ recordType }) => recordType === 'tactic');
  state.videos = settingRecords.filter(({ recordType }) => recordType === 'exerciseVideo');
  const settings = settingRecords.find(({ id }) => id === 'main');
  state.settings = settings ?? { id: 'main' };
  state.format = settings?.format ?? 'F7';
  $('#format').value = state.format;
  $('#team-settings-form').elements.teamName.value = state.settings.teamName ?? '';
  $('#demo-team-form').elements.teamName.value = state.settings.teamName ?? '';
  $('#demo-team-form').elements.format.value = state.format;
  if (!isUserInteracting()) renderAll();
}

function renderAll() {
  const config = FORMATS[state.format];
  $('#active-format').textContent = `${state.format} · ${config.players} en campo · ${config.duration} min`;
  renderPlayers(); renderCallups(); renderLive(); renderDelegate(); renderMatches(); renderTrainings(); renderExercises(); renderTrainingSessions(); renderTactics();
  applyGlobalSearch();
}

function renderPlayers() {
  const currentMatchIds = new Set(state.matches.map((match) => match.id));
  const currentCallups = state.callups.filter((callup) => !callup.matchId || currentMatchIds.has(callup.matchId));
  const currentTrainings = state.trainings.filter((record) => !record.matchId || currentMatchIds.has(record.matchId));
  const playerSummaryTotals = new Map(state.players.map((player) => {
    const leagueAutomatic = buildPlayerSummary(player.id, state.matches, currentTrainings, currentCallups, 'league');
    const preseasonAutomatic = buildPlayerSummary(player.id, state.matches, currentTrainings, currentCallups, 'preseason');
    return [player.id, {
      summary: applyPlayerStatAdjustments(leagueAutomatic, player.statAdjustments?.league),
      preseasonSummary: applyPlayerStatAdjustments(preseasonAutomatic, player.statAdjustments?.preseason),
    }];
  }));
  const totalMinutes = state.players.reduce((sum, player) => {
    const totals = playerSummaryTotals.get(player.id);
    return sum + totals.summary.minutes + totals.preseasonSummary.minutes;
  }, 0);
  const totalRotations = state.players.reduce((sum, player) => {
    const totals = playerSummaryTotals.get(player.id);
    return sum + totals.summary.rotations + totals.preseasonSummary.rotations;
  }, 0);
  $('#squad-stats').innerHTML = `<div class="stat"><strong>${state.players.length}</strong><span>jugadores</span></div><div class="stat"><strong>${totalMinutes}</strong><span>minutos acumulados</span></div><div class="stat"><strong>${totalRotations}</strong><span>ausencias por rotación</span></div>`;
  const sorted = sortPlayersBySquadNumber(state.players);
  $('#players-list').innerHTML = sorted.length ? sorted.map((player, index) => {
    const labels = { present: 'Presente', late: 'Tarde', absent: 'Ausente', sick: 'Enfermedad', coach_decision: 'Decisión del entrenador', missed_training: 'No fue a entrenar', discipline: 'Disciplina', rotation: 'Rotación' };
    const history = buildPlayerHistory(player.id, currentTrainings, currentCallups, state.matches);
    const { summary, preseasonSummary } = playerSummaryTotals.get(player.id);
    const derivedMatchStats = derivePlayerMatchStats(player.id, state.matches);
    const seasonRows = Object.entries(derivedMatchStats.seasonMinutes).sort(([a], [b]) => b.localeCompare(a)).map(([season, minutes]) => `<li><strong>${escapeHtml(season)}</strong> · ${minutes} min</li>`).join('');
    const minuteReasonRows = derivedMatchStats.minuteReasons.map((item) => `<li><strong>${escapeHtml(localDate(item.date))}</strong> · ${escapeHtml(MINUTE_REASONS[item.reason] ?? item.reason)}</li>`).join('');
    const ratingRows = derivedMatchStats.ratingHistory.slice().sort((a, b) => String(b.date).localeCompare(String(a.date))).map((item) => `<li><strong>${escapeHtml(localDate(item.date))}</strong> · ${escapeHtml(item.opponent || 'Partido')} · ${item.rating}/5</li>`).join('');
    const seasonRatingRows = Object.entries(derivedMatchStats.ratingHistory.reduce((acc, item) => { const s = seasonKey(item.date); (acc[s] ??= []).push(item.rating); return acc; }, {})).sort(([a], [b]) => b.localeCompare(a)).map(([season, ratings]) => `<li><strong>${escapeHtml(season)}</strong> · media ${(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)}/5 (${ratings.length} partidos)</li>`).join('');
    const historyRows = history.map((item) => {
      const typeLabel = item.type === 'callup' ? 'Convocatoria' : item.kind === 'match' ? 'Partido' : 'Entrenamiento';
      const detail = item.type === 'callup' ? (labels[item.detail] ?? item.detail) : item.detail;
      return `<li class="history-row"><span class="history-date">${escapeHtml(localDate(item.date))}</span><span class="history-type">${typeLabel}</span><span class="history-detail">${escapeHtml(detail)}</span></li>`;
    }).join('');
    const incidentRows = playerIncidentRows(player.id).map((item) => `<li><strong>${escapeHtml(localDate(item.date))}</strong> · ${escapeHtml(item.label)}${item.note ? `: ${escapeHtml(item.note)}` : ''} <button type="button" class="icon-button remove-player-incident" data-key="${escapeHtml(item.key)}" aria-label="Borrar incidencia">×</button></li>`).join('');
    return `<article class="card player">
    <div class="player-head">${playerCardPhoto(player)}<div class="player-name"><h3>${escapeHtml(player.name)}</h3><p>Ficha de plantilla</p></div><div class="player-actions"><button type="button" class="icon-button edit-player" data-id="${player.id}" aria-label="Editar ${escapeHtml(player.name)}">Editar</button><button type="button" class="icon-button delete-player danger" data-id="${player.id}" aria-label="Eliminar ${escapeHtml(player.name)}">Borrar</button></div></div>
    <div class="player-body"><div class="player-data"><span><small>Dorsal</small><strong>${escapeHtml(player.number || 'Sin asignar')}</strong></span><span><small>Posición</small><strong>${escapeHtml(playerPositions(player))}</strong></span><span><small>Pierna</small><strong>${escapeHtml(player.foot || 'Sin indicar')}</strong></span><span><small>Rotaciones</small><strong>${summary.rotations + preseasonSummary.rotations} fuera</strong></span></div><details class="player-performance"><summary>Ver actividad y estadísticas</summary><div class="player-summary"><span><strong>${summary.goals}</strong> goles</span><span><strong>${summary.yellowCards}/${summary.redCards}</strong> amarillas/rojas</span><span><strong>${summary.injuries}</strong> lesiones</span><span><strong>${summary.incidents}</strong> incidencias</span><span><strong>${summary.callups}</strong> convocatorias</span><span><strong>${summary.rotations}</strong> rotaciones</span><span><strong>${summary.late}/${summary.absent}</strong> tarde/ausente</span><span><strong>${summary.minutes}</strong> min</span><span><strong>${summary.averageRating ?? '—'}</strong> media</span></div><button type="button" class="edit-player-stats secondary" data-player-id="${player.id}" data-scope="league">Editar estadísticas de Liga</button><h4 class="player-stats-title">Pretemporada</h4><div class="player-summary"><span><strong>${preseasonSummary.goals}</strong> goles</span><span><strong>${preseasonSummary.yellowCards}/${preseasonSummary.redCards}</strong> amarillas/rojas</span><span><strong>${preseasonSummary.injuries}</strong> lesiones</span><span><strong>${preseasonSummary.incidents}</strong> incidencias</span><span><strong>${preseasonSummary.callups}</strong> convocatorias</span><span><strong>${preseasonSummary.rotations}</strong> rotaciones</span><span><strong>${preseasonSummary.late}/${preseasonSummary.absent}</strong> tarde/ausente</span><span><strong>${preseasonSummary.minutes}</strong> min</span><span><strong>${preseasonSummary.averageRating ?? '—'}</strong> media</span></div><button type="button" class="edit-player-stats secondary" data-player-id="${player.id}" data-scope="preseason">Editar estadísticas de Pretemporada</button><p class="meta"><span class="rank">${index + 1}. ${summary.minutes + preseasonSummary.minutes} min acumulados</span>${player.notes ? ` · ${escapeHtml(player.notes)}` : ''}</p>${seasonRows ? `<details><summary>Minutos por temporada</summary><ul class="plain-list">${seasonRows}</ul></details>` : ''}${ratingRows ? `<details><summary>Puntuaciones (${derivedMatchStats.ratingHistory.length})</summary><ul class="plain-list">${ratingRows}</ul></details>` : ''}${seasonRatingRows ? `<details><summary>Media por temporada</summary><ul class="plain-list">${seasonRatingRows}</ul></details>` : ''}${minuteReasonRows ? `<details><summary>Motivos de menos minutos</summary><ul class="plain-list">${minuteReasonRows}</ul></details>` : ''}${incidentRows ? `<details><summary>Incidencias y motivos (${playerIncidentRows(player.id).length})</summary><ul class="plain-list">${incidentRows}</ul></details>` : ''}${history.length ? `<details class="player-history"><summary>Historial completo (${history.length})</summary><ul class="plain-list">${historyRows}</ul></details>` : '<p class="meta">Sin actividad registrada.</p>'}</details></div>
  </article>`;
  }).join('') : empty('Añade el primer jugador para empezar.');
}

function playerIncidentRows(playerId) {
  const rows = [];
  for (const match of state.matches) {
    (match.incidents ?? []).forEach((item, i) => {
      if (item.playerId !== playerId) return;
      rows.push({ key: `match:${match.id}:incidents:${i}`, date: match.date, label: 'Incidencia', note: item.note || '' });
    });
  }
  for (const record of state.trainings) {
    const entry = record.attendance?.find((item) => item.playerId === playerId);
    if (entry?.note) {
      const label = entry.status === 'late' ? 'Tardanza' : entry.status === 'absent' ? 'Falta' : 'Nota de asistencia';
      rows.push({ key: `training:${record.id}:note:${playerId}`, date: record.date, label, note: entry.note });
    }
  }
  return rows.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

async function removePlayerIncident(key) {
  const [type, ...rest] = key.split(':');
  if (type === 'match') {
    const [matchId, field, indexStr] = rest;
    const match = state.matches.find((m) => m.id === matchId);
    if (!match) return;
    const next = { ...match };
    const items = [...(next[field] ?? [])];
    const removed = items.splice(Number(indexStr), 1)[0];
    next[field] = items;
    if (field === 'goals' && removed) next.goalsFor = Math.max(0, (Number(next.goalsFor) || 0) - 1);
    await put('matches', next);
  } else if (type === 'training') {
    const [trainingId, , playerId] = rest;
    const record = state.trainings.find((r) => r.id === trainingId);
    if (!record) return;
    const next = { ...record, attendance: record.attendance.map((item) => item.playerId === playerId ? { ...item, note: '' } : item) };
    await put('trainings', next);
  }
  await refresh();
  toast('Incidencia eliminada.');
}

async function photoToDataUrl(file) {
  if (!file || !file.size) return '';
  if (!file.type.startsWith('image/')) throw new TypeError('El archivo seleccionado no es una imagen.');
  if (file.size > 2_000_000) throw new RangeError('La foto supera 2 MB. Redúcela antes de guardarla.');
  return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); });
}

async function savePlayer(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const values = formObject(form);
  const existing = values.id ? await getOne('players', values.id) : null;
  const photo = await photoToDataUrl(form.elements.photo.files[0]);
  const positions = checkedValues('positions', form);
  await put('players', buildPlayerRecord({ ...values, id: values.id || uid() }, positions, existing, photo));
  form.closest('dialog').close(); form.reset(); await refresh(); toast('Jugador guardado.');
}

function editPlayer(id) {
  const player = state.players.find((item) => item.id === id); if (!player) return;
  const form = $('#player-form');
  for (const key of ['id', 'name', 'number', 'foot', 'notes']) form.elements[key].value = player[key] ?? '';
  const positions = new Set(normalizePositions(player));
  $$('input[name="positions"]', form).forEach((input) => { input.checked = positions.has(input.value); });
  $('#player-dialog').showModal();
}

const EDITABLE_PLAYER_STATS = ['goals', 'yellowCards', 'redCards', 'injuries', 'incidents', 'callups', 'rotations', 'late', 'absent', 'minutes', 'averageRating'];

function editPlayerStats(playerId, scope) {
  if (!roleCanUseOwnerFeatures(state.role)) return toast('Solo Migue puede editar las estadísticas.');
  const player = state.players.find((item) => item.id === playerId);
  if (!player || !['league', 'preseason'].includes(scope)) return;
  const automatic = buildPlayerSummary(player.id, state.matches, state.trainings, state.callups, scope);
  const summary = applyPlayerStatAdjustments(automatic, player.statAdjustments?.[scope]);
  const form = $('#player-stats-form');
  form.elements.playerId.value = player.id;
  form.elements.scope.value = scope;
  for (const field of EDITABLE_PLAYER_STATS) form.elements[field].value = summary[field] ?? 0;
  const label = scope === 'preseason' ? 'Pretemporada' : 'Liga';
  $('#player-stats-title').textContent = `Editar ${label} · ${player.name}`;
  $('#player-stats-help').textContent = `Totales de ${label}. Puedes corregir todas las casillas.`;
  $('#player-stats-dialog').showModal();
}

async function savePlayerStats(event) {
  event.preventDefault();
  if (!roleCanUseOwnerFeatures(state.role)) return toast('Solo Migue puede editar las estadísticas.');
  const form = event.currentTarget;
  const values = formObject(form);
  const player = await getOne('players', values.playerId);
  if (!player || !['league', 'preseason'].includes(values.scope)) throw new TypeError('No se encontró la ficha de estadísticas.');
  const automatic = buildPlayerSummary(player.id, state.matches, state.trainings, state.callups, values.scope);
  const totals = Object.fromEntries(EDITABLE_PLAYER_STATS.map((field) => [field, values[field]]));
  await put('players', setPlayerStatTotals(player, values.scope, automatic, totals));
  form.closest('dialog').close();
  await refresh();
  toast(`Estadísticas de ${values.scope === 'preseason' ? 'Pretemporada' : 'Liga'} guardadas.`);
}

function exclusionReasonLabel({ reason, note }) {
  const label = EXCLUSION_REASONS[reason] ?? reason;
  return reason === 'other' && note ? `Otro motivo: ${note}` : label;
}

function callupPlayerCard(player, existing) {
  const manualExclusion = existing?.exclusions?.find((item) => item.playerId === player.id && !item.automatic);
  const selected = existing?.selectedIds?.includes(player.id);
  return `<article class="selection-card" data-player-id="${player.id}">${playerCardPhoto(player)}<div class="selection-card-body"><h4>${escapeHtml(player.name)} <span class="pill">#${escapeHtml(player.number || '—')}</span></h4><p class="meta">${escapeHtml(playerPositions(player))}</p><div class="selection-actions"><label><input type="checkbox" name="selected" value="${player.id}" ${selected ? 'checked' : ''}> Convocar manualmente</label><label><input type="checkbox" name="manualExcluded" value="${player.id}" ${manualExclusion ? 'checked' : ''}> Dejar fuera</label><select name="reason-${player.id}" aria-label="Motivo de exclusión de ${escapeHtml(player.name)}" ${manualExclusion ? '' : 'disabled'}><option value="">Motivo…</option>${Object.entries(EXCLUSION_REASONS).filter(([key]) => key !== 'rotation').map(([key, label]) => `<option value="${key}" ${manualExclusion?.reason === key ? 'selected' : ''}>${label}</option>`).join('')}</select><label class="exclusion-other-note ${manualExclusion?.reason === 'other' ? '' : 'hidden'}">Explica el otro motivo<input name="reasonNote-${player.id}" maxlength="200" value="${escapeHtml(manualExclusion?.note ?? '')}" ${manualExclusion?.reason === 'other' ? 'required' : ''} aria-label="Explicación del motivo de exclusión de ${escapeHtml(player.name)}"></label></div></div></article>`;
}

function callupBuilder(preselectedMatchId = '', editId = '') {
  const container = $('#callup-builder');
  const config = FORMATS[state.format];
  const existing = state.callups.find((callup) => callup.id === editId);
  const selectedMatchId = existing?.matchId ?? preselectedMatchId;
  container.classList.remove('hidden');
  const options = state.matches.filter((match) => match.status !== 'finished' || match.id === selectedMatchId).sort((a,b)=>a.date.localeCompare(b.date)).map((match) => `<option value="${match.id}" ${match.id === selectedMatchId ? 'selected' : ''}>${escapeHtml(localDate(match.date))} · ${escapeHtml(matchTypeLabel(match.type))}${match.round ? ` · Jornada ${escapeHtml(match.round)}` : ''} · ${escapeHtml(match.opponent)}</option>`).join('');
  container.innerHTML = `<h3>${existing ? 'Editar' : 'Nueva'} convocatoria · ${existing?.format ?? state.format}</h3><form id="callup-form"><input type="hidden" name="id" value="${existing?.id ?? ''}"><fieldset><legend>Partido</legend><div class="choice-row"><label><input type="radio" name="matchSource" value="calendar" ${existing || preselectedMatchId || options ? 'checked' : ''}> Elegir del calendario</label>${existing ? '' : `<label><input type="radio" name="matchSource" value="manual" ${!preselectedMatchId && !options ? 'checked' : ''}> Crear partido a mano</label>`}</div><div id="calendar-match-fields"><label>Partido del calendario<select name="matchId"><option value="">Selecciona…</option>${options}</select></label></div><div id="manual-match-fields" class="hidden"><div class="form-row"><fieldset class="datetime-field"><legend>Fecha y hora (24 h)</legend>${dateMarkup('manualDate', '', 'Fecha del partido manual')}${time24Markup('manualDate', '', 'Hora del partido manual')}</fieldset><label>Jornada<input name="manualRound" maxlength="30" placeholder="Ej. 8"></label></div><div class="form-row"><label>Tipo<select name="manualType"><option value="league">Partido de liga</option><option value="friendly">Amistoso</option><option value="tournament">Torneo</option></select></label><label>Local / Visitante<select name="manualVenue"><option value="home">Local (casa)</option><option value="away">Visitante (fuera)</option></select></label></div><label>Rival<input name="manualOpponent" maxlength="100"></label><label>Lugar<input name="manualLocation" maxlength="120"></label></div></fieldset><div class="callup-help panel"><strong>Máximo 14.</strong> Marca solo quienes quieras asegurar en la convocatoria. Para dejar a alguien fuera manualmente, marca “Dejar fuera” e indica el motivo. En liga, CampoBase completa el resto con rotación justa. Si a alguien ya se le excluyó por enfermedad o decisión técnica, te pedirá confirmación antes de dejarle fuera por rotación.</div><div class="selection-grid">${state.players.map((player) => callupPlayerCard(player, existing)).join('')}</div><div id="target-preview"></div><div class="button-row"><button class="primary" type="submit">${existing ? 'Actualizar' : 'Guardar'} convocatoria y reparto</button><button class="secondary cancel-builder" type="button">Cancelar</button></div></form>`;
  updateMatchSource();
  updateTargetPreview();
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function currentCallupMatch(form) {
  if (form.elements.matchSource.value === 'manual') return { type: form.elements.manualType.value };
  return state.matches.find((match) => match.id === form.elements.matchId.value) ?? null;
}

function manualExclusionsFromForm(form) {
  return checkedValues('manualExcluded', form).map((playerId) => {
    const reason = form.elements[`reason-${playerId}`].value;
    const note = form.elements[`reasonNote-${playerId}`].value.trim();
    return { playerId, reason, ...(reason === 'other' ? { note } : {}) };
  });
}

function invalidManualExclusion({ reason, note }) {
  return !reason || (reason === 'other' && !note);
}

function protectedRotationHistories(excludedCallupId = '') {
  const protectedReasons = new Set(['sick', 'coach_decision']);
  const histories = {};
  for (const callup of state.callups.filter(({ id }) => id !== excludedCallupId)) {
    for (const exclusion of callup.exclusions ?? []) {
      if (!exclusion.automatic && protectedReasons.has(exclusion.reason)) {
        (histories[exclusion.playerId] ??= []).push({ reason: exclusion.reason, date: callup.date, callupId: callup.id });
      }
    }
  }
  return histories;
}

function callupSelectionFromForm(form, rotationDecisions = {}) {
  const match = currentCallupMatch(form);
  if (!match) throw new TypeError('Selecciona un partido o créalo a mano.');
  return buildCallupSelection(state.players, {
    matchType: match.type ?? 'league',
    selectedIds: checkedValues('selected', form),
    manualExclusions: manualExclusionsFromForm(form),
    protectedHistories: protectedRotationHistories(form.elements.id.value),
    rotationDecisions,
  });
}

function updateTargetPreview() {
  const form = $('#callup-form'); if (!form) return;
  const preview = $('#target-preview');
  const match = currentCallupMatch(form);
  if (!match) { preview.innerHTML = '<p class="warning panel">Selecciona un partido o créalo a mano.</p>'; return; }
  const manualExclusions = manualExclusionsFromForm(form);
  if (manualExclusions.some(invalidManualExclusion)) { preview.innerHTML = '<p class="warning panel">Indica el motivo de cada jugador que dejas fuera.</p>'; return; }
  try {
    const selection = callupSelectionFromForm(form);
    if (!selection.availableIds.length) { preview.innerHTML = '<p class="warning panel">No hay jugadores convocados.</p>'; return; }
    const keeperIds = selection.availableIds.filter((id) => normalizePositions(state.players.find((player) => player.id === id)).includes('Portero'));
    const targets = calculateMinuteTargets(selection.availableIds, FORMATS[state.format].duration, FORMATS[state.format].players, keeperIds);
    const manual = selection.exclusions.filter(({ automatic }) => !automatic);
    const automatic = selection.exclusions.filter(({ automatic: isAutomatic }) => isAutomatic);
    const exclusionList = (items) => items.length ? `<ul class="plain-list">${items.map((item) => `<li><strong>${escapeHtml(playerName(item.playerId))}</strong> — ${escapeHtml(exclusionReasonLabel(item))}</li>`).join('')}</ul>` : '<p class="meta">Nadie.</p>';
    const pending = selection.pendingRotationDecisions ?? [];
    preview.innerHTML = `${pending.length ? `<p class="warning panel"><strong>Revisión necesaria:</strong> al guardar te preguntaré por ${pending.map(({ playerId }) => escapeHtml(playerName(playerId))).join(', ')} porque ya se quedaron fuera por enfermedad o decisión del entrenador.</p>` : ''}<div class="preview-summary"><h3>Convocados (${selection.availableIds.length}/14)</h3><p>${selection.availableIds.map(playerName).map(escapeHtml).join(', ')}</p><div class="exclusion-summary"><section><h4>Fuera manualmente (${manual.length})</h4>${exclusionList(manual)}</section><section><h4>Fuera por CampoBase (${automatic.length})</h4>${exclusionList(automatic)}</section></div><p><strong>Total fuera: ${selection.exclusions.length}</strong></p></div><details><summary>Ver minutos objetivo</summary><table class="minute-table"><thead><tr><th>Jugador</th><th>Objetivo</th></tr></thead><tbody>${targets.map((target) => `<tr><td>${escapeHtml(playerName(target.playerId))}</td><td>${target.minutes} min</td></tr>`).join('')}</tbody></table></details>`;
  } catch (error) { preview.innerHTML = `<p class="warning panel">${escapeHtml(error.message)}</p>`; }
}

function updateMatchSource() {
  const form = $('#callup-form'); if (!form) return;
  const manual = form.elements.matchSource.value === 'manual';
  $('#manual-match-fields').classList.toggle('hidden', !manual);
  $('#calendar-match-fields').classList.toggle('hidden', manual);
  for (const name of ['manualDateDay', 'manualDateMonth', 'manualDateYear', 'manualDateHour', 'manualDateMinute', 'manualOpponent']) form.elements[name].required = manual;
  form.elements.matchId.required = !manual;
}

async function saveCallup(event) {
  event.preventDefault(); const form = event.target.closest('form');
  const existing = form.elements.id.value ? state.callups.find(({ id }) => id === form.elements.id.value) : null;
  let match = currentCallupMatch(form);
  if (!match) return toast('Selecciona un partido del calendario.');
  const manualMatch = form.elements.matchSource.value === 'manual';
  if (manualMatch) {
    match = { id: uid(), date: composeDateTime24(composeDate(form.elements.manualDateDay.value, form.elements.manualDateMonth.value, form.elements.manualDateYear.value), form.elements.manualDateHour.value, form.elements.manualDateMinute.value), round: form.elements.manualRound.value.trim(), type: form.elements.manualType.value, venue: form.elements.manualVenue.value, opponent: form.elements.manualOpponent.value.trim(), location: form.elements.manualLocation.value.trim(), goalsFor: null, goalsAgainst: null, status: 'planned', createdAt: Date.now() };
  }
  const manualExclusions = manualExclusionsFromForm(form);
  if (manualExclusions.some(invalidManualExclusion)) return toast('Indica el motivo de cada jugador que dejas fuera.');
  const rotationDecisions = {};
  let selection;
  while (true) {
    selection = callupSelectionFromForm(form, rotationDecisions);
    const pending = selection.pendingRotationDecisions?.find(({ playerId }) => !rotationDecisions[playerId]);
    if (!pending) break;
    const history = pending.history.map(({ reason, date }) => `${localDate(date)}: ${EXCLUSION_REASONS[reason] ?? reason}`).join('\n');
    const include = await askConfirmation({ title: 'Revisar rotación', message: `${playerName(pending.playerId)} ya se quedó fuera por:\n${history}\n\n¿Quieres que ENTRE en esta convocatoria? Si entra, CampoBase dejará fuera al siguiente jugador de la rotación.`, acceptLabel: 'Sí, que entre' });
    rotationDecisions[pending.playerId] = include ? 'include' : 'exclude';
  }
  const { availableIds, exclusions } = selection;
  if (!availableIds.length) return toast('La convocatoria no puede quedar vacía.');
  const excludedIds = exclusions.map(({ playerId }) => playerId);
  const format = existing?.format ?? state.format;
  const config = FORMATS[format];
  const keeperIds = availableIds.filter((id) => normalizePositions(state.players.find((player) => player.id === id)).includes('Portero'));
  const targets = calculateMinuteTargets(availableIds, config.duration, config.players, keeperIds);
  const callup = { id: existing?.id ?? uid(), matchId: match.id, date: match.date, opponent: match.opponent, matchType: match.type ?? 'league', format, availableIds, selectedIds: checkedValues('selected', form), excludedIds, exclusions, targets, rotationDecisions, createdAt: existing?.createdAt ?? Date.now(), updatedAt: Date.now() };
  const nextCallups = [...state.callups.filter(({ id }) => id !== callup.id), callup];
  const matchesToSave = [{ ...match, callupId: callup.id, format }];
  if (existing?.matchId && existing.matchId !== match.id) {
    const oldMatch = state.matches.find(({ id }) => id === existing.matchId);
    if (oldMatch) matchesToSave.push({ ...oldMatch, callupId: null });
  }
  await putBatch({
    callups: [callup],
    matches: matchesToSave,
    players: updateRotationCounters(state.players, nextCallups),
  });
  $('#callup-builder').classList.add('hidden'); await refresh(); showView('convocatorias'); toast(existing ? 'Convocatoria actualizada.' : 'Convocatoria guardada.');
}

async function synchronizeRotationCounters() {
  const [players, callups] = await Promise.all([getAll('players'), getAll('callups')]);
  for (const player of players) {
    const rotations = callups
      .filter((callup) => (callup.exclusions ?? []).some((entry) => entry.playerId === player.id && entry.automatic))
      .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    await put('players', { ...player, outsideCount: rotations.length, lastExcludedAt: rotations[0]?.createdAt ?? null });
  }
}

function renderCallups() {
  const list = [...state.callups].sort((a,b)=>b.date.localeCompare(a.date));
  $('#callups-list').innerHTML = list.length ? list.map((callup) => {
    const exclusions = callup.exclusions ?? callup.excludedIds.map((playerId) => ({ playerId, reason: 'rotation', automatic: true }));
    const exclusionRows = (automatic) => exclusions.filter((item) => Boolean(item.automatic) === automatic).map((item) => `<li><strong>${escapeHtml(playerName(item.playerId))}</strong> — ${escapeHtml(exclusionReasonLabel(item))}</li>`).join('') || '<li>Nadie</li>';
    return `<article class="panel"><div class="section-head"><div><span class="pill accent">${escapeHtml(callup.format)} · ${escapeHtml(matchTypeLabel(callup.matchType))}</span><h3>${escapeHtml(callup.opponent)}</h3><p class="meta">${escapeHtml(localDate(callup.date))} · ${callup.availableIds.length} convocados · ${exclusions.length} fuera</p></div><div class="button-row"><button type="button" class="edit-callup secondary" data-id="${callup.id}">Editar</button><button type="button" class="delete-callup danger" data-id="${callup.id}">Borrar</button></div></div><div class="exclusion-summary"><section><h4>Fuera manualmente</h4><ul class="plain-list">${exclusionRows(false)}</ul></section><section><h4>Fuera por CampoBase</h4><ul class="plain-list">${exclusionRows(true)}</ul></section></div><details><summary>Ver reparto objetivo</summary><table class="minute-table">${callup.targets.map((target) => `<tr><td>${escapeHtml(playerName(target.playerId))}</td><td>${target.minutes} min</td></tr>`).join('')}</table></details></article>`;
  }).join('') : empty('Todavía no hay convocatorias.');
}

async function deleteCallup(id) {
  const callup = state.callups.find((item) => item.id === id); if (!callup || !await askConfirmation({ title: 'Borrar convocatoria', message: 'Se borrará esta convocatoria y se recalcularán sus contadores de rotación.', acceptLabel: 'Borrar', danger: true })) return;
  const match = state.matches.find((item) => item.callupId === id); if (match) await put('matches', { ...match, callupId: null });
  await remove('callups', id); await synchronizeRotationCounters(); await refresh(); toast('Convocatoria borrada.');
}

async function deleteMatch(id) {
  const match = state.matches.find((item) => item.id === id);
  if (!match || !await askConfirmation({
    title: 'Borrar partido',
    message: 'Se borrarán también su asistencia, convocatoria, minutos, puntuaciones y datos asociados de las fichas de jugadores.',
    acceptLabel: 'Borrar',
    danger: true,
  })) return;
  const updatedPlayers = state.players.map((player) => removeMatchFromPlayerStats(player, match, state.matches));
  for (const record of state.trainings.filter(({ matchId }) => matchId === match.id)) await remove('trainings', record.id);
  const relatedCallups = state.callups.filter((callup) => callup.id === match.callupId || callup.matchId === match.id);
  for (const callup of relatedCallups) await remove('callups', callup.id);
  await remove('matches', match.id);
  if (updatedPlayers.length) await putBatch({ players: updatedPlayers });
  await synchronizeRotationCounters();
  await refresh();
  toast('Partido y todos sus datos asociados borrados.');
}

function timerSeconds(timer = state.timer) {
  if (!timer) return 0;
  return timer.elapsed + (timer.runningSince ? Math.floor((Date.now() - timer.runningSince) / 1000) : 0);
}

function ensureLiveDetails() {
  const existing = state.timer.details ?? {};
  state.timer.details = {
    goalsFor: Number.isFinite(existing.goalsFor) ? existing.goalsFor : 0,
    goalsAgainst: Number.isFinite(existing.goalsAgainst) ? existing.goalsAgainst : 0,
    goals: existing.goals ?? [],
    cards: existing.cards ?? [],
    injuries: existing.injuries ?? [],
    incidents: existing.incidents ?? [],
    comments: existing.comments ?? '',
    minuteReasons: existing.minuteReasons ?? {},
  };
  return state.timer.details;
}

function liveDetailsMarkup(prefix, availableIds, match) {
  const details = ensureLiveDetails();
  const teams = matchTeams(match);
  const homeScore = teams.mySide === 'home' ? details.goalsFor : details.goalsAgainst;
  const awayScore = teams.mySide === 'away' ? details.goalsFor : details.goalsAgainst;
  const homeTeam = teams.mySide === 'home' ? 'for' : 'against';
  const awayTeam = teams.mySide === 'away' ? 'for' : 'against';
  const options = availableIds.map((id) => `<option value="${id}">${escapeHtml(playerName(id))}</option>`).join('');
  const minuteReasons = availableIds.map((id) => `<label>${escapeHtml(playerName(id))}<select data-minute-reason="${id}"><option value="">Sin motivo</option>${Object.entries(MINUTE_REASONS).map(([value, label]) => `<option value="${value}" ${details.minuteReasons[id] === value ? 'selected' : ''}>${label}</option>`).join('')}</select></label>`).join('');
  const events = [
    ...details.goals.map((item) => `${formatMatchClock(item.second)} · Gol: ${playerName(item.playerId)}`),
    ...details.cards.map((item) => `${formatMatchClock(item.second)} · Tarjeta ${item.type === 'red' ? 'roja' : 'amarilla'}: ${playerName(item.playerId)}`),
    ...details.injuries.map((item) => `${formatMatchClock(item.second)} · Lesión: ${playerName(item.playerId)}${item.note ? ` · ${item.note}` : ''}`),
    ...details.incidents.map((item) => `${formatMatchClock(item.second)} · Incidencia: ${playerName(item.playerId)}${item.note ? ` · ${item.note}` : ''}`),
  ];
  const comments = roleCanUseOwnerFeatures(state.role) ? `<label>Comentarios internos<textarea id="${prefix}-comments" maxlength="2000">${escapeHtml(details.comments)}</textarea></label><button class="save-live-comments secondary" data-prefix="${prefix}">Guardar comentarios</button>` : '';
  const scoreTeam = (name, score, team) => `<section class="score-team"><span>${escapeHtml(name)}</span><strong>${score}</strong><div><button type="button" class="score-step secondary" data-score-team="${team}" data-delta="-1" aria-label="Restar gol a ${escapeHtml(name)}">−</button><button type="button" class="score-step primary" data-score-team="${team}" data-delta="1" aria-label="Sumar gol a ${escapeHtml(name)}">+</button></div></section>`;
  return `<details class="match-log" open><summary>Marcador e incidencias</summary><div class="stadium-score">${scoreTeam(teams.home, homeScore, homeTeam)}<span class="score-separator">—</span>${scoreTeam(teams.away, awayScore, awayTeam)}</div><p class="meta match-venue">${teams.mySide === 'home' ? `${escapeHtml(myTeamName())} juega como local` : `${escapeHtml(myTeamName())} juega como visitante`}</p><div class="event-editor"><label>Jugador<select id="${prefix}-event-player">${options}</select></label><label>Tipo<select id="${prefix}-event-kind"><option value="goal">Gol (suma al marcador)</option><option value="yellow">Tarjeta amarilla</option><option value="red">Tarjeta roja</option><option value="injury">Lesión</option><option value="incident">Incidencia</option></select></label><label>Detalle<input id="${prefix}-event-note" maxlength="200" placeholder="Opcional"></label><button class="add-live-event primary" data-prefix="${prefix}">Registrar</button></div>${events.length ? `<ul class="plain-list event-list">${events.sort().map((text) => `<li>${escapeHtml(text)}</li>`).join('')}</ul>` : '<p class="meta">Sin goles, tarjetas, lesiones ni incidencias.</p>'}${comments}<details><summary>Motivo si alguien juega menos</summary><div class="reason-grid">${minuteReasons}</div></details></details>`;
}

function renderLive() {
  const root = $('#live-match');
  const eligible = state.matches.filter((match) => match.callupId && match.status !== 'finished').sort((a,b)=>a.date.localeCompare(b.date));
  if (!state.timer) {
    root.innerHTML = eligible.length ? `<label>Partido convocado<select id="live-select"><option value="">Selecciona…</option>${eligible.map((match) => `<option value="${match.id}">${escapeHtml(localDate(match.date))} · ${match.venue === 'away' ? 'Visitante' : 'Local'} · ${escapeHtml(match.opponent)}</option>`).join('')}</select></label><div class="form-row keeper-selectors"><label>Portero primer tiempo<select id="first-keeper" disabled><option value="">Selecciona el partido…</option></select></label><label>Portero segundo tiempo<select id="second-keeper" disabled><option value="">Selecciona el partido…</option></select></label></div><p class="meta">Puedes elegir a cualquier convocado como portero, aunque su ficha tenga otra posición.</p><div class="button-row"><button id="prepare-live" class="primary">Preparar partido</button></div>` : empty('Necesitas un partido con convocatoria para iniciar el control en vivo.');
    return;
  }
  const match = state.matches.find((item) => item.id === state.timer.matchId);
  const callup = state.callups.find((item) => item.id === match?.callupId);
  if (!match || !callup) { state.timer = null; return renderLive(); }
  const seconds = timerSeconds(); const config = FORMATS[callup.format];
  state.timer.phase ??= 'ready';
  // Durante la preparación, la pizarra es la fuente de la alineación.
  ensureLiveTactic();
  if (state.timer.phase === 'ready' && liveTactic) syncTimerFromLiveTactic();
  const phaseLabels = { ready: 'Preparado', first_half: '1.er tiempo', halftime: 'Descanso', second_half: state.timer.autoPaused ? '2.º tiempo pausado' : '2.º tiempo' };
  const actionLabels = { ready: 'Comienzo', first_half: 'Descanso', halftime: 'Segundo tiempo', second_half: 'Final del partido' };
  const fieldIds = state.timer.onField;
  const unlockBtn = (state.timer.phase === 'ready' && roleCanUseOwnerFeatures(state.role) && !state.timer.delegateUnlocked) ? '<button id="unlock-delegate" class="secondary">Enseñar al delegado</button>' : '';
  root.innerHTML = `${liveDetailsMarkup('owner', callup.availableIds, match)}<div class="live-clock"><span class="pill accent">${escapeHtml(matchTeams(match).home)} — ${escapeHtml(matchTeams(match).away)} · ${escapeHtml(callup.format)}</span><div id="clock" class="clock">${formatMatchClock(seconds)}</div><div id="half" class="half">${phaseLabels[state.timer.phase]} · auto-pausa 38:00/74:00</div><div class="button-row"><button id="advance-live" class="${state.timer.phase === 'second_half' ? 'danger' : 'primary'}">${actionLabels[state.timer.phase]}</button>${unlockBtn}${roleCanUseOwnerFeatures(state.role) ? '<button id="open-delegate" class="secondary">Vista Delegado</button><button id="exit-live" class="danger">Salir sin finalizar</button>' : ''}</div>${targetSummaryMarkup()}</div>
  <div id="live-tactics"></div>
  ${fieldBenchMarkup(fieldIds, callup, config)}
  <div class="button-row"><button id="make-sub" class="primary">Registrar cambio manual (1–7 jugadores)</button><button id="owner-auto-sub" class="secondary">Automático (1–3)</button><button id="propose-reparto" class="secondary">Proponer reparto</button></div><p class="meta">Selecciona el mismo número de salidas y entradas. El reloj parado conserva los minutos.</p>`;
  renderLiveTactics();
  startTicks();
}

// ===== Pizarra táctica en vivo (Fase A) =====
// Guía de planteamiento para Migue y el delegado: asigna jugadores REALES a las
// posiciones, mueve fichas/balón/flechas y ve el GIF/MP4 de la táctica. NO toca
// el motor de cambios automáticos (renderLive/renderDelegate/applySubstitution).

function liveTacticPlayers() { return state.players; }
function liveTacticAvailableIds() {
  const match = state.matches.find(({ id }) => id === state.timer?.matchId);
  const callup = state.callups.find(({ id }) => id === match?.callupId);
  return callup?.availableIds ?? [];
}

// Sincroniza la pizarra con el motor de cambios sin duplicados, manteniendo el
// portero correspondiente en la posición Portero.
function syncLiveTacticFromTimer() {
  if (!state.timer || !liveTactic) return;
  liveTactic.drag = null; // un cambio de alineación da por terminado cualquier arrastre en curso
  const keeper = state.timer.phase === 'second_half' ? state.timer.secondKeeper : state.timer.firstKeeper;
  const field = (state.timer.onField || []).filter((id) => id !== keeper && !liveKeeperIds().includes(id));
  let i = 0;
  liveTactic.team = liveTactic.team.map((p) => ({ ...p, playerId: p.pos === 'Portero' ? keeper : (field[i++] || '') }));
}

// Sincroniza el motor (state.timer.onField) con la pizarra. En preparación la
// pizarra manda sin eventos; en partido en marcha registra un evento de cambio
// para que los minutos se calculen bien.
function syncTimerFromLiveTactic() {
  if (!state.timer || !liveTactic) return;
  const newField = liveTactic.team.map((p) => p.playerId).filter(Boolean);
  const oldField = state.timer.onField || [];
  const same = newField.length === oldField.length && newField.every((id, i) => id === oldField[i]);
  if (same) return;
  if (state.timer.phase === 'ready') {
    state.timer.onField = newField;
    return;
  }
  const outIds = oldField.filter((id) => !newField.includes(id));
  const inIds = newField.filter((id) => !oldField.includes(id));
  if (outIds.length || inIds.length) {
    state.timer.events.push({ second: timerSeconds(), outIds, inIds });
    state.timer.onField = newField;
  }
}

// Garantiza que la pizarra en vivo exista (la construye si aún no está), para
// poder sincronizar "En campo/Banquillo" con ella desde el primer render.
function ensureLiveTactic() {
  if (liveTactic) return liveTactic;
  if (!state.timer) return null;
  const availableIds = liveTacticAvailableIds();
  if (!availableIds.length) return null;
  liveTactic = buildLiveState(state.players, availableIds, '1-3-2-1', 'F7', state.timer.firstKeeper);
  return liveTactic;
}

// Markup de "En campo" y "Suplentes" (vista owner), ordenados de más a menos jugados.
function fieldBenchMarkup(fieldIds, callup, config) {
  const byPlayed = (a, b) => (livePlayerSeconds(b) ?? 0) - (livePlayerSeconds(a) ?? 0);
  const fieldSorted = [...fieldIds].sort(byPlayed);
  const benchSorted = callup.availableIds.filter((id) => !fieldIds.includes(id)).sort(byPlayed);
  return `<div class="live-grid"><div class="panel on-field"><h3>En campo (${fieldIds.length}/${config.players})</h3><div class="check-list">${fieldSorted.map((id) => `<div class="check-row"><label><input type="checkbox" name="sub-out" value="${id}"><span>${escapeHtml(playerName(id))}</span></label><strong data-player-clock="${id}">${formatMatchClock(livePlayerSeconds(id))}</strong></div>`).join('')}</div></div><div class="panel bench"><h3>Suplentes</h3><div class="check-list">${benchSorted.map((id) => `<div class="check-row"><label><input type="checkbox" name="sub-in" value="${id}"><span>${escapeHtml(playerName(id))}</span></label><strong data-player-clock="${id}">${formatMatchClock(livePlayerSeconds(id))}</strong></div>`).join('')}</div></div></div>`;
}

// Re-renderiza solo "En campo" y "Banquillo" sin reconstruir la pizarra.
function renderFieldBench() {
  const match = state.matches.find((item) => item.id === state.timer?.matchId);
  const callup = state.callups.find((item) => item.id === match?.callupId);
  if (!match || !callup) return;
  const grid = $('#live-match .live-grid');
  if (grid) grid.outerHTML = fieldBenchMarkup(state.timer.onField, callup, FORMATS[callup.format]);
}

// Alcance de la pizarra: 'owner' (vista de Migue) o 'delegate' (vista delegado).
// Ambas comparten la misma lógica y las MISMAS clases CSS (para que el estilo
// aplique a las dos); solo cambian los IDs del DOM (para distinguirlas) y el estado.
function liveScope(which) {
  const d = which === 'delegate';
  const p = d ? 'delegate-tactics' : 'live-tactics';
  return {
    which,
    p,
    state: () => liveTactic,
    setState: (s) => { liveTactic = s; },
    root: () => $(`#${p}`),
    board: () => $(`#${p}-board`),
    boardFull: () => $(`#${p}-board-full`),
    tools: () => $(`#${p}-tools`),
    toolsFull: () => $(`#${p}-tools-full`),
    slots: () => $(`#${p}-slots`),
    popup: () => $(`#${p}-popup`),
    popupSelect: () => $(`#${p}-popup-select`),
    popupTitle: () => $(`#${p}-popup-title`),
    lightbox: () => $(`#${p}-lightbox`),
    fullBtn: () => $(`#${p}-full`),
    gifBtn: () => $(`#${p}-gif`),
    formacion: () => $(`#${p}-formacion`),
  };
}

function renderLiveTactics() { renderTacticsBoard('owner'); }
function renderDelegateTactics() { renderTacticsBoard('delegate'); }

function renderTacticsBoard(which) {
  const sc = liveScope(which);
  const root = sc.root();
  if (!root) return;
  if (!state.timer) { root.innerHTML = ''; sc.setState(null); return; }
  const availableIds = liveTacticAvailableIds();
  if (!availableIds.length) { root.innerHTML = ''; sc.setState(null); return; }
  const t = sc.state();
  // No reconstruir a mitad de un arrastre (el re-render de 10 s no debe romperlo).
  if (t?.drag) return;
  if (!t) {
    sc.setState(ensureLiveTactic());
  }
  const cur = sc.state();
  const formacionOptions = LIVE_FORMATIONS.map((f) => `<option value="${f}" ${f === cur.formacion ? 'selected' : ''}>${f}</option>`).join('');
  root.innerHTML = `
    <article class="panel live-tactics">
      <div class="section-head"><div><p class="eyebrow">Planteamiento</p><h3>Pizarra táctica en vivo</h3></div><button type="button" class="secondary live-tactics-full" id="${sc.p}-full">⛶ Ampliar</button></div>
      <div class="formacion-row"><label for="${sc.p}-formacion">Táctica:</label><select id="${sc.p}-formacion">${formacionOptions}</select></div>
      <div class="board-wrap"><svg id="${sc.p}-board" viewBox="0 0 100 100" role="img" aria-label="Pizarra táctica en vivo"></svg></div>
      <div class="tactic-tools live-tactics-tools" id="${sc.p}-tools" role="toolbar" aria-label="Herramientas de la pizarra en vivo"></div>
      <div class="live-tactics-slots" id="${sc.p}-slots"></div>
      <div class="keeper-note"><strong>Regla del portero:</strong> 1 portero juega el partido completo; si hay 2 porteros, un tiempo cada uno. Migue y el delegado pueden cambiar al portero a mano en caso de causa mayor.</div>
      <div class="button-row"><button type="button" class="primary live-tactics-gif" id="${sc.p}-gif">▶ Ver táctica (GIF/MP4)</button></div>
      <div class="live-tactics-legend compact"><strong>Leyenda:</strong><span><i class="dot mi"></i>equipo</span><span><i class="dot rival"></i>rival</span><span><i class="dot ball"></i>balón</span><span>arrastrar = mover</span><span>toque = elegir jugador</span></div>
    </article>
    <div class="popup live-tactics-popup" id="${sc.p}-popup"><h4 class="live-tactics-popup-title" id="${sc.p}-popup-title">Posición</h4><select class="live-tactics-popup-select" id="${sc.p}-popup-select"></select></div>
    <div class="lightbox live-tactics-lightbox live-tactics" id="${sc.p}-lightbox"><button type="button" class="lb-close" title="Cerrar">✕</button><div class="lb-board" style="display:none;flex-direction:column;align-items:center;gap:.5rem;width:100%"><svg id="${sc.p}-board-full" viewBox="0 0 100 100" role="img" aria-label="Pizarra táctica ampliada" style="background:#0c3b2e;border-radius:8px;touch-action:none"></svg><div class="tactic-tools live-tactics-tools-full" id="${sc.p}-tools-full" role="toolbar" aria-label="Herramientas de la pizarra ampliada"></div></div><div class="lb-controls"><button type="button" class="lb-play" title="Reproducir / Pausar">▶</button><div class="speed"><button type="button" data-s="2" class="on">1×</button><button type="button" data-s="4">2×</button><button type="button" data-s="8">4×</button></div></div></div>`;
  renderTacticsBoardSvg(sc);
  renderTacticsSlots(sc);
  renderTacticsTools(sc);
  bindTacticsBoard(sc, sc.board());
  bindTacticsBoard(sc, sc.boardFull());
  wireTacticsBoard(sc);
}

function renderTacticsTools(sc) {
  const t = sc.state();
  if (!t) return;
  const markup = TACTIC_TOOLS.map(({ id, label }) => `<button type="button" class="tactic-tool ${id === t.tool ? 'active' : ''}" data-live-tool="${id}" title="${label}">${renderTacticToolIcon(id)}<span class="tactic-tool-label">${label}</span></button>`).join('');
  const normal = sc.tools();
  const full = sc.toolsFull();
  if (normal) normal.innerHTML = markup;
  if (full) full.innerHTML = markup;
}

function renderTacticsBoardSvg(sc, target) {
  const t = sc.state();
  const svg = target || sc.board();
  if (!svg || !t) return;
  const markerId = `arrow-${svg.id}`;
  const parts = [renderTacticArrowDefs(markerId)];
  parts.push('<rect class="tac-field" x="4" y="4" width="92" height="92" rx="3"/>');
  parts.push('<path class="tac-line" d="M50 4v92 M4 50h92"/>');
  parts.push('<circle class="tac-line" cx="50" cy="50" r="9"/>');
  parts.push('<rect class="tac-area" x="4" y="4" width="92" height="16"/>');
  parts.push('<rect class="tac-area" x="4" y="80" width="92" height="16"/>');
  parts.push('<rect class="tac-goal" x="40" y="4" width="20" height="4"/>');
  parts.push('<rect class="tac-goal" x="40" y="92" width="20" height="4"/>');
  t.moves.forEach((m, i) => parts.push(renderTacticArrow(m.from, m.to, m.kind, markerId, i)));
  t.team.forEach((p, i) => {
    const pl = playerById(state.players, p.playerId);
    const dorsal = pl ? pl.number : p.n;
    const label = pl ? nombreCorto(pl.name) : '';
    const labelW = label ? label.length * 1.6 + 1.6 : 0;
    const rectX = p.x - labelW / 2;
    const rectY = p.y + 2.1;
    const rectH = 3.0;
    parts.push(`<g class="tac-player" data-piece="team" data-idx="${i}"><circle cx="${p.x}" cy="${p.y}" r="4.2"/><text x="${p.x}" y="${p.y - 0.4}" class="num">${escapeHtml(dorsal)}</text>${label ? `<rect x="${rectX}" y="${rectY}" width="${labelW}" height="${rectH}" rx="0.6" fill="#000"/><text x="${p.x}" y="${p.y + 3.6}" class="name">${escapeHtml(label)}</text>` : ''}</g>`);
  });
  t.opponent.forEach((p, i) => {
    parts.push(`<g class="tac-opponent" data-piece="opponent" data-idx="${i}"><circle cx="${p.x}" cy="${p.y}" r="4.0"/><text x="${p.x}" y="${p.y + 1.3}" class="tac-opp-num">${escapeHtml(p.n)}</text></g>`);
  });
  parts.push(`<g class="tac-ball" data-piece="ball"><circle cx="${t.ball.x}" cy="${t.ball.y}" r="2.4" fill="#fff" stroke="#111" stroke-width="0.6"/></g>`);
  svg.innerHTML = parts.join('');
}

function renderTacticsSlots(sc) {
  const container = sc.slots();
  const t = sc.state();
  if (!container || !t) return;
  const availableIds = liveTacticAvailableIds();
  const suplentesList = suplentes(state.players, availableIds, t.team);
  const filas = t.team.map((p, i) => {
    const pl = playerById(state.players, p.playerId);
    const { titulares: tt, suplentes: ss } = opcionesPosicion(state.players, availableIds, t.team, p.pos, p.playerId);
    const opts = ['<option value="">— Sin asignar —</option>'];
    for (const x of tt) opts.push(`<option value="${x.id}" ${x.id === p.playerId ? 'selected' : ''}>${escapeHtml(x.number)} ${escapeHtml(x.name)}</option>`);
    if (ss.length) {
      opts.push('<option disabled>— Suplentes —</option>');
      for (const x of ss) opts.push(`<option value="${x.id}" ${x.id === p.playerId ? 'selected' : ''}>${escapeHtml(x.number)} ${escapeHtml(x.name)} (Suplente)</option>`);
    }
    return `<div class="slot"><span class="pos">${escapeHtml(p.pos)}</span><select data-idx="${i}">${opts.join('')}</select><span class="dorsal">${pl ? escapeHtml(pl.number) : '—'}</span></div>`;
  }).join('');
  const suplentesHTML = suplentesList.length
    ? `<div class="suplentes"><h4>SUPLENTES</h4><div class="suplente-list">${suplentesList.map((pl) => `<span class="suplente">${escapeHtml(pl.number)} ${escapeHtml(pl.name)}</span>`).join('')}</div></div>`
    : '';
  container.innerHTML = filas + suplentesHTML;
  container.querySelectorAll('select').forEach((sel) => {
    sel.addEventListener('change', () => {
      const slot = sc.state().team[Number(sel.dataset.idx)];
      if (!canAssignPlayerToSlot(state.players, sc.which, slot.pos, sel.value)) return renderTacticsSlots(sc);
      sc.setState({ ...sc.state(), team: asignarJugador(sc.state().team, Number(sel.dataset.idx), sel.value) });
      renderTacticsSlots(sc); renderTacticsBoardSvg(sc); renderTacticsBoardSvg(sc, sc.boardFull());
      if (sc.which === 'owner') { syncTimerFromLiveTactic(); renderFieldBench(); }
    });
  });
}

function tacticsBoardPoint(svg, e) {
  const rect = svg.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  return { x: Math.max(4, Math.min(96, x)), y: Math.max(4, Math.min(96, y)) };
}

function openTacticsPopup(sc, idx, clientX, clientY) {
  const popup = sc.popup();
  const select = sc.popupSelect();
  const title = sc.popupTitle();
  const t = sc.state();
  if (!popup || !select || !title || !t) return;
  const p = t.team[idx];
  const availableIds = liveTacticAvailableIds();
  const { titulares: tt, suplentes: ss } = opcionesPosicion(state.players, availableIds, t.team, p.pos, p.playerId);
  const opts = ['<option value="">— Sin asignar —</option>'];
  for (const x of tt) opts.push(`<option value="${x.id}">${escapeHtml(x.number)} ${escapeHtml(x.name)}</option>`);
  if (ss.length) {
    opts.push('<option disabled>— Suplentes —</option>');
    for (const x of ss) opts.push(`<option value="${x.id}">${escapeHtml(x.number)} ${escapeHtml(x.name)} (Suplente)</option>`);
  }
  title.textContent = p.pos;
  select.innerHTML = opts.join('');
  select.value = p.playerId;
  popup.dataset.idx = idx;
  popup.classList.add('open');
  const w = 240, h = 120;
  popup.style.left = Math.min(window.innerWidth - w - 10, Math.max(10, clientX - w / 2)) + 'px';
  popup.style.top = Math.min(window.innerHeight - h - 10, Math.max(10, clientY - h - 10)) + 'px';
}

function bindTacticsBoard(sc, svg) {
  if (!svg || svg.dataset._liveBound) return;
  svg.dataset._liveBound = '1';
  svg.addEventListener('pointerdown', (e) => {
    const t = sc.state();
    if (!t) return;
    const target = e.target.closest('[data-piece]');
    const pt = tacticsBoardPoint(svg, e);
    if (t.tool === 'select') {
      if (target && target.dataset.piece === 'team') {
        const idx = Number(target.dataset.idx);
        t.drag = { type: 'team', idx, moved: false };
      } else if (target && target.dataset.piece === 'opponent') {
        t.drag = { type: 'opponent', idx: Number(target.dataset.idx) };
      } else if (target && target.dataset.piece === 'ball') {
        t.drag = { type: 'ball' };
      }
    } else if (t.tool === 'ball') {
      t.ball = pt; renderTacticsBoardSvg(sc); renderTacticsBoardSvg(sc, sc.boardFull());
    } else if (t.tool === 'erase') {
      // Borrar una flecha concreta pinchándola.
      if (target && target.dataset.piece === 'arrow' && target.dataset.idx !== undefined) {
        const idx = Number(target.dataset.idx);
        t.moves = t.moves.filter((_, i) => i !== idx);
        renderTacticsBoardSvg(sc); renderTacticsBoardSvg(sc, sc.boardFull());
      }
    } else if (t.tool === 'clear') {
      // Borrar todas las flechas de golpe.
      t.moves = [];
      renderTacticsBoardSvg(sc); renderTacticsBoardSvg(sc, sc.boardFull());
    } else {
      t.drag = { type: 'arrow', from: pt, kind: t.tool };
    }
    svg.setPointerCapture(e.pointerId);
  });
  svg.addEventListener('pointermove', (e) => {
    const t = sc.state();
    if (!t || !t.drag) return;
    const pt = tacticsBoardPoint(svg, e);
    if (t.drag.type === 'team') { t.team[t.drag.idx].x = pt.x; t.team[t.drag.idx].y = pt.y; t.drag.moved = true; renderTacticsBoardSvg(sc); renderTacticsBoardSvg(sc, sc.boardFull()); }
    else if (t.drag.type === 'opponent') { t.opponent[t.drag.idx].x = pt.x; t.opponent[t.drag.idx].y = pt.y; renderTacticsBoardSvg(sc); renderTacticsBoardSvg(sc, sc.boardFull()); }
    else if (t.drag.type === 'ball') { t.ball = pt; renderTacticsBoardSvg(sc); renderTacticsBoardSvg(sc, sc.boardFull()); }
    else if (t.drag.type === 'arrow') { t.drag.to = pt; }
  });
  svg.addEventListener('pointerup', (e) => {
    const t = sc.state();
    if (!t) return;
    if (t.drag && t.drag.type === 'team' && !t.drag.moved) {
      openTacticsPopup(sc, t.drag.idx, e.clientX, e.clientY);
    }
    if (t.drag && t.drag.type === 'arrow' && t.drag.to) {
      if (Math.hypot(t.drag.to.x - t.drag.from.x, t.drag.to.y - t.drag.from.y) > 2) {
        t.moves.push({ from: t.drag.from, to: t.drag.to, kind: t.drag.kind });
      }
      renderTacticsBoardSvg(sc); renderTacticsBoardSvg(sc, sc.boardFull());
    }
    t.drag = null;
  });
}

function wireTacticsBoard(sc) {
  const formacion = sc.formacion();
  if (formacion) formacion.addEventListener('change', (e) => {
    const t = sc.state();
    if (!t) return;
    const team = cargarFormacion(t.team, state.players, liveTacticAvailableIds(), e.target.value, 'F7');
    sc.setState({ ...t, team, formacion: e.target.value, moves: [] });
    renderTacticsSlots(sc); renderTacticsBoardSvg(sc); renderTacticsBoardSvg(sc, sc.boardFull());
    if (sc.which === 'owner') { syncTimerFromLiveTactic(); renderFieldBench(); }
  });
  const tools = sc.tools();
  const toolsFull = sc.toolsFull();
  const setTool = (id) => {
    const t = sc.state();
    if (!t) return;
    t.tool = id;
    [tools, toolsFull].forEach((bar) => bar && bar.querySelectorAll('[data-live-tool]').forEach((b) => b.classList.toggle('active', b.dataset.liveTool === id)));
  };
  if (tools) tools.addEventListener('click', (e) => { const b = e.target.closest('[data-live-tool]'); if (b) setTool(b.dataset.liveTool); });
  if (toolsFull) toolsFull.addEventListener('click', (e) => { const b = e.target.closest('[data-live-tool]'); if (b) setTool(b.dataset.liveTool); });

  const popup = sc.popup();
  const popupSelect = sc.popupSelect();
  if (popupSelect) popupSelect.addEventListener('change', () => {
    const t = sc.state();
    if (!t) return;
    const idx = Number(popup.dataset.idx);
    popup.classList.remove('open');
    if (!canAssignPlayerToSlot(state.players, sc.which, t.team[idx].pos, popupSelect.value)) return;
    sc.setState({ ...t, team: asignarJugador(t.team, idx, popupSelect.value) });
    renderTacticsSlots(sc); renderTacticsBoardSvg(sc); renderTacticsBoardSvg(sc, sc.boardFull());
    if (sc.which === 'owner') { syncTimerFromLiveTactic(); renderFieldBench(); }
  });
  if (!liveTacticsDocBound) {
    liveTacticsDocBound = true;
    document.addEventListener('pointerdown', (e) => {
      const currentPopup = document.querySelector('.live-tactics-popup.open, .delegate-tactics-popup.open');
      if (currentPopup && !currentPopup.contains(e.target) && !e.target.closest('[data-piece="team"]')) currentPopup.classList.remove('open');
    });
  }

  // Lightbox compartido: pizarra ampliada (interactiva) o vídeo GIF/MP4.
  const lightbox = sc.lightbox();
  const lbBoard = lightbox?.querySelector('.lb-board');
  const lbControls = lightbox?.querySelector('.lb-controls');
  const fullBtn = sc.fullBtn();
  const gifBtn = sc.gifBtn();
  const closeLb = () => {
    lightbox.classList.remove('open');
    lightbox.querySelectorAll('video').forEach((v) => v.pause());
    if (lbBoard) lbBoard.style.display = 'none';
  };
  if (fullBtn) fullBtn.addEventListener('click', () => {
    if (lbControls) lbControls.style.display = 'none';
    lightbox.querySelectorAll('video').forEach((n) => n.remove());
    if (lbBoard) lbBoard.style.display = 'flex';
    renderTacticsBoardSvg(sc, sc.boardFull());
    lightbox.classList.add('open');
  });
  if (gifBtn) gifBtn.addEventListener('click', () => {
    const t = sc.state();
    if (!t) return;
    lightbox.querySelectorAll('video').forEach((n) => n.remove());
    if (lbBoard) lbBoard.style.display = 'none';
    if (lbControls) lbControls.style.display = 'flex';
    const video = document.createElement('video');
    video.src = TACTICA_MP4[t.formacion] || TACTICA_MP4['1-3-2-1'];
    video.playsInline = true; video.muted = true; video.loop = true;
    lightbox.appendChild(video);
    lightbox.classList.add('open');
    video.play();
  });
  lightbox.querySelector('.lb-close').addEventListener('click', closeLb);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });
  const lbPlay = lightbox.querySelector('.lb-play');
  if (lbPlay) lbPlay.addEventListener('click', () => {
    const video = lightbox.querySelector('video');
    if (!video) return;
    if (video.paused) { video.play(); lbPlay.textContent = '⏸'; } else { video.pause(); lbPlay.textContent = '▶'; }
  });
  lightbox.querySelectorAll('.speed button').forEach((b) => b.addEventListener('click', () => {
    const video = lightbox.querySelector('video');
    if (video) video.playbackRate = parseFloat(b.dataset.s);
    lightbox.querySelectorAll('.speed button').forEach((x) => x.classList.toggle('on', x === b));
  }));
}

function livePlayerSeconds(id) {
  if (!state.timer) return 0;
  return calculatePlayedSeconds(state.timer.initialOnField, state.timer.events, timerSeconds())[id] ?? 0;
}

function livePlayedSeconds() {
  if (!state.timer) return {};
  return calculatePlayedSeconds(state.timer.initialOnField, state.timer.events, timerSeconds());
}

function liveCallup() {
  const match = state.matches.find(({ id }) => id === state.timer?.matchId);
  return state.callups.find(({ id }) => id === match?.callupId) ?? null;
}

function liveKeeperIds() {
  const ids = [state.timer?.firstKeeper, state.timer?.secondKeeper].filter(Boolean);
  return [...new Set(ids)];
}

function liveTargets() {
  const callup = liveCallup();
  if (!callup?.availableIds?.length) return [];
  const config = FORMATS[callup.format];
  const keeperIds = keeperIdsFromCallup(callup);
  return calculateMinuteTargets(callup.availableIds, config.duration, config.players, keeperIds);
}

function liveTargetSummary() {
  const keepers = new Set(liveKeeperIds());
  const fieldTargets = liveTargets().filter((target) => !keepers.has(target.playerId));
  return summarizeMinuteTargets(fieldTargets);
}

function targetSummaryMarkup() {
  const summary = liveTargetSummary();
  if (!summary.length) return '';
  const parts = summary.map(({ minutes, count }) => `${count} × ${minutes} min`);
  return `<p class="target-summary"><strong>Minutos por jugador:</strong> ${parts.join(' · ')}</p>`;
}

function renderDelegate() {
  const root = $('#delegate-match');
  if (!root) return;
  if (!state.timer) {
    root.innerHTML = `${empty('No hay un partido en vivo. Migue debe prepararlo primero.')}${roleCanUseOwnerFeatures(state.role) ? '<button id="close-delegate" class="secondary">Volver</button>' : '<button id="logout" class="secondary">Cerrar sesión</button>'}`;
    return;
  }
  const match = state.matches.find(({ id }) => id === state.timer.matchId);
  const callup = state.callups.find(({ id }) => id === match?.callupId);
  if (!match || !callup) return;
  // El delegado solo ve el partido 20 min antes de la hora programada, o cuando
  // Migue lo desbloquea antes, o cuando ya ha empezado. Migue (owner) siempre lo ve.
  if (state.role === 'delegate' && !delegateCanSeeLive()) {
    root.innerHTML = `${empty('El partido en vivo estará disponible 20 minutos antes del inicio.')}<button id="logout" class="secondary">Cerrar sesión</button>`;
    return;
  }
  const config = FORMATS[callup.format];
  const seconds = timerSeconds();
  const played = livePlayedSeconds();
  const fieldIds = state.timer.onField;
  const benchIds = callup.availableIds.filter((id) => !fieldIds.includes(id));
  const suggestion = suggestDelegateSubstitution(fieldIds, benchIds, played, 1, liveKeeperIds());
  const suggestionText = suggestion.inIds.length
    ? `${playerName(suggestion.inIds[0])} ha jugado menos. Mételo y saca a ${playerName(suggestion.outIds[0])}.`
    : 'No hay jugadores disponibles entre los suplentes.';
  const row = (id, name) => `<div class="check-row"><label><input type="checkbox" name="${name}" value="${id}"><span>${escapeHtml(playerName(id))}</span></label><strong data-player-clock="${id}">${formatMatchClock(played[id] ?? 0)}</strong></div>`;
  const byPlayed = (a, b) => (played[b] ?? 0) - (played[a] ?? 0);
  const delegateFieldIds = [...fieldIds].sort(byPlayed);
  const delegateBenchIds = [...benchIds].sort(byPlayed);
  const actionLabels = { ready: 'Comienzo', first_half: 'Descanso', halftime: 'Segundo tiempo', second_half: 'Pausar al final y avisar a Migue' };
  root.innerHTML = `<div class="delegate-head"><div><p class="eyebrow">Cambios, tiempos e incidencias</p><h2>${escapeHtml(matchTeams(match).home)} — ${escapeHtml(matchTeams(match).away)}</h2></div>${roleCanUseOwnerFeatures(state.role) ? '<button id="close-delegate" class="secondary">Volver</button>' : '<button id="logout" class="secondary">Cerrar sesión</button>'}</div>${liveDetailsMarkup('delegate', callup.availableIds, match)}<div class="live-clock"><div id="delegate-clock" class="clock">${formatMatchClock(seconds)}</div><p>Auto-pausa a 38:00 y 74:00</p><button id="advance-live" class="${state.timer.phase === 'second_half' ? 'danger' : 'primary'}">${actionLabels[state.timer.phase] ?? 'Comienzo'}</button>${targetSummaryMarkup()}</div><article class="panel delegate-suggestion"><h3>¿Quién ha jugado menos?</h3><p>${escapeHtml(suggestionText)}</p>${suggestion.inIds.length ? '<button id="apply-delegate-suggestion" class="primary">Hacer este cambio</button>' : ''}</article><div id="delegate-tactics"></div><div class="live-grid"><div class="panel on-field"><h3>Sale del campo</h3>${delegateFieldIds.map((id) => row(id, 'delegate-out')).join('')}</div><div class="panel bench"><h3>Entra al campo</h3>${delegateBenchIds.map((id) => row(id, 'delegate-in')).join('')}</div></div><div class="delegate-actions"><button id="delegate-manual-sub" class="primary">Registrar cambio (1–7)</button><button id="delegate-auto-sub" class="secondary">Automático (1–3)</button><button id="delegate-propose-reparto" class="secondary">Proponer reparto</button></div><p class="meta">El modo automático elige a quienes menos han jugado y saca a quienes más minutos llevan. Siempre pide confirmación.</p>`;
  renderDelegateTactics();
}

function enterDelegateMode() {
  state.delegateMode = true;
  document.body.classList.add('delegate-mode');
  showView('delegado');
  renderDelegate();
}

// El delegado ve el partido en vivo 20 min antes de la hora programada, o cuando
// Migue lo desbloquea antes (delegateUnlocked), o cuando ya ha empezado.
function delegateCanSeeLive() {
  if (!state.timer) return false;
  if (state.timer.phase !== 'ready') return true; // ya empezado
  if (state.timer.delegateUnlocked) return true;   // Migue lo desbloqueó antes
  const match = state.matches.find(({ id }) => id === state.timer.matchId);
  if (!match?.date) return false;
  const kickoff = new Date(match.date).getTime();
  if (!Number.isFinite(kickoff)) return false;
  return Date.now() >= kickoff - 20 * 60 * 1000;
}

async function unlockDelegate() {
  if (!state.timer) return;
  state.timer.delegateUnlocked = true;
  await persistTimer();
  renderLive();
  toast('El delegado ya puede ver el partido en vivo.');
}

function closeDelegateMode() {
  state.delegateMode = false;
  document.body.classList.remove('delegate-mode');
  showView('partido');
}

async function cancelLiveMatch() {
  if (!state.timer || !await askConfirmation({ title: 'Salir del partido en vivo', message: 'Se descartarán el reloj y los cambios registrados, pero no la convocatoria.', acceptLabel: 'Salir y descartar', danger: true })) return;
  state.timer = null;
  liveTactic = null;
  state.urgentAlertKey = '';
  clearInterval(state.tick);
  await put('settings', { id: 'live', timer: null });
  closeDelegateMode();
  renderLive();
  renderDelegate();
  toast('Has salido del partido. Ya puedes preparar otro.');
}

async function registerDelegateSubstitution(outIds, inIds) {
  const match = state.matches.find((item) => item.id === state.timer?.matchId);
  const callup = state.callups.find((item) => item.id === match?.callupId);
  const nextOnField = applySubstitution(state.timer.onField, outIds, inIds, callup.availableIds, 7);
  state.timer.events.push({ second: timerSeconds(), outIds, inIds, source: 'delegate' });
  state.timer.onField = nextOnField;
  syncLiveTacticFromTimer();
  state.urgentAlertKey = '';
  state.repartoAlertKey = '';
  await persistTimer();
  renderLive(); renderDelegate(); toast('Cambio del delegado registrado.');
}

async function proposeReparto() {
  const callup = liveCallup();
  if (!callup) return toast('No hay partido en vivo.');
  const played = livePlayedSeconds();
  const bench = callup.availableIds.filter((id) => !state.timer.onField.includes(id));
  const suggestion = suggestRepartoSubstitutions(state.timer.onField, bench, played, liveTargets(), liveKeeperIds());
  if (!suggestion.inIds.length) return toast('Todos los convocados ya alcanzan su objetivo de minutos.');
  const lines = suggestion.inIds.map((id, index) => `Entra ${playerName(id)} · sale ${playerName(suggestion.outIds[index])}`).join('\n');
  if (await askConfirmation({ title: `Reparto de minutos (${suggestion.inIds.length} cambios)`, message: lines, acceptLabel: 'Registrar cambios' })) {
    await registerDelegateSubstitution(suggestion.outIds, suggestion.inIds);
  }
}

function updateKeeperOptions(matchId) {
  const match = state.matches.find((item) => item.id === matchId);
  const callup = state.callups.find((item) => item.id === match?.callupId);
  const called = calledPlayerOptions(state.players, callup?.availableIds ?? []);
  const keepers = called.filter(({ id }) => normalizePositions(state.players.find((player) => player.id === id)).includes('Portero'));
  const options = keepers.map((player) => `<option value="${player.id}">${escapeHtml(player.name)}</option>`).join('');
  const first = $('#first-keeper');
  const second = $('#second-keeper');
  for (const select of [first, second]) {
    if (!select) continue;
    select.disabled = !keepers.length;
    select.innerHTML = keepers.length ? `<option value="">Selecciona…</option>${options}` : '<option value="">Sin porteros convocados</option>';
  }
  if (keepers.length === 1) {
    first.value = keepers[0].id;
    second.value = keepers[0].id;
  } else if (keepers.length >= 2) {
    first.value = keepers[0].id;
    second.value = keepers[1].id;
  }
}

async function prepareLive() {
  const match = state.matches.find((item) => item.id === $('#live-select').value); const callup = state.callups.find((item) => item.id === match?.callupId);
  if (!callup) return toast('Selecciona un partido.');
  const config = FORMATS[callup.format];
  if (callup.availableIds.length < config.players) return toast(`Faltan jugadores: ${callup.format} necesita ${config.players} en campo.`);
  const firstKeeper = $('#first-keeper').value;
  const secondKeeper = $('#second-keeper').value;
  if (!firstKeeper || !secondKeeper) return toast('Selecciona el portero de cada tiempo.');
  if (!callup.availableIds.includes(firstKeeper) || !callup.availableIds.includes(secondKeeper)) return toast('Los porteros deben estar convocados.');
  const initialOnField = [firstKeeper];
  liveTactic = null; // reinicia la pizarra para no arrastrar la alineación del partido anterior
  state.timer = { matchId: match.id, elapsed: 0, runningSince: null, phase: 'ready', initialOnField, onField: [...initialOnField], events: [], firstKeeper, secondKeeper, autoPaused: false, details: { goalsFor: 0, goalsAgainst: 0, goals: [], cards: [], injuries: [], incidents: [], comments: '', minuteReasons: {} } };
  await persistTimer(); renderLive();
}

async function persistTimer() {
  state.timer.updatedAt = Date.now();
  state.liveUpdatedAt = state.timer.updatedAt;
  await put('settings', { id: 'live', timer: state.timer, updatedAt: state.timer.updatedAt });
}
function startTicks() {
  clearInterval(state.tick);
  if (!state.timer?.runningSince) return;
  state.tick = setInterval(async () => {
    const seconds = timerSeconds();
    for (const clock of [$('#clock'), $('#delegate-clock')].filter(Boolean)) clock.textContent = formatMatchClock(seconds);
    const played = livePlayedSeconds();
    $$('[data-player-clock]').forEach((element) => { element.textContent = formatMatchClock(played[element.dataset.playerClock] ?? 0); });
    if (shouldAutoPause(state.timer.phase, seconds)) {
      state.timer.elapsed = state.timer.phase === 'first_half' ? 38 * 60 : 74 * 60;
      state.timer.runningSince = null;
      state.timer.autoPaused = true;
      if (state.timer.phase === 'first_half') state.timer.phase = 'halftime';
      await persistTimer();
      renderLive(); renderDelegate();
      return toast(state.timer.phase === 'halftime' ? 'Pausa automática al minuto 38.' : 'Pausa automática al minuto 74. Finaliza el partido cuando corresponda.');
    }
    maybeShowUrgentSubstitution(played, seconds);
    maybeShowMinuteAlert(played, seconds);
    maybeShowRepartoAlert(seconds);
  }, 1000);
}

function maybeShowRepartoAlert(elapsedSeconds) {
  if (!state.timer || state.timer.phase === 'halftime' || state.timer.phase === 'ready') return;
  const callup = liveCallup();
  if (!callup?.availableIds?.length) return;
  const config = FORMATS[callup.format];
  const remainingSeconds = Math.max(0, config.duration * 60 - elapsedSeconds);
  if (remainingSeconds > 10 * 60) return;
  const played = livePlayedSeconds();
  const bench = callup.availableIds.filter((id) => !state.timer.onField.includes(id));
  const suggestion = suggestRepartoSubstitutions(state.timer.onField, bench, played, liveTargets(), liveKeeperIds());
  if (!suggestion.inIds.length) return;
  const key = `${state.timer.events.length}:${suggestion.inIds.join(',')}`;
  if (state.repartoAlertKey === key) return;
  state.repartoAlertKey = key;
  toast(`Quedan ${Math.ceil(remainingSeconds / 60)} min: hay ${suggestion.inIds.length} cambio(s) pendientes para completar el reparto. Pulsa «Proponer reparto».`);
}

function maybeShowMinuteAlert(played, elapsedSeconds) {
  if (!state.timer || state.timer.phase === 'halftime' || state.timer.phase === 'ready') return;
  const minute = Math.floor(elapsedSeconds / 60);
  if (minute < 1 || minute % 5 !== 0) return;
  const alertKey = `min-${minute}`;
  if (state.timer.lastMinuteAlert === alertKey) return;
  state.timer.lastMinuteAlert = alertKey;
  const callup = state.callups.find(({ id }) => id === state.matches.find(({ id }) => id === state.timer.matchId)?.callupId);
  if (!callup) return;
  const onField = state.timer.onField;
  const bench = callup.availableIds.filter((id) => !onField.includes(id));
  const least = [...onField, ...bench].sort((a, b) => (played[a] ?? 0) - (played[b] ?? 0));
  const low = least.filter((id) => (played[id] ?? 0) < minute * 60 - 5 * 60).slice(0, 3);
  if (!low.length) return;
  toast(`Minuto ${minute}: ${low.map((id) => `${playerName(id)} (${Math.floor((played[id] ?? 0) / 60)} min)`).join(', ')} ha(n) jugado menos.`);
}

function maybeShowUrgentSubstitution(played, elapsedSeconds) {
  if (!state.delegateMode || !state.timer || state.timer.phase === 'halftime') return;
  const match = state.matches.find(({ id }) => id === state.timer.matchId);
  const callup = state.callups.find(({ id }) => id === match?.callupId);
  if (!callup) return;
  const config = FORMATS[callup.format];
  const benchIds = callup.availableIds.filter((id) => !state.timer.onField.includes(id));
  const remainingSeconds = Math.max(0, config.duration * 60 - elapsedSeconds);
  if (!shouldSuggestUrgentSubstitution(benchIds, played, remainingSeconds)) return;
  const suggestion = suggestDelegateSubstitution(state.timer.onField, benchIds, played, 1, liveKeeperIds());
  const key = `${state.timer.events.length}:${suggestion.inIds[0] ?? ''}`;
  if (!suggestion.inIds.length || state.urgentAlertKey === key) return;
  state.urgentAlertKey = key;
  $('#urgent-message').textContent = `${playerName(suggestion.inIds[0])} lleva ${Math.floor((played[suggestion.inIds[0]] ?? 0) / 60)} min y quedan ${Math.ceil(remainingSeconds / 60)}. Puede entrar por ${playerName(suggestion.outIds[0])}.`;
  $('#urgent-dialog').showModal();
}
async function advanceLivePhase() {
  if (state.timer.phase === 'ready') {
    const callup = liveCallup();
    const config = FORMATS[callup.format];
    const lineup = (liveTactic?.team || []).map((p) => p.playerId).filter(Boolean);
    if (lineup.length !== config.players || new Set(lineup).size !== config.players || !lineup.includes(state.timer.firstKeeper)) {
      return toast(`Completa la alineación de ${config.players} jugadores con el portero antes de comenzar.`);
    }
    state.timer.initialOnField = [...lineup];
    state.timer.onField = [...lineup];
    state.timer.phase = 'first_half';
    state.timer.runningSince = Date.now();
    await persistTimer();
    renderLive(); renderDelegate();
    return toast('Partido en marcha.');
  }
  if (state.timer.phase === 'first_half') {
    state.timer.elapsed = timerSeconds();
    state.timer.runningSince = null;
    state.timer.phase = 'halftime';
    state.timer.autoPaused = false;
    await persistTimer();
    renderLive(); renderDelegate();
    return toast('Primer tiempo finalizado. Descanso.');
  }
  if (state.timer.phase === 'halftime') {
    const { firstKeeper, secondKeeper } = state.timer;
    // Fase B: aplica la alineación del 2º tiempo ajustada en la pizarra (quién entra/sale).
    syncTimerFromLiveTactic();
    if (secondKeeper && firstKeeper !== secondKeeper && !state.timer.onField.includes(secondKeeper)) {
      const keeperOut = state.timer.onField.includes(firstKeeper) ? firstKeeper : state.timer.onField.find((id) => normalizePositions(state.players.find((player) => player.id === id)).includes('Portero'));
      if (keeperOut) {
        state.timer.events.push({ second: state.timer.elapsed, outIds: [keeperOut], inIds: [secondKeeper], source: 'goalkeeper_rotation' });
        state.timer.onField = applySubstitution(state.timer.onField, [keeperOut], [secondKeeper], state.callups.find((callup) => callup.id === state.matches.find((match) => match.id === state.timer.matchId)?.callupId).availableIds, 7);
        ensureLiveDetails().minuteReasons[keeperOut] = 'goalkeeper_rotation';
        ensureLiveDetails().minuteReasons[secondKeeper] = 'goalkeeper_rotation';
      }
    }
    state.timer.phase = 'second_half';
    state.timer.runningSince = Date.now();
    state.timer.autoPaused = false;
    syncLiveTacticFromTimer();
    await persistTimer();
    renderLive(); renderDelegate();
    return toast('Segundo tiempo en marcha.');
  }
  return finishMatch();
}

async function makeSubstitution() {
  const outIds = checkedValues('sub-out'); const inIds = checkedValues('sub-in');
  const match = state.matches.find((item) => item.id === state.timer.matchId);
  const callup = state.callups.find((item) => item.id === match?.callupId);
  try {
    const nextOnField = applySubstitution(state.timer.onField, outIds, inIds, callup.availableIds, 7);
    const second = timerSeconds();
    state.timer.events.push({ second, outIds, inIds });
    state.timer.onField = nextOnField;
    syncLiveTacticFromTimer();
    await persistTimer(); renderLive(); toast('Cambio registrado.');
  } catch (error) { toast(error.message); }
}

async function finishMatch() {
  if (state.finishing || !state.timer) return;
  if (state.timer.runningSince) {
    state.timer.elapsed = timerSeconds();
    state.timer.runningSince = null;
    await persistTimer();
  }
  if (!roleCanUseOwnerFeatures(state.role)) {
    renderLive(); renderDelegate();
    return toast('Partido pausado. Solo Migue puede finalizarlo.');
  }
  state.finishing = true;
  try {
    const totals = calculatePlayedSeconds(state.timer.initialOnField, state.timer.events, state.timer.elapsed);
    const match = state.matches.find((item) => item.id === state.timer.matchId); const callup = state.callups.find((item) => item.id === match.callupId);
    const details = ensureLiveDetails();
    const maximum = Math.max(...Object.values(totals));
    const missingReason = callup.availableIds.find((id) => (totals[id] ?? 0) < maximum && !details.minuteReasons[id]);
    if (missingReason) details.minuteReasons[missingReason] = 'sin_indicar';
    const players = state.players.filter(({ id }) => callup.availableIds.includes(id));
    const updatedPlayers = players.map((player) => accumulateSeasonMinutes(player, match.date, totals[player.id] ?? 0, { matchId: match.id, reason: details.minuteReasons[player.id], preseason: isPreseasonMatch(match) }));
    const completedMatch = { ...match, status: 'finished', playedSeconds: state.timer.elapsed, minuteTotals: totals, ratings: match.ratings ?? null, substitutionEvents: state.timer.events, goalsFor: details.goalsFor, goalsAgainst: details.goalsAgainst, goals: details.goals, cards: details.cards, injuries: details.injuries, incidents: details.incidents, comments: details.comments, minuteReasons: details.minuteReasons, goalkeeperRotation: { firstKeeper: state.timer.firstKeeper, secondKeeper: state.timer.secondKeeper }, finishedAt: Date.now() };
    const existingAttendance = state.trainings.find((record) => record.kind === 'match' && record.matchId === match.id);
    const trainingRecords = [];
    if (!existingAttendance) {
      const values = { date: match.date.slice(0, 10), notes: 'Registro creado automáticamente al finalizar el partido.' };
      for (const id of callup.availableIds) values[`status-${id}`] = 'present';
      trainingRecords.push(buildAttendanceRecord(
        state.players.filter(({ id }) => callup.availableIds.includes(id)),
        values,
        { id: uid(), kind: 'match', matchId: match.id, createdAt: Date.now() },
      ));
    }
    await putBatch({ players: updatedPlayers, matches: [completedMatch], trainings: trainingRecords, settings: [{ id: 'live', timer: null, updatedAt: Date.now() }] });
    state.timer = null; clearInterval(state.tick); liveTactic = null; await refresh();
    closeDelegateMode(); showView('partido');
    toast('Partido finalizado. Puedes puntuar a los jugadores desde el detalle del partido cuando quieras.');
  } finally {
    state.finishing = false;
  }
}

async function saveMatchRatings(event) {
  event.preventDefault();
  if (state.finishing) return;
  if (state.ratingMatchId) return saveRateMatch(event);
  if (!state.timer) return;
  state.finishing = true;
  try {
  const totals = calculatePlayedSeconds(state.timer.initialOnField, state.timer.events, state.timer.elapsed);
  const match = state.matches.find((item) => item.id === state.timer.matchId); const callup = state.callups.find((item) => item.id === match.callupId);
  const details = ensureLiveDetails();
  const players = state.players.filter(({ id }) => callup.availableIds.includes(id));
  const values = formObject(event.target.closest('form'));
  const ratingValues = Object.fromEntries(players.map(({ id }) => [id, values[`rating-${id}`]]));
  const rated = buildPlayerRatings(players, ratingValues, { role: state.role, matchId: match.id, date: match.date, opponent: match.opponent });
  const updatedPlayers = rated.players.map((player) => accumulateSeasonMinutes(player, match.date, totals[player.id] ?? 0, { matchId: match.id, reason: details.minuteReasons[player.id], preseason: isPreseasonMatch(match) }));
  const completedMatch = { ...match, status: 'finished', playedSeconds: state.timer.elapsed, minuteTotals: totals, ratings: rated.ratings, substitutionEvents: state.timer.events, goalsFor: details.goalsFor, goalsAgainst: details.goalsAgainst, goals: details.goals, cards: details.cards, injuries: details.injuries, incidents: details.incidents, comments: details.comments, minuteReasons: details.minuteReasons, goalkeeperRotation: { firstKeeper: state.timer.firstKeeper, secondKeeper: state.timer.secondKeeper }, finishedAt: Date.now() };
  const existingAttendance = state.trainings.find((record) => record.kind === 'match' && record.matchId === match.id);
  const trainingRecords = [];
  if (!existingAttendance) {
    const values = { date: match.date.slice(0, 10), notes: 'Registro creado automáticamente al finalizar el partido.' };
    for (const id of callup.availableIds) values[`status-${id}`] = 'present';
    trainingRecords.push(buildAttendanceRecord(
      state.players.filter(({ id }) => callup.availableIds.includes(id)),
      values,
      { id: uid(), kind: 'match', matchId: match.id, createdAt: Date.now() },
    ));
  }
  await putBatch({ players: updatedPlayers, matches: [completedMatch], trainings: trainingRecords, settings: [{ id: 'live', timer: null, updatedAt: Date.now() }] });
  $('#rating-dialog').close();
  state.timer = null; clearInterval(state.tick); await refresh();
  closeDelegateMode(); showView('partido');
  toast(`Partido y puntuaciones guardados. Temporada ${seasonKey(match.date)} actualizada.`);
  } finally {
    state.finishing = false;
  }
}

function openRateMatch(matchId) {
  const match = state.matches.find((item) => item.id === matchId);
  if (!match) return;
  if (!roleCanUseOwnerFeatures(state.role)) return toast('Solo Migue puede puntuar a los jugadores.');
  const callup = state.callups.find((item) => item.id === match.callupId);
  const players = state.players.filter(({ id }) => (callup?.availableIds ?? []).includes(id));
  if (!players.length) return toast('Este partido no tiene convocados para puntuar.');
  state.ratingMatchId = matchId;
  $('#rating-match-name').textContent = `Puntuación contra ${match.opponent}`;
  $('#rating-players').innerHTML = players.map((player) => {
    const current = match.ratings?.[player.id];
    return `<label>${escapeHtml(player.name)}<select name="rating-${player.id}" required><option value="">Selecciona…</option>${[1, 2, 3, 4, 5].map((rating) => `<option value="${rating}" ${Number(current) === rating ? 'selected' : ''}>${rating}</option>`).join('')}</select></label>`;
  }).join('');
  $('#match-detail-dialog').close();
  $('#rating-dialog').showModal();
}

async function saveRateMatch(event) {
  event.preventDefault();
  if (state.finishing) return;
  const matchId = state.ratingMatchId;
  const match = state.matches.find((item) => item.id === matchId);
  if (!match) return;
  state.finishing = true;
  try {
    const callup = state.callups.find((item) => item.id === match.callupId);
    const players = state.players.filter(({ id }) => (callup?.availableIds ?? []).includes(id));
    const values = formObject(event.target.closest('form'));
    const ratingValues = Object.fromEntries(players.map(({ id }) => [id, values[`rating-${id}`]]));
    const rated = replacePlayerRatings(players, ratingValues, { role: state.role, matchId: match.id, date: match.date, opponent: match.opponent });
    const updatedMatch = { ...match, ratings: rated.ratings };
    await putBatch({ players: rated.players, matches: [updatedMatch] });
    $('#rating-dialog').close();
    state.ratingMatchId = null;
    await refresh();
    toast('Puntuaciones guardadas.');
  } finally {
    state.finishing = false;
  }
}

async function saveMatch(event) {
  event.preventDefault(); const form = event.currentTarget; const values = formObject(form); const existing = values.id ? await getOne('matches', values.id) : null;
  const goalsFor = values.goalsFor === '' ? null : Number(values.goalsFor); const goalsAgainst = values.goalsAgainst === '' ? null : Number(values.goalsAgainst);
  const date = composeDateTime24(composeDate(values.dateDay, values.dateMonth, values.dateYear), values.dateHour, values.dateMinute);
  await put('matches', { ...existing, id: values.id || uid(), date, round: values.round.trim(), type: values.type, venue: values.venue, opponent: values.opponent.trim(), location: values.location.trim(), goalsFor, goalsAgainst, status: (goalsFor !== null && goalsAgainst !== null) ? 'finished' : (existing?.status ?? 'planned'), createdAt: existing?.createdAt ?? Date.now() });
  form.closest('dialog').close(); form.reset(); await refresh(); toast('Partido guardado.');
}

function renderMatches() {
  const list = [...state.matches].sort((a,b)=>a.date.localeCompare(b.date));
  $('#matches-list').innerHTML = list.length ? list.map((match) => { const teams = matchTeams(match); const homeScore = teams.mySide === 'home' ? match.goalsFor : match.goalsAgainst; const awayScore = teams.mySide === 'away' ? match.goalsFor : match.goalsAgainst; const hasScore = Number.isFinite(match.goalsFor) && Number.isFinite(match.goalsAgainst); return `<article class="panel"><div class="section-head"><div><span class="pill ${match.status === 'finished' ? 'accent' : ''}">${match.status === 'finished' ? 'Finalizado' : 'Programado'}</span> <span class="pill type-${match.type}">${escapeHtml(matchTypeLabel(match.type))}</span> <span class="pill">${match.venue === 'away' ? 'Visitante' : 'Local'}</span><h3>${escapeHtml(teams.home)} — ${escapeHtml(teams.away)}</h3><p class="meta">${escapeHtml(localDate(match.date))}${match.round ? ` · Jornada ${escapeHtml(match.round)}` : ''}${match.location ? ` · ${escapeHtml(match.location)}` : ''}</p></div><div>${hasScore ? `<strong>${homeScore} — ${awayScore}</strong>` : ''}</div></div>${match.ratings ? `<details><summary>Minutos y puntuaciones</summary><table class="minute-table"><tr><th>Jugador</th><th>Min</th><th>1–5</th></tr>${Object.entries(match.minuteTotals ?? {}).map(([id, seconds]) => `<tr><td>${escapeHtml(playerName(id))}</td><td>${Math.round(seconds/60)}</td><td>${match.ratings[id] ?? '—'}</td></tr>`).join('')}</table></details>` : ''}<div class="button-row">${match.status !== 'finished' && !match.callupId ? `<button class="callup-match primary" data-id="${match.id}">Convocar</button>` : ''}<button class="match-detail secondary" data-id="${match.id}">Ver detalle</button><button class="edit-match secondary" data-id="${match.id}">Editar</button><button class="delete-match danger" data-id="${match.id}">Borrar</button></div></article>`; }).join('') : empty('Añade el calendario de partidos manualmente.');
}

function editMatch(id) {
  const match = state.matches.find((item) => item.id === id); if (!match) return;
  const form = $('#match-form');
  for (const key of ['id', 'round', 'type', 'venue', 'opponent', 'location', 'goalsFor', 'goalsAgainst']) form.elements[key].value = match[key] ?? (key === 'type' ? 'league' : key === 'venue' ? 'home' : '');
  setDateTimeFields(form, 'date', match.date);
  $('#match-dialog').showModal();
}

function showMatchDetail(id) {
  const match = state.matches.find((item) => item.id === id); if (!match) return;
  const teams = matchTeams(match);
  const homeScore = teams.mySide === 'home' ? match.goalsFor : match.goalsAgainst;
  const awayScore = teams.mySide === 'away' ? match.goalsFor : match.goalsAgainst;
  const callup = state.callups.find((item) => item.id === match.callupId);
  const availableIds = callup?.availableIds ?? [];
  const playerOptions = availableIds.map((pid) => `<option value="${pid}">${escapeHtml(playerName(pid))}</option>`).join('');
  const eventList = (items, label, kind) => {
    const list = (items ?? []).map((item, i) => `<li>${escapeHtml(playerName(item.playerId))}${item.note ? ` · ${escapeHtml(item.note)}` : ''} <button type="button" class="icon-button remove-match-event" data-kind="${kind}" data-index="${i}" aria-label="Quitar">×</button></li>`).join('');
    return `<section><h4>${label}</h4>${list ? `<ul class="plain-list">${list}</ul>` : '<p class="meta">Sin registros.</p>'}</section>`;
  };
  $('#match-detail-title').textContent = `${teams.home} — ${teams.away}`;
  $('#match-detail-dialog').dataset.matchId = match.id;
  $('#match-detail-body').innerHTML = `
    <p class="meta">${escapeHtml(localDate(match.date))}${match.round ? ` · Jornada ${escapeHtml(match.round)}` : ''} · ${escapeHtml(matchTypeLabel(match.type))} · ${match.venue === 'away' ? 'Visitante' : 'Local'}</p>
    <div class="stadium-score"><section class="score-team"><span>${escapeHtml(teams.home)}</span><strong>${homeScore ?? 0}</strong></section><span class="score-separator">—</span><section class="score-team"><span>${escapeHtml(teams.away)}</span><strong>${awayScore ?? 0}</strong></section></div>
    <div class="event-editor"><label>Jugador<select id="detail-event-player">${playerOptions || '<option value="">Sin convocados</option>'}</select></label><label>Tipo<select id="detail-event-kind"><option value="goal">Gol</option><option value="yellow">Tarjeta amarilla</option><option value="red">Tarjeta roja</option><option value="injury">Lesión</option><option value="incident">Incidencia</option></select></label><label>Detalle<input id="detail-event-note" maxlength="200" placeholder="Opcional"></label><button class="add-detail-event primary" data-id="${match.id}">Añadir</button></div>
    ${eventList(match.goals, 'Goles', 'goal')}
    ${eventList(match.cards, 'Tarjetas', 'card')}
    ${eventList(match.injuries, 'Lesiones', 'injury')}
    ${eventList(match.incidents, 'Incidencias', 'incident')}
    ${match.status === 'finished' ? `<div class="button-row"><button class="rate-match secondary" data-id="${match.id}">Puntuar jugadores</button><button class="reopen-match secondary" data-id="${match.id}">Reabrir partido (volver a jugarlo)</button></div>` : ''}
  `;
  $('#match-detail-dialog').showModal();
}

async function reopenMatch(id) {
  const match = state.matches.find((item) => item.id === id); if (!match) return;
  if (!await askConfirmation({ title: 'Reabrir partido', message: 'Se limpiarán los goles, tarjetas, lesiones y puntuaciones de este partido para poder volver a jugarlo. Los minutos y puntuaciones ya acumulados en las fichas de los jugadores no se revierten.', acceptLabel: 'Reabrir', danger: true })) return;
  await put('matches', { ...match, status: 'planned', goalsFor: null, goalsAgainst: null, goals: [], cards: [], injuries: [], incidents: [], ratings: null, minuteTotals: null, substitutionEvents: [], comments: '', minuteReasons: {} });
  await refresh();
  $('#match-detail-dialog').close();
  toast('Partido reabierto. Ya puedes prepararlo en vivo.');
}

async function addDetailEvent(matchId) {
  const match = state.matches.find((item) => item.id === matchId); if (!match) return;
  const playerId = $('#detail-event-player').value;
  const kind = $('#detail-event-kind').value;
  const note = $('#detail-event-note').value.trim();
  if (!playerId) return toast('Selecciona un jugador.');
  const next = { ...match };
  if (kind === 'goal') {
    next.goals = [...(next.goals ?? []), { playerId, note, second: 0 }];
    next.goalsFor = (Number(next.goalsFor) || 0) + 1;
  } else if (kind === 'injury') {
    next.injuries = [...(next.injuries ?? []), { playerId, note }];
  } else if (kind === 'incident') {
    next.incidents = [...(next.incidents ?? []), { playerId, note }];
  } else {
    next.cards = [...(next.cards ?? []), { playerId, note, type: kind }];
  }
  await put('matches', next);
  await refresh();
  showMatchDetail(matchId);
  toast('Incidencia añadida.');
}

async function removeMatchEvent(matchId, kind, index) {
  const match = state.matches.find((item) => item.id === matchId); if (!match) return;
  const next = { ...match };
  const field = kind === 'goal' ? 'goals' : kind === 'card' ? 'cards' : kind === 'injury' ? 'injuries' : 'incidents';
  const items = [...(next[field] ?? [])];
  const removed = items.splice(index, 1)[0];
  next[field] = items;
  if (kind === 'goal' && removed) next.goalsFor = Math.max(0, (Number(next.goalsFor) || 0) - 1);
  await put('matches', next);
  await refresh();
  showMatchDetail(matchId);
  toast('Incidencia eliminada.');
}

function attendanceBuilder(matchId = '', recordId = '') {
  const root = $('#training-builder');
  const existing = state.trainings.find((record) => record.id === recordId || (matchId && record.kind === 'match' && record.matchId === matchId));
  const kind = existing?.kind ?? (matchId ? 'match' : 'training');
  const selectedMatchId = existing?.matchId ?? matchId;
  const match = state.matches.find((item) => item.id === selectedMatchId);
  const callup = state.callups.find((item) => item.id === match?.callupId);
  const players = kind === 'match' ? state.players.filter(({ id }) => callup?.availableIds.includes(id)) : state.players;
  const today = new Date().toISOString().slice(0, 10);
  const matchOptions = state.matches.filter(({ callupId }) => callupId).sort((a, b) => b.date.localeCompare(a.date)).map((item) => `<option value="${item.id}" ${item.id === selectedMatchId ? 'selected' : ''}>${escapeHtml(localDate(item.date))} · ${escapeHtml(item.opponent)}</option>`).join('');
  const attendanceByPlayer = Object.fromEntries((existing?.attendance ?? []).map((item) => [item.playerId, item]));
  const rows = players.map((player) => {
    const entry = attendanceByPlayer[player.id] ?? { status: 'present', note: '' };
    return `<div class="check-row attendance-row"><strong>${escapeHtml(player.name)}</strong><select name="status-${player.id}" aria-label="Estado de ${escapeHtml(player.name)}"><option value="present" ${entry.status === 'present' ? 'selected' : ''}>Presente</option><option value="late" ${entry.status === 'late' ? 'selected' : ''}>Tarde</option><option value="absent" ${entry.status === 'absent' ? 'selected' : ''}>Ausente</option></select><div class="arrival-time ${entry.status === 'late' ? '' : 'hidden'}"><span>Hora de llegada</span>${time24Markup(`arrivalTime-${player.id}`, entry.arrivalTime, `Hora de llegada de ${player.name}`)}</div><input name="note-${player.id}" value="${escapeHtml(entry.note)}" maxlength="200" placeholder="Incidencia o comentario" aria-label="Nota de ${escapeHtml(player.name)}"></div>`;
  }).join('');
  root.classList.remove('hidden');
  root.innerHTML = `<form id="training-form"><input type="hidden" name="id" value="${existing?.id ?? ''}"><div class="form-row"><label>Tipo de registro<select name="kind"><option value="training" ${kind === 'training' ? 'selected' : ''}>Entrenamiento</option><option value="match" ${kind === 'match' ? 'selected' : ''}>Partido</option></select></label><label>Fecha${dateMarkup('date', existing?.date ?? match?.date.slice(0, 10) ?? today, 'Fecha del registro')}</label></div><label class="${kind === 'match' ? '' : 'hidden'}">Partido<select name="matchId" ${kind === 'match' ? 'required' : ''}><option value="">Selecciona…</option>${matchOptions}</select></label>${kind === 'match' && !callup ? '<p class="warning panel">Selecciona un partido con convocatoria.</p>' : `<div class="check-list">${rows}</div>`}<label>Notas del registro<textarea name="notes" maxlength="1000">${escapeHtml(existing?.notes ?? '')}</textarea></label><div class="button-row"><button class="primary">Guardar asistencia</button><button type="button" class="secondary cancel-training">Cancelar</button></div></form>`;
  root.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function saveTraining(event) {
  event.preventDefault(); const form = event.target.closest('form'); const values = formObject(form);
  const existing = values.id ? state.trainings.find(({ id }) => id === values.id) : null;
  const match = values.kind === 'match' ? state.matches.find(({ id }) => id === values.matchId) : null;
  const callup = state.callups.find(({ id }) => id === match?.callupId);
  if (values.kind === 'match' && !callup) return toast('Selecciona un partido con convocatoria.');
  const players = values.kind === 'match' ? state.players.filter(({ id }) => callup.availableIds.includes(id)) : state.players;
  for (const { id } of players) values[`arrivalTime-${id}`] = composeTime24(values[`arrivalTime-${id}Hour`], values[`arrivalTime-${id}Minute`]);
  values.date = composeDate(values.dateDay, values.dateMonth, values.dateYear);
  const record = buildAttendanceRecord(players, values, { id: existing?.id ?? uid(), kind: values.kind, matchId: values.matchId, createdAt: existing?.createdAt ?? Date.now() });
  await put('trainings', record); $('#training-builder').classList.add('hidden'); await refresh(); showView('asistencia'); toast('Asistencia guardada y ordenada por fecha.');
}

function renderTrainings() {
  const labels = { present: 'Presente', late: 'Tarde', absent: 'Ausente' };
  const stats = state.players.map((player) => ({ player, stats: calculateAttendanceStats(player.id, state.trainings) }));
  $('#attendance-stats').innerHTML = stats.length ? `<div class="attendance-grid">${stats.map(({ player, stats: item }) => {
    const history = sortAttendanceRecords(state.trainings).map((record) => ({ record, entry: record.attendance?.find(({ playerId }) => playerId === player.id) })).filter(({ entry }) => entry);
    return `<article class="panel attendance-player"><h3>${escapeHtml(player.name)}</h3><div class="mini-stats"><span><strong>${item.totalAbsences}</strong> ausencias</span><span><strong>${item.currentTrainingAbsenceStreak}</strong> racha actual</span><span><strong>${item.longestTrainingAbsenceStreak}</strong> racha máxima</span><span class="${item.oftenLate ? 'alert' : ''}"><strong>${item.lateCount}</strong> tardanzas${item.oftenLate ? ' · frecuente' : ''}</span></div><details><summary>Historial (${item.totalRecords})</summary><table class="minute-table"><tr><th>Fecha</th><th>Actividad</th><th>Estado</th></tr>${history.map(({ record, entry }) => `<tr><td>${escapeHtml(localDate(record.date))}</td><td>${record.kind === 'match' ? `Partido · ${escapeHtml(state.matches.find(({ id }) => id === record.matchId)?.opponent ?? 'eliminado')}` : 'Entrenamiento'}</td><td>${labels[entry.status]}${entry.arrivalTime ? ` · ${escapeHtml(entry.arrivalTime)}` : ''}${entry.note ? ` · ${escapeHtml(entry.note)}` : ''}</td></tr>`).join('')}</table></details></article>`;
  }).join('')}</div>` : empty('Añade jugadores para calcular estadísticas de asistencia.');
  const list = sortAttendanceRecords(state.trainings);
  $('#trainings-list').innerHTML = list.length ? `<h3 class="history-title">Base de datos de asistencia</h3>${list.map((record) => {
    const match = state.matches.find(({ id }) => id === record.matchId);
    return `<article class="panel"><div class="section-head"><div><span class="pill ${record.kind === 'match' ? 'accent' : ''}">${record.kind === 'match' ? 'Partido' : 'Entrenamiento'}</span><h3>${record.kind === 'match' ? escapeHtml(match?.opponent ?? 'Partido eliminado') : escapeHtml(localDate(record.date))}</h3><p class="meta">${escapeHtml(localDate(record.date))} · ${record.attendance.filter((item)=>item.status==='present').length} presentes · ${record.attendance.filter((item)=>item.status==='late').length} tarde · ${record.attendance.filter((item)=>item.status==='absent').length} ausentes</p></div><div class="button-row"><button class="edit-attendance secondary" data-id="${record.id}">Editar</button><button class="delete-training danger" data-id="${record.id}">Borrar</button></div></div><details><summary>Ver detalle</summary><table class="minute-table">${record.attendance.map((item) => `<tr><td>${escapeHtml(playerName(item.playerId))}</td><td>${labels[item.status]}${item.note ? ` · ${escapeHtml(item.note)}` : ''}</td></tr>`).join('')}</table>${record.notes ? `<p>${escapeHtml(record.notes)}</p>` : ''}</details></article>`;
  }).join('')}` : empty('Todavía no hay registros de asistencia.');
}

function exerciseName(id) {
  return state.exercises.find((item) => item.id === id)?.name ?? 'Ejercicio eliminado';
}

function exerciseCardHTML(rawItem) {
  const item = completeExercise(rawItem);
  const list = (values) => `<ul class="plain-list">${values.map((value) => `<li>${escapeHtml(value)}</li>`).join('')}</ul>`;
  return `<article class="panel exercise-card">
    <div class="exercise-card-head"><div><span class="pill">${escapeHtml(item.category)}</span>${item.code ? `<span class="pill accent">${escapeHtml(item.code)}</span>` : ''}<h3>${escapeHtml(item.name)}</h3></div><button type="button" class="favorite-exercise ${item.favorite ? 'active' : ''}" data-id="${item.id}" aria-label="${item.favorite ? 'Quitar de' : 'Añadir a'} favoritos">${item.favorite ? '★' : '☆'}</button></div>
    <div class="exercise-highlights"><span class="player-count">👥 ${escapeHtml(item.players)}</span><span class="pill accent">${item.duration} min</span><span class="meta">${escapeHtml(item.space)}</span></div>
    <p><strong>Material:</strong> ${escapeHtml(item.material)}</p>
    <p><strong>Intensidad:</strong> ${escapeHtml(item.intensity)}</p>
    <p><strong>Objetivo:</strong> ${escapeHtml(item.objective)}</p>
    <details class="diagram-details" open><summary>Gráfico tipo pizarra</summary>${renderBoardDiagrams(item)}</details>
    <details open><summary>Montaje · antes de llamar a los jugadores</summary><ol class="plain-list">${item.montage.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol></details>
    <details open><summary>Desarrollo paso a paso</summary><ol class="plain-list">${item.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol></details>
    <p><strong>Rotación:</strong> ${escapeHtml(item.rotation)}</p>
    <details><summary>Qué se trabaja</summary>${list(item.works)}</details>
    <p><strong>Qué busco:</strong> ${escapeHtml(item.lookFor)}</p>
    <details><summary>Qué debo observar</summary>${list(item.observe)}</details>
    <details><summary>Correcciones breves</summary>${list(item.corrections)}</details>
    <p><strong>Si sale mal:</strong> ${escapeHtml(item.ifBad)}</p>
    <p><strong>Si sale bien:</strong> ${escapeHtml(item.ifGood)}</p>
    <div class="button-row"><button type="button" class="view-exercise secondary" data-exercise-id="${item.id}">Ver</button><button type="button" class="add-exercise-to-session primary" data-id="${item.id}">Añadir a sesión</button><button type="button" class="edit-exercise secondary" data-id="${item.id}">Editar</button><button type="button" class="delete-exercise danger" data-id="${item.id}">Borrar</button></div>
  </article>`;
}

function renderExercises() {
  const form = $('#exercise-filters');
  if (!form) return;
  const filters = {
    category: form.elements.category.value,
    players: form.elements.players.value,
    material: form.elements.material.value,
    difficulty: form.elements.difficulty.value,
    favorites: form.elements.favorites.checked,
    video: form.elements.video.checked,
  };
  const exercises = filterExercises(state.exercises, filters)
    .sort((a, b) => {
      // Los ejercicios validados van primero, en orden inverso (los últimos añadidos arriba).
      const aIdx = EJERCICIOS_VALIDADOS.findIndex((e) => e.id === a.id);
      const bIdx = EJERCICIOS_VALIDADOS.findIndex((e) => e.id === b.id);
      const aValid = aIdx !== -1, bValid = bIdx !== -1;
      if (aValid && bValid) return bIdx - aIdx;
      if (aValid) return -1;
      if (bValid) return 1;
      return Number(b.favorite) - Number(a.favorite) || a.category.localeCompare(b.category, 'es') || a.name.localeCompare(b.name, 'es');
    });
  const list = $('#exercises-list');
  list.innerHTML = exercises.length ? exercises.map((rawItem) => {
    const validated = findValidatedExercise(rawItem.id);
    if (validated) return renderValidatedExerciseHTML(validated, { videos: videosForExercise(rawItem.id), role: state.role });
    return exerciseCardHTML(rawItem);
  }).join('') : empty('No hay ejercicios que coincidan con los filtros.');
  // Inicializa reproductores y visores de las fichas validadas.
  list.querySelectorAll('.ejercicio-validado').forEach((root) => {
    initValidatedExerciseViewer(root);
    attachLightbox(root);
    initVideoSection(root.querySelector('.videos'), { onUpload: handleVideoUpload, onDelete: handleVideoDelete });
    const tiempoInput = root.querySelector('.tiempo-ejercicio');
    if (tiempoInput) {
      tiempoInput.addEventListener('input', () => {
        const ex = state.exercises.find(({ id }) => id === root.dataset.id);
        if (ex) ex.duration = Number(tiempoInput.value) || 15;
      });
    }
  });
}

function editExercise(id) {
  const item = state.exercises.find((exerciseItem) => exerciseItem.id === id);
  if (!item) return;
  const form = $('#exercise-form');
  for (const key of ['id', 'name', 'category', 'difficulty', 'players', 'duration', 'material', 'space', 'description', 'variants']) {
    form.elements[key].value = item[key] ?? '';
  }
  $('#exercise-dialog').showModal();
}

async function saveExercise(event) {
  event.preventDefault();
  const form = event.target.closest('form');
  const values = formObject(form);
  const existing = values.id ? state.exercises.find(({ id }) => id === values.id) : null;
  const saved = buildExercise(values, {
    id: existing?.id ?? uid(), favorite: existing?.favorite ?? false,
    createdAt: existing?.createdAt ?? Date.now(), now: Date.now(), diagram: existing?.diagram,
  });
  await put('settings', { ...existing, ...saved, recordType: 'exercise', example: existing?.example ?? false });
  $('#exercise-dialog').close();
  form.reset();
  await refresh();
  showView('ejercicios');
  toast(existing ? 'Ejercicio actualizado.' : 'Ejercicio creado.');
}

function exerciseOptions(selectedId = '', predicate = () => true) {
  return state.exercises.filter(predicate).sort((a, b) => a.name.localeCompare(b.name, 'es'))
    .map((item) => `<option value="${item.id}" ${item.id === selectedId ? 'selected' : ''}>${escapeHtml(item.name)} · 👥 ${escapeHtml(item.players)} jugadores · ${item.duration} min</option>`).join('');
}

function syncSessionDraft() {
  const form = $('#session-form');
  if (!form) return;
  const values = formObject(form);
  if (values.dateDay && values.dateMonth && values.dateYear) {
    values.date = composeDate(values.dateDay, values.dateMonth, values.dateYear);
  }
  sessionDraftMeta = { ...sessionDraftMeta, ...values };
  sessionDraftBlocks = $$('.session-block', form).map((row) => ({
    type: row.querySelector('[name="blockType"]').value,
    exerciseId: row.querySelector('[name="blockExerciseId"]').value,
    duration: Number(row.querySelector('[name="blockDuration"]').value) || 1,
    notes: row.querySelector('[name="blockNotes"]').value.trim(),
  }));
}

function sessionBlockLabel(type) {
  return type === 'warmup' ? 'Calentamiento' : type === 'final' ? 'Juego final' : 'Parte principal';
}

function refreshSessionDurationStatus() {
  const form = $('#session-form');
  const root = form?.querySelector('.session-duration');
  if (!root) return;
  const target = Number(form.elements.targetDuration?.value) > 0 ? Number(form.elements.targetDuration.value) : 60;
  const blocks = $$('[name="blockDuration"]', form).map(({ value }) => ({ duration: Number(value) || 0 }));
  const status = sessionDurationStatus(blocks, target);
  root.className = `session-duration ${status.exact ? 'exact' : 'warning'}`;
  root.innerHTML = `<strong>${status.total} / ${target} min</strong><span>${status.message}</span>`;
}

function renderSessionDraft() {
  const root = $('#session-builder');
  const target = Number(sessionDraftMeta?.targetDuration) > 0 ? Number(sessionDraftMeta.targetDuration) : 60;
  const status = sessionDurationStatus(sessionDraftBlocks, target);
  root.classList.remove('hidden');
  const picker = `<div class="session-exercise-picker"><h3>Añadir ejercicios</h3><p class="meta">Pulsa <strong>+ Añadir</strong> en cada ejercicio. Entra como calentamiento, parte principal o juego final según su categoría.</p><div class="exercise-grid">${state.exercises.map((rawItem) => {
    const item = completeExercise(rawItem);
    return `<article class="panel exercise-card picker-card"><div class="exercise-card-head"><div><span class="pill">${escapeHtml(item.category)}</span>${item.code ? `<span class="pill accent">${escapeHtml(item.code)}</span>` : ''}<h3>${escapeHtml(item.name)}</h3></div></div><div class="exercise-highlights"><span class="player-count">👥 ${escapeHtml(item.players)}</span><span class="pill accent">${item.duration} min</span></div><button type="button" class="add-exercise-to-session primary compact" data-id="${item.id}">+ Añadir</button></article>`;
  }).join('')}</div></div>`;
  root.innerHTML = `<form id="session-form"><input name="id" type="hidden" value="${escapeHtml(sessionDraftMeta?.id ?? '')}"><div class="form-row"><label>Fecha${dateMarkup('date', sessionDraftMeta?.date ?? '', 'Fecha de la sesión')}</label><label>Nombre de la sesión<input name="name" required maxlength="120" value="${escapeHtml(sessionDraftMeta?.name ?? '')}" placeholder="Ej. Pase, apoyo y finalización"></label></div><div class="form-row"><label>Tiempo total de la sesión (min)<input name="targetDuration" type="number" min="1" max="240" required value="${target}"></label><label>¿Es calentamiento de partido/amistoso?<select name="sessionKind"><option value="training" ${sessionDraftMeta?.sessionKind === 'training' ? 'selected' : ''}>Entrenamiento</option><option value="match-warmup" ${sessionDraftMeta?.sessionKind === 'match-warmup' ? 'selected' : ''}>Calentamiento de partido/amistoso</option></select></label></div><div class="session-duration ${status.exact ? 'exact' : 'warning'}" role="status"><strong>${status.total} / ${target} min</strong><span>${status.message}</span></div><fieldset><legend>Bloques de la sesión</legend>${sessionDraftBlocks.length ? sessionDraftBlocks.map((block, index) => `<div class="session-block" data-index="${index}"><input name="blockType" type="hidden" value="${block.type}"><div><span class="pill">${sessionBlockLabel(block.type)}</span><label>Ejercicio<select name="blockExerciseId" required>${exerciseOptions(block.exerciseId)}</select></label></div><label>Duración (min)<input name="blockDuration" type="number" min="1" max="60" required value="${block.duration}"></label><label>Consignas / observaciones<input name="blockNotes" maxlength="300" value="${escapeHtml(block.notes ?? '')}"></label><div class="session-block-actions"><button type="button" class="move-session-block secondary compact" data-index="${index}" data-direction="-1" aria-label="Subir bloque" ${index === 0 ? 'disabled' : ''}>↑</button><button type="button" class="move-session-block secondary compact" data-index="${index}" data-direction="1" aria-label="Bajar bloque" ${index === sessionDraftBlocks.length - 1 ? 'disabled' : ''}>↓</button><button type="button" class="remove-session-block danger compact" data-index="${index}">Quitar</button></div></div>`).join('') : '<p class="warning">Añade ejercicios desde la lista de abajo.</p>'}</fieldset>${picker}<label>Material total<input name="material" maxlength="300" value="${escapeHtml(sessionDraftMeta?.material ?? '')}"></label><label>Observaciones generales<textarea name="notes" maxlength="1000">${escapeHtml(sessionDraftMeta?.notes ?? '')}</textarea></label><div class="button-row"><button class="primary" type="submit" ${sessionDraftBlocks.length ? '' : 'disabled'}>Guardar sesión</button><button class="cancel-session secondary" type="button">Cancelar</button></div></form>`;
}

function sessionBuilder(editId = '', seedExerciseId = '', seedMeta = {}) {
  const existing = state.trainingSessions.find(({ id }) => id === editId);
  const today = new Date().toISOString().slice(0, 10);
  sessionDraftMeta = existing ? { ...existing } : { id: '', date: seedMeta.date || today, name: seedMeta.name || '', targetDuration: 60, sessionKind: 'training', material: '', notes: '' };
  sessionDraftBlocks = (existing?.blocks ?? []).map((block) => ({ ...block }));
  if (seedExerciseId) {
    const exercise = state.exercises.find(({ id }) => id === seedExerciseId);
    if (exercise) sessionDraftBlocks = addExerciseToSession({ blocks: sessionDraftBlocks }, exercise).blocks;
  }
  renderSessionDraft();
  $('#session-builder').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openAddToSession(exerciseId) {
  pendingExerciseId = exerciseId;
  const form = $('#add-session-form');
  form.reset();
  const today = new Date();
  form.elements.dateDay.value = String(today.getDate()).padStart(2, '0');
  form.elements.dateMonth.value = String(today.getMonth() + 1).padStart(2, '0');
  form.elements.dateYear.value = String(today.getFullYear());
  form.elements.existingSessionId.innerHTML = state.trainingSessions.length
    ? sortTrainingSessions(state.trainingSessions).map((session) => `<option value="${session.id}">${escapeHtml(session.name)} · ${escapeHtml(localDate(session.date))} · ${session.totalDuration} min</option>`).join('')
    : '<option value="">No hay sesiones guardadas</option>';
  $('#add-session-dialog').showModal();
}

async function saveAddToSession(event) {
  const form = event.target.closest('form');
  const values = formObject(form);
  const exercise = state.exercises.find(({ id }) => id === pendingExerciseId);
  if (!exercise) throw new TypeError('El ejercicio ya no está disponible.');
  if (values.destination === 'existing') {
    const existing = state.trainingSessions.find(({ id }) => id === values.existingSessionId);
    if (!existing) throw new TypeError('Selecciona una sesión existente.');
    const updated = addExerciseToSession(existing, exercise);
    updated.updatedAt = Date.now();
    await put('settings', updated);
    $('#add-session-dialog').close();
    await refresh();
    toast(sessionDurationStatus(updated.blocks).message);
    return;
  }
  if (!values.name.trim()) throw new TypeError('Escribe el nombre de la nueva sesión.');
  $('#add-session-dialog').close();
  sessionBuilder('', exercise.id, { date: composeDate(values.dateDay, values.dateMonth, values.dateYear), name: values.name });
}

async function saveTrainingSession(event) {
  const form = event.target.closest('form');
  syncSessionDraft();
  const existing = sessionDraftMeta.id ? state.trainingSessions.find(({ id }) => id === sessionDraftMeta.id) : null;
  const session = buildFlexibleTrainingSession({ ...sessionDraftMeta, blocks: sessionDraftBlocks }, {
    id: existing?.id ?? uid(), availableExerciseIds: state.exercises.map(({ id }) => id),
    createdAt: existing?.createdAt ?? Date.now(), now: Date.now(),
  });
  await put('settings', session);
  form.closest('#session-builder').classList.add('hidden');
  await refresh();
  showView('sesiones');
  const status = sessionDurationStatus(session.blocks, session.targetDuration);
  toast(status.exact ? `Sesión guardada con ${session.targetDuration} minutos exactos.` : `Sesión guardada. ${status.message}`);
}

function videosForExercise(exerciseId) {
  return state.videos.filter((video) => video.exerciseId === exerciseId);
}

async function handleVideoUpload(exerciseId, file) {
  if (state.role !== 'owner') return toast('Solo Migue puede subir vídeos.');
  const id = uid();
  const extension = (file.name.split('.').pop() || 'mp4').toLowerCase();
  const path = videoPath(exerciseId, id, extension);
  try {
    await uploadVideo(path, file);
  } catch (error) {
    console.warn('Subida de vídeo fallida:', error.message);
    return toast('No se pudo subir el vídeo. Revisa que el bucket `ejercicio-videos` esté creado en Supabase.');
  }
  const record = buildVideoRecord(
    { exerciseId, nombre: file.name, path, mime: file.type, size: file.size, orden: videosForExercise(exerciseId).length },
    { id, createdAt: Date.now(), now: Date.now() },
  );
  await put('settings', record);
  await refresh();
  toast('Vídeo subido.');
}

async function handleVideoDelete(videoId) {
  if (state.role !== 'owner') return toast('Solo Migue puede borrar vídeos.');
  const video = state.videos.find(({ id }) => id === videoId);
  if (!video) return;
  if (!await askConfirmation({ title: 'Borrar vídeo', message: 'Se eliminará el vídeo del almacenamiento y de todos los dispositivos.', acceptLabel: 'Borrar', danger: true })) return;
  try {
    await removeVideo(video.path);
  } catch (error) {
    console.warn('Borrado de vídeo fallido:', error.message);
  }
  await remove('settings', videoId);
  await refresh();
  toast('Vídeo eliminado.');
}

function showExerciseDetail(exerciseId) {
  const validated = findValidatedExercise(exerciseId);
  if (validated) {
    $('#exercise-detail-title').textContent = validated.nombre;
    const body = $('#exercise-detail-body');
    body.innerHTML = renderValidatedExerciseHTML(validated, { videos: videosForExercise(exerciseId), role: state.role });
    initValidatedExerciseViewer(body.querySelector('.ejercicio-validado'));
    attachLightbox(body);
    initVideoSection(body.querySelector('.videos'), { onUpload: handleVideoUpload, onDelete: handleVideoDelete });
    // Tiempo editable: actualiza el duration del ejercicio en state para que descuente de la sesión.
    const tiempoInput = body.querySelector('.tiempo-ejercicio');
    if (tiempoInput) {
      tiempoInput.addEventListener('input', () => {
        const ex = state.exercises.find(({ id }) => id === exerciseId);
        if (ex) ex.duration = Number(tiempoInput.value) || 15;
      });
    }
    $('#exercise-detail-dialog').showModal();
    return;
  }
  const item = state.exercises.find(({ id }) => id === exerciseId);
  if (!item) return toast('El ejercicio ya no está disponible.');
  $('#exercise-detail-title').textContent = item.name;
  $('#exercise-detail-body').innerHTML = exerciseCardHTML(item);
  $('#exercise-detail-dialog').showModal();
}

function renderTrainingSessions() {
  const sessions = sortTrainingSessions(state.trainingSessions);
  $('#sessions-list').innerHTML = sessions.length ? sessions.map((session) => `<article class="panel"><div class="section-head"><div><span class="pill accent">${session.totalDuration} min</span><h3><button type="button" class="view-session link-button" data-id="${session.id}" aria-label="Ver sesión ${escapeHtml(session.name)}">${escapeHtml(session.name)}</button></h3><p class="meta">${escapeHtml(localDate(session.date))} · ${session.blocks.length} bloques</p></div><div class="button-row"><button type="button" class="view-session secondary" data-id="${session.id}">Ver</button><button type="button" class="edit-session secondary" data-id="${session.id}">Editar</button><button type="button" class="delete-session danger" data-id="${session.id}">Borrar</button></div></div><ol class="session-plan">${session.blocks.map((block) => `<li><button type="button" class="session-exercise-link" data-exercise-id="${block.exerciseId}" aria-label="Ver ejercicio ${escapeHtml(exerciseName(block.exerciseId))}"><strong>${block.type === 'warmup' ? 'Calentamiento' : block.type === 'main' ? 'Parte principal' : 'Juego final'} · ${block.duration} min</strong><span>${escapeHtml(exerciseName(block.exerciseId))}</span>${block.notes ? `<small>${escapeHtml(block.notes)}</small>` : ''}</button></li>`).join('')}</ol>${session.material ? `<p><strong>Material:</strong> ${escapeHtml(session.material)}</p>` : ''}${session.notes ? `<p><strong>Observaciones:</strong> ${escapeHtml(session.notes)}</p>` : ''}</article>`).join('') : empty('Todavía no hay sesiones de entrenamiento guardadas.');
}

function showSessionDetail(sessionId) {
  const session = state.trainingSessions.find(({ id }) => id === sessionId);
  if (!session) return toast('La sesión ya no está disponible.');
  $('#session-detail-title').textContent = session.name || 'Sesión de entrenamiento';
  const status = sessionDurationStatus(session.blocks, session.targetDuration);
  $('#session-detail-body').innerHTML = `
    <p class="meta">${escapeHtml(localDate(session.date))} · ${session.blocks.length} bloques · ${status.total} / ${session.targetDuration || 60} min</p>
    <ol class="session-plan">${session.blocks.map((block) => `<li><div class="session-exercise-row"><button type="button" class="session-exercise-link" data-exercise-id="${block.exerciseId}" aria-label="Ver ejercicio ${escapeHtml(exerciseName(block.exerciseId))}"><strong>${block.type === 'warmup' ? 'Calentamiento' : block.type === 'main' ? 'Parte principal' : 'Juego final'} · ${block.duration} min</strong><span>${escapeHtml(exerciseName(block.exerciseId))}</span>${block.notes ? `<small>${escapeHtml(block.notes)}</small>` : ''}</button><button type="button" class="view-exercise secondary compact" data-exercise-id="${block.exerciseId}">Ver</button></div></li>`).join('')}</ol>
    ${session.material ? `<p><strong>Material:</strong> ${escapeHtml(session.material)}</p>` : ''}
    ${session.notes ? `<p><strong>Observaciones:</strong> ${escapeHtml(session.notes)}</p>` : ''}
    <p class="meta">Pulsa en un ejercicio o en «Ver» para verlo completo con su explicación.</p>`;
  $('#session-detail-dialog').showModal();
}

function renderTactics() {
  const tactics = sortTactics(state.tactics);
  $('#tactics-list').innerHTML = tactics.length ? tactics.map((tactic) => {
    return `<article class="panel"><div class="section-head"><div><span class="pill accent">${escapeHtml(tactic.format)}</span><h3>${escapeHtml(tactic.name)}</h3><p class="meta">${tactic.rival ? `vs ${escapeHtml(tactic.rival)}` : 'Sin rival'}${tactic.situation ? ` · ${escapeHtml(tactic.situation)}` : ''}</p></div><div class="button-row"><button type="button" class="view-tactic secondary" data-id="${tactic.id}">Ver</button><button type="button" class="edit-tactic secondary" data-id="${tactic.id}">Editar</button><button type="button" class="delete-tactic danger" data-id="${tactic.id}">Borrar</button></div></div>${renderTacticBoard(tactic)}${tactic.notes ? `<p><strong>Notas:</strong> ${escapeHtml(tactic.notes)}</p>` : ''}</article>`;
  }).join('') : empty('Todavía no hay tácticas guardadas. Pulsa «+ Táctica» para crear la primera.');
  renderTacticasInteractivas();
}

// Renderiza las tácticas del manual como tarjetas (igual que los ejercicios):
// cada una con su pizarra táctica grande + botón "Ver interactiva" (GIF).
// Arriba hay un selector desplegable para filtrar por formación.
function renderTacticasInteractivas() {
  const root = $('#tacticas-interactivas');
  const select = $('#tactica-filters')?.elements.formacion;
  if (!root) return;

  // Rellenar el selector de formaciones (sin duplicados).
  if (select) {
    const formaciones = [...new Set(TACTICAS_INTERACTIVAS.map((t) => t.formacion))];
    const actual = select.value;
    select.innerHTML = '<option value="">Todas</option>' + formaciones.map((f) => `<option value="${escapeHtml(f)}">${escapeHtml(f)}</option>`).join('');
    if (actual) select.value = actual;
  }

  const filtro = select?.value || '';
  const lista = TACTICAS_INTERACTIVAS.filter((t) => !filtro || t.formacion === filtro);

  root.innerHTML = lista.map((t) => {
    const vr = t.vista_rapida || {};
    // Pizarra táctica grande de la formación correspondiente (editable en el builder).
    const board = renderTacticBoard(defaultTactic('F7', t.formacion));
    return `<article class="panel tactica-manual-card">
      <div class="section-head"><div><span class="pill accent">${escapeHtml(t.formacion)}</span><h3>${escapeHtml(t.nombre)}</h3></div><div class="button-row"><button type="button" class="edit-tactica-manual secondary" data-formacion="${escapeHtml(t.formacion)}">Editar</button><button type="button" class="open-tactica-interactiva primary" data-id="${escapeHtml(t.id)}">Ver interactiva</button></div></div>
      ${board}
      <div class="tactica-manual-desc">${escapeHtml(vr.explicacion_breve || '')}</div>
    </article>`;
  }).join('') || empty('No hay tácticas del manual para esta formación.');
}

// Abre una táctica interactiva a pantalla completa (overlay).
function showTacticaInteractiva(id) {
  const tactica = findTacticaInteractiva(id);
  if (!tactica) return toast('La táctica interactiva ya no está disponible.');
  $('#tactica-interactiva-title').textContent = tactica.nombre || 'Táctica interactiva';
  const body = $('#tactica-interactiva-body');
  body.innerHTML = renderTacticaInteractivaHTML(tactica);
  const root = body.querySelector('.tactica-interactiva');
  initTacticaViewer(root);
  attachTacticaLightbox(root);
  $('#tactica-interactiva-overlay').classList.remove('hidden');
}

function closeTacticaInteractiva() {
  $('#tactica-interactiva-overlay').classList.add('hidden');
  $('#tactica-interactiva-body').innerHTML = '';
}

function tacticBuilder(editId = '', formation = '') {
  const existing = state.tactics.find(({ id }) => id === editId);
  const root = $('#tactic-builder');
  root.classList.remove('hidden');
  const t = existing ? { ...existing } : { ...defaultTactic(state.format || 'F7', formation || '1-3-2-1'), name: '', rival: '', situation: '', notes: '' };
  tacticTool = 'select';
  const toolsHTML = `<div class="tactic-tools" role="toolbar" aria-label="Herramientas de la pizarra">${TACTIC_TOOLS.map((tool) => `<button type="button" class="tactic-tool ${tool.id === tacticTool ? 'active' : ''}" data-tactic-tool="${tool.id}" title="${tool.label}">${renderTacticToolIcon(tool.id)}<span class="tactic-tool-label">${tool.label}</span></button>`).join('')}</div>`;
  root.innerHTML = `<form id="tactic-form" class="live-tactics"><input name="id" type="hidden" value="${escapeHtml(t.id || '')}"><div class="form-row"><label>Nombre<input name="name" required maxlength="120" value="${escapeHtml(t.name || '')}" placeholder="Ej. Salida de balón vs Las Palmas"></label><label>Formato<select name="format" required>${TACTIC_FORMATS.map((f) => `<option value="${f}" ${f === t.format ? 'selected' : ''}>Fútbol ${f === 'F7' ? '7' : '11'}</option>`).join('')}</select></label></div><div class="form-row"><label>Formación<select name="formation" required>${FORMATION_NAMES.map((f) => `<option value="${f}" ${f === t.formation ? 'selected' : ''}>${f}</option>`).join('')}</select></label><label>Situación<input name="situation" maxlength="100" value="${escapeHtml(t.situation || '')}" placeholder="Ej. Saque de esquina"></label></div><div class="form-row"><label>Rival<input name="rival" maxlength="100" value="${escapeHtml(t.rival || '')}" placeholder="Ej. Las Palmas"></label></div>${toolsHTML}<div class="section-head"><button type="button" class="secondary tactic-board-full">⛶ Ampliar</button></div>${renderTacticBoard(t)}<label>Notas<textarea name="notes" maxlength="1000">${escapeHtml(t.notes || '')}</textarea></label><div class="button-row"><button class="primary" type="submit">Guardar táctica</button><button class="cancel-tactic secondary" type="button">Cancelar</button></div></form><div class="lightbox live-tactics-lightbox live-tactics" id="tactic-board-lightbox"><button type="button" class="lb-close" title="Cerrar">✕</button><div class="lb-board" style="display:flex;flex-direction:column;align-items:center;gap:.5rem;width:100%"><svg id="tactic-board-full" viewBox="0 0 100 100" role="img" aria-label="Pizarra táctica ampliada" style="background:#0c3b2e;border-radius:8px;touch-action:none"></svg><div class="tactic-tools live-tactics-tools-full" id="tactic-board-tools-full" role="toolbar" aria-label="Herramientas de la pizarra ampliada">${TACTIC_TOOLS.map((tool) => `<button type="button" class="tactic-tool ${tool.id === tacticTool ? 'active' : ''}" data-tactic-tool="${tool.id}" title="${tool.label}">${renderTacticToolIcon(tool.id)}<span class="tactic-tool-label">${tool.label}</span></button>`).join('')}</div></div></div>`;
  initTacticDraft();
  wireTacticBoardFull();
  root.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function saveTactic(event) {
  event.preventDefault();
  const form = event.target.closest('form');
  const values = formObject(form);
  const existing = values.id ? state.tactics.find(({ id }) => id === values.id) : null;
  const draft = tacticDraft || syncTacticDraft();
  const saved = buildTactic({
    ...values,
    team: draft?.team,
    opponent: draft?.opponent,
    ball: draft?.ball,
    moves: draft?.moves,
  }, {
    id: existing?.id ?? uid(), createdAt: existing?.createdAt ?? Date.now(), now: Date.now(),
  });
  await put('settings', { ...existing, ...saved, recordType: 'tactic' });
  form.closest('#tactic-builder').classList.add('hidden');
  await refresh();
  showView('tacticas');
  toast(existing ? 'Táctica actualizada.' : 'Táctica creada.');
}

function showTacticDetail(tacticId) {
  const tactic = state.tactics.find(({ id }) => id === tacticId);
  if (!tactic) return toast('La táctica ya no está disponible.');
  $('#tactic-detail-title').textContent = tactic.name || 'Táctica';
  const guide = FORMATION_GUIDES[tactic.formation] || FORMATION_GUIDES['1-3-2-1'];
  const guideHTML = guide ? `
    <details class="tactic-guide" open><summary>${escapeHtml(guide.name)} · qué busco</summary><p>${escapeHtml(guide.queBusco)}</p></details>
    <details class="tactic-guide"><summary>Con balón</summary><ul class="plain-list">${guide.conBalon.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul></details>
    <details class="tactic-guide"><summary>Sin balón / defensa</summary><ul class="plain-list">${guide.sinBalon.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul></details>
    <details class="tactic-guide"><summary>Al perder el balón</summary><ul class="plain-list">${guide.alPerder.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul></details>` : '';
  $('#tactic-detail-body').innerHTML = `<p class="meta">${escapeHtml(tactic.format)}${tactic.rival ? ` · vs ${escapeHtml(tactic.rival)}` : ''}${tactic.situation ? ` · ${escapeHtml(tactic.situation)}` : ''}</p>${renderTacticBoard(tactic)}${guideHTML}${tactic.notes ? `<p><strong>Notas:</strong> ${escapeHtml(tactic.notes)}</p>` : ''}`;
  $('#tactic-detail-dialog').showModal();
}

// Convierte un evento de puntero a coordenadas del viewBox (0..100) del SVG.
function tacticPoint(event, svg) {
  const rect = svg.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  return { x: Math.max(4, Math.min(96, x)), y: Math.max(4, Math.min(96, y)) };
}

// Sincroniza el borrador de la táctica con el estado actual de la pizarra.
function syncTacticDraft() {
  const form = $('#tactic-form');
  if (!form) return;
  const values = formObject(form);
  const base = defaultTactic(values.format || 'F7', values.formation);
  tacticDraft = {
    ...base,
    id: values.id,
    name: values.name,
    rival: values.rival,
    situation: values.situation,
    formation: values.formation,
    team: tacticDraft?.team || base.team,
    opponent: tacticDraft?.opponent || base.opponent,
    ball: tacticDraft?.ball || base.ball,
    moves: tacticDraft?.moves || [],
    notes: values.notes,
  };
  return tacticDraft;
}

// Re-renderiza la pizarra conservando el borrador actual.
function rerenderTacticBoard() {
  const form = $('#tactic-form');
  if (!form) return;
  const board = form.querySelector('.tactic-board');
  if (!board) return;
  const t = tacticDraft || syncTacticDraft();
  board.outerHTML = renderTacticBoard(t);
}

// Inicializa el borrador al abrir el builder.
function initTacticDraft() {
  const form = $('#tactic-form');
  if (!form) return;
  const values = formObject(form);
  const base = defaultTactic(values.format || 'F7', values.formation);
  tacticDraft = {
    ...base,
    id: values.id,
    name: values.name,
    rival: values.rival,
    situation: values.situation,
    formation: values.formation,
    team: base.team,
    opponent: base.opponent,
    ball: base.ball,
    moves: [],
    notes: values.notes,
  };
}

// Conecta el botón "⛶ Ampliar" del builder de Tácticas: abre la pizarra en un
// lightbox a pantalla completa, interactiva (mover fichas, dibujar flechas),
// reutilizando la misma lógica de la pizarra normal.
function wireTacticBoardFull() {
  const lightbox = $('#tactic-board-lightbox');
  const fullBtn = $('.tactic-board-full');
  const boardFull = $('#tactic-board-full');
  if (!lightbox || !fullBtn || !boardFull) return;

  const renderFull = () => {
    const t = tacticDraft || syncTacticDraft();
    boardFull.innerHTML = renderTacticBoard(t).match(/<svg[^>]*>([\s\S]*?)<\/svg>/)?.[1] || '';
  };

  fullBtn.addEventListener('click', () => {
    renderFull();
    lightbox.classList.add('open');
  });

  const closeLb = () => lightbox.classList.remove('open');
  lightbox.querySelector('.lb-close').addEventListener('click', closeLb);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });

  // Interactividad en la pizarra ampliada (mover fichas, dibujar flechas, balón).
  boardFull.addEventListener('pointerdown', (e) => {
    const piece = e.target.closest('[data-piece]')?.dataset.piece;
    const point = tacticPoint(e, boardFull);
    if (tacticTool === 'select' && (piece === 'team' || piece === 'opponent')) {
      const idx = Number(e.target.closest('[data-idx]').dataset.idx);
      const side = piece;
      const move = (ev) => {
        const p = tacticPoint(ev, boardFull);
        tacticDraft = moveTacticPiece(tacticDraft, side, idx, p);
        renderFull(); rerenderTacticBoard();
      };
      const up = () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); };
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
    } else if (tacticTool === 'ball') {
      tacticDraft = moveTacticPiece(tacticDraft, 'ball', 0, point);
      renderFull(); rerenderTacticBoard();
    } else if (tacticTool === 'erase') {
      const arrow = e.target.closest('[data-piece="arrow"]');
      if (arrow?.dataset.idx !== undefined) {
        tacticDraft = { ...tacticDraft, moves: (tacticDraft.moves || []).filter((_, i) => i !== Number(arrow.dataset.idx)) };
        renderFull(); rerenderTacticBoard();
      }
    } else if (tacticTool === 'clear') {
      tacticDraft = { ...tacticDraft, moves: [] };
      renderFull(); rerenderTacticBoard();
    } else if (['pass', 'move', 'dribble', 'shot', 'sprint'].includes(tacticTool)) {
      const start = point;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', start.x); line.setAttribute('y1', start.y); line.setAttribute('x2', start.x); line.setAttribute('y2', start.y);
      line.setAttribute('class', 'tac-arrow');
      boardFull.appendChild(line);
      const move = (ev) => { const p = tacticPoint(ev, boardFull); line.setAttribute('x2', p.x); line.setAttribute('y2', p.y); };
      const up = () => {
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        const to = { x: Number(line.getAttribute('x2')), y: Number(line.getAttribute('y2')) };
        line.remove();
        const created = createTacticMove(start, to, tacticTool);
        if (created) {
          tacticDraft = { ...tacticDraft, moves: [...(tacticDraft.moves || []), created] };
          renderFull(); rerenderTacticBoard();
        }
      };
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
    }
  });
}

async function ensurePhase2Seeded() {
  if (await getOne('settings', 'phase2-seeded')) return;
  const current = await getAll('settings');
  const existingIds = new Set(current.filter(({ recordType }) => recordType === 'exercise').map(({ id }) => id));
  const goodExercises = [
    ...REAL_EXERCISES,
    ...SLIDESHARE_EXERCISES,
    ...PHASE2_V3_EXERCISES,
  ].filter(({ id }) => !existingIds.has(id)).map((item) => structuredClone(item));
  await putBatch({ settings: [...goodExercises, { id: 'phase2-seeded', recordType: 'migration', version: 5, createdAt: Date.now() }] });
}

async function ensureSquadSeeded() {
  if (await getOne('settings', 'squad-26-27-seeded')) return;
  const currentPlayers = await getAll('players');
  await putBatch(planSquadSeed(currentPlayers));
}

async function ensurePhase2V2Seeded() {
  if (await getOne('settings', 'phase2-v2-seeded')) return;
  const current = await getAll('settings');
  await putBatch({ settings: planPhase2V2Seed(current) });
}

async function ensurePhase2V3Seeded() {
  if (await getOne('settings', 'phase2-v3-seeded')) return;
  const current = await getAll('settings');
  await putBatch({ settings: planPhase2V3Seed(current) });
}

async function ensureRealExercisesSeeded() {
  if (await getOne('settings', 'real-exercises-seeded')) return;
  const current = await getAll('settings');
  const existingIds = new Set(current.filter(({ recordType }) => recordType === 'exercise').map(({ id }) => id));
  const additions = [...REAL_EXERCISES, ...SLIDESHARE_EXERCISES].filter(({ id }) => !existingIds.has(id)).map((item) => structuredClone(item));
  await putBatch({ settings: [...additions, { id: 'real-exercises-seeded', recordType: 'migration', version: 5, createdAt: Date.now() }] });
}

async function ensureSlideshareSeeded() {
  if (await getOne('settings', 'slideshare-seeded')) return;
  const current = await getAll('settings');
  const existingIds = new Set(current.filter(({ recordType }) => recordType === 'exercise').map(({ id }) => id));
  const additions = SLIDESHARE_EXERCISES.filter(({ id }) => !existingIds.has(id)).map((item) => structuredClone(item));
  await putBatch({ settings: [...additions, { id: 'slideshare-seeded', recordType: 'migration', version: 6, createdAt: Date.now() }] });
}

// Elimina de la base todos los ejercicios precargados antiguos (example:true). Los ejercicios
// validados (formato nuevo) viven en JS (EJERCICIOS_VALIDADOS) y no se guardan en la base.
async function ensureLegacyExercisesNotPresent() {
  if (await getOne('settings', 'legacy-exercises-not-present-v2')) return;
  const current = await getAll('settings');
  const toRemove = current.filter(({ recordType, example }) => recordType === 'exercise' && example === true);
  for (const record of toRemove) await remove('settings', record.id);
  await put('settings', { id: 'legacy-exercises-not-present-v2', recordType: 'migration', version: 8, createdAt: Date.now() });
}

async function exportData() {
  const backup = await exportDatabase(); const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `campobase-copia-${new Date().toISOString().slice(0,10)}.json`; link.click(); URL.revokeObjectURL(link.href); toast('Copia exportada.');
}

async function importData(event) {
  const file = event.target.files[0]; if (!file) return;
  if (file.size > 20_000_000) return toast('La copia supera el límite de 20 MB.');
  try { const backup = validateBackup(JSON.parse(await file.text())); if (!await askConfirmation({ title: 'Importar copia', message: 'La importación sustituirá todos los datos locales.', acceptLabel: 'Importar y sustituir', danger: true })) return; await importDatabase(backup); state.timer = null; await refresh(); toast('Copia importada correctamente.'); } catch (error) { console.error(error); toast(`No se pudo importar: ${error.message}`); } finally { event.target.value = ''; }
}

async function saveTeamSettings(event) {
  event.preventDefault();
  if (state.role !== 'owner') return toast('Solo Migue puede cambiar los ajustes del equipo.');
  const values = formObject(event.currentTarget);
  const teamName = values.teamName.trim();
  if (!teamName) return toast('Escribe el nombre de tu equipo.');
  state.format = values.format;
  state.settings = { ...state.settings, id: 'main', format: state.format, teamName };
  await put('settings', state.settings);
  renderAll();
  toast('Nombre y modalidad del equipo guardados.');
}

async function saveDemoTeam(event) {
  event.preventDefault();
  if (state.role !== 'demo' || !isDemoDatabase()) return toast('Este formulario solo está disponible en la demo.');
  const values = formObject(event.currentTarget);
  const teamName = values.teamName.trim();
  if (!teamName) return toast('Escribe el nombre del equipo de prueba.');
  state.format = values.format;
  state.settings = { ...state.settings, id: 'main', format: state.format, teamName };
  await put('settings', state.settings);
  renderAll();
  toast('Equipo de prueba guardado temporalmente.');
}

async function savePins(ownerPin, delegatePin) {
  if (ownerPin === delegatePin) throw new TypeError('Los PIN de Migue y delegado deben ser distintos.');
  const salt = crypto.randomUUID();
  const [ownerPinHash, delegatePinHash] = await Promise.all([hashPin(ownerPin, salt), hashPin(delegatePin, salt)]);
  state.settings = { ...state.settings, id: 'main', format: state.format, pinSalt: salt, ownerPinHash, delegatePinHash };
  await put('settings', state.settings);
}

function applyRole(role) {
  state.role = role;
  try { sessionStorage.setItem(SESSION_ROLE_KEY, role); } catch { /* La app sigue operativa aunque el navegador bloquee el almacenamiento de sesión. */ }
  document.body.classList.remove('auth-locked');
  $('#role-label').textContent = role === 'owner' ? 'Migue' : role === 'demo' ? 'Demo temporal' : 'Delegado';
  document.body.classList.toggle('demo-mode', role === 'demo');
  $('#settings-nav').hidden = role === 'demo';
  $('#demo-team-panel').classList.toggle('hidden', role !== 'demo');
  if (role === 'delegate') {
    state.delegateMode = true;
    document.body.classList.add('delegate-mode');
    showView('delegado');
    renderDelegate();
  } else {
    state.delegateMode = false;
    document.body.classList.remove('delegate-mode');
    showView('plantilla');
  }
}

async function startDemoSession(session) {
  configureDemoDatabase(session);
  state.demoSession = session;
  try { sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session)); } catch { throw new Error('El navegador debe permitir almacenamiento de sesión para usar la demo.'); }
  await ensurePhase2Seeded();
  await ensurePhase2V2Seeded();
  await ensurePhase2V3Seeded();
  await ensureRealExercisesSeeded();
  await ensureSlideshareSeeded();
  await ensureLegacyExercisesNotPresent();
  await refresh();
  const live = await getOne('settings', 'live');
  state.timer = live?.timer ?? null;
  state.liveUpdatedAt = live?.updatedAt ?? 0;
  applyRole('demo');
  networkStatus();
}

async function endDemoSession(message = '') {
  const session = state.demoSession;
  state.demoSession = null;
  state.timer = null;
  clearInterval(state.tick);
  if (session) await deleteDemoDatabase(session).catch((error) => console.warn('No se pudo eliminar la base demo:', error.message));
  configureRealDatabase();
  try {
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    sessionStorage.removeItem(SESSION_ROLE_KEY);
  } catch { /* La base temporal ya no está activa. */ }
  await synchronizeCloud();
  showAuth();
  if (message) $('#auth-error').textContent = message;
}

async function restoreSessionRole() {
  let role;
  try { role = sessionStorage.getItem(SESSION_ROLE_KEY); } catch { return false; }
  if (role === 'demo') {
    let session;
    try { session = JSON.parse(sessionStorage.getItem(DEMO_SESSION_KEY)); } catch { return false; }
    if (!isDemoSessionActive(session)) {
      if (session?.id) await deleteDemoDatabase(session).catch(() => false);
      configureRealDatabase();
      try { sessionStorage.removeItem(DEMO_SESSION_KEY); sessionStorage.removeItem(SESSION_ROLE_KEY); } catch { /* Sin sesión que limpiar. */ }
      return false;
    }
    await startDemoSession(session);
    return true;
  }
  if (!state.settings.ownerPinHash || !state.settings.delegatePinHash || !['owner', 'delegate'].includes(role)) return false;
  applyRole(role);
  return true;
}

function showAuth() {
  try { sessionStorage.removeItem(SESSION_ROLE_KEY); } catch { /* Sin sesión persistente que limpiar. */ }
  document.body.classList.add('auth-locked');
  document.body.classList.remove('delegate-mode');
  document.body.classList.remove('demo-mode');
  $('#settings-nav').hidden = false;
  $('#demo-team-panel').classList.add('hidden');
  state.role = null;
  const initial = !state.settings.ownerPinHash || !state.settings.delegatePinHash;
  $('#auth-title').textContent = initial ? 'Configurar acceso' : 'Acceso a CampoBase';
  $('#auth-help').textContent = initial ? 'Configura una sola vez dos PIN distintos. El de Migue da acceso total y el del delegado solo al partido.' : 'Introduce el PIN de Migue, del delegado o el PIN temporal de demo.';
  $('#initial-pin-fields').classList.toggle('hidden', !initial);
  $('#login-pin-field').classList.toggle('hidden', initial);
  const form = $('#auth-form');
  form.elements.newOwnerPin.required = initial;
  form.elements.newDelegatePin.required = initial;
  form.elements.pin.required = !initial;
  form.reset();
  $('#auth-error').textContent = '';
  if (!$('#auth-dialog').open) $('#auth-dialog').showModal();
}

async function submitAuth(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const initial = !state.settings.ownerPinHash || !state.settings.delegatePinHash;
  try {
    if (initial) {
      await savePins(form.elements.newOwnerPin.value, form.elements.newDelegatePin.value);
      applyRole('owner');
    } else {
      const pin = form.elements.pin.value;
      if (await verifyPin(pin, state.settings.pinSalt, state.settings.ownerPinHash)) applyRole('owner');
      else if (await verifyPin(pin, state.settings.pinSalt, state.settings.delegatePinHash)) applyRole('delegate');
      else if (state.settings.demoPinHash && await verifyPin(pin, state.settings.demoPinSalt, state.settings.demoPinHash)) {
        await startDemoSession(createDemoSession(crypto.randomUUID()));
      }
      else throw new TypeError('PIN incorrecto.');
    }
    $('#auth-dialog').close();
  } catch (error) {
    $('#auth-error').textContent = error.message;
  }
}

async function changePins(event) {
  event.preventDefault();
  if (state.role !== 'owner') return toast('Solo Migue puede cambiar los PIN.');
  const values = formObject(event.currentTarget);
  if (!await verifyPin(values.currentPin, state.settings.pinSalt, state.settings.ownerPinHash)) return toast('El PIN actual de Migue no es correcto.');
  await savePins(values.ownerPin, values.delegatePin);
  event.currentTarget.reset();
  toast('PIN de Migue y delegado actualizados.');
}

async function changeDemoPin(event) {
  event.preventDefault();
  if (state.role !== 'owner') return toast('Solo Migue puede cambiar el PIN de demo.');
  const form = event.currentTarget;
  const values = formObject(form);
  if (!await verifyPin(values.currentPin, state.settings.pinSalt, state.settings.ownerPinHash)) return toast('El PIN actual de Migue no es correcto.');
  if (await verifyPin(values.demoPin, state.settings.pinSalt, state.settings.ownerPinHash)
      || await verifyPin(values.demoPin, state.settings.pinSalt, state.settings.delegatePinHash)) {
    return toast('El PIN de demo debe ser distinto de los PIN de Migue y delegado.');
  }
  const demoPinSalt = crypto.randomUUID();
  const demoPinHash = await hashPin(values.demoPin, demoPinSalt);
  state.settings = { ...state.settings, demoPinSalt, demoPinHash };
  await put('settings', state.settings);
  form.reset();
  toast('PIN de demo guardado.');
}

async function changeLiveScore(team, delta) {
  state.timer.details = adjustLiveScore(ensureLiveDetails(), team, Number(delta));
  await persistTimer();
  renderLive(); renderDelegate(); toast('Marcador actualizado.');
}

async function addLiveEvent(prefix) {
  const playerId = $(`#${prefix}-event-player`).value;
  const kind = $(`#${prefix}-event-kind`).value;
  const note = $(`#${prefix}-event-note`).value.trim();
  if (!playerId) return toast('Selecciona un jugador.');
  state.timer.details = addPlayerMatchEvent(ensureLiveDetails(), { id: uid(), kind, playerId, second: timerSeconds(), note });
  await persistTimer(); renderLive(); renderDelegate(); toast('Incidencia registrada.');
}

async function pollLiveState() {
  if (!state.role) return;
  if (state.role === 'demo' && !isDemoSessionActive(state.demoSession)) {
    await endDemoSession('La demostración ha finalizado al cumplirse el límite de dos horas.');
    return;
  }
  const live = await getOne('settings', 'live');
  if ((live?.updatedAt ?? 0) <= state.liveUpdatedAt) return;
  state.liveUpdatedAt = live?.updatedAt ?? 0;
  state.timer = live.timer;
  syncLiveTacticFromTimer();
  await refresh();
  if (state.role === 'delegate') { enterDelegateMode(); } else { renderLive(); renderDelegate(); }
}

function wireEvents() {
  $$('.bottom-nav button').forEach((button) => button.addEventListener('click', () => showView(button.dataset.view)));
  $('#global-search').addEventListener('input', applyGlobalSearch);
  $$('[data-dialog]').forEach((button) => button.addEventListener('click', () => { const form = $(`#${button.dataset.dialog} form`); form?.reset(); if (form?.elements.id) form.elements.id.value = ''; $(`#${button.dataset.dialog}`).showModal(); }));
  $$('[data-close]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
  $('#player-form').addEventListener('submit', (event) => savePlayer(event).catch(handleError)); $('#player-stats-form').addEventListener('submit', (event) => savePlayerStats(event).catch(handleError)); $('#match-form').addEventListener('submit', (event) => saveMatch(event).catch(handleError));
  $('#auth-form').addEventListener('submit', (event) => submitAuth(event).catch(handleError));
  $('#auth-dialog').addEventListener('cancel', (event) => event.preventDefault());
  $('#pin-settings-form').addEventListener('submit', (event) => changePins(event).catch(handleError));
  $('#demo-pin-settings-form').addEventListener('submit', (event) => changeDemoPin(event).catch(handleError));
  $('#team-settings-form').addEventListener('submit', (event) => saveTeamSettings(event).catch(handleError));
  $('#demo-team-form').addEventListener('submit', (event) => saveDemoTeam(event).catch(handleError));
  $('#new-callup').addEventListener('click', () => callupBuilder()); $('#new-training').addEventListener('click', () => attendanceBuilder()); $('#new-session').addEventListener('click', () => sessionBuilder()); $('#new-session-exercises').addEventListener('click', () => { showView('sesiones'); sessionBuilder(); }); $('#new-tactic').addEventListener('click', () => tacticBuilder());
  $('#exercise-filters').addEventListener('input', renderExercises);
  $('#exercise-filters').addEventListener('change', renderExercises);
  $('#tactica-filters').addEventListener('change', renderTacticasInteractivas);
  document.addEventListener('input', (event) => {
    if (event.target.matches('#session-form [name="blockDuration"]')) refreshSessionDurationStatus();
  });
  document.addEventListener('change', (event) => {
    if (event.target.matches('#tactic-form [name="formation"]')) {
      const form = event.target.closest('#tactic-form');
      const values = formObject(form);
      const base = defaultTactic(values.format || 'F7', values.formation);
      tacticDraft = { ...base, id: values.id, name: values.name, rival: values.rival, situation: values.situation, formation: values.formation, team: base.team, opponent: base.opponent, ball: base.ball, moves: [], notes: values.notes };
      const t = tacticDraft;
      const board = form.querySelector('.tactic-board');
      if (board) board.outerHTML = renderTacticBoard(t);
    }
  });
  // Interacción de la pizarra táctica: arrastrar jugadores, dibujar flechas, colocar balón.
  document.addEventListener('pointerdown', (event) => {
    const svg = event.target.closest('.tactic-board svg');
    if (!svg) return;
    const form = svg.closest('#tactic-form');
    if (!form) return;
    const piece = event.target.closest('[data-piece]')?.dataset.piece;
    const point = tacticPoint(event, svg);
    if (tacticTool === 'select' && (piece === 'team' || piece === 'opponent')) {
      const idx = Number(event.target.closest('[data-idx]').dataset.idx);
      const side = piece;
      const move = (ev) => {
        const p = tacticPoint(ev, svg);
        tacticDraft = moveTacticPiece(tacticDraft, side, idx, p);
        const el = svg.querySelector(`[data-piece="${side}"][data-idx="${idx}"]`);
        if (el) { el.querySelector('circle').setAttribute('cx', tacticDraft[side][idx].x); el.querySelector('circle').setAttribute('cy', tacticDraft[side][idx].y); el.querySelector('text').setAttribute('x', tacticDraft[side][idx].x); el.querySelector('text').setAttribute('y', tacticDraft[side][idx].y + 1.2); }
      };
      const up = () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); };
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
    } else if (tacticTool === 'ball') {
      tacticDraft = moveTacticPiece(tacticDraft, 'ball', 0, point);
      const ball = svg.querySelector('[data-piece="ball"]');
      if (ball) { ball.querySelector('circle').setAttribute('cx', tacticDraft.ball.x); ball.querySelector('circle').setAttribute('cy', tacticDraft.ball.y); }
    } else if (tacticTool === 'erase') {
      const arrow = event.target.closest('[data-piece="arrow"]');
      if (arrow && arrow.dataset.idx !== undefined) {
        const idx = Number(arrow.dataset.idx);
        tacticDraft = { ...tacticDraft, moves: (tacticDraft.moves || []).filter((_, i) => i !== idx) };
        rerenderTacticBoard();
      }
    } else if (tacticTool === 'clear') {
      tacticDraft = { ...tacticDraft, moves: [] };
      rerenderTacticBoard();
    } else if (['pass', 'move', 'dribble', 'shot', 'sprint'].includes(tacticTool)) {
      const start = point;
      const cls = { pass: 'tac-pass', move: 'tac-move', dribble: 'tac-dribble', shot: 'tac-shot', sprint: 'tac-sprint' }[tacticTool] || 'tac-pass';
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', start.x); line.setAttribute('y1', start.y); line.setAttribute('x2', start.x); line.setAttribute('y2', start.y);
      line.setAttribute('class', `tac-arrow ${cls}`);
      svg.appendChild(line);
      const move = (ev) => {
        const p = tacticPoint(ev, svg);
        line.setAttribute('x2', p.x); line.setAttribute('y2', p.y);
      };
      const up = () => {
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        const to = { x: Number(line.getAttribute('x2')), y: Number(line.getAttribute('y2')) };
        line.remove();
        const created = createTacticMove(start, to, tacticTool);
        if (created) {
          tacticDraft = { ...tacticDraft, moves: [...(tacticDraft.moves || []), created] };
          rerenderTacticBoard();
        }
      };
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
    }
  });
  $('#export-data').addEventListener('click', () => exportData().catch(handleError)); $('#import-data').addEventListener('change', importData);
  $('#format').addEventListener('change', async (event) => {
    state.format = event.target.value;
    state.settings = { ...state.settings, id: 'main', format: state.format };
    await put('settings', state.settings);
    renderAll();
    if (!$('#callup-builder').classList.contains('hidden')) callupBuilder($('#callup-form')?.elements.matchId.value ?? '');
    toast(`Modalidad ${state.format} guardada y aplicada en toda la app.`);
  });
  document.addEventListener('change', (event) => {
    if (event.target.id === 'live-select') return updateKeeperOptions(event.target.value);
    if (event.target.matches('[data-minute-reason]')) {
      ensureLiveDetails().minuteReasons[event.target.dataset.minuteReason] = event.target.value;
      persistTimer().catch(handleError);
      return;
    }
    const attendanceForm = event.target.closest('#training-form');
    if (attendanceForm && event.target.name.startsWith('status-')) {
      const arrival = event.target.closest('.attendance-row').querySelector('.arrival-time');
      arrival.classList.toggle('hidden', event.target.value !== 'late');
      if (event.target.value !== 'late') $$('select', arrival).forEach((select) => { select.value = ''; });
      return;
    }
    if (attendanceForm && event.target.name === 'kind') {
      const firstMatchId = state.matches.find(({ callupId }) => callupId)?.id ?? '';
      return event.target.value === 'match' ? attendanceBuilder(firstMatchId) : attendanceBuilder();
    }
    if (attendanceForm && event.target.name === 'matchId') return attendanceBuilder(event.target.value);
    const sessionForm = event.target.closest('#session-form');
    if (sessionForm && event.target.name === 'blockExerciseId') {
      const exercise = state.exercises.find(({ id }) => id === event.target.value);
      const row = event.target.closest('.session-block');
      if (exercise && row) {
        row.querySelector('[name="blockType"]').value = exercise.category === 'Calentamiento' ? 'warmup' : exercise.category === 'Partido condicionado / Small-sided games' ? 'final' : 'main';
        row.querySelector('.pill').textContent = sessionBlockLabel(row.querySelector('[name="blockType"]').value);
      }
      return;
    }
    if (sessionForm && event.target.name === 'warmupId') {
      const selected = state.exercises.find(({ id }) => id === event.target.value);
      if (selected) sessionForm.elements.warmupDuration.value = selected.duration;
      return;
    }
    const form = event.target.closest('#callup-form'); if (!form) return;
    if (event.target.matches('input[name="matchSource"]')) updateMatchSource();
    if (event.target.matches('input[name="manualExcluded"]')) {
      const card = event.target.closest('[data-player-id]');
      const reason = form.elements[`reason-${event.target.value}`];
      const note = form.elements[`reasonNote-${event.target.value}`];
      reason.disabled = !event.target.checked;
      if (!event.target.checked) {
        reason.value = '';
        note.value = '';
        note.required = false;
        note.closest('.exclusion-other-note').classList.add('hidden');
      }
      const selected = card.querySelector('input[name="selected"]');
      if (event.target.checked) selected.checked = false;
    }
    if (event.target.matches('select[name^="reason-"]')) {
      const playerId = event.target.name.slice('reason-'.length);
      const note = form.elements[`reasonNote-${playerId}`];
      const usesOtherReason = event.target.value === 'other';
      note.required = usesOtherReason;
      note.closest('.exclusion-other-note').classList.toggle('hidden', !usesOtherReason);
      if (!usesOtherReason) note.value = '';
    }
    if (event.target.matches('input[name="selected"]') && event.target.checked) {
      const excluded = event.target.closest('[data-player-id]').querySelector('input[name="manualExcluded"]');
      const note = form.elements[`reasonNote-${event.target.value}`];
      excluded.checked = false;
      form.elements[`reason-${event.target.value}`].disabled = true;
      form.elements[`reason-${event.target.value}`].value = '';
      note.value = '';
      note.required = false;
      note.closest('.exclusion-other-note').classList.add('hidden');
    }
    updateTargetPreview();
  });
  document.addEventListener('submit', (event) => {
    const form = event.target.closest ? event.target.closest('form') : event.target;
    if (!form) return;
    event.preventDefault();
    const formId = form.getAttribute('id');
    if (formId === 'callup-form') saveCallup(event).catch(handleError);
    else if (formId === 'training-form') saveTraining(event).catch(handleError);
    else if (formId === 'rating-form') saveMatchRatings(event).catch(handleError);
    else if (formId === 'exercise-form') saveExercise(event).catch(handleError);
    else if (formId === 'session-form') saveTrainingSession(event).catch(handleError);
    else if (formId === 'add-session-form') saveAddToSession(event).catch(handleError);
    else if (formId === 'tactic-form') saveTactic(event).catch(handleError);
  });
  document.addEventListener('click', async (event) => {
    const target = event.target;
    if (target.matches('.cancel-builder')) $('#callup-builder').classList.add('hidden');
    if (target.matches('.cancel-training')) $('#training-builder').classList.add('hidden');
    if (target.matches('.cancel-session')) $('#session-builder').classList.add('hidden');
    if (target.matches('.cancel-tactic')) $('#tactic-builder').classList.add('hidden');
    const tacticToolButton = target.closest('.tactic-tool[data-tactic-tool]');
    if (tacticToolButton) {
      tacticTool = tacticToolButton.dataset.tacticTool;
      $$('.tactic-tool[data-tactic-tool]').forEach((btn) => btn.classList.toggle('active', btn.dataset.tacticTool === tacticTool));
    }
    if (target.matches('.view-tactic')) showTacticDetail(target.dataset.id);
    if (target.matches('.open-tactica-interactiva')) showTacticaInteractiva(target.dataset.id);
    if (target.matches('.edit-tactica-manual')) tacticBuilder('', target.dataset.formacion);
    if (target.matches('#tactica-interactiva-close')) closeTacticaInteractiva();
    if (target.matches('.edit-tactic')) tacticBuilder(target.dataset.id);
    if (target.matches('.delete-tactic') && await askConfirmation({ title: 'Borrar táctica', message: 'Se eliminará esta táctica de la base.', acceptLabel: 'Borrar', danger: true })) { await remove('settings', target.dataset.id); await refresh(); }
    if (target.matches('.edit-player')) editPlayer(target.dataset.id);
    if (target.matches('.edit-player-stats')) editPlayerStats(target.dataset.playerId, target.dataset.scope);
    if (target.matches('.delete-player') && await askConfirmation({ title: 'Borrar jugador', message: 'Los históricos conservarán su identificador, pero la ficha del jugador se eliminará.', acceptLabel: 'Borrar', danger: true })) { await remove('players', target.dataset.id); await refresh(); }
    if (target.matches('.delete-callup')) await deleteCallup(target.dataset.id);
    if (target.matches('.edit-callup')) callupBuilder('', target.dataset.id);
    if (target.matches('.edit-match')) editMatch(target.dataset.id);
    if (target.matches('.match-detail')) showMatchDetail(target.dataset.id);
    if (target.matches('.add-detail-event')) await addDetailEvent(target.dataset.id);
    if (target.matches('.remove-match-event')) await removeMatchEvent($('#match-detail-dialog').dataset.matchId, target.dataset.kind, Number(target.dataset.index));
    if (target.matches('.reopen-match')) await reopenMatch(target.dataset.id);
    if (target.matches('.rate-match')) openRateMatch(target.dataset.id);
    if (target.matches('.remove-player-incident')) await removePlayerIncident(target.dataset.key);
    if (target.matches('.edit-attendance')) attendanceBuilder('', target.dataset.id);
    if (target.matches('.callup-match')) { $$('.bottom-nav button').forEach((item) => item.classList.toggle('active', item.dataset.view === 'convocatorias')); $$('.view').forEach((view) => view.classList.toggle('active', view.id === 'convocatorias')); callupBuilder(target.dataset.id); }
    if (target.matches('.delete-match')) await deleteMatch(target.dataset.id);
    if (target.matches('.delete-training') && await askConfirmation({ title: 'Borrar asistencia', message: 'Se eliminará este registro de asistencia.', acceptLabel: 'Borrar', danger: true })) { await remove('trainings', target.dataset.id); await refresh(); }
    if (target.matches('.edit-exercise')) editExercise(target.dataset.id);
    if (target.matches('.add-exercise-to-session')) {
      if (!$('#session-builder').classList.contains('hidden')) {
        const exercise = state.exercises.find(({ id }) => id === target.dataset.id);
        if (exercise) { syncSessionDraft(); sessionDraftBlocks = addExerciseToSession({ blocks: sessionDraftBlocks }, exercise).blocks; renderSessionDraft(); toast(`${exercise.name} añadido a la sesión.`); }
      } else openAddToSession(target.dataset.id);
    }
    if (target.matches('.favorite-exercise')) { const item = state.exercises.find(({ id }) => id === target.dataset.id); if (item) { await put('settings', { ...item, favorite: !item.favorite, updatedAt: Date.now() }); await refresh(); } }
    if (target.matches('.delete-exercise') && await askConfirmation({ title: 'Borrar ejercicio', message: 'Se eliminará de la base. Las sesiones antiguas conservarán el bloque como “Ejercicio eliminado”.', acceptLabel: 'Borrar', danger: true })) { await remove('settings', target.dataset.id); await refresh(); }
    if (target.matches('.edit-session')) sessionBuilder(target.dataset.id);
    if (target.matches('.view-session')) showSessionDetail(target.dataset.id);
    if (target.matches('.session-exercise-link, .view-exercise')) showExerciseDetail(target.dataset.exerciseId);
    if (target.matches('.move-session-block')) { syncSessionDraft(); sessionDraftBlocks = moveSessionBlock(sessionDraftBlocks, Number(target.dataset.index), Number(target.dataset.direction)); renderSessionDraft(); }
    if (target.matches('.remove-session-block')) { syncSessionDraft(); sessionDraftBlocks = removeSessionBlock(sessionDraftBlocks, Number(target.dataset.index)); renderSessionDraft(); }
    if (target.matches('.delete-session') && await askConfirmation({ title: 'Borrar sesión', message: 'Se eliminará esta sesión de entrenamiento.', acceptLabel: 'Borrar', danger: true })) { await remove('settings', target.dataset.id); await refresh(); }
    if (target.id === 'prepare-live') await prepareLive();
    if (target.id === 'advance-live') await advanceLivePhase();
    if (target.id === 'make-sub') await makeSubstitution();
    if (target.id === 'exit-live') await cancelLiveMatch();
    if (target.id === 'open-delegate') enterDelegateMode();
    if (target.id === 'unlock-delegate') await unlockDelegate();
    if (target.id === 'close-delegate') closeDelegateMode();
    if (target.id === 'delegate-manual-sub') {
      const outIds = checkedValues('delegate-out'); const inIds = checkedValues('delegate-in');
      if (outIds.length < 1 || outIds.length > 7 || outIds.length !== inIds.length) return toast('Selecciona el mismo número de entradas y salidas: de 1 a 7.');
      try { await registerDelegateSubstitution(outIds, inIds); } catch (error) { handleError(error); }
    }
    if (target.id === 'apply-delegate-suggestion' || target.id === 'urgent-change') {
      const match = state.matches.find(({ id }) => id === state.timer?.matchId); const callup = state.callups.find(({ id }) => id === match?.callupId);
      const played = livePlayedSeconds(); const bench = callup.availableIds.filter((id) => !state.timer.onField.includes(id));
      const suggestion = suggestDelegateSubstitution(state.timer.onField, bench, played, 1, liveKeeperIds());
      $('#urgent-dialog')?.close();
      try { await registerDelegateSubstitution(suggestion.outIds, suggestion.inIds); } catch (error) { handleError(error); }
    }
    if (target.id === 'owner-auto-sub' || target.id === 'delegate-auto-sub') {
      const match = state.matches.find(({ id }) => id === state.timer?.matchId); const callup = state.callups.find(({ id }) => id === match?.callupId);
      const bench = callup.availableIds.filter((id) => !state.timer.onField.includes(id));
      const count = Math.min(3, bench.length, state.timer.onField.length);
      if (count < 1) return toast('No hay suficientes jugadores para un cambio automático.');
      const suggestion = suggestDelegateSubstitution(state.timer.onField, bench, livePlayedSeconds(), count, liveKeeperIds());
      if (await askConfirmation({ title: `Cambio automático de ${count}`, message: `Entran ${suggestion.inIds.map(playerName).join(', ')} y salen ${suggestion.outIds.map(playerName).join(', ')}.`, acceptLabel: 'Registrar cambio' })) await registerDelegateSubstitution(suggestion.outIds, suggestion.inIds);
    }
    if (target.id === 'propose-reparto' || target.id === 'delegate-propose-reparto') {
      await proposeReparto();
    }
    if (target.matches('.score-step')) await changeLiveScore(target.dataset.scoreTeam, Number(target.dataset.delta));
    if (target.matches('.add-live-event')) await addLiveEvent(target.dataset.prefix);
    if (target.matches('.save-live-comments')) {
      if (!roleCanUseOwnerFeatures(state.role)) return toast('Los comentarios son solo de Migue.');
      ensureLiveDetails().comments = $(`#${target.dataset.prefix}-comments`).value.trim();
      await persistTimer(); renderLive(); renderDelegate(); toast('Comentarios guardados.');
    }
    if (target.id === 'logout') {
      if (state.role === 'demo') await endDemoSession();
      else showAuth();
    }
  });
}

function handleError(error) { console.error(error); toast(error.message || 'Ha ocurrido un error.'); }
function networkStatus() {
  if (isDemoDatabase()) {
    document.body.classList.remove('offline');
    $('#network-label').textContent = `Demo temporal · máximo ${DEMO_DURATION_MS / 3_600_000} h`;
    $('#network-label').title = 'Datos aislados: no se envían a Supabase.';
    return;
  }
  document.body.classList.toggle('offline', !navigator.onLine);
  $('#network-label').textContent = !navigator.onLine
    ? 'Sin conexión · caché local'
    : state.cloudConnected ? 'Supabase sincronizado' : 'Supabase pendiente';
  $('#network-label').title = state.cloudError;
}

async function synchronizeCloud() {
  if (isDemoDatabase()) {
    await refresh();
    return networkStatus();
  }
  if (!navigator.onLine) return networkStatus();
  try {
    const result = await syncFromCloud();
    state.cloudConnected = result.online;
    state.cloudError = '';
    await refresh();
  } catch (error) {
    state.cloudConnected = false;
    state.cloudError = error.message || 'No se pudo sincronizar con Supabase.';
    console.warn('Sincronización Supabase no disponible:', error.message);
  }
  networkStatus();
}

async function init() {
  const matchForm = $('#match-form');
  matchForm.elements.dateDay.innerHTML = dayOptions();
  matchForm.elements.dateMonth.innerHTML = monthOptions();
  matchForm.elements.dateYear.innerHTML = yearOptions();
  matchForm.elements.dateHour.innerHTML = selectOptions(24);
  matchForm.elements.dateMinute.innerHTML = selectOptions(60);
  const addSessionForm = $('#add-session-form');
  addSessionForm.elements.dateDay.innerHTML = dayOptions();
  addSessionForm.elements.dateMonth.innerHTML = monthOptions();
  addSessionForm.elements.dateYear.innerHTML = yearOptions();
  const categoryOptions = EXERCISE_CATEGORIES.map((category) => `<option value="${category}">${category}</option>`).join('');
  $('#exercise-form').elements.category.innerHTML = categoryOptions;
  $('#exercise-filters').elements.category.insertAdjacentHTML('beforeend', categoryOptions);
  wireEvents(); networkStatus();
  configureCloudStore(createCampoBaseCloudStore());
  window.addEventListener('online', () => synchronizeCloud().catch(handleError));
  window.addEventListener('offline', networkStatus);
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(handleError);
  await synchronizeCloud();
  await ensureSquadSeeded();
  await ensurePhase2Seeded();
  await ensurePhase2V2Seeded();
  await ensurePhase2V3Seeded();
  await ensureRealExercisesSeeded();
  await ensureSlideshareSeeded();
  await ensureLegacyExercisesNotPresent();
  await refresh(); const live = await getOne('settings', 'live'); state.timer = live?.timer ?? null; state.liveUpdatedAt = live?.updatedAt ?? 0; renderLive(); renderDelegate();
  if (!await restoreSessionRole()) showAuth();
  setInterval(() => pollLiveState().catch(handleError), 1000);
  setInterval(() => synchronizeCloud().catch(handleError), 10000);
}

init().catch(handleError);
