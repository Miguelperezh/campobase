import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {pathToFileURL} from 'node:url';

const runtimeModule=process.env.PLAYWRIGHT_MODULE || path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs');
const {chromium}=await import('playwright-core').catch(()=>import(pathToFileURL(runtimeModule).href));
const source=path.resolve(process.env.CAMPOBASE_PREVIEW_ROOT || '.');
const chrome=process.env.CHROME_BIN || (process.platform==='darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined);
// demo-session imports page decorators that require the full app DOM. This
// fixture exercises the real DB/auth/domain modules without those renderers.
const decorators=new Set(['calendar-substitutions-entry','session-visual-planner','session-materials','session-top-actions','session-picker-compat','session-planner-ui','attendance-linked-sources','player-data-sync','attendance-history-responsive','today-dashboard'].map(name=>`/js/${name}.js`));
let browser;
try {
 browser=await chromium.launch({executablePath:chrome,headless:true});
 for(const width of [1440,390]) {
  const context=await browser.newContext({viewport:{width,height:844},serviceWorkers:'block'}),errors=[],external=[];
  await context.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.origin!=='https://campobase.test'){external.push(url.origin);return route.abort();}
   if(decorators.has(url.pathname))return route.fulfill({status:200,body:'export {};',contentType:'text/javascript'});
   const file=path.resolve(source,'.'+decodeURIComponent(url.pathname));
   if(!file.startsWith(source+path.sep))return route.fulfill({status:403,body:''});
   try {return route.fulfill({status:200,body:await fs.readFile(file),contentType:file.endsWith('.html')?'text/html':file.endsWith('.js')||file.endsWith('.mjs')?'text/javascript':'application/octet-stream'});}
   catch{return route.fulfill({status:404,body:''});}
  });
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  await page.goto('https://campobase.test/tests/fixtures/pilot-database-isolation.html');
  await page.waitForFunction(()=>typeof window.runPilotDatabaseCases==='function');
  const result=await page.evaluate(()=>window.runPilotDatabaseCases());
  assert.ok(result.checks>=27,`Faltan casos de protección a ${width}px`);
  await page.reload();await page.waitForFunction(()=>typeof window.reopenPilotRecovery==='function');
  assert.deepEqual(await page.evaluate(()=>window.reopenPilotRecovery()),{before:'after',current:'before'});
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  console.log(`PASS ${width}px: ${result.checks} comprobaciones IndexedDB A/B, PIN/rol, colas, importación atómica y respaldo recuperado tras recarga; 0 solicitudes externas.`);
  await context.close();
 }
} finally {await browser?.close();}
