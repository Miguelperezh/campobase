import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const projectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('si no hay rol activo, el arranque vuelve a mostrar el diálogo de acceso', async () => {
  const html = await projectFile('index.html');
  assert.match(html, /Último salvavidas del arranque/);
  assert.match(html, /if \(app\?\.state\?\.role\) return/);
  assert.match(html, /document\.body\.classList\.add\('auth-locked'\)/);
  assert.match(html, /dialog\.showModal\(\)/);
});

test('la recuperación fuerza app y service worker nuevos', async () => {
  const [html, app, sw] = await Promise.all([
    projectFile('index.html'),
    projectFile('js/app.js'),
    projectFile('sw.js'),
  ]);
  assert.match(html, /js\/app\.js\?v=2503/);
  assert.match(html, /js\/redesign-nav\.js\?v=2503/);
  assert.match(app, /emergency-auth-restore-v4/);
  assert.match(sw, /emergency-auth-restore-v4/);
  assert.match(sw, /\.\/js\/app\.js\?v=2503/);
});


test('el PIN vuelve a pedirse al recargar y el desbloqueo SaaS de arranque se consume una sola vez', async () => {
  const [app, auth] = await Promise.all([
    projectFile('js/app.js'),
    projectFile('js/saas-auth-ui-v2.js'),
  ]);
  assert.match(app, /sessionStorage\.removeItem\(SESSION_ROLE_KEY\)/);
  assert.match(app, /Cada nueva carga debe volver a pedir PIN/);
  assert.match(auth, /browserSessionIsActive\(session\.user\.id\)[\s\S]*clearBrowserSessionActive\(\)/);
});
