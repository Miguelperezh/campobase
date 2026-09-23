import { webkit, devices } from 'playwright';

const BASE='https://miguelperezh.github.io/campobase';
const MOBILE='https://github.com/Miguelperezh/campobase/releases/download/campobase-videos-v1/library-v2-preview__f7-126__ejercicio-mobile.mp4';

async function checkDeployedAssets(){
  const stamp=Date.now();
  const [swRes,indexRes,cssRes]=await Promise.all([
    fetch(`${BASE}/sw.js?probe=${stamp}`,{cache:'no-store'}),
    fetch(`${BASE}/index.html?probe=${stamp}`,{cache:'no-store'}),
    fetch(`${BASE}/styles.css?probe=${stamp}`,{cache:'no-store'}),
  ]);
  const [sw,index,css]=await Promise.all([swRes.text(),indexRes.text(),cssRes.text()]);
  const result={
    swStatus:swRes.status,
    indexStatus:indexRes.status,
    cssStatus:cssRes.status,
    swHasV38:sw.includes('view-cache-v38'),
    swRevalidatesStyles:sw.includes("'/styles.css'") || sw.includes('"/styles.css"'),
    indexBuild:(index.match(/__CAMPOBASE_BUILD\s*=\s*['"]([^'"]+)/)||[])[1]||'',
    cssBytes:css.length,
  };
  console.log('DEPLOYED_ASSETS',JSON.stringify(result));
  if(!swRes.ok||!indexRes.ok||!cssRes.ok||!result.swHasV38||!result.swRevalidatesStyles||css.length<1000){
    throw new Error('Producción no sirve aún el hotfix visual: '+JSON.stringify(result));
  }
}

async function enterDemo(page){
  await page.goto(`${BASE}/index.html?iphoneProbe=${Date.now()}`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>Boolean(window.__campobase?.state),null,{timeout:30000});
  const role=await page.evaluate(()=>window.__campobase?.state?.role||'');
  if(role!=='demo'){
    await page.evaluate(()=>document.getElementById('auth-demo-btn')?.click());
    await page.waitForFunction(()=>window.__campobase?.state?.role==='demo',null,{timeout:30000});
  }
}

await checkDeployedAssets();

const browser=await webkit.launch({headless:true});
const context=await browser.newContext({...devices['iPhone 13'],serviceWorkers:'allow'});
const page=await context.newPage();

const network=[];
page.on('response',(response)=>{
  const url=response.url();
  if(/styles(-redesign)?\\.css|f7-126|ejercicio-mobile\\.mp4|sw\\.js/i.test(url)){
    network.push({url,status:response.status(),contentType:response.headers()['content-type']||'',contentRange:response.headers()['content-range']||'',acceptRanges:response.headers()['accept-ranges']||''});
  }
});
page.on('console',(msg)=>{
  if(['warning','error'].includes(msg.type())) console.log('BROWSER_CONSOLE',msg.type(),msg.text());
});

try{
  await enterDemo(page);
  const env=await page.evaluate(()=>({
    ua:navigator.userAgent,
    platform:navigator.platform,
    standalone:window.matchMedia?.('(display-mode: standalone)')?.matches||false,
    dpr:window.devicePixelRatio,
    viewport:[innerWidth,innerHeight],
    bodyBg:getComputedStyle(document.body).backgroundColor,
    styles:[...document.styleSheets].map(s=>s.href).filter(Boolean),
    h264:document.createElement('video').canPlayType('video/mp4; codecs="avc1.42E01F"'),
  }));
  console.log('IPHONE_ENV',JSON.stringify(env));

  await page.evaluate(()=>window.__campobase.showView('ejercicios'));
  const preview=await page.waitForSelector('article.exercise-v2-card img[src*="f7-126.png"]',{timeout:30000});
  const info=await preview.evaluate((img)=>{
    const card=img.closest('article[data-exercise-id]');
    const r=card.getBoundingClientRect();
    return {
      id:card?.dataset.exerciseId||'',
      title:card?.querySelector('.card-title')?.textContent?.trim()||'',
      rect:{x:r.x,y:r.y,width:r.width,height:r.height},
      display:getComputedStyle(card).display,
    };
  });
  console.log('EXERCISE_INFO',JSON.stringify(info));

  await page.waitForTimeout(2500);
  await page.evaluate((id)=>window.__campobase.showExerciseDetail(id),info.id);
  await page.waitForFunction(()=>Boolean(
    document.querySelector('#exercise-detail-dialog .frame-video') &&
    document.querySelector('#exercise-detail-dialog .v-btn-play')
  ),null,{timeout:20000});

  await page.evaluate(()=>{
    const v=document.querySelector('#exercise-detail-dialog .frame-video');
    window.__f7126events=[];
    for(const ev of ['loadstart','loadedmetadata','loadeddata','canplay','play','playing','waiting','stalled','suspend','error','pause','abort','emptied']){
      v.addEventListener(ev,()=>window.__f7126events.push({
        ev,t:v.currentTime,ready:v.readyState,network:v.networkState,
        error:v.error?{code:v.error.code,message:v.error.message}:null
      }));
    }
  });

  const before=await page.evaluate(()=>{
    const v=document.querySelector('#exercise-detail-dialog .frame-video');
    const d=document.querySelector('#exercise-detail-dialog');
    const vr=v.getBoundingClientRect();
    const dr=d.getBoundingClientRect();
    return {
      dataSrc:v.dataset.src||'',src:v.getAttribute('src')||'',paused:v.paused,currentTime:v.currentTime||0,
      videoRect:{x:vr.x,y:vr.y,width:vr.width,height:vr.height},
      dialogRect:{x:dr.x,y:dr.y,width:dr.width,height:dr.height},
      videoDisplay:getComputedStyle(v).display,
      dialogDisplay:getComputedStyle(d).display,
    };
  });
  console.log('BEFORE_PLAY',JSON.stringify(before));
  if(before.dataSrc!==MOBILE) throw new Error('iPhone no seleccionó variante móvil: '+before.dataSrc);

  await page.locator('#exercise-detail-dialog .v-btn-play').tap();
  await page.waitForTimeout(8000);

  const after=await page.evaluate(()=>{
    const v=document.querySelector('#exercise-detail-dialog .frame-video');
    return {
      dataSrc:v.dataset.src||'',src:v.currentSrc||v.src||'',paused:v.paused,currentTime:v.currentTime||0,
      duration:v.duration,readyState:v.readyState,networkState:v.networkState,
      error:v.error?{code:v.error.code,message:v.error.message}:null,
      events:window.__f7126events||[],
    };
  });
  console.log('AFTER_PLAY',JSON.stringify(after));
  console.log('NETWORK',JSON.stringify(network));

  if(after.error||Number(after.currentTime||0)<=1){
    throw new Error('WebKit/iPhone no reproduce f7-126: '+JSON.stringify(after));
  }
}finally{
  await context.close().catch(()=>{});
  await browser.close().catch(()=>{});
}
