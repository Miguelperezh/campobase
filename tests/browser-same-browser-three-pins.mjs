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
  const tables={jugadores:[{user_id:id,id:player.id,payload:player,updated_at:1,deleted_at:null}],configuracion:[{user_id:id,id:'main',payload:settings,updated_at:1,deleted_at:null}],perfiles:[{id,role:'coach',full_name:'Titular de prueba'}],partidos:[],convocatorias:[],asistencias:[]};window.testCloud=tables;
  function query(table){let single=false,filters=[],limit=null,op=null,payload=null;const q={select(){return q;},eq(k,v){filters.push([k,v]);return q;},is(){return q;},order(){return q;},limit(v){limit=v;return q;},abortSignal(){return q;},maybeSingle(){single=true;return q;},single(){single=true;return q;},upsert(v){op='upsert';payload=v;return q;},then(resolve,reject){return Promise.resolve().then(()=>{if(op){const rows=tables[table]||=[];const i=rows.findIndex(x=>x.id===payload.id);if(i<0)rows.push(payload);else rows[i]=payload;if(table==='configuracion'&&payload.id==='main')sessionStorage.setItem('test.cloudSettings',JSON.stringify(payload.payload));return {data:null,error:null};}let rows=(tables[table]||[]).filter(x=>filters.every(([k,v])=>x[k]===v));if(limit!==null)rows=rows.slice(0,limit);return {data:single?(rows[0]||null):rows,error:null};}).then(resolve,reject);}};return q;}
  const client={auth:{getSession:async()=>({data:{session:sessionStorage.getItem('test.signedOut')?null:{user:{id,user_metadata:{}}}}}),signOut:async()=>{sessionStorage.setItem('test.signedOut','1');return {error:null};},onAuthStateChange(){return {data:{subscription:{unsubscribe(){}}}};}},functions:{},from:query,rpc:async(name)=>({data:name==='mi_equipo_contexto'?team:name==='get_my_subscription'?{estado:'active',plan:'anual'}:null,error:name==='set_delegate_permissions'?{message:'No hay cuenta delegate, usa PIN'}:null}),channel:()=>({on(){return this;},subscribe(){return this;}}),removeChannel:async()=>{}};
  globalThis.__cbSupabaseClient=client;globalThis.supabase={createClient:()=>client};
 },{id,settings});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text().slice(0,600));});
 await page.goto('https://miguelperezh.github.io/campobase/');await page.waitForFunction(()=>window.__campobase?.state.settings.delegatePin==='5678',null,{timeout:10000});
 const enter=async(pin,role)=>{if(!await page.locator('#auth-form input[name=pin]').isVisible())await page.locator('#saas-local-pin-btn').evaluate(el=>el.click());await page.locator('#auth-form input[name=pin]').waitFor({state:'visible',timeout:4000}).catch(async e=>{console.log(await page.evaluate(()=>({role:window.__campobase.state.role,open:document.querySelector('#auth-dialog').open,body:document.body.className,srole:sessionStorage.getItem('campobase.sessionRole'),grole:window.__campobaseRole,localForm:document.querySelector('#auth-form').className,saas:document.querySelector('#saas-auth-shell').className})));throw e;});await page.locator('#auth-form input[name=pin]').fill(pin);await page.locator('#auth-form').evaluate(f=>f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));await page.waitForFunction(r=>window.__campobase.state.role===r,role,{timeout:10000}).catch(async e=>{console.log(await page.evaluate(()=>({role:window.__campobase.state.role,err:document.querySelector('#auth-error').textContent,cloud:window.__campobase.state.cloudError,body:document.body.className})));throw e;});};
 await enter('1234','owner');await page.waitForSelector('#cb-delegate-permissions-form',{state:'attached',timeout:10000});
 const refreshDelegate=async()=>{
  const button=page.locator('#cb-delegate-refresh-btn');await button.waitFor({state:'visible'});assert.equal(await button.textContent(),'Actualizar');
  const oldUrl=page.url();await Promise.all([page.waitForURL(url=>url.href!==oldUrl&&url.searchParams.has('_cb'),{waitUntil:'load'}),button.click()]);
  await page.waitForFunction(()=>window.__campobase?.state.role==='delegate',null,{timeout:15000});
  assert.equal(await page.locator('#cb-delegate-refresh-btn').isVisible(),true);
 };
 let checkedRefresh=false;
 for(const perms of [['delegado','sesiones','ejercicios'],['delegado','plantilla','tacticas'],['delegado'],['delegado','hoy','asistencia']]){
  await page.evaluate(perms=>{window.__campobase.showView('ajustes');const f=document.querySelector('#cb-delegate-permissions-form');for(const c of f.querySelectorAll('input[name=delegateViews]'))c.checked=perms.includes(c.value);f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));},perms);
  await page.waitForFunction(perms=>JSON.stringify(window.__campobase.getDelegatePermissions())===JSON.stringify(perms),perms);
  await page.locator('#logout').click();await page.reload();await page.waitForFunction(()=>window.__campobase?.state.settings.delegatePin==='5678');assert.equal(await page.evaluate(()=>window.__campobase.state.role),null);await enter('5678','delegate');await page.evaluate(async()=>{const {initTeamAccess}=await import('./js/team-access.js?v=pin-switch-1');await initTeamAccess(window.__cbSupabaseClient);});
  if(!checkedRefresh)await refreshDelegate();
  for(const view of ['plantilla','sesiones','ejercicios','tacticas','hoy','asistencia']){
   assert.equal(await page.locator('#cb-claude-sidebar [data-target-view="'+view+'"]').isVisible(),perms.includes(view),'VISIBLE '+view+' '+JSON.stringify(perms));
   await page.evaluate(view=>window.__campobase.showView(view),view);
   const active=await page.locator('.view.active').getAttribute('id');assert.equal(active===view,perms.includes(view));
  }
  await page.setViewportSize({width:390,height:844});
  for(const [mod,views] of [['equipo',['plantilla','asistencia']],['entrenos',['sesiones','ejercicios','tacticas']],['inicio',['hoy']]]){
   const button=page.locator('#cb-bottom-nav [data-module="'+mod+'"]'),allowed=views.some(x=>perms.includes(x));
   assert.equal(await button.isVisible(),allowed,'MOBILE '+mod);
   if(allowed){await button.click();assert(perms.includes(await page.locator('.view.active').getAttribute('id')));}
  }
  if(!checkedRefresh){await refreshDelegate();assert.deepEqual(await page.evaluate(()=>window.__campobase.getDelegatePermissions()),perms);checkedRefresh=true;}
  await page.setViewportSize({width:1280,height:900});
  await page.locator('#cb-delegate-logout-btn').click();await enter('1234','owner');
  await page.locator('.topbar #logout').click();await enter('9012','demo');
  await page.locator('.topbar #logout').click();await enter('1234','owner');
 }
 assert.equal(await page.evaluate(()=>sessionStorage.getItem('test.signedOut')),null,'PIN logout must preserve cloud connection');assert.equal(remoteWrites,0);assert.deepEqual(errors,[]);console.log('PASS same browser 3 PIN, actual account-permissions form, SDK adapter and navigation visible/clickable');
}finally{await browser?.close();}
