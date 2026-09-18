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
  const explicit = String(
    item?.video_muestra_humanos
    || item?.video_muestra_url
    || item?.video_humano
    || item?.video_humanos
    || ''
  ).trim();
  if (explicit) return explicit;

  // Compatibilidad legacy: un vídeo superior solo es humano si no es el mismo
  // MP4 gráfico que ya figura en media.video/media.mp4.
  const topLevel = String(item?.video || '').trim();
  const graphic = String(
    item?.media?.video
    || item?.media?.mp4
    || item?.media?.mp4_url
    || ''
  ).trim();
  return topLevel && topLevel !== graphic ? topLevel : '';
}

export function toCampoBaseExercise(item) {
  const exercise = toCampoBaseExerciseBase(item);
  const videoMuestra = humanVideoUrl(item);
  const mapped = {
    ...exercise,
    // Todo lo que sale de este catálogo es ejercicio validado: su campo genérico
    // `video` puede ser el MP4 gráfico y nunca debe activar por sí solo «Solo con vídeo».
    validated: true,
    source: 'validado',
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