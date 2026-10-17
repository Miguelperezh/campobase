import test from 'node:test';
import assert from 'node:assert/strict';
import {buildMatchPlanHtml} from '../js/print-match-plan.js';
import {printPlanIdentity,playerPrintSpans,splitPrintSpans,printPositionMoves} from '../js/print-match-visual.js';
import {state,match,moments} from './fixtures/print-plan-visual.js';

test('modelo validado conserva seis ventanas y resume todos los convocados en tres A4',()=>{
 const before=JSON.stringify(state),html=buildMatchPlanHtml(match,state);
 assert.equal((html.match(/class="cb-print-sheet /g)||[]).length,3);
 assert.deepEqual([...html.matchAll(/data-print-minute="(\d+)"/g)].map(m=>Number(m[1])),[17,26,35,47,53,61]);
 assert.equal((html.match(/data-print-player=/g)||[]).length,13);
 assert.match(html,/2\.ª · 12′/);assert.match(html,/MINUTO 47′/);
 assert.match(html,/DESCANSO Y REINICIO/);assert.equal(JSON.stringify(state),before);
});

test('barras por parte conservan entradas repetidas y la suma exacta del plan',()=>{
 const spans=playerPrintSpans('p15',moments,70);
 assert.deepEqual(spans,[{from:0,to:17},{from:35,to:53},{from:61,to:70}]);
 assert.deepEqual(splitPrintSpans(spans,35,70),[{from:0,to:18},{from:26,to:35}]);
 assert.equal(spans.reduce((sum,s)=>sum+s.to-s.from,0),44);
 const html=buildMatchPlanHtml(match,state);
 assert.match(html,/0–18 \+ 26–35/);assert.match(html,/class="cbv-min">44′/);
});

test('recolocaciones se distinguen de sustituciones sin inventar salidas',()=>{
 const lines=printPositionMoves(moments[0],moments[1],id=>id);
 assert.deepEqual(lines,['p11 pasa a Banda izquierda.']);
 const a={formation:'1-2',team:[{pos:'Central',playerId:'a'},{pos:'Medio',playerId:'b'}]};
 const b={formation:'1-2',team:[{pos:'Central',playerId:'b'},{pos:'Medio',playerId:'a'}]};
 assert.deepEqual(printPositionMoves(a,b,id=>id),['b intercambia posición con a: Central / Medio.']);
 const local={...state,preparaciones:[{matchId:match.id,team:a.team,moments:[{...a,minute:0},{...b,minute:15}]}]};
 const window=buildMatchPlanHtml(match,local).split('data-print-minute="15"')[1].split('</section>')[0];
 assert.doesNotMatch(window,/>SALE</);assert.match(window,/intercambia posición/);
});

test('identidad usa ajustes del equipo sin imponer nombres, escudo ni colores ajenos',()=>{
 const identity=printPlanIdentity({settings:{teamName:'Otro equipo',clubCrest:'https://example.com/club.png',theme:{btnBg:'#204060'}}});
 assert.equal(identity.teamName,'Otro equipo');assert.equal(identity.crest,'https://example.com/club.png');assert.equal(identity.accent,'#204060');assert.equal(identity.ink,'#ffffff');
 assert.equal(printPlanIdentity({settings:{theme:{btnBg:'#ffffff'}}}).ink,'#142033');
 assert.equal(printPlanIdentity({}).teamName,'Equipo');
 const html=buildMatchPlanHtml(match,{...state,settings:{teamName:'Otro equipo',clubCrest:'/icons/escudo.png',theme:{accentColor:'#204060'}}});
 assert.match(html,/--pv-accent:#204060/);assert.match(html,/Otro equipo/);assert.match(html,/src="\/icons\/escudo.png"/);
 assert.doesNotMatch(html,/Unión Viera|Miguel Pérez|Notas Migue/);
});

test('ajustes y contenido no pueden inyectar CSS o elementos activos en el documento',()=>{
 assert.equal(printPlanIdentity({settings:{clubCrest:'javascript:alert(1)',theme:{btnBg:'red;display:none'}}}).crest,'');
 const html=buildMatchPlanHtml({...match,opponent:'<script>mal</script>'},{...state,settings:{teamName:'<img onerror=mal>'}});
 assert.match(html,/&lt;script&gt;mal&lt;\/script&gt;/);assert.match(html,/&lt;img onerror=mal&gt;/);
});

test('F11 y bloques largos mantienen todos los jugadores y ventanas en continuaciones',()=>{
 const players=Array.from({length:25},(_,i)=>({id:'q'+i,name:'Jugador '+i,number:i,positions:['Campo']}));
 const team=players.slice(0,11).map((p,i)=>({pos:i===0?'Portero':'Puesto '+i,playerId:p.id}));
 const rows=Array.from({length:18},(_,i)=>({minute:i*5,formation:'1-4-3-3',team}));
 const local={settings:{teamName:'F11'},players,callups:[{matchId:'f11',format:'F11',availableIds:players.map(p=>p.id)}],preparaciones:[{matchId:'f11',team,moments:rows}]};
 const html=buildMatchPlanHtml({id:'f11',format:'F11',duration:90},local);
 assert.equal((html.match(/data-print-player=/g)||[]).length,25);
 assert.equal((html.match(/data-print-minute=/g)||[]).length,17);
 assert.match(html,/ONCE TITULAR/);assert.match(html,/2 partes × 45 min/);
 assert.equal((html.match(/class="cbv-table"/g)||[]).length,2);
});
