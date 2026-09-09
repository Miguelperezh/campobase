import { getAll, put } from './db.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

let scheduled = false;
let currentContext = null;

function formatMinute(second) {
  if (!Number.isFinite(Number(second))) return '—';
  return `${Math.max(0, Math.ceil(Number(second) / 60))}'`;
}

function preparationForMatch(settings, matchId) {
  return settings
    .filter((item) => item?.recordType === 'preparacion' && item.matchId === matchId && Array.isArray(item.team))
    .sort((a, b) => Number(b.savedAt ?? 0) - Number(a.savedAt ?? 0))[0] ?? null;
}

export function lineupForMatch(match, settings = []) {
  if (Array.isArray(match?.lineupSnapshot) && match.lineupSnapshot.length) return match.lineupSnapshot;
  const prep = preparationForMatch(settings, match?.id);
  return (prep?.team ?? []).filter((slot) => slot?.playerId).map((slot) => ({
    playerId: slot.playerId,
    pos: slot.pos ?? '',
    x: slot.x,
    y: slot.y,
  }));
}

export function inferSubstitutionPositions(events = [], initialLineup = []) {
  const currentPosition = new Map(initialLineup.filter((slot) => slot?.playerId).map((slot) => [slot.playerId, slot.pos ?? '']));
  return events.map((event) => {
    const outIds = Array.isArray(event?.outIds) ? event.outIds : [];
    const inIds = Array.isArray(event?.inIds) ? event.inIds : [];
    const explicitOut = Array.isArray(event?.outPositions) ? event.outPositions : [];
    const explicitIn = Array.isArray(event?.inPositions) ? event.inPositions : [];
    const pairs = Math.max(outIds.length, inIds.length);
    const outPositions = [];
    const inPositions = [];
    for (let index = 0; index < pairs; index += 1) {
      const outId = outIds[index] ?? '';
      const inId = inIds[index] ?? '';
      const inferred = explicitOut[index] ?? (outId ? currentPosition.get(outId) : '') ?? '';
      const inPosition = explicitIn[index] ?? inferred;
      outPositions.push(inferred);
      inPositions.push(inPosition);
      if (outId) currentPosition.delete(outId);
      if (inId) currentPosition.set(inId, inPosition);
    }
    return { ...event, outPositions, inPositions };
  });
}

function playerName(byId, id) {
  return byId.get(id)?.name ?? 'Jugador eliminado';
}

function playerMinutes(match, playerId) {
  const seconds = Number(match?.minuteTotals?.[playerId]);
  return Number.isFinite(seconds) ? Math.max(0, Math.round(seconds / 60)) : 0;
}

function participantIds(match, callup) {
  const ids = new Set();
  for (const [playerId, seconds] of Object.entries(match?.minuteTotals ?? {})) {
    if (Number(seconds) >= 60) ids.add(playerId);
  }
  for (const event of match?.substitutionEvents ?? []) {
    for (const id of [...(event.outIds ?? []), ...(event.inIds ?? [])]) if (id) ids.add(id);
  }
  for (const slot of match?.lineupSnapshot ?? []) if (slot?.playerId) ids.add(slot.playerId);
  if (!ids.size && callup?.availableIds?.length && Number(match?.playedSeconds) >= 60) {
    for (const id of callup.availableIds) if (Number(match?.minuteTotals?.[id]) > 0) ids.add(id);
  }
  return [...ids];
}

function participationMarkup(match, callup, lineup, players) {
  const byId = new Map(players.map((player) => [player.id, player]));
  const starters = lineup.map((slot) => `<li><strong>${esc(playerName(byId, slot.playerId))}</strong>${slot.pos ? ` · ${esc(slot.pos)}` : ''}</li>`).join('');
  const playedIds = participantIds(match, callup);
  const played = playedIds
    .sort((a, b) => playerMinutes(match, b) - playerMinutes(match, a) || playerName(byId, a).localeCompare(playerName(byId, b), 'es'))
    .map((id) => `<li><strong>${esc(playerName(byId, id))}</strong> · ${playerMinutes(match, id)} min</li>`).join('');
  const events = inferSubstitutionPositions(match?.substitutionEvents ?? [], lineup);
  const changes = events.flatMap((event) => {
    const pairs = Math.max(event.outIds?.length ?? 0, event.inIds?.length ?? 0);
    return Array.from({ length: pairs }, (_, index) => {
      const outId = event.outIds?.[index] ?? '';
      const inId = event.inIds?.[index] ?? '';
      const outPos = event.outPositions?.[index] ?? '';
      const inPos = event.inPositions?.[index] ?? '';
      return `<li><strong>${formatMinute(event.second)}</strong> · sale ${esc(playerName(byId, outId))}${outPos ? ` (${esc(outPos)})` : ''} · entra ${esc(playerName(byId, inId))}${inPos ? ` (${esc(inPos)})` : ''}</li>`;
    });
  }).join('');
  const rawSeconds = Object.values(match?.minuteTotals ?? {}).some((seconds) => Number(seconds) > 0 && Number(seconds) < 60);
  return `<section class="calendar-participation-sync panel">
    <div class="section-head"><div><p class="eyebrow">Participación</p><h3>Alineación, jugadores y cambios</h3></div><button type="button" class="edit-lineup-changes secondary" data-id="${esc(match.id)}">Editar alineación y cambios</button></div>
    ${rawSeconds ? '<p class="warning panel">Este partido conserva segundos incompletos del cronómetro original. Corrige los minutos desde «Editar minutos y puntuaciones».</p>' : ''}
    <details open><summary>Quién jugó (${playedIds.length})</summary>${played ? `<ul class="plain-list">${played}</ul>` : '<p class="meta">Todavía no hay minutos de juego fiables asignados a este partido.</p>'}</details>
    <details><summary>Siete inicial${lineup.length ? ` (${lineup.length})` : ''}</summary>${starters ? `<ul class="plain-list">${starters}</ul>` : '<p class="meta">No hay una alineación inicial guardada. Puedes completarla manualmente.</p>'}</details>
    <details><summary>Cambios (${events.reduce((total, event) => total + Math.max(event.outIds?.length ?? 0, event.inIds?.length ?? 0), 0)})</summary>${changes ? `<ul class="plain-list">${changes}</ul>` : '<p class="meta">No se registraron cambios en este partido. Si recuerdas los cambios de un partido antiguo, puedes añadirlos manualmente.</p>'}</details>
  </section>`;
}

function playerOptions(players, selected = '', allowEmpty = true) {
  const sorted = [...players].sort((a, b) => Number(a.number ?? 999) - Number(b.number ?? 999) || String(a.name).localeCompare(String(b.name), 'es'));
  return `${allowEmpty ? '<option value="">—</option>' : ''}${sorted.map((player) => `<option value="${esc(player.id)}" ${player.id === selected ? 'selected' : ''}>${esc(player.number ? `${player.number} · ` : '')}${esc(player.name)}</option>`).join('')}`;
}

function lineupRow(players, slot = {}, index = 0) {
  return `<div class="panel lineup-edit-row" data-index="${index}"><div class="form-row"><label>Jugador<select class="lineup-player">${playerOptions(players, slot.playerId)}</select></label><label>Posición<input class="lineup-position" maxlength="50" value="${esc(slot.pos ?? '')}" placeholder="Ej. Central"></label></div></div>`;
}

function changeRow(players, event = {}, index = 0) {
  const outId = event.outIds?.[0] ?? '';
  const inId = event.inIds?.[0] ?? '';
  const outPos = event.outPositions?.[0] ?? '';
  const inPos = event.inPositions?.[0] ?? outPos;
  const minute = Number.isFinite(Number(event.second)) ? Math.max(0, Math.ceil(Number(event.second) / 60)) : '';
  return `<div class="panel change-edit-row" data-index="${index}"><div class="form-row"><label>Minuto<input class="change-minute" type="number" min="0" max="120" step="1" value="${minute}"></label><label>Sale<select class="change-out">${playerOptions(players, outId)}</select></label><label>Posición sale<input class="change-out-pos" maxlength="50" value="${esc(outPos)}"></label><label>Entra<select class="change-in">${playerOptions(players, inId)}</select></label><label>Posición entra<input class="change-in-pos" maxlength="50" value="${esc(inPos)}"></label></div><button type="button" class="remove-change danger compact">Quitar cambio</button></div>`;
}

function ensureEditorDialog() {
  let dialog = $('#lineup-changes-dialog');
  if (dialog) return dialog;
  dialog = document.createElement('dialog');
  dialog.id = 'lineup-changes-dialog';
  dialog.innerHTML = `<form id="lineup-changes-form"><div class="dialog-head"><h2 id="lineup-changes-title">Alineación y cambios</h2><button type="button" data-close-lineup aria-label="Cerrar">×</button></div>
    <p class="meta">Guarda el siete inicial y los cambios reales del partido. Las posiciones quedan vinculadas al partido, no sustituyen las posiciones habituales de la ficha del jugador.</p>
    <h3>Siete inicial</h3><div id="lineup-edit-list"></div>
    <div class="section-head"><h3>Cambios</h3><button type="button" id="add-change-row" class="secondary">+ Cambio</button></div><div id="changes-edit-list"></div>
    <div class="button-row"><button type="submit" class="primary">Guardar alineación y cambios</button><button type="button" class="secondary" data-close-lineup>Cancelar</button></div></form>`;
  document.body.appendChild(dialog);
  dialog.querySelectorAll('[data-close-lineup]').forEach((button) => button.addEventListener('click', () => dialog.close()));
  dialog.querySelector('#add-change-row').addEventListener('click', () => {
    if (!currentContext) return;
    const list = dialog.querySelector('#changes-edit-list');
    list.insertAdjacentHTML('beforeend', changeRow(currentContext.players, {}, list.children.length));
  });
  dialog.addEventListener('click', (event) => event.target.closest('.remove-change')?.closest('.change-edit-row')?.remove());
  dialog.querySelector('form').addEventListener('submit', saveLineupChanges);
  return dialog;
}

async function openLineupChanges(matchId) {
  const [matches, players, callups, settings] = await Promise.all(['matches', 'players', 'callups', 'settings'].map(getAll));
  const match = matches.find((item) => item.id === matchId);
  if (!match) throw new TypeError('No se encontró el partido.');
  const callup = callups.find((item) => item.id === match.callupId || item.matchId === match.id);
  const available = callup?.availableIds?.length ? players.filter((player) => callup.availableIds.includes(player.id)) : players;
  const lineup = lineupForMatch(match, settings);
  const events = inferSubstitutionPositions(match.substitutionEvents ?? [], lineup).flatMap((event) => {
    const pairs = Math.max(event.outIds?.length ?? 0, event.inIds?.length ?? 0);
    return Array.from({ length: pairs }, (_, index) => ({ second: event.second, source: event.source, outIds: [event.outIds?.[index] ?? ''], inIds: [event.inIds?.[index] ?? ''], outPositions: [event.outPositions?.[index] ?? ''], inPositions: [event.inPositions?.[index] ?? ''] }));
  });
  currentContext = { match, players: available };
  const dialog = ensureEditorDialog();
  dialog.querySelector('#lineup-changes-title').textContent = `${match.opponent || 'Partido'} · alineación y cambios`;
  const lineupSize = match.format === 'F11' ? 11 : 7;
  dialog.querySelector('#lineup-edit-list').innerHTML = Array.from({ length: lineupSize }, (_, index) => lineupRow(available, lineup[index] ?? {}, index)).join('');
  dialog.querySelector('#changes-edit-list').innerHTML = events.map((event, index) => changeRow(available, event, index)).join('');
  dialog.showModal();
}

async function saveLineupChanges(event) {
  event.preventDefault();
  if (!currentContext) return;
  const dialog = event.currentTarget.closest('dialog');
  const lineupSnapshot = $$('.lineup-edit-row', dialog).map((row) => ({
    playerId: row.querySelector('.lineup-player').value,
    pos: row.querySelector('.lineup-position').value.trim(),
  })).filter((slot) => slot.playerId);
  const unique = new Set(lineupSnapshot.map((slot) => slot.playerId));
  if (unique.size !== lineupSnapshot.length) return window.alert('Un jugador no puede ocupar dos posiciones en el siete inicial.');

  const substitutionEvents = $$('.change-edit-row', dialog).map((row) => {
    const minuteRaw = row.querySelector('.change-minute').value;
    const outId = row.querySelector('.change-out').value;
    const inId = row.querySelector('.change-in').value;
    const outPos = row.querySelector('.change-out-pos').value.trim();
    const inPos = row.querySelector('.change-in-pos').value.trim() || outPos;
    if (!outId && !inId && minuteRaw === '') return null;
    const minute = Number(minuteRaw);
    if (!Number.isFinite(minute) || minute < 0 || !outId || !inId) throw new RangeError('Cada cambio necesita minuto, jugador que sale y jugador que entra.');
    return { second: Math.round(minute * 60), outIds: [outId], inIds: [inId], outPositions: [outPos], inPositions: [inPos], source: 'calendar_manual' };
  }).filter(Boolean).sort((a, b) => a.second - b.second);

  await put('matches', { ...currentContext.match, lineupSnapshot, substitutionEvents, updatedAt: Date.now() });
  dialog.close();
  currentContext = null;
  window.setTimeout(() => window.location.reload(), 120);
}

async function enhanceCalendarParticipation() {
  const root = $('#matches-list');
  if (!root) return;
  const [matches, players, callups, settings] = await Promise.all(['matches', 'players', 'callups', 'settings'].map(getAll));
  const byId = new Map(matches.map((match) => [match.id, match]));
  for (const detailButton of $$('.match-detail', root)) {
    const match = byId.get(detailButton.dataset.id);
    if (!match || match.status !== 'finished') continue;
    const actions = detailButton.closest('.button-row');
    if (!actions || actions.querySelector(`.edit-lineup-changes[data-id="${CSS.escape(match.id)}"]`)) continue;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'edit-lineup-changes secondary';
    button.dataset.id = match.id;
    button.textContent = 'Alineación y cambios';
    actions.appendChild(button);
  }

  const detailDialog = $('#match-detail-dialog');
  const matchId = detailDialog?.dataset.matchId;
  const body = $('#match-detail-body');
  const match = byId.get(matchId);
  if (body && match?.status === 'finished' && !body.querySelector('.calendar-participation-sync')) {
    const callup = callups.find((item) => item.id === match.callupId || item.matchId === match.id);
    const lineup = lineupForMatch(match, settings);
    body.insertAdjacentHTML('beforeend', participationMarkup(match, callup, lineup, players));
  }
}

function scheduleEnhance() {
  if (scheduled) return;
  scheduled = true;
  queueMicrotask(() => {
    scheduled = false;
    enhanceCalendarParticipation().catch((error) => console.warn('No se pudo mostrar la participación del partido:', error));
  });
}

export function initMatchCalendarSync() {
  const matchesRoot = $('#matches-list');
  const detailBody = $('#match-detail-body');
  if (matchesRoot && matchesRoot.dataset.lineupSync !== '1') {
    matchesRoot.dataset.lineupSync = '1';
    new MutationObserver(scheduleEnhance).observe(matchesRoot, { childList: true });
  }
  if (detailBody && detailBody.dataset.lineupSync !== '1') {
    detailBody.dataset.lineupSync = '1';
    new MutationObserver(scheduleEnhance).observe(detailBody, { childList: true, subtree: true });
  }
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.edit-lineup-changes');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openLineupChanges(button.dataset.id).catch((error) => window.alert(error.message || 'No se pudo abrir la alineación y cambios.'));
  }, true);
  scheduleEnhance();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMatchCalendarSync, { once: true });
  else initMatchCalendarSync();
}
