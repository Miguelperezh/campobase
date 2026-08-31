import { configureCloudStore, getAll, getOne, put, putBatch, remove, exportDatabase, importDatabase, syncFromCloud } from './db.js';
import { createCampoBaseCloudStore } from './supabase-client.js';
import { calculateMinuteTargets, buildCallupSelection, buildAttendanceRecord, calculateAttendanceStats, applySubstitution, normalizePositions, calculatePlayedSeconds, validateBackup, formatMatchClock, buildPlayerHistory, sortAttendanceRecords, suggestDelegateSubstitution, shouldSuggestUrgentSubstitution, accumulateSeasonMinutes, seasonKey, shouldAutoPause, hashPin, verifyPin, buildPlayerRatings, sortPlayersByName, updateRotationCounters, calledPlayerOptions, adjustLiveScore, addPlayerMatchEvent, buildPlayerSummary } from './domain.js';
import { EXERCISE_CATEGORIES, INITIAL_EXERCISES, WARMUP_TEMPLATES, PHASE2_V3_EXERCISES, buildExercise, filterExercises, planPhase2V2Seed, planPhase2V3Seed, renderExerciseDiagram, buildTrainingSession, sortTrainingSessions } from './training-domain.js';
import { REAL_EXERCISES, SLIDESHARE_EXERCISES, renderRealDiagram } from './real-exercises.js';
import { addExerciseToSession, buildFlexibleTrainingSession, completeExercise, moveSessionBlock, removeSessionBlock, renderBoardDiagrams, sessionDurationStatus } from './exercise-planning.js';
import { TACTIC_FORMATS, FORMATION_NAMES, FORMATION_GUIDES, buildTactic, defaultTactic, renderTacticBoard, sortTactics } from './tactics.js';

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
const EXCLUSION_REASONS = { sick: 'Enfermo', missed_training: 'No fue a entrenar', discipline: 'Disciplina (notas/padres)', coach_decision: 'Decisión del entrenador', rotation: 'Rotación equitativa' };
const MINUTE_REASONS = { discipline: 'Disciplina', absence: 'Falta', illness: 'Enfermedad', goalkeeper_rotation: 'Rotación de porteros', sin_indicar: 'Sin indicar' };

const state = { players: [], callups: [], matches: [], trainings: [], exercises: [], trainingSessions: [], tactics: [], settings: {}, format: 'F7', timer: null, liveUpdatedAt: 0, tick: null, role: null, delegateMode: false, urgentAlertKey: '', finishing: false, cloudConnected: false, cloudError: '' };
const SESSION_ROLE_KEY = 'campobase.sessionRole';
let toastTimer;
let sessionDraftBlocks = [];
let sessionDraftMeta = null;
let pendingExerciseId = '';

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
  form.elements[`${name}Day`].value = day;
  form.elements[`${name}Hour`].value = hour || '00';
  form.elements[`${name}Minute`].value = minute || '00';
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
function playerCardPhoto(player) { return safePhoto(player.photo) ? `<img class="avatar" src="${safePhoto(player.photo)}" alt="Foto de ${escapeHtml(player.name)}">` : `<div class="avatar" aria-hidden="true">${escapeHtml(player.name.slice(0, 2).toUpperCase())}</div>`; }
function showView(viewId) {
  $$('.view').forEach((view) => view.classList.toggle('active', view.id === viewId));
  $$('.bottom-nav button').forEach((item) => item.classList.toggle('active', item.dataset.view === viewId));
  $('#app').focus();
}

async function refresh() {
  [state.players, state.callups, state.matches, state.trainings] = await Promise.all(['players', 'callups', 'matches', 'trainings'].map(getAll));
  state.players = sortPlayersByName(state.players);
  const settingRecords = await getAll('settings');
  state.exercises = settingRecords.filter(({ recordType }) => recordType === 'exercise');
  state.trainingSessions = settingRecords.filter(({ recordType }) => recordType === 'trainingSession');
  state.tactics = settingRecords.filter(({ recordType }) => recordType === 'tactic');
  const settings = settingRecords.find(({ id }) => id === 'main');
  state.settings = settings ?? { id: 'main' };
  state.format = settings?.format ?? 'F7';
  $('#format').value = state.format;
  $('#team-settings-form').elements.teamName.value = state.settings.teamName ?? '';
  renderAll();
}

function renderAll() {
  const config = FORMATS[state.format];
  $('#active-format').textContent = `${state.format} · ${config.players} en campo · ${config.duration} min`;
  renderPlayers(); renderCallups(); renderLive(); renderDelegate(); renderMatches(); renderTrainings(); renderExercises(); renderTrainingSessions(); renderTactics();
}

function renderPlayers() {
  const totalMinutes = state.players.reduce((sum, player) => sum + (player.totalMinutes ?? 0), 0);
  $('#squad-stats').innerHTML = `<div class="stat"><strong>${state.players.length}</strong><span>jugadores</span></div><div class="stat"><strong>${totalMinutes}</strong><span>minutos acumulados</span></div><div class="stat"><strong>${state.players.reduce((sum, player) => sum + (player.outsideCount ?? 0), 0)}</strong><span>ausencias por rotación</span></div>`;
  const sorted = state.players;
  $('#players-list').innerHTML = sorted.length ? sorted.map((player, index) => {
    const labels = { present: 'Presente', late: 'Tarde', absent: 'Ausente', sick: 'Enfermedad', coach_decision: 'Decisión del entrenador', missed_training: 'No fue a entrenar', discipline: 'Disciplina', rotation: 'Rotación' };
    const history = buildPlayerHistory(player.id, state.trainings, state.callups, state.matches);
    const summary = buildPlayerSummary(player.id, state.matches, state.trainings, state.callups);
    const seasonRows = Object.entries(player.seasonMinutes ?? {}).sort(([a], [b]) => b.localeCompare(a)).map(([season, minutes]) => `<li><strong>${escapeHtml(season)}</strong> · ${minutes} min</li>`).join('');
    const minuteReasonRows = (player.minuteReasons ?? []).map((item) => `<li><strong>${escapeHtml(localDate(item.date))}</strong> · ${escapeHtml(MINUTE_REASONS[item.reason] ?? item.reason)}</li>`).join('');
    const ratingRows = (player.ratingHistory ?? []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date))).map((item) => `<li><strong>${escapeHtml(localDate(item.date))}</strong> · ${escapeHtml(item.opponent || 'Partido')} · ${item.rating}/5</li>`).join('');
    const seasonRatingRows = Object.entries((player.ratingHistory ?? []).reduce((acc, item) => { const s = seasonKey(item.date); (acc[s] ??= []).push(item.rating); return acc; }, {})).sort(([a], [b]) => b.localeCompare(a)).map(([season, ratings]) => `<li><strong>${escapeHtml(season)}</strong> · media ${(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)}/5 (${ratings.length} partidos)</li>`).join('');
    const historyRows = history.map((item) => `<li><strong>${escapeHtml(localDate(item.date))}</strong> · ${item.type === 'callup' ? 'Convocatoria' : item.kind === 'match' ? 'Partido' : 'Entrenamiento'} · ${escapeHtml(labels[item.detail] ?? item.detail)}</li>`).join('');
    const incidentRows = playerIncidentRows(player.id).map((item) => `<li><strong>${escapeHtml(localDate(item.date))}</strong> · ${escapeHtml(item.label)}${item.note ? `: ${escapeHtml(item.note)}` : ''} <button type="button" class="icon-button remove-player-incident" data-key="${escapeHtml(item.key)}" aria-label="Borrar incidencia">×</button></li>`).join('');
    return `<article class="card player">
    ${playerCardPhoto(player)}
    <div><h3>${escapeHtml(player.name)} <span class="pill">#${escapeHtml(player.number || '—')}</span></h3><p class="meta">${escapeHtml(playerPositions(player))}</p><p class="meta">Pierna ${escapeHtml((player.foot || 'sin indicar').toLowerCase())} · Fuera por rotación ${player.outsideCount ?? 0} veces</p><div class="player-summary"><span><strong>${summary.goals}</strong> goles</span><span><strong>${summary.yellowCards}/${summary.redCards}</strong> amarillas/rojas</span><span><strong>${summary.injuries}</strong> lesiones</span><span><strong>${summary.incidents}</strong> incidencias</span><span><strong>${summary.callups}</strong> convocatorias</span><span><strong>${summary.rotations}</strong> rotaciones</span><span><strong>${summary.late}/${summary.absent}</strong> tarde/ausente</span><span><strong>${summary.minutes}</strong> min</span><span><strong>${summary.averageRating ?? '—'}</strong> media</span></div><p class="meta"><span class="rank">${index + 1}. ${player.totalMinutes ?? 0} min acumulados</span>${player.notes ? ` · ${escapeHtml(player.notes)}` : ''}</p>${seasonRows ? `<details><summary>Minutos por temporada</summary><ul class="plain-list">${seasonRows}</ul></details>` : ''}${ratingRows ? `<details><summary>Puntuaciones (${player.ratingHistory.length})</summary><ul class="plain-list">${ratingRows}</ul></details>` : ''}${seasonRatingRows ? `<details><summary>Media por temporada</summary><ul class="plain-list">${seasonRatingRows}</ul></details>` : ''}${minuteReasonRows ? `<details><summary>Motivos de menos minutos</summary><ul class="plain-list">${minuteReasonRows}</ul></details>` : ''}${incidentRows ? `<details><summary>Incidencias y motivos (${playerIncidentRows(player.id).length})</summary><ul class="plain-list">${incidentRows}</ul></details>` : ''}${history.length ? `<details class="player-history"><summary>Historial completo (${history.length})</summary><ul class="plain-list">${historyRows}</ul></details>` : '<p class="meta">Sin actividad registrada.</p>'}</div>
    <div><button type="button" class="icon-button edit-player" data-id="${player.id}" aria-label="Editar ${escapeHtml(player.name)}">Editar</button><button type="button" class="icon-button delete-player danger" data-id="${player.id}" aria-label="Eliminar ${escapeHtml(player.name)}">Borrar</button></div>
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
  if (!positions.length) return toast('Selecciona al menos una posición.');
  await put('players', { ...existing, id: values.id || uid(), name: values.name.trim(), number: values.number, positions, foot: values.foot, notes: values.notes.trim(), photo: photo || existing?.photo || '', outsideCount: existing?.outsideCount ?? 0, lastExcludedAt: existing?.lastExcludedAt ?? null, totalMinutes: existing?.totalMinutes ?? 0, seasonMinutes: existing?.seasonMinutes ?? {}, minuteReasons: existing?.minuteReasons ?? [], createdAt: existing?.createdAt ?? Date.now() });
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

function callupPlayerCard(player, existing) {
  const manualExclusion = existing?.exclusions?.find((item) => item.playerId === player.id && !item.automatic);
  const selected = existing?.selectedIds?.includes(player.id);
  return `<article class="selection-card" data-player-id="${player.id}">${playerCardPhoto(player)}<div class="selection-card-body"><h4>${escapeHtml(player.name)} <span class="pill">#${escapeHtml(player.number || '—')}</span></h4><p class="meta">${escapeHtml(playerPositions(player))}</p><div class="selection-actions"><label><input type="checkbox" name="selected" value="${player.id}" ${selected ? 'checked' : ''}> Convocar manualmente</label><label><input type="checkbox" name="manualExcluded" value="${player.id}" ${manualExclusion ? 'checked' : ''}> Dejar fuera</label><select name="reason-${player.id}" aria-label="Motivo de exclusión de ${escapeHtml(player.name)}" ${manualExclusion ? '' : 'disabled'}><option value="">Motivo…</option>${Object.entries(EXCLUSION_REASONS).filter(([key]) => key !== 'rotation').map(([key, label]) => `<option value="${key}" ${manualExclusion?.reason === key ? 'selected' : ''}>${label}</option>`).join('')}</select></div></div></article>`;
}

function callupBuilder(preselectedMatchId = '', editId = '') {
  const container = $('#callup-builder');
  const config = FORMATS[state.format];
  const existing = state.callups.find((callup) => callup.id === editId);
  const selectedMatchId = existing?.matchId ?? preselectedMatchId;
  container.classList.remove('hidden');
  const options = state.matches.filter((match) => match.status !== 'finished' || match.id === selectedMatchId).sort((a,b)=>a.date.localeCompare(b.date)).map((match) => `<option value="${match.id}" ${match.id === selectedMatchId ? 'selected' : ''}>${escapeHtml(localDate(match.date))} · ${escapeHtml(matchTypeLabel(match.type))}${match.round ? ` · Jornada ${escapeHtml(match.round)}` : ''} · ${escapeHtml(match.opponent)}</option>`).join('');
  container.innerHTML = `<h3>${existing ? 'Editar' : 'Nueva'} convocatoria · ${existing?.format ?? state.format}</h3><form id="callup-form"><input type="hidden" name="id" value="${existing?.id ?? ''}"><fieldset><legend>Partido</legend><div class="choice-row"><label><input type="radio" name="matchSource" value="calendar" ${existing || preselectedMatchId || options ? 'checked' : ''}> Elegir del calendario</label>${existing ? '' : `<label><input type="radio" name="matchSource" value="manual" ${!preselectedMatchId && !options ? 'checked' : ''}> Crear partido a mano</label>`}</div><div id="calendar-match-fields"><label>Partido del calendario<select name="matchId"><option value="">Selecciona…</option>${options}</select></label></div><div id="manual-match-fields" class="hidden"><div class="form-row"><fieldset class="datetime-field"><legend>Fecha y hora (24 h)</legend><input name="manualDateDay" type="date" aria-label="Fecha del partido manual">${time24Markup('manualDate', '', 'Hora del partido manual')}</fieldset><label>Jornada<input name="manualRound" maxlength="30" placeholder="Ej. 8"></label></div><div class="form-row"><label>Tipo<select name="manualType"><option value="league">Partido de liga</option><option value="friendly">Amistoso</option><option value="tournament">Torneo</option></select></label><label>Local / Visitante<select name="manualVenue"><option value="home">Local (casa)</option><option value="away">Visitante (fuera)</option></select></label></div><label>Rival<input name="manualOpponent" maxlength="100"></label><label>Lugar<input name="manualLocation" maxlength="120"></label></div></fieldset><div class="callup-help panel"><strong>Máximo 14.</strong> Marca solo quienes quieras asegurar en la convocatoria. Para dejar a alguien fuera manualmente, marca “Dejar fuera” e indica el motivo. En liga, CampoBase completa el resto con rotación justa. Si a alguien ya se le excluyó por enfermedad o decisión técnica, te pedirá confirmación antes de dejarle fuera por rotación.</div><div class="selection-grid">${state.players.map((player) => callupPlayerCard(player, existing)).join('')}</div><div id="target-preview"></div><div class="button-row"><button class="primary" type="submit">${existing ? 'Actualizar' : 'Guardar'} convocatoria y reparto</button><button class="secondary cancel-builder" type="button">Cancelar</button></div></form>`;
  updateMatchSource();
  updateTargetPreview();
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function currentCallupMatch(form) {
  if (form.elements.matchSource.value === 'manual') return { type: form.elements.manualType.value };
  return state.matches.find((match) => match.id === form.elements.matchId.value) ?? null;
}

function manualExclusionsFromForm(form) {
  return checkedValues('manualExcluded', form).map((playerId) => ({ playerId, reason: form.elements[`reason-${playerId}`].value }));
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
  if (manualExclusions.some(({ reason }) => !reason)) { preview.innerHTML = '<p class="warning panel">Indica el motivo de cada jugador que dejas fuera.</p>'; return; }
  try {
    const selection = callupSelectionFromForm(form);
    if (!selection.availableIds.length) { preview.innerHTML = '<p class="warning panel">No hay jugadores convocados.</p>'; return; }
    const targets = calculateMinuteTargets(selection.availableIds, FORMATS[state.format].duration, FORMATS[state.format].players);
    const manual = selection.exclusions.filter(({ automatic }) => !automatic);
    const automatic = selection.exclusions.filter(({ automatic: isAutomatic }) => isAutomatic);
    const exclusionList = (items) => items.length ? `<ul class="plain-list">${items.map(({ playerId, reason }) => `<li><strong>${escapeHtml(playerName(playerId))}</strong> — ${escapeHtml(EXCLUSION_REASONS[reason] ?? reason)}</li>`).join('')}</ul>` : '<p class="meta">Nadie.</p>';
    const pending = selection.pendingRotationDecisions ?? [];
    preview.innerHTML = `${pending.length ? `<p class="warning panel"><strong>Revisión necesaria:</strong> al guardar te preguntaré por ${pending.map(({ playerId }) => escapeHtml(playerName(playerId))).join(', ')} porque ya se quedaron fuera por enfermedad o decisión del entrenador.</p>` : ''}<div class="preview-summary"><h3>Convocados (${selection.availableIds.length}/14)</h3><p>${selection.availableIds.map(playerName).map(escapeHtml).join(', ')}</p><div class="exclusion-summary"><section><h4>Fuera manualmente (${manual.length})</h4>${exclusionList(manual)}</section><section><h4>Fuera por CampoBase (${automatic.length})</h4>${exclusionList(automatic)}</section></div><p><strong>Total fuera: ${selection.exclusions.length}</strong></p></div><details><summary>Ver minutos objetivo</summary><table class="minute-table"><thead><tr><th>Jugador</th><th>Objetivo</th></tr></thead><tbody>${targets.map((target) => `<tr><td>${escapeHtml(playerName(target.playerId))}</td><td>${target.minutes} min</td></tr>`).join('')}</tbody></table></details>`;
  } catch (error) { preview.innerHTML = `<p class="warning panel">${escapeHtml(error.message)}</p>`; }
}

function updateMatchSource() {
  const form = $('#callup-form'); if (!form) return;
  const manual = form.elements.matchSource.value === 'manual';
  $('#manual-match-fields').classList.toggle('hidden', !manual);
  $('#calendar-match-fields').classList.toggle('hidden', manual);
  for (const name of ['manualDateDay', 'manualDateHour', 'manualDateMinute', 'manualOpponent']) form.elements[name].required = manual;
  form.elements.matchId.required = !manual;
}

async function saveCallup(event) {
  event.preventDefault(); const form = event.target.closest('form');
  const existing = form.elements.id.value ? state.callups.find(({ id }) => id === form.elements.id.value) : null;
  let match = currentCallupMatch(form);
  if (!match) return toast('Selecciona un partido del calendario.');
  const manualMatch = form.elements.matchSource.value === 'manual';
  if (manualMatch) {
    match = { id: uid(), date: composeDateTime24(form.elements.manualDateDay.value, form.elements.manualDateHour.value, form.elements.manualDateMinute.value), round: form.elements.manualRound.value.trim(), type: form.elements.manualType.value, venue: form.elements.manualVenue.value, opponent: form.elements.manualOpponent.value.trim(), location: form.elements.manualLocation.value.trim(), goalsFor: null, goalsAgainst: null, status: 'planned', createdAt: Date.now() };
  }
  const manualExclusions = manualExclusionsFromForm(form);
  if (manualExclusions.some(({ reason }) => !reason)) return toast('Indica el motivo de cada jugador que dejas fuera.');
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
  const targets = calculateMinuteTargets(availableIds, config.duration, config.players);
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
    const exclusionRows = (automatic) => exclusions.filter((item) => Boolean(item.automatic) === automatic).map(({ playerId, reason }) => `<li><strong>${escapeHtml(playerName(playerId))}</strong> — ${escapeHtml(EXCLUSION_REASONS[reason] ?? reason)}</li>`).join('') || '<li>Nadie</li>';
    return `<article class="panel"><div class="section-head"><div><span class="pill accent">${escapeHtml(callup.format)} · ${escapeHtml(matchTypeLabel(callup.matchType))}</span><h3>${escapeHtml(callup.opponent)}</h3><p class="meta">${escapeHtml(localDate(callup.date))} · ${callup.availableIds.length} convocados · ${exclusions.length} fuera</p></div><div class="button-row"><button type="button" class="edit-callup secondary" data-id="${callup.id}">Editar</button><button type="button" class="delete-callup danger" data-id="${callup.id}">Borrar</button></div></div><div class="exclusion-summary"><section><h4>Fuera manualmente</h4><ul class="plain-list">${exclusionRows(false)}</ul></section><section><h4>Fuera por CampoBase</h4><ul class="plain-list">${exclusionRows(true)}</ul></section></div><details><summary>Ver reparto objetivo</summary><table class="minute-table">${callup.targets.map((target) => `<tr><td>${escapeHtml(playerName(target.playerId))}</td><td>${target.minutes} min</td></tr>`).join('')}</table></details></article>`;
  }).join('') : empty('Todavía no hay convocatorias.');
}

async function deleteCallup(id) {
  const callup = state.callups.find((item) => item.id === id); if (!callup || !await askConfirmation({ title: 'Borrar convocatoria', message: 'Se borrará esta convocatoria y se recalcularán sus contadores de rotación.', acceptLabel: 'Borrar', danger: true })) return;
  const match = state.matches.find((item) => item.callupId === id); if (match) await put('matches', { ...match, callupId: null });
  await remove('callups', id); await synchronizeRotationCounters(); await refresh(); toast('Convocatoria borrada.');
}

function timerSeconds(timer = state.timer) {
  if (!timer) return 0;
  return timer.elapsed + (timer.runningSince ? Math.floor((Date.now() - timer.runningSince) / 1000) : 0);
}

function ensureLiveDetails() {
  state.timer.details = { goalsFor: 0, goalsAgainst: 0, goals: [], cards: [], injuries: [], incidents: [], comments: '', minuteReasons: {}, ...(state.timer.details ?? {}) };
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
  const comments = state.role === 'owner' ? `<label>Comentarios solo de Migue<textarea id="${prefix}-comments" maxlength="2000">${escapeHtml(details.comments)}</textarea></label><button class="save-live-comments secondary" data-prefix="${prefix}">Guardar comentarios</button>` : '';
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
  const phaseLabels = { ready: 'Preparado', first_half: '1.er tiempo', halftime: 'Descanso', second_half: state.timer.autoPaused ? '2.º tiempo pausado' : '2.º tiempo' };
  const actionLabels = { ready: 'Comienzo', first_half: 'Descanso', halftime: 'Segundo tiempo', second_half: 'Final del partido' };
  const fieldIds = state.timer.onField;
  root.innerHTML = `<div class="live-clock"><span class="pill accent">${escapeHtml(matchTeams(match).home)} — ${escapeHtml(matchTeams(match).away)} · ${escapeHtml(callup.format)}</span><div id="clock" class="clock">${formatMatchClock(seconds)}</div><div id="half" class="half">${phaseLabels[state.timer.phase]} · auto-pausa 38:00/74:00</div><div class="button-row"><button id="advance-live" class="${state.timer.phase === 'second_half' ? 'danger' : 'primary'}">${actionLabels[state.timer.phase]}</button>${state.role === 'owner' ? '<button id="open-delegate" class="secondary">Vista delegado</button><button id="exit-live" class="danger">Salir sin finalizar</button>' : ''}</div></div>
  <div class="live-grid"><div class="panel on-field"><h3>En campo (${fieldIds.length}/${config.players})</h3><div class="check-list">${fieldIds.map((id) => `<div class="check-row"><label><input type="checkbox" name="sub-out" value="${id}"><span>${escapeHtml(playerName(id))}</span></label><strong data-player-clock="${id}">${formatMatchClock(livePlayerSeconds(id))}</strong></div>`).join('')}</div></div><div class="panel bench"><h3>Banquillo</h3><div class="check-list">${callup.availableIds.filter((id) => !fieldIds.includes(id)).map((id) => `<div class="check-row"><label><input type="checkbox" name="sub-in" value="${id}"><span>${escapeHtml(playerName(id))}</span></label><strong data-player-clock="${id}">${formatMatchClock(livePlayerSeconds(id))}</strong></div>`).join('')}</div></div></div>
  <div class="button-row"><button id="make-sub" class="primary" ${!state.timer.runningSince ? 'disabled' : ''}>Registrar cambio manual (1–7 jugadores)</button></div><p class="meta">Selecciona el mismo número de salidas y entradas. El reloj parado conserva los minutos.</p>${liveDetailsMarkup('owner', callup.availableIds, match)}`;
  startTicks();
}

function livePlayerSeconds(id) {
  if (!state.timer) return 0;
  return calculatePlayedSeconds(state.timer.initialOnField, state.timer.events, timerSeconds())[id] ?? 0;
}

function livePlayedSeconds() {
  if (!state.timer) return {};
  return calculatePlayedSeconds(state.timer.initialOnField, state.timer.events, timerSeconds());
}

function renderDelegate() {
  const root = $('#delegate-match');
  if (!root) return;
  if (!state.timer) {
    root.innerHTML = `${empty('No hay un partido en vivo. Migue debe prepararlo primero.')}${state.role === 'owner' ? '<button id="close-delegate" class="secondary">Volver a Migue</button>' : '<button id="logout" class="secondary">Cerrar sesión</button>'}`;
    return;
  }
  const match = state.matches.find(({ id }) => id === state.timer.matchId);
  const callup = state.callups.find(({ id }) => id === match?.callupId);
  if (!match || !callup) return;
  const config = FORMATS[callup.format];
  const seconds = timerSeconds();
  const played = livePlayedSeconds();
  const fieldIds = state.timer.onField;
  const benchIds = callup.availableIds.filter((id) => !fieldIds.includes(id));
  const suggestion = suggestDelegateSubstitution(fieldIds, benchIds, played, 1);
  const suggestionText = suggestion.inIds.length
    ? `${playerName(suggestion.inIds[0])} ha jugado menos. Mételo y saca a ${playerName(suggestion.outIds[0])}.`
    : 'No hay jugadores disponibles en el banquillo.';
  const row = (id, name) => `<div class="check-row"><label><input type="checkbox" name="${name}" value="${id}"><span>${escapeHtml(playerName(id))}</span></label><strong data-player-clock="${id}">${formatMatchClock(played[id] ?? 0)}</strong></div>`;
  const actionLabels = { ready: 'Comienzo', first_half: 'Descanso', halftime: 'Segundo tiempo', second_half: 'Pausar al final y avisar a Migue' };
  root.innerHTML = `<div class="delegate-head"><div><p class="eyebrow">Cambios, tiempos e incidencias</p><h2>${escapeHtml(matchTeams(match).home)} — ${escapeHtml(matchTeams(match).away)}</h2></div>${state.role === 'owner' ? '<button id="close-delegate" class="secondary">Volver a Migue</button>' : '<button id="logout" class="secondary">Cerrar sesión</button>'}</div><div class="live-clock"><div id="delegate-clock" class="clock">${formatMatchClock(seconds)}</div><p>Auto-pausa a 38:00 y 74:00</p><button id="advance-live" class="${state.timer.phase === 'second_half' ? 'danger' : 'primary'}">${actionLabels[state.timer.phase] ?? 'Comienzo'}</button></div><article class="panel delegate-suggestion"><h3>¿Quién ha jugado menos?</h3><p>${escapeHtml(suggestionText)}</p>${suggestion.inIds.length ? '<button id="apply-delegate-suggestion" class="primary">Hacer este cambio</button>' : ''}</article><div class="live-grid"><div class="panel on-field"><h3>Sale del campo</h3>${fieldIds.map((id) => row(id, 'delegate-out')).join('')}</div><div class="panel bench"><h3>Entra al campo</h3>${benchIds.map((id) => row(id, 'delegate-in')).join('')}</div></div><div class="delegate-actions"><button id="delegate-manual-sub" class="primary">Registrar cambio (1–7)</button><button id="delegate-auto-sub" class="secondary">Automático (2–3)</button></div><p class="meta">El modo automático elige a quienes menos han jugado y saca a quienes más minutos llevan. Siempre pide confirmación.</p>${liveDetailsMarkup('delegate', callup.availableIds, match)}`;
}

function enterDelegateMode() {
  state.delegateMode = true;
  document.body.classList.add('delegate-mode');
  showView('delegado');
  renderDelegate();
}

function closeDelegateMode() {
  state.delegateMode = false;
  document.body.classList.remove('delegate-mode');
  showView('partido');
}

async function cancelLiveMatch() {
  if (!state.timer || !await askConfirmation({ title: 'Salir del partido en vivo', message: 'Se descartarán el reloj y los cambios registrados, pero no la convocatoria.', acceptLabel: 'Salir y descartar', danger: true })) return;
  state.timer = null;
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
  state.urgentAlertKey = '';
  await persistTimer();
  renderLive(); renderDelegate(); toast('Cambio del delegado registrado.');
}

function updateKeeperOptions(matchId) {
  const match = state.matches.find((item) => item.id === matchId);
  const callup = state.callups.find((item) => item.id === match?.callupId);
  const players = calledPlayerOptions(state.players, callup?.availableIds ?? []);
  const options = players.map((player) => `<option value="${player.id}">${escapeHtml(player.name)}</option>`).join('');
  for (const [index, select] of [$('#first-keeper'), $('#second-keeper')].entries()) {
    if (!select) continue;
    select.disabled = !players.length;
    select.innerHTML = players.length ? `<option value="">Selecciona…</option>${options}` : '<option value="">Sin convocados</option>';
    select.value = players[index]?.id ?? players[0]?.id ?? '';
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
  const initialOnField = [firstKeeper, ...callup.availableIds.filter((id) => id !== firstKeeper)].filter(Boolean).slice(0, config.players);
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
  }, 1000);
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
  const suggestion = suggestDelegateSubstitution(state.timer.onField, benchIds, played, 1);
  const key = `${state.timer.events.length}:${suggestion.inIds[0] ?? ''}`;
  if (!suggestion.inIds.length || state.urgentAlertKey === key) return;
  state.urgentAlertKey = key;
  $('#urgent-message').textContent = `${playerName(suggestion.inIds[0])} lleva ${Math.floor((played[suggestion.inIds[0]] ?? 0) / 60)} min y quedan ${Math.ceil(remainingSeconds / 60)}. Puede entrar por ${playerName(suggestion.outIds[0])}.`;
  $('#urgent-dialog').showModal();
}
async function advanceLivePhase() {
  if (state.timer.phase === 'ready') {
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
  if (state.role !== 'owner') {
    renderLive(); renderDelegate();
    return toast('Partido pausado. Solo Migue puede finalizarlo y puntuar a los jugadores.');
  }
  const totals = calculatePlayedSeconds(state.timer.initialOnField, state.timer.events, state.timer.elapsed);
  const match = state.matches.find((item) => item.id === state.timer.matchId); const callup = state.callups.find((item) => item.id === match.callupId);
  const details = ensureLiveDetails();
  const maximum = Math.max(...Object.values(totals));
  const missingReason = callup.availableIds.find((id) => (totals[id] ?? 0) < maximum && !details.minuteReasons[id]);
  if (missingReason) {
    details.minuteReasons[missingReason] = 'sin_indicar';
  }
  const players = state.players.filter(({ id }) => callup.availableIds.includes(id));
  $('#rating-match-name').textContent = `Puntuación contra ${match.opponent}`;
  $('#rating-players').innerHTML = players.map((player) => `<label>${escapeHtml(player.name)}<select name="rating-${player.id}" required><option value="">Selecciona…</option>${[1, 2, 3, 4, 5].map((rating) => `<option value="${rating}">${rating}</option>`).join('')}</select></label>`).join('');
  $('#rating-dialog').showModal();
}

async function saveMatchRatings(event) {
  event.preventDefault();
  if (state.finishing || !state.timer) return;
  state.finishing = true;
  try {
  const totals = calculatePlayedSeconds(state.timer.initialOnField, state.timer.events, state.timer.elapsed);
  const match = state.matches.find((item) => item.id === state.timer.matchId); const callup = state.callups.find((item) => item.id === match.callupId);
  const details = ensureLiveDetails();
  const players = state.players.filter(({ id }) => callup.availableIds.includes(id));
  const values = formObject(event.target.closest('form'));
  const ratingValues = Object.fromEntries(players.map(({ id }) => [id, values[`rating-${id}`]]));
  const rated = buildPlayerRatings(players, ratingValues, { role: state.role, matchId: match.id, date: match.date, opponent: match.opponent });
  const updatedPlayers = rated.players.map((player) => accumulateSeasonMinutes(player, match.date, totals[player.id] ?? 0, { matchId: match.id, reason: details.minuteReasons[player.id] }));
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

async function saveMatch(event) {
  event.preventDefault(); const form = event.currentTarget; const values = formObject(form); const existing = values.id ? await getOne('matches', values.id) : null;
  const goalsFor = values.goalsFor === '' ? null : Number(values.goalsFor); const goalsAgainst = values.goalsAgainst === '' ? null : Number(values.goalsAgainst);
  const date = composeDateTime24(values.dateDay, values.dateHour, values.dateMinute);
  await put('matches', { ...existing, id: values.id || uid(), date, round: values.round.trim(), type: values.type, venue: values.venue, opponent: values.opponent.trim(), location: values.location.trim(), goalsFor, goalsAgainst, status: (goalsFor !== null && goalsAgainst !== null) ? 'finished' : (existing?.status ?? 'planned'), createdAt: existing?.createdAt ?? Date.now() });
  form.closest('dialog').close(); form.reset(); await refresh(); toast('Partido guardado.');
}

function renderMatches() {
  const list = [...state.matches].sort((a,b)=>a.date.localeCompare(b.date));
  $('#matches-list').innerHTML = list.length ? list.map((match) => { const teams = matchTeams(match); const homeScore = teams.mySide === 'home' ? match.goalsFor : match.goalsAgainst; const awayScore = teams.mySide === 'away' ? match.goalsFor : match.goalsAgainst; return `<article class="panel"><div class="section-head"><div><span class="pill ${match.status === 'finished' ? 'accent' : ''}">${match.status === 'finished' ? 'Finalizado' : 'Programado'}</span> <span class="pill type-${match.type}">${escapeHtml(matchTypeLabel(match.type))}</span> <span class="pill">${match.venue === 'away' ? 'Visitante' : 'Local'}</span><h3>${escapeHtml(teams.home)} — ${escapeHtml(teams.away)}</h3><p class="meta">${escapeHtml(localDate(match.date))}${match.round ? ` · Jornada ${escapeHtml(match.round)}` : ''}${match.location ? ` · ${escapeHtml(match.location)}` : ''}</p></div><div>${match.goalsFor !== null && match.goalsFor !== undefined ? `<strong>${homeScore} — ${awayScore}</strong>` : ''}</div></div>${match.ratings ? `<details><summary>Minutos y puntuaciones</summary><table class="minute-table"><tr><th>Jugador</th><th>Min</th><th>1–5</th></tr>${Object.entries(match.minuteTotals ?? {}).map(([id, seconds]) => `<tr><td>${escapeHtml(playerName(id))}</td><td>${Math.round(seconds/60)}</td><td>${match.ratings[id] ?? '—'}</td></tr>`).join('')}</table></details>` : ''}<div class="button-row">${match.status !== 'finished' && !match.callupId ? `<button class="callup-match primary" data-id="${match.id}">Convocar</button>` : ''}<button class="match-detail secondary" data-id="${match.id}">Ver detalle</button><button class="edit-match secondary" data-id="${match.id}">Editar</button><button class="delete-match danger" data-id="${match.id}">Borrar</button></div></article>`; }).join('') : empty('Añade el calendario de partidos manualmente.');
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
    ${match.status === 'finished' ? `<div class="button-row"><button class="reopen-match secondary" data-id="${match.id}">Reabrir partido (volver a jugarlo)</button></div>` : ''}
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
  root.innerHTML = `<form id="training-form"><input type="hidden" name="id" value="${existing?.id ?? ''}"><div class="form-row"><label>Tipo de registro<select name="kind"><option value="training" ${kind === 'training' ? 'selected' : ''}>Entrenamiento</option><option value="match" ${kind === 'match' ? 'selected' : ''}>Partido</option></select></label><label>Fecha<input name="date" type="date" value="${escapeHtml(existing?.date ?? match?.date.slice(0, 10) ?? today)}" required></label></div><label class="${kind === 'match' ? '' : 'hidden'}">Partido<select name="matchId" ${kind === 'match' ? 'required' : ''}><option value="">Selecciona…</option>${matchOptions}</select></label>${kind === 'match' && !callup ? '<p class="warning panel">Selecciona un partido con convocatoria.</p>' : `<div class="check-list">${rows}</div>`}<label>Notas del registro<textarea name="notes" maxlength="1000">${escapeHtml(existing?.notes ?? '')}</textarea></label><div class="button-row"><button class="primary">Guardar asistencia</button><button type="button" class="secondary cancel-training">Cancelar</button></div></form>`;
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
    <div class="button-row"><button type="button" class="add-exercise-to-session primary" data-id="${item.id}">Añadir a sesión</button><button type="button" class="edit-exercise secondary" data-id="${item.id}">Editar</button><button type="button" class="delete-exercise danger" data-id="${item.id}">Borrar</button></div>
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
  };
  const exercises = filterExercises(state.exercises, filters)
    .sort((a, b) => Number(b.favorite) - Number(a.favorite) || a.category.localeCompare(b.category, 'es') || a.name.localeCompare(b.name, 'es'));
  $('#exercises-list').innerHTML = exercises.length ? exercises.map((rawItem) => exerciseCardHTML(rawItem)).join('') : empty('No hay ejercicios que coincidan con los filtros.');
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
  sessionDraftMeta = { ...sessionDraftMeta, ...formObject(form) };
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
  root.innerHTML = `<form id="session-form"><input name="id" type="hidden" value="${escapeHtml(sessionDraftMeta?.id ?? '')}"><div class="form-row"><label>Fecha<input name="date" type="date" required value="${escapeHtml(sessionDraftMeta?.date ?? '')}"></label><label>Nombre de la sesión<input name="name" required maxlength="120" value="${escapeHtml(sessionDraftMeta?.name ?? '')}" placeholder="Ej. Pase, apoyo y finalización"></label></div><div class="form-row"><label>Tiempo total de la sesión (min)<input name="targetDuration" type="number" min="1" max="240" required value="${target}"></label><label>¿Es calentamiento de partido/amistoso?<select name="sessionKind"><option value="training" ${sessionDraftMeta?.sessionKind === 'training' ? 'selected' : ''}>Entrenamiento</option><option value="match-warmup" ${sessionDraftMeta?.sessionKind === 'match-warmup' ? 'selected' : ''}>Calentamiento de partido/amistoso</option></select></label></div><div class="session-duration ${status.exact ? 'exact' : 'warning'}" role="status"><strong>${status.total} / ${target} min</strong><span>${status.message}</span></div><fieldset><legend>Bloques de la sesión</legend>${sessionDraftBlocks.length ? sessionDraftBlocks.map((block, index) => `<div class="session-block" data-index="${index}"><input name="blockType" type="hidden" value="${block.type}"><div><span class="pill">${sessionBlockLabel(block.type)}</span><label>Ejercicio<select name="blockExerciseId" required>${exerciseOptions(block.exerciseId)}</select></label></div><label>Duración (min)<input name="blockDuration" type="number" min="1" max="60" required value="${block.duration}"></label><label>Consignas / observaciones<input name="blockNotes" maxlength="300" value="${escapeHtml(block.notes ?? '')}"></label><div class="session-block-actions"><button type="button" class="move-session-block secondary compact" data-index="${index}" data-direction="-1" aria-label="Subir bloque" ${index === 0 ? 'disabled' : ''}>↑</button><button type="button" class="move-session-block secondary compact" data-index="${index}" data-direction="1" aria-label="Bajar bloque" ${index === sessionDraftBlocks.length - 1 ? 'disabled' : ''}>↓</button><button type="button" class="remove-session-block danger compact" data-index="${index}">Quitar</button></div></div>`).join('') : '<p class="warning">Añade ejercicios desde la lista de abajo.</p>'}</fieldset>${picker}<label>Material total<input name="material" maxlength="300" value="${escapeHtml(sessionDraftMeta?.material ?? '')}"></label><label>Observaciones generales<textarea name="notes" maxlength="1000">${escapeHtml(sessionDraftMeta?.notes ?? '')}</textarea></label><div class="button-row"><button class="primary" type="submit" ${sessionDraftBlocks.length ? '' : 'disabled'}>Guardar sesión</button><button class="cancel-session secondary" type="button">Cancelar</button></div></form>`;
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
  form.elements.date.value = new Date().toISOString().slice(0, 10);
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
  sessionBuilder('', exercise.id, { date: values.date, name: values.name });
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

function showExerciseDetail(exerciseId) {
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
  $('#tactics-list').innerHTML = tactics.length ? tactics.map((tactic) => `<article class="panel"><div class="section-head"><div><span class="pill accent">${escapeHtml(tactic.format)}</span><h3>${escapeHtml(tactic.name)}</h3><p class="meta">${tactic.rival ? `vs ${escapeHtml(tactic.rival)}` : 'Sin rival'}${tactic.situation ? ` · ${escapeHtml(tactic.situation)}` : ''}</p></div><div class="button-row"><button type="button" class="view-tactic secondary" data-id="${tactic.id}">Ver</button><button type="button" class="edit-tactic secondary" data-id="${tactic.id}">Editar</button><button type="button" class="delete-tactic danger" data-id="${tactic.id}">Borrar</button></div></div>${renderTacticBoard(tactic)}${tactic.notes ? `<p><strong>Notas:</strong> ${escapeHtml(tactic.notes)}</p>` : ''}</article>`).join('') : empty('Todavía no hay tácticas guardadas. Pulsa «+ Táctica» para crear la primera.');
}

function tacticBuilder(editId = '') {
  const existing = state.tactics.find(({ id }) => id === editId);
  const root = $('#tactic-builder');
  root.classList.remove('hidden');
  const t = existing ? { ...existing } : { ...defaultTactic(state.format || 'F7', '1-3-2-1'), name: '', rival: '', situation: '', notes: '' };
  const guide = FORMATION_GUIDES[t.formation] || FORMATION_GUIDES['1-3-2-1'];
  const guideHTML = guide ? `
    <details class="tactic-guide" open><summary>${escapeHtml(guide.name)} · qué busco</summary><p>${escapeHtml(guide.queBusco)}</p></details>
    <details class="tactic-guide"><summary>Con balón</summary><ul class="plain-list">${guide.conBalon.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul></details>
    <details class="tactic-guide"><summary>Sin balón / defensa</summary><ul class="plain-list">${guide.sinBalon.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul></details>
    <details class="tactic-guide"><summary>Al perder el balón</summary><ul class="plain-list">${guide.alPerder.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul></details>` : '';
  root.innerHTML = `<form id="tactic-form"><input name="id" type="hidden" value="${escapeHtml(t.id || '')}"><div class="form-row"><label>Nombre<input name="name" required maxlength="120" value="${escapeHtml(t.name || '')}" placeholder="Ej. Salida de balón vs Las Palmas"></label><label>Formato<select name="format" required>${TACTIC_FORMATS.map((f) => `<option value="${f}" ${f === t.format ? 'selected' : ''}>Fútbol ${f === 'F7' ? '7' : '11'}</option>`).join('')}</select></label></div><div class="form-row"><label>Formación<select name="formation" required>${FORMATION_NAMES.map((f) => `<option value="${f}" ${f === t.formation ? 'selected' : ''}>${f}</option>`).join('')}</select></label><label>Situación<input name="situation" maxlength="100" value="${escapeHtml(t.situation || '')}" placeholder="Ej. Saque de esquina"></label></div><div class="form-row"><label>Rival<input name="rival" maxlength="100" value="${escapeHtml(t.rival || '')}" placeholder="Ej. Las Palmas"></label></div>${renderTacticBoard(t)}${guideHTML}<label>Notas<textarea name="notes" maxlength="1000">${escapeHtml(t.notes || '')}</textarea></label><div class="button-row"><button class="primary" type="submit">Guardar táctica</button><button class="cancel-tactic secondary" type="button">Cancelar</button></div></form>`;
  root.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function saveTactic(event) {
  event.preventDefault();
  const form = event.target.closest('form');
  const values = formObject(form);
  const existing = values.id ? state.tactics.find(({ id }) => id === values.id) : null;
  const saved = buildTactic(values, {
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
  $('#tactic-detail-body').innerHTML = `<p class="meta">${escapeHtml(tactic.format)}${tactic.rival ? ` · vs ${escapeHtml(tactic.rival)}` : ''}${tactic.situation ? ` · ${escapeHtml(tactic.situation)}` : ''}</p>${renderTacticBoard(tactic)}${tactic.notes ? `<p><strong>Notas:</strong> ${escapeHtml(tactic.notes)}</p>` : ''}`;
  $('#tactic-detail-dialog').showModal();
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

// Plan A+C: elimina del navegador los ejercicios precargados genéricos (los "6 chinos,
// 2 siluetas, 4 palos") que quedaron guardados en versiones anteriores. Solo borra los
// que tienen example:true (precargados) y cuyo id NO está en la lista de buenos, para no
// tocar los ejercicios que Migue haya creado o editado a mano.
async function ensureLegacyExercisesNotPresent() {
  if (await getOne('settings', 'legacy-exercises-not-present')) return;
  const current = await getAll('settings');
  const goodIds = new Set([
    ...REAL_EXERCISES,
    ...SLIDESHARE_EXERCISES,
    ...PHASE2_V3_EXERCISES,
  ].map(({ id }) => id));
  const toRemove = current.filter(({ recordType, example, id }) =>
    recordType === 'exercise' && example === true && !goodIds.has(id));
  for (const record of toRemove) await remove('settings', record.id);
  await put('settings', { id: 'legacy-exercises-not-present', recordType: 'migration', version: 7, createdAt: Date.now() });
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
  $('#role-label').textContent = role === 'owner' ? 'Migue' : 'Delegado';
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

function restoreSessionRole() {
  let role;
  try { role = sessionStorage.getItem(SESSION_ROLE_KEY); } catch { return false; }
  if (!state.settings.ownerPinHash || !state.settings.delegatePinHash || !['owner', 'delegate'].includes(role)) return false;
  applyRole(role);
  return true;
}

function showAuth() {
  try { sessionStorage.removeItem(SESSION_ROLE_KEY); } catch { /* Sin sesión persistente que limpiar. */ }
  document.body.classList.add('auth-locked');
  document.body.classList.remove('delegate-mode');
  state.role = null;
  const initial = !state.settings.ownerPinHash || !state.settings.delegatePinHash;
  $('#auth-title').textContent = initial ? 'Configurar acceso' : 'Acceso a CampoBase';
  $('#auth-help').textContent = initial ? 'Configura una sola vez dos PIN distintos. El de Migue da acceso total y el del delegado solo al partido.' : 'Introduce el PIN de Migue (acceso total) o el PIN del delegado (acceso al partido).';
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
  const live = await getOne('settings', 'live');
  if ((live?.updatedAt ?? 0) <= state.liveUpdatedAt) return;
  state.liveUpdatedAt = live?.updatedAt ?? 0;
  state.timer = live.timer;
  await refresh();
  if (state.role === 'delegate') { enterDelegateMode(); } else { renderLive(); renderDelegate(); }
}

function wireEvents() {
  $$('.bottom-nav button').forEach((button) => button.addEventListener('click', () => showView(button.dataset.view)));
  $$('[data-dialog]').forEach((button) => button.addEventListener('click', () => { const form = $(`#${button.dataset.dialog} form`); form?.reset(); if (form?.elements.id) form.elements.id.value = ''; $(`#${button.dataset.dialog}`).showModal(); }));
  $$('[data-close]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
  $('#player-form').addEventListener('submit', (event) => savePlayer(event).catch(handleError)); $('#match-form').addEventListener('submit', (event) => saveMatch(event).catch(handleError));
  $('#auth-form').addEventListener('submit', (event) => submitAuth(event).catch(handleError));
  $('#auth-dialog').addEventListener('cancel', (event) => event.preventDefault());
  $('#pin-settings-form').addEventListener('submit', (event) => changePins(event).catch(handleError));
  $('#team-settings-form').addEventListener('submit', (event) => saveTeamSettings(event).catch(handleError));
  $('#new-callup').addEventListener('click', () => callupBuilder()); $('#new-training').addEventListener('click', () => attendanceBuilder()); $('#new-session').addEventListener('click', () => sessionBuilder()); $('#new-session-exercises').addEventListener('click', () => { showView('sesiones'); sessionBuilder(); }); $('#new-tactic').addEventListener('click', () => tacticBuilder());
  $('#exercise-filters').addEventListener('input', renderExercises);
  $('#exercise-filters').addEventListener('change', renderExercises);
  document.addEventListener('input', (event) => {
    if (event.target.matches('#session-form [name="blockDuration"]')) refreshSessionDurationStatus();
  });
  document.addEventListener('change', (event) => {
    if (event.target.matches('#tactic-form [name="formation"]')) {
      const form = event.target.closest('#tactic-form');
      const values = formObject(form);
      const t = { ...defaultTactic(values.format || 'F7', values.formation), name: values.name, rival: values.rival, situation: values.situation, notes: values.notes };
      const guide = FORMATION_GUIDES[t.formation] || FORMATION_GUIDES['1-3-2-1'];
      const guideHTML = guide ? `
        <details class="tactic-guide" open><summary>${escapeHtml(guide.name)} · qué busco</summary><p>${escapeHtml(guide.queBusco)}</p></details>
        <details class="tactic-guide"><summary>Con balón</summary><ul class="plain-list">${guide.conBalon.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul></details>
        <details class="tactic-guide"><summary>Sin balón / defensa</summary><ul class="plain-list">${guide.sinBalon.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul></details>
        <details class="tactic-guide"><summary>Al perder el balón</summary><ul class="plain-list">${guide.alPerder.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul></details>` : '';
      const board = form.querySelector('.tactic-board');
      if (board) board.outerHTML = renderTacticBoard(t);
      form.querySelectorAll('.tactic-guide').forEach((el) => el.remove());
      const notesLabel = form.querySelector('label:has(textarea[name="notes"])');
      if (notesLabel) notesLabel.insertAdjacentHTML('beforebegin', guideHTML);
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
      reason.disabled = !event.target.checked;
      if (!event.target.checked) reason.value = '';
      const selected = card.querySelector('input[name="selected"]');
      if (event.target.checked) selected.checked = false;
    }
    if (event.target.matches('input[name="selected"]') && event.target.checked) {
      const excluded = event.target.closest('[data-player-id]').querySelector('input[name="manualExcluded"]');
      excluded.checked = false; form.elements[`reason-${event.target.value}`].disabled = true; form.elements[`reason-${event.target.value}`].value = '';
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
    if (target.matches('.view-tactic')) showTacticDetail(target.dataset.id);
    if (target.matches('.edit-tactic')) tacticBuilder(target.dataset.id);
    if (target.matches('.delete-tactic') && await askConfirmation({ title: 'Borrar táctica', message: 'Se eliminará esta táctica de la base.', acceptLabel: 'Borrar', danger: true })) { await remove('settings', target.dataset.id); await refresh(); }
    if (target.matches('.edit-player')) editPlayer(target.dataset.id);
    if (target.matches('.delete-player') && await askConfirmation({ title: 'Borrar jugador', message: 'Los históricos conservarán su identificador, pero la ficha del jugador se eliminará.', acceptLabel: 'Borrar', danger: true })) { await remove('players', target.dataset.id); await refresh(); }
    if (target.matches('.delete-callup')) await deleteCallup(target.dataset.id);
    if (target.matches('.edit-callup')) callupBuilder('', target.dataset.id);
    if (target.matches('.edit-match')) editMatch(target.dataset.id);
    if (target.matches('.match-detail')) showMatchDetail(target.dataset.id);
    if (target.matches('.add-detail-event')) await addDetailEvent(target.dataset.id);
    if (target.matches('.remove-match-event')) await removeMatchEvent($('#match-detail-dialog').dataset.matchId, target.dataset.kind, Number(target.dataset.index));
    if (target.matches('.reopen-match')) await reopenMatch(target.dataset.id);
    if (target.matches('.remove-player-incident')) await removePlayerIncident(target.dataset.key);
    if (target.matches('.edit-attendance')) attendanceBuilder('', target.dataset.id);
    if (target.matches('.callup-match')) { $$('.bottom-nav button').forEach((item) => item.classList.toggle('active', item.dataset.view === 'convocatorias')); $$('.view').forEach((view) => view.classList.toggle('active', view.id === 'convocatorias')); callupBuilder(target.dataset.id); }
    if (target.matches('.delete-match') && await askConfirmation({ title: 'Borrar partido', message: 'También se borrará su registro de asistencia asociado.', acceptLabel: 'Borrar', danger: true })) { for (const record of state.trainings.filter(({ matchId }) => matchId === target.dataset.id)) await remove('trainings', record.id); await remove('matches', target.dataset.id); await refresh(); }
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
    if (target.id === 'close-delegate') closeDelegateMode();
    if (target.id === 'delegate-manual-sub') {
      const outIds = checkedValues('delegate-out'); const inIds = checkedValues('delegate-in');
      if (![1, 3, 7].includes(outIds.length) || outIds.length !== inIds.length) return toast('Selecciona el mismo número de entradas y salidas: 1, 3 o 7.');
      try { await registerDelegateSubstitution(outIds, inIds); } catch (error) { handleError(error); }
    }
    if (target.id === 'apply-delegate-suggestion' || target.id === 'urgent-change') {
      const match = state.matches.find(({ id }) => id === state.timer?.matchId); const callup = state.callups.find(({ id }) => id === match?.callupId);
      const played = livePlayedSeconds(); const bench = callup.availableIds.filter((id) => !state.timer.onField.includes(id));
      const suggestion = suggestDelegateSubstitution(state.timer.onField, bench, played, 1);
      $('#urgent-dialog')?.close();
      try { await registerDelegateSubstitution(suggestion.outIds, suggestion.inIds); } catch (error) { handleError(error); }
    }
    if (target.id === 'delegate-auto-sub') {
      const match = state.matches.find(({ id }) => id === state.timer?.matchId); const callup = state.callups.find(({ id }) => id === match?.callupId);
      const bench = callup.availableIds.filter((id) => !state.timer.onField.includes(id));
      const count = Math.min(3, bench.length, state.timer.onField.length);
      if (count < 2) return toast('No hay suficientes jugadores para un cambio automático de 2–3.');
      const suggestion = suggestDelegateSubstitution(state.timer.onField, bench, livePlayedSeconds(), count);
      if (await askConfirmation({ title: `Cambio automático de ${count}`, message: `Entran ${suggestion.inIds.map(playerName).join(', ')} y salen ${suggestion.outIds.map(playerName).join(', ')}.`, acceptLabel: 'Registrar cambio' })) await registerDelegateSubstitution(suggestion.outIds, suggestion.inIds);
    }
    if (target.matches('.score-step')) await changeLiveScore(target.dataset.scoreTeam, Number(target.dataset.delta));
    if (target.matches('.add-live-event')) await addLiveEvent(target.dataset.prefix);
    if (target.matches('.save-live-comments')) {
      if (state.role !== 'owner') return toast('Los comentarios son solo de Migue.');
      ensureLiveDetails().comments = $(`#${target.dataset.prefix}-comments`).value.trim();
      await persistTimer(); renderLive(); renderDelegate(); toast('Comentarios guardados.');
    }
    if (target.id === 'logout') showAuth();
  });
}

function handleError(error) { console.error(error); toast(error.message || 'Ha ocurrido un error.'); }
function networkStatus() {
  document.body.classList.toggle('offline', !navigator.onLine);
  $('#network-label').textContent = !navigator.onLine
    ? 'Sin conexión · caché local'
    : state.cloudConnected ? 'Supabase sincronizado' : 'Supabase pendiente';
  $('#network-label').title = state.cloudError;
}

async function synchronizeCloud() {
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
  matchForm.elements.dateHour.innerHTML = selectOptions(24);
  matchForm.elements.dateMinute.innerHTML = selectOptions(60);
  const categoryOptions = EXERCISE_CATEGORIES.map((category) => `<option value="${category}">${category}</option>`).join('');
  $('#exercise-form').elements.category.innerHTML = categoryOptions;
  $('#exercise-filters').elements.category.insertAdjacentHTML('beforeend', categoryOptions);
  wireEvents(); networkStatus();
  configureCloudStore(createCampoBaseCloudStore());
  window.addEventListener('online', () => synchronizeCloud().catch(handleError));
  window.addEventListener('offline', networkStatus);
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(handleError);
  await synchronizeCloud();
  await ensurePhase2Seeded();
  await ensurePhase2V2Seeded();
  await ensurePhase2V3Seeded();
  await ensureRealExercisesSeeded();
  await ensureSlideshareSeeded();
  await ensureLegacyExercisesNotPresent();
  await refresh(); const live = await getOne('settings', 'live'); state.timer = live?.timer ?? null; state.liveUpdatedAt = live?.updatedAt ?? 0; renderLive(); renderDelegate();
  if (!restoreSessionRole()) showAuth();
  setInterval(() => pollLiveState().catch(handleError), 1000);
  setInterval(() => synchronizeCloud().catch(handleError), 10000);
}

init().catch(handleError);
