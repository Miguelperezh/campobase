import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {pathToFileURL} from 'node:url';
const runtimeModule=process.env.PLAYWRIGHT_MODULE || path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs');
const {chromium}=await import('playwright-core').catch(()=>import(pathToFileURL(runtimeModule).href));
const root=path.resolve(process.env.CAMPOBASE_PREVIEW_ROOT || '.');
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN || (process.platform==='darwin'?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined),headless:true});
try {
 for(const width of [1440,390]) {
  const context=await browser.newContext({viewport:{width,height:844},serviceWorkers:'block'}),errors=[],remote=[];
  await context.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.origin!=='https://campobase.test'){remote.push(url.origin);return route.abort();}
   const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
   if(!file.startsWith(root+path.sep))return route.fulfill({status:403,body:''});
   try{return route.fulfill({status:200,body:await fs.readFile(file),contentType:file.endsWith('.html')?'text/html':file.endsWith('.js')||file.endsWith('.mjs')?'text/javascript':'application/octet-stream'});}
   catch{return route.fulfill({status:404,body:''});}
  });
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  await page.goto('https://campobase.test/tests/fixtures/sync-diagnostics.html');
  await page.waitForFunction(()=>typeof window.runSyncDiagnosticCases==='function');
  const result=await page.evaluate(()=>window.runSyncDiagnosticCases());
  assert.equal(result.checks,18);assert.deepEqual(errors,[]);assert.deepEqual(remote,[]);
  console.log(`PASS ${width}px: ${result.checks} comprobaciones de diagnóstico A/B, demo y guardado condicionado con IndexedDB real; 0 solicitudes externas.`);
  await context.close();
 }
} finally {await browser.close();}
