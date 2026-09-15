const snapshot = window.__CAMPO_PREVIEW_CLOUD__ || { players: [], callups: [], matches: [], trainings: [], settings: [] };
const temporary = new Map();
let currentFieldContext = null;

const esc = (value = '') => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const dayKey = (value = '') => String(value || '').slice(0, 10);

function ensureStyles() {
  if (document.querySelector('link[data-campo-attendance-css]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = './modo-campo-preview-attendance.css?v=1';
  link.dataset.campoAttendanceCss = '1';
  document.head.append(link);
}

function ensureDialog() {
  let dialog = document.querySelector('#campo-attendance-dialog');
  if (dialog) return dialog;
  dialog = document.createElement('dialog');
  dialog.id = 'campo-attendance-dialog';
  dialog.className = 'campo-dialog campo-attendance-dialog';
  dialog.innerHTML = '<div id="campo-attendance-content"></div><div class="campo-dialog-footer"><button type="button" class="campo-btn close-attendance">Cerrar</button></div>';
  document.body.append(dialog);
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); dialog.close(); });
  return dialog;
}

function sessionById(id) {
  return (snapshot.settings || []).find((item) => item?.recordType === 'trainingSession' && String(item.id) === String(id)) || null;
}

function matchById(id) {
  return (snapshot.matches || []).find((item) => String(item.id) === String(id)) || null;
}

function callupForMatch(match) {
  return (snapshot.callups || []).find((callup) => String(callup.matchId) === String(match?.id) || String(callup.id) === String(match?.callupId)) || null;
}

function existingAttendance(kind, item) {
  const rows = snapshot.trainings || [];
  if (kind === 'match') {
    return rows.find((row) => String(row?.matchId || '') === String(item?.id || ''))
      || rows.find((row) => row?.kind === 'match' && dayKey(row.date) === dayKey(item?.date))
      || null;
  }
  return rows.find((row) => String(row?.sessionId || row?.trainingSessionId || '') === String(item?.id || ''))
    || rows.find((row) => !row?.matchId && dayKey(row.date) === dayKey(item?.date))
    || null;
}

function keyFor(kind, id) { return `${kind}:${id}`; }

function attendanceState(kind, item) {
  const key = keyFor(kind, item.id);
  if (temporary.has(key)) return temporary.get(key);
  const existing = existingAttendance(kind, item);
  const map = new Map();
  for (const row of existing?.attendance || []) map.set(String(row.playerId), row.status || 'pending');
  temporary.set(key, map);
  return map;
}

function eventLabel(kind, item) {
  if (kind === 'match') return `Partido · ${item?.opponent || 'Rival'}`;
  return `Entrenamiento · ${item?.name || 'Sesión'}`;
}

function dateLabel(item) {
  const date = dayKey(item?.date);
  if (!date) return 'Sin fecha';
  const d = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
}

function statusName(status) {
  return ({ present: 'Presente', late: 'Tarde', absent: 'Ausente', sick: 'Enfermo', coach_decision: 'Decisión técnica', pending: 'Pendiente' })[status] || status || 'Pendiente';
}

function summaryMarkup(state) {
  const values = [...state.values()];
  const present = values.filter((v) => v === 'present').length;
  const late = values.filter((v) => v === 'late').length;
  const absent = values.filter((v) => !['present', 'late', 'pending'].includes(v)).length;
  const pending = Math.max(0, (snapshot.players || []).length - present - late - absent);
  return `<div class="attendance-summary"><div><strong>${present}</strong><span>Presentes</span></div><div><strong>${late}</strong><span>Tarde</span></div><div><strong>${absent}</strong><span>Ausentes</span></div><div><strong>${pending}</strong><span>Pendientes</span></div></div>`;
}

function playerRows(kind, item, state) {
  const callup = kind === 'match' ? callupForMatch(item) : null;
  const called = new Set((callup?.availableIds || []).map(String));
  const players = [...(snapshot.players || [])].sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'es'));
  return players.map((player) => {
    const id = String(player.id);
    const status = state.get(id) || 'pending';
    return `<article class="attendance-player" data-att-player="${esc(id)}">
      <div class="attendance-player-head"><div><strong>${esc(player.name || 'Jugador')}</strong>${player.number ? `<span>Dorsal ${esc(player.number)}</span>` : ''}</div>${kind === 'match' && called.has(id) ? '<span class="attendance-called">Convocado</span>' : ''}</div>
      <div class="attendance-current">Estado: <strong>${esc(statusName(status))}</strong></div>
      <div class="attendance-actions">
        <button type="button" class="${status === 'present' ? 'active present' : ''}" data-att-status="present" data-player-id="${esc(id)}">✓ Presente</button>
        <button type="button" class="${status === 'late' ? 'active late' : ''}" data-att-status="late" data-player-id="${esc(id)}">⏱ Tarde</button>
        <button type="button" class="${status === 'absent' ? 'active absent' : ''}" data-att-status="absent" data-player-id="${esc(id)}">× Ausente</button>
        <button type="button" class="${status === 'pending' ? 'active pending' : ''}" data-att-status="pending" data-player-id="${esc(id)}">— Pendiente</button>
      </div>
    </article>`;
  }).join('');
}

function renderAttendance(kind, id) {
  const item = kind === 'match' ? matchById(id) : sessionById(id);
  if (!item) return;
  const state = attendanceState(kind, item);
  const existing = existingAttendance(kind, item);
  const content = document.querySelector('#campo-attendance-content');
  content.dataset.kind = kind;
  content.dataset.id = String(id);
  content.innerHTML = `<div class="attendance-head"><p class="campo-kicker">Asistencia del día</p><h2>${esc(eventLabel(kind, item))}</h2><p>${esc(dateLabel(item))}${item.time ? ` · ${esc(item.time)}` : ''}</p></div>
    <div class="attendance-note">${existing ? 'Se muestra la asistencia existente de CampoBase.' : 'Todavía no hay asistencia guardada para este evento.'} Los cambios que marques aquí son <strong>solo de prueba</strong> y no modifican tus datos reales.</div>
    ${summaryMarkup(state)}
    <div class="attendance-toolbar"><button type="button" class="campo-btn secondary" data-att-all-present>Marcar todos presentes</button><button type="button" class="campo-btn secondary" data-att-reset>Restablecer</button></div>
    <div class="attendance-list">${playerRows(kind, item, state)}</div>`;
}

function openAttendance(kind, id) {
  const dialog = ensureDialog();
  renderAttendance(kind, id);
  dialog.showModal();
}

function injectAttendanceButtons(root = document) {
  root.querySelectorAll?.('.campo-card[data-session-id]').forEach((card) => {
    const actions = card.querySelector('.campo-card-actions');
    if (!actions || actions.querySelector('[data-attendance-kind]')) return;
    actions.insertAdjacentHTML('beforeend', `<button type="button" class="campo-btn secondary attendance-entry" data-attendance-kind="session" data-attendance-id="${esc(card.dataset.sessionId)}">👥 Asistencia</button>`);
  });
  root.querySelectorAll?.('.campo-card[data-match-id]').forEach((card) => {
    const actions = card.querySelector('.campo-card-actions');
    if (!actions || actions.querySelector('[data-attendance-kind]')) return;
    actions.insertAdjacentHTML('beforeend', `<button type="button" class="campo-btn secondary attendance-entry" data-attendance-kind="match" data-attendance-id="${esc(card.dataset.matchId)}">👥 Asistencia</button>`);
  });

  const hero = root.querySelector?.('.campo-hero-actions');
  if (hero && !hero.querySelector('[data-attendance-kind]')) {
    const session = hero.querySelector('[data-start-session]');
    const match = hero.querySelector('[data-start-match]');
    if (match) hero.insertAdjacentHTML('beforeend', `<button type="button" class="campo-btn ghost big attendance-entry" data-attendance-kind="match" data-attendance-id="${esc(match.dataset.startMatch)}">👥 Asistencia</button>`);
    else if (session) hero.insertAdjacentHTML('beforeend', `<button type="button" class="campo-btn ghost big attendance-entry" data-attendance-kind="session" data-attendance-id="${esc(session.dataset.startSession)}">👥 Asistencia</button>`);
  }

  const field = root.querySelector?.('#field-content');
  if (field && currentFieldContext && !field.querySelector('[data-attendance-kind]')) {
    const target = field.querySelector('.field-match-actions, .campo-card-actions');
    if (target) target.insertAdjacentHTML('beforeend', `<button type="button" data-attendance-kind="${currentFieldContext.kind}" data-attendance-id="${esc(currentFieldContext.id)}">👥 Asistencia</button>`);
  }
}

function resetTemporary(kind, item) {
  temporary.delete(keyFor(kind, item.id));
  return attendanceState(kind, item);
}

ensureStyles();
ensureDialog();

const observer = new MutationObserver(() => injectAttendanceButtons(document));
observer.observe(document.body, { childList: true, subtree: true });
injectAttendanceButtons(document);

document.addEventListener('click', (event) => {
  const startSession = event.target.closest('[data-start-session]');
  if (startSession) currentFieldContext = { kind: 'session', id: startSession.dataset.startSession };
  const startMatch = event.target.closest('[data-start-match]');
  if (startMatch) currentFieldContext = { kind: 'match', id: startMatch.dataset.startMatch };

  const open = event.target.closest('[data-attendance-kind]');
  if (open) {
    event.preventDefault();
    event.stopPropagation();
    openAttendance(open.dataset.attendanceKind, open.dataset.attendanceId);
    return;
  }

  if (event.target.closest('.close-attendance')) {
    ensureDialog().close();
    return;
  }

  const content = document.querySelector('#campo-attendance-content');
  const dialog = document.querySelector('#campo-attendance-dialog');
  if (!content || !dialog?.open) return;
  const kind = content.dataset.kind;
  const id = content.dataset.id;
  const item = kind === 'match' ? matchById(id) : sessionById(id);
  if (!item) return;
  const state = attendanceState(kind, item);

  const status = event.target.closest('[data-att-status]');
  if (status) {
    state.set(String(status.dataset.playerId), status.dataset.attStatus);
    renderAttendance(kind, id);
    return;
  }

  if (event.target.closest('[data-att-all-present]')) {
    for (const player of snapshot.players || []) state.set(String(player.id), 'present');
    renderAttendance(kind, id);
    return;
  }

  if (event.target.closest('[data-att-reset]')) {
    resetTemporary(kind, item);
    renderAttendance(kind, id);
  }
}, true);
