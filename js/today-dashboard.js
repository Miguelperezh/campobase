// Inicio "Hoy" de CampoBase.
// Resume sesiones, partidos y tareas pendientes sin crear ni modificar datos.

import { getAll } from './db.js';

const $ = (selector, root = document) => root.querySelector(selector);
const esc = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

let renderQueued = false;
let rendering = false;
let retryTimer = 0;

export function localDayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dateOnly(value = '') { return String(value).slice(0, 10); }

function formatDay(value = '') {
  const day = dateOnly(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
    .format(new Date(`${day}T12:00:00`)).replace('.', '');
}

function formatLongToday(now = new Date()) {
  return new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(now);
}

function formatMatchTime(value = '') {
  const match = /T(\d{2}):(\d{2})/.exec(String(value));
  return match ? `${match[1]}:${match[2]}` : '';
}

function sessionMinutes(session) {
  const blocks = Array.isArray(session?.blocks) ? session.blocks : [];
  const total = blocks.reduce((sum, block) => sum + (Number(block?.duration) || 0), 0);
  return total || Number(session?.totalDuration) || Number(session?.targetDuration) || 0;
}

function sessionTitle(session) { return String(session?.name || '').trim() || 'Sesión de entrenamiento'; }
function matchType(match) {
  if (match?.type === 'friendly') return 'Amistoso';
  if (match?.type === 'tournament') return 'Torneo';
  return 'Liga';
}

function attendanceForSession(trainings, sessionId) {
  return trainings.find((record) => record?.sessionId === sessionId);
}

function attendanceForMatch(trainings, matchId) {
  return trainings.find((record) => record?.kind === 'match' && record?.matchId === matchId);
}

function callupForMatch(callups, match) {
  return callups.find((callup) => callup?.id === match?.callupId || callup?.matchId === match?.id);
}

export function buildTodaySummary({ sessions = [], matches = [], trainings = [], callups = [], now = new Date() } = {}) {
  const today = localDayKey(now);
  const usableSessions = sessions.filter((session) => /^\d{4}-\d{2}-\d{2}/.test(String(session?.date || '')));
  const usableMatches = matches.filter((match) => /^\d{4}-\d{2}-\d{2}/.test(String(match?.date || '')));

  const todaySessions = usableSessions.filter((session) => dateOnly(session.date) === today);
  const todayMatches = usableMatches.filter((match) => dateOnly(match.date) === today);

  const nextSession = [...usableSessions]
    .filter((session) => dateOnly(session.date) >= today)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))[0] || null;

  const nextMatch = [...usableMatches]
    .filter((match) => match?.status !== 'finished' && dateOnly(match.date) >= today)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))[0] || null;

  const attendancePending = [
    ...usableSessions.filter((session) => dateOnly(session.date) <= today && !attendanceForSession(trainings, session.id))
      .map((session) => ({ kind: 'session', id: session.id, date: session.date, title: sessionTitle(session) })),
    ...usableMatches.filter((match) => dateOnly(match.date) <= today && !attendanceForMatch(trainings, match.id))
      .map((match) => ({ kind: 'match', id: match.id, date: match.date, title: match.opponent || 'Partido' })),
  ].sort((a, b) => String(b.date).localeCompare(String(a.date)));

  const callupPending = usableMatches
    .filter((match) => match?.status !== 'finished' && dateOnly(match.date) >= today && !callupForMatch(callups, match))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));

  return { today, todaySessions, todayMatches, nextSession, nextMatch, attendancePending, callupPending };
}

function ensureShell() {
  const main = $('#app');
  const plantilla = $('#plantilla');
  const nav = $('.bottom-nav');
  if (!main || !plantilla || !nav) return null;

  let section = $('#hoy');
  if (!section) {
    section = document.createElement('section');
    section.id = 'hoy';
    section.className = 'view active';
    section.setAttribute('aria-labelledby', 'title-hoy');
    section.innerHTML = `
      <div class="section-head today-section-head">
        <div><p class="eyebrow">Resumen del equipo</p><h2 id="title-hoy">Hoy</h2></div>
        <button type="button" class="secondary today-refresh">Actualizar</button>
      </div>
      <div id="today-dashboard"><div class="panel empty">Cargando el día…</div></div>`;
    main.insertBefore(section, plantilla);
  }

  let navButton = nav.querySelector('[data-view="hoy"]');
  if (!navButton) {
    navButton = document.createElement('button');
    navButton.type = 'button';
    navButton.dataset.view = 'hoy';
    navButton.textContent = 'Hoy';
    nav.insertBefore(navButton, nav.firstElementChild);
  }

  if (plantilla.classList.contains('active')) {
    plantilla.classList.remove('active');
    section.classList.add('active');
    nav.querySelectorAll('button').forEach((button) => button.classList.toggle('active', button === navButton));
  }

  installStyles();
  return section;
}

function installStyles() {
  if ($('#today-dashboard-styles')) return;
  const style = document.createElement('style');
  style.id = 'today-dashboard-styles';
  style.textContent = `
    #hoy{max-width:1100px;margin:0 auto}.today-section-head{margin-bottom:1rem}
    .today-hero{background:var(--brand);color:#fff;border:0;display:grid;grid-template-columns:1fr auto;gap:1rem;align-items:center;padding:clamp(1.2rem,3vw,2rem)}
    .today-hero .eyebrow,.today-hero .meta{color:#f5dfe4}.today-hero h3{font-size:clamp(1.7rem,5vw,2.7rem);margin:.1rem 0 .35rem;text-transform:capitalize}.today-hero-counts{display:flex;gap:.55rem;flex-wrap:wrap;justify-content:flex-end}
    .today-count{min-width:92px;padding:.75rem .9rem;border-radius:14px;background:#ffffff18;border:1px solid #ffffff38;text-align:center}.today-count strong{display:block;font-size:1.6rem;line-height:1}.today-count span{font-size:.72rem}
    .today-layout{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(270px,.75fr);gap:1rem;margin-top:1rem;align-items:start}.today-main,.today-side{display:grid;gap:1rem}.today-title-row{display:flex;align-items:center;justify-content:space-between;gap:.7rem;margin-bottom:.75rem}.today-title-row h3{margin:0}.today-event-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:.75rem}
    .today-event{box-shadow:none;position:relative;overflow:hidden}.today-event.match{border-top:5px solid var(--brand)}.today-event.session{border-top:5px solid var(--accent)}.today-event h3{font-size:1.2rem;margin:.45rem 0}.today-event-meta{display:grid;gap:.3rem;margin:.7rem 0}.today-event-meta span{font-size:.84rem;color:var(--muted)}.today-event .button-row{margin-top:.75rem}
    .today-status-row{display:flex;gap:.4rem;flex-wrap:wrap}.today-ok{background:#dcfce7;color:#166534}.today-warning{background:#fff0d8;color:#704600}.today-pending-list{display:grid;gap:.55rem}.today-pending{display:grid;grid-template-columns:1fr auto;gap:.7rem;align-items:center;padding:.72rem;border:1px solid var(--line);border-radius:12px;background:#faf9f6}.today-pending strong{display:block}.today-pending small{color:var(--muted)}
    .today-quick{display:grid;grid-template-columns:1fr 1fr;gap:.55rem}.today-quick button{min-height:54px;text-align:left}.today-empty{padding:1.2rem;background:#faf9f6;border:1px dashed var(--line);border-radius:14px;color:var(--muted)}
    @media(max-width:760px){.today-hero{grid-template-columns:1fr}.today-hero-counts{justify-content:flex-start}.today-layout{grid-template-columns:1fr}.today-count{min-width:78px}.today-quick{grid-template-columns:1fr 1fr}.today-event-grid{grid-template-columns:1fr}}
  `;
  document.head.append(style);
}

async function snapshot() {
  const [matches, trainings, settings, callups] = await Promise.all([
    getAll('matches'), getAll('trainings'), getAll('settings'), getAll('callups'),
  ]);
  return {
    matches,
    trainings,
    callups,
    sessions: settings.filter((item) => item?.recordType === 'trainingSession'),
  };
}

function goButton(view, label, primary = false) {
  return `<button type="button" class="${primary ? 'primary' : 'secondary'}" data-today-view="${esc(view)}">${esc(label)}</button>`;
}

function sessionCard(session, trainings, today) {
  const attendance = attendanceForSession(trainings, session.id);
  const isToday = dateOnly(session.date) === today;
  const blocks = Array.isArray(session.blocks) ? session.blocks.length : 0;
  return `<article class="panel today-event session">
    <div class="today-status-row"><span class="pill accent">${isToday ? 'HOY' : esc(formatDay(session.date))}</span><span class="pill">Entrenamiento</span>${attendance ? '<span class="pill today-ok">Asistencia hecha</span>' : '<span class="pill today-warning">Asistencia pendiente</span>'}</div>
    <h3>${esc(sessionTitle(session))}</h3>
    <div class="today-event-meta"><span><strong>${sessionMinutes(session)} min</strong> · ${blocks} ${blocks === 1 ? 'ejercicio' : 'ejercicios'}</span>${session.material ? `<span>Material: ${esc(session.material)}</span>` : ''}</div>
    <div class="button-row">${goButton('sesiones', 'Ver sesión', true)}${goButton('asistencia', attendance ? 'Ver asistencia' : 'Pasar asistencia')}</div>
  </article>`;
}

function matchCard(match, trainings, callups, today) {
  const attendance = attendanceForMatch(trainings, match.id);
  const callup = callupForMatch(callups, match);
  const isToday = dateOnly(match.date) === today;
  const time = formatMatchTime(match.date);
  const venue = match.venue === 'away' ? 'Fuera' : 'Casa';
  return `<article class="panel today-event match">
    <div class="today-status-row"><span class="pill accent">${isToday ? 'HOY' : esc(formatDay(match.date))}</span><span class="pill type-${esc(match.type || 'league')}">${esc(matchType(match))}</span>${callup ? '<span class="pill today-ok">Convocatoria lista</span>' : '<span class="pill today-warning">Falta convocatoria</span>'}</div>
    <h3>${esc(match.opponent || 'Partido')}</h3>
    <div class="today-event-meta"><span><strong>${time || 'Hora pendiente'}</strong> · ${venue}</span>${match.location ? `<span>${esc(match.location)}</span>` : ''}${attendance ? '<span>Asistencia registrada</span>' : '<span>Asistencia pendiente</span>'}</div>
    <div class="button-row">${goButton('calendario', 'Ver partido', true)}${callup ? goButton('convocatorias', 'Ver convocatoria') : goButton('convocatorias', 'Crear convocatoria')}</div>
  </article>`;
}

function pendingPanel(summary) {
  const attendanceRows = summary.attendancePending.slice(0, 3).map((item) => `<div class="today-pending"><div><strong>Asistencia pendiente</strong><small>${esc(item.title)} · ${esc(formatDay(item.date))}</small></div>${goButton('asistencia', 'Abrir')}</div>`).join('');
  const callupRows = summary.callupPending.slice(0, 3).map((match) => `<div class="today-pending"><div><strong>Falta convocatoria</strong><small>${esc(match.opponent || 'Partido')} · ${esc(formatDay(match.date))}${formatMatchTime(match.date) ? ` · ${esc(formatMatchTime(match.date))}` : ''}</small></div>${goButton('convocatorias', 'Abrir')}</div>`).join('');
  const rows = `${callupRows}${attendanceRows}`;
  return `<article class="panel"><div class="today-title-row"><h3>Pendiente de hacer</h3><span class="pill ${rows ? 'today-warning' : 'today-ok'}">${summary.callupPending.length + summary.attendancePending.length}</span></div>${rows ? `<div class="today-pending-list">${rows}</div>` : '<div class="today-empty">No tienes tareas pendientes detectadas.</div>'}</article>`;
}

function nextPanel(summary, data) {
  const items = [];
  if (summary.nextSession && dateOnly(summary.nextSession.date) !== summary.today) items.push(sessionCard(summary.nextSession, data.trainings, summary.today));
  if (summary.nextMatch && dateOnly(summary.nextMatch.date) !== summary.today) items.push(matchCard(summary.nextMatch, data.trainings, data.callups, summary.today));
  return `<article class="panel"><div class="today-title-row"><h3>Lo próximo</h3></div>${items.length ? `<div class="today-event-grid">${items.join('')}</div>` : '<div class="today-empty">Lo próximo ya está incluido en las actividades de hoy.</div>'}</article>`;
}

function renderMarkup(summary, data) {
  const todayCards = [
    ...summary.todayMatches.map((match) => matchCard(match, data.trainings, data.callups, summary.today)),
    ...summary.todaySessions.map((session) => sessionCard(session, data.trainings, summary.today)),
  ];
  const pendingCount = summary.callupPending.length + summary.attendancePending.length;
  return `
    <section class="panel today-hero">
      <div><p class="eyebrow">Tu equipo de un vistazo</p><h3>${esc(formatLongToday())}</h3><p class="meta">Lo importante para hoy y lo siguiente, sin entrar pestaña por pestaña.</p></div>
      <div class="today-hero-counts"><div class="today-count"><strong>${summary.todaySessions.length}</strong><span>sesiones hoy</span></div><div class="today-count"><strong>${summary.todayMatches.length}</strong><span>partidos hoy</span></div><div class="today-count"><strong>${pendingCount}</strong><span>pendientes</span></div></div>
    </section>
    <div class="today-layout">
      <div class="today-main">
        <article class="panel"><div class="today-title-row"><h3>Tu día</h3><span class="pill accent">${summary.todayMatches.length + summary.todaySessions.length} actividades</span></div>${todayCards.length ? `<div class="today-event-grid">${todayCards.join('')}</div>` : '<div class="today-empty">Hoy no tienes sesión ni partido creado.</div>'}</article>
        ${nextPanel(summary, data)}
      </div>
      <aside class="today-side">
        ${pendingPanel(summary)}
        <article class="panel"><div class="today-title-row"><h3>Accesos rápidos</h3></div><div class="today-quick">${goButton('sesiones', 'Sesiones')}${goButton('asistencia', 'Asistencia')}${goButton('calendario', 'Calendario')}${goButton('convocatorias', 'Convocatoria')}</div></article>
      </aside>
    </div>`;
}

export async function renderTodayDashboard() {
  const section = ensureShell();
  const root = $('#today-dashboard');
  if (!section || !root || rendering) return;
  rendering = true;
  try {
    const data = await snapshot();
    const summary = buildTodaySummary({ ...data, now: new Date() });
    root.innerHTML = renderMarkup(summary, data);
    window.clearTimeout(retryTimer);
  } catch (error) {
    root.innerHTML = '<div class="panel empty">Preparando el resumen de hoy…</div>';
    window.clearTimeout(retryTimer);
    retryTimer = window.setTimeout(() => scheduleRender(), 500);
  } finally {
    rendering = false;
  }
}

function scheduleRender() {
  if (renderQueued) return;
  renderQueued = true;
  window.setTimeout(() => {
    renderQueued = false;
    if ($('#hoy')?.classList.contains('active')) renderTodayDashboard();
  }, 50);
}

function bind() {
  const section = ensureShell();
  if (!section) return;

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-today-view], .today-refresh');
    if (!target) return;
    if (target.matches('.today-refresh')) return void scheduleRender();
    const view = target.dataset.todayView;
    document.querySelector(`.bottom-nav button[data-view="${view}"]`)?.click();
  });

  const observer = new MutationObserver(() => {
    if (section.classList.contains('active')) scheduleRender();
  });
  observer.observe(section, { attributes: true, attributeFilter: ['class'] });

  window.addEventListener('load', () => scheduleRender(), { once: true });
  window.setTimeout(() => scheduleRender(), 250);
  window.setInterval(() => {
    if (section.classList.contains('active') && !document.querySelector('dialog[open]')) scheduleRender();
  }, 30000);
}

if (typeof document !== 'undefined') bind();
