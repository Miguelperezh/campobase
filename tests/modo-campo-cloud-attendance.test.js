import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('loader de Modo Campo lee la nube sin operaciones de escritura', async () => {
  const source = await read('js/modo-campo-preview-loader.js');
  for (const [store, table] of Object.entries({ players: 'jugadores', callups: 'convocatorias', matches: 'partidos', trainings: 'asistencias', settings: 'configuracion' })) {
    assert.match(source, new RegExp(`${store}: '${table}'`));
  }
  assert.match(source, /method: 'GET'/);
  assert.doesNotMatch(source, /method:\s*'(POST|PUT|PATCH|DELETE)'/);
  assert.doesNotMatch(source, /\.upsert\(|\.insert\(|\.delete\(/);
});

test('la página usa un único loader cloud antes de arrancar Modo Campo', async () => {
  const html = await read('modo-campo-preview.html');
  assert.match(html, /modo-campo-preview-loader\.js\?v=2/);
  assert.doesNotMatch(html, /<script[^>]+modo-campo-preview\.js\?v=1/);
});

test('asistencia de Modo Campo cubre sesión y partido sin guardar datos reales', async () => {
  const source = await read('js/modo-campo-preview-attendance.js');
  assert.match(source, /data-attendance-kind=\"session\"/);
  assert.match(source, /data-attendance-kind=\"match\"/);
  assert.match(source, /row\?\.matchId/);
  assert.match(source, /solo de prueba/);
  assert.doesNotMatch(source, /\bput\(|\bputBatch\(|\bremove\(|\.upsert\(|\.insert\(|\.delete\(/);
});

test('los nuevos módulos de Modo Campo tienen sintaxis válida', () => {
  for (const path of ['js/modo-campo-preview-loader.js', 'js/modo-campo-preview-attendance.js']) {
    execFileSync(process.execPath, ['--check', fileURLToPath(new URL(path, root))], { stdio: 'pipe' });
  }
});
