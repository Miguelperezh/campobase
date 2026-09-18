import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { filterExercises } from '../js/training-domain.js';
import { EJERCICIOS_VALIDADOS, toCampoBaseExercise } from '../js/ejercicios-validados.js';
import { EJERCICIOS_NUEVO_FORMATO, NUEVOS_EJERCICIOS_IDS } from '../js/ejercicios-nuevo-formato.js';
import { renderExerciseGridCard } from '../js/ejercicio-viewer.js';

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

test('los 16 nuevos se muestran limpios: sin categoría duplicada, sin barras F7/F11 y sin preview roto', () => {
  assert.equal(EJERCICIOS_NUEVO_FORMATO.length, 16);
  for (const exercise of EJERCICIOS_NUEVO_FORMATO) {
    const category = String(exercise.categoria || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const tagKeys = (exercise.etiquetas || []).map((tag) => String(tag).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase());
    assert.equal(tagKeys.includes(category), false, `${exercise.id}: categoría repetida en etiquetas`);
    assert.equal(String(exercise.datos_rapidos?.jugadores || '').includes('/'), false, `${exercise.id}: jugadores mezclados F7/F11`);
    assert.equal(String(exercise.datos_rapidos?.duracion || '').includes('/'), false, `${exercise.id}: duración mezclada F7/F11`);
    assert.equal(exercise.media?.preview, '', `${exercise.id}: no debe apuntar al bucket inexistente de previews`);
    assert.ok(exercise.video_muestra_humanos, `${exercise.id}: falta vídeo humano`);
    assert.equal(exercise.media?.video, exercise.video_muestra_humanos, `${exercise.id}: el reproductor debe tener un vídeo válido mientras se conserva la ruta gráfica original`);
    assert.ok(exercise._video_ejercicio_original, `${exercise.id}: debe conservarse la ruta original del MP4 gráfico`);
  }
});

test('el filtro real devuelve exactamente ejercicios con vídeo humano y mantiene los 16 nuevos arriba cuando correspondan', () => {
  const mapped = EJERCICIOS_VALIDADOS.map(toCampoBaseExercise);
  const expectedIds = mapped.filter((item) => item.hasHumanVideo).map((item) => item.id);
  const filtered = filterExercises(mapped, { video: true });
  assert.deepEqual(filtered.map((item) => item.id), expectedIds);

  const legacyOnlyGraphic = mapped.find((item) => !NUEVOS_EJERCICIOS_IDS.includes(item.id) && item.video && !item.hasHumanVideo);
  assert.ok(legacyOnlyGraphic, 'Debe existir al menos un ejercicio histórico con MP4 gráfico pero sin vídeo humano');
  assert.equal(filtered.some((item) => item.id === legacyOnlyGraphic.id), false, 'Solo con vídeo no debe incluir MP4 gráficos sin vídeo humano');

  const f7 = filterExercises(mapped, { formato_juego: 'futbol_7' });
  const f11 = filterExercises(mapped, { formato_juego: 'futbol_11' });
  assert.deepEqual(f7.slice(0, 16).map((item) => item.id), NUEVOS_EJERCICIOS_IDS);
  assert.deepEqual(f11.slice(0, 16).map((item) => item.id), NUEVOS_EJERCICIOS_IDS);
});


test('Solo con vídeo no confunde un MP4 gráfico persistido de un ejercicio validado con vídeo humano', () => {
  const pool = [
    {
      id: 'validado-antiguo-solo-grafico',
      name: 'Validado antiguo',
      category: 'Finalización',
      formato_juego: 'futbol_11',
      validated: true,
      source: 'validado',
      video: 'https://example.test/ejercicio.mp4',
    },
    {
      id: 'personal-antiguo-con-video',
      name: 'Personal con vídeo',
      category: 'Finalización',
      formato_juego: 'futbol_11',
      source: 'personal',
      video: 'https://example.test/video-humano.mp4',
    },
    {
      id: 'validado-con-humano-explicito',
      name: 'Validado con muestra',
      category: 'Finalización',
      formato_juego: 'futbol_11',
      validated: true,
      source: 'validado',
      video: 'https://example.test/ejercicio.mp4',
      video_muestra: 'https://example.test/video-muestra.mp4',
    },
  ];

  const filtered = filterExercises(pool, { video: true });
  assert.deepEqual(filtered.map(({ id }) => id), [
    'personal-antiguo-con-video',
    'validado-con-humano-explicito',
  ]);
});

test('la tarjeta nunca pinta el bucket inexistente de previews y limpia categoría, jugadores y duración', () => {
  const card = renderExerciseGridCard({
    id: 'nuevo-prueba-visual',
    _nuevo_formato: true,
    nombre: 'Prueba visual',
    categoria: 'Finalización',
    etiquetas: ['Finalización', 'Tiro'],
    datos_rapidos: {
      jugadores: '15 / 16-22 jugadores',
      duracion: '8-10 min. / 10-12 min.',
      material: 'Balones',
    },
    media: {
      preview: 'https://example.test/storage/v1/object/public/ejercicio-previews/nuevo/preview.png',
    },
    video: 'https://example.test/video-humano.mp4',
  });

  assert.doesNotMatch(card, /ejercicio-previews/);
  assert.match(card, /card-preview-video/);
  assert.equal((card.match(/<span class="pill">Finalización<\/span>/g) || []).length, 1);
  assert.match(card, /15-22 jugadores/);
  assert.match(card, /8-12 min aprox\./);
});


test('la biblioteca principal incluye los vídeos humanos persistidos sin convertir los MP4 gráficos en vídeo humano', () => {
  const source = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
  assert.match(source, /humanVideoExerciseIds/);
  assert.match(source, /recordType=exerciseVideo/);
  assert.match(source, /hasHumanVideo: true/);
  assert.match(source, /filterExercises\(filterableExercises, filters\)/);
});

test('el planificador de sesiones usa solo vídeo humano y respeta ejercicios F7 y F11', () => {
  const source = readFileSync(new URL('../js/session-planner-ui.js', import.meta.url), 'utf8');
  assert.match(source, /function hasHumanVideo\(item\)/);
  assert.match(source, /if \(onlyVideo && !hasHumanVideo\(item\)\) return false;/);
  assert.doesNotMatch(source, /onlyVideo[^\n]+animationVideo/);
  assert.match(source, /function matchesFormat\(item, target = formatVal\)/);
  assert.match(source, /item\.formato_juego === 'todos'/);
  assert.match(source, /item\.formatos_juego\.includes\(target\)/);
});
