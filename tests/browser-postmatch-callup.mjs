import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';

const base = process.env.CAMPOBASE_TEST_URL || 'http://127.0.0.1:4227';
const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true, args: ['--no-sandbox'] });
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('**/*', (route) => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    await page.goto(`${base}/index.html?postmatchCallup=1`);
    await page.waitForFunction(() => window.__campobase?.state);
    await page.evaluate(() => document.querySelector('#auth-demo-btn')?.click());
    await page.waitForFunction(() => window.__campobase.state.role === 'demo');
    const seed = await page.evaluate(async () => {
      const db = await import('/js/db.js'), app = window.__campobase;
      const yesterday = new Date(Date.now() - 86400000);
      const date = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}T12:00:00`;
      const ids = Array.from({ length: 16 }, (_, index) => `postmatch-p${index + 1}`);
      const players = ids.map((id, index) => ({ id, number: String(index + 1), name: `Jugador posterior ${index + 1}`, positions: [index === 0 || index === 7 ? 'Portero' : 'Central'], fatherPhone: '600123123' }));
      const played = {
        id: 'postmatch-finished', date, opponent: 'Rival terminado sin convocatoria', type: 'league', format: 'F7',
        status: 'finished', completed: true, closedAt: 12345, finishedAt: 12345,
        goalsFor: 1, goalsAgainst: 2, goals: [{ id: 'postmatch-goal', playerId: ids[2], assistantId: ids[3], second: 600, note: 'Gol original' }],
        minuteTotals: { [ids[0]]: 1800, [ids[7]]: 2400 }, ratings: { [ids[0]]: 3 },
        keeperGoalsAgainst: { [ids[0]]: 1, [ids[7]]: 1 }, comments: 'Comentario original',
        location: 'Campo elegido por el entrenador', extra: { keep: 'Dato ajeno al formulario' },
      };
      const markers = [{ status: 'closed' }, { status: 'planned', completed: true }, { status: 'planned', closedAt: 77 }, { status: 'planned' }];
      const otherPast = markers.map((marker, index) => ({ id: `postmatch-state-${index}`, date, opponent: `Rival anterior estado ${index}`, type: 'league', format: 'F7', ...marker }));
      const existingMatch = { ...played, id: 'postmatch-existing', callupId: 'postmatch-existing-callup', opponent: 'Rival con convocatoria histórica' };
      const existingCallup = {
        id: 'postmatch-existing-callup', matchId: existingMatch.id, date, opponent: existingMatch.opponent, format: 'F7',
        availableIds: ids.slice(0, 14), selectedIds: ids.slice(0, 2), excludedIds: [...ids.slice(14),'departed-player'],
        exclusions: [{ playerId: ids[14], reason: 'rotation', automatic: true }, { playerId: ids[15], reason: 'sick', automatic: false }, {playerId:'departed-player',reason:'sick',note:'Baja histórica',automatic:false,extra:{keep:true}}],
        targets: [], completed: true, closedAt: 9876, status: 'closed', notes: 'Nota histórica conservada', extra: { keep: 'Extensión histórica' }, createdAt: 4567,
      };
      const team = ids.slice(0, 7).map((playerId, index) => ({ playerId, pos: index === 0 ? 'Portero' : `Puesto ${index}`, x: index * 5, y: index * 7 }));
      const prep = { id: 'postmatch-prep', recordType: 'preparacion', matchId: played.id, firstKeeper: ids[0], secondKeeper: ids[7], team, moments: [], savedAt: 6000 };
      const existingPrep = { ...prep, id: 'postmatch-existing-prep', matchId: existingMatch.id };
      const other = { id: 'postmatch-other-live', date: '2099-10-21T19:00:00', opponent: 'Otro partido preparado', type: 'league', status: 'planned', callupId: 'postmatch-other-callup' };
      const live = { id: 'live', timer: { matchId: other.id, phase: 'ready', elapsed: 0, firstKeeper: ids[0], secondKeeper: ids[7], onField: ids.slice(0, 7), initialOnField: ids.slice(0, 7), events: [], updatedAt: Date.now() }, updatedAt: Date.now() };
      const sameA = {...existingMatch,id:'same-rival-a',opponent:'Mismo rival',callupId:'same-a-callup'};
      const sameB = {...played,id:'same-rival-b',opponent:'Mismo rival'};
      const sameCallup = {...existingCallup,id:'same-a-callup',matchId:sameA.id,opponent:sameA.opponent};
      await db.putBatch({ players, matches: [played, ...otherPast, existingMatch, other,sameA,sameB], callups: [existingCallup,sameCallup, { id: other.callupId, matchId: other.id, availableIds: ids.slice(0, 8), format: 'F7' }], settings: [prep, existingPrep, live] });
      await app.refresh(true);
      app.showView('calendario'); app.renderMatches();
      return { ids, played, otherPast, existingMatch, existingCallup, prep, existingPrep, live,sameA,sameB,sameCallup };
    });
    const read = (store, id) => page.evaluate(async ({ store, id }) => (await import('/js/db.js')).getOne(store, id), { store, id });
    const snapshot = () => page.evaluate(async () => {
      const db = await import('/js/db.js');
      return Object.fromEntries(await Promise.all(['players', 'matches', 'callups', 'settings', 'trainings'].map(async (store) => [store, (await db.getAll(store)).sort((a, b) => String(a.id).localeCompare(String(b.id)))])));
    });
    const showCalendar = async () => page.evaluate(() => {
      const app = window.__campobase; app.showView('calendario'); app.renderMatches();
      const archive = document.querySelector('#played-matches-collapsible'); if (archive) archive.open = true;
      document.querySelectorAll('#matches-list .cbx-calendar-actions').forEach((node) => { node.open = true; });
    });
    const openCallup = async (id) => {
      await showCalendar();
      await page.locator(`.match-card[data-match-id="${id}"] .callup-match`).click();
      await page.locator('#callup-form').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#callup-form [name=matchId]').inputValue(), id);
    };
    const submit = async () => {
      await page.locator('#callup-form').evaluate((form) => form.requestSubmit());
      await page.waitForFunction(() => document.querySelector('#callup-builder').classList.contains('hidden'));
    };
    const assertPlanAndOtherLive = async () => {
      assert.deepEqual(await read('settings', seed.prep.id), seed.prep);
      assert.deepEqual(await read('settings', seed.existingPrep.id), seed.existingPrep);
      assert.deepEqual(await read('settings', 'live'), seed.live);
    };

    // Every historic status and yesterday's still-planned match can be selected; cancel writes nothing.
    const before = await snapshot();
    for (const match of [seed.played, ...seed.otherPast]) {
      await openCallup(match.id);
      assert.equal(await page.locator('#callup-history-help').isVisible(), true);
      assert.equal(await page.locator('#callup-form [name=selected]:checked').count(), 0);
      await page.locator('#callup-form .cancel-builder').click();
      assert.deepEqual(await snapshot(), before);
    }
    await page.evaluate(() => { window.__campobase.showView('convocatorias'); document.querySelector('#new-callup').click(); });
    const offered = await page.locator('#callup-form [name=matchId] option').evaluateAll((options) => options.map((option) => option.value));
    for (const match of [seed.played, ...seed.otherPast]) assert.ok(offered.includes(match.id));
    assert.equal(offered.includes(seed.existingMatch.id), false);
    assert.ok(offered.includes(seed.sameB.id)); assert.equal(offered.includes(seed.sameA.id),false);
    await page.locator('#callup-form .cancel-builder').click();

    await openCallup(seed.sameB.id);
    assert.equal(await page.locator('#callup-form [name=id]').inputValue(),'');
    await page.locator('#callup-form .cancel-builder').click();
    assert.deepEqual(await read('callups',seed.sameCallup.id),seed.sameCallup);

    // Exactly eight selected players are recorded; rotation must not fill the other six places.
    await openCallup(seed.played.id);
    for (const id of seed.ids.slice(0, 8)) await page.locator(`#callup-form [name=selected][value="${id}"]`).check();
    await submit();
    const savedMatch = await read('matches', seed.played.id);
    const savedCallup = await read('callups', savedMatch.callupId);
    assert.deepEqual(savedCallup.availableIds, seed.ids.slice(0, 8));
    assert.equal(savedCallup.completed, true);
    assert.equal(savedCallup.exclusions.length, 8);
    assert.ok(savedCallup.exclusions.every((item) => item.reason === 'not_called' && item.automatic === false));
    assert.deepEqual(savedMatch, { ...seed.played, callupId: savedCallup.id });
    await assertPlanAndOtherLive();

    // The canonical performance editor still exposes every called player and both keepers the next day.
    await showCalendar();
    await page.locator(`.match-card[data-match-id="${seed.played.id}"] .edit-match-performance`).click();
    const postgame = page.locator('#postgame-performance-dialog');
    await postgame.waitFor({ state: 'visible' });
    assert.equal(await postgame.locator('.postgame-player-row').count(), 8);
    assert.equal(await postgame.locator('[data-keeper-conceded]').count(), 2);
    await page.locator('#postgame-goals-for').fill('2');
    await postgame.locator('[data-goal=type]').first().selectOption('penalty');
    await postgame.locator('[data-goal=assistant]').first().selectOption(seed.ids[4]);
    await postgame.locator('[data-add-postgame-goal]').click();
    await postgame.locator('[data-goal=player]').last().selectOption(seed.ids[5]);
    await postgame.locator(`[data-player-id="${seed.ids[0]}"] [data-postgame=minutes]`).fill('35');
    await postgame.locator(`[data-player-id="${seed.ids[0]}"] [data-postgame=rating]`).selectOption('5');
    await postgame.locator('[type=submit]').click();
    await page.waitForFunction(() => !document.querySelector('#postgame-performance-dialog').open);
    const performance = await read('matches', seed.played.id);
    assert.equal(performance.goalsFor, 2); assert.equal(performance.goals.length, 2);
    assert.equal(performance.goals[0].isPenalty, true); assert.equal(performance.goals[0].assistantId, seed.ids[4]);
    assert.equal(performance.minuteTotals[seed.ids[0]], 2100); assert.equal(performance.ratings[seed.ids[0]], 5);
    assert.equal(performance.closedAt, seed.played.closedAt); assert.deepEqual(performance.extra, seed.played.extra);
    await assertPlanAndOtherLive();
    await showCalendar();
    await page.locator(`.match-card[data-match-id="${seed.played.id}"] .edit-match-performance`).click();
    await postgame.waitFor({ state: 'visible' });
    assert.equal(await page.locator('#postgame-goals-for').inputValue(), '2');
    assert.equal(await postgame.locator(`[data-player-id="${seed.ids[0]}"] [data-postgame=minutes]`).inputValue(), '35');
    await postgame.locator('[data-close-postgame]').first().click();

    // Editing a historic auto-filled callup selects all actual attendees, keeping unknown extension fields.
    const callupsBeforeEdit = await page.evaluate(async () => (await import('/js/db.js')).getAll('callups').then((items) => items.length));
    await openCallup(seed.existingMatch.id);
    assert.equal(await page.locator('#callup-form [name=id]').inputValue(), seed.existingCallup.id);
    assert.equal(await page.locator('#callup-form [name=selected]:checked').count(), 14);
    await page.locator(`#callup-form [name=selected][value="${seed.ids[13]}"]`).uncheck();
    await submit();
    const edited = await read('callups', seed.existingCallup.id);
    assert.deepEqual([...edited.availableIds].sort(), seed.ids.slice(0, 13).sort());
    assert.deepEqual(edited.exclusions.find(e=>e.playerId==='departed-player'),seed.existingCallup.exclusions.find(e=>e.playerId==='departed-player'));
    for (const key of ['status', 'notes', 'extra', 'createdAt', 'closedAt']) assert.deepEqual(edited[key], seed.existingCallup[key]);
    assert.equal(await page.evaluate(async () => (await import('/js/db.js')).getAll('callups').then((items) => items.length)), callupsBeforeEdit);
    assert.deepEqual(await read('matches', seed.existingMatch.id), seed.existingMatch);
    await assertPlanAndOtherLive();
    await showCalendar();
    await page.locator(`.match-card[data-match-id="${seed.existingMatch.id}"] .match-detail`).click();
    await page.locator('#match-detail-dialog .callup-match').click();
    await page.locator('#callup-form').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#callup-form [name=id]').inputValue(), seed.existingCallup.id);
    await page.locator('#callup-form .cancel-builder').click();
    assert.equal(await page.locator('#match-detail-dialog').evaluate((dialog) => dialog.open), false);

    // A forged button must not grant the delegate the new owner-only workflow.
    const protectedSnapshot = await snapshot();
    await page.evaluate(() => {
      const app = window.__campobase; app.state.role = 'delegate'; app.renderMatches();
      document.body.insertAdjacentHTML('beforeend', '<button id="postmatch-forged" class="callup-match" data-id="postmatch-state-0">Convocar</button>');
    });
    assert.equal(await page.locator('#matches-list .callup-match').count(), 0);
    await page.locator('#postmatch-forged').click();
    assert.equal(await page.locator('#callup-builder').evaluate((node) => node.classList.contains('hidden')), true);
    assert.deepEqual(await snapshot(), protectedSnapshot);
    assert.deepEqual(errors, []);
    await context.close();
    console.log('PASS', width, 'convocatoria posterior exacta, fechas/estados, cancelar, editar sin duplicar, editor completo y dos porteros; plan/directo/datos ajenos intactos y delegado protegido');
  }
} finally {
  await browser.close();
}
