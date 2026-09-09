if(!document.querySelector('#fc-v6-style')){const l=document.createElement('link');l.id='fc-v6-style';l.rel='stylesheet';l.href='lab/beta-v6.css?v=6';document.head.appendChild(l);}
import './beta-v6-data.js';
import './beta-v6-shell.js';
import './beta-v6-training.js';
import './beta-v6-crud.js';

const closeMoreOnNavigation=new MutationObserver((mutations)=>{if(!mutations.some(m=>m.target?.classList?.contains('view')&&m.target.classList.contains('active')))return;const d=document.querySelector('#fc-v6-more');if(d?.open)d.close();});
closeMoreOnNavigation.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
