import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('Modo Campo directo no importa db.js ni usa almacenamiento local', async () => {
  const js = await read('js/modo-campo-directo.js');
  assert.doesNotMatch(js, /from\s+['\"].*db\.js|import\s*\(/);
  assert.doesNotMatch(js, /indexedDB|localStorage|sessionStorage/);
  assert.match(js, /createClient\(SUPABASE_URL, SUPABASE_KEY/);
  for (const table of ['jugadores','convocatorias','partidos','asistencias','configuracion']) assert.match(js, new RegExp(`readTable\\(client,'${table}'\\)`));
});

test('Modo Campo directo sigue siendo solo lectura de Supabase', async () => {
  const js = await read('js/modo-campo-directo.js');
  assert.doesNotMatch(js, /\.insert\(|\.update\(|\.upsert\(|\.delete\(/);
  assert.match(js, /attendanceDrafts: new Map\(\)/);
  assert.match(js, /Guardar prueba de asistencia/);
});

test('asistencia de campo conserva estado, tardanza, hora y observaciones', async () => {
  const js = await read('js/modo-campo-directo.js');
  assert.match(js, />Presente</);
  assert.match(js, />Tarde</);
  assert.match(js, />Ausente</);
  assert.match(js, /Hora de llegada/);
  assert.match(js, /data-att-hour/);
  assert.match(js, /data-att-minute/);
  assert.match(js, /Observaciones/);
  assert.match(js, /Notas del registro/);
});

test('Modo Campo directo conserva archivado manual desde el 15/09/2026', async () => {
  const js = await read('js/modo-campo-directo.js');
  assert.match(js, /LEGACY_SESSION_CUTOFF = '2026-09-15'/);
  assert.match(js, /status === 'closed'/);
  assert.match(js, /closedAt/);
  assert.match(js, /match\?\.status === 'finished'/);
  assert.doesNotMatch(js, /Number\.isFinite\(match\?\.goalsFor\)/);
});

test('la navegación de campo no incluye Plantilla y sí Delegado y En vivo', async () => {
  const html = await read('modo-campo-directo.html');
  assert.doesNotMatch(html, /data-nav="plantilla"/);
  assert.match(html, /data-nav="delegado"/);
  assert.match(html, /data-nav="vivo"/);
  assert.match(html, />Delegado</);
  assert.match(html, />En vivo</);
});

test('la página directa carga solo Supabase oficial y su script independiente', async () => {
  const html = await read('modo-campo-directo.html');
  assert.match(html, /vendor\/supabase\.js/);
  assert.match(html, /js\/modo-campo-directo\.js\?v=2/);
  assert.doesNotMatch(html, /modo-campo-preview|js\/app\.js|js\/db\.js/);
});

test('script directo tiene sintaxis válida', () => {
  execFileSync(process.execPath, ['--check', fileURLToPath(new URL('js/modo-campo-directo.js', root))], { stdio:'pipe' });
});
