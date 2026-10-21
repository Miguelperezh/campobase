import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';

const base = process.env.CAMPOBASE_TEST_URL || 'http://127.0.0.1:4227';
const fixturePath = '/tests/fixtures/postgame-save-guard.html';
const wrapperPath = '/__postgame-save-guard-db__.js';
const wrapper = `
import * as real from '/js/db.js?postgameGuardReal=1';
export * from '/js/db.js?postgameGuardReal=1';
export async function getAll(store) {
  const records = await real.getAll(store);
  if (window.__guard?.armed === 'read') await window.__guard.hold('read');
  return records;
}
export async function putBatch(batch, options) {
  window.__guard?.attempts.push(structuredClone(batch));
  if (window.__guard?.armed === 'batch') await window.__guard.hold('batch');
  return real.putBatch(batch, options);
}
`;
const fixture = `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Postpartido: guardias de guardado aisladas</title>
<style>body{font:16px sans-serif}dialog{box-sizing:border-box}label{display:grid;gap:4px}button,input,select,textarea{padding:8px;box-sizing:border-box}fieldset{margin:10px 0}</style>
<script type="importmap">{"imports":{"/js/db.js":"${wrapperPath}"}}</script>
<body><div id="matches-list"><button class="edit-match-performance" data-id="guard-match-a">Editar A</button><button class="edit-match-performance" data-id="guard-match-b">Editar B</button></div><div id="players-list"></div><div id="toast" class="hidden"></div>
<script type="module">
import * as db from '/js/db.js?postgameGuardReal=1';
import * as auth from '/js/auth-manager.js';
import '/js/match-postgame-editor.js?postgameGuardUi=1';
window.__campobase={state:{role:'owner'},refresh:async()=>{},renderAll:()=>{},synchronizeCloud:async()=>({online:false,pending:0})};
window.__guard={armed:null,entered:null,attempts:[],release:null,
  arm(kind){this.armed=kind;this.entered=null;this.attempts=[];this.release=null;},
  hold(kind){this.armed=null;this.entered=kind;return new Promise(resolve=>{this.release=resolve;});}
};
const completed=transaction=>new Promise((resolve,reject)=>{transaction.oncomplete=resolve;transaction.onerror=()=>reject(transaction.error);transaction.onabort=()=>reject(transaction.error);});
const value=request=>new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
const identities=[crypto.randomUUID(),crypto.randomUUID()], databases=[];
db.configureCloudStore(null);
for(const identity of identities){
  auth.setBoundSaasUserId(identity);db.configureRealDatabase();
  const database=await db.openDatabase();databases.push(database);
  const transaction=database.transaction(['players','matches','callups','settings'],'readwrite');
  transaction.objectStore('players').put({id:'guard-k',name:'Portero de prueba',number:1,positions:['Portero']});
  transaction.objectStore('players').put({id:'guard-p',name:'Jugador de prueba',number:7,positions:['Central']});
  for(const suffix of ['a','b']){
    const id='guard-match-'+suffix;
    transaction.objectStore('matches').put({id,opponent:'Rival '+suffix,type:'league',format:'F7',status:'finished',completed:true,closedAt:1234,
      date:'2026-10-20T19:00:00',goalsFor:0,goalsAgainst:0,goals:[],minuteTotals:{'guard-k':0,'guard-p':600},ratings:{'guard-p':3},
      keeperGoalsAgainst:{'guard-k':0},comments:'Original '+suffix,ownerMarker:identity,callupId:'guard-callup-'+suffix});
    transaction.objectStore('callups').put({id:'guard-callup-'+suffix,matchId:id,availableIds:['guard-k','guard-p'],completed:true,closedAt:1234,format:'F7'});
  }
  transaction.objectStore('settings').put({id:'main',colors:{preserved:true},ownerMarker:identity});
  await completed(transaction);
}
auth.setBoundSaasUserId(identities[0]);db.configureRealDatabase();
window.fixture={
  async snapshot(){
    const result=[];
    for(const database of databases){
      const transaction=database.transaction(['players','matches','callups','settings','trainings','syncQueue'],'readonly');
      const done=completed(transaction);
      const rows=await Promise.all(['players','matches','callups','settings','trainings','syncQueue'].map(async store=>[store,(await value(transaction.objectStore(store).getAll())).sort((a,b)=>String(a.id).localeCompare(String(b.id)))]));
      await done;result.push(Object.fromEntries(rows));
    }
    return result;
  },
  switchAccount(){auth.setBoundSaasUserId(identities[1]);db.configureRealDatabase();},
  switchPin(){auth.lockPinAccess();},
  reset(){document.querySelector('#postgame-performance-dialog')?.close();auth.setBoundSaasUserId(identities[0]);db.configureRealDatabase();window.__campobase.state.role='owner';window.__guard.armed=null;window.__guard.entered=null;window.__guard.attempts=[];},
};
window.fixtureReady=true;
</script></body></html>`;

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true, args: ['--no-sandbox'] });
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
    const page = await context.newPage(), errors = [], externalRequests = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('**/*', (route) => {
      const url = new URL(route.request().url());
      if (url.hostname !== '127.0.0.1') { externalRequests.push(url.origin); return route.abort(); }
      if (url.pathname === fixturePath) return route.fulfill({ contentType: 'text/html', body: fixture });
      if (url.pathname === wrapperPath) return route.fulfill({ contentType: 'application/javascript', body: wrapper });
      // Background decorators/stat reconciliation are unrelated to this editor
      // race and would independently write derived player totals in the fixture.
      if (/\/js\/(completed-events-ui|session-visual-planner|session-planner-ui|player-data-sync)\.js/.test(url.pathname)) return route.fulfill({ contentType: 'application/javascript', body: 'export {};' });
      return route.continue();
    });
    await page.goto(base + fixturePath);
    await page.waitForFunction(() => window.fixtureReady);
    const dialog = page.locator('#postgame-performance-dialog');
    const open = async (id) => {
      await page.locator(`#matches-list [data-id="guard-match-${id}"]`).click();
      await dialog.waitFor({ state: 'visible' });
      await page.waitForFunction((id) => document.querySelector('#postgame-performance-dialog').dataset.matchId === `guard-match-${id}`, id);
    };
    const beginHeldSave = async (stage) => {
      await page.evaluate(() => fixture.reset());
      await open('a');
      await page.locator('#postgame-match-comment').fill('Borrador A pendiente');
      await page.evaluate((stage) => __guard.arm(stage), stage);
      await dialog.locator('form').evaluate((form) => form.requestSubmit());
      await page.waitForFunction((stage) => window.__guard.entered === stage, stage);
    };
    for (const stage of ['read', 'batch']) {
      const before = await page.evaluate(() => fixture.snapshot());
      await beginHeldSave(stage);
      await dialog.locator('[data-close-postgame]').first().click();
      await open('b');
      await page.locator('#postgame-match-comment').fill('Borrador B independiente');
      await page.evaluate(() => __guard.release());
      // The old promise's finally must not reset or close the new editor.
      await page.waitForTimeout(150);
      assert.equal(await dialog.evaluate((node) => node.open), true);
      assert.equal(await dialog.getAttribute('data-match-id'), 'guard-match-b');
      assert.equal(await page.locator('#postgame-match-comment').inputValue(), 'Borrador B independiente');
      assert.equal(await dialog.locator('[type=submit]').isEnabled(), true);
      assert.equal(await dialog.locator('[data-save-error]').count(), 0);
      assert.deepEqual(await page.evaluate(() => fixture.snapshot()), before, `${stage}: cerrar A y abrir B conserva ambas bases y sus colas`);
      const attempts = await page.evaluate(() => __guard.attempts);
      assert.equal(attempts.length, stage === 'batch' ? 1 : 0);
      if (attempts.length) {
        assert.equal(attempts[0].matches[0].id, 'guard-match-a');
        assert.equal(attempts[0].matches[0].comments, 'Borrador A pendiente');
      }
    }
    for (const change of ['account', 'pin', 'role']) {
      const before = await page.evaluate(() => fixture.snapshot());
      await beginHeldSave('batch');
      await page.evaluate((change) => {
        if (change === 'account') fixture.switchAccount();
        if (change === 'pin') fixture.switchPin();
        if (change === 'role') window.__campobase.state.role = 'delegate';
        __guard.release();
      }, change);
      await dialog.locator('[data-save-error]').waitFor({ state: 'visible' });
      assert.match(await dialog.locator('[data-save-error]').textContent(), /cuenta ha cambiado/);
      assert.equal(await page.locator('#postgame-match-comment').inputValue(), 'Borrador A pendiente');
      assert.deepEqual(await page.evaluate(() => fixture.snapshot()), before, `${change}: el lote retenido no modifica datos ni colas de ninguna cuenta`);
    }
    // A valid save still works after the rejected attempts: the guard is not a blanket write block.
    await page.evaluate(() => fixture.reset());
    const beforeControl = await page.evaluate(() => fixture.snapshot());
    await open('a');
    await page.locator('#postgame-match-comment').fill('Control guardado correctamente');
    await dialog.locator('[type=submit]').click();
    await page.waitForFunction(() => !document.querySelector('#postgame-performance-dialog').open);
    const afterControl = await page.evaluate(() => fixture.snapshot());
    assert.equal(afterControl[0].matches.find((match) => match.id === 'guard-match-a').comments, 'Control guardado correctamente');
    assert.deepEqual(afterControl[0].matches.find((match) => match.id === 'guard-match-b'), beforeControl[0].matches.find((match) => match.id === 'guard-match-b'));
    assert.deepEqual(afterControl[1], beforeControl[1]);
    assert.deepEqual(errors, []);
    assert.deepEqual(externalRequests, []);
    await context.close();
    console.log('PASS', width, 'borradores A/B aislados durante lectura/lote; cambio de cuenta/PIN/rol rechazado; IndexedDB y colas intactas, guardado válido permitido');
  }
} finally {
  await browser.close();
}
