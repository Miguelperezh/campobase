import { webkit, devices } from 'playwright';

const BASE='https://miguelperezh.github.io/campobase';
const MOBILE='https://github.com/Miguelperezh/campobase/releases/download/campobase-videos-v1/library-v2-preview__f7-126__ejercicio-mobile.mp4';

const browser=await webkit.launch({headless:true});
const context=await browser.newContext({...devices['iPhone 13'],serviceWorkers:'allow'});
const page=await context.newPage();

await page.addInitScript(()=>{
  try{
    Object.defineProperty(window.navigator,'standalone',{configurable:true,get:()=>true});
  }catch{}
  const native=window.matchMedia.bind(window);
  window.matchMedia=(q)=>{
    const r=native(q);
    if(q==='(display-mode: standalone)'){
      return {
        matches:true,media:q,onchange:null,
        addListener:r.addListener?.bind(r),removeListener:r.removeListener?.bind(r),
        addEventListener:r.addEventListener?.bind(r),removeEventListener:r.removeEventListener?.bind(r),
        dispatchEvent:r.dispatchEvent?.bind(r)
      };
    }
    return r;
  };
});

await page.goto(`${BASE}/index.html?standaloneProbe=${Date.now()}`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForFunction(()=>Boolean(window.__campobase?.state),null,{timeout:30000});
if(await page.evaluate(()=>window.__campobase?.state?.role)!=='demo'){
  await page.evaluate(()=>document.getElementById('auth-demo-btn')?.click());
  await page.waitForFunction(()=>window.__campobase?.state?.role==='demo',null,{timeout:30000});
}

const env=await page.evaluate(()=>({
  standalone:navigator.standalone===true,
  displayStandalone:matchMedia('(display-mode: standalone)').matches,
  ua:navigator.userAgent
}));
console.log('STANDALONE_ENV',JSON.stringify(env));

const fetchResult=await page.evaluate(async(url)=>{
  try{
    const res=await fetch(url,{cache:'no-store'});
    const blob=await res.blob();
    return {
      ok:res.ok,status:res.status,type:res.type,url:res.url,
      contentType:res.headers.get('content-type')||'',
      size:blob.size,blobType:blob.type
    };
  }catch(e){
    return {ok:false,error:{name:e.name,message:e.message}};
  }
},MOBILE);
console.log('FETCH_MOBILE',JSON.stringify(fetchResult));

await page.evaluate(()=>window.__campobase.showView('ejercicios'));
const preview=await page.waitForSelector('article.exercise-v2-card img[src*="f7-126.png"]',{timeout:30000});
const id=await preview.evaluate(img=>img.closest('article[data-exercise-id]')?.dataset.exerciseId||'');
await page.waitForTimeout(2500);
await page.evaluate(id=>window.__campobase.showExerciseDetail(id),id);
await page.waitForFunction(()=>Boolean(
  document.querySelector('#exercise-detail-dialog .frame-video') &&
  document.querySelector('#exercise-detail-dialog .v-btn-play')
),null,{timeout:20000});

await page.locator('#exercise-detail-dialog .v-btn-play').tap();
await page.waitForTimeout(8000);
const normal=await page.evaluate(()=>{
  const v=document.querySelector('#exercise-detail-dialog .frame-video');
  return {
    paused:v.paused,currentTime:v.currentTime||0,duration:v.duration,
    readyState:v.readyState,networkState:v.networkState,
    error:v.error?{code:v.error.code,message:v.error.message}:null,
    src:v.currentSrc||v.src||''
  };
});
console.log('NORMAL_PLAY',JSON.stringify(normal));

await page.evaluate(async(url)=>{
  const v=document.querySelector('#exercise-detail-dialog .frame-video');
  v.pause();
  v.removeAttribute('src');
  v.load();
  const res=await fetch(url,{cache:'no-store'});
  const blob=await res.blob();
  const objectUrl=URL.createObjectURL(blob);
  v.dataset.objectUrl=objectUrl;
  v.src=objectUrl;
  v.muted=true;
  v.playsInline=true;
  await v.play();
},MOBILE);
await page.waitForTimeout(5000);
const blobPlay=await page.evaluate(()=>{
  const v=document.querySelector('#exercise-detail-dialog .frame-video');
  return {
    paused:v.paused,currentTime:v.currentTime||0,duration:v.duration,
    readyState:v.readyState,networkState:v.networkState,
    error:v.error?{code:v.error.code,message:v.error.message}:null,
    src:v.currentSrc||v.src||''
  };
});
console.log('BLOB_PLAY',JSON.stringify(blobPlay));

await context.close();
await browser.close();

if(!fetchResult.ok) process.exit(21);
if(normal.error||Number(normal.currentTime||0)<=1) process.exit(22);
if(blobPlay.error||Number(blobPlay.currentTime||0)<=1) process.exit(23);
