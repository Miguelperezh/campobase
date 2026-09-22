import { chromium, devices } from 'playwright';

const URL='https://github.com/Miguelperezh/campobase/releases/download/campobase-videos-v1/library-v2-preview__f7-126__ejercicio-mobile.mp4';

const browser=await chromium.launch({channel:'chrome'});
const context=await browser.newContext({...devices['Pixel 7']});
const page=await context.newPage();

await page.setContent('<button id="p">Play</button><video id="v" playsinline controls preload="none"></video>');
const codec=await page.evaluate(()=>({
  h264:document.createElement('video').canPlayType('video/mp4; codecs="avc1.42E01F"'),
  mp4:document.createElement('video').canPlayType('video/mp4'),
  ua:navigator.userAgent
}));
const result=await page.evaluate(async(url)=>{
  const v=document.getElementById('v');
  v.src=url;
  const events=[];
  for(const ev of ['loadstart','loadedmetadata','loadeddata','canplay','play','playing','waiting','stalled','error','pause']){
    v.addEventListener(ev,()=>events.push({ev,t:v.currentTime,ready:v.readyState,network:v.networkState,error:v.error?{code:v.error.code,message:v.error.message}:null}));
  }
  try{await v.play();}catch(e){events.push({ev:'play-reject',name:e.name,message:e.message});}
  await new Promise(r=>setTimeout(r,7000));
  return {paused:v.paused,currentTime:v.currentTime,duration:v.duration,readyState:v.readyState,networkState:v.networkState,error:v.error?{code:v.error.code,message:v.error.message}:null,events};
},URL);
console.log(JSON.stringify({codec,result},null,2));
await browser.close();
if(!codec.h264) process.exit(11);
if(result.error || result.paused || Number(result.currentTime||0)<1) process.exit(2);
