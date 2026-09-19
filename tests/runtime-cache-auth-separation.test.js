import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('un error de runtime obsoleto limpia solo cachés estáticas y service worker', () => {
  assert.match(html, /normalizePlayerName is not defined\|forEach is not a function/i);
  assert.match(html, /caches\.keys\(\)/);
  assert.match(html, /reg\.unregister\(\)/);
  assert.doesNotMatch(html, /indexedDB\.deleteDatabase/);
  assert.doesNotMatch(html, /localStorage\.clear\(\)/);
});

test('un PIN correcto no vuelve a mostrarse como error si falla el refresh posterior', () => {
  const submit = app.slice(app.indexOf('async function submitAuth'), app.indexOf('async function changePins'));
  const closeAt = submit.indexOf("$('#auth-dialog')?.open");
  const syncAt = submit.indexOf('await synchronizeCloud()');
  assert.ok(closeAt >= 0 && syncAt > closeAt, 'El diálogo debe cerrarse antes de sincronizar datos');
  assert.match(submit, /let authenticated = false/);
  assert.match(submit, /authenticated = Boolean\(state\.role\)/);
  assert.match(submit, /Acceso correcto; fallo posterior al cargar datos/);
});

test('la versión móvil fuerza un runtime nuevo', () => {
  assert.match(html, /20260919-runtime-rescue-v8/);
  assert.match(app, /sw\.js\?v=20260919-runtime-rescue-v8/);
});
