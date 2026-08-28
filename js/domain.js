const BACKUP_STORES = ['players', 'callups', 'matches', 'trainings', 'settings'];

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
