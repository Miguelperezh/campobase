import { chromium, devices } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({
  ...devices['Pixel 7'],
});
const page = await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push('pageerror:'+e.message));
page.on('console',m=>{ if(m.type()==='error') errors.push('console:'+m.text()); });

await page.goto('https://miguelperezh.github.io/campobase/?androidVideoProbe=1',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForFunction(()=>Boolean(window.__campobase?.state),null,{timeout:30000});
await page.waitForTimeout(5000);

let role=await page.evaluate(()=>window.__campobase?.state?.role||'');
if(role!=='demo'){
  await page.evaluate(()=>document.getElementById('auth-demo-btn')?.click());
  await page.waitForFunction(()=>window.__campobase?.state?.role==='demo',null,{timeout:20000});
}
await page.waitForTimeout(3000);
await page.evaluate(()=>window.__campobase.showView('ejercicios'));
await page.waitForSelector('[data-exercise-id="f7-126"]',{timeout:30000});
await page.evaluate(()=>window.__campobase.showExerciseDetail('f7-126'));
await page.waitForSelector('#exercise-detail-dialog[open] .frame-video',{timeout:30000});

const sw=await page.evaluate(()=>({
  controlled:Boolean(navigator.serviceWorker?.controller),
  controller:navigator.serviceWorker?.controller?.scriptURL||'',
  build:window.__CAMPOBASE_BUILD||'',
  ua:navigator.userAgent
}));

const result=await page.evaluate(async()=>{
 const v=document.querySelector('#exercise-detail-dialog[open] .frame-video');
 const button=document.querySelector('#exercise-detail-dialog[open] .v-btn-play');
 const timeline=[];
 const snap=(label)=>timeline.push({
   label,connected:Boolean(v?.isConnected),paused:v?.paused,currentTime:v?.currentTime,
   readyState:v?.readyState,networkState:v?.networkState,src:v?.src||'',dataSrc:v?.dataset.src||'',
   error:v?.error?{code:v.error.code,message:v.error.message}:null,
   button:button?.textContent||''
 });
 snap('before');
 button?.click();
 for(const [label,ms] of [['250ms',250],['1s',750],['3s',2000],['7s',4000]]){
   await new Promise(r=>setTimeout(r,ms)); snap(label);
 }
 return {timeline,final:timeline.at(-1)};
});
console.log(JSON.stringify({sw,result,errors},null,2));

await browser.close();
const f=result.final;
if(!f?.connected || f?.paused || Number(f?.currentTime||0)<1 || f?.error) process.exit(2);
