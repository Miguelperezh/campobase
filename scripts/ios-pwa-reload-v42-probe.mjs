import { webkit, devices } from 'playwright';
import { spawn } from 'node:child_process';

const BASE='http://127.0.0.1:4182';
const server=spawn('python3',['-m','http.server','4182','--bind','127.0.0.1'],{stdio:['ignore','ignore','inherit']});
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));

async function waitServer(){
  for(let i=0;i<80;i++){try{const r=await fetch(BASE+'/index.html',{cache:'no-store'});if(r.ok)return;}catch{} await sleep(250);}
  throw new Error('server not ready');
}
async function forceStandalone(page){
  await page.addInitScript(()=>{
    try{Object.defineProperty(navigator,'standalone',{configurable:true,get:()=>true});}catch{}
    const native=window.matchMedia.bind(window);
    window.matchMedia=(q)=>{
      const r=native(q);
      if(q==='(display-mode: standalone)'){
        return {matches:true,media:q,onchange:null,
          addListener:r.addListener?.bind(r),removeListener:r.removeListener?.bind(r),
          addEventListener:r.addEventListener?.bind(r),removeEventListener:r.removeEventListener?.bind(r),
          dispatchEvent:r.dispatchEvent?.bind(r)};
      }
      return r;
    };
  });
}
async function enterDemo(page){
  await page.goto(BASE+'/index.html?reloadV42=1',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>Boolean(window.__campobase?.state),null,{timeout:30000});
  if(await page.evaluate(()=>window.__campobase?.state?.role)!=='demo'){
    await page.evaluate(()=>document.getElementById('auth-demo-btn')?.click());
    await page.waitForFunction(()=>window.__campobase?.state?.role==='demo',null,{timeout:30000});
  }
}
async function openExercise(page){
  await page.evaluate(()=>window.__campobase.showView('ejercicios'));
  const preview=await page.waitForSelector('article.exercise-v2-card img[src*="f7-126.png"]',{timeout:30000});
  const id=await preview.evaluate(img=>img.closest('article[data-exercise-id]')?.dataset.exerciseId||'');
  await page.waitForTimeout(1500);
  await page.evaluate(id=>window.__campobase.showExerciseDetail(id),id);
  await page.waitForFunction(()=>Boolean(document.querySelector('#exercise-detail-dialog .frame-video')&&document.querySelector('#exercise-detail-dialog .v-btn-play')),null,{timeout:20000});
}

let browser;
try{
  await waitServer();
  browser=await webkit.launch({headless:true});
  const context=await browser.newContext({...devices['iPhone 13'],serviceWorkers:'block'});
  const page=await context.newPage();
  await forceStandalone(page);
  await enterDemo(page);
  await openExercise(page);

  await page.waitForFunction(()=>{
    const v=document.querySelector('#exercise-detail-dialog .frame-video');
    return Boolean(v&&v.readyState>=1&&Number(v.duration)>0);
  },null,{timeout:25000});

  const preload=await page.evaluate(()=>{
    const v=document.querySelector('#exercise-detail-dialog .frame-video');
    return {src:v.currentSrc||v.src||'',dataSrc:v.dataset.src||'',readyState:v.readyState,duration:v.duration};
  });
  console.log('PRELOAD_OK',JSON.stringify(preload));

  await page.evaluate(()=>{
    const v=document.querySelector('#exercise-detail-dialog .frame-video');
    v.pause();
    v.src='./definitely-missing-video-v42.mp4';
    v.load();
  });
  await page.waitForFunction(()=>{
    const v=document.querySelector('#exercise-detail-dialog .frame-video');
    return Boolean(v&&(v.networkState===HTMLMediaElement.NETWORK_NO_SOURCE||v.error));
  },null,{timeout:15000});

  const broken=await page.evaluate(()=>{
    const v=document.querySelector('#exercise-detail-dialog .frame-video');
    return {src:v.currentSrc||v.src||'',dataSrc:v.dataset.src||'',readyState:v.readyState,networkState:v.networkState,error:v.error?{code:v.error.code,message:v.error.message}:null};
  });
  console.log('BROKEN_STATE',JSON.stringify(broken));

  await page.locator('#exercise-detail-dialog .v-btn-play').tap();
  await page.waitForTimeout(6000);

  const recovered=await page.evaluate(()=>{
    const v=document.querySelector('#exercise-detail-dialog .frame-video');
    return {src:v.currentSrc||v.src||'',paused:v.paused,currentTime:v.currentTime||0,readyState:v.readyState,networkState:v.networkState,error:v.error?{code:v.error.code,message:v.error.message}:null};
  });
  console.log('RECOVERED',JSON.stringify(recovered));

  if(recovered.error||recovered.paused||recovered.currentTime<=1) throw new Error('No recuperó reproducción: '+JSON.stringify(recovered));
  if(!recovered.src.includes('_cbv=20260923-ios-pwa-video-reload-v42')) throw new Error('No renovó URL v42: '+recovered.src);
  await context.close();
}finally{
  if(browser) await browser.close().catch(()=>{});
  server.kill('SIGTERM');
}
