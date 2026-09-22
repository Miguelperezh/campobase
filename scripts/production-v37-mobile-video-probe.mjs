import { chromium, devices } from 'playwright';

const EXPECTED_BUILD = '20260922-releases-mobile-all-v37';
const APP = 'https://miguelperezh.github.io/campobase/';
const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ ...devices['Pixel 7'] });
const page = await context.newPage();

const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
let build='';
for(let attempt=1; attempt<=40; attempt++){
  await page.goto(APP+'?prodV37Probe='+Date.now(), {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(1500);
  build=await page.evaluate(()=>window.__CAMPOBASE_BUILD||'').catch(()=> '');
  console.log('build attempt',attempt,build);
  if(build===EXPECTED_BUILD) break;
  await sleep(5000);
}
if(build!==EXPECTED_BUILD){
  console.error('Expected build not deployed', {expected:EXPECTED_BUILD,actual:build});
  await browser.close();
  process.exit(4);
}

await page.waitForFunction(()=>Boolean(window.__campobase?.state),null,{timeout:30000});
let role=await page.evaluate(()=>window.__campobase?.state?.role||'');
if(role!=='demo'){
  await page.evaluate(()=>document.getElementById('auth-demo-btn')?.click());
  await page.waitForFunction(()=>window.__campobase?.state?.role==='demo',null,{timeout:20000});
}
await page.waitForTimeout(2000);
await page.evaluate(()=>window.__campobase.showView('ejercicios'));

const results=[];
for(const id of ['f7-082','f7-126']){
  await page.waitForSelector(`[data-exercise-id="${id}"]`,{timeout:30000});
  await page.evaluate((exerciseId)=>window.__campobase.showExerciseDetail(exerciseId),id);
  await page.waitForSelector('#exercise-detail-dialog[open] .frame-video',{timeout:30000});
  const before=await page.evaluate(()=>{
    const v=document.querySelector('#exercise-detail-dialog[open] .frame-video');
    return {dataSrc:v?.dataset.src||'',src:v?.src||'',paused:v?.paused,currentTime:v?.currentTime};
  });
  await page.evaluate(()=>document.querySelector('#exercise-detail-dialog[open] .v-btn-play')?.click());
  await page.waitForTimeout(4500);
  const after=await page.evaluate(()=>{
    const v=document.querySelector('#exercise-detail-dialog[open] .frame-video');
    return {
      dataSrc:v?.dataset.src||'',currentSrc:v?.currentSrc||'',paused:v?.paused,
      currentTime:v?.currentTime,readyState:v?.readyState,networkState:v?.networkState,
      error:v?.error?{code:v.error.code,message:v.error.message}:null
    };
  });
  results.push({id,before,after});
  await page.evaluate(()=>document.getElementById('exercise-detail-dialog')?.close());
  await page.waitForTimeout(300);
}

console.log(JSON.stringify({build,results},null,2));
await browser.close();

for(const r of results){
  if(!/-mobile\.mp4(?:$|[?#])/.test(r.before.dataSrc)){
    console.error('Not using mobile asset',r.id,r.before.dataSrc);
    process.exit(5);
  }
  if(r.after.error || r.after.paused || Number(r.after.currentTime||0)<1){
    console.error('Video did not play',r.id,r.after);
    process.exit(6);
  }
}
