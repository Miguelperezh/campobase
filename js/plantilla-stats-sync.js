import { getAll } from './db.js';
import { buildPlayerSummary, applyPlayerStatAdjustments, isPreseasonMatch, seasonKey } from './domain.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const localDate = (value) => {
  if (!value) return 'Sin fecha';
  const hasTime = String(value).includes('T');
  return new Intl.DateTimeFormat('es-ES', hasTime
    ? { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }
    : { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(hasTime ? value : `${value}T12:00:00`));
};

let syncing = false;
let scheduled = false;

function scopedMatches(matches, scope) {
  return matches.filter((match) => scope === 'preseason' ? isPreseasonMatch(match) : !isPreseasonMatch(match));
}

function ratedMatchesForPlayer(matches, playerId, scope) {
  return scopedMatches(matches, scope)
    .filter((match) => Number.isFinite(match.ratings?.[playerId]))
    .sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')));
}

function currentSeason(matches) {
  const dated = matches.filter((match) => match.date).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  if (dated.length) return seasonKey(dated[0].date);
  return seasonKey(new Date().toISOString().slice(0, 10));
}

function removeLegacyMixedDetails(performance) {
  $$('details', performance).forEach((details) => {
    const summary = details.querySelector(':scope > summary')?.textContent?.trim() ?? '';
    if (/^(Minutos por temporada|Puntuaciones \(|Media por temporada)/.test(summary)) details.remove();
  });
  performance.querySelectorAll('.player-scope-detail-sync').forEach((item) => item.remove());
}

function scopeDetailMarkup(scope, summary, ratedMatches, season) {
  const label = scope === 'preseason' ? 'Pretemporada' : 'Liga';
  const rows = ratedMatches.map((match) => `<li><strong>${esc(localDate(match.date))}</strong> · ${esc(match.opponent || 'Partido')} · ${match.ratings?.[ratedMatches.playerId] ?? ''}</li>`);
  const ratingRows = ratedMatches.map((match) => `<li><strong>${esc(localDate(match.date))}</strong> · ${esc(match.opponent || 'Partido')} · ${match._rating}/5</li>`).join('');
  const average = summary.averageRating ?? '—';
  const ratingCount = ratedMatches.length;
  return `<div class="player-scope-detail-sync" data-scope="${scope}">
    <details><summary>Temporada ${label}</summary><ul class="plain-list"><li><strong>${esc(season)}</strong> · ${summary.minutes} min · media ${average === '—' ? '—' : `${average}/5`} · ${ratingCount} partido${ratingCount === 1 ? '' : 's'} puntuado${ratingCount === 1 ? '' : 's'}</li></ul></details>
    ${ratingRows ? `<details><summary>Puntuaciones de ${label} (${ratingCount})</summary><ul class="plain-list">${ratingRows}</ul></details>` : ''}
  </div>`;
}

async function syncPlantillaStats() {
  if (syncing || !$('#players-list')) return;
  syncing = true;
  try {
    const [players, matches, trainings, callups] = await Promise.all(['players', 'matches', 'trainings', 'callups'].map(getAll));
    const currentMatchIds = new Set(matches.map((match) => match.id));
    const currentCallups = callups.filter((callup) => !callup.matchId || currentMatchIds.has(callup.matchId));
    const currentTrainings = trainings.filter((record) => !record.matchId || currentMatchIds.has(record.matchId));
    const byId = new Map(players.map((player) => [player.id, player]));
    const season = currentSeason(matches);
    let squadMinutes = 0;

    for (const card of $$('#players-list .card.player')) {
      const playerId = card.querySelector('.edit-player')?.dataset.id;
      const player = byId.get(playerId);
      if (!player) continue;
      const leagueAutomatic = buildPlayerSummary(playerId, matches, currentTrainings, currentCallups, 'league');
      const preseasonAutomatic = buildPlayerSummary(playerId, matches, currentTrainings, currentCallups, 'preseason');
      const league = applyPlayerStatAdjustments(leagueAutomatic, player.statAdjustments?.league);
      const preseason = applyPlayerStatAdjustments(preseasonAutomatic, player.statAdjustments?.preseason);
      squadMinutes += league.minutes + preseason.minutes;

      const media = card.querySelector('.liga-media .valor');
      if (media) media.textContent = league.averageRating ?? '—';
      const mediaBox = card.querySelector('.liga-media');
      if (mediaBox) mediaBox.title = 'Media de Liga';

      const performance = card.querySelector('.player-performance');
      if (!performance) continue;
      removeLegacyMixedDetails(performance);

      const leagueButton = performance.querySelector('.edit-player-stats[data-scope="league"]');
      const preseasonButton = performance.querySelector('.edit-player-stats[data-scope="preseason"]');
      const leagueRatings = ratedMatchesForPlayer(matches, playerId, 'league').map((match) => ({ ...match, _rating: match.ratings[playerId] }));
      const preseasonRatings = ratedMatchesForPlayer(matches, playerId, 'preseason').map((match) => ({ ...match, _rating: match.ratings[playerId] }));

      leagueButton?.insertAdjacentHTML('afterend', scopeDetailMarkup('league', league, leagueRatings, season));
      preseasonButton?.insertAdjacentHTML('afterend', scopeDetailMarkup('preseason', preseason, preseasonRatings, season));

      const rank = performance.querySelector('.rank');
      if (rank) rank.textContent = `${rank.textContent.split('.')[0]}. ${league.minutes + preseason.minutes} min acumulados`;
    }

    const squadStats = $('#squad-stats');
    if (squadStats) {
      const stats = $$('.stat', squadStats);
      const minutesStat = stats.find((stat) => /minutos acumulados/i.test(stat.textContent));
      if (minutesStat) minutesStat.querySelector('strong').textContent = String(squadMinutes);
    }
  } finally {
    syncing = false;
  }
}

function scheduleSync() {
  if (scheduled) return;
  scheduled = true;
  queueMicrotask(() => {
    scheduled = false;
    syncPlantillaStats().catch((error) => console.warn('No se pudo sincronizar la presentación de Plantilla:', error));
  });
}

export function initPlantillaStatsSync() {
  const root = $('#players-list');
  if (!root || root.dataset.statsSync === '1') return;
  root.dataset.statsSync = '1';
  new MutationObserver(scheduleSync).observe(root, { childList: true });
  scheduleSync();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPlantillaStatsSync, { once: true });
  else initPlantillaStatsSync();
}
