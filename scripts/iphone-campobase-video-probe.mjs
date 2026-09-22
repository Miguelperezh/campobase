import { webkit, devices } from 'playwright';
import { spawn } from 'node:child_process';

const server = spawn('python3', ['-m','http.server','4173','--bind','127.0.0.1'], {stdio:['ignore','ignore','inherit']});
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
for(let i=0;i<60;i++){
  try{const r=await fetch('http://127.0.0.1:4173/index.html');if(r.ok)break;}catch{}
  await sleep(250);
}

const browser=await webkit.launch();
const context=await browser.newContext({...devices['iPhone 15']});
const page=await context.newPage();
await page.addInitScript(() => {
  try {
    sessionStorage.setItem('campobase.forceCurrentBuild', '20260921-cloud-recovery-v32');
  } catch {}
});
const errors=[];
page.on('pageerror',e=>errors.push('pageerror:'+e.message));
page.on('console',m=>{ if(m.type()==='error') errors.push('console:'+m.text()); });

await page.goto('http://127.0.0.1:4173/index.html?browserSmoke=1',{waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>Boolean(window.__campobase?.state),null,{timeout:20000});
const isDemo=await page.evaluate(()=>window.__campobase?.state?.role==='demo');
if(!isDemo){
  await page.evaluate(()=>document.getElementById('auth-demo-btn')?.click());
  await page.waitForFunction(()=>window.__campobase?.state?.role==='demo',null,{timeout:20000});
}
await page.evaluate(()=>window.__campobase.showView('ejercicios'));
await page.waitForSelector('[data-exercise-id="f7-126"]',{timeout:20000});
await page.evaluate(()=>window.__campobase.showExerciseDetail('f7-126'));
await page.waitForSelector('#exercise-detail-dialog[open] .frame-video',{timeout:20000});

const before=await page.evaluate(()=>{
 const v=document.querySelector('#exercise-detail-dialog[open] .frame-video');
 window.__probeVideo=v;
 window.__probeTimeline=[];
 const snap=(label)=>{
   const current=document.querySelector('#exercise-detail-dialog[open] .frame-video');
   window.__probeTimeline.push({
     label,
     savedConnected:Boolean(window.__probeVideo?.isConnected),
     sameElement:current===window.__probeVideo,
     savedPaused:window.__probeVideo?.paused,
     savedTime:window.__probeVideo?.currentTime,
     currentPaused:current?.paused,
     currentTime:current?.currentTime,
     currentSrc:current?.src||'',
   });
 };
 snap('before-click');
 document.querySelector('#exercise-detail-dialog[open] .v-btn-play')?.click();
 setTimeout(()=>snap('50ms'),50);
 setTimeout(()=>snap('250ms'),250);
 setTimeout(()=>snap('1s'),1000);
 setTimeout(()=>snap('3s'),3000);
 setTimeout(()=>snap('7s'),7000);
 return {src:v?.src||'',dataSrc:v?.dataset.src||'',readyState:v?.readyState,paused:v?.paused,currentTime:v?.currentTime};
});
await page.waitForTimeout(8000);
const after=await page.evaluate(()=>{
 const v=document.querySelector('#exercise-detail-dialog[open] .frame-video');
 return {
   src:v?.src||'',dataSrc:v?.dataset.src||'',readyState:v?.readyState,
   networkState:v?.networkState,paused:v?.paused,currentTime:v?.currentTime,
   duration:v?.duration,error:v?.error?{code:v.error.code,message:v.error.message}:null,
   button:document.querySelector('#exercise-detail-dialog[open] .v-btn-play')?.textContent,
   savedConnected:Boolean(window.__probeVideo?.isConnected),
   savedPaused:window.__probeVideo?.paused,
   savedTime:window.__probeVideo?.currentTime,
   sameElement:v===window.__probeVideo,
   timeline:window.__probeTimeline||[],
 };
});
console.log(JSON.stringify({before,after,errors},null,2));

await browser.close();
server.kill('SIGTERM');
if(after.error || after.currentTime<1 || after.paused || !after.sameElement) process.exit(2);
