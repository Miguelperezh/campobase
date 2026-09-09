import { getAll, getOne, put } from './db.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = (value = '') => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const PRESEASON_TYPES = new Set(['friendly', 'tournament']);
const MATCH_TYPE_LABELS = { league: 'Liga', friendly: 'Amistoso', tournament: 'Torneo' };

export function isPreseasonMatchForStats(match = {}) {
  return PRESEASON_TYPES.has(match.type);
}

export function matchesForScope(matches, scope) {
  if (!Array.isArray(matches)) return [];
  if (scope === 'preseason') return matches.filter(isPreseasonMatchForStats);
  if (scope === 'league') return matches.filter((match) => !isPreseasonMatchForStats(match));
  return [...matches];
}

export function computePlayerScopeStats(player, matches, scope) {
  const scoped = matchesForScope(matches, scope);
  let minutes = 0;
  const ratings = [];
  for (const match of scoped) {
    const seconds = match.minuteTotals?.[player.id];
    if (Number.isFinite(seconds)) minutes += Math.round(seconds / 60);
    const rating = match.ratings?.[player.id];
    if (Number.isFinite(rating)) ratings.push(Number(rating));
  }
  const adjustments = player.statAdjustments?.[scope] ?? {};
  minutes = Math.max(0, Math.round(minutes + (Number.isFinite(adjustments.minutes) ? adjustments.minutes : 0)));
  let averageRating = ratings.length ? Number((ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1)) : null;
  if (Number.isFinite(adjustments.averageRating)) {
    averageRating = Number(Math.max(0, Math.min(5, Number(averageRating ?? 0) + adjustments.averageRating)).toFixed(1));
  }
  return { minutes, averageRating, ratingsCount: ratings.length };
}

function minuteLabel(second) {
  if (!Number.isFinite(second)) return '';
  return `${Math.floor(second / 60)}'`;
}

function substitutionsForPlayer(match, playerId) {
  const events = Array.isArray(match.substitutionEvents) ? match.substitutionEvents : [];
  const labels = [];
  for (const event of events) {
    if ((event.inIds ?? []).includes(playerId)) labels.push(`Entra ${minuteLabel(event.second)}`.trim());
    if ((event.outIds ?? []).includes(playerId)) labels.push(`Sale ${minuteLabel(event.second)}`.trim());
  }
  return labels;
}

function playerMatchMeta(match, playerId) {
  const meta = match.playerMatchMeta?.[playerId] ?? {};
  const positions = Array.isArray(meta.positions)
    ? meta.positions
    : String(meta.positions ?? '').split(',').map((item) => item.trim()).filter(Boolean);
  return {
    positions,
    entryPosition: String(meta.entryPosition ?? '').trim(),
    comment: String(meta.comment ?? '').trim(),
  };
}

function localDate(value) {
  if (!value) return '';
  const hasTime = String(value).includes('T');
  try {
    return new Intl.DateTimeFormat('es-ES', hasTime
      ? { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }
      : { day: '2-digit', month: '2-digit', year: 'numeric' })
      .format(new Date(hasTime ? value : `${value}T12:00:00`));
  } catch {
    return String(value);
  }
}

function historyMarkup(playerId, matches) {
  const rows = [...matches]
    .filter((match) => match.status === 'finished')
    .filter((match) => match.minuteTotals?.[playerId] !== undefined || match.ratings?.[playerId] !== undefined || match.playerMatchMeta?.[playerId])
    .sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')))
    .map((match) => {
      const seconds = match.minuteTotals?.[playerId];
      const meta = playerMatchMeta(match, playerId);
      const changes = substitutionsForPlayer(match, playerId);
      const positions = meta.positions.join(', ') || '—';
      const entry = meta.entryPosition || '—';
      return `<tr>
        <td>${esc(localDate(match.date))}<small>${esc(MATCH_TYPE_LABELS[match.type] ?? match.type ?? 'Partido')}</small></td>
        <td>${esc(match.opponent ?? 'Partido')}</td>
        <td>${Number.isFinite(seconds) ? Math.round(seconds / 60) : '—'}</td>
        <td>${match.ratings?.[playerId] ?? '—'}</td>
        <td>${esc(positions)}</td>
        <td>${esc(entry)}</td>
        <td>${esc(changes.join(' · ') || '—')}</td>
        <td>${esc(meta.comment || '—')}</td>
      </tr>`;
    }).join('');
  if (!rows) return '';
  return `<details class="cb-match-history"><summary>Historial por partido</summary><div class="cb-table-scroll"><table class="minute-table cb-player-history-table"><thead><tr><th>Fecha/tipo</th><th>Rival</th><th>Min</th><th>1–5</th><th>Posición/es</th><th>Entró como</th><th>Cambios</th><th>Comentario</th></tr></thead><tbody>${rows}</tbody></table></div></details>`;
}

let patchingCards = false;
async function patchPlayerCards() {
  if (patchingCards || !$('#players-list')) return;
  patchingCards = true;
  try {
    const [players, matches] = await Promise.all([getAll('players'), getAll('matches')]);
    const playerById = new Map(players.map((player) => [player.id, player]));
    for (const card of $$('#players-list .card.player')) {
      const playerId = $('.edit-player', card)?.dataset.id;
      const player = playerById.get(playerId);
      if (!player) continue;
      const league = computePlayerScopeStats(player, matches, 'league');
      const preseason = computePlayerScopeStats(player, matches, 'preseason');
      const summaries = $$('.player-summary', card);
      if (summaries[0]) {
        const items = $$(':scope > span', summaries[0]);
        if (items[7]) $('strong', items[7]).textContent = league.minutes;
        if (items[8]) $('strong', items[8]).textContent = league.averageRating ?? '—';
      }
      if (summaries[1]) {
        const items = $$(':scope > span', summaries[1]);
        if (items[7]) $('strong', items[7]).textContent = preseason.minutes;
        if (items[8]) $('strong', items[8]).textContent = preseason.averageRating ?? '—';
      }
      const bigLeague = $('.liga-media .valor', card);
      if (bigLeague) bigLeague.textContent = league.averageRating ?? '—';
      const rank = $('.rank', card);
      if (rank) rank.textContent = `${rank.textContent.match(/^\d+\./)?.[0] ?? ''} ${league.minutes + preseason.minutes} min acumulados`.trim();
      $('.cb-match-history', card)?.remove();
      const markup = historyMarkup(player.id, matches);
      if (markup) {
        const anchor = rank?.closest('p') ?? $('.player-performance', card);
        anchor?.insertAdjacentHTML('afterend', markup);
      }
    }
  } finally {
    patchingCards = false;
  }
}

function injectStyles() {
  if ($('#cb-player-stats-fix-style')) return;
  const style = document.createElement('style');
  style.id = 'cb-player-stats-fix-style';
  style.textContent = `
    .cb-match-editor{margin-top:1rem;border-top:1px solid #dbe3df;padding-top:1rem}.cb-match-editor h4{margin:.2rem 0 .35rem}.cb-match-editor .meta{margin-top:0}.cb-match-player-grid{display:grid;gap:.6rem}.cb-match-player-row{display:grid;grid-template-columns:minmax(150px,1.2fr) 86px 90px minmax(150px,1fr) minmax(130px,.9fr) minmax(180px,1.3fr);gap:.5rem;align-items:end;padding:.65rem;border:1px solid #dbe3df;border-radius:12px;background:#fff}.cb-match-player-row>strong{align-self:center}.cb-match-player-row label{font-size:.78rem}.cb-match-player-row input,.cb-match-player-row select,.cb-match-player-row textarea{width:100%;min-width:0}.cb-match-player-row textarea{min-height:54px;resize:vertical}.cb-sub-history{grid-column:1/-1;font-size:.76rem;color:#66736d}.cb-table-scroll{overflow:auto}.cb-player-history-table{min-width:900px}.cb-player-history-table td small{display:block;color:#6d7974}.cb-match-editor-actions{display:flex;gap:.5rem;justify-content:flex-end;margin-top:.75rem}.cb-sync-note{padding:.65rem .75rem;border-radius:10px;background:#eef7f2;color:#245c49;font-size:.8rem}
    @media(max-width:900px){.cb-match-player-row{grid-template-columns:1fr 1fr}.cb-match-player-row>strong,.cb-sub-history{grid-column:1/-1}}
    @media(max-width:600px){.cb-match-player-row{grid-template-columns:1fr}.cb-match-player-row>strong,.cb-sub-history{grid-column:auto}.cb-match-editor-actions{flex-direction:column}.cb-match-editor-actions button{width:100%}}
  `;
  document.head.appendChild(style);
}

function callupPlayerIds(match, callups) {
  const callup = callups.find((item) => item.id === match.callupId);
  if (callup?.availableIds?.length) return callup.availableIds;
  return [...new Set([
    ...Object.keys(match.minuteTotals ?? {}),
    ...Object.keys(match.ratings ?? {}),
    ...Object.keys(match.playerMatchMeta ?? {}),
  ])];
}

async function renderMatchEditor() {
  const dialog = $('#match-detail-dialog');
  const body = $('#match-detail-body');
  const matchId = dialog?.dataset.matchId;
  if (!dialog?.open || !body || !matchId) return;
  $('.cb-match-editor', body)?.remove();
  const [match, players, callups] = await Promise.all([getOne('matches', matchId), getAll('players'), getAll('callups')]);
  if (!match || match.status !== 'finished') return;
  const playerMap = new Map(players.map((player) => [player.id, player]));
  const ids = callupPlayerIds(match, callups).filter((id) => playerMap.has(id));
  if (!ids.length) return;
  const rows = ids.map((id) => {
    const player = playerMap.get(id);
    const meta = playerMatchMeta(match, id);
    const changes = substitutionsForPlayer(match, id);
    const minutes = Number.isFinite(match.minuteTotals?.[id]) ? Math.round(match.minuteTotals[id] / 60) : '';
    const rating = match.ratings?.[id];
    return `<div class="cb-match-player-row" data-player-id="${esc(id)}">
      <strong>${esc(player.name)}</strong>
      <label>Minutos<input type="number" min="0" max="120" step="1" data-field="minutes" value="${esc(minutes)}"></label>
      <label>Puntuación<select data-field="rating"><option value="">—</option>${[1,2,3,4,5].map((value) => `<option value="${value}" ${Number(rating) === value ? 'selected' : ''}>${value}/5</option>`).join('')}</select></label>
      <label>Posición/es<input data-field="positions" maxlength="140" value="${esc(meta.positions.join(', '))}" placeholder="Ej. Central, carrilero"></label>
      <label>Entró como<input data-field="entryPosition" maxlength="80" value="${esc(meta.entryPosition)}" placeholder="Ej. Carrilero derecho"></label>
      <label>Comentario<textarea data-field="comment" maxlength="800" placeholder="Observación para análisis posterior">${esc(meta.comment)}</textarea></label>
      <div class="cb-sub-history"><strong>Cambios:</strong> ${esc(changes.join(' · ') || 'Sin cambios registrados en vivo')}</div>
    </div>`;
  }).join('');
  body.insertAdjacentHTML('beforeend', `<section class="cb-match-editor"><h4>Jugadores · edición posterior</h4><p class="meta">Completa aquí lo que no pudiste registrar durante el partido. Estos datos pasan a ser los datos reales del partido y actualizan Plantilla, medias e historiales.</p><p class="cb-sync-note">Liga y Pretemporada se mantienen separadas. Las puntuaciones son siempre de 1 a 5.</p><div class="cb-match-player-grid">${rows}</div><div class="cb-match-editor-actions"><button type="button" class="primary cb-save-match-players">Guardar jugadores del partido</button></div></section>`);
}

async function saveMatchPlayers() {
  const dialog = $('#match-detail-dialog');
  const matchId = dialog?.dataset.matchId;
  const match = matchId ? await getOne('matches', matchId) : null;
  if (!match) return;
  const minuteTotals = { ...(match.minuteTotals ?? {}) };
  const ratings = { ...(match.ratings ?? {}) };
  const playerMatchMeta = { ...(match.playerMatchMeta ?? {}) };
  for (const row of $$('.cb-match-player-row', dialog)) {
    const playerId = row.dataset.playerId;
    const rawMinutes = $('[data-field="minutes"]', row)?.value ?? '';
    const rawRating = $('[data-field="rating"]', row)?.value ?? '';
    const positions = String($('[data-field="positions"]', row)?.value ?? '').split(',').map((item) => item.trim()).filter(Boolean);
    const entryPosition = String($('[data-field="entryPosition"]', row)?.value ?? '').trim();
    const comment = String($('[data-field="comment"]', row)?.value ?? '').trim();
    if (rawMinutes === '') delete minuteTotals[playerId];
    else {
      const minutes = Number(rawMinutes);
      if (!Number.isFinite(minutes) || minutes < 0 || minutes > 120) throw new RangeError('Los minutos deben estar entre 0 y 120.');
      minuteTotals[playerId] = Math.round(minutes * 60);
    }
    if (rawRating === '') delete ratings[playerId];
    else {
      const rating = Number(rawRating);
      if (![1,2,3,4,5].includes(rating)) throw new RangeError('La puntuación debe estar entre 1 y 5.');
      ratings[playerId] = rating;
    }
    if (positions.length || entryPosition || comment) playerMatchMeta[playerId] = { positions, entryPosition, comment };
    else delete playerMatchMeta[playerId];
  }
  await put('matches', { ...match, minuteTotals, ratings, playerMatchMeta, updatedAt: Date.now() });
  const toast = $('#toast');
  if (toast) {
    toast.textContent = 'Datos de jugadores guardados. Actualizando Plantilla…';
    toast.classList.add('show');
  }
  setTimeout(() => window.location.reload(), 300);
}

function bind() {
  injectStyles();
  const list = $('#players-list');
  if (list) {
    const observer = new MutationObserver(() => setTimeout(patchPlayerCards, 0));
    observer.observe(list, { childList: true, subtree: true });
    patchPlayerCards();
  }
  document.addEventListener('click', (event) => {
    if (event.target.closest('.match-detail')) setTimeout(renderMatchEditor, 60);
    if (event.target.closest('.cb-save-match-players')) {
      event.preventDefault();
      saveMatchPlayers().catch((error) => {
        const toast = $('#toast');
        if (toast) {
          toast.textContent = error.message || 'No se pudieron guardar los datos.';
          toast.classList.add('show');
        }
      });
    }
  });
  const dialog = $('#match-detail-dialog');
  if (dialog) {
    new MutationObserver(() => setTimeout(renderMatchEditor, 0)).observe(dialog, { attributes: true, attributeFilter: ['open', 'data-match-id'] });
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
else bind();
