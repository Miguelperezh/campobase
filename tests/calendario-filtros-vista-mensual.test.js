import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const appSource = fs.readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const stylesSource = fs.readFileSync(new URL('../css/claude-partido.css', import.meta.url), 'utf8');

test('claude-partido.css contiene estilos completos para calendario, filtros, puntos simultáneos y entrenamientos', () => {
  assert.match(stylesSource, /\.cbx-cal-dots/, 'Debe existir .cbx-cal-dots');
  assert.match(stylesSource, /\.cbx-cal-dots i\.has-match/, 'Debe existir punto de partido en .cbx-cal-dots');
  assert.match(stylesSource, /\.cbx-cal-dots i\.has-training/, 'Debe existir punto de entreno en .cbx-cal-dots');
  assert.match(stylesSource, /\.cbx-calendar-filter-bar/, 'Debe existir .cbx-calendar-filter-bar');
  assert.match(stylesSource, /\.cbx-calendar-filter-btn/, 'Debe existir .cbx-calendar-filter-btn');
  assert.match(stylesSource, /\.cbx-calendar-match\.is-live-match/, 'Debe existir estilo para partido en juego .is-live-match');
  assert.match(stylesSource, /\.cbx-calendar-live-pill/, 'Debe existir la píldora animada .cbx-calendar-live-pill');
  assert.match(stylesSource, /\.cbx-calendar-training/, 'Debe existir la tarjeta de entrenamiento .cbx-calendar-training');
  assert.match(stylesSource, /\.cbx-calendar-score\.live/, 'Debe existir clase .live para el marcador en directo');
  assert.match(stylesSource, /\.cbx-calendar-score\.training-pill/, 'Debe existir clase .training-pill para tarjeta de entreno');
});

test('renderClaudeCalendar mantiene puntos independientes y distingue un descanso de un partido', () => {
  const block = appSource.slice(appSource.indexOf('function renderClaudeCalendar()'), appSource.indexOf('function renderCalendarFilterBar()'));
  const html = vm.runInNewContext(`${block}; renderClaudeCalendar()`, {
    state: { matches: [{ date: '2027-01-10T09:00' }], trainingSessions: [{ date: '2027-01-10' }], trainings: [], calendarRests: [{ date: '2027-01-24' }] },
    claudeCalendarMonth: new Date(2027, 0, 1), claudeCalendarSelectedDay: null, Date, Intl,
  });
  const sameDay = html.match(/<button[^>]*data-calendar-day="2027-01-10"[\s\S]*?<\/button>/)?.[0];
  const rest = html.match(/<button[^>]*data-calendar-day="2027-01-24"[\s\S]*?<\/button>/)?.[0];
  assert.match(sameDay, /class="has-match"/);
  assert.match(sameDay, /class="has-training"/);
  assert.match(rest, /aria-label="[^"]*descanso/);
  assert.match(rest, /class="has-rest"/);
  assert.doesNotMatch(rest, /class="has-match"/);
});

test('renderCalendarFilterBar define los 5 filtros esenciales con recuentos', () => {
  assert.match(appSource, /function renderCalendarFilterBar\(\)/, 'Debe existir renderCalendarFilterBar');
  assert.match(appSource, /\{ id: 'all', label: `Todos \(\$\{allCount\}\)` \}/, 'Debe incluir filtro Todos');
  assert.match(appSource, /\{ id: 'league', label: `Liga \(\$\{leagueCount\}\)` \}/, 'Debe incluir filtro Liga');
  assert.match(appSource, /\{ id: 'friendly', label: `Amistosos \(\$\{friendlyCount\}\)` \}/, 'Debe incluir filtro Amistosos');
  assert.match(appSource, /\{ id: 'tournament', label: `Torneos \(\$\{tournamentCount\}\)` \}/, 'Debe incluir filtro Torneos');
  assert.match(appSource, /\{ id: 'training', label: `Entrenos \(\$\{trainingCount\}\)` \}/, 'Debe incluir filtro Entrenos');
  assert.match(appSource, /class="cbx-calendar-filter-btn\$\{claudeCalendarFilter === f\.id \? ' is-active' : ''\}"/, 'Debe aplicar is-active según claudeCalendarFilter');
});

test('renderTrainingCalendarCard integra tarjetas de entrenamiento con imprimir y WhatsApp', () => {
  assert.match(appSource, /function renderTrainingCalendarCard\(training\)/, 'Debe existir renderTrainingCalendarCard');
  assert.match(appSource, /class="cbx-calendar-training panel"/, 'Debe usar la clase .cbx-calendar-training');
  assert.match(appSource, /class="print-session secondary"/, 'Debe incluir botón para imprimir sesión');
  assert.match(appSource, /class="open-whatsapp-session icon-button accent"/, 'Debe incluir botón de WhatsApp para la sesión');
  assert.match(appSource, /class="view-session secondary"/, 'Debe incluir botón para ver sesión técnica');
});

test('renderMatches gestiona partidos en directo, banner de día seleccionado y permisos de delegado', () => {
  // Partido en directo prioritario
  assert.match(appSource, /isLiveMatch/, 'Debe identificar si hay partido en directo');
  assert.match(appSource, /group\('🔴 En juego', liveMatches\)/, 'Debe agrupar partidos en juego en sección destacada');

  // Banner y deselección de día
  assert.match(appSource, /cbx-calendar-selected-day-banner/, 'Debe mostrar banner con fecha seleccionada');
  assert.match(appSource, /cbx-clear-day-btn/, 'Debe permitir ver todo el mes y deseleccionar fecha');

  // Permisos: ocultar crear, editar y borrar a delegado
  assert.match(appSource, /newMatchBtn\.hidden = !roleCanUseOwnerFeatures\(state\.role\)/, 'Debe ocultar + Partido al delegado');
  assert.match(appSource, /\$\{isOwner \? `<button class="edit-match secondary"[\s\S]*?Borrar<\/button>` : ''\}/, 'Debe restringir edición y borrado a Migue');
});

test('window.__campobase expone las funciones y getters del calendario para navegación y pruebas', () => {
  assert.match(appSource, /renderClaudeCalendar,/, 'Debe exportar renderClaudeCalendar');
  assert.match(appSource, /get calendarFilter\(\)/, 'Debe exponer getter calendarFilter');
  assert.match(appSource, /setCalendarFilter\(f\)/, 'Debe exponer setter setCalendarFilter');
  assert.match(appSource, /get calendarSelectedDay\(\)/, 'Debe exponer getter calendarSelectedDay');
  assert.match(appSource, /selectCalendarDay\(d\)/, 'Debe exponer helper selectCalendarDay');
});
