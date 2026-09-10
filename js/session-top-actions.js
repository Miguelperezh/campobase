// Acciones rápidas del editor de Sesiones.
// Solo replica Guardar/Cancelar junto a + Sesión para evitar recorrer toda la pantalla.

let renderQueued = false;

function sessionElements() {
  const section = document.querySelector('#sesiones');
  const builder = section?.querySelector('#session-builder');
  const form = builder?.querySelector('#session-form');
  const actions = section?.querySelector('.section-head .button-row');
  const newSession = section?.querySelector('#new-session');
  return { section, builder, form, actions, newSession };
}

export function syncSessionTopActions() {
  if (typeof document === 'undefined') return;
  const { builder, form, actions, newSession } = sessionElements();
  if (!builder || !actions || !newSession) return;

  const open = !builder.classList.contains('hidden') && Boolean(form);
  let save = document.querySelector('#session-top-save');
  let cancel = document.querySelector('#session-top-cancel');

  if (!open) {
    save?.remove();
    cancel?.remove();
    actions.removeAttribute('data-session-editing');
    return;
  }

  actions.dataset.sessionEditing = '1';

  if (!save) {
    save = document.createElement('button');
    save.id = 'session-top-save';
    save.type = 'button';
    save.className = 'primary session-top-action';
    save.textContent = 'Guardar';
    save.addEventListener('click', () => {
      const currentForm = document.querySelector('#session-builder #session-form');
      const submit = currentForm?.querySelector('button[type="submit"]');
      if (!currentForm || !submit || submit.disabled) return;
      if (typeof currentForm.requestSubmit === 'function') currentForm.requestSubmit(submit);
      else submit.click();
    });
    newSession.insertAdjacentElement('afterend', save);
  }

  if (!cancel) {
    cancel = document.createElement('button');
    cancel.id = 'session-top-cancel';
    cancel.type = 'button';
    cancel.className = 'secondary session-top-action';
    cancel.textContent = 'Cancelar';
    cancel.addEventListener('click', () => {
      const original = document.querySelector('#session-builder .cancel-session');
      if (original) original.click();
      else document.querySelector('#session-builder')?.classList.add('hidden');
      queueSync();
    });
    save.insertAdjacentElement('afterend', cancel);
  }

  const submit = form?.querySelector('button[type="submit"]');
  const disabled = !submit || submit.disabled;
  if (save.disabled !== disabled) save.disabled = disabled;
}

function queueSync() {
  if (renderQueued || typeof window === 'undefined') return;
  renderQueued = true;
  window.requestAnimationFrame(() => {
    renderQueued = false;
    syncSessionTopActions();
  });
}

function installStyles() {
  if (document.querySelector('#session-top-actions-style')) return;
  const style = document.createElement('style');
  style.id = 'session-top-actions-style';
  style.textContent = `
    #sesiones > .section-head { flex-wrap: wrap; }
    #sesiones > .section-head > .button-row { margin-top: 0; }
    @media (max-width: 650px) {
      #sesiones > .section-head > .button-row[data-session-editing="1"] {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      #sesiones > .section-head > .button-row[data-session-editing="1"] > button {
        min-width: 0;
        padding-left: .45rem;
        padding-right: .45rem;
      }
    }
  `;
  document.head.append(style);
}

function install() {
  const section = document.querySelector('#sesiones');
  if (!section) return;
  installStyles();
  syncSessionTopActions();
  const observer = new MutationObserver(queueSync);
  observer.observe(section, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'disabled'] });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
}
