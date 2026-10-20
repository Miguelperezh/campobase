import { isTrainingSessionCompleted } from './training-session-status.js';

const normalized = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');

export function filterTrainingSessions(sessions, { query = '', status = 'all', exercises = [] } = {}) {
  const words = normalized(query).trim().split(/\s+/).filter(Boolean);
  const names = new Map(exercises.map(exercise => [exercise.id, exercise.name]));
  return sessions.filter(session => {
    const completed = isTrainingSessionCompleted(session);
    if ((status === 'pending' && completed) || (status === 'completed' && !completed)) return false;
    if (!words.length) return true;
    const date = String(session.date ?? '').slice(0, 10);
    const spanishDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? date.split('-').reverse().join('/') : '';
    const text = normalized([session.name, session.pitch, date, spanishDate, session.time, session.notes, session.material,
      ...(session.blocks ?? []).flatMap(block => [names.get(block.exerciseId), block.exerciseName, block.name, block.notes, block.exerciseSnapshot?.name])].join(' '));
    return words.every(word => text.includes(word));
  });
}

export function reusableSessionDraft(session, date, availableExerciseIds) {
  const parsed = new Date(`${date}T12:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new TypeError('Elige una fecha válida para la nueva sesión.');
  }
  const available = new Set(availableExerciseIds);
  if ((session.blocks ?? []).some(block => !available.has(block.exerciseId))) {
    throw new TypeError('Esta sesión contiene un ejercicio que ya no está en la biblioteca. Revisa sus bloques antes de reutilizarla; no se ha cambiado la sesión original.');
  }
  return {
    meta: {
      id: '', date, time: session.time ?? '', pitch: session.pitch ?? '', name: session.name || 'Entrenamiento',
      targetDuration: Number(session.targetDuration) > 0 ? Number(session.targetDuration) : 60,
      sessionKind: session.sessionKind || 'training', material: session.material ?? '', notes: session.notes ?? '', completed: false,
    },
    blocks: structuredClone(session.blocks ?? []),
  };
}
