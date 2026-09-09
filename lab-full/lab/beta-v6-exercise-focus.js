import { activateView } from './beta-v6-shell.js';

const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];

function clearFilters(){
  const global=$('#global-search');if(global){global.value='';global.dispatchEvent(new Event('input',{bubbles:true}));}
  const form=$('#exercise-filters');if(form){try{form.reset();}catch{}form.dispatchEvent(new Event('change',{bubbles:true}));form.dispatchEvent(new Event('input',{bubbles:true}));}
}
function removeBar(){$('#fc-v6-exercise-focusbar')?.remove();}
function showAll(){
  removeBar();
  $$('.ejercicio-validado').forEach(card=>{card.hidden=false;card.classList.remove('fc-v6-focused-exercise');card.style.removeProperty('display');});
  clearFilters();
  window.scrollTo({top:0,behavior:'smooth'});$('#app')?.scrollTo?.({top:0,behavior:'smooth'});
}
function installBar(card){
  removeBar();
  const bar=document.createElement('div');bar.id='fc-v6-exercise-focusbar';bar.innerHTML='<button type="button" class="secondary">← Ver todos los ejercicios</button><div><small>Ejercicio recomendado</small><strong></strong></div>';
  bar.querySelector('strong').textContent=card.querySelector('.nombre')?.textContent||'Ejercicio';
  bar.querySelector('button').addEventListener('click',showAll);
  card.parentElement?.insertBefore(bar,card);
}
function applyFocus(id,tries=0){
  const cards=$$('.ejercicio-validado');
  const target=cards.find(card=>card.dataset.id===id);
  if(!target&&tries<40)return setTimeout(()=>applyFocus(id,tries+1),120);
  if(!target)return;
  cards.forEach(card=>{const keep=card===target;card.hidden=!keep;card.classList.toggle('fc-v6-focused-exercise',keep);if(keep)card.style.removeProperty('display');});
  installBar(target);
  target.scrollIntoView({behavior:'smooth',block:'start'});
  setTimeout(()=>target.querySelector('.btn-play')?.click(),300);
}
export function openFocusedExercise(id){
  if(!id)return;
  activateView('ejercicios');
  clearFilters();
  setTimeout(()=>applyFocus(id),100);
}

document.addEventListener('click',e=>{
  const b=e.target.closest('#fc-postpartido [data-play]');
  if(!b)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  openFocusedExercise(b.dataset.play);
},true);
