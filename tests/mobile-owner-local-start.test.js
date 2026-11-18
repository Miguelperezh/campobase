import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { hashPin, verifyPin } from '../js/domain.js';
import { hasUsableTeamSnapshot } from '../js/training-session-status.js';

const appSource = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const authSource = readFileSync(new URL('../js/saas-auth-ui-v2.js', import.meta.url), 'utf8');
const guardSource = readFileSync(new URL('../js/saas-session-guard.js', import.meta.url), 'utf8');
const functionSource = (source, name, next) => source.slice(source.indexOf(`async function ${name}(`), source.indexOf(`async function ${next}(`));
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
const nextTurn = () => new Promise(resolve => setImmediate(resolve));
const owner = '11111111-2222-3333-4444-555555555555';
const other = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

async function pinHarness() {
  const sdk = deferred(), authentication = deferred(), cloud = deferred();
  const events = [], values = new Map();
  const account = { bound: owner, revision: 1, database: `campobase_${owner}`, currentView: true, pinMode: false, locked: false };
  const state = { role: null, delegateMode: false, dataLoaded: true, players: [{ id: 'synthetic-player' }],
    settings: { pinSalt: 'synthetic-salt', ownerPinHash: await hashPin('2468', 'synthetic-salt') } };
  const dialog = { open: true, close() { this.open = false; events.push('close'); } };
  const context = { state, navigator: { onLine: true }, console: { warn() { events.push('background-error'); } },
    getBoundSaasUserId: () => account.bound, setBoundSaasUserId: id => { account.bound = id; events.push('bind'); },
    getRememberedSaasAccount: () => null, beginPinAccess: () => { account.pinMode = true; account.locked = true; return ++account.revision; },
    getPinAccessRevision: () => account.revision, finishPinAccess: revision => { if (revision !== account.revision) return false; account.locked = false; return true; },
    isPinAccessSession: () => account.pinMode, isPinAccessLocked: () => account.locked,
    currentDatabaseName: () => account.database, viewAccountIsCurrent: () => account.currentView,
    getOne: async () => ({ ...state.settings }), hasUsableTeamSnapshot, verifyPin, getSupabaseAuthClient: () => ({}),
    getCurrentSession: () => { events.push('sdk'); return sdk.promise; },
    signInWithCampoBasePin: () => { events.push('authenticate'); return authentication.promise; },
    localStorage: { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) },
    sessionStorage: { setItem() {} }, configureRealDatabase: () => events.push('configure'),
    synchronizeCloud: () => { events.push('cloud'); return cloud.promise; },
    refresh: async () => events.push('refresh'), renderAll: () => events.push('render'),
    applyRole: role => { state.role = role; events.push(role); }, $: () => dialog };
  vm.createContext(context);
  vm.runInContext(functionSource(appSource, 'completePinLogin', 'getConfiguredPinRole'), context);
  return { context, state, account, values, events, sdk, authentication, cloud, dialog };
}

test('the bound owner opens the loaded account after hashing the PIN while SDK refresh remains suspended', async () => {
  const h = await pinHarness(), hashing = deferred();
  h.context.verifyPin = () => hashing.promise;
  const result = h.context.completePinLogin('owner', '2468', owner);
  await nextTurn(); assert.deepEqual(h.events, []); assert.equal(h.dialog.open, true);
  hashing.resolve(true); await result;
  assert.deepEqual(h.events, ['configure', 'owner', 'close', 'render', 'sdk']);
  assert.equal(h.state.role, 'owner'); assert.equal(h.dialog.open, false);
  h.sdk.resolve({ user: { id: owner } }); await nextTurn();
  assert.equal(h.events.at(-1), 'cloud');
  h.cloud.resolve(); await nextTurn();
  assert.deepEqual(h.events, ['configure', 'owner', 'close', 'render', 'sdk', 'cloud']);
  assert.equal(h.account.bound, owner); assert.equal(h.events.includes('bind'), false);
});

test('a wrong owner PIN never reveals the snapshot or invokes the SDK', async () => {
  const h = await pinHarness();
  await assert.rejects(h.context.completePinLogin('owner', '2469', owner), /validar el PIN/);
  assert.deepEqual(h.events, []); assert.equal(h.dialog.open, true); assert.equal(h.state.role, null);
});

test('hash verification cannot finish against a changed account, PIN revision, snapshot or configured hash', async () => {
  for (const change of [h => { h.account.bound = other; }, h => { h.account.revision++; },
    h => { h.account.currentView = false; }, h => { h.account.database = `campobase_${other}`; },
    h => { h.state.settings.ownerPinHash = 'new-hash'; }]) {
    const h = await pinHarness(), hashing = deferred(); h.context.verifyPin = () => hashing.promise;
    const result = h.context.completePinLogin('owner', '2468', owner); change(h); hashing.resolve(true);
    await assert.rejects(result, error => error.code === 'CAMPOBASE_CONTEXT_CHANGED');
    assert.deepEqual(h.events, []); assert.equal(h.dialog.open, true);
  }
});

test('delegates, account mismatches, legacy copies and unloaded snapshots still wait for remote authentication', async () => {
  for (const change of [h => { h.state.role = 'delegate'; }, h => { h.state.delegateMode = true; },
    h => { h.values.set('campobase.lastAuthRole', 'delegate'); }, h => { h.account.database = 'campobase'; },
    h => { h.account.currentView = false; }, h => { h.state.dataLoaded = false; },
    h => { h.account.bound = ''; }, h => { h.state.settings.ownerPinHash = ''; }]) {
    const h = await pinHarness(); change(h);
    const result = h.context.completePinLogin('owner', '2468', owner);
    await nextTurn(); assert.deepEqual(h.events, ['sdk']); assert.equal(h.dialog.open, true);
    h.account.revision++; h.sdk.resolve(null);
    await assert.rejects(result, error => error.code === 'CAMPOBASE_CONTEXT_CHANGED');
  }
  const h = await pinHarness();
  const result = h.context.completePinLogin('delegate', '0000', owner);
  await nextTurn(); assert.deepEqual(h.events, ['sdk']); assert.equal(h.dialog.open, true);
  h.account.revision++; h.sdk.resolve(null);
  await assert.rejects(result, error => error.code === 'CAMPOBASE_CONTEXT_CHANGED');
});

test('background SDK results for another identity or delegate never rebind or synchronize the owner copy', async () => {
  for (const session of [{ user: { id: other } }, { user: { id: owner, app_metadata: { campobase_role: 'delegate_pin' } } }]) {
    const h = await pinHarness(); await h.context.completePinLogin('owner', '2468', owner);
    h.sdk.resolve(session); await nextTurn();
    assert.equal(h.account.bound, owner); assert.equal(h.state.role, 'owner');
    assert.equal(h.events.includes('bind'), false); assert.equal(h.events.includes('cloud'), false);
    assert.equal(h.events.includes('authenticate'), false);
  }
});

test('late background session, PIN and cloud responses stop after another PIN or account takes over', async () => {
  for (const phase of ['sdk', 'authenticate', 'cloud']) {
    const h = await pinHarness(); await h.context.completePinLogin('owner', '2468', owner);
    if (phase === 'authenticate') { h.sdk.resolve(null); await nextTurn(); }
    if (phase === 'cloud') { h.sdk.resolve({ user: { id: owner } }); await nextTurn(); }
    h.account.bound = other; h.account.database = `campobase_${other}`; h.account.revision++;
    h.events.length = 0;
    if (phase === 'sdk') h.sdk.resolve({ user: { id: owner } });
    else if (phase === 'authenticate') h.authentication.resolve({ user: { id: owner } });
    else h.cloud.resolve();
    await nextTurn(); assert.deepEqual(h.events, ['background-error']); assert.equal(h.account.bound, other);
  }
});

test('a mobile network error leaves the verified owner and all local records available', async () => {
  const h = await pinHarness(), original = JSON.stringify(h.state.players);
  await h.context.completePinLogin('owner', '2468', owner);
  h.sdk.reject(new Error('synthetic mobile timeout')); await nextTurn();
  assert.equal(h.state.role, 'owner'); assert.equal(h.dialog.open, false);
  assert.equal(JSON.stringify(h.state.players), original); assert.equal(h.events.includes('authenticate'), false);
});

test('a delayed SaaS restoration checks its original account and revision after every network boundary', async () => {
  for (const phase of ['session', 'profile', 'cloud']) for (const change of ['account', 'revision']) {
    const hold = deferred(), events = []; let bound = owner, revision = 2;
    const dialog = { open: true, close() { this.open = false; events.push('close'); } };
    const app = { state: { role: null }, synchronizeCloud: async () => { events.push('cloud'); if (phase === 'cloud') await hold.promise; },
      refresh: async () => events.push('refresh'), renderAll: () => events.push('render') };
    const context = { isPinAccessLocked: () => false, getPinAccessRevision: () => revision, getBoundSaasUserId: () => bound,
      getCurrentSession: async () => { if (phase === 'session') await hold.promise; return { user: { id: owner } }; },
      getProfileOrFallback: async () => { if (phase === 'profile') await hold.promise; return { role: 'coach' }; },
      markBrowserSessionActive() {}, waitForApp: async () => app, hasUsableTeamSnapshot: () => false,
      sessionStorage: { getItem: () => 'owner', setItem() {} }, navigator: { onLine: false }, $: () => dialog };
    vm.createContext(context); vm.runInContext(functionSource(authSource, 'unlockBoundSession', 'handlePersistentSession'), context);
    const result = context.unlockBoundSession({}); await nextTurn();
    if (change === 'account') bound = other; else revision++;
    hold.resolve(); assert.equal(await result, false); assert.equal(app.state.role, null); assert.equal(dialog.open, true);
    assert.deepEqual(events, phase === 'cloud' ? ['cloud'] : []);
  }
});

test('the session guard never clears a newer account or a newer PIN binding', async () => {
  for (const change of ['account', 'revision', 'unchanged']) {
    let bound = owner, revision = 3, clears = 0; const sdk = deferred();
    const context = { window: {}, document: {}, isPinAccessSession: () => false, isPinAccessLocked: () => false, getBoundSaasUserId: () => bound,
      getPinAccessRevision: () => revision, getCurrentSession: () => sdk.promise,
      clearBoundSaasUserId: () => { clears++; bound = ''; } };
    vm.createContext(context); vm.runInContext(guardSource.replace(/^import .*;\n/m, '').replace('export async function', 'async function'), context);
    const result = context.guardSaasSession({});
    if (change === 'account') bound = other; if (change === 'revision') revision++;
    sdk.resolve({ user: { id: other } }); await result;
    assert.equal(clears, change === 'unchanged' ? 1 : 0);
    if (change === 'account') assert.equal(bound, other);
  }
});

function installStartupUi(h) {
  Object.assign(h.context, {
    initialized: false, window: { __campobase: { state: h.state } }, document: { body: { classList: { remove() {}, add() {} } } },
    installStyles() {}, injectShell() {}, bindEvents() {}, prefillRememberedIdentifier() {}, observeDialog() {},
    clearBoundSaasUserId: () => { h.account.bound = ''; h.events.push('clear-bound'); },
    browserSessionIsActive: () => false, isUserAlreadyAuthenticated: () => Boolean(h.state.role),
    rememberedAccount: () => null, waitForApp: async () => ({ state: h.state }),
    unlockBoundSession: async () => { h.events.push('unlock-saas'); return true; },
    handlePersistentSession: async () => { h.events.push('persistent'); return true; },
    showLocalPin: () => h.events.push('show-local-pin'), showPane: () => h.events.push('show-login'),
    showRememberedPane: () => h.events.push('show-remembered'),
  });
  h.context.sessionStorage.getItem = () => h.state.role;
  h.dialog.showModal = () => { h.dialog.open = true; h.events.push('reopen'); };
  vm.runInContext(guardSource.replace(/^import .*;\n/m, '').replace('export async function', 'async function'), h.context);
  h.context.waitForApp = async () => ({ state: h.state });
  const init = authSource.slice(authSource.indexOf('export async function initSaasAuth(')).replace('export async function', 'async function');
  vm.runInContext(init, h.context);
}

test('the complete guard → SaaS init chain cannot clear or reopen a PIN login completed while its SDK call waited', async () => {
  const h = await pinHarness(), oldGuardSession = deferred(); installStartupUi(h);
  let calls = 0;
  h.context.getCurrentSession = () => ++calls === 1 ? oldGuardSession.promise : h.sdk.promise;
  const startup = h.context.guardSaasSession({}).then(() => h.context.initSaasAuth({}));
  await h.context.completePinLogin('owner', '2468', owner);
  oldGuardSession.resolve({ user: { id: other } }); await nextTurn();
  h.sdk.resolve({ user: { id: other } }); await startup; await nextTurn();
  assert.equal(h.account.bound, owner); assert.equal(h.state.role, 'owner'); assert.equal(h.dialog.open, false);
  assert.equal(h.events.includes('clear-bound'), false); assert.equal(h.events.includes('show-login'), false);
  assert.equal(h.events.includes('reopen'), false);
});

test('SaaS init suspended before a PIN or account switch never changes the newer access', async () => {
  for (const change of ['pin', 'account']) {
    const h = await pinHarness(), oldInitSession = deferred(); installStartupUi(h);
    let calls = 0; h.context.getCurrentSession = () => ++calls === 1 ? oldInitSession.promise : h.sdk.promise;
    const startup = h.context.initSaasAuth({}); await nextTurn();
    if (change === 'pin') await h.context.completePinLogin('owner', '2468', owner);
    else { h.account.bound = other; h.account.revision++; }
    h.events.length = 0;
    oldInitSession.resolve({ user: { id: owner } }); await startup;
    assert.deepEqual(h.events, []); assert.equal(h.account.bound, change === 'pin' ? owner : other);
  }
});

test('a guard module downloaded after the verified PIN does not consult or replace the SDK identity', async () => {
  const h = await pinHarness(); installStartupUi(h);
  await h.context.completePinLogin('owner', '2468', owner);
  let sdkReads = 0; h.context.getCurrentSession = async () => { sdkReads++; return { user: { id: other } }; };
  await h.context.guardSaasSession({}); await h.context.initSaasAuth({});
  assert.equal(sdkReads, 0); assert.equal(h.account.bound, owner); assert.equal(h.dialog.open, false);
  assert.equal(h.events.includes('clear-bound'), false);
});

test('persistent-session hydration cannot resume against a newer account or PIN', async () => {
  for (const phase of ['session', 'app']) for (const change of ['account', 'pin']) {
    const h = await pinHarness(), pending = deferred(); installStartupUi(h);
    const context = h.context;
    context.sessionStorage.getItem = () => null;
    context.getCurrentSession = async () => { if (phase === 'session') await pending.promise; return { user: { id: owner } }; };
    context.waitForApp = async () => { if (phase === 'app') await pending.promise; return { state: h.state }; };
    context.markBrowserSessionActive = () => h.events.push('mark-active');
    const start = authSource.indexOf('async function handlePersistentSession('), end = authSource.indexOf('\nfunction wireRememberToggle(', start);
    vm.runInContext(authSource.slice(start, end), context);
    const result = context.handlePersistentSession({}); await nextTurn();
    if (change === 'account') h.account.bound = other; else h.account.revision++;
    h.events.length = 0; pending.resolve(); assert.equal(await result, true);
    assert.deepEqual(h.events, []); assert.equal(h.dialog.open, true);
  }
});

test('the dialog observer ignores stale success and error callbacks after a PIN closes the dialog', async () => {
  for (const rejected of [false, true]) {
    const h = await pinHarness(), pending = deferred(), callbacks = []; installStartupUi(h);
    const context = h.context;
    Object.assign(context, { localPinMode: false, recoveryMode: false,
      MutationObserver: class { observe() {} }, handlePersistentSession: () => pending.promise });
    context.window.setTimeout = fn => callbacks.push(fn);
    const start = authSource.indexOf('function observeDialog('), end = authSource.indexOf('\nexport async function initSaasAuth(', start);
    vm.runInContext(authSource.slice(start, end), context);
    context.observeDialog({}); const observation = callbacks[0]();
    h.account.revision++; h.state.role = 'owner'; h.dialog.open = false;
    h.events.length = 0;
    if (rejected) pending.reject(new Error('synthetic stale network error')); else pending.resolve(false);
    await observation; assert.deepEqual(h.events, []); assert.equal(h.dialog.open, false);
  }
});


test('a PIN loaded from another local candidate cannot reveal the bound team', async () => {
  const h = await pinHarness();
  h.context.getOne = async () => ({ pinSalt: 'other', ownerPinHash: 'other-hash' });
  await assert.rejects(h.context.completePinLogin('owner', '2468', owner), /validar el PIN/);
  assert.equal(h.state.role, null);
  assert.equal(h.dialog.open, true);
});
