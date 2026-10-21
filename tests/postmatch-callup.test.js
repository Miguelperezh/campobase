import test from 'node:test';
import assert from 'node:assert/strict';
import { historicalCallupSelection, editableCallupForMatch } from '../js/postmatch-callup.js';

const squad = (count = 16) => Array.from({ length: count }, (_, index) => ({
  id: `historical-p${index + 1}`,
  name: `Jugador histórico ${index + 1}`,
  outsideCount: index % 3,
  totalMinutes: 120 + index,
}));

test('la convocatoria posterior registra solo los jugadores elegidos, sin completar la rotación ni generar minutos', () => {
  const players = squad();
  const selectedIds = ['historical-p8', 'historical-p3', 'historical-p8'];
  const selection = historicalCallupSelection(players, { selectedIds });

  assert.deepEqual(selection.availableIds, ['historical-p8', 'historical-p3']);
  assert.equal(selection.exclusions.length, 14);
  assert.ok(selection.exclusions.every((item) => !selection.availableIds.includes(item.playerId)));
  assert.deepEqual(selection.pendingRotationDecisions, []);
  assert.equal(Object.hasOwn(selection, 'targets'), false);
  assert.equal(Object.hasOwn(selection, 'minuteTotals'), false);
});

test('las bajas conservan el motivo histórico y solo una elección explícita lo sustituye', () => {
  const players = squad(4);
  const existing = {
    availableIds: ['historical-p1'],
    exclusions: [
      { playerId: 'historical-p2', reason: 'rotation', automatic: true, decidedAt: 123 },
      { playerId: 'historical-p3', reason: 'sick', note: 'Nota guardada', automatic: false },
    ],
  };
  const selection = historicalCallupSelection(players, {
    selectedIds: ['historical-p1'],
    existing,
    manualExclusions: [{ playerId: 'historical-p2', reason: 'other', note: 'Decisión revisada', automatic: true }],
  });

  assert.deepEqual(selection.exclusions, [
    { playerId: 'historical-p2', reason: 'other', note: 'Decisión revisada', automatic: false },
    { playerId: 'historical-p3', reason: 'sick', note: 'Nota guardada', automatic: false },
    { playerId: 'historical-p4', reason: 'not_called', automatic: false },
  ]);
});

test('un jugador antes excluido puede entrar sin conservar su antigua baja en la nueva selección', () => {
  const selection = historicalCallupSelection(squad(3), {
    selectedIds: ['historical-p2'],
    existing: { exclusions: [{ playerId: 'historical-p2', reason: 'sick', automatic: false }] },
  });
  assert.deepEqual(selection.availableIds, ['historical-p2']);
  assert.deepEqual(selection.exclusions.map(({ playerId }) => playerId), ['historical-p1', 'historical-p3']);
});

test('registrar ninguna selección no convoca automáticamente a toda la plantilla', () => {
  const selection = historicalCallupSelection(squad(3), { selectedIds: [] });
  assert.deepEqual(selection.availableIds, []);
  assert.deepEqual(selection.exclusions, squad(3).map(({ id }) => ({ playerId: id, reason: 'not_called', automatic: false })));
  assert.deepEqual(selection.pendingRotationDecisions, []);
});

test('liga y torneo admiten catorce convocados y rechazan quince, mientras el amistoso conserva todos los elegidos', () => {
  const players = squad(25);
  const selectedIds = players.map(({ id }) => id);
  for (const matchType of ['league', 'tournament']) {
    assert.equal(historicalCallupSelection(players, { selectedIds: selectedIds.slice(0, 14), matchType }).availableIds.length, 14);
    assert.throws(() => historicalCallupSelection(players, { selectedIds: selectedIds.slice(0, 15), matchType }), /14/);
  }
  const friendly = historicalCallupSelection(players, { selectedIds, matchType: 'friendly' });
  assert.deepEqual(friendly.availableIds, selectedIds);
  assert.deepEqual(friendly.exclusions, []);
});

test('no acepta convocados ni bajas explícitas de jugadores desconocidos', () => {
  const players = squad(3);
  assert.throws(() => historicalCallupSelection(players, { selectedIds: ['historical-missing'] }));
  assert.throws(() => historicalCallupSelection(players, {
    selectedIds: ['historical-p1'],
    manualExclusions: [{ playerId: 'historical-missing', reason: 'other' }],
  }));
});

test('un mismo jugador no puede estar convocado y excluido manualmente', () => {
  assert.throws(() => historicalCallupSelection(squad(3), {
    selectedIds: ['historical-p1'],
    manualExclusions: [{ playerId: 'historical-p1', reason: 'coach_decision' }],
  }), /convocado y fuera/);
});

test('calcular una convocatoria histórica conserva jugadores, selección y registro original sin mutaciones', () => {
  const players = squad(4);
  const options = {
    selectedIds: ['historical-p1', 'historical-p1'],
    manualExclusions: [{ playerId: 'historical-p2', reason: 'other', note: 'Motivo explícito' }],
    existing: {
      id: 'historical-original',
      completed: true,
      targets: [{ playerId: 'historical-p1', minutes: 35 }],
      exclusions: [{ playerId: 'historical-p3', reason: 'sick', note: 'Dato original', automatic: false }],
    },
  };
  const original = structuredClone({ players, options });
  const selection = historicalCallupSelection(players, options);
  assert.deepEqual({ players, options }, original);
  selection.availableIds.push('result-only');
  selection.exclusions.find(({ playerId }) => playerId === 'historical-p2').note = 'Cambio fuera del origen';
  selection.exclusions.find(({ playerId }) => playerId === 'historical-p3').note = 'Otro cambio fuera del origen';
  assert.deepEqual({ players, options }, original);
});

test('la edición resuelve enlaces exactos por matchId, callupId o ID legado sin depender del orden', () => {
  const match = { id: 'fixture-a', date: '2026-10-20T19:00:00', opponent: 'Rival A' };
  const elsewhere = { id: 'callup-b', matchId: 'fixture-b', date: match.date, opponent: match.opponent };
  for (const [fixture, callup] of [
    [match, { id: 'callup-a', matchId: match.id }],
    [{ ...match, callupId: 'callup-a' }, { id: 'callup-a' }],
    [match, { id: match.id }],
  ]) {
    assert.equal(editableCallupForMatch(fixture, [fixture, { id: 'fixture-b' }], [elsewhere, callup]), callup);
  }
});

test('nunca abre una convocatoria vinculada a otro partido aunque coincidan rival y fecha', () => {
  const match = { id: 'fixture-b', date: '2026-10-20T19:00:00', opponent: 'Huracán A' };
  const other = { ...match, id: 'fixture-a', callupId: 'callup-a' };
  const callup = { id: 'callup-a', matchId: other.id, date: match.date, opponent: match.opponent };
  assert.equal(editableCallupForMatch(match, [match, other], [callup]), null);
  assert.equal(editableCallupForMatch({ ...match, callupId: callup.id }, [match, other], [callup]), null);
  const orphanWithForeignReference = { ...callup, matchId: '' };
  assert.equal(editableCallupForMatch(match, [match, other], [orphanWithForeignReference]), null);
  const legacyIdLink = { ...orphanWithForeignReference, id: other.id };
  assert.equal(editableCallupForMatch({ ...match, callupId: legacyIdLink.id }, [match, other], [legacyIdLink]), null);
});

test('el enlace histórico por día y nombre equivalente requiere una única coincidencia en ambas listas', () => {
  const match = { id: 'fixture-a', date: '2026-10-20T19:00:00', opponent: 'U.D. Jinámar' };
  const callup = { id: 'legacy-a', date: '2026-10-20', opponent: 'Jinamar' };
  assert.equal(editableCallupForMatch(match, [match], [callup]), callup);
  assert.equal(editableCallupForMatch(match, [match, { ...match, id: 'fixture-b' }], [callup]), null);
  assert.equal(editableCallupForMatch(match, [match], [callup, { ...callup, id: 'legacy-b' }]), null);
  assert.equal(editableCallupForMatch(match, [match], [{ ...callup, opponent: 'Jinamar B' }]), null);
  assert.equal(editableCallupForMatch(match, [match], [{ ...callup, date: '2026-10-19' }]), null);
});

test('enlaces exactos contradictorios o duplicados no eligen arbitrariamente una convocatoria', () => {
  const match = { id: 'fixture-a', callupId: 'callup-a', date: '2026-10-20', opponent: 'Rival A' };
  const byPointer = { id: 'callup-a' }, byMatch = { id: 'callup-b', matchId: match.id };
  assert.equal(editableCallupForMatch(match, [match], [byPointer, byMatch]), null);
  assert.equal(editableCallupForMatch(match, [match, { id: 'fixture-b', callupId: byMatch.id }], [byMatch]), null);
});

test('resolver convocatoria editable no modifica partidos ni convocatorias y tolera datos sin identidad', () => {
  const match = { id: 'fixture-a', date: '2026-10-20', opponent: 'Rival A' };
  const matches = [match], callups = [{ id: 'legacy-a', date: match.date, opponent: match.opponent, notes: 'Original' }];
  const before = structuredClone({ matches, callups });
  assert.equal(editableCallupForMatch(match, matches, callups), callups[0]);
  assert.deepEqual({ matches, callups }, before);
  assert.equal(editableCallupForMatch(null, matches, callups), null);
  assert.equal(editableCallupForMatch({}, matches, callups), null);
});


test('una baja manual ya marcada conserva notas y campos históricos si no se cambia el motivo', () => {
  const original = {playerId:'historical-p2',reason:'sick',note:'Nota antigua',automatic:false,extra:{keep:true}};
  const result = historicalCallupSelection(squad(2), {selectedIds:['historical-p1'],existing:{exclusions:[original]},manualExclusions:[{playerId:'historical-p2',reason:'sick'}]});
  assert.deepEqual(result.exclusions,[original]);
});


test('historial compartido presenta la baja genérica sin claves internas ni motivo inventado', async () => {
  const {buildPlayerHistory} = await import('../js/domain.js');
  const callup = {id:'past-callup',date:'2026-10-20',exclusions:[{playerId:'p',reason:'not_called',automatic:false}]};
  assert.equal(buildPlayerHistory('p',[],[callup])[0].detail,'No convocado');
  assert.equal(callup.exclusions[0].reason,'not_called');
});
