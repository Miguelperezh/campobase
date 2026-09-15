import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('la capa de contenido elimina chip con vocabulario de fútbol de España', async () => {
  const js = await read('js/exercise-content-quality.js');
  assert.match(js, /pase picado/);
  assert.match(js, /remate picado/);
  assert.match(js, /picar el balón/);
  assert.match(js, /balón picado/);
  assert.match(js, /replace\(\/\\bchip\\b\/gi/);
});

test('Qué se trabaja se deriva del contenido y no copia el objetivo del catálogo', async () => {
  const js = await read('js/exercise-content-quality.js');
  assert.match(js, /export function deriveTrainingFocus/);
  assert.match(js, /Táctica defensiva: 1v1, temporización y control de la distancia/);
  assert.match(js, /Técnica: pase, recepción y control orientado/);
  assert.match(js, /Finalización: elección y ejecución del remate/);
  assert.match(js, /Transiciones: reacción al cambio de posesión/);
  assert.match(js, /Percepción y reacción/);
  assert.match(js, /Coordinación y agilidad/);
  assert.match(js, /Toma de decisiones/);
  assert.match(js, /return items\.slice\(0, 4\)/);
});

test('objetivo y Qué se trabaja se escriben en secciones distintas', async () => {
  const js = await read('js/exercise-content-quality.js');
  assert.match(js, /#section-que-se-trabaja/);
  assert.match(js, /#section-objetivo \.main-objective-box/);
  assert.match(js, /exerciseObjective\(exercise\)/);
  assert.match(js, /findValidatedExercise\(exerciseId\)/);
});

test('el vocabulario español se aplica también a biblioteca y planificador', async () => {
  const js = await read('js/exercise-vocabulary-ui.js');
  assert.match(js, /normalizeSpanishFootballText/);
  assert.match(js, /getElementById\('exercises-list'\)/);
  assert.match(js, /getElementById\('session-builder'\)/);
  assert.match(js, /getElementById\('exercise-detail-body'\)/);
});

test('los módulos de calidad de contenido tienen sintaxis válida', () => {
  for (const path of ['js/exercise-content-quality.js', 'js/exercise-vocabulary-ui.js']) {
    execFileSync(process.execPath, ['--check', fileURLToPath(new URL(path, root))], { stdio: 'pipe' });
  }
});
