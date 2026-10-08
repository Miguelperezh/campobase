import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const appSource = await readFile(new URL('js/app.js', root), 'utf8');

test('renderMatches incluye seccion desplegable de Partidos jugados con contador y toolbar de busqueda', () => {
  assert.match(appSource, /class="played-matches-summary cbx-completed-matches-summary"/, 'Debe incluir summary con estilo de partidos jugados');
  assert.match(appSource, /<h3 class="played-matches-title">Partidos jugados<\/h3>/, 'Debe titilar Partidos jugados');
  assert.match(appSource, /class="cbx-played-matches-toolbar"/, 'Debe incluir toolbar de búsqueda y filtro');
  assert.match(appSource, /id="cbx-played-matches-search"/, 'Debe incluir input de búsqueda para partidos jugados');
  assert.match(appSource, /id="cbx-played-matches-type-select"/, 'Debe incluir selector de tipo de partido');
  assert.match(appSource, /playedMatchesSearchQuery/, 'Debe gestionar variable de búsqueda de partidos jugados');
  assert.match(appSource, /playedMatchesTypeFilter/, 'Debe gestionar filtro de tipo de competición');
});

test('sanitizeLiveTimer limpia timer huérfano si el partido ya está finalizado', () => {
  assert.match(appSource, /function sanitizeLiveTimer\(\)/, 'Debe existir función sanitizeLiveTimer');
  assert.match(appSource, /liveMatch\.status === 'finished'/, 'Debe verificar si el partido del timer está finalizado');
  assert.match(appSource, /state\.timer = null/, 'Debe poner timer a null');
  assert.match(appSource, /put\('settings', \{ id: 'live', timer: null/, 'Debe persistir live en settings como null');
});

test('toggleMatchCompleted archiva y desmarca partidos jugados como en sesiones', () => {
  assert.match(appSource, /async function toggleMatchCompleted\(id\)/, 'Debe definir toggleMatchCompleted');
  assert.match(appSource, /willBeCompleted \? 'finished' : 'planned'/, 'Debe alternar entre finished y planned');
  assert.match(appSource, /closedAt: willBeCompleted \? \(match\.closedAt \|\| Date\.now\(\)\) : null/, 'Debe gestionar closedAt');
  assert.match(appSource, /class="toggle-match-completed cbx-btn-completed/, 'renderMatchCard debe incluir boton toggle-match-completed');
  assert.match(appSource, /\$\{isPlayed \? '✓ Realizado' : '○ Realizado'\}/, 'Debe alternar etiqueta Realizado');
  assert.match(appSource, /toggleMatchCompleted\(completedBtn\.dataset\.id\)/, 'wireEvents debe enlazar clic en toggle-match-completed');
  assert.match(appSource, /toggleMatchCompleted,/, 'window.__campobase debe exportar toggleMatchCompleted');
  assert.match(appSource, /<span class="cbx-accordion-indicator">▾<\/span>/, 'El acordeon de partidos debe incluir el indicador ▾ como en sesiones');
});

test('renderCallups incluye seccion desplegable de Convocatorias realizadas con diseno identico a sesiones', () => {
  assert.match(appSource, /id="played-callups-collapsible"/, 'Debe incluir collapsible con id played-callups-collapsible');
  assert.match(appSource, /Convocatorias realizadas/, 'Debe titular Convocatorias realizadas como en sesiones');
  assert.match(appSource, /cbx-completed-sessions-accordion/, 'Debe usar clase cbx-completed-sessions-accordion');
  assert.match(appSource, /cbx-completed-sessions-summary/, 'Debe usar clase cbx-completed-sessions-summary');
  assert.match(appSource, /toggle-callup-completed/, 'Debe incluir clase toggle-callup-completed');
  assert.match(appSource, /async function toggleCallupCompleted\(id\)/, 'Debe definir toggleCallupCompleted');
  assert.match(appSource, /function isCallupPlayed\(callup\)/, 'Debe definir isCallupPlayed');
  assert.match(appSource, /function findMatchForCallup\(callup\)/, 'Debe definir findMatchForCallup');
  assert.match(appSource, /toggleCallupCompleted\(completedBtn\.dataset\.id\)/, 'wireEvents debe enlazar clic en toggle-callup-completed');
  assert.match(appSource, /toggleCallupCompleted,/, 'window.__campobase debe exportar toggleCallupCompleted');
  assert.match(appSource, /isCallupPlayed,/, 'window.__campobase debe exportar isCallupPlayed');
});

