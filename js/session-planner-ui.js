import { getAll } from './db.js';
import { EJERCICIOS_VALIDADOS } from './ejercicios-validados.js';

const $ = (selector, root = document) => root.querySelector(selector);
const esc = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
})[character]);
const norm = (value = '') => String(value).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('es').trim();

const TYPES = [
  ['balanced', 'Equilibrada · desarrollo integral'],
  ['technical', 'Técnica'],
  ['tactical', 'Táctica + comprensión del juego'],
  ['physical', 'Física integrada con balón'],
  ['decision', 'Toma de decisiones + juego'],
  ['competitive', 'Competitiva · duelos y juego reducido'],
  ['progressive', 'Progresiva · técnica → táctica → juego'],
  ['pre_match', 'Activación / prepartido'],
  ['recovery', 'Recuperación / baja carga'],
];

const byId = new Map(EJERCICIOS_VALIDADOS.map((item) => [String(item.id), item]));
let formRef = null;
let catalog = [];
let favorites = new Set();
let videos = new Set();
let query = '';
let category = '';
let format = '';
let onlyFav = false;
let onlyVideo = false;
let mode = 'all';
let proposal = '';
let objective = '';
let observer = null;
let queued = false;

function duration(text, fallback = 10) {
  const numbers = String(text || '').match(/\d+/g)?.map(Number) || [];
  return numbers.length > 1 && /[-–]/.test(text)
    ? Math.round((numbers[0] + numbers[1]) / 2)
    : (numbers[0] || fallback);
}

function cover(item) {
  const frames = String(item?.animacion?.frames || '');
  return frames ? `${frames}000.jpg` : '';
}

function animationVideo(item) {
  const animation = item?.animacion || {};
  return String(animation.mp4 || (animation.gif || '').replace(/\.gif$/i, '.mp4') || '');
}

function validatedText(item) {
  const quick = item?.vista_rapida || {};
  const detail = item?.detalle || {};
  return [
    item?.nombre,
    quick.tipo_principal,
    ...(quick.que_se_trabaja || []),
    quick.explicacion_breve,
    quick.material,
    quick.jugadores?.organizacion,
    ...(detail.objetivos || []),
    ...(detail.claves_entrenador || []),
    ...(detail.desarrollo || []),
    ...(detail.que_buscamos || []),
    ...(detail.variantes || []),
  ].filter(Boolean).join(' ');
}

function itemFromCard(card) {
  const button = $('.add-exercise-to-session', card);
  const id = button?.dataset.id || '';
  const name = $('h3', card)?.textContent?.trim() || id;
  const pills = [...card.querySelectorAll('.pill')].map((item) => item.textContent.trim());
  const durationText = $('.exercise-highlights .pill.accent', card)?.textContent?.trim() || '';
  const validated = byId.get(id);
  const quick = validated?.vista_rapida || {};

  return {
    id,
    name: validated?.nombre || name,
    type: quick.tipo_principal || pills[0] || 'Otros',
    duration: duration(quick.tiempo_estimado_15 || durationText),
    durationText: quick.tiempo_estimado_15 || durationText || '—',
    works: quick.que_se_trabaja || [],
    brief: quick.explicacion_breve || card.textContent?.trim() || name,
    search: norm(validated ? validatedText(validated) : card.textContent || name),
    cover: cover(validated),
    animationVideo: animationVideo(validated),
    validated,
  };
}

async function flags() {
  try {
    const records = await getAll('settings');
    favorites = new Set(records.filter((item) => item?.favorite === true).map((item) => String(item.id)));
    videos = new Set(records.filter((item) => item?.recordType === 'exerciseVideo' && item.exerciseId).map((item) => String(item.exerciseId)));
  } catch {}
}

function defaultFormat() {
  return /\bF11\b/i.test($('#active-format')?.textContent || '') ? 'F11' : 'F7';
}

function allowed(item) {
  const selectedFormat = format || defaultFormat();
  const text = norm(`${item.name} ${item.type} ${item.brief} ${item.works.join(' ')}`);
  return selectedFormat === 'F11'
    ? !/(^|\s)(f7|futbol 7|7v7|7x7)(\s|$)/.test(text)
    : !/(^|\s)(f11|futbol 11|11v11|11x11)(\s|$)/.test(text);
}

function score(item, value) {
  const q = norm(value);
  if (!q) return 0;
  let result = 0;
  for (const token of q.split(/[^a-z0-9]+/).filter((entry) => entry.length > 2)) {
    if (item.search.includes(token)) result += 2;
  }
  for (const [requested, available] of [
    [/final|tiro|remat|gol|defin/, /final|tiro|remat|gol|defin/],
    [/1v1|duelo/, /1v1|duelo/],
    [/pase|control|tecn/, /pase|control|tecn/],
    [/poses|conserv/, /poses|conserv/],
    [/transic|contraat/, /transic|contraat/],
    [/presi|robo/, /presi|robo/],
    [/coord|reacc|veloc|sprint|agil|fuerza/, /coord|reacc|veloc|sprint|agil|fuerza/],
    [/defen|cobertura|replieg/, /defen|cobertura|replieg/],
    [/tact|posicion|amplitud|profund/, /tact|posicion|amplitud|profund/],
  ]) {
    if (requested.test(q) && available.test(item.search)) result += 6;
  }
  return result;
}

const prioritise = (items, regex) => [...items].sort(
  (left, right) => Number(regex.test(right.search)) - Number(regex.test(left.search)),
);

function proposed(type) {
  const available = catalog.filter(allowed);
  const ranked = objective
    ? available.map((item) => ({ item, score: score(item, objective) })).sort((a, b) => b.score - a.score)
    : available.map((item) => ({ item, score: 0 }));
  const positive = ranked.filter((entry) => entry.score > 0).map((entry) => entry.item);
  const base = (positive.length ? positive : ranked.map((entry) => entry.item)).slice(0, 50);

  const proposals = {
    balanced: base,
    technical: prioritise(base, /tecn|pase|control|conducc|regate/),
    tactical: prioritise(base, /tact|presi|transic|cobertura|replieg|posicion|amplitud/),
    physical: prioritise(base, /preparacion fisica|fisic|veloc|sprint|aceler|coordin|agilidad|fuerza|salto|resisten/),
    decision: prioritise(base, /decision|juego|duelo|1v1|2v2|3v2|oposicion|percep/),
    competitive: prioritise(base, /compet|duelo|1v1|juego|partid|final|porter/),
    progressive: [
      ...prioritise(base, /tecn|pase|control/).slice(0, 2),
      ...prioritise(base, /tact|presi|transic|posicion/).slice(0, 2),
      ...prioritise(base, /decision|juego|duelo/),
    ],
    pre_match: prioritise(base, /calent|activ|movilidad|coord|reacc/),
    recovery: prioritise(base, /recuper|movilidad|tecn|pase|baja|suave/),
  };

  const target = Number($('#session-plan-target')?.value) || 60;
  const result = [];
  let total = 0;
  for (const item of proposals[type] || base) {
    if (result.some((entry) => entry.id === item.id)) continue;
    result.push(item);
    total += item.duration;
    if (result.length >= 6 || (result.length >= 4 && total >= target - 5)) break;
  }
  return result;
}

function recIds() {
  if (proposal) return new Set(proposed(proposal).map((item) => item.id));
  if (!objective) return new Set();
  return new Set(
    catalog.filter(allowed)
      .map((item) => ({ id: item.id, score: score(item, objective) }))
      .sort((a, b) => b.score - a.score)
      .filter((entry) => entry.score > 0)
      .slice(0, 14)
      .map((entry) => entry.id),
  );
}

function proposalOptions() {
  return '<option value="">Elige una propuesta</option>' + TYPES.map(([id, label]) => {
    const items = proposed(id);
    return `<option value="${id}" ${proposal === id ? 'selected' : ''}>${esc(label)} · ${items.length} ejercicios · ${items.reduce((sum, item) => sum + item.duration, 0)} min</option>`;
  }).join('');
}

function coverFallback(name) {
  const fallback = document.createElement('div');
  fallback.className = 'sp-fallback';
  fallback.innerHTML = `CampoBase<br><strong>${esc(name)}</strong>`;
  return fallback;
}

function captureCoverFromVideo(img) {
  const src = img?.dataset.spCoverVideo;
  if (!src || img.dataset.spCoverFallbackStarted === '1') {
    if (!src) img?.replaceWith(coverFallback(img?.alt?.replace(/^Portada de\s*/i, '') || 'Ejercicio'));
    return;
  }
  img.dataset.spCoverFallbackStarted = '1';

  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.src = src;

  let finished = false;
  const fail = () => {
    if (finished) return;
    finished = true;
    video.removeAttribute('src');
    video.load();
    img.replaceWith(coverFallback(img.alt.replace(/^Portada de\s*/i, '') || 'Ejercicio'));
  };
  const paint = () => {
    if (finished || !video.videoWidth || !video.videoHeight) return fail();
    try {
      const canvas = document.createElement('canvas');
      const width = Math.min(video.videoWidth, 720);
      const height = Math.max(1, Math.round(width * video.videoHeight / video.videoWidth));
      canvas.width = width;
      canvas.height = height;
      canvas.className = 'sp-cover-canvas';
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', img.alt);
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, width, height);
      finished = true;
      video.pause();
      video.removeAttribute('src');
      video.load();
      img.replaceWith(canvas);
    } catch {
      fail();
    }
  };

  video.addEventListener('error', fail, { once: true });
  video.addEventListener('loadeddata', () => {
    if (!Number.isFinite(video.duration) || video.duration <= 0.04) return paint();
    try {
      video.currentTime = 0.04;
      video.addEventListener('seeked', paint, { once: true });
    } catch {
      paint();
    }
  }, { once: true });
  video.load();
}

function bindCoverFallbacks(root) {
  root.querySelectorAll('.sp-cover img[data-sp-cover-video]').forEach((img) => {
    img.addEventListener('error', () => captureCoverFromVideo(img), { once: true });
  });
  root.querySelectorAll('.sp-cover img:not([data-sp-cover-video])').forEach((img) => {
    img.addEventListener('error', () => {
      img.replaceWith(coverFallback(img.alt.replace(/^Portada de\s*/i, '') || 'Ejercicio'));
    }, { once: true });
  });
}

function card(item, recommended) {
  const favorite = favorites.has(item.id);
  const hasRealVideo = videos.has(item.id) || Boolean(item.validated?.video);
  const image = item.cover
    ? `<img loading="lazy" decoding="async" src="${esc(item.cover)}" data-sp-cover-video="${esc(item.animationVideo)}" alt="Portada de ${esc(item.name)}">`
    : `<div class="sp-fallback">CampoBase<br><strong>${esc(item.name)}</strong></div>`;

  return `<article class="sp-card ${recommended.has(item.id) ? 'recommended' : ''}">
    <div class="sp-cover">
      ${image}
      ${recommended.has(item.id) ? '<b class="sp-rec">Recomendado</b>' : ''}
      <div class="sp-top">
        ${hasRealVideo ? '<span>▶ Vídeo</span>' : '<i></i>'}
        <button type="button" class="favorite-exercise sp-fav ${favorite ? 'active' : ''}" data-id="${esc(item.id)}">${favorite ? '★' : '☆'}</button>
      </div>
      <div class="sp-name"><small>${esc(item.type)}</small><strong>${esc(item.name)}</strong></div>
    </div>
    <div class="sp-body">
      <span class="pill accent">${esc(item.durationText)}</span>
      <p class="meta">${esc(item.brief)}</p>
      <div>
        <button type="button" class="view-exercise secondary compact" data-exercise-id="${esc(item.id)}">Ver todo</button>
        <button type="button" class="add-exercise-to-session primary compact" data-id="${esc(item.id)}">+ Añadir</button>
      </div>
    </div>
  </article>`;
}

function renderLibrary(form) {
  const root = $('.session-exercise-library', form);
  if (!root) return;

  const recommended = recIds();
  const base = catalog.filter(allowed);
  const categories = [...new Set(base.map((item) => item.type))].sort((a, b) => a.localeCompare(b, 'es'));
  const list = base.filter((item) => (
    (!query || item.search.includes(norm(query)))
    && (!category || item.type === category)
    && (!onlyFav || favorites.has(item.id))
    && (!onlyVideo || videos.has(item.id) || Boolean(item.validated?.video))
    && (mode !== 'recommended' || recommended.has(item.id))
  ));

  root.innerHTML = `<div class="sp-library-head">
      <div><p class="eyebrow">Biblioteca</p><h3>Ejercicios</h3></div>
      <span class="pill accent">${list.length} de ${base.length}</span>
    </div>
    <div class="sp-filters">
      <input id="sp-search" type="search" placeholder="Buscar ejercicio" value="${esc(query)}">
      <select id="sp-category">
        <option value="">Todas las categorías</option>
        ${categories.map((entry) => `<option ${category === entry ? 'selected' : ''}>${esc(entry)}</option>`).join('')}
      </select>
      <select id="sp-mode">
        <option value="all" ${mode === 'all' ? 'selected' : ''}>Todos los ejercicios</option>
        <option value="recommended" ${mode === 'recommended' ? 'selected' : ''}>Solo recomendados</option>
      </select>
    </div>
    <div class="sp-toggles">
      <label><input id="sp-video" type="checkbox" ${onlyVideo ? 'checked' : ''}> Solo con vídeo</label>
      <label><input id="sp-favorites" type="checkbox" ${onlyFav ? 'checked' : ''}> Solo favoritos</label>
    </div>
    <div class="sp-grid">${list.length ? list.map((item) => card(item, recommended)).join('') : '<p class="empty">No hay ejercicios con esos filtros.</p>'}</div>`;

  bindCoverFallbacks(root);
  $('#sp-search', root).oninput = (event) => { query = event.target.value; renderLibrary(form); };
  $('#sp-category', root).onchange = (event) => { category = event.target.value; renderLibrary(form); };
  $('#sp-mode', root).onchange = (event) => { mode = event.target.value; renderLibrary(form); };
  $('#sp-video', root).onchange = (event) => { onlyVideo = event.target.checked; renderLibrary(form); };
  $('#sp-favorites', root).onchange = (event) => { onlyFav = event.target.checked; renderLibrary(form); };
}

function blocks(form) {
  return [...form.querySelectorAll('.session-block')].map((row, index) => {
    const select = $('[name="blockExerciseId"]', row);
    const durationInput = $('[name="blockDuration"]', row);
    const id = select?.value || '';
    const item = catalog.find((entry) => entry.id === id);
    return {
      index,
      id,
      name: item?.name || select?.selectedOptions?.[0]?.textContent?.split(' · ')[0] || 'Ejercicio',
      duration: Number(durationInput?.value) || 0,
      source: durationInput,
    };
  });
}

function renderPlan(form) {
  const strip = $('#session-plan-strip', form);
  const minutes = $('#session-plan-minutes', form);
  const count = $('#session-plan-count', form);
  const objectiveSummary = $('#session-plan-objective-summary', form);
  if (!strip) return;

  const items = blocks(form);
  const target = Number($('#session-plan-target', form)?.value) || 60;
  const total = items.reduce((sum, item) => sum + item.duration, 0);

  minutes.textContent = `${total} min de ${target} min`;
  minutes.classList.toggle('warning', total !== target);
  count.textContent = `${items.length} ejercicio${items.length === 1 ? '' : 's'}`;
  objectiveSummary.textContent = objective ? `Objetivo: ${objective}` : 'Objetivo: sin indicar';

  strip.innerHTML = items.length
    ? items.map((item) => `<div class="sp-chip">
        <strong title="${esc(item.name)}">${item.index + 1}. ${esc(item.name)}</strong>
        <label><input data-sp-time="${item.index}" type="number" min="1" max="60" value="${item.duration}"><span>min</span></label>
        <button type="button" class="view-exercise secondary compact" data-exercise-id="${esc(item.id)}">Ver</button>
        <button type="button" class="remove-session-block danger compact" data-index="${item.index}">×</button>
      </div>`).join('')
    : '<span class="meta">Añade ejercicios desde abajo.</span>';

  strip.querySelectorAll('[data-sp-time]').forEach((input) => {
    input.oninput = () => {
      const item = items[Number(input.dataset.spTime)];
      if (!item?.source) return;
      item.source.value = input.value;
      item.source.dispatchEvent(new Event('input', { bubbles: true }));
      renderPlan(form);
    };
  });
}

function buildControl(form) {
  let control = $('.session-plan-control', form);
  if (!control) {
    control = document.createElement('section');
    control.className = 'session-plan-control';
    control.innerHTML = `<div class="sp-controls">
      <label>Objetivo de la sesión
        <div class="sp-objective">
          <input id="session-plan-objective" placeholder="Ej. Finalización, 1v1 y terminar con un juego competitivo">
          <button id="session-plan-analyse" type="button" class="primary compact">Analizar</button>
        </div>
      </label>
      <label>Propuesta de entrenamiento<select id="session-plan-proposal"></select></label>
      <label>Formato<select id="session-plan-format"><option value="F7">Fútbol 7</option><option value="F11">Fútbol 11</option></select></label>
      <label>Duración del entrenamiento<input id="session-plan-target" type="number" min="1" max="240"></label>
    </div>
    <p id="session-plan-note" class="meta">Puedes elegir una propuesta aunque no escribas objetivo.</p>
    <div class="sp-plan-head">
      <strong>Mi sesión</strong>
      <div>
        <span id="session-plan-minutes" class="pill accent"></span>
        <span id="session-plan-count" class="pill"></span>
        <span id="session-plan-objective-summary" class="pill"></span>
      </div>
    </div>
    <div id="session-plan-strip" class="sp-strip"></div>
    <details class="sp-advanced"><summary>Ajustar orden, ejercicio o consignas</summary></details>`;

    form.insertBefore(control, form.firstChild);

    const objectiveInput = $('#session-plan-objective', control);
    objectiveInput.value = objective;
    objectiveInput.oninput = () => {
      objective = objectiveInput.value;
      renderPlan(form);
      if (!objective.trim()) {
        proposal = '';
        mode = 'all';
        $('#session-plan-proposal', control).innerHTML = proposalOptions();
        $('#session-plan-note', control).textContent = 'Sin objetivo: se muestran todos los ejercicios.';
        renderLibrary(form);
      }
    };

    $('#session-plan-analyse', control).onclick = () => {
      objective = objectiveInput.value;
      proposal = '';
      mode = objective.trim() ? 'recommended' : 'all';
      $('#session-plan-proposal', control).innerHTML = proposalOptions();
      $('#session-plan-note', control).textContent = objective.trim()
        ? 'Objetivo analizado. Revisa los recomendados o elige una propuesta.'
        : 'Sin objetivo: se muestran todos los ejercicios.';
      renderLibrary(form);
      renderPlan(form);
    };

    $('#session-plan-proposal', control).onchange = (event) => {
      proposal = event.target.value;
      mode = proposal ? 'recommended' : (objective.trim() ? 'recommended' : 'all');
      const items = proposal ? proposed(proposal) : [];
      $('#session-plan-note', control).textContent = proposal
        ? `${items.length} ejercicios · ${items.reduce((sum, item) => sum + item.duration, 0)} min orientativos · tú decides cuáles añadir.`
        : (objective ? 'Mostrando ejercicios relacionados con el objetivo.' : 'Sin objetivo: se muestran todos los ejercicios.');
      renderLibrary(form);
    };

    $('#session-plan-format', control).onchange = (event) => {
      format = event.target.value;
      $('#session-plan-proposal', control).innerHTML = proposalOptions();
      renderLibrary(form);
    };

    $('#session-plan-target', control).oninput = (event) => {
      const source = form.elements.targetDuration;
      if (source) {
        source.value = event.target.value;
        source.dispatchEvent(new Event('input', { bubbles: true }));
      }
      $('#session-plan-proposal', control).innerHTML = proposalOptions();
      renderPlan(form);
    };
  }

  const target = $('#session-plan-target', control);
  const source = form.elements.targetDuration;
  if (target && source && document.activeElement !== target) target.value = source.value || 60;
  if (!format) format = defaultFormat();
  $('#session-plan-format', control).value = format;
  $('#session-plan-proposal', control).innerHTML = proposalOptions();
  $('#session-plan-proposal', control).value = proposal;
  renderPlan(form);

  const selectedFieldset = $('.session-selected-blocks', form);
  const advanced = $('.sp-advanced', control);
  if (selectedFieldset && advanced && selectedFieldset.parentElement !== advanced) advanced.append(selectedFieldset);
  source?.closest('label')?.classList.add('sp-source-hidden');
}

function styleSearch() {
  const input = $('#global-search');
  if (input) {
    input.placeholder = 'Buscar';
    input.setAttribute('aria-label', 'Buscar');
  }
}

async function enhance() {
  const builder = $('#session-builder');
  const form = $('#session-form', builder);
  if (!builder || builder.classList.contains('hidden') || !form) return;

  if (form !== formRef) {
    formRef = form;
    const picker = $('.session-exercise-library', form) || $('.session-exercise-picker', form);
    if (!picker) return;
    catalog = [...picker.querySelectorAll('.picker-card')]
      .map(itemFromCard)
      .filter((item) => item.id)
      .sort((a, b) => a.name.localeCompare(b.name, 'es'));
    await flags();
  }

  buildControl(form);
  renderLibrary(form);
}

function styles() {
  if ($('#session-planner-ui-style')) return;
  const style = document.createElement('style');
  style.id = 'session-planner-ui-style';
  style.textContent = `
.search-bar{position:static;display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:.65rem;padding:.55rem clamp(1rem,4vw,3rem);background:rgba(247,245,240,.96);backdrop-filter:blur(16px);border-bottom:1px solid var(--line)}
.search-bar:before{content:"Buscar";display:grid;place-items:center;min-height:40px;padding:0 .8rem;border-radius:11px;background:var(--brand);color:#fff;font-size:.78rem;font-weight:800}
.search-bar input{min-height:42px;border:1px solid var(--line);border-radius:11px;background:var(--card);box-shadow:var(--shadow)}
.session-plan-control{position:static;padding:.8rem;border:1px solid var(--line);border-top:5px solid var(--brand);border-radius:18px;background:#fff;box-shadow:0 12px 32px #0002}
.sp-controls{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(210px,.9fr) 130px 150px;gap:.65rem;align-items:end}
.sp-objective{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.4rem}
.sp-plan-head{display:flex;justify-content:space-between;gap:.6rem;align-items:center;margin-top:.6rem;padding-top:.6rem;border-top:1px solid var(--line)}
.sp-plan-head>div{display:flex;gap:.35rem;flex-wrap:wrap}
#session-plan-minutes.warning{background:#fff0d8;color:#704600}
.sp-strip{display:flex;gap:.45rem;overflow-x:auto;padding:.5rem 0 .1rem}
.sp-chip{min-width:285px;display:grid;grid-template-columns:minmax(0,1fr) 74px auto auto;gap:.35rem;align-items:center;padding:.45rem;border:1px solid var(--line);border-radius:12px;background:#f7f9f7}
.sp-chip>strong{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:.76rem}
.sp-chip label{display:grid;grid-template-columns:1fr auto;align-items:center;gap:.2rem}
.sp-chip input{min-height:32px;padding:.3rem;text-align:center}
.sp-chip button{min-height:32px;padding:.3rem .45rem;font-size:.7rem}
.sp-advanced{margin-top:.4rem;border-top:1px dashed var(--line);padding-top:.35rem}
.sp-advanced>summary{cursor:pointer;color:var(--muted);font-size:.75rem;font-weight:700}
.sp-advanced .session-selected-blocks{margin-top:.5rem;max-height:38vh;overflow:auto;box-shadow:none}
.sp-source-hidden{display:none!important}
.sp-library-head{display:flex;justify-content:space-between;align-items:center;gap:.6rem;margin-bottom:.7rem}
.sp-library-head h3,.sp-library-head p{margin:0}
.sp-filters{display:grid;grid-template-columns:minmax(0,1fr) 210px 190px;gap:.55rem}
.sp-toggles{display:flex;gap:.45rem;flex-wrap:wrap;margin:.55rem 0 .8rem}
.sp-toggles label{display:flex;align-items:center;gap:.4rem;padding:.42rem .65rem;border:1px solid var(--line);border-radius:999px;background:#fff;font-size:.72rem}
.sp-toggles input{width:16px;height:16px;min-height:16px;margin:0;accent-color:var(--brand)}
.sp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(245px,1fr));gap:.8rem}
.sp-card{overflow:hidden;border:1px solid var(--line);border-radius:16px;background:#fff;box-shadow:0 4px 15px #0001}
.sp-card.recommended{outline:3px solid var(--accent)}
.sp-cover{position:relative;aspect-ratio:16/9;overflow:hidden;background:#173f35}
.sp-cover>img,.sp-cover>.sp-cover-canvas{width:100%;height:100%;display:block;object-fit:cover}
.sp-fallback{position:absolute;inset:0;display:grid;place-content:center;text-align:center;padding:1rem;color:#fff;background:linear-gradient(145deg,#173f35,#0d2e26)}
.sp-top{position:absolute;top:.45rem;left:.45rem;right:.45rem;display:flex;justify-content:space-between}
.sp-top>span,.sp-rec{padding:.2rem .45rem;border-radius:999px;font-size:.62rem;font-weight:800}
.sp-top>span{background:var(--brand);color:#fff}
.sp-rec{position:absolute;left:.45rem;bottom:.45rem;background:var(--accent)}
.sp-fav{width:34px;min-height:34px;padding:0;background:#fffffff0}
.sp-fav.active{background:var(--accent)}
.sp-name{position:absolute;left:0;right:0;bottom:0;padding:1.7rem .7rem .6rem;color:#fff;background:linear-gradient(transparent,#000c)}
.sp-name small,.sp-name strong{display:block}
.sp-name strong{text-shadow:0 1px 3px #0008}
.sp-body{padding:.7rem}
.sp-body p{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:3;margin:.45rem 0}
.sp-body>div{display:flex;gap:.4rem}
.sp-body>div>*{flex:1}
@media(max-width:900px){
  .sp-controls{grid-template-columns:1fr 1fr}
  .sp-filters{grid-template-columns:1fr 1fr}
  #sp-search{grid-column:1/-1}
}
@media(max-width:650px){
  .search-bar{padding-left:.7rem;padding-right:.7rem}
  .search-bar:before{padding:0 .55rem;font-size:.7rem}
  .session-plan-control{padding:.65rem}
  .sp-controls,.sp-filters{grid-template-columns:1fr}
  .sp-plan-head{align-items:flex-start;flex-direction:column}
  .sp-grid{grid-template-columns:1fr}
}`;
  document.head.append(style);
}

function queue() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(async () => {
    queued = false;
    await enhance();
  });
}

function install() {
  styles();
  styleSearch();
  const builder = $('#session-builder');
  if (builder && !observer) {
    observer = new MutationObserver(queue);
    observer.observe(builder, { childList: true, attributes: true, attributeFilter: ['class'] });
  }
  document.addEventListener('click', (event) => {
    if (event.target.closest('#new-session')) {
      objective = '';
      proposal = '';
      mode = 'all';
    }
    if (event.target.matches('.favorite-exercise')) {
      setTimeout(async () => {
        await flags();
        const form = $('#session-form');
        if (form) renderLibrary(form);
      }, 80);
    }
  });
  queue();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
}
