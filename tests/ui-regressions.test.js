import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const projectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('la versión 2.15.0 está sincronizada en paquete, lock y caché PWA', async () => {
  const [pkgText, lockText, sw] = await Promise.all([
    projectFile('package.json'), projectFile('package-lock.json'), projectFile('sw.js'),
  ]);
  const pkg = JSON.parse(pkgText);
  const lock = JSON.parse(lockText);
  assert.equal(pkg.version, '2.15.0');
  assert.equal(lock.version, '2.15.0');
  assert.equal(lock.packages[''].version, '2.15.0');
  assert.match(sw, /campobase-v2\.15\.0/);
});

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

test('permite añadir y editar jugadores aunque todavía no tengan posición', async () => {
  const [html, app] = await Promise.all([projectFile('index.html'), projectFile('js/app.js')]);
  assert.match(html, /Posiciones \(puedes marcar varias\)/);
  assert.match(app, /const positions = checkedValues\('positions', form\)/);
  assert.doesNotMatch(app, /if \(!positions\.length\).*Selecciona al menos una posición/);
});

test('las fichas de plantilla muestran dorsal, posición, pierna y rotaciones con etiquetas claras', async () => {
  const [app, css] = await Promise.all([projectFile('js/app.js'), projectFile('styles.css')]);
  assert.match(app, /class="player-data"/);
  assert.match(app, />Dorsal</);
  assert.match(app, />Posición</);
  assert.match(app, />Pierna</);
  assert.match(app, />Rotaciones</);
  assert.match(app, /class="player-head"/);
  assert.match(app, /class="player-performance"/);
  assert.match(app, />Ver actividad y estadísticas</);
  assert.doesNotMatch(app, /<div><h3>\$\{escapeHtml\(player\.name\)\} <span class="pill">#/);
  assert.match(css, /\.player-data/);
  assert.match(css, /\.player-head/);
  assert.match(css, /\.player-performance/);
  assert.match(css, /overflow-wrap:anywhere/);
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
  assert.match(app, /roleCanUseOwnerFeatures\(state\.role\).*Comentarios/s);
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
  assert.match(sw, /campobase-v2\.15\.0/, 'caché actualizada');
});

test('la precarga de plantilla está conectada al arranque y a la caché PWA', async () => {
  const [app, sw] = await Promise.all([projectFile('js/app.js'), projectFile('sw.js')]);
  assert.match(app, /async function ensureSquadSeeded/);
  assert.match(app, /squad-26-27-seeded/);
  assert.match(app, /await ensureSquadSeeded\(\)/);
  assert.match(sw, /squad-seed\.js/);
});

test('la pizarra táctica permite arrastrar piezas, colocar balón y dibujar cinco tipos de flecha', async () => {
  const [app, tactics, css] = await Promise.all([projectFile('js/app.js'), projectFile('js/tactics.js'), projectFile('styles.css')]);
  assert.match(tactics, /id: 'sprint'/, 'incluye la herramienta sprint');
  assert.match(app, /pointerdown/, 'inicia interacción táctil o con ratón');
  assert.match(app, /moveTacticPiece/, 'actualiza posiciones del tablero');
  assert.match(app, /createTacticMove/, 'guarda flechas dibujadas a mano');
  assert.match(tactics, /data-piece="ball"/, 'el balón es una pieza colocable');
  assert.match(css, /\.tac-sprint/, 'el sprint tiene trazo diferenciado');
});

test('la guía táctica se oculta en el builder y aparece al abrir el detalle guardado', async () => {
  const app = await projectFile('js/app.js');
  const builder = app.slice(app.indexOf('function tacticBuilder'), app.indexOf('async function saveTactic'));
  const save = app.slice(app.indexOf('async function saveTactic'), app.indexOf('function showTacticDetail'));
  const detail = app.slice(app.indexOf('function showTacticDetail'), app.indexOf('function tacticPoint'));

  assert.doesNotMatch(builder, /tactic-guide|FORMATION_GUIDES/, 'el editor no muestra explicaciones');
  assert.match(save, /classList\.add\('hidden'\)/, 'guardar cierra el editor');
  assert.match(detail, /FORMATION_GUIDES\[tactic\.formation\]/, 'el detalle usa la guía de la formación guardada');
  assert.match(detail, /qué busco/);
  assert.match(detail, /Con balón/);
  assert.match(detail, /Sin balón \/ defensa/);
  assert.match(detail, /Al perder el balón/);
  assert.match(app, /view-tactic[^\n]+showTacticDetail/, 'abrir una táctica guardada muestra su detalle');
});

test('las sesiones son una pestaña aparte, con ejercicios pinchables y tiempo configurable', async () => {
  const [html, app] = await Promise.all([projectFile('index.html'), projectFile('js/app.js')]);
  assert.match(html, /data-view="sesiones"/, 'hay pestaña de sesiones en la navegación');
  assert.match(html, /id="sesiones"/, 'existe la sección de sesiones');
  assert.match(html, /id="title-sessions"/, 'la sección de sesiones tiene título propio');
  assert.match(app, /showView\('sesiones'\)/, 'al guardar una sesión se muestra la pestaña de sesiones');
  assert.match(app, /session-exercise-link/, 'cada ejercicio de la sesión es pinchable');
  assert.match(app, /showExerciseDetail/, 'existe la función que muestra el detalle del ejercicio');
  assert.match(app, /targetDuration/, 'la sesión guarda el tiempo objetivo');
  assert.match(app, /sessionKind/, 'la sesión guarda si es calentamiento de partido/amistoso');
  assert.match(app, /sessionDurationStatus\(blocks, target\)/, 'el indicador usa el tiempo configurable');
});

test('el PIN demo abre una sesión aislada de dos horas sin ajustes ni datos reales', async () => {
  const [html, app, db, css, sw] = await Promise.all([
    projectFile('index.html'), projectFile('js/app.js'), projectFile('js/db.js'), projectFile('styles.css'), projectFile('sw.js'),
  ]);

  assert.match(html, /id="demo-pin-settings-form"/);
  assert.match(html, /name="demoPin"/);
  assert.match(html, /id="demo-team-form"/);
  assert.match(html, /data-view="ajustes"[^>]*id="settings-nav"/);
  assert.match(app, /demoPinSalt/);
  assert.match(app, /demoPinHash/);
  assert.match(app, /applyRole\('demo'/);
  assert.match(app, /configureDemoDatabase/);
  assert.match(app, /deleteDemoDatabase/);
  assert.match(app, /classList\.toggle\('demo-mode'/);
  assert.match(app, /settings-nav[^\n]+hidden/);
  assert.match(app, /DEMO_DURATION_MS/);
  assert.match(db, /if \(isDemoDatabase\(\)\) return \{ online: false, pending: 0, demo: true \}/);
  assert.match(css, /\.demo-mode \.club-crest\{display:none\}/);
  assert.match(sw, /demo-session\.js/);
});

test('la demo conserva toda la operativa de Migue pero nunca precarga su plantilla', async () => {
  const app = await projectFile('js/app.js');
  const startDemo = app.slice(app.indexOf('async function startDemoSession'), app.indexOf('async function endDemoSession'));

  assert.match(app, /roleCanUseOwnerFeatures\(state\.role\)/);
  assert.match(startDemo, /ensurePhase2Seeded\(\)/);
  assert.doesNotMatch(startDemo, /ensureSquadSeeded\(\)/);
  assert.match(startDemo, /await refresh\(\)/);
});