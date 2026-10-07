import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const source = path.resolve(process.env.CAMPOBASE_PREVIEW_ROOT || '.');
const raw = JSON.parse(await fs.readFile(process.env.CAMPOBASE_TEST_FIXTURE, 'utf8'));
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
  browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
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
      const contentType = file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream';
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

  await page.evaluate(() => window.__campobase.showView('convocatorias'));
  await page.locator('#convocatorias [data-gear-target="convocatorias"]').click();
  const set = async (prop, colour) => {
    const picker = page.locator(`#cbx-quick-color-body input[data-prop="${prop}"]`).first();
    await picker.evaluate((element, val) => { element.value = val; element.dispatchEvent(new Event('input', { bubbles: true })); }, colour);
    await page.waitForTimeout(300);
  };
  const colour = async (selector, property = 'color') => page.locator(selector).first().evaluate((element, prop) => getComputedStyle(element)[prop], property);
  await set('callupOutBg', '#123456'); await set('callupOutInk', '#fedcba');
  assert.equal(await colour('#convocatorias .cbx-callup-badge-out', 'backgroundColor'), 'rgb(18, 52, 86)');
  assert.equal(await colour('#convocatorias .cbx-callup-badge-out'), 'rgb(254, 220, 186)');
  await set('callupBtnBg', '#663399'); await set('callupHeaderBg', '#113355'); await set('callupHeaderInk', '#fedcba');
  assert.equal(await colour('#convocatorias .cbx-callup-card header h3'), 'rgb(254, 220, 186)');
  assert.equal(await colour('#new-callup', 'backgroundColor'), 'rgb(102, 51, 153)');
  assert.equal(await colour('#convocatorias .cbx-callup-card header', 'backgroundColor'), 'rgb(17, 51, 85)');
  await set('planModeActiveBg', '#abcdef'); await set('planModeActiveInk', '#123456');
  assert.equal(await colour('#convocatorias .cbx-plan-mode-btn[aria-pressed="true"]', 'backgroundColor'), 'rgb(171, 205, 239)');
  assert.equal(await page.locator('.cbx-qc-view-chip').count(), 0);
  assert.equal(await page.locator('input[data-prop="sidebarInk"]').count(), 0);
  await set('callupBadgeBg', '#ffffff'); await set('callupBadgeInk', '#123456');
  assert.equal(await colour('#convocatorias .cbx-callup-badge-in'), 'rgb(18, 52, 86)');
  await set('btn2Bg', '#345678'); await set('btn2Ink', '#fedcba');
  assert.equal(await colour('#convocatorias .edit-callup', 'backgroundColor'), 'rgb(52, 86, 120)');
  assert.equal(await colour('#convocatorias .callup-open-prep'), 'rgb(254, 220, 186)');
  const waBefore = await colour('#convocatorias .open-whatsapp-callup', 'backgroundColor');
  const deleteBefore = await colour('#convocatorias .delete-callup', 'backgroundColor');
  await page.locator('.cbx-colour-group > summary').filter({hasText:'Botones y acciones'}).click();
  const callupEdit = page.locator('.cbx-named-colour').filter({has:page.locator('legend', {hasText:/^Editar(?: · \d+)?$/})}).first();
  await callupEdit.locator('[data-element-prop="background"]').evaluate(el => { el.value='#102030'; el.dispatchEvent(new Event('input',{bubbles:true})); });
  await page.waitForTimeout(300);

  assert.equal(await colour('#convocatorias .edit-callup','backgroundColor'),'rgb(16, 32, 48)');
  assert.equal(await colour('#convocatorias .open-whatsapp-callup','backgroundColor'),waBefore);
  assert.equal(await colour('#convocatorias .delete-callup','backgroundColor'),deleteBefore);
  await page.locator('#cbx-quick-color-save').click();
  await page.evaluate(() => window.__campobase.showView('sesiones'));
  assert.ok(await page.locator('#sesiones .cbx-session-actions-row').count());
  await page.locator('#sesiones [data-gear-target="sesiones"]').click();
  for (const width of [390, 1280]) {
    await page.setViewportSize({width,height:900});
    assert.equal(await page.locator('#cbx-quick-color-dialog').evaluate(el => el.scrollWidth > el.clientWidth + 1), false, 'El panel no desborda horizontalmente');
    assert.equal(await page.locator('.cbx-qc-view-chip').count(), 0);
  }
  await page.locator('#cbx-quick-color-dialog').screenshot({path:'/private/tmp/campobase-adjustments-visual.png'});

  await set('whistleBg', '#123456'); await set('whistleInk', '#fedcba');
  await set('printBg', '#654321'); await set('printInk', '#abcdef');
  assert.equal(await colour('#sesiones .cbx-btn-whistle'), 'rgb(254, 220, 186)');
  assert.equal(await colour('#sesiones .print-session', 'backgroundColor'), 'rgb(101, 67, 33)');
  assert.equal(await colour('#sesiones .print-session'), 'rgb(171, 205, 239)');
  assert.ok(await page.locator('.cbx-color-control-help').count());
  await page.locator('.cbx-colour-group > summary').filter({hasText:'Botones y acciones'}).click();
  const editControls = page.locator('.cbx-named-colour').filter({has:page.locator('legend', {hasText:/^✏️ Editar(?: · \d+)?$/})}).first();
  assert.ok(await editControls.locator('.cbx-color-control-help').count() >= 4);
  await editControls.locator('[data-element-prop="background"]').evaluate(el => { el.value='#102030'; el.dispatchEvent(new Event('input', {bubbles:true})); });
  await page.waitForTimeout(300);
  assert.equal(await colour('#sesiones .edit-session', 'backgroundColor'), 'rgb(16, 32, 48)');
  assert.equal(await page.locator('.cbx-qc-view-chip').count(), 0);
  await page.locator('.cbx-colour-group > summary').filter({hasText:'Fondos, tarjetas y recuadros'}).click();
  const surfaceControls = page.locator('.cbx-named-colour').filter({has:page.locator('legend', {hasText:'Fondo de la pantalla o ventana'})}).first();
  await surfaceControls.locator('[data-element-prop="border-color"]').evaluate(el => { el.value='#334455'; el.dispatchEvent(new Event('input', {bubbles:true})); });
  assert.equal(await colour('#sesiones', 'borderTopColor'), 'rgb(51, 68, 85)');
  await surfaceControls.locator('[data-reset-element]').click();
  assert.equal(await colour('#sesiones .edit-session', 'backgroundColor'), 'rgb(16, 32, 48)');
  await page.locator('#cbx-quick-color-save').click();
  await page.evaluate(async () => { await window.__campobase.refresh(true); window.__campobase.showView('sesiones'); });
  await page.waitForTimeout(300);
  assert.equal(await colour('#sesiones .edit-session', 'backgroundColor'), 'rgb(16, 32, 48)');
  for (const width of [390, 1280]) {
    await page.setViewportSize({width,height:900});
    const overflow = await page.locator('#sesiones .cbx-session-actions-row > button').evaluateAll(buttons => buttons.some(button => button.scrollWidth > button.clientWidth + 1));
    assert.equal(overflow, false, `Session buttons fit at ${width}px`);
  }
  // Suggestions never write any match, callup or saved preparation.
  await page.evaluate(() => window.__campobase.showView('convocatorias'));
  await page.evaluate(async () => { const db=await import('./js/db.js'); const state=window.__campobase.state; const callup=state.callups.find(c=>c.id==='preview-test-callup'); const ids=callup.availableIds; const gk=ids.find(id=>state.players.find(p=>p.id===id)?.positions?.includes('Portero')); const field=ids.filter(id=>!state.players.find(p=>p.id===id)?.positions?.includes('Portero')).slice(0,6); await db.put('settings',{id:'prep-preserve-test',recordType:'preparacion',matchId:'preview-test-match',formacion:'1-3-2-1',team:[{pos:'Portero',playerId:gk},...field.map((id,i)=>({pos:'Campo '+i,playerId:id}))],moments:[]}); await window.__campobase.refresh(true); window.__campobase.showView('convocatorias'); });
  const records = () => page.evaluate(async () => { const db=await import('./js/db.js'); return JSON.stringify(await Promise.all(['matches','callups','settings'].map(db.getAll))); });
  const beforePlan = await records();
  await page.locator('.cbx-generate-callup-rotation-btn').first().click();
  assert.ok(await page.locator('.cbx-plan-changes').filter({hasText:'Sugerencia de rotaciones'}).count());
  assert.ok(await page.locator('.cbx-plan-change').count());
  assert.equal(await records(), beforePlan);
  await page.locator('.cbx-restore-callup-plan').click();
  assert.equal(await records(), beforePlan);
  await page.evaluate(() => window.__campobase.showView('plantilla'));
  // Old per-element overrides must stop blocking a user change in the second-launcher menu.
  await page.evaluate(async () => {
    const theme=window.__campobase.state.settings.theme;
    theme.views.plantilla ||= {};
    theme.views.plantilla.elementColors ||= {};
    const row=document.querySelector('[data-specialist-kind="launcher"] [data-specialist-rank="2"]');
    row.id='old-second-launcher-override';
    theme.views.plantilla.elementColors['#plantilla #old-second-launcher-override']={background:'#aa00aa',color:'#ff00ff'};
    theme.views.plantilla.elementColors['#plantilla #old-second-launcher-override > strong']={color:'#ff00ff'};
    const first=document.querySelector('.cbx-player');
    theme.views.plantilla.elementColors['#plantilla article[data-player-id="'+first.dataset.playerId+'"] .player-name h3']={color:'#ff00ff'};
    localStorage.setItem('campobase.theme',JSON.stringify(theme));
    (await import('./js/theme-component-colors.js?v=color-controls-5')).applyComponentColors(theme);
  });
  await page.locator('[data-gear-target="specialists"]').click();
  assert.equal(await page.locator('input[data-prop="bannerBg"]').count(), 0);
  await set('captain2Bg','#123456'); await set('captain2Ink','#fedcba');
  await set('captain3Bg','#654321');
  await set('spSubBg','#abcdef'); await set('spSubInk','#345678');
  assert.equal(await colour('[data-specialist-kind="captain"] [data-specialist-rank="2"] .specialist-rank','backgroundColor'),'rgb(18, 52, 86)');
  assert.equal(await colour('[data-specialist-kind="captain"] [data-specialist-rank="2"] .specialist-rank'),'rgb(254, 220, 186)');
  assert.equal(await colour('[data-specialist-kind="captain"] [data-specialist-rank="3"] .specialist-rank','backgroundColor'),'rgb(101, 67, 33)');
  assert.equal(await colour('[data-specialist-kind="launcher"] [data-specialist-rank="2"] .specialist-rank'),'rgb(52, 86, 120)');
  assert.equal(await colour('[data-specialist-kind="launcher"] [data-specialist-rank="2"]','backgroundColor'),'rgb(171, 205, 239)');
  assert.equal(await colour('[data-specialist-kind="launcher"] [data-specialist-rank="2"] strong'),'rgb(52, 86, 120)');
  await page.locator('#cbx-quick-color-save').click();
  await page.locator('#plantilla [data-gear-target="plantilla"]').first().click();
  const legends=await page.locator('.cbx-named-colour legend').allTextContents();
  const names=await page.evaluate(()=>window.__campobase.state.players.map(p=>p.name));
  assert.equal(legends.some(label=>names.some(name=>label.includes(name))),false,'No hay configuración por jugador');
  const common=page.locator('.cbx-colour-group').filter({has:page.locator('summary',{hasText:'Fichas de jugadores · estilo común'})});
  await common.locator('summary').click();
  const nameColour=common.locator('fieldset').filter({has:page.locator('legend',{hasText:/^Nombre del jugador$/})});
  await nameColour.locator('[data-element-prop="color"]').evaluate(el=>{el.value='#123456';el.dispatchEvent(new Event('input',{bubbles:true}));});
  await page.waitForTimeout(300);
  assert.equal(await page.locator('.cbx-player .player-name h3').evaluateAll(elements=>elements.every(el=>getComputedStyle(el).color==='rgb(18, 52, 86)')),true,'Todos los nombres comparten el color elegido');
  const cardColour=common.locator('fieldset').filter({has:page.locator('legend',{hasText:/^Ficha completa$/})});
  await cardColour.locator('[data-element-prop="background"]').evaluate(el=>{el.value='#fedcba';el.dispatchEvent(new Event('input',{bubbles:true}));});
  await page.waitForTimeout(300);
  assert.equal(await page.locator('.cbx-player').evaluateAll(elements=>elements.every(el=>getComputedStyle(el).backgroundColor==='rgb(254, 220, 186)')),true,'Todas las fichas comparten fondo');
  await page.locator('#cbx-quick-color-save').click();
  await page.evaluate(async()=>{await window.__campobase.refresh(true);window.__campobase.showView('plantilla');});
  await page.waitForTimeout(300);
  assert.equal(await page.locator('.cbx-player .player-name h3').evaluateAll(elements=>elements.every(el=>getComputedStyle(el).color==='rgb(18, 52, 86)')),true,'Persiste el estilo común');
  assert.equal(await colour('[data-specialist-kind="launcher"] [data-specialist-rank="2"] strong'),'rgb(52, 86, 120)');
  await page.evaluate(() => window.__campobase.showView('tacticas'));
  await page.locator('#tacticas [data-gear-target="tacticas"]').first().click();
  await set('bannerInk','#abcdef');
  assert.equal(await colour('.cbx-tactics-title'),'rgb(171, 205, 239)');
  assert.equal(await colour('.cbx-tactics-eyebrow'),'rgb(171, 205, 239)');
  await page.locator('#cbx-quick-color-save').click();
  await page.evaluate(async () => { const db=await import('./js/db.js'); await db.put('matches',{id:'colour-result',date:'2026-10-01',type:'league',status:'finished',opponent:'Prueba',goalsFor:1,goalsAgainst:15}); window.__campobase.showView('hoy'); const today=await import('./js/today-dashboard.js'); await today.renderTodayDashboard(); });
  await page.locator('#hoy [data-gear-target="hoy"]').click();
  assert.equal(await page.locator('#cbx-quick-color-body').innerText().then(text=>/Etiquetas de las fichas|Fichas de jugadores|Balón Parado|Lanzador|Dorsal/i.test(text)),false,'Hoy no tiene ajustes de fichas ni especialistas');
  await set('seasonGoalsForColor','#123456'); await set('seasonGoalsAgainstColor','#fedcba');
  assert.equal(await colour('.cbx-season-goals-for','backgroundColor'),'rgb(18, 52, 86)');
  assert.equal(await colour('.cbx-season-goals-against','backgroundColor'),'rgb(254, 220, 186)');
  const tacticsBeforeReset = await colour('.cbx-tactics-title');
  await page.locator('#cbx-quick-color-reset').click();
  assert.equal(await colour('.cbx-tactics-title'),tacticsBeforeReset);
  await page.locator('#cbx-quick-color-save').click();
  await page.evaluate(() => { window.__campobase.showView('ejercicios'); window.__campobase.showExerciseDetail(window.__campobase.state.exercises[0].id); });
  await page.locator('#exercise-detail-dialog [data-gear-target="exercise-detail"]').click();
  await set('closeBg', '#123456'); await set('closeInk', '#fedcba');
  assert.equal(await colour('#exercise-detail-dialog .modal-bottom-close-btn', 'backgroundColor'), 'rgb(18, 52, 86)');
  assert.equal(await colour('#exercise-detail-dialog .modal-bottom-close-btn'), 'rgb(254, 220, 186)');
  await page.locator('#cbx-quick-color-save').click();
  await page.evaluate(() => document.querySelector('#exercise-detail-dialog').close());
  await page.evaluate(() => window.__campobase.openWhatsAppDialog({mode:'week'}));
  await page.locator('#whatsapp-dialog [data-gear-target="comunicador"]').click();
  await set('btnBg', '#123456'); await set('btnInk', '#fedcba'); await set('fontColor', '#234567');
  assert.equal(await colour('#whatsapp-dialog .tab-btn.active'), 'rgb(254, 220, 186)');
  assert.equal(await colour('#whatsapp-dialog label'), 'rgb(35, 69, 103)');
  assert.deepEqual(remoteMutations, []);
  assert.deepEqual(errors, []);
  console.log('PASS: stale second-launcher overrides, shared player styles and persistence, Hoy isolation; independent Editar/WhatsApp/Delete; counts; GF/GC bars; specialist ranks; tactics banner; contextual gears and reset; suggestions preserve manual preparation; session/exercise/WhatsApp regressions at 390/1280px; zero remote writes/errors.');
} finally { await browser?.close(); }
