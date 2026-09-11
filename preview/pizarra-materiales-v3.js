const NS='http://www.w3.org/2000/svg';
const svg=document.getElementById('board'), shell=document.getElementById('editorShell');
const fieldType=document.getElementById('fieldType'), counts=document.getElementById('counts');
const inspectorEmpty=document.getElementById('inspectorEmpty'), inspectorBody=document.getElementById('inspectorBody');
const selectedLabel=document.getElementById('selectedLabel'), sizeRange=document.getElementById('sizeRange'), sizeOut=document.getElementById('sizeOut'), rotRange=document.getElementById('rotRange'), rotOut=document.getElementById('rotOut');
const zoneControls=document.getElementById('zoneControls'), zoneShape=document.getElementById('zoneShape'), zoneColor=document.getElementById('zoneColor'), zoneW=document.getElementById('zoneW'), zoneH=document.getElementById('zoneH'), zoneWOut=document.getElementById('zoneWOut'), zoneHOut=document.getElementById('zoneHOut');

let idSeq=1, lineSeq=1, selected=null, drawMode=null, drag=null, draft=null, history=[], future=[];
const project={version:2,field:'full',format:'F7',currentPhaseId:'phase-1',phases:[{id:'phase-1',name:'Fase 1',items:[],lines:[]}]};
const clone=o=>JSON.parse(JSON.stringify(o));
const phase=()=>project.phases.find(p=>p.id===project.currentPhaseId);
function pushHistory(){history.push(clone(project));if(history.length>80)history.shift();future=[]}
function restore(snapshot){Object.keys(project).forEach(k=>delete project[k]);Object.assign(project,clone(snapshot));selected=null;drawMode=null;fieldType.value=project.field;syncDrawButtons();render()}
function make(tag,attrs={}){const n=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))if(v!==null&&v!==undefined&&v!=='')n.setAttribute(k,v);return n}
function currentView(){if(project.field==='half')return{x:0,y:0,w:500,h:625};if(project.field==='third')return{x:0,y:0,w:333.333,h:625};return{x:0,y:0,w:1000,h:625}}
function applyView(){const v=currentView();svg.setAttribute('viewBox',`${v.x} ${v.y} ${v.w} ${v.h}`)}
function centerPoint(){const v=currentView();return{x:v.x+v.w/2,y:v.y+v.h/2}}
function nextNumber(type){const nums=phase().items.filter(i=>i.type===type).map(i=>Number(i.number)||0);return Math.max(0,...nums)+1}
function selectedItem(){return selected?.kind==='item'?phase().items.find(i=>i.id===selected.id):null}
function selectedLine(){return selected?.kind==='line'?phase().lines.find(i=>i.id===selected.id):null}

function drawField(){
  svg.innerHTML='';applyView();
  const defs=make('defs');
  const shadow=make('filter',{id:'selShadow',x:'-40%',y:'-40%',width:'180%',height:'180%'});shadow.append(make('feDropShadow',{dx:0,dy:0,stdDeviation:4,'flood-color':'#ffd700','flood-opacity':.95}));defs.append(shadow);svg.append(defs);
  svg.append(make('rect',{x:0,y:0,width:1000,height:625,fill:'#1e6d46'}));
  for(let i=0;i<12;i++)svg.append(make('rect',{x:i*(1000/12),y:0,width:1000/12,height:625,fill:i%2?'#236f48':'#287a50',opacity:.42}));
  const g=make('g',{stroke:'#fff','stroke-width':4,fill:'none',opacity:.96});
  g.append(make('rect',{x:18,y:18,width:964,height:589,rx:2}));
  g.append(make('line',{x1:500,y1:18,x2:500,y2:607}));g.append(make('circle',{cx:500,cy:312.5,r:72}));g.append(make('circle',{cx:500,cy:312.5,r:4,fill:'#fff',stroke:'none'}));
  [[18,155,150,315],[832,155,150,315],[18,230,60,165],[922,230,60,165]].forEach(r=>g.append(make('rect',{x:r[0],y:r[1],width:r[2],height:r[3]})));
  g.append(make('circle',{cx:115,cy:312.5,r:4,fill:'#fff',stroke:'none'}));g.append(make('circle',{cx:885,cy:312.5,r:4,fill:'#fff',stroke:'none'}));
  svg.append(g);
}
function bounds(it){
  const s=(it.scale||1);let w=54,h=54;
  if(it.type==='goalLarge'){w=145;h=92}else if(it.type==='goalSmall'){w=95;h=66}else if(it.type==='ladder'){w=120;h=55}else if(it.type==='hurdle'){w=78;h=62}else if(it.type==='pole'){w=44;h=92}else if(it.type==='cone'){w=54;h=64}else if(it.type==='marker'){w=58;h=34}else if(it.type==='ring'){w=66;h=50}else if(it.type==='mannequin'){w=62;h=94}else if(it.type==='zone'){w=it.zoneW||140;h=it.zoneH||90}else if(it.type==='coach'||it.type==='attacker'||it.type==='defender'){w=h=52}else if(it.type==='ball'){w=h=42}
  return{w:w*s,h:h*s};
}
function selectionFrame(g,it){const b=bounds({...it,scale:1}),pad=8;const r=make('rect',{x:-b.w/2-pad,y:-b.h/2-pad,width:b.w+pad*2,height:b.h+pad*2,rx:8,fill:'none',stroke:'#ffd700','stroke-width':4,'stroke-dasharray':'9 5','vector-effect':'non-scaling-stroke',filter:'url(#selShadow)'});g.append(r);[[-b.w/2-pad,-b.h/2-pad],[b.w/2+pad,-b.h/2-pad],[-b.w/2-pad,b.h/2+pad],[b.w/2+pad,b.h/2+pad]].forEach(([x,y])=>g.append(make('circle',{cx:x,cy:y,r:5,fill:'#ffd700',stroke:'#4d4100','stroke-width':1,'vector-effect':'non-scaling-stroke'})))}
function itemGraphic(it){
  const g=make('g',{'data-id':it.id,transform:`translate(${it.x} ${it.y}) rotate(${it.rot||0}) scale(${it.scale||1})`,style:'cursor:grab'});const isSel=selected?.kind==='item'&&selected.id===it.id;if(isSel)selectionFrame(g,it);
  if(it.type==='attacker'||it.type==='defender'||it.type==='coach'){
    const fill=it.type==='attacker'?'#1667d9':it.type==='defender'?'#e12f3b':'#161616';g.append(make('circle',{r:22,fill,stroke:'#fff','stroke-width':3}));g.append(make('circle',{r:24,fill:'none',stroke:'#000','stroke-opacity':.18,'stroke-width':2}));const t=make('text',{x:0,y:6,'text-anchor':'middle','font-size':17,'font-weight':900,fill:'#fff','pointer-events':'none'});t.textContent=it.type==='coach'?'E':it.number;g.append(t);
  } else if(it.type==='ball'){
    g.append(make('circle',{r:18,fill:'#fff',stroke:'#111','stroke-width':2}));g.append(make('path',{d:'M-6 -5 L0 -11 L7 -5 L4 4 L-4 4 Z',fill:'#111'}));g.append(make('path',{d:'M-5 4 L-11 9 M4 4 L11 9 M-6 -5 L-12 -8 M7 -5 L12 -9',stroke:'#111','stroke-width':2,fill:'none'}));
  } else if(it.type==='cone'){
    g.append(make('path',{d:'M0 -30 L22 24 H-22 Z',fill:'#ff7a00',stroke:'#b84a00','stroke-width':3}));g.append(make('path',{d:'M-13 8H13',stroke:'#ffe4b6','stroke-width':5}));g.append(make('rect',{x:-28,y:23,width:56,height:7,rx:3,fill:'#6d3a18'}));
  } else if(it.type==='marker'){
    g.append(make('ellipse',{cx:0,cy:4,rx:27,ry:13,fill:'#ffd23a',stroke:'#c79a00','stroke-width':3}));g.append(make('ellipse',{cx:0,cy:0,rx:13,ry:5,fill:'#fff2a3',opacity:.9}));
  } else if(it.type==='pole'){
    g.append(make('rect',{x:-4,y:-39,width:8,height:72,rx:4,fill:'#e13d48'}));g.append(make('rect',{x:-22,y:31,width:44,height:7,rx:3,fill:'#3a3a3a'}));g.append(make('circle',{cy:-39,r:4,fill:'#ff6b73'}));
  } else if(it.type==='hurdle'){
    g.append(make('path',{d:'M-29 28V-18H29V28',fill:'none',stroke:'#e34b43','stroke-width':8,'stroke-linecap':'round'}));g.append(make('path',{d:'M-38 29H-18M18 29H38',stroke:'#454545','stroke-width':6,'stroke-linecap':'round'}));g.append(make('line',{x1:-27,y1:-12,x2:27,y2:-12,stroke:'#ff9a94','stroke-width':2}));
  } else if(it.type==='ladder'){
    g.append(make('rect',{x:-55,y:-22,width:110,height:44,rx:4,fill:'none',stroke:'#e0af00','stroke-width':6}));[-33,-11,11,33].forEach(x=>g.append(make('line',{x1:x,y1:-22,x2:x,y2:22,stroke:'#e0af00','stroke-width':5})));
  } else if(it.type==='ring'){
    g.append(make('ellipse',{rx:28,ry:20,fill:'none',stroke:'#54ad45','stroke-width':8}));g.append(make('ellipse',{rx:21,ry:13,fill:'none',stroke:'#9fd594','stroke-width':2}));
  } else if(it.type==='mannequin'){
    g.append(make('circle',{cy:-35,r:11,fill:'#e0ad00',stroke:'#9e7a00','stroke-width':2}));g.append(make('path',{d:'M-20 -18 Q0-26 20-18 L15 17 Q0 26 -15 17 Z',fill:'#e0ad00',stroke:'#9e7a00','stroke-width':2}));g.append(make('line',{x1:0,y1:19,x2:0,y2:36,stroke:'#6f5b00','stroke-width':6}));g.append(make('line',{x1:-20,y1:38,x2:20,y2:38,stroke:'#4a4500','stroke-width':6,'stroke-linecap':'round'}));g.append(make('path',{d:'M-20 -9H20M-15 2H15',stroke:'#ffe77a','stroke-width':2,opacity:.8}));
  } else if(it.type==='goalLarge'||it.type==='goalSmall'){
    const large=it.type==='goalLarge',w=large?120:76,h=large?66:45,depth=large?32:22;const net=make('g',{stroke:'#cfd4d1','stroke-width':1.5,opacity:.85,fill:'none'});g.append(make('path',{d:`M${-w/2} ${h/2}V${-h/2}H${w/2}V${h/2}`,stroke:'#fff','stroke-width':7,fill:'none','stroke-linecap':'round'}));g.append(make('path',{d:`M${-w/2} ${-h/2} L${-w/2+depth} ${-h/2-depth/2} H${w/2+depth} L${w/2} ${-h/2} M${w/2+depth} ${-h/2-depth/2} V${h/2-depth/3} L${w/2} ${h/2}`,stroke:'#ecefec','stroke-width':4,fill:'none'}));
    const x0=-w/2+depth,x1=w/2+depth,y0=-h/2-depth/2,y1=h/2-depth/3;for(let x=x0+12;x<x1;x+=12)net.append(make('line',{x1:x,y1:y0,x2:x-depth,y2:y1}));for(let y=y0+10;y<y1;y+=10)net.append(make('line',{x1:x0,y1:y,x2:x1,y2:y}));g.append(net);
  } else if(it.type==='zone'){
    const w=it.zoneW||140,h=it.zoneH||90,c=it.color||'#ffd700';if((it.shape||'rect')==='circle'){g.append(make('ellipse',{rx:w/2,ry:h/2,fill:c,fillOpacity:.22,stroke:c,'stroke-width':4,'stroke-dasharray':'10 7'}))}else{g.append(make('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:10,fill:c,fillOpacity:.22,stroke:c,'stroke-width':4,'stroke-dasharray':'10 7'}))}
  }
  return g;
}
const lineStyles={pass:{color:'#ffffff',dash:'',width:4,label:'Pase'},move:{color:'#08bfe8',dash:'12 8',width:4,label:'Movimiento'},dribble:{color:'#f2c500',dash:'3 8',width:4,label:'Conducción'},sprint:{color:'#ff6b35',dash:'',width:7,label:'Sprint'}};
function lineGraphic(l){const st=lineStyles[l.kind]||lineStyles.pass,g=make('g',{'data-line-id':l.id,style:'cursor:grab'}),sel=selected?.kind==='line'&&selected.id===l.id;const a=Math.atan2(l.y2-l.y1,l.x2-l.x1),head=16+(st.width||4);const ex=l.x2-head*.55*Math.cos(a),ey=l.y2-head*.55*Math.sin(a);if(sel)g.append(make('line',{x1:l.x1,y1:l.y1,x2:ex,y2:ey,stroke:'#ffd700','stroke-width':st.width+9,'stroke-linecap':'round',opacity:.85,filter:'url(#selShadow)'}));g.append(make('line',{x1:l.x1,y1:l.y1,x2:ex,y2:ey,stroke:st.color,'stroke-width':st.width,'stroke-dasharray':st.dash,'stroke-linecap':'round'}));const p1=[l.x2,l.y2],p2=[l.x2-head*Math.cos(a-.55),l.y2-head*Math.sin(a-.55)],p3=[l.x2-head*Math.cos(a+.55),l.y2-head*Math.sin(a+.55)];if(sel)g.append(make('polygon',{points:[p1,p2,p3].map(p=>p.join(',')).join(' '),fill:'#ffd700',stroke:'#ffd700','stroke-width':6,'stroke-linejoin':'round'}));g.append(make('polygon',{points:[p1,p2,p3].map(p=>p.join(',')).join(' '),fill:st.color,stroke:st.color,'stroke-width':2,'stroke-linejoin':'round'}));g.append(make('line',{x1:l.x1,y1:l.y1,x2:l.x2,y2:l.y2,stroke:'transparent','stroke-width':20}));return g}
function render(){drawField();phase().lines.forEach(l=>svg.append(lineGraphic(l)));phase().items.forEach(i=>svg.append(itemGraphic(i)));updateCounts();updateInspector()}
function updateCounts(){counts.textContent=`Azules ${phase().items.filter(i=>i.type==='attacker').length} · Rojos ${phase().items.filter(i=>i.type==='defender').length}`}
function labelFor(it){const map={attacker:`Atacante azul ${it.number}`,defender:`Defensa rojo ${it.number}`,coach:'Entrenador',ball:'Balón',goalLarge:'Portería F7/F11',goalSmall:'Portería pequeña',cone:'Cono',marker:'Chincheta',pole:'Pica',hurdle:'Valla',ladder:'Escalera',ring:'Aro',mannequin:'Muñeco',zone:'Zona'};return map[it.type]||it.type}
function updateInspector(){const it=selectedItem(),ln=selectedLine();if(!it&&!ln){inspectorEmpty.classList.remove('hidden');inspectorBody.classList.add('hidden');return}inspectorEmpty.classList.add('hidden');inspectorBody.classList.remove('hidden');if(ln){selectedLabel.textContent=`SELECCIONADO · ${lineStyles[ln.kind].label.toUpperCase()}`;document.getElementById('sizeControl').classList.add('hidden');document.getElementById('rotationControl').classList.add('hidden');zoneControls.classList.add('hidden');return}document.getElementById('sizeControl').classList.remove('hidden');document.getElementById('rotationControl').classList.remove('hidden');selectedLabel.textContent=`SELECCIONADO · ${labelFor(it).toUpperCase()}`;sizeRange.value=Math.round((it.scale||1)*100);sizeOut.textContent=`${sizeRange.value}%`;rotRange.value=it.rot||0;rotOut.textContent=`${rotRange.value}°`;if(it.type==='zone'){zoneControls.classList.remove('hidden');zoneShape.value=it.shape||'rect';zoneColor.value=it.color||'#ffd700';zoneW.value=it.zoneW||140;zoneH.value=it.zoneH||90;zoneWOut.textContent=zoneW.value;zoneHOut.textContent=zoneH.value}else zoneControls.classList.add('hidden')}
function addItem(type){pushHistory();const c=centerPoint(),it={id:`i${idSeq++}`,type,x:c.x,y:c.y,rot:0,scale:1};if(type==='attacker'||type==='defender')it.number=nextNumber(type);if(type==='zone'){it.shape='rect';it.color='#ffd700';it.zoneW=140;it.zoneH=90}phase().items.push(it);selected={kind:'item',id:it.id};drawMode=null;syncDrawButtons();render()}
function point(e){const r=svg.getBoundingClientRect(),v=currentView();return{x:v.x+(e.clientX-r.left)/r.width*v.w,y:v.y+(e.clientY-r.top)/r.height*v.h}}
function syncDrawButtons(){document.querySelectorAll('[data-draw]').forEach(b=>b.classList.toggle('active',b.dataset.draw===drawMode))}

document.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>addItem(b.dataset.add)));
document.querySelectorAll('[data-draw]').forEach(b=>b.addEventListener('click',()=>{drawMode=drawMode===b.dataset.draw?null:b.dataset.draw;selected=null;syncDrawButtons();render()}));
fieldType.addEventListener('change',()=>{pushHistory();project.field=fieldType.value;render()});document.getElementById('format').addEventListener('change',e=>project.format=e.target.value);
document.getElementById('collapseMaterial').addEventListener('click',e=>{shell.classList.toggle('material-collapsed');e.currentTarget.textContent=shell.classList.contains('material-collapsed')?'›':'‹'});

const actionPointerDown=(e)=>{
  const itemNode=e.target.closest('[data-id]'),lineNode=e.target.closest('[data-line-id]');
  if(itemNode){const id=itemNode.dataset.id,it=phase().items.find(x=>x.id===id);selected={kind:'item',id};drawMode=null;syncDrawButtons();pushHistory();const p=point(e);drag={kind:'item',id,start:p,ox:it.x,oy:it.y,node:itemNode};svg.setPointerCapture?.(e.pointerId);updateInspector();render();return}
  if(lineNode){const id=lineNode.dataset.lineId,l=phase().lines.find(x=>x.id===id);selected={kind:'line',id};drawMode=null;syncDrawButtons();pushHistory();const p=point(e);drag={kind:'line',id,start:p,orig:clone(l),node:lineNode};svg.setPointerCapture?.(e.pointerId);updateInspector();render();return}
  if(drawMode){pushHistory();const p=point(e);draft={kind:drawMode,start:p};return}
  selected=null;render();
};
svg.addEventListener('pointerdown',actionPointerDown);
svg.addEventListener('pointermove',e=>{if(!drag&&!draft)return;const p=point(e);if(drag?.kind==='item'){const it=phase().items.find(x=>x.id===drag.id);it.x=drag.ox+(p.x-drag.start.x);it.y=drag.oy+(p.y-drag.start.y);const node=svg.querySelector(`[data-id="${drag.id}"]`);if(node)node.setAttribute('transform',`translate(${it.x} ${it.y}) rotate(${it.rot||0}) scale(${it.scale||1})`)}else if(drag?.kind==='line'){const l=phase().lines.find(x=>x.id===drag.id),dx=p.x-drag.start.x,dy=p.y-drag.start.y;l.x1=drag.orig.x1+dx;l.y1=drag.orig.y1+dy;l.x2=drag.orig.x2+dx;l.y2=drag.orig.y2+dy;render()}else if(draft){render();const st=lineStyles[draft.kind],line=make('line',{id:'draftLine',x1:draft.start.x,y1:draft.start.y,x2:p.x,y2:p.y,stroke:st.color,'stroke-width':st.width,'stroke-dasharray':st.dash,'stroke-linecap':'round'});svg.append(line)}});
svg.addEventListener('pointerup',e=>{if(draft){const p=point(e),dx=p.x-draft.start.x,dy=p.y-draft.start.y;if(Math.hypot(dx,dy)>8)phase().lines.push({id:`l${lineSeq++}`,kind:draft.kind,x1:draft.start.x,y1:draft.start.y,x2:p.x,y2:p.y});draft=null;drawMode=null;syncDrawButtons()}drag=null;render()});
svg.addEventListener('pointercancel',()=>{drag=null;draft=null;render()});

[sizeRange,rotRange,zoneColor,zoneW,zoneH].forEach(c=>c.addEventListener('pointerdown',()=>{if(selected)pushHistory()},{once:false}));
sizeRange.addEventListener('input',()=>{const it=selectedItem();if(!it)return;it.scale=Number(sizeRange.value)/100;sizeOut.textContent=`${sizeRange.value}%`;render()});rotRange.addEventListener('input',()=>{const it=selectedItem();if(!it)return;it.rot=Number(rotRange.value);rotOut.textContent=`${rotRange.value}°`;render()});
document.querySelectorAll('[data-size-step]').forEach(b=>b.addEventListener('click',()=>{const it=selectedItem();if(!it)return;pushHistory();it.scale=Math.max(.4,Math.min(2.2,(it.scale||1)+Number(b.dataset.sizeStep)/100));render()}));
document.querySelectorAll('[data-rot-step]').forEach(b=>b.addEventListener('click',()=>{const it=selectedItem();if(!it)return;pushHistory();it.rot=((it.rot||0)+Number(b.dataset.rotStep)+540)%360-180;render()}));
zoneShape.addEventListener('change',()=>{const it=selectedItem();if(it?.type==='zone'){pushHistory();it.shape=zoneShape.value;render()}});zoneColor.addEventListener('input',()=>{const it=selectedItem();if(it?.type==='zone'){it.color=zoneColor.value;render()}});zoneW.addEventListener('input',()=>{const it=selectedItem();if(it?.type==='zone'){it.zoneW=Number(zoneW.value);zoneWOut.textContent=zoneW.value;render()}});zoneH.addEventListener('input',()=>{const it=selectedItem();if(it?.type==='zone'){it.zoneH=Number(zoneH.value);zoneHOut.textContent=zoneH.value;render()}});
document.querySelectorAll('[data-zone-w]').forEach(b=>b.addEventListener('click',()=>{const it=selectedItem();if(it?.type!=='zone')return;pushHistory();it.zoneW=Math.max(50,Math.min(280,(it.zoneW||140)+Number(b.dataset.zoneW)));render()}));document.querySelectorAll('[data-zone-h]').forEach(b=>b.addEventListener('click',()=>{const it=selectedItem();if(it?.type!=='zone')return;pushHistory();it.zoneH=Math.max(50,Math.min(240,(it.zoneH||90)+Number(b.dataset.zoneH)));render()}));

document.getElementById('deselect').addEventListener('click',()=>{selected=null;render()});document.getElementById('deleteSelected').addEventListener('click',()=>{if(!selected)return;pushHistory();if(selected.kind==='item')phase().items=phase().items.filter(i=>i.id!==selected.id);else phase().lines=phase().lines.filter(l=>l.id!==selected.id);selected=null;render()});document.getElementById('duplicate').addEventListener('click',()=>{const it=selectedItem();if(!it)return;pushHistory();const cp=clone(it);cp.id=`i${idSeq++}`;cp.x+=28;cp.y+=28;if(cp.type==='attacker'||cp.type==='defender')cp.number=nextNumber(cp.type);phase().items.push(cp);selected={kind:'item',id:cp.id};render()});
document.getElementById('undo').addEventListener('click',()=>{if(!history.length)return;future.push(clone(project));restore(history.pop())});document.getElementById('redo').addEventListener('click',()=>{if(!future.length)return;history.push(clone(project));restore(future.pop())});document.getElementById('clearAll').addEventListener('click',()=>{if(!phase().items.length&&!phase().lines.length)return;pushHistory();phase().items=[];phase().lines=[];selected=null;render()});
document.getElementById('sample').addEventListener('click',()=>{pushHistory();const c=centerPoint();phase().items=[{id:`i${idSeq++}`,type:'attacker',number:1,x:c.x-80,y:160,rot:0,scale:1},{id:`i${idSeq++}`,type:'defender',number:1,x:c.x-110,y:470,rot:0,scale:1},{id:`i${idSeq++}`,type:'coach',x:c.x+70,y:175,rot:0,scale:1},{id:`i${idSeq++}`,type:'goalSmall',x:150,y:315,rot:90,scale:1},{id:`i${idSeq++}`,type:'ladder',x:c.x+40,y:470,rot:0,scale:.9},{id:`i${idSeq++}`,type:'cone',x:c.x-20,y:530,rot:0,scale:.8},{id:`i${idSeq++}`,type:'zone',x:c.x+90,y:315,rot:0,scale:1,shape:'rect',color:'#ffd700',zoneW:120,zoneH:82}];phase().lines=[{id:`l${lineSeq++}`,kind:'pass',x1:c.x-110,y1:205,x2:c.x-210,y2:255},{id:`l${lineSeq++}`,kind:'move',x1:c.x+70,y1:180,x2:c.x+190,y2:220}];selected=null;render()});

// Preparación de Fase 2: el modelo ya trabaja por fases. La futura UI solo tendrá que clonar/activar fases,
// sin migrar los objetos ni las trayectorias actuales.
window.__CampoBaseBoard={getProject:()=>clone(project),createNextPhase(){const current=phase(),n=project.phases.length+1,id=`phase-${n}`;project.phases.push({id,name:`Fase ${n}`,items:clone(current.items),lines:[]});project.currentPhaseId=id;render();return id},setPhase(id){if(project.phases.some(p=>p.id===id)){project.currentPhaseId=id;selected=null;render()}}};

render();
