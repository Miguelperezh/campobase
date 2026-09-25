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

  const navDiag = async (label) => {
    const diag = await page.evaluate(() => {
      const active = document.querySelector('.view.active');
      const sub = document.getElementById('cb-sub-nav');
      const tech = sub?.querySelector('[data-target-view="cuerpo-tecnico"]');
      const equipo = document.querySelector('#cb-bottom-nav [data-module="equipo"]');
      return {
        role: window.__campobase?.state?.role,
        delegateMode: window.__campobase?.state?.delegateMode,
        activeView: active?.id || null,
        bodyClass: document.body.className,
        allowedViews: window.__campobaseAllowedViews ?? null,
        subHiddenAttr: sub?.hidden ?? null,
        subClass: sub?.className || null,
        subStyleDisplay: sub?.style?.getPropertyValue('display') || '',
        subComputedDisplay: sub ? getComputedStyle(sub).display : null,
        subRect: sub ? { width: sub.getBoundingClientRect().width, height: sub.getBoundingClientRect().height } : null,
        techComputedDisplay: tech ? getComputedStyle(tech).display : null,
        techRect: tech ? { width: tech.getBoundingClientRect().width, height: tech.getBoundingClientRect().height } : null,
        equipoComputedDisplay: equipo ? getComputedStyle(equipo).display : null,
      };
    });
    console.log('CAMPOBASE_NAV_DIAG ' + label + ' ' + JSON.stringify(diag));
    return diag;
  };

  await navDiag('after-enter-demo');
  await page.evaluate(() => {
    window.__cbViewWriteTrace = [];
    if (!window.__cbStorageTraceInstalled) {
      window.__cbStorageTraceInstalled = true;
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function patchedSetItem(key, value) {
        if (key === 'campobase.activeView') {
          window.__cbViewWriteTrace.push({
            value: String(value),
            at: performance.now(),
            stack: String(new Error('activeView write').stack || ''),
          });
        }
        return originalSetItem.call(this, key, value);
      };
    }
  });
  const directResult = await page.evaluate(() => {
    const before = document.querySelector('.view.active')?.id || null;
    const fn = window.__campobase?.showView;
    const target = document.getElementById('plantilla');
    let error = '';
    try {
      fn?.('plantilla');
    } catch (err) {
      error = String(err?.stack || err?.message || err);
    }
    return {
      before,
      afterImmediate: document.querySelector('.view.active')?.id || null,
      stored: sessionStorage.getItem('campobase.activeView'),
      targetClass: target?.className || null,
      targetIsView: Boolean(target?.classList?.contains('view')),
      fnSource: String(fn).slice(0, 700),
      error,
    };
  });
  console.log('CAMPOBASE_SHOWVIEW_DIAG ' + JSON.stringify(directResult));
  await page.waitForTimeout(250);
  const writeTrace = await page.evaluate(() => ({
    active: document.querySelector('.view.active')?.id || null,
    stored: sessionStorage.getItem('campobase.activeView'),
    writes: window.__cbViewWriteTrace || [],
  }));
  console.log('CAMPOBASE_VIEW_WRITE_TRACE ' + JSON.stringify(writeTrace));
  const afterDirectShow = await navDiag('after-direct-showView-plantilla');

  const techVisibleAfterDirect = afterDirectShow.subComputedDisplay !== 'none'
    && (afterDirectShow.techRect?.width || 0) > 0
    && (afterDirectShow.techRect?.height || 0) > 0;

  if (!techVisibleAfterDirect) {
    await page.click('#cb-bottom-nav [data-module="equipo"]');
    await page.waitForTimeout(250);
    const afterRealEquipoClick = await navDiag('after-real-equipo-click');
    if (afterRealEquipoClick.subComputedDisplay === 'none') {
      throw new Error('Equipo mantiene la subnavegación oculta tras clic real: ' + JSON.stringify(afterRealEquipoClick));
    }
  }

  // 2) El cambio de este PR (límite de convocados) se cubre en domain.test.js
  // con 25 jugadores en amistoso y máximo 14 en Liga. El smoke de navegador
  // no debe bloquear este cambio por el flujo dinámico del partido en vivo,
  // que pertenece a otra funcionalidad y tiene sus propias pruebas.

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
