(() => {
  'use strict';

  const SUPABASE_URL = 'https://mdzpygfwugawlmknywxa.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_j7duh_i5pNnMZMtT0YT-fg_l76UA_gH';
  const LEGACY_SESSION_CUTOFF = '2026-09-15';

  const state = {
    players: [],
    callups: [],
    matches: [],
    attendance: [],
    settings: [],
    sessions: [],
    team: {},
    field: null,
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value = '') => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function dateKey(value = '') { return String(value).slice(0, 10); }
  function timeFrom(value = '') { return String(value).includes('T') ? String(value).split('T')[1].slice(0, 5) : ''; }
  function fmtDate(value) {
    const key = dateKey(value);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return key || 'Sin fecha';
    return new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: '2-digit', month: '2-digit' }).format(new Date(`${key}T12:00:00`));
  }
  function relation(value) {
    const key = dateKey(value);
    const today = todayKey();
    const t = new Date(`${today}T12:00:00`);
    t.setDate(t.getDate() + 1);
    const tomorrow = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
    if (key === today) return 'Hoy';
    if (key === tomorrow) return 'Mañana';
    return fmtDate(key);
  }

  function sessionClosed(session) {
    if (session?.status === 'closed' || session?.status === 'finished' || session?.closedAt || session?.archived === true) return true;
    const key = dateKey(session?.date);
    return /^\d{4}-\d{2}-\d{2}$/.test(key) && key < LEGACY_SESSION_CUTOFF;
  }
  function matchClosed(match) {
    return match?.status === 'finished' || match?.status === 'closed' || Boolean(match?.closedAt);
  }

  async function readTable(client, table) {
    const { data, error } = await client.from(table).select('id,payload,updated_at,deleted_at');
    if (error) throw new Error(`${table}: ${error.message || error.code || 'error de lectura'}`);
    return (data || []).filter((row) => !row.deleted_at && row.payload).map((row) => row.payload);
  }

  function sourceText() {
    return `Supabase directo · ${state.players.length} jugadores · ${state.sessions.length} sesiones · ${state.matches.length} partidos · ${state.attendance.length} asistencias`;
  }

  function status(text, cls) { return `<span class="status ${cls}">${esc(text)}</span>`; }
  function sessionMinutes(session) {
    const sum = (session?.blocks || []).reduce((acc, block) => acc + (Number(block?.duration) || 0), 0);
    return sum || Number(session?.totalDuration) || Number(session?.targetDuration) || 0;
  }
  function sessionCard(session, archived = false) {
    const rel = relation(session.date);
    return `<article class="card" data-session-id="${esc(session.id)}">
      ${status(archived ? 'Realizada' : rel === 'Hoy' ? 'Hoy' : 'Próxima', archived ? 'done' : rel === 'Hoy' ? 'today' : 'next')}
      <h3>${esc(session.name || 'Sesión de entrenamiento')}</h3>
      <p>${esc(rel)}${session.time ? ` · ${esc(session.time)}` : ''}${session.pitch ? ` · ${esc(session.pitch)}` : ''}</p>
      <div class="meta"><span class="pill">⏱ ${sessionMinutes(session) || '—'} min</span><span class="pill">⚽ ${(session.blocks || []).length} ejercicios</span>${session.material ? `<span class="pill">📦 ${esc(session.material)}</span>` : ''}</div>
      <div class="actions">
        <button class="btn primary" data-start-session="${esc(session.id)}">▶ Entrenar ahora</button>
        <button class="btn secondary" data-attendance-session="${esc(session.id)}">👥 Asistencia</button>
        <a class="btn ghost" href="./index.html">CampoBase normal</a>
      </div>
    </article>`;
  }
  function matchCard(match, archived = false) {
    const rel = relation(match.date);
    const time = timeFrom(match.date);
    return `<article class="card" data-match-id="${esc(match.id)}">
      ${status(archived ? 'Jugado' : rel === 'Hoy' ? 'Hoy' : 'Próximo', archived ? 'done' : rel === 'Hoy' ? 'today' : 'next')}
      <h3>${esc(match.opponent || 'Rival')}</h3>
      <p>${esc(rel)}${time ? ` · ${esc(time)}` : ''}${match.location ? ` · ${esc(match.location)}` : ''}</p>
      <div class="meta"><span class="pill">${match.venue === 'away' ? '✈ Fuera' : '🏠 Casa'}</span>${archived ? `<span class="pill">⚽ ${Number(match.goalsFor) || 0}–${Number(match.goalsAgainst) || 0}</span>` : ''}</div>
      <div class="actions">
        <button class="btn primary" data-start-match="${esc(match.id)}">${archived ? 'Ver partido' : '▶ Partido ahora'}</button>
        <button class="btn secondary" data-attendance-match="${esc(match.id)}">👥 Asistencia</button>
        <a class="btn ghost" href="./index.html">CampoBase normal</a>
      </div>
    </article>`;
  }

  function upcomingSessions() { return state.sessions.filter((s) => !sessionClosed(s)).sort((a,b) => `${a.date || ''}${a.time || ''}`.localeCompare(`${b.date || ''}${b.time || ''}`)); }
  function archivedSessions() { return state.sessions.filter(sessionClosed).sort((a,b) => `${b.date || ''}${b.time || ''}`.localeCompare(`${a.date || ''}${a.time || ''}`)); }
  function upcomingMatches() { return state.matches.filter((m) => !matchClosed(m)).sort((a,b) => String(a.date || '').localeCompare(String(b.date || ''))); }
  function archivedMatches() { return state.matches.filter(matchClosed).sort((a,b) => String(b.date || '').localeCompare(String(a.date || ''))); }

  function renderHoy() {
    const today = todayKey();
    const session = upcomingSessions().find((s) => dateKey(s.date) === today) || upcomingSessions()[0];
    const match = upcomingMatches().find((m) => dateKey(m.date) === today) || upcomingMatches()[0];
    const actualTodaySession = session && dateKey(session.date) === today;
    const actualTodayMatch = match && dateKey(match.date) === today;
    let title = 'Lo esencial a golpe de vista';
    let text = 'Prueba independiente. Los datos se leen directamente desde Supabase.';
    let actions = `<button class="btn accent big" data-nav="entrenos">Ver entrenos</button><button class="btn ghost big" data-nav="partidos">Ver partidos</button>`;
    if (actualTodayMatch) {
      title = `Partido hoy contra ${match.opponent || 'el rival'}`;
      text = `${timeFrom(match.date) ? `A las ${timeFrom(match.date)} · ` : ''}${match.location || 'Ubicación no indicada'}`;
      actions = `<button class="btn accent big" data-start-match="${esc(match.id)}">▶ Abrir partido</button><button class="btn ghost big" data-attendance-match="${esc(match.id)}">👥 Asistencia</button>`;
    } else if (actualTodaySession) {
      title = `Entrenamiento hoy${session.time ? ` · ${session.time}` : ''}`;
      text = `${session.name || 'Sesión preparada'} · ${sessionMinutes(session) || '—'} min${session.pitch ? ` · ${session.pitch}` : ''}`;
      actions = `<button class="btn accent big" data-start-session="${esc(session.id)}">▶ Empezar entrenamiento</button><button class="btn ghost big" data-attendance-session="${esc(session.id)}">👥 Asistencia</button>`;
    }
    $('#hoy').innerHTML = `<section class="hero"><p class="kicker">Qué toca ahora</p><h2>${esc(title)}</h2><p>${esc(text)}</p><div class="actions">${actions}</div></section>
      <p class="source-proof">${esc(sourceText())}</p>
      <div class="grid"><section><div class="section-head"><h3>Próximo entreno</h3><span>${session ? esc(relation(session.date)) : '—'}</span></div>${session ? sessionCard(session) : '<div class="card empty">Sin sesiones próximas</div>'}</section><section><div class="section-head"><h3>Próximo partido</h3><span>${match ? esc(relation(match.date)) : '—'}</span></div>${match ? matchCard(match) : '<div class="card empty">Sin partidos próximos</div>'}</section></div>`;
  }

  function renderEntrenos() {
    const upcoming = upcomingSessions();
    const archived = archivedSessions();
    $('#entrenos').innerHTML = `<div class="section-head"><div><p class="kicker">Entrenos</p><h2>Grande, directo y sin menús innecesarios</h2></div><span>${upcoming.length} activas</span></div>
      <div class="stack">${upcoming.length ? upcoming.map((s) => sessionCard(s)).join('') : '<div class="card empty">No hay sesiones activas</div>'}</div>
      ${archived.length ? `<details class="fold"><summary>Sesiones realizadas (${archived.length})</summary><div class="fold-body stack">${archived.map((s) => sessionCard(s,true)).join('')}</div></details>` : ''}`;
  }

  function renderPartidos() {
    const upcoming = upcomingMatches();
    const archived = archivedMatches();
    $('#partidos').innerHTML = `<div class="section-head"><div><p class="kicker">Partidos</p><h2>Partido y asistencia a un toque</h2></div><span>${upcoming.length} próximos</span></div>
      <div class="stack">${upcoming.length ? upcoming.map((m) => matchCard(m)).join('') : '<div class="card empty">No hay partidos próximos</div>'}</div>
      ${archived.length ? `<details class="fold"><summary>Partidos jugados (${archived.length})</summary><div class="fold-body stack">${archived.map((m) => matchCard(m,true)).join('')}</div></details>` : ''}`;
  }

  function renderPlantilla() {
    $('#plantilla').innerHTML = `<div class="section-head"><div><p class="kicker">Plantilla</p><h2>${state.players.length} jugadores</h2></div></div><div class="card">${state.players.slice().sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'es')).map((p) => `<div class="player-row"><strong>${esc(p.name || 'Jugador')}</strong><span class="pill">${esc((p.positions || p.position || []).toString() || 'Jugador')}</span></div>`).join('')}</div>`;
  }

  function showView(id) {
    $$('.view').forEach((view) => view.classList.toggle('active', view.id === id));
    $$('.nav').forEach((button) => button.classList.toggle('active', button.dataset.nav === id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function attendanceRecordForSession(session) {
    return state.attendance.find((row) => row.kind !== 'match' && String(row.sessionId || '') === String(session.id))
      || state.attendance.find((row) => row.kind !== 'match' && dateKey(row.date) === dateKey(session.date));
  }
  function attendanceRecordForMatch(match) {
    return state.attendance.find((row) => row.kind === 'match' && String(row.matchId || '') === String(match.id));
  }
  function callupForMatch(match) {
    return state.callups.find((c) => String(c.id) === String(match.callupId) || String(c.matchId || '') === String(match.id));
  }
  function attendanceStatus(entry) {
    if (!entry) return ['Pendiente',''];
    if (entry.status === 'absent') return ['Ausente','absent'];
    if (entry.status === 'late') return ['Tarde','late'];
    return ['Presente','present'];
  }
  function openAttendance(kind, id) {
    const isMatch = kind === 'match';
    const event = isMatch ? state.matches.find((m) => String(m.id) === String(id)) : state.sessions.find((s) => String(s.id) === String(id));
    if (!event) return;
    const record = isMatch ? attendanceRecordForMatch(event) : attendanceRecordForSession(event);
    const map = new Map((record?.attendance || []).map((entry) => [String(entry.playerId), entry]));
    let players = state.players;
    if (isMatch) {
      const callup = callupForMatch(event);
      const ids = callup?.availableIds || [];
      if (ids.length) players = ids.map((pid) => state.players.find((p) => String(p.id) === String(pid))).filter(Boolean);
    }
    const counts = { present:0, late:0, absent:0, pending:0 };
    const rows = players.slice().sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'es')).map((player) => {
      const entry = map.get(String(player.id));
      const [label, cls] = attendanceStatus(entry);
      counts[entry?.status || 'pending'] = (counts[entry?.status || 'pending'] || 0) + 1;
      return `<div class="player-row"><strong>${esc(player.name || 'Jugador')}</strong><span class="attendance-state ${cls}">${label}${entry?.arrivalTime ? ` · ${esc(entry.arrivalTime)}` : ''}</span></div>`;
    }).join('');
    const title = isMatch ? `Asistencia · ${event.opponent || 'Partido'}` : `Asistencia · ${event.name || 'Entrenamiento'}`;
    $('#overlay-body').innerHTML = `<p class="kicker">${isMatch ? 'Partido' : 'Entrenamiento'}</p><h2 class="field-title">${esc(title)}</h2><div class="attendance-summary"><span class="pill">✓ ${counts.present} presentes</span><span class="pill">⏱ ${counts.late} tarde</span><span class="pill">✕ ${counts.absent} ausentes</span><span class="pill">? ${counts.pending} pendientes</span></div><div class="card">${rows || '<div class="empty">Sin jugadores</div>'}</div><p class="note">Esta prueba es de solo lectura. La asistencia real se sigue guardando en CampoBase normal.</p>`;
    openOverlay();
  }

  function exerciseName(id) {
    const custom = state.settings.find((item) => item.recordType === 'exercise' && String(item.id) === String(id));
    return custom?.name || `Ejercicio ${id || 'sin identificar'}`;
  }
  function startSession(id) {
    const session = state.sessions.find((s) => String(s.id) === String(id));
    if (!session) return;
    const blocks = session.blocks || [];
    state.field = { type:'session', id, index:0 };
    renderSessionField(session, blocks);
  }
  function renderSessionField(session, blocks) {
    const index = Math.max(0, Math.min(state.field?.index || 0, Math.max(0, blocks.length - 1)));
    const block = blocks[index];
    $('#overlay-body').innerHTML = `<p class="kicker">${esc(session.name || 'Entrenamiento')} · ${blocks.length ? `${index+1}/${blocks.length}` : 'sin ejercicios'}</p><h2 class="field-title">${esc(block ? exerciseName(block.exerciseId) : 'Sesión sin ejercicios')}</h2>${block ? `<div class="meta"><span class="pill">⏱ ${Number(block.duration)||'—'} min</span><span class="pill">${esc(block.type || 'Ejercicio')}</span></div>${block.notes ? `<div class="card"><h3>Consigna</h3><p>${esc(block.notes)}</p></div>` : ''}<div class="actions"><button class="btn secondary" data-field-prev ${index===0?'disabled':''}>← Anterior</button><button class="btn primary" data-attendance-session="${esc(session.id)}">👥 Asistencia</button><button class="btn secondary" data-field-next ${index>=blocks.length-1?'disabled':''}>Siguiente →</button></div>` : ''}<p class="note">Prueba directa: los ejercicios completos seguirán usando las fichas validadas de CampoBase cuando integremos el modo.</p>`;
    openOverlay();
  }
  function startMatch(id) {
    const match = state.matches.find((m) => String(m.id) === String(id));
    if (!match) return;
    const team = state.team.teamName || 'Mi equipo';
    const away = match.venue === 'away';
    const home = away ? match.opponent || 'Rival' : team;
    const visitor = away ? team : match.opponent || 'Rival';
    $('#overlay-body').innerHTML = `<p class="kicker">${esc(relation(match.date))}${timeFrom(match.date)?` · ${esc(timeFrom(match.date))}`:''}</p><h2 class="field-title">${esc(match.opponent || 'Partido')}</h2><div class="card" style="text-align:center"><div style="font-size:22px;font-weight:900">${esc(home)}</div><div style="font-size:54px;font-weight:950;margin:12px 0">${Number(match.goalsFor)||0} — ${Number(match.goalsAgainst)||0}</div><div style="font-size:22px;font-weight:900">${esc(visitor)}</div></div><div class="actions"><button class="btn primary" data-attendance-match="${esc(match.id)}">👥 Asistencia</button><a class="btn ghost" href="./index.html">Abrir partido en CampoBase</a></div><p class="note">Marcador y cambios se gestionan en CampoBase normal mientras esta prueba siga aislada.</p>`;
    openOverlay();
  }

  function openOverlay() { $('#overlay').classList.remove('hidden'); window.scrollTo({top:0}); }
  function closeOverlay() { $('#overlay').classList.add('hidden'); state.field = null; }

  async function load() {
    const sync = $('#sync');
    try {
      if (!globalThis.supabase?.createClient) throw new Error('No se cargó el cliente de Supabase.');
      const client = globalThis.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false } });
      const [players, callups, matches, attendance, settings] = await Promise.all([
        readTable(client,'jugadores'), readTable(client,'convocatorias'), readTable(client,'partidos'), readTable(client,'asistencias'), readTable(client,'configuracion'),
      ]);
      state.players = players; state.callups = callups; state.matches = matches; state.attendance = attendance; state.settings = settings;
      state.sessions = settings.filter((item) => item?.recordType === 'trainingSession');
      state.team = settings.find((item) => item?.id === 'main') || {};
      sync.textContent = sourceText();
      renderHoy(); renderEntrenos(); renderPartidos(); renderPlantilla();
    } catch (error) {
      sync.textContent = 'Error Supabase';
      $('#hoy').innerHTML = `<div class="error"><h2>No se pudieron cargar los datos</h2><p>${esc(error?.message || error)}</p><button class="btn primary" onclick="location.reload()">Reintentar</button></div>`;
      console.error('[Modo Campo directo]', error);
    }
  }

  document.addEventListener('click', (event) => {
    const nav = event.target.closest('[data-nav]');
    if (nav) { showView(nav.dataset.nav); return; }
    const session = event.target.closest('[data-start-session]');
    if (session) { startSession(session.dataset.startSession); return; }
    const match = event.target.closest('[data-start-match]');
    if (match) { startMatch(match.dataset.startMatch); return; }
    const attSession = event.target.closest('[data-attendance-session]');
    if (attSession) { openAttendance('session', attSession.dataset.attendanceSession); return; }
    const attMatch = event.target.closest('[data-attendance-match]');
    if (attMatch) { openAttendance('match', attMatch.dataset.attendanceMatch); return; }
    if (event.target.closest('[data-close-overlay]')) { closeOverlay(); return; }
    if (event.target.closest('[data-field-prev]') && state.field?.type === 'session') {
      state.field.index = Math.max(0, state.field.index - 1);
      const s = state.sessions.find((x) => String(x.id) === String(state.field.id));
      renderSessionField(s, s?.blocks || []); return;
    }
    if (event.target.closest('[data-field-next]') && state.field?.type === 'session') {
      const s = state.sessions.find((x) => String(x.id) === String(state.field.id));
      state.field.index = Math.min(Math.max(0,(s?.blocks||[]).length-1), state.field.index + 1);
      renderSessionField(s, s?.blocks || []); return;
    }
  });

  window.addEventListener('DOMContentLoaded', load, { once:true });
})();
