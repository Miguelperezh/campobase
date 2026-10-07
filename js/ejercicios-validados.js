import {
  EJERCICIOS_VALIDADOS as EJERCICIOS_VALIDADOS_BASE,
  toCampoBaseExercise as toCampoBaseExerciseBase,
  findValidatedExercise as findValidatedExerciseBase,
} from './ejercicios-validados-base.js';
import { EJERCICIOS_NUEVO_FORMATO, NUEVOS_EJERCICIOS_IDS } from './ejercicios-nuevo-formato.js';
import { EJERCICIOS_NUEVOS_LOTES, NUEVOS_LOTES_IDS } from './ejercicios-nuevos-lotes.js';
import { EJERCICIOS_LOTES_151_650, LOTES_151_650_IDS } from './ejercicios-lotes-151-650.js';
import { normalizeFormatoJuego } from './training-domain.js';

const NUEVOS_IDS = new Set(NUEVOS_EJERCICIOS_IDS);
const NUEVOS_LOTES_SET = new Set(NUEVOS_LOTES_IDS);
const LOTES_151_650_SET = new Set(LOTES_151_650_IDS);

export const EJERCICIOS_VALIDADOS = Object.freeze([
  ...EJERCICIOS_LOTES_151_650,
  ...EJERCICIOS_NUEVOS_LOTES,
  ...EJERCICIOS_NUEVO_FORMATO,
  ...EJERCICIOS_VALIDADOS_BASE,
]);

export function findValidatedExercise(id) {
  return EJERCICIOS_LOTES_151_650.find((item) => item.id === id)
    || EJERCICIOS_NUEVOS_LOTES.find((item) => item.id === id)
    || EJERCICIOS_NUEVO_FORMATO.find((item) => item.id === id)
    || findValidatedExerciseBase(id);
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
  const rawFormato = item?.formato_juego || exercise.formato_juego || 'todos';
  const formato_juego = normalizeFormatoJuego(rawFormato);
  const isLudico = Boolean(
    item?.ludico === true
    || (Array.isArray(item?.etiquetas) && item.etiquetas.some((t) => /l[uú]dic/i.test(String(t))))
    || (Array.isArray(item?.categorias_adicionales) && item.categorias_adicionales.some((c) => /l[uú]dic/i.test(String(c))))
    || (Array.isArray(item?.categorias_visibles) && item.categorias_visibles.some((c) => /l[uú]dic/i.test(String(c))))
  );
  const mapped = {
    ...exercise,
    ludico: isLudico,
    etiquetas: Array.isArray(item?.etiquetas) ? item.etiquetas : (exercise.etiquetas || []),
    categorias_adicionales: Array.isArray(item?.categorias_adicionales) ? item.categorias_adicionales : (exercise.categorias_adicionales || []),
    categorias_visibles: Array.isArray(item?.categorias_visibles) ? item.categorias_visibles : (exercise.categorias_visibles || []),
    // `video` del formato interno sigue siendo la animación/MP4 gráfico para no romper nada.
    // El vídeo humano queda separado y es el que usa el filtro «Solo con vídeo».
    formato_juego,
    formatos_juego: Array.isArray(item?.formatos_juego) && item.formatos_juego.length
      ? item.formatos_juego
      : (Array.isArray(exercise.formatos_juego) && exercise.formatos_juego.length
          ? exercise.formatos_juego
          : (formato_juego === 'futbol_7' ? ['futbol_7'] : ['futbol_7', 'futbol_11'])),
    format: item?.format || exercise.format || (formato_juego === 'futbol_7' ? 'F7' : 'F11'),
    preview: item?.media?.preview || item?.preview || exercise.preview || '',
    video_muestra: videoMuestra,
    hasHumanVideo: Boolean(videoMuestra),
  };

  if (NUEVOS_IDS.has(item?.id) || NUEVOS_LOTES_SET.has(item?.id) || LOTES_151_650_SET.has(item?.id)) {
    mapped.nuevoFormato = true;
  }

  return mapped;
}