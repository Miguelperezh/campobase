import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const root=process.cwd(), browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try {
 for(const width of [1440,390]) {
  const context=await browser.newContext({viewport:{width,height:844},serviceWorkers:'block'});
  await context.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.hostname!=='miguelperezh.github.io')return route.fulfill({status:503,body:''});
   const file=path.resolve(root,url.pathname.replace(/^\/campobase\/?/,'')||'index.html');
   try{return route.fulfill({status:200,body:await fs.readFile(file),contentType:file.endsWith('.js')||file.endsWith('.mjs')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream'});}catch{return route.fulfill({status:404,body:''});}
  });
  const page=await context.newPage(), errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('https://miguelperezh.github.io/campobase/');
  await page.locator('#saas-demo-btn').click();
  await page.waitForFunction(()=>window.__campobase?.state.role==='demo');
  await page.evaluate(async()=>{
   const app=window.__campobase, s=app.state;
   const theme={views:{partido:{bannerBg:'#246813',bannerInk:'#fedcba',btnBg:'#112233',btnInk:'#abcdef',btn2Bg:'#334455',btn2Ink:'#fefefe',cardBg:'#eeddcc',fontColor:'#223344',uiParts:{status:{selector:'#partido #live-match > section:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1)',css:'background',value:'#661122',viewId:'partido'},quick:{selector:'#partido #live-match > section:nth-of-type(1) > div:nth-of-type(4) > button:nth-of-type(1)',css:'background',value:'#aabbdd',viewId:'partido'},score:{selector:'#partido .cbx-live-score',css:'color',value:'#654321',viewId:'partido'},name:{selector:'#partido .live-player-name',css:'color',value:'#334466',viewId:'partido'},auto:{selector:'#partido #owner-auto-sub',css:'background',value:'#774411',viewId:'partido'}}}}};
   const db=await import('./js/db.js');await db.put('settings',{...s.settings,id:'main',theme,presets:[],matchPreset:null});localStorage.setItem('campobase.theme',JSON.stringify({fontColor:'#ff00ff',views:{delegado:{btnBg:'#ffff00',uiParts:{old:{selector:'#delegado #delegate-auto-sub',css:'background',value:'#ffff00',viewId:'delegado'}}}}}));localStorage.setItem('campobase.matchPreset','0');localStorage.setItem('campobase.presets',JSON.stringify([{bannerBg:'#00ffff',views:{partido:{bannerBg:'#00ffff'}}}]));await app.refresh(true);
   s.players=Array.from({length:14},(_,i)=>({id:'p'+i,name:'Jugador '+i,number:i+1,positions:i<2?['Portero']:['Central']}));
   s.matches=[{id:'m-test',opponent:'Rival',date:'2026-10-09T19:00',status:'planned',type:'league'}];
   s.callups=[{id:'c-test',matchId:'m-test',format:'F7',availableIds:s.players.map(p=>p.id),excludedIds:[]}];
   s.preparaciones=[];s.timer={matchId:'m-test',phase:'first_half',elapsed:0,runningSince:null,onField:s.players.slice(0,7).map(p=>p.id),initialOnField:s.players.slice(0,7).map(p=>p.id),firstKeeper:'p0',secondKeeper:'p1',delegateUnlocked:true,events:[],details:{goalsFor:0,goalsAgainst:0,goals:[],cards:[],injuries:[],incidents:[]}};
   app.renderLive();app.renderDelegate();app.showView('partido');
  });
  await page.waitForTimeout(300);
  const result=await page.evaluate(()=>{
   const read=selector=>{const node=document.querySelector(selector);return node?{bg:getComputedStyle(node).backgroundColor,color:getComputedStyle(node).color}:null;};
   return {ownerHero:read('#partido .cbx-live-hero'),ownerScore:read('#partido .score-team > strong'),ownerName:read('#partido .live-player-name'),ownerAuto:read('#owner-auto-sub'),delegateHero:read('#delegado .cbx-live-hero'),delegateStatus:read('#delegado .cbx-live-status'),delegateQuick:read('#delegado [data-cbx-live-kind="goal"]'),delegateName:read('#delegado .live-player-name'),delegateAuto:read('#delegate-auto-sub'),theme:window.__campobase.state.settings.theme};
  });
  console.log(width,'owner/delegate computed colours',JSON.stringify({...result,theme:'checked in isolated memory'}));
  assert.equal(result.ownerHero.bg,'rgb(36, 104, 19)');assert.equal(result.ownerScore.color,'rgb(101, 67, 33)');assert.equal(result.ownerName.color,'rgb(51, 68, 102)');assert.equal(result.ownerAuto.bg,'rgb(119, 68, 17)');assert.equal(result.delegateName.color,result.ownerName.color);assert.equal(result.delegateAuto.bg,result.ownerAuto.bg);
  assert.equal(result.theme.views.delegado,undefined);
  await page.evaluate(()=>{window.__campobase.state.settings.delegatePermissions=['partido'];window.__campobase.applyRole('delegate');});await page.waitForTimeout(250);
  assert.equal(await page.locator('#delegado .cbx-live-hero').count(),1);
  assert.equal(await page.locator('#delegado .cbx-live-hero').evaluate(n=>getComputedStyle(n).backgroundColor),'rgb(36, 104, 19)');
  assert.equal(await page.locator('#delegado .cbx-live-status').evaluate(n=>getComputedStyle(n).backgroundColor),'rgb(102, 17, 34)');
  assert.equal(await page.locator('#delegado [data-cbx-live-kind="goal"]').evaluate(n=>getComputedStyle(n).backgroundColor),'rgb(170, 187, 221)');
  assert.equal(await page.locator('#delegado #open-delegate,#delegado #unlock-delegate,#delegado #exit-live').count(),0);
  assert.equal(await page.locator('#delegado .live-player-row').count(),14);
  await page.locator('#delegado [data-cbx-live-kind="goal"]').click();
  assert.equal(await page.locator('#cbx-live-action-dialog').evaluate(n=>n.open),true);
  await page.locator('#cbx-live-action-dialog [data-la-close]').first().click();
  assert.equal(await page.locator('#delegado input[name="delegate-out"]').count(),7);
  assert.equal(await page.locator('#delegado input[name="delegate-in"]').count(),7);
  assert.equal(await page.evaluate(()=>window.__campobase.state.settings.matchPreset),null);
  await page.evaluate(()=>{window.__campobase.renderLive();window.__campobase.renderDelegate();});await page.waitForTimeout(200);
  assert.equal(await page.locator('#owner-auto-sub').evaluate(n=>getComputedStyle(n).backgroundColor),'rgb(119, 68, 17)');
  assert.equal(await page.locator('#delegado .cbx-live-status').evaluate(n=>getComputedStyle(n).backgroundColor),'rgb(102, 17, 34)');
  assert.equal(await page.locator('#delegado #delegate-auto-sub').evaluate(n=>getComputedStyle(n).backgroundColor),'rgb(119, 68, 17)');
  assert.ok(await page.locator('#delegado .cbx-live-hero').evaluate(n=>n.getBoundingClientRect().right<=innerWidth));
  assert.deepEqual(errors,[]);await context.close();
 }
}finally{await browser.close();}
