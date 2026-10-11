export function learningColorSections(viewId,scope) {
  if(viewId!=='aprendizaje')return null;
  const groups=[['learn-review','Postpartido'],['learn-players','Jugadores'],['learn-plan','Próximas semanas']];
  const kinds=[['card','Tarjetas',' .card'],['heading','Títulos',' h2, ROOT h3'],['text','Textos explicativos',' p'],['label','Etiquetas de campos',' label'],['input','Campos y desplegables',' input, ROOT textarea, ROOT select'],['button','Botones',' button:not(.cbx-context-gear-btn)'],['selected','Valoración seleccionada',' button[aria-pressed="true"]'],['unselected','Valoración sin seleccionar',' button[aria-pressed="false"]'],['metric','Media del jugador',' .metric'],['bars','Barras de evolución',' .bar'],['current','Barra de evaluación actual',' .bar.current'],['suggestion','Propuestas y origen',' .suggestion'],['goal','Objetivos del bloque',' .goal'],['variant','Variantes del objetivo',' .variants label']];
  const sections=groups.filter(([id])=>!scope||scope.id===id||scope.id==='aprendizaje').map(([id,name])=>({id,name,els:kinds.map(([key,label,local])=>{
    const selector=('#aprendizaje #'+id+local).replaceAll('ROOT','#aprendizaje #'+id);
    if(!document.querySelector(selector))return null;
    const css=['bars','current'].includes(key)?['background']:['background','color','border-color','font-family','font-size','font-weight'];
    const labels=['Fondo','Color del texto','Borde','Familia de la fuente','Tamaño de la fuente','Grosor de la fuente'];
    return {id:id+'.'+key,name:label,scope:'Solo '+name+'. Se aplica a todos los elementos equivalentes, no a un jugador concreto.',props:css.map((prop,i)=>({key:prop,css:prop,label:labels[i]+' de '+label.toLowerCase(),selector,viewId}))};
  }).filter(Boolean)})).filter(s=>s.els.length);
  if(!scope||scope.id==='aprendizaje')sections.unshift({id:'learning-navigation',name:'Cabecera y pestañas',els:[['Título principal','#aprendizaje h1'],['Pestaña seleccionada','#aprendizaje nav button[aria-selected="true"]'],['Pestañas sin seleccionar','#aprendizaje nav button[aria-selected="false"]']].map(([name,selector],i)=>({id:'learning-nav'+i,name,scope:'Solo la navegación de Aprendizaje',props:['background','color','font-family','font-size','font-weight'].map(css=>({key:css,css,label:({'background':'Fondo','color':'Texto','font-family':'Familia de fuente','font-size':'Tamaño de fuente','font-weight':'Grosor de fuente'})[css],selector,viewId}))}))});
  return sections;
}
