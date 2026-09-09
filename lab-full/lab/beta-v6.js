if(!document.querySelector('#fc-v6-style')){const l=document.createElement('link');l.id='fc-v6-style';l.rel='stylesheet';l.href='lab/beta-v6.css?v=6.1';document.head.appendChild(l);}
if(!document.querySelector('#fc-v6-post-style')){const l=document.createElement('link');l.id='fc-v6-post-style';l.rel='stylesheet';l.href='lab/beta-v6-postmatch.css?v=6.1';document.head.appendChild(l);}
import './beta-v6-data.js';
import './beta-v6-shell.js';
import './beta-v6-training.js';
import './beta-v6-crud.js';
import './beta-v6-postmatch.js';

const extraViews=new Set(['fc-hub-analisis','fc-hub-ajustes','fc-informes','fc-identidad','ajustes','fc-postpartido','fc-planificacion']);
const syncExtraNavigation=new MutationObserver((mutations)=>{
  if(!mutations.some(m=>m.target?.classList?.contains('view')&&m.target.classList.contains('active')))return;
  const active=document.querySelector('.view.active')?.id||'';
  const more=document.querySelector('#fc-v6-more');if(more?.open)more.close();
  const moreButton=document.querySelector('#fc-v6-nav [data-group="mas"]');
  if(moreButton)moreButton.classList.toggle('active',extraViews.has(active));
});
syncExtraNavigation.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
