import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('Modo Campo directo sigue leyendo Supabase sin almacenamiento local', async () => {
  const js = await read('js/modo-campo-directo.js');
  assert.doesNotMatch(js, /from\s+['\"].*db\.js|import\s*\(/);
  assert.doesNotMatch(js, /indexedDB|localStorage|sessionStorage/);
  assert.match(js, /createClient\(SUPABASE_URL, SUPABASE_KEY/);
  for (const table of ['jugadores','convocatorias','partidos','asistencias','configuracion']) assert.match(js, new RegExp(`readTable\\(client,'${table}'\\)`));
});

test('la capa integrada guarda asistencia real y Realizado en Supabase', async () => {
  const js = await read('js/modo-campo-actions.js');
  assert.match(js, /from\('asistencias'\)/);
  assert.match(js, /\.upsert\(/);
  assert.match(js, /status: isMatch \? 'finished' : 'closed'/);
  assert.match(js, /closedAt: now/);
  assert.match(js, /Guardar asistencia/);
  assert.match(js, /✓ Realizado/);
  assert.doesNotMatch(js, /indexedDB|localStorage|sessionStorage/);
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

test('Modo Campo conserva archivado manual desde el 15/09/2026', async () => {
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

test('la página integrada carga Supabase y sus dos scripts de Modo Campo', async () => {
  const html = await read('modo-campo-directo.html');
  assert.match(html, /vendor\/supabase\.js/);
  assert.match(html, /js\/modo-campo-directo\.js\?v=3/);
  assert.match(html, /js\/modo-campo-actions\.js\?v=1/);
  assert.doesNotMatch(html, /modo-campo-preview|js\/app\.js|js\/db\.js/);
});

test('Modo Campo enlaza las funciones reales de WhatsApp, Delegado y En vivo', async () => {
  const actions = await read('js/modo-campo-actions.js');
  const integration = await read('js/modo-campo-integration.js');
  assert.match(actions, /whatsapp-session/);
  assert.match(actions, /whatsapp-match/);
  assert.match(actions, /data-nav === 'vivo'/);
  assert.match(actions, /data-nav === 'delegado'/);
  assert.match(integration, /open-whatsapp-session/);
  assert.match(integration, /open-whatsapp-match/);
  assert.match(integration, /Volver a Modo Campo/);
});

test('scripts de Modo Campo tienen sintaxis válida', () => {
  for (const path of ['js/modo-campo-directo.js', 'js/modo-campo-actions.js', 'js/modo-campo-integration.js']) {
    execFileSync(process.execPath, ['--check', fileURLToPath(new URL(path, root))], { stdio:'pipe' });
  }
});
