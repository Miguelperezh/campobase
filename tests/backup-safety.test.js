import test from 'node:test';
import assert from 'node:assert/strict';
import {buildExportManifest,validateBackupForAccount,backupSummary,mobileAppLink,cleanLegacyMobileLink} from '../js/backup-safety.js';
const target={userId:'A',database:'campobase_A',role:'owner'};
const data=()=>({players:[{id:'p'}],matches:[{id:'m'}],callups:[],trainings:[],settings:[{id:'main',teamName:'A'},{id:'session',recordType:'trainingSession'},{id:'exercise',recordType:'exercise',userCreated:true}]});
const backup=()=>buildExportManifest(data(),target);

test('restoration checks identity, role, store provenance and valid unique IDs before writing',()=>{
  const original=backup();assert.deepEqual(validateBackupForAccount(original,target),original.data);
  assert.throws(()=>validateBackupForAccount(original,{...target,userId:'B'}),/otra cuenta/);
  assert.throws(()=>validateBackupForAccount(original,{...target,role:'delegate'}),/titular/);
  assert.throws(()=>validateBackupForAccount({...original,database:'campobase-other'},target),/otro almacenamiento/);
  assert.throws(()=>validateBackupForAccount({...original,saasUserId:''},target),/antigua/);
  assert.throws(()=>validateBackupForAccount(original,{userId:'',database:'campobase',role:'owner'}),/vinculada/);
  for(const invalid of [{...original,version:2},{...original,data:{...original.data,players:[{name:'missing'}]}},{...original,data:{...original.data,players:[{id:'p'},{id:'p'}]}}])assert.throws(()=>validateBackupForAccount(invalid,target));
  assert.equal(original.data.players[0].id,'p');
  assert.throws(()=>validateBackupForAccount({...original,data:{...original.data,players:[{id:1},{id:'1'}]}},target),/repetidos/);
});
test('demo data cannot replace real account data and summary counts only actual record types',()=>{
  assert.throws(()=>validateBackupForAccount({...backup(),mode:'demo'},target),/demostración/);
  assert.equal(validateBackupForAccount({...backup(),mode:'demo'},{...target,database:'campobase-demo-test',role:'demo'}).players.length,1);
  assert.deepEqual(backupSummary(data()),{teamName:'A',players:1,matches:1,callups:0,attendance:0,sessions:1,ownExercises:1});
});
test('mobile sharing strips identities and sessions and legacy links never authenticate',()=>{
  const link='https://example.test/app/?sync=owner&team=A&pin=1234&perms=ajustes#session=secrets';
  assert.equal(mobileAppLink(link),'https://example.test/app/');
  const cleaned=cleanLegacyMobileLink(link);assert.equal(cleaned.removed,true);
  for(const secret of ['session','team=','pin=','sync=','role='])assert.equal(cleaned.url.includes(secret),false);
  const delegate='https://example.test/app/?role=delegate&team=A&pin=1234';
  assert.equal(cleanLegacyMobileLink(delegate).removed,false);
});
