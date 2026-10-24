import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {pathToFileURL} from 'node:url';
const runtimeModule=process.env.PLAYWRIGHT_MODULE || path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs');
const {chromium}=await import('playwright-core').catch(()=>import(pathToFileURL(runtimeModule).href));
const root=path.resolve(process.env.CAMPOBASE_PREVIEW_ROOT || '.');
const fixtureHtml=`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>.hidden{display:none!important}body{font:16px system-ui;margin:12px}button{padding:12px}textarea{max-width:100%}</style>
<header class="topbar"><div class="status"><button id="logout">Salir</button></div></header>
<section id="asistencia" class="view active"><div class="section-head">Asistencia</div><div id="training-builder" class="hidden"></div></section>
<button class="delete-session">Borrar sesión</button><p id="toast"></p>
<script>
const initial=name=>({settings:[{id:'s1',recordType:'trainingSession',date:'2026-10-24',name:'Sesión '+name,blocks:[]}],players:[{id:'p1',name:'Jugador '+name,number:'1'}],matches:[],callups:[],trainings:[{id:'attendance',kind:'training',sessionId:'s1',date:'2026-10-24',notes:'Guardado '+name,attendance:[{playerId:'p1',status:'present'}]},{id:'orphan',sessionId:'old-missing',notes:'Histórico conservar'}]});
window.fixture={account:'A',revision:1,locked:false,permissions:['asistencia'],stores:{A:initial('A'),B:initial('B')},writes:[],deleted:[],syncResult:{online:true,pending:0},refreshes:0,renders:0,messages:[]};
window.__campobase={state:{role:'owner',cloudError:''},getDelegatePermissions:()=>fixture.permissions,synchronizeCloud:async()=>{if(fixture.syncHold)await fixture.syncHold;return fixture.syncResult;},refresh:async()=>{fixture.refreshes++;},renderAll:()=>{fixture.renders++;},toast:message=>{fixture.messages.push(message);document.querySelector('#toast').textContent=message;}};
window.confirm=()=>false;
document.querySelector('.delete-session').onclick=()=>window.confirm('Borrar');
document.addEventListener('click',e=>{if(e.target.closest('.cancel-training'))document.querySelector('#training-builder').classList.add('hidden');});
window.openAttendance=()=>window.dispatchEvent(new CustomEvent('campobase:attendance-open',{detail:{source:'session',id:'s1'}}));
</script><script type="module">await import('./js/attendance-linked-sources.js');await import('./js/runtime-refresh.js');window.fixtureReady=true;</script>`;
const dbStub=`
export const currentDatabaseName=()=> 'campobase_'+fixture.account;
export const isDemoDatabase=()=>false;
export async function getAll(store){const records=structuredClone(fixture.stores[fixture.account][store]);if(fixture.readHold){fixture.readStarted=true;await fixture.readHold;}return records;}
export async function syncFromCloud(){return {online:false,changed:false};}
export async function put(store,record,options={}){
 if(options.waitForCloud!==false)throw new Error('El guardado local no debe esperar a la red');
 if(fixture.writeHold){fixture.writeStarted=true;await fixture.writeHold;}
 options.assertContext?.(currentDatabaseName());
 if(fixture.denied)throw Object.assign(new Error('Permiso revocado por el servidor'),{code:'CAMPOBASE_PERMISSION_DENIED'});
 for(const expected of options.expectedRecords||[]){const current=fixture.stores[fixture.account][expected.store].find(row=>row.id===expected.id)??null;if(JSON.stringify(current)!==JSON.stringify(expected.record??null))throw Object.assign(new Error('Registro actualizado. Revisa la última versión.'),{code:'CAMPOBASE_RECORD_CHANGED'});}
 for(const expected of options.expectedStores||[]){if(JSON.stringify(fixture.stores[fixture.account][expected.store])!==JSON.stringify(expected.records))throw Object.assign(new Error('La asistencia ha cambiado. Revisa la última versión.'),{code:'CAMPOBASE_RECORD_CHANGED'});}
 fixture.writes.push({account:fixture.account,record:structuredClone(record)});const rows=fixture.stores[fixture.account][store],index=rows.findIndex(row=>row.id===record.id);if(index<0)rows.push(record);else rows[index]=record;
}
export async function remove(store,id){fixture.deleted.push({store,id});}
`;
const authStub=`export const getBoundSaasUserId=()=>fixture.account;export const getPinAccessRevision=()=>fixture.revision;export const isPinAccessLocked=()=>fixture.locked;`;
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN || (process.platform==='darwin'?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined),headless:true});
try {
 for(const width of [1440,390]) {
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'}),page=await context.newPage(),errors=[],remote=[];
  page.on('pageerror',error=>errors.push(error.message));
  await context.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.hostname!=='localhost'){remote.push(url.href);return route.fulfill({status:503,body:''});}
   const relative=decodeURIComponent(url.pathname).replace(/^\//,'');
   if(relative===''||relative==='index.html')return route.fulfill({status:200,contentType:'text/html',body:fixtureHtml});
   if(relative==='js/db.js')return route.fulfill({status:200,contentType:'text/javascript',body:dbStub});
   if(relative==='js/auth-manager.js')return route.fulfill({status:200,contentType:'text/javascript',body:authStub});
   const file=path.resolve(root,relative);if(!file.startsWith(root+path.sep))return route.fulfill({status:404,body:''});
   try{return route.fulfill({status:200,contentType:/\.m?js$/.test(file)?'text/javascript':'application/octet-stream',body:await fs.readFile(file)});}catch{return route.fulfill({status:404,body:''});}
  });
  await page.goto('https://localhost/');await page.waitForFunction(()=>window.fixtureReady);
  const open=async()=>{await page.evaluate(()=>window.openAttendance());await page.locator('#training-form').waitFor({state:'visible'});};
  const save=()=>page.locator('#training-form button[type="submit"]').click();
  await page.locator('.delete-session').click();
  await page.waitForFunction(()=>document.querySelector('#attendance-source-panel'));
  assert.deepEqual(await page.evaluate(()=>fixture.deleted),[]);
  assert.equal(await page.evaluate(()=>fixture.stores.A.trainings.some(row=>row.id==='orphan')),true);
  await open();await page.locator('#training-form textarea[name="notes"]').fill('Mi borrador sin guardar');
  await page.locator('#training-form input[name="status-p1"][value="absent"]').check({force:true});
  await page.evaluate(()=>window.sameDraft=document.querySelector('#training-form'));
  await page.evaluate(()=>{fixture.syncResult={online:true,pending:2,uploadError:'Red interrumpida'};});
  await page.locator('#manual-refresh').click();
  assert.equal(await page.evaluate(()=>document.querySelector('#training-form')===window.sameDraft),true);
  assert.equal(await page.locator('#training-form textarea[name="notes"]').inputValue(),'Mi borrador sin guardar');
  assert.equal(await page.evaluate(()=>fixture.refreshes+fixture.renders),0);
  assert.doesNotMatch(await page.locator('#toast').textContent(),/^Sincronizado/);
  // A's existing form cannot write B, even when B has exactly the same IDs.
  await page.evaluate(()=>{fixture.account='B';});await save();
  await page.locator('[data-attendance-error]').waitFor();
  assert.match(await page.locator('[data-attendance-error]').textContent(),/cuenta o tus permisos/);
  assert.equal(await page.evaluate(()=>fixture.writes.length),0);
  assert.equal(await page.evaluate(()=>fixture.stores.B.trainings[0].notes),'Guardado B');
  // A fresh B form can save; refusal leaves that draft visible and unchanged.
  await open();await page.locator('#training-form textarea[name="notes"]').fill('Borrador B');
  await page.evaluate(()=>{window.__campobase.state.role='delegate';fixture.denied=true;});
  await save();assert.equal(await page.evaluate(()=>fixture.writes.length),0);
  await page.evaluate(()=>{window.__campobase.state.role='owner';});await open();
  await page.evaluate(()=>{fixture.denied=true;});await save();
  await page.waitForFunction(()=>document.querySelector('[data-attendance-error]')?.textContent.includes('Permiso revocado'));
  assert.equal(await page.locator('#training-form').isVisible(),true);assert.equal(await page.evaluate(()=>fixture.writes.length),0);
  await page.evaluate(()=>{fixture.denied=false;window.__campobase.state.role='delegate';});await open();
  await page.evaluate(()=>{fixture.permissions=[];});await save();
  await page.waitForFunction(()=>document.querySelector('[data-attendance-error]')?.textContent.includes('permisos'));
  assert.equal(await page.evaluate(()=>fixture.writes.length),0);
  // A remote change appearing after Save but before the transaction is kept.
  await page.evaluate(()=>{window.__campobase.state.role='owner';fixture.permissions=['asistencia'];});await open();
  await page.evaluate(()=>{fixture.writeHold=new Promise(resolve=>window.releaseWrite=resolve);});await save();
  await page.waitForFunction(()=>fixture.writeStarted);
  await page.evaluate(()=>{fixture.stores.B.trainings[0].notes='Edición de otro dispositivo';window.releaseWrite();fixture.writeHold=null;});
  await page.waitForFunction(()=>document.querySelector('[data-attendance-error]')?.textContent.includes('última versión'));
  assert.equal(await page.evaluate(()=>fixture.stores.B.trainings[0].notes),'Edición de otro dispositivo');assert.equal(await page.evaluate(()=>fixture.writes.length),0);
  await open();
  await page.evaluate(()=>{fixture.writeStarted=false;fixture.writeHold=new Promise(resolve=>window.releaseWrite=resolve);});await save();
  await page.waitForFunction(()=>fixture.writeStarted);
  await page.evaluate(()=>{window.savedPlayers=structuredClone(fixture.stores.B.players);fixture.stores.B.players=[];window.releaseWrite();fixture.writeHold=null;});
  await page.waitForFunction(()=>document.querySelector('[data-attendance-error]')?.textContent.includes('última versión'));
  assert.equal(await page.evaluate(()=>fixture.writes.length),0);
  assert.equal(await page.locator('#training-form').isVisible(),true);
  assert.equal(await page.evaluate(()=>fixture.stores.B.trainings[0].notes),'Edición de otro dispositivo');
  await page.evaluate(()=>{fixture.stores.B.players=window.savedPlayers;});
  await open();await page.locator('#training-form textarea[name="notes"]').fill('Guardado explícito B');await save();
  await page.waitForFunction(()=>fixture.writes.length===1);
  assert.equal(await page.evaluate(()=>fixture.writes[0].account),'B');assert.equal(await page.evaluate(()=>fixture.writes[0].record.notes),'Guardado explícito B');
  assert.equal(await page.evaluate(()=>fixture.stores.A.trainings[0].notes),'Guardado A');assert.equal(await page.evaluate(()=>fixture.stores.B.trainings.some(row=>row.id==='orphan')),true);
  assert.deepEqual(errors,[]);assert.deepEqual(remote,[]);
  console.log(JSON.stringify({width,checks:26,pageErrors:errors.length,externalRequests:remote.length,syntheticWrites:await page.evaluate(()=>fixture.writes.length)}));
  await context.close();
 }
} finally {await browser.close();}
