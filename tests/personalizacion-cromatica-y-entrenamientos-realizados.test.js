import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('js/app.js', 'utf8');
const exercisePlanning = fs.readFileSync('js/exercise-planning.js', 'utf8');
const stylesRedesign = fs.readFileSync('styles-redesign.css', 'utf8');
const claudeHoy = fs.readFileSync('css/claude-hoy.css', 'utf8');
const claudePartido = fs.readFileSync('css/claude-partido.css', 'utf8');
const claudeEntreno = fs.readFileSync('css/claude-entreno.css', 'utf8');

test('index.html: Partido header tiene clase cbx-banner y topbar tiene tuerca de configuración', () => {
  assert.match(html, /id="partido"[^>]*>[\s\S]*?<div class="section-head cbx-banner"/, 'Cabecera de #partido debe incluir la clase cbx-banner');
  assert.match(html, /id="topbar-quick-color-btn"[^>]*class="topbar-gear-btn"/, 'La topbar debe tener el botón tuerca gris');
});

test('claude-hoy.css y styles-redesign.css: Tarjeta de marcador de Tu Día está aislada con variables dedicadas', () => {
  assert.match(claudeHoy, /var\(--today-match-bg/, 'claude-hoy.css debe utilizar var(--today-match-bg)');
  assert.match(claudeHoy, /var\(--today-match-ink/, 'claude-hoy.css debe utilizar var(--today-match-ink)');
  assert.match(stylesRedesign, /#hoy \.cbx-today-match-score[\s\S]*?var\(--today-match-bg/, 'styles-redesign.css debe fijar el fondo de .cbx-today-match-score');
  assert.match(stylesRedesign, /#hoy \.cbx-today-match-score[\s\S]*?var\(--today-match-ink/, 'styles-redesign.css debe fijar la tipografía de .cbx-today-match-score');
});

test('claude-partido.css y styles-redesign.css: Convocatorias y Preparación tienen cabeceras y píldoras configurables', () => {
  // Convocatorias
  assert.match(claudePartido, /var\(--callup-header-bg/, 'claude-partido.css debe vincular cabecera a --callup-header-bg');
  assert.match(claudePartido, /var\(--callup-header-ink/, 'claude-partido.css debe vincular texto a --callup-header-ink');
  assert.match(claudePartido, /var\(--callup-badge-bg/, 'claude-partido.css debe vincular 14 convocados a --callup-badge-bg');
  assert.match(claudePartido, /var\(--callup-out-bg/, 'claude-partido.css debe vincular 0 fuera a --callup-out-bg');

  // Preparación
  assert.match(claudePartido, /var\(--prep-header-bg/, 'claude-partido.css debe vincular tarjetas de preparación a --prep-header-bg');
  assert.match(claudePartido, /var\(--prep-header-ink/, 'claude-partido.css debe vincular texto de tarjetas a --prep-header-ink');
});

test('claude-entreno.css: Sesiones tiene 5 botones de acción, acordeón de realizados y Tácticas callout configurable', () => {
  // Botones de sesión
  assert.match(claudeEntreno, /\.cbx-btn-whistle/, 'Debe definir clase .cbx-btn-whistle');
  assert.match(claudeEntreno, /\.print-session\.cbx-btn-sub/, 'Debe definir clase .print-session.cbx-btn-sub');
  assert.match(claudeEntreno, /\.edit-session\.cbx-btn-sub/, 'Debe definir clase .edit-session.cbx-btn-sub');
  assert.match(claudeEntreno, /\.cbx-btn-completed/, 'Debe definir clase .cbx-btn-completed');
  assert.match(claudeEntreno, /\.cbx-completed-sessions-accordion/, 'Debe definir acordeón .cbx-completed-sessions-accordion');

  // Tácticas callout
  assert.match(claudeEntreno, /var\(--callout-bg/, 'claude-entreno.css debe vincular la caja informativa a --callout-bg');
  assert.match(claudeEntreno, /var\(--callout-ink/, 'claude-entreno.css debe vincular el texto de la llamada a --callout-ink');

  // Enlaces textuales sin fondo de botón
  assert.match(claudeEntreno, /\.view-session\.link-button[\s\S]*?background:\s*transparent\s*!important/, 'Títulos de sesión no deben tener fondo de botón');
  assert.match(claudeEntreno, /\.session-exercise-link[\s\S]*?background:\s*transparent\s*!important/, 'Enlaces de ejercicios no deben tener fondo de botón');
});

test('js/exercise-planning.js: buildFlexibleTrainingSession conserva el estado completed', () => {
  assert.match(exercisePlanning, /completed:\s*Boolean\(values\.completed\)/, 'buildFlexibleTrainingSession debe conservar la propiedad completed');
});

test('js/app.js: applyViewScopedTheme registra todas las variables cromáticas de vistas', () => {
  assert.match(app, /--today-match-bg/, 'Debe registrar --today-match-bg');
  assert.match(app, /--today-match-ink/, 'Debe registrar --today-match-ink');
  assert.match(app, /--callup-header-bg/, 'Debe registrar --callup-header-bg');
  assert.match(app, /--callup-badge-bg/, 'Debe registrar --callup-badge-bg');
  assert.match(app, /--callup-out-bg/, 'Debe registrar --callup-out-bg');
  assert.match(app, /--prep-header-bg/, 'Debe registrar --prep-header-bg');
  assert.match(app, /--whistle-bg/, 'Debe registrar --whistle-bg');
  assert.match(app, /--print-bg/, 'Debe registrar --print-bg');
  assert.match(app, /--edit-bg/, 'Debe registrar --edit-bg');
  assert.match(app, /--completed-bg/, 'Debe registrar --completed-bg');
  assert.match(app, /--callout-bg/, 'Debe registrar --callout-bg');
});

test('js/app.js: renderTrainingSessions y toggleTrainingSessionCompleted gestionan el archivo de entrenamientos', () => {
  assert.match(app, /async function toggleTrainingSessionCompleted\(id\)/, 'Debe existir toggleTrainingSessionCompleted');
  assert.match(app, /completedSessions = allSessions\.filter/, 'renderTrainingSessions debe separar los entrenamientos completados');
  assert.match(app, /cbx-completed-sessions-accordion/, 'renderTrainingSessions debe renderizar el acordeón cbx-completed-sessions-accordion');
  assert.match(app, /toggle-session-completed/, 'Debe renderizar y escuchar el botón .toggle-session-completed');
});

test('js/app.js: openQuickColorDialog contiene soporte independiente para todas las vistas', () => {
  assert.match(app, /id: 'hoy'[\s\S]*?Resumen & Tarjeta de Marcador/, 'Vista Hoy debe tener subpestaña específica');
  assert.match(app, /id: 'convocatorias'[\s\S]*?Convocatoria & Tarjetas/, 'Vista Convocatorias debe tener subpestaña específica');
  assert.match(app, /id: 'preparacion'[\s\S]*?Tarjetas de Partido & Acciones/, 'Vista Preparación debe tener subpestaña específica');
  assert.match(app, /id: 'sesiones'[\s\S]*?Acciones, Silbato & Fichas/, 'Vista Sesiones debe tener subpestaña específica');
  assert.match(app, /id: 'tacticas'[\s\S]*?Hero, Botones & Callout/, 'Vista Tácticas debe tener subpestañas');
  assert.match(app, /qc-mock-today-match/, 'Debe existir mock para marcador de Tu Día');
  assert.match(app, /qc-mock-callup-header/, 'Debe existir mock para tarjeta de convocatoria');
  assert.match(app, /qc-mock-callout/, 'Debe existir mock para la caja informativa de Tácticas');
});
