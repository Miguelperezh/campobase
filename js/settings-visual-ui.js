// Presentation only: keep the existing pickers, listeners and stored keys.
const lifetimes = new WeakMap();
export function enhanceColorSettings(root, elements = []) {
  lifetimes.get(root)?.abort();
  const lifetime = new AbortController();
  lifetimes.set(root,lifetime);
  const signal = lifetime.signal;
  const controls = root.querySelector('.cbx-adjustments-controls');
  if (!controls) return;
  const preview = root.querySelector('.cbx-adjustments-preview');
  if (preview) {
    const fold = document.createElement('details');
    fold.open = window.matchMedia('(min-width:801px)').matches;
    const summary = document.createElement('summary');
    summary.textContent = '👁 Vista previa';
    fold.append(summary);
    for (const child of [...preview.children]) if (child.tagName !== 'H4') fold.append(child); else child.remove();
    preview.append(fold);
  }
  const planSample = root.querySelector('.cbx-plan-colour-example');
  if (planSample) {
    const updatePlanSample = () => {
      const value = prop => root.querySelector(`input[data-prop="${prop}"]`)?.value;
      planSample.style.color = value('planTextColor');
      planSample.style.background = value('planRowColor');
      planSample.style.border = '2px solid ' + value('planSelectionColor');
      planSample.style.padding = '12px';
      planSample.style.borderRadius = '10px';
      planSample.querySelector('.cbx-minute-track').style.background = value('planTrackColor');
      planSample.querySelector('i').style.background = value('planBarColor');
    };
    updatePlanSample();
    root.addEventListener('input', updatePlanSample, {signal});
  }
  const general = controls.querySelector('.cbx-general-color-controls');
  const concrete = controls.querySelector('.cbx-named-colors');
  const concreteOnly=!!concrete && !general?.querySelector('input');
  const toolbar = document.createElement('div');
  toolbar.className = 'cbx-settings-sections';
  toolbar.setAttribute('role', 'group');
  toolbar.setAttribute('aria-label', 'Qué quieres personalizar');
  for (const [label, section] of [['🎨 Colores de la sección', general], ['🔎 Un elemento concreto', concrete]]) {
    if (!section || (concreteOnly && section===general)) continue;
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'secondary'; button.textContent = concreteOnly?'🎨 Elementos de esta sección':label;
    button.setAttribute('aria-pressed', String(section === (concreteOnly?concrete:general)));
    button.onclick = () => {
      general.hidden = section !== general; concrete.hidden = section !== concrete;
      [...toolbar.children].forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    };
    toolbar.append(button);
  }
  controls.prepend(toolbar);
  if (concrete) concrete.hidden = !concreteOnly;
  if(general && concreteOnly)general.hidden=true;
  general?.querySelectorAll(':scope > .cbx-color-control-row').forEach(row => {
    const prop = row.querySelector('[data-prop]')?.dataset.prop || '';
    const title = row.querySelector('span')?.textContent || '';
    const symbol = /Ink|Color|Title/.test(prop) && !/Bg|Border|Bar|Track|Cursor|Selection/.test(prop) ? 'Aa' : /Border|Selection/.test(prop) ? '▢' : '▰';
    row.dataset.visualSymbol = symbol;
    row.setAttribute('aria-label', title);
  });
  // One explicit choice, one visible element: keep all saved controls and listeners.
  if(concrete){
    const chooser=document.createElement('label');chooser.textContent='¿Qué quieres cambiar?';
    const select=document.createElement('select');select.id='cbx-colour-element-choice';select.setAttribute('aria-label','Elemento que quieres personalizar');
    const fields=[...concrete.querySelectorAll('[data-element-index]')];
    fields.forEach(field=>{const item=elements[Number(field.dataset.elementIndex)];const option=document.createElement('option');option.value=field.dataset.elementIndex;option.textContent=item.label;select.append(option);});
    chooser.append(select);concrete.prepend(chooser);
    const show=()=>{fields.forEach(field=>field.hidden=field.dataset.elementIndex!==select.value);concrete.querySelectorAll('.cbx-colour-group').forEach(group=>{group.open=true;group.hidden=![...group.querySelectorAll('[data-element-index]')].some(field=>!field.hidden);group.querySelector('summary').hidden=true;});};
    select.addEventListener('change',show,{signal});show();
    concrete.querySelector('#qc-element-search')?.closest('label')?.setAttribute('hidden','');
    const intro=concrete.querySelector('h3');if(intro)intro.textContent='Elige un elemento y cambia su fondo o su texto';
    concrete.querySelector(':scope > p')?.setAttribute('hidden','');
    toolbar.remove();
    if(concreteOnly){concrete.hidden=false;}else{const advanced=document.createElement('details');const summary=document.createElement('summary');summary.textContent='Otros elementos de esta sección';advanced.append(summary);concrete.before(advanced);advanced.append(concrete);concrete.hidden=false;}
    root.querySelector('.cbx-adjustments-preview')?.setAttribute('hidden','');
    root.querySelector('.cbx-adjustments-layout')?.style.setProperty('display','block');
  }
  // Pair background/foreground controls so each sample shows the chosen combination.
  root.querySelectorAll('.cbx-color-control-row').forEach(row => {
    const picker = row.querySelector('input[type=color]');
    if (!picker) return;
    if(picker.dataset.elementProp && picker.dataset.elementProp!=='background' && picker.closest('fieldset')?.querySelector('[data-element-prop="background"]'))return;
    const label = row.querySelector('span')?.textContent || picker.getAttribute('aria-label') || row.querySelector('label')?.textContent || 'Ejemplo';
    const target = elements[Number(picker.dataset.element)]?.selector;
    const source = target && document.querySelector(target);
    const sample = document.createElement('div');
    if (source) sample.style.fontFamily = getComputedStyle(source).fontFamily;
    sample.className = 'cbx-setting-live-sample';
    sample.textContent = source?.textContent?.trim().replace(/\s+/g,' ').slice(0,140) || (/fuente|texto|nombre/i.test(label) ? 'Así se leerá este texto · Aa 123' : /barra|minutos/i.test(label) ? '▰ 35 minutos' : /bot[oó]n|cerrar|editar/i.test(label) ? 'Ejemplo de botón' : 'Ejemplo de ' + label.toLocaleLowerCase('es'));
    sample.setAttribute('aria-label','Vista previa real de '+label);
    const prop = picker.dataset.prop || picker.dataset.elementProp;
    const isInk = /Ink|fontColor|textColor|cardTitle|planTextColor|^color$/.test(prop);
    const paired = !picker.dataset.prop ? null : /Ink$/.test(prop) ? prop.replace(/Ink$/, 'Bg') : /Bg$/.test(prop) ? prop.replace(/Bg$/, 'Ink') : ['fontColor','textColor','cardTitle'].includes(prop) ? 'cardBg' : prop === 'planTextColor' ? 'planRowColor' : null;
    const update = () => {
      const counterpart = picker.dataset.elementProp ? picker.closest('fieldset')?.querySelector('[data-element-prop="'+(isInk?'background':'color')+'"]') : paired && paired !== prop ? root.querySelector(`input[data-prop="${paired}"]`) : null;
      sample.style.backgroundColor = isInk ? counterpart?.value || '#f1f5f9' : picker.value;
      sample.style.color = isInk ? picker.value : counterpart?.value || '#17202a';
      if (/border|Border|stroke/.test(prop)) { sample.style.backgroundColor = '#f8fafc'; sample.style.borderColor = picker.value; }
      const border=picker.dataset.elementProp && picker.closest('fieldset')?.querySelector('[data-element-prop="border-color"]');if(border)sample.style.borderColor=border.value;
      sample.title = label + ': ' + picker.value;
      if(source){ sample.style.fontWeight=getComputedStyle(source).fontWeight; sample.style.borderRadius=getComputedStyle(source).borderRadius; }
      if(picker.dataset.elementProp==='background' && /Nombre|Cabecera|Celdas/.test(elements[Number(picker.dataset.element)]?.label||''))sample.textContent=source?.textContent?.trim().slice(0,140)||label;
    };
    if(picker.dataset.elementProp){picker.closest('fieldset').append(sample);sample.style.padding='12px';sample.style.borderStyle='solid';sample.style.borderWidth='1px';}else row.append(sample); update();
    root.addEventListener('input', update, {signal});
    root.addEventListener('click', event => { if (event.target.closest('.cbx-swatch-btn')) queueMicrotask(update); }, {signal});
  });
  if(!concrete)root.querySelectorAll('.cbx-colour-group').forEach(group => {
    group.addEventListener('toggle', () => {
      if (group.open) root.querySelectorAll('.cbx-colour-group').forEach(other => { if (other !== group) other.open = false; });
    });
  });
}
