import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { deferred, scope, workerHarness, withoutWaitingForNetwork } from './helpers/service-worker-harness.js';

test('warm HTML and modules open from the active build while mobile network is held', async () => {
  const held = deferred();
  const worker = workerHarness({ fetch: () => held.promise });
  for (const path of ['index.html', `js/app.js?v=${worker.build}`, 'js/domain.js']) {
    await worker.put(worker.cacheName, path, 'active build: ' + path);
    await worker.put('installing-partial-build', path, 'wrong partial build');
    await worker.put('old-campobase-v2.1', path, 'wrong old build');
  }
  for (const [path, navigation] of [['?pin=private', true], [`js/app.js?v=${worker.build}`, false], ['js/domain.js', false]]) {
    const event = worker.dispatchFetch(path, { navigation });
    const response = await withoutWaitingForNetwork(event.response);
    assert.match(await response.text(), /^active build:/);
    await event.done();
  }
  assert.equal(worker.calls.length, 0, 'No validation fetch belongs on the cached UI path');
});

test('cache misses never fall back to old or partial build code, or return HTML as JS', async () => {
  const worker = workerHarness();
  for (const path of ['index.html', 'js/app.js?v=old']) {
    await worker.put('old-campobase-v2.1', path, 'old content');
    await worker.put('installing-partial-build', path, 'partial content');
    const response = await worker.dispatchFetch(path, { navigation: path.endsWith('.html') }).response;
    assert.equal(response.status, 503);
    assert.match(response.headers.get('Content-Type'), /^text\/plain/);
    assert.doesNotMatch(await response.text(), /old content|partial content|<html>/);
  }
});

test('missing HTML cannot mix a new page above an old active module cache', async () => {
  const worker = workerHarness({ fetch: async () => new Response("<html><script>window.__CAMPOBASE_BUILD = 'different-build'</script></html>") });
  const event = worker.dispatchFetch('./', { navigation: true });
  assert.equal((await event.response).status, 503);
  await event.done();
  assert.equal(worker.counts().updates, 1);
  assert.equal(await worker.match(worker.cacheName, 'index.html'), undefined);
});

test('a matching missing page can recover online without storing navigation PIN or invite queries', async () => {
  let worker;
  worker = workerHarness({ fetch: async () => new Response(`<script>window.__CAMPOBASE_BUILD = '${worker.build}'</script>`) });
  const event = worker.dispatchFetch('./?pin=private&delegateInvite=secret', { navigation: true });
  assert.equal((await event.response).status, 200);
  await event.done();
  const keys = await (await worker.storage.open(worker.cacheName)).keys();
  assert.deepEqual(keys.map(key => key.url), [scope + 'index.html']);
});

test('installation downloads each physical path once with at most three concurrent requests and fills aliases', async () => {
  let worker, active = 0, maximum = 0;
  worker = workerHarness({ fetch: async input => {
    active++;
    maximum = Math.max(maximum, active);
    await new Promise(resolve => setTimeout(resolve, 1));
    active--;
    const path = new URL(typeof input === 'string' ? input : input.url).pathname;
    return new Response(path.endsWith('/index.html') ? `<script>window.__CAMPOBASE_BUILD = '${worker.build}'</script>` : path);
  } });
  await worker.dispatchLifecycle('install');
  const paths = worker.calls.map(call => new URL(call.url).pathname);
  assert.equal(new Set(paths).size, paths.length);
  assert.equal(paths.filter(path => path.endsWith('/js/app.js')).length, 1);
  assert.equal(maximum, 3);
  assert.equal(worker.counts().skipped, 1);
  assert.ok(worker.calls.every(call => call.options.cache === 'reload' && call.options.priority === 'low'));
  for (const group of worker.read('precacheGroups()')) {
    for (const alias of group.aliases) {
      const cached = await worker.match(group.media ? worker.mediaCacheName : worker.cacheName, alias);
      assert.ok(cached, `Offline alias missing: ${alias}`);
    }
  }
  assert.ok(await worker.match(worker.cacheName, './'));
  assert.ok(await worker.match(worker.cacheName, 'index.html'));
});

for (const failure of ['missing module', 'different index build']) {
  test(`incomplete installation keeps the usable old worker: ${failure}`, async () => {
    let worker;
    worker = workerHarness({ fetch: async input => {
      const path = new URL(typeof input === 'string' ? input : input.url).pathname;
      if (path.endsWith('/js/domain.js') && failure === 'missing module') return new Response('', { status: 503 });
      return new Response(path.endsWith('/index.html') ? `<script>window.__CAMPOBASE_BUILD = '${failure === 'different index build' ? 'other' : worker.build}'</script>` : path);
    } });
    await worker.put('old-campobase-v2.1', 'index.html', 'working old build');
    await assert.rejects(worker.dispatchLifecycle('install'), /actualización sigue pendiente/);
    assert.equal(worker.counts().skipped, 0);
    assert.equal(await (await worker.match('old-campobase-v2.1', 'index.html')).text(), 'working old build');
    assert.deepEqual(worker.deleted, []);
  });
}

test('activation preserves used media while retiring only this app own legacy shell', async () => {
  const worker = workerHarness();
  await worker.put('old-campobase-v2.1', 'library-v2/assets/previews/used.png', 'cover');
  await worker.put('old-campobase-v2.1', 'js/app.js', 'old code');
  await worker.put('unrelated-site-cache', 'other/icon.png', 'another app');
  await worker.dispatchLifecycle('activate');
  assert.equal(await (await worker.match(worker.mediaCacheName, 'library-v2/assets/previews/used.png')).text(), 'cover');
  assert.equal(await worker.match(worker.cacheName, 'js/app.js'), undefined);
  assert.deepEqual(worker.deleted, ['old-campobase-v2.1']);
  assert.ok(worker.stores.has('unrelated-site-cache'));
  assert.equal(worker.counts().claimed, 1);
});

test('activation never removes shared caches or a media copy that failed its handoff', async () => {
  const worker = workerHarness();
  await worker.put('shared-campobase-v2.1', 'https://app.test/another-app/image.png', 'other scope');
  await worker.put('shared-campobase-v2.1', 'icons/shared.png', 'shared own cover');
  await worker.put('old-campobase-v2.2', 'icons/quota.png', 'retained cover');
  worker.storage.failPut = (name, url) => name === worker.mediaCacheName && url.endsWith('/quota.png');
  await worker.dispatchLifecycle('activate');
  assert.ok(worker.stores.has('shared-campobase-v2.1'));
  assert.ok(worker.stores.has('old-campobase-v2.2'));
  const event = worker.dispatchFetch('icons/quota.png');
  assert.equal(await (await withoutWaitingForNetwork(event.response)).text(), 'retained cover');
  await event.done();
});

test('stale covers stay immediately usable; background refresh is bounded to one active plus four queued', async () => {
  const held = deferred();
  const worker = workerHarness({ fetch: () => held.promise });
  const events = [];
  for (let index = 0; index < 10; index++) {
    await worker.put(worker.mediaCacheName, `library-v2/assets/previews/${index}.png`, `cover-${index}`);
    const event = worker.dispatchFetch(`library-v2/assets/previews/${index}.png`);
    assert.equal(await (await withoutWaitingForNetwork(event.response)).text(), `cover-${index}`);
    events.push(event);
  }
  assert.equal(worker.calls.length, 1);
  assert.equal(worker.read('mediaRefreshQueue.length'), 4);
  assert.equal(worker.read('mediaRefreshPending.size'), 5);
  held.reject(new Error('mobile network failed'));
  await Promise.all(events.map(event => event.done()));
  assert.equal(worker.calls.length, 5);
  assert.equal(await (await worker.match(worker.mediaCacheName, 'library-v2/assets/previews/0.png')).text(), 'cover-0');
  const again = worker.dispatchFetch('library-v2/assets/previews/0.png');
  assert.equal((await again.response).status, 200);
  await again.done();
  assert.equal(worker.calls.length, 5, 'A failed mobile refresh must not retry on each render');
});

test('concurrent requests deduplicate a stale image refresh and retain its HTTP encoding headers', async () => {
  const held = deferred();
  const worker = workerHarness({ fetch: () => held.promise });
  await worker.put(worker.mediaCacheName, 'icons/cover.svg', '<svg/>', { headers: { 'Content-Encoding': 'gzip', 'Content-Type': 'image/svg+xml' } });
  const events = Array.from({ length: 4 }, () => worker.dispatchFetch('icons/cover.svg'));
  for (const event of events) {
    const response = await withoutWaitingForNetwork(event.response);
    assert.equal(response.headers.get('Content-Encoding'), 'gzip');
    assert.equal(await response.text(), '<svg/>');
  }
  assert.equal(worker.calls.length, 1);
  held.resolve(new Response('new svg', { headers: { 'Content-Type': 'image/svg+xml' } }));
  await Promise.all(events.map(event => event.done()));
  assert.equal(await (await worker.match(worker.mediaCacheName, 'icons/cover.svg')).text(), 'new svg');
});

test('offline covers and board fragments use the active cached build without any network request', async () => {
  const worker = workerHarness({ online: false });
  const bytes = Buffer.from('offline exercise board');
  const encoded = bytes.toString('base64');
  const parts = Array.from(worker.read('BOARD_PARTS'));
  for (let index = 0; index < parts.length; index++) {
    const start = Math.floor(encoded.length * index / parts.length);
    const end = Math.floor(encoded.length * (index + 1) / parts.length);
    await worker.put(worker.cacheName, parts[index], encoded.slice(start, end));
    await worker.put('partial-campobase-v2.1', parts[index], 'invalid');
  }
  await worker.put(worker.mediaCacheName, 'icons/offline.png', 'offline cover');
  const board = await withoutWaitingForNetwork(worker.dispatchFetch('assets/exercise-board.html.gz').response);
  assert.equal(board.headers.get('Content-Type'), 'application/gzip');
  assert.deepEqual(Buffer.from(await board.arrayBuffer()), bytes);
  const media = worker.dispatchFetch('icons/offline.png');
  assert.equal(await (await media.response).text(), 'offline cover');
  await media.done();
  assert.equal(worker.calls.length, 0);
});

test('requests for account data, another scope, writes and Authorization bypass the asset worker', () => {
  const worker = workerHarness();
  for (const [path, options] of [
    ['api/team', {}], ['https://app.test/another-app/index.html', { navigation: true }],
    ['https://supabase.test/api/data.json', {}], ['js/app.js', { method: 'POST' }],
    ['api/private.json', { headers: { Authorization: 'Bearer test' } }],
  ]) assert.equal(worker.dispatchFetch(path, options).response, undefined);
  assert.equal(worker.calls.length, 0);
});

test('every precached path exists and new-format static exercise dependencies are available offline', () => {
  const worker = workerHarness();
  const assets = Array.from(worker.read('ASSETS'));
  const paths = new Set(assets.map(path => new URL(path, scope).pathname.replace('/campobase/', '')));
  for (const path of paths) assert.ok(existsSync(new URL('../' + (path || 'index.html'), import.meta.url)), `Missing local path: ${path}`);
  const module = readFileSync(new URL('../js/ejercicios-nuevo-formato.js', import.meta.url), 'utf8');
  for (const [, specifier] of module.matchAll(/from\s*['"]([^'"]+)['"]/g)) {
    const path = new URL(specifier, scope + 'js/ejercicios-nuevo-formato.js').pathname.replace('/campobase/', '');
    assert.ok(paths.has(path), `Exercise dependency missing offline: ${path}`);
  }
  for (const path of ['js/training-domain-base.js', 'js/staff-card-layout-fix.js', 'js/print-match-visual.js']) assert.ok(paths.has(path));
});

test('an evicted build module recovers only when the published HTML matches this worker', async () => {
  for (const matches of [true, false]) {
    let worker;
    worker = workerHarness({ fetch: async input => {
      const path = new URL(typeof input === 'string' ? input : input.url).pathname;
      if (path.endsWith('index.html')) return new Response(`<script>window.__CAMPOBASE_BUILD = '${matches ? worker.build : 'next-build'}'</script>`);
      return new Response('export const recovered = true');
    } });
    const event = worker.dispatchFetch('js/domain.js');
    const response = await event.response;
    assert.equal(response.status, matches ? 200 : 503);
    await event.done();
    assert.equal(Boolean(await worker.match(worker.cacheName, 'js/domain.js')), matches);
  }
});
