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
await page.waitForSelector('#exercise-dialog[open] .frame-video',{timeout:20000});

const before=await page.evaluate(()=>{
 const v=document.querySelector('#exercise-dialog[open] .frame-video');
 return {src:v?.src||'',dataSrc:v?.dataset.src||'',readyState:v?.readyState,paused:v?.paused,currentTime:v?.currentTime};
});
await page.click('#exercise-dialog[open] .v-btn-play');
await page.waitForTimeout(8000);
const after=await page.evaluate(()=>{
 const v=document.querySelector('#exercise-dialog[open] .frame-video');
 return {
   src:v?.src||'',dataSrc:v?.dataset.src||'',readyState:v?.readyState,
   networkState:v?.networkState,paused:v?.paused,currentTime:v?.currentTime,
   duration:v?.duration,error:v?.error?{code:v.error.code,message:v.error.message}:null,
   button:document.querySelector('#exercise-dialog[open] .v-btn-play')?.textContent
 };
});
console.log(JSON.stringify({before,after,errors},null,2));

await browser.close();
server.kill('SIGTERM');
if(after.error || after.currentTime<1 || after.paused) process.exit(2);
