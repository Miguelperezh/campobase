import { chromium, devices } from 'playwright';

const IDS=['f7-120','f7-126','f7-127','f7-135'];
const browser=await chromium.launch({channel:'chrome'});
const context=await browser.newContext({...devices['Pixel 7']});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push('pageerror:'+e.message));
page.on('console',m=>{if(m.type()==='error') errors.push('console:'+m.text())});

await page.goto('https://miguelperezh.github.io/campobase/?prodV40MobileProbe=1',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForFunction(()=>Boolean(window.__campobase?.state),null,{timeout:30000});
await page.waitForTimeout(5000);
let role=await page.evaluate(()=>window.__campobase?.state?.role||'');
if(role!=='demo'){
  await page.evaluate(()=>document.getElementById('auth-demo-btn')?.click());
  await page.waitForFunction(()=>window.__campobase?.state?.role==='demo',null,{timeout:20000});
}
await page.waitForTimeout(2500);

const build=await page.evaluate(()=>({
  build:window.__CAMPOBASE_BUILD||'',
  sw:navigator.serviceWorker?.controller?.scriptURL||'',
  ua:navigator.userAgent,
  h264:document.createElement('video').canPlayType('video/mp4; codecs="avc1.42E01F"')
}));

const results=[];
for(const id of IDS){
  try{
    await page.evaluate(()=>window.__campobase.showView('ejercicios'));
    await page.waitForTimeout(300);
    await page.evaluate((id)=>window.__campobase.showExerciseDetail(id),id);
    await page.waitForSelector('#exercise-detail-dialog[open] .frame-video',{timeout:15000});
    const before=await page.evaluate(()=>{
      const v=document.querySelector('#exercise-detail-dialog[open] .frame-video');
      return {dataSrc:v?.dataset.src||'',src:v?.src||''};
    });
    await page.evaluate(()=>document.querySelector('#exercise-detail-dialog[open] .v-btn-play')?.click());
    await page.waitForTimeout(2500);
    const after=await page.evaluate(()=>{
      const v=document.querySelector('#exercise-detail-dialog[open] .frame-video');
      return {
        dataSrc:v?.dataset.src||'',src:v?.currentSrc||v?.src||'',
        paused:v?.paused,currentTime:v?.currentTime,readyState:v?.readyState,networkState:v?.networkState,
        error:v?.error?{code:v.error.code,message:v.error.message}:null
      };
    });
    results.push({id,before,after});
    await page.evaluate(()=>{
      const d=document.getElementById('exercise-detail-dialog');
      if(d?.open) d.close();
    });
    await page.waitForTimeout(200);
  }catch(e){
    results.push({id,exception:String(e)});
  }
}
console.log(JSON.stringify({build,results,errors},null,2));
await browser.close();

if(build.build!=='20260923-pwa-force-refresh-v40') process.exit(12);
for(const r of results){
  if(r.exception) process.exit(13);
  if(!/-mobile\.mp4(?:$|[?#])/.test(r.before.dataSrc)) process.exit(14);
  if(r.after.error || r.after.paused || Number(r.after.currentTime||0)<0.5) process.exit(15);
}
