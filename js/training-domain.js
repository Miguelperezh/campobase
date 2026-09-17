// Capa de compatibilidad para ejercicios disponibles en más de un formato.
// El dominio original permanece íntegro en training-domain-base.js.
export * from './training-domain-base.js';
import { filterExercises as filterExercisesBase, normalizeFormatoJuego } from './training-domain-base.js';

export function filterExercises(exercises, filters = {}) {
  const formatVal = filters.formato_juego !== undefined ? filters.formato_juego : filters.format;
  const target = (formatVal && formatVal !== 'todos' && formatVal !== 'Todos')
    ? normalizeFormatoJuego(formatVal, 'futbol_11')
    : null;

  if (!['futbol_7', 'futbol_11'].includes(target)) {
    return filterExercisesBase(exercises, filters);
  }

  const originals = new Map(exercises.map((item) => [item.id, item]));
  const adapted = exercises.map((item) => {
    const formats = Array.isArray(item.formatos_juego)
      ? item.formatos_juego.map((value) => normalizeFormatoJuego(value, 'futbol_11'))
      : [];
    return formats.includes(target) ? { ...item, formato_juego: target } : item;
  });

  return filterExercisesBase(adapted, filters).map((item) => originals.get(item.id) || item);
}
