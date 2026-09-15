import { findValidatedExercise } from './ejercicios-validados.js';

const hasBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

const clean = (value = '') => String(value ?? '').replace(/^--\s*/, '').replace(/\s+/g, ' ').trim();
const norm = (value = '') => clean(value).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('es');

export function normalizeSpanishFootballText(value = '') {
  return String(value ?? '')
    .replace(/\bpase\s+de\s+chip\b/gi, 'pase picado')
    .replace(/\bpase\s+chip\b/gi, 'pase picado')
    .replace(/\btiro\s+de\s+chip\b/gi, 'remate picado')
    .replace(/\btiro\s+chip\b/gi, 'remate picado')
    .replace(/\bhacer\s+un\s+chip\b/gi, 'picar el balón')
    .replace(/\bchips\b/gi, 'balones picados')
    .replace(/\bchip\b/gi, 'balón picado');
}

function flatten(value, output = []) {
  if (value === null || value === undefined) return output;
  if (typeof value === 'string' || typeof value === 'number') {
    output.push(String(value));
    return output;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => flatten(item, output));
    return output;
  }
  if (typeof value === 'object') {
    Object.values(value).forEach((item) => flatten(item, output));
  }
  return output;
}

function corpusForExercise(exercise = {}) {
  return norm(flatten({
    nombre: exercise.nombre,
    categoria: exercise.categoria,
    etiquetas: exercise.etiquetas,
    objetivo: exercise.objetivo_principal,
    secundarios: exercise.objetivos_secundarios,
    queTrabaja: exercise.que_se_trabaja,
    vistaRapida: exercise.vista_rapida,
    detalle: exercise.detalle,
    montaje: exercise.montaje,
    comoSeHace: exercise.como_se_hace,
    fases: exercise.fases,
    observar: exercise.que_observar,
    errores: exercise.errores_frecuentes,
    variantes: exercise.variantes,
  }).join(' '));
}

function addUnique(items, label) {
  const key = norm(label);
  if (!key || items.some((item) => norm(item) === key)) return;
  items.push(label);
}

export function deriveTrainingFocus(exercise = {}) {
  const text = corpusForExercise(exercise);
  const items = [];
  const has = (pattern) => pattern.test(text);

  const oneVOne = has(/\b1\s*(?:v|x|contra)\s*1\b|\buno contra uno\b|\bduelo\b/);
  const defensive = has(/defens|temporiz|replieg|cobertura|bascul|marcaje|intercept|orientar al atacante|cerrar.*centro|proteger.*zona/);
  const attacking = has(/atac|regate|desbord|superar al defensor|finaliz|remate|tiro|progres|profund|amplitud/);

  if (oneVOne && defensive) {
    addUnique(items, 'Táctica defensiva: 1v1, temporización y control de la distancia.');
    if (has(/central|banda|orient|fuera|zona menos peligrosa/)) addUnique(items, 'Orientación defensiva: llevar al atacante hacia una zona menos peligrosa.');
  } else if (oneVOne && attacking) {
    addUnique(items, 'Técnica ofensiva: regate, protección y superación del defensor en 1v1.');
  } else if (oneVOne) {
    addUnique(items, 'Duelos 1v1: lectura del rival y elección del momento de actuar.');
  }

  if (has(/pase|pared|triangul|circulacion|recepcion|recepción|control orientado|primer toque/)) {
    addUnique(items, 'Técnica: pase, recepción y control orientado.');
  }
  if (has(/regate|drib|conduccion|conducción|slalom|cambio de direccion|cambio de dirección/)) {
    addUnique(items, 'Técnica individual: conducción, regate y cambios de dirección.');
  }
  if (has(/finaliz|remate|tiro|definicion|definición|golpear a porteria|golpear a portería/)) {
    addUnique(items, 'Finalización: elección y ejecución del remate.');
  }
  if (has(/posesion|posesión|conservar|conservacion|conservación|lineas de pase|líneas de pase|apoyo|tercer hombre/)) {
    addUnique(items, 'Táctica ofensiva: conservación, apoyos y creación de líneas de pase.');
  }
  if (has(/amplitud|profundidad|ocupacion de espacios|ocupación de espacios|juego posicional|fijar|progresion|progresión/)) {
    addUnique(items, 'Táctica ofensiva: ocupación de espacios, amplitud y progresión.');
  }
  if (has(/presion|presión|robo|recuperacion|recuperación|cobertura|bascul|replieg|marcaje/)) {
    addUnique(items, 'Táctica defensiva: presión, coberturas y recuperación del balón.');
  }
  if (has(/transicion|transición|tras perdida|tras pérdida|tras recuper|cambio de rol|contraataque/)) {
    addUnique(items, 'Transiciones: reacción al cambio de posesión y cambio rápido de rol.');
  }
  if (has(/toma de decision|toma de decisión|decidir|decision|decisión|elegir|lectura del juego|leer.*juego/)) {
    addUnique(items, 'Toma de decisiones: elegir la acción adecuada según rival, espacio y compañeros.');
  }
  if (has(/reaccion|reacción|reactiv|estimulo|estímulo|señal|psicocinet/)) {
    addUnique(items, 'Percepción y reacción: responder con rapidez a estímulos y cambios de situación.');
  }
  if (has(/coordin|agilidad|escalera|apoyos.*pies|ritmo de pies|motric/)) {
    addUnique(items, 'Coordinación y agilidad: apoyos, ritmo y cambios de dirección.');
  }
  if (has(/velocidad|aceleracion|aceleración|sprint|explosiv/)) {
    addUnique(items, 'Capacidad física: aceleración y velocidad aplicada a la acción de juego.');
  }
  if (has(/resistencia|intermitente|aerob|anaerob/)) {
    addUnique(items, 'Capacidad física: resistencia específica con acciones de fútbol.');
  }
  if (has(/fuerza|salto|potencia/)) {
    addUnique(items, 'Capacidad física: fuerza y potencia aplicadas al gesto futbolístico.');
  }
  if (has(/portero|blocaje|estirada|salida.*porter|juego de pies.*porter/)) {
    addUnique(items, 'Portero: colocación, intervención y toma de decisión ante la acción.');
  }
  if (has(/cabece|juego aereo|juego aéreo|balon aereo|balón aéreo/)) {
    addUnique(items, 'Juego aéreo: orientación corporal, timing y contacto con el balón.');
  }

  if (!items.length) {
    const category = norm(exercise.categoria || exercise.vista_rapida?.tipo_principal || '');
    if (/calent|activ/.test(category)) addUnique(items, 'Activación: movilidad, coordinación y preparación para la tarea principal.');
    else if (/tactic/.test(category)) addUnique(items, 'Táctica: comprensión de la situación, ocupación del espacio y toma de decisiones.');
    else if (/tecn/.test(category)) addUnique(items, 'Técnica: calidad de ejecución del gesto con balón.');
    else if (/coord|agil/.test(category)) addUnique(items, 'Coordinación y agilidad aplicadas a movimientos propios del fútbol.');
    else if (/fisic/.test(category)) addUnique(items, 'Capacidad física integrada con acciones específicas de fútbol.');
    else addUnique(items, 'Comprensión y ejecución de la situación de juego propuesta.');
  }

  // En campo interesa poder leerlo de un vistazo: como máximo cuatro contenidos.
  return items.slice(0, 4).map(normalizeSpanishFootballText);
}

export function exerciseObjective(exercise = {}) {
  const candidates = [
    exercise.objetivo_principal,
    ...(Array.isArray(exercise.detalle?.objetivos) ? exercise.detalle.objetivos : []),
    ...(Array.isArray(exercise.detalle?.que_buscamos) ? exercise.detalle.que_buscamos : []),
    exercise.vista_rapida?.explicacion_breve,
  ];
  return normalizeSpanishFootballText(clean(candidates.find((item) => clean(item)) || ''));
}

function replaceTextNodes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const next = normalizeSpanishFootballText(node.nodeValue || '');
    if (next !== node.nodeValue) node.nodeValue = next;
  });
}

function applyExerciseQuality(exerciseId) {
  const body = document.getElementById('exercise-detail-body');
  if (!body || !exerciseId) return;
  const exercise = findValidatedExercise(exerciseId);
  if (!exercise) return;

  replaceTextNodes(body);

  const focus = deriveTrainingFocus(exercise);
  const section = body.querySelector('#section-que-se-trabaja');
  if (section) {
    let container = section.querySelector('.pills-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'pills-container';
      section.appendChild(container);
    }
    container.innerHTML = focus.map((item) => `<span class="pill-tag">${item.replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char])}</span>`).join('');
  }

  const objective = exerciseObjective(exercise);
  const objectiveBox = body.querySelector('#section-objetivo .main-objective-box');
  if (objectiveBox && objective) objectiveBox.textContent = objective;

  body.dataset.exerciseQualityId = exerciseId;
}

function install() {
  let currentExerciseId = '';
  let queued = false;
  const schedule = () => {
    if (!currentExerciseId || queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      applyExerciseQuality(currentExerciseId);
    });
  };

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-exercise-id]');
    if (!trigger?.dataset.exerciseId) return;
    currentExerciseId = trigger.dataset.exerciseId;
    const body = document.getElementById('exercise-detail-body');
    if (body) body.dataset.exerciseQualityId = '';
    schedule();
  }, true);

  const body = document.getElementById('exercise-detail-body');
  if (body) {
    const observer = new MutationObserver(() => {
      if (!currentExerciseId) return;
      if (body.dataset.exerciseQualityId === currentExerciseId) {
        replaceTextNodes(body);
        return;
      }
      schedule();
    });
    observer.observe(body, { childList: true, subtree: true });
  }
}

if (hasBrowser) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
}
