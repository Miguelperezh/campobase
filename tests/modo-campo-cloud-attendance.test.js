import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('loader de Modo Campo lee Supabase con el cliente oficial y sin fallback local', async () => {
  const source = await read('js/modo-campo-preview-loader.js');
  for (const [store, table] of Object.entries({ players: 'jugadores', callups: 'convocatorias', matches: 'partidos', trainings: 'asistencias', settings: 'configuracion' })) {
    assert.match(source, new RegExp(`${store}: '${table}'`));
  }
  assert.match(source, /supabase\?\.createClient|supabase\.createClient/);
  assert.match(source, /\.from\(table\)/);
  assert.match(source, /\.select\('id,payload,updated_at,deleted_at'\)/);
  assert.match(source, /__CAMPO_PREVIEW_SOURCE__ = 'cloud'/);
  assert.match(source, /__CAMPO_PREVIEW_SOURCE__ = 'cloud-error'/);
  assert.doesNotMatch(source, /local-fallback|cach[eé] local|indexedDB/i);
  assert.doesNotMatch(source, /\.upsert\(|\.insert\(|\.delete\(/);
});

test('la página carga Supabase oficial y sustituye db.js solo dentro de Modo Campo', async () => {
  const html = await read('modo-campo-preview.html');
  assert.match(html, /vendor\/supabase\.js/);
  assert.match(html, /"\.\/js\/db\.js"\s*:\s*"\.\/js\/modo-campo-preview-db\.js"/);
  assert.match(html, /modo-campo-preview-loader\.js\?v=3/);
  assert.doesNotMatch(html, /<script[^>]+modo-campo-preview\.js\?v=1/);
});

test('el adaptador db de Modo Campo obtiene los datos del snapshot cloud y bloquea escritura', async () => {
  const source = await read('js/modo-campo-preview-db.js');
  assert.match(source, /__CAMPO_PREVIEW_CLOUD__/);
  assert.match(source, /export async function getAll/);
  assert.match(source, /export async function getOne/);
  assert.match(source, /solo lectura/);
  assert.doesNotMatch(source, /indexedDB|localStorage|sessionStorage/);
});

test('asistencia de Modo Campo cubre sesión y partido sin guardar datos reales', async () => {
  const source = await read('js/modo-campo-preview-attendance.js');
  assert.match(source, /data-attendance-kind=\"session\"/);
  assert.match(source, /data-attendance-kind=\"match\"/);
  assert.match(source, /row\?\.matchId/);
  assert.match(source, /solo de prueba/);
  assert.doesNotMatch(source, /from\s+['\"].*db\.js['\"]/);
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(source, /\bput\s*\(|\bputBatch\s*\(|\bremove\s*\(|\.upsert\s*\(|\.insert\s*\(/);
});

test('los módulos nuevos de Modo Campo tienen sintaxis válida', () => {
  for (const path of ['js/modo-campo-preview-loader.js', 'js/modo-campo-preview-db.js', 'js/modo-campo-preview-attendance.js']) {
    execFileSync(process.execPath, ['--check', fileURLToPath(new URL(path, root))], { stdio: 'pipe' });
  }
});
