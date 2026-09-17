import test from 'node:test';
import assert from 'node:assert/strict';
import { filterExercises } from '../js/training-domain.js';
import { EJERCICIOS_VALIDADOS, toCampoBaseExercise } from '../js/ejercicios-validados.js';
import { NUEVOS_EJERCICIOS_IDS } from '../js/ejercicios-nuevo-formato.js';

test('Solo con vídeo considera el vídeo humano y no el MP4 gráfico principal', () => {
  const pool = [
    {
      id: 'solo-grafico',
      name: 'Solo animación',
      category: 'Finalización',
      formato_juego: 'futbol_11',
      video: 'https://example.test/ejercicio.mp4',
      hasHumanVideo: false,
    },
    {
      id: 'con-humano',
      name: 'Con vídeo humano',
      category: 'Finalización',
      formato_juego: 'futbol_11',
      video: 'https://example.test/ejercicio.mp4',
      video_muestra: 'https://example.test/video-muestra.mp4',
      hasHumanVideo: true,
    },
  ];

  const filtered = filterExercises(pool, { video: true });
  assert.deepEqual(filtered.map(({ id }) => id), ['con-humano']);
});

test('el mapeo conserva separados el MP4 gráfico y el vídeo humano', () => {
  const source = {
    id: 'test-separacion-video',
    nombre: 'Prueba separación de vídeos',
    categoria: 'Finalización',
    formato_juego: 'Fútbol 11',
    datos_rapidos: {},
    media: { video: 'https://example.test/ejercicio.mp4' },
    video: 'https://example.test/humanos.mp4',
  };

  const mapped = toCampoBaseExercise(source);
  assert.equal(mapped.video, 'https://example.test/ejercicio.mp4');
  assert.equal(mapped.video_muestra, 'https://example.test/humanos.mp4');
  assert.equal(mapped.hasHumanVideo, true);
});

test('el filtro real devuelve exactamente ejercicios con vídeo humano y mantiene los 16 nuevos arriba cuando correspondan', () => {
  const mapped = EJERCICIOS_VALIDADOS.map(toCampoBaseExercise);
  const expectedIds = mapped.filter((item) => item.hasHumanVideo).map((item) => item.id);
  const filtered = filterExercises(mapped, { video: true });
  assert.deepEqual(filtered.map((item) => item.id), expectedIds);

  const f7 = filterExercises(mapped, { formato_juego: 'futbol_7' });
  const f11 = filterExercises(mapped, { formato_juego: 'futbol_11' });
  assert.deepEqual(f7.slice(0, 16).map((item) => item.id), NUEVOS_EJERCICIOS_IDS);
  assert.deepEqual(f11.slice(0, 16).map((item) => item.id), NUEVOS_EJERCICIOS_IDS);
});
