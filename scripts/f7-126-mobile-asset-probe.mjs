import { chromium, devices } from 'playwright';
import { spawn } from 'node:child_process';

const ORIGINAL='https://github.com/Miguelperezh/campobase/releases/download/campobase-videos-v1/library-v2-preview__f7-126__ejercicio.mp4';
const MOBILE='https://github.com/Miguelperezh/campobase/releases/download/campobase-videos-v1/library-v2-preview__f7-126__ejercicio-mobile.mp4';

const server=spawn('python3',['-m','http.server','4174','--bind','127.0.0.1'],{stdio:['ignore','ignore','inherit']});
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));

async function waitServer(){
  for(let i=0;i<60;i+=1){
    try{
      const res=await fetch('http://127.0.0.1:4174/index.html',{cache:'no-store'});
      if(res.ok) return;
    }catch{}
    await sleep(250);
  }
  throw new Error('Servidor CampoBase no disponible');
}

async function enterDemo(page){
  await page.goto('http://127.0.0.1:4174/index.html?f7126probe=1',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>Boolean(window.__campobase?.state),null,{timeout:20000});
  const role=await page.evaluate(()=>window.__campobase?.state?.role || '');
  if(role!=='demo'){
    await page.evaluate(()=>document.getElementById('auth-demo-btn')?.click());
    await page.waitForFunction(()=>window.__campobase?.state?.role==='demo',null,{timeout:20000});
  }
}

async function probe(page,{mobile}){
  await enterDemo(page);
  const codec=await page.evaluate(()=>({
    h264:document.createElement('video').canPlayType('video/mp4; codecs="avc1.42E01F"'),
    mp4:document.createElement('video').canPlayType('video/mp4'),
    ua:navigator.userAgent,
  }));

  await page.evaluate(()=>window.__campobase.showExerciseDetail('f7-126'));
  await page.waitForSelector('#exercise-detail-dialog[open] .frame-video',{timeout:15000});
  await page.waitForSelector('#exercise-detail-dialog[open] .v-btn-play',{timeout:15000});

  const before=await page.evaluate(()=>{
    const v=document.querySelector('#exercise-detail-dialog[open] .frame-video');
    return {dataSrc:v?.dataset?.src || '',src:v?.getAttribute('src') || '',paused:v?.paused,currentTime:v?.currentTime || 0};
  });

  const expected=mobile?MOBILE:ORIGINAL;
  if(before.dataSrc!==expected){
    throw new Error(`URL incorrecta (${mobile?'móvil':'escritorio'}): ${before.dataSrc} != ${expected}`);
  }

  await page.click('#exercise-detail-dialog[open] .v-btn-play');
  await page.waitForFunction(()=>{
    const v=document.querySelector('#exercise-detail-dialog[open] .frame-video');
    return Boolean(v && !v.paused && Number(v.currentTime||0)>1);
  },null,{timeout:20000});

  const after=await page.evaluate(()=>{
    const v=document.querySelector('#exercise-detail-dialog[open] .frame-video');
    return {
      dataSrc:v?.dataset?.src || '',
      src:v?.currentSrc || v?.src || '',
      paused:v?.paused,
      currentTime:v?.currentTime || 0,
      duration:v?.duration,
      readyState:v?.readyState,
      networkState:v?.networkState,
      error:v?.error?{code:v.error.code,message:v.error.message}:null,
    };
  });

  if(after.error || after.paused || Number(after.currentTime||0)<=1){
    throw new Error(`No reproduce (${mobile?'móvil':'escritorio'}): ${JSON.stringify(after)}`);
  }
  return {codec,before,after};
}

let browser;
try{
  await waitServer();
  browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});

  const desktopContext=await browser.newContext({viewport:{width:1280,height:800},serviceWorkers:'block'});
  const desktopPage=await desktopContext.newPage();
  const desktop=await probe(desktopPage,{mobile:false});
  await desktopContext.close();

  const mobileContext=await browser.newContext({...devices['Pixel 7'],serviceWorkers:'block'});
  const mobilePage=await mobileContext.newPage();
  const mobile=await probe(mobilePage,{mobile:true});
  await mobileContext.close();

  console.log(JSON.stringify({desktop,mobile},null,2));

  if(!desktop.codec.h264 || !mobile.codec.h264) process.exit(11);
}finally{
  if(browser) await browser.close().catch(()=>{});
  server.kill('SIGTERM');
}
