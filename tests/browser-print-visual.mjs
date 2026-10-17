import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
const base=process.env.PRINT_TEST_URL||'http://127.0.0.1:4221';
const server=process.env.PRINT_TEST_URL?null:spawn('python3',['-m','http.server','4221','--bind','127.0.0.1'],{stdio:'ignore'});
for(let i=0;i<40;i++){try{if((await fetch(base+'/tests/fixtures/print-plan-visual.html')).ok)break;}catch{}if(i===39){server?.kill();throw new Error('Servidor no disponible');}await new Promise(r=>setTimeout(r,100));}
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN,headless:true});
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:950},serviceWorkers:'block'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  // Decoradores de sesiones ajenos al documento exigen el DOM completo; sin cambios al código de producción.
  await page.route('**/*',r=>/\/js\/(completed-events-ui|session-visual-planner|session-planner-ui)\.js/.test(r.request().url())?r.fulfill({contentType:'application/javascript',body:'export {};'}):new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  await page.goto(base+'/tests/fixtures/print-plan-visual.html');await page.waitForFunction(()=>window.fixtureReady);await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>[...document.querySelectorAll('.cbv-crest')].every(img=>img.complete&&img.naturalWidth>0));
  assert.equal(await page.locator('.cbv-page').count(),3);
  const original=await page.evaluate(()=>JSON.stringify(fixture.state));
  const bounds=async()=>page.locator('.cbv-page').evaluateAll(pages=>pages.map(p=>({content:p.querySelector('.cbv-content').scrollHeight,available:p.querySelector('.cbv-content').clientHeight,footer:p.querySelector('.cbv-footer').getBoundingClientRect().bottom-p.getBoundingClientRect().top,height:p.clientHeight})));
  for(const b of await bounds()){assert.ok(b.content<=b.available+1,JSON.stringify(b));assert.ok(b.footer<=b.height+1,JSON.stringify(b));}
  assert.equal(await page.locator('.cbv-header').first().evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(165, 29, 61)');
  await page.emulateMedia({media:'print'});
  assert.equal(await page.locator('.cbv-header').first().evaluate(e=>getComputedStyle(e).opacity),'1');
  assert.notEqual(await page.locator('.cbv-content').first().evaluate(e=>getComputedStyle(e).display),'none');
  if(process.env.PRINT_OUTPUT_DIR){await fs.mkdir(process.env.PRINT_OUTPUT_DIR,{recursive:true});await page.pdf({path:process.env.PRINT_OUTPUT_DIR+`/plan-native-${width}.pdf`,format:'A4',printBackground:true,preferCSSPageSize:true});}
  await page.emulateMedia({media:'screen'});
  const pendingDownload=page.waitForEvent('download');await page.locator('#cb-print-download-btn').click();const download=await pendingDownload;
  assert.ok(download.suggestedFilename().endsWith('.pdf'));
  if(process.env.PRINT_OUTPUT_DIR)await download.saveAs(process.env.PRINT_OUTPUT_DIR+`/plan-download-${width}.pdf`);
  assert.equal(await page.evaluate(()=>JSON.stringify(fixture.state)),original);
  await page.locator('#cb-print-close-btn').click();assert.equal(await page.locator('#app').textContent(),'Pantalla original intacta');assert.equal(await page.locator('#cb-print-root').count(),0);
  // Otros ajustes de identidad, sin modificar la cuenta ni un plan deportivo.
  await page.evaluate(()=>{const other=structuredClone(fixture.state);other.settings={teamName:'Otro Club Azul',clubCrest:'/icons/escudo.png',theme:{btnBg:'#204060'}};fixture.printMatchPlan(fixture.match,other)});
  assert.equal(await page.locator('.cbv-header').first().evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(32, 64, 96)');
  assert.equal(await page.locator('.cbv-brand h1').first().textContent(),'Otro Club Azul');await page.locator('#cb-print-close-btn').click();
  // Nombres/posiciones extensos, 25 convocados F11, varios tramos: sin recortes ni filas omitidas.
  await page.evaluate(()=>{
   const players=Array.from({length:25},(_,i)=>({id:'long'+i,number:i,name:`Jugador ${i} con apellidos largos para verificar la impresión completa`,positions:['Central','Pivote/Mediocentro defensivo','Mediapunta','Extremo','Segundo delantero']}));
   const positions=['Portero','Lateral izquierdo','Central izquierdo','Central derecho','Lateral derecho','Pivote','Interior izquierdo','Interior derecho','Extremo izquierdo','Delantero','Extremo derecho'];
   const moments=[0,15,30,45,60,75].map((minute,index)=>({minute,formation:'1-4-3-3',team:positions.map((pos,slot)=>({pos,playerId:players[(slot+(index%2)*11)%25].id}))}));
   const match={id:'long-plan',opponent:'Rival',format:'F11',duration:90};
   const state={settings:{teamName:'Club F11'},players,callups:[{matchId:match.id,format:'F11',availableIds:players.map(p=>p.id)}],preparaciones:[{matchId:match.id,team:moments[0].team,moments}]};
   fixture.printMatchPlan(match,state);
  });
  assert.equal(await page.locator('[data-print-player]').count(),25);assert.equal(await page.locator('[data-print-minute]').count(),5);
  for(const b of await bounds())assert.ok(b.content<=b.available+1,`F11 ${JSON.stringify(b)}`);
  assert.deepEqual(errors,[]);console.log('PASS',width,'PDF real, A4, escudo/colores, datos intactos, F11 y 25 jugadores');await page.close();
 }
}finally{await browser.close();server?.kill()}
