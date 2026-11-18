import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const updater = html.match(/<script>\s*(\/\/ CampoBase background worker updater\.[\s\S]*?)<\/script>/)?.[1];
assert.ok(updater);
function harness({ controlled = true, hostname = 'campobase.test', role = null, dialog = false, ready = false, preview = false } = {}) {
  const timeouts = new Map(), intervals = new Map(), idle = [], events = {}, saved = new Map();
  const calls = { register: 0, reload: 0 };
  let id = 0;
  const context = {
    URL, window: { __campobase: { state: { dataLoaded: ready, role } }, __CAMPOBASE_READONLY_PREVIEW: preview },
    navigator: { serviceWorker: { controller: controlled ? {} : null,
      getRegistration: async () => undefined, register: async () => { calls.register++; return {}; }, addEventListener: (event, callback) => { events[event] = callback; } } },
    location: { hostname, href: `https://${hostname}/team/`, reload: () => { calls.reload++; } },
    document: { querySelector: (selector) => selector.startsWith('dialog') ? (dialog ? {} : null) : { id: 'hoy' } },
    sessionStorage: { getItem: (key) => saved.get(key), setItem: (key, value) => saved.set(key, value) },
    setTimeout: (callback, ms) => { timeouts.set(++id, { callback, ms }); return id; },
    clearTimeout: (key) => timeouts.delete(key),
    setInterval: (callback, ms) => { intervals.set(++id, { callback, ms }); return id; },
    clearInterval: (key) => intervals.delete(key),
  };
  context.window.requestIdleCallback = (callback) => idle.push(callback);
  vm.runInNewContext(updater, context);
  return { ...context, calls, events, saved, idle, timeouts, intervals };
}
test('worker installation waits for local data and browser idle, only once', async () => {
  const h = harness();
  assert.equal(h.calls.register, 0);
  for (const timer of h.intervals.values()) timer.callback();
  assert.equal(h.idle.length, 0);
  h.window.__campobase.state.dataLoaded = true;
  for (const timer of [...h.intervals.values()]) timer.callback();
  assert.equal(h.calls.register, 0);
  h.idle[0](); h.idle[0]();
  await Promise.resolve();
  assert.equal(h.calls.register, 1);
  assert.equal(h.timeouts.size, 0);
  assert.equal(h.intervals.size, 0);
});
test('emergency worker check survives a failed app startup', async () => {
  const h = harness();
  const fallback = [...h.timeouts.values()].find((timer) => timer.ms === 8000);
  fallback.callback(); await Promise.resolve(); await Promise.resolve();
  assert.equal(h.calls.register, 1);
});
test('first installation keeps the page instead of restarting startup', () => {
  const h = harness({ controlled: false }); h.events.controllerchange();
  assert.equal(h.calls.reload, 0);
});
test('an active owner or delegate keeps unsaved forms and live state during updates', () => {
  for (const role of ['owner', 'delegate']) {
    const h = harness({ role }); h.events.controllerchange();
    assert.equal(h.calls.reload, 0);
  }
  const editing = harness({ dialog: true }); editing.events.controllerchange();
  assert.equal(editing.calls.reload, 0);
});
test('a locked outdated shell reloads once while retaining its active view', () => {
  const h = harness(); h.events.controllerchange(); h.events.controllerchange();
  assert.equal(h.calls.reload, 1);
  assert.equal(h.saved.get('campobase.activeView'), 'hoy');
});
test('read-only and local previews do not install a worker', () => {
  for (const options of [{ preview: true }, { hostname: 'localhost' }, { hostname: '127.0.0.1' }]) {
    const h = harness(options);
    assert.equal(h.window.__CAMPOBASE_SW_UPDATE_SCHEDULED, undefined);
    assert.equal(h.timeouts.size, 0);
  }
});
