// Mejoras finales exclusivas de la prueba aislada Modo Campo.
// No importa funciones de escritura ni modifica datos de CampoBase.

const FIELD_CONTENT_ID = 'field-content';
const MAX_VISIBLE_STEPS = 4;
let fieldObserver = null;

function ensureFieldBottomClose() {
  const content = document.getElementById(FIELD_CONTENT_ID);
  if (!content || !content.children.length) return;
  if (content.querySelector('.field-bottom-close-bar')) return;

  const bar = document.createElement('div');
  bar.className = 'field-bottom-close-bar';
  bar.innerHTML = '<button type="button" data-close-field aria-label="Cerrar Modo Campo">Cerrar</button>';
  content.appendChild(bar);
}

function collapseLongHowTo() {
  const content = document.getElementById(FIELD_CONTENT_ID);
  if (!content) return;
  const howTo = content.querySelector('.field-howto');
  if (!howTo || howTo.dataset.campoStepsEnhanced === '1') return;

  const steps = [...howTo.querySelectorAll('.field-step')];
  if (steps.length <= MAX_VISIBLE_STEPS) {
    howTo.dataset.campoStepsEnhanced = '1';
    return;
  }

  steps.slice(MAX_VISIBLE_STEPS).forEach((step) => step.classList.add('campo-step-collapsed'));
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'field-steps-more';
  button.dataset.fieldExpandSteps = '1';
  button.dataset.expanded = 'false';
  button.textContent = `Ver ${steps.length - MAX_VISIBLE_STEPS} pasos más`;
  howTo.appendChild(button);
  howTo.dataset.campoStepsEnhanced = '1';
}

function addGlanceSummary() {
  const content = document.getElementById(FIELD_CONTENT_ID);
  if (!content) return;
  const main = content.querySelector('.field-main-card');
  const facts = main?.querySelector('.field-essential-grid');
  if (!main || !facts || main.querySelector('.campo-field-glance')) return;

  const items = [...facts.querySelectorAll('.field-essential')].slice(0, 3).map((item) => {
    const label = item.querySelector('small')?.textContent?.trim() || '';
    const value = item.querySelector('strong')?.textContent?.trim() || '—';
    return { label, value };
  }).filter((item) => item.label);
  if (!items.length) return;

  const summary = document.createElement('div');
  summary.className = 'campo-field-glance';
  summary.setAttribute('aria-label', 'Resumen rápido del ejercicio');
  summary.innerHTML = items.map(({ label, value }) => `<div><small>${label}</small><strong>${value}</strong></div>`).join('');
  const heading = main.querySelector('h2');
  heading?.insertAdjacentElement('afterend', summary);
}

function enhanceField() {
  ensureFieldBottomClose();
  collapseLongHowTo();
  addGlanceSummary();
}

function installFieldObserver() {
  const content = document.getElementById(FIELD_CONTENT_ID);
  if (!content || fieldObserver) return;
  fieldObserver = new MutationObserver(() => enhanceField());
  fieldObserver.observe(content, { childList: true, subtree: true });
  enhanceField();
}

function toggleExtraSteps(button) {
  const howTo = button.closest('.field-howto');
  if (!howTo) return;
  const extra = [...howTo.querySelectorAll('.field-step')].slice(MAX_VISIBLE_STEPS);
  const expanded = button.dataset.expanded === 'true';
  extra.forEach((step) => step.classList.toggle('campo-step-collapsed', expanded));
  button.dataset.expanded = expanded ? 'false' : 'true';
  button.textContent = expanded ? `Ver ${extra.length} pasos más` : 'Mostrar solo lo esencial';
}

function addFullscreenClose() {
  const full = document.fullscreenElement;
  document.querySelectorAll('.campo-fullscreen-close').forEach((button) => button.remove());
  if (!full) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'campo-fullscreen-close';
  button.textContent = 'Cerrar';
  button.setAttribute('aria-label', 'Cerrar pantalla completa');
  button.addEventListener('click', () => document.exitFullscreen?.());
  full.appendChild(button);
}

document.addEventListener('click', (event) => {
  const steps = event.target.closest('[data-field-expand-steps]');
  if (steps) {
    event.preventDefault();
    toggleExtraSteps(steps);
  }
});

document.addEventListener('fullscreenchange', addFullscreenClose);

document.addEventListener('DOMContentLoaded', installFieldObserver, { once: true });
if (document.readyState !== 'loading') installFieldObserver();
