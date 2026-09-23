import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  calculatePlayerCallupMinutes,
  getPlayerSetPieceRoles,
  buildSquadLeaderboards,
  buildPlayerSummary,
} from '../js/domain.js';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('calculatePlayerCallupMinutes calcula minutos reglamentarios, porcentaje y media por partido convocado', () => {
  const matches = [
    {
      id: 'm1',
      type: 'league',
      status: 'finished',
      format: 'F7',
      playedSeconds: 53 * 60,
      minuteTotals: { 'p-pablo': 53 * 60 },
    },
    {
      id: 'm2',
      type: 'league',
      status: 'finished',
      format: 'F7',
      playedSeconds: 70 * 60,
      minuteTotals: { 'p-pedros': 30 * 60 },
    },
    {
      id: 'm3',
      type: 'league',
      status: 'finished',
      format: 'F7',
      playedSeconds: 70 * 60,
      minuteTotals: { 'p-pedros': 30 * 60 },
    },
  ];

  const callups = [
    { matchId: 'm1', availableIds: ['p-pablo'], exclusions: [] },
    { matchId: 'm2', availableIds: ['p-pedros'], exclusions: [] },
    { matchId: 'm3', availableIds: ['p-pedros'], exclusions: [] },
  ];

  // Caso Pablo Díaz: 1 partido convocado, 53 min jugados de 70 min posibles = 76% (nunca 100%)
  const pabloStats = calculatePlayerCallupMinutes({
    playerId: 'p-pablo',
    matches,
    callups,
    defaultDuration: 70,
    playedMinutes: 53,
  });
  assert.equal(pabloStats.totalCallups, 1);
  assert.equal(pabloStats.playedMinutes, 53);
  assert.equal(pabloStats.possibleMinutes, 70);
  assert.equal(pabloStats.percent, 76);
  assert.equal(pabloStats.averageMinutesPerCallup, 53);

  // Caso Alejandro Pedrós: 2 partidos convocados, 60 min jugados de 140 min posibles = 43% y 30 min/partido
  const pedrosStats = calculatePlayerCallupMinutes({
    playerId: 'p-pedros',
    matches,
    callups,
    defaultDuration: 70,
    playedMinutes: 60,
  });
  assert.equal(pedrosStats.totalCallups, 2);
  assert.equal(pedrosStats.playedMinutes, 60);
  assert.equal(pedrosStats.possibleMinutes, 140);
  assert.equal(pedrosStats.percent, 43);
  assert.equal(pedrosStats.averageMinutesPerCallup, 30);
});

test('getPlayerSetPieceRoles identifica correctamente especialistas y capitanes asignados', () => {
  const setPieces = {
    penalties: { primary: 'p1', secondary: 'p2' },
    freeKicksLeft: { primary: 'p2', secondary: 'p3' },
    freeKicksRight: { primary: 'p1', secondary: 'p2' },
    cornersLeft: { primary: 'p3', secondary: 'p1' },
    cornersRight: { primary: 'p2', secondary: 'p3' },
    captains: { primary: 'p1', secondary: 'p2', third: 'p3' },
  };

  const p1Roles = getPlayerSetPieceRoles('p1', setPieces);
  const p1Labels = p1Roles.map((r) => r.label);
  assert.ok(p1Labels.includes('1.er Penalti'));
  assert.ok(p1Labels.includes('1.ª Falta Der.'));
  assert.ok(p1Labels.includes('1.er Capitán'));

  const p2Roles = getPlayerSetPieceRoles('p2', setPieces);
  const p2Labels = p2Roles.map((r) => r.label);
  assert.ok(p2Labels.includes('1.ª Falta Izq.'));
  assert.ok(p2Labels.includes('1.er Córner Der.'));
  assert.ok(p2Labels.includes('2.º Capitán'));

  const p3Roles = getPlayerSetPieceRoles('p3', setPieces);
  const p3Labels = p3Roles.map((r) => r.label);
  assert.ok(p3Labels.includes('1.er Córner Izq.'));
  assert.ok(p3Labels.includes('3.er Capitán'));
});

test('index.html cuenta con el diálogo de balón parado, inputs de asistencias y contenedores de clasificación', async () => {
  const html = await read('index.html');
  assert.match(html, /id="set-pieces-dialog"/);
  assert.match(html, /id="plantilla-specialists-bar"/);
  assert.match(html, /id="squad-leaderboards"/);
  assert.match(html, /id="open-set-pieces-btn"/);
  assert.match(html, /name="assists"/);
  assert.match(html, /name="penaltiesPrimary"/);
  assert.match(html, /name="freeKicksLeftPrimary"/);
  assert.match(html, /name="freeKicksRightPrimary"/);
  assert.match(html, /name="cornersLeftPrimary"/);
  assert.match(html, /name="cornersRightPrimary"/);
  assert.match(html, /name="captainsPrimary"/);
  assert.match(html, /name="captainsSecondary"/);
  assert.match(html, /name="captainsThird"/);
});

test('plantilla-stats-sync formatea los minutos con X de Y min (Z%) y partidos convocados', async () => {
  const js = await read('js/plantilla-stats-sync.js');
  assert.match(js, /<strong>\$\{playerTotalMinutes\} de \$\{possibleMinutes\} min<\/strong>/);
  assert.match(js, /\(\$\{minutePercent\}%\)/);
  assert.match(js, /partidos conv\./);
  assert.match(js, /assists:\s*'asist\.'/);
});

test('Modo Campo directo usa sesión persistente para evitar rechazos RLS 401', async () => {
  const directo = await read('js/modo-campo-directo.js');
  const actions = await read('js/modo-campo-actions.js');
  const exercises = await read('js/modo-campo-identity-exercises.js');

  assert.match(directo, /persistSession:\s*true/);
  assert.match(actions, /persistSession:\s*true/);
  assert.match(exercises, /persistSession:\s*true/);
  assert.match(directo, /autoRefreshToken:\s*true/);
});
