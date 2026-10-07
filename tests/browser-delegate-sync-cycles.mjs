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
const server={players:fixture.players,matches:fixture.matches,callups:fixture.callups,trainings:[],settings:[]};
const errors=[];let remoteWrites=0;
try {
 browser=await chromium.launch({executablePath:process.env.CHROME_BIN,headless:true});
 const pages=[];
 for(const width of [1280,390]){
  const context=await browser.newContext({viewport:{width,height:844},serviceWorkers:'block'});
  await context.setOffline(true);
  await context.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.hostname.endsWith('.supabase.co')){if(!['GET','HEAD','OPTIONS'].includes(route.request().method())&&!url.pathname.startsWith('/auth/')&&!url.pathname.includes('/rpc/'))remoteWrites++;return route.fulfill({status:503,body:'null'});}
   if(url.hostname!=='miguelperezh.github.io')return route.continue();
   const file=path.resolve(source,url.pathname.replace(/^\/campobase\/?/,'')||'index.html');
   try{const body=await fs.readFile(file);return route.fulfill({status:200,body,contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream'});}catch{return route.fulfill({status:404,body:''});}
  });
  const page=await context.newPage();pages.push(page);page.on('pageerror',e=>errors.push(e.message));
  await page.exposeFunction('testSnapshot',store=>({records:structuredClone(server[store]),rowCount:server[store].length,deletedIds:[]}));
  await page.exposeFunction('testWrite',mutation=>{const rows=server[mutation.store],i=rows.findIndex(x=>x.id===mutation.recordId);if(i<0)rows.push(mutation.payload);else rows[i]=mutation.payload;});
  await page.goto('https://miguelperezh.github.io/campobase/');await page.locator('#saas-demo-btn').click();await page.waitForFunction(()=>window.__campobase?.state.role==='demo',null,{timeout:10000}).catch(async e=>{console.log(await page.evaluate(()=>({role:window.__campobase?.state.role,toast:document.querySelector('#toast')?.textContent,auth:document.querySelector('#auth-dialog')?.textContent?.slice(-250)})));console.log(errors);throw e;});
  await page.evaluate(async fixture=>{
   const db=await import('./js/db.js'),auth=await import('./js/auth-manager.js'),domain=await import('./js/domain.js'),app=window.__campobase;
   const id='11111111-1111-4111-8111-111111111111';auth.setBoundSaasUserId(id);db.configureRealDatabase();
   const settings={id:'main',teamName:'Equipo de prueba',format:'F7',pinSalt:'test-salt',ownerPinHash:await domain.hashPin('1234','test-salt'),delegatePinHash:await domain.hashPin('5678','test-salt'),delegatePin:'5678',delegatePermissions:['partido'],updatedAt:9999999999999};
   for(const row of fixture.players)await db.put('players',row);
   await db.put('settings',settings);await app.refresh(true);
   globalThis.__cbSupabaseClient={auth:{getSession:async()=>({data:{session:{user:{id}}}})},functions:{},rpc:async()=>({data:null}),channel:()=>({on(){return this;},subscribe(){return this;}}),removeChannel:async()=>{}};
   db.configureCloudStore({prepare:async()=>({userId:id}),shouldApplyMutation:async()=>app.state.role==='owner',upsert:window.testWrite,getSnapshot:window.testSnapshot});
   await app.logoutUser();
  },fixture);
  await context.setOffline(false);
 }
 const [owner,delegate]=pages;
 // Seed the test cloud from one isolated page only. No production writes.
 server.settings=[await owner.evaluate(()=>window.__campobase.state.settings)];
 for(const [page,pin] of [[owner,'1234'],[delegate,'5678']]){
  await page.locator('#saas-local-pin-btn').click();await page.locator('#auth-form input[name=pin]').fill(pin);await page.locator('#auth-form').evaluate(f=>f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  await page.waitForFunction(()=>['owner','delegate'].includes(window.__campobase.state.role));
 }
 for(const permissions of [['partido','sesiones','ejercicios'],['partido','ejercicios','tacticas'],['partido'],['partido','plantilla','sesiones']]){
  await owner.evaluate(perms=>{const app=window.__campobase;app.showView('ajustes');const f=document.querySelector('#delegate-account-form');f.elements.delegatePinInput.value='5678';for(const c of f.querySelectorAll('input[type=checkbox]'))c.checked=perms.includes(c.value);f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));},permissions);
  await owner.waitForFunction(perms=>JSON.stringify(window.__campobase.state.settings.delegatePermissions)===JSON.stringify(perms),permissions);
  await owner.waitForFunction(async perms=>{const s=await window.testSnapshot('settings');return JSON.stringify(s.records.find(x=>x.id==='main').delegatePermissions)===JSON.stringify(perms);},permissions);
  // Wait for the existing 10-second polling; do not refresh manually.
  await delegate.waitForFunction(perms=>JSON.stringify(window.__campobase.getDelegatePermissions())===JSON.stringify(perms),permissions);
  for(const view of ['plantilla','sesiones','ejercicios','tacticas']){
   const sidebar=delegate.locator('#cb-claude-sidebar [data-target-view="'+view+'"]');
   assert.equal(await sidebar.evaluate(el=>!el.hidden),permissions.includes(view));
  }
  await delegate.evaluate(()=>window.__campobase.showView('sesiones'));
  assert.equal(await delegate.locator('.view.active').getAttribute('id')==='sesiones',permissions.includes('sesiones'));
 }
 assert.equal(errors.length,0);assert.equal(remoteWrites,0);
 console.log('PASS: owner PIN + delegate PIN in separate browsers; four grant/revoke cycles sync from saved settings; mobile/desktop menu follows, removed views cannot open; no production writes.');
}finally{await browser?.close();}
