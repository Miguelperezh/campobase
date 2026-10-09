import test from 'node:test';
import assert from 'node:assert/strict';
import { positionChangeLines, describeMoment, plannedMinutes, validLineup } from '../js/match-moments.js';

const initial = { minute: 0, formation: '1-3-2-1', team: [
  { pos: 'Portero', playerId: 'gk' }, { pos: 'Central', playerId: 'y' },
  { pos: 'Lateral derecho', playerId: 'z' }, { pos: 'Lateral izquierdo', playerId: 'a' },
  { pos: 'Medio derecho', playerId: 'b' }, { pos: 'Medio izquierdo', playerId: 'c' },
  { pos: 'Delantero', playerId: 'd' },
] };
const minute15 = { minute: 15, formation: '1-3-2-1', team: [
  { pos: 'Portero', playerId: 'gk' }, { pos: 'Central', playerId: 'z' },
  { pos: 'Lateral derecho', playerId: 'x' }, { pos: 'Lateral izquierdo', playerId: 'a' },
  { pos: 'Medio derecho', playerId: 'b' }, { pos: 'Medio izquierdo', playerId: 'c' },
  { pos: 'Delantero', playerId: 'd' },
] };

test('un momento admite que entre X por Y y Z cambie de puesto a la vez', () => {
  const change = describeMoment(initial, minute15);
  assert.deepEqual(change.outIds, ['y']);
  assert.deepEqual(change.inIds, ['x']);
  assert.deepEqual(change.pairs, [{ inId: 'x', outId: 'y' }]);
  assert.deepEqual(change.moved, [{ playerId: 'z', position: 'Central' }]);
  assert.equal(validLineup(minute15.team, ['gk', 'x', 'y', 'z', 'a', 'b', 'c', 'd']), true);
  assert.equal(validLineup([{ ...minute15.team[0], playerId: 'x' }, ...minute15.team.slice(1)], ['gk', 'x', 'y', 'z', 'a', 'b', 'c', 'd']), false);
});

test('dos entradas se emparejan con su salida aunque otro titular cambie de posición', () => {
  const next = { ...minute15, team: minute15.team.map((slot) => ({ ...slot })) };
  next.team[3].playerId = 'w';
  next.team[5].playerId = 'a';
  const change = describeMoment(initial, next);
  assert.deepEqual(change.pairs, [{ inId: 'x', outId: 'y' }, { inId: 'w', outId: 'c' }]);
  assert.deepEqual(change.moved, [
    { playerId: 'z', position: 'Central' },
    { playerId: 'a', position: 'Medio izquierdo' },
  ]);
});

test('los minutos previstos siguen las alineaciones de cada tramo', () => {
  const minutes = plannedMinutes([initial, minute15]);
  assert.equal(minutes.y, 15);
  assert.equal(minutes.x, 55);
  assert.equal(minutes.z, 70);
});


test('recolocación junto a sustitución indica origen, destino y ocupante anterior', () => {
 const before=structuredClone(initial), after=structuredClone(minute15);
 assert.deepEqual(positionChangeLines(initial,minute15,id=>id.toUpperCase()),['Z cambia de Lateral derecho a Central (puesto que ocupaba Y)']);
 assert.deepEqual(describeMoment(initial,minute15).pairs,[{inId:'x',outId:'y'}]);
 assert.deepEqual(initial,before);assert.deepEqual(minute15,after);
});
test('intercambio de dos titulares se describe una vez y no inventa sustituciones', () => {
 const after=structuredClone(initial);
 after.team[1].playerId='z';after.team[2].playerId='y';
 assert.deepEqual(positionChangeLines(initial,after),['z intercambia posición con y: z pasa de Lateral derecho a Central; y pasa de Central a Lateral derecho']);
 assert.deepEqual(describeMoment(initial,after).pairs,[]);
 assert.deepEqual(plannedMinutes([initial,{...after,minute:15}]),plannedMinutes([initial]));
});
test('cadena de tres recolocaciones explica cada movimiento sin presentarlo como intercambio doble', () => {
 const after=structuredClone(initial);
 after.team[1].playerId='z';after.team[2].playerId='a';after.team[3].playerId='y';
 const lines=positionChangeLines(initial,after);
 assert.equal(lines.length,3);assert.ok(lines.every(line=>line.includes('puesto que ocupaba')&&!line.includes('intercambia')));
});
