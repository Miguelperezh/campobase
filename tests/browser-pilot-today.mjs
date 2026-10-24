import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {pathToFileURL} from 'node:url';
const fallback=path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs');
const {chromium}=await import('playwright-core').catch(()=>import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || fallback).href));
const root=path.resolve(process.env.CAMPOBASE_PREVIEW_ROOT || '.');
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN || (process.platform==='darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined),headless:true});
try {
  for(const width of [1440,390]) {
    const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'}),page=await context.newPage(),errors=[];
    await context.addInitScript(()=>Object.defineProperty(navigator,'onLine',{get:()=>false}));
    await context.route('**/*',async route=>{
      const url=new URL(route.request().url());
      if(url.hostname!=='localhost')return route.fulfill({status:503,body:'null'});
      const relative=decodeURIComponent(url.pathname).replace(/^\//,'') || 'index.html',file=path.resolve(root,relative);
      if(!file.startsWith(root+path.sep))return route.fulfill({status:404,body:''});
      try {
        let body=await fs.readFile(file);
        if(relative==='js/today-dashboard.js') {
          let code=body.toString().replace('{ getAll, currentDatabaseName, isDemoDatabase }','{ getAll as todayBaseGetAll, currentDatabaseName, isDemoDatabase }');
          code+='\nasync function getAll(store){const rows=await todayBaseGetAll(store);if(store==="settings"&&window.__todayHold){window.__todayHeld=true;await window.__todayHold;}return rows;}\nwindow.__todayTest={render:renderTodayDashboard};\n';
          body=Buffer.from(code);
        }
        if(relative==='js/app.js') {
          body=Buffer.from(body.toString().replace('init().catch(handleError);','init().then(()=>window.__todayBootReady=true).catch(handleError);'));
        }
        return route.fulfill({status:200,body,contentType:/\.m?js$/.test(file)?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream'});
      } catch{return route.fulfill({status:404,body:''});}
    });
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto('https://localhost/index.html');
    await page.waitForFunction(()=>window.__todayBootReady && window.__campobase?.state.dataLoaded && window.__todayTest).catch(async error=>{
      console.log(JSON.stringify({errors,boot:await page.evaluate(()=>({app:!!window.__campobase,today:!!window.__todayTest,loaded:window.__campobase?.state.dataLoaded,toast:document.querySelector('#toast')?.textContent}))}));
      throw error;
    });
    await page.evaluate(async()=>{
      const db=await import('./js/db.js'),auth=await import('./js/auth-manager.js'),app=window.__campobase;
      db.configureCloudStore(null);
      const d=new Date(),day=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      for(const name of ['A','B']) {
        auth.setBoundSaasUserId(`today-${name}`);db.configureRealDatabase();app.state.role='owner';
        const sessions=[1,2].map(n=>({id:`s${n}`,recordType:'trainingSession',name:`Sesión ${name}-${n}`,date:day,time:`1${n}:00`,blocks:[],totalDuration:0,targetDuration:60}));
        const matches=[1,2].map(n=>({id:`m${n}`,opponent:`Rival ${name}-${n}`,date:`${day}T1${n}:00`,status:'planned',format:'F7',venue:'home',type:'league'}));
        matches.push({id:'closed',opponent:`Terminado ${name}`,date:`${day}T09:00`,completed:true,goalsFor:2,goalsAgainst:1,type:'league'});
        await db.putBatch({matches,settings:[{id:'main',teamName:`Equipo ${name}`,clubCrest:`icons/escudo.png?test-team=${name}`,theme:{},presets:[],sem:{},delegatePermissions:[]},...sessions],callups:[{id:'c2',matchId:'m2',date:`${day}T12:00`,opponent:`Rival ${name}-2`,availableIds:[],format:'F7'}]});
      }
      auth.setBoundSaasUserId('today-A');db.configureRealDatabase();await app.refresh(true);app.applyRole('owner');
      document.querySelector('#auth-dialog').close();app.showView('hoy');await window.__todayTest.render();
      window.__todayRowsBefore=(await db.exportDatabase()).data;
      window.__todayActions=[];window.addEventListener('campobase:today-action',event=>window.__todayActions.push(event.detail));
    });
    assert.match(await page.locator('#today-dashboard').textContent(),/Sesión A-1/);
    // Clicks use real controls and retain the exact chosen identity, even for
    // activities on the same day. They only open drafts/details; never save.
    for(const id of ['s1','s2']) {
      await page.locator(`[data-today-action="session"][data-id="${id}"]`).click();
      await page.locator('#session-detail-dialog').waitFor({state:'visible'});
      assert.equal(await page.locator('#session-detail-dialog').getAttribute('data-session-id'),id);
      assert.match(await page.locator('#session-detail-title').textContent(),new RegExp(`A-${id.slice(1)}`));
      await page.locator('#session-detail-dialog [data-close]').first().click();
      await page.evaluate(()=>window.__campobase.showView('hoy'));
    }
    for(const id of ['m1','m2']) {
      await page.locator(`[data-today-action="match"][data-id="${id}"]`).click();
      await page.locator('#match-detail-dialog').waitFor({state:'visible'});
      assert.equal(await page.locator('#match-detail-dialog').getAttribute('data-match-id'),id);
      await page.locator('#match-detail-dialog [data-close]').first().click();
      await page.evaluate(()=>window.__campobase.showView('hoy'));
    }
    await page.locator('[data-today-action="attendance"][data-id="s2"]').first().click();
    await page.waitForFunction(()=>document.querySelector('#training-form')?.dataset.sourceId==='s2');
    assert.equal(await page.locator('#training-form').getAttribute('data-attendance-source'),'session');
    await page.locator('#training-form .cancel-training').click();
    await page.evaluate(()=>window.__campobase.showView('hoy'));
    await page.locator('[data-today-action="callup"][data-id="m2"]').first().click();
    await page.waitForFunction(()=>document.activeElement?.dataset.callupId==='c2');
    assert.equal(await page.locator('#callup-builder').isVisible(),false,'viewing the existing callup does not open an editor');
    await page.evaluate(()=>window.__campobase.showView('hoy'));
    await page.locator('[data-today-action="callup"][data-id="m1"]').first().click();
    await page.locator('#callup-form').waitFor({state:'visible'});
    assert.equal(await page.locator('#callup-form [name="matchId"]').inputValue(),'m1');
    await page.locator('#callup-form .cancel-builder').click();
    await page.evaluate(()=>window.__campobase.showView('hoy'));
    assert.deepEqual(await page.evaluate(async()=>(await (await import('./js/db.js')).exportDatabase()).data),await page.evaluate(()=>window.__todayRowsBefore),'opening and cancelling activities writes no sporting records');
    assert.equal(await page.locator('[data-today-action="callup"][data-id="closed"]').count(),1,'finished card remains available for retrospective editing');
    const pending=page.locator('.today-side article').filter({has:page.locator('h3',{hasText:'Pendiente de hacer'})});
    assert.equal(await pending.locator('[data-today-action="callup"][data-id="closed"]').count(),0);
    assert.match(await page.locator('.cbx-season-totals').textContent(),/A favor · 2/);
    await page.evaluate(()=>{
      window.__todayHold=new Promise(resolve=>window.__todayRelease=resolve);
      window.__todayOld=window.__todayTest.render();
    });
    await page.waitForFunction(()=>window.__todayHeld);
    await page.evaluate(async()=>{
      const db=await import('./js/db.js'),auth=await import('./js/auth-manager.js');
      window.__todayHold=null;auth.setBoundSaasUserId('today-B');db.configureRealDatabase();
      await window.__campobase.refresh(true);
      document.querySelector('#topbar-team-name').textContent='Cabecera ajena A';
      document.querySelector('#topbar-club-crest').setAttribute('src','icons/escudo.png?test-team=A');
      await window.__todayTest.render();
      window.__todayRelease();window.__todayOldResult=await window.__todayOld;
    });
    assert.equal(await page.evaluate(()=>window.__todayOldResult),false);
    const content=await page.locator('#today-dashboard').textContent();
    assert.match(content,/Sesión B-1/);assert.match(content,/Rival B-2/);
    assert.doesNotMatch(content,/Sesión A-|Rival A-|Terminado A|Cabecera ajena A/);
    assert.equal(await page.locator('.cbx-today-score > div:first-child strong').textContent(),'Equipo B');
    assert.match(await page.locator('.cbx-today-score > div:first-child img').getAttribute('src'),/test-team=B/);
    await page.evaluate(async()=>{
      const db=await import('./js/db.js'),auth=await import('./js/auth-manager.js');
      auth.setBoundSaasUserId('today-C');db.configureRealDatabase();
      const d=new Date(),day=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      await db.putBatch({matches:[{id:'closed',opponent:'Rival neutral',date:`${day}T19:00`,completed:true}]});
      await window.__campobase.refresh(true);
      document.querySelector('#topbar-team-name').textContent='Cabecera ajena A';
      document.querySelector('#topbar-club-crest').setAttribute('src','icons/escudo.png?test-team=A');
      await window.__todayTest.render();
    });
    assert.equal(await page.locator('.cbx-today-score > div:first-child strong').textContent(),'Equipo');
    assert.equal(await page.locator('.cbx-today-score > div:first-child img').count(),0);
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({width,actions:'two exact sessions, two exact matches, linked attendance, view callup, create/cancel exact callup',closures:'no pending callup and correct result',retainedRead:'A discarded after B',identity:'snapshot B despite header A, neutral without settings',sportingRecords:'unchanged by actions',pageErrors:0,remoteWrites:0}));
    await context.close();
  }
} finally {await browser.close();}
