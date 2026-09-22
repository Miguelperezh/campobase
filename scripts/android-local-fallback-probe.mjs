import { chromium, devices } from 'playwright';
import { spawn } from 'node:child_process';

const server = spawn('python3', ['-m','http.server','4173','--bind','127.0.0.1'], {stdio:['ignore','ignore','inherit']});
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
for(let i=0;i<60;i++){
  try{const r=await fetch('http://127.0.0.1:4173/index.html');if(r.ok)break;}catch{}
  await sleep(250);
}

const browser = await chromium.launch();
const context = await browser.newContext({...devices['Pixel 7']});
const page = await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push('pageerror:'+e.message));
page.on('console',m=>{ if(m.type()==='error') errors.push('console:'+m.text()); });

await page.goto('http://127.0.0.1:4173/index.html?androidLocalFallback=1',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForFunction(()=>Boolean(window.__campobase?.state),null,{timeout:30000});
await page.waitForTimeout(5000);

let role=await page.evaluate(()=>window.__campobase?.state?.role||'');
if(role!=='demo'){
  await page.evaluate(()=>document.getElementById('auth-demo-btn')?.click());
  await page.waitForFunction(()=>window.__campobase?.state?.role==='demo',null,{timeout:20000});
}
await page.waitForTimeout(2000);
await page.evaluate(()=>window.__campobase.showView('ejercicios'));
await page.waitForSelector('[data-exercise-id="f7-126"]',{timeout:30000});
await page.evaluate(()=>window.__campobase.showExerciseDetail('f7-126'));
await page.waitForSelector('#exercise-detail-dialog[open] .frame-video',{timeout:30000});

const before=await page.evaluate(()=>{
 const v=document.querySelector('#exercise-detail-dialog[open] .frame-video');
 return {dataSrc:v?.dataset.src||'',src:v?.src||'',ua:navigator.userAgent};
});

await page.evaluate(()=>document.querySelector('#exercise-detail-dialog[open] .v-btn-play')?.click());
await page.waitForTimeout(7000);

const after=await page.evaluate(()=>{
 const v=document.querySelector('#exercise-detail-dialog[open] .frame-video');
 return {
   dataSrc:v?.dataset.src||'',src:v?.src||'',currentSrc:v?.currentSrc||'',
   paused:v?.paused,currentTime:v?.currentTime,readyState:v?.readyState,networkState:v?.networkState,
   error:v?.error?{code:v.error.code,message:v.error.message}:null,
   fallbackUsed:v?.dataset.supabaseFallbackUsed||''
 };
});
console.log(JSON.stringify({before,after,errors},null,2));

await browser.close();
server.kill('SIGTERM');
if(!/supabase\.co\/storage\/v1\/object\/public\/ejercicio-videos\//.test(before.dataSrc)) process.exit(3);
if(after.error || after.paused || Number(after.currentTime||0)<1) process.exit(2);
