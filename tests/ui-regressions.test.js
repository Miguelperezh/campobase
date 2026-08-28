import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const projectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('todos los campos con hora usan selectores propios de 24 horas', async () => {
  const [html, app] = await Promise.all([projectFile('index.html'), projectFile('js/app.js')]);
  assert.doesNotMatch(html, /type=["'](?:time|datetime-local)["']/i);
  assert.doesNotMatch(app, /type=\\?["'](?:time|datetime-local)\\?["']/i);
  assert.match(html, /name="dateHour"/);
  assert.match(app, /time24Markup\('manualDate'/);
  assert.match(app, /time24Markup\(`arrivalTime-\$\{player\.id\}`/);
});

test('la aplicación no usa confirmaciones nativas', async () => {
  const app = await projectFile('js/app.js');
  assert.doesNotMatch(app, /\bconfirm\s*\(/);
  assert.match(app, /confirmation-dialog/);
});

test('la sesión autenticada se restaura al recargar y el PIN no se abre incondicionalmente', async () => {
  const app = await projectFile('js/app.js');
  assert.match(app, /sessionStorage/);
  assert.match(app, /restoreSessionRole/);
  assert.match(app, /state\.settings\.ownerPinHash/);
  assert.doesNotMatch(app, /renderDelegate\(\);\s*showAuth\(\)/);
});