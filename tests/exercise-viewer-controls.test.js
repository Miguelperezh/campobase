import fs from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const source = fs.readFileSync('js/exercise-viewer-controls.js', 'utf8');
const layoutSource = fs.readFileSync('js/exercise-viewer-layout.js', 'utf8');
const supabaseClient = fs.readFileSync('js/supabase-client.js', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');

test('el visor mantiene una sola pareja Plano fijo/Movimiento y agranda Volver a ejercicios', async () => {
  await import('../js/exercise-viewer-controls.js');
  assert.match(source, /label === 'Plano fijo'/);
  assert.match(source, /label === 'Movimiento'/);
  assert.match(source, /label === '▶ Movimiento'/);
  assert.match(source, /label === '← Ejercicios'/);
  assert.match(source, /exercise-board-viewer-back/);
  assert.match(source, /min-height:56px!important/);
  assert.match(source, /font-size:16px!important/);
  assert.doesNotMatch(source, /label === '▶ Reproducir'/);
  assert.match(layoutSource, /exercise-board-viewer-play/);
});

test('2474 publica la corrección de reproducción sin tocar el resto de la integración validada', () => {
  assert.match(supabaseClient, /exercise-viewer-controls\.js\?v=2473/);
  assert.match(supabaseClient, /exercise-viewer-layout\.js\?v=2474/);
  assert.match(supabaseClient, /exercise-board-persistence\.js\?v=2473/);
  assert.match(supabaseClient, /runtime-refresh\.js\?v=2473/);
  assert.match(serviceWorker, /exerciseboard-2474/);
  assert.match(serviceWorker, /exercise-viewer-controls\.js\?v=2473/);
  assert.match(serviceWorker, /exercise-viewer-layout\.js\?v=2474/);
});
