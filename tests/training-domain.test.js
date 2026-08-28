import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EXERCISE_CATEGORIES,
  INITIAL_EXERCISES,
  WARMUP_TEMPLATES,
  buildExercise,
  filterExercises,
  buildTrainingSession,
  sortTrainingSessions,
} from '../js/training-domain.js';

test('precarga 36 ejercicios completos y las dos plantillas de calentamiento', () => {
  assert.equal(INITIAL_EXERCISES.length, 36);
  assert.equal(new Set(INITIAL_EXERCISES.map(({ id }) => id)).size, 36);
  assert.deepEqual(WARMUP_TEMPLATES.map(({ duration }) => duration), [10, 15]);
  for (const exercise of INITIAL_EXERCISES) {
    assert.ok(EXERCISE_CATEGORIES.includes(exercise.category));
    for (const field of ['name', 'players', 'material', 'duration', 'description', 'variants', 'difficulty', 'space']) {
      assert.notEqual(exercise[field], undefined, `${exercise.name}: falta ${field}`);
    }
  }
});

test('construye ejercicios editables, conserva favoritos y valida campos obligatorios', () => {
  const exercise = buildExercise({
    name: 'Rondo corto', category: 'Táctica', players: '5', material: 'Balones, conos',
    duration: '8', description: 'Conservar el balón.', variants: 'Dos toques', difficulty: 'Media', space: '12x12 m',
  }, { id: 'e1', favorite: true, createdAt: 10, now: 20 });
  assert.deepEqual(exercise, {
    id: 'e1', name: 'Rondo corto', category: 'Táctica', players: '5', material: 'Balones, conos',
    duration: 8, description: 'Conservar el balón.', variants: 'Dos toques', difficulty: 'Media', space: '12x12 m',
    favorite: true, createdAt: 10, updatedAt: 20,
  });
  assert.throws(() => buildExercise({ name: '', category: 'Táctica', duration: '5' }), /nombre/i);
  assert.throws(() => buildExercise({ name: 'X', category: 'Inventada', duration: '5' }), /categoría/i);
});

test('filtra ejercicios por categoría, jugadores, material, dificultad y favoritos', () => {
  const exercises = [
    { id: '1', category: 'Técnica', players: '4-5', material: 'Aros + balón', difficulty: 'Baja', favorite: true },
    { id: '2', category: 'Táctica', players: '8', material: 'Conos', difficulty: 'Alta', favorite: false },
  ];
  assert.deepEqual(filterExercises(exercises, { category: 'Técnica', players: '5', material: 'balón', difficulty: 'Baja', favorites: true }).map(({ id }) => id), ['1']);
  assert.deepEqual(filterExercises(exercises, { material: 'conos' }).map(({ id }) => id), ['2']);
});

test('crea una sesión con calentamiento, dos o tres ejercicios y juego final', () => {
  const session = buildTrainingSession({
    date: '2026-09-03', name: 'Salida de balón', warmupId: 'warmup-training-10', warmupDuration: '10',
    mainExerciseIds: ['e1', 'e2'], mainDurations: ['15', '20'], mainNotes: ['Perfil corporal', 'Ritmo alto'],
    finalExerciseId: 'e3', finalDuration: '15', finalNotes: 'Máximo tres toques', material: 'Balones y petos', notes: 'Hidratación',
  }, { id: 's1', availableExerciseIds: ['warmup-training-10', 'e1', 'e2', 'e3'], createdAt: 10, now: 20 });
  assert.equal(session.blocks.length, 4);
  assert.deepEqual(session.blocks.map(({ type, duration }) => [type, duration]), [
    ['warmup', 10], ['main', 15], ['main', 20], ['final', 15],
  ]);
  assert.equal(session.totalDuration, 60);
  assert.throws(() => buildTrainingSession({ ...session, mainExerciseIds: ['e1'] }, { availableExerciseIds: ['e1'] }), /2 o 3/i);
});

test('lista sesiones por fecha descendente sin mutar la entrada', () => {
  const sessions = [{ id: 'a', date: '2026-09-01' }, { id: 'b', date: '2026-09-03' }];
  assert.deepEqual(sortTrainingSessions(sessions).map(({ id }) => id), ['b', 'a']);
  assert.deepEqual(sessions.map(({ id }) => id), ['a', 'b']);
});
