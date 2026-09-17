import { getAll } from './db.js';

const bypassValidatedSubmit = new WeakSet();

function normalizeSquadNumber(value) {
  const cleaned = String(value ?? '').trim().replace(/^#\s*/, '');
  if (!cleaned) return '';
  return /^\d+$/.test(cleaned) ? String(Number(cleaned)) : cleaned.toLocaleLowerCase('es');
}

async function findPlayerWithNumber(number, currentPlayerId = '') {
  const normalized = normalizeSquadNumber(number);
  if (!normalized) return null;
  const players = await getAll('players');
  return players.find((player) => player.id !== currentPlayerId && normalizeSquadNumber(player.number) === normalized) || null;
}

function clearNumberValidity(input) {
  if (!input) return;
  input.setCustomValidity('');
}

function playerCardName(card) {
  return card.querySelector('.player-name h3')?.textContent?.trim() || '';
}

function installPlayerRosterGuard() {
  if (typeof document === 'undefined') return;

  document.addEventListener('input', (event) => {
    const input = event.target;
    if (input?.form?.id === 'player-form' && input.name === 'number') clearNumberValidity(input);
  }, true);

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || form.id !== 'player-form') return;

    if (bypassValidatedSubmit.has(form)) {
      bypassValidatedSubmit.delete(form);
      return;
    }

    const numberInput = form.elements.number;
    const number = normalizeSquadNumber(numberInput?.value);
    if (!number) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const currentPlayerId = String(form.elements.id?.value || '');
    const submitter = event.submitter;

    findPlayerWithNumber(number, currentPlayerId)
      .then((duplicate) => {
        if (duplicate) {
          const message = `El dorsal ${number} ya lo tiene ${duplicate.name || 'otro jugador'}. Elige otro dorsal.`;
          numberInput?.setCustomValidity(message);
          numberInput?.reportValidity();
          numberInput?.focus();
          return;
        }

        clearNumberValidity(numberInput);
        bypassValidatedSubmit.add(form);
        if (submitter instanceof HTMLElement && typeof form.requestSubmit === 'function') form.requestSubmit(submitter);
        else form.requestSubmit();
      })
      .catch((error) => {
        console.error('No se pudo comprobar el dorsal:', error);
        const message = 'No se pudo comprobar si el dorsal está disponible. Inténtalo de nuevo.';
        numberInput?.setCustomValidity(message);
        numberInput?.reportValidity();
        numberInput?.focus();
      });
  }, true);

  function sortVisiblePlayerCards() {
    const list = document.getElementById('players-list');
    if (!list) return;
    const cards = [...list.children].filter((node) => node.matches?.('article.card.player[data-player-id]'));
    if (cards.length < 2) return;

    const sorted = [...cards].sort((a, b) => playerCardName(a).localeCompare(playerCardName(b), 'es', { sensitivity: 'base' }));
    const alreadySorted = cards.every((card, index) => card === sorted[index]);
    if (alreadySorted) return;

    const fragment = document.createDocumentFragment();
    sorted.forEach((card) => fragment.appendChild(card));
    list.appendChild(fragment);
  }

  function installAlphabeticalRosterObserver() {
    const attach = () => {
      const list = document.getElementById('players-list');
      if (!list) return false;
      sortVisiblePlayerCards();
      const observer = new MutationObserver(() => sortVisiblePlayerCards());
      observer.observe(list, { childList: true });
      return true;
    };

    if (attach()) return;
    const rootObserver = new MutationObserver(() => {
      if (attach()) rootObserver.disconnect();
    });
    rootObserver.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installAlphabeticalRosterObserver, { once: true });
  } else {
    installAlphabeticalRosterObserver();
  }
}

installPlayerRosterGuard();
