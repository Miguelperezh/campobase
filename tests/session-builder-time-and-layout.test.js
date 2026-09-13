import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildFlexibleTrainingSession } from '../js/exercise-planning.js';

const appSource = fs.readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const plannerSource = fs.readFileSync(new URL('../js/session-planner-ui.js', import.meta.url), 'utf8');
const visualPlannerSource = fs.readFileSync(new URL('../js/session-visual-planner.js', import.meta.url), 'utf8');
const indexSource = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const stylesSource = fs.readFileSync(new URL('../styles-redesign.css', import.meta.url), 'utf8');

test('buildFlexibleTrainingSession guarda la hora de la sesión y el tipo', () => {
  const session = buildFlexibleTrainingSession({
    date: '2026-09-15',
    time: '18:30',
    name: 'Sesión de finalización',
    targetDuration: 75,
    sessionKind: 'match-warmup',
    blocks: [{ type: 'warmup', exerciseId: 'ex-1', duration: 15 }],
  }, {
    id: 'test-session-1',
    availableExerciseIds: ['ex-1'],
    createdAt: 1000,
    now: 2000,
  });

  assert.equal(session.time, '18:30');
  assert.equal(session.sessionKind, 'match-warmup');
  assert.equal(session.date, '2026-09-15');
});

test('el formulario de sesión incluye selector de hora 24h y cierra la fila antes de la lista', () => {
  assert.match(appSource, /time24Markup\('time'/);
  assert.match(appSource, /session-datetime-row/);
  assert.match(stylesSource, /#session-form \.button-row/);
  assert.match(stylesSource, /max-height: 56px !important/);
});

test('el modal de añadir ejercicio a sesión incluye selector de hora 24h', () => {
  assert.match(indexSource, /name="timeHour"/);
  assert.match(indexSource, /name="timeMinute"/);
  assert.match(appSource, /composeTime24\(values\.timeHour, values\.timeMinute/);
});

test('las tarjetas del catálogo de sesión y del visual planner no concatenan códigos técnicos al nombre', () => {
  assert.doesNotMatch(appSource, /session-exercise-picker[\s\S]*?\$\{item\.code/);
  assert.doesNotMatch(visualPlannerSource, /exercise-card session-generic-detail[\s\S]*?\$\{item\.code/);
});

test('session-planner-ui usa las portadas de la biblioteca canónica v2 y campos avanzados', () => {
  assert.match(plannerSource, /item\?\.media\?\.preview/);
  assert.match(plannerSource, /item\?\.media\?\.video/);
  assert.match(plannerSource, /item\?\.que_se_trabaja/);
  assert.match(plannerSource, /item\?\.objetivo_principal/);
});

test('las sesiones de la lista tienen botón interactivo de desplegar/replegar y muestran la hora', () => {
  assert.match(appSource, /toggle-session-blocks/);
  assert.match(appSource, /session-plan-collapsible/);
  assert.match(appSource, /session\.time \? ` · ⏰ \$\{session\.time\}` : ''/);
});

test('el detalle de sesión muestra cada ejercicio con miniatura, datos limpios y botón para ver con MP4', () => {
  assert.match(appSource, /session-block-card/);
  assert.match(appSource, /session-block-preview/);
  assert.match(appSource, /🎬 Ver ejercicio con MP4/);
  assert.match(appSource, /showExerciseDetail/);
});

test('buildFlexibleTrainingSession guarda el campo de entrenamiento (pitch) y calcula material automáticamente', () => {
  const session = buildFlexibleTrainingSession({
    date: '2026-09-15',
    time: '17:00',
    pitch: 'Campo Pepe Gonçalvez',
    name: 'Sesión en Pepe Gonçalvez',
    targetDuration: 60,
    blocks: [
      { type: 'warmup', exerciseId: 'ex-1', duration: 15 },
      { type: 'main', exerciseId: 'ex-2', duration: 30 },
    ],
  }, {
    id: 'session-pitch-test',
    availableExerciseIds: ['ex-1', 'ex-2'],
    exercises: [
      { id: 'ex-1', name: 'Calentamiento con conos', materiales: [{ nombre: 'cono', cantidad: 6 }] },
      { id: 'ex-2', name: 'Rondo con balón', materiales: [{ nombre: 'balón de fútbol', cantidad: 2 }, { nombre: 'cono', cantidad: 4 }] },
    ],
  });

  assert.equal(session.pitch, 'Campo Pepe Gonçalvez');
  assert.equal(session.material, '2 balones de fútbol, 10 conos');
});

test('el formulario de sesión y el diálogo de añadir ejercicio permiten introducir el campo de entrenamiento', () => {
  assert.match(appSource, /name="pitch"/);
  assert.match(indexSource, /name="pitch"/);
  assert.match(stylesSource, /\.session-details-row/);
});

test('las tarjetas de sesión muestran el campo y la duración claramente en la línea meta', () => {
  assert.match(appSource, /session\.pitch \? ` · 🏟️ \$\{escapeHtml\(session\.pitch\)\}` : ''/);
  assert.match(appSource, /⏱️ \$\{session\.totalDuration\} min/);
  assert.match(appSource, /Material total \(calculado automáticamente/);
});
