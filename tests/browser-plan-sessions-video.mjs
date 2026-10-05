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
try {
  browser = await chromium.launch({ executablePath: process.env.CAMPOBASE_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block', hasTouch:true });
  await context.setOffline(true);
  const remoteMutations = [];
  await context.route('**/*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname.endsWith('.supabase.co')) {
      const readOnlyRpc = /^\/rest\/v1\/rpc\/(mi_equipo_contexto|resolve_login_email|get_delegate_account|legacy_owner_claim_available)$/.test(url.pathname);
      if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method()) && !url.pathname.startsWith('/auth/') && !readOnlyRpc) remoteMutations.push(`${request.method()} ${url.pathname}`);
      return route.fulfill({ status: 503, body: 'null' });
    }
    if (url.hostname !== 'miguelperezh.github.io') return route.continue();
    const relative = url.pathname.replace(/^\/campobase-preview\/v2\/?/, '') || 'index.html';
    const file = path.resolve(source, relative);
    if (!file.startsWith(source + path.sep)) return route.fulfill({ status: 404, body: '' });
    try {
      const body = await fs.readFile(file);
      const contentType = file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : file.endsWith('.mp4') ? 'video/mp4' : 'application/octet-stream';
      return route.fulfill({ status: 200, body, contentType });
    } catch { return route.fulfill({ status: 404, body: '' }); }
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => { errors.push(error.message); console.log('PAGE ERROR:', error.message); });
  await page.goto('https://miguelperezh.github.io/campobase-preview/v2/');
  await page.locator('#saas-demo-btn').click();
  await page.waitForFunction(() => window.__campobase?.state.role === 'demo', null, {timeout: 10000}).catch(async e => { console.log(await page.evaluate(() => ({ready:!!window.__campobase, role:window.__campobase?.state.role, toast:document.querySelector('#toast')?.textContent, auth:document.querySelector('#auth-dialog')?.textContent?.slice(-500)}))); throw e; });
  await page.evaluate(async (data) => {
    const db = await import('./js/db.js');
    db.configureRealDatabase();
    for (const store of ['players', 'matches', 'callups', 'trainings', 'settings']) {
      for (const item of data[store]) await db.put(store, item);
    }
    await db.put('settings', {id:'color-session',recordType:'trainingSession',name:'Sesión de colores',date:'2026-10-05',time:'16:30',pitch:'Campo de prueba',targetDuration:75,blocks:[],completed:false});
    await window.__campobase.refresh(true);
    window.__campobase.applyRole('owner');
    window.__campobase.showView('preparacion');
  }, fixture);


  // Media liga stays inside its box at desktop and mobile widths.
  for(const width of [390,1280]) {
    await page.setViewportSize({width,height:900});
    await page.evaluate(()=>window.__campobase.showView('plantilla'));
    assert.ok(await page.locator('.liga-media').count());
    assert.equal(await page.locator('.liga-media').evaluateAll(boxes=>boxes.some(box=>{const a=box.getBoundingClientRect();const b=box.querySelector('.etiqueta').getBoundingClientRect();return b.left<a.left-1||b.right>a.right+1||b.top<a.top-1||b.bottom>a.bottom+1;})),false);
  }
  await page.evaluate(()=>window.__campobase.showView('convocatorias'));
  const called=page.locator('[data-minute-timeline="callup:preview-test-callup"]');
  await called.locator('[data-minute-player]').nth(2).click();
  const name=await called.locator('[data-minute-player]').nth(2).locator('.cbx-minute-person > span').textContent();
  await called.locator('input[type=range]').fill('70');
  await called.locator('input[type=range]').dispatchEvent('input');
  assert.match(await called.locator('.cbx-minute-selection').textContent(),new RegExp(name));
  assert.match(await called.locator('.cbx-minute-selection').textContent(),/35′ jugados/);
  assert.match(await called.locator('.cbx-minute-spans').first().textContent(),/0′–35′ · 35 min/);
  const calledTotals=await called.locator('.cbx-minute-total small').allTextContents();
  const beforeCopy=await page.evaluate(async()=>JSON.stringify(await (await import('./js/db.js')).getAll('settings')));
  await page.evaluate(()=>{window.print=()=>{};});
  await page.locator('.cbx-print-callup-plan').first().click();
  await page.waitForFunction(()=>document.querySelector('#cb-print-root'));
  assert.match(await page.locator('#cb-print-root').textContent(),/Rival de prueba/);
  const printedCallup=await page.locator('#cb-print-root').innerHTML();
  await page.locator('#cb-print-fab-close').click();
  await page.locator('.cbx-copy-callup-plan').first().click();
  await page.waitForFunction(()=>document.querySelectorAll('[data-prep-moment]').length>1);
  assert.deepEqual(await page.locator('[data-minute-timeline="prep:preview-test-match"] .cbx-minute-total small').allTextContents(),calledTotals);
  assert.equal(await page.evaluate(async()=>JSON.stringify(await (await import('./js/db.js')).getAll('settings'))),beforeCopy);
  await page.locator('[data-prep-moment]').nth(1).click();
  await page.locator('#prep-print-moments').click();
  await page.waitForFunction(()=>document.querySelector('#cb-print-root'));
  assert.equal(await page.locator('#cb-print-root').innerHTML(),printedCallup,'Imprimir desde otro momento conserva el plan completo');
  await page.locator('#cb-print-fab-close').click();
  const minuteBefore=await page.locator('.cbx-moment-adjust > strong').textContent();
  await page.locator('[data-prep-minute="1"]').click();
  assert.notEqual(await page.locator('.cbx-moment-adjust > strong').textContent(),minuteBefore);
  await page.locator('#prep-restore-plan').click();
  await page.locator('#prep-back-head').click();
  await page.evaluate(()=>window.__campobase.showView('plantilla'));
  await page.locator('#plantilla [data-gear-target="plantilla"]').first().click();
  assert.equal(await page.locator('.cbx-adjustments-preview').count(),1);
  assert.ok(await page.locator('.cbx-adjustment-icon').count());
  for(const width of [390,1280]) {await page.setViewportSize({width,height:900});assert.equal(await page.locator('#cbx-quick-color-dialog').evaluate(el=>el.scrollWidth>el.clientWidth+1),false);}
  await page.locator('#cbx-quick-color-save').click();
  // Use deliberately changed starters so proposal cannot rely on catalog order.
  await page.evaluate(async()=>{
    const db=await import('./js/db.js');const s=window.__campobase.state;
    const ids=s.callups.find(c=>c.id==='preview-test-callup').availableIds;
    const gks=ids.filter(id=>s.players.find(p=>p.id===id)?.positions?.includes('Portero'));
    const field=ids.filter(id=>!gks.includes(id)).reverse().slice(0,6);
    const positions=['Portero','Defensa izq.','Central','Defensa der.','Medio/banda izq.','Medio/banda der.','Delantero'];
    await db.put('settings',{id:'prep-visual-test',recordType:'preparacion',matchId:'preview-test-match',formacion:'1-3-2-1',team:[gks[1],...field].map((playerId,i)=>({playerId,pos:positions[i],x:50,y:50})),moments:[]});
    await window.__campobase.refresh(true);window.__campobase.showView('preparacion');await window.__campobase.openPreparacionEditor('preview-test-match');
  });
  const storedBefore=await page.evaluate(async()=>{const db=await import('./js/db.js');return JSON.stringify(await db.getAll('settings'));});
  const starters=await page.locator('#prep-slots select').evaluateAll(items=>items.map(item=>item.value));
  await page.locator('#prep-propose-auto').click();
  assert.equal(await page.locator('#prep-copy-auto').count(),1);
  assert.ok(await page.locator('#prep-moments .cbx-plan-change').count());
  assert.deepEqual(await page.locator('#prep-slots select').evaluateAll(items=>items.map(item=>item.value)),starters);
  assert.equal(await page.evaluate(async()=>{const db=await import('./js/db.js');return JSON.stringify(await db.getAll('settings'));}),storedBefore);
  await page.locator('#prep-copy-auto').click();
  assert.ok(await page.locator('[data-prep-moment]').count()>1);
  assert.deepEqual(await page.locator('#prep-slots select').evaluateAll(items=>items.map(item=>item.value)),starters);
  const prepTimeline=page.locator('[data-minute-timeline="prep:preview-test-match"]');
  await prepTimeline.locator('input[type=range]').fill('70');await prepTimeline.locator('input[type=range]').dispatchEvent('input');
  assert.ok((await prepTimeline.locator('.cbx-minute-total b').allTextContents()).every(text=>text==='35′'));
  await page.locator('#prep-restore-plan').click();
  assert.equal(await page.locator('[data-prep-moment]').count(),1);
  // Session with a real creator SVG cover and a catalog exercise.
  const catalogId=await page.evaluate(async()=>{const {EJERCICIOS_VALIDADOS}=await import('./js/ejercicios-validados.js');return EJERCICIOS_VALIDADOS.find(ex=>ex.media?.video||ex.media?.mp4||ex.video_ejercicio)?.id;});
  await page.evaluate(async(catalogId)=>{
    const db=await import('./js/db.js');
    const mine={id:'browser-own-svg',recordType:'exercise',customBoard:true,name:'Mi ejercicio con portada elegida',duration:12,players:'7',boardPreview:'<svg viewBox="0 0 400 200"><rect width="400" height="200" fill="#126344"/><text x="20" y="60" fill="white">FRAME ELEGIDO</text></svg>',boardStatic:{field:'full',currentPhaseId:'frame-0',phases:[{id:'frame-0',name:'Fase inicial',items:[],lines:[]}]},boardAnimation:null,description:'Descripción propia',objective:'Objetivo propio'};
    await db.put('settings',mine);await db.put('settings',{id:'session-visual-own',recordType:'trainingSession',name:'Sesión preparada con mis ejercicios',date:'2026-10-05',targetDuration:24,blocks:[{exerciseId:mine.id,type:'main',duration:12},{exerciseId:catalogId,type:'main',duration:12}]});
    await window.__campobase.refresh(true);window.__campobase.showView('sesiones');
  },catalogId);
  await page.locator('#sesiones .view-session[data-id="session-visual-own"]').first().click();
  const detail=page.locator('#session-detail-dialog');
  await page.waitForFunction(()=>document.querySelector('#session-detail-body .session-visual-detail'));
  await detail.locator('.session-visual-accordion > summary').first().click();
  await detail.locator('.view-exercise').first().click();
  await page.waitForFunction(()=>document.querySelector('.exercise-board-overlay')?.classList.contains('open')&& !document.querySelector('#session-detail-dialog').open);
  await page.waitForFunction(()=>document.querySelector('.exercise-board-overlay iframe')?.dataset.boardReady==='1',null,{timeout:20000});
  const actualCreatorCover=await page.frameLocator('.exercise-board-overlay iframe').locator('svg#board').evaluate(el=>el.outerHTML);
  assert.ok(actualCreatorCover.startsWith('<svg'));
  await page.evaluate(async preview=>{const db=await import('./js/db.js');const item=window.__campobase.state.exercises.find(e=>e.id==='browser-own-svg');item.boardPreview=preview;await db.put('settings',item);},actualCreatorCover);
  await page.locator('.exercise-board-viewer-back').click();
  await page.waitForFunction(()=>document.querySelector('#session-detail-dialog').open);
  assert.equal(await detail.locator('.session-visual-accordion').first().getAttribute('open'),'');
  await page.evaluate(id=>window.__campobase.showExerciseDetail(id),catalogId);
  await page.waitForFunction(()=>document.querySelector('#exercise-detail-dialog').open && !document.querySelector('#session-detail-dialog').open);
  await page.locator('#exercise-detail-dialog .sheet-top-close-btn').first().click();
  await page.waitForFunction(()=>document.querySelector('#session-detail-dialog').open);
  await page.evaluate(()=>document.querySelector('#session-detail-dialog').close());

  // Direct print selection uses current own SVG, not an old session's blocks.
  await page.locator('#print-own-exercises').click();
  await page.evaluate(()=>{window.print=()=>{};});
  await page.locator('#own-exercises-print-dialog [name=ownPrint]').evaluateAll(inputs=>inputs.forEach(input=>input.checked=input.value==='browser-own-svg'));
  await page.locator('[data-print-selected]').click();
  await page.waitForFunction(()=>document.querySelector('#cb-print-root'));
  const image=page.locator('#cb-print-root .cb-print-session-exercise img.cb-print-field-img').first();
  await image.evaluate(async img=>{await img.decode();});
  assert.match(await image.getAttribute('src'),/^data:image\/svg\+xml/);
  assert.ok(await image.evaluate(img=>img.naturalWidth>0));
  await page.emulateMedia({media:'print'});
  const pdf=await page.pdf({format:'A4',printBackground:true,preferCSSPageSize:true});
  assert.equal((pdf.toString('latin1').match(/\/Type \/Page\b/g)||[]).length,2);
  await page.emulateMedia({media:'screen'});
  await page.locator('#cb-print-fab-close').click();
  // The real MP4 decodes and advances. Touch then click invokes playback once.
  await page.evaluate(async()=>{
    const {renderValidatedExerciseHTML,initValidatedExerciseViewer}=await import('./js/ejercicio-viewer.js');
    const body=document.querySelector('#exercise-detail-body');
    body.innerHTML=renderValidatedExerciseHTML({id:'browser-mp4',nombre:'Prueba MP4 real',categoria:'General',media:{video:'assets/ejercicios/CAMPOBASE-PACK150-128-RECEPCION-BALON-RASO/CampoBase_Recepcion_Balon_Raso.mp4'}});
    const root=body.querySelector('.ejercicio-v2-sheet');initValidatedExerciseViewer(root);document.querySelector('#exercise-detail-dialog').showModal();
  });
  const play=page.locator('#exercise-detail-dialog .v-btn-play');
  await play.dispatchEvent('touchend');await page.waitForTimeout(350);await play.click();
  await page.waitForFunction(()=>{const v=document.querySelector('#exercise-detail-dialog .frame-video');return !v.paused&&v.currentTime>0;},null,{timeout:12000});
  await play.click();await page.waitForFunction(()=>document.querySelector('#exercise-detail-dialog .frame-video').paused);
  await page.waitForTimeout(350);await play.click();
  await page.waitForFunction(()=>!document.querySelector('#exercise-detail-dialog .frame-video').paused);
  await page.locator('#exercise-detail-dialog .v-btn-speed').first().click();
  assert.equal(await page.locator('#exercise-detail-dialog .frame-video').evaluate(video=>video.paused),false);
  assert.deepEqual(remoteMutations,[]);assert.deepEqual(errors,[]);
  console.log('PASS: Media liga fits; selected bars accumulate minutes; proposals preserve starters, valid rotations and stored plan; restore; prepared session opens own board/catalog and returns; current SVG cover prints real PDF; MP4 touch/click/play/pause/speed advances; zero writes/errors.');
} finally {await browser?.close();}
