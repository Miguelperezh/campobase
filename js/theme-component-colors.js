// Component choices take precedence over the legacy blanket button rules.
let currentTheme = {};
const originalColours = new WeakMap();
const originalIcons = new WeakMap();
const rememberedProperties = ['background','color','border-color','border-top-color','border-left-color','border-bottom-color','fill','stroke','accent-color','font-family','font-size','font-weight'];

export function configurableButtons(root) {
  const options = new Map();
  root?.querySelectorAll('button').forEach((button) => {
    const text = button.textContent.trim().replace(/\s+/g, ' ');
    const label = text.length > 2 ? text : button.getAttribute('aria-label') || button.title || text;
    const classes = [...button.classList].filter((name) => !/^(active|selected|is-)/.test(name));
    const action = ['data-wa-type', 'data-view', 'data-dialog', 'data-callup-plan-mode'].find((name) => button.hasAttribute(name));
    let local = button.id ? `#${CSS.escape(button.id)}` : `button${classes.map((name) => `.${CSS.escape(name)}`).join('')}`;
    if (!button.id && action) local += `[${action}="${CSS.escape(button.getAttribute(action))}"]`;
    if (local === 'button') {
      button.dataset.themeButtonKey = label;
      local += `[data-theme-button-key="${CSS.escape(label)}"]`;
    }
    const selector = `#${CSS.escape(root.id)} ${local}`;
    if (label && !options.has(selector)) options.set(selector, { selector, label });
  });
  return [...options.values()];
}

// The panel uses named controls rather than a generic button selector.
export function configurableElements(root) {
  if (!root?.id) return [];
  const options = [];
  const selectorFor = (element) => {
    const card=element.closest('#ejercicios .exercise-card');
    if(card){
      const shared=[];
      for(let node=element;node&&node!==card;node=node.parentElement){
        const classes=[...node.classList].filter(name=>! /^(active|selected|is-|diff-)/.test(name));
        const siblings=[...node.parentElement.children].filter(child=>child.tagName===node.tagName);
        shared.unshift(node.tagName.toLowerCase()+(classes.length?classes.map(name=>'.'+CSS.escape(name)).join(''):':nth-of-type('+(siblings.indexOf(node)+1)+')'));
      }
      return '#ejercicios .exercise-card'+(shared.length?' '+shared.join(' > '):'');
    }
    const parts = [];
    for (let node = element; node && node !== root; node = node.parentElement) {
      if (node.id) { parts.unshift('#' + CSS.escape(node.id)); break; }
      const record = [...node.attributes].find((attribute) => /^data-.*id$/.test(attribute.name) && attribute.value);
      if (record) {
        const actionClasses = [...node.classList].filter((name) => !/^(active|selected|is-)/.test(name));
        parts.unshift(node.tagName.toLowerCase() + actionClasses.map((name) => '.' + CSS.escape(name)).join('') + '[' + record.name + '="' + CSS.escape(record.value) + '"]'); break; }
      const siblings = [...node.parentElement.children].filter((child) => child.tagName === node.tagName);
      parts.unshift(node.tagName.toLowerCase() + ':nth-of-type(' + (siblings.indexOf(node) + 1) + ')');
    }
    return '#' + CSS.escape(root.id) + ' ' + parts.join(' > ');
  };
  const named = (element) => (element.getAttribute('aria-label') || element.getAttribute('placeholder') || element.title || element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90);
  const groups = [
    ['Botones y acciones', 'button,summary,a[href]'],
    ['Títulos y textos', 'h1,h2,h3,h4,h5,h6,p,label,legend,th,td,li,small,strong,b,span,dt,dd,time,div'],
    ['Campos y selectores', 'input:not([type="hidden"]),select,textarea,progress,meter'],
    ['Iconos y gráficos', 'svg,path,circle,rect,line,polyline,polygon'],
    ['Fondos, tarjetas y recuadros', 'header,footer,article,section,details,fieldset,div'],
  ];
  const seen = new Set();
  for (const [group, query] of groups) for (const element of root.querySelectorAll(query)) {
    if(root.id==='squad-stats')continue;
    if (root.matches('.specialist-item') || (root.id==='plantilla-specialists-bar' && element.closest('.specialist-item')) || (root.id === 'plantilla' && element.closest('#squad-leaderboards'))) continue;
    if (root.id === 'plantilla' && (element.closest('.cbx-player') || element.querySelector('.cbx-player') || element.closest('#squad-leaderboards tbody'))) continue;
    if (seen.has(element) || element.closest('#cbx-quick-color-dialog') || element.matches('.cbx-context-gear-btn')) continue;
    if (element.closest('svg') && group !== 'Iconos y gráficos') continue;
    if (group === 'Títulos y textos' && element.children.length && !element.matches('h1,h2,h3,h4,h5,h6,label,legend,th,td,li,p')) continue;
    let context = element.parentElement;
    while (context && context !== root && !context.matches('article,section,fieldset,details,.card,.cbx-banner') && !/card|panel|hero/.test(context.className || '')) context = context.parentElement;
    context ||= root;
    const heading = context.querySelector('h1,h2,h3,h4,legend,summary');
    const name = named(element) || (element.labels?.[0] && named(element.labels[0])) || named(heading || context);
    if (group === 'Fondos, tarjetas y recuadros' && !element.matches('header,footer,article,section,details,fieldset') && !/(card|panel|banner|hero|badge|pill|row|bar|grid|pitch|board|track)/.test(element.className || '')) continue;
    if (!name && group !== 'Iconos y gráficos') continue;
    seen.add(element);
    const index = options.filter((option) => option.group === group && option.label === name).length + 1;
    options.push({ selector: selectorFor(element), group, label: name || 'Gráfico', context: heading ? named(heading) : '', tag: element.tagName.toLowerCase(), index });
  }
  if(root.id==='squad-stats')root.querySelectorAll('.stat').forEach((stat,index)=>{const label=stat.querySelector('span')?.textContent?.trim()||'Indicador';for(const [part,local]of [['Tarjeta',''],['Cifra',' strong'],['Etiqueta',' span']])options.push({selector:'#squad-stats .stat:nth-child('+(index+1)+')'+local,label:label+' · '+part,group:'Indicadores',context:'Solo este indicador',tag:'div',index:1,shared:true});});
  if(root.matches('.specialist-item') || root.id==='plantilla-specialists-bar'){
    for(const card of (root.matches('.specialist-item')?[root]:[...root.querySelectorAll('.specialist-item')])){
      const scope=root.matches('.specialist-item')?'#'+CSS.escape(root.id):'#'+CSS.escape(root.id)+' .specialist-item:nth-of-type('+([...card.parentElement.children].filter(n=>n.tagName===card.tagName).indexOf(card)+1)+')';
      for(const [label,local]of [['Título de la especialidad',' h4'],['Icono de la especialidad',' .sp-icon']])options.push({selector:scope+local,label:label+' · '+card.querySelector('h4')?.textContent?.trim(),group:'Lanzadores y capitanes',context:'Solo esta tarjeta de especialidad',tag:'div',index:1,shared:true});
    }
    for(const row of root.querySelectorAll('[data-specialist-rank]')){
      const rank=row.dataset.specialistRank;const card=row.closest('.specialist-item');const prefix=root.matches('.specialist-item')?'':' '+card.querySelector('h4,h3')?.textContent?.trim();const base='#'+CSS.escape(root.id)+(root.matches('.specialist-item')?'':' .specialist-item:nth-of-type('+([...card.parentElement.children].filter(n=>n.tagName===card.tagName).indexOf(card)+1)+')')+' [data-specialist-rank="'+rank+'"]';
      for(const [label,selector]of [['Fila completa',base],['Nombre del jugador',base+' strong'],['Etiqueta de función (1.º lanzador/capitán)',base+' .specialist-rank'],['Dorsal',base+' .specialist-number']])options.push({selector,label:rank+'.º · '+label+(prefix||''),group:'Lanzadores y capitanes',context:'Solo esta sección',tag:'div',index:1,shared:true});
    }
  }
  if (root.id === 'plantilla') {
    const shared = [
      ['Ficha completa', '.cbx-player'], ['Nombre del jugador', '.cbx-player .player-name h3'],
      ['Nota y datos adicionales', '.cbx-player .player-body .meta'], ['Teléfono y nombre del padre', '.cbx-player .player-family-contacts > :nth-child(1)'], ['Teléfono y nombre de la madre', '.cbx-player .player-family-contacts > :nth-child(2)'],
      ['Dorsal', '.cbx-player .player-data > span:nth-child(1)'], ['Posición', '.cbx-player .player-data > span:nth-child(2)'],
      ['Pierna', '.cbx-player .player-data > span:nth-child(3)'], ['Rotaciones', '.cbx-player .player-data > span:nth-child(4)'],
      ['Media de Liga', '.cbx-player .player-rating-badge'], ['Media Liga · valor', '.cbx-player .player-rating-badge .valor'], ['Media Liga · etiqueta', '.cbx-player .player-rating-badge .etiqueta'], ['Minutos · etiqueta', '.cbx-player .player-minute-meta > span:first-child'], ['Minutos · cifra y porcentaje', '.cbx-player .player-minute-meta > span:last-child'], ['Minutos · partidos convocado', '.cbx-player .minute-avg-pill'], ['Minutos disputados', '.cbx-player .player-minute-bar'],
      ['Barra de minutos · Fondo', '.cbx-player .player-minute-track'], ['Barra de minutos · Relleno', '.cbx-player .player-minute-fill'],
      ['Lanzadores y capitanes en fichas · cada píldora completa', '.cbx-player .specialist-pill'],

      ['Botón WhatsApp', '.cbx-player .open-whatsapp-player'], ['Botón Editar', '.cbx-player .edit-player'],
      ['Botón Borrar', '.cbx-player .delete-player'], ['Actividad y estadísticas', '.cbx-player .player-performance-summary'],
      ['Resumen de estadísticas', '.cbx-player .player-summary'], ['Texto de estadísticas', '.cbx-player .player-summary span'],
      ['Editar estadísticas de Liga', '.cbx-player .edit-player-stats[data-scope="league"]'],
      ['Editar estadísticas de Pretemporada', '.cbx-player .edit-player-stats[data-scope="preseason"]'],
      ['Títulos de estadísticas', '.cbx-player .player-stats-title'], ['Desplegables de actividad', '.cbx-player .player-stats-expanded details'],
      ['Replegar estadísticas', '.cbx-player .collapse-stats-btn'],
    ];
    for(const [index,label]of ['Dorsal','Posición','Pierna','Rotaciones'].entries())for(const [part,tag]of [['Etiqueta','small'],['Valor','strong']])shared.push([label+' · '+part,'.cbx-player .player-data > span:nth-child('+(index+1)+') '+tag]);
    for (const [label, local] of shared) if (root.querySelector(local)) options.push({selector: '#plantilla ' + local, group: 'Fichas de jugadores · estilo común', label, context: 'Se aplica a todas las fichas de jugadores', tag: 'div', index: 1, shared: true});
    for (const [label, local] of [
      ['Tabla · fondo de todas las filas', '.lb-table tbody tr'],
      ['Tabla · todos los textos y cifras', '.lb-table tbody td'],
      ['Columna Jugador · nombres', '.lb-table tbody .col-player'],
      ['Columna Posición · posiciones de juego', '.lb-table tbody .col-pos'],
      ['Columna Pos. · número de orden', '.lb-table tbody .col-rank'],
      ['Jugador · distintivo del dorsal', '.lb-dorsal-tag'],
      ['Botones Goleadores, Asistencias, Zamora, Minutos y Fair Play', '.lb-tab-btn'],
      ['Filtros Todo, Liga y Pretemporada', '.lb-scope-btn'],
      ['Botón Ver clasificación completa', '.cbx-leaders-more'],
      ['Botón Abrir/cerrar tablas', '.lb-toggle-text']
    ]) if (root.querySelector('#squad-leaderboards ' + local)) options.push({selector: '#plantilla #squad-leaderboards ' + local, group: 'Clasificación · estilo común', label, context: 'Se aplica a toda esta tabla', tag: 'div', index: 1, shared: true});
    const table=root.querySelector('#squad-leaderboards .lb-table');
    table?.querySelectorAll('thead th').forEach((th,index)=>{
      const label=th.textContent.trim().toLocaleUpperCase('es');
      for(const [part,local]of [['Cabecera','thead th'],['Celdas','tbody td']])options.push({selector:'#plantilla #squad-leaderboards .lb-table '+local+':nth-child('+(index+1)+')',group:'Clasificación · columnas',label:part+' «'+label+'»',context:part==='Cabecera'?'Solo el título de esta columna':'Solo los valores de esta columna en todos los jugadores',tag:'div',index:1,shared:true});
    });
  }
  options.push({ selector: '#' + CSS.escape(root.id), group: 'Fondos, tarjetas y recuadros', label: root.matches('.specialist-item')?'Tarjeta de especialidad · fondo completo':'Fondo de la pantalla o sección', context: '', tag: root.tagName.toLowerCase(), index: 1 });
  const playerNames = root.id === 'plantilla' ? [...root.querySelectorAll('.player-name h3')].map((element) => element.textContent.trim()) : [];
  return options.filter((option) => option.shared || !playerNames.some((name) => name && option.label.includes(name)));
}

export function clearColourConflicts(settings, selector, properties, preserveBroader = false) {
  let targets;
  try { targets = [...document.querySelectorAll(selector)]; } catch { return; }
  for (const storeName of ['elementColors', 'buttonColors']) {
    for (const [savedSelector, colours] of Object.entries(settings[storeName] || {})) {
      let matches;
      try { matches = [...document.querySelectorAll(savedSelector)]; } catch { continue; }
      for (const prop of properties) {
        const overlap = matches.some((element) => targets.some((target) => element === target || (prop === 'color' && target.contains(element))));
        const fullyCovered=matches.every(element=>targets.some(target=>element===target || (prop==='color'&&target.contains(element))));
        if (overlap && (!preserveBroader || fullyCovered)) delete colours[storeName === 'buttonColors' ? (prop === 'background' ? 'bg' : prop === 'color' ? 'ink' : prop) : prop];
      }
      if (!Object.keys(colours).length) delete settings[storeName][savedSelector];
    }
  }
}

export function colorControlDescription(prop, label, screen) {
  const descriptions = {
    bannerBg: 'Fondo de la cabecera superior de esta pantalla.', bannerInk: 'Título y texto de esa cabecera.',
    seasonGoalsForColor: 'Color de las barras de goles a favor; conserva sus alturas y datos.',
    seasonGoalsAgainstColor: 'Color de las barras de goles en contra; independiente de goles a favor.',
    btnBg: 'Fondo de los botones de acción principal de esta pantalla.', btnInk: 'Texto e iconos de esos botones principales.',
    btn2Bg: 'Fondo de los botones secundarios de esta pantalla.', btn2Ink: 'Texto e iconos de esos botones secundarios.',
    fontColor: 'Texto descriptivo, notas y párrafos de esta pantalla.', cardTitle: 'Nombres y títulos de las tarjetas de esta pantalla.',
    cardBg: 'Superficie de las tarjetas y paneles de esta pantalla.', cardBorder: 'Línea que rodea las tarjetas y paneles.',
    dorsalBg: 'Fondo del distintivo donde aparece el dorsal.', dorsalInk: 'Número dentro del distintivo del dorsal.',
    accentColor: 'Color de acento usado por los elementos que heredan el tema de esta pantalla.',
    badgeBg: 'Fondo de las etiquetas informativas de esta pantalla.', badgeInk: 'Texto de esas etiquetas de esta pantalla.',
    callupHeaderBg: 'Fondo de la tarjeta del rival, donde aparece su nombre; independiente de + Convocatoria.',
    callupHeaderInk: 'Nombre del rival y datos de la cabecera de su tarjeta.',
    callupBadgeBg: 'Fondo del contador de jugadores convocados.', callupBadgeInk: 'Número y texto del contador de convocados.',
    callupOutBg: 'Fondo del contador de jugadores fuera de la convocatoria.', callupOutInk: 'Número y palabra «fuera» de ese contador.',
    callupBtnBg: 'Fondo del botón + Convocatoria, sin cambiar la tarjeta del rival.', callupBtnInk: 'Texto e icono de + Convocatoria.',
    planModeTrack: 'Fondo del recuadro que contiene Escalonado y Por partes.',
    planModeBg: 'Fondo de Escalonado o Por partes cuando esa opción no está seleccionada.',
    planModeInk: 'Texto de la opción del plan que no está seleccionada.',
    planModeActiveBg: 'Fondo de la opción seleccionada del plan.', planModeActiveInk: 'Texto de la opción seleccionada del plan.',
    closeBg: 'Fondo del botón Cerrar ejercicio.', closeInk: 'Texto e icono de Cerrar ejercicio.',
    sidebarBg: 'Fondo del menú lateral de escritorio. Se comparte entre pantallas.', sidebarInk: 'Texto de las opciones del menú lateral; independiente de la barra inferior.',
    bottomNavBg: 'Fondo de la barra inferior del móvil. Se comparte entre pantallas.', bottomNavInk: 'Texto e iconos de las pestañas inferiores sin seleccionar.',
    bottomNavActive: 'Texto, icono e indicador de la pestaña inferior seleccionada.',
    subNavBg: 'Fondo de las subpestañas sin seleccionar.', subNavInk: 'Texto de las subpestañas sin seleccionar.',
    subNavActiveBg: 'Fondo de la subpestaña seleccionada.', subNavActiveInk: 'Texto de la subpestaña seleccionada.',
    tbPitch: 'Césped de la pizarra táctica.', tbLines: 'Líneas que delimitan el campo de la pizarra.',
    tbTeam: 'Fichas de los jugadores de tu equipo en la pizarra.', tbRival: 'Fichas del equipo rival en la pizarra.', tbArrow: 'Flechas de movimiento dibujadas en la pizarra.',
  };
  if (descriptions[prop]) return descriptions[prop];
  const objects = {wa: 'botón WhatsApp', whistle: 'botón Silbato', print: 'botón Imprimir', edit: 'botón Editar', completed: 'botón Realizado sin marcar', completedActive: 'botón Realizado cuando está marcado', prepHeader: 'cabecera de la tarjeta del partido', todayMatch: 'tarjeta del partido en Hoy', callout: 'recuadro informativo', gf: 'marcador de goles de tu equipo', ga: 'marcador de goles del rival', spLead: 'distintivo del primer lanzador', spSub: 'segundo lanzador en todas las tarjetas de balón parado'};
  const base = prop.replace(/(Bg|Ink)$/, '');
  if (objects[base]) return (prop.endsWith('Bg') ? 'Fondo del ' : 'Texto y números del ') + objects[base] + '.';
  return 'Cambia «' + label + '» en ' + screen + '.';
}

export function applyComponentColors(theme) {
  if (theme) currentTheme = theme;
  document.querySelectorAll('dialog[data-theme-view]').forEach((dialog) => {
    const source = document.getElementById(dialog.dataset.themeView);
    if (source) [...source.style].filter((prop) => prop.startsWith('--'))
      .forEach((prop) => dialog.style.setProperty(prop, source.style.getPropertyValue(prop)));
  });
  document.querySelectorAll('[data-theme-override]').forEach((element) => {
    const previous = originalColours.get(element);
    if (previous) for (const [prop, value, priority] of previous) {
      if (value) element.style.setProperty(prop, value, priority);
      else element.style.removeProperty(prop);
    }
    element.removeAttribute('data-theme-override');
  });
  const iconSelectors=Object.values(currentTheme.views||{}).flatMap(view=>Object.values(view.uiParts||{})).filter(c=>c.css==='icon').map(c=>c.selector);
  document.querySelectorAll('[data-ui-icon]').forEach(node=>{if(iconSelectors.some(selector=>{try{return node.matches(selector);}catch{return false;}}))return;node.textContent=originalIcons.get(node);node.removeAttribute('data-ui-icon');});
  const paint = (root, selector, bg, ink) => {
    root?.querySelectorAll(selector).forEach((element) => {
      if (bg) element.style.setProperty('background', `var(${bg})`, 'important');
      if (ink) {
        element.style.setProperty('color', `var(${ink})`, 'important');
        element.querySelectorAll('span,strong,small,b,svg,h1,h2,h3,h4,p').forEach((child) => child.style.setProperty('color', `var(${ink})`, 'important'));
      }
    });
  };
  const today = document.getElementById('hoy');
  const todayColours=currentTheme.views?.hoy || {};
  paint(today, '.cbx-season-bars > div > div > i:first-child', '--season-goals-for');
  paint(today, '.cbx-season-bars > div > div > i:nth-child(2)', '--season-goals-against');
  const tactics = document.getElementById('tacticas');
  paint(tactics, '.cbx-tactics-hero', '--bn');
  paint(tactics, '.cbx-tactics-hero-text', null, '--bnInk');
  const specialists = document.getElementById('plantilla-specialists-bar');
  paint(specialists, '[data-specialist-kind="launcher"] [data-specialist-rank="1"] .specialist-rank', '--sp-lead-bg', '--sp-lead-ink');
  paint(specialists, '[data-specialist-kind="launcher"] [data-specialist-rank="2"] .specialist-rank', '--sp-sub-bg', '--sp-sub-ink');
  for (const rank of [1, 2, 3]) paint(specialists, '[data-specialist-kind="captain"] [data-specialist-rank="' + rank + '"] .specialist-rank', '--captain-' + rank + '-bg', '--captain-' + rank + '-ink');
  const squadColours = currentTheme.views?.plantilla || {};
  for (const [rank, prefix] of [[1, 'spLead'], [2, 'spSub']]) {
    const row = '[data-specialist-kind="launcher"] [data-specialist-rank="' + rank + '"]';
    const variable = rank === 1 ? '--sp-lead' : '--sp-sub';
    if (squadColours[prefix + 'Bg'] || currentTheme[prefix + 'Bg']) paint(specialists, row, variable + '-bg');
    if (squadColours[prefix + 'Ink'] || currentTheme[prefix + 'Ink']) paint(specialists, row, null, variable + '-ink');
  }
  const callups = document.getElementById('convocatorias');
  paint(callups, '.edit-callup,.callup-open-prep', '--btn2', '--btn2Ink');
  paint(callups, '.cbx-callup-card,.cbx-callup-side .panel,.cbx-callup-metrics > div,.cbx-plan-change,.cbx-callup-player:not(.is-out)', '--cardBg');
  paint(callups, '.cbx-callup-status.is-called', '--callup-status-bg', '--callup-status-ink');
  paint(callups, '.cbx-callup-card > header', '--callup-header-bg', '--callup-header-ink');
  paint(callups, '#new-callup', '--callup-btn-bg', '--callup-btn-ink');
  paint(callups, '.cbx-callup-badge-in', '--callup-badge-bg', '--callup-badge-ink');
  paint(callups, '.cbx-callup-badge-out', '--callup-out-bg', '--callup-out-ink');
  paint(callups, '.cbx-plan-mode-track', '--plan-mode-track');
  paint(callups, '.cbx-plan-mode-btn[aria-pressed="false"]', '--plan-mode-bg', '--plan-mode-ink');
  paint(callups, '.cbx-plan-mode-btn[aria-pressed="true"]', '--plan-mode-active-bg', '--plan-mode-active-ink');
  // Explicit plan choices override the legacy secondary-button paint only here.
  for (const viewId of ['convocatorias','preparacion']) {
    const root = document.getElementById(viewId);
    const settings = currentTheme.views?.[viewId] || {};
    if (settings.planRowColor) paint(root, '.cbx-minute-row', '--plan-row-color');
    if (settings.planTextColor) paint(root, '.cbx-minute-person > span,.cbx-minute-total,.cbx-minute-spans', null, '--plan-text-color');
  }
  const sessions = document.getElementById('sesiones');
  for (const [selector, bg, ink] of [
    ['.cbx-btn-whistle', '--whistle-bg', '--whistle-ink'],
    ['.print-session', '--print-bg', '--print-ink'],
    ['.edit-session', '--edit-bg', '--edit-ink'],
    ['.cbx-btn-wa', '--wa-bg', '--wa-ink'],
    ['.cbx-btn-completed:not(.is-completed)', '--completed-bg', '--completed-ink'],
    ['.cbx-btn-completed.is-completed', '--completed-active-bg', '--completed-active-ink'],
  ]) paint(sessions, selector, bg, ink);
  for (const id of ['ejercicios', 'sesiones']) {
    const root = document.getElementById(id);
    paint(root, '.sp-title,.exercise-card h3,.exercise-card h4', null, '--cardTitle');
    paint(root, '.sp-body .meta,.sp-players-badge,.exercise-card p,.exercise-card small,.card-meta-facts,.cbx-session-meta,.cbx-session-block-phase', null, '--view-font-color');
    paint(root, '.sp-actions .secondary,.view-exercise.secondary', '--btn2', '--btn2Ink');
    paint(root, '.sp-actions .primary', '--btn', '--btnInk');
    if (currentTheme.views?.[id]?.badgeBg || currentTheme.views?.[id]?.badgeInk)
      paint(root, '.sp-category-tag,.exercise-card .pill,.sp-body .pill', '--badge-bg', '--badge-ink');
  }
  for (const id of ['exercise-detail-dialog', 'whatsapp-dialog']) {
    const root = document.getElementById(id);
    paint(root, '.dialog-close-prominent-btn,.modal-bottom-close-btn', '--close-bg', '--close-ink');
    paint(root, 'h2,h3,h4,.sheet-title', null, '--cardTitle');
    paint(root, 'p,label,li,td,th,.sheet-section-title,.sheet-bottom-bar,.fact-label,.fact-value,.phase-meta', null, '--view-font-color');
    paint(root, '.primary,.btn-add-session', '--btn', '--btnInk');
    paint(root, '.secondary,.btn-print-exercise,.tab-btn:not(.active)', '--btn2', '--btn2Ink');
    paint(root, '.tab-btn.active', '--btn', '--btnInk');
    paint(root, '#whatsapp-form,.dialog-head,.sheet-bottom-bar,.dialog-sticky-footer', '--cardBg', '--view-font-color');
  }
  document.querySelectorAll('dialog[data-theme-view]:not(.cbp-time-plan)').forEach((dialog) => {
    paint(dialog, '.primary', '--btn', '--btnInk');
    paint(dialog, '.secondary', '--btn2', '--btn2Ink');
    paint(dialog, 'label,p', null, '--view-font-color');
  });
  const nav = document.getElementById('cb-bottom-nav');
  const sidebar = document.getElementById('cb-claude-sidebar');
  paint(sidebar, 'button,.cb-shell-brand strong', null, '--sidebar-ink');
  paint(sidebar, '.cb-shell-brand p,.cb-shell-group h2', null, '--sidebar-sub');
  paint(nav, '.cb-nav-tab:not(.active)', null, '--bottom-nav-ink');
  paint(nav, '.cb-nav-tab.active', null, '--bottom-nav-active');
  const subnav = document.getElementById('cb-sub-nav');
  paint(subnav, '.cb-sub-pill:not(.active)', '--sub-nav-bg', '--sub-nav-ink');
  paint(subnav, '.cb-sub-pill.active', '--sub-nav-active-bg', '--sub-nav-active-ink');
  for (const [viewId,settings] of Object.entries(currentTheme.views || {})) {
    for (const [selector, colours] of Object.entries(settings.buttonColors || {})) {
      // Only selectors generated for an application container are accepted.
      if (!/^#[\w-]+ (button|#)/.test(selector)) continue;
      let matches;
      try { matches = document.querySelectorAll(selector); } catch { continue; }
      matches.forEach((button) => {
        if(button.closest('.view') && button.closest('.view').id!==viewId)return;
        for (const element of [button, ...button.querySelectorAll('span,strong,small,b,svg')]) {
          originalColours.set(element, rememberedProperties.map((prop) => [prop, element.style.getPropertyValue(prop), element.style.getPropertyPriority(prop)]));
          element.dataset.themeOverride = '1';
          if (element === button && colours.bg) element.style.setProperty('background', colours.bg, 'important');
          if (colours.ink) element.style.setProperty('color', colours.ink, 'important');
        }
      });
    }
    for (const [selector, colours] of Object.entries(settings.elementColors || {}).sort(([a],[b])=>{const depth=sel=>{let n=document.querySelector(sel),d=0;while(n){d++;n=n.parentElement;}return d;};try{return depth(a)-depth(b);}catch{return 0;}})) {
      if (!/^#[\w-]+(?: |$)/.test(selector)) continue;
      let matches;
      try { matches = document.querySelectorAll(selector); } catch { continue; }
      matches.forEach((element) => {
        if(element.closest('.view') && element.closest('.view').id!==viewId)return;
        if (!element.hasAttribute('data-theme-override')) originalColours.set(element, rememberedProperties.map((prop) => [prop, element.style.getPropertyValue(prop), element.style.getPropertyPriority(prop)]));
        element.dataset.themeOverride = '1';
        for (const [prop, value] of Object.entries(colours)) if (['background', 'color', 'border-color', 'fill', 'stroke', 'accent-color'].includes(prop) && /^#[0-9a-f]{6}$/i.test(value)) element.style.setProperty(prop, value, 'important');
        if (element.matches('[data-specialist-rank]') && /^#[0-9a-f]{6}$/i.test(colours.background || '')) element.querySelectorAll('.specialist-rank,.specialist-number').forEach(child=>{ if(!child.hasAttribute('data-theme-override'))originalColours.set(child,['background','color'].map(prop=>[prop,child.style.getPropertyValue(prop),child.style.getPropertyPriority(prop)]));child.dataset.themeOverride='1';child.style.setProperty('background',colours.background,'important');});
        if ( /^#[0-9a-f]{6}$/i.test(colours.color || '')) element.querySelectorAll('span,strong,small,b,svg,h1,h2,h3,h4,h5,p,label,li,td,th,a').forEach((child) => {
          if (!child.hasAttribute('data-theme-override')) originalColours.set(child, rememberedProperties.map((prop) => [prop, child.style.getPropertyValue(prop), child.style.getPropertyPriority(prop)]));
          child.dataset.themeOverride = '1';
          child.style.setProperty('color', colours.color, 'important');
        });

      });
    }

  }
  // Explicit goal-series choices must win over old generic chart overrides.
  paint(today, '.cbx-season-bars > div > div > i:first-child', '--season-goals-for');
  paint(today, '.cbx-season-bars > div > div > i:nth-child(2)', '--season-goals-against');
  // Semantic controls from Claude are applied last, after historical theme selectors.
  for(const [viewId,settings]of Object.entries(currentTheme.views||{}))for(const choice of Object.values(settings.uiParts||{}).sort((a,b)=>{const depth=s=>{try{let n=document.querySelector(s),d=0;while(n){d++;n=n.parentElement;}return d;}catch{return 0;}};return depth(a.selector)-depth(b.selector);})){
    if(!choice || !/^#[\w-]+(?: |$)/.test(choice.selector||''))continue;
    let nodes;try{nodes=document.querySelectorAll(choice.selector);}catch{continue;}
    for(const node of nodes){
      if(node.closest('.view')&&node.closest('.view').id!==viewId)continue;
      if(choice.css==='icon'){
        if(typeof choice.value!=='string'||choice.value.length>16)continue;
        if(!originalIcons.has(node))originalIcons.set(node,node.textContent);
        if(node.textContent!==choice.value)node.textContent=choice.value;node.dataset.uiIcon='';continue;
      }
      if(!rememberedProperties.includes(choice.css))continue;
      const valid=choice.css==='font-family'?/^[\w ,'-]{1,100}$/.test(choice.value):choice.css==='font-size'?/^([89]|[1-6][0-9]|7[0-2])px$/.test(choice.value):choice.css==='font-weight'?/^[4-9]00$/.test(choice.value):/^#[0-9a-f]{6}$/i.test(choice.value);
      if(!valid)continue;
      const paintPart=child=>{if(!child.hasAttribute('data-theme-override'))originalColours.set(child,rememberedProperties.map(prop=>[prop,child.style.getPropertyValue(prop),child.style.getPropertyPriority(prop)]));child.dataset.themeOverride='1';child.style.setProperty(choice.css,choice.value,'important');};
      paintPart(node);
      if(choice.css==='color'||choice.css.startsWith('font-'))node.querySelectorAll('span,strong,small,b,h1,h2,h3,h4,p,a,svg').forEach(paintPart);
      if(node.matches('[data-specialist-rank]')&&choice.css==='background')node.querySelectorAll('.specialist-rank,.specialist-number').forEach(paintPart);
    }
  }

}

export function observeComponentColors() {
  let scheduled = false;
  const update = () => {
    scheduled = false;
    document.querySelectorAll('.view').forEach((view) => {
      const liveHead = view.id === 'partido' ? view.querySelector('.cbx-live-hero-head') : null;
      const existing = view.querySelector('.cbx-context-gear-btn:not([data-theme-section])');
      if(existing && view.querySelector('[data-theme-section]')){existing.hidden=true;return;}
      if(existing)existing.hidden=false;
      if (existing) {
        if (liveHead && !liveHead.contains(existing)) liveHead.append(existing);
        else if (view.classList.contains('active') && !existing.getClientRects().length) {
          const visibleHeader = [...view.querySelectorAll('.today-hero,.section-head,.cbx-banner')].find((element) => element.getClientRects().length);
          (visibleHeader || view).append(existing);
        }
        return;
      }
      const target = liveHead || view.querySelector('.section-head') || view;
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'cbx-context-gear-btn';
      button.dataset.gearTarget = view.id; button.textContent = '⚙️';
      button.setAttribute('aria-label', 'Ajustar colores de esta pestaña');
      target.append(button);
    });
    for (const [id, key] of [['exercise-detail-dialog', 'exercise-detail'], ['whatsapp-dialog', 'comunicador']]) {
      const root = document.getElementById(id);
      if (!root) continue;
      const existing = root.querySelector('.cbx-context-gear-btn');
      const target = root.querySelector('.sheet-head') || root.querySelector('.dialog-head') || root;
      if (existing) {
        if (root.open && !existing.getClientRects().length) target.append(existing);
        continue;
      }
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'cbx-context-gear-btn';
      button.dataset.gearTarget = key; button.textContent = '⚙️';
      button.setAttribute('aria-label', 'Ajustar colores de esta ventana');
      target.append(button);
    }
    document.querySelectorAll('dialog[open]:not(#auth-dialog):not(#cbx-quick-color-dialog):not(#exercise-detail-dialog):not(#whatsapp-dialog)').forEach((dialog) => {
      dialog.dataset.themeView ||= document.querySelector('.view.active')?.id || 'ajustes';
      if (dialog.querySelector('.cbx-context-gear-btn')) return;
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'cbx-context-gear-btn';
      button.dataset.gearTarget = dialog.dataset.themeView; button.textContent = '⚙️';
      button.setAttribute('aria-label', 'Ajustar colores de esta ventana');
      (dialog.querySelector('.dialog-head') || dialog).append(button);
    });
    // Keep historical selector identities even when a card no longer owns a gear.
    document.querySelectorAll('.view .panel,.view .cbx-card,.view .specialist-item,.view #squad-stats .stat,.view section').forEach(root=>{
      if(root.id || root.classList.contains('view'))return;
      const view=root.closest('.view');const heading=root.querySelector('h2,h3,h4,legend,summary');
      if(!view || (!heading && !root.matches('.stat')))return;
      const label=(heading?.textContent||root.className).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,55);
      const peers=[...view.querySelectorAll(root.tagName)].filter(el=>el.className===root.className);
      root.id=view.id+'-colours-'+label+'-'+peers.indexOf(root);
    });
    document.querySelectorAll('.cbx-section-gear').forEach(button=>{const scope=document.getElementById(button.dataset.themeSection);if(scope?.matches('.cbx-player,.specialist-item,.stat') || button.closest('.cbx-player'))button.remove();});
    const roots=[...document.querySelectorAll('.view .panel,.view .cbx-card,.view .cbx-banner,.view #squad-stats,.view #plantilla-specialists-bar,.view #players-list')];
    for(const root of roots) {
      if(root.closest('#cbx-quick-color-dialog')||root.classList.contains('view'))continue;
      const view=root.closest('.view');if(!view)continue;
      const heading=root.querySelector('h2,h3,h4,legend,summary');
      if(root.parentElement.closest('.panel,.cbx-card') && !root.matches('#players-list,#squad-stats,#plantilla-specialists-bar'))continue;
      if(!heading && !root.matches('#players-list,#squad-stats'))continue;
      const scope=root.matches('.cbx-player')?document.getElementById('players-list'):root;
      if(!scope.id && root.matches('.cbx-banner'))scope.id=view.id+'-colours-banner';
      if(!scope.id) {
        const label=(heading?.textContent||root.className).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,55);
        const peers=[...view.querySelectorAll(root.tagName)].filter(el=>el.className===root.className);
        scope.id=view.id+'-colours-'+label+'-'+peers.indexOf(root);
      }
      if([...root.querySelectorAll('[data-theme-section]')].some(b=>b.dataset.themeSection===scope.id))continue;
      const button=document.createElement('button');button.type='button';button.className='cbx-context-gear-btn cbx-section-gear';button.textContent='⚙️';button.dataset.gearTarget='section';button.dataset.themeSection=scope.id;
      button.setAttribute('aria-label','Personalizar '+(root.matches('.cbx-player')?'todas las fichas de jugadores':heading?.textContent||root.querySelector('span')?.textContent||'esta sección'));
      if(root.id==='players-list'){button.textContent='⚙️ Colores de las fichas';button.style.gridColumn='1 / -1';root.prepend(button);}else (heading?.parentElement||root).append(button);
    }
    const leaders=document.getElementById('squad-leaderboards');
    if(leaders && !leaders.querySelector('[data-theme-section="squad-leaderboards"]')) {
      const button=document.createElement('button');button.type='button';button.className='cbx-context-gear-btn cbx-section-gear';button.textContent='⚙️';button.dataset.gearTarget='section';button.dataset.themeSection=leaders.id;button.setAttribute('aria-label','Personalizar tablas clasificatorias');leaders.querySelector('summary')?.append(button);
    }
    applyComponentColors();
  };
  new MutationObserver(() => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['open'] });
  update();
}
