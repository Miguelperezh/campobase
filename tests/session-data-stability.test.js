import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const projectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('la cola local nunca se lee antes de preparar y vincular la sesión cloud', async () => {
  const db = await projectFile('js/db.js');
  const flush = db.slice(db.indexOf('export async function flushSyncQueue'), db.indexOf('async function replaceLocalStore'));
  const prepareIndex = flush.indexOf("cloudStore.prepare");
  const queueIndex = flush.indexOf("localGetAll(SYNC_QUEUE)");
  assert.ok(prepareIndex >= 0, 'flushSyncQueue debe preparar la sesión cloud');
  assert.ok(queueIndex > prepareIndex, 'la sesión debe prepararse antes de abrir la cola local');
});

test('la base IndexedDB real se resuelve de nuevo después de recuperar el usuario SaaS', async () => {
  const db = await projectFile('js/db.js');
  const open = db.slice(db.indexOf('export function openDatabase'), db.indexOf('function requestResult'));
  assert.match(open, /if \(!demoSession\) activeDatabaseName = boundDatabaseName\(\)/);
});

test('el store cloud expone prepare para validar usuario antes de sincronizar', async () => {
  const source = await projectFile('js/supabase-client.js');
  assert.match(source, /async prepare\(\)\s*\{[\s\S]*requireBoundUser\(client\)/);
});

test('CampoBase conserva la pestaña activa durante una recarga de la misma pestaña', async () => {
  const app = await projectFile('js/app.js');
  assert.match(app, /const ACTIVE_VIEW_KEY = 'campobase\.activeView'/);
  assert.match(app, /sessionStorage\.setItem\(ACTIVE_VIEW_KEY, viewId\)/);
  assert.match(app, /params\.get\('view'\) \|\| storedActiveView\(\)/);
});

test('el acceso local de la misma pestaña puede restaurarse sin volver a pedir PIN', async () => {
  const app = await projectFile('js/app.js');
  const restore = app.slice(app.indexOf('async function restoreSessionRole'), app.indexOf('function showAuth'));
  assert.match(restore, /if \(hasSaasBinding\) return false/);
  assert.match(restore, /applyRole\(role\);\s*return true/);
  const localRestore = restore.slice(restore.indexOf('let hasSaasBinding'));
  assert.doesNotMatch(localRestore, /removeItem\(SESSION_ROLE_KEY\)/);
});

test('la sesión SaaS activa de la pestaña no se consume después de una sola recarga', async () => {
  const auth = await projectFile('js/saas-auth-ui-v2.js');
  assert.match(auth, /markBrowserSessionActive\(session\.user\.id\)/);
  assert.doesNotMatch(auth, /browserSessionIsActive\(session\.user\.id\)[\s\S]{0,120}clearBrowserSessionActive\(\)/);
});

test('el service worker no fuerza una segunda navegación de todas las pestañas', async () => {
  const sw = await projectFile('sw.js');
  assert.doesNotMatch(sw, /client\.navigate\(client\.url\)/);
  assert.match(sw, /self\.clients\.claim\(\)/);
});

test('la URL de validación no registra ni sustituye el service worker de producción', async () => {
  const app = await projectFile('js/app.js');
  assert.match(app, /isValidationPreview = location\.pathname\.endsWith\('\/validacion-estabilidad\.html'\)/);
  assert.match(app, /'serviceWorker' in navigator && !isValidationPreview/);
});

test('showView recorre colecciones con $$ y no vuelve a provocar forEach sobre un único elemento', async () => {
  const app = await projectFile('js/app.js');
  const showView = app.slice(app.indexOf('function showView'), app.indexOf('// Buscador global'));
  assert.match(showView, /\$\$\('\.view'\)\.forEach/);
  assert.match(showView, /\$\$\('\.bottom-nav button'\)\.forEach/);
  assert.doesNotMatch(showView, /(^|[^$])\$\('\.view'\)\.forEach/m);
  assert.doesNotMatch(showView, /(^|[^$])\$\('\.bottom-nav button'\)\.forEach/m);
});

