export const POSTGAME_GOAL_TYPES = Object.freeze({ regular: 'Jugada', penalty: 'Penalti', freekick: 'Falta directa', own: 'Autogol del rival' });
export function postgameGoalType(goal) {
  if (goal.isOwnGoal || goal.playerId === '__pp__' || goal.type === 'for_pp') return 'own';
  if (goal.isPenalty || goal.type === 'for_penalti') return 'penalty';
  if (goal.goalType === 'freekick' || goal.type === 'for_falta') return 'freekick';
  return 'regular';
}
export function buildPostgameScoreUpdate(match, draft, duration = 70) {
  const gf = Number(draft.goalsFor), ga = Number(draft.goalsAgainst);
  if (![gf,ga].every(n => Number.isInteger(n) && n >= 0)) throw new RangeError('El marcador debe tener goles enteros, desde cero.');
  const goals = draft.goals.map(goal => {
    const type = goal.goalType;
    if (!Object.hasOwn(POSTGAME_GOAL_TYPES,type)) throw new RangeError('Elige un tipo de gol válido.');
    if (!goal.playerId && type !== 'own') throw new RangeError('Selecciona el goleador de cada gol.');
    const minute = Number(goal.minute);
    if (!Number.isFinite(minute) || minute < 0 || minute > duration) throw new RangeError(`El minuto del gol debe estar entre 0 y ${duration}.`);
    const original = goal.original ?? {};
    const next = { ...original, id: original.id || goal.id, playerId: type === 'own' ? '__pp__' : goal.playerId,
      assistantId: type === 'own' || goal.assistantId === goal.playerId ? '' : (goal.assistantId || ''),
      isOwnGoal: type === 'own', isPenalty: type === 'penalty', goalType: type,
      second: Math.round(minute * 60), note: String(goal.note ?? '') };
    // Extended legacy goal events also encode the type; keep both representations consistent.
    if (['for_jugada','for_penalti','for_falta','for_pp'].includes(original.type)) {
      next.type = {regular:'for_jugada',penalty:'for_penalti',freekick:'for_falta',own:'for_pp'}[type];
    }
    if (Object.hasOwn(original,'assistId')) next.assistId = next.assistantId;
    return next;
  });
  if (goals.length > gf) throw new RangeError('Hay más goles asignados que goles a favor. Corrige el marcador o la lista.');
  const keeperGoalsAgainst = {};
  for (const [id,value] of Object.entries(draft.keeperGoalsAgainst ?? {})) {
    if (value === '' || value === null || value === undefined) continue;
    const n = Number(value);
    if (!Number.isInteger(n) || n < 0) throw new RangeError('Los goles encajados por portero deben ser enteros, desde cero.');
    keeperGoalsAgainst[id] = n;
  }
  if (Object.values(keeperGoalsAgainst).reduce((a,b) => a+b,0) > ga) {
    throw new RangeError('La suma de goles de los porteros supera los goles en contra del equipo.');
  }
  return {...match,goalsFor:gf,goalsAgainst:ga,goals,keeperGoalsAgainst};
}
