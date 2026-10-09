import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN,headless:true,args:['--no-sandbox']});
try {
 for(const width of [1440,390]) {
  const context=await browser.newContext({viewport:{width,height:900}});const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>{if(/\/js\/(completed-events-ui|session-visual-planner|session-planner-ui)\.js/.test(route.request().url()))return route.fulfill({contentType:'application/javascript',body:'export {};'});if(new URL(route.request().url()).hostname!=='127.0.0.1')return route.abort();return route.continue();});
  await page.goto(`${process.env.CAMPOBASE_TEST_URL || 'http://127.0.0.1:4211'}/tests/fixtures/postgame-sync.html`);await page.waitForFunction(()=>window.fixtureReady);
  await page.locator('.edit-match-performance').click();await page.waitForSelector('#postgame-performance-dialog[open]',{timeout:5000}).catch(async e=>{console.log('DIALOGDEBUG',await page.evaluate(()=>({dialogs:[...document.querySelectorAll('dialog')].map(d=>({id:d.id,open:d.open,text:d.textContent.slice(0,100)})),body:document.body.textContent.slice(-900)})));throw e;});
  await page.locator('[data-goal=assistant]').selectOption('a');await page.locator('[data-goal=type]').selectOption('penalty');
  await page.locator('[data-keeper-conceded=k1]').fill('8');await page.locator('[data-keeper-conceded=k2]').fill('7');
  assert.match(await page.locator('#postgame-score-hint').textContent(),/15 de 15/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.locator('#postgame-performance-form button[type=submit]').click();await page.waitForFunction(()=>!document.querySelector('#postgame-performance-dialog').open);
  await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('confirmado'));
  const result=await page.evaluate(async()=>{await fixture.secondDevice();const m=await fixture.getOne('matches','fixture-game');m.keeperGoalsAgainst={k1:9,k2:6};m.location='Campo cambiado por segundo dispositivo';await fixture.putBatch({matches:[m]});await fixture.syncFromCloud();await fixture.firstDevice();return fixture.getOne('matches','fixture-game');});
  assert.equal(result.goals[0].assistantId,'a');assert.equal(result.goals[0].isPenalty,true);assert.deepEqual(result.keeperGoalsAgainst,{k1:9,k2:6});assert.equal(result.location,'Campo cambiado por segundo dispositivo');assert.equal(result.plan.untouched,true);
  await page.evaluate(()=>fixture.fail());await page.locator('.edit-match-performance').click();await page.locator('[data-keeper-conceded=k1]').fill('10');await page.locator('[data-keeper-conceded=k2]').fill('5');await page.locator('#postgame-performance-form button[type=submit]').click();await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('pendiente'));
  assert.equal((await page.evaluate(()=>fixture.getOne('matches','fixture-game'))).keeperGoalsAgainst.k1,10);
  assert.deepEqual(errors,[]);console.log('PASS',width,'editor, goals, keepers, independent IndexedDB bidirectional, offline pending, preserved plan');
  await context.close();
 }
} finally {await browser.close();}
