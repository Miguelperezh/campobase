import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const source=path.resolve(process.env.CAMPOBASE_PREVIEW_ROOT || '.'),id='11111111-1111-4111-8111-111111111111';
const hash=pin=>createHash('sha256').update('test-salt:'+pin).digest('hex');
const settings={id:'main',format:'F7',teamName:'Equipo de prueba',pinSalt:'test-salt',ownerPinHash:hash('1234'),delegatePin:'5678',delegatePinHash:hash('5678'),demoPinSalt:'test-salt',demoPinHash:hash('9012'),delegatePermissions:['partido'],updatedAt:Date.now()};
let browser;
try{
 browser=await chromium.launch({executablePath:process.env.CHROME_BIN,headless:true});
 const context=await browser.newContext({viewport:{width:1280,height:900},serviceWorkers:'block'});
 let remoteWrites=0;const errors=[];
 await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname.endsWith('.supabase.co')){if(route.request().method()!=='GET')remoteWrites++;return route.fulfill({status:503,body:'null'});}if(u.hostname!=='miguelperezh.github.io')return route.abort();const file=path.resolve(source,u.pathname.replace(/^\/campobase\/?/,'')||'index.html');try{return route.fulfill({status:200,body:await fs.readFile(file),contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream'});}catch{return route.fulfill({status:404,body:''});}});
 await context.addInitScript(({id,settings})=>{
  navigator.serviceWorker.register=async()=>({update:async()=>{}});
  settings=JSON.parse(sessionStorage.getItem('test.cloudSettings')||JSON.stringify(settings));
  const player={id:'test-player',name:'Jugador de prueba',number:7,positions:['Extremo']};
  localStorage.setItem('campobase.saasUserId',id);
  const team={team_id:'test-team',team_name:'Equipo de prueba',data_owner_user_id:id,membership_role:'coach',view_permissions:[]};
  const tables={jugadores:[{user_id:id,id:player.id,payload:player,updated_at:1,deleted_at:null}],configuracion:[{user_id:id,id:'main',payload:settings,updated_at:1,deleted_at:null},...['completed','closed','pending'].map((key)=>({user_id:id,id:key,payload:{id:key,recordType:'trainingSession',name:key,date:'2026-10-06',duration:60,completed:key==='completed',...(key==='closed'?{status:'closed',closedAt:1}:{}),blocks:[]},updated_at:1,deleted_at:null}))],perfiles:[{id,role:'coach',full_name:'Titular de prueba'}],partidos:[],convocatorias:[],asistencias:['closed','completed'].map(key=>({user_id:id,id:'attendance-'+key,payload:{id:'attendance-'+key,kind:'training',sessionId:key,date:'2026-10-06',attendance:[{playerId:'test-player',status:'present'}]},updated_at:1,deleted_at:null}))};window.testCloud=tables;
  function query(table){let single=false,filters=[],limit=null,op=null,payload=null;const q={select(){return q;},eq(k,v){filters.push([k,v]);return q;},is(){return q;},order(){return q;},limit(v){limit=v;return q;},abortSignal(){return q;},maybeSingle(){single=true;return q;},single(){single=true;return q;},upsert(v){op='upsert';payload=v;return q;},then(resolve,reject){return new Promise(r=>setTimeout(r,80)).then(()=>{if(window.testFailReads&&!op)return {data:null,error:{message:'Red de prueba'}};if(op){const rows=tables[table]||=[];const i=rows.findIndex(x=>x.id===payload.id);if(i<0)rows.push(payload);else rows[i]=payload;if(table==='configuracion'&&payload.id==='main')sessionStorage.setItem('test.cloudSettings',JSON.stringify(payload.payload));return {data:null,error:null};}let rows=(tables[table]||[]).filter(x=>filters.every(([k,v])=>x[k]===v));if(limit!==null)rows=rows.slice(0,limit);return {data:single?(rows[0]||null):rows,error:null};}).then(resolve,reject);}};return q;}
  const client={auth:{getSession:async()=>({data:{session:sessionStorage.getItem('test.signedOut')?null:{user:{id,user_metadata:{}}}}}),signOut:async()=>{sessionStorage.setItem('test.signedOut','1');return {error:null};},onAuthStateChange(){return {data:{subscription:{unsubscribe(){}}}};}},functions:{},from:query,rpc:async(name)=>{await new Promise(r=>setTimeout(r,80));return ({data:name==='mi_equipo_contexto'?team:name==='get_my_subscription'?{estado:'active',plan:'anual'}:null,error:name==='set_delegate_permissions'?{message:'No hay cuenta delegate, usa PIN'}:null});},channel:()=>({on(){return this;},subscribe(){return this;}}),removeChannel:async()=>{}};
  settings.theme={accentColor:'#126789',views:{}};window.testFailReads=sessionStorage.getItem('test.failReads')==='true';globalThis.__cbSupabaseClient=client;globalThis.supabase={createClient:()=>client};
 },{id,settings});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text().slice(0,600));});
 await page.goto('https://miguelperezh.github.io/campobase/');await page.waitForFunction(()=>window.__campobase?.state.settings.delegatePin==='5678',null,{timeout:10000});
 const enter=async(pin,role)=>{if(!await page.locator('#auth-form input[name=pin]').isVisible())await page.locator('#saas-local-pin-btn').evaluate(el=>el.click());await page.locator('#auth-form input[name=pin]').waitFor({state:'visible',timeout:4000}).catch(async e=>{console.log(await page.evaluate(()=>({role:window.__campobase.state.role,open:document.querySelector('#auth-dialog').open,body:document.body.className,srole:sessionStorage.getItem('campobase.sessionRole'),grole:window.__campobaseRole,localForm:document.querySelector('#auth-form').className,saas:document.querySelector('#saas-auth-shell').className})));throw e;});await page.locator('#auth-form input[name=pin]').fill(pin);await page.locator('#auth-form').evaluate(f=>f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));await page.waitForFunction(r=>window.__campobase.state.role===r,role,{timeout:10000}).catch(async e=>{console.log(await page.evaluate(()=>({role:window.__campobase.state.role,err:document.querySelector('#auth-error').textContent,cloud:window.__campobase.state.cloudError,body:document.body.className})));throw e;});};
 const assertSaved=async(role)=>{
  await page.waitForFunction(role=>window.__campobase?.state.role===role,role,{timeout:15000});
  const saved=await page.evaluate(()=>({role:window.__campobase.state.role,sessions:window.__campobase.state.trainingSessions.map(s=>[s.id,s.completed]),attendance:window.__campobase.state.trainings.map(t=>t.sessionId),theme:window.__campobase.state.settings.theme.accentColor}));
  assert.equal(saved.role,role);assert.deepEqual(saved.sessions.filter(x=>x[0]!=='pending').map(x=>x[1]),[true,true]);assert.deepEqual(saved.attendance.sort(),['closed','completed']);assert.equal(saved.theme,'#126789');
 };
 const update=async(role,fail=false)=>{
  const id=role==='owner'?'manual-refresh':'cb-delegate-refresh-btn';const button=page.locator('#'+id);await button.waitFor({state:'visible'});const oldUrl=page.url();
  await page.evaluate(fail=>{window.testFailReads=fail;sessionStorage.setItem('test.failReads',String(fail));},fail);
  await button.click();await page.waitForFunction(({id,fail})=>{const b=document.getElementById(id);return b&&!b.disabled&&(fail?b.title.includes('Red de prueba'):b.title==='Datos actualizados');},{id,fail},{timeout:15000});
  assert.equal(page.url(),oldUrl);await assertSaved(role);
 };
 const entryStart=Date.now();await enter('1234','owner');await assertSaved('owner');console.log('Owner entry ms',Date.now()-entryStart);
 await page.evaluate(()=>window.__campobase.showView('sesiones'));await page.waitForSelector('#sessions-list [data-session-id="closed"].is-completed',{state:'attached'});assert.equal(await page.locator('#exercises-list .exercise-card').count(),0,'Catálogo oculto no se construye al entrar');
 await update('owner');await update('owner',true);
 await page.reload();await assertSaved('owner');assert.equal(await page.locator('#sessions-list [data-session-id="closed"].is-completed').count(),1);
 await update('owner');await page.locator('#logout').click();await enter('5678','delegate');await assertSaved('delegate');
 await update('delegate');await page.setViewportSize({width:390,height:844});await update('delegate',true);await page.reload();await assertSaved('delegate');await update('delegate');
 await page.locator('#cb-delegate-logout-btn').click();await enter('1234','owner');await assertSaved('owner');console.log('PASS real buttons, slow network/failures, reload, saved sessions/attendance/theme, desktop/mobile');
 assert.equal(await page.evaluate(()=>sessionStorage.getItem('test.signedOut')),null,'PIN logout must preserve cloud connection');assert.equal(remoteWrites,0);assert.deepEqual(errors,[]);console.log('PASS sin escrituras remotas ni errores de JavaScript');
}finally{await browser?.close();}
