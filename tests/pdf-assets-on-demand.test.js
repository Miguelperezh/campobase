import test from 'node:test';
import assert from 'node:assert/strict';
import { ensurePdfLibraries, generatePdfBlob } from '../js/print-session-export.js';

function browserFixture(t) {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const originalSetTimeout = globalThis.setTimeout;
  const scripts = [];
  const timers = new Map();
  let timerId = 0;
  const windowMock = {
    innerWidth: 1200,
    setTimeout(callback, delay) { timers.set(++timerId, { callback, delay }); return timerId; },
    clearTimeout(id) { timers.delete(id); },
  };
  const documentMock = {
    head: { appendChild(script) { scripts.push(script); } },
    createElement() { return { removed: false, remove() { this.removed = true; } }; },
    getElementById() { return null; },
    querySelector() { return null; },
    fonts: { ready: Promise.resolve() },
  };
  Object.defineProperty(globalThis, 'window', { configurable: true, value: windowMock });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: documentMock });
  // The existing canvas watchdog should not keep this unit-test process alive.
  globalThis.setTimeout = (...args) => { const timer = originalSetTimeout(...args); timer.unref?.(); return timer; };
  t.after(() => {
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow); else delete globalThis.window;
    if (originalDocument) Object.defineProperty(globalThis, 'document', originalDocument); else delete globalThis.document;
    globalThis.setTimeout = originalSetTimeout;
  });
  return { window: windowMock, document: documentMock, scripts, timers };
}

function finishLibraries(fixture) {
  for (const script of fixture.scripts) {
    if (!script.onload) continue;
    if (script.src.includes('html2canvas')) fixture.window.html2canvas = async () => ({});
    else fixture.window.jspdf = { jsPDF: function jsPDF() {} };
    script.onload();
  }
}

test('PDF assets load once across concurrent actions and duplicate module URLs', async (t) => {
  const fixture = browserFixture(t);
  const secondModule = await import('../js/print-session-export.js?on-demand-concurrency-test');
  const first = ensurePdfLibraries();
  const second = secondModule.ensurePdfLibraries();
  const third = ensurePdfLibraries();
  assert.deepEqual(fixture.scripts.map((script) => script.src), ['./vendor/html2canvas.min.js', './vendor/jspdf.umd.min.js']);
  assert.ok(fixture.scripts.every((script) => script.async));
  finishLibraries(fixture);
  assert.deepEqual(await Promise.all([first, second, third]), [true, true, true]);
  assert.equal(await ensurePdfLibraries(), true);
  assert.equal(fixture.scripts.length, 2);
  assert.equal(fixture.timers.size, 0);
});

test('PDF asset network failure keeps the successful asset and permits retry', async (t) => {
  const fixture = browserFixture(t);
  const pending = ensurePdfLibraries();
  fixture.scripts[0].onerror();
  fixture.window.jspdf = { jsPDF: function jsPDF() {} };
  fixture.scripts[1].onload();
  assert.equal(await pending, false);
  assert.equal(fixture.scripts[0].removed, true);
  assert.equal(fixture.scripts[1].removed, false);
  assert.equal(fixture.window.__campobasePdfLibrariesPromise, null);
  const retry = ensurePdfLibraries();
  assert.equal(fixture.scripts.length, 3);
  assert.equal(fixture.scripts[2].src, './vendor/html2canvas.min.js');
  finishLibraries(fixture);
  assert.equal(await retry, true);
});

test('PDF asset timeout is bounded and a late callback cannot break the next attempt', async (t) => {
  const fixture = browserFixture(t);
  const pending = ensurePdfLibraries();
  const lateLoad = fixture.scripts[0].onload;
  assert.ok([...fixture.timers.values()].every(({ delay }) => delay === 10000));
  for (const { callback } of [...fixture.timers.values()]) callback();
  assert.equal(await pending, false);
  assert.ok(fixture.scripts.every((script) => script.removed));
  const retry = ensurePdfLibraries();
  const activePromise = fixture.window.__campobasePdfLibrariesPromise;
  lateLoad();
  assert.equal(fixture.window.__campobasePdfLibrariesPromise, activePromise);
  finishLibraries(fixture);
  assert.equal(await retry, true);
  assert.equal(fixture.scripts.length, 4);
});

function printFixture(fixture) {
  const blob = new Blob(['%PDF-1.3 test'], { type: 'application/pdf' });
  const calls = [];
  const page = {};
  const element = {
    querySelectorAll(selector) { return selector === '.cb-print-page' ? [page] : []; },
    querySelector() { return null; },
  };
  fixture.window.html2canvas = async (target, options) => {
    calls.push({ target, options });
    return { width: 794, height: 1123, toDataURL: () => 'data:image/jpeg;base64,dGVzdA==' };
  };
  fixture.window.jspdf = { jsPDF: class {
    constructor(options) { calls.push({ pdfOptions: options }); }
    addImage() {}
    output() { return blob; }
  } };
  return { blob, element, calls };
}

test('PDF waits for the deferred stylesheet and chosen fonts only when exporting', async (t) => {
  const fixture = browserFixture(t);
  const print = printFixture(fixture);
  const link = new EventTarget();
  link.dataset = { fontStatus: 'loading' };
  fixture.document.getElementById = (id) => id === 'campobase-fonts' ? link : null;
  let resolveFonts;
  fixture.document.fonts.ready = new Promise((resolve) => { resolveFonts = resolve; });
  const pending = generatePdfBlob(print.element);
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(print.calls.length, 0);
  link.dataset.fontStatus = 'ready';
  link.dispatchEvent(new Event('load'));
  await Promise.resolve();
  assert.equal(print.calls.length, 0);
  resolveFonts();
  assert.equal(await pending, print.blob);
  assert.equal(print.calls[1].options.scale, 2);
  assert.equal(print.calls[1].options.backgroundColor, '#ffffff');
  assert.equal(fixture.scripts.length, 0);
  assert.equal(fixture.timers.size, 0);
});

test('unavailable fonts do not leave PDF export blocked indefinitely', async (t) => {
  const fixture = browserFixture(t);
  const print = printFixture(fixture);
  const link = new EventTarget();
  link.dataset = { fontStatus: 'loading' };
  fixture.document.getElementById = () => link;
  fixture.document.fonts.ready = new Promise(() => {});
  const pending = generatePdfBlob(print.element);
  await Promise.resolve();
  const fontTimer = [...fixture.timers.values()].find(({ delay }) => delay === 8000);
  assert.ok(fontTimer);
  fontTimer.callback();
  assert.equal(await pending, print.blob);
  assert.equal(print.calls.length, 2);
});

test('PDF font stylesheet rejection still exports with fonts already available', async (t) => {
  const fixture = browserFixture(t);
  const print = printFixture(fixture);
  const link = new EventTarget();
  link.dataset = { fontStatus: 'loading' };
  fixture.document.getElementById = () => link;
  const pending = generatePdfBlob(print.element);
  await Promise.resolve();
  link.dataset.fontStatus = 'error';
  link.dispatchEvent(new Event('error'));
  assert.equal(await pending, print.blob);
  assert.equal(fixture.timers.size, 0);
});
