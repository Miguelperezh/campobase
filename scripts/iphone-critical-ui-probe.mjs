import { webkit, devices } from 'playwright';

const BASE='https://miguelperezh.github.io/campobase';

async function enterDemo(page){
  await page.goto(`${BASE}/index.html?criticalUi=${Date.now()}`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>Boolean(window.__campobase?.state),null,{timeout:30000});
  if(await page.evaluate(()=>window.__campobase?.state?.role)!=='demo'){
    await page.evaluate(()=>document.getElementById('auth-demo-btn')?.click());
    await page.waitForFunction(()=>window.__campobase?.state?.role==='demo',null,{timeout:30000});
  }
}

const browser=await webkit.launch({headless:true});
const context=await browser.newContext({...devices['iPhone 13'],serviceWorkers:'allow'});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push('pageerror: '+e.message));
page.on('console',m=>{ if(m.type()==='error') errors.push('console: '+m.text()); });

try{
  await enterDemo(page);

  const views=['plantilla','asistencia','sesiones','ejercicios','preparacion','partido'];
  const viewResults=[];
  for(const id of views){
    await page.evaluate((view)=>window.__campobase.showView(view),id);
    await page.waitForFunction((view)=>document.querySelector('.view.active')?.id===view,id,{timeout:15000});
    const r=await page.evaluate((view)=>{
      const el=document.getElementById(view);
      const rect=el.getBoundingClientRect();
      return {
        id:view,
        width:rect.width,
        height:rect.height,
        display:getComputedStyle(el).display,
        bodyScrollWidth:document.body.scrollWidth,
        viewport:innerWidth
      };
    },id);
    viewResults.push(r);
    if(r.display==='none'||r.width<300||r.bodyScrollWidth>r.viewport+40){
      throw new Error('Vista móvil anómala: '+JSON.stringify(r));
    }
  }
  console.log('CRITICAL_VIEWS',JSON.stringify(viewResults));

  await page.evaluate(()=>{
    const app=window.__campobase;
    const ids=Array.from({length:9},(_,i)=>'webkit-smoke-'+(i+1));
    app.state.players=ids.map((id,i)=>({id,name:'Jugador '+(i+1),number:String(i+1),positions:i<2?['POR']:['MC'],active:true}));
    app.state.matches=[{id:'webkit-match',opponent:'Rival',date:'2099-01-01T09:00:00',venue:'home',status:'scheduled',type:'friendly',format:'F7',callupId:'webkit-callup'}];
    app.state.callups=[{id:'webkit-callup',matchId:'webkit-match',availableIds:ids,selectedIds:ids,format:'F7',exclusions:[]}];
    app.state.timer=null;
    app.renderAll();
    app.showView('partido');
  });
  await page.waitForSelector('#live-select',{timeout:15000});
  await page.selectOption('#live-select','webkit-match');
  await page.waitForFunction(()=>{
    const a=document.getElementById('first-keeper');
    const b=document.getElementById('second-keeper');
    return a&&b&&!a.disabled&&!b.disabled;
  },null,{timeout:15000});
  await page.selectOption('#first-keeper','webkit-smoke-1');
  await page.selectOption('#second-keeper','webkit-smoke-2');
  await page.locator('#prepare-live').tap();
  await page.waitForFunction(()=>window.__campobase?.state?.timer?.phase==='ready',null,{timeout:15000});

  const live=await page.evaluate(()=>({
    phase:window.__campobase?.state?.timer?.phase||'',
    activeView:document.querySelector('.view.active')?.id||'',
    width:document.getElementById('partido')?.getBoundingClientRect().width||0
  }));
  console.log('LIVE_PREP',JSON.stringify(live));

  if(errors.length) throw new Error('Errores JS críticos: '+errors.join(' | '));
}finally{
  await context.close().catch(()=>{});
  await browser.close().catch(()=>{});
}
