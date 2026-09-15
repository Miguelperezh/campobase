import './exercise-view-mode-ui.js?v=2519';
import { put } from './db.js';

// Desde el 15/09/2026 las sesiones solo se archivan cuando el entrenador las
// cierra de forma explícita. Las sesiones anteriores se conservan como legado
// para no desmontar el historial ya validado.
const SESSION_GROUP_ID = 'completed-sessions-collapsible';
const MATCH_GROUP_ID = 'played-matches-collapsible';
const MANUAL_CLOSE_FROM = '2026-09-15';
let syncQueued = false;
let closeBound = false;

function sessionIsArchived(session) {
  if (session?.status === 'closed' || session?.status === 'finished' || session?.closedAt || session?.archived === true) return true;
  const day = String(session?.date || '').slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(day) && day < MANUAL_CLOSE_FROM;
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

function ensureManualCloseButtons() {
  const root = document.getElementById('sessions-list');
  const sessions = window.__campobase?.state?.trainingSessions;
  if (!root || !Array.isArray(sessions)) return;
  const byId = new Map(sessions.map((session) => [String(session.id), session]));

  for (const card of root.querySelectorAll('article.session-card[data-session-id]')) {
    const session = byId.get(String(card.dataset.sessionId));
    if (!session || sessionIsArchived(session)) continue;
    const actions = card.querySelector('.button-row');
    if (!actions || actions.querySelector('.close-session-manual')) continue;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'close-session-manual secondary';
    button.dataset.id = session.id;
    button.textContent = 'Cerrar sesión';
    actions.appendChild(button);
  }
}

function groupCompletedSessions() {
  const root = document.getElementById('sessions-list');
  const sessions = window.__campobase?.state?.trainingSessions;
  if (!root || !Array.isArray(sessions)) return;

  if (root.querySelector(`#${SESSION_GROUP_ID}`)) return;

  const completedIds = new Set(
    sessions.filter(sessionIsArchived).map((session) => String(session.id)),
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

  if (root.querySelector(`#${MATCH_GROUP_ID}`)) return;

  const playedIds = new Set(
    matches.filter((match) => match?.status === 'finished' || match?.status === 'closed' || match?.closedAt).map((match) => String(match.id)),
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
  ensureManualCloseButtons();
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

async function closeSessionManually(sessionId, button) {
  const sessions = window.__campobase?.state?.trainingSessions;
  const session = Array.isArray(sessions) ? sessions.find((item) => String(item.id) === String(sessionId)) : null;
  if (!session || sessionIsArchived(session)) return;

  const accepted = window.confirm('¿Cerrar esta sesión? Pasará a «Sesiones realizadas». Guardar asistencia por sí solo no la cerrará.');
  if (!accepted) return;

  button.disabled = true;
  try {
    const now = Date.now();
    await put('settings', { ...session, status: 'closed', closedAt: now, updatedAt: now });
    if (typeof window.__campobase?.refresh === 'function') await window.__campobase.refresh();
    else window.location.reload();
  } catch (error) {
    console.warn('No se pudo cerrar la sesión:', error);
    button.disabled = false;
  }
}

function bindManualClose() {
  if (closeBound) return;
  closeBound = true;
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.close-session-manual');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    closeSessionManually(button.dataset.id, button);
  });
}

function install() {
  bindManualClose();
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
