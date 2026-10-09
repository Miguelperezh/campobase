import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { signInWithCampoBasePin, loginWithEmailOrUsername } from '../js/auth-manager.js';

const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
const authManager = await readFile(new URL('../js/auth-manager.js', import.meta.url), 'utf8');

test('signInWithCampoBasePin permite autenticar con PIN sin requerir userId previo', async () => {
  const fakeSession = {
    user: { id: '11111111-2222-3333-4444-555555555555', email: 'migue@test.com' },
  };

  let invokedPayload = null;
  const mockClient = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      verifyOtp: async ({ token_hash, type }) => {
        assert.equal(token_hash, 'hash_abc');
        assert.equal(type, 'email');
        return { data: { session: fakeSession }, error: null };
      },
      signOut: async () => ({ error: null }),
    },
    functions: {
      invoke: async (fnName, { body }) => {
        assert.equal(fnName, 'pin-login');
        invokedPayload = body;
        return { data: { token_hash: 'hash_abc', type: 'email', user_id: fakeSession.user.id, owner_user_id: fakeSession.user.id }, error: null };
      },
    },
  };

  const session = await signInWithCampoBasePin(mockClient, '', '1234');
  assert.equal(session.user.id, fakeSession.user.id);
  assert.deepEqual(invokedPayload, { pin: '1234', role: 'auto' });
});

test('loginWithEmailOrUsername intenta login con PIN en Supabase si la contraseña falla', async () => {
  const fakeSession = {
    user: { id: '99999999-8888-7777-6666-555555555555', email: 'migue@test.com' },
  };

  const mockClient = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({
        data: null,
        error: new Error('Invalid login credentials'),
      }),
      verifyOtp: async () => ({ data: { session: fakeSession }, error: null }),
      signOut: async () => ({ error: null }),
    },
    functions: {
      invoke: async () => ({
        data: { token_hash: 'tok_123', type: 'email', user_id: fakeSession.user.id, owner_user_id: fakeSession.user.id },
        error: null,
      }),
    },
  };

  const res = await loginWithEmailOrUsername(mockClient, 'migue@test.com', '1234');
  assert.equal(res.session.user.id, fakeSession.user.id);
});

test('submitAuth en app.js llama a signInWithCampoBasePin y sincroniza con la nube cuando no hay PIN local', () => {
  assert.match(app, /signInWithCampoBasePin\(client,\s*userId\s*\|\|\s*'',\s*pin\)/);
  assert.match(app, /configureRealDatabase\(\)/);
  assert.match(app, /setBoundSaasUserId\(session\.user\.id\)/);
  assert.match(app, /await synchronizeCloud\(\)/);
});

test('PIN delegado sustituye la sesión owner por una identidad propia del mismo equipo',async()=>{
 const owner='11111111-2222-3333-4444-555555555555',delegate='99999999-8888-7777-6666-555555555555';
 let invoked=0;
 const delegatedSession={user:{id:delegate,app_metadata:{campobase_role:'delegate_pin',campobase_owner_id:owner}}};
 const client={auth:{getSession:async()=>({data:{session:{user:{id:owner}}}}),verifyOtp:async()=>({data:{session:delegatedSession}}),signOut:async()=>{}},functions:{invoke:async(name,{body})=>{invoked++;assert.equal(body.role,'delegate');assert.equal(body.user_id,owner);return {data:{token_hash:'opaque',type:'email',user_id:delegate,owner_user_id:owner}}}}};
 assert.equal((await signInWithCampoBasePin(client,owner,'0000','delegate')).user.id,delegate);
 assert.equal(invoked,1);
});
test('un endpoint que devuelve sesión de titular al pedir delegado se rechaza',async()=>{
 const owner='11111111-2222-3333-4444-555555555555';let disconnected=false;
 const client={auth:{getSession:async()=>({data:{session:null}}),verifyOtp:async()=>({data:{session:{user:{id:owner}}}}),signOut:async({scope})=>{disconnected=scope==='local'}},functions:{invoke:async()=>({data:{token_hash:'opaque',user_id:owner,owner_user_id:owner}})}};
 await assert.rejects(signInWithCampoBasePin(client,owner,'0000','delegate'),/no corresponde/);
 assert.equal(disconnected,true);
});
