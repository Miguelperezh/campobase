import test from 'node:test';
import assert from 'node:assert/strict';
import { filterTrainingSessions, reusableSessionDraft } from '../js/training-session-tools.js';

const freezeDeep = (value) => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freezeDeep);
    Object.freeze(value);
  }
  return value;
};

test('buscar sesiones combina palabras, ignora mayúsculas y tildes y conserva el orden y las referencias', () => {
  const sessions = freezeDeep([
    { id: 'a', name: 'Presión y finalización', pitch: 'Campo del Pilar', blocks: [] },
    { id: 'b', name: 'Finalización', pitch: 'Alfonso Silva', blocks: [] },
    { id: 'c', name: 'Presión', pitch: 'Campo del Pilar', blocks: [] },
  ]);
  const matches = filterTrainingSessions(sessions, { query: '  PILAR   presion finalizacion  ' });
  assert.deepEqual(matches.map((session) => session.id), ['a']);
  assert.equal(matches[0], sessions[0]);
  const all = filterTrainingSessions(sessions, { query: '   ' });
  assert.deepEqual(all, sessions);
  all.forEach((session, index) => assert.equal(session, sessions[index]));
  assert.deepEqual(filterTrainingSessions(sessions, { query: 'inexistente' }), []);
});

test('los filtros pendiente y realizada reconocen también los estados históricos sin reescribir sesiones', () => {
  const sessions = freezeDeep([
    { id: 'pending', completed: false, date: '2026-01-01', blocks: [] },
    { id: 'marked', completed: true, blocks: [] },
    { id: 'closed', status: 'closed', completed: false, blocks: [] },
    { id: 'finished', status: 'finished', blocks: [] },
    { id: 'closed-at', closedAt: 123, blocks: [] },
    { id: 'archived', archived: true, blocks: [] },
    { id: 'attendance-only', attendance: { done: true }, blocks: [] },
  ]);
  assert.deepEqual(filterTrainingSessions(sessions, { status: 'completed' }).map((session) => session.id),
    ['marked', 'closed', 'finished', 'closed-at', 'archived']);
  assert.deepEqual(filterTrainingSessions(sessions, { status: 'pending' }).map((session) => session.id),
    ['pending', 'attendance-only']);
  assert.equal(filterTrainingSessions(sessions, { status: 'all' }).length, sessions.length);
  assert.deepEqual(filterTrainingSessions(sessions, { status: 'completed', query: '2026-01-01' }), []);
});

test('la búsqueda encuentra los datos de la sesión y nombres y consignas de ejercicios actuales o históricos', () => {
  const session = freezeDeep({
    id: 'source', name: 'Preparación', pitch: 'Campo Municipal', date: '2026-10-20', time: '17:30',
    notes: 'Mejorar orientación', material: 'Petos y balones',
    blocks: [
      { exerciseId: 'catalog', notes: 'Control orientado' },
      { exerciseId: 'legacy-a', exerciseName: 'Rondo técnico' },
      { exerciseId: 'legacy-b', name: 'Conducción libre' },
      { exerciseId: 'legacy-c', exerciseSnapshot: { name: 'Transición ofensiva' } },
    ],
  });
  const exercises = freezeDeep([{ id: 'catalog', name: 'Pase con tercer hombre' }]);
  for (const query of [
    'preparacion', 'municipal', '2026-10-20', '17:30', 'orientacion', 'petos',
    'tercer hombre', 'control orientado', 'rondo tecnico', 'conduccion libre', 'transicion ofensiva',
    'municipal tercer hombre petos',
  ]) {
    assert.equal(filterTrainingSessions([session], { query, exercises })[0], session, query);
  }
  assert.deepEqual(filterTrainingSessions([], { query: 'rondo' }), []);
  assert.deepEqual(filterTrainingSessions([{ id: 'minimal' }], { query: 'rondo' }), []);
});

test('reutilizar genera únicamente un borrador nuevo y pendiente sin asistencia, identidad ni marcas históricas', () => {
  const source = freezeDeep({
    id: 'original-session', recordType: 'trainingSession', date: '2026-10-01',
    time: '17:30', pitch: 'Campo elegido', name: 'Técnica y finalización', targetDuration: 75,
    sessionKind: 'match-warmup', material: '12 balones', notes: 'Consignas originales',
    blocks: [{ type: 'main', exerciseId: 'own-exercise', duration: 25, notes: 'Dos toques',
      exerciseSnapshot: { name: 'Ejercicio propio', board: { players: [{ id: 'p1', x: 12 }] } } }],
    completed: true, status: 'closed', closedAt: 100, archived: true, createdAt: 1, updatedAt: 100,
    attendance: { player1: 'present' }, attendanceId: 'attendance-original', sessionId: 'legacy-link',
    ownerId: 'owner-original', permissions: { delegate: true },
  });
  const before = structuredClone(source);
  const draft = reusableSessionDraft(source, '2026-10-23', ['own-exercise']);
  assert.deepEqual(draft.meta, {
    id: '', date: '2026-10-23', time: '17:30', pitch: 'Campo elegido',
    name: 'Técnica y finalización', targetDuration: 75, sessionKind: 'match-warmup',
    material: '12 balones', notes: 'Consignas originales', completed: false,
  });
  assert.deepEqual(draft.blocks, source.blocks);
  assert.notEqual(draft.blocks, source.blocks);
  assert.notEqual(draft.blocks[0], source.blocks[0]);
  assert.notEqual(draft.blocks[0].exerciseSnapshot, source.blocks[0].exerciseSnapshot);
  draft.meta.name = 'Nueva sesión';
  draft.blocks[0].exerciseSnapshot.board.players[0].x = 99;
  assert.deepEqual(source, before);
});

test('reutilizar admite sesiones vacías y conserva el orden y los minutos de ejercicios repetidos', () => {
  const empty = reusableSessionDraft({ name: 'Sin ejercicios', blocks: [] }, '2028-02-29', []);
  assert.deepEqual(empty.blocks, []);
  assert.equal(empty.meta.id, '');
  assert.equal(empty.meta.completed, false);
  const blocks = freezeDeep([
    { exerciseId: 'repeat', duration: 10, type: 'warmup', notes: 'Primera vuelta' },
    { exerciseId: 'other', duration: 20, type: 'main', notes: 'Segunda parte' },
    { exerciseId: 'repeat', duration: 5, type: 'final', notes: 'Vuelta final' },
  ]);
  assert.deepEqual(reusableSessionDraft({ blocks }, '2026-10-23', ['repeat', 'other']).blocks, blocks);
});

test('reutilizar rechaza fechas imposibles o no canónicas y ejercicios ausentes sin sustituirlos', () => {
  const source = freezeDeep({ name: 'Histórica', blocks: [{ exerciseId: 'removed', duration: 15 }] });
  const before = structuredClone(source);
  for (const date of ['', '20/10/2026', '2026-1-02', '2026-02-29', '2026-02-30', '2026-13-01', '2026-10-20T00:00:00']) {
    assert.throws(() => reusableSessionDraft(source, date, ['removed']), undefined, date);
  }
  assert.throws(() => reusableSessionDraft(source, '2026-10-23', ['different-exercise']));
  assert.throws(() => reusableSessionDraft(source, '2026-10-23', []));
  assert.deepEqual(source, before);
});
