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
  const protectedHistories = options.protectedHistories ?? {};
  const rotationDecisions = options.rotationDecisions ?? {};
  const pendingRotationDecisions = [];
  const automatic = [];
  for (const player of suggestExcludedPlayers(candidates, candidates.length)) {
    if (automatic.length >= automaticCount) break;
    const history = protectedHistories[player.id] ?? [];
    if (history.length && !rotationDecisions[player.id]) {
      pendingRotationDecisions.push({ playerId: player.id, history });
      continue;
    }
    if (rotationDecisions[player.id] === 'include') continue;
    automatic.push(player);
  }
  const automaticIds = new Set(automatic.map(({ id }) => id));
  exclusions.push(...automatic.map(({ id }) => ({ playerId: id, reason: 'rotation', automatic: true })));
  return {
    availableIds: eligible.filter(({ id }) => !automaticIds.has(id)).map(({ id }) => id),
    exclusions,
    pendingRotationDecisions,
  };
}

export function buildAttendanceRecord(players, values, metadata = {}) {
  if (!Array.isArray(players)) throw new TypeError('La plantilla debe ser una lista.');
  const allowedStatuses = new Set(['present', 'late', 'absent']);
  const kind = metadata.kind ?? 'training';
  if (!['training', 'match'].includes(kind)) throw new TypeError('El tipo de asistencia no es válido.');
  if (kind === 'match' && !metadata.matchId) throw new TypeError('La asistencia de partido debe estar vinculada a un partido.');
  const attendance = players.map(({ id }) => {
    const status = values[`status-${id}`];
    if (!allowedStatuses.has(status)) throw new TypeError('El estado de asistencia no es válido.');
    const arrivalTime = status === 'late' ? String(values[`arrivalTime-${id}`] ?? '').trim() : '';
    if (arrivalTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(arrivalTime)) {
      throw new TypeError('La hora de llegada no es válida.');
    }
    return { playerId: id, status, arrivalTime, note: String(values[`note-${id}`] ?? '').trim() };
  });
  return {
    id: metadata.id,
    kind,
    matchId: kind === 'match' ? metadata.matchId : null,
    date: String(values.date ?? ''),
    notes: String(values.notes ?? '').trim(),
    attendance,
    createdAt: metadata.createdAt,
  };
}

export function buildTrainingRecord(players, values, metadata = {}) {
  const { kind, matchId, ...record } = buildAttendanceRecord(players, values, { ...metadata, kind: 'training' });
  return record;
}

export function calculateAttendanceStats(playerId, records) {
  if (!Array.isArray(records)) throw new TypeError('El historial de asistencia debe ser una lista.');
  const history = records
    .map((record) => ({ ...record, entry: record.attendance?.find((item) => item.playerId === playerId) }))
    .filter(({ entry }) => entry)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)) || (a.createdAt ?? 0) - (b.createdAt ?? 0));
  const trainingHistory = history.filter(({ kind }) => (kind ?? 'training') === 'training');
  let longestTrainingAbsenceStreak = 0;
  let streak = 0;
  for (const { entry } of trainingHistory) {
    streak = entry.status === 'absent' ? streak + 1 : 0;
    longestTrainingAbsenceStreak = Math.max(longestTrainingAbsenceStreak, streak);
  }
  let currentTrainingAbsenceStreak = 0;
  for (const { entry } of [...trainingHistory].reverse()) {
    if (entry.status !== 'absent') break;
    currentTrainingAbsenceStreak += 1;
  }
  const totalAbsences = history.filter(({ entry }) => entry.status === 'absent').length;
  const lateCount = history.filter(({ entry }) => entry.status === 'late').length;
  return {
    totalRecords: history.length,
    totalAbsences,
    trainingAbsences: trainingHistory.filter(({ entry }) => entry.status === 'absent').length,
    matchAbsences: history.filter(({ kind, entry }) => kind === 'match' && entry.status === 'absent').length,
    currentTrainingAbsenceStreak,
    longestTrainingAbsenceStreak,
    lateCount,
    oftenLate: lateCount >= 3,
  };
}

export function sortAttendanceRecords(records) {
  if (!Array.isArray(records)) throw new TypeError('El historial de asistencia debe ser una lista.');
  return [...records].sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')) || (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

export function buildPlayerHistory(playerId, attendanceRecords, callups) {
  if (!Array.isArray(attendanceRecords) || !Array.isArray(callups)) {
    throw new TypeError('Los históricos deben ser listas.');
  }
  const attendance = attendanceRecords.flatMap((record) => {
    const entry = record.attendance?.find((item) => item.playerId === playerId);
    if (!entry) return [];
    const detail = [entry.status, entry.arrivalTime ? `Hora ${entry.arrivalTime}` : '', entry.note, record.notes].filter(Boolean).join(' · ');
    return [{ type: 'attendance', id: record.id, date: record.date, kind: record.kind ?? 'training', detail, createdAt: record.createdAt ?? 0 }];
  });
  const exclusions = callups.flatMap((callup) => (callup.exclusions ?? [])
    .filter((entry) => entry.playerId === playerId)
    .map((entry) => ({ type: 'callup', id: callup.id, date: callup.date, kind: 'callup', detail: entry.reason, automatic: Boolean(entry.automatic), createdAt: callup.createdAt ?? 0 })));
  return [...attendance, ...exclusions]
    .sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')) || b.createdAt - a.createdAt);
}

export function applySubstitution(onFieldIds, outIds, inIds, availableIds, maxChanges = 3) {
  if (outIds.length !== inIds.length) throw new RangeError('Debe salir y entrar el mismo número de jugadores.');
  if (!Number.isInteger(maxChanges) || maxChanges < 1 || outIds.length < 1 || outIds.length > maxChanges) {
    throw new RangeError(`Cada cambio debe incluir entre uno y ${maxChanges} jugadores.`);
  }
  const onField = new Set(onFieldIds);
  const available = new Set(availableIds);
  if (outIds.some((id) => !onField.has(id)) || inIds.some((id) => onField.has(id))) {
    throw new RangeError('La selección de entradas y salidas no coincide con el estado del campo.');
  }
  if ([...outIds, ...inIds].some((id) => !available.has(id))) throw new RangeError('El cambio contiene un jugador no convocado.');
  return onFieldIds.filter((id) => !outIds.includes(id)).concat(inIds);
}

export function suggestDelegateSubstitution(onFieldIds, benchIds, playedSeconds, count = 1) {
  if (!Number.isInteger(count) || count < 1) throw new RangeError('El número de cambios debe ser positivo.');
  const size = Math.min(count, onFieldIds.length, benchIds.length);
  const byMostPlayed = [...onFieldIds].sort((a, b) => (playedSeconds[b] ?? 0) - (playedSeconds[a] ?? 0) || String(a).localeCompare(String(b)));
  const byLeastPlayed = [...benchIds].sort((a, b) => (playedSeconds[a] ?? 0) - (playedSeconds[b] ?? 0) || String(a).localeCompare(String(b)));
  return { outIds: byMostPlayed.slice(0, size), inIds: byLeastPlayed.slice(0, size) };
}

export function shouldSuggestUrgentSubstitution(benchIds, playedSeconds, remainingSeconds) {
  return remainingSeconds <= 10 * 60
    && remainingSeconds >= 0
    && benchIds.some((id) => (playedSeconds[id] ?? 0) <= 8 * 60);
}

export function seasonKey(dateValue) {
  const match = /^(\d{4})-(\d{2})/.exec(String(dateValue ?? ''));
  if (!match) throw new TypeError('La fecha del partido no es válida.');
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) throw new TypeError('La fecha del partido no es válida.');
  const startYear = month >= 7 ? year : year - 1;
  return `${startYear}-${startYear + 1}`;
}

export function accumulateSeasonMinutes(player, matchDate, playedSeconds, context = {}) {
  if (!Number.isFinite(playedSeconds) || playedSeconds < 0) {
    throw new RangeError('Los segundos jugados no son válidos.');
  }
  const allowedReasons = new Set(['discipline', 'absence', 'illness', 'goalkeeper_rotation']);
  if (context.reason && !allowedReasons.has(context.reason)) {
    throw new TypeError('El motivo de menos minutos no es válido.');
  }
  const season = seasonKey(matchDate);
  const minutes = Math.round(playedSeconds / 60);
  const seasonMinutes = { ...(player.seasonMinutes ?? {}) };
  seasonMinutes[season] = (seasonMinutes[season] ?? 0) + minutes;
  const minuteReasons = [...(player.minuteReasons ?? [])];
  if (context.reason) {
    minuteReasons.push({ matchId: context.matchId, date: matchDate, season, reason: context.reason });
  }
  return {
    ...player,
    totalMinutes: (player.totalMinutes ?? 0) + minutes,
    seasonMinutes,
    minuteReasons,
  };
}

export function buildPlayerRatings(players, values, metadata = {}) {
  if (metadata.role !== 'owner') throw new TypeError('Solo Migue puede puntuar a los jugadores.');
  if (!Array.isArray(players) || !players.length) throw new TypeError('Debe haber jugadores para puntuar.');
  if (!metadata.matchId || !metadata.date) throw new TypeError('La puntuación debe estar vinculada a un partido.');

  const ratings = {};
  const updatedPlayers = players.map((player) => {
    const rawRating = values[player.id];
    if (rawRating === undefined || rawRating === null || rawRating === '') {
      throw new TypeError('Debes puntuar a todos los jugadores.');
    }
    const rating = Number(rawRating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new RangeError('Cada puntuación debe ser un número entero entre 1 y 5.');
    }
    ratings[player.id] = rating;
    return {
      ...player,
      ratingHistory: [
        ...(player.ratingHistory ?? []),
        { matchId: metadata.matchId, date: metadata.date, opponent: metadata.opponent ?? '', rating },
      ],
    };
  });

  return { ratings, players: updatedPlayers };
}

export function shouldAutoPause(phase, elapsedSeconds) {
  if (!Number.isFinite(elapsedSeconds)) return false;
  if (phase === 'first_half') return elapsedSeconds >= 38 * 60;
  if (phase === 'second_half') return elapsedSeconds >= 74 * 60;
  return false;
}

function validatePin(pin) {
  if (!/^\d+$/.test(String(pin))) throw new TypeError('El PIN debe ser numérico.');
  if (String(pin).length < 4 || String(pin).length > 8) throw new RangeError('El PIN debe tener entre 4 y 8 cifras.');
}

export async function hashPin(pin, salt) {
  validatePin(pin);
  if (!salt) throw new TypeError('Falta la sal local del PIN.');
  const bytes = new TextEncoder().encode(`${salt}:${pin}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function verifyPin(pin, salt, expectedDigest) {
  try {
    const actual = await hashPin(pin, salt);
    if (actual.length !== String(expectedDigest ?? '').length) return false;
    let difference = 0;
    for (let index = 0; index < actual.length; index += 1) {
      difference |= actual.charCodeAt(index) ^ expectedDigest.charCodeAt(index);
    }
    return difference === 0;
  } catch {
    return false;
  }
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
