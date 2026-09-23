import { chromium, devices } from 'playwright';

const browser=await chromium.launch({channel:'chrome'});
const context=await browser.newContext({...devices['Pixel 7']});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push('pageerror:'+e.message));
page.on('console',m=>{ if(m.type()==='error') errors.push('console:'+m.text()); });

await page.goto('https://miguelperezh.github.io/campobase/?prodMobileV39=1',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForFunction(()=>Boolean(window.__campobase?.state),null,{timeout:30000});
await page.waitForTimeout(5000);

let role=await page.evaluate(()=>window.__campobase?.state?.role||'');
if(role!=='demo'){
  await page.evaluate(()=>document.getElementById('auth-demo-btn')?.click());
  await page.waitForFunction(()=>window.__campobase?.state?.role==='demo',null,{timeout:20000});
}
await page.waitForTimeout(2500);
await page.evaluate(()=>window.__campobase.showView('ejercicios'));
await page.waitForSelector('[data-exercise-id="f7-127"]',{timeout:30000});
await page.evaluate(()=>window.__campobase.showExerciseDetail('f7-127'));
await page.waitForSelector('#exercise-detail-dialog[open] .frame-video',{timeout:30000});

const before=await page.evaluate(()=>{
  const v=document.querySelector('#exercise-detail-dialog[open] .frame-video');
  return {
    dataSrc:v?.dataset.src||'',
    src:v?.src||'',
    controlled:Boolean(navigator.serviceWorker?.controller),
    controller:navigator.serviceWorker?.controller?.scriptURL||'',
    build:window.__CAMPOBASE_BUILD||'',
    ua:navigator.userAgent,
  };
});
await page.evaluate(()=>document.querySelector('#exercise-detail-dialog[open] .v-btn-play')?.click());
await page.waitForTimeout(5000);
const after=await page.evaluate(()=>{
  const v=document.querySelector('#exercise-detail-dialog[open] .frame-video');
  return {
    currentSrc:v?.currentSrc||'',
    paused:v?.paused,
    currentTime:v?.currentTime,
    readyState:v?.readyState,
    networkState:v?.networkState,
    error:v?.error?{code:v.error.code,message:v.error.message}:null,
  };
});
console.log(JSON.stringify({before,after,errors},null,2));
await browser.close();

if(!/-mobile\.mp4(?:$|[?#])/.test(before.dataSrc)) process.exit(3);
if(after.error || after.paused || Number(after.currentTime||0)<1) process.exit(2);
