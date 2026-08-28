import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMinuteTargets,
  suggestExcludedPlayers,
  calculatePlayedSeconds,
  validateBackup,
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
