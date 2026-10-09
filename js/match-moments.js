// A moment stores the whole lineup after its minute, so a substitution and a
// positional swap can be planned together without guessing intermediate states.
export function lineupIds(team = []) {
  return team.map((slot) => slot.playerId).filter(Boolean);
}

export function validLineup(team, availableIds, size = 7) {
  const ids = lineupIds(team);
  return Array.isArray(team) && team.length === size && ids.length === size
    && new Set(ids).size === size && ids.every((id) => availableIds.includes(id));
}

export function describeMoment(before, after) {
  const oldIds = new Set(lineupIds(before.team));
  const newIds = new Set(lineupIds(after.team));
  const outIds = [...oldIds].filter((id) => !newIds.has(id));
  const inIds = [...newIds].filter((id) => !oldIds.has(id));
  const pairedOut = new Set();
  const pairs = inIds.map((inId) => {
    let slot = after.team.findIndex((player) => player.playerId === inId);
    const visited = new Set();
    let outId = '';
    while (slot >= 0 && !visited.has(slot)) {
      visited.add(slot);
      const displacedId = before.team[slot]?.playerId;
      if (!displacedId) break;
      if (!newIds.has(displacedId)) { outId = displacedId; break; }
      slot = after.team.findIndex((player) => player.playerId === displacedId);
    }
    if (!outId || pairedOut.has(outId)) outId = outIds.find((id) => !pairedOut.has(id)) || '';
    if (outId) pairedOut.add(outId);
    return { inId, outId };
  });
  const moved = after.team.filter((slot) => oldIds.has(slot.playerId)
    && before.team.find((old) => old.playerId === slot.playerId)?.pos !== slot.pos)
    .map((slot) => ({ playerId: slot.playerId, position: slot.pos }));
  const oldKeeper = before.team.find((slot) => slot.pos === 'Portero')?.playerId || '';
  const newKeeper = after.team.find((slot) => slot.pos === 'Portero')?.playerId || '';
  return { outIds, inIds, pairs, moved, keeperId: oldKeeper !== newKeeper ? newKeeper : '',
    formation: before.formation !== after.formation ? after.formation : '' };
}

// Presentation only: retain the saved lineup and substitution pairing unchanged.
export function positionChangeLines(before, after, name = (id) => id) {
  const moved = describeMoment(before, after).moved;
  const seen = new Set();
  const lines = [];
  for (const move of moved) {
    if (seen.has(move.playerId)) continue;
    const old = before.team.find((slot) => slot.playerId === move.playerId);
    const previousOccupant = before.team.find((slot) => slot.pos === move.position);
    const partner = moved.find((other) => other.playerId === previousOccupant?.playerId && other.position === old.pos);
    if (partner) {
      seen.add(partner.playerId);
      lines.push(`${name(move.playerId)} intercambia posición con ${name(partner.playerId)}: ${name(move.playerId)} pasa de ${old.pos} a ${move.position}; ${name(partner.playerId)} pasa de ${move.position} a ${old.pos}`);
    } else {
      const occupant = previousOccupant?.playerId;
      lines.push(`${name(move.playerId)} cambia de ${old.pos} a ${move.position}${occupant && occupant !== move.playerId ? ` (puesto que ocupaba ${name(occupant)})` : ''}`);
    }
    seen.add(move.playerId);
  }
  return lines;
}

export function plannedMinutes(moments, duration = 70) {
  const minutes = {};
  const ordered = [...moments].sort((a, b) => a.minute - b.minute);
  for (let index = 0; index < ordered.length; index += 1) {
    const current = ordered[index];
    const end = Math.min(duration, ordered[index + 1]?.minute ?? duration);
    const span = Math.max(0, end - current.minute);
    lineupIds(current.team).forEach((id) => { minutes[id] = (minutes[id] || 0) + span; });
  }
  return minutes;
}

export function normalizeMoments(prep) {
  const initialTeam = (Array.isArray(prep.team) && prep.team.length)
    ? prep.team
    : (Array.isArray(prep.moments) ? (prep.moments.find((m) => Number(m.minute) === 0)?.team || prep.moments[0]?.team || []) : []);
  const initialFormation = prep.formacion || prep.moments?.find((m) => Number(m.minute) === 0)?.formation || prep.moments?.[0]?.formation || '1-3-2-1';
  const initial = { id: 'inicio', minute: 0, formation: initialFormation,
    team: initialTeam.map((slot) => ({ ...slot })) };
  const later = Array.isArray(prep.moments) ? prep.moments.filter((moment) => Number(moment.minute) > 0)
    .map((moment) => ({ id: moment.id, minute: Number(moment.minute),
      formation: moment.formation || initial.formation,
      team: (moment.team || []).map((slot) => ({ ...slot })) })) : [];
  return [initial, ...later.sort((a, b) => a.minute - b.minute)];
}
