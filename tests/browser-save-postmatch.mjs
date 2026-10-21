import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';

const base=process.env.CAMPOBASE_TEST_URL || 'http://127.0.0.1:4227';
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN,headless:true,args:['--no-sandbox']});
try {
 for(const width of [1440,390]) {
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  await page.goto(base+'/index.html?savePostmatch=1');
  await page.waitForFunction(()=>window.__campobase?.state);
  await page.evaluate(()=>document.querySelector('#auth-demo-btn').click());
  await page.waitForFunction(()=>window.__campobase.state.role==='demo');
  const seed=await page.evaluate(async()=>{
   const db=await import('/js/db.js'),app=window.__campobase;
   const day=new Date(Date.now()-86400000).toISOString().slice(0,10),date=day+'T12:00:00';
   const ids=Array.from({length:14},(_,i)=>'save-p'+(i+1));
   const players=ids.map((id,i)=>({id,name:'Jugador guardado '+(i+1),number:String(i+1),positions:[i===0||i===7?'Portero':'Central']}));
   const empty={id:'save-empty',date,opponent:'Rival pendiente Valsequi',type:'league',format:'F7',status:'planned',location:'Mi campo exacto',extra:{keep:true}};
   const variants=[
    [{...empty,id:'legacy-self',opponent:'Rival enlace por ID'},{id:'legacy-self'}],
    [{...empty,id:'legacy-date',opponent:'Rival enlace por fecha'},{id:'legacy-date-callup',date:day,opponent:'Rival enlace por fecha'}],
    [{...empty,id:'legacy-pointer',callupId:'legacy-pointer-callup',opponent:'Rival enlace directo'},{id:'legacy-pointer-callup'}],
    [{...empty,id:42,opponent:'Rival ID numérico'},{id:43,matchId:'42'}],
    [{...empty,id:0,opponent:'Rival ID cero'},{id:0}],
   ];
   const callups=variants.map(([m,c])=>({date:m.date,opponent:m.opponent,...c,format:'F7',availableIds:ids.slice(0,8),selectedIds:ids.slice(0,2),exclusions:[],extra:{keep:'Convocatoria original'}}));
   const prep={id:'save-prep',recordType:'preparacion',matchId:empty.id,team:ids.slice(0,7).map((playerId,i)=>({playerId,pos:i===0?'Portero':'Puesto '+i})),moments:[],extra:{untouched:true}};
   const live={id:'live',timer:{matchId:'other-live',phase:'ready',onField:ids.slice(0,7),elapsed:0},updatedAt:55};
   await db.putBatch({players,matches:[empty,...variants.map(([m])=>m),{id:'other-live',date:'2099-10-21T19:00:00',opponent:'Otro directo',status:'planned',callupId:'other-live-callup',type:'friendly'}],callups:[...callups,{id:'other-live-callup',matchId:'other-live',format:'F7',availableIds:ids}],settings:[prep,live]});
   await app.refresh(true);app.showView('calendario');app.renderMatches();
   return {ids,empty,variants,callups,prep,live};
  });
  const read=(store,id)=>page.evaluate(async({store,id})=>(await import('/js/db.js')).getOne(store,id),{store,id});
  const openCalendar=()=>page.evaluate(()=>{
   const app=window.__campobase;app.showView('calendario');app.renderMatches();
   const archive=document.querySelector('#played-matches-collapsible');if(archive)archive.open=true;
   document.querySelectorAll('#matches-list .cbx-calendar-actions').forEach(el=>el.open=true);
  });
  const saveCallup=async()=>{
   await page.locator('#callup-form [type=submit]').click();
   await page.waitForFunction(()=>document.querySelector('#callup-builder').classList.contains('hidden'));
  };
  // The real card edit path used to leave required matchId empty for legacy records.
  for(let i=0;i<seed.variants.length;i++) {
   const [match]=seed.variants[i],callup=seed.callups[i];
   await page.evaluate(()=>{const app=window.__campobase;app.showView('convocatorias');app.renderCallups();});
   await page.locator(`.edit-callup[data-id="${callup.id}"]`).click();
   assert.equal(await page.locator('#callup-form [name=id]').inputValue(),String(callup.id));
   assert.equal(await page.locator('#callup-form [name=matchId]').inputValue(),String(match.id));
   assert.match(await page.locator('#callup-match-context').textContent(),new RegExp(match.opponent));
   assert.equal(await page.locator('#callup-form .callup-selection-label').first().textContent(),'Fue convocado');
   assert.equal(await page.locator('#manual-match-fields input:enabled, #manual-match-fields select:enabled').count(),0);
   await saveCallup();
   const saved=await read('callups',callup.id);
   assert.deepEqual(saved.availableIds,seed.ids.slice(0,8));
   assert.deepEqual(saved.extra,callup.extra);
   assert.equal(saved.matchId,match.id);
  }
  // Actual search -> past match detail -> create callup, without touching the selector.
  if(width>=760){
   const search=page.locator('.cbx-global-search input');await search.fill('Valsequi');
   await page.locator('.cbx-search-results button').filter({hasText:'Valsequi'}).click();
   await page.locator('#match-detail-dialog .callup-match').click();
  }else{
   await openCalendar();await page.locator(`.match-card[data-match-id="${seed.empty.id}"] .callup-match`).click();
  }
  assert.equal(await page.locator('#callup-form [name=matchId]').inputValue(),seed.empty.id);
  for(const id of seed.ids)await page.locator(`#callup-form [name=selected][value="${id}"]`).check();
  await saveCallup();
  const matchWithCallup=await read('matches',seed.empty.id);
  assert.equal((await read('callups',matchWithCallup.callupId)).availableIds.length,14);
  assert.equal(matchWithCallup.goalsFor,undefined);
  assert.deepEqual(await read('settings',seed.prep.id),seed.prep);
  assert.deepEqual(await read('settings','live'),seed.live);

  // Missing selection is an explicit, focused error, not a silent native tooltip.
  await page.evaluate(()=>{window.__campobase.showView('convocatorias');document.querySelector('#new-callup').click();});
  await page.locator('#callup-form [name=matchSource][value=calendar]').check();
  await page.locator('#callup-form [type=submit]').click();
  await page.locator('#callup-form [data-save-error]').waitFor({state:'visible'});
  assert.match(await page.locator('#callup-form [data-save-error]').textContent(),/Partido del calendario/);
  assert.equal(await page.evaluate(()=>document.activeElement.name),'matchId');
  await page.locator('#callup-form .cancel-builder').click();

  await openCalendar();
  await page.locator(`.match-card[data-match-id="${seed.empty.id}"] .edit-match-performance`).click();
  const dialog=page.locator('#postgame-performance-dialog');await dialog.waitFor({state:'visible'});
  assert.equal(await dialog.locator('.postgame-player-row').count(),14);
  assert.equal(await dialog.locator('[data-keeper-conceded]').count(),2);
  assert.equal(await page.locator('#postgame-goals-for').inputValue(),'');
  assert.match(await page.locator('#postgame-score-hint').textContent(),/pendiente/);
  await dialog.locator('[data-player-id="save-p1"] [data-postgame=minutes]').fill('35');
  await dialog.locator('[data-player-id="save-p1"] [data-postgame=rating]').selectOption('5');
  await dialog.locator('[data-player-id="save-p1"] [data-postgame=comment]').fill('Comentario individual posterior');
  await page.locator('#postgame-match-comment').fill('Comentario general posterior');
  await dialog.locator('[type=submit]').click();
  await page.waitForFunction(()=>!document.querySelector('#postgame-performance-dialog').open);
  const saved=await read('matches',seed.empty.id);
  assert.equal(saved.goalsFor,null);assert.equal(saved.goalsAgainst,null);
  assert.equal(saved.minuteTotals['save-p1'],2100);assert.equal(saved.ratings['save-p1'],5);
  assert.equal(saved.playerComments['save-p1'],'Comentario individual posterior');
  assert.equal(saved.comments,'Comentario general posterior');assert.deepEqual(saved.extra,seed.empty.extra);
  assert.deepEqual(await read('settings',seed.prep.id),seed.prep);assert.deepEqual(await read('settings','live'),seed.live);
  await openCalendar();await page.locator(`.match-card[data-match-id="${seed.empty.id}"] .edit-match-performance`).click();
  assert.equal(await dialog.locator('[data-player-id="save-p1"] [data-postgame=minutes]').inputValue(),'35');
  assert.equal(await page.locator('#postgame-goals-for').inputValue(),'');
  // Partial goal details also survive reopening before the final totals are known.
  await dialog.locator('[data-keeper-conceded="save-p1"]').fill('1');
  await dialog.locator('[data-keeper-conceded="save-p8"]').fill('2');
  await dialog.locator('[data-add-postgame-goal]').click();
  await dialog.locator('[data-goal=player]').selectOption('save-p3');
  await dialog.locator('[type=submit]').click();await page.waitForFunction(()=>!document.querySelector('#postgame-performance-dialog').open);
  await openCalendar();await page.locator(`.match-card[data-match-id="${seed.empty.id}"] .edit-match-performance`).click();
  assert.equal(await page.locator('#postgame-goals-for').inputValue(),'');
  assert.equal(await dialog.locator('[data-keeper-conceded="save-p1"]').inputValue(),'1');
  assert.equal(await dialog.locator('[data-keeper-conceded="save-p8"]').inputValue(),'2');
  assert.equal(await dialog.locator('[data-goal=player]').inputValue(),'save-p3');
  // Native constraints still apply; an invalid minute keeps all draft data.
  await dialog.locator('[data-player-id="save-p1"] [data-postgame=minutes]').fill('71');
  await dialog.locator('[type=submit]').click();
  assert.match(await dialog.locator('[data-save-error]').textContent(),/Minutos/);
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.postgame),'minutes');
  assert.equal((await read('matches',seed.empty.id)).minuteTotals['save-p1'],2100);
  await dialog.locator('[data-player-id="save-p1"] [data-postgame=minutes]').fill('35');
  await page.locator('#postgame-goals-for').fill('0');await page.locator('#postgame-goals-against').fill('0');
  await dialog.locator('[type=submit]').click();
  const notice=dialog.locator('[data-save-error]');
  assert.match(await notice.textContent(),/más goles/);
  assert.equal(await notice.evaluate(el=>document.activeElement===el),true);
  assert.equal(await notice.evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),true);
  assert.equal(await page.locator('#postgame-match-comment').inputValue(),'Comentario general posterior');
  assert.equal((await read('matches',seed.empty.id)).goalsFor,null);
  // Correcting the inconsistency saves normally, keeping both keeper allocations.
  await page.locator('#postgame-goals-for').fill('1');await page.locator('#postgame-goals-against').fill('3');
  await dialog.locator('[data-keeper-conceded="save-p1"]').fill('1');
  await dialog.locator('[data-keeper-conceded="save-p8"]').fill('2');
  await dialog.locator('[type=submit]').click();await page.waitForFunction(()=>!document.querySelector('#postgame-performance-dialog').open);
  const complete=await read('matches',seed.empty.id);
  assert.equal(complete.goalsFor,1);assert.equal(complete.goalsAgainst,3);assert.equal(complete.goals[0].playerId,'save-p3');
  assert.deepEqual(complete.keeperGoalsAgainst,{'save-p1':1,'save-p8':2});
  assert.deepEqual(errors,[]);await context.close();
  console.log('PASS',width,'botones reales; legado/ID numérico, búsqueda→partido pasado, marcador pendiente, errores visibles/corregibles, reapertura y datos ajenos conservados');
 }
} finally {await browser.close();}
