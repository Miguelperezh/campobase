import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
const base=process.env.LEARNING_TEST_URL||'http://127.0.0.1:4214';
const server=process.env.LEARNING_TEST_URL?null:spawn('python3',['-m','http.server','4214','--bind','127.0.0.1'],{stdio:'ignore'});
for(let attempt=0;attempt<40;attempt++){try{if((await fetch(base+'/tests/fixtures/learning.html')).ok)break;}catch{}if(attempt===39){server?.kill();throw new Error('Servidor de prueba no disponible');}await new Promise(resolve=>setTimeout(resolve,100));}
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN,headless:true});
try {for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:950}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',route=>{if(/\/js\/(completed-events-ui|session-visual-planner|session-planner-ui)\.js/.test(route.request().url()))return route.fulfill({contentType:'application/javascript',body:'export {};'});return new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort()});
 await page.goto(base+'/tests/fixtures/learning.html');await page.waitForFunction(()=>window.fixtureReady);await page.waitForFunction(()=>document.querySelector('#learn-match').options.length===2);
 await page.locator('#learn-match').selectOption('m');await page.locator('[data-phase="3"][data-rating="Mal"]').click();await page.locator('[data-note="3"]').fill('Observación conservada');
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('campobase:data-updated')));await page.waitForTimeout(100);assert.equal(await page.locator('[data-note="3"]').inputValue(),'Observación conservada');
 await page.locator('[data-learning-save="review"]').click();await page.waitForFunction(()=>document.querySelector('[data-learning-status=review]').textContent.includes('Guardado'));
 await page.locator('[data-accept="3"]').click();await page.locator('[data-tab="players"]').click();await page.locator('[data-comp="1"][data-value="4"]').click();await page.locator('[data-learning-save="players"]').click();await page.waitForFunction(()=>document.querySelector('[data-learning-status=players]').textContent.includes('Guardado'));
 await page.locator('[data-tab="plan"]').click();assert.equal(await page.locator('#learn-goals article').count(),1);await page.locator('[data-goal="0"][data-field="title"]').fill('Objetivo conservado');await page.locator('[data-learning-save="plan"]').click();await page.waitForFunction(()=>document.querySelector('[data-learning-status=plan]').textContent.includes('Guardado'));
 await page.locator('[data-tab="review"]').click();await page.locator('[data-theme-section="learn-review"]').click();
 assert.equal(await page.locator('#cbx-claude-colors [data-section]').count(),1);
 const input=page.locator('#cbx-claude-colors input[data-key="background"]');await input.evaluate(e=>{e.value='#123456';e.dispatchEvent(new Event('input',{bubbles:true}))});
 await page.locator('#cbx-claude-colors select[data-key="font-family"]').selectOption('Georgia, serif');
 assert.equal(await page.locator('#learn-review .card').first().evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(18, 52, 86)');
 await page.locator('#cbx-claude-colors [data-action="save"]').click();await page.waitForFunction(()=>document.querySelector('#cbx-claude-colors .cbp-save-status').textContent.includes('Guardado y comprobado'));await page.locator('#cbx-claude-colors [data-action=close]').click();
 await page.reload();await page.waitForFunction(()=>document.querySelector('#learn-match')?.options.length===2);await page.locator('#learn-match').selectOption('m');assert.equal(await page.locator('[data-note="3"]').inputValue(),'Observación conservada');
 assert.equal(await page.locator('#learn-review .card').first().evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(18, 52, 86)');
 await page.locator('[data-tab="players"]').click();assert.equal(await page.locator('[data-comp="1"][data-value="4"]').getAttribute('aria-pressed'),'true');
 await page.locator('[data-tab="plan"]').click();assert.equal(await page.locator('[data-goal="0"][data-field="title"]').inputValue(),'Objetivo conservado');
 for(const tab of ['review','players','plan']){await page.locator(`[data-tab="${tab}"]`).click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${tab} overflow ${width}`);}
 const sport=await page.evaluate(()=>learningFixture.getOne('matches','m'));assert.deepEqual(sport.plan,{preserved:true});assert.equal(sport.goalsAgainst,15);assert.equal(sport.location,'Campo original');
 await page.locator('[data-tab=review]').click();await page.evaluate(async()=>{const r=(await learningFixture.getAll('settings')).find(r=>r.kind==='review');await learningFixture.put('settings',{...r,observation:'Edición de otro dispositivo',updatedAt:r.updatedAt+1})});await page.locator('[data-note="3"]').fill('Borrador propio');await page.locator('[data-learning-save="review"]').click();await page.waitForFunction(()=>document.querySelector('#learn-toast').textContent.includes('ha cambiado'));assert.equal(await page.locator('[data-note="3"]').inputValue(),'Borrador propio');
 assert.deepEqual(errors,[]);console.log('PASS',width,'saved records and theme, scoped settings, draft protection, conflict, no sporting changes');await page.close();
 const appPage=await browser.newPage({viewport:{width,height:950},serviceWorkers:'block'}),appErrors=[];
 appPage.on('pageerror',e=>appErrors.push(e.message));
 await appPage.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await appPage.goto(base+'/index.html?learningSmoke=1');await appPage.waitForFunction(()=>window.__campobase?.state);
 await appPage.evaluate(()=>document.getElementById('auth-demo-btn').click());await appPage.waitForFunction(()=>window.__campobase?.state?.role==='demo');
 // La demo parte vacía: datos únicamente en memoria, nunca en la cuenta real.
 await appPage.evaluate(()=>{window.__campobase.state.players=[{id:'learning-smoke-p',name:'Jugador de prueba',number:1,positions:['Central']}];window.__campobase.renderAll();window.__campobase.showView('aprendizaje')});
 await appPage.waitForFunction(()=>document.querySelector('#learn-player').options.length===1);
 for(const tab of ['review','players','plan']){await appPage.locator(`[data-tab="${tab}"]`).click();assert.equal(await appPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`app ${tab} overflow ${width}`);}
 await appPage.locator('[data-theme-section="learn-plan"]').click();await appPage.waitForSelector('#cbx-claude-colors');assert.equal(await appPage.locator('#cbx-claude-colors [data-section]').count(),1);await appPage.locator('#cbx-claude-colors [data-action=close]').click();assert.deepEqual(appErrors,[]);console.log('PASS complete app',width);await appPage.close();
}}finally{await browser.close();server?.kill()}
