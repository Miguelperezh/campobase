import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';

const runtimeModule = process.env.PLAYWRIGHT_MODULE || path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs');
const { chromium } = await import('playwright-core').catch(() => import(pathToFileURL(runtimeModule).href));
const root = path.resolve(process.env.CAMPOBASE_PREVIEW_ROOT || '.');
const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined),
  headless: true,
});

try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
    const page = await context.newPage();
    const errors = [], remote = [];
    await context.addInitScript(() => {
      // Fresh profile, synthetic records, offline cloud and intercepted share links.
      Object.defineProperty(navigator, 'onLine', { get: () => false });
      window.__whatsappCopies = [];
      window.__whatsappLinks = [];
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
        writeText: async text => window.__whatsappCopies.push(text),
      } });
      document.addEventListener('click', event => {
        if (event.target.closest?.('.wa-open-action-btn')) event.preventDefault();
      }, true);
      document.addEventListener('click', event => {
        const link = event.target.closest?.('.wa-open-action-btn');
        if (link) window.__whatsappLinks.push(link.href);
      });
    });
    await context.route('**/*', async route => {
      const request = route.request(), url = new URL(request.url());
      if (url.hostname !== 'localhost') {
        remote.push(`${request.method()} ${url.hostname}${url.pathname}`);
        return route.fulfill({ status: 503, body: 'null' });
      }
      const relative = decodeURIComponent(url.pathname).replace(/^\//, '') || 'index.html';
      const file = path.resolve(root, relative);
      if (!file.startsWith(root + path.sep)) return route.fulfill({ status: 404, body: '' });
      try {
        const contentType = /\.m?js$/.test(file) ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream';
        return route.fulfill({ status: 200, body: await fs.readFile(file), contentType });
      } catch { return route.fulfill({ status: 404, body: '' }); }
    });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('https://localhost/index.html');
    await page.waitForFunction(() => window.__campobase?.state.dataLoaded, null, { timeout: 20000 });
    await page.evaluate(async () => {
      const db = await import('./js/db.js'), auth = await import('./js/auth-manager.js');
      db.configureCloudStore(null);
      auth.setBoundSaasUserId('whatsapp-call-time-fixture');
      db.configureRealDatabase();
      const players = [{
        id: 'wa-player', name: 'Jugador de prueba', number: '9', positions: ['Central'],
        totalMinutes: 0, seasonMinutes: {}, preseasonMinutes: {}, ratingHistory: [], minuteReasons: [],
        fatherName: 'Padre de prueba', fatherPhone: '600000001', motherName: 'Madre de prueba', motherPhone: '600000002',
      }];
      const matches = [
        { id: 'wa-match-evening', date: '2099-01-01T19:00', opponent: 'Rival de tarde', location: 'Campo de prueba', status: 'scheduled', type: 'league', callupId: 'wa-callup' },
        { id: 'wa-match-midnight', date: '2099-01-02T00:20', opponent: 'Rival de madrugada', location: 'Otro campo de prueba', status: 'scheduled', type: 'friendly' },
      ];
      await db.putBatch({ players, matches, callups: [{ id: 'wa-callup', matchId: 'wa-match-evening', availableIds: ['wa-player'], selectedIds: ['wa-player'], exclusions: [] }], settings: [{ id: 'main', teamName: 'Equipo de prueba', theme: {}, presets: [], sem: {}, matchPreset: null, delegatePermissions: [] }] });
      await window.__campobase.refresh(true);
      window.__campobase.applyRole('owner');
      document.querySelector('#auth-dialog').close();
      window.__waReadRecords = async () => {
        const snapshot = {};
        for (const store of ['players', 'matches', 'callups', 'settings']) snapshot[store] = await db.getAll(store);
        return snapshot;
      };
      window.__waBefore = await window.__waReadRecords();
      window.__campobase.openWhatsAppDialog({ mode: 'callup', matchId: 'wa-match-evening' });
    });

    const preview = page.locator('#whatsapp-preview-text');
    const call = page.locator('#wa-call-time');
    assert.equal(await call.inputValue(), '18:15', 'Default citation remains 45 minutes before kickoff');
    const initial = await preview.inputValue();
    assert.match(initial, /18:15/);
    assert.match(initial, /19:00/);
    await page.locator('#wa-game-time').fill('20:00');
    assert.equal(await call.inputValue(), '19:15', 'Untouched citation still follows kickoff minus 45 minutes');
    assert.match(await preview.inputValue(), /19:15/);
    await page.locator('#wa-game-time').fill('19:00');
    assert.equal(await preview.inputValue(), initial);
    await call.fill('17:50');
    assert.equal(await preview.inputValue(), initial.replaceAll('18:15', '17:50'), 'Editing citation changes only that time in the generated message');

    await page.locator('#wa-kit-select').selectOption('secondary');
    assert.equal(await call.inputValue(), '17:50');
    assert.match(await preview.inputValue(), /17:50/);
    await page.locator('#wa-recipient-select').selectOption('player:wa-player');
    assert.equal(await call.inputValue(), '17:50');
    assert.match(await preview.inputValue(), /17:50/);
    await page.locator('#wa-parent-type-select').selectOption('father');
    assert.match(await preview.inputValue(), /17:50/);
    await page.locator('#wa-recipient-select').selectOption('group');
    await page.locator('#wa-game-time').fill('20:00');
    assert.equal(await call.inputValue(), '17:50', 'Manual citation survives edits to the kickoff time');
    assert.match(await preview.inputValue(), /17:50/);
    assert.match(await preview.inputValue(), /20:00/);

    // These controls only copy/capture locally: no browser can navigate to WhatsApp.
    const expected = await preview.inputValue();
    await page.locator('#whatsapp-copy-btn').click();
    assert.equal(await page.evaluate(() => window.__whatsappCopies.at(-1)), expected);
    await page.locator('#wa-dynamic-open-buttons .wa-open-action-btn').first().click();
    let shared = await page.evaluate(() => window.__whatsappLinks.at(-1));
    assert.equal(new URL(shared).searchParams.get('text'), expected);
    assert.equal(new URL(page.url()).hostname, 'localhost');
    const manualText = `${expected}\nNota manual conservada`;
    await preview.fill(manualText);
    await page.locator('#whatsapp-copy-btn').click();
    assert.equal(await page.evaluate(() => window.__whatsappCopies.at(-1)), manualText);
    await page.locator('#wa-dynamic-open-buttons .wa-open-action-btn').first().click();
    shared = await page.evaluate(() => window.__whatsappLinks.at(-1));
    assert.equal(new URL(shared).searchParams.get('text'), manualText);

    await page.locator('#whatsapp-dialog [data-close]').first().click();
    await page.evaluate(() => window.__campobase.openWhatsAppDialog({ mode: 'callup', matchId: 'wa-match-midnight' }));
    assert.equal(await call.inputValue(), '23:35', 'Opening another match resets citation to that match, including midnight wrap');
    assert.equal(await page.locator('#wa-game-time').inputValue(), '00:20');
    assert.match(await preview.inputValue(), /23:35/);
    assert.doesNotMatch(await preview.inputValue(), /17:50/);
    await call.fill('23:10');
    assert.match(await preview.inputValue(), /23:10/, 'Manual citation also applies to friendly match notices');
    await page.locator('.whatsapp-type-tabs [data-wa-type="training"]').click();
    await page.locator('.whatsapp-type-tabs [data-wa-type="callup"]').click();
    assert.equal(await page.locator('#wa-event-select').inputValue(), 'match:wa-match-midnight');
    assert.equal(await call.inputValue(), '23:35', 'Returning to callup mode loads the selected event rather than a previous message time');
    assert.match(await preview.inputValue(), /23:35/);
    assert.deepEqual(await page.evaluate(() => window.__waReadRecords()), await page.evaluate(() => window.__waBefore), 'Composing, copying and selecting times never changes stored sporting records');
    assert.deepEqual(errors, []);
    assert.equal(remote.some(request => /whatsapp\.com/.test(request)), false, 'No WhatsApp request was sent');
    console.log(JSON.stringify({ width, default: '45 minutes', manualTime: 'group/private/friendly', retainedAfter: 'kit/recipient/parent/kickoff', copyAndLink: 'current message', matchSwitch: '23:35 midnight', storedData: 'unchanged', pageErrors: errors.length, remoteRequestsBlocked: remote.length }));
    await context.close();
  }
} finally { await browser.close(); }
