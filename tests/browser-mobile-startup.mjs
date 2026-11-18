import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const fallback = path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs');
const { chromium } = await import('playwright-core').catch(() => import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || fallback).href));
const root = path.resolve(process.env.CAMPOBASE_PREVIEW_ROOT || '.');
const delayMs = 5000;
const requests = [];
let slowServer = false;
const server = http.createServer(async (request, response) => {
  const started = Date.now();
  const url = new URL(request.url, 'http://campobase.test');
  const relative = decodeURIComponent(url.pathname).replace(/^\//, '') || 'index.html';
  const slow = slowServer && /(?:\.(?:m?js|html)$|^index\.html$)/.test(relative);
  const entry = { path: url.pathname, slow, started, responded: null };
  requests.push(entry);
  if (slow) await new Promise((resolve) => setTimeout(resolve, delayMs));
  let body;
  let status = 200;
  const file = path.resolve(root, relative);
  try {
    if (relative === '__slow-probe.js') body = Buffer.from('export const isolatedProbe = true;');
    else {
      if (!file.startsWith(root + path.sep)) throw new Error('outside fixture');
      body = await fs.readFile(file);
    }
  } catch { status = 404; body = Buffer.from('Not found'); }
  const mime = /\.m?js$/.test(file) ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : file.endsWith('.json') || file.endsWith('.webmanifest') ? 'application/json' : file.endsWith('.svg') ? 'image/svg+xml' : file.endsWith('.png') ? 'image/png' : 'application/octet-stream';
  entry.responded = Date.now();
  response.writeHead(status, { 'Content-Type': mime, 'Cache-Control': 'no-store' });
  response.end(body);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const origin = `http://campobase.test:${port}`;
let browser;
try {
  browser = await chromium.launch({
    executablePath: process.env.CAMPOBASE_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: [`--host-resolver-rules=MAP campobase.test 127.0.0.1`, `--unsafely-treat-insecure-origin-as-secure=${origin}`, '--no-proxy-server'],
  });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'allow' });
  await context.addInitScript(() => Object.defineProperty(navigator, 'onLine', { get: () => false }));
  const externalWrites = [];
  // Local requests deliberately use a physical HTTP server: Playwright routing
  // cannot stand in for a real service-worker fetch/cache interaction.
  await context.route((url) => url.origin !== origin, (route) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(route.request().method()) && !['/rest/v1/rpc/get_delegate_account', '/rest/v1/rpc/mi_equipo_contexto'].includes(new URL(route.request().url()).pathname)) externalWrites.push(route.request().url());
    return route.fulfill({ status: 503, body: '' });
  });
  const page = await context.newPage();
  const errors = [];
  const navigations = [];
  const responses = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('framenavigated', (frame) => { if (frame === page.mainFrame()) navigations.push(frame.url()); });
  page.on('response', (response) => {
    if (new URL(response.url()).origin === origin) responses.push({ url: response.url(), worker: response.fromServiceWorker() });
  });
  await page.goto(origin + '/', { waitUntil: 'commit' });
  await page.waitForFunction(() => window.__campobase?.state.dataLoaded, null, { timeout: 20000 });
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, { timeout: 30000 });
  assert.equal(navigations.length, 1, 'first worker installation must not reload the app');

  await page.evaluate(async () => {
    const db = await import('./js/db.js');
    db.configureCloudStore(null);
    const app = window.__campobase;
    app.applyRole('owner');
    sessionStorage.setItem('campobase.sessionRole', 'owner');
    const settings = { ...structuredClone(app.state.settings), id: 'main', teamName: 'Equipo sintético de arranque', startupMarker: 'warm-cache-fixture', theme: { btnBg: '#13579b', btnInk: '#fff1ed', accentColor: '#13579b' } };
    await db.putBatch({ settings: [settings, { id: 'startup-session', recordType: 'trainingSession', name: 'Sesión sintética conservada', date: '2026-11-19', time: '17:00', pitch: 'Campo sintético', completed: true, attendanceTaken: true, targetDuration: 60, blocks: [] }], players: [{ id: 'startup-player', name: 'Jugador sintético conservado', number: 99, positions: ['Central'], totalMinutes: 0, seasonMinutes: {}, preseasonMinutes: {}, ratingHistory: [], minuteReasons: [] }] });
    localStorage.setItem('campobase.mobile-startup-marker', 'do-not-reset');
    await app.refresh(true);
    app.applyRole('owner');
    document.querySelector('#auth-dialog')?.close();
    window.__startupFixtureData = (await db.exportDatabase()).data;
  });
  const before = await page.evaluate(() => window.__startupFixtureData);
  assert.equal(await page.evaluate(() => window.__campobase.state.settings.startupMarker), 'warm-cache-fixture');
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--btn').trim()), '#13579b');

  const measureReopen = async (name) => {
    const responseStart = responses.length;
    const requestStart = requests.length;
    const started = Date.now();
    const navigation = await page.reload({ waitUntil: 'commit', timeout: 10000 });
    await page.waitForFunction(() => window.__campobase?.state.dataLoaded, null, { timeout: 4000 });
    const readyMs = Date.now() - started;
    assert.ok(readyMs < 4000, `${name}: app waited for the 5-second network delay (${readyMs} ms)`);
    assert.ok(navigation.fromServiceWorker(), `${name}: document must come from the installed worker`);
    const snapshot = await page.evaluate(async () => {
      const db = await import('./js/db.js');
      return { data: (await db.exportDatabase()).data, marker: localStorage.getItem('campobase.mobile-startup-marker'), team: window.__campobase.state.settings.teamName, color: getComputedStyle(document.documentElement).getPropertyValue('--btn').trim(), player: window.__campobase.state.players.find((item) => item.id === 'startup-player')?.name };
    });
    assert.deepEqual(snapshot.data, before, `${name}: IndexedDB records changed during startup`);
    assert.equal(snapshot.marker, 'do-not-reset');
    assert.equal(snapshot.team, 'Equipo sintético de arranque');
    assert.equal(snapshot.player, 'Jugador sintético conservado');
    assert.equal(snapshot.color, '#13579b');
    const appScripts = responses.slice(responseStart).filter((item) => /\/js\/.+\.js(?:\?|$)/.test(item.url));
    assert.ok(appScripts.length > 50, `${name}: app module graph did not load`);
    assert.ok(appScripts.every((item) => item.worker), `${name}: an app module bypassed the warm worker cache`);
    const serverAppRequests = requests.slice(requestStart).filter((item) => item.path === '/' || item.path === '/index.html' || item.path.startsWith('/js/'));
    assert.equal(serverAppRequests.length, 0, `${name}: cached navigation/modules still reached the slow server: ${serverAppRequests.map(item => item.path)}`);
    return { mode: name, readyMs, cachedAppScripts: appScripts.length, documentFromWorker: true, dataAndTheme: 'unchanged' };
  };

  slowServer = true;
  const probeStarted = Date.now();
  const slowProbe = fetch(`http://127.0.0.1:${port}/__slow-probe.js`).then(async (response) => { await response.text(); return Date.now() - probeStarted; });
  const slow = await measureReopen('warm-cache / server delayed 5000 ms');
  const actualServerDelayMs = await slowProbe;
  assert.ok(actualServerDelayMs >= 4900, 'server delay injection was not applied');
  await context.setOffline(true);
  const offline = await measureReopen('warm-cache / offline');
  // Exercise the real returning-account PIN form with a populated, isolated
  // account database and zero connectivity. The first scenario uses legacy data.
  await page.evaluate(async () => {
    const db = await import('./js/db.js');
    const { setBoundSaasUserId } = await import('./js/auth-manager.js');
    const { hashPin } = await import('./js/domain.js');
    const user = '10000000-0000-4000-8000-000000000001';
    setBoundSaasUserId(user);
    db.configureRealDatabase();
    db.configureCloudStore(null);
    const pinSalt = 'fixture-account';
    const ownerPinHash = await hashPin('8652', pinSalt);
    const delegatePinHash = await hashPin('3791', pinSalt);
    await db.putBatch({ settings: [{ id: 'main', teamName: 'Cuenta de prueba móvil', pinSalt, ownerPinHash, delegatePinHash }], players: [{ id: 'own-player', name: 'De este equipo', number: 7 }] });
    sessionStorage.setItem('campobase.sessionRole', 'owner');
    localStorage.setItem('campobase.lastAuthRole', 'owner');
  });
  await page.reload({ waitUntil: 'commit' });
  const pin = page.locator('#auth-form [name="pin"]');
  await pin.waitFor({ state: 'visible', timeout: 4000 });
  const pinStart = Date.now();
  await pin.fill('8652');
  await page.locator('#auth-submit-btn').click();
  await page.waitForFunction(() => window.__campobase?.state.role === 'owner' && !document.querySelector('#auth-dialog')?.open, null, { timeout: 4000 });
  assert.equal(await page.evaluate(() => window.__campobase.state.settings.teamName), 'Cuenta de prueba móvil');
  const ownerPinMs = Date.now() - pinStart;
  assert.equal(await page.evaluate(() => navigator.onLine), false);
  assert.deepEqual(errors, []);
  assert.deepEqual(externalWrites, []);
  console.log(JSON.stringify({ actualServerDelayMs, ownerPinMs, results: [slow, offline], firstInstallNavigations: 1, pageErrors: errors.length, externalWrites: externalWrites.length }, null, 2));
  await context.close();
} finally {
  await browser?.close();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
