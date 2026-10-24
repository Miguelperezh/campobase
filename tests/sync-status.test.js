import test from 'node:test';
import assert from 'node:assert/strict';
import {syncStatus, syncSupportReport} from '../js/sync-status.js';

const ready = {online:true,bound:true,connected:true};

test('solo una cuenta conectada con respuesta confirmada y cola vacía anuncia éxito',()=>{
  assert.deepEqual(syncStatus(ready),{key:'synced',label:'Sincronizado',detail:'Los cambios de esta cuenta están confirmados en la nube.',canRetry:true,confirmed:true});
  for(const input of [{},{...ready,demo:true},{...ready,online:false},{...ready,bound:false},{...ready,checking:true},{...ready,connected:false},{...ready,authRequired:true},{...ready,restricted:true},{...ready,error:'Red interrumpida'},{...ready,pending:1}]) {
    assert.equal(syncStatus(input).confirmed,false,JSON.stringify(input));
    assert.notEqual(syncStatus(input).key,'synced');
  }
});

test('la demo, la desconexión y el acceso pendiente no invitan a reintentar envíos',()=>{
  for(const input of [{...ready,demo:true},{...ready,online:false},{...ready,bound:false},{...ready,checking:true},{...ready,authRequired:true}])assert.equal(syncStatus(input).canRetry,false);
  assert.match(syncStatus({...ready,demo:true}).detail,/separados/);
  assert.match(syncStatus({...ready,online:false}).detail,/guardados/);
  assert.match(syncStatus({...ready,connected:false}).label,/pendiente de comprobar/);
});

test('los borradores bloqueados no se presentan como cambios que se volverán a enviar',()=>{
  const blocked=syncStatus({...ready,pending:2,blocked:2});
  assert.equal(blocked.key,'blocked');assert.equal(blocked.canRetry,false);assert.equal(blocked.confirmed,false);
  assert.match(blocked.label,/2 borradores sin permiso/);assert.match(blocked.detail,/No se enviarán automáticamente/);
  const mixed=syncStatus({...ready,pending:3,blocked:2});
  assert.equal(mixed.key,'pending');assert.equal(mixed.canRetry,true);assert.match(mixed.label,/1 cambio pendiente · 2 borradores sin permiso/);
  assert.match(mixed.detail,/Solo se intentará enviar el cambio permitido/);
});

test('los fallos del servidor y del acceso conservan el motivo y nunca confirman éxito',()=>{
  for(const error of ['Red interrumpida',new Error('Red interrumpida')]) {
    const status=syncStatus({...ready,error});
    assert.equal(status.key,'error');assert.equal(status.confirmed,false);assert.match(status.detail,/Red interrumpida/);assert.match(status.detail,/guardados/);
  }
  assert.equal(syncStatus({...ready,restricted:true}).key,'restricted');
  assert.equal(syncStatus({...ready,authRequired:true,error:'Error remoto'}).key,'auth-required');
  assert.equal(syncStatus({...ready,pending:1,blocked:1,error:'Permiso retirado'}).canRetry,false);
});

test('los conteos inválidos se normalizan sin mutar la entrada ni revelar contenido',()=>{
  const input={...ready,pending:3.8,blocked:99};const before=structuredClone(input);
  const result=syncStatus(input);assert.equal(result.key,'blocked');assert.match(result.label,/3 borradores/);assert.deepEqual(input,before);
  assert.equal(syncStatus({...ready,pending:Infinity,blocked:-1}).key,'unconfirmed');
  assert.deepEqual(Object.keys(result).sort(),['key','label','detail','canRetry','confirmed'].sort());
});

test('el informe de soporte copia exclusivamente siete campos sin datos ni errores privados',()=>{
  const report=syncSupportReport({version:'20261024-pilot-flows-1',role:'owner',online:true,pending:3,blocked:1,statusKey:'error',error:'PRIVATE-TOKEN',userId:'PRIVATE-USER',teamName:'PRIVATE-TEAM',pin:'9999',players:[{name:'PRIVATE-PLAYER',fatherPhone:'600123456'}]});
  assert.equal(report.split('\n').length,7);assert.match(report,/Versión: 20261024-pilot-flows-1/);assert.match(report,/Acceso: Entrenador/);
  assert.match(report,/Cambios pendientes: 3/);assert.match(report,/Borradores sin permiso: 1/);assert.doesNotMatch(report,/PRIVATE|9999|600123456/);
});

test('campos de informe no reconocidos no se copian como si fueran valores permitidos',()=>{
  const report=syncSupportReport({version:'PRIVATE-BUILD',role:'PRIVATE-ROLE',online:false,pending:-5,blocked:12,statusKey:'PRIVATE-STATUS'});
  assert.match(report,/Versión: No identificada/);assert.match(report,/Acceso: Sin acceso/);assert.match(report,/Estado: Sin comprobar/);
  assert.match(report,/Cambios pendientes: 0/);assert.match(report,/Borradores sin permiso: 0/);assert.doesNotMatch(report,/PRIVATE/);
  for(const role of ['__proto__','constructor'])for(const statusKey of ['__proto__','constructor']){
    const inherited=syncSupportReport({role,statusKey});
    assert.match(inherited,/Acceso: Sin acceso/);assert.match(inherited,/Estado: Sin comprobar/);
    assert.doesNotMatch(inherited,/\[object Object\]|function|native code/);
  }
});
