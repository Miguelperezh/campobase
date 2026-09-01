import test from 'node:test';
import assert from 'node:assert/strict';
import { planSquadSeed } from '../js/squad-seed.js';

const EXPECTED_NAMES = [
  'Thiago Hernández',
  'Javier Navarro',
  'Ignacio Poladura',
  'Eidan Asensio',
  'Nicolás Díaz-Saavedra',
  'Alejandro Suárez',
  'Pelayo Marrero',
  'Alejandro Pedrós',
  'Diego Andrés Anaya',
  'Rodrigo Rodríguez',
  'Aitor Navarro',
  'Ramiro Casati',
  'Miguel',
];

test('precarga los 13 jugadores de Unión Viera cuando la plantilla está vacía', () => {
  const plan = planSquadSeed([], 1_788_268_816_000);

  assert.deepEqual(plan.players.map(({ id }) => id), EXPECTED_NAMES.map((_, index) => `p${String(index + 1).padStart(2, '0')}`));
  assert.deepEqual(plan.players.map(({ name }) => name), EXPECTED_NAMES);
  assert.deepEqual(plan.players.find(({ id }) => id === 'p12'), {
    id: 'p12',
    name: 'Ramiro Casati',
    number: '1',
    positions: ['Portero'],
    foot: '',
    notes: '',
    photo: '',
    outsideCount: 0,
    lastExcludedAt: null,
    totalMinutes: 0,
    seasonMinutes: {},
    minuteReasons: [],
    createdAt: 1_788_268_816_011,
  });
  assert.ok(plan.players.filter(({ id }) => id !== 'p12').every(({ number, positions }) => number === '' && positions.length === 0));
});

test('si ya hay jugadores conserva la plantilla y solo registra la migración', () => {
  const existing = [{ id: 'propio', name: 'Jugador existente' }];
  const plan = planSquadSeed(existing, 1_788_268_816_000);

  assert.deepEqual(plan.players, []);
  assert.deepEqual(plan.settings, [{
    id: 'squad-26-27-seeded',
    recordType: 'migration',
    version: 1,
    createdAt: 1_788_268_816_000,
  }]);
});
