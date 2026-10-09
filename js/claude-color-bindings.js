import { timePlanColorSections } from './time-plan-color-controls.js';
import { SECTIONS } from './claude-color-catalog.js';
import { configurableElements } from './theme-component-colors.js?v=20261009-plan-tramos-2';
const viewSections={hoy:['hoy'],plantilla:['ind','lz','cl','fi'],'cuerpo-tecnico':['tec'],asistencia:['asi'],convocatorias:['con'],preparacion:['pre'],partido:['viv'],calendario:['cal'],sesiones:['ses'],ejercicios:['eje'],tacticas:['tac'],delegado:['mc'],navegacion:['nav']};
const mappings={};
const bind=(id,base,parts={})=>mappings[id]={base,parts};
bind('hoy.hero','#hoy .today-hero',{sub:'.eyebrow',text:'h3'});
bind('hoy.cnt','#hoy .today-count',{num:'strong',label:'span'});
bind('hoy.card','#hoy .cbx-card',{title:'h3'});
bind('hoy.count','#hoy .today-title-row .pill');
bind('hoy.match','#hoy .today-event.match',{score:'.cbx-today-score',text:'.meta'});
bind('hoy.next','#hoy .today-event',{title:'h3',text:'.today-event-meta'});
bind('hoy.btn','#hoy .primary');bind('hoy.btn2','#hoy .secondary');bind('hoy.btnD','#hoy .cbx-today-match .secondary');bind('hoy.wa','#hoy [data-today-wa]');
bind('hoy.pts','#hoy .cbx-season .today-ok');
bind('hoy.res','#hoy .cbx-result',{win:'&.cbx-result-W',draw:'&.cbx-result-D',loss:'&.cbx-result-L'});
bind('hoy.gf','#hoy .cbx-season-goals-for',{bar:'@#hoy .cbx-season-bars > div > div > i:first-child',legBg:'@#hoy .cbx-season-totals > span:first-child',legText:'@#hoy .cbx-season-totals > span:first-child'});
bind('hoy.ga','#hoy .cbx-season-goals-against',{bar:'@#hoy .cbx-season-bars > div > div > i:nth-child(2)',legBg:'@#hoy .cbx-season-totals > span:nth-child(2)',legText:'@#hoy .cbx-season-totals > span:nth-child(2)'});
bind('hoy.chart','#hoy .cbx-season-bars',{axis:'',label:'small'});
bind('hoy.task','#hoy .today-pending',{title:'strong',text:'small'});bind('hoy.quick','#hoy .today-quick button');
for(const [i,key] of ['jug','min','rot'].entries())bind('pl.'+key,`#squad-stats .stat:nth-child(${i+1})`,{num:'strong',label:'span'});
bind('fi.card','#plantilla .cbx-player');bind('fi.av','#plantilla .player-avatar');bind('fi.name','#plantilla .player-name h3',{dorsal:'@#plantilla .player-name .pill'});
bind('fi.media','#plantilla .player-rating-badge',{num:'.valor',label:'.etiqueta'});
bind('fi.min','#plantilla .player-minute-bar',{label:'.player-minute-meta > span:first-child',num:'.player-minute-meta > span:last-child',fill:'.player-minute-fill',track:'.player-minute-track'});
for(const key of ['pen','fal','cor','cap'])bind('fi.'+key,`#plantilla .specialist-pill[data-specialty="${key}"]`,{emo:'.cbx-specialty-icon'});
bind('fi.pos','#plantilla .player-data > span:nth-child(2)',{label:'small',text:'strong'});
bind('fi.data','#plantilla .player-data > span:not(:nth-child(2))',{label:'small',text:'strong'});
bind('fi.par','#plantilla .player-family-contacts > *',{name:'.cbx-family-name',phone:'.cbx-family-phone'});
bind('fi.wa','#plantilla .open-whatsapp-player');bind('fi.btnE','#plantilla .edit-player');bind('fi.btnB','#plantilla .delete-player');bind('fi.act','#plantilla .player-performance-summary');
bind('lz.box','#plantilla-specialists-bar > div',{title:'h3',sub:'p'});bind('lz.pill','#plantilla-specialists-bar .specialist-item',{label:'h4',names:'strong'});
bind('lz.ico','#plantilla-specialists-bar .sp-icon',{emoPen:'@#plantilla-specialists-bar .specialist-item:nth-child(1) .sp-icon',emoFal:'@#plantilla-specialists-bar .specialist-item:nth-child(2) .sp-icon, #plantilla-specialists-bar .specialist-item:nth-child(3) .sp-icon',emoCor:'@#plantilla-specialists-bar .specialist-item:nth-child(4) .sp-icon, #plantilla-specialists-bar .specialist-item:nth-child(5) .sp-icon',emoCap:'@#plantilla-specialists-bar .specialist-item:nth-child(6) .sp-icon'});
for(const rank of [1,2,3])bind('lz.r'+rank,`#plantilla-specialists-bar [data-specialist-rank="${rank}"]`,{name:'strong',tagBg:'.specialist-rank',tagText:'.specialist-rank',numBg:'.specialist-number',numText:'.specialist-number'});
bind('lz.btn','#plantilla-specialists-bar .open-set-pieces-trigger');
bind('cl.tab','#squad-leaderboards .lb-tab-btn',{bg:'&:not(.active)',text:'&:not(.active)',border:'&:not(.active)',activeBg:'&.active',activeText:'&.active'});
bind('cl.scope','#squad-leaderboards .lb-scope-btn',{activeBg:'&.active',activeText:'&.active',text:'&:not(.active)'});
bind('cl.head','#squad-leaderboards .lb-table thead');
bind('cl.row','#squad-leaderboards .lb-table tbody tr',{top:'&:first-child',bg:'&:nth-child(odd)',alt:'&:nth-child(even)'});
bind('cl.av','#squad-leaderboards .lb-avatar');
const others={tec:['cuerpo-tecnico','.cbx-staff-card'],asi:['asistencia','.cbx-attendance-card'],con:['convocatorias','.cbx-callup-card'],pre:['preparacion','.cbx-prep-card'],viv:['partido','.cbx-live-hero'],cal:['calendario','.match-card'],ses:['sesiones','.session-card'],eje:['ejercicios','.exercise-card'],tac:['tacticas','.cbx-tactics-hero'],mc:['delegado','.panel']};
for(const [prefix,[view,card]] of Object.entries(others)){
 const root='#'+view;
 bind(prefix+'.ban',root+' .cbx-banner',{title:'h2',sub:'.eyebrow'});bind(prefix+'.cta',root+' .cbx-banner .primary');bind(prefix+'.card',root+' '+card,{title:'h3',sub:'.meta',name:'h3',info:'.meta'});
 bind(prefix+'.btn2',root+' .secondary');bind(prefix+'.wa',root+' [class*=whatsapp], '+root+' .cbx-btn-wa');
}
bind('con.card','#convocatorias .cbx-callup-card, #convocatorias .cbx-callup-distribution, #convocatorias .cbx-callup-plan, #convocatorias .cbx-callup-layout .panel, #convocatorias .callup-card');
bind('con.done','#convocatorias .cbx-btn-completed');
bind('con.btn2','#convocatorias .callup-open-prep');
bind('con.edit','#convocatorias .edit-callup');
bind('con.del','#convocatorias .delete-callup');
bind('con.riv','#convocatorias .cbx-callup-card > header',{title:'h3',sub:'.meta'});bind('con.cnt','#convocatorias .cbx-callup-badge-in');bind('con.out','#convocatorias .cbx-callup-badge-out');bind('con.num','#convocatorias .cbx-callup-dorsal');bind('con.row','#convocatorias .cbx-callup-player',{name:'strong',pos:'.meta'});bind('con.ok','#convocatorias .cbx-callup-status');
bind('ses.btn2','#sesiones .cbx-btn-whistle, #sesiones .print-session, #sesiones .edit-session, #sesiones .cbx-btn-completed');
bind('eje.close','#exercise-detail-dialog .dialog-close-prominent-btn, #exercise-detail-dialog .modal-bottom-close-btn');
bind('tac.ban','#tacticas .cbx-tactics-hero',{title:'.cbx-tactics-hero-text h2',sub:'.cbx-tactics-hero-text p'});
bind('nav.side','#cb-claude-sidebar',{group:'.cb-shell-group h2',text:'button:not(.active)',activeBg:'button.active',activeText:'button.active',activeBar:'button.active'});
bind('nav.bot','#cb-bottom-nav',{icon:'.cb-nav-tab:not(.active) svg',text:'.cb-nav-tab:not(.active) span',activeIcon:'.cb-nav-tab.active svg',activeText:'.cb-nav-tab.active span'});

bind('hoy.live','#hoy .cbx-today-live-chip');bind('hoy.chip','#hoy .today-status-row .pill:not(.accent):not(.today-warning):not(.today-ok)');bind('hoy.date','#hoy .today-status-row .accent');bind('hoy.ok','#hoy .today-ok');bind('hoy.warn','#hoy .today-warning');
bind('hoy.wa','#hoy .open-whatsapp-session, #hoy .open-whatsapp-match');
bind('tec.cnt','#cuerpo-tecnico .staff-count');bind('tec.role','#cuerpo-tecnico .staff-badge');bind('tec.av','#cuerpo-tecnico .staff-avatar-initials');bind('tec.txt','#cuerpo-tecnico .staff-card',{name:'.staff-name',func:'.staff-role-title',info:'.staff-card-body'});bind('tec.btnE','#cuerpo-tecnico .edit-staff-btn');
bind('asi.box','#asistencia .attendance-editor-head',{title:'h3',sub:'p'});bind('asi.sum','#asistencia .attendance-editor-summary');bind('asi.num','#asistencia .attendance-avatar');bind('asi.name','#asistencia .attendance-player-ident strong');
for(const [id,cls]of [['pres','present'],['tarde','late'],['aus','absent']])bind('asi.'+id,'#asistencia .attendance-choice.'+cls+'.selected');bind('asi.off','#asistencia .attendance-choice:not(.selected)');bind('asi.save','#asistencia .attendance-save-row .primary');
bind('asi.mot','#asistencia .attendance-reason',{activeBg:'&.selected',activeText:'&.selected',bg:'&:not(.selected)',border:'&:not(.selected)',text:'&:not(.selected)'});
bind('con.ex','#convocatorias .cbx-callup-player.is-out .cbx-callup-status');
bind('pre.ok','#preparacion .is-prepared .pill');bind('pre.dark','#preparacion .prep-toggle-delegate');bind('pre.btn2','#preparacion .prep-view-tactic');bind('pre.del','#preparacion .prep-delete');bind('pre.gk','#preparacion .cbx-prep-keepers label');bind('pre.form','#preparacion .cbx-formation-pills button',{activeBg:'&[aria-pressed=true]',activeText:'&[aria-pressed=true]',bg:'&[aria-pressed=false]',text:'&[aria-pressed=false]'});bind('pre.save','#preparacion #prep-save');
bind('viv.sb','#partido .cbx-live-hero',{score:'.cbx-live-score',clock:'.cbx-live-clock',text:'.cbx-live-team'});bind('viv.gol','#partido #goal-for-btn');bind('viv.riv','#partido #goal-against-btn');bind('viv.pause','#partido #pause-btn');bind('viv.half','#partido #half-time-btn');bind('viv.plan','#partido .cbx-live-plan',{title:'h3',text:'p',btnBg:'button',btnText:'button'});bind('viv.row','#partido .player-timer',{name:'strong',min:'.timer-minutes',fill:'.player-minute-fill',track:'.player-minute-track'});
bind('ses.card','#sesiones .cbx-session-card',{title:'h3',text:'.cbx-session-meta'});bind('ses.date','#sesiones .cbx-session-date');bind('ses.warn','#sesiones .today-warning');bind('ses.blk','#sesiones .cbx-session-block-row',{title:'strong',text:'.cbx-session-block-phase',num:'.cbx-session-block-duration'});bind('ses.play','#sesiones .cbx-session-block-play');bind('ses.silb','#sesiones .cbx-btn-whistle');bind('ses.waw','#sesiones #whatsapp-week-btn');
bind('eje.card','#ejercicios .sp-card, #ejercicios .exercise-card',{title:'h3',cat:'.cbx-card-cat-fmt',mat:'.cbx-card-mat',text:'p'});bind('eje.jug','#ejercicios .cbx-card-pill-players, #ejercicios .sp-players-badge');bind('eje.dif','#ejercicios .cbx-card-pill-diff');bind('eje.ver','#ejercicios button.view-exercise');bind('eje.add','#ejercicios .add-exercise-to-session');bind('eje.cat','#ejercicios select');
bind('tac.form','#tacticas .cbx-formation-pills button',{activeBg:'&[aria-pressed=true]',activeText:'&[aria-pressed=true]',bg:'&[aria-pressed=false]',text:'&[aria-pressed=false]'});bind('tac.tool','#tacticas .tb-toolbar button');bind('tac.save','#tacticas #save-tactic');bind('tac.list','#tacticas .tactic-card');
bind('mc.top','#delegado .cbx-banner',{title:'h2',sub:'p'});bind('mc.card','#delegado .panel',{title:'h3',text:'.meta'});bind('mc.live','#delegado #delegate-live-btn');bind('mc.chip','#delegado .pill');
const cssProperty=key=>/^emo/.test(key)?'icon':/bg|win|draw|loss|fill|track|grass|bar|alt|topT|topP/.test(key.toLowerCase())?'background':key==='top'?'border-top-color':/border/.test(key)?'border-color':key==='accent'||key==='activeBar'?'border-left-color':key==='axis'?'border-bottom-color':key==='line'?'border-color':'color';
const query=selector=>{try{return [...document.querySelectorAll(selector)];}catch{return [];}};
const targetSelector=(mapping,key)=>{const part=mapping.parts[key]??'';return part.startsWith('@')?part.slice(1):mapping.base.split(', ').map(base=>part.startsWith('&')?base+part.slice(1):base+(part?' '+part:'')).join(', ');};
export function claudeColorSections(viewId,scope) {
 const planSections=timePlanColorSections(viewId,scope);if(planSections)return planSections;
 const ids=viewSections[viewId]||[];
 const within=nodes=>nodes.some(node=>!scope||scope===node||scope.contains(node));
 const sections=SECTIONS.filter(section=>ids.includes(section.id)).map(section=>({...section,els:section.els.map(element=>{
  const mapping=mappings[element.id];if(!mapping)return null;
  const props=element.props.map(prop=>({...prop,selector:targetSelector(mapping,prop.key),css:cssProperty(prop.key),viewId})).filter(prop=>(prop.css!=='icon'||mapping.parts[prop.key])&&within(query(prop.selector)));
  // Font controls belong to this concrete element; do not affect other sections.
  const text=props.find(prop=>prop.css==='color');if(text)props.push(...[['font-family','Familia de la fuente'],['font-size','Tamaño de la fuente'],['font-weight','Grosor de la fuente']].map(([css,label])=>({key:css,label,css,selector:text.selector,viewId})));
  return props.length?{...element,name:element.id==='eje.jug'?'Etiqueta de número de jugadores':element.name,props}:null;
 }).filter(Boolean)})).filter(section=>section.els.length);
 // Match the real table's headings instead of the prototype's example column order.
 if(viewId==='plantilla'&&(!scope||scope.id==='squad-leaderboards')){
  const section=sections.find(s=>s.id==='cl');document.querySelectorAll('#squad-leaderboards .lb-table thead th').forEach((th,index)=>{
   const name=th.textContent.trim();const base='#squad-leaderboards .lb-table';section?.els.push({id:'column-'+index,name:'Columna «'+name+'»',scope:'Esta columna en todas las clasificaciones',props:[{key:'head',label:'Título «'+name+'»',css:'color',selector:base+' thead th:nth-child('+(index+1)+')',viewId},{key:'val',label:'Valores de «'+name+'»',css:'color',selector:base+' tbody td:nth-child('+(index+1)+')',viewId},{key:'bg',label:'Fondo de «'+name+'»',css:'background',selector:base+' tbody td:nth-child('+(index+1)+')',viewId}]});
  });
 }
 if(viewId==='plantilla'&&(!scope||scope.id==='squad-leaderboards')){
  const section=sections.find(s=>s.id==='cl');
  const add=(id,name,selector,scopeText)=>{if(query(selector).length)section?.els.push({id,name,scope:scopeText,props:['background','color','border-color'].map(css=>({key:css,label:css==='background'?'Fondo de «'+name+'»':css==='color'?'Texto de «'+name+'»':'Borde de «'+name+'»',css,selector,viewId}))});};
  add('cl.help','Aviso explicativo de la clasificación','#squad-leaderboards .lb-help-box','El recuadro y su texto explicativo');
  for(const button of query('#squad-leaderboards [data-lb-tab], #squad-leaderboards [data-lb-scope]')){
   const attr=button.hasAttribute('data-lb-tab')?'data-lb-tab':'data-lb-scope';const key=button.getAttribute(attr);
   add('cl.'+key,'Botón «'+button.textContent.trim()+'»','#squad-leaderboards ['+attr+'="'+key+'"]','Este botón en todas las clasificaciones');
  }
 }
 if(scope?.id==='player-dialog'||(viewId==='plantilla'&&!scope)){
  const dialogSection={
   id:'player-dialog-sec',
   name:'Ficha de jugador y Posiciones',
   els:[
    {id:'pd.pos-labels',name:'Texto de posiciones (Lateral, Central, Medio centro...)',scope:'Todas las etiquetas de posiciones en la ficha',props:[{key:'color',label:'Color del texto de posición',css:'color',selector:'#player-dialog .position-groups label',viewId},{key:'font-weight',label:'Grosor de la fuente',css:'font-weight',selector:'#player-dialog .position-groups label',viewId}]},
    {id:'pd.pos-strong',name:'Encabezados (Portero, Defensa, Centrocampista, Delantero)',scope:'Títulos de las categorías de posición',props:[{key:'color',label:'Color del texto del encabezado',css:'color',selector:'#player-dialog .position-groups strong',viewId}]},
    {id:'pd.pos-boxes',name:'Bloques de posición (fondo de las tarjetas)',scope:'Las cuatro tarjetas de categorías de posición',props:[{key:'background',label:'Fondo del bloque',css:'background',selector:'#player-dialog .position-groups > div',viewId},{key:'border-color',label:'Borde del bloque',css:'border-color',selector:'#player-dialog .position-groups > div',viewId}]},
    {id:'pd.labels',name:'Etiquetas del formulario (Nombre, Dorsal, Pierna...)',scope:'Todos los campos de texto del formulario',props:[{key:'color',label:'Color de las etiquetas',css:'color',selector:'#player-dialog label:not(.position-groups label)',viewId}]},
    {id:'pd.bg',name:'Fondo de la ventana',scope:'Ventana completa de la ficha',props:[{key:'background',label:'Fondo',css:'background',selector:'#player-dialog',viewId}]},
    {id:'pd.save',name:'Botón «Guardar jugador»',scope:'Botón principal de guardar',props:[{key:'background',label:'Fondo',css:'background',selector:'#player-dialog button.primary',viewId},{key:'color',label:'Texto',css:'color',selector:'#player-dialog button.primary',viewId}]},
    {id:'pd.cancel',name:'Botón «Cancelar»',scope:'Botón secundario de cancelar',props:[{key:'background',label:'Fondo',css:'background',selector:'#player-dialog button[data-close]',viewId},{key:'color',label:'Texto',css:'color',selector:'#player-dialog button[data-close]',viewId}]}
   ]
  };
  if(scope?.id==='player-dialog')return [dialogSection];
  sections.push(dialogSection);
 }
 const root=scope||document.getElementById(viewId)||document.getElementById({'exercise-detail':'exercise-detail-dialog',comunicador:'whatsapp-dialog'}[viewId]);
 const fallbackRoot=scope?.id==='players-list'?document.getElementById('plantilla'):root;
 if(viewId==='ejercicios'){
  const section=sections.find(s=>s.id==='eje');
  for(const [id,name,local]of [['duration','Duración de ejercicio','.cbx-card-pill-dur'],['demo-label','Etiqueta «Ver demostración · GIF/MP4»','.cbx-card-badge-demo'],['favorite','Botón de favorito','.cbx-card-star-btn']]){
   const selector='#ejercicios '+local;if(query(selector).length)section?.els.push({id:'eje.'+id,name,scope:'Se aplica a todos los ejercicios',props:['background','color','border-color'].map(css=>({key:css,label:css==='background'?'Fondo':css==='color'?'Texto':'Borde',css,selector,viewId}))});
  }
 }
 const existing=new Set(sections.flatMap(s=>s.els.flatMap(e=>e.props.map(p=>p.selector))));
 const representedNodes=sections.flatMap(s=>s.els.flatMap(e=>e.props.flatMap(p=>query(p.selector))));
 const extras=configurableElements(fallbackRoot).filter(item=>within(query(item.selector))&&!existing.has(item.selector)&&!query(item.selector).every(node=>representedNodes.some(n=>n===node))).filter(item=>!query(item.selector)[0]?.closest('.cbx-context-gear-btn'));
 const groups=new Map();
 for(const item of new Map(extras.map(item=>[item.selector,item])).values()){const name=item.group; if(!groups.has(name))groups.set(name,[]);const css=item.tag==='svg'||['path','rect','circle','line'].includes(item.tag)?['fill','stroke']:['background','color','border-color'];groups.get(name).push({id:item.selector,name:item.label,scope:viewId==='ejercicios'&&item.selector.includes('.exercise-card')?'Se aplica a todos los ejercicios':item.context||'Solo '+(scope?'esta sección':'esta pestaña'),props:css.map(key=>({key,label:{background:'Fondo',color:'Texto','border-color':'Borde',fill:'Interior del icono',stroke:'Trazo del icono'}[key],css:key,selector:item.selector,viewId}))});}
 for(const [name,els]of groups)sections.push({id:'real-'+name,name,els});
 return sections;
}
