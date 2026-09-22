import { chromium, devices } from 'playwright';
import { spawn } from 'node:child_process';

const root='/tmp/campobase-mobile-video-probe';
const server=spawn('python3',['-m','http.server','4188','--bind','127.0.0.1'],{cwd:root,stdio:['ignore','ignore','inherit']});
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
for(let i=0;i<40;i++){
  try{const r=await fetch('http://127.0.0.1:4188/original.mp4',{method:'HEAD'});if(r.ok)break;}catch{}
  await sleep(250);
}

const browser=await chromium.launch();
const context=await browser.newContext({...devices['Pixel 7']});
const page=await context.newPage();

async function probe(name){
  await page.setContent(`<button id="p">play</button><video id="v" playsinline controls preload="none"></video>`);
  const result=await page.evaluate(async(name)=>{
    const v=document.getElementById('v');
    v.src='http://127.0.0.1:4188/'+name;
    const events=[];
    for(const ev of ['loadstart','loadedmetadata','loadeddata','canplay','play','playing','waiting','stalled','error','pause']){
      v.addEventListener(ev,()=>events.push({ev,t:v.currentTime,ready:v.readyState,network:v.networkState,error:v.error?{code:v.error.code,message:v.error.message}:null}));
    }
    try{await v.play();}catch(e){events.push({ev:'play-reject',name:e.name,message:e.message});}
    await new Promise(r=>setTimeout(r,5000));
    return {name,paused:v.paused,currentTime:v.currentTime,duration:v.duration,readyState:v.readyState,networkState:v.networkState,error:v.error?{code:v.error.code,message:v.error.message}:null,events};
  },name);
  console.log(JSON.stringify(result,null,2));
  return result;
}

const results=[];
for(const name of ['original.mp4','faststart-copy.mp4','transcoded-mobile.mp4']) results.push(await probe(name));
await browser.close();
server.kill('SIGTERM');

const summary=Object.fromEntries(results.map(x=>[x.name,{ok:!x.error&&!x.paused&&x.currentTime>1,currentTime:x.currentTime,error:x.error}]));
console.log('SUMMARY '+JSON.stringify(summary));
if(summary['original.mp4'].ok) process.exit(10);
if(summary['faststart-copy.mp4'].ok) process.exit(0);
if(summary['transcoded-mobile.mp4'].ok) process.exit(0);
process.exit(2);
