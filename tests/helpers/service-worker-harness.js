import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../../sw.js', import.meta.url), 'utf8');
export const scope = 'https://app.test/campobase/';

export function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

export function workerHarness({ fetch: fetcher = () => Promise.reject(new Error('offline')), online = true } = {}) {
  const listeners = new Map();
  const stores = new Map();
  const calls = [];
  const deleted = [];
  let skipped = 0, claimed = 0, updates = 0;
  const absolute = key => new URL(typeof key === 'string' ? key : key.url, scope).href;
  const storage = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const entries = stores.get(name);
      return {
        async match(key) { return entries.get(absolute(key))?.clone(); },
        async put(key, response) {
          if (storage.failPut?.(name, absolute(key))) throw new Error('quota');
          entries.set(absolute(key), response.clone());
        },
        async keys() { return [...entries.keys()].map(key => new Request(key)); },
        async delete(key) { return entries.delete(absolute(key)); },
      };
    },
    async keys() { return [...stores.keys()]; },
    async delete(name) { deleted.push(name); return stores.delete(name); },
    match() { throw new Error('A global cache lookup can mix builds'); },
  };
  const self = {
    location: new URL('sw.js', scope),
    navigator: { onLine: online },
    registration: { async update() { updates++; } },
    clients: { async claim() { claimed++; } },
    async skipWaiting() { skipped++; },
    addEventListener(type, handler) { listeners.set(type, handler); },
  };
  const context = vm.createContext({
    URL, Request, Response, Headers, Uint8Array, atob, console, self, caches: storage,
    fetch(input, options) {
      calls.push({ url: absolute(input), options });
      return fetcher(input, options);
    },
  });
  vm.runInContext(source, context, { filename: 'sw.js' });
  const read = expression => vm.runInContext(expression, context);
  const request = (path, { navigation = false, method = 'GET', headers = {} } = {}) => {
    const native = new Request(absolute(path), { method, headers });
    return navigation ? { url: native.url, method, mode: 'navigate', headers: native.headers } : native;
  };
  function dispatchFetch(path, options) {
    let response;
    const pending = [];
    listeners.get('fetch')({
      request: request(path, options),
      respondWith(value) { response = Promise.resolve(value); },
      waitUntil(value) { pending.push(Promise.resolve(value)); },
    });
    return { response, done: () => Promise.all(pending) };
  }
  async function dispatchLifecycle(type) {
    const pending = [];
    listeners.get(type)({ waitUntil(value) { pending.push(Promise.resolve(value)); } });
    await Promise.all(pending);
  }
  return {
    read, self, storage, stores, calls, deleted, dispatchFetch, dispatchLifecycle,
    cacheName: read('CACHE'), mediaCacheName: read('MEDIA_CACHE'), build: read('BUILD'),
    counts: () => ({ skipped, claimed, updates }),
    async put(name, path, text, init) { await (await storage.open(name)).put(absolute(path), new Response(text, init)); },
    async match(name, path) { return (await storage.open(name)).match(absolute(path)); },
  };
}

export async function withoutWaitingForNetwork(promise) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Cached UI waited for the held network')), 500); }),
    ]);
  } finally { clearTimeout(timer); }
}
