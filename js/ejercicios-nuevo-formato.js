import e01 from './ejercicios-nuevo-formato/01-campobase-video-3-finalizaciones-centro-exterior-centro-lateral.js';
import e02 from './ejercicios-nuevo-formato/02-campobase-video-6-saltos-laterales-knee-drive-sprint-13-7m.js';
import e03 from './ejercicios-nuevo-formato/03-campobase-video-conduccion-dejar-balon-3-conos-vuelta-lateral-pase.js';
import e04 from './ejercicios-nuevo-formato/04-campobase-video-conduccion-frenada-planta-sprint-ida-vuelta-recuperacion.js';
import e05 from './ejercicios-nuevo-formato/05-campobase-video-desplazamiento-lateral-progresivo-pasillo.js';
import e06 from './ejercicios-nuevo-formato/06-campobase-video-duelos-3v2-finalizacion-robo-rotacion.js';
import e07 from './ejercicios-nuevo-formato/07-campobase-video-finalizacion-doble-2-balones-transicion-1v1-cambio-carril-v2.js';
import e08 from './ejercicios-nuevo-formato/08-campobase-pase-balon-espacio-2-conos-1v1-finalizacion-v2.js';
import e09 from './ejercicios-nuevo-formato/09-campobase-video-pies-rapidos-sprint-3-variaciones.js';
import e10 from './ejercicios-nuevo-formato/10-campobase-video-reaccion-giro-inicial-senales-laterales-cono-balon-v3.js';
import e11 from './ejercicios-nuevo-formato/11-campobase-video-reactive-knee-drive-skater-3-variaciones.js';
import e12 from './ejercicios-nuevo-formato/12-campobase-video-rodillas-altas-laterales-zigzag-cod-sprint.js';
import e13 from './ejercicios-nuevo-formato/13-campobase-video-conduccion-dejar-balon-3-conos-pase-v2.js';
import e14 from './ejercicios-nuevo-formato/14-campobase-video-finalizacion-doble-tiro-transicion-1v1-cambio-carril.js';
import e15 from './ejercicios-nuevo-formato/15-campobase-video-reaccion-espaldas-senales-lateral-giro-cono-balon-v2.js';
import e16 from './ejercicios-nuevo-formato/16-campobase-video-reaccion-lateral-senal-balon-cono.js';


const GRAPHIC_VIDEO_BY_ID = Object.freeze({
  'CAMPOBASE-VIDEO-3-FINALIZACIONES-CENTRO-EXTERIOR-CENTRO-LATERAL': 'assets/ejercicios/CAMPOBASE-VIDEO-3-FINALIZACIONES-CENTRO-EXTERIOR-CENTRO-LATERAL/CampoBase_3_Finalizaciones_Centro_Exterior_Centro_Lateral_V1.mp4',
  'CAMPOBASE-VIDEO-6-SALTOS-LATERALES-KNEE-DRIVE-SPRINT-13-7M': 'assets/ejercicios/CAMPOBASE-VIDEO-6-SALTOS-LATERALES-KNEE-DRIVE-SPRINT-13-7M/CampoBase_6_Saltos_Laterales_Knee_Drive_Sprint_13_7m_V4.mp4',
  'CAMPOBASE-VIDEO-CONDUCCION-DEJAR-BALON-3-CONOS-VUELTA-LATERAL-PASE': 'assets/ejercicios/CAMPOBASE-VIDEO-CONDUCCION-DEJAR-BALON-3-CONOS-VUELTA-LATERAL-PASE/CampoBase_Conduccion_Dejar_Balon_3_Conos_Vuelta_Lateral_Pase_V1.mp4',
  'CAMPOBASE-VIDEO-CONDUCCION-FRENADA-PLANTA-SPRINT-IDA-VUELTA-RECUPERACION': 'assets/ejercicios/CAMPOBASE-VIDEO-DEJA-BALON-GIRA-CONO-PASA-SIGUIENTE-COLA/CampoBase_Deja_Balon_Gira_Cono_Pasa_Siguiente_Cola_V3.mp4',
  'CAMPOBASE-VIDEO-DESPLAZAMIENTO-LATERAL-PROGRESIVO-PASILLO': 'assets/ejercicios/CAMPOBASE-VIDEO-DESPLAZAMIENTO-LATERAL-PROGRESIVO-PASILLO/CampoBase_Desplazamiento_Lateral_Progresivo_Pasillo_Cambios_Apoyo_V1.mp4',
  'CAMPOBASE-VIDEO-DUELOS-3V2-FINALIZACION-ROBO-ROTACION': 'assets/ejercicios/CAMPOBASE-VIDEO-DUELOS-3V2-FINALIZACION-ROBO-ROTACION/CampoBase_Duelos_3vs2_Finalizacion_Robo_Rotacion_V1.mp4',
  'CAMPOBASE-VIDEO-FINALIZACION-DOBLE-2-BALONES-TRANSICION-1V1-CAMBIO-CARRIL-V2': 'assets/ejercicios/CAMPOBASE-VIDEO-FINALIZACION-DOBLE-2-BALONES-TRANSICION-1V1-CAMBIO-CARRIL-V2/CampoBase_Finalizacion_Doble_2_Balones_Transicion_1v1_Cambio_Carril_V2.mp4',
  'CAMPOBASE-PASE-BALON-ESPACIO-2-CONOS-1V1-FINALIZACION-V2': 'assets/ejercicios/CAMPOBASE-VIDEO-PASE-BALON-ESPACIO-2-CONOS-1V1-FINALIZACION/CampoBase_Pase_Balon_Espacio_2_Conos_1v1_Finalizacion_V2.mp4',
  'CAMPOBASE-VIDEO-PIES-RAPIDOS-SPRINT-3-VARIACIONES': 'assets/ejercicios/CAMPOBASE-VIDEO-PIES-RAPIDOS-SPRINT-3-VARIACIONES/CampoBase_Pies_Rapidos_Sprint_3_Variaciones_V1.mp4',
  'CAMPOBASE-VIDEO-REACCION-GIRO-INICIAL-SENALES-LATERALES-CONO-BALON-V3': 'assets/ejercicios/CAMPOBASE-VIDEO-REACCION-GIRO-INICIAL-SENALES-LATERALES-CONO-BALON-V3/CampoBase_Reaccion_Giro_Inicial_Senales_Laterales_Cono_Balon_V3.mp4',
  'CAMPOBASE-VIDEO-REACTIVE-KNEE-DRIVE-SKATER-3-VARIACIONES': 'assets/ejercicios/CAMPOBASE-VIDEO-REACTIVE-KNEE-DRIVE-SKATER-3-VARIACIONES/CampoBase_Reactive_Knee_Drive_Skater_3_Variaciones_V3.mp4',
  'CAMPOBASE-VIDEO-RODILLAS-ALTAS-LATERALES-ZIGZAG-COD-SPRINT': 'assets/ejercicios/CAMPOBASE-VIDEO-RODILLAS-ALTAS-LATERALES-ZIGZAG-COD-SPRINT/CampoBase_Rodillas_Altas_Laterales_Zigzag_Cambios_Direccion_Sprint_V1.mp4',
  'CAMPOBASE-VIDEO-CONDUCCION-DEJAR-BALON-3-CONOS-PASE-V2': 'assets/ejercicios/CAMPOBASE-VIDEO-CONDUCCION-DEJAR-BALON-3-CONOS-VUELTA-LATERAL-PASE/CampoBase_Conduccion_Dejar_Balon_3_Conos_Vuelta_Lateral_Pase_V1.mp4',
  'CAMPOBASE-VIDEO-FINALIZACION-DOBLE-TIRO-TRANSICION-1V1-CAMBIO-CARRIL': 'assets/ejercicios/CAMPOBASE-VIDEO-FINALIZACION-DOBLE-2-BALONES-TRANSICION-1V1-CAMBIO-CARRIL-V2/CampoBase_Finalizacion_Doble_2_Balones_Transicion_1v1_Cambio_Carril_V2.mp4',
  'CAMPOBASE-VIDEO-REACCION-ESPALDAS-SENALES-LATERAL-GIRO-CONO-BALON-V2': 'assets/ejercicios/CAMPOBASE-VIDEO-REACCION-GIRO-INICIAL-SENALES-LATERALES-CONO-BALON-V3/CampoBase_Reaccion_Giro_Inicial_Senales_Laterales_Cono_Balon_V3.mp4',
  'CAMPOBASE-VIDEO-REACCION-LATERAL-SENAL-BALON-CONO': 'assets/ejercicios/CAMPOBASE-VIDEO-REACCION-GIRO-INICIAL-SENALES-LATERALES-CONO-BALON-V3/CampoBase_Reaccion_Giro_Inicial_Senales_Laterales_Cono_Balon_V3.mp4',
});

const RAW_EJERCICIOS_NUEVO_FORMATO = [e01, e02, e03, e04, e05, e06, e07, e08, e09, e10, e11, e12, e13, e14, e15, e16];

function key(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleLowerCase('es');
}

function uniqueStrings(values = []) {
  const seen = new Set();
  return values.filter((value) => {
    const clean = String(value || '').trim();
    const normalized = key(clean);
    if (!clean || !normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function summarizeNumericRange(value, suffix) {
  const source = String(value || '').trim();
  const numbers = [...source.matchAll(/\d+(?:[.,]\d+)?/g)]
    .map((match) => Number(match[0].replace(',', '.')))
    .filter(Number.isFinite);
  if (!numbers.length) return source;
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const format = (number) => Number.isInteger(number) ? String(number) : String(number).replace('.', ',');
  return min === max ? `${format(min)} ${suffix}` : `${format(min)}-${format(max)} ${suffix}`;
}

function normalizeNewExercise(exercise) {
  const categoryKey = key(exercise.categoria);
  const etiquetas = uniqueStrings(exercise.etiquetas || [])
    .filter((tag) => key(tag) !== categoryKey);
  const queSeTrabaja = uniqueStrings(exercise.que_se_trabaja || []).slice(0, 4);
  const datosRapidos = { ...(exercise.datos_rapidos || {}) };
  if (datosRapidos.jugadores) datosRapidos.jugadores = summarizeNumericRange(datosRapidos.jugadores, 'jugadores');
  if (datosRapidos.duracion) datosRapidos.duracion = summarizeNumericRange(datosRapidos.duracion, 'min aprox.');

  const originalMedia = exercise.media || {};
  const humanVideo = String(
    exercise.video_muestra_humanos
    || exercise.video_muestra_url
    || exercise.video_humano
    || exercise.video_humanos
    || exercise.video
    || ''
  ).trim();

  return {
    ...exercise,
    etiquetas,
    que_se_trabaja: queSeTrabaja,
    datos_rapidos: datosRapidos,
    media: {
      ...originalMedia,
      // Regla CampoBase: el primer vídeo es SIEMPRE la ficha/animación gráfica.
      video: GRAPHIC_VIDEO_BY_ID[exercise.id] || String(originalMedia.video || '').trim(),
      // La URL original de preview.png se conserva como dato; el visor usa el MP4 gráfico
      // como fallback visual mientras ese PNG no exista en el hosting público.
      preview: String(originalMedia.preview || '').trim(),
    },
    // Vídeo humano separado: nunca sustituye al MP4 gráfico principal.
    video: humanVideo,
    video_muestra_humanos: humanVideo,
    _video_ejercicio_original: String(originalMedia.video || '').trim(),
    _preview_original: String(originalMedia.preview || '').trim(),
  };
}

export const EJERCICIOS_NUEVO_FORMATO = Object.freeze(
  RAW_EJERCICIOS_NUEVO_FORMATO.map(normalizeNewExercise)
);
export const NUEVOS_EJERCICIOS_IDS = Object.freeze(EJERCICIOS_NUEVO_FORMATO.map(({ id }) => id));
