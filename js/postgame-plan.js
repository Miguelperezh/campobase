import {normalizeMoments, plannedMinutes, describeMoment, validLineup} from './match-moments.js';

// Closing is explicit. A goal or recorded minutes alone do not end a live match.
export function isMatchTerminal(match) {
  return Boolean(match && (['finished','closed'].includes(match.status) || match.completed === true || match.closedAt || match.finishedAt));
}

export function postgameFormat(match = {}, callup = {}, prep = {}) {
  const format = String(match.format || callup?.format || prep?.format || 'F7').toUpperCase();
  const duration = Number(match.totalDuration || match.duration || prep?.totalDuration || prep?.duration || (format === 'F11' ? 90 : 70));
  if (!Number.isInteger(duration) || duration <= 0) throw new Error('La duración del partido no es válida.');
  return {duration, playersOnField:format === 'F11' ? 11 : 7};
}

export function keeperCandidates(match = {}, players = [], callup, prep) {
  const called = new Set(callup?.availableIds || []);
  const ids = new Set([
    ...(match.keeperIds || []),...Object.keys(match.keeperGoalsAgainst || {}),
    match.goalkeeperRotation?.firstKeeper,match.goalkeeperRotation?.secondKeeper,prep?.firstKeeper,prep?.secondKeeper,
    ...players.filter(p => called.has(p.id) && [...(p.positions || []),p.position].some(pos => /portero|^por$|^pt$/i.test(pos || ''))).map(p=>p.id),
    ...[...(match.lineupSnapshot || []),...(prep?.team || []),...(prep?.moments || []).flatMap(m=>m.team || [])].filter(slot => /portero|^por$|^pt$/i.test(slot.pos || '')).map(slot=>slot.playerId),
  ]);
  return [...ids].filter(Boolean);
}

export function performanceFromSavedPlan(match, callup, prep) {
  if (!prep || String(prep.matchId) !== String(match.id)) throw new Error('No hay un plan guardado para este partido.');
  const {duration,playersOnField} = postgameFormat(match,callup,prep);
  const availableIds = [...new Set(callup?.availableIds || [])];
  if (!availableIds.length) throw new Error('Falta la convocatoria de este partido.');
  if ((prep.moments || []).some(m => !Number.isInteger(Number(m.minute)) || Number(m.minute) < 0 || Number(m.minute) >= duration)) throw new Error('Revisa los minutos y las ventanas del plan guardado antes de aplicarlo.');
  const moments = normalizeMoments(prep);
  const minutesSeen = new Set();
  for (const moment of moments) {
    if (!Number.isInteger(moment.minute) || moment.minute < 0 || moment.minute >= duration || minutesSeen.has(moment.minute)) throw new Error('Revisa los minutos y las ventanas del plan guardado antes de aplicarlo.');
    if (!validLineup(moment.team,availableIds,playersOnField)) throw new Error(`La alineación del minuto ${moment.minute} no coincide con los convocados o no está completa.`);
    minutesSeen.add(moment.minute);
  }
  const minutes = plannedMinutes(moments,duration);
  const minuteTotals = Object.fromEntries(availableIds.map(id=>[id,(minutes[id] || 0)*60]));
  const substitutionEvents = [], tacticEvents = [];
  moments.slice(1).forEach((moment,index)=>{
    const before=moments[index],diff=describeMoment(before,moment);
    if (diff.inIds.length || diff.outIds.length) substitutionEvents.push({id:`plan-${moment.id || moment.minute}`,second:moment.minute*60,
      outIds:diff.pairs.map(pair=>pair.outId).filter(Boolean),inIds:diff.pairs.map(pair=>pair.inId),
      outPositions:diff.pairs.map(pair=>before.team.find(slot=>slot.playerId===pair.outId)?.pos || ''),
      inPositions:diff.pairs.map(pair=>moment.team.find(slot=>slot.playerId===pair.inId)?.pos || ''),source:'saved-plan'});
    tacticEvents.push({id:`plan-position-${moment.id || moment.minute}`,second:moment.minute*60,formation:moment.formation,team:structuredClone(moment.team),source:'saved-plan'});
  });
  const keeperIds = [...new Set(moments.flatMap(m => m.team.filter(slot => /portero|^por$|^pt$/i.test(slot.pos || '')).map(slot=>slot.playerId)))];
  return {minuteTotals,lineupSnapshot:structuredClone(moments[0].team),initialFormation:moments[0].formation,substitutionEvents,tacticEvents,keeperIds,playedSeconds:duration*60};
}
