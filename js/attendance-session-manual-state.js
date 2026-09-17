import { getAll, put } from './db.js';

const ROOT_ID = 'attendance-source-panel';
let syncTimer = 0;
let syncing = false;

function sessionIsClosed(session) {
  return Boolean(
    session?.status === 'closed'
    || session?.status === 'finished'
    || session?.closedAt
    || session?.archived === true
  );
}

async function sessionMap() {
  const settings = await getAll('settings');
  return new Map(
    settings
      .filter((item) => item?.recordType === 'trainingSession' && item?.id)
      .map((session) => [String(session.id), session]),
  );
}

function sourceIdFromCard(card) {
  return String(card?.querySelector('[data-attendance-source="session"][data-source-id]')?.dataset?.sourceId || '');
}

function ensureOpenList(root, completedGroup) {
  const directLists = [...root.children].filter((node) => node.classList?.contains('attendance-activity-list'));
  if (directLists.length) return directLists[0];
  const list = document.createElement('div');
  list.className = 'attendance-activity-list attendance-manual-open-list';
  if (completedGroup) root.insertBefore(list, completedGroup);
  else root.appendChild(list);
  return list;
}

function ensureCompletedGroup(root) {
  let group = root.querySelector('.attendance-completed-group');
  if (group) return group;
  group = document.createElement('details');
  group.className = 'attendance-completed-group panel';
  group.innerHTML = `
    <summary class="attendance-completed-summary">
      <div class="attendance-completed-title">
        <span class="toggle-icon">▶</span>
        <strong>Asistencias registradas y finalizadas (<span data-manual-completed-count>0</span>)</strong>
      </div>
      <span class="pill accent">Desplegar</span>
    </summary>
    <div class="attendance-activity-list attendance-completed-list"></div>`;
  root.appendChild(group);
  return group;
}

function installRealizadoButton(card, session) {
  const head = card.querySelector('.attendance-activity-head');
  if (!head) return;
  let actions = head.querySelector('.attendance-session-actions');
  if (!actions) {
    const existingButton = [...head.children].find((child) => child.tagName === 'BUTTON');
    actions = document.createElement('div');
    actions.className = 'attendance-session-actions';
    if (existingButton) {
      head.replaceChild(actions, existingButton);
      actions.appendChild(existingButton);
    } else {
      head.appendChild(actions);
    }
  }

  const existing = actions.querySelector('.attendance-mark-session-realized');
  if (sessionIsClosed(session)) {
    existing?.remove();
    return;
  }
  if (existing) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'secondary attendance-mark-session-realized';
  button.dataset.sessionId = session.id;
  button.textContent = '✓ Realizado';
  button.title = 'La sesión solo se archivará cuando pulses Realizado';
  actions.appendChild(button);
}

function sortAttendancePlayersAlphabetically() {
  const list = document.querySelector('#training-form[data-visual-attendance="1"] .attendance-player-list');
  if (!list) return;
  const rows = [...list.querySelectorAll('.attendance-player-row')];
  rows.sort((a, b) => {
    const nameA = a.querySelector('.attendance-player-ident strong')?.textContent || '';
    const nameB = b.querySelector('.attendance-player-ident strong')?.textContent || '';
    return nameA.localeCompare(nameB, 'es', { sensitivity: 'base' });
  });
  rows.forEach((row) => list.appendChild(row));
}

function updateCompletedGroup(group) {
  if (!group) return;
  const list = group.querySelector('.attendance-completed-list');
  const count = list?.querySelectorAll('.attendance-activity-card').length || 0;
  const strong = group.querySelector('.attendance-completed-title strong');
  if (strong) strong.textContent = `Asistencias registradas y finalizadas (${count})`;
  group.hidden = count === 0;
}

async function syncAttendanceSessionState() {
  if (syncing) return;
  const root = document.getElementById(ROOT_ID);
  if (!root) return;
  syncing = true;
  try {
    const sessions = await sessionMap();
    let completedGroup = root.querySelector('.attendance-completed-group');
    let completedList = completedGroup?.querySelector('.attendance-completed-list') || null;
    let openList = [...root.children].find((node) => node.classList?.contains('attendance-activity-list')) || null;

    const cards = [...root.querySelectorAll('article.attendance-activity-card[data-activity-type="session"]')];
    for (const card of cards) {
      const id = sourceIdFromCard(card);
      const session = sessions.get(id);
      if (!session) continue;
      const closed = sessionIsClosed(session);

      if (closed) {
        if (!completedGroup) {
          completedGroup = ensureCompletedGroup(root);
          completedList = completedGroup.querySelector('.attendance-completed-list');
        }
        if (card.parentElement !== completedList) completedList.appendChild(card);
      } else {
        if (!openList) openList = ensureOpenList(root, completedGroup);
        if (card.parentElement !== openList) openList.appendChild(card);
      }
      installRealizadoButton(card, session);
    }

    updateCompletedGroup(completedGroup);
    sortAttendancePlayersAlphabetically();
  } finally {
    syncing = false;
  }
}

function scheduleSync() {
  window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(() => {
    syncAttendanceSessionState().catch((error) => console.warn('No se pudo sincronizar el estado manual de sesiones:', error));
  }, 50);
}

async function markSessionRealized(button) {
  const id = String(button.dataset.sessionId || '');
  if (!id) return;
  const settings = await getAll('settings');
  const session = settings.find((item) => item?.recordType === 'trainingSession' && String(item.id) === id);
  if (!session || sessionIsClosed(session)) return;

  const accepted = window.confirm('¿Marcar esta sesión como realizada? La asistencia puede prepararse días antes y no archiva la sesión; solo este botón la cierra.');
  if (!accepted) return;

  button.disabled = true;
  try {
    const now = Date.now();
    await put('settings', { ...session, status: 'closed', closedAt: now, updatedAt: now });
    if (typeof window.__campobase?.refresh === 'function') await window.__campobase.refresh();
    scheduleSync();
  } catch (error) {
    button.disabled = false;
    throw error;
  }
}

function installStyles() {
  if (document.getElementById('attendance-manual-session-style')) return;
  const style = document.createElement('style');
  style.id = 'attendance-manual-session-style';
  style.textContent = `
    .attendance-session-actions{display:flex;gap:.45rem;align-items:center;flex-wrap:wrap;justify-content:flex-end}
    .attendance-manual-open-list{margin-top:.75rem}
    @media(max-width:620px){.attendance-session-actions{width:100%;display:grid;grid-template-columns:1fr 1fr}.attendance-session-actions>button{width:100%}}
  `;
  document.head.appendChild(style);
}

function install() {
  installStyles();
  scheduleSync();
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.attendance-mark-session-realized');
    if (button) {
      event.preventDefault();
      event.stopImmediatePropagation();
      markSessionRealized(button).catch((error) => console.warn('No se pudo marcar la sesión como realizada:', error));
    }
  }, true);
  document.addEventListener('campobase:data-changed', (event) => {
    const stores = new Set(event.detail?.stores || []);
    if (stores.has('settings') || stores.has('trainings') || stores.has('players')) scheduleSync();
  });
  new MutationObserver(scheduleSync).observe(document.body, { childList: true, subtree: true });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
}
