import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const projectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('CampoBase nunca queda abierto sin login o PIN', async () => {
  const html = await projectFile('index.html');
  assert.match(html, /Salvavidas del arranque/);
  assert.match(html, /if \(app\?\.state\?\.role\) return/);
  assert.match(html, /document\.body\.classList\.add\('auth-locked'\)/);
  assert.match(html, /dialog\.showModal\(\)/);
});

test('recargar vuelve a pedir PIN y el desbloqueo SaaS solo sirve una vez', async () => {
  const [app, auth, sw] = await Promise.all([
    projectFile('js/app.js'),
    projectFile('js/saas-auth-ui-v2.js'),
    projectFile('sw.js'),
  ]);
  assert.match(app, /Nunca restaurar automáticamente owner\/delegate tras recargar/);
  assert.match(app, /20260918-emergency-auth-restore-v4/);
  assert.match(auth, /browserSessionIsActive\(session\.user\.id\)[\s\S]*clearBrowserSessionActive\(\)/);
  assert.match(sw, /emergency-auth-restore-v4/);
});
