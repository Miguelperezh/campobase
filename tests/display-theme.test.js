import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {resolveDisplayTheme} from '../js/display-theme.js';
const app=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
const cached={accentColor:'#ff0000',views:{partido:{uiParts:{bar:{background:'#ff0000'}}}}};
const team={accentColor:'#123456',views:{partido:{uiParts:{bar:{background:'#123456'}}}}};
test('colores sincronizados prevalecen sobre caché antigua para ordenador y móvil',()=>{
 for(const role of ['owner','delegate']) {
  const before=JSON.stringify({team,cached});
  assert.deepEqual(resolveDisplayTheme(team,cached),team,role);
  assert.equal(JSON.stringify({team,cached}),before);
 }
});
test('vista previa explícita y prueba aislada siguen funcionando sin tocar el tema guardado',()=>{
 const preview={views:{partido:{uiParts:{bar:{background:'#abcdef'}}}}};
 assert.equal(resolveDisplayTheme(team,cached,preview).views.partido.uiParts.bar.background,'#abcdef');
 assert.deepEqual(resolveDisplayTheme(team,cached,undefined,true),cached);
 assert.equal(team.views.partido.uiParts.bar.background,'#123456');
});
test('delegado no puede abrir editor ni aplicar colores de prueba en la app',()=>{
 const source=app.slice(app.indexOf('function openQuickColorDialog('),app.indexOf('window.openQuickColorDialog'));
 const messages=[];
 const open=vm.runInNewContext(`(${source})`,{state:{role:'delegate'},roleCanUseOwnerFeatures:role=>role==='owner'||role==='demo',toast:message=>messages.push(message),document:{getElementById(){throw Error('No debe abrir ni buscar editor');}},openClaudeColorEditor(){throw Error('No debe previsualizar');}});
 open('partido');assert.equal(messages.length,1);assert.match(messages[0],/Solo el entrenador/);
});
test('aplicación y editor leen la misma prioridad del tema sincronizado',()=>{
 assert.match(app,/resolveDisplayTheme\(state.settings\?\.theme, localTheme, themeInput/);
 assert.match(app,/readTheme:[\s\S]*?return resolveDisplayTheme\(state.settings\?\.theme,local/);
});

test('tema de equipo no resucita secciones o propiedades solo presentes en caché móvil',()=>{
 const cloud={views:{partido:{btnBg:'#123456'}}};
 const stale={fontColor:'#ff0000',views:{partido:{btnInk:'#00ff00'},delegado:{btnBg:'#ffff00'}}};
 assert.deepEqual(resolveDisplayTheme(cloud,stale),cloud);
 assert.deepEqual(resolveDisplayTheme({},stale),{views:{}});
 assert.deepEqual(resolveDisplayTheme(undefined,stale),stale);
});
