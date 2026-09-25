import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';

const chrome = process.env.CHROME_BIN;
if (!chrome) throw new Error('CHROME_BIN no está definido.');

const server = spawn('python3', ['-m', 'http.server', '4173', '--bind', '127.0.0.1'], {
  stdio: ['ignore', 'ignore', 'inherit'],
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitServer() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const response = await fetch('http://127.0.0.1:4173/index.html', { cache: 'no-store' });
      if (response.ok) return;
    } catch {}
    await sleep(250);
  }
  throw new Error('El servidor de prueba no arrancó.');
}

const browserErrors = [];
let browser;

async function enterDemo(page) {
  await page.goto('http://127.0.0.1:4173/index.html?browserSmoke=1', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.__campobase?.state), null, { timeout: 20000 });

  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push('console: ' + message.text());
  });
  page.on('dialog', async (dialog) => {
    browserErrors.push('dialog: ' + dialog.message());
    await dialog.dismiss();
  });

  const isDemo = await page.evaluate(() => window.__campobase?.state?.role === 'demo');
  if (!isDemo) {
    await page.evaluate(() => document.getElementById('auth-demo-btn')?.click());
    await page.waitForFunction(() => window.__campobase?.state?.role === 'demo', null, { timeout: 20000 });
  }
}

async function testDesktop(page) {
  await enterDemo(page);

  // 2) Preparar partido: datos temporales solo en memoria demo.
  await page.evaluate(() => {
    const app = window.__campobase;
    const ids = Array.from({ length: 9 }, (_, index) => 'smoke-player-' + (index + 1));
    app.state.players = ids.map((id, index) => ({
      id,
      name: 'Jugador Smoke ' + (index + 1),
      number: String(index + 1),
      positions: index < 2 ? ['POR'] : ['MC'],
      active: true,
    }));
    app.state.matches = [{
      id: 'smoke-match',
      opponent: 'Rival Smoke',
      date: '2099-01-01T09:00:00',
      venue: 'home',
      status: 'scheduled',
      type: 'friendly',
      format: 'F7',
      callupId: 'smoke-callup',
    }];
    app.state.callups = [{
      id: 'smoke-callup',
      matchId: 'smoke-match',
      availableIds: ids,
      selectedIds: ids,
      format: 'F7',
      exclusions: [],
    }];
    app.state.timer = null;
    app.renderAll();
    app.showView('partido');
  });

  await page.waitForSelector('#live-select');
  await page.selectOption('#live-select', 'smoke-match');
  await page.evaluate(() => {
    document.getElementById('live-select')?.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForFunction(() => {
    const a = document.getElementById('first-keeper');
    const b = document.getElementById('second-keeper');
    return a && b && !a.disabled && !b.disabled;
  });
  await page.selectOption('#first-keeper', 'smoke-player-1');
  await page.selectOption('#second-keeper', 'smoke-player-2');
  await page.click('#prepare-live');
  await page.waitForFunction(() => window.__campobase?.state?.timer?.phase === 'ready', null, { timeout: 10000 });

  // 3) + Ejercicio abre realmente.
  await page.evaluate(() => window.__campobase.showView('ejercicios'));
  await page.waitForSelector('#new-exercise');
  await page.click('#new-exercise');
  await page.waitForFunction(() => {
    const overlay = document.querySelector('.exercise-board-overlay');
    const dialog = document.getElementById('exercise-dialog');
    return Boolean(overlay?.classList.contains('open') || dialog?.open);
  }, null, { timeout: 10000 });

  // 4) Guardado real por el mismo canal de mensajes del creador.
  const saved = await page.evaluate(() => new Promise((resolve, reject) => {
    const requestId = 'browser-smoke-save';
    const timeout = setTimeout(() => {
      window.removeEventListener('message', onMessage);
      reject(new Error('No llegó confirmación de guardado del ejercicio.'));
    }, 10000);
    function onMessage(event) {
      if (event.data?.type !== 'campobase:exercise-persisted' || event.data?.requestId !== requestId) return;
      clearTimeout(timeout);
      window.removeEventListener('message', onMessage);
      resolve(event.data.exercise?.id || '');
    }
    window.addEventListener('message', onMessage);
    window.postMessage({
      type: 'campobase:persist-exercise',
      requestId,
      exercise: {
        id: 'browser-smoke-exercise',
        name: 'Ejercicio Smoke Browser',
        objective: 'Validar persistencia',
        description: 'Prueba temporal',
        players: '7',
        material: 'Balones',
        duration: 10,
        reps: 2,
        pause: 30,
        intensity: 'Media',
        saveMode: 'static',
        staticBoard: { players: [], objects: [] },
        preview: '',
      },
    }, '*');
  }));

  if (saved !== 'browser-smoke-exercise') throw new Error('El ejercicio guardado no devolvió el id esperado.');

  await page.waitForFunction(() => window.__campobase.state.exercises.some((item) => item.id === 'browser-smoke-exercise'), null, { timeout: 10000 });
  await page.evaluate(() => {
    window.__campobase.showView('ejercicios');
    window.__campobase.setExerciseLibraryMode('mine');
  });
  await page.waitForFunction(() => document.body.innerText.includes('Ejercicio Smoke Browser'), null, { timeout: 10000 });
}

async function testMobile(page) {
  await enterDemo(page);
  await page.evaluate(() => window.__campobase.showView('ejercicios'));
  await page.waitForSelector('#new-exercise');
  await page.click('#new-exercise');
  await page.waitForFunction(() => {
    const overlay = document.querySelector('.exercise-board-overlay');
    const dialog = document.getElementById('exercise-dialog');
    return Boolean(overlay?.classList.contains('open') || dialog?.open);
  }, null, { timeout: 10000 });
}

try {
  await waitServer();
  browser = await chromium.launch({ headless: true, executablePath: chrome, args: ['--no-sandbox'] });

  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    serviceWorkers: 'block',
  });
  const desktop = await desktopContext.newPage();
  await testDesktop(desktop);
  await desktopContext.close();

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    serviceWorkers: 'block',
  });
  const mobile = await mobileContext.newPage();
  await testMobile(mobile);
  await mobileContext.close();

  if (browserErrors.length) {
    throw new Error('Errores de navegador detectados:\n' + browserErrors.join('\n'));
  }

  console.log('Browser smoke v19 OK: subpestañas, Preparar partido, + Ejercicio y guardado.');
} finally {
  if (browser) await browser.close().catch(() => {});
  server.kill('SIGTERM');
}
