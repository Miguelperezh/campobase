// Asistencia vinculada a los orígenes reales de CampoBase.
// Los partidos vienen de Calendario (matchId) y las sesiones de Sesiones (sessionId).
// No crea una segunda sesión/partido: solo crea o edita su registro de asistencia.

import { getAll, put, remove } from './db.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

let renderQueued = false;
let rendering = false;
let cleanupQueued = false;

function formatDate(value = '') {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  return match ? `${match[3]}/${match[2]}/${match[1]}` : 'Sin fecha';
}

function dateOnly(value = '') {
  return String(value).slice(0, 10);
}

function timeOptions(max, selected = '') {
  return Array.from({ length: max }, (_, index) => String(index).padStart(2, '0'))
    .map((value) => `<option value="${value}" ${value === selected ? 'selected' : ''}>${value}</option>`).join('');
}

function splitTime(value = '') {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(String(value));
  return { hour: match?.[1] ?? '00', minute: match?.[2] ?? '00' };
}

function activityDate(activity) {
  return dateOnly(activity?.date || '');
}

function sessionName(session) {
  return String(session?.name || '').trim() || 'Sesión de entrenamiento';
}

function sourcePanel() {
  let panel = $('#attendance-source-panel');
  if (panel) return panel;
  const section = $('#asistencia');
  const head = section?.querySelector('.section-head');
  if (!section || !head) return null;
  panel = document.createElement('article');
  panel.id = 'attendance-source-panel';
  panel.className = 'panel attendance-source-panel';
  head.insertAdjacentElement('afterend', panel);
  return panel;
}

async function snapshot() {
  const [matches, trainings, settings, callups, players] = await Promise.all([
    getAll('matches'), getAll('trainings'), getAll('settings'), getAll('callups'), getAll('players'),
  ]);
  return {
    matches,
    trainings,
    sessions: settings.filter((item) => item?.recordType === 'trainingSession'),
    callups,
    players: [...players].sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'es', { sensitivity: 'base' })),
  };
}

function attendanceForMatch(trainings, matchId) {
  return trainings.find((record) => record?.kind === 'match' && record.matchId === matchId);
}

function attendanceForSession(trainings, sessionId) {
  return trainings.find((record) => record?.sessionId === sessionId);
}

function activityRows(data) {
  const callupIds = new Set(data.callups.map((item) => item.id));
  const rows = [
    ...data.sessions.map((session) => ({
      source: 'session', id: session.id, date: activityDate(session), title: sessionName(session),
      subtitle: `${session.blocks?.length || 0} ejercicios · ${Number(session.totalDuration) || 0} min`,
      attendance: attendanceForSession(data.trainings, session.id), ready: true,
    })),
    ...data.matches.map((match) => ({
      source: 'match', id: match.id, date: activityDate(match), title: `Partido · ${String(match.opponent || 'Sin rival')}`,
      subtitle: match.location ? String(match.location) : (match.type === 'league' ? 'Liga' : match.type === 'friendly' ? 'Amistoso' : 'Partido'),
      attendance: attendanceForMatch(data.trainings, match.id), ready: Boolean(match.callupId && callupIds.has(match.callupId)),
    })),
  ];
  return rows.sort((a, b) => String(b.date).localeCompare(String(a.date)) || a.title.localeCompare(b.title, 'es'));
}

async function renderSources() {
  const panel = sourcePanel();
  if (!panel || rendering) return;
  rendering = true;
  try {
    const data = await snapshot();
    if (!panel.isConnected) return;
    const rows = activityRows(data);
    panel.innerHTML = `
      <div class="attendance-source-head">
        <div><h3>Actividades creadas</h3><p class="meta">Pasa asistencia sobre las sesiones y partidos que ya existen. No tienes que crearlos otra vez.</p></div>
      </div>
      <div class="attendance-source-list">
        ${rows.length ? rows.map((row) => `
          <div class="attendance-source-row">
            <div class="attendance-source-info">
              <div><span class="pill ${row.source === 'match' ? 'accent' : ''}">${row.source === 'match' ? 'Partido' : 'Sesión'}</span>${row.attendance ? '<span class="pill ok">Asistencia registrada</span>' : '<span class="pill">Pendiente</span>'}</div>
              <strong>${esc(row.title)}</strong>
              <span class="meta">${esc(formatDate(row.date))}${row.subtitle ? ` · ${esc(row.subtitle)}` : ''}</span>
            </div>
            ${row.source === 'match' && !row.ready
              ? '<button type="button" class="secondary compact" disabled title="El partido necesita una convocatoria para pasar asistencia">Falta convocatoria</button>'
              : `<button type="button" class="${row.attendance ? 'secondary' : 'primary'} compact" data-linked-${row.source}="${esc(row.id)}" data-attendance-id="${esc(row.attendance?.id || '')}">${row.attendance ? 'Editar asistencia' : 'Pasar asistencia'}</button>`}
          </div>`).join('') : '<p class="empty">Todavía no hay sesiones ni partidos creados.</p>'}
      </div>`;
    decorateExistingAttendance(data);
  } catch (error) {
    panel.innerHTML = `<p class="error">No se pudieron cargar las actividades para asistencia: ${esc(error?.message || 'error desconocido')}</p>`;
  } finally {
    rendering = false;
  }
}

function decorateExistingAttendance(data) {
  const sessionsById = new Map(data.sessions.map((session) => [session.id, session]));
  const recordsById = new Map(data.trainings.map((record) => [record.id, record]));
  $$('.edit-attendance[data-id]').forEach((button) => {
    const record = recordsById.get(button.dataset.id);
    if (!record?.sessionId) return;
    const session = sessionsById.get(record.sessionId);
    if (!session) return;
    const card = button.closest('.panel');
    const title = card?.querySelector('.section-head h3');
    const pill = card?.querySelector('.section-head .pill');
    const wantedTitle = sessionName(session);
    if (title && title.textContent !== wantedTitle) title.textContent = wantedTitle;
    if (pill && pill.textContent !== 'Sesión') pill.textContent = 'Sesión';
  });
}

function scheduleRender() {
  if (renderQueued) return;
  renderQueued = true;
  window.setTimeout(() => {
    renderQueued = false;
    renderSources();
  }, 50);
}

async function cleanupOrphanSessionAttendance() {
  const [settings, trainings] = await Promise.all([getAll('settings'), getAll('trainings')]);
  const sessionIds = new Set(settings.filter((item) => item?.recordType === 'trainingSession').map((item) => item.id));
  const orphans = trainings.filter((record) => record?.sessionId && !sessionIds.has(record.sessionId));
  for (const record of orphans) await remove('trainings', record.id);
  if (orphans.length) scheduleRender();
  return orphans.length;
}

function scheduleCleanup() {
  if (cleanupQueued) return;
  cleanupQueued = true;
  window.setTimeout(() => {
    cleanupQueued = false;
    cleanupOrphanSessionAttendance().catch((error) => console.warn('No se pudo limpiar una asistencia huérfana:', error));
  }, 150);
}

function statusRow(player, entry = {}) {
  const status = ['present', 'late', 'absent'].includes(entry.status) ? entry.status : 'present';
  const { hour, minute } = splitTime(entry.arrivalTime || '');
  return `<div class="check-row attendance-row">
    <strong>${esc(player.name || 'Jugador')}</strong>
    <select name="status-${esc(player.id)}" aria-label="Estado de ${esc(player.name)}">
      <option value="present" ${status === 'present' ? 'selected' : ''}>Presente</option>
      <option value="late" ${status === 'late' ? 'selected' : ''}>Tarde</option>
      <option value="absent" ${status === 'absent' ? 'selected' : ''}>Ausente</option>
    </select>
    <div class="arrival-time ${status === 'late' ? '' : 'hidden'}"><span>Hora de llegada</span><div class="time-24"><select name="arrivalHour-${esc(player.id)}">${timeOptions(24, hour)}</select><span>:</span><select name="arrivalMinute-${esc(player.id)}">${timeOptions(60, minute)}</select></div></div>
    <input name="note-${esc(player.id)}" value="${esc(entry.note || '')}" maxlength="200" placeholder="Incidencia o comentario" aria-label="Nota de ${esc(player.name)}">
  </div>`;
}

async function openSessionAttendance(sessionId) {
  const data = await snapshot();
  const session = data.sessions.find((item) => item.id === sessionId);
  if (!session) return showToast('La sesión ya no está disponible.');
  const existing = attendanceForSession(data.trainings, sessionId);
  const byPlayer = new Map((existing?.attendance || []).map((entry) => [entry.playerId, entry]));
  const root = $('#training-builder');
  if (!root) return;

  root.classList.remove('hidden');
  root.innerHTML = `<form id="training-form" data-linked-session="${esc(sessionId)}">
    <input type="hidden" name="id" value="${esc(existing?.id || '')}">
    <div class="attendance-linked-origin panel">
      <span class="pill">Sesión</span><strong>${esc(sessionName(session))}</strong><span class="meta">${esc(formatDate(session.date))} · ${session.blocks?.length || 0} ejercicios · ${Number(session.totalDuration) || 0} min</span>
    </div>
    <div class="check-list">${data.players.map((player) => statusRow(player, byPlayer.get(player.id))).join('')}</div>
    <label>Notas del registro<textarea name="notes" maxlength="1000">${esc(existing?.notes || '')}</textarea></label>
    <div class="button-row"><button class="primary" type="submit">Guardar asistencia</button><button type="button" class="secondary cancel-training">Cancelar</button></div>
  </form>`;
  root.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function saveSessionAttendance(form) {
  const sessionId = form.dataset.linkedSession;
  const data = await snapshot();
  const session = data.sessions.find((item) => item.id === sessionId);
  if (!session) throw new Error('La sesión ya no está disponible.');
  const existing = attendanceForSession(data.trainings, sessionId);
  const attendance = data.players.map((player) => {
    const status = form.elements[`status-${player.id}`]?.value || 'present';
    if (!['present', 'late', 'absent'].includes(status)) throw new Error('Hay un estado de asistencia no válido.');
    const hour = form.elements[`arrivalHour-${player.id}`]?.value || '00';
    const minute = form.elements[`arrivalMinute-${player.id}`]?.value || '00';
    return {
      playerId: player.id,
      status,
      arrivalTime: status === 'late' ? `${hour}:${minute}` : '',
      note: String(form.elements[`note-${player.id}`]?.value || '').trim(),
    };
  });
  const record = {
    ...(existing || {}),
    id: existing?.id || crypto.randomUUID(),
    kind: 'training',
    matchId: null,
    sessionId,
    date: dateOnly(session.date),
    notes: String(form.elements.notes?.value || '').trim(),
    attendance,
    createdAt: existing?.createdAt || Date.now(),
  };
  await put('trainings', record);
  $('#training-builder')?.classList.add('hidden');
  await renderSources();
  // Reutiliza la sincronización existente de CampoBase para actualizar estadísticas sin recarga manual.
  window.dispatchEvent(new Event('online'));
  showToast('Asistencia de la sesión guardada.');
}

function openMatchAttendance(matchId, attendanceId = '') {
  if (attendanceId) {
    const edit = $$('.edit-attendance[data-id]').find((button) => button.dataset.id === attendanceId);
    if (edit) { edit.click(); return; }
  }
  $('#new-training')?.click();
  window.setTimeout(() => {
    let form = $('#training-form');
    if (!form) return;
    form.elements.kind.value = 'match';
    form.elements.kind.dispatchEvent(new Event('input', { bubbles: true }));
    window.setTimeout(() => {
      form = $('#training-form');
      if (!form?.elements.matchId) return;
      form.elements.matchId.value = matchId;
      form.elements.matchId.dispatchEvent(new Event('input', { bubbles: true }));
    }, 0);
  }, 0);
}

function showToast(message) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function installStyles() {
  if ($('#attendance-linked-styles')) return;
  const style = document.createElement('style');
  style.id = 'attendance-linked-styles';
  style.textContent = `
    .attendance-source-panel{margin-bottom:1rem}
    .attendance-source-head{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}
    .attendance-source-list{display:grid;gap:.55rem;margin-top:.8rem;max-height:430px;overflow:auto}
    .attendance-source-row{display:flex;align-items:center;justify-content:space-between;gap:.8rem;padding:.7rem;border:1px solid var(--line);border-radius:12px;background:var(--card)}
    .attendance-source-info{display:grid;gap:.2rem;min-width:0}
    .attendance-source-info>div{display:flex;gap:.35rem;flex-wrap:wrap}
    .attendance-source-info strong,.attendance-source-info span{overflow-wrap:anywhere}
    .attendance-linked-origin{display:grid;gap:.25rem;box-shadow:none}
    @media(max-width:650px){.attendance-source-row{align-items:stretch;flex-direction:column}.attendance-source-row>button{width:100%}}
  `;
  document.head.appendChild(style);
}

function install() {
  installStyles();
  sourcePanel();
  scheduleRender();
  scheduleCleanup();

  const stats = $('#attendance-stats');
  const list = $('#trainings-list');
  const sessions = $('#sessions-list');
  if (stats) new MutationObserver(scheduleRender).observe(stats, { childList: true, subtree: false });
  // Solo observamos el reemplazo de la lista. No los cambios de texto internos para evitar bucles.
  if (list) new MutationObserver(scheduleRender).observe(list, { childList: true, subtree: false });
  if (sessions) new MutationObserver(() => { scheduleCleanup(); scheduleRender(); }).observe(sessions, { childList: true, subtree: false });

  document.addEventListener('click', (event) => {
    const sessionButton = event.target.closest('[data-linked-session]');
    if (sessionButton && !sessionButton.closest('#training-form')) {
      event.preventDefault();
      openSessionAttendance(sessionButton.dataset.linkedSession).catch((error) => showToast(error.message));
      return;
    }
    const matchButton = event.target.closest('[data-linked-match]');
    if (matchButton) {
      event.preventDefault();
      openMatchAttendance(matchButton.dataset.linkedMatch, matchButton.dataset.attendanceId || '');
    }
  }, true);

  document.addEventListener('input', (event) => {
    const form = event.target.closest('#training-form[data-linked-session]');
    if (!form || !event.target.name?.startsWith('status-')) return;
    const row = event.target.closest('.attendance-row');
    const arrival = row?.querySelector('.arrival-time');
    arrival?.classList.toggle('hidden', event.target.value !== 'late');
  }, true);

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('#training-form[data-linked-session]');
    if (!form) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    saveSessionAttendance(form).catch((error) => showToast(error.message || 'No se pudo guardar la asistencia.'));
  }, true);

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-view="asistencia"]')) scheduleRender();
    if (event.target.closest('.delete-session')) scheduleCleanup();
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
}
