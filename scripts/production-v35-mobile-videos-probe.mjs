import { chromium, webkit, devices } from 'playwright';

const engine = process.env.ENGINE || 'chrome';
const expectedBuild = '20260922-pages-video-today-v35';
const ids = ['f7-082', 'f7-084'];

const browser = engine === 'webkit'
  ? await webkit.launch()
  : await chromium.launch({ channel: 'chrome' });

const device = engine === 'webkit' ? devices['iPhone 15'] : devices['Pixel 7'];
const context = await browser.newContext({ ...device });
const page = await context.newPage();

const errors = [];
page.on('pageerror', e => errors.push('pageerror:' + e.message));
page.on('console', m => { if (m.type() === 'error') errors.push('console:' + m.text()); });

await page.goto('https://miguelperezh.github.io/campobase/?prodV35Videos=1', {
  waitUntil: 'domcontentloaded',
  timeout: 60000,
});
await page.waitForFunction(() => Boolean(window.__campobase?.state), null, { timeout: 30000 });
await page.waitForTimeout(5000);

let role = await page.evaluate(() => window.__campobase?.state?.role || '');
if (role !== 'demo') {
  await page.evaluate(() => document.getElementById('auth-demo-btn')?.click());
  await page.waitForFunction(() => window.__campobase?.state?.role === 'demo', null, { timeout: 20000 });
}
await page.waitForTimeout(2500);
await page.evaluate(() => window.__campobase.showView('ejercicios'));

const build = await page.evaluate(() => ({
  build: window.__CAMPOBASE_BUILD || '',
  controlled: Boolean(navigator.serviceWorker?.controller),
  controller: navigator.serviceWorker?.controller?.scriptURL || '',
  ua: navigator.userAgent,
}));

const results = [];
for (const id of ids) {
  await page.waitForSelector(`[data-exercise-id="${id}"]`, { timeout: 30000 });
  await page.evaluate((exerciseId) => window.__campobase.showExerciseDetail(exerciseId), id);
  await page.waitForSelector('#exercise-detail-dialog[open] .frame-video', { timeout: 30000 });

  const before = await page.evaluate(() => {
    const v = document.querySelector('#exercise-detail-dialog[open] .frame-video');
    return { dataSrc: v?.dataset.src || '', src: v?.src || '' };
  });

  await page.evaluate(() => document.querySelector('#exercise-detail-dialog[open] .v-btn-play')?.click());
  await page.waitForTimeout(7000);

  const after = await page.evaluate(() => {
    const v = document.querySelector('#exercise-detail-dialog[open] .frame-video');
    return {
      dataSrc: v?.dataset.src || '',
      src: v?.src || '',
      currentSrc: v?.currentSrc || '',
      paused: v?.paused,
      currentTime: v?.currentTime,
      duration: v?.duration,
      readyState: v?.readyState,
      networkState: v?.networkState,
      error: v?.error ? { code: v.error.code, message: v.error.message } : null,
    };
  });

  results.push({ id, before, after });
  await page.evaluate(() => {
    const d = document.getElementById('exercise-detail-dialog');
    if (d?.open) d.close();
  });
  await page.waitForTimeout(300);
}

console.log(JSON.stringify({ engine, build, results, errors }, null, 2));
await browser.close();

if (build.build !== expectedBuild) process.exit(10);
for (const r of results) {
  const expected = `./assets/video-mobile/${r.id}.mp4`;
  if (r.before.dataSrc !== expected) process.exit(11);
  if (r.after.error || r.after.paused || Number(r.after.currentTime || 0) < 1) process.exit(12);
}
