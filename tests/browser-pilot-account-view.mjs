import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {pathToFileURL} from 'node:url';
const runtimeModule=process.env.PLAYWRIGHT_MODULE || path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs');
const {chromium}=await import('playwright-core').catch(()=>import(pathToFileURL(runtimeModule).href));
const root=path.resolve(process.env.CAMPOBASE_PREVIEW_ROOT || '.');
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN || (process.platform==='darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined),headless:true});
try {
 for(const width of [1440,390]) {
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'}),page=await context.newPage(),errors=[],remote=[];
  await context.addInitScript(()=>{
   // Only synthetic data in this fresh browser profile. No request can reach a remote service.
   Object.defineProperty(navigator,'onLine',{get:()=>false});
   window.__pilotWrites=[];
  });
  await context.route('**/*',async route=>{
   const request=route.request(),url=new URL(request.url());
   if(url.hostname!=='localhost') {remote.push(`${request.method()} ${url.hostname}${url.pathname}`);return route.fulfill({status:503,body:'null'});}
   const relative=decodeURIComponent(url.pathname).replace(/^\//,'') || 'index.html',file=path.resolve(root,relative);
   if(!file.startsWith(root+path.sep))return route.fulfill({status:404,body:''});
   try {
    let body=await fs.readFile(file);
    if(relative==='js/app.js') {
     let app=body.toString().replace(' deleteDemoDatabase, getAll, getOne,',' deleteDemoDatabase, getAll as pilotBaseGetAll, getOne,');
     app=`${app}\n`;
     const marker="const $ = (selector, root = document)";
     const seam=`async function getAll(store) {
       const rows=await pilotBaseGetAll(store);
       if(store==='settings'&&window.__pilotHold){window.__pilotHeld=true;await window.__pilotHold;}
       return rows;
     }\n`;
     app=app.replace(marker,seam+marker);body=Buffer.from(app);
    }
    return route.fulfill({status:200,body,contentType:(/\.m?js$/.test(file))?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream'});
   } catch{return route.fulfill({status:404,body:''});}
  });
  page.on('pageerror',error=>{errors.push(error.message);console.log('PAGE ERROR',error.message);});

  await page.goto('https://localhost/index.html');
  await page.waitForFunction(()=>window.__campobase?.state.dataLoaded,null,{timeout:20000}).catch(async error=>{console.log(await page.evaluate(()=>({app:!!window.__campobase,state:window.__campobase?.state,toast:document.querySelector('#toast')?.textContent})));throw error;});
  await page.evaluate(async()=>{
   const db=await import('./js/db.js'),auth=await import('./js/auth-manager.js'),app=window.__campobase;
   db.configureCloudStore(null);
   const fixtures={};
   for(const name of ['A','B']) {
    auth.setBoundSaasUserId(`pilot-${name}`);db.configureRealDatabase();app.state.role='owner';
    const player={id:'same-player',name:`Jugador ${name}`,number:'1',positions:['Central'],notes:`Privado ${name}`};
    const match={id:'same-match',opponent:`Rival ${name}`,date:'2000-01-01T12:00',status:'in_progress',type:'league'};
    const main={id:'main',teamName:`Equipo ${name}`,theme:name==='A'?{accentColor:'#123456'}:{},presets:[],sem:{},matchPreset:null,delegatePermissions:[]};
    await db.putBatch({players:[player],matches:[match],settings:[main]});fixtures[name]={player,match,main};
   }
   window.__pilotFixtures=fixtures;
   auth.setBoundSaasUserId('pilot-A');db.configureRealDatabase();await app.refresh(true);app.applyRole('owner');
   document.querySelector('#auth-dialog').close();app.showView('plantilla');
  });
  assert.match(await page.locator('#players-list').textContent(),/Jugador A/);
  await page.evaluate(()=>{
   window.__pilotHold=new Promise(resolve=>window.__pilotRelease=resolve);
   window.__pilotOld=window.__campobase.refresh(true);
  });
  await page.waitForFunction(()=>window.__pilotHeld);
  await page.evaluate(async()=>{
   const db=await import('./js/db.js'),auth=await import('./js/auth-manager.js');
   window.__pilotHold=null;auth.setBoundSaasUserId('pilot-B');db.configureRealDatabase();
   await window.__campobase.refresh(true);window.__campobase.showView('plantilla');
   window.__pilotRelease();window.__pilotOldResult=await window.__pilotOld;
  });
  assert.equal(await page.evaluate(()=>window.__pilotOldResult),false);
  assert.match(await page.locator('#players-list').textContent(),/Jugador B/);
  assert.doesNotMatch(await page.locator('#players-list').textContent(),/Jugador A/);
  assert.deepEqual(await page.evaluate(()=>window.__campobase.state.settings.theme),{});
  assert.deepEqual(await page.evaluate(()=>window.__campobase.getDelegatePermissions()),[]);
  const readMatch=()=>page.evaluate(async()=>(await import('./js/db.js')).getOne('matches','same-match'));
  assert.deepEqual(await readMatch(),await page.evaluate(()=>window.__pilotFixtures.B.match));
  const cache=await page.evaluate(()=>JSON.parse(localStorage.getItem('campobase.directFieldCache')));
  if(cache.saasUserId!=='pilot-B')console.log(await page.evaluate(()=>({bound:localStorage.getItem('campobase.saasUserId'),state:window.__campobase.state.settings,cache:JSON.parse(localStorage.getItem('campobase.directFieldCache')),toast:document.querySelector('#toast').textContent})));
  assert.equal(cache.saasUserId,'pilot-B');assert.equal(cache.database,'campobase_pilot-B');assert.equal(cache.players[0].name,'Jugador B');
  // Canonical JSON controls: wrong-account and delegate imports never reach confirmation or change data.
  const valid=await page.evaluate(async()=>{
   const db=await import('./js/db.js');return db.exportDatabase();
  });
  await page.evaluate(()=>window.__campobase.showView('ajustes'));
  const wrong={...valid,saasUserId:'pilot-A',database:'campobase_pilot-A'};
  await page.locator('#import-data').setInputFiles({name:'wrong-account.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(wrong))});
  await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('otra cuenta'));
  assert.equal(await page.locator('#confirmation-dialog').evaluate(node=>node.open),false);
  assert.equal(await page.evaluate(()=>window.__campobase.state.players[0].name),'Jugador B');
  // Real import confirmation can be cancelled without touching the underlying records.
  await page.locator('#import-data').setInputFiles({name:'same-account.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(valid))});
  await page.locator('#confirmation-dialog').waitFor({state:'visible'});
  assert.match(await page.locator('#confirmation-message').textContent(),/Equipo B/);
  await page.locator('#confirmation-cancel').click();
  assert.deepEqual(await readMatch(),await page.evaluate(()=>window.__pilotFixtures.B.match));
  // A real confirmed restoration preserves a local recovery copy and reports offline upload honestly.
  const restored=structuredClone(valid);restored.data.players[0].name='Jugador B recuperado';
  await page.locator('#import-data').setInputFiles({name:'restore-B.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(restored))});
  await page.locator('#confirmation-dialog').waitFor({state:'visible'});await page.locator('#confirmation-accept').click();
  await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('Sincronización pendiente'));
  assert.equal(await page.evaluate(()=>window.__campobase.state.players[0].name),'Jugador B recuperado');
  assert.equal(await page.evaluate(async()=>(await (await import('./js/db.js')).getImportRecoveryBackup()).data.players[0].name),'Jugador B');
  // Revoked role cannot reuse even a valid owner backup.
  await page.evaluate(()=>window.__campobase.applyRole('delegate'));
  await page.locator('#import-data').setInputFiles({name:'delegate.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(valid))});
  await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('cuenta ha cambiado'));
  assert.equal(await page.locator('#confirmation-dialog').evaluate(node=>node.open),false);
  await page.evaluate(()=>{window.__campobase.applyRole('owner');window.__campobase.showView('ajustes');});
  // A confirmation opened in B becomes invalid immediately when the account changes.
  await page.locator('#import-data').setInputFiles({name:'account-switch.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(valid))});
  await page.locator('#confirmation-dialog').waitFor({state:'visible'});
  await page.evaluate(async()=>{const db=await import('./js/db.js');localStorage.setItem('campobase.saasUserId','pilot-A');db.configureRealDatabase();await window.__campobase.refresh(true);});
  await page.locator('#confirmation-accept').click();
  await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('cuenta ha cambiado'));
  assert.equal(await page.evaluate(async()=>(await (await import('./js/db.js')).getOne('players','same-player')).name),'Jugador A');
  await page.evaluate(async()=>{const db=await import('./js/db.js');localStorage.setItem('campobase.saasUserId','pilot-B');db.configureRealDatabase();await window.__campobase.refresh(true);window.__campobase.showView('ajustes');});
  assert.equal(await page.evaluate(()=>window.__campobase.state.players[0].name),'Jugador B recuperado');
  // Shared mobile address contains no account identity, credentials or session tokens.
  await page.locator('#share-data-mobile').click();
  await page.locator('#mobile-sync-dialog').waitFor({state:'visible'});
  assert.match(await page.locator('#mobile-sync-dialog').textContent(),/propia cuenta o PIN/);
  await page.locator('#mobile-sync-dialog [data-close]').first().click();
  await page.evaluate(async()=>{
   const db=await import('./js/db.js');
   localStorage.setItem('campobase.saasUserId','pilot-B');db.configureRealDatabase();
   sessionStorage.removeItem('campobase.sessionRole');
  });
  await page.reload();await page.waitForFunction(()=>window.__campobase?.state.dataLoaded);
  assert.equal(await page.evaluate(()=>window.__campobase.state.players[0].name),'Jugador B recuperado');
  assert.equal(await page.evaluate(()=>window.__campobase.state.matches[0].status),'in_progress');
  // Field mode must ignore a global cache credited to A and read only B's database.
  await page.evaluate(()=>{const foreign={database:'campobase_pilot-A',saasUserId:'pilot-A',players:[{id:'same-player',name:'Privado A de caché'}],matches:[]};localStorage.setItem('campobase.directFieldCache',JSON.stringify(foreign));});
  const field=await context.newPage();field.on('pageerror',error=>errors.push(error.message));
  await field.goto('https://localhost/modo-campo-directo.html');
  await field.waitForFunction(()=>window.__CAMPOBASE_CACHE__?.saasUserId==='pilot-B');
  assert.equal(await field.evaluate(()=>window.__CAMPOBASE_CACHE__.players[0].name),'Jugador B recuperado');
  assert.doesNotMatch(await field.locator('body').textContent(),/Privado A de caché/);
  await field.close();
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({width,retainedSettingsRead:'A discarded after B',sameIds:'isolated',caches:'B provenance',import:'reject/cancel/restore/backup/role/account-switch validated',reload:'B and sporting state retained',pageErrors:errors.length,remoteRequestsBlocked:remote.length}));
  await context.close();
 }
} finally {await browser.close();}
