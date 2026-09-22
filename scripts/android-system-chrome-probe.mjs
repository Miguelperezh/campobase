import { chromium, devices } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({...devices['Pixel 7']});
const page = await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push('pageerror:'+e.message));
page.on('console',m=>{ if(m.type()==='error') errors.push('console:'+m.text()); });

await page.goto('https://miguelperezh.github.io/campobase/?chromeH264Probe=1',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForFunction(()=>Boolean(window.__campobase?.state),null,{timeout:30000});
await page.waitForTimeout(5000);
let role=await page.evaluate(()=>window.__campobase?.state?.role||'');
if(role!=='demo'){
  await page.evaluate(()=>document.getElementById('auth-demo-btn')?.click());
  await page.waitForFunction(()=>window.__campobase?.state?.role==='demo',null,{timeout:20000});
}
await page.waitForTimeout(2500);
await page.evaluate(()=>window.__campobase.showView('ejercicios'));
await page.waitForSelector('[data-exercise-id="f7-126"]',{timeout:30000});
await page.evaluate(()=>window.__campobase.showExerciseDetail('f7-126'));
await page.waitForSelector('#exercise-detail-dialog[open] .frame-video',{timeout:30000});

const codec=await page.evaluate(()=>({
  h264: document.createElement('video').canPlayType('video/mp4; codecs="avc1.640028"'),
  mp4: document.createElement('video').canPlayType('video/mp4'),
  ua:navigator.userAgent
}));

await page.evaluate(()=>document.querySelector('#exercise-detail-dialog[open] .v-btn-play')?.click());
await page.waitForTimeout(7000);
const state=await page.evaluate(()=>{
 const v=document.querySelector('#exercise-detail-dialog[open] .frame-video');
 return {src:v?.currentSrc||v?.src||'',dataSrc:v?.dataset.src||'',paused:v?.paused,currentTime:v?.currentTime,readyState:v?.readyState,networkState:v?.networkState,error:v?.error?{code:v.error.code,message:v.error.message}:null};
});
console.log(JSON.stringify({codec,state,errors},null,2));
await browser.close();

if(!codec.h264) process.exit(11);
if(state.error || state.paused || Number(state.currentTime||0)<1) process.exit(2);
