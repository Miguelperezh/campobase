import test from 'node:test';
import assert from 'node:assert/strict';
import { TACTIC_FORMATS, FORMATION_NAMES, FORMATION_GUIDES, buildTactic, createTacticMove, defaultTactic, moveTacticPiece, renderTacticBoard, sortTactics } from '../js/tactics.js';

test('la pizarra táctica genera formaciones F7 y F11 con jugadores y rival', () => {
  const f7 = defaultTactic('F7');
  const f11 = defaultTactic('F11');
  assert.equal(f7.team.length, 7);
  assert.equal(f7.opponent.length, 7);
  assert.equal(f11.team.length, 11);
  assert.equal(f11.opponent.length, 11);
  assert.ok(f7.team.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y) && p.n));
  assert.ok(f11.team.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y) && p.n));
});

test('precarga cinco formaciones F7 explicadas con sus posiciones', () => {
  assert.deepEqual(FORMATION_NAMES, ['1-3-2-1', '1-2-3-1', '1-2-2-2', '1-3-1-2', '1-1-3-2']);
  for (const formation of FORMATION_NAMES) {
    const t = defaultTactic('F7', formation);
    assert.equal(t.team.length, 7, `${formation} debe tener 7 jugadores`);
    assert.ok(t.team.every((p) => p.pos), `${formation}: cada jugador tiene posición`);
    assert.ok(FORMATION_GUIDES[formation], `${formation}: tiene guía táctica`);
    assert.ok(FORMATION_GUIDES[formation].queBusco, `${formation}: tiene qué busco`);
    assert.ok(FORMATION_GUIDES[formation].conBalon.length, `${formation}: tiene con balón`);
    assert.ok(FORMATION_GUIDES[formation].sinBalon.length, `${formation}: tiene sin balón`);
  }
});

test('mueve jugadores, rivales y balón sin mutar la táctica original y limita al campo', () => {
  const original = defaultTactic('F7');
  const playerMoved = moveTacticPiece(original, 'team', 0, { x: 120, y: -5 });
  const rivalMoved = moveTacticPiece(playerMoved, 'opponent', 1, { x: 41, y: 39 });
  const ballMoved = moveTacticPiece(rivalMoved, 'ball', 0, { x: 62, y: 63 });
  assert.deepEqual(original.team[0], { x: 50, y: 90, n: '1', pos: 'Portero' });
  assert.deepEqual(playerMoved.team[0], { ...original.team[0], x: 96, y: 4 });
  assert.deepEqual(rivalMoved.opponent[1], { ...original.opponent[1], x: 41, y: 39 });
  assert.deepEqual(ballMoved.ball, { x: 62, y: 63 });
  assert.throws(() => moveTacticPiece(original, 'cone', 0, { x: 1, y: 1 }), /pieza/i);
});

test('crea flechas de todas las herramientas y descarta trazos demasiado cortos', () => {
  for (const kind of ['pass', 'move', 'dribble', 'shot', 'sprint']) {
    assert.deepEqual(createTacticMove({ x: 10, y: 20 }, { x: 30, y: 40 }, kind), {
      from: { x: 10, y: 20 }, to: { x: 30, y: 40 }, kind,
    });
  }
  assert.equal(createTacticMove({ x: 10, y: 10 }, { x: 10.5, y: 10.5 }, 'pass'), null);
  assert.throws(() => createTacticMove({ x: 1, y: 1 }, { x: 2, y: 2 }, 'curve'), /herramienta/i);
});

test('construye una táctica validando nombre, formato y formación', () => {
  const tactic = buildTactic({
    name: 'Salida de balón', rival: 'Las Palmas', situation: 'Saque de esquina', format: 'F7', formation: '1-2-3-1',
  }, { id: 't1', createdAt: 10, now: 20 });
  assert.equal(tactic.recordType, 'tactic');
  assert.equal(tactic.name, 'Salida de balón');
  assert.equal(tactic.rival, 'Las Palmas');
  assert.equal(tactic.format, 'F7');
  assert.equal(tactic.formation, '1-2-3-1');
  assert.equal(tactic.team.length, 7);
  assert.throws(() => buildTactic({ name: '', format: 'F7' }, {}), /nombre/i);
  assert.throws(() => buildTactic({ name: 'X', format: 'F9' }, {}), /formato/i);
});

test('renderiza la pizarra táctica editable con piezas pequeñas, balón fijo y sprint', () => {
  const tactic = { ...defaultTactic('F7', '1-3-2-1'), id: 't1', name: 'Salida', moves: [{ from: { x: 50, y: 46 }, to: { x: 50, y: 30 }, kind: 'sprint' }] };
  const html = renderTacticBoard(tactic, { editable: true });
  assert.match(html, /<svg/);
  assert.match(html, /class="tac-player"/);
  assert.match(html, /class="tac-opponent"/);
  assert.match(html, /class="tac-ball"/);
  assert.match(html, /r="3\.2"/, 'los jugadores son más pequeños');
  assert.match(html, /data-piece="team"/, 'los jugadores se identifican para arrastrarlos');
  assert.match(html, /data-piece="ball"/, 'el balón es una pieza colocable');
  assert.match(html, /<circle cx="50" cy="50" r="2\.2"\/>/, 'el balón tiene posición fija y arrastrable');
  assert.match(html, /tac-sprint/);
  assert.match(html, /sprint/i);
  assert.match(html, /tac-legend-team/, 'mi equipo tiene color propio en la leyenda');
  assert.match(html, /tac-legend-rival/, 'rival tiene color propio en la leyenda');
});

test('ordena tácticas por fecha de actualización descendente', () => {
  const tactics = [{ id: 'a', updatedAt: 10 }, { id: 'b', updatedAt: 30 }, { id: 'c', updatedAt: 20 }];
  assert.deepEqual(sortTactics(tactics).map(({ id }) => id), ['b', 'c', 'a']);
  assert.deepEqual(tactics.map(({ id }) => id), ['a', 'b', 'c']);
});
