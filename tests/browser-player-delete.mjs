import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(process.env.CAMPOBASE_PREVIEW_ROOT || '.');
const bundled = path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs');
const { chromium } = await import('playwright-core').catch(() => import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || bundled).href));
const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined), headless: true });
const ownerA = '10000000-1000-4000-8000-100000000001';
const ownerB = '10000000-1000-4000-8000-100000000002';
const origin = 'https://localhost';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };

try {
  for (const width of [1440, 390]) {
    // Older backups can use numeric keys instead of current string IDs.
    const selectedId = width === 390 ? 71 : 'selected';
    const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
    await context.addInitScript(() => Object.defineProperty(navigator, 'onLine', { get: () => false }));
    // Fresh browser storage and checkout files only. All external requests are blocked.
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin !== origin || route.request().method() !== 'GET') return route.abort();
      const file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
      if (!file.startsWith(root + path.sep)) return route.abort();
      try {
        return await route.fulfill({ body: await fs.readFile(file), contentType: types[path.extname(file)] || 'application/octet-stream' });
      } catch { return route.fulfill({ status: 404, body: '' }).catch(() => {}); }
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(origin + '/index.html');
    await page.waitForFunction(() => window.__campobase?.state.dataLoaded);
    await page.evaluate(async ({ ownerA, ownerB, selectedId }) => {
      const app = window.__campobase, db = await import('./js/db.js');
      const { setBoundSaasUserId } = await import('./js/auth-manager.js');
      db.configureCloudStore(null);
      const bind = id => { setBoundSaasUserId(id); db.configureRealDatabase(); };
      const player = (id, name, number) => ({ id, name, number, positions: ['Central'], totalMinutes: 0, seasonMinutes: {}, preseasonMinutes: {}, ratingHistory: [], minuteReasons: [] });
      bind(ownerB);
      await db.putBatch({ players: [player(selectedId, 'Otro equipo', 9)] });
      bind(ownerA);
      await db.putBatch({
        players: [player(selectedId, 'Jugador de prueba', 7), player('homonym', 'Jugador de prueba', 12)],
        settings: [{ id: 'main', teamName: 'Equipo ficticio A', delegatePermissions: ['plantilla'] }],
        matches: [{ id: 'played', date: '2026-10-10', opponent: 'Rival de prueba', played: true, goalsFor: 1, goalsAgainst: 0 }],
        callups: [{ id: 'squad', date: '2026-10-10', matchId: 'played', availableIds: [selectedId, 'homonym'] }],
        trainings: [{ id: 'attendance', date: '2026-10-10', kind: 'training', attendance: [{ playerId: selectedId, status: 'present' }] }],
      });
      app.applyRole('owner'); await app.refresh(true); app.showView('plantilla');
      document.getElementById('auth-dialog')?.close();
    }, { ownerA, ownerB, selectedId });

    const snapshot = () => page.evaluate(async () => {
      const db = await import('./js/db.js');
      const stores = ['players', 'matches', 'callups', 'trainings'];
      return Object.fromEntries(await Promise.all(stores.map(async name => [name, await db.getAll(name)])));
    });
    const queue = () => page.evaluate(async () => (await import('./js/db.js')).getAll('syncQueue'));
    const before = await snapshot(), queueBefore = await queue();
    const open = page.locator(`.delete-player[data-id="${selectedId}"]`);
    const confirm = page.locator('#confirmation-dialog');
    await open.click();
    await confirm.waitFor({ state: 'visible', timeout: 3000 });
    assert.match(await confirm.textContent(), /Jugador de prueba/);
    assert.match(await confirm.textContent(), /\b7\b/);
    await page.locator('#confirmation-cancel').click();
    assert.deepEqual(await snapshot(), before);
    assert.deepEqual(await queue(), queueBefore);

    // The confirming account changes while the dialog is open. The same ID exists in both teams.
    await open.click(); await confirm.waitFor();
    const bindAccount = id => page.evaluate(async userId => {
      (await import('./js/auth-manager.js')).setBoundSaasUserId(userId);
      (await import('./js/db.js')).configureRealDatabase();
    }, id);
    await bindAccount(ownerB);
    await page.locator('#confirmation-accept').click();
    assert.equal((await snapshot()).players.find(p => p.id === selectedId)?.name, 'Otro equipo');
    assert.equal((await queue()).some(m => m.operation === 'delete'), false);
    await bindAccount(ownerA);
    assert.deepEqual(await snapshot(), before);
    assert.deepEqual(await queue(), queueBefore);

    // The edit started elsewhere after opening the confirmation must survive.
    await open.click(); await confirm.waitFor();
    await page.evaluate(async id => {
      const db = await import('./js/db.js'), p = await db.getOne('players', id);
      await db.putPlayerProfile({ ...p, notes: 'Anotación posterior a la confirmación' });
    }, selectedId);
    const edited = (await snapshot()).players.find(p => p.id === selectedId);
    assert.equal(edited.notes, 'Anotación posterior a la confirmación');
    await page.locator('#confirmation-accept').click();
    assert.deepEqual((await snapshot()).players.find(p => p.id === selectedId), edited);
    await page.evaluate(async () => { await window.__campobase.refresh(true); window.__campobase.showView('plantilla'); });

    // If the role changes mid-confirmation, a delegate with Plantilla can read both cards only.
    await open.click(); await confirm.waitFor();
    await page.evaluate(() => {
      window.__campobase.applyRole('delegate');
      document.querySelector('#confirmation-accept').click(); // Late click during a role change.
    });
    await page.evaluate(async () => {
      const app = window.__campobase;
      await app.refresh(true); app.showView('plantilla'); app.renderPlayers();
    });
    assert.equal(await page.locator('#players-list .player[data-player-id]').count(), 2);
    assert.equal(await page.locator('#players-list .delete-player').count(), 0);
    assert.equal((await queue()).some(m => m.operation === 'delete'), false);
    await page.evaluate(async () => { const app = window.__campobase; app.applyRole('owner'); await app.refresh(true); app.showView('plantilla'); });

    // Finally confirm the selected card, not the player with the identical name.
    await open.evaluate(button => { const child = document.createElement('span'); child.textContent = button.textContent; button.replaceChildren(child); });
    await open.locator('span').click(); await confirm.waitFor();
    await page.locator('#confirmation-accept').click();
    await open.waitFor({ state: 'detached', timeout: 3000 });
    const after = await snapshot();
    assert.deepEqual(after, { ...before, players: before.players.filter(p => p.id !== selectedId) });
    assert.deepEqual((await queue()).filter(m => m.operation === 'delete').map(m => [m.store, m.recordId]), [['players', selectedId]]);
    await page.reload(); await page.waitForFunction(() => window.__campobase?.state.dataLoaded);
    assert.deepEqual(await snapshot(), after);
    assert.equal((await queue()).filter(m => m.operation === 'delete' && m.recordId === selectedId).length, 1);
    assert.deepEqual(errors, []);
    console.log(`${width}px: cancelación, cambio de cuenta, edición concurrente, delegado, registro correcto y recarga verificados`);
    await context.close();
  }
} finally { await browser.close(); }
