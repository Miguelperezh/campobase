const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const source = path.resolve(process.env.CAMPOBASE_PREVIEW_ROOT || 'work/campobase');
const raw = JSON.parse(await fs.readFile(process.env.CAMPOBASE_FIXTURE_PATH || 'work/integrity-read.json', 'utf8'));
const active = (name) => raw[name].filter((row) => !row.deleted_at && row.payload).map((row) => row.payload);
const players = raw.players.filter((row) => !row.deleted_at).map(({ id, name, number, positions }) => ({ id, name, number, positions }));
const keepers = players.filter((player) => player.positions?.includes('Portero')).map((player) => player.id);
const field = players.filter((player) => !keepers.includes(player.id)).slice(0, 12).map((player) => player.id);
const selected = [...keepers, ...field];
const fixture = {
  players,
  matches: [{ id: 'preview-test-match', date: '2026-10-01T10:30', opponent: 'Rival de prueba', type: 'league', status: 'planned', callupId: 'preview-test-callup' }, { id: 'preview-uncalled-match', date: '2026-10-02T10:30', opponent: 'Rival sin convocatoria', type: 'league', status: 'planned' }],
  callups: [{ id: 'preview-test-callup', matchId: 'preview-test-match', date: '2026-10-01T10:30', opponent: 'Rival de prueba', matchType: 'league', format: 'F7', availableIds: selected, excludedIds: [], exclusions: [] }],
  trainings: [],
  settings: raw.settings.filter((row) => !row.deleted_at && row.safe_payload).map((row) => row.safe_payload),
};
let browser;
try {
  browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block', hasTouch:true });
  await context.setOffline(true);
  const remoteMutations = [];
  await context.route('**/*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname.endsWith('.supabase.co')) {
      const readOnlyRpc = /^\/rest\/v1\/rpc\/(mi_equipo_contexto|resolve_login_email|get_delegate_account|legacy_owner_claim_available)$/.test(url.pathname);
      if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method()) && !url.pathname.startsWith('/auth/') && !readOnlyRpc) remoteMutations.push(`${request.method()} ${url.pathname}`);
      return route.fulfill({ status: 503, body: 'null' });
    }
    if (url.hostname !== 'miguelperezh.github.io') return route.continue();
    const relative = url.pathname.replace(/^\/campobase-preview\/v2\/?/, '') || 'index.html';
    const file = path.resolve(source, relative);
    if (!file.startsWith(source + path.sep)) return route.fulfill({ status: 404, body: '' });
    try {
      const body = await fs.readFile(file);
      const contentType = file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : file.endsWith('.mp4') ? 'video/mp4' : 'application/octet-stream';
      return route.fulfill({ status: 200, body, contentType });
    } catch { return route.fulfill({ status: 404, body: '' }); }
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => { errors.push(error.message); console.log('PAGE ERROR:', error.message); });
  await page.goto('https://miguelperezh.github.io/campobase-preview/v2/');
  await page.locator('#saas-demo-btn').click();
  await page.waitForFunction(() => window.__campobase?.state.role === 'demo', null, {timeout: 10000}).catch(async e => { console.log(await page.evaluate(() => ({ready:!!window.__campobase, role:window.__campobase?.state.role, toast:document.querySelector('#toast')?.textContent, auth:document.querySelector('#auth-dialog')?.textContent?.slice(-500)}))); throw e; });
  await page.evaluate(async (data) => {
    const db = await import('./js/db.js');
    db.configureRealDatabase();
    for (const store of ['players', 'matches', 'callups', 'trainings', 'settings']) {
      for (const item of data[store]) await db.put(store, item);
    }
    await db.put('settings', {id:'color-session',recordType:'trainingSession',name:'Sesión de colores',date:'2026-10-05',time:'16:30',pitch:'Campo de prueba',targetDuration:75,blocks:[],completed:false});
    await window.__campobase.refresh(true);
    window.__campobase.applyRole('owner');
    window.__campobase.showView('preparacion');
  }, fixture);


  for (const width of [390,1280]) {
    await page.setViewportSize({width,height:900});
    await page.evaluate(()=>window.__campobase.showView('convocatorias'));
    await page.locator('[data-gear-target="callup-plan"]').first().click();
    await page.locator('input[data-prop="planBarColor"]').fill('#2468ac');
    await page.locator('input[data-prop="planBarColor"]').dispatchEvent('input');
    await page.locator('input[data-prop="planTextColor"]').fill('#5833ab');
    await page.locator('input[data-prop="planTextColor"]').dispatchEvent('input');
    await page.locator('input[data-prop="planRowColor"]').fill('#f6eada');
    await page.locator('input[data-prop="planRowColor"]').dispatchEvent('input');
    assert.equal(await page.locator('.cbx-setting-live-sample').count()>10,true);
    assert.equal(await page.locator('#cbx-quick-color-body input[data-prop="bannerBg"]').count(),0);
    assert.equal(await page.locator('#cbx-quick-color-dialog').evaluate(el=>el.scrollWidth>el.clientWidth+1),false);
    await page.locator('#cbx-quick-color-save').click();
    assert.equal(await page.locator('.cbx-minute-track i').first().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(36, 104, 172)');
    assert.equal(await page.locator('.cbx-minute-person > span').first().evaluate(el=>getComputedStyle(el).color),'rgb(88, 51, 171)');
    assert.equal(await page.locator('.cbx-minute-row').first().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(246, 234, 218)');
    await page.locator('[data-minute-jump="70"]').first().click();
    assert.equal(await page.locator('.cbx-minute-control output').first().textContent(),'70′');
    await page.evaluate(()=>window.__campobase.showView('preparacion'));
    await page.locator('.prep-open[data-focus-plan]').first().click();
    await page.waitForSelector('#prep-plan-tramos');
    assert.equal(await page.locator('#prep-plan-tramos #prep-propose-auto').count(),1);
    await page.locator('[data-gear-target="prep-plan"]').click();
    await page.locator('input[data-prop="planBarColor"]').fill('#cd6723');
    await page.locator('input[data-prop="planBarColor"]').dispatchEvent('input');
    await page.locator('#cbx-quick-color-save').click();
    assert.equal(await page.locator('#prep-plan-tramos .cbx-minute-track i').first().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(205, 103, 35)');
    await page.locator('#prep-back-head').click();
    await page.evaluate(()=>window.__campobase.showView('plantilla'));
    await page.locator('#plantilla [data-gear-target="plantilla"]').first().click();
    assert.equal(await page.locator('input[data-prop="bannerInk"]').evaluate(el=>{const background=document.querySelector('input[data-prop="bannerBg"]').value;const sample=el.closest('.cbx-color-control-row').querySelector('.cbx-setting-live-sample');const probe=document.createElement('span');probe.style.backgroundColor=background;return sample.style.backgroundColor===probe.style.backgroundColor;}),true,'La muestra de texto usa el fondo elegido para ese elemento');
    await page.locator('input[data-prop="btnInk"]').first().fill('#775533');
    await page.locator('input[data-prop="btnInk"]').first().dispatchEvent('input');
    assert.equal(await page.locator('input[data-prop="btnInk"]').first().evaluate(el=>getComputedStyle(el.closest('.cbx-color-control-row').querySelector('.cbx-setting-live-sample')).color),'rgb(119, 85, 51)');
    await page.getByRole('button',{name:'🔎 Un elemento concreto',exact:true}).click();
    assert.equal(await page.locator('.cbx-named-colors').isVisible(),true);
    await page.locator('#cbx-quick-color-save').click();
  }
  assert.equal(errors.length,0);
  assert.equal(remoteMutations.length,0);
  console.log('PASS: plan access, local gears and persistent independent colors, minute shortcuts, immediate color/text samples, mobile/desktop, no page errors or remote mutations.');
} finally { await browser?.close(); }
