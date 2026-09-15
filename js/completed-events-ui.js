import './exercise-view-mode-ui.js?v=2519';

// Agrupa únicamente eventos ya realizados en bloques plegados.
// No modifica datos, Supabase ni la lógica de edición/borrado: solo reorganiza
// las tarjetas ya renderizadas para mantener limpia la vista de Entrenos/Partidos.

const SESSION_GROUP_ID = 'completed-sessions-collapsible';
const MATCH_GROUP_ID = 'played-matches-collapsible';
let syncQueued = false;

function localDayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function sessionMinutes(session) {
  const blocks = Array.isArray(session?.blocks) ? session.blocks : [];
  const fromBlocks = blocks.reduce((sum, block) => sum + (Number(block?.duration) || 0), 0);
  return fromBlocks || Number(session?.totalDuration) || Number(session?.targetDuration) || 0;
}

function sessionHasFinished(session, now = new Date()) {
  const day = String(session?.date || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;

  const today = localDayKey(now);
  if (day < today) return true;
  if (day > today) return false;

  const time = String(session?.time || '').trim();
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
  if (!match) return false;

  const [year, month, date] = day.split('-').map(Number);
  const start = new Date(year, month - 1, date, Number(match[1]), Number(match[2]), 0, 0);
  const duration = sessionMinutes(session);
  const end = new Date(start.getTime() + Math.max(1, duration) * 60_000);
  return now >= end;
}

function makeAccordion({ id, title, count }) {
  const details = document.createElement('details');
  details.id = id;
  details.className = 'panel played-matches-accordion completed-events-accordion';
  details.innerHTML = `
    <summary class="played-matches-summary">
      <div class="played-matches-head">
        <span class="pill accent">✓</span>
        <h3 class="played-matches-title">${title}</h3>
        <span class="meta played-matches-count">(${count})</span>
      </div>
      <span class="pill secondary played-toggle-pill"></span>
    </summary>
    <div class="stack played-matches-cards completed-events-cards"></div>`;
  return details;
}

function groupCompletedSessions() {
  const root = document.getElementById('sessions-list');
  const sessions = window.__campobase?.state?.trainingSessions;
  if (!root || !Array.isArray(sessions)) return;

  // Si la app acaba de renderizar de nuevo, el bloque anterior ya no existe.
  // Si existe, no lo reconstruimos para no interferir mientras el usuario lo abre.
  if (root.querySelector(`#${SESSION_GROUP_ID}`)) return;

  const completedIds = new Set(
    sessions.filter((session) => sessionHasFinished(session)).map((session) => String(session.id)),
  );
  if (!completedIds.size) return;

  const cards = [...root.children].filter((node) =>
    node.matches?.('article.session-card[data-session-id]') && completedIds.has(String(node.dataset.sessionId)),
  );
  if (!cards.length) return;

  const group = makeAccordion({
    id: SESSION_GROUP_ID,
    title: 'Sesiones realizadas',
    count: cards.length,
  });
  const stack = group.querySelector('.completed-events-cards');
  cards.forEach((card) => stack.appendChild(card));
  root.appendChild(group);
}

function groupPlayedMatchesFallback() {
  const root = document.getElementById('matches-list');
  const matches = window.__campobase?.state?.matches;
  if (!root || !Array.isArray(matches)) return;

  // La app actual ya crea este bloque. Solo actuamos como respaldo si alguna
  // renderización futura dejara los partidos finalizados fuera del desplegable.
  if (root.querySelector(`#${MATCH_GROUP_ID}`)) return;

  const playedIds = new Set(
    matches.filter((match) => match?.status === 'finished').map((match) => String(match.id)),
  );
  if (!playedIds.size) return;

  const cards = [...root.children].filter((node) =>
    node.matches?.('article.match-card[data-match-id]') && playedIds.has(String(node.dataset.matchId)),
  );
  if (!cards.length) return;

  const group = makeAccordion({ id: MATCH_GROUP_ID, title: 'Jugados', count: cards.length });
  const stack = group.querySelector('.completed-events-cards');
  cards.forEach((card) => stack.appendChild(card));
  root.appendChild(group);
}

function syncCompletedEvents() {
  groupCompletedSessions();
  groupPlayedMatchesFallback();
}

function scheduleSync() {
  if (syncQueued) return;
  syncQueued = true;
  requestAnimationFrame(() => {
    syncQueued = false;
    syncCompletedEvents();
  });
}

function install() {
  syncCompletedEvents();

  const sessionsRoot = document.getElementById('sessions-list');
  const matchesRoot = document.getElementById('matches-list');
  if (sessionsRoot) new MutationObserver(scheduleSync).observe(sessionsRoot, { childList: true });
  if (matchesRoot) new MutationObserver(scheduleSync).observe(matchesRoot, { childList: true });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
}
