import { getAll, getOne, put, remove, exportDatabase, importDatabase } from './db.js';
import { calculateMinuteTargets, suggestExcludedPlayers, calculatePlayedSeconds, validateBackup, formatMatchClock } from './domain.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const uid = () => crypto.randomUUID();
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
const safePhoto = (value) => /^data:image\/(png|jpeg|webp|gif);base64,/i.test(value ?? '') ? value : '';
const localDate = (value) => value ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: value.includes('T') ? 'short' : undefined }).format(new Date(value)) : 'Sin fecha';
const empty = (text) => `<div class="panel empty">${escapeHtml(text)}</div>`;
const FORMATS = { F7: { players: 7, duration: 70, half: 35 }, F11: { players: 11, duration: 90, half: 45 } };

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
    ${safePhoto(player.photo) ? `<img class="avatar" src="${safePhoto(player.photo)}" alt="Foto de ${escapeHtml(player.name)}">` : `<div class="avatar" aria-hidden="true">${escapeHtml(player.name.slice(0, 2).toUpperCase())}</div>`}
    <div><h3>${escapeHtml(player.name)} <span class="pill">#${escapeHtml(player.number || '—')}</span></h3><p class="meta">${escapeHtml(player.position)} · ${escapeHtml(player.foot)} · Fuera ${player.outsideCount ?? 0} veces</p><p class="meta"><span class="rank">${index + 1}. ${player.totalMinutes ?? 0} min</span>${player.notes ? ` · ${escapeHtml(player.notes)}` : ''}</p></div>
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
  await put('players', { id: values.id || uid(), name: values.name.trim(), number: values.number, position: values.position, foot: values.foot, notes: values.notes.trim(), photo: photo || existing?.photo || '', outsideCount: existing?.outsideCount ?? 0, lastExcludedAt: existing?.lastExcludedAt ?? null, totalMinutes: existing?.totalMinutes ?? 0, createdAt: existing?.createdAt ?? Date.now() });
  form.closest('dialog').close(); form.reset(); await refresh(); toast('Jugador guardado.');
}

function editPlayer(id) {
  const player = state.players.find((item) => item.id === id); if (!player) return;
  const form = $('#player-form');
  for (const key of ['id', 'name', 'number', 'position', 'foot', 'notes']) form.elements[key].value = player[key] ?? '';
  $('#player-dialog').showModal();
}

function callupBuilder() {
  const container = $('#callup-builder');
  const config = FORMATS[state.format];
  container.classList.remove('hidden');
  container.innerHTML = `<h3>Nueva convocatoria · ${state.format}</h3><form id="callup-form"><div class="builder-grid"><div><label>Partido del calendario<select name="matchId" required><option value="">Selecciona…</option>${state.matches.filter((match) => match.status !== 'finished').sort((a,b)=>a.date.localeCompare(b.date)).map((match) => `<option value="${match.id}">${escapeHtml(localDate(match.date))} · ${escapeHtml(match.opponent)}</option>`).join('')}</select></label><label>Jugadores que se quedan fuera<input name="outsideNumber" type="number" min="0" max="${state.players.length}" value="${Math.max(0, state.players.length - 12)}"></label><button id="suggest-rotation" class="secondary" type="button">Sugerir rotación equitativa</button><p class="meta">Se prioriza a quien menos veces ha quedado fuera y lleva más tiempo sin hacerlo.</p></div><div><h3>Disponibilidad</h3><div class="check-list">${state.players.map((player) => `<div class="check-row"><label><input type="checkbox" name="available" value="${player.id}" checked><span>${escapeHtml(player.name)}</span></label><span class="pill">Fuera ${player.outsideCount ?? 0}</span></div>`).join('')}</div></div></div><div id="target-preview"></div><div class="button-row"><button class="primary" type="submit">Guardar convocatoria y reparto</button><button class="secondary cancel-builder" type="button">Cancelar</button></div><p class="meta">Reparto: ${config.duration} min × ${config.players} en campo entre los disponibles reales.</p></form>`;
  updateTargetPreview();
}

function updateTargetPreview() {
  const form = $('#callup-form'); if (!form) return;
  const available = checkedValues('available', form);
  const preview = $('#target-preview');
  if (!available.length) { preview.innerHTML = '<p class="warning panel">Selecciona al menos un disponible.</p>'; return; }
  const targets = calculateMinuteTargets(available, FORMATS[state.format].duration, FORMATS[state.format].players);
  preview.innerHTML = `<h3>Minutos objetivo</h3><table class="minute-table"><thead><tr><th>Jugador</th><th>Objetivo</th></tr></thead><tbody>${targets.map((target) => `<tr><td>${escapeHtml(playerName(target.playerId))}</td><td>${target.minutes} min</td></tr>`).join('')}</tbody></table>`;
}

function suggestRotation() {
  const form = $('#callup-form'); const count = Number(form.elements.outsideNumber.value);
  const excluded = new Set(suggestExcludedPlayers(state.players, count).map(({ id }) => id));
  $$('input[name="available"]', form).forEach((input) => { input.checked = !excluded.has(input.value); });
  updateTargetPreview(); toast('Rotación sugerida aplicada. Puedes ajustarla.');
}

async function saveCallup(event) {
  event.preventDefault(); const form = event.currentTarget; const availableIds = checkedValues('available', form);
  if (!availableIds.length) return toast('Selecciona jugadores disponibles.');
  const match = state.matches.find((item) => item.id === form.elements.matchId.value);
  if (!match) return toast('Selecciona un partido del calendario.');
  const excludedIds = state.players.filter((player) => !availableIds.includes(player.id)).map(({ id }) => id);
  const config = FORMATS[state.format];
  const targets = calculateMinuteTargets(availableIds, config.duration, config.players);
  const callup = { id: uid(), matchId: match.id, date: match.date, opponent: match.opponent, format: state.format, availableIds, excludedIds, targets, createdAt: Date.now() };
  await put('callups', callup);
  for (const id of excludedIds) { const player = await getOne('players', id); if (player) await put('players', { ...player, outsideCount: (player.outsideCount ?? 0) + 1, lastExcludedAt: callup.createdAt }); }
  await put('matches', { ...match, callupId: callup.id, format: state.format });
  $('#callup-builder').classList.add('hidden'); await refresh(); toast('Convocatoria guardada.');
}

function renderCallups() {
  const list = [...state.callups].sort((a,b)=>b.date.localeCompare(a.date));
  $('#callups-list').innerHTML = list.length ? list.map((callup) => `<article class="panel"><div class="section-head"><div><span class="pill accent">${escapeHtml(callup.format)}</span><h3>${escapeHtml(callup.opponent)}</h3><p class="meta">${escapeHtml(localDate(callup.date))} · ${callup.availableIds.length} disponibles · ${callup.excludedIds.length} fuera</p></div><button class="delete-callup danger" data-id="${callup.id}">Borrar</button></div><p><strong>Fuera:</strong> ${callup.excludedIds.length ? callup.excludedIds.map(playerName).map(escapeHtml).join(', ') : 'Nadie'}</p><details><summary>Ver reparto objetivo</summary><table class="minute-table">${callup.targets.map((target) => `<tr><td>${escapeHtml(playerName(target.playerId))}</td><td>${target.minutes} min</td></tr>`).join('')}</table></details></article>`).join('') : empty('Todavía no hay convocatorias. Crea antes un partido en Calendario.');
}

async function deleteCallup(id) {
  const callup = state.callups.find((item) => item.id === id); if (!callup || !confirm('¿Borrar esta convocatoria y deshacer sus contadores de rotación?')) return;
  for (const playerId of callup.excludedIds) { const player = await getOne('players', playerId); if (player) await put('players', { ...player, outsideCount: Math.max(0, (player.outsideCount ?? 0) - 1) }); }
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
  await put('matches', { ...existing, id: values.id || uid(), date: values.date, opponent: values.opponent.trim(), location: values.location.trim(), goalsFor, goalsAgainst, status: existing?.status ?? ((goalsFor !== null && goalsAgainst !== null) ? 'finished' : 'planned'), createdAt: existing?.createdAt ?? Date.now() });
  form.closest('dialog').close(); form.reset(); await refresh(); toast('Partido guardado.');
}

function renderMatches() {
  const list = [...state.matches].sort((a,b)=>a.date.localeCompare(b.date));
  $('#matches-list').innerHTML = list.length ? list.map((match) => `<article class="panel"><div class="section-head"><div><span class="pill ${match.status === 'finished' ? 'accent' : ''}">${match.status === 'finished' ? 'Finalizado' : 'Programado'}</span><h3>${escapeHtml(match.opponent)}</h3><p class="meta">${escapeHtml(localDate(match.date))}${match.location ? ` · ${escapeHtml(match.location)}` : ''}</p></div><div>${match.goalsFor !== null && match.goalsFor !== undefined ? `<strong>${match.goalsFor} — ${match.goalsAgainst}</strong>` : ''}</div></div>${match.ratings ? `<details><summary>Minutos y puntuaciones</summary><table class="minute-table"><tr><th>Jugador</th><th>Min</th><th>1–5</th></tr>${Object.entries(match.minuteTotals ?? {}).map(([id, seconds]) => `<tr><td>${escapeHtml(playerName(id))}</td><td>${Math.round(seconds/60)}</td><td>${match.ratings[id] ?? '—'}</td></tr>`).join('')}</table></details>` : ''}<div class="button-row"><button class="edit-match secondary" data-id="${match.id}">Editar resultado</button><button class="delete-match danger" data-id="${match.id}">Borrar</button></div></article>`).join('') : empty('Añade el calendario de partidos manualmente.');
}

function editMatch(id) { const match = state.matches.find((item) => item.id === id); if (!match) return; const form = $('#match-form'); for (const key of ['id','date','opponent','location','goalsFor','goalsAgainst']) form.elements[key].value = match[key] ?? ''; $('#match-dialog').showModal(); }

function trainingBuilder() {
  const root = $('#training-builder'); root.classList.remove('hidden'); const today = new Date().toISOString().slice(0,10);
  root.innerHTML = `<form id="training-form"><label>Fecha<input name="date" type="date" value="${today}" required></label><div class="check-list">${state.players.map((player) => `<div class="check-row"><strong>${escapeHtml(player.name)}</strong><select name="status-${player.id}" aria-label="Estado de ${escapeHtml(player.name)}"><option value="present">Presente</option><option value="late">Tarde</option><option value="absent">Ausente</option></select><input name="note-${player.id}" maxlength="200" placeholder="Nota" aria-label="Nota de ${escapeHtml(player.name)}"></div>`).join('')}</div><label>Notas del entrenamiento<textarea name="notes" maxlength="1000"></textarea></label><div class="button-row"><button class="primary">Guardar asistencia</button><button type="button" class="secondary cancel-training">Cancelar</button></div></form>`;
}

async function saveTraining(event) {
  event.preventDefault(); const attendance = state.players.map((player) => ({ playerId: player.id, status: event.currentTarget.elements[`status-${player.id}`].value, note: event.currentTarget.elements[`note-${player.id}`].value.trim() }));
  await put('trainings', { id: uid(), date: event.currentTarget.elements.date.value, notes: event.currentTarget.elements.notes.value.trim(), attendance, createdAt: Date.now() }); $('#training-builder').classList.add('hidden'); await refresh(); toast('Asistencia guardada.');
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
  $('#new-callup').addEventListener('click', callupBuilder); $('#new-training').addEventListener('click', trainingBuilder);
  $('#export-data').addEventListener('click', () => exportData().catch(handleError)); $('#import-data').addEventListener('change', importData);
  $('#format').addEventListener('change', async (event) => { state.format = event.target.value; await put('settings', { id: 'main', format: state.format }); toast(`Modalidad ${state.format} guardada.`); });
  document.addEventListener('change', (event) => { if (event.target.matches('#callup-form input[name="available"]')) updateTargetPreview(); });
  document.addEventListener('submit', (event) => { if (event.target.id === 'callup-form') saveCallup(event).catch(handleError); if (event.target.id === 'training-form') saveTraining(event).catch(handleError); });
  document.addEventListener('click', async (event) => {
    const target = event.target;
    if (target.id === 'suggest-rotation') suggestRotation();
    if (target.matches('.cancel-builder')) $('#callup-builder').classList.add('hidden');
    if (target.matches('.cancel-training')) $('#training-builder').classList.add('hidden');
    if (target.matches('.edit-player')) editPlayer(target.dataset.id);
    if (target.matches('.delete-player') && confirm('¿Borrar este jugador? Los históricos conservarán sus datos numéricos.')) { await remove('players', target.dataset.id); await refresh(); }
    if (target.matches('.delete-callup')) await deleteCallup(target.dataset.id);
    if (target.matches('.edit-match')) editMatch(target.dataset.id);
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
