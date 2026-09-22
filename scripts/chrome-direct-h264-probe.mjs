import { chromium, devices } from 'playwright';

const URLS={
  original:'https://github.com/Miguelperezh/campobase/releases/download/campobase-videos-v1/library-v2-preview__f7-126__ejercicio.mp4',
  mobile:'https://github.com/Miguelperezh/campobase/releases/download/campobase-videos-v1/library-v2-preview__f7-126__ejercicio-mobile.mp4'
};
const browser=await chromium.launch({channel:'chrome'});
const context=await browser.newContext({...devices['Pixel 7']});
const page=await context.newPage();
await page.setContent('<video id="v" playsinline controls preload="none"></video>');
const capability=await page.evaluate(()=>({
 h264High:document.createElement('video').canPlayType('video/mp4; codecs="avc1.640028"'),
 h264Baseline:document.createElement('video').canPlayType('video/mp4; codecs="avc1.42E01F"'),
 mp4:document.createElement('video').canPlayType('video/mp4'),
 ua:navigator.userAgent
}));

async function probe(name,url){
  return await page.evaluate(async({name,url})=>{
    const old=document.getElementById('v');
    const v=old.cloneNode(false);
    old.replaceWith(v);
    v.src=url;
    const events=[];
    for(const ev of ['loadstart','loadedmetadata','loadeddata','canplay','play','playing','waiting','stalled','error','pause']){
      v.addEventListener(ev,()=>events.push({ev,t:v.currentTime,ready:v.readyState,network:v.networkState,error:v.error?{code:v.error.code,message:v.error.message}:null}));
    }
    try{await v.play();}catch(e){events.push({ev:'play-reject',name:e.name,message:e.message});}
    await new Promise(r=>setTimeout(r,6000));
    return {name,paused:v.paused,currentTime:v.currentTime,duration:v.duration,readyState:v.readyState,networkState:v.networkState,currentSrc:v.currentSrc,error:v.error?{code:v.error.code,message:v.error.message}:null,events};
  },{name,url});
}

const results={};
for(const [name,url] of Object.entries(URLS)) results[name]=await probe(name,url);
console.log(JSON.stringify({capability,results},null,2));
await browser.close();
if(!capability.h264Baseline) process.exit(11);
if(results.mobile.error||results.mobile.paused||results.mobile.currentTime<1) process.exit(2);
