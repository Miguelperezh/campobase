import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  FORMATO_JUEGO_OPTIONS,
  normalizeFormatoJuego,
  buildExercise,
  filterExercises,
} from '../js/training-domain.js';
import { EJERCICIOS_VALIDADOS, toCampoBaseExercise } from '../js/ejercicios-validados.js';
import { formatSessionDurationInfo } from '../js/exercise-planning.js';

test('FORMATO_JUEGO_OPTIONS contiene las 3 opciones canónicas con valores estables', () => {
  assert.deepEqual(FORMATO_JUEGO_OPTIONS, [
    { id: 'todos', label: 'Todos' },
    { id: 'futbol_7', label: 'Fútbol 7' },
    { id: 'futbol_11', label: 'Fútbol 11' },
  ]);
});

test('normalizeFormatoJuego mapea todas las variaciones de Astra para F7 y F11', () => {
  // Variaciones Fútbol 7
  const f7Variants = ['Fútbol 7', 'futbol 7', 'futbol7', 'fútbol 7', 'F7', 'f7', 'futbol_7', 'FÚTBOL 7'];
  for (const v of f7Variants) {
    assert.equal(normalizeFormatoJuego(v), 'futbol_7', `Debe mapear "${v}" a "futbol_7"`);
  }

  // Variaciones Fútbol 11
  const f11Variants = ['Fútbol 11', 'futbol 11', 'futbol11', 'fútbol 11', 'F11', 'f11', 'futbol_11', 'FÚTBOL 11'];
  for (const v of f11Variants) {
    assert.equal(normalizeFormatoJuego(v), 'futbol_11', `Debe mapear "${v}" a "futbol_11"`);
  }

  // Valores vacíos, nulos, desconocidos asignan por defecto futbol_11
  assert.equal(normalizeFormatoJuego(''), 'futbol_11');
  assert.equal(normalizeFormatoJuego(null), 'futbol_11');
  assert.equal(normalizeFormatoJuego(undefined), 'futbol_11');
  assert.equal(normalizeFormatoJuego('desconocido'), 'futbol_11');
  assert.equal(normalizeFormatoJuego('Alevín'), 'futbol_11');

  // Valor todos
  assert.equal(normalizeFormatoJuego('todos'), 'todos');
});

test('los ejercicios en EJERCICIOS_VALIDADOS contienen 248 F11 y 50 F7 (total 298)', () => {
  const mapped = EJERCICIOS_VALIDADOS.map(toCampoBaseExercise);
  assert.equal(mapped.length, 298);

  const f11 = mapped.filter((e) => e.formato_juego === 'futbol_11');
  assert.equal(f11.length, 248);
  for (const ex of f11) {
    assert.equal(ex.formato_juego, 'futbol_11', `Ejercicio F11 ${ex.id} debe ser "futbol_11"`);
    assert.equal(ex.format, 'F11', `Formato de ejercicio F11 ${ex.id} debe ser "F11"`);
  }

  const f7 = mapped.filter((e) => e.formato_juego === 'futbol_7');
  assert.equal(f7.length, 50);
  for (const ex of f7) {
    assert.equal(ex.formato_juego, 'futbol_7', `Ejercicio F7 ${ex.id} debe ser "futbol_7"`);
    assert.equal(ex.format, 'F7', `Formato de ejercicio F7 ${ex.id} debe ser "F7"`);
  }
});

test('buildExercise asigna por defecto futbol_11 cuando no viene especificado', () => {
  const ex = buildExercise({
    name: 'Ejercicio 14 jugadores',
    category: 'Posesión',
    players: '14 jugadores',
    material: 'Balones',
    duration: 15,
    difficulty: 'Media',
  }, { id: 'test-f7-count' });

  assert.equal(ex.formato_juego, 'futbol_11');
});

test('filtrado por formato: Todos, Fútbol 11 y Fútbol 7 en catálogo actual', () => {
  const currentExercises = EJERCICIOS_VALIDADOS.map(toCampoBaseExercise);

  // 1. "todos" muestra la biblioteca completa (298 ejercicios)
  const allFiltered = filterExercises(currentExercises, { formato_juego: 'todos' });
  assert.equal(allFiltered.length, 298);

  // 2. "futbol_11" muestra todos los 248 ejercicios de F11
  const f11Filtered = filterExercises(currentExercises, { formato_juego: 'futbol_11' });
  assert.equal(f11Filtered.length, 248, 'Los 248 ejercicios de F11 deben estar en Fútbol 11');

  // 3. "futbol_7" muestra exactamente los 50 ejercicios de Fútbol 7 del lote oficial
  const f7Filtered = filterExercises(currentExercises, { formato_juego: 'futbol_7' });
  assert.equal(f7Filtered.length, 50, 'El filtro Fútbol 7 debe contener exactamente los 50 ejercicios de F7');
  const f7ByFormatKey = filterExercises(currentExercises, { format: 'futbol_7' });
  assert.equal(f7ByFormatKey.length, 50, 'El filtro format: futbol_7 debe tener igualmente 50 ejercicios');
});

test('inyección de ejercicio Astra F7 con categoría Posesión y filtrado combinado', () => {
  const baseExercises = EJERCICIOS_VALIDADOS.map(toCampoBaseExercise);

  // Ejercicio simulado recibido de un paquete Astra
  const astraExercise = toCampoBaseExercise({
    id: 'astra-f7-001',
    nombre: 'Rondo F7 4v3 con transiciones extra',
    categoria: 'Posesión',
    formato_juego: 'Fútbol 7', // variación de Astra
    objetivo_principal: 'Mantener posesión y bascular en espacio de F7',
    datos_rapidos: { jugadores: '7 jugadores', duracion: '15 min' },
  });

  assert.equal(astraExercise.formato_juego, 'futbol_7');
  assert.equal(astraExercise.category, 'Posesión');

  const pool = [astraExercise, ...baseExercises];

  // 1. Aparece al filtrar por "Fútbol 7" (50 base + 1 inyectado = 51)
  const f7Only = filterExercises(pool, { formato_juego: 'futbol_7' });
  assert.equal(f7Only.length, 51);
  assert.ok(f7Only.some(e => e.id === 'astra-f7-001'));

  // 2. Al filtrar por "Fútbol 11", los 248 base aparecen y el de F7 NO
  const f11Only = filterExercises(pool, { formato_juego: 'futbol_11' });
  assert.equal(f11Only.length, 248);
  assert.ok(!f11Only.some(e => e.id === 'astra-f7-001'));

  // 3. Al filtrar por "Todos", aparecen los 299 (298 base + 1 F7 inyectado)
  const todosOnly = filterExercises(pool, { formato_juego: 'todos' });
  assert.equal(todosOnly.length, 299);
  assert.ok(todosOnly.some(e => e.id === 'astra-f7-001'));

  // 4. Aparece con búsqueda por texto único + Fútbol 7
  const textF7 = filterExercises(pool, { text: 'transiciones extra', formato_juego: 'futbol_7' });
  assert.equal(textF7.length, 1);
  assert.equal(textF7[0].id, 'astra-f7-001');
});

test('index.html contiene el desplegable Formato con exactamente las 3 opciones requeridas y sin no_especificado', () => {
  const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
  assert.match(html, /<select\s+name="formato_juego"/);
  assert.match(html, /value="todos"/);
  assert.match(html, /value="futbol_7"/);
  assert.match(html, /value="futbol_11"/);
  assert.doesNotMatch(html, /<option\s+value="no_especificado"/);
});

test('duración de sesión: texto exacto para entreno incompleto y completo', () => {
  // Caso de usuario: 15 min de 75 min -> quedan 60 min para completar entreno
  const pilarRemaining = formatSessionDurationInfo(15, 75, 'Campo del Pilar');
  assert.equal(pilarRemaining.metaText, '⏱️ 15 / 75 min (quedan 60 min para completar entreno)');

  // Caso completado: 75 min de 75 min -> sesión lista para empezar
  const pilarComplete = formatSessionDurationInfo(75, 75, 'Campo del Pilar');
  assert.equal(pilarComplete.metaText, '⏱️ 75 / 75 min (sesión lista para empezar)');
  assert.equal(pilarComplete.badgeText, 'Sesión lista para empezar');
  assert.equal(pilarComplete.status, 'complete');
});
