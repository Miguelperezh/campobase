import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const base=process.env.CAMPOBASE_TEST_URL || 'http://127.0.0.1:4225';
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN,headless:true,args:['--no-sandbox']});
try {
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  await page.goto(base+'/index.html?sessionDelete=1');await page.waitForFunction(()=>window.__campobase?.state);
  await page.evaluate(()=>document.querySelector('#auth-demo-btn')?.click());await page.waitForFunction(()=>window.__campobase.state.role==='demo');
  const seed=await page.evaluate(async()=>{
   const db=await import('/js/db.js'),app=window.__campobase;
   const own={...app.state.exercises[0],id:'delete-own-exercise',recordType:'exercise',name:'Ejercicio conservado',userCreated:true};
   const make=(id,date,completed=false)=>({id,recordType:'trainingSession',name:'Sesión '+id,date,time:'17:30',pitch:'Campo conservado',targetDuration:60,totalDuration:15,completed,blocks:[{exerciseId:own.id,duration:15,type:'main',notes:'Nota'}]});
   const sessions=[make('delete-pending','2099-01-10'),make('delete-completed','2099-01-11',true),make('delete-sibling','2099-01-10'),make('delete-legacy','2099-01-12')];
   const a=(id,date,extra={})=>({id,date,kind:'training',attendance:[{playerId:'delete-player',status:'present'}],...extra});
   const attendance=[a('a-pending','2099-01-10',{sessionId:'delete-pending'}),a('a-completed','2099-01-11',{sessionId:'delete-completed'}),a('a-sibling','2099-01-10',{sessionId:'delete-sibling'}),a('a-ambiguous','2099-01-10'),a('a-legacy','2099-01-12'),a('a-match','2099-01-12',{kind:'match',matchId:'delete-keep-match'}),a('a-old-match','2099-01-12',{matchId:'delete-keep-match'}),a('a-unknown','')];
   const player={id:'delete-player',name:'Jugador conservado',number:'1',positions:['Portero'],fatherPhone:'600123123',notes:'Mis notas'};
   const match={id:'delete-keep-match',date:'2099-01-13',opponent:'Partido conservado',status:'planned',type:'friendly'};
   await db.putBatch({settings:[...sessions,own],players:[player],matches:[match],trainings:attendance});
   await app.refresh();app.showView('sesiones');app.renderTrainingSessions();
   return {sessions,attendance,own,player,match,main:await db.getOne('settings','main')};
  });
  const read=(store,id)=>page.evaluate(async({store,id})=>(await import('/js/db.js')).getOne(store,id),{store,id});
  const pending=page.locator('.session-card[data-session-id="delete-pending"]');
  assert.equal(await pending.locator('.delete-session:visible').count(),1);
  assert.equal(await pending.locator('.cbx-session-actions-row > button').count(),5);
  await pending.locator('.delete-session').click();await page.locator('#confirmation-dialog').waitFor({state:'visible'});
  assert.match(await page.locator('#confirmation-message').textContent(),/Sesión delete-pending/);
  await page.locator('#confirmation-cancel').click();assert.deepEqual(await read('settings','delete-pending'),seed.sessions[0]);assert.deepEqual(await read('trainings','a-pending'),seed.attendance[0]);
  // A change while confirmation is open must keep the latest session and attendance.
  await pending.locator('.delete-session').click();await page.locator('#confirmation-dialog').waitFor({state:'visible'});
  await page.evaluate(async()=>{const db=await import('/js/db.js'),s=await db.getOne('settings','delete-pending');await db.put('settings',{...s,name:'Nombre actualizado'});});
  await page.locator('#confirmation-accept').click();await page.waitForFunction(()=>document.querySelector('#toast')?.textContent.includes('ha cambiado'));
  assert.equal((await read('settings','delete-pending')).name,'Nombre actualizado');assert.ok(await read('trainings','a-pending'));
  await page.evaluate(async()=>{await window.__campobase.refresh(true);window.__campobase.showView('sesiones');});
  // Clicking a child of the button follows the same controller.
  await pending.locator('.delete-session').evaluate(b=>b.innerHTML='<span>Borrar sesión</span>');await pending.locator('.delete-session span').click();
  await page.locator('#confirmation-accept').click();await page.waitForFunction(()=>!document.querySelector('.session-card[data-session-id="delete-pending"]'));
  assert.equal(await read('settings','delete-pending'),undefined);assert.equal(await read('trainings','a-pending'),undefined);assert.deepEqual(await read('trainings','a-sibling'),seed.attendance[2]);assert.deepEqual(await read('trainings','a-ambiguous'),seed.attendance[3]);
  const completed=page.locator('.session-card[data-session-id="delete-completed"]');
  await completed.evaluate(el=>{for(let p=el.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});await page.evaluate(()=>window.__campobase.renderTrainingSessions());
  assert.equal(await completed.locator('.delete-session:visible').count(),1);
  await completed.locator('.view-session').first().click();await page.locator('#session-detail-dialog').waitFor({state:'visible'});await page.locator('#session-detail-body .session-visual-detail').waitFor({state:'visible'});
  await page.locator('#session-detail-dialog .delete-session').click();await page.locator('#confirmation-cancel').click();assert.equal(await page.locator('#session-detail-dialog').evaluate(d=>d.open),true);
  await page.locator('#session-detail-dialog .delete-session').click();await page.locator('#confirmation-accept').click();await page.waitForFunction(()=>!document.querySelector('#session-detail-dialog').open);
  assert.equal(await read('settings','delete-completed'),undefined);assert.equal(await read('trainings','a-completed'),undefined);
  await page.evaluate(()=>{window.__campobase.showView('calendario');window.__campobase.renderMatches();});
  const calendar=page.locator('.cbx-calendar-training[data-training-id="delete-legacy"]');await calendar.locator('summary').click();await page.evaluate(()=>window.__campobase.renderMatches());
  await calendar.locator('.delete-session').click();await page.locator('#confirmation-accept').click();await page.waitForFunction(()=>!document.querySelector('[data-training-id="delete-legacy"]'));
  assert.equal(await read('settings','delete-legacy'),undefined);assert.equal(await read('trainings','a-legacy'),undefined);assert.deepEqual(await read('trainings','a-match'),seed.attendance[5]);assert.deepEqual(await read('trainings','a-old-match'),seed.attendance[6]);assert.deepEqual(await read('trainings','a-unknown'),seed.attendance[7]);
  assert.deepEqual(await read('settings','delete-sibling'),seed.sessions[2]);assert.deepEqual(await read('settings',seed.own.id),seed.own);assert.deepEqual(await read('settings','main'),seed.main);assert.deepEqual(await read('matches',seed.match.id),seed.match);
  const player=await read('players','delete-player');for(const key of ['name','number','fatherPhone','notes','positions'])assert.deepEqual(player[key],seed.player[key]);
  // Delegates receive no new delete permission, including a forged button.
  await page.evaluate(()=>{const app=window.__campobase;app.state.role='delegate';app.renderTrainingSessions();document.body.insertAdjacentHTML('beforeend','<button id="forged-delete" class="delete-session" data-id="delete-sibling">Borrar</button>');});
  assert.equal(await page.locator('#sessions-list .delete-session').count(),0);await page.locator('#forged-delete').click();assert.equal(await page.locator('#confirmation-dialog').evaluate(d=>d.open),false);assert.deepEqual(await read('settings','delete-sibling'),seed.sessions[2]);
  assert.deepEqual(errors,[]);await context.close();console.log('PASS',width,'borrado visible, cancelar, conflicto, pendientes/realizadas, ficha y calendario; biblioteca, datos ajenos y permisos conservados');
 }
}finally{await browser.close();}
