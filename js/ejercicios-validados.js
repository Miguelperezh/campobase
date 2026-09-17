// Capa aditiva: conserva intacta la biblioteca validada existente y antepone los 16 ejercicios del nuevo formato.
import {
  EJERCICIOS_VALIDADOS as EJERCICIOS_VALIDADOS_BASE,
  toCampoBaseExercise as toCampoBaseExerciseBase,
  findValidatedExercise as findValidatedExerciseBase,
} from './ejercicios-validados-base.js';
import { EJERCICIOS_NUEVO_FORMATO, NUEVOS_EJERCICIOS_IDS } from './ejercicios-nuevo-formato.js';

const NUEVOS_IDS = new Set(NUEVOS_EJERCICIOS_IDS);

export const EJERCICIOS_VALIDADOS = Object.freeze([
  ...EJERCICIOS_NUEVO_FORMATO,
  ...EJERCICIOS_VALIDADOS_BASE,
]);

export function findValidatedExercise(id) {
  return EJERCICIOS_NUEVO_FORMATO.find((item) => item.id === id) || findValidatedExerciseBase(id);
}

function humanVideoUrl(item) {
  return String(
    item?.video_muestra_humanos
    || item?.video_muestra_url
    || item?.video_humano
    || item?.video_humanos
    || item?.video
    || ''
  ).trim();
}

export function toCampoBaseExercise(item) {
  const exercise = toCampoBaseExerciseBase(item);
  const videoMuestra = humanVideoUrl(item);
  const mapped = {
    ...exercise,
    // `video` del formato interno sigue siendo la animación/MP4 gráfico para no romper nada.
    // El vídeo humano queda separado y es el que usa el filtro «Solo con vídeo».
    video_muestra: videoMuestra,
    hasHumanVideo: Boolean(videoMuestra),
  };

  if (!NUEVOS_IDS.has(item?.id)) return mapped;
  return {
    ...mapped,
    formato_juego: 'todos',
    formatos_juego: ['futbol_7', 'futbol_11'],
    format: 'F7/F11',
    nuevoFormato: true,
  };
}