import { getAll } from './db.js';
import { EJERCICIOS_VALIDADOS } from './ejercicios-validados.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = (value = '') => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const state = {
  players: [],
  callups: [],
  matches: [],
  sessions: [],
  settings: {},
  exercises: EJERCICIOS_VALIDADOS,
  exerciseFilter: 'Todos',
  previewDraft: null,
  deletedDraft: null,
  wizard: { step: 1, values: {}, selectedIds: [] },
  field: null,
  timerId: null,
  toastTimer: null,
};

function localDayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDateTime(day, time = '12:00') {
  const cleanDay = String(day || '').slice(0, 10);
  const cleanTime = /^([01]\d|2[0-3]):[0-5]\d$/.test(String(time || '')) ? time : '12:00';
  const [y, m, d] = cleanDay.split('-').map(Number);
  const [hh, mm] = cleanTime.split(':').map(Number);
  if (![y, m, d, hh, mm].every(Number.isFinite)) return null;
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

function dateLabel(value, withTime = false) {
  if (!value) return 'Sin fecha';
  const source = value.includes('T') ? new Date(value) : new Date(`${value}T12:00:00`);
  if (Number.isNaN(source.getTime())) return value;
  return new Intl.DateTimeFormat('es-ES', withTime
    ? { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }
    : { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }).format(source);
}

function dayRelation(day) {
  const key = String(day || '').slice(0, 10);
  const today = localDayKey();
  const tomorrow = localDayKey(new Date(Date.now() + 86400000));
  if (key === today) return 'Hoy';
  if (key === tomorrow) return 'Mañana';
  return dateLabel(key);
}

function sessionDuration(session) {
  const blocks = Array.isArray(session?.blocks) ? session.blocks : [];
  const sum = blocks.reduce((acc, block) => acc + (Number(block?.duration) || 0), 0);
  return sum || Number(session?.totalDuration) || Number(session?.targetDuration) || 0;
}

function sessionEnd(session) {
  const start = parseDateTime(session?.date, session?.time || '23:59');
  if (!start) return null;
  return new Date(start.getTime() + Math.max(1, sessionDuration(session) || 60) * 60000);
}

function sessionCompleted(session, now = new Date()) {
  const day = String(session?.date || '').slice(0, 10);
  if (!day) return false;
  if (day < localDayKey(now)) return true;
  if (day > localDayKey(now)) return false;
  if (!session?.time) return false;
  const end = sessionEnd(session);
  return Boolean(end && now >= end);
}

function matchCompleted(match) {
  return match?.status === 'finished' || (Number.isFinite(Number(match?.goalsFor)) && Number.isFinite(Number(match?.goalsAgainst)) && match?.status !== 'planned');
}

function matchDay(match) { return String(match?.date || '').slice(0, 10); }
function matchTime(match) { return String(match?.date || '').includes('T') ? String(match.date).split('T')[1].slice(0, 5) : ''; }

function exerciseById(id) {
  return state.exercises.find((exercise) => String(exercise.id) === String(id)) || null;
}

function exerciseName(id) {
  return exerciseById(id)?.nombre || 'Ejercicio';
}

function formatDuration(value) {
  if (!value) return '';
  if (typeof value === 'object') {
    const raw = value.valor ?? value.minutos ?? '';
    return raw ? `${raw} min` : '';
  }
  const text = String(value).trim();
  if (!text) return '';
  return /^\d+$/.test(text) ? `${text} min` : text;
}

function exerciseFacts(ex, block = null) {
  const dr = ex?.datos_rapidos || {};
  const material = dr.material || (Array.isArray(ex?.materiales) ? ex.materiales.map((item) => `${item.cantidad ? `${item.cantidad}× ` : ''}${item.nombre}`).join(', ') : '');
  const duration = block?.duration ? `${block.duration} min` : formatDuration(dr.duracion || ex?.duracion || ex?.duration || (ex?.duracion_min ? `${ex.duracion_min} min` : ''));
  return [
    ['Jugadores', dr.jugadores || '—'],
    ['Duración', duration || '—'],
    ['Espacio', dr.espacio || ex?.montaje?.dimensiones || '—'],
    ['Material', material || '—'],
  ];
}

function exerciseSearchText(ex) {
  return [ex?.nombre, ex?.categoria, ...(ex?.etiquetas || []), ...(ex?.que_se_trabaja || []), ex?.objetivo_principal]
    .filter(Boolean).join(' ').toLocaleLowerCase('es');
}

function isFilterMatch(ex, filter) {
  if (filter === 'Todos') return true;
  const text = exerciseSearchText(ex);
  const aliases = {
    Calentamiento: ['calentamiento', 'activación', 'activacion'],
    Posesión: ['posesión', 'posesion', 'rondo', 'conservación', 'conservacion'],
    Finalización: ['finalización', 'finalizacion', 'tiro', 'remate'],
    Defensa: ['defensa', 'defensivo', 'presión', 'presion', 'repliegue'],
    Portero: ['portero', 'portería', 'porteria'],
  };
  return (aliases[filter] || [filter.toLocaleLowerCase('es')]).some((word) => text.includes(word));
}

function statusPill(text, cls) {
  return `<span class="campo-status ${cls}">${esc(text)}</span>`;
}

function menuMarkup(kind, id) {
  return `<div class="campo-menu-wrap">
    <button type="button" class="campo-menu-btn" data-menu-toggle aria-label="Más acciones">•••</button>
    <div class="campo-menu">
      <button type="button" data-whatsapp>📱 WhatsApp actual</button>
      <a href="./index.html" target="_blank" rel="noopener">Abrir CampoBase normal</a>
      ${kind === 'session' ? `<button type="button" data-session-exercises="${esc(id)}">Ver ejercicios</button>` : ''}
    </div>
  </div>`;
}

function sessionCard(session, { completed = false, preview = false } = {}) {
  const relation = dayRelation(session.date);
  const status = preview ? statusPill('Prueba', 'pending') : completed ? statusPill('Realizada', 'done') : relation === 'Hoy' ? statusPill('Hoy', 'today') : statusPill('Próxima', 'next');
  const blocks = Array.isArray(session.blocks) ? session.blocks : [];
  return `<article class="campo-card" data-session-id="${esc(session.id)}">
    <div class="campo-card-head">
      <div class="campo-card-main">
        ${status}
        <h3>${esc(session.name || 'Sesión de entrenamiento')}</h3>
        <p>${esc(relation)}${session.time ? ` · ${esc(session.time)}` : ''}${session.pitch ? ` · ${esc(session.pitch)}` : ''}</p>
        <div class="campo-meta-row">
          <span class="campo-meta-pill">⏱ ${sessionDuration(session) || session.targetDuration || '—'} min</span>
          <span class="campo-meta-pill">⚽ ${blocks.length} ejercicios</span>
          ${session.material ? `<span class="campo-meta-pill">📦 ${esc(session.material)}</span>` : ''}
        </div>
      </div>
      ${preview ? '' : menuMarkup('session', session.id)}
    </div>
    <div class="campo-card-actions">
      <button type="button" class="campo-btn primary big" data-start-session="${esc(session.id)}" ${blocks.length ? '' : 'disabled'}>▶ Entrenar ahora</button>
      ${preview ? `<button type="button" class="campo-btn danger" data-delete-preview-draft>Borrar borrador</button>` : `<button type="button" class="campo-btn secondary" data-whatsapp>📱 WhatsApp</button>`}
    </div>
  </article>`;
}

function matchCard(match, { completed = false } = {}) {
  const relation = dayRelation(matchDay(match));
  const status = completed ? statusPill('Jugado', 'done') : relation === 'Hoy' ? statusPill('Hoy', 'today') : statusPill('Próximo', 'next');
  const type = match.type === 'friendly' ? 'Amistoso' : match.type === 'tournament' ? 'Torneo' : 'Liga';
  return `<article class="campo-card" data-match-id="${esc(match.id)}">
    <div class="campo-card-head">
      <div class="campo-card-main">
        ${status}
        <h3>${esc(match.opponent || 'Rival')}</h3>
        <p>${esc(relation)}${matchTime(match) ? ` · ${esc(matchTime(match))}` : ''}${match.location ? ` · ${esc(match.location)}` : ''}</p>
        <div class="campo-meta-row">
          <span class="campo-meta-pill">🏆 ${type}</span>
          <span class="campo-meta-pill">${match.venue === 'away' ? '✈ Fuera' : '🏠 Casa'}</span>
          ${completed ? `<span class="campo-meta-pill">⚽ ${Number(match.goalsFor) || 0}–${Number(match.goalsAgainst) || 0}</span>` : ''}
        </div>
      </div>
      ${menuMarkup('match', match.id)}
    </div>
    <div class="campo-card-actions">
      ${completed ? `<button type="button" class="campo-btn secondary big" data-start-match="${esc(match.id)}">Ver modo partido</button>` : `<button type="button" class="campo-btn primary big" data-start-match="${esc(match.id)}">▶ Partido ahora</button>`}
      <button type="button" class="campo-btn secondary" data-whatsapp>📱 WhatsApp</button>
    </div>
  </article>`;
}

function exerciseCard(ex) {
  const media = ex.media || {};
  const preview = media.preview || ex.animacion?.preview || '';
  const facts = exerciseFacts(ex);
  return `<article class="campo-card" data-exercise-card="${esc(ex.id)}">
    <div class="exercise-thumb">${preview ? `<img src="${esc(preview)}" alt="${esc(ex.nombre || 'Ejercicio')}" loading="lazy">` : '⚽ CampoBase'}</div>
    ${statusPill(ex.categoria || 'Ejercicio', 'next')}
    <h3>${esc(ex.nombre || 'Ejercicio')}</h3>
    <div class="campo-meta-row">
      <span class="campo-meta-pill">👥 ${esc(facts[0][1])}</span>
      <span class="campo-meta-pill">⏱ ${esc(facts[1][1])}</span>
      <span class="campo-meta-pill">📐 ${esc(facts[2][1])}</span>
    </div>
    <div class="campo-card-actions">
      <button type="button" class="campo-btn primary" data-open-exercise="${esc(ex.id)}">Ver ejercicio</button>
    </div>
  </article>`;
}

function sortedUpcomingSessions() {
  return state.sessions.filter((session) => !sessionCompleted(session)).sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')) || String(a.time || '').localeCompare(String(b.time || '')));
}

function sortedCompletedSessions() {
  return state.sessions.filter(sessionCompleted).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || String(b.time || '').localeCompare(String(a.time || '')));
}

function sortedUpcomingMatches() {
  return state.matches.filter((match) => !matchCompleted(match)).sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
}

function sortedCompletedMatches() {
  return state.matches.filter(matchCompleted).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
}

function renderHoy() {
  const sessions = sortedUpcomingSessions();
  const matches = sortedUpcomingMatches();
  const today = localDayKey();
  const todaySession = sessions.find((session) => String(session.date || '').slice(0, 10) === today);
  const todayMatch = matches.find((match) => matchDay(match) === today);
  const nextSession = todaySession || sessions[0] || null;
  const nextMatch = todayMatch || matches[0] || null;

  let heroTitle = 'Todo preparado. Lo importante, primero.';
  let heroText = 'Modo Campo reduce menús, aumenta tamaño y prioriza lo que necesitas durante el entrenamiento o el partido.';
  let heroActions = `<button type="button" class="campo-btn accent big" data-nav-to="entrenos">Ver entrenos</button><button type="button" class="campo-btn ghost big" data-nav-to="partidos">Ver partidos</button>`;

  if (todayMatch) {
    heroTitle = `Partido hoy contra ${todayMatch.opponent || 'el rival'}`;
    heroText = `${matchTime(todayMatch) ? `A las ${matchTime(todayMatch)}. ` : ''}${todayMatch.location || ''}`.trim();
    heroActions = `<button type="button" class="campo-btn accent big" data-start-match="${esc(todayMatch.id)}">▶ Abrir partido</button><button type="button" class="campo-btn ghost big" data-whatsapp>📱 WhatsApp</button>`;
  } else if (todaySession) {
    heroTitle = `Entrenamiento hoy${todaySession.time ? ` a las ${todaySession.time}` : ''}`;
    heroText = `${todaySession.name || 'Sesión preparada'}${todaySession.pitch ? ` · ${todaySession.pitch}` : ''} · ${sessionDuration(todaySession) || todaySession.targetDuration || '—'} min`;
    heroActions = `<button type="button" class="campo-btn accent big" data-start-session="${esc(todaySession.id)}">▶ Empezar entrenamiento</button><button type="button" class="campo-btn ghost big" data-whatsapp>📱 WhatsApp</button>`;
  }

  $('#hoy-content').innerHTML = `
    <section class="campo-hero">
      <p class="campo-kicker">Qué toca ahora</p>
      <h2>${esc(heroTitle)}</h2>
      <p>${esc(heroText)}</p>
      <div class="campo-hero-actions">${heroActions}</div>
    </section>
    <div class="campo-grid">
      <section>
        <div class="campo-section-title"><h3>Próximo entreno</h3><span>${nextSession ? dayRelation(nextSession.date) : 'Sin sesión'}</span></div>
        ${nextSession ? sessionCard(nextSession) : `<div class="campo-card"><h3>Sin entrenamientos próximos</h3><p>La versión estable no se modifica desde esta prueba.</p></div>`}
      </section>
      <section>
        <div class="campo-section-title"><h3>Próximo partido</h3><span>${nextMatch ? dayRelation(matchDay(nextMatch)) : 'Sin partido'}</span></div>
        ${nextMatch ? matchCard(nextMatch) : `<div class="campo-card"><h3>Sin partidos próximos</h3><p>Cuando haya uno aparecerá aquí como acción principal.</p></div>`}
      </section>
    </div>
    <div class="preview-note">Esta pantalla es una prueba aislada. Lee tus datos locales de CampoBase, pero no guarda cambios en jugadores, sesiones, partidos, ejercicios ni WhatsApp.</div>`;
}

function renderTrainings() {
  const upcoming = sortedUpcomingSessions();
  const completed = sortedCompletedSessions();
  $('#training-content').innerHTML = `
    ${state.previewDraft ? `<div class="campo-section-title"><h3>Borrador de prueba</h3><span>No guardado en CampoBase</span></div>${sessionCard(state.previewDraft, { preview: true })}` : ''}
    <div class="campo-section-title"><h3>Próximas sesiones</h3><span>${upcoming.length}</span></div>
    <div class="campo-stack">${upcoming.length ? upcoming.map((session) => sessionCard(session)).join('') : `<div class="campo-card"><h3>No hay sesiones próximas</h3></div>`}</div>
    ${completed.length ? `<details class="campo-fold"><summary>Sesiones realizadas <span>${completed.length}</span></summary><div class="campo-fold-body">${completed.map((session) => sessionCard(session, { completed: true })).join('')}</div></details>` : ''}
  `;
}

function renderMatches() {
  const upcoming = sortedUpcomingMatches();
  const completed = sortedCompletedMatches();
  $('#matches-content').innerHTML = `
    <div class="campo-section-title"><h3>Próximos partidos</h3><span>${upcoming.length}</span></div>
    <div class="campo-stack">${upcoming.length ? upcoming.map((match) => matchCard(match)).join('') : `<div class="campo-card"><h3>No hay partidos próximos</h3></div>`}</div>
    ${completed.length ? `<details class="campo-fold"><summary>Partidos jugados <span>${completed.length}</span></summary><div class="campo-fold-body">${completed.map((match) => matchCard(match, { completed: true })).join('')}</div></details>` : ''}
  `;
}

function renderExerciseFilters() {
  const filters = ['Todos', 'Calentamiento', 'Posesión', 'Finalización', 'Defensa', 'Portero'];
  $('#exercise-filters').innerHTML = filters.map((filter) => `<button type="button" class="campo-filter-btn ${filter === state.exerciseFilter ? 'active' : ''}" data-filter="${esc(filter)}">${esc(filter)}</button>`).join('');
}

function renderExercises() {
  renderExerciseFilters();
  const query = ($('#exercise-search')?.value || '').trim().toLocaleLowerCase('es');
  const list = state.exercises.filter((ex) => isFilterMatch(ex, state.exerciseFilter) && (!query || exerciseSearchText(ex).includes(query)));
  $('#exercise-content').innerHTML = `<div class="campo-section-title"><h3>Resultados</h3><span>${list.length}</span></div><div class="exercise-card-grid">${list.length ? list.map(exerciseCard).join('') : `<div class="campo-card"><h3>No hay resultados</h3><p>Prueba otro filtro o término.</p></div>`}</div>`;
}

function renderAll() {
  renderHoy();
  renderTrainings();
  renderMatches();
  renderExercises();
}

function showView(view) {
  $$('.campo-view').forEach((section) => section.classList.toggle('active', section.dataset.view === view));
  $$('.campo-nav-btn').forEach((button) => button.classList.toggle('active', button.dataset.target === view));
  $('#campo-main')?.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toast(message, { undo = false } = {}) {
  const el = $('#campo-toast');
  if (!el) return;
  el.innerHTML = `${esc(message)}${undo ? ` <button type="button" class="campo-btn accent" data-undo-draft style="min-height:34px;padding:.3rem .55rem;margin-left:.45rem">Deshacer</button>` : ''}`;
  el.classList.add('show');
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => el.classList.remove('show'), undo ? 6000 : 2800);
}

function openWhatsAppStable() {
  $('#whatsapp-dialog')?.showModal();
}

function closeAllMenus(except = null) {
  $$('.campo-menu.open').forEach((menu) => { if (menu !== except) menu.classList.remove('open'); });
}

function factMarkup(facts, className = 'exercise-facts') {
  return `<div class="${className}">${facts.map(([label, value]) => `<div class="${className === 'field-essential-grid' ? 'field-essential' : 'exercise-fact'}"><small>${esc(label)}</small><strong>${esc(value)}</strong></div>`).join('')}</div>`;
}

function fullExerciseMarkup(ex) {
  const parts = [];
  if (ex.objetivo_principal) parts.push(`<section class="exercise-block exercise-full-only"><h3>🏆 Objetivo</h3><p>${esc(ex.objetivo_principal)}</p></section>`);
  if (ex.montaje?.explicacion || ex.montaje?.dimensiones) parts.push(`<section class="exercise-block exercise-full-only"><h3>📐 Montaje</h3><p>${esc([ex.montaje.dimensiones, ex.montaje.espacio_tipo, ex.montaje.explicacion].filter(Boolean).join(' · '))}</p></section>`);
  if (Array.isArray(ex.materiales) && ex.materiales.length) parts.push(`<section class="exercise-block exercise-full-only"><h3>📦 Material</h3><ul>${ex.materiales.map((item) => `<li><strong>${esc(item.nombre || 'Material')}</strong>${item.cantidad ? ` ×${esc(item.cantidad)}` : ''}${item.funcion ? ` · ${esc(item.funcion)}` : ''}</li>`).join('')}</ul></section>`);
  if (Array.isArray(ex.fases) && ex.fases.length) parts.push(`<section class="exercise-block exercise-full-only"><h3>🔄 Fases</h3><ol>${ex.fases.map((item) => `<li><strong>${esc(item.titulo || 'Fase')}</strong> · ${esc(item.descripcion || '')}</li>`).join('')}</ol></section>`);
  if (ex.rotacion?.explicacion || ex.rotacion?.detalles?.length) parts.push(`<section class="exercise-block exercise-full-only"><h3>🔁 Rotación</h3>${ex.rotacion.explicacion ? `<p>${esc(ex.rotacion.explicacion)}</p>` : ''}${ex.rotacion.detalles?.length ? `<ul>${ex.rotacion.detalles.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}</section>`);
  if (Array.isArray(ex.que_observar) && ex.que_observar.length) parts.push(`<section class="exercise-block exercise-full-only"><h3>👀 Qué observar</h3><ul>${ex.que_observar.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></section>`);
  if (Array.isArray(ex.consignas) && ex.consignas.length) parts.push(`<section class="exercise-block exercise-full-only"><h3>🗣 Consignas</h3><ul>${ex.consignas.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></section>`);
  if (Array.isArray(ex.errores_correcciones) && ex.errores_correcciones.length) parts.push(`<section class="exercise-block exercise-full-only"><h3>⚠️ Errores y correcciones</h3><ul>${ex.errores_correcciones.map((item) => `<li><strong>${esc(item.error || 'Error')}</strong>${item.correccion ? ` → ${esc(item.correccion)}` : ''}</li>`).join('')}</ul></section>`);
  if (Array.isArray(ex.variantes) && ex.variantes.length) parts.push(`<section class="exercise-block exercise-full-only"><h3>🔀 Variantes</h3><ul>${ex.variantes.map((item) => `<li>${typeof item === 'string' ? esc(item) : `${esc(item.variante || item.nombre || 'Variante')}: ${esc(item.variacion || item.descripcion || '')}`}</li>`).join('')}</ul></section>`);
  return parts.join('');
}

function renderExerciseDialog(ex) {
  const video = ex.media?.video || ex.media?.mp4 || ex.animacion?.mp4 || '';
  const poster = ex.media?.preview || ex.animacion?.preview || '';
  const steps = Array.isArray(ex.como_se_hace) ? ex.como_se_hace : [];
  const carga = ex.carga || {};
  const cycle = [carga.duracion && `Duración ${carga.duracion}`, carga.series && `Series ${carga.series}`, carga.repeticiones && `Repeticiones ${carga.repeticiones}`, carga.descanso && `Descanso ${carga.descanso}`].filter(Boolean);
  $('#exercise-dialog-content').innerHTML = `
    <div class="exercise-dialog-head"><p class="campo-kicker">Ejercicio</p><h2>${esc(ex.nombre || 'Ejercicio')}</h2></div>
    <div class="exercise-mode-switch" role="tablist">
      <button type="button" class="active" data-exercise-mode="quick">⚡ Vista rápida</button>
      <button type="button" data-exercise-mode="full">📋 Vista completa</button>
    </div>
    ${video ? `<div class="exercise-video" data-video-wrap><video class="preview-video" data-src="${esc(video)}" poster="${esc(poster)}" playsinline muted preload="metadata"></video><div class="exercise-video-controls"><button type="button" class="primary" data-video-action="play">▶ Play/Pausa</button><button type="button" data-video-action="back">⏪ 5 s</button><button type="button" data-video-action="forward">5 s ⏩</button><button type="button" data-video-action="zoom-out">Zoom −</button><button type="button" data-video-action="reset">100%</button><button type="button" data-video-action="zoom-in">Zoom +</button><button type="button" data-video-action="fullscreen">⛶ Ampliar</button></div></div>` : ''}
    <div class="exercise-detail-body" data-exercise-detail-mode="quick">
      ${factMarkup(exerciseFacts(ex))}
      ${steps.length ? `<section class="exercise-block"><h3>⚙️ Cómo se hace</h3><ol>${steps.map((step) => `<li>${esc(step)}</li>`).join('')}</ol></section>` : ''}
      ${cycle.length || carga.ciclo_repeticion ? `<section class="exercise-block"><h3>⏱ Series y descansos</h3><p>${esc(cycle.join(' · '))}${carga.ciclo_repeticion ? `${cycle.length ? ' · ' : ''}${esc(carga.ciclo_repeticion)}` : ''}</p></section>` : ''}
      ${fullExerciseMarkup(ex)}
    </div>`;
  $('#exercise-dialog').dataset.exerciseId = ex.id;
  applyExerciseMode('quick');
  initDialogVideo();
}

function applyExerciseMode(mode) {
  const dialog = $('#exercise-dialog');
  if (!dialog) return;
  $$('[data-exercise-mode]', dialog).forEach((button) => button.classList.toggle('active', button.dataset.exerciseMode === mode));
  $$('.exercise-full-only', dialog).forEach((node) => node.classList.toggle('hidden-mode', mode !== 'full'));
}

function initDialogVideo() {
  const video = $('#exercise-dialog .preview-video');
  if (!video) return;
  if (!video.src && video.dataset.src) video.src = video.dataset.src;
  video.dataset.zoom = '1';
}

function changeVideoZoom(video, delta = 0, reset = false) {
  if (!video) return;
  let zoom = Number(video.dataset.zoom || 1);
  zoom = reset ? 1 : Math.max(1, Math.min(2.5, zoom + delta));
  video.dataset.zoom = String(zoom);
  video.style.transform = `scale(${zoom})`;
  video.style.transformOrigin = 'center center';
}

function handleVideoAction(button) {
  const wrap = button.closest('[data-video-wrap]');
  const video = wrap?.querySelector('video');
  if (!video) return;
  const action = button.dataset.videoAction;
  if (action === 'play') {
    if (video.paused) video.play().catch(() => {}); else video.pause();
  } else if (action === 'back') {
    video.currentTime = Math.max(0, video.currentTime - 5);
  } else if (action === 'forward') {
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    const target = video.currentTime + 5;
    if (target >= video.duration) { video.pause(); video.currentTime = Math.max(0, video.duration - 0.02); }
    else video.currentTime = target;
  } else if (action === 'zoom-in') changeVideoZoom(video, .25);
  else if (action === 'zoom-out') changeVideoZoom(video, -.25);
  else if (action === 'reset') changeVideoZoom(video, 0, true);
  else if (action === 'fullscreen') {
    (wrap.requestFullscreen?.() || video.requestFullscreen?.())?.catch?.(() => {});
  }
}

function openExercise(id) {
  const ex = exerciseById(id);
  if (!ex) return toast('El ejercicio no está disponible en la prueba.');
  renderExerciseDialog(ex);
  $('#exercise-dialog').showModal();
}

function sessionExerciseList(session) {
  const blocks = Array.isArray(session?.blocks) ? session.blocks : [];
  if (!blocks.length) return toast('Esta sesión no tiene ejercicios guardados.');
  const first = blocks.find((block) => exerciseById(block.exerciseId));
  if (first) openExercise(first.exerciseId);
  else toast('Los ejercicios de esta sesión no están disponibles en la biblioteca validada.');
}

function stopTimer() {
  if (state.timerId) clearInterval(state.timerId);
  state.timerId = null;
}

function formatClock(seconds) {
  const s = Math.max(0, Math.floor(seconds || 0));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function startFieldSession(sessionId, index = 0) {
  const session = state.sessions.find((item) => String(item.id) === String(sessionId)) || (state.previewDraft && String(state.previewDraft.id) === String(sessionId) ? state.previewDraft : null);
  if (!session) return toast('La sesión ya no está disponible.');
  const blocks = Array.isArray(session.blocks) ? session.blocks : [];
  if (!blocks.length) return toast('La sesión no tiene ejercicios.');
  stopTimer();
  state.field = { type: 'session', sessionId: session.id, index: Math.max(0, Math.min(index, blocks.length - 1)), seconds: 0, running: false };
  renderFieldSession();
  $('#field-overlay').classList.remove('hidden');
}

function renderFieldSession() {
  const field = state.field;
  if (!field || field.type !== 'session') return;
  const session = state.sessions.find((item) => String(item.id) === String(field.sessionId)) || (state.previewDraft && String(state.previewDraft.id) === String(field.sessionId) ? state.previewDraft : null);
  const blocks = Array.isArray(session?.blocks) ? session.blocks : [];
  const block = blocks[field.index];
  const ex = exerciseById(block?.exerciseId);
  const video = ex?.media?.video || ex?.media?.mp4 || ex?.animacion?.mp4 || '';
  const poster = ex?.media?.preview || ex?.animacion?.preview || '';
  const steps = Array.isArray(ex?.como_se_hace) ? ex.como_se_hace : [];
  const progress = blocks.length ? ((field.index + 1) / blocks.length) * 100 : 0;
  const title = ex?.nombre || exerciseName(block?.exerciseId);

  $('#field-content').innerHTML = `
    <div class="field-top">
      <div class="field-title"><p>${esc(session?.name || 'Entrenamiento')} · ${field.index + 1}/${blocks.length}</p><h2>${esc(title)}</h2></div>
      <button type="button" class="field-exit" data-close-field>Volver</button>
    </div>
    <div class="field-progress"><span style="width:${progress}%"></span></div>
    <section class="field-main-card">
      <span class="field-number">Ejercicio ${field.index + 1} de ${blocks.length}</span>
      <h2>${esc(title)}</h2>
      ${block?.notes ? `<p>${esc(block.notes)}</p>` : ''}
      ${video ? `<div class="field-big-video"><video src="${esc(video)}" poster="${esc(poster)}" controls playsinline muted preload="metadata"></video></div>` : ''}
      ${factMarkup(exerciseFacts(ex, block), 'field-essential-grid')}
      <div class="campo-card-actions"><button type="button" class="campo-btn secondary" data-open-exercise="${esc(block?.exerciseId || '')}" ${ex ? '' : 'disabled'}>Ver ficha completa</button><button type="button" class="campo-btn secondary" data-whatsapp>📱 WhatsApp actual</button></div>
    </section>
    <section class="field-howto">
      <h3>Cómo hacerlo</h3>
      ${steps.length ? steps.map((step, idx) => `<div class="field-step"><span class="field-step-num">${idx + 1}</span><span>${esc(step)}</span></div>`).join('') : `<p>No hay pasos estructurados en este ejercicio.</p>`}
    </section>
    <div class="preview-note">Modo Campo de prueba: el cronómetro es temporal y no modifica la sesión real.</div>
    <div class="field-bottom-actions">
      <button type="button" data-field-prev ${field.index === 0 ? 'disabled' : ''}>← Anterior</button>
      <button type="button" class="primary" data-field-timer>⏱ <span data-field-clock>${formatClock(field.seconds)}</span></button>
      <button type="button" data-field-next ${field.index >= blocks.length - 1 ? 'disabled' : ''}>Siguiente →</button>
    </div>`;
}

function toggleFieldTimer() {
  if (!state.field) return;
  state.field.running = !state.field.running;
  if (!state.field.running) { stopTimer(); return; }
  state.timerId = setInterval(() => {
    if (!state.field?.running) return;
    state.field.seconds += 1;
    const clock = $('[data-field-clock]');
    if (clock) clock.textContent = formatClock(state.field.seconds);
  }, 1000);
}

function callupForMatch(match) {
  return state.callups.find((callup) => String(callup.id) === String(match?.callupId) || String(callup.matchId) === String(match?.id)) || null;
}

function playerName(id) {
  return state.players.find((player) => String(player.id) === String(id))?.name || 'Jugador';
}

function startFieldMatch(matchId) {
  const match = state.matches.find((item) => String(item.id) === String(matchId));
  if (!match) return toast('El partido ya no está disponible.');
  stopTimer();
  state.field = { type: 'match', matchId: match.id, seconds: 0, running: false, goalsFor: Number(match.goalsFor) || 0, goalsAgainst: Number(match.goalsAgainst) || 0, showCallup: false };
  renderFieldMatch();
  $('#field-overlay').classList.remove('hidden');
}

function renderFieldMatch() {
  const field = state.field;
  if (!field || field.type !== 'match') return;
  const match = state.matches.find((item) => String(item.id) === String(field.matchId));
  const callup = callupForMatch(match);
  const available = callup?.availableIds || [];
  const myTeam = state.settings?.teamName || 'Mi equipo';
  const away = match?.venue === 'away';
  const homeName = away ? match?.opponent || 'Rival' : myTeam;
  const awayName = away ? myTeam : match?.opponent || 'Rival';
  const homeScore = away ? field.goalsAgainst : field.goalsFor;
  const awayScore = away ? field.goalsFor : field.goalsAgainst;

  $('#field-content').innerHTML = `
    <div class="field-top"><div class="field-title"><p>${esc(dayRelation(matchDay(match)))}${matchTime(match) ? ` · ${esc(matchTime(match))}` : ''}</p><h2>${esc(match?.opponent || 'Partido')}</h2></div><button type="button" class="field-exit" data-close-field>Volver</button></div>
    <div class="field-match-score"><div><span>${esc(homeName)}</span><strong>${homeScore}</strong></div><div>—</div><div><span>${esc(awayName)}</span><strong>${awayScore}</strong></div></div>
    <div class="field-match-clock"><strong data-field-clock>${formatClock(field.seconds)}</strong><p>Cronómetro temporal de la prueba</p></div>
    <div class="field-match-actions">
      <button type="button" class="primary" data-field-timer>${field.running ? '⏸ Pausar' : '▶ Iniciar'} cronómetro</button>
      <button type="button" data-local-goal="for">+ Gol nuestro</button>
      <button type="button" data-local-goal="against">+ Gol rival</button>
      <button type="button" data-toggle-callup>👥 Convocados (${available.length})</button>
      <button type="button" data-whatsapp>📱 WhatsApp actual</button>
      <button type="button" data-open-stable>CampoBase normal</button>
    </div>
    ${field.showCallup ? `<section class="field-howto"><h3>Convocados</h3>${available.length ? available.map((id, idx) => `<div class="field-step"><span class="field-step-num">${idx + 1}</span><span>${esc(playerName(id))}</span></div>`).join('') : '<p>No hay convocatoria vinculada.</p>'}</section>` : ''}
    <div class="preview-note">Marcador y cronómetro de esta pantalla son solo de prueba y NO se guardan en el partido real. Para registrar el partido usa CampoBase normal.</div>`;
}

function closeField() {
  stopTimer();
  state.field = null;
  $('#field-overlay').classList.add('hidden');
  $('#field-content').innerHTML = '';
}

function wizardDefaults() {
  const now = new Date();
  const day = localDayKey(now);
  return { name: 'Nueva sesión', date: day, time: '17:00', pitch: '', targetDuration: 60 };
}

function openWizard() {
  state.wizard = { step: 1, values: wizardDefaults(), selectedIds: [] };
  renderWizard();
  $('#session-wizard-dialog').showModal();
}

function readWizardStepOne() {
  const root = $('#session-wizard-content');
  state.wizard.values.name = root.querySelector('[name="name"]')?.value.trim() || 'Nueva sesión';
  state.wizard.values.date = root.querySelector('[name="date"]')?.value || localDayKey();
  state.wizard.values.time = root.querySelector('[name="time"]')?.value || '';
  state.wizard.values.pitch = root.querySelector('[name="pitch"]')?.value.trim() || '';
  state.wizard.values.targetDuration = Number(root.querySelector('[name="targetDuration"]')?.value) || 60;
}

function draftBlock(exId, index) {
  const ex = exerciseById(exId);
  const raw = ex?.datos_rapidos?.duracion || ex?.duracion || ex?.duration || ex?.duracion_min || 10;
  const number = Number(String(typeof raw === 'object' ? raw.valor ?? raw.minutos ?? 10 : raw).match(/\d+/)?.[0] || 10);
  return { exerciseId: exId, duration: number, type: index === 0 ? 'warmup' : 'main', notes: '' };
}

function renderWizard() {
  const { step, values, selectedIds } = state.wizard;
  let body = '';
  if (step === 1) {
    body = `<div class="wizard-body"><div class="wizard-form-grid">
      <label>Nombre<input name="name" value="${esc(values.name || '')}"></label>
      <label>Fecha<input name="date" type="date" value="${esc(values.date || '')}"></label>
      <label>Hora<input name="time" type="time" value="${esc(values.time || '')}"></label>
      <label>Campo<input name="pitch" value="${esc(values.pitch || '')}" placeholder="Campo / instalación"></label>
      <label>Duración objetivo<input name="targetDuration" type="number" min="20" max="180" step="5" value="${esc(values.targetDuration || 60)}"></label>
    </div><div class="preview-note">Este asistente prueba el flujo nuevo. No guarda nada en CampoBase.</div><div class="wizard-actions"><span></span><button type="button" class="campo-btn primary" data-wizard-next>Siguiente →</button></div></div>`;
  } else if (step === 2) {
    const sample = state.exercises.slice(0, 30);
    body = `<div class="wizard-body"><div class="campo-section-title"><h3>2. Añadir ejercicios</h3><span>${selectedIds.length} elegidos</span></div><div class="wizard-picker">${sample.map((ex) => `<article class="wizard-pick-card ${selectedIds.includes(ex.id) ? 'selected' : ''}"><strong>${esc(ex.nombre)}</strong><div class="campo-meta-row"><span class="campo-meta-pill">${esc(formatDuration(ex.datos_rapidos?.duracion || ex.duracion || ex.duration || ex.duracion_min || ''))}</span></div><div class="campo-card-actions"><button type="button" class="campo-btn ${selectedIds.includes(ex.id) ? 'secondary' : 'primary'}" data-wizard-pick="${esc(ex.id)}">${selectedIds.includes(ex.id) ? 'Quitar' : '+ Añadir'}</button><button type="button" class="campo-btn secondary" data-open-exercise="${esc(ex.id)}">Ver todo</button></div></article>`).join('')}</div><div class="wizard-actions"><button type="button" class="campo-btn secondary" data-wizard-prev>← Atrás</button><button type="button" class="campo-btn primary" data-wizard-next ${selectedIds.length ? '' : 'disabled'}>Revisar →</button></div></div>`;
  } else {
    const blocks = selectedIds.map(draftBlock);
    const total = blocks.reduce((sum, block) => sum + block.duration, 0);
    body = `<div class="wizard-body"><div class="campo-section-title"><h3>3. Revisar</h3><span>${total} min</span></div><div class="wizard-review">${blocks.map((block, idx) => `<div class="wizard-review-item"><span><strong>${idx + 1}. ${esc(exerciseName(block.exerciseId))}</strong><br><small>${block.duration} min</small></span><button type="button" class="campo-btn secondary" data-open-exercise="${esc(block.exerciseId)}">Ver</button></div>`).join('')}</div><div class="campo-meta-row"><span class="campo-meta-pill">🎯 Objetivo ${values.targetDuration || 60} min</span><span class="campo-meta-pill">⏱ Seleccionado ${total} min</span><span class="campo-meta-pill">📍 ${esc(values.pitch || 'Sin campo')}</span></div><div class="preview-note">Al guardar se creará solo un borrador temporal dentro de esta prueba. Podrás borrarlo y deshacer el borrado sin afectar CampoBase.</div><div class="wizard-actions"><button type="button" class="campo-btn secondary" data-wizard-prev>← Atrás</button><button type="button" class="campo-btn primary" data-save-preview-draft>Guardar borrador de prueba</button></div></div>`;
  }

  $('#session-wizard-content').innerHTML = `<div class="wizard-head"><p class="campo-kicker">Preparar sesión</p><h2>En 3 pasos</h2><div class="wizard-progress"><span class="active"></span><span class="${step >= 2 ? 'active' : ''}"></span><span class="${step >= 3 ? 'active' : ''}"></span></div></div>${body}`;
}

function savePreviewDraft() {
  const blocks = state.wizard.selectedIds.map(draftBlock);
  state.previewDraft = {
    id: `preview-${Date.now()}`,
    recordType: 'trainingSession',
    ...state.wizard.values,
    blocks,
    totalDuration: blocks.reduce((sum, block) => sum + block.duration, 0),
    material: '',
    notes: 'Borrador temporal de Modo Campo',
  };
  $('#session-wizard-dialog').close();
  renderTrainings();
  renderHoy();
  showView('entrenos');
  $('#campo-sync').textContent = 'Prueba · borrador temporal';
  toast('Borrador de prueba creado. CampoBase no se ha modificado.');
}

function deletePreviewDraft() {
  if (!state.previewDraft) return;
  state.deletedDraft = state.previewDraft;
  state.previewDraft = null;
  renderTrainings();
  toast('Borrador de prueba eliminado.', { undo: true });
}

function undoPreviewDraft() {
  if (!state.deletedDraft) return;
  state.previewDraft = state.deletedDraft;
  state.deletedDraft = null;
  renderTrainings();
  toast('Borrador restaurado.');
}

async function loadData() {
  try {
    const [players, callups, matches, settings] = await Promise.all(['players', 'callups', 'matches', 'settings'].map(getAll));
    state.players = players;
    state.callups = callups;
    state.matches = matches;
    state.sessions = settings.filter((item) => item?.recordType === 'trainingSession');
    state.settings = settings.find((item) => item?.id === 'main') || {};
    const time = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date());
    $('#campo-sync').textContent = `Solo lectura · ${time}`;
    renderAll();
  } catch (error) {
    console.error(error);
    $('#campo-sync').textContent = 'Sin datos locales';
    $('#hoy-content').innerHTML = `<div class="campo-card"><h3>No se pudieron leer los datos locales</h3><p>Abre primero CampoBase normal en este navegador para que la prueba pueda usar sus datos locales.</p><div class="campo-card-actions"><a class="campo-btn primary" href="./index.html">Abrir CampoBase</a></div></div>`;
  }
}

document.addEventListener('click', (event) => {
  const nav = event.target.closest('.campo-nav-btn, [data-nav-to]');
  if (nav) {
    showView(nav.dataset.target || nav.dataset.navTo);
    return;
  }

  const menuToggle = event.target.closest('[data-menu-toggle]');
  if (menuToggle) {
    const menu = menuToggle.parentElement?.querySelector('.campo-menu');
    const opening = menu && !menu.classList.contains('open');
    closeAllMenus(menu);
    if (menu) menu.classList.toggle('open', opening);
    return;
  }
  if (!event.target.closest('.campo-menu-wrap')) closeAllMenus();

  if (event.target.closest('[data-whatsapp]')) { openWhatsAppStable(); return; }
  if (event.target.closest('#open-stable-whatsapp, [data-open-stable]')) { window.open('./index.html', '_blank', 'noopener'); return; }

  const openEx = event.target.closest('[data-open-exercise]');
  if (openEx?.dataset.openExercise) { openExercise(openEx.dataset.openExercise); return; }

  const mode = event.target.closest('[data-exercise-mode]');
  if (mode) { applyExerciseMode(mode.dataset.exerciseMode); return; }

  const videoAction = event.target.closest('[data-video-action]');
  if (videoAction) { handleVideoAction(videoAction); return; }

  const closeDialog = event.target.closest('.close-dialog');
  if (closeDialog) { closeDialog.closest('dialog')?.close(); return; }

  const filter = event.target.closest('[data-filter]');
  if (filter) { state.exerciseFilter = filter.dataset.filter; renderExercises(); return; }

  const sessionStart = event.target.closest('[data-start-session]');
  if (sessionStart) { startFieldSession(sessionStart.dataset.startSession); return; }

  const sessionExercises = event.target.closest('[data-session-exercises]');
  if (sessionExercises) {
    const session = state.sessions.find((item) => String(item.id) === String(sessionExercises.dataset.sessionExercises));
    if (session) sessionExerciseList(session);
    return;
  }

  const matchStart = event.target.closest('[data-start-match]');
  if (matchStart) { startFieldMatch(matchStart.dataset.startMatch); return; }

  if (event.target.closest('[data-close-field]')) { closeField(); return; }
  if (event.target.closest('[data-field-timer]')) { toggleFieldTimer(); if (state.field?.type === 'match') renderFieldMatch(); return; }
  if (event.target.closest('[data-field-prev]') && state.field?.type === 'session') { state.field.index = Math.max(0, state.field.index - 1); state.field.seconds = 0; stopTimer(); state.field.running = false; renderFieldSession(); return; }
  if (event.target.closest('[data-field-next]') && state.field?.type === 'session') { const session = state.sessions.find((item) => String(item.id) === String(state.field.sessionId)) || state.previewDraft; const max = Math.max(0, (session?.blocks?.length || 1) - 1); state.field.index = Math.min(max, state.field.index + 1); state.field.seconds = 0; stopTimer(); state.field.running = false; renderFieldSession(); return; }

  const localGoal = event.target.closest('[data-local-goal]');
  if (localGoal && state.field?.type === 'match') { if (localGoal.dataset.localGoal === 'for') state.field.goalsFor += 1; else state.field.goalsAgainst += 1; renderFieldMatch(); return; }
  if (event.target.closest('[data-toggle-callup]') && state.field?.type === 'match') { state.field.showCallup = !state.field.showCallup; renderFieldMatch(); return; }

  if (event.target.closest('#open-session-wizard')) { openWizard(); return; }
  if (event.target.closest('[data-wizard-next]')) {
    if (state.wizard.step === 1) readWizardStepOne();
    state.wizard.step = Math.min(3, state.wizard.step + 1);
    renderWizard();
    return;
  }
  if (event.target.closest('[data-wizard-prev]')) { state.wizard.step = Math.max(1, state.wizard.step - 1); renderWizard(); return; }
  const pick = event.target.closest('[data-wizard-pick]');
  if (pick) {
    const id = pick.dataset.wizardPick;
    state.wizard.selectedIds = state.wizard.selectedIds.includes(id) ? state.wizard.selectedIds.filter((item) => item !== id) : [...state.wizard.selectedIds, id];
    renderWizard();
    return;
  }
  if (event.target.closest('[data-save-preview-draft]')) { savePreviewDraft(); return; }
  if (event.target.closest('[data-delete-preview-draft]')) { deletePreviewDraft(); return; }
  if (event.target.closest('[data-undo-draft]')) { undoPreviewDraft(); return; }
});

$('#exercise-search')?.addEventListener('input', renderExercises);

$('#exercise-dialog')?.addEventListener('cancel', (event) => { event.preventDefault(); event.currentTarget.close(); });
$('#session-wizard-dialog')?.addEventListener('cancel', (event) => { event.preventDefault(); event.currentTarget.close(); });
$('#whatsapp-dialog')?.addEventListener('cancel', (event) => { event.preventDefault(); event.currentTarget.close(); });

window.addEventListener('beforeunload', stopTimer);
loadData();
