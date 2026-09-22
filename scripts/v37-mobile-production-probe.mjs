import { chromium, devices } from 'playwright';

const EXERCISES=['f7-126','f7-082','f7-084'];
const browser=await chromium.launch({channel:'chrome'});
const context=await browser.newContext({...devices['Pixel 7']});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push('pageerror:'+e.message));
page.on('console',m=>{ if(m.type()==='error') errors.push('console:'+m.text()); });

await page.goto('https://miguelperezh.github.io/campobase/?prodV37Probe=1',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForFunction(()=>Boolean(window.__campobase?.state),null,{timeout:30000});
await page.waitForTimeout(4000);

let role=await page.evaluate(()=>window.__campobase?.state?.role||'');
if(role!=='demo'){
  await page.evaluate(()=>document.getElementById('auth-demo-btn')?.click());
  await page.waitForFunction(()=>window.__campobase?.state?.role==='demo',null,{timeout:20000});
}
await page.waitForTimeout(2500);
const build=await page.evaluate(()=>window.__CAMPOBASE_BUILD||'');
const sw=await page.evaluate(()=>navigator.serviceWorker?.controller?.scriptURL||'');

const results=[];
for(const id of EXERCISES){
  await page.evaluate(()=>window.__campobase.showView('ejercicios'));
  await page.waitForSelector(`[data-exercise-id="${id}"]`,{timeout:30000});
  await page.evaluate((exerciseId)=>window.__campobase.showExerciseDetail(exerciseId),id);
  await page.waitForSelector('#exercise-detail-dialog[open] .frame-video',{timeout:30000});
  const before=await page.evaluate(()=>{
    const v=document.querySelector('#exercise-detail-dialog[open] .frame-video');
    return {dataSrc:v?.dataset.src||'',src:v?.src||''};
  });
  await page.evaluate(()=>document.querySelector('#exercise-detail-dialog[open] .v-btn-play')?.click());
  await page.waitForTimeout(4000);
  const after=await page.evaluate(()=>{
    const v=document.querySelector('#exercise-detail-dialog[open] .frame-video');
    return {
      currentSrc:v?.currentSrc||v?.src||'',
      currentTime:v?.currentTime||0,
      paused:v?.paused,
      readyState:v?.readyState,
      error:v?.error?{code:v.error.code,message:v.error.message}:null
    };
  });
  results.push({id,before,after});
  await page.evaluate(()=>{
    const d=document.getElementById('exercise-detail-dialog');
    if(d?.open)d.close();
  });
  await page.waitForTimeout(350);
}
console.log(JSON.stringify({build,sw,results,errors},null,2));
await browser.close();

if(!build.includes('releases-mobile-all-v37')) process.exit(21);
for(const r of results){
  if(!/-mobile\.mp4(?:$|[?#])/.test(r.before.dataSrc)) process.exit(22);
  if(r.after.error || r.after.paused || Number(r.after.currentTime)<1) process.exit(23);
}
