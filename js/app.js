import { getAll, getOne, put, remove, exportDatabase, importDatabase } from './db.js';
import { calculateMinuteTargets, buildCallupSelection, buildTrainingRecord, normalizePositions, calculatePlayedSeconds, validateBackup, formatMatchClock } from './domain.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const uid = () => crypto.randomUUID();
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
const safePhoto = (value) => /^data:image\/(png|jpeg|webp|gif);base64,/i.test(value ?? '') ? value : '';
const localDate = (value) => value ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: value.includes('T') ? 'short' : undefined }).format(new Date(value)) : 'Sin fecha';
const empty = (text) => `<div class="panel empty">${escapeHtml(text)}</div>`;
const FORMATS = { F7: { players: 7, duration: 70, half: 35 }, F11: { players: 11, duration: 90, half: 45 } };
const MATCH_TYPES = { league: 'Liga', friendly: 'Amistoso', tournament: 'Torneo' };
const EXCLUSION_REASONS = { sick: 'Enfermo', missed_training: 'No fue a entrenar', discipline: 'Disciplina (notas/padres)', coach_decision: 'Decisión del entrenador', rotation: 'Rotación equitativa' };

const state = { players: [], callups: [], matches: [], trainings: [], format: 'F7', timer: null, tick: null };
let toastTimer;

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
function playerPositions(player) { return normalizePositions(player).join(', ') || 'Sin posición'; }
function playerCardPhoto(player) { return safePhoto(player.photo) ? `<img class="avatar" src="${safePhoto(player.photo)}" alt="Foto de ${escapeHtml(player.name)}">` : `<div class="avatar" aria-hidden="true">${escapeHtml(player.name.slice(0, 2).toUpperCase())}</div>`; }

async function refresh() {
  [state.players, state.callups, state.matches, state.trainings] = await Promise.all(['players', 'callups', 'matches', 'trainings'].map(getAll));
  const settings = await getOne('settings', 'main');
  state.format = settings?.format ?? 'F7';
  $('#format').value = state.format;
  renderAll();
}

function renderAll() {
  renderPlayers(); renderCallups(); renderLive(); renderMatches(); renderTrainings();
}

function renderPlayers() {
  const totalMinutes = state.players.reduce((sum, player) => sum + (player.totalMinutes ?? 0), 0);
  $('#squad-stats').innerHTML = `<div class="stat"><strong>${state.players.length}</strong><span>jugadores</span></div><div class="stat"><strong>${totalMinutes}</strong><span>minutos acumulados</span></div><div class="stat"><strong>${state.players.reduce((sum, player) => sum + (player.outsideCount ?? 0), 0)}</strong><span>ausencias por rotación</span></div>`;
  const sorted = [...state.players].sort((a, b) => (b.totalMinutes ?? 0) - (a.totalMinutes ?? 0));
  $('#players-list').innerHTML = sorted.length ? sorted.map((player, index) => `<article class="card player">
    ${playerCardPhoto(player)}
    <div><h3>${escapeHtml(player.name)} <span class="pill">#${escapeHtml(player.number || '—')}</span></h3><p class="meta">${escapeHtml(playerPositions(player))}</p><p class="meta">Pierna ${escapeHtml((player.foot || 'sin indicar').toLowerCase())} · Fuera por rotación ${player.outsideCount ?? 0} veces</p><p class="meta"><span class="rank">${index + 1}. ${player.totalMinutes ?? 0} min</span>${player.notes ? ` · ${escapeHtml(player.notes)}` : ''}</p></div>
    <div><button class="icon-button edit-player" data-id="${player.id}" aria-label="Editar ${escapeHtml(player.name)}">Editar</button><button class="icon-button delete-player danger" data-id="${player.id}" aria-label="Eliminar ${escapeHtml(player.name)}">Borrar</button></div>
  </article>`).join('') : empty('Añade el primer jugador para empezar.');
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
  await put('players', { id: values.id || uid(), name: values.name.trim(), number: values.number, positions, foot: values.foot, notes: values.notes.trim(), photo: photo || existing?.photo || '', outsideCount: existing?.outsideCount ?? 0, lastExcludedAt: existing?.lastExcludedAt ?? null, totalMinutes: existing?.totalMinutes ?? 0, createdAt: existing?.createdAt ?? Date.now() });
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

function callupPlayerCard(player) {
  return `<article class="selection-card" data-player-id="${player.id}">${playerCardPhoto(player)}<div class="selection-card-body"><h4>${escapeHtml(player.name)} <span class="pill">#${escapeHtml(player.number || '—')}</span></h4><p class="meta">${escapeHtml(playerPositions(player))}</p><div class="selection-actions"><label><input type="checkbox" name="selected" value="${player.id}"> Convocar manualmente</label><label><input type="checkbox" name="manualExcluded" value="${player.id}"> Dejar fuera</label><select name="reason-${player.id}" aria-label="Motivo de exclusión de ${escapeHtml(player.name)}" disabled><option value="">Motivo…</option>${Object.entries(EXCLUSION_REASONS).filter(([key]) => key !== 'rotation').map(([key, label]) => `<option value="${key}">${label}</option>`).join('')}</select></div></div></article>`;
}

function callupBuilder(preselectedMatchId = '') {
  const container = $('#callup-builder');
  const config = FORMATS[state.format];
  container.classList.remove('hidden');
  const options = state.matches.filter((match) => match.status !== 'finished').sort((a,b)=>a.date.localeCompare(b.date)).map((match) => `<option value="${match.id}" ${match.id === preselectedMatchId ? 'selected' : ''}>${escapeHtml(localDate(match.date))} · ${escapeHtml(matchTypeLabel(match.type))}${match.round ? ` · Jornada ${escapeHtml(match.round)}` : ''} · ${escapeHtml(match.opponent)}</option>`).join('');
  container.innerHTML = `<h3>Nueva convocatoria · ${state.format}</h3><form id="callup-form"><fieldset><legend>Partido</legend><div class="choice-row"><label><input type="radio" name="matchSource" value="calendar" ${preselectedMatchId || options ? 'checked' : ''}> Elegir del calendario</label><label><input type="radio" name="matchSource" value="manual" ${!preselectedMatchId && !options ? 'checked' : ''}> Crear partido a mano</label></div><div id="calendar-match-fields"><label>Partido del calendario<select name="matchId"><option value="">Selecciona…</option>${options}</select></label></div><div id="manual-match-fields" class="hidden"><div class="form-row"><label>Fecha y hora<input name="manualDate" type="datetime-local"></label><label>Jornada<input name="manualRound" maxlength="30" placeholder="Ej. 8"></label></div><div class="form-row"><label>Tipo<select name="manualType"><option value="league">Partido de liga</option><option value="friendly">Amistoso</option><option value="tournament">Torneo</option></select></label><label>Rival<input name="manualOpponent" maxlength="100"></label></div><label>Lugar<input name="manualLocation" maxlength="120"></label></div></fieldset><div class="callup-help panel"><strong>Máximo 14.</strong> Marca solo quienes quieras asegurar en la convocatoria. Para dejar a alguien fuera manualmente, marca “Dejar fuera” e indica el motivo. En liga, CampoBase completa el resto con rotación justa; en amistosos y torneos convoca a todos los disponibles.</div><div class="selection-grid">${state.players.map(callupPlayerCard).join('')}</div><div id="target-preview"></div><div class="button-row"><button class="primary" type="submit">Guardar convocatoria y reparto</button><button class="secondary cancel-builder" type="button">Cancelar</button></div><p class="meta">Reparto: ${config.duration} min × ${config.players} en campo entre los convocados.</p></form>`;
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

function updateTargetPreview() {
  const form = $('#callup-form'); if (!form) return;
  const preview = $('#target-preview');
  const match = currentCallupMatch(form);
  if (!match) { preview.innerHTML = '<p class="warning panel">Selecciona un partido o créalo a mano.</p>'; return; }
  const manualExclusions = manualExclusionsFromForm(form);
  if (manualExclusions.some(({ reason }) => !reason)) { preview.innerHTML = '<p class="warning panel">Indica el motivo de cada jugador que dejas fuera.</p>'; return; }
  try {
    const selection = buildCallupSelection(state.players, { matchType: match.type ?? 'league', selectedIds: checkedValues('selected', form), manualExclusions });
    if (!selection.availableIds.length) { preview.innerHTML = '<p class="warning panel">No hay jugadores convocados.</p>'; return; }
    const targets = calculateMinuteTargets(selection.availableIds, FORMATS[state.format].duration, FORMATS[state.format].players);
    preview.innerHTML = `<div class="preview-summary"><h3>Convocados (${selection.availableIds.length}/14)</h3><p>${selection.availableIds.map(playerName).map(escapeHtml).join(', ')}</p>${selection.exclusions.length ? `<p><strong>Fuera:</strong> ${selection.exclusions.map(({ playerId, reason }) => `${escapeHtml(playerName(playerId))} — ${escapeHtml(EXCLUSION_REASONS[reason] ?? reason)}`).join('; ')}</p>` : '<p><strong>Fuera:</strong> nadie.</p>'}</div><details><summary>Ver minutos objetivo</summary><table class="minute-table"><thead><tr><th>Jugador</th><th>Objetivo</th></tr></thead><tbody>${targets.map((target) => `<tr><td>${escapeHtml(playerName(target.playerId))}</td><td>${target.minutes} min</td></tr>`).join('')}</tbody></table></details>`;
  } catch (error) { preview.innerHTML = `<p class="warning panel">${escapeHtml(error.message)}</p>`; }
}

function updateMatchSource() {
  const form = $('#callup-form'); if (!form) return;
  const manual = form.elements.matchSource.value === 'manual';
  $('#manual-match-fields').classList.toggle('hidden', !manual);
  $('#calendar-match-fields').classList.toggle('hidden', manual);
  for (const name of ['manualDate', 'manualOpponent']) form.elements[name].required = manual;
  form.elements.matchId.required = !manual;
}

async function saveCallup(event) {
  event.preventDefault(); const form = event.target;
  let match = currentCallupMatch(form);
  if (!match) return toast('Selecciona un partido del calendario.');
  const manualMatch = form.elements.matchSource.value === 'manual';
  if (manualMatch) {
    match = { id: uid(), date: form.elements.manualDate.value, round: form.elements.manualRound.value.trim(), type: form.elements.manualType.value, opponent: form.elements.manualOpponent.value.trim(), location: form.elements.manualLocation.value.trim(), goalsFor: null, goalsAgainst: null, status: 'planned', createdAt: Date.now() };
  }
  const manualExclusions = manualExclusionsFromForm(form);
  if (manualExclusions.some(({ reason }) => !reason)) return toast('Indica el motivo de cada jugador que dejas fuera.');
  const selection = buildCallupSelection(state.players, { matchType: match.type ?? 'league', selectedIds: checkedValues('selected', form), manualExclusions });
  const { availableIds, exclusions } = selection;
  if (!availableIds.length) return toast('La convocatoria no puede quedar vacía.');
  if (manualMatch) await put('matches', match);
  const excludedIds = exclusions.map(({ playerId }) => playerId);
  const config = FORMATS[state.format];
  const targets = calculateMinuteTargets(availableIds, config.duration, config.players);
  const callup = { id: uid(), matchId: match.id, date: match.date, opponent: match.opponent, matchType: match.type ?? 'league', format: state.format, availableIds, excludedIds, exclusions, targets, createdAt: Date.now() };
  await put('callups', callup);
  for (const { playerId } of exclusions.filter(({ automatic }) => automatic)) { const player = await getOne('players', playerId); if (player) await put('players', { ...player, outsideCount: (player.outsideCount ?? 0) + 1, lastExcludedAt: callup.createdAt }); }
  await put('matches', { ...match, callupId: callup.id, format: state.format });
  $('#callup-builder').classList.add('hidden'); await refresh(); toast('Convocatoria guardada.');
}

function renderCallups() {
  const list = [...state.callups].sort((a,b)=>b.date.localeCompare(a.date));
  $('#callups-list').innerHTML = list.length ? list.map((callup) => `<article class="panel"><div class="section-head"><div><span class="pill accent">${escapeHtml(callup.format)} · ${escapeHtml(matchTypeLabel(callup.matchType))}</span><h3>${escapeHtml(callup.opponent)}</h3><p class="meta">${escapeHtml(localDate(callup.date))} · ${callup.availableIds.length} convocados · ${callup.excludedIds.length} fuera</p></div><button class="delete-callup danger" data-id="${callup.id}">Borrar</button></div><p><strong>Fuera:</strong> ${callup.excludedIds.length ? (callup.exclusions ?? callup.excludedIds.map((playerId) => ({ playerId, reason: 'rotation' }))).map(({ playerId, reason }) => `${escapeHtml(playerName(playerId))} — ${escapeHtml(EXCLUSION_REASONS[reason] ?? reason)}`).join('; ') : 'Nadie'}</p><details><summary>Ver reparto objetivo</summary><table class="minute-table">${callup.targets.map((target) => `<tr><td>${escapeHtml(playerName(target.playerId))}</td><td>${target.minutes} min</td></tr>`).join('')}</table></details></article>`).join('') : empty('Todavía no hay convocatorias.');
}

async function deleteCallup(id) {
  const callup = state.callups.find((item) => item.id === id); if (!callup || !confirm('¿Borrar esta convocatoria y deshacer sus contadores de rotación?')) return;
  const automaticIds = (callup.exclusions ?? callup.excludedIds.map((playerId) => ({ playerId, automatic: true }))).filter(({ automatic }) => automatic).map(({ playerId }) => playerId);
  for (const playerId of automaticIds) { const player = await getOne('players', playerId); if (player) { const previous = state.callups.filter((item) => item.id !== callup.id && (item.exclusions ?? []).some((entry) => entry.playerId === playerId && entry.automatic)).sort((a, b) => b.createdAt - a.createdAt)[0]; await put('players', { ...player, outsideCount: Math.max(0, (player.outsideCount ?? 0) - 1), lastExcludedAt: previous?.createdAt ?? null }); } }
  const match = state.matches.find((item) => item.callupId === id); if (match) await put('matches', { ...match, callupId: null });
  await remove('callups', id); await refresh(); toast('Convocatoria borrada.');
}

function timerSeconds(timer = state.timer) {
  if (!timer) return 0;
  return timer.elapsed + (timer.runningSince ? Math.floor((Date.now() - timer.runningSince) / 1000) : 0);
}

function renderLive() {
  const root = $('#live-match');
  const eligible = state.matches.filter((match) => match.callupId && match.status !== 'finished').sort((a,b)=>a.date.localeCompare(b.date));
  if (!state.timer) {
    root.innerHTML = eligible.length ? `<label>Partido convocado<select id="live-select"><option value="">Selecciona…</option>${eligible.map((match) => `<option value="${match.id}">${escapeHtml(localDate(match.date))} · ${escapeHtml(match.opponent)}</option>`).join('')}</select></label><div class="button-row"><button id="prepare-live" class="primary">Preparar partido</button></div>` : empty('Necesitas un partido con convocatoria para iniciar el control en vivo.');
    return;
  }
  const match = state.matches.find((item) => item.id === state.timer.matchId);
  const callup = state.callups.find((item) => item.id === match?.callupId);
  if (!match || !callup) { state.timer = null; return renderLive(); }
  const seconds = timerSeconds(); const config = FORMATS[callup.format]; const half = seconds < config.half * 60 ? '1.er tiempo' : '2.º tiempo';
  const fieldIds = state.timer.onField;
  root.innerHTML = `<div class="live-clock"><span class="pill accent">${escapeHtml(match.opponent)} · ${escapeHtml(callup.format)}</span><div id="clock" class="clock">${formatMatchClock(seconds)}</div><div id="half" class="half">${half} / ${config.duration}:00</div><div class="button-row"><button id="toggle-timer" class="primary">${state.timer.runningSince ? 'Pausar' : 'Iniciar / reanudar'}</button><button id="finish-match" class="danger">Finalizar partido</button></div></div>
  <div class="live-grid"><div class="panel on-field"><h3>En campo (${fieldIds.length}/${config.players})</h3><div class="check-list">${fieldIds.map((id) => `<div class="check-row"><label><input type="checkbox" name="sub-out" value="${id}"><span>${escapeHtml(playerName(id))}</span></label><strong>${formatMatchClock(livePlayerSeconds(id))}</strong></div>`).join('')}</div></div><div class="panel bench"><h3>Banquillo</h3><div class="check-list">${callup.availableIds.filter((id) => !fieldIds.includes(id)).map((id) => `<div class="check-row"><label><input type="checkbox" name="sub-in" value="${id}"><span>${escapeHtml(playerName(id))}</span></label><strong>${formatMatchClock(livePlayerSeconds(id))}</strong></div>`).join('')}</div></div></div>
  <div class="button-row"><button id="make-sub" class="primary">Registrar cambio (2–3 jugadores)</button></div><p class="meta">Selecciona el mismo número de jugadores que salen y entran. El reloj puede pausarse en el descanso; los minutos se conservan.</p>`;
  startTicks();
}

function livePlayerSeconds(id) {
  if (!state.timer) return 0;
  return calculatePlayedSeconds(state.timer.initialOnField, state.timer.events, timerSeconds())[id] ?? 0;
}

async function prepareLive() {
  const match = state.matches.find((item) => item.id === $('#live-select').value); const callup = state.callups.find((item) => item.id === match?.callupId);
  if (!callup) return toast('Selecciona un partido.');
  const config = FORMATS[callup.format];
  if (callup.availableIds.length < config.players) return toast(`Faltan jugadores: ${callup.format} necesita ${config.players} en campo.`);
  state.timer = { matchId: match.id, elapsed: 0, runningSince: null, initialOnField: callup.availableIds.slice(0, config.players), onField: callup.availableIds.slice(0, config.players), events: [] };
  await put('settings', { id: 'live', timer: state.timer }); renderLive();
}

async function persistTimer() { await put('settings', { id: 'live', timer: state.timer }); }
function startTicks() { clearInterval(state.tick); if (!state.timer?.runningSince) return; state.tick = setInterval(() => { const clock = $('#clock'); if (clock) clock.textContent = formatMatchClock(timerSeconds()); }, 1000); }
async function toggleTimer() { if (state.timer.runningSince) { state.timer.elapsed = timerSeconds(); state.timer.runningSince = null; } else state.timer.runningSince = Date.now(); await persistTimer(); renderLive(); }

async function makeSubstitution() {
  const outIds = checkedValues('sub-out'); const inIds = checkedValues('sub-in');
  if (outIds.length !== inIds.length || outIds.length < 2 || outIds.length > 3) return toast('Cada cambio debe tener 2 o 3 salidas y el mismo número de entradas.');
  const second = timerSeconds(); state.timer.events.push({ second, outIds, inIds }); state.timer.onField = state.timer.onField.filter((id) => !outIds.includes(id)).concat(inIds); await persistTimer(); renderLive(); toast('Cambio registrado.');
}

async function finishMatch() {
  if (!confirm('¿Finalizar el partido y guardar minutos y puntuaciones?')) return;
  if (state.timer.runningSince) { state.timer.elapsed = timerSeconds(); state.timer.runningSince = null; }
  const totals = calculatePlayedSeconds(state.timer.initialOnField, state.timer.events, state.timer.elapsed);
  const match = state.matches.find((item) => item.id === state.timer.matchId); const callup = state.callups.find((item) => item.id === match.callupId);
  const ratings = {};
  for (const id of callup.availableIds) { const raw = prompt(`Puntuación de ${playerName(id)} (1–5, cancelar para omitir):`, ''); if (raw !== null && raw !== '') { const value = Number(raw); if (Number.isInteger(value) && value >= 1 && value <= 5) ratings[id] = value; } }
  for (const [id, seconds] of Object.entries(totals)) { const player = await getOne('players', id); if (player) await put('players', { ...player, totalMinutes: (player.totalMinutes ?? 0) + Math.round(seconds / 60) }); }
  await put('matches', { ...match, status: 'finished', playedSeconds: state.timer.elapsed, minuteTotals: totals, ratings, substitutionEvents: state.timer.events });
  state.timer = null; clearInterval(state.tick); await put('settings', { id: 'live', timer: null }); await refresh(); toast('Partido finalizado y minutos guardados.');
}

async function saveMatch(event) {
  event.preventDefault(); const form = event.currentTarget; const values = formObject(form); const existing = values.id ? await getOne('matches', values.id) : null;
  const goalsFor = values.goalsFor === '' ? null : Number(values.goalsFor); const goalsAgainst = values.goalsAgainst === '' ? null : Number(values.goalsAgainst);
  await put('matches', { ...existing, id: values.id || uid(), date: values.date, round: values.round.trim(), type: values.type, opponent: values.opponent.trim(), location: values.location.trim(), goalsFor, goalsAgainst, status: (goalsFor !== null && goalsAgainst !== null) ? 'finished' : (existing?.status ?? 'planned'), createdAt: existing?.createdAt ?? Date.now() });
  form.closest('dialog').close(); form.reset(); await refresh(); toast('Partido guardado.');
}

function renderMatches() {
  const list = [...state.matches].sort((a,b)=>a.date.localeCompare(b.date));
  $('#matches-list').innerHTML = list.length ? list.map((match) => `<article class="panel"><div class="section-head"><div><span class="pill ${match.status === 'finished' ? 'accent' : ''}">${match.status === 'finished' ? 'Finalizado' : 'Programado'}</span> <span class="pill">${escapeHtml(matchTypeLabel(match.type))}</span><h3>${escapeHtml(match.opponent)}</h3><p class="meta">${escapeHtml(localDate(match.date))}${match.round ? ` · Jornada ${escapeHtml(match.round)}` : ''}${match.location ? ` · ${escapeHtml(match.location)}` : ''}</p></div><div>${match.goalsFor !== null && match.goalsFor !== undefined ? `<strong>${match.goalsFor} — ${match.goalsAgainst}</strong>` : ''}</div></div>${match.ratings ? `<details><summary>Minutos y puntuaciones</summary><table class="minute-table"><tr><th>Jugador</th><th>Min</th><th>1–5</th></tr>${Object.entries(match.minuteTotals ?? {}).map(([id, seconds]) => `<tr><td>${escapeHtml(playerName(id))}</td><td>${Math.round(seconds/60)}</td><td>${match.ratings[id] ?? '—'}</td></tr>`).join('')}</table></details>` : ''}<div class="button-row">${match.status !== 'finished' && !match.callupId ? `<button class="callup-match primary" data-id="${match.id}">Convocar</button>` : ''}<button class="edit-match secondary" data-id="${match.id}">Editar</button><button class="delete-match danger" data-id="${match.id}">Borrar</button></div></article>`).join('') : empty('Añade el calendario de partidos manualmente.');
}

function editMatch(id) { const match = state.matches.find((item) => item.id === id); if (!match) return; const form = $('#match-form'); for (const key of ['id','date','round','type','opponent','location','goalsFor','goalsAgainst']) form.elements[key].value = match[key] ?? (key === 'type' ? 'league' : ''); $('#match-dialog').showModal(); }

function trainingBuilder() {
  const root = $('#training-builder'); root.classList.remove('hidden'); const today = new Date().toISOString().slice(0,10);
  root.innerHTML = `<form id="training-form"><label>Fecha<input name="date" type="date" value="${today}" required></label><div class="check-list">${state.players.map((player) => `<div class="check-row"><strong>${escapeHtml(player.name)}</strong><select name="status-${player.id}" aria-label="Estado de ${escapeHtml(player.name)}"><option value="present">Presente</option><option value="late">Tarde</option><option value="absent">Ausente</option></select><input name="note-${player.id}" maxlength="200" placeholder="Nota" aria-label="Nota de ${escapeHtml(player.name)}"></div>`).join('')}</div><label>Notas del entrenamiento<textarea name="notes" maxlength="1000"></textarea></label><div class="button-row"><button class="primary">Guardar asistencia</button><button type="button" class="secondary cancel-training">Cancelar</button></div></form>`;
}

async function saveTraining(event) {
  event.preventDefault(); const form = event.target;
  const training = buildTrainingRecord(state.players, formObject(form), { id: uid(), createdAt: Date.now() });
  await put('trainings', training); $('#training-builder').classList.add('hidden'); await refresh(); toast('Asistencia guardada.');
}

function renderTrainings() {
  const labels = { present: 'Presente', late: 'Tarde', absent: 'Ausente' };
  const list = [...state.trainings].sort((a,b)=>b.date.localeCompare(a.date));
  $('#trainings-list').innerHTML = list.length ? list.map((training) => `<article class="panel"><div class="section-head"><div><h3>${escapeHtml(localDate(training.date))}</h3><p class="meta">${training.attendance.filter((item)=>item.status==='present').length} presentes · ${training.attendance.filter((item)=>item.status==='late').length} tarde · ${training.attendance.filter((item)=>item.status==='absent').length} ausentes</p></div><button class="delete-training danger" data-id="${training.id}">Borrar</button></div><details><summary>Ver detalle</summary><table class="minute-table">${training.attendance.map((item) => `<tr><td>${escapeHtml(playerName(item.playerId))}</td><td>${labels[item.status]}${item.note ? ` · ${escapeHtml(item.note)}` : ''}</td></tr>`).join('')}</table>${training.notes ? `<p>${escapeHtml(training.notes)}</p>` : ''}</details></article>`).join('') : empty('Todavía no hay entrenamientos registrados.');
}

async function exportData() {
  const backup = await exportDatabase(); const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `campobase-copia-${new Date().toISOString().slice(0,10)}.json`; link.click(); URL.revokeObjectURL(link.href); toast('Copia exportada.');
}

async function importData(event) {
  const file = event.target.files[0]; if (!file) return;
  if (file.size > 20_000_000) return toast('La copia supera el límite de 20 MB.');
  try { const backup = validateBackup(JSON.parse(await file.text())); if (!confirm('La importación sustituirá todos los datos locales. ¿Continuar?')) return; await importDatabase(backup); state.timer = null; await refresh(); toast('Copia importada correctamente.'); } catch (error) { console.error(error); toast(`No se pudo importar: ${error.message}`); } finally { event.target.value = ''; }
}

function wireEvents() {
  $$('.bottom-nav button').forEach((button) => button.addEventListener('click', () => { $$('.view').forEach((view) => view.classList.toggle('active', view.id === button.dataset.view)); $$('.bottom-nav button').forEach((item) => item.classList.toggle('active', item === button)); $('#app').focus(); }));
  $$('[data-dialog]').forEach((button) => button.addEventListener('click', () => { const form = $(`#${button.dataset.dialog} form`); form?.reset(); if (form?.elements.id) form.elements.id.value = ''; $(`#${button.dataset.dialog}`).showModal(); }));
  $$('[data-close]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
  $('#player-form').addEventListener('submit', (event) => savePlayer(event).catch(handleError)); $('#match-form').addEventListener('submit', (event) => saveMatch(event).catch(handleError));
  $('#new-callup').addEventListener('click', () => callupBuilder()); $('#new-training').addEventListener('click', trainingBuilder);
  $('#export-data').addEventListener('click', () => exportData().catch(handleError)); $('#import-data').addEventListener('change', importData);
  $('#format').addEventListener('change', async (event) => { state.format = event.target.value; await put('settings', { id: 'main', format: state.format }); toast(`Modalidad ${state.format} guardada.`); });
  document.addEventListener('change', (event) => {
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
  document.addEventListener('submit', (event) => { if (event.target.id === 'callup-form') saveCallup(event).catch(handleError); if (event.target.id === 'training-form') saveTraining(event).catch(handleError); });
  document.addEventListener('click', async (event) => {
    const target = event.target;
    if (target.matches('.cancel-builder')) $('#callup-builder').classList.add('hidden');
    if (target.matches('.cancel-training')) $('#training-builder').classList.add('hidden');
    if (target.matches('.edit-player')) editPlayer(target.dataset.id);
    if (target.matches('.delete-player') && confirm('¿Borrar este jugador? Los históricos conservarán sus datos numéricos.')) { await remove('players', target.dataset.id); await refresh(); }
    if (target.matches('.delete-callup')) await deleteCallup(target.dataset.id);
    if (target.matches('.edit-match')) editMatch(target.dataset.id);
    if (target.matches('.callup-match')) { $$('.bottom-nav button').forEach((item) => item.classList.toggle('active', item.dataset.view === 'convocatorias')); $$('.view').forEach((view) => view.classList.toggle('active', view.id === 'convocatorias')); callupBuilder(target.dataset.id); }
    if (target.matches('.delete-match') && confirm('¿Borrar este partido?')) { await remove('matches', target.dataset.id); await refresh(); }
    if (target.matches('.delete-training') && confirm('¿Borrar este entrenamiento?')) { await remove('trainings', target.dataset.id); await refresh(); }
    if (target.id === 'prepare-live') await prepareLive(); if (target.id === 'toggle-timer') await toggleTimer(); if (target.id === 'make-sub') await makeSubstitution(); if (target.id === 'finish-match') await finishMatch();
  });
}

function handleError(error) { console.error(error); toast(error.message || 'Ha ocurrido un error.'); }
function networkStatus() { document.body.classList.toggle('offline', !navigator.onLine); $('#network-label').textContent = navigator.onLine ? 'Guardado local' : 'Sin conexión'; }

async function init() {
  wireEvents(); networkStatus(); window.addEventListener('online', networkStatus); window.addEventListener('offline', networkStatus);
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(handleError);
  await refresh(); const live = await getOne('settings', 'live'); state.timer = live?.timer ?? null; renderLive();
}

init().catch(handleError);
