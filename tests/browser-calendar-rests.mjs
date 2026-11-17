import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';

const fallback = path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs');
const { chromium } = await import('playwright-core').catch(() => import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || fallback).href));
const root = path.resolve(process.env.CAMPOBASE_PREVIEW_ROOT || '.');
const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined), headless:true });
const dates = ['2026-11-21T09:00','2026-11-28T18:30','2026-12-12T12:00','2026-12-19T13:00','2027-01-13T18:30','2027-01-30T09:00','2027-02-05T19:00','2027-02-20T11:00','2027-02-27T16:30','2027-03-07T09:00','2027-03-13T15:00','2027-03-20T10:00','2027-04-03T15:00','2027-04-25T09:30','2027-05-08T09:00','2027-05-22T09:00'];
const rounds = [1,2,3,4,5,7,8,9,10,11,12,13,14,16,17,18];
try {
  for (const width of [1440,390]) {
    const context = await browser.newContext({ viewport:{width,height:900}, serviceWorkers:'block' });
    const page = await context.newPage(), errors = [], external = [];
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'onLine', { get:() => false });
      const NativeDate = window.Date;
      window.__calendarRestNow = NativeDate.parse('2026-11-17T12:00:00Z');
      window.Date = class extends NativeDate {
        constructor(...args) { super(...(args.length ? args : [window.__calendarRestNow])); }
        static now() { return window.__calendarRestNow; }
      };
    });
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.hostname !== 'localhost') { external.push(route.request().method()); return route.fulfill({status:503,body:'null'}); }
      const relative = decodeURIComponent(url.pathname).replace(/^\//,'') || 'index.html', file = path.resolve(root,relative);
      if (!file.startsWith(root+path.sep)) return route.fulfill({status:404,body:''});
      try {
        let body = await fs.readFile(file);
        if (relative === 'js/app.js') body = Buffer.from(body.toString().replace('init().catch(handleError);', 'init().then(()=>window.__calendarRestBootReady=true).catch(handleError);'));
        return route.fulfill({status:200,body,contentType:/\.m?js$/.test(file)?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream'});
      } catch { return route.fulfill({status:404,body:''}); }
    });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('https://localhost/index.html');
    await page.waitForFunction(() => window.__calendarRestBootReady && window.__campobase?.state.dataLoaded);
    await page.evaluate(async ({dates,rounds}) => {
      const db = await import('./js/db.js'), auth = await import('./js/auth-manager.js'), app = window.__campobase;
      db.configureCloudStore(null); auth.setBoundSaasUserId('calendar-rests-fixture-A'); db.configureRealDatabase(); app.state.role='owner';
      const matches = dates.map((date,index) => ({ id:`match-${rounds[index]}`,date,round:String(rounds[index]),opponent:`Rival ${rounds[index]}`,venue:index%2?'home':'away',type:'league',status:'planned',format:'F7',goalsFor:null,goalsAgainst:null,location:`Campo ${index}`,mapsUrl:`https://maps.google.com/?q=Campo%20${index}` }));
      matches.push({ id:'played',date:'2026-10-04T09:00',round:'Amistoso',opponent:'Partido ya registrado',venue:'home',type:'friendly',status:'finished',goalsFor:2,goalsAgainst:1 });
      await db.putBatch({matches,settings:[
        {id:'main',teamName:'Equipo de prueba',theme:{btn:'#135724'},presets:[],sem:{},matchPreset:null,delegatePermissions:[]},
        {id:'rest-6',recordType:'calendarRest',date:'2027-01-24',round:'6',title:'Descansa',competitionType:'league',season:'2026-2027'},
        {id:'rest-15',recordType:'calendarRest',date:'2027-04-18',round:'15',title:'Descansa',competitionType:'league',season:'2026-2027'},
        {id:'session',recordType:'trainingSession',date:'2027-01-24',time:'17:00',name:'Sesión conservada',pitch:'Campo de prueba',blocks:[],targetDuration:60,totalDuration:0},
      ]});
      await app.refresh(true); app.applyRole('owner'); document.querySelector('#auth-dialog').close(); app.showView('calendario'); app.renderMatches();
      window.__calendarRowsBefore = (await db.exportDatabase()).data;
    }, {dates,rounds});
    assert.equal(await page.locator('#matches-list [data-calendar-rest-id]').count(),2);
    assert.equal(await page.locator('#matches-list .cbx-calendar-rest .cbx-calendar-actions, #matches-list .cbx-calendar-rest .edit-match, #matches-list .cbx-calendar-rest .match-callup-action, #matches-list .cbx-calendar-rest .prep-open-from-cal, #matches-list .cbx-calendar-rest .toggle-match-completed').count(),0);
    assert.equal(await page.locator('#matches-list .cbx-calendar-rest[data-match-id]').count(),0);
    assert.match(await page.locator('[data-calendar-filter="all"]').textContent(),/20/);
    assert.match(await page.locator('[data-calendar-filter="league"]').textContent(),/18/);
    assert.equal(await page.locator('#played-matches-collapsible [data-calendar-rest-id]').count(),0);
    const eventOrder = await page.locator('#matches-list > .cbx-calendar-group').filter({has:page.locator('h3',{hasText:'Próximos',exact:true})}).locator('article').evaluateAll(nodes=>nodes.map(node=>node.dataset.calendarRestId||node.dataset.matchId));
    assert.ok(eventOrder.indexOf('match-5') < eventOrder.indexOf('rest-6') && eventOrder.indexOf('rest-6') < eventOrder.indexOf('match-7'));
    assert.ok(eventOrder.indexOf('match-14') < eventOrder.indexOf('rest-15') && eventOrder.indexOf('rest-15') < eventOrder.indexOf('match-16'));
    await page.locator('[data-calendar-move="1"]').click();
    await page.locator('[data-calendar-move="1"]').click();
    const restDay = page.locator('[data-calendar-day="2027-01-24"]');
    assert.match(await restDay.getAttribute('aria-label'),/descanso/);
    assert.equal(await restDay.locator('.has-rest').count(),1);
    assert.equal(await restDay.locator('.has-training').count(),1);
    assert.equal(await restDay.locator('.has-match').count(),0);
    await restDay.click();
    assert.equal(await page.locator('#matches-list [data-calendar-rest-id]').count(),1);
    assert.equal(await page.locator('#matches-list [data-training-id="session"]').count(),1);
    assert.equal(await page.locator('#matches-list [data-match-id]').count(),0);
    await page.locator('.cbx-clear-day-btn').click();
    for (const filter of ['league','friendly','tournament','training','all']) {
      await page.locator(`[data-calendar-filter="${filter}"]`).click();
      assert.equal(await page.locator('#matches-list [data-calendar-rest-id]').count(),['all','league'].includes(filter)?2:0,`rest visibility in ${filter}`);
    }
    await page.evaluate(() => window.__campobase.showView('convocatorias'));
    await page.locator('#new-callup').click();
    assert.equal(await page.locator('#callup-form [name="matchId"] option[value^="rest-"]').count(),0);
    await page.locator('#callup-form .cancel-builder').click();
    await page.evaluate(() => { window.__calendarRestNow=Date.parse('2027-04-19T12:00:00Z'); window.__campobase.showView('calendario'); window.__campobase.renderMatches(); });
    assert.equal(await page.locator('#played-matches-collapsible [data-calendar-rest-id]').count(),0);
    assert.equal(await page.locator('#matches-list > .cbx-calendar-group').filter({has:page.locator('h3',{hasText:'Jornadas de descanso anteriores',exact:true})}).locator('[data-calendar-rest-id]').count(),2);
    assert.equal(await page.evaluate(() => window.__campobase.state.matches.length),17);
    assert.deepEqual(await page.evaluate(async () => (await (await import('./js/db.js')).exportDatabase()).data),await page.evaluate(() => window.__calendarRowsBefore));
    const legacy = await page.evaluate(() => {
      document.body.classList.remove('cb-redesign-active');
      const app=window.__campobase, matches=app.state.matches;
      app.state.matches=matches.filter(item=>item.status==='finished');
      window.__calendarRestNow=Date.parse('2026-11-17T12:00:00Z');
      app.renderMatches();
      const result={rests:document.querySelectorAll('#matches-list [data-calendar-rest-id]').length,playedRests:document.querySelectorAll('#played-matches-collapsible [data-calendar-rest-id]').length,emptyNotice:!!document.querySelector('#matches-list .empty-notice')};
      app.state.matches=matches;
      return result;
    });
    assert.deepEqual(legacy,{rests:2,playedRests:0,emptyNotice:false});
    await page.evaluate(async () => { const db=await import('./js/db.js'),auth=await import('./js/auth-manager.js'); auth.setBoundSaasUserId('calendar-rests-fixture-B');db.configureRealDatabase();await db.put('settings',{id:'main',teamName:'Otro equipo',theme:{},presets:[],sem:{},delegatePermissions:[]});await window.__campobase.refresh(true);window.__campobase.renderMatches(); });
    assert.equal(await page.locator('#matches-list [data-calendar-rest-id]').count(),0,'another account inherits no rest entries');
    assert.equal(await page.evaluate(()=>window.__campobase.state.calendarRests.length),0);
    assert.deepEqual(errors,[]);
    assert.equal(external.filter(method=>method!=='GET').length,0);
    console.log(JSON.stringify({width,matches:16,rests:2,calendar:'chronological, month and selected day, all/league filters',sportingFlows:'no match IDs, callup options or played entries',records:'unchanged, foreign account cleared',pageErrors:errors.length,externalWrites:0}));
    await context.close();
  }
} finally { await browser.close(); }
