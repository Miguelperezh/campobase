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
