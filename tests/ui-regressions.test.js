import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const projectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('todos los campos con hora usan selectores propios de 24 horas', async () => {
  const [html, app] = await Promise.all([projectFile('index.html'), projectFile('js/app.js')]);
  assert.doesNotMatch(html, /type=["'](?:time|datetime-local)["']/i);
  assert.doesNotMatch(app, /type=\\?["'](?:time|datetime-local)\\?["']/i);
  assert.match(html, /name="dateHour"/);
  assert.match(app, /time24Markup\('manualDate'/);
  assert.match(app, /time24Markup\(`arrivalTime-\$\{player\.id\}`/);
});

test('la aplicación no usa confirmaciones nativas', async () => {
  const app = await projectFile('js/app.js');
  assert.doesNotMatch(app, /\bconfirm\s*\(/);
  assert.match(app, /confirmation-dialog/);
});

test('la sesión autenticada se restaura al recargar y el PIN no se abre incondicionalmente', async () => {
  const app = await projectFile('js/app.js');
  assert.match(app, /sessionStorage/);
  assert.match(app, /restoreSessionRole/);
  assert.match(app, /state\.settings\.ownerPinHash/);
  assert.doesNotMatch(app, /renderDelegate\(\);\s*showAuth\(\)/);
});

test('la iteración 9 expone equipo, localía, marcador de estadio y oculta comentarios al delegado', async () => {
  const [html, app] = await Promise.all([projectFile('index.html'), projectFile('js/app.js')]);
  assert.match(html, /Nombre de mi equipo/);
  assert.match(html, /name="venue"/);
  assert.match(app, /calledPlayerOptions/);
  assert.match(app, /data-score-team=/);
  assert.match(app, /state\.role === 'owner'.*Comentarios/s);
  assert.doesNotMatch(app, /normalizePositions\(player\)\.includes\('Portero'\).*keeperOptions/s);
  assert.match(app, /getAttribute\('id'\)/, 'conserva el arreglo del listener de convocatorias');
});

test('la fase 2 expone ejercicios, filtros, favoritos, CRUD y sesiones por bloques', async () => {
  const [html, app, sw] = await Promise.all([
    projectFile('index.html'), projectFile('js/app.js'), projectFile('sw.js'),
  ]);
  assert.match(html, /data-view="ejercicios"/);
  assert.match(html, /id="exercise-filters"/);
  assert.match(html, /id="exercise-form"/);
  assert.match(app, /id="session-form"/);
  assert.match(app, /INITIAL_EXERCISES/);
  assert.match(app, /recordType === 'trainingSession'/);
  assert.match(app, /form\.getAttribute\('id'\)/, 'los formularios dinámicos mantienen el patrón seguro');
  assert.match(sw, /training-domain\.js/);
});

test('la mejora de fase 2 muestra diagramas y jugadores destacados también en selectores', async () => {
  const [app, css] = await Promise.all([projectFile('js/app.js'), projectFile('styles.css')]);
  assert.match(app, /renderBoardDiagrams\(item\)/);
  assert.match(app, /class="player-count"/);
  assert.match(app, /👥.*jugadores/);
  assert.match(app, /item\.players.*item\.duration.*min/s);
  assert.match(app, /phase2-v2-seeded/);
  assert.match(css, /\.player-count/);
  assert.match(css, /\.exercise-diagram/);
});

test('la pizarra completa y el flujo añadir a sesión están conectados en la interfaz', async () => {
  const [html, app, css, sw] = await Promise.all([
    projectFile('index.html'), projectFile('js/app.js'), projectFile('styles.css'), projectFile('sw.js'),
  ]);
  assert.match(html, /id="add-session-dialog"/);
  assert.match(app, /Añadir a sesión/);
  assert.match(app, /completeExercise\(rawItem\)/);
  assert.match(app, /renderBoardDiagrams\(item\)/);
  assert.match(app, /sessionDurationStatus/);
  assert.match(app, /move-session-block/);
  assert.match(app, /remove-session-block/);
  assert.match(app, /form\.getAttribute\('id'\)/, 'conserva el listener global seguro');
  assert.match(css, /\.exercise-board/);
  assert.match(css, /background:#fff/);
  assert.match(sw, /exercise-planning\.js/);
});

test('la limpieza elimina los ejercicios precargados malos y el builder de sesión es intuitivo', async () => {
  const [app, sw] = await Promise.all([projectFile('js/app.js'), projectFile('sw.js')]);
  assert.match(app, /ensureLegacyExercisesNotPresent/, 'existe la migración que limpia los malos');
  assert.match(app, /legacy-exercises-not-present/, 'la migración tiene su flag');
  assert.match(app, /example === true/, 'solo borra los precargados, no los creados a mano');
  assert.match(app, /session-exercise-picker/, 'el builder muestra la lista de ejercicios');
  assert.match(app, /\+ Añadir/, 'cada ejercicio tiene botón para añadirlo');
  assert.match(app, /session-builder.*classList\.contains\('hidden'\)/, 'el botón añade directo cuando el builder está abierto');
  assert.match(sw, /campobase-v2\.7\.0/, 'caché actualizada');
});