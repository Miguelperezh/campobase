// Integración oficial de Modo Campo con la aplicación estable.
// No reimplementa lógica de negocio: solo añade acceso/retorno y abre las
// funciones ya existentes de CampoBase cuando se llega desde Modo Campo.

const params = new URLSearchParams(window.location.search);
const fromCampo = params.get('fromCampo') === '1';

function addTopbarButton({ id, text, onClick, primary = false }) {
  if (document.getElementById(id)) return;
  const status = document.querySelector('.topbar .status');
  const logout = document.getElementById('logout');
  if (!status) return;
  const button = document.createElement('button');
  button.id = id;
  button.type = 'button';
  button.className = `${primary ? 'primary' : 'secondary'} compact`;
  button.textContent = text;
  button.addEventListener('click', onClick);
  if (logout?.parentNode === status) status.insertBefore(button, logout);
  else status.appendChild(button);
}

function installEntryButtons() {
  if (fromCampo) {
    addTopbarButton({
      id: 'return-to-field-mode',
      text: '← Volver a Modo Campo',
      primary: true,
      onClick: () => { window.location.href = './modo-campo-directo.html'; },
    });
    return;
  }
  addTopbarButton({
    id: 'open-field-mode',
    text: 'Modo Campo',
    onClick: () => { window.location.href = './modo-campo-directo.html'; },
  });
}

function waitForSelector(selector, timeoutMs = 10000) {
  return new Promise((resolve) => {
    const immediate = document.querySelector(selector);
    if (immediate) return resolve(immediate);
    const started = Date.now();
    const timer = window.setInterval(() => {
      const element = document.querySelector(selector);
      if (element || Date.now() - started >= timeoutMs) {
        clearInterval(timer);
        resolve(element || null);
      }
    }, 100);
  });
}

function clearActionFromUrl() {
  const current = new URL(window.location.href);
  current.searchParams.delete('campoAction');
  current.searchParams.delete('source');
  current.searchParams.delete('id');
  window.history.replaceState({}, '', `${current.pathname}${current.search}${current.hash}`);
}

async function openRealAction() {
  const action = params.get('campoAction');
  if (!action) return;

  const app = window.__campobase;
  if (!app?.showView) {
    window.setTimeout(openRealAction, 120);
    return;
  }

  const id = params.get('id') || '';

  if (action === 'live') {
    app.showView('partido');
    clearActionFromUrl();
    return;
  }
  if (action === 'delegate') {
    app.showView('delegado');
    clearActionFromUrl();
    return;
  }
  if (action === 'whatsapp-session' && id) {
    app.showView('sesiones');
    const button = await waitForSelector(`.open-whatsapp-session[data-id="${CSS.escape(id)}"]`);
    button?.click();
    clearActionFromUrl();
    return;
  }
  if (action === 'whatsapp-match' && id) {
    app.showView('calendario');
    const button = await waitForSelector(`.open-whatsapp-match[data-id="${CSS.escape(id)}"]`);
    button?.click();
    clearActionFromUrl();
    return;
  }
  if (action === 'attendance' && id) {
    const source = params.get('source') === 'match' ? 'match' : 'session';
    app.showView('asistencia');
    const button = await waitForSelector(`[data-attendance-source="${source}"][data-source-id="${CSS.escape(id)}"]`);
    button?.click();
    clearActionFromUrl();
  }
}

function install() {
  installEntryButtons();
  openRealAction().catch((error) => console.warn('No se pudo abrir la función solicitada desde Modo Campo:', error));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
else install();
