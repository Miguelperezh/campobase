// A past roster is a record of what happened, not a proposed future rotation.
export function historicalCallupSelection(players, {selectedIds = [], manualExclusions = [], existing = null, matchType = 'league'} = {}) {
  const ids = new Set(players.map(player => player.id));
  const selected = [...new Set(selectedIds)];
  if (selected.some(id => !ids.has(id))) throw new Error('La selección contiene un jugador que no está disponible.');
  if (matchType !== 'friendly' && selected.length > 14) throw new Error('La convocatoria no puede superar 14 jugadores.');
  if (manualExclusions.some(item => !ids.has(item.playerId))) throw new Error('La exclusión contiene un jugador que no está disponible.');
  const manual = new Map(manualExclusions.map(item => [item.playerId, item]));
  if (selected.some(id => manual.has(id))) throw new Error('Un jugador no puede estar convocado y fuera a la vez.');
  const prior = new Map((existing?.exclusions ?? []).map(item => [item.playerId, item]));
  return {
    availableIds: selected,
    exclusions: [...ids].filter(id => !selected.includes(id)).map(playerId => manual.has(playerId)
      ? {...(prior.get(playerId)?.reason === manual.get(playerId).reason ? prior.get(playerId) : {}), ...manual.get(playerId), automatic:false}
      : prior.has(playerId) ? {...prior.get(playerId)} : {playerId, reason:'not_called', automatic:false}),
    pendingRotationDecisions: [],
  };
}

function normalizedOpponent(name) {
  return String(name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/^(c\.?d\.?|u\.?d\.?|c\.?f\.?|s\.?d\.?|at\.?|atletico|union|deportivo)\s+/i, '')
    .replace(/[^\w\s]/g, '').trim();
}

// Editing requires an unambiguous relationship: a similar opponent is not proof
// that two records describe the same match.
export function editableCallupForMatch(match, matches = [], callups = []) {
  const matchId = String(match?.id || '');
  if (!matchId) return null;
  const callupId = String(match.callupId || '');
  const belongsElsewhere = (callup) => Boolean(
    (callup.matchId && String(callup.matchId) !== matchId)
    || matches.some(other => String(other.id) !== matchId && (String(other.id) === String(callup.id)
      || (other.callupId && String(other.callupId) === String(callup.id)))),
  );
  const eligible = callups.filter(callup => callup?.id && !belongsElsewhere(callup));
  const exact = eligible.filter(callup => String(callup.matchId || '') === matchId
    || (callupId && String(callup.id) === callupId) || String(callup.id) === matchId);
  if (exact.length) return exact.length === 1 ? exact[0] : null;

  const day = String(match.date || '').slice(0, 10);
  const opponent = normalizedOpponent(match.opponent);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !opponent) return null;
  const sameFixture = record => String(record.date || '').slice(0, 10) === day && normalizedOpponent(record.opponent) === opponent;
  const fixtures = matches.filter(sameFixture);
  if (fixtures.length !== 1 || String(fixtures[0].id) !== matchId) return null;
  const legacy = eligible.filter(callup => !callup.matchId && sameFixture(callup));
  return legacy.length === 1 ? legacy[0] : null;
}
