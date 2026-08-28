import { getAll, getOne, put, remove, exportDatabase, importDatabase } from './db.js';
import { calculateMinuteTargets, buildCallupSelection, buildAttendanceRecord, calculateAttendanceStats, applySubstitution, normalizePositions, calculatePlayedSeconds, validateBackup, formatMatchClock, buildPlayerHistory, sortAttendanceRecords, suggestDelegateSubstitution, shouldSuggestUrgentSubstitution } from './domain.js';

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

const state = { players: [], callups: [], matches: [], trainings: [], format: 'F7', timer: null, tick: null, delegateMode: false, urgentAlertKey: '' };
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
function showView(viewId) {
  $$('.view').forEach((view) => view.classList.toggle('active', view.id === viewId));
  $$('.bottom-nav button').forEach((item) => item.classList.toggle('active', item.dataset.view === viewId));
  $('#app').focus();
}

async function refresh() {
  [state.players, state.callups, state.matches, state.trainings] = await Promise.all(['players', 'callups', 'matches', 'trainings'].map(getAll));
  const settings = await getOne('settings', 'main');
  state.format = settings?.format ?? 'F7';
  $('#format').value = state.format;
  renderAll();
}

function renderAll() {
  const config = FORMATS[state.format];
  $('#active-format').textContent = `${state.format} · ${config.players} en campo · ${config.duration} min`;
  renderPlayers(); renderCallups(); renderLive(); renderDelegate(); renderMatches(); renderTrainings();
}

function renderPlayers() {
  const totalMinutes = state.players.reduce((sum, player) => sum + (player.totalMinutes ?? 0), 0);
  $('#squad-stats').innerHTML = `<div class="stat"><strong>${state.players.length}</strong><span>jugadores</span></div><div class="stat"><strong>${totalMinutes}</strong><span>minutos acumulados</span></div><div class="stat"><strong>${state.players.reduce((sum, player) => sum + (player.outsideCount ?? 0), 0)}</strong><span>ausencias por rotación</span></div>`;
  const sorted = [...state.players].sort((a, b) => (b.totalMinutes ?? 0) - (a.totalMinutes ?? 0));
  $('#players-list').innerHTML = sorted.length ? sorted.map((player, index) => {
    const labels = { present: 'Presente', late: 'Tarde', absent: 'Ausente', sick: 'Enfermedad', coach_decision: 'Decisión del entrenador', missed_training: 'No fue a entrenar', discipline: 'Disciplina', rotation: 'Rotación' };
    const history = buildPlayerHistory(player.id, state.trainings, state.callups);
    const historyRows = history.map((item) => `<li><strong>${escapeHtml(localDate(item.date))}</strong> · ${item.type === 'callup' ? 'Convocatoria' : item.kind === 'match' ? 'Partido' : 'Entrenamiento'} · ${escapeHtml(labels[item.detail] ?? item.detail)}</li>`).join('');
    return `<article class="card player">
    ${playerCardPhoto(player)}
    <div><h3>${escapeHtml(player.name)} <span class="pill">#${escapeHtml(player.number || '—')}</span></h3><p class="meta">${escapeHtml(playerPositions(player))}</p><p class="meta">Pierna ${escapeHtml((player.foot || 'sin indicar').toLowerCase())} · Fuera por rotación ${player.outsideCount ?? 0} veces</p><p class="meta"><span class="rank">${index + 1}. ${player.totalMinutes ?? 0} min</span>${player.notes ? ` · ${escapeHtml(player.notes)}` : ''}</p>${history.length ? `<details class="player-history"><summary>Historial de incidencias y comentarios (${history.length})</summary><ul class="plain-list">${historyRows}</ul></details>` : '<p class="meta">Sin incidencias ni comentarios.</p>'}</div>
    <div><button class="icon-button edit-player" data-id="${player.id}" aria-label="Editar ${escapeHtml(player.name)}">Editar</button><button class="icon-button delete-player danger" data-id="${player.id}" aria-label="Eliminar ${escapeHtml(player.name)}">Borrar</button></div>
  </article>`;
  }).join('') : empty('Añade el primer jugador para empezar.');
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
  container.innerHTML = `<h3>${existing ? 'Editar' : 'Nueva'} convocatoria · ${existing?.format ?? state.format}</h3><form id="callup-form"><input type="hidden" name="id" value="${existing?.id ?? ''}"><fieldset><legend>Partido</legend><div class="choice-row"><label><input type="radio" name="matchSource" value="calendar" ${existing || preselectedMatchId || options ? 'checked' : ''}> Elegir del calendario</label>${existing ? '' : `<label><input type="radio" name="matchSource" value="manual" ${!preselectedMatchId && !options ? 'checked' : ''}> Crear partido a mano</label>`}</div><div id="calendar-match-fields"><label>Partido del calendario<select name="matchId"><option value="">Selecciona…</option>${options}</select></label></div><div id="manual-match-fields" class="hidden"><div class="form-row"><label>Fecha y hora (24 h)<input name="manualDate" type="datetime-local" lang="es-ES" step="300"></label><label>Jornada<input name="manualRound" maxlength="30" placeholder="Ej. 8"></label></div><div class="form-row"><label>Tipo<select name="manualType"><option value="league">Partido de liga</option><option value="friendly">Amistoso</option><option value="tournament">Torneo</option></select></label><label>Rival<input name="manualOpponent" maxlength="100"></label></div><label>Lugar<input name="manualLocation" maxlength="120"></label></div></fieldset><div class="callup-help panel"><strong>Máximo 14.</strong> Marca solo quienes quieras asegurar en la convocatoria. Para dejar a alguien fuera manualmente, marca “Dejar fuera” e indica el motivo. En liga, CampoBase completa el resto con rotación justa. Si a alguien ya se le excluyó por enfermedad o decisión técnica, te pedirá confirmación antes de dejarle fuera por rotación.</div><div class="selection-grid">${state.players.map((player) => callupPlayerCard(player, existing)).join('')}</div><div id="target-preview"></div><div class="button-row"><button class="primary" type="submit">${existing ? 'Actualizar' : 'Guardar'} convocatoria y reparto</button><button class="secondary cancel-builder" type="button">Cancelar</button></div><p class="meta">Reparto: ${config.duration} min × ${config.players} en campo entre los convocados.</p></form>`;
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
  for (const name of ['manualDate', 'manualOpponent']) form.elements[name].required = manual;
  form.elements.matchId.required = !manual;
}

async function saveCallup(event) {
  event.preventDefault(); const form = event.target;
  const existing = form.elements.id.value ? state.callups.find(({ id }) => id === form.elements.id.value) : null;
  let match = currentCallupMatch(form);
  if (!match) return toast('Selecciona un partido del calendario.');
  const manualMatch = form.elements.matchSource.value === 'manual';
  if (manualMatch) {
    match = { id: uid(), date: form.elements.manualDate.value, round: form.elements.manualRound.value.trim(), type: form.elements.manualType.value, opponent: form.elements.manualOpponent.value.trim(), location: form.elements.manualLocation.value.trim(), goalsFor: null, goalsAgainst: null, status: 'planned', createdAt: Date.now() };
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
    const include = confirm(`${playerName(pending.playerId)} ya se quedó fuera por:\n${history}\n\n¿Quieres que ENTRE en esta convocatoria?\nAceptar: entra y se queda fuera el siguiente.\nCancelar: se queda fuera por rotación.`);
    rotationDecisions[pending.playerId] = include ? 'include' : 'exclude';
  }
  const { availableIds, exclusions } = selection;
  if (!availableIds.length) return toast('La convocatoria no puede quedar vacía.');
  if (manualMatch) await put('matches', match);
  const excludedIds = exclusions.map(({ playerId }) => playerId);
  const format = existing?.format ?? state.format;
  const config = FORMATS[format];
  const targets = calculateMinuteTargets(availableIds, config.duration, config.players);
  const callup = { id: existing?.id ?? uid(), matchId: match.id, date: match.date, opponent: match.opponent, matchType: match.type ?? 'league', format, availableIds, selectedIds: checkedValues('selected', form), excludedIds, exclusions, targets, rotationDecisions, createdAt: existing?.createdAt ?? Date.now(), updatedAt: Date.now() };
  await put('callups', callup);
  if (existing?.matchId && existing.matchId !== match.id) {
    const oldMatch = state.matches.find(({ id }) => id === existing.matchId);
    if (oldMatch) await put('matches', { ...oldMatch, callupId: null });
  }
  await put('matches', { ...match, callupId: callup.id, format });
  await synchronizeRotationCounters();
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
    return `<article class="panel"><div class="section-head"><div><span class="pill accent">${escapeHtml(callup.format)} · ${escapeHtml(matchTypeLabel(callup.matchType))}</span><h3>${escapeHtml(callup.opponent)}</h3><p class="meta">${escapeHtml(localDate(callup.date))} · ${callup.availableIds.length} convocados · ${exclusions.length} fuera</p></div><div class="button-row"><button class="edit-callup secondary" data-id="${callup.id}">Editar</button><button class="delete-callup danger" data-id="${callup.id}">Borrar</button></div></div><div class="exclusion-summary"><section><h4>Fuera manualmente</h4><ul class="plain-list">${exclusionRows(false)}</ul></section><section><h4>Fuera por CampoBase</h4><ul class="plain-list">${exclusionRows(true)}</ul></section></div><details><summary>Ver reparto objetivo</summary><table class="minute-table">${callup.targets.map((target) => `<tr><td>${escapeHtml(playerName(target.playerId))}</td><td>${target.minutes} min</td></tr>`).join('')}</table></details></article>`;
  }).join('') : empty('Todavía no hay convocatorias.');
}

async function deleteCallup(id) {
  const callup = state.callups.find((item) => item.id === id); if (!callup || !confirm('¿Borrar esta convocatoria y deshacer sus contadores de rotación?')) return;
  const match = state.matches.find((item) => item.callupId === id); if (match) await put('matches', { ...match, callupId: null });
  await remove('callups', id); await synchronizeRotationCounters(); await refresh(); toast('Convocatoria borrada.');
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
  const seconds = timerSeconds(); const config = FORMATS[callup.format];
  state.timer.phase ??= seconds < config.half * 60 ? 'first_half' : 'second_half';
  const phaseLabels = { first_half: '1.er tiempo', halftime: 'Descanso', second_half: '2.º tiempo' };
  const actionLabels = { first_half: 'Fin primer tiempo', halftime: 'Descanso terminado · empezar 2.º tiempo', second_half: 'Fin segundo tiempo' };
  const fieldIds = state.timer.onField;
  root.innerHTML = `<div class="live-clock"><span class="pill accent">${escapeHtml(match.opponent)} · ${escapeHtml(callup.format)}</span><div id="clock" class="clock">${formatMatchClock(seconds)}</div><div id="half" class="half">${phaseLabels[state.timer.phase]} / ${config.duration}:00</div><div class="button-row"><button id="advance-live" class="${state.timer.phase === 'second_half' ? 'danger' : 'primary'}">${actionLabels[state.timer.phase]}</button><button id="open-delegate" class="secondary">Abrir vista delegado</button><button id="exit-live" class="danger">Salir del partido en vivo</button></div></div>
  <div class="live-grid"><div class="panel on-field"><h3>En campo (${fieldIds.length}/${config.players})</h3><div class="check-list">${fieldIds.map((id) => `<div class="check-row"><label><input type="checkbox" name="sub-out" value="${id}"><span>${escapeHtml(playerName(id))}</span></label><strong>${formatMatchClock(livePlayerSeconds(id))}</strong></div>`).join('')}</div></div><div class="panel bench"><h3>Banquillo</h3><div class="check-list">${callup.availableIds.filter((id) => !fieldIds.includes(id)).map((id) => `<div class="check-row"><label><input type="checkbox" name="sub-in" value="${id}"><span>${escapeHtml(playerName(id))}</span></label><strong>${formatMatchClock(livePlayerSeconds(id))}</strong></div>`).join('')}</div></div></div>
  <div class="button-row"><button id="make-sub" class="primary" ${state.timer.phase === 'halftime' ? 'disabled' : ''}>Registrar cambio manual (1–3 jugadores)</button></div><p class="meta">Selecciona quién sale y quién entra. Debe ser el mismo número. En el descanso el reloj se detiene y los minutos se conservan.</p>`;
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
    root.innerHTML = `${empty('No hay un partido en vivo. El entrenador debe prepararlo primero.')}<button id="close-delegate" class="secondary">Volver al modo entrenador</button>`;
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
  root.innerHTML = `<div class="delegate-head"><div><p class="eyebrow">Solo cambios y tiempos</p><h2>${escapeHtml(match.opponent)}</h2></div><button id="close-delegate" class="secondary">Salir de vista delegado</button></div><div class="live-clock"><div id="delegate-clock" class="clock">${formatMatchClock(seconds)}</div><p>${Math.max(0, config.duration - Math.floor(seconds / 60))} min restantes</p></div><article class="panel delegate-suggestion"><h3>¿Quién ha jugado menos?</h3><p>${escapeHtml(suggestionText)}</p>${suggestion.inIds.length ? '<button id="apply-delegate-suggestion" class="primary">Hacer este cambio</button>' : ''}</article><div class="live-grid"><div class="panel on-field"><h3>Sale del campo</h3>${fieldIds.map((id) => row(id, 'delegate-out')).join('')}</div><div class="panel bench"><h3>Entra al campo</h3>${benchIds.map((id) => row(id, 'delegate-in')).join('')}</div></div><div class="delegate-actions"><button id="delegate-manual-sub" class="primary">Registrar cambio (1, 3 o 7)</button><button id="delegate-auto-sub" class="secondary">Automático (2–3 jugadores)</button></div><p class="meta">El modo automático elige a quienes menos han jugado y saca a quienes más minutos llevan. Siempre pide confirmación.</p>`;
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
  if (!state.timer || !confirm('¿Salir de este partido en vivo? Se descartarán el reloj y los cambios registrados, pero no la convocatoria.')) return;
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

async function prepareLive() {
  const match = state.matches.find((item) => item.id === $('#live-select').value); const callup = state.callups.find((item) => item.id === match?.callupId);
  if (!callup) return toast('Selecciona un partido.');
  const config = FORMATS[callup.format];
  if (callup.availableIds.length < config.players) return toast(`Faltan jugadores: ${callup.format} necesita ${config.players} en campo.`);
  state.timer = { matchId: match.id, elapsed: 0, runningSince: Date.now(), phase: 'first_half', initialOnField: callup.availableIds.slice(0, config.players), onField: callup.availableIds.slice(0, config.players), events: [] };
  await put('settings', { id: 'live', timer: state.timer }); renderLive();
}

async function persistTimer() { await put('settings', { id: 'live', timer: state.timer }); }
function startTicks() {
  clearInterval(state.tick);
  if (!state.timer?.runningSince) return;
  state.tick = setInterval(() => {
    const seconds = timerSeconds();
    for (const clock of [$('#clock'), $('#delegate-clock')].filter(Boolean)) clock.textContent = formatMatchClock(seconds);
    const played = livePlayedSeconds();
    $$('[data-player-clock]').forEach((element) => { element.textContent = formatMatchClock(played[element.dataset.playerClock] ?? 0); });
    maybeShowUrgentSubstitution(played, seconds);
  }, 1000);
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
  if (state.timer.phase === 'first_half') {
    state.timer.elapsed = timerSeconds();
    state.timer.runningSince = null;
    state.timer.phase = 'halftime';
    await persistTimer();
    renderLive();
    return toast('Primer tiempo finalizado. Descanso.');
  }
  if (state.timer.phase === 'halftime') {
    state.timer.phase = 'second_half';
    state.timer.runningSince = Date.now();
    await persistTimer();
    renderLive();
    return toast('Segundo tiempo en marcha.');
  }
  return finishMatch();
}

async function makeSubstitution() {
  const outIds = checkedValues('sub-out'); const inIds = checkedValues('sub-in');
  const match = state.matches.find((item) => item.id === state.timer.matchId);
  const callup = state.callups.find((item) => item.id === match?.callupId);
  try {
    const nextOnField = applySubstitution(state.timer.onField, outIds, inIds, callup.availableIds);
    const second = timerSeconds();
    state.timer.events.push({ second, outIds, inIds });
    state.timer.onField = nextOnField;
    await persistTimer(); renderLive(); toast('Cambio registrado.');
  } catch (error) { toast(error.message); }
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
  const existingAttendance = state.trainings.find((record) => record.kind === 'match' && record.matchId === match.id);
  if (!existingAttendance) {
    const values = { date: match.date.slice(0, 10), notes: 'Registro creado automáticamente al finalizar el partido.' };
    for (const id of callup.availableIds) values[`status-${id}`] = 'present';
    await put('trainings', buildAttendanceRecord(
      state.players.filter(({ id }) => callup.availableIds.includes(id)),
      values,
      { id: uid(), kind: 'match', matchId: match.id, createdAt: Date.now() },
    ));
  }
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
    return `<div class="check-row attendance-row"><strong>${escapeHtml(player.name)}</strong><select name="status-${player.id}" aria-label="Estado de ${escapeHtml(player.name)}"><option value="present" ${entry.status === 'present' ? 'selected' : ''}>Presente</option><option value="late" ${entry.status === 'late' ? 'selected' : ''}>Tarde</option><option value="absent" ${entry.status === 'absent' ? 'selected' : ''}>Ausente</option></select><label class="arrival-time ${entry.status === 'late' ? '' : 'hidden'}">Hora de llegada<input type="time" name="arrivalTime-${player.id}" value="${escapeHtml(entry.arrivalTime ?? '')}" aria-label="Hora de llegada de ${escapeHtml(player.name)}"></label><input name="note-${player.id}" value="${escapeHtml(entry.note)}" maxlength="200" placeholder="Incidencia o comentario" aria-label="Nota de ${escapeHtml(player.name)}"></div>`;
  }).join('');
  root.classList.remove('hidden');
  root.innerHTML = `<form id="training-form"><input type="hidden" name="id" value="${existing?.id ?? ''}"><div class="form-row"><label>Tipo de registro<select name="kind"><option value="training" ${kind === 'training' ? 'selected' : ''}>Entrenamiento</option><option value="match" ${kind === 'match' ? 'selected' : ''}>Partido</option></select></label><label>Fecha<input name="date" type="date" value="${escapeHtml(existing?.date ?? match?.date.slice(0, 10) ?? today)}" required></label></div><label class="${kind === 'match' ? '' : 'hidden'}">Partido<select name="matchId" ${kind === 'match' ? 'required' : ''}><option value="">Selecciona…</option>${matchOptions}</select></label>${kind === 'match' && !callup ? '<p class="warning panel">Selecciona un partido con convocatoria.</p>' : `<div class="check-list">${rows}</div>`}<label>Notas del registro<textarea name="notes" maxlength="1000">${escapeHtml(existing?.notes ?? '')}</textarea></label><div class="button-row"><button class="primary">Guardar asistencia</button><button type="button" class="secondary cancel-training">Cancelar</button></div></form>`;
  root.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function saveTraining(event) {
  event.preventDefault(); const form = event.target; const values = formObject(form);
  const existing = values.id ? state.trainings.find(({ id }) => id === values.id) : null;
  const match = values.kind === 'match' ? state.matches.find(({ id }) => id === values.matchId) : null;
  const callup = state.callups.find(({ id }) => id === match?.callupId);
  if (values.kind === 'match' && !callup) return toast('Selecciona un partido con convocatoria.');
  const players = values.kind === 'match' ? state.players.filter(({ id }) => callup.availableIds.includes(id)) : state.players;
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

async function exportData() {
  const backup = await exportDatabase(); const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `campobase-copia-${new Date().toISOString().slice(0,10)}.json`; link.click(); URL.revokeObjectURL(link.href); toast('Copia exportada.');
}

async function importData(event) {
  const file = event.target.files[0]; if (!file) return;
  if (file.size > 20_000_000) return toast('La copia supera el límite de 20 MB.');
  try { const backup = validateBackup(JSON.parse(await file.text())); if (!confirm('La importación sustituirá todos los datos locales. ¿Continuar?')) return; await importDatabase(backup); state.timer = null; await refresh(); toast('Copia importada correctamente.'); } catch (error) { console.error(error); toast(`No se pudo importar: ${error.message}`); } finally { event.target.value = ''; }
}

function wireEvents() {
  $$('.bottom-nav button').forEach((button) => button.addEventListener('click', () => showView(button.dataset.view)));
  $$('[data-dialog]').forEach((button) => button.addEventListener('click', () => { const form = $(`#${button.dataset.dialog} form`); form?.reset(); if (form?.elements.id) form.elements.id.value = ''; $(`#${button.dataset.dialog}`).showModal(); }));
  $$('[data-close]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
  $('#player-form').addEventListener('submit', (event) => savePlayer(event).catch(handleError)); $('#match-form').addEventListener('submit', (event) => saveMatch(event).catch(handleError));
  $('#new-callup').addEventListener('click', () => callupBuilder()); $('#new-training').addEventListener('click', () => attendanceBuilder());
  $('#export-data').addEventListener('click', () => exportData().catch(handleError)); $('#import-data').addEventListener('change', importData);
  $('#format').addEventListener('change', async (event) => {
    state.format = event.target.value;
    await put('settings', { id: 'main', format: state.format });
    renderAll();
    if (!$('#callup-builder').classList.contains('hidden')) callupBuilder($('#callup-form')?.elements.matchId.value ?? '');
    toast(`Modalidad ${state.format} guardada y aplicada en toda la app.`);
  });
  document.addEventListener('change', (event) => {
    const attendanceForm = event.target.closest('#training-form');
    if (attendanceForm && event.target.name.startsWith('status-')) {
      const arrival = event.target.closest('.attendance-row').querySelector('.arrival-time');
      arrival.classList.toggle('hidden', event.target.value !== 'late');
      if (event.target.value !== 'late') arrival.querySelector('input').value = '';
      return;
    }
    if (attendanceForm && event.target.name === 'kind') {
      const firstMatchId = state.matches.find(({ callupId }) => callupId)?.id ?? '';
      return event.target.value === 'match' ? attendanceBuilder(firstMatchId) : attendanceBuilder();
    }
    if (attendanceForm && event.target.name === 'matchId') return attendanceBuilder(event.target.value);
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
    if (target.matches('.edit-callup')) callupBuilder('', target.dataset.id);
    if (target.matches('.edit-match')) editMatch(target.dataset.id);
    if (target.matches('.edit-attendance')) attendanceBuilder('', target.dataset.id);
    if (target.matches('.callup-match')) { $$('.bottom-nav button').forEach((item) => item.classList.toggle('active', item.dataset.view === 'convocatorias')); $$('.view').forEach((view) => view.classList.toggle('active', view.id === 'convocatorias')); callupBuilder(target.dataset.id); }
    if (target.matches('.delete-match') && confirm('¿Borrar este partido y su registro de asistencia asociado?')) { for (const record of state.trainings.filter(({ matchId }) => matchId === target.dataset.id)) await remove('trainings', record.id); await remove('matches', target.dataset.id); await refresh(); }
    if (target.matches('.delete-training') && confirm('¿Borrar este registro de asistencia?')) { await remove('trainings', target.dataset.id); await refresh(); }
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
      if (confirm(`Cambio automático de ${count}: entran ${suggestion.inIds.map(playerName).join(', ')} y salen ${suggestion.outIds.map(playerName).join(', ')}. ¿Confirmar?`)) await registerDelegateSubstitution(suggestion.outIds, suggestion.inIds);
    }
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
