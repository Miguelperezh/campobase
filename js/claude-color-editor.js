import { claudeColorSections } from './claude-color-bindings.js?v=claude-proposal-3';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const palette=['#0a251b','#1e523d','#10b981','#86efac','#dcfce7','#ffffff','#f8fafc','#e2e8f0','#94a3b8','#475569','#0f172a','#2563eb','#dbeafe','#7c3aed','#f59e0b','#fff0d8','#c8102e','#e02444','#fdf2f4','#facc15'];
const emojis=['⚽','🥅','🎯','🦶','🚩','📐','©️','👑','⭐','🧤','👟','⏱️','🤝','✅','⏰','❌','⏳','🤒','🩹','📋','🔕','🔄','🟨','🟥','⚠️','🏆','🔥','💪'];
let previewTheme=null,activeEditor=null;
export const colorPreviewTheme=()=>previewTheme;
export function overlayClaudeColors(theme,changes){
 const next=structuredClone(theme||{});next.views ||= {};
 for(const [key,choice]of Object.entries(changes)){
  const view=next.views[choice.viewId] ||= {};view.uiParts ||= {};
  if(!choice.reset&&choice.selector&&choice.css){
   const targets=getNodes(choice.selector);
   for(const [oldKey,old]of Object.entries(view.uiParts)){
    if(oldKey===key||old.css!==choice.css)continue;
    const nodes=getNodes(old.selector);
    if(nodes.length&&nodes.every(node=>targets.includes(node)))delete view.uiParts[oldKey];
   }
  }
  if(choice.reset)delete view.uiParts[key];else view.uiParts[key]=structuredClone(choice);
 }
 return next;
}
const getNodes=selector=>{try{return [...document.querySelectorAll(selector)];}catch{return [];}};
const hex=value=>/^#[0-9a-f]{6}$/i.test(value)?value:'#'+(String(value).match(/\d+/g)||['255','255','255']).slice(0,3).map(n=>Math.min(255,Number(n)).toString(16).padStart(2,'0')).join('');
export function openClaudeColorEditor({viewId,scope,title,readTheme,applyTheme,saveTheme}){
 activeEditor?.close();
 let sections=claudeColorSections(viewId,scope);if(!sections.length)return;
 let section=sections[0],element=section.els[0],selectedKey=element.props[0].key,changes={},history=[],future=[],status='',saving=false;
 const initialValues=new Map();
 for(const s of sections)for(const e of s.els)for(const p of e.props){const node=getNodes(p.selector)[0];const value=p.css==='icon'?node?.textContent:getComputedStyle(node).getPropertyValue(p.css==='background'?'background-color':p.css);initialValues.set(e.id+'.'+p.key,p.css==='icon'?value?.trim():p.css.startsWith('font-')?value:hex(value));}
 const panel=document.createElement('aside');panel.id='cbx-claude-colors';panel.className='cbp-colour-drawer';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','false');panel.setAttribute('aria-label','Ajustes de '+title);
 panel.innerHTML=`<header><div><small>Solo cambia esta ${scope?'sección':'pestaña'}</small><h2>Ajustes de ${esc(title)}</h2><p>Toca cualquier parte de la pantalla o elige de la lista.</p></div><button type="button" data-action="close" aria-label="Cerrar ajustes">✕</button></header><nav class="cbp-section-choices"></nav><div class="cbp-colour-scroll"></div><footer><strong class="cbp-pending" role="status"></strong><small class="cbp-save-status"></small><div><button type="button" data-action="undo">Deshacer</button><button type="button" data-action="cancel">Cancelar</button><button type="button" data-action="save">Guardar</button></div></footer>`;
 (scope?.closest('dialog[open]')||document.getElementById({'exercise-detail':'exercise-detail-dialog',comunicador:'whatsapp-dialog'}[viewId])||document.body).append(panel);document.body.classList.add('cbp-editing-colours');
 const previousFocus=document.activeElement;
 const signalController=new AbortController(),signal=signalController.signal;
 const baseline=(e,p)=>initialValues.get(e.id+'.'+p.key);
 const value=(e,p)=>changes[e.id+'.'+p.key]?.value??baseline(e,p);
 const apply=()=>{previewTheme=overlayClaudeColors(readTheme(),changes);applyTheme(previewTheme);};
 const highlight=()=>{document.querySelectorAll('[data-cbp-selected]').forEach(n=>n.removeAttribute('data-cbp-selected'));const p=element.props.find(p=>p.key===selectedKey)||element.props[0];getNodes(p.selector).forEach(n=>n.dataset.cbpSelected='');};
 const count=()=>Object.keys(changes).length;
 const foot=()=>{panel.querySelector('.cbp-pending').textContent=count()?count()+' cambios sin guardar':'Todo guardado';panel.querySelector('.cbp-save-status').textContent=status||'Lo que no toques conserva su valor actual.';panel.querySelector('[data-action=undo]').disabled=!history.length;panel.querySelector('[data-action=save]').disabled=saving||!count();};
 function choose(e,key){element=e;selectedKey=key||e.props[0].key;render();highlight();}
 function change(p,v){const key=element.id+'.'+p.key;if(value(element,p)===v)return;history.push(structuredClone(changes));future=[];changes[key]={viewId,selector:p.selector,css:p.css,value:v,element:element.id,label:p.label};selectedKey=p.key;apply();highlight();foot();updateFields();}
 function updateFields(){for(const p of element.props){const field=panel.querySelector('[data-control="'+CSS.escape(p.key)+'"]');if(!field)continue;const input=field.querySelector('input,select');if(input)input.value=p.css==='font-size'?parseFloat(value(element,p)):value(element,p);field.querySelector('code')?.replaceChildren(document.createTextNode(value(element,p)));field.querySelectorAll('[data-swatch]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.swatch===value(element,p))));}panel.querySelector('.cbp-element-example').style.cssText='';const source=getNodes(element.props[0].selector)[0];if(source){const style=getComputedStyle(source);for(const prop of ['background','color','border-color','font-family','font-size','font-weight'])panel.querySelector('.cbp-element-example').style.setProperty(prop,style.getPropertyValue(prop));}}
 function render(){
  panel.querySelector('nav').innerHTML=sections.map(s=>`<button type="button" data-section="${esc(s.id)}" aria-pressed="${s===section}">${esc(s.name)}</button>`).join('');
  const fontFamilies=['Barlow, sans-serif','Barlow Condensed, sans-serif','system-ui, sans-serif','Arial, sans-serif','Georgia, serif'];
  panel.querySelector('.cbp-colour-scroll').innerHTML=`<section class="cbp-part"><small>3 · Elige qué parte cambia</small><h3>${esc(element.name)}</h3><p>Se aplica a: ${esc(element.scope)}</p><div class="cbp-element-example">${esc(getNodes(element.props[0].selector)[0]?.textContent?.trim().replace(/\s+/g,' ').slice(0,160)||element.name)}</div>${element.props.map(p=>{
   const v=value(element,p);const controls=p.css==='icon'?`<p>Es un emoji: elige el icono. Su color interno no se puede cambiar; el fondo, texto y borde sí.</p><div class="cbp-palette">${emojis.map(icon=>`<button type="button" data-control-key="${esc(p.key)}" data-swatch="${icon}" aria-label="${esc(p.label)} ${icon}">${icon}</button>`).join('')}</div>`:p.css==='font-family'?`<select data-key="${p.key}" aria-label="${esc(p.label)}"><option value="${esc(v)}">Actual · ${esc(v)}</option>${fontFamilies.map(f=>`<option value="${f}">${f.split(',')[0]}</option>`).join('')}</select>`:p.css==='font-weight'?`<select data-key="${p.key}" aria-label="${esc(p.label)}">${[400,500,600,700,800,900].map(w=>`<option value="${w}" ${String(w)===v?'selected':''}>${w<600?'Normal':w<800?'Negrita':'Muy gruesa'} · ${w}</option>`).join('')}</select>`:p.css==='font-size'?`<input type="number" min="8" max="72" step="1" value="${parseFloat(v)}" data-key="${p.key}" aria-label="${esc(p.label)}">`:`<div class="cbp-control-heading"><span style="background:${v}"></span><input type="color" value="${v}" data-key="${p.key}" aria-label="${esc(p.label)}"><code>${v}</code></div><div class="cbp-palette">${palette.map(c=>`<button type="button" data-control-key="${esc(p.key)}" data-swatch="${c}" style="background:${c}" aria-label="${esc(p.label)} ${c}" aria-pressed="${c===v}"></button>`).join('')}</div>`;
   return `<fieldset data-control="${esc(p.key)}" class="${p.key===selectedKey?'is-chosen':''}"><legend>${esc(p.label)}</legend><small>${esc(p.css==='icon'?'Icono':p.css.startsWith('font-')?'Fuente':p.css==='color'?'Texto':p.css.includes('border')?'Borde':'Fondo')} · ${esc(element.name)}</small>${controls}<button type="button" class="cbp-current-value" data-original="${esc(p.key)}">Volver al valor actual</button></fieldset>`;
  }).join('')}<button type="button" class="cbp-reset-part" data-action="reset">Restablecer este elemento</button></section><section class="cbp-elements"><small>Elementos de este apartado</small><label>Elige un elemento<select aria-label="Elemento que quieres personalizar" data-element-select>${section.els.map(e=>`<option value="${esc(e.id)}" ${e===element?'selected':''}>${esc(e.name)}</option>`).join('')}</select></label><div>${section.els.map(e=>`<button type="button" data-element="${esc(e.id)}" aria-pressed="${e===element}">${esc(e.name)}</button>`).join('')}</div></section>`;
  foot();updateFields();
 }
 function close(){signalController.abort();previewTheme=null;applyTheme(readTheme());panel.remove();document.body.classList.remove('cbp-editing-colours');document.querySelectorAll('[data-cbp-selected]').forEach(n=>n.removeAttribute('data-cbp-selected'));activeEditor=null;previousFocus?.focus();}
 activeEditor={close};
 panel.addEventListener('input',event=>{const input=event.target;if(!input.dataset.key)return;const p=element.props.find(p=>p.key===input.dataset.key);change(p,p.css==='font-size'?input.value+'px':input.value);},{signal});
 panel.addEventListener('change',event=>{if(event.target.matches('[data-element-select]'))choose(section.els.find(e=>e.id===event.target.value));},{signal});
 panel.addEventListener('click',async event=>{
  const b=event.target.closest('button');if(!b)return;
  if(b.dataset.section){section=sections.find(s=>s.id===b.dataset.section);choose(section.els[0]);return;}
  if(b.dataset.element){choose(section.els.find(e=>e.id===b.dataset.element));return;}
  if(b.dataset.swatch){change(element.props.find(p=>p.key===b.dataset.controlKey),b.dataset.swatch);return;}
  if(b.dataset.original){history.push(structuredClone(changes));delete changes[element.id+'.'+b.dataset.original];apply();render();highlight();return;}
  if(b.dataset.action==='reset'){history.push(structuredClone(changes));for(const p of element.props)changes[element.id+'.'+p.key]={viewId,reset:true};apply();render();highlight();}
  if(b.dataset.action==='undo'&&history.length){future.push(changes);changes=history.pop();apply();render();highlight();}
  if(b.dataset.action==='cancel'||b.dataset.action==='close')close();
  if(b.dataset.action==='save'&&!saving){saving=true;status='Guardando…';foot();try{const theme=overlayClaudeColors(readTheme(),changes);await saveTheme(theme);previewTheme=null;changes={};history=[];status='Guardado y comprobado · '+new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});applyTheme(readTheme());for(const s of sections)for(const e of s.els)for(const p of e.props){const n=getNodes(p.selector)[0];if(n)initialValues.set(e.id+'.'+p.key,p.css==='icon'?n.textContent.trim():p.css.startsWith('font-')?getComputedStyle(n).getPropertyValue(p.css):hex(getComputedStyle(n).getPropertyValue(p.css==='background'?'background-color':p.css)));}render();}catch(error){status='No se pudo guardar: '+error.message;}finally{saving=false;foot();}}
 },{signal});
 // Capture prevents triggering Edit/Delete/links while the user picks a visual part.
 document.addEventListener('click',event=>{
  if(panel.contains(event.target)||!activeEditor)return;
  const hit=sections.flatMap(s=>s.els.map(e=>({s,e}))).flatMap(({s,e})=>e.props.map(p=>({s,e,p,nodes:getNodes(p.selector)}))).filter(x=>x.nodes.some(n=>n===event.target||n.contains(event.target))).sort((a,b)=>{const depth=x=>{let n=x.nodes.find(n=>n.contains(event.target)),d=0;while(n){d++;n=n.parentElement;}return d;};return depth(b)-depth(a);})[0];
  if(!hit)return;event.preventDefault();event.stopImmediatePropagation();section=hit.s;choose(hit.e,hit.p.key);
 },{capture:true,signal});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();close();}},{capture:true,signal});
 render();highlight();panel.querySelector('[data-action=close]').focus();
}
