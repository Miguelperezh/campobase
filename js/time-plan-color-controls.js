// Stable selectors: one choice applies to equivalent parts of every player's row.
export function timePlanColorSections(viewId,scope){
 const dialog=scope?.closest?.('#cbx-window-dialog');
 if(!dialog&&!scope?.querySelector?.('.cbx-minute-track'))return null;
 const base=dialog?'#cbx-window-dialog':scope.matches('.cbx-callup-plan')?'#convocatorias .cbx-callup-plan':'#'+CSS.escape(scope.id);
 const groups=[];
 const section=(id,name,items)=>{
  const els=items.map(([key,label,local,properties='background,color,border-color'])=>{
   const selector=local.split(',').map(part=>base+' '+part.trim()).join(', ');
   const nodes=[...document.querySelectorAll(selector)].filter(n=>!n.closest('#cbx-claude-colors'));
   if(!nodes.some(n=>scope===dialog||scope===n||scope.contains(n)))return null;
   const props=properties.split(',').map(css=>({key:css,css,viewId,selector,label:({'background':'Fondo','color':'Texto','border-color':'Borde'})[css]+' · '+label}));
   if(properties.split(',').includes('color'))props.push(...['font-family','font-size','font-weight'].map(css=>({key:css,css,viewId,selector,label:({'font-family':'Fuente','font-size':'Tamaño de fuente','font-weight':'Grosor de fuente'})[css]+' · '+label})));
   return {id:'time-plan.'+key,name:label,scope:'Solo este apartado; los elementos equivalentes comparten estilo',props};
  }).filter(Boolean);
  if(els.length)groups.push({id:'time-plan.'+id,name,els});
 };
 if(!dialog){
  section('timeline','Plan por tramos',[
   ['mini-name','Dorsal y nombre del jugador','.cbx-minute-person'],['mini-track','Fondo de barra sin minutos','.cbx-minute-track','background,border-color'],['mini-bar','Barras de minutos asignados','.cbx-minute-track i','background'],['mini-total','Minutos exactos totales','.cbx-minute-total b','color'],['mini-label','Etiqueta Total de este jugador','.cbx-minute-total small','color'],['mini-spans','Detalle de cada entrada y salida','.cbx-minute-spans','color'],['mini-axis','Escala y descanso','.cbx-minute-axis','color'],['mini-row','Fondo y borde de las filas','.cbx-minute-row','background,border-color'],['mini-shortcuts','Botones Inicio, Descanso y Final','.cbx-minute-shortcuts button'],['mini-edit','Botón Editar entradas y salidas','[data-minute-edit]']
  ]);return groups.length?groups:null;
 }
 section('header','Cabecera y acciones',[
 ['context','Etiqueta Convocatoria · Preparar partido','.cbp-plan-banner small','color'],['status','Mensaje de guardado o edición','.cbp-plan-status','color'],['banner','Fondo de la cabecera','.cbp-plan-banner','background,border-color'],['title','Título Plan de tiempos','.cbp-plan-banner h2','color'],['subtitle','Rival, duración y convocados','.cbp-plan-banner p','color'],
 ...['propose','undo','save','apply','print','close'].map((key,i)=>['button-'+key,['Proponer reparto','Deshacer','Guardar plan','Copiar a Preparar partido','Imprimir','Cerrar'][i],'[data-plan-action="'+key+'"]'])]);
 section('bars','Barras y minutos',[
 ['bars-title','Título Tramos por jugador','.cbp-plan-bars h3','color'],['bars-help','Instrucciones para editar los tramos','.cbp-plan-bars > p','color'],['bars','Recuadro de barras','.cbp-plan-bars','background,border-color'],['names','Dorsales y nombres de jugadores','.cbp-player-name'],['intervals','Texto de entradas y salidas','.cbp-player-name small','color'],
 ['track','Fondo de barra sin minutos','.cbp-time-track','background,border-color'],['field','Barra de jugador de campo','.cbp-time-block:not(.is-keeper)','background,border-color'],['keeper','Barra de portero','.cbp-time-block.is-keeper','background,border-color'],['bar-minutes','Minutos dentro de las barras','.cbp-time-block b','color'],
 ['total','Total de minutos a la derecha','.cbp-time-total b','color'],['difference','Diferencia con objetivo','.cbp-time-total small','color'],['coverage-label','Etiquetas En campo y Portero','.cbp-coverage > span','color'],['coverage-ok','Cobertura completa de campo y portería','.cbp-coverage [data-coverage-valid="true"]','background'],['coverage-error','Cobertura incompleta de campo y portería','.cbp-coverage [data-coverage-valid="false"]','background'],['axis','Escala de minutos','.cbp-time-axis','color'],['selected','Fila del jugador seleccionado','.cbp-time-row.is-selected','background,border-color']]);
 section('editor','Editor del jugador',[
 ['editor-intro','Etiqueta Editando solo a este jugador','.cbp-player-editor > small','color'],['editor-help','Aviso de edición individual','.cbp-player-editor > p','color'],['interval-number','Etiqueta Tramo 1, Tramo 2…','.cbp-edit-interval > b','color'],['interval-length','Duración exacta de cada tramo','.cbp-edit-interval > strong','color'],['editor','Recuadro del editor','.cbp-player-editor','background,border-color'],['player-title','Nombre del jugador editado','.cbp-player-editor h2','color'],['metrics','Fondo de Total, Objetivo y Diferencia','.cbp-player-metrics > div','background,border-color'],['metric-label','Etiquetas Total, Objetivo y Diferencia','.cbp-player-metrics small','color'],['metric-value','Valores Total, Objetivo y Diferencia','.cbp-player-metrics strong','color'],['inputs','Campos Entra y Sale','.cbp-edit-interval input'],['labels','Etiquetas Entra y Sale','.cbp-edit-interval label','color'],['remove','Botón Quitar tramo','[data-remove]'],['add','Botón Añadir tramo','[data-plan-action="add"]']]);
 for(const [id,name,local]of [['validation','Estado del plan','.cbp-plan-validation'],['windows','Ventanas de cambio','.cbp-change-windows'],['collective','Cambios colectivos','.cbp-collective'],['summary','Resumen de minutos','.cbp-plan-summary']])section(id,name,[[id,name+' · recuadro',local,'background,border-color'],[id+'-title',name+' · títulos',local+' h3','color'],[id+'-text',name+' · textos',local+' p, '+local+' small','color']]);
 section('positions','Puestos y relevos',[['change-tag','Etiquetas Cambio y Posición','.cbp-change-tag'],['position-label','Nombre de cada puesto','.cbp-position-choices label','color'],['position-select','Selector de jugador por puesto','.cbp-position-choices select']]);
 section('collective-controls','Jugadores del cambio colectivo',[['collective-headings','Títulos Salen y Entran','.cbp-collective h4','color'],['collective-label','Etiqueta Minuto','.cbp-collective > label','color'],['collective-minute','Campo Minuto','#cbp-collective-minute'],['out-button','Jugadores que salen · sin seleccionar','[data-out][aria-pressed="false"]'],['in-button','Jugadores que entran · sin seleccionar','[data-in][aria-pressed="false"]'],['chosen-button','Jugadores elegidos para el cambio','.cbp-collective [aria-pressed="true"]'],['collective-action','Botón Crear ventana de cambios','[data-plan-action="collective"]']]);
 section('proposal','Propuesta de reparto',[['proposal-box','Recuadro de propuesta','.cbp-plan-proposal','background,border-color'],['proposal-title','Título de propuesta','.cbp-plan-proposal h3','color'],['proposal-text','Explicación de propuesta','.cbp-plan-proposal p','color'],['accept','Botón Aceptar propuesta','[data-plan-action="accept"]'],['discard','Botón Descartar propuesta','[data-plan-action="discard"]']]);
 section('summary-values','Tabla de minutos',[['table-head','Encabezados de la tabla','.cbp-plan-summary th'],['table-values','Valores de la tabla','.cbp-plan-summary td']]);
 return groups;
}
