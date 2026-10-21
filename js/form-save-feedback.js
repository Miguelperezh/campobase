// Run the browser's constraints before saving, with feedback inside the form.
export function assertFormValid(form) {
  const control = [...form.elements].find(item => item.willValidate && !item.validity.valid);
  if (!control) return;
  const label = control.labels?.[0]?.cloneNode(true);
  label?.querySelectorAll('input,select,textarea,button').forEach(item => item.remove());
  const name = control.getAttribute('aria-label') || label?.textContent.trim() || 'este dato';
  const message = control.validity.valueMissing
    ? `${control.tagName === 'SELECT' ? 'Selecciona' : 'Completa'} «${name}» para guardar.`
    : `Revisa «${name}»: ${control.validationMessage}`;
  const error = new Error(message);
  error.control = control;
  throw error;
}

export function showFormSaveError(form, error) {
  if (!form) return;
  let notice = form.querySelector('[data-save-error]');
  if (!notice) {
    notice = document.createElement('p');
    notice.dataset.saveError = '';
    notice.className = 'warning panel';
    notice.setAttribute('role', 'alert');
    notice.tabIndex = -1;
    const actions = form.querySelector('[type="submit"]')?.closest('.button-row');
    if (actions) actions.before(notice);
    else form.append(notice);
  }
  notice.hidden = false;
  notice.textContent = error.message || 'No se pudo guardar. Tus datos siguen en este formulario.';
  const control = error.control;
  const target = control?.isConnected && control.form === form ? control : notice;
  target.focus({preventScroll:true});
  target.scrollIntoView({block:'center'});
}
