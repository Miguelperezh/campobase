import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {pathToFileURL} from 'node:url';

const runtimeModule=process.env.PLAYWRIGHT_MODULE || path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs');
const {chromium}=await import('playwright-core').catch(()=>import(pathToFileURL(runtimeModule).href));
const root=path.resolve(process.env.CAMPOBASE_PREVIEW_ROOT || '.');
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN || (process.platform==='darwin'?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined),headless:true});

async function openCampo(width,{delegate=false}={}) {
 const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'}),page=await context.newPage(),errors=[],remote=[],loaded=[];
 await context.addInitScript(({delegate})=>{
  // Fresh profile, synthetic SDK and synthetic server. Every external request is
  // blocked separately below; the real cloud adapter and all DOM modules run.
  const key='pilot.campo.server',logKey='pilot.campo.log';
  const tables={players:'jugadores',callups:'convocatorias',matches:'partidos',trainings:'asistencias',settings:'configuracion'};
  if(!localStorage.getItem(key)){
   const rows={};
   for(const name of ['A','B']){
    const owner=`owner-${name}`;
    const payloads={players:[{id:'same-player',name:`Jugador ${name}`,number:'7',positions:['Central']}],callups:[],
     matches:[{id:'same-match',opponent:`Rival ${name}`,date:'2099-10-23T12:00',status:'planned',goalsFor:null,goalsAgainst:null,comments:`Partido ${name}`,callupId:'keep-callup'}],
     trainings:[{id:'attendance-shared',kind:'training',sessionId:'same-session',date:'2099-10-23',createdAt:123,updatedAt:124,customField:`Conservar ${name}`,notes:`Anterior ${name}`,attendance:[{playerId:'same-player',status:'present',arrivalTime:'',note:''}]}],
     settings:[{id:'main',teamName:`Equipo ${name}`,theme:{},delegatePermissions:['modo-campo','asistencia','sesiones','calendario']},
      {id:'same-session',recordType:'trainingSession',name:`Entreno ${name}`,date:'2099-10-23T18:00',status:'planned',blocks:[{exerciseId:'keep-exercise',duration:12,notes:'Conservar bloque'}],privateNote:`Sesión ${name}`} ]};
    rows[owner]=Object.fromEntries(Object.entries(payloads).map(([store,list])=>[tables[store],list.map(payload=>({user_id:owner,id:payload.id,payload,updated_at:124,deleted_at:null}))]));
   }
   localStorage.setItem(key,JSON.stringify(rows));localStorage.setItem(logKey,'[]');
   localStorage.setItem('campobase.saasUserId',delegate?'delegate-A':'owner-A');
   sessionStorage.setItem('campobase.sessionRole',delegate?'delegate':'owner');
  }
  const state=window.__pilotCampo={rows:JSON.parse(localStorage.getItem(key)),log:JSON.parse(localStorage.getItem(logKey)),gate:null,held:false,release:null,deny:false,restricted:false};
  const actor=()=>localStorage.getItem('campobase.saasUserId');
  const owner=()=>actor().replace(/^delegate-/,'owner-');
  const persist=()=>{localStorage.setItem(key,JSON.stringify(state.rows));localStorage.setItem(logKey,JSON.stringify(state.log));};
  state.persist=persist;
  const log=entry=>{state.log.push(structuredClone(entry));persist();};
  async function hold(kind){if(state.gate===kind){state.gate=null;state.held=true;await new Promise(resolve=>state.release=resolve);}}
  function failure(message='Permiso de asistencia revocado.',code='CAMPOBASE_PERMISSION_DENIED'){
   return {error:{context:{status:403,clone:()=>({json:async()=>({message,code})})}}};
  }
  const sdk={
   auth:{getSession:async()=>({data:{session:{user:{id:actor(),app_metadata:{}}}}})},
   rpc:async(name,args)=>{
    if(name==='mi_equipo_contexto'){
     const id=actor(),data={team_id:'team-'+owner(),data_owner_user_id:owner(),membership_role:id.startsWith('delegate-')?'delegate':'coach'};
     await hold('context');return {data};
    }
    if(name!=='owner_sync_upsert')throw new Error('Unexpected RPC '+name);
    await hold('owner-write');
    log({transport:'owner-attempt',actor:actor(),args});
    if(args.p_expected_user_id!==actor())return {error:{message:'La identidad ha cambiado.',code:'28000'}};
    if(actor().startsWith('delegate-'))return {error:{message:'Delegado sin autorización REST.'}};
    const rows=state.rows[owner()][tables[args.p_store]],previous=rows.find(row=>row.id===args.p_record_id);
    if(previous && previous.updated_at>args.p_updated)return {data:false};
    const row={user_id:owner(),id:args.p_record_id,payload:structuredClone(args.p_payload),updated_at:args.p_updated,deleted_at:null};
    if(previous)rows.splice(rows.indexOf(previous),1,row);else rows.push(row);
    log({transport:'owner-write',actor:actor(),store:args.p_store,row});return {data:true};
   },
   from:table=>{
    const filters=[];
    const query={select(){return query;},eq(field,value){filters.push([field,value]);return query;},is(){return query;},limit(){return query;},abortSignal(){return query;},
     async then(resolve,reject){try{
      const source=owner(),rows=structuredClone(state.rows[source][table]||[]).filter(row=>filters.every(([field,value])=>row[field]===value));
      log({transport:'read',actor:actor(),table,filters});await hold('read-'+table);return resolve({data:rows});
     }catch(error){return reject(error);}},
     upsert(){throw new Error('Unsafe direct REST write attempted');},delete(){throw new Error('Unsafe direct REST delete attempted');}};
    return query;
   },
   functions:{invoke:async(name,{body})=>{
    if(name!=='delegate-sync')throw new Error('Unexpected Edge function '+name);
    log({transport:'edge-attempt',actor:actor(),body});
    await hold('edge-'+body.operation);
    if(body.expectedUserId!==actor() || body.expectedOwnerUserId!==owner() || body.expectedTeamId!=='team-'+owner())return failure('La identidad ha cambiado.','CAMPOBASE_AUTH_REQUIRED');
    if(body.operation==='snapshots'){
     const snapshots=Object.fromEntries(Object.entries(tables).map(([store,table])=>[store,{records:structuredClone(state.rows[owner()][table].map(row=>row.payload)),deletedIds:[],rowCount:state.rows[owner()][table].length,restricted:store==='trainings'&&state.restricted,readOnlyMirror:true}]));
     return {data:{snapshots}};
    }
    if(state.deny)return failure();
    const mutation=body.mutation,rows=state.rows[owner()][tables[body.store]],previous=rows.find(row=>row.id===mutation.recordId);
    if(previous&&previous.updated_at>mutation.queuedAt)return {data:{applied:false}};
    const row={id:mutation.recordId,user_id:owner(),payload:structuredClone(mutation.payload),updated_at:mutation.queuedAt,deleted_at:null};
    if(previous)rows.splice(rows.indexOf(previous),1,row);else rows.push(row);
    log({transport:'edge-write',actor:actor(),body,row});return {data:{applied:true}};
   }},
   channel:()=>({on(){return this;},subscribe(){return this;}}),removeChannel:async()=>{},
  };
  window.supabase={createClient:()=>sdk};
 },{delegate});
 await context.route('**/*',async route=>{
  const request=route.request(),url=new URL(request.url());
  if(url.hostname!=='localhost'){remote.push(`${request.method()} ${url.hostname}${url.pathname}`);return route.fulfill({status:503,body:'null'});}
  const relative=decodeURIComponent(url.pathname).replace(/^\//,'')||'modo-campo-directo.html',file=path.resolve(root,relative);
  if(!file.startsWith(root+path.sep))return route.fulfill({status:404,body:''});
  loaded.push(relative);
  if(relative==='vendor/supabase.js')return route.fulfill({status:200,contentType:'text/javascript',body:'/* synthetic SDK installed before the real page */'});
  try{return route.fulfill({status:200,body:await fs.readFile(file),contentType:/\.m?js$/.test(file)?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':file.endsWith('.json')?'application/json':'application/octet-stream'});}
  catch{return route.fulfill({status:404,body:''});}
 });
 page.on('pageerror',error=>{errors.push(error.message);console.error('Campo page error:',error.stack);});
 page.on('dialog',dialog=>dialog.accept());
 await page.goto('https://localhost/modo-campo-directo.html');
 await page.locator('[data-campo-complete="session"]').first().waitFor({state:'attached'}).catch(async error=>{
  console.error(await page.evaluate(()=>({toast:document.querySelector('#toast')?.textContent,sync:document.querySelector('#sync')?.textContent,body:document.querySelector('.shell')?.textContent,log:window.__pilotCampo?.log})));throw error;
 });
 await page.waitForFunction(()=>document.querySelector('#campo-team-name')?.textContent==='Equipo A');
 assert.equal(await page.locator('#saas-auth-shell, #manual-refresh, #cb-bottom-nav, #postgame-performance-dialog').count(),0);
 assert.equal(await page.locator('.exercise-board-overlay').count(),0);
 assert.equal(await page.evaluate(()=>!!window.__campobase),false);
 return {context,page,errors,remote,loaded};
}

async function attendance(page,kind='session'){
 await page.locator(`[data-attendance-${kind}="same-${kind}"]`).first().waitFor({state:'attached'});
 await page.locator(`.bottom [data-nav="${kind==='match'?'partidos':'entrenos'}"]`).click();
 await page.locator(`#${kind==='match'?'partidos':'entrenos'} [data-attendance-${kind}="same-${kind}"]`).first().click();
 await page.locator('#campo-attendance-form').waitFor({state:'visible'});
 await page.waitForFunction(()=>document.querySelector('#campo-attendance-form button[type="submit"]')?.textContent==='Guardar asistencia');
 return page.locator('#campo-attendance-form');
}
const writes=page=>page.evaluate(()=>window.__pilotCampo.log.filter(row=>['owner-write','edge-write'].includes(row.transport)));
const server=page=>page.evaluate(()=>structuredClone(window.__pilotCampo.rows));
async function waitToast(page,part){await page.waitForFunction(value=>document.querySelector('#toast')?.textContent.includes(value),part);}
async function assertClean(fixture){
 assert.deepEqual(fixture.errors,[]);
 assert.ok(fixture.loaded.includes('js/supabase-client.js'),'actual canonical adapter was loaded');
 assert.equal(fixture.loaded.some(file=>/saas-auth-ui|promo-codes|billing-manager|legacy-data-link-guard|cloud-ui-bootstrap|session-planner-ui|runtime-refresh|today-dashboard/.test(file)),false);
 assert.equal(fixture.remote.some(request=>!request.includes('fonts.googleapis.com')),false,'no data service request escaped the synthetic SDK');
 await fixture.context.close();
}

try{
 for(const width of [1440,390]){
  const owner=await openCampo(width),{page}=owner,before=await server(page);
  let form=await attendance(page);
  await form.locator('[data-att-status]').selectOption('late');
  await form.locator('[data-att-hour]').selectOption('19');await form.locator('[data-att-minute]').selectOption('05');
  await form.locator('[data-att-note]').fill('Llega del colegio');await form.locator('[data-att-record-notes]').fill('Asistencia confirmada');
  let reloaded=page.waitForEvent('load');
  await form.locator('[type="submit"]').click();await waitToast(page,'guardada y sincronizada');
  let recorded=await writes(page);assert.equal(recorded.length,1);assert.equal(recorded[0].transport,'owner-write');
  const saved=recorded[0].row.payload;
  assert.equal(saved.id,'attendance-shared');assert.equal(saved.createdAt,123);assert.equal(saved.customField,'Conservar A');
  assert.deepEqual(saved.attendance,[{playerId:'same-player',status:'late',arrivalTime:'19:05',note:'Llega del colegio'}]);
  assert.equal(saved.notes,'Asistencia confirmada');
  await reloaded;
  form=await attendance(page);assert.equal(await form.locator('[data-att-note]').inputValue(),'Llega del colegio');
  await page.locator('[data-close-overlay]').first().click();
  reloaded=page.waitForEvent('load');
  await page.locator('#entrenos [data-campo-complete="session"][data-id="same-session"]').click();await waitToast(page,'Sesión marcada');
  await reloaded;
  await page.locator('[data-campo-complete="match"][data-id="same-match"]').first().waitFor({state:'attached'});
  await page.locator('.bottom [data-nav="partidos"]').click();
  reloaded=page.waitForEvent('load');
  await page.locator('#partidos [data-campo-complete="match"][data-id="same-match"]').click();await waitToast(page,'Partido marcado');
  await reloaded;
  const after=await server(page),closedSession=after['owner-A'].configuracion.find(row=>row.id==='same-session').payload,closedMatch=after['owner-A'].partidos[0].payload;
  assert.equal(closedSession.status,'closed');assert.deepEqual(closedSession.blocks,before['owner-A'].configuracion[1].payload.blocks);assert.equal(closedSession.privateNote,'Sesión A');
  assert.equal(closedMatch.status,'finished');assert.equal(closedMatch.comments,'Partido A');assert.equal(closedMatch.goalsFor,null);assert.equal(closedMatch.callupId,'keep-callup');
  assert.deepEqual(after['owner-B'],before['owner-B']);
  assert.equal((await writes(page)).length,3);await assertClean(owner);

  const delegated=await openCampo(width,{delegate:true}),delegatePage=delegated.page;
  form=await attendance(delegatePage,'match');await form.locator('[data-att-note]').fill('Nota del delegado');
  reloaded=delegatePage.waitForEvent('load');
  await form.locator('[type="submit"]').click();await waitToast(delegatePage,'guardada y sincronizada');
  recorded=await writes(delegatePage);assert.equal(recorded.length,1);assert.equal(recorded[0].transport,'edge-write');
  assert.equal(recorded[0].body.expectedUserId,'delegate-A');assert.equal(recorded[0].body.expectedOwnerUserId,'owner-A');assert.equal(recorded[0].body.store,'trainings');
  await reloaded;
  await delegatePage.locator('[data-campo-complete="session"]').first().waitFor({state:'attached'});
  await delegatePage.locator('.bottom [data-nav="entrenos"]').click();
  await delegatePage.locator('#entrenos [data-campo-complete="session"]').click();await waitToast(delegatePage,'Solo el titular');
  assert.equal((await writes(delegatePage)).length,1);
  // A stale owner flag on the device cannot override server membership.
  await delegatePage.evaluate(()=>sessionStorage.setItem('campobase.sessionRole','owner'));
  await delegatePage.locator('#entrenos [data-campo-complete="session"]').click();await waitToast(delegatePage,'Esta cuenta no tiene permiso');
  assert.equal((await writes(delegatePage)).length,1);
  await delegatePage.evaluate(()=>sessionStorage.setItem('campobase.sessionRole','delegate'));
  form=await attendance(delegatePage);await form.locator('[data-att-note]').fill('Borrador que se conserva');
  await delegatePage.evaluate(()=>window.__pilotCampo.deny=true);
  await form.locator('[type="submit"]').click();await waitToast(delegatePage,'revocado');
  assert.equal(await form.locator('[data-att-note]').inputValue(),'Borrador que se conserva');assert.equal(await form.locator('[type="submit"]').isEnabled(),true);assert.equal((await writes(delegatePage)).length,1);
  await delegatePage.evaluate(()=>{window.__pilotCampo.deny=false;window.__pilotCampo.restricted=true;});
  await form.locator('[type="submit"]').click();await waitToast(delegatePage,'No tienes permiso');assert.equal((await writes(delegatePage)).length,1);
  await assertClean(delegated);

  const held=await openCampo(width),heldPage=held.page;
  form=await attendance(heldPage);await form.locator('[data-att-note]').fill('Privado A retenido');
  const heldBefore=await server(heldPage);
  await heldPage.evaluate(()=>window.__pilotCampo.gate='read-configuracion');
  await form.locator('[type="submit"]').click();await heldPage.waitForFunction(()=>window.__pilotCampo.held);
  await heldPage.evaluate(()=>{localStorage.setItem('campobase.saasUserId','owner-B');window.__pilotCampo.release();});
  await waitToast(heldPage,'cuenta o el acceso han cambiado');assert.deepEqual(await server(heldPage),heldBefore);assert.deepEqual(await writes(heldPage),[]);
  // Reusing a form opened in A after a switch to B fails before any cloud write.
  await form.locator('[type="submit"]').click();await waitToast(heldPage,'cuenta o el acceso han cambiado');assert.deepEqual(await writes(heldPage),[]);
  await assertClean(held);

  const stale=await openCampo(width),stalePage=stale.page;
  form=await attendance(stalePage);await form.locator('[data-att-note]').fill('Borrador antiguo');
  await stalePage.evaluate(()=>{
   const row=window.__pilotCampo.rows['owner-A'].asistencias[0];row.updated_at=Date.now()+60000;row.payload.notes='Versión remota posterior';window.__pilotCampo.persist();
  });
  const staleBefore=await server(stalePage);
  await form.locator('[type="submit"]').click();await waitToast(stalePage,'otro dispositivo');
  assert.deepEqual(await writes(stalePage),[]);assert.deepEqual(await server(stalePage),staleBefore);assert.equal(await form.locator('[data-att-note]').inputValue(),'Borrador antiguo');assert.equal(await form.locator('[type="submit"]').isEnabled(),true);
  await assertClean(stale);
  console.log(JSON.stringify({width,owner:'attendance/reload/session and match completion',delegate:'canonical Edge write/owner-only completion/revocation/restricted snapshot',isolation:'held A→B and previously opened A form rejected',stale:'remote version kept, draft retained',pageErrors:0,realDataWrites:0}));
 }
}finally{await browser.close();}
