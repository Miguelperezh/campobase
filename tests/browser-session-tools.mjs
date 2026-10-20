import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';

const base = process.env.CAMPOBASE_TEST_URL || 'http://127.0.0.1:4226';
const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true, args: ['--no-sandbox'] });
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('**/*', (route) => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    await page.goto(`${base}/index.html?sessionTools=1`);
    await page.waitForFunction(() => window.__campobase?.state);
    await page.evaluate(() => document.querySelector('#auth-demo-btn')?.click());
    await page.waitForFunction(() => window.__campobase.state.role === 'demo');

    const seed = await page.evaluate(async () => {
      const db = await import('/js/db.js'), app = window.__campobase;
      // A fresh Playwright context has no real user data. Demo memory resets on reload by design;
      // use this context's isolated local IndexedDB to verify the canonical persistence path.
      const main = await db.getOne('settings', 'main');
      db.configureRealDatabase(); db.configureCloudStore(null); app.applyRole('owner');
      const own = { ...app.state.exercises[0], id: 'pdf98-user-session-tools', recordType: 'exercise', name: 'Rondo técnico de conservación', userCreated: true, example: false };
      const source = {
        id: 'tools-source', recordType: 'trainingSession', name: 'Herramientas Presión técnica',
        date: '2026-10-01', time: '17:30', pitch: 'Campo del Pilar', targetDuration: 75,
        totalDuration: 30, sessionKind: 'match-warmup', material: 'Material manual conservado',
        notes: 'Orientación y apoyos conservados', completed: true, status: 'closed', closedAt: 100,
        createdAt: 10, updatedAt: 100,
        blocks: [
          { type: 'warmup', exerciseId: own.id, duration: 10, notes: 'Primera vuelta' },
          { type: 'main', exerciseId: own.id, duration: 20, notes: 'Segunda vuelta' },
        ],
      };
      const pending = { ...source, id: 'tools-pending', name: 'Herramientas Presión técnica pendiente', date: '2099-01-10', completed: false, status: undefined, closedAt: undefined };
      const other = { ...pending, id: 'tools-other', name: 'Herramientas Finalización', pitch: 'Alfonso Silva', blocks: [] };
      const missing = { ...pending, id: 'tools-missing', name: 'Herramientas Histórica ausente', blocks: [{ type: 'main', exerciseId: 'removed-exercise', duration: 15, notes: 'No sustituir' }] };
      const attendance = { id: 'tools-attendance', kind: 'training', date: source.date, sessionId: source.id, attendance: [{ playerId: 'tools-player', status: 'present' }] };
      const player = { id: 'tools-player', name: 'Jugador conservado', number: '1', positions: ['Central'], notes: 'Sin cambios' };
      await db.putBatch({ settings: [main, source, pending, other, missing, own].filter(Boolean), trainings: [attendance], players: [player] });
      await app.refresh(true); app.showView('sesiones'); app.renderTrainingSessions();
      const today = new Date();
      return { source, pending, other, missing, own, attendance, player, main: await db.getOne('settings', 'main'), today: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}` };
    });
    const read = (store, id) => page.evaluate(async ({ store, id }) => (await import('/js/db.js')).getOne(store, id), { store, id });
    const sessions = () => page.evaluate(async () => (await (await import('/js/db.js')).getAll('settings')).filter((item) => item.recordType === 'trainingSession'));
    const shownIds = () => page.locator('#sessions-list .session-card').evaluateAll((cards) => cards.map((card) => card.dataset.sessionId));
    const sourceCard = page.locator('.session-card[data-session-id="tools-source"]');
    const openSource = async () => {
      await page.locator('#session-list-query').fill('Herramientas Presión técnica');
      await page.locator('#session-list-status').selectOption('completed');
      await sourceCard.locator('.reuse-session').waitFor({ state: 'visible' });
    };
    const formSnapshot = () => page.locator('#session-form').evaluate((form) => ({
      id: form.elements.id.value, name: form.elements.name.value, pitch: form.elements.pitch.value,
      date: `${form.elements.dateYear.value}-${form.elements.dateMonth.value}-${form.elements.dateDay.value}`,
      time: `${form.elements.timeHour.value}:${form.elements.timeMinute.value}`,
      targetDuration: Number(form.elements.targetDuration.value), sessionKind: form.elements.sessionKind.value,
      material: form.elements.material.value, notes: form.elements.notes.value,
      blocks: [...form.querySelectorAll('.session-block')].map((row) => ({
        type: row.querySelector('[name="blockType"]').value,
        exerciseId: row.querySelector('[name="blockExerciseId"]').value,
        duration: Number(row.querySelector('[name="blockDuration"]').value),
        notes: row.querySelector('[name="blockNotes"]').value,
      })),
    }));

    // Search individual cards in both the pending grid and completed archive.
    await page.locator('#session-list-query').fill('  HERRAMIENTAS presion PILAR  ');
    assert.deepEqual((await shownIds()).sort(), ['tools-pending', 'tools-source']);
    assert.match(await page.locator('#session-list-count').textContent(), /^2 de /);
    await page.locator('#session-list-status').selectOption('pending');
    assert.deepEqual(await shownIds(), ['tools-pending']);
    await page.locator('#session-list-status').selectOption('completed');
    assert.deepEqual(await shownIds(), ['tools-source']);
    await page.locator('#session-list-query').fill('rondo tecnico conservacion');
    assert.deepEqual(await shownIds(), ['tools-source']);
    await page.locator('#session-list-clear').click();
    // The validated layout can hide the legacy global input; exercise its existing event wiring.
    await page.locator('#global-search').evaluate((input) => {
      input.value = 'HERRAMIENTAS presion'; input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    assert.deepEqual((await shownIds()).sort(), ['tools-pending', 'tools-source']);
    await page.locator('#session-list-status').selectOption('completed');
    assert.deepEqual(await shownIds(), ['tools-source']);
    assert.equal(await sourceCard.isVisible(), true);
    await page.locator('#session-list-query').fill('inexistente');
    assert.equal(await page.locator('#sessions-list .session-card').count(), 0);
    assert.match(await page.locator('#sessions-list').textContent(), /No hay sesiones que coincidan/);
    await page.locator('#session-list-clear').click();
    assert.equal(await page.locator('#global-search').inputValue(), '');
    assert.equal(await page.locator('#session-list-query').inputValue(), '');
    assert.equal(await page.locator('#session-list-status').inputValue(), 'all');

    const toolbarFits = await page.locator('#session-list-tools').evaluate((toolbar) => {
      const box = toolbar.getBoundingClientRect();
      return box.left >= -1 && box.right <= innerWidth + 1 && toolbar.scrollWidth <= toolbar.clientWidth + 1
        && [...toolbar.querySelectorAll('input,select,button')].every((element) => {
          const rect = element.getBoundingClientRect(); return rect.left >= -1 && rect.right <= innerWidth + 1;
        });
    });
    assert.equal(toolbarFits, true, `La barra de búsqueda debe caber a ${width}px`);
    await page.locator('#session-list-query').fill('Herramientas Presión');
    await page.locator('#session-list-tools').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `/tmp/campobase-056-sesiones-${width === 1440 ? 'desktop' : 'mobile'}.png` });

    // Reusing opens only a draft; cancel must leave both the original and attendance intact.
    const beforeSessions = await sessions();
    await openSource(); await sourceCard.locator('.reuse-session').click();
    await page.locator('#session-form').waitFor({ state: 'visible' });
    const draft = await formSnapshot();
    assert.deepEqual(draft, {
      id: '', name: seed.source.name, pitch: seed.source.pitch, date: seed.today, time: seed.source.time,
      targetDuration: seed.source.targetDuration, sessionKind: seed.source.sessionKind,
      material: seed.source.material, notes: seed.source.notes, blocks: seed.source.blocks,
    });
    assert.deepEqual(await sessions(), beforeSessions);
    await page.locator('#session-form .cancel-session').click();
    assert.equal(await page.locator('#session-builder').evaluate((builder) => builder.classList.contains('hidden')), true);
    assert.deepEqual(await read('settings', seed.source.id), seed.source);
    assert.deepEqual(await read('trainings', seed.attendance.id), seed.attendance);

    // Declining to replace another open draft preserves its fields and blocks.
    await page.locator('#new-session').click();
    await page.locator('#session-form [name="name"]').fill('Borrador que debe conservarse');
    const openDraft = await formSnapshot();
    await sourceCard.locator('.reuse-session').click();
    await page.locator('#confirmation-dialog').waitFor({ state: 'visible' });
    await page.locator('#confirmation-cancel').click();
    assert.deepEqual(await formSnapshot(), openDraft);
    assert.deepEqual(await sessions(), beforeSessions);
    await page.locator('#session-form .cancel-session').click();

    // Both renderers of the session detail expose the same reusable-draft flow.
    await sourceCard.locator('.view-session').first().click();
    await page.locator('#session-detail-dialog').waitFor({ state: 'visible' });
    await page.locator('#session-detail-body .session-visual-detail').waitFor({ state: 'visible' });
    await page.locator('#session-detail-dialog .reuse-session').click();
    await page.waitForFunction(() => !document.querySelector('#session-detail-dialog').open);
    assert.deepEqual(await formSnapshot(), draft);

    // A changed role or PIN revision invalidates the open copied draft before any write.
    await page.evaluate(() => { window.__campobase.state.role = 'delegate'; });
    await page.locator('#session-top-save').click();
    await page.waitForFunction(() => document.querySelector('#toast')?.textContent.includes('La cuenta ha cambiado'));
    assert.deepEqual(await sessions(), beforeSessions);
    assert.equal(await page.locator('#session-builder').evaluate((builder) => builder.classList.contains('hidden')), false);
    await page.evaluate(() => { window.__campobase.state.role = 'owner'; });
    await page.locator('#session-form .cancel-session').click();
    await sourceCard.locator('.reuse-session').click();
    await page.evaluate(async () => {
      const auth = await import('/js/auth-manager.js'); auth.lockPinAccess();
      document.querySelector('#toast').textContent = '';
    });
    await page.locator('#session-top-save').click();
    await page.waitForFunction(() => document.querySelector('#toast')?.textContent.includes('La cuenta ha cambiado'));
    assert.deepEqual(await sessions(), beforeSessions);
    await page.evaluate(async () => {
      const auth = await import('/js/auth-manager.js'); auth.finishPinAccess(auth.getPinAccessRevision());
    });
    await page.locator('#session-form .cancel-session').click();
    await sourceCard.locator('.reuse-session').click();
    await page.locator('#session-form [name="name"]').fill('Herramientas Copia revisada');
    await page.locator('#session-form').evaluate((form) => { form.requestSubmit(); form.requestSubmit(); });
    await page.waitForFunction(() => document.querySelector('#session-builder').classList.contains('hidden'));
    const afterSessions = await sessions();
    const copies = afterSessions.filter((session) => session.name === 'Herramientas Copia revisada');
    assert.equal(copies.length, 1); const copy = copies[0];
    assert.notEqual(copy.id, seed.source.id); assert.equal(copy.completed, false); assert.equal(copy.date, seed.today);
    for (const field of ['time', 'pitch', 'targetDuration', 'sessionKind', 'material', 'notes', 'blocks']) assert.deepEqual(copy[field], seed.source[field], field);
    assert.notEqual(copy.createdAt, seed.source.createdAt);
    for (const field of ['closedAt', 'status', 'attendance', 'attendanceId', 'archived']) assert.equal(copy[field], undefined, field);
    assert.equal(afterSessions.length, beforeSessions.length + 1);
    assert.deepEqual(await read('settings', seed.source.id), seed.source);
    assert.deepEqual(await read('trainings', seed.attendance.id), seed.attendance);

    // Missing historical exercise IDs are rejected before replacing or opening any draft.
    await page.locator('#session-list-clear').click();
    await page.locator('#session-list-query').fill('Herramientas Histórica ausente');
    await page.locator('.session-card[data-session-id="tools-missing"] .reuse-session').click();
    await page.waitForFunction(() => document.querySelector('#toast')?.textContent.includes('ya no está en la biblioteca'));
    assert.equal(await page.locator('#session-builder').evaluate((builder) => builder.classList.contains('hidden')), true);
    assert.deepEqual(await read('settings', seed.missing.id), seed.missing);
    assert.equal((await sessions()).length, afterSessions.length);

    // Reopen from Calendar and cancel; this must not create another session.
    await page.evaluate(() => { const app = window.__campobase; app.showView('calendario'); app.setCalendarFilter('training'); });
    const calendar = page.locator('.cbx-calendar-training[data-training-id="tools-pending"]');
    await calendar.locator('summary').click();
    await calendar.locator('.reuse-session').click();
    await page.locator('#session-form').waitFor({ state: 'visible' });
    assert.equal((await formSnapshot()).id, '');
    await page.locator('#session-form .cancel-session').click();
    assert.equal((await sessions()).length, afterSessions.length);

    // Reuse adds no delegate permission, including when a button is forged.
    await page.evaluate(() => {
      const app = window.__campobase; app.showView('sesiones'); app.state.role = 'delegate'; app.renderTrainingSessions();
      document.body.insertAdjacentHTML('beforeend', '<button id="forged-reuse" class="reuse-session" data-id="tools-source">Reutilizar</button>');
    });
    assert.equal(await page.locator('#sessions-list .reuse-session').count(), 0);
    await page.locator('#forged-reuse').click();
    assert.equal(await page.locator('#session-builder').evaluate((builder) => builder.classList.contains('hidden')), true);
    assert.equal(await page.locator('#confirmation-dialog').evaluate((dialog) => dialog.open), false);
    assert.deepEqual(await read('settings', seed.source.id), seed.source);

    // Verify IndexedDB persistence after reload without inventing an authenticated account.
    // Authentication restoration belongs to its separate integration tests.
    await page.reload(); await page.waitForFunction(() => window.__campobase?.state);
    await page.evaluate(async () => {
      const db = await import('/js/db.js'); db.configureRealDatabase(); db.configureCloudStore(null);
    });
    assert.deepEqual(await read('settings', copy.id), copy);
    assert.deepEqual(await read('settings', seed.source.id), seed.source);
    assert.deepEqual(await read('trainings', seed.attendance.id), seed.attendance);
    assert.deepEqual(await read('settings', seed.own.id), seed.own);
    assert.deepEqual(await read('settings', 'main'), seed.main);
    const player = await read('players', seed.player.id);
    for (const field of ['name', 'number', 'positions', 'notes']) assert.deepEqual(player[field], seed.player[field]);
    assert.deepEqual(errors, []);
    await context.close();
    console.log('PASS', width, 'búsqueda y archivo, copia en borrador/cancelar/guardar, ficha y calendario, referencias ausentes, recarga y permisos; datos y colores conservados');
  }
} finally { await browser.close(); }
