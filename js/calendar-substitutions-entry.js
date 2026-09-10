import './calendar-substitutions-v2.js';

function addCalendarButtons() {
  const root = document.querySelector('#matches-list');
  if (root) {
    root.querySelectorAll('article.panel').forEach((card) => {
      const detail = card.querySelector('.match-detail');
      const actions = detail?.closest('.button-row');
      const finished = [...card.querySelectorAll('.pill')].some((pill) => pill.textContent.trim() === 'Finalizado');
      if (!detail || !actions || !finished) return;
      if (actions.querySelector(`.edit-lineup-changes[data-id="${CSS.escape(detail.dataset.id)}"]`)) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'edit-lineup-changes secondary';
      button.dataset.id = detail.dataset.id;
      button.textContent = 'Alineación y cambios';
      actions.insertBefore(button, detail.nextSibling);
    });
  }

  const dialog = document.querySelector('#match-detail-dialog');
  const body = document.querySelector('#match-detail-body');
  const matchId = dialog?.dataset.matchId;
  if (dialog?.open && body && matchId && !body.querySelector(`.edit-lineup-changes[data-id="${CSS.escape(matchId)}"]`)) {
    const actions = body.querySelector('.button-row');
    if (actions) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'edit-lineup-changes secondary';
      button.dataset.id = matchId;
      button.textContent = 'Alineación y cambios';
      actions.prepend(button);
    }
  }
}

function installCalendarButtons() {
  addCalendarButtons();
  const matchesRoot = document.querySelector('#matches-list');
  const detailBody = document.querySelector('#match-detail-body');
  if (matchesRoot) new MutationObserver(addCalendarButtons).observe(matchesRoot, { childList: true, subtree: true });
  if (detailBody) new MutationObserver(addCalendarButtons).observe(detailBody, { childList: true, subtree: true });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', installCalendarButtons, { once: true });
  else installCalendarButtons();
}
