import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const base=process.env.CAMPOBASE_TEST_URL || 'http://127.0.0.1:4221';
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN,headless:true,args:['--no-sandbox']});
try {
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('dialog',d=>d.accept());
  await page.route('**/*',route=>{
   if(/\/js\/(completed-events-ui|session-visual-planner|session-planner-ui)\.js/.test(route.request().url()))return route.fulfill({contentType:'application/javascript',body:'export {};'});
   if(new URL(route.request().url()).hostname!=='127.0.0.1')return route.abort();
   return route.continue();
  });
  await page.goto(base+'/tests/fixtures/postgame-sync.html');await page.waitForFunction(()=>window.fixtureReady);
  const seeded=await page.evaluate(()=>fixture.seedPlan());
  await page.locator('.record-match-postgame').click();
  const dialog=page.locator('#postgame-performance-dialog');await dialog.waitFor({state:'visible'});
  assert.equal(await dialog.locator('.postgame-player-row').count(),14);
  assert.equal(await dialog.locator('[data-keeper-conceded]').count(),2);
  assert.equal(await page.locator('#postgame-goals-for').inputValue(),'');
  assert.equal(await dialog.locator('[data-keeper-conceded="plan-p8"]').inputValue(),'');
  await dialog.locator('[data-use-saved-plan]').click();
  assert.equal(await dialog.locator('[data-player-id="plan-p14"] [data-postgame=minutes]').inputValue(),'35');
  assert.equal((await page.evaluate(()=>fixture.getOne('matches','plan-match'))).minuteTotals,undefined);
  assert.equal(await page.evaluate(()=>document.querySelector('#postgame-performance-dialog').scrollWidth<=document.querySelector('#postgame-performance-dialog').clientWidth+1),true);
  await page.locator('#postgame-goals-for').fill('1');await page.locator('#postgame-goals-against').fill('15');
  await dialog.locator('[data-keeper-conceded="plan-p1"]').fill('8');await dialog.locator('[data-keeper-conceded="plan-p8"]').fill('7');
  await dialog.locator('[data-add-postgame-goal]').click();await dialog.locator('[data-goal=player]').selectOption('plan-p3');await dialog.locator('[data-goal=assistant]').selectOption('plan-p4');await dialog.locator('[data-goal=type]').selectOption('freekick');
  await dialog.locator('[type=submit]').click();await page.waitForFunction(()=>!document.querySelector('#postgame-performance-dialog').open);
  let result=await page.evaluate(()=>fixture.getOne('matches','plan-match'));
  assert.equal(result.status,'finished');assert.equal(result.completed,true);assert.equal(result.minuteSource.kind,'saved-plan');
  assert.equal(result.substitutionEvents.length,1);assert.equal(result.minuteTotals['plan-p14'],2100);assert.equal(result.ratings['plan-p1'],4);
  assert.equal(result.goals[0].assistantId,'plan-p4');assert.equal(result.goals[0].goalType,'freekick');assert.deepEqual(result.keeperGoalsAgainst,{'plan-p1':8,'plan-p8':7});
  assert.equal((await page.evaluate(()=>fixture.getOne('settings','live'))).timer,null);
  assert.equal((await page.evaluate(()=>fixture.getOne('callups','plan-callup'))).completed,true);
  assert.deepEqual(await page.evaluate(()=>fixture.getOne('settings','plan-prep')),seeded.prep);
  // Reopening/reapplying is idempotent and does not clear another match's live state.
  await page.evaluate(()=>fixture.putBatch({settings:[{id:'live',timer:{matchId:'other-match',marker:'keep'}}]}));
  await page.locator('.record-match-postgame').click();await dialog.locator('[data-use-saved-plan]').click();await dialog.locator('[type=submit]').click();await page.waitForFunction(()=>!document.querySelector('#postgame-performance-dialog').open);
  result=await page.evaluate(()=>fixture.getOne('matches','plan-match'));assert.equal(result.substitutionEvents.length,1);
  assert.equal((await page.evaluate(()=>fixture.getOne('settings','live'))).timer.marker,'keep');
  // Remote plan changes are detected and leave the user's open form intact.
  await page.locator('.record-match-postgame').click();await dialog.locator('[data-use-saved-plan]').click();
  await page.evaluate(async()=>{const prep=await fixture.getOne('settings','plan-prep');await fixture.putBatch({settings:[{...prep,moments:prep.moments.map(m=>({...m,minute:30}))}]});});
  await dialog.locator('[type=submit]').click();await page.waitForFunction(()=>document.querySelector('.postgame-performance-error')?.textContent.includes('han cambiado'));
  assert.equal(await dialog.locator('[data-player-id="plan-p14"] [data-postgame=minutes]').inputValue(),'35');
  assert.equal((await page.evaluate(()=>fixture.getOne('matches','plan-match'))).minuteTotals['plan-p14'],2100);
  await dialog.locator('[data-close-postgame]').first().click();await page.locator('.record-match-postgame').click();
  await page.evaluate(()=>fixture.secondDevice());
  if(await dialog.isVisible()){
   await dialog.locator('[type=submit]').click();
   await page.waitForFunction(()=>document.querySelector('.postgame-performance-error')?.textContent.includes('cuenta ha cambiado'));
  }
  assert.equal((await page.evaluate(()=>fixture.getOne('matches','plan-match'))).minuteTotals['plan-p14'],2100);
  assert.deepEqual(errors,[]);await context.close();
  console.log('PASS fixture',width,'14 jugadores, ambos porteros, plan explícito, guardado repetido, conflicto y conservación de otro directo');
 }
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
  await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  await page.goto(base+'/index.html?browserPostgamePlan=1');await page.waitForFunction(()=>window.__campobase?.state);
  await page.evaluate(()=>document.querySelector('#auth-demo-btn')?.click());await page.waitForFunction(()=>window.__campobase.state.role==='demo');
  await page.evaluate(async()=>{
   const db=await import('/js/db.js'),app=window.__campobase;
   const ids=Array.from({length:14},(_,i)=>'offline-'+(i+1));
   const team=ids.slice(0,7).map((playerId,i)=>({playerId,pos:i===0?'Portero':'Puesto '+i}));
   const second=ids.slice(7).map((playerId,i)=>({playerId,pos:i===0?'Portero':'Puesto '+i}));
   await db.putBatch({players:ids.map((id,i)=>({id,name:'Jugador aislado '+i,number:String(i+1),positions:[i===0||i===7?'Portero':'Central'],active:true})),matches:[{id:'offline-match',callupId:'offline-callup',opponent:'Rival sin directo',date:'2099-10-18T12:00:00',status:'planned',type:'friendly',format:'F7'}],callups:[{id:'offline-callup',matchId:'offline-match',opponent:'Rival sin directo',date:'2099-10-18',format:'F7',availableIds:ids}],settings:[{id:'offline-prep',recordType:'preparacion',matchId:'offline-match',team,firstKeeper:ids[0],secondKeeper:ids[7],delegateShown:true,moments:[{id:'half',minute:35,team:second}]}]});
   await app.refresh();app.showView('calendario');app.renderMatches();
  });
  const card=page.locator('.match-card[data-match-id="offline-match"]');
  await card.locator('summary').first().click();await page.evaluate(()=>window.__campobase.renderMatches());await card.locator('.record-match-postgame').click();
  const dialog=page.locator('#postgame-performance-dialog');await dialog.waitFor({state:'visible'});
  assert.equal(await dialog.locator('.postgame-player-row').count(),14);
  await page.screenshot({path:`/tmp/campobase-053-dialog-${width}.png`});
  await dialog.locator('[data-use-saved-plan]').click();await page.locator('#postgame-goals-for').fill('0');await page.locator('#postgame-goals-against').fill('0');
  await dialog.locator('[data-keeper-conceded]').first().fill('0');await dialog.locator('[data-keeper-conceded]').last().fill('0');
  await dialog.locator('[type=submit]').click();await page.waitForFunction(()=>!document.querySelector('#postgame-performance-dialog').open);
  await page.evaluate(()=>{window.__campobase.showView('partido');window.__campobase.renderLive();});
  assert.equal(await page.locator('#live-select option[value="offline-match"]').count(),0);
  assert.notEqual(await page.evaluate(()=>window.__campobase.state.timer?.matchId),'offline-match');
  await page.evaluate(()=>{const app=window.__campobase;app.state.role='delegate';app.renderDelegate();});
  assert.notEqual(await page.evaluate(()=>window.__campobase.state.timer?.matchId),'offline-match');
  // Calendar completion must also clear a live match without loading its saved plan again.
  await page.evaluate(async()=>{
   const app=window.__campobase,db=await import('/js/db.js');app.state.role='demo';
   const match=await db.getOne('matches','offline-match');await db.putBatch({matches:[{...match,id:'calendar-close',status:'planned',completed:false,closedAt:null,finishedAt:null,minuteTotals:{},playedSeconds:0,ratings:{},goals:[],goalsFor:null,goalsAgainst:null,callupId:'close-callup'}],callups:[{id:'close-callup',matchId:'calendar-close',format:'F7',availableIds:[]}],settings:[{id:'live',timer:{matchId:'calendar-close',phase:'ready'}}]});
   await app.refresh();await app.toggleMatchCompleted('calendar-close');app.renderLive();app.state.role='delegate';app.renderDelegate();
  });
  assert.notEqual(await page.evaluate(()=>window.__campobase.state.timer?.matchId),'calendar-close');
  assert.equal((await page.evaluate(async()=>(await import('/js/db.js')).getOne('settings','live'))).timer,null);
  await page.evaluate(async()=>{
   const app=window.__campobase,db=await import('/js/db.js');app.state.role='demo';
   await app.toggleCallupCompleted('close-callup');
   const match=await db.getOne('matches','calendar-close');
   if(match.completed || match.finishedAt || match.closedAt)throw new Error('No se ha reabierto la convocatoria.');
   await db.putBatch({matches:[{...match,status:'in_progress',goalsFor:1,minuteTotals:{'offline-1':300}}],settings:[{id:'live',timer:{matchId:match.id,elapsed:300,phase:'first_half',onField:['offline-1'],initialOnField:['offline-1'],events:[],updatedAt:Date.now(),details:{goalsFor:1,goalsAgainst:0,goals:[],incidents:[]}}}]});
   await app.refresh();if(app.state.timer?.matchId!==match.id)throw new Error('Un gol o minutos han cerrado el directo.');
   await db.put('matches',{...await db.getOne('matches',match.id),completed:true});await app.refresh();app.renderLive();app.state.role='delegate';app.renderDelegate();
   if(app.state.timer?.matchId===match.id)throw new Error('El delegado conserva un partido marcado realizado.');
  });
  assert.deepEqual(errors,[]);await context.close();console.log('PASS app completa',width,'Calendario, registro real por formulario, retirada del vivo entrenador y delegado, cierre manual');
 }
}finally{await browser.close();}
