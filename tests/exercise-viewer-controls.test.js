import fs from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const source = fs.readFileSync('js/exercise-viewer-controls.js', 'utf8');
const layoutSource = fs.readFileSync('js/exercise-viewer-layout.js', 'utf8');
const supabaseClient = fs.readFileSync('js/supabase-client.js', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');

test('Movimiento grande activa el modo animated real sin ocultar el reproductor', async () => {
  await import('../js/exercise-viewer-controls.js');
  assert.match(source, /data-embedded-view=\"animated\"/);
  assert.match(source, /triggerEmbeddedMode/);
  assert.match(source, /embedded-view-controls/);
  assert.doesNotMatch(source, /label === '▶ Movimiento'/);
  assert.doesNotMatch(source, /label === 'Movimiento'/);
  assert.match(source, /exercise-board-viewer-back/);
  assert.match(source, /min-height:56px!important/);
  assert.match(layoutSource, /doc\.getElementById\('viewPlay'\)\s*\|\|\s*doc\.getElementById\('phasePlay'\)/);
  assert.match(layoutSource, /exercise-board-viewer-play/);
});

test('2475 publica solo la corrección del visor y mantiene la integración validada', () => {
  assert.match(supabaseClient, /exercise-viewer-controls\.js\?v=2475/);
  assert.match(supabaseClient, /exercise-viewer-layout\.js\?v=2475/);
  assert.match(supabaseClient, /exercise-board-persistence\.js\?v=2473/);
  assert.match(supabaseClient, /runtime-refresh\.js\?v=2473/);
  assert.match(serviceWorker, /exerciseboard-2475/);
  assert.match(serviceWorker, /exercise-viewer-controls\.js\?v=2475/);
  assert.match(serviceWorker, /exercise-viewer-layout\.js\?v=2475/);
});
