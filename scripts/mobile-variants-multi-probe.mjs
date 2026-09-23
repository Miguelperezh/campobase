import { chromium, devices } from 'playwright';

const BASE='https://github.com/Miguelperezh/campobase/releases/download/campobase-videos-v1/';
const ASSETS=[
  'library-v2-preview__f7-001__ejercicio-mobile.mp4',
  'library-v2-preview__f7-127__ejercicio-mobile.mp4',
  'library-v2-preview__pdf150-022__ejercicio-mobile.mp4',
  'CAMPOBASE-VIDEO-3-FINALIZACIONES-CENTRO-EXTERIOR-CENTRO-LATERAL__video-mobile.mp4',
];

const browser=await chromium.launch({channel:'chrome'});
const context=await browser.newContext({...devices['Pixel 7']});
const page=await context.newPage();

const results=[];
for(const asset of ASSETS){
  await page.setContent('<video id="v" playsinline muted preload="auto"></video>');
  const result=await page.evaluate(async({url,asset})=>{
    const v=document.getElementById('v');
    const support={
      baseline:v.canPlayType('video/mp4; codecs="avc1.42E01F"'),
      mp4:v.canPlayType('video/mp4'),
    };
    v.src=url;
    let playError=null;
    try{ await v.play(); }catch(e){ playError={name:e.name,message:e.message}; }
    await new Promise(r=>setTimeout(r,3500));
    return {
      asset,support,paused:v.paused,currentTime:v.currentTime,duration:v.duration,
      readyState:v.readyState,networkState:v.networkState,
      error:v.error?{code:v.error.code,message:v.error.message}:null,playError
    };
  },{url:BASE+encodeURIComponent(asset),asset});
  results.push(result);
}
console.log(JSON.stringify(results,null,2));
await browser.close();

const failed=results.filter(r=>r.error||r.playError||r.paused||Number(r.currentTime||0)<1);
if(failed.length) process.exit(2);
