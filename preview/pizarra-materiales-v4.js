// V4 se carga despues de V3 y amplia solo lo validado.
const V4_X0=70,V4_X1=930,V4_Y0=30,V4_Y1=595,V4_W=V4_X1-V4_X0,V4_H=V4_Y1-V4_Y0;

// Colores y trazados.
lineStyles.pass.color='#1a1a1a';
lineStyles.shot={color:'#c8102e',dash:'',width:6,label:'Disparo'};
lineStyles.zigzag={color:'#7b3ff2',dash:'',width:4,label:'Zig-zag'};

// El campo mantiene espacio real detras de ambas lineas de meta.
currentView=function(){
  if(project.field==='half')return{x:0,y:0,w:500,h:625};
  if(project.field==='third')return{x:0,y:0,w:V4_X0+V4_W/3,h:625};
  return{x:0,y:0,w:1000,h:625};
};

function v4Rect(g,x,y,w,h,extra={}){g.append(make('rect',{x,y,width:w,height:h,...extra}))}
function v4Line(g,x1,y1,x2,y2,extra={}){g.append(make('line',{x1,y1,x2,y2,...extra}))}

// F11 y F7 tienen marcaciones propias. En F7 la zona de fuera de juego se marca a 12 m.
drawField=function(){
  svg.innerHTML='';applyView();
  const defs=make('defs');
  const shadow=make('filter',{id:'selShadow',x:'-40%',y:'-40%',width:'180%',height:'180%'});
  shadow.append(make('feDropShadow',{dx:0,dy:0,stdDeviation:4,'flood-color':'#ffd700','flood-opacity':.95}));defs.append(shadow);svg.append(defs);

  // Franja exterior: espacio util para redes/porterias fuera de la linea de meta.
  svg.append(make('rect',{x:0,y:0,width:1000,height:625,fill:'#15533a'}));
  svg.append(make('rect',{x:V4_X0,y:V4_Y0,width:V4_W,height:V4_H,fill:'#1e6d46'}));
  for(let i=0;i<12;i++)svg.append(make('rect',{x:V4_X0+i*(V4_W/12),y:V4_Y0,width:V4_W/12,height:V4_H,fill:i%2?'#236f48':'#287a50',opacity:.42}));

  const g=make('g',{stroke:'#fff','stroke-width':4,fill:'none',opacity:.96});
  v4Rect(g,V4_X0,V4_Y0,V4_W,V4_H,{rx:2});
  v4Line(g,500,V4_Y0,500,V4_Y1);

  const f7=project.format==='F7';
  if(f7){
    // Referencia visual 60x40 m, dentro del rango reglamentario F7.
    const pxX=V4_W/60,pxY=V4_H/40;
    const centreR=6*((pxX+pxY)/2);
    g.append(make('circle',{cx:500,cy:312.5,r:centreR}));
    g.append(make('circle',{cx:500,cy:312.5,r:4,fill:'#fff',stroke:'none'}));

    const goalHalf=3*pxY;
    const penaltyDepth=9*pxX,penaltyHalf=(3+9)*pxY;
    const goalAreaDepth=3*pxX,goalAreaHalf=(3+3)*pxY;
    v4Rect(g,V4_X0,312.5-penaltyHalf,penaltyDepth,penaltyHalf*2);
    v4Rect(g,V4_X1-penaltyDepth,312.5-penaltyHalf,penaltyDepth,penaltyHalf*2);
    v4Rect(g,V4_X0,312.5-goalAreaHalf,goalAreaDepth,goalAreaHalf*2);
    v4Rect(g,V4_X1-goalAreaDepth,312.5-goalAreaHalf,goalAreaDepth,goalAreaHalf*2);
    g.append(make('circle',{cx:V4_X0+penaltyDepth,cy:312.5,r:4,fill:'#fff',stroke:'none'}));
    g.append(make('circle',{cx:V4_X1-penaltyDepth,cy:312.5,r:4,fill:'#fff',stroke:'none'}));

    // Lineas F7 de zona de fuera de juego: 12 m desde cada linea de meta.
    const off=12*pxX;
    v4Line(g,V4_X0+off,V4_Y0,V4_X0+off,V4_Y1,{'stroke-width':3,'stroke-dasharray':'12 8',opacity:.92});
    v4Line(g,V4_X1-off,V4_Y0,V4_X1-off,V4_Y1,{'stroke-width':3,'stroke-dasharray':'12 8',opacity:.92});
    svg.append(g);

    const labels=make('g',{'font-size':13,'font-weight':850,fill:'#fff',opacity:.9,'pointer-events':'none'});
    const t1=make('text',{x:V4_X0+off+7,y:V4_Y0+18});t1.textContent='12 m · fuera de juego';labels.append(t1);
    const t2=make('text',{x:V4_X1-off-7,y:V4_Y1-10,'text-anchor':'end'});t2.textContent='12 m · fuera de juego';labels.append(t2);svg.append(labels);
  }else{
    // F11: marcacion proporcional a 105x68 m.
    const pxX=V4_W/105,pxY=V4_H/68;
    const centreR=9.15*((pxX+pxY)/2);
    g.append(make('circle',{cx:500,cy:312.5,r:centreR}));
    g.append(make('circle',{cx:500,cy:312.5,r:4,fill:'#fff',stroke:'none'}));
    const goalHalf=3.66*pxY;
    const penaltyDepth=16.5*pxX,penaltyHalf=(3.66+16.5)*pxY;
    const goalAreaDepth=5.5*pxX,goalAreaHalf=(3.66+5.5)*pxY;
    v4Rect(g,V4_X0,312.5-penaltyHalf,penaltyDepth,penaltyHalf*2);
    v4Rect(g,V4_X1-penaltyDepth,312.5-penaltyHalf,penaltyDepth,penaltyHalf*2);
    v4Rect(g,V4_X0,312.5-goalAreaHalf,goalAreaDepth,goalAreaHalf*2);
    v4Rect(g,V4_X1-goalAreaDepth,312.5-goalAreaHalf,goalAreaDepth,goalAreaHalf*2);
    g.append(make('circle',{cx:V4_X0+11*pxX,cy:312.5,r:4,fill:'#fff',stroke:'none'}));
    g.append(make('circle',{cx:V4_X1-11*pxX,cy:312.5,r:4,fill:'#fff',stroke:'none'}));
    svg.append(g);
  }

  // Guias discretas de centro de porteria en las lineas de meta.
  const guides=make('g',{stroke:'#d9f1e5','stroke-width':2,opacity:.5,'pointer-events':'none'});
  v4Line(guides,V4_X0,285,V4_X0,340);v4Line(guides,V4_X1,285,V4_X1,340);svg.append(guides);
};

// Porteros: mismo color de equipo, forma cuadrada y P para distinguirlos a primera vista.
const v3Bounds=bounds;
bounds=function(it){if(it.type==='keeperBlue'||it.type==='keeperRed'){const s=it.scale||1;return{w:52*s,h:52*s}}return v3Bounds(it)};
const v3ItemGraphic=itemGraphic;
itemGraphic=function(it){
  if(it.type!=='keeperBlue'&&it.type!=='keeperRed')return v3ItemGraphic(it);
  const g=make('g',{'data-id':it.id,transform:`translate(${it.x} ${it.y}) rotate(${it.rot||0}) scale(${it.scale||1})`,style:'cursor:grab'});
  if(selected?.kind==='item'&&selected.id===it.id)selectionFrame(g,it);
  const fill=it.type==='keeperBlue'?'#1667d9':'#e12f3b';
  g.append(make('rect',{x:-22,y:-22,width:44,height:44,rx:11,fill,stroke:'#fff','stroke-width':3}));
  g.append(make('rect',{x:-24,y:-24,width:48,height:48,rx:13,fill:'none',stroke:'#000','stroke-opacity':.18,'stroke-width':2}));
  const t=make('text',{x:0,y:7,'text-anchor':'middle','font-size':19,'font-weight':950,fill:'#fff','pointer-events':'none'});t.textContent='P';g.append(t);return g;
};
const v3LabelFor=labelFor;
labelFor=function(it){if(it.type==='keeperBlue')return'Portero azul';if(it.type==='keeperRed')return'Portero rojo';return v3LabelFor(it)};
updateCounts=function(){
  const a=phase().items.filter(i=>i.type==='attacker').length,kb=phase().items.filter(i=>i.type==='keeperBlue').length;
  const d=phase().items.filter(i=>i.type==='defender').length,kr=phase().items.filter(i=>i.type==='keeperRed').length;
  counts.textContent=`Azules ${a}${kb?` + P ${kb}`:''} · Rojos ${d}${kr?` + P ${kr}`:''}`;
};

// Zig-zag real, no una linea discontinua disfrazada.
const v3LineGraphic=lineGraphic;
function zigPoints(l){
  const dx=l.x2-l.x1,dy=l.y2-l.y1,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len,steps=Math.max(6,Math.min(14,Math.round(len/45))),amp=12;
  const pts=[];for(let i=0;i<=steps;i++){const t=i/steps,off=(i===0||i===steps)?0:(i%2?amp:-amp);pts.push([l.x1+dx*t+nx*off,l.y1+dy*t+ny*off])}return pts;
}
lineGraphic=function(l){
  if(l.kind!=='zigzag')return v3LineGraphic(l);
  const st=lineStyles.zigzag,g=make('g',{'data-line-id':l.id,style:'cursor:grab'}),sel=selected?.kind==='line'&&selected.id===l.id,pts=zigPoints(l);
  const pstr=pts.map(p=>p.join(',')).join(' ');
  if(sel)g.append(make('polyline',{points:pstr,fill:'none',stroke:'#ffd700','stroke-width':st.width+9,'stroke-linecap':'round','stroke-linejoin':'round',opacity:.85,filter:'url(#selShadow)'}));
  g.append(make('polyline',{points:pstr,fill:'none',stroke:st.color,'stroke-width':st.width,'stroke-linecap':'round','stroke-linejoin':'round'}));
  const a0=pts[pts.length-2],a1=pts[pts.length-1],a=Math.atan2(a1[1]-a0[1],a1[0]-a0[0]),head=20;
  const p1=a1,p2=[a1[0]-head*Math.cos(a-.55),a1[1]-head*Math.sin(a-.55)],p3=[a1[0]-head*Math.cos(a+.55),a1[1]-head*Math.sin(a+.55)];
  if(sel)g.append(make('polygon',{points:[p1,p2,p3].map(p=>p.join(',')).join(' '),fill:'#ffd700',stroke:'#ffd700','stroke-width':6,'stroke-linejoin':'round'}));
  g.append(make('polygon',{points:[p1,p2,p3].map(p=>p.join(',')).join(' '),fill:st.color,stroke:st.color,'stroke-width':2,'stroke-linejoin':'round'}));
  g.append(make('line',{x1:l.x1,y1:l.y1,x2:l.x2,y2:l.y2,stroke:'transparent','stroke-width':24}));return g;
};

function updateFormatNote(){const n=document.getElementById('formatNote');if(n)n.textContent=project.format==='F7'?'F7 · línea de fuera de juego a 12 m':'F11 · marcación estándar'}
const v3Render=render;
render=function(){v3Render();updateFormatNote()};
document.getElementById('format').addEventListener('change',()=>render());

// Re-render final con todas las ampliaciones activas.
render();
