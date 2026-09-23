import { webkit, devices } from 'playwright';

const BASE='https://miguelperezh.github.io/campobase';
const EXPECTED_VIDEO='https://github.com/Miguelperezh/campobase/releases/download/campobase-videos-v1/library-v2-preview__f7-126__ejercicio-mobile.mp4';

async function main(){
  const swRes=await fetch(`${BASE}/sw.js?probe=${Date.now()}`,{cache:'no-store'});
  const swText=await swRes.text();
  console.log('SW', JSON.stringify({
    status:swRes.status,
    hasV38:swText.includes('view-cache-v38'),
    revalidatesStyles:/['"]\/styles\.css['"]/.test(swText),
  }));
  if(!swRes.ok || !swText.includes('view-cache-v38') || !/['"]\/styles\.css['"]/.test(swText)){
    throw new Error('La producción no sirve todavía el hotfix v38 esperado');
  }

  const browser=await webkit.launch({headless:true});
  const context=await browser.newContext({
    ...devices['iPhone 15 Pro'],
    serviceWorkers:'allow',
  });
  const page=await context.newPage();
  const consoleErrors=[];
  page.on('console', msg => {
    if(msg.type()==='error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', e => consoleErrors.push('pageerror: '+e.message));

  await page.goto(`${BASE}/index.html?iphoneProbe=${Date.now()}`,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>Boolean(window.__campobase?.state),null,{timeout:30000});

  const role=await page.evaluate(()=>window.__campobase?.state?.role || '');
  if(role!=='demo'){
    await page.evaluate(()=>document.getElementById('auth-demo-btn')?.click());
    await page.waitForFunction(()=>window.__campobase?.state?.role==='demo',null,{timeout:20000});
  }

  await page.evaluate(()=>window.__campobase.showView('ejercicios'));
  const preview=await page.waitForSelector('article.exercise-v2-card img[src*="f7-126.png"]',{timeout:25000});
  const info=await preview.evaluate((img)=>{
    const card=img.closest('article[data-exercise-id]');
    return {
      id:card?.dataset.exerciseId||'',
      title:card?.querySelector('.card-title')?.textContent?.trim()||'',
    };
  });
  console.log('EXERCISE', JSON.stringify(info));
  await page.waitForTimeout(3000);
  await page.evaluate((id)=>window.__campobase.showExerciseDetail(id),info.id);
  await page.waitForFunction(()=>Boolean(
    document.querySelector('#exercise-detail-dialog .frame-video') &&
    document.querySelector('#exercise-detail-dialog .v-btn-play')
  ),null,{timeout:20000});

  const before=await page.evaluate(()=>{
    const v=document.querySelector('#exercise-detail-dialog .frame-video');
    return {
      dataSrc:v?.dataset?.src||'',
      src:v?.getAttribute('src')||'',
      paused:v?.paused,
      currentTime:v?.currentTime||0,
      ua:navigator.userAgent,
      h264:document.createElement('video').canPlayType('video/mp4; codecs="avc1.42E01F"'),
      controller:Boolean(navigator.serviceWorker?.controller),
    };
  });
  console.log('BEFORE', JSON.stringify(before));
  if(before.dataSrc!==EXPECTED_VIDEO){
    throw new Error('La app no seleccionó la variante móvil esperada: '+before.dataSrc);
  }

  const head=await page.request.get(EXPECTED_VIDEO,{headers:{Range:'bytes=0-1'}});
  console.log('VIDEO_HTTP', JSON.stringify({
    status:head.status(),
    contentType:head.headers()['content-type']||'',
    acceptRanges:head.headers()['accept-ranges']||'',
    contentRange:head.headers()['content-range']||'',
    url:head.url(),
  }));

  await page.click('#exercise-detail-dialog .v-btn-play');
  await page.waitForTimeout(8000);

  const after=await page.evaluate(()=>{
    const v=document.querySelector('#exercise-detail-dialog .frame-video');
    return {
      dataSrc:v?.dataset?.src||'',
      currentSrc:v?.currentSrc||'',
      paused:v?.paused,
      currentTime:v?.currentTime||0,
      duration:v?.duration,
      readyState:v?.readyState,
      networkState:v?.networkState,
      error:v?.error?{code:v.error.code,message:v.error.message}:null,
    };
  });
  console.log('AFTER', JSON.stringify(after));
  console.log('CONSOLE_ERRORS', JSON.stringify(consoleErrors));

  await context.close();
  await browser.close();

  if(after.error || after.paused || Number(after.currentTime||0)<=1){
    throw new Error('El vídeo no avanzó en WebKit/iPhone: '+JSON.stringify(after));
  }
}

main().catch((e)=>{ console.error(e.stack||e); process.exit(1); });
