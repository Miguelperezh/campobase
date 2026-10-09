import test from 'node:test';
import assert from 'node:assert/strict';
import {timePlanColorSections} from '../js/time-plan-color-controls.js';
test('controles del plan usan selectores comunes, etiquetas concretas y fuentes solo en textos',()=>{
 const previous=globalThis.document;
 const node={closest:()=>null};const dialog={contains:()=>true};
 globalThis.document={querySelectorAll:()=>[node]};
 try{
 const sections=timePlanColorSections('preparacion',{closest:()=>dialog,contains:()=>true});
 const items=sections.flatMap(s=>s.els);
 const field=items.find(e=>e.id==='time-plan.field');
 assert.deepEqual(field.props.map(p=>p.css),['background','border-color']);
 assert.ok(field.props.every(p=>!p.selector.includes('data-player')));
 assert.ok(items.find(e=>e.id==='time-plan.bar-minutes').props.some(p=>p.css==='font-size'));
 assert.ok(items.every(e=>e.props.every(p=>p.label.includes(e.name))));
 assert.ok(items.every(e=>e.props.every(p=>p.selector.split(',').every(s=>s.trim().startsWith('#cbx-window-dialog ')))));
 }finally{globalThis.document=previous;}
});
