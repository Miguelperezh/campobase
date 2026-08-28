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
} from '../js/domain.js';

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
      { playerId: 'a', status: 'late', note: 'Cinco minutos tarde' },
      { playerId: 'b', status: 'absent', note: 'Enfermo' },
    ],
    createdAt: 123,
  });
});
