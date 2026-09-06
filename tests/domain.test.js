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
  suggestRepartoSubstitutions,
  summarizeMinuteTargets,
  shouldSuggestUrgentSubstitution,
  seasonKey,
  accumulateSeasonMinutes,
  isPreseasonMatch,
  shouldAutoPause,
  hashPin,
  verifyPin,
  buildPlayerRatings,
  replacePlayerRatings,
  sortPlayersByName,
  sortPlayersBySquadNumber,
  updateRotationCounters,
  calledPlayerOptions,
  adjustLiveScore,
  addPlayerMatchEvent,
  buildPlayerSummary,
  applyPlayerStatAdjustments,
  setPlayerStatTotals,
  removeMatchFromPlayerStats,
  derivePlayerMatchStats,
  buildPlayerRecord,
} from '../js/domain.js';

test('ordena las fichas alfabéticamente por nombre ignorando mayúsculas y acentos', () => {
  const players = [{ id: '3', name: 'zoe' }, { id: '2', name: 'Álvaro' }, { id: '1', name: 'ana' }];
  assert.deepEqual(sortPlayersByName(players).map(({ id }) => id), ['2', '1', '3']);
  assert.deepEqual(players.map(({ id }) => id), ['3', '2', '1'], 'no debe mutar la lista original');
});

test('ordena la plantilla por dorsal y deja al final los jugadores que aún no lo tienen', () => {
  const players = [
    { id: 'sin-2', name: 'Álvaro', number: '' },
    { id: '12', name: 'Doce', number: '12' },
    { id: '1', name: 'Uno', number: '1' },
    { id: 'sin-1', name: 'Ana', number: '' },
  ];
  assert.deepEqual(sortPlayersBySquadNumber(players).map(({ id }) => id), ['1', '12', 'sin-2', 'sin-1']);
  assert.deepEqual(players.map(({ id }) => id), ['sin-2', '12', '1', 'sin-1'], 'no debe mutar la lista original');
});

test('guarda la pierna dominante aunque el jugador todavía no tenga posición', () => {
  const player = buildPlayerRecord({
    id: 'p1',
    name: 'Aitor Navarro',
    number: '',
    foot: 'Izquierda',
    notes: '',
  }, [], null, '', 1_788_272_000_000);

  assert.equal(player.foot, 'Izquierda');
  assert.deepEqual(player.positions, []);
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

test('con un portero, este juega el partido completo y el resto se reparte entre los de campo', () => {
  const ids = ['gk', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  const targets = calculateMinuteTargets(ids, 70, 7, ['gk']);
  const byId = Object.fromEntries(targets.map((t) => [t.playerId, t.minutes]));
  assert.equal(byId.gk, 70);
  // 9 jugadores de campo reparten 420 minutos (70 * 6 plazas de campo).
  const field = ids.filter((id) => id !== 'gk');
  assert.equal(field.reduce((sum, id) => sum + byId[id], 0), 420);
  assert.equal(targets.reduce((sum, t) => sum + t.minutes, 0), 490);
});

test('con dos porteros, cada uno juega un tiempo (35 min) y el resto se reparte entre los de campo', () => {
  const ids = ['gk1', 'gk2', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const targets = calculateMinuteTargets(ids, 70, 7, ['gk1', 'gk2']);
  const byId = Object.fromEntries(targets.map((t) => [t.playerId, t.minutes]));
  assert.equal(byId.gk1, 35);
  assert.equal(byId.gk2, 35);
  const field = ids.filter((id) => id !== 'gk1' && id !== 'gk2');
  assert.equal(field.reduce((sum, id) => sum + byId[id], 0), 420);
  assert.equal(targets.reduce((sum, t) => sum + t.minutes, 0), 490);
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

test('conserva la explicación cuando una exclusión manual usa Otro motivo', () => {
  const result = buildCallupSelection([{ id: 'p1' }, { id: 'p2' }], {
    matchType: 'friendly',
    manualExclusions: [{ playerId: 'p2', reason: 'other', note: 'Viaje familiar' }],
  });
  assert.deepEqual(result.exclusions, [{ playerId: 'p2', reason: 'other', note: 'Viaje familiar', automatic: false }]);
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

test('resume los objetivos de minutos agrupando cuántos jugadores tienen cada objetivo', () => {
  const targets = [
    { playerId: 'a', minutes: 33 },
    { playerId: 'b', minutes: 33 },
    { playerId: 'c', minutes: 32 },
  ];
  assert.deepEqual(summarizeMinuteTargets(targets), [
    { minutes: 33, count: 2 },
    { minutes: 32, count: 1 },
  ]);
});

test('el resumen de objetivos ordena de mayor a menor minutos', () => {
  const targets = [
    { playerId: 'a', minutes: 32 },
    { playerId: 'b', minutes: 34 },
    { playerId: 'c', minutes: 33 },
  ];
  assert.deepEqual(summarizeMinuteTargets(targets), [
    { minutes: 34, count: 1 },
    { minutes: 33, count: 1 },
    { minutes: 32, count: 1 },
  ]);
});

test('propone todos los cambios necesarios para que cada convocado alcance su objetivo', () => {
  // 7 en campo, 3 en banquillo. Objetivo 33 min (1980 s) para todos.
  const onField = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const bench = ['h', 'i', 'j'];
  const played = { a: 2400, b: 2400, c: 2400, d: 2400, e: 2400, f: 2400, g: 2400, h: 0, i: 0, j: 0 };
  const targets = [
    { playerId: 'a', minutes: 33 }, { playerId: 'b', minutes: 33 }, { playerId: 'c', minutes: 33 },
    { playerId: 'd', minutes: 33 }, { playerId: 'e', minutes: 33 }, { playerId: 'f', minutes: 33 },
    { playerId: 'g', minutes: 33 }, { playerId: 'h', minutes: 33 }, { playerId: 'i', minutes: 33 },
    { playerId: 'j', minutes: 33 },
  ];
  const result = suggestRepartoSubstitutions(onField, bench, played, targets);
  // Los tres del banquillo van por debajo y deben entrar; salen los tres que más llevan.
  assert.deepEqual(result.inIds.sort(), ['h', 'i', 'j']);
  assert.equal(result.outIds.length, 3);
});

test('no propone cambios si todos los convocados ya alcanzan su objetivo', () => {
  const onField = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const bench = ['h', 'i', 'j'];
  const played = { a: 1980, b: 1980, c: 1980, d: 1980, e: 1980, f: 1980, g: 1980, h: 1980, i: 1980, j: 1980 };
  const targets = onField.concat(bench).map((playerId) => ({ playerId, minutes: 33 }));
  const result = suggestRepartoSubstitutions(onField, bench, played, targets);
  assert.deepEqual(result, { outIds: [], inIds: [] });
});

test('el reparto nunca propone sacar ni meter al portero', () => {
  const onField = ['gk', 'a', 'b', 'c', 'd', 'e', 'f'];
  const bench = ['h', 'i', 'j'];
  const played = { gk: 2400, a: 2400, b: 2400, c: 2400, d: 2400, e: 2400, f: 2400, h: 0, i: 0, j: 0 };
  const targets = [
    { playerId: 'gk', minutes: 70 },
    { playerId: 'a', minutes: 33 }, { playerId: 'b', minutes: 33 }, { playerId: 'c', minutes: 33 },
    { playerId: 'd', minutes: 33 }, { playerId: 'e', minutes: 33 }, { playerId: 'f', minutes: 33 },
    { playerId: 'h', minutes: 33 }, { playerId: 'i', minutes: 33 }, { playerId: 'j', minutes: 33 },
  ];
  const result = suggestRepartoSubstitutions(onField, bench, played, targets, ['gk']);
  assert.ok(!result.outIds.includes('gk'), 'el portero no sale');
  assert.ok(!result.inIds.includes('gk'), 'el portero no entra');
});

test('el cambio automático nunca propone sacar al portero', () => {
  const onField = ['gk', 'a', 'b', 'c', 'd', 'e', 'f'];
  const bench = ['h', 'i', 'j'];
  const played = { gk: 2400, a: 2400, b: 2400, c: 2400, d: 2400, e: 2400, f: 2400, h: 0, i: 0, j: 0 };
  const result = suggestDelegateSubstitution(onField, bench, played, 3, ['gk']);
  assert.ok(!result.outIds.includes('gk'), 'el portero no sale en el automático');
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

test('los minutos de pretemporada (amistoso/torneo) se guardan aparte de la liga', () => {
  const player = accumulateSeasonMinutes(
    { id: 'a', totalMinutes: 0, seasonMinutes: {}, preseasonMinutes: {}, minuteReasons: [] },
    '2026-08-20T18:00',
    2100,
    { matchId: 'm2', reason: 'sin_indicar', preseason: true },
  );
  assert.equal(player.totalMinutes, 35);
  assert.equal(player.seasonMinutes['2026-2027'], undefined);
  assert.equal(player.preseasonMinutes['2026-2027'], 35);
});

test('isPreseasonMatch reconoce amistoso y torneo como pretemporada', () => {
  assert.equal(isPreseasonMatch({ type: 'friendly' }), true);
  assert.equal(isPreseasonMatch({ type: 'tournament' }), true);
  assert.equal(isPreseasonMatch({ type: 'league' }), false);
  assert.equal(isPreseasonMatch({}), false);
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

test('la demo puede completar y puntuar su partido temporal como Migue', () => {
  const players = [{ id: 'p1', name: 'Jugador demo', ratingHistory: [] }];
  const result = buildPlayerRatings(players, { p1: '4' }, {
    role: 'demo', matchId: 'm-demo', date: '2026-09-01', opponent: 'Rival demo',
  });

  assert.equal(result.ratings.p1, 4);
  assert.equal(result.players[0].ratingHistory[0].matchId, 'm-demo');
});

test('reemplaza la nota de un partido ya puntuado sin duplicar el historial', () => {
  const players = [{
    id: 'a',
    ratingHistory: [{ matchId: 'm1', date: '2026-09-12T13:00', opponent: 'Atlético Base', rating: 3 }],
  }];
  const result = replacePlayerRatings(players, { a: '5' }, { role: 'owner', matchId: 'm1', date: '2026-09-12T13:00', opponent: 'Atlético Base' });

  assert.deepEqual(result.ratings, { a: 5 });
  assert.equal(result.players[0].ratingHistory.length, 1);
  assert.equal(result.players[0].ratingHistory[0].rating, 5);
});

test('reemplazar la nota exige ser Migue y una nota válida', () => {
  const players = [{ id: 'a', ratingHistory: [{ matchId: 'm1', date: '2026-09-12T13:00', opponent: 'X', rating: 3 }] }];
  const metadata = { matchId: 'm1', date: '2026-09-12T13:00', opponent: 'X' };
  assert.throws(() => replacePlayerRatings(players, { a: '5' }, { ...metadata, role: 'delegate' }), /Solo Migue/i);
  assert.throws(() => replacePlayerRatings(players, { a: '9' }, { ...metadata, role: 'owner' }), /entre 1 y 5/i);
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

test('separa las mismas estadísticas del jugador entre liga y pretemporada', () => {
  const matches = [
    { id: 'liga', type: 'league', minuteTotals: { a: 1800 }, ratings: { a: 4 }, goals: [{ playerId: 'a' }], cards: [{ playerId: 'a', type: 'yellow' }] },
    { id: 'amistoso', type: 'friendly', minuteTotals: { a: 1200 }, ratings: { a: 5 }, goals: [{ playerId: 'a' }, { playerId: 'a' }], cards: [{ playerId: 'a', type: 'red' }] },
    { id: 'torneo', type: 'tournament', minuteTotals: { a: 600 }, ratings: { a: 3 }, goals: [], cards: [{ playerId: 'a', type: 'yellow' }] },
  ];
  const callups = [
    { matchId: 'liga', matchType: 'league', availableIds: ['a'], exclusions: [] },
    { matchId: 'amistoso', matchType: 'friendly', availableIds: ['a'], exclusions: [] },
    { matchId: 'torneo', matchType: 'tournament', availableIds: [], exclusions: [{ playerId: 'a', automatic: true }] },
    { matchId: 'partido-ya-borrado', matchType: 'league', availableIds: ['a'], exclusions: [{ playerId: 'a', automatic: true }] },
  ];
  const attendance = [
    { id: 'a-liga', matchId: 'liga', kind: 'match', attendance: [{ playerId: 'a', status: 'late' }] },
    { id: 'a-amistoso', matchId: 'amistoso', kind: 'match', attendance: [{ playerId: 'a', status: 'absent' }] },
  ];
  const league = buildPlayerSummary('a', matches, attendance, callups, 'league');
  const preseason = buildPlayerSummary('a', matches, attendance, callups, 'preseason');
  assert.deepEqual(
    { goals: league.goals, yellowCards: league.yellowCards, redCards: league.redCards, callups: league.callups, rotations: league.rotations, late: league.late, absent: league.absent, minutes: league.minutes, averageRating: league.averageRating },
    { goals: 1, yellowCards: 1, redCards: 0, callups: 1, rotations: 0, late: 1, absent: 0, minutes: 30, averageRating: 4 },
  );
  assert.deepEqual(
    { goals: preseason.goals, yellowCards: preseason.yellowCards, redCards: preseason.redCards, callups: preseason.callups, rotations: preseason.rotations, late: preseason.late, absent: preseason.absent, minutes: preseason.minutes, averageRating: preseason.averageRating },
    { goals: 2, yellowCards: 1, redCards: 1, callups: 1, rotations: 1, late: 0, absent: 1, minutes: 30, averageRating: 4 },
  );
});

test('permite fijar todos los totales visibles mediante correcciones sin cambiar el resumen automático', () => {
  const automatic = { goals: 2, yellowCards: 1, redCards: 0, injuries: 1, incidents: 0, callups: 3, rotations: 1, late: 2, absent: 1, minutes: 90, ratings: 2, averageRating: 4 };
  const player = setPlayerStatTotals({ id: 'a' }, 'preseason', automatic, {
    goals: '5', yellowCards: '3', redCards: '1', injuries: '2', incidents: '4',
    callups: '7', rotations: '2', late: '3', absent: '2', minutes: '125', averageRating: '4.5',
  });
  assert.deepEqual(automatic, { goals: 2, yellowCards: 1, redCards: 0, injuries: 1, incidents: 0, callups: 3, rotations: 1, late: 2, absent: 1, minutes: 90, ratings: 2, averageRating: 4 });
  assert.deepEqual(applyPlayerStatAdjustments(automatic, player.statAdjustments.preseason), {
    ...automatic, goals: 5, yellowCards: 3, redCards: 1, injuries: 2, incidents: 4,
    callups: 7, rotations: 2, late: 3, absent: 2, minutes: 125, averageRating: 4.5,
  });
  assert.equal(player.statAdjustments.league, undefined);
  assert.throws(() => setPlayerStatTotals(player, 'league', automatic, { goals: '-1' }), /no negativa/);
  assert.throws(() => setPlayerStatTotals(player, 'league', automatic, { averageRating: '5.1' }), /entre 0 y 5/);
});

test('al borrar un partido elimina solo sus minutos, puntuación y motivos guardados en el jugador', () => {
  const player = {
    id: 'a', totalMinutes: 50, seasonMinutes: { '2026-2027': 40 }, preseasonMinutes: { '2026-2027': 10 },
    ratingHistory: [{ matchId: 'borrado', rating: 4 }, { matchId: 'conservado', rating: 5 }],
    minuteReasons: [{ matchId: 'borrado', reason: 'sin_indicar' }, { matchId: 'conservado', reason: 'illness' }],
  };
  const result = removeMatchFromPlayerStats(player, {
    id: 'borrado', type: 'league', date: '2026-09-12T13:00', minuteTotals: { a: 1200 },
  });
  assert.equal(result.totalMinutes, 30);
  assert.deepEqual(result.seasonMinutes, { '2026-2027': 20 });
  assert.deepEqual(result.preseasonMinutes, { '2026-2027': 10 });
  assert.deepEqual(result.ratingHistory, [{ matchId: 'conservado', rating: 5 }]);
  assert.deepEqual(result.minuteReasons, [{ matchId: 'conservado', reason: 'illness' }]);
  assert.equal(player.totalMinutes, 50, 'no debe mutar la ficha original');

  const onlyMatch = removeMatchFromPlayerStats({
    id: 'a', totalMinutes: 20, seasonMinutes: { '2026-2027': 20 },
    ratingHistory: [{ matchId: 'único', rating: 4 }], minuteReasons: [],
  }, { id: 'único', type: 'league', date: '2026-09-12T13:00', minuteTotals: { a: 1200 } }, []);
  assert.equal(onlyMatch.totalMinutes, 0);
  assert.deepEqual(onlyMatch.seasonMinutes, {});
  assert.deepEqual(onlyMatch.ratingHistory, []);

  const legacyPreseason = removeMatchFromPlayerStats({
    id: 'a', totalMinutes: 10, seasonMinutes: { '2026-2027': 10 }, preseasonMinutes: {},
    ratingHistory: [{ matchId: 'amistoso-antiguo', rating: 3 }], minuteReasons: [],
  }, { id: 'amistoso-antiguo', type: 'friendly', date: '2026-08-20T18:00', minuteTotals: { a: 600 } }, []);
  assert.equal(legacyPreseason.totalMinutes, 0);
  assert.deepEqual(legacyPreseason.seasonMinutes, {});
  assert.deepEqual(legacyPreseason.preseasonMinutes, {});
});

test('reconstruye minutos y puntuaciones solo desde los partidos que todavía existen', () => {
  const derived = derivePlayerMatchStats('a', [
    { id: 'liga', type: 'league', date: '2026-09-12T13:00', opponent: 'Liga', minuteTotals: { a: 1200 }, ratings: { a: 4 }, minuteReasons: { a: 'sin_indicar' } },
    { id: 'amistoso', type: 'friendly', date: '2026-08-20T18:00', opponent: 'Amistoso', minuteTotals: { a: 600 }, ratings: { a: 5 } },
  ]);
  assert.deepEqual(derived.seasonMinutes, { '2026-2027': 20 });
  assert.deepEqual(derived.preseasonMinutes, { '2026-2027': 10 });
  assert.equal(derived.totalMinutes, 30);
  assert.deepEqual(derived.ratingHistory.map(({ matchId, rating }) => ({ matchId, rating })), [
    { matchId: 'liga', rating: 4 }, { matchId: 'amistoso', rating: 5 },
  ]);
  assert.deepEqual(derived.minuteReasons, [{ matchId: 'liga', date: '2026-09-12T13:00', season: '2026-2027', reason: 'sin_indicar' }]);
});
