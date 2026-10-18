import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const base=process.env.CAMPOBASE_TEST_URL || 'http://127.0.0.1:4224';
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN,headless:true,args:['--no-sandbox']});
try {
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  await page.goto(base+'/index.html?matchEditAccess=1');await page.waitForFunction(()=>window.__campobase?.state);
  await page.evaluate(()=>document.querySelector('#auth-demo-btn')?.click());await page.waitForFunction(()=>window.__campobase.state.role==='demo');
  const seed=await page.evaluate(async()=>{
   const db=await import('/js/db.js'),app=window.__campobase;
   const ids=Array.from({length:14},(_,i)=>'edit-p'+(i+1));
   const team=ids.slice(0,7).map((playerId,i)=>({playerId,pos:i===0?'Portero':'Puesto '+i}));
   const prep={id:'edit-prep',recordType:'preparacion',matchId:'edit-finished',team,moments:[{id:'half',minute:35,team:ids.slice(7).map((playerId,i)=>({playerId,pos:i===0?'Portero':'Puesto '+i}))}]};
   const markers=[{status:'finished'},{status:'closed'},{status:'planned',completed:true},{status:'planned',closedAt:1},{status:'planned',finishedAt:1},{status:'planned'}];
   const matches=markers.map((marker,i)=>({id:i?'edit-state-'+i:'edit-finished',date:'2099-10-18T12:00:00',callupId:'edit-callup',opponent:'Rival editable '+i,type:'league',format:'F7',minuteTotals:Object.fromEntries(ids.map(id=>[id,2100])),ratings:{'edit-p1':3},goalsFor:1,goalsAgainst:15,keeperGoalsAgainst:{'edit-p1':8,'edit-p8':7},goals:[{id:'original',playerId:'edit-p3',assistantId:'edit-p4',second:600,note:'Nota original'}],comments:'Conservar',location:'Mi campo',...marker}));
   await db.putBatch({players:ids.map((id,i)=>({id,number:String(i+1),name:'Jugador editable '+(i+1),positions:[i===0||i===7?'Portero':'Central']})),matches,callups:[{id:'edit-callup',availableIds:ids,format:'F7'}],settings:[prep]});
   await app.refresh();app.showView('calendario');app.renderMatches();return {prep,ids,matches};
  });
  const dialog=page.locator('#postgame-performance-dialog');
  for(const match of seed.matches){
   await page.evaluate(()=>{const a=document.querySelector('#played-matches-collapsible');if(a)a.open=true;});
   const card=page.locator('.match-card[data-match-id="'+match.id+'"]');
   await card.locator('.cbx-calendar-actions > summary').click();
   await page.evaluate(()=>window.__campobase.renderMatches());
   assert.equal(await card.locator('.edit-match-performance').count(),1);
   assert.equal(await card.locator('.edit-match').count(),1);
   await card.locator('.edit-match-performance').click();await dialog.waitFor({state:'visible'});
   assert.equal(await dialog.locator('.postgame-player-row').count(),14);
   assert.equal(await dialog.locator('[data-keeper-conceded]').count(),2);
   assert.equal(await page.locator('#postgame-goals-for').inputValue(),'1');
   assert.equal(await dialog.locator('[data-player-id="edit-p1"] [data-postgame=rating]').inputValue(),'3');
   await dialog.locator('[data-close-postgame]').first().click();
   await card.locator('.match-detail').click();await page.locator('#match-detail-dialog').waitFor({state:'visible'});
   await page.locator('#match-detail-dialog .edit-match-performance').click();await dialog.waitFor({state:'visible'});
   assert.equal(await page.locator('#match-detail-dialog').evaluate(d=>d.open),false);
   await dialog.locator('[data-close-postgame]').first().click();
  }
  assert.deepEqual(await page.evaluate(async()=> (await import('/js/db.js')).getOne('matches','edit-finished')),seed.matches[0]);
  const card=page.locator('.match-card[data-match-id="edit-finished"]');await card.locator('.edit-match-performance').click();
  await page.locator('#postgame-goals-for').fill('2');await page.locator('#postgame-goals-against').fill('3');
  await dialog.locator('[data-goal=type]').selectOption('penalty');await dialog.locator('[data-goal=assistant]').selectOption('edit-p5');
  await dialog.locator('[data-add-postgame-goal]').click();await dialog.locator('[data-goal=player]').last().selectOption('edit-p6');
  await dialog.locator('[data-keeper-conceded="edit-p1"]').fill('2');await dialog.locator('[data-keeper-conceded="edit-p8"]').fill('1');
  await dialog.locator('[data-player-id="edit-p1"] [data-postgame=minutes]').fill('34');await dialog.locator('[data-player-id="edit-p1"] [data-postgame=rating]').selectOption('5');
  await dialog.locator('[type=submit]').click();await page.waitForFunction(()=>!document.querySelector('#postgame-performance-dialog').open);
  const saved=await page.evaluate(async()=> (await import('/js/db.js')).getOne('matches','edit-finished'));
  assert.equal(saved.goalsFor,2);assert.equal(saved.goalsAgainst,3);assert.equal(saved.goals.length,2);assert.equal(saved.goals[0].isPenalty,true);assert.equal(saved.goals[0].assistantId,'edit-p5');
  assert.equal(saved.minuteTotals['edit-p1'],2040);assert.equal(saved.ratings['edit-p1'],5);assert.equal(saved.location,'Mi campo');assert.equal(saved.comments,'Conservar');
  assert.deepEqual(saved.keeperGoalsAgainst,{'edit-p1':2,'edit-p8':1});assert.deepEqual(await page.evaluate(async()=> (await import('/js/db.js')).getOne('settings','edit-prep')),seed.prep);
  await card.locator('.edit-match-performance').click();await dialog.waitFor({state:'visible'});
  assert.equal(await page.locator('#postgame-goals-for').inputValue(),'2');assert.equal(await dialog.locator('[data-player-id="edit-p1"] [data-postgame=minutes]').inputValue(),'34');assert.equal(await dialog.locator('[data-player-id="edit-p1"] [data-postgame=rating]').inputValue(),'5');
  assert.deepEqual(errors,[]);await context.close();console.log('PASS',width,'edición fija en seis estados y detalle, todos los campos, cancelar/guardar/reabrir sin alterar plan');
 }
}finally{await browser.close();}
