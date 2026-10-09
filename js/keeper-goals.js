// Read-only attribution: never invent a historical split between two keepers.
export function keeperIdsForMatch(match = {}, players = []) {
  const ids = new Set([...(match.keeperIds ?? []), match.goalkeeperRotation?.firstKeeper, match.goalkeeperRotation?.secondKeeper,
    ...Object.keys(match.keeperGoalsAgainst ?? {}),
    ...(match.lineupSnapshot ?? []).filter(slot => /portero|^por$/i.test(slot.pos ?? '')).map(slot => slot.playerId),
    ...players.filter(p => (p.positions ?? []).some(pos => /portero/i.test(pos)) && Number(match.minuteTotals?.[p.id]) > 0).map(p => p.id)]);
  return [...ids].filter(Boolean);
}

export function keeperGoalAllocation(match = {}, players = []) {
  const ids = keeperIdsForMatch(match, players);
  const total = Math.max(0, Number(match.goalsAgainst) || 0);
  const assigned = {};
  const explicit = match.keeperGoalsAgainst;
  if (explicit && typeof explicit === 'object') {
    for (const id of ids) {
      const value = explicit[id];
      if (Number.isInteger(value) && value >= 0) assigned[id] = value;
    }
  } else {
    const events = (match.incidents ?? []).filter(event => ['opponent_goal', 'penalty_conceded'].includes(event.type));
    for (const event of events) {
      const id = event.keeperId || event.playerId;
      if (ids.includes(id)) assigned[id] = (assigned[id] ?? 0) + 1;
    }
    if (ids.length === 1) assigned[ids[0]] = total;
    else if (events.length === total && Object.values(assigned).reduce((a,b) => a+b,0) === total) {
      for (const id of ids) assigned[id] ??= 0;
    }
  }
  const sum = Object.values(assigned).reduce((a,b) => a+b,0);
  // Inconsistent legacy assignments are not silently counted or repaired.
  if (sum > total) return { ids, assigned: {}, pending: total, complete: false };
  return { ids, assigned, pending: total - sum, complete: sum === total && ids.every(id => Object.hasOwn(assigned,id)) };
}
