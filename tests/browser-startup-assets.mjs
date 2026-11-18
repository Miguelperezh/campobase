import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';

const fallback = path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs');
const { chromium } = await import('playwright-core').catch(() => import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || fallback).href));

// All app and vendor responses come from this checkout. External services are
// blocked, and every browser context is fresh: no real account or storage is used.
const root = path.resolve(process.env.CAMPOBASE_PREVIEW_ROOT || '.');
const index = await fs.readFile(path.join(root, 'index.html'), 'utf8');
const fontLink = index.match(/<link id="campobase-fonts"[^>]*>/)?.[0];
assert.ok(fontLink, 'the configurable fonts must retain their canonical link');
assert.match(fontLink, /media="print"/);
assert.match(fontLink, /data-font-status="loading"/);
assert.match(index, /<noscript><link[^>]*fonts\.googleapis\.com/);
assert.doesNotMatch(index, /<script[^>]*src="[^\"]*vendor\/(?:html2canvas|jspdf)/);

const browser = await chromium.launch({
  executablePath: process.env.CAMPOBASE_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
try {
  const results = [];
  for (const historicalBlockingLink of [true, false]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    await context.addInitScript(() => Object.defineProperty(navigator, 'onLine', { get: () => false }));
    const vendorRequests = [];
    const pageErrors = [];
    let externalWrites = 0;
    let fontReleased = false;
    let fontRequests = 0;
    await context.route('**/*', async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.hostname === 'fonts.googleapis.com') {
        // The first stylesheet response is slow; the canvas clone can reuse it
        // afterwards, as it would from the browser cache in a normal export.
        if (++fontRequests === 1) await new Promise((resolve) => setTimeout(resolve, 5000));
        fontReleased = true;
        return route.fulfill({ status: 200, contentType: 'text/css', body: '/* Isolated, deliberately slow font response. */' }).catch(() => {});
      }
      if (url.hostname !== 'localhost') {
        if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method())) externalWrites++;
        return route.fulfill({ status: 503, body: '' });
      }
      const relative = decodeURIComponent(url.pathname).replace(/^\//, '') || 'index.html';
      const file = path.resolve(root, relative);
      if (!file.startsWith(root + path.sep)) return route.fulfill({ status: 404, body: '' });
      if (/^vendor\/(?:html2canvas|jspdf)/.test(relative)) vendorRequests.push(relative);
      try {
        let body = await fs.readFile(file);
        if (relative === 'index.html' && historicalBlockingLink) {
          body = Buffer.from(body.toString().replace(fontLink, fontLink.replace(' media="print"', '')));
        }
        return route.fulfill({
          status: 200,
          body,
          contentType: /\.m?js$/.test(file) ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream',
        });
      } catch { return route.fulfill({ status: 404, body: '' }); }
    });
    const page = await context.newPage();
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'warning') console.warn(message.text()); });
    await page.goto('https://localhost/index.html?startup-assets-test=1', { waitUntil: 'commit' });
    await page.waitForFunction(() => Boolean(window.__campobase?.state.dataLoaded), null, { timeout: 15000 });
    const appReadyMs = Math.round(await page.evaluate(() => performance.now()));
    assert.equal(fontReleased, historicalBlockingLink, 'app startup must not depend on the external font stylesheet');
    assert.equal(vendorRequests.length, 0, 'PDF libraries must not be requested during startup');

    let pdfBytes = 0;
    if (!historicalBlockingLink) {
      const loadResult = await page.evaluate(async () => {
        const pdf = await import('./js/print-session-export.js');
        const results = await Promise.all([pdf.ensurePdfLibraries(), pdf.ensurePdfLibraries()]);
        const actualCanvas = window.html2canvas;
        window.html2canvas = (...args) => {
          window.__pdfCaptureFontStatus = document.getElementById('campobase-fonts')?.dataset.fontStatus;
          return actualCanvas(...args);
        };
        const target = document.createElement('div');
        target.style.cssText = 'position:fixed;top:0;left:0;width:794px;background:white;color:black;font:16px Arial;z-index:999999';
        target.innerHTML = '<section class="cb-print-page" style="height:1123px;padding:24px"><h1>CampoBase · prueba aislada</h1><p>Impresión con librerías bajo demanda.</p></section>';
        document.body.appendChild(target);
        const blob = await pdf.generatePdfBlob(target);
        const result = { results, type: blob?.type, bytes: blob?.size, prefix: blob ? await blob.slice(0, 5).text() : '', fontStatus: window.__pdfCaptureFontStatus };
        target.remove();
        return result;
      });
      assert.deepEqual(loadResult.results, [true, true]);
      assert.deepEqual(vendorRequests.sort(), ['vendor/html2canvas.min.js', 'vendor/jspdf.umd.min.js']);
      assert.equal(loadResult.type, 'application/pdf');
      assert.equal(loadResult.prefix, '%PDF-');
      assert.equal(loadResult.fontStatus, 'ready', 'PDF capture must wait for the deferred font stylesheet');
      assert.ok(loadResult.bytes > 1000);
      pdfBytes = loadResult.bytes;
    }
    assert.deepEqual(pageErrors, []);
    assert.equal(externalWrites, 0);
    results.push({ historicalBlockingLink, delayedFontCssMs: 5000, appReadyMs, pdfVendorRequestsAtStartup: 0, pdfBytes, pageErrors, externalWrites });
    await context.close();
  }
  console.log(JSON.stringify({ startupAssets: results }, null, 2));
} finally { await browser.close(); }
