import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';

const base=process.env.CAMPOBASE_TEST_URL||'http://127.0.0.1:4226';
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN,headless:true,args:['--no-sandbox']});
try{
  for(const width of [1440,390]){
    const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});
    const page=await context.newPage(),errors=[],externalRequests=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/*',route=>{
      const url=new URL(route.request().url());
      if(url.hostname!=='127.0.0.1'){externalRequests.push(url.origin);return route.abort();}
      // The fixture needs the real DB, auth and queue. UI decorators require
      // the full app DOM and have no part in this storage-only regression.
      if(/\/js\/(completed-events-ui|session-visual-planner|session-planner-ui)\.js/.test(url.pathname))return route.fulfill({contentType:'application/javascript',body:'export {};'});
      return route.continue();
    });
    await page.goto(base+'/tests/fixtures/session-delete-guard.html');
    await page.waitForFunction(()=>window.fixtureReady);

    for(const operation of ['delete','put','batch']){
      const prepare=await page.evaluate(operation=>fixture.prepareSwitch(operation),operation);
      assert.deepEqual(prepare.outcome,{resolved:false,error:'ACCOUNT_CHANGED'},operation);
      assert.ok(prepare.calls.length>=2,'la guardia se repite tras preparar la identidad');
      assert.deepEqual(prepare.after,prepare.before,'el cambio de cuenta no modifica ni encola registros en ninguna base');

      for(const [change,error] of [['account','ACCOUNT_CHANGED'],['pin','PIN_CHANGED'],['role','ROLE_CHANGED']]){
        const result=await page.evaluate(({change,operation})=>fixture.afterPrepareChange(change,operation),{change,operation});
        assert.deepEqual(result.outcome,{resolved:false,error},operation+' '+change);
        assert.ok(result.calls.length>=3,'la guardia se repite después de abrir IndexedDB');
        assert.equal(result.calls.at(-1).databaseName,result.expectedDatabase,'la guardia recibe el nombre de la base que se abrió realmente');
        assert.deepEqual(result.after,result.before,'la cancelación conserva datos y cola de ambas cuentas');
      }
    }

    const deletion=await page.evaluate(()=>fixture.localFirstDelete());
    assert.deepEqual(deletion.outcome,{resolved:true});
    assert.equal(deletion.localSettled,true,'el borrado local no espera a una nube retenida');
    assert.deepEqual(deletion.during[deletion.a].settings,[]);
    assert.equal(deletion.during[deletion.a].syncQueue.length,1);
    assert.equal(deletion.during[deletion.a].syncQueue[0].operation,'delete');
    assert.equal(deletion.during[deletion.a].syncQueue[0].recordId,'same-session-id');
    assert.equal(deletion.delivered.length,1);
    assert.equal(deletion.delivered[0].operation,'delete');
    assert.equal(deletion.remoteHasSession,false,'el tombstone llega al liberar la nube');
    assert.deepEqual(deletion.after[deletion.a].syncQueue,[],'el tombstone se confirma después de entregarse');
    assert.deepEqual(deletion.after[deletion.a].trainings,deletion.before[deletion.a].trainings);
    assert.deepEqual(deletion.after[deletion.b],deletion.before[deletion.b],'la otra cuenta con IDs coincidentes queda intacta');
    assert.ok(deletion.calls.some(call=>call.databaseName==='campobase_'+deletion.a));

    const saving=await page.evaluate(()=>fixture.localFirstPut());
    assert.deepEqual(saving.outcome,{resolved:true});
    assert.equal(saving.localSettled,true,'Guardar copia no espera a una nube retenida');
    assert.deepEqual(saving.during[saving.a].settings.find(item=>item.id===saving.record.id),saving.record);
    assert.deepEqual(saving.during[saving.a].settings.filter(item=>item.id!==saving.record.id),saving.before[saving.a].settings,'el original se conserva');
    assert.equal(saving.during[saving.a].syncQueue.length,1);
    assert.equal(saving.during[saving.a].syncQueue[0].operation,'upsert');
    assert.equal(saving.during[saving.a].syncQueue[0].recordId,saving.record.id);
    assert.equal(saving.delivered.length,1);
    assert.equal(saving.delivered[0].operation,'upsert');
    assert.deepEqual(saving.remote.find(item=>item.id===saving.record.id),saving.record,'la copia llega al liberar la nube');
    assert.deepEqual(saving.remote.filter(item=>item.id!==saving.record.id),saving.before[saving.a].settings,'el original remoto se conserva');
    assert.deepEqual(saving.after[saving.a].syncQueue,[],'la copia pendiente se confirma tras entregarse');
    assert.deepEqual(saving.after[saving.a].trainings,saving.before[saving.a].trainings);
    assert.deepEqual(saving.after[saving.b],saving.before[saving.b],'la otra cuenta conserva sus datos y cola');
    assert.ok(saving.calls.some(call=>call.databaseName==='campobase_'+saving.a));
    assert.deepEqual(errors,[]);
    assert.deepEqual(externalRequests,[],'la prueba no contacta servicios externos');
    await context.close();
    console.log('PASS',width,'borrar/guardar bloquean cambio de cuenta/PIN/rol; IndexedDB A/B intactas; delete y copia local con cola sin esperar nube');
  }
}finally{await browser.close();}
