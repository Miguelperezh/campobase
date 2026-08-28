import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMinuteTargets,
  suggestExcludedPlayers,
  calculatePlayedSeconds,
  validateBackup,
  normalizePositions,
  buildCallupSelection,
  buildTrainingRecord,
  buildAttendanceRecord,
  calculateAttendanceStats,
  applySubstitution,
  buildPlayerHistory,
  sortAttendanceRecords,
  suggestDelegateSubstitution,
  shouldSuggestUrgentSubstitution,
  seasonKey,
  accumulateSeasonMinutes,
  shouldAutoPause,
  hashPin,
  verifyPin,
  buildPlayerRatings,
  sortPlayersByName,
  updateRotationCounters,
  calledPlayerOptions,
  adjustLiveScore,
  addPlayerMatchEvent,
  buildPlayerSummary,
} from '../js/domain.js';

test('ordena las fichas alfabéticamente por nombre ignorando mayúsculas y acentos', () => {
  const players = [{ id: '3', name: 'zoe' }, { id: '2', name: 'Álvaro' }, { id: '1', name: 'ana' }];
  assert.deepEqual(sortPlayersByName(players).map(({ id }) => id), ['2', '1', '3']);
  assert.deepEqual(players.map(({ id }) => id), ['3', '2', '1'], 'no debe mutar la lista original');
});

test('recalcula los contadores de rotación al editar una convocatoria', () => {
  const players = [{ id: 'p1', outsideCount: 3 }, { id: 'p2', outsideCount: 0 }];
  const callups = [
    { id: 'c1', createdAt: 10, exclusions: [{ playerId: 'p2', automatic: true }] },
    { id: 'c2', createdAt: 20, exclusions: [{ playerId: 'p2', automatic: true }, { playerId: 'p1', automatic: false }] },
  ];
  assert.deepEqual(updateRotationCounters(players, callups), [
    { id: 'p1', outsideCount: 0, lastExcludedAt: null },
    { id: 'p2', outsideCount: 2, lastExcludedAt: 20 },
  ]);
});

test('reparte exactamente 490 minutos entre 10 disponibles en F7', () => {
  const targets = calculateMinuteTargets(
    Array.from({ length: 10 }, (_, index) => `p${index + 1}`),
    70,
    7,
  );
  assert.equal(targets.reduce((sum, item) => sum + item.minutes, 0), 490);
  assert.deepEqual(targets.map((item) => item.minutes), Array(10).fill(49));
});

test('reparte el resto de minutos sin una diferencia mayor de uno', () => {
  const targets = calculateMinuteTargets(['a', 'b', 'c'], 70, 7);
  assert.equal(targets.reduce((sum, item) => sum + item.minutes, 0), 490);
  assert.ok(Math.max(...targets.map(({ minutes }) => minutes)) - Math.min(...targets.map(({ minutes }) => minutes)) <= 1);
});

test('rechaza un reparto imposible sin jugadores disponibles', () => {
  assert.throws(() => calculateMinuteTargets([], 70, 7), /disponible/i);
});

test('propone dejar fuera primero a quienes menos veces han quedado fuera', () => {
  const players = [
    { id: 'a', name: 'Ana', outsideCount: 2, lastExcludedAt: 5 },
    { id: 'b', name: 'Biel', outsideCount: 0, lastExcludedAt: null },
    { id: 'c', name: 'Cris', outsideCount: 1, lastExcludedAt: 4 },
    { id: 'd', name: 'Dani', outsideCount: 0, lastExcludedAt: 8 },
  ];
  assert.deepEqual(suggestExcludedPlayers(players, 2).map(({ id }) => id), ['b', 'd']);
});

test('desempata la rotación por quien lleva más tiempo sin quedar fuera', () => {
  const players = [
    { id: 'a', name: 'Ana', outsideCount: 1, lastExcludedAt: 9 },
    { id: 'b', name: 'Biel', outsideCount: 1, lastExcludedAt: 2 },
    { id: 'c', name: 'Cris', outsideCount: 1, lastExcludedAt: null },
  ];
  assert.deepEqual(suggestExcludedPlayers(players, 2).map(({ id }) => id), ['c', 'b']);
});

test('calcula minutos reales mediante entradas y salidas', () => {
  const seconds = calculatePlayedSeconds(
    ['a', 'b'],
    [
      { second: 600, outIds: ['a'], inIds: ['c'] },
      { second: 1200, outIds: ['b'], inIds: ['a'] },
    ],
    2100,
  );
  assert.deepEqual(seconds, { a: 1500, b: 1200, c: 1500 });
});

test('valida una copia compatible y rechaza estructuras peligrosas o incompletas', () => {
  const valid = {
    app: 'CampoBase', version: 1, exportedAt: '2026-08-28T10:00:00.000Z',
    data: { players: [], callups: [], matches: [], trainings: [], settings: [] },
  };
  assert.deepEqual(validateBackup(valid), valid);
  assert.throws(() => validateBackup({ ...valid, app: 'Otra' }), /CampoBase/);
  assert.throws(() => validateBackup({ ...valid, data: { players: [] } }), /incompleta/i);
});

test('normaliza varias posiciones y migra la posición única anterior', () => {
  assert.deepEqual(normalizePositions({ positions: ['Central', 'Lateral derecho', 'Central'] }), ['Central', 'Lateral derecho']);
  assert.deepEqual(normalizePositions({ position: 'Portero' }), ['Portero']);
  assert.deepEqual(normalizePositions({}), []);
});

test('completa una convocatoria de liga hasta 14 respetando inclusiones, exclusiones y rotación justa', () => {
  const players = Array.from({ length: 17 }, (_, index) => ({
    id: `p${index + 1}`,
    name: `Jugador ${index + 1}`,
    outsideCount: index,
    lastExcludedAt: index,
  }));
  const result = buildCallupSelection(players, {
    matchType: 'league',
    selectedIds: ['p1'],
    manualExclusions: [{ playerId: 'p17', reason: 'sick' }],
  });
  assert.equal(result.availableIds.length, 14);
  assert.ok(result.availableIds.includes('p1'));
  assert.ok(!result.availableIds.includes('p17'));
  assert.deepEqual(result.exclusions.find(({ playerId }) => playerId === 'p17'), { playerId: 'p17', reason: 'sick', automatic: false });
  assert.equal(result.exclusions.filter(({ automatic }) => automatic).length, 2);
});

test('la convocatoria automática ignora fichas duplicadas y completa 14 jugadores únicos', () => {
  const uniquePlayers = Array.from({ length: 16 }, (_, index) => ({
    id: `p${index + 1}`,
    name: `Jugador ${index + 1}`,
    outsideCount: index,
  }));
  const result = buildCallupSelection([...uniquePlayers, uniquePlayers[0]], {
    matchType: 'league',
    selectedIds: ['p1'],
  });
  assert.equal(result.availableIds.length, 14);
  assert.equal(new Set(result.availableIds).size, 14);
  assert.equal(result.exclusions.filter(({ automatic }) => automatic).length, 2);
});

test('una decisión de rotación pendiente conserva provisionalmente el máximo de 14', () => {
  const players = Array.from({ length: 15 }, (_, index) => ({
    id: `p${index + 1}`,
    name: `Jugador ${index + 1}`,
    outsideCount: index,
  }));
  const protectedHistories = { p1: [{ reason: 'sick', date: '2026-09-01' }] };
  const result = buildCallupSelection(players, { protectedHistories });
  assert.equal(result.availableIds.length, 14);
  assert.deepEqual(result.pendingRotationDecisions, [{ playerId: 'p1', history: protectedHistories.p1 }]);
});

test('en amistosos y torneos convoca a todos sin rotación y mantiene el máximo de 14', () => {
  const fourteen = Array.from({ length: 14 }, (_, index) => ({ id: `p${index + 1}` }));
  assert.deepEqual(buildCallupSelection(fourteen, { matchType: 'friendly' }).availableIds, fourteen.map(({ id }) => id));
  assert.throws(
    () => buildCallupSelection([...fourteen, { id: 'p15' }], { matchType: 'tournament' }),
    /máximo de 14/i,
  );
});

test('construye una asistencia conservando estado y notas por jugador', () => {
  const values = {
    date: '2026-09-02',
    notes: 'Trabajo defensivo',
    'status-a': 'late',
    'note-a': 'Cinco minutos tarde',
    'status-b': 'absent',
    'note-b': 'Enfermo',
  };
  assert.deepEqual(buildTrainingRecord([{ id: 'a' }, { id: 'b' }], values, { id: 't1', createdAt: 123 }), {
    id: 't1',
    date: '2026-09-02',
    notes: 'Trabajo defensivo',
    attendance: [
      { playerId: 'a', status: 'late', arrivalTime: '', note: 'Cinco minutos tarde' },
      { playerId: 'b', status: 'absent', arrivalTime: '', note: 'Enfermo' },
    ],
    createdAt: 123,
  });
});

test('construye una asistencia vinculada a un partido', () => {
  const record = buildAttendanceRecord(
    [{ id: 'a' }, { id: 'b' }],
    { date: '2026-09-05', 'status-a': 'present', 'status-b': 'late', 'note-b': 'Atasco' },
    { id: 'r1', kind: 'match', matchId: 'm1', createdAt: 456 },
  );
  assert.equal(record.kind, 'match');
  assert.equal(record.matchId, 'm1');
  assert.deepEqual(record.attendance[1], { playerId: 'b', status: 'late', arrivalTime: '', note: 'Atasco' });
});

test('calcula ausencias, rachas y tardanzas del historial de un jugador', () => {
  const records = [
    { id: '1', kind: 'training', date: '2026-09-01', attendance: [{ playerId: 'a', status: 'present' }] },
    { id: '2', kind: 'training', date: '2026-09-02', attendance: [{ playerId: 'a', status: 'absent' }] },
    { id: '3', kind: 'training', date: '2026-09-03', attendance: [{ playerId: 'a', status: 'absent' }] },
    { id: '4', kind: 'match', date: '2026-09-04', attendance: [{ playerId: 'a', status: 'late' }] },
    { id: '5', kind: 'training', date: '2026-09-05', attendance: [{ playerId: 'a', status: 'late' }] },
    { id: '6', kind: 'training', date: '2026-09-06', attendance: [{ playerId: 'a', status: 'late' }] },
  ];
  assert.deepEqual(calculateAttendanceStats('a', records), {
    totalRecords: 6,
    totalAbsences: 2,
    trainingAbsences: 2,
    matchAbsences: 0,
    currentTrainingAbsenceStreak: 0,
    longestTrainingAbsenceStreak: 2,
    lateCount: 3,
    oftenLate: true,
  });
});

test('aplica un cambio manual de uno a tres jugadores sin alterar el tamaño del equipo', () => {
  assert.deepEqual(applySubstitution(['a', 'b'], ['a'], ['c'], ['a', 'b', 'c']), ['b', 'c']);
  assert.throws(() => applySubstitution(['a', 'b'], ['a'], ['c', 'd'], ['a', 'b', 'c', 'd']), /mismo número/i);
  assert.throws(() => applySubstitution(['a', 'b'], ['a'], ['x'], ['a', 'b', 'c']), /convocado/i);
});

test('la rotación pide decisión si al jugador ya le dejaron fuera por enfermedad o decisión técnica', () => {
  const players = [
    { id: 'a', name: 'Ana', outsideCount: 0 },
    { id: 'b', name: 'Biel', outsideCount: 1 },
    { id: 'c', name: 'Cris', outsideCount: 2 },
  ];
  const protectedHistories = { a: [{ reason: 'sick', date: '2026-09-01' }] };
  const pending = buildCallupSelection(players, { limit: 2, protectedHistories });
  assert.deepEqual(pending.pendingRotationDecisions, [{ playerId: 'a', history: protectedHistories.a }]);
  assert.equal(pending.availableIds.length, 2);
  assert.deepEqual(pending.exclusions.find(({ playerId }) => playerId === 'a'), { playerId: 'a', reason: 'rotation', automatic: true });
});

test('si el entrenador mantiene dentro al jugador protegido, deja fuera al siguiente de la rotación', () => {
  const players = [
    { id: 'a', name: 'Ana', outsideCount: 0 },
    { id: 'b', name: 'Biel', outsideCount: 1 },
    { id: 'c', name: 'Cris', outsideCount: 2 },
  ];
  const protectedHistories = { a: [{ reason: 'coach_decision', date: '2026-09-01' }] };
  const result = buildCallupSelection(players, {
    limit: 2,
    protectedHistories,
    rotationDecisions: { a: 'include' },
  });
  assert.deepEqual(result.pendingRotationDecisions, []);
  assert.deepEqual(result.exclusions.map(({ playerId }) => playerId), ['b']);
});

test('guarda la hora de llegada únicamente cuando el jugador llega tarde', () => {
  const record = buildTrainingRecord(
    [{ id: 'a' }, { id: 'b' }],
    {
      date: '2026-09-02',
      'status-a': 'late', 'arrivalTime-a': '18:17', 'note-a': 'Atasco',
      'status-b': 'present', 'arrivalTime-b': '18:20', 'note-b': 'Bien',
    },
    { id: 't2', createdAt: 123 },
  );
  assert.equal(record.attendance[0].arrivalTime, '18:17');
  assert.equal(record.attendance[1].arrivalTime, '');
});

test('ordena asistencias por fecha y conserva el orden de creación en fechas iguales', () => {
  const records = [
    { id: 'new', date: '2026-09-03', createdAt: 3 },
    { id: 'old-second', date: '2026-08-20', createdAt: 2 },
    { id: 'old-first', date: '2026-08-20', createdAt: 1 },
  ];
  assert.deepEqual(sortAttendanceRecords(records).map(({ id }) => id), ['new', 'old-second', 'old-first']);
});

test('reúne en la ficha del jugador incidencias, comentarios y motivos de convocatorias', () => {
  const history = buildPlayerHistory('a', [
    { id: 't1', kind: 'training', date: '2026-09-02', notes: 'Carga suave', attendance: [{ playerId: 'a', status: 'late', arrivalTime: '18:17', note: 'Atasco' }] },
  ], [
    { id: 'c1', date: '2026-09-03', exclusions: [{ playerId: 'a', reason: 'sick', automatic: false }] },
  ]);
  assert.equal(history.length, 2);
  assert.deepEqual(history.map(({ type }) => type), ['callup', 'attendance']);
  assert.match(history[0].detail, /sick/);
  assert.match(history[1].detail, /Atasco/);
});

test('sugiere meter al que menos ha jugado y sacar al que más lleva', () => {
  const suggestion = suggestDelegateSubstitution(
    ['a', 'b'], ['c', 'd'],
    { a: 1200, b: 900, c: 300, d: 600 },
    1,
  );
  assert.deepEqual(suggestion, { outIds: ['a'], inIds: ['c'] });
});

test('avisa de cambio urgente si quedan diez minutos o menos y alguien lleva ocho o menos', () => {
  assert.equal(shouldSuggestUrgentSubstitution(['c'], { c: 480 }, 600), true);
  assert.equal(shouldSuggestUrgentSubstitution(['c'], { c: 481 }, 600), false);
  assert.equal(shouldSuggestUrgentSubstitution(['c'], { c: 480 }, 601), false);
});

test('la vista delegado puede registrar siete cambios simultáneos de forma explícita', () => {
  const field = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const bench = ['h', 'i', 'j', 'k', 'l', 'm', 'n'];
  assert.deepEqual(applySubstitution(field, field, bench, [...field, ...bench], 7), bench);
});

test('acumula los minutos en la temporada de la fecha y conserva el motivo de menos minutos', () => {
  const player = accumulateSeasonMinutes(
    { id: 'a', totalMinutes: 10, seasonMinutes: { '2025-2026': 10 }, minuteReasons: [] },
    '2026-09-12T13:00',
    1850,
    { matchId: 'm1', reason: 'illness' },
  );
  assert.equal(seasonKey('2026-06-30'), '2025-2026');
  assert.equal(seasonKey('2026-07-01'), '2026-2027');
  assert.equal(player.totalMinutes, 41);
  assert.equal(player.seasonMinutes['2026-2027'], 31);
  assert.deepEqual(player.minuteReasons, [{ matchId: 'm1', date: '2026-09-12T13:00', season: '2026-2027', reason: 'illness' }]);
  assert.throws(() => accumulateSeasonMinutes(player, '2026-09-12', 60, { reason: 'otro' }), /motivo/i);
});

test('indica la pausa automática exactamente en 38 y 74 minutos', () => {
  assert.equal(shouldAutoPause('first_half', 2279), false);
  assert.equal(shouldAutoPause('first_half', 2280), true);
  assert.equal(shouldAutoPause('second_half', 4439), false);
  assert.equal(shouldAutoPause('second_half', 4440), true);
  assert.equal(shouldAutoPause('halftime', 9999), false);
});

test('protege los dos accesos con PIN validado y hash salado', async () => {
  const digest = await hashPin('2468', 'sal-local');
  assert.notEqual(digest, '2468');
  assert.equal(await verifyPin('2468', 'sal-local', digest), true);
  assert.equal(await verifyPin('2469', 'sal-local', digest), false);
  await assert.rejects(() => hashPin('12', 'sal-local'), /4 y 8/);
  await assert.rejects(() => hashPin('abcd', 'sal-local'), /numérico/i);
});

test('Migue puntúa del 1 al 5 y la nota queda en el historial de cada jugador', () => {
  const result = buildPlayerRatings(
    [{ id: 'a', ratingHistory: [] }, { id: 'b' }],
    { a: '5', b: '3' },
    { role: 'owner', matchId: 'm1', date: '2026-09-12T13:00', opponent: 'Atlético Base' },
  );

  assert.deepEqual(result.ratings, { a: 5, b: 3 });
  assert.deepEqual(result.players[0].ratingHistory, [
    { matchId: 'm1', date: '2026-09-12T13:00', opponent: 'Atlético Base', rating: 5 },
  ]);
  assert.deepEqual(result.players[1].ratingHistory, [
    { matchId: 'm1', date: '2026-09-12T13:00', opponent: 'Atlético Base', rating: 3 },
  ]);
});

test('el delegado no puede puntuar y se rechazan notas incompletas o fuera de 1 a 5', () => {
  const players = [{ id: 'a' }, { id: 'b' }];
  const metadata = { matchId: 'm1', date: '2026-09-12T13:00', opponent: 'Atlético Base' };

  assert.throws(() => buildPlayerRatings(players, { a: '5', b: '3' }, { ...metadata, role: 'delegate' }), /Solo Migue/i);
  assert.throws(() => buildPlayerRatings(players, { a: '5' }, { ...metadata, role: 'owner' }), /todos los jugadores/i);
  assert.throws(() => buildPlayerRatings(players, { a: '5', b: '6' }, { ...metadata, role: 'owner' }), /entre 1 y 5/i);
});

test('los selectores de portero incluyen a todos los convocados aunque no tengan posición de portero', () => {
  const players = [
    { id: 'a', name: 'Ana', positions: ['Central'] },
    { id: 'b', name: 'Biel', positions: ['Portero'] },
    { id: 'c', name: 'Cris', positions: ['Extremo'] },
  ];
  assert.deepEqual(calledPlayerOptions(players, ['c', 'a']), [
    { id: 'c', name: 'Cris' },
    { id: 'a', name: 'Ana' },
  ]);
});

test('el marcador suma y resta goles y mantiene los goleadores coherentes', () => {
  const initial = { goalsFor: 0, goalsAgainst: 0, goals: [], cards: [], injuries: [], incidents: [] };
  const scored = addPlayerMatchEvent(initial, { id: 'g1', kind: 'goal', playerId: 'a', second: 90, note: '' });
  const rivalScored = adjustLiveScore(scored, 'against', 1);
  assert.equal(scored.goalsFor, 1);
  assert.deepEqual(scored.goals, [{ id: 'g1', playerId: 'a', second: 90, note: '' }]);
  assert.equal(rivalScored.goalsAgainst, 1);
  const corrected = adjustLiveScore(rivalScored, 'for', -1);
  assert.equal(corrected.goalsFor, 0);
  assert.deepEqual(corrected.goals, []);
  assert.equal(adjustLiveScore(corrected, 'against', -4).goalsAgainst, 0);
});

test('la ficha resume goles, tarjetas, lesiones, incidencias, asistencia, minutos y puntuaciones', () => {
  const matches = [{
    id: 'm1', date: '2026-09-12T13:00', opponent: 'Atlético Base', status: 'finished',
    minuteTotals: { a: 1860 }, ratings: { a: 4 },
    goals: [{ playerId: 'a' }, { playerId: 'a' }],
    cards: [{ playerId: 'a', type: 'yellow' }, { playerId: 'a', type: 'red' }],
    injuries: [{ playerId: 'a', note: 'Golpe' }], incidents: [{ playerId: 'a', note: 'Discusión' }],
  }];
  const attendance = [
    { id: 't1', kind: 'training', attendance: [{ playerId: 'a', status: 'late' }] },
    { id: 't2', kind: 'training', attendance: [{ playerId: 'a', status: 'absent' }] },
  ];
  const callups = [
    { id: 'c1', availableIds: ['a'], exclusions: [] },
    { id: 'c2', availableIds: [], exclusions: [{ playerId: 'a', reason: 'rotation', automatic: true }] },
  ];
  assert.deepEqual(buildPlayerSummary('a', matches, attendance, callups), {
    goals: 2, yellowCards: 1, redCards: 1, injuries: 1, incidents: 1,
    callups: 1, notCalled: 1, rotations: 1, present: 0, late: 1, absent: 1,
    minutes: 31, ratings: 1, averageRating: 4,
  });
  const history = buildPlayerHistory('a', attendance, callups, matches);
  assert.ok(history.some(({ detail }) => /Gol x2/.test(detail)));
  assert.ok(history.some(({ detail }) => /Golpe/.test(detail)));
  assert.ok(history.some(({ detail }) => /Discusión/.test(detail)));
});
