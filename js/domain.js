const BACKUP_STORES = ['players', 'callups', 'matches', 'trainings', 'settings'];

export function normalizePositions(player = {}) {
  const positions = Array.isArray(player.positions) ? player.positions : (player.position ? [player.position] : []);
  return [...new Set(positions.map((position) => String(position).trim()).filter(Boolean))];
}

function positiveInteger(value, label) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new TypeError(`${label} debe ser un entero positivo.`);
  }
}

export function calculateMinuteTargets(playerIds, durationMinutes, playersOnField) {
  if (!Array.isArray(playerIds) || playerIds.length === 0) {
    throw new TypeError('Debe haber al menos un jugador disponible.');
  }
  positiveInteger(durationMinutes, 'La duración');
  positiveInteger(playersOnField, 'Los jugadores en campo');
  const totalMinutes = durationMinutes * playersOnField;
  const base = Math.floor(totalMinutes / playerIds.length);
  const remainder = totalMinutes % playerIds.length;
  return playerIds.map((playerId, index) => ({
    playerId,
    minutes: base + (index < remainder ? 1 : 0),
  }));
}

export function suggestExcludedPlayers(players, count) {
  if (!Array.isArray(players)) throw new TypeError('La plantilla debe ser una lista.');
  if (!Number.isInteger(count) || count < 0 || count > players.length) {
    throw new RangeError('El número de jugadores fuera no es válido.');
  }
  return [...players]
    .sort((a, b) => {
      const countDifference = (a.outsideCount ?? 0) - (b.outsideCount ?? 0);
      if (countDifference !== 0) return countDifference;
      const aLast = a.lastExcludedAt ?? Number.NEGATIVE_INFINITY;
      const bLast = b.lastExcludedAt ?? Number.NEGATIVE_INFINITY;
      if (aLast !== bLast) return aLast - bLast;
      return String(a.name ?? '').localeCompare(String(b.name ?? ''), 'es');
    })
    .slice(0, count);
}

export function buildCallupSelection(players, options = {}) {
  if (!Array.isArray(players)) throw new TypeError('La plantilla debe ser una lista.');
  const limit = options.limit ?? 14;
  positiveInteger(limit, 'El máximo de convocados');
  const matchType = options.matchType ?? 'league';
  const playerIds = new Set(players.map(({ id }) => id));
  const selected = new Set(options.selectedIds ?? []);
  const manualExclusions = options.manualExclusions ?? [];
  const manuallyExcluded = new Set(manualExclusions.map(({ playerId }) => playerId));
  if ([...selected, ...manuallyExcluded].some((id) => !playerIds.has(id))) {
    throw new RangeError('La selección contiene un jugador que no está en la plantilla.');
  }
  if ([...selected].some((id) => manuallyExcluded.has(id))) {
    throw new RangeError('Un jugador no puede estar convocado y fuera a la vez.');
  }
  if (selected.size > limit) throw new RangeError(`La convocatoria no puede superar ${limit} jugadores.`);

  const eligible = players.filter(({ id }) => !manuallyExcluded.has(id));
  const exclusions = manualExclusions.map(({ playerId, reason }) => ({ playerId, reason, automatic: false }));
  if (matchType !== 'league') {
    if (eligible.length > limit) throw new RangeError(`En amistosos y torneos van todos los disponibles, con un máximo de ${limit}. Marca las bajas manuales necesarias.`);
    return { availableIds: eligible.map(({ id }) => id), exclusions };
  }

  const automaticCount = Math.max(0, eligible.length - limit);
  const candidates = eligible.filter(({ id }) => !selected.has(id));
  if (automaticCount > candidates.length) throw new RangeError(`La convocatoria no puede superar ${limit} jugadores.`);
  const automatic = suggestExcludedPlayers(candidates, automaticCount);
  const automaticIds = new Set(automatic.map(({ id }) => id));
  exclusions.push(...automatic.map(({ id }) => ({ playerId: id, reason: 'rotation', automatic: true })));
  return { availableIds: eligible.filter(({ id }) => !automaticIds.has(id)).map(({ id }) => id), exclusions };
}

export function buildTrainingRecord(players, values, metadata = {}) {
  if (!Array.isArray(players)) throw new TypeError('La plantilla debe ser una lista.');
  const allowedStatuses = new Set(['present', 'late', 'absent']);
  const attendance = players.map(({ id }) => {
    const status = values[`status-${id}`];
    if (!allowedStatuses.has(status)) throw new TypeError('El estado de asistencia no es válido.');
    return { playerId: id, status, note: String(values[`note-${id}`] ?? '').trim() };
  });
  return {
    id: metadata.id,
    date: String(values.date ?? ''),
    notes: String(values.notes ?? '').trim(),
    attendance,
    createdAt: metadata.createdAt,
  };
}

export function calculatePlayedSeconds(initialOnField, events, finalSecond) {
  if (!Number.isFinite(finalSecond) || finalSecond < 0) {
    throw new RangeError('El final del partido no es válido.');
  }
  const onField = new Set(initialOnField);
  const totals = Object.fromEntries(initialOnField.map((id) => [id, 0]));
  let previousSecond = 0;
  const orderedEvents = [...events].sort((a, b) => a.second - b.second);
  for (const event of orderedEvents) {
    if (event.second < previousSecond || event.second > finalSecond) {
      throw new RangeError('Hay un cambio fuera del tiempo de partido.');
    }
    for (const id of onField) totals[id] = (totals[id] ?? 0) + event.second - previousSecond;
    for (const id of event.outIds ?? []) onField.delete(id);
    for (const id of event.inIds ?? []) {
      onField.add(id);
      totals[id] ??= 0;
    }
    previousSecond = event.second;
  }
  for (const id of onField) totals[id] = (totals[id] ?? 0) + finalSecond - previousSecond;
  return totals;
}

export function validateBackup(backup) {
  if (!backup || typeof backup !== 'object' || Array.isArray(backup)) {
    throw new TypeError('La copia no contiene un objeto válido.');
  }
  if (backup.app !== 'CampoBase') throw new TypeError('La copia no pertenece a CampoBase.');
  if (backup.version !== 1) throw new TypeError('La versión de la copia no es compatible.');
  if (!backup.data || BACKUP_STORES.some((store) => !Array.isArray(backup.data[store]))) {
    throw new TypeError('La copia está incompleta.');
  }
  return backup;
}

export function formatMatchClock(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  return `${String(Math.floor(safeSeconds / 60)).padStart(2, '0')}:${String(safeSeconds % 60).padStart(2, '0')}`;
}
