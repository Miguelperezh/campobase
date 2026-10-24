import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {pathToFileURL} from 'node:url';
const runtimeModule=process.env.PLAYWRIGHT_MODULE || path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs');
const {chromium}=await import('playwright-core').catch(()=>import(pathToFileURL(runtimeModule).href));
const root=path.resolve(process.env.CAMPOBASE_PREVIEW_ROOT || '.');
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN || (process.platform==='darwin'?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined),headless:true});
try {
 for(const width of [1440,390].filter(value=>!process.env.CAMPOBASE_TEST_WIDTH||value===Number(process.env.CAMPOBASE_TEST_WIDTH))) {
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'}),page=await context.newPage(),errors=[],remote=[];
  await context.addInitScript(()=>{
   window.__syncTestOnline=false;
   Object.defineProperty(navigator,'onLine',{get:()=>window.__syncTestOnline});
   Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Portapapeles no disponible en la prueba');}}});
  });
  await context.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.hostname!=='localhost'){remote.push(`${route.request().method()} ${url.origin}`);return route.fulfill({status:503,body:'null'});}
   const relative=decodeURIComponent(url.pathname).replace(/^\//,'')||'index.html',file=path.resolve(root,relative);
   if(!file.startsWith(root+path.sep))return route.fulfill({status:403,body:''});
   try {
    let body=await fs.readFile(file);
    if(relative==='js/app.js') {
     let source=body.toString();
     assert.ok(source.includes('getSyncDiagnostics, getLocalPinSettingsCandidates'),'No se localiza la importación de diagnóstico real');
     source=source.replace('getSyncDiagnostics, getLocalPinSettingsCandidates','getSyncDiagnostics as baseSyncDiagnostics, getLocalPinSettingsCandidates');
     const seam=`async function getSyncDiagnostics(){
       const info=await baseSyncDiagnostics();
       const hold=window.__syncHoldDiagnostic;
       if(hold){window.__syncHoldDiagnostic=null;window.__syncDiagnosticStarted=true;await hold;}
       return info;
     }\n`;
     source=source.replace('const $ = (selector, root = document)',seam+'const $ = (selector, root = document)');body=Buffer.from(source);
    }
    return route.fulfill({status:200,body,contentType:/\.m?js$/.test(file)?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream'});
   } catch(error){if(error.name==='AssertionError')throw error;return route.fulfill({status:404,body:''});}
  });
  page.on('pageerror',error=>errors.push(error.message));
  const clickReport=async()=>{
   try {await page.locator('#copy-sync-report').click({timeout:6000});}
   catch(error){console.log('REPORT LAYOUT',await page.evaluate(()=>{const row=document.querySelector('#copy-sync-report').parentElement;return{viewport:[innerWidth,innerHeight],scroll:[scrollX,scrollY],elements:[document.querySelector('#copy-sync-report'),row,document.querySelector('#sync-status-panel'),document.querySelector('#ajustes'),document.querySelector('#app')].map(node=>({id:node.id,className:node.className,rect:node.getBoundingClientRect().toJSON(),display:getComputedStyle(node).display,width:getComputedStyle(node).width,wrap:getComputedStyle(node).flexWrap,overflow:getComputedStyle(node).overflow}))};}));await page.screenshot({path:`/tmp/campobase-sync-feedback-${width}.png`});throw error;}
  };
  await page.goto('https://localhost/index.html');
  await page.waitForFunction(()=>window.__campobase?.state.dataLoaded,null,{timeout:20000});
  await page.evaluate(async()=>{
   const db=await import('./js/db.js'),auth=await import('./js/auth-manager.js');
   db.configureCloudStore(null);window.__syncFixtures={};
   const done=tx=>new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
   for(const name of ['A','B']) {
    auth.setBoundSaasUserId(`sync-feedback-${name}`);db.configureRealDatabase();window.__campobase.state.role='owner';
    const player={id:'same-player',name:`Privado jugador ${name}`,number:'11',positions:['Central'],fatherPhone:'600123456',notes:'PRIVATE-SPORT-NOTE'};
    const match={id:'same-match',opponent:`Privado rival ${name}`,date:'2000-01-01T12:00',status:'finished',goalsFor:2,goalsAgainst:1};
    const main={id:'main',teamName:`Privado equipo ${name}`,theme:{accentColor:name==='A'?'#123456':'#654321'},ownerPinHash:'PRIVATE-PIN-HASH',delegatePinHash:'PRIVATE-DELEGATE-HASH',pinSalt:'PRIVATE-SALT',delegatePermissions:[]};
    await db.putBatch({players:[player],matches:[match],settings:[main]});
    const database=await db.openDatabase(),tx=database.transaction('syncQueue','readwrite');tx.objectStore('syncQueue').clear();await done(tx);
    window.__syncFixtures[name]={player,match,main};
   }
   auth.setBoundSaasUserId('sync-feedback-A');db.configureRealDatabase();
   await window.__campobase.refresh(true);window.__campobase.applyRole('owner');document.querySelector('#auth-dialog').close();window.__campobase.showView('ajustes');
   window.dispatchEvent(new Event('offline'));
  });
  await page.waitForFunction(()=>document.querySelector('#sync-feedback').dataset.state==='offline');
  await page.locator('#sync-now').click();await page.waitForFunction(()=>!document.querySelector('#sync-now').disabled);
  assert.match(await page.locator('#sync-status-text').textContent(),/Sin conexión/);
  assert.doesNotMatch(await page.locator('#toast').textContent(),/Sincronización completada|Sincronizado con/);
  assert.deepEqual(errors,[]);
  // Copy fallback exposes only the explicit diagnostic allowlist.
  await clickReport();await page.locator('#sync-support-report').waitFor({state:'visible'});
  const report=await page.locator('#sync-support-report').inputValue();
  assert.equal(report.split('\n').length,7);assert.match(report,/CampoBase · Informe de sincronización/);
  assert.doesNotMatch(report,/PRIVATE|Privado|600123456|sync-feedback-A|same-player|same-match|access_token|refresh_token/i);
  assert.match(report,/Red disponible: No/);
  // An empty queue without an account is never a successful server check.
  await page.evaluate(async()=>{
   const auth=await import('./js/auth-manager.js'),db=await import('./js/db.js');auth.clearBoundSaasUserId();db.configureRealDatabase();db.configureCloudStore(null);window.__syncTestOnline=true;
  });
  await page.locator('#sync-now').click();await page.waitForFunction(()=>!document.querySelector('#sync-now').disabled);
  assert.equal(await page.locator('#sync-feedback').getAttribute('data-state'),'unbound');
  assert.doesNotMatch(await page.locator('#sync-status-text').textContent(),/^Sincronizado$/);
  // A controlled cloud adapter exercises the real DB queue and app status path.
  await page.evaluate(async()=>{
   const db=await import('./js/db.js'),auth=await import('./js/auth-manager.js');auth.setBoundSaasUserId('sync-feedback-B');db.configureRealDatabase();await window.__campobase.refresh(true);window.__campobase.showView('ajustes');
   window.__syncCloudMode='error';window.__syncCloudRows={};
   for(const store of db.STORES)window.__syncCloudRows[store]=await db.getAll(store);
   db.configureCloudStore({
    prepare:async()=>({userId:auth.getBoundSaasUserId()}),
    getSnapshot:async store=>({records:structuredClone(window.__syncCloudRows[store]),deletedIds:[],rowCount:window.__syncCloudRows[store].length}),
    upsert:async mutation=>{if(window.__syncCloudMode==='error')throw Error('Red de prueba interrumpida');const rows=window.__syncCloudRows[mutation.store],index=rows.findIndex(row=>row.id===mutation.recordId);if(index<0)rows.push(structuredClone(mutation.payload));else rows[index]=structuredClone(mutation.payload);},
    remove:async()=>{},
   });
   const {buildMutation}=await import('./js/sync-core.js?v=20261009-postgame-sync-1');
   const database=await db.openDatabase(),tx=database.transaction('syncQueue','readwrite'),queue=tx.objectStore('syncQueue');
   queue.put(buildMutation('settings','upsert',{id:'fake-pending-setting',value:'PRIVATE-QUEUE-VALUE'},1));
   queue.put({...buildMutation('settings','upsert',{id:'fake-blocked-setting',value:'PRIVATE-BLOCKED-VALUE'},2),blockedAt:1});
   await new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
  });
  await page.locator('#sync-now').click();await page.waitForFunction(()=>!document.querySelector('#sync-now').disabled);
  assert.equal(await page.locator('#sync-feedback').getAttribute('data-state'),'error');
  assert.match(await page.locator('#sync-status-detail').textContent(),/Red de prueba interrumpida/);
  assert.match(await page.locator('#sync-status-detail').textContent(),/1 borrador sin permiso/);
  assert.doesNotMatch(await page.locator('#toast').textContent(),/Sincronización completada/);
  assert.deepEqual(await page.evaluate(async()=>{const info=await(await import('./js/db.js')).getSyncDiagnostics();return{pending:info.pending,blocked:info.blocked,retryable:info.retryable};}),{pending:2,blocked:1,retryable:1});
  await clickReport();
  await page.waitForFunction(()=>document.querySelector('#sync-support-report').value.includes('Cambios pendientes: 2'));
  const errorReport=await page.locator('#sync-support-report').inputValue();
  assert.match(errorReport,/Cambios pendientes: 2/);assert.match(errorReport,/Borradores sin permiso: 1/);assert.doesNotMatch(errorReport,/PRIVATE|Red de prueba|Privado|sync-feedback|600123456/);
  // A stale, fully read diagnostic from A cannot paint over B's own status.
  await page.evaluate(async()=>{
   const db=await import('./js/db.js'),auth=await import('./js/auth-manager.js'),{buildMutation}=await import('./js/sync-core.js?v=20261009-postgame-sync-1');
   window.__syncTestOnline=false;db.configureCloudStore(null);auth.setBoundSaasUserId('sync-feedback-A');db.configureRealDatabase();
   const database=await db.openDatabase(),tx=database.transaction('syncQueue','readwrite'),queue=tx.objectStore('syncQueue');
   for(let n=0;n<4;n++)queue.put({...buildMutation('settings','upsert',{id:`blocked-A-${n}`},n+1),blockedAt:1});
   await new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
   await window.__campobase.refresh(true);window.__campobase.showView('ajustes');
   window.__syncHoldDiagnostic=new Promise(resolve=>window.__syncReleaseDiagnostic=resolve);
   document.querySelector('#sync-now').click();
  });
  await page.waitForFunction(()=>window.__syncDiagnosticStarted);
  await page.evaluate(async()=>{
   const db=await import('./js/db.js'),auth=await import('./js/auth-manager.js');auth.setBoundSaasUserId('sync-feedback-B');db.configureRealDatabase();await window.__campobase.refresh(true);window.__campobase.showView('ajustes');
   await window.__campobase.synchronizeCloud();window.__syncReleaseDiagnostic();
  });
  await page.waitForFunction(()=>!document.querySelector('#sync-now').disabled);
  assert.match(await page.locator('#sync-status-detail').textContent(),/1 borrador sin permiso/);
  assert.doesNotMatch(await page.locator('#sync-status-detail').textContent(),/4 borradores/);
  const preserved=await page.evaluate(async()=>{const db=await import('./js/db.js');return{player:await db.getOne('players','same-player'),match:await db.getOne('matches','same-match'),theme:(await db.getOne('settings','main')).theme,original:window.__syncFixtures.B};});
  assert.deepEqual(preserved.player,preserved.original.player);assert.deepEqual(preserved.match,preserved.original.match);assert.deepEqual(preserved.theme,preserved.original.main.theme);
  const bounds=await page.locator('#sync-feedback').boundingBox();assert.ok(bounds&&bounds.width<=width&&bounds.x>=0,`El aviso se recorta a ${width}px`);
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({width,manualSync:'offline/unbound/error sin falso éxito',blocked:'borrador conservado y explicado',report:'fallback sin datos privados',context:'diagnóstico A descartado tras B',data:'jugador/partido/tema conservados',pageErrors:errors.length,remoteRequestsBlocked:remote.length}));
  await context.close();
 }
} finally {await browser.close();}
