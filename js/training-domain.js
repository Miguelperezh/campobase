// Capa de compatibilidad para ejercicios disponibles en más de un formato.
// El dominio original permanece íntegro en training-domain-base.js.
export * from './training-domain-base.js';
import { filterExercises as filterExercisesBase, normalizeFormatoJuego } from './training-domain-base.js';

function hasHumanVideo(item) {
  // Los ejercicios mapeados por ejercicios-validados.js llevan este dato explícito,
  // evitando confundir el MP4 gráfico principal con el vídeo humano de muestra.
  if (typeof item?.hasHumanVideo === 'boolean') return item.hasHumanVideo;
  return Boolean(
    item?.video_muestra
    || item?.videoMuestra
    || item?.video_muestra_url
    || item?.video_humano
    || item?.video_humanos
    // Compatibilidad con ejercicios legacy/personales donde `video` sí era el vídeo real.
    || item?.video
  );
}

export function filterExercises(exercises, filters = {}) {
  const formatVal = filters.formato_juego !== undefined ? filters.formato_juego : filters.format;
  const target = (formatVal && formatVal !== 'todos' && formatVal !== 'Todos')
    ? normalizeFormatoJuego(formatVal, 'futbol_11')
    : null;

  // El filtro base usa item.video, que en los ejercicios validados es el MP4 gráfico.
  // Lo desactivamos aquí y aplicamos después el criterio correcto: vídeo humano de muestra.
  const baseFilters = filters.video ? { ...filters, video: false } : filters;
  let filtered;

  if (!['futbol_7', 'futbol_11'].includes(target)) {
    filtered = filterExercisesBase(exercises, baseFilters);
  } else {
    const originals = new Map(exercises.map((item) => [item.id, item]));
    const adapted = exercises.map((item) => {
      const formats = Array.isArray(item.formatos_juego)
        ? item.formatos_juego.map((value) => normalizeFormatoJuego(value, 'futbol_11'))
        : [];
      return formats.includes(target) ? { ...item, formato_juego: target } : item;
    });

    filtered = filterExercisesBase(adapted, baseFilters).map((item) => originals.get(item.id) || item);
  }

  return filters.video ? filtered.filter(hasHumanVideo) : filtered;
}