import { webkit, devices } from 'playwright';
import { spawn } from 'node:child_process';

const BASE='http://127.0.0.1:4181';
const MOBILE='https://github.com/Miguelperezh/campobase/releases/download/campobase-videos-v1/library-v2-preview__f7-126__ejercicio-mobile.mp4';
const server=spawn('python3',['-m','http.server','4181','--bind','127.0.0.1'],{stdio:['ignore','ignore','inherit']});
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));

async function waitServer(){
  for(let i=0;i<80;i++){
    try{const r=await fetch(BASE+'/index.html',{cache:'no-store'});if(r.ok)return;}catch{}
    await sleep(250);
  }
  throw new Error('server not ready');
}
async function enterDemo(page){
  await page.goto(BASE+'/index.html?iosPreload=1',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>Boolean(window.__campobase?.state),null,{timeout:30000});
  if(await page.evaluate(()=>window.__campobase?.state?.role)!=='demo'){
    await page.evaluate(()=>document.getElementById('auth-demo-btn')?.click());
    await page.waitForFunction(()=>window.__campobase?.state?.role==='demo',null,{timeout:30000});
  }
}
async function openF7126(page){
  await page.evaluate(()=>window.__campobase.showView('ejercicios'));
  const preview=await page.waitForSelector('article.exercise-v2-card img[src*="f7-126.png"]',{timeout:30000});
  const id=await preview.evaluate(img=>img.closest('article[data-exercise-id]')?.dataset.exerciseId||'');
  await page.waitForTimeout(2500);
  await page.evaluate(id=>window.__campobase.showExerciseDetail(id),id);
  await page.waitForFunction(()=>Boolean(document.querySelector('#exercise-detail-dialog .frame-video')),null,{timeout:20000});
}
function forceStandalone(page){
  return page.addInitScript(()=>{
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
let browser;
try{
  await waitServer();
  browser=await webkit.launch({headless:true});

  const pwaContext=await browser.newContext({...devices['iPhone 13'],serviceWorkers:'block'});
  const pwa=await pwaContext.newPage();
  await forceStandalone(pwa);
  await enterDemo(pwa);
  await openF7126(pwa);
  await pwa.waitForFunction(()=>{
    const v=document.querySelector('#exercise-detail-dialog .frame-video');
    return Boolean(v && v.getAttribute('src') && v.readyState>=1 && Number.isFinite(v.duration) && v.duration>0);
  },null,{timeout:25000});
  const pwaBefore=await pwa.evaluate(()=>{
    const v=document.querySelector('#exercise-detail-dialog .frame-video');
    return {src:v.currentSrc||v.src||'',attrSrc:v.getAttribute('src')||'',readyState:v.readyState,duration:v.duration,paused:v.paused,currentTime:v.currentTime||0};
  });
  console.log('PWA_BEFORE',JSON.stringify(pwaBefore));
  if(!pwaBefore.src.includes('-mobile.mp4')||pwaBefore.readyState<1||pwaBefore.duration<1) throw new Error('PWA no precargó metadata');

  await pwa.locator('#exercise-detail-dialog .v-btn-play').tap();
  await pwa.waitForTimeout(5000);
  const pwaAfter=await pwa.evaluate(()=>{
    const v=document.querySelector('#exercise-detail-dialog .frame-video');
    return {paused:v.paused,currentTime:v.currentTime||0,readyState:v.readyState,duration:v.duration,error:v.error?{code:v.error.code,message:v.error.message}:null};
  });
  console.log('PWA_AFTER',JSON.stringify(pwaAfter));
  if(pwaAfter.error||pwaAfter.paused||pwaAfter.currentTime<=1) throw new Error('PWA no reprodujo tras precarga');
  await pwaContext.close();

  const safariContext=await browser.newContext({...devices['iPhone 13'],serviceWorkers:'block'});
  const safari=await safariContext.newPage();
  await enterDemo(safari);
  await openF7126(safari);
  const safariBefore=await safari.evaluate(()=>{
    const v=document.querySelector('#exercise-detail-dialog .frame-video');
    return {attrSrc:v.getAttribute('src')||'',dataSrc:v.dataset.src||'',readyState:v.readyState};
  });
  console.log('SAFARI_BEFORE',JSON.stringify(safariBefore));
  if(safariBefore.attrSrc) throw new Error('Safari normal fue precargado por error');
  if(safariBefore.dataSrc!==MOBILE) throw new Error('Safari normal perdió variante móvil');
  await safari.locator('#exercise-detail-dialog .v-btn-play').tap();
  await safari.waitForTimeout(5000);
  const safariAfter=await safari.evaluate(()=>{
    const v=document.querySelector('#exercise-detail-dialog .frame-video');
    return {paused:v.paused,currentTime:v.currentTime||0,error:v.error?{code:v.error.code,message:v.error.message}:null};
  });
  console.log('SAFARI_AFTER',JSON.stringify(safariAfter));
  if(safariAfter.error||safariAfter.paused||safariAfter.currentTime<=1) throw new Error('Safari normal dejó de reproducir');
  await safariContext.close();
}finally{
  if(browser) await browser.close().catch(()=>{});
  server.kill('SIGTERM');
}
