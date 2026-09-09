const clean = (value) => String(value ?? '').trim();
const xml = (value) => clean(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]);

const categoryCode = (category) => {
  if (category === 'Calentamiento') return 'C';
  if (category === 'Partido condicionado / Small-sided games') return 'P';
  if (category === 'Táctica') return 'T';
  return 'E';
};

const sentenceSteps = (item) => clean(item.description)
  .split(/(?<=[.!?])\s+/)
  .map((step) => step.trim())
  .filter(Boolean);

const intensityText = (item) => {
  if (item.intensity) return clean(item.intensity);
  const level = clean(item.difficulty) || 'Media';
  const explanations = {
    Baja: 'Baja: ritmo cómodo para entender el recorrido y corregir la técnica.',
    Media: 'Media: ritmo continuo con pausas breves para corregir.',
    Alta: 'Alta: acciones rápidas y concentradas, con recuperación suficiente para mantener calidad.',
  };
  return explanations[level] ?? `${level}: aumenta el ritmo solo cuando todos entiendan la tarea.`;
};

const genericMontage = (item) => [
  `Delimita ${clean(item.space) || 'el espacio indicado'} antes de llamar a los jugadores.`,
  `Prepara ${clean(item.material) || 'el material indicado'} y deja los balones accesibles fuera del recorrido.`,
  `Distribuye ${clean(item.players) || 'a los jugadores'} sin filas largas y señala claramente el punto de inicio.`,
  'Coloca al primer jugador en cada posición y entrega el balón únicamente a quien inicia la acción.',
];

const genericSteps = (item) => {
  const described = sentenceSteps(item);
  if (described.length >= 2) return described;
  const action = described[0] || `Los jugadores realizan ${clean(item.name).toLocaleLowerCase('es')}.`;
  return [
    'El entrenador muestra una repetición lenta y señala dónde empieza y termina la acción.',
    action,
    'Al terminar, el jugador sale del recorrido para no chocar con quien empieza.',
    'El siguiente jugador comienza cuando la zona de trabajo queda libre.',
  ];
};

export function completeExercise(item = {}) {
  const code = clean(item.code) || `${categoryCode(item.category)}-${clean(item.id).toUpperCase() || 'NUEVO'}`;
  const montage = Array.isArray(item.montage) && item.montage.length ? item.montage : genericMontage(item);
  const steps = Array.isArray(item.steps) && item.steps.length ? item.steps : genericSteps(item);
  const works = Array.isArray(item.works) && item.works.length
    ? item.works
    : [clean(item.category) || 'Técnica individual', clean(item.objective) || clean(item.description) || 'Comprensión de la tarea'];
  const observe = Array.isArray(item.observe) && item.observe.length
    ? item.observe
    : ['Que todos respeten el orden y el espacio.', 'Que la ejecución sea controlada antes de subir el ritmo.', 'Que el jugador mire antes de actuar.'];
  const corrections = Array.isArray(item.corrections) && item.corrections.length
    ? item.corrections
    : ['Balón cerca.', 'Mira antes.', 'Perfila el cuerpo.', 'Hazlo con calma.'];
  return {
    ...item,
    code,
    intensity: intensityText(item),
    objective: clean(item.objective) || clean(item.description) || `Aprender y repetir ${clean(item.name).toLocaleLowerCase('es')}.`,
    montage,
    steps,
    rotation: clean(item.rotation) || 'Después de ejecutar, el jugador avanza a la siguiente posición. El último vuelve al inicio por fuera del espacio, sin cruzar la acción.',
    works,
    lookFor: clean(item.lookFor) || 'Que cada jugador entienda su siguiente acción antes de aumentar la velocidad.',
    observe,
    corrections,
    ifBad: clean(item.ifBad) || 'Reduce la distancia, permite más tiempo y repite la demostración sin oposición.',
    ifGood: clean(item.ifGood) || clean(item.variants) || 'Reduce un toque o aumenta ligeramente el ritmo sin cambiar el recorrido.',
  };
}

const marker = (id) => `<defs><marker id="${id}" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6z"/></marker></defs>`;

const boundary = (space) => {
  const value = clean(space).toLocaleLowerCase('es');
  if (/triángulo|triangulo/.test(value)) return '<path class="board-boundary board-triangle" d="M50 6 L94 92 L6 92 Z"/>';
  if (/círculo|circulo|rondo/.test(value)) return '<circle class="board-boundary board-circle" cx="50" cy="50" r="44"/>';
  if (/cuadrado/.test(value)) return '<rect class="board-boundary board-square" x="6" y="6" width="88" height="88"/>';
  return '<rect class="board-boundary board-rectangle" x="4" y="16" width="92" height="68"/>';
};

const goal = (item) => {
  if (item.dir === 'left') return `<rect class="board-goal" x="1" y="${item.y - 10}" width="6" height="20"/>`;
  if (item.dir === 'top') return `<rect class="board-goal" x="${item.x - 10}" y="1" width="20" height="6"/>`;
  if (item.dir === 'bottom') return `<rect class="board-goal" x="${item.x - 10}" y="93" width="20" height="6"/>`;
  return `<rect class="board-goal" x="93" y="${item.y - 10}" width="6" height="20"/>`;
};

const arrowClass = (kind) => ({ move: 'board-move', dribble: 'board-dribble', shot: 'board-shot', pass: 'board-pass' }[kind] || 'board-pass');
const actionLabel = (kind) => ({ move: '- - - → = movimiento sin balón', dribble: '════→ = conducción', shot: '━━━━→ = disparo', pass: '────→ = pase' }[kind] || '────→ = pase');

function boardSvg(item, arrows, title, index) {
  const rawDiagram = item.diagram || {};
  const playerPositions = [[20, 20], [50, 14], [80, 20], [80, 80], [50, 86], [20, 80], [50, 50]];
  const conePositions = [[10, 10], [90, 10], [90, 90], [10, 90]];
  const diagram = {
    ...rawDiagram,
    players: Array.isArray(rawDiagram.players) ? rawDiagram.players : playerPositions.slice(0, Math.min(Number(rawDiagram.players) || 4, playerPositions.length)).map(([x, y], playerIndex) => ({ x, y, n: String.fromCharCode(65 + playerIndex) })),
    defenders: Array.isArray(rawDiagram.defenders) ? rawDiagram.defenders : [],
    cones: Array.isArray(rawDiagram.cones) ? rawDiagram.cones : conePositions.slice(0, Math.min(Number(rawDiagram.cones) || 0, conePositions.length)).map(([x, y]) => ({ x, y })),
    goals: Array.isArray(rawDiagram.goals) ? rawDiagram.goals : Array.from({ length: Math.min(Number(rawDiagram.goals) || 0, 2) }, (_, goalIndex) => ({ x: goalIndex ? 4 : 96, y: 50, dir: goalIndex ? 'left' : 'right' })),
    ball: rawDiagram.ball || (/bal[oó]n/i.test(item.material || '') ? { x: 24, y: 20 } : null),
  };
  const markerId = `board-arrow-${clean(item.id).replace(/[^a-z0-9-]/gi, '')}-${index}`;
  const usedKinds = [...new Set(arrows.map(({ kind }) => kind || 'pass'))];
  const parts = [boundary(item.space)];
  for (const itemGoal of (diagram.goals || [])) parts.push(goal(itemGoal));
  for (const cone of (diagram.cones || [])) parts.push(`<path class="board-cone" d="M${cone.x - 3} ${cone.y + 3} L${cone.x} ${cone.y - 4} L${cone.x + 3} ${cone.y + 3} Z"/>`);
  for (const arrow of arrows) parts.push(`<path class="board-arrow ${arrowClass(arrow.kind)}" d="M${arrow.x1} ${arrow.y1} L${arrow.x2} ${arrow.y2}" marker-end="url(#${markerId})"/>`);
  for (const player of (diagram.players || [])) parts.push(`<g class="board-player"><circle cx="${player.x}" cy="${player.y}" r="5"/><text x="${player.x}" y="${player.y + 1.8}">${xml(player.n)}</text></g>`);
  for (const defender of (diagram.defenders || [])) parts.push(`<g class="board-player board-defender"><circle cx="${defender.x}" cy="${defender.y}" r="5"/><text x="${defender.x}" y="${defender.y + 1.8}">${xml(defender.n)}</text></g>`);
  if (diagram.ball) parts.push(`<text class="board-ball" x="${diagram.ball.x + 4}" y="${diagram.ball.y + 3}">⚽</text>`);
  const labels = [];
  if ((diagram.cones || []).length) labels.push('▲ = cono');
  if (diagram.ball) labels.push('⚽ = balón');
  if ((diagram.players || []).length || (diagram.defenders || []).length) labels.push('A/B/C = jugadores');
  if ((diagram.goals || []).length) labels.push('▭ = portería');
  labels.push(...usedKinds.map(actionLabel));
  return `<figure class="exercise-board"><figcaption>${xml(title)}</figcaption><svg viewBox="0 0 100 100" role="img" aria-label="${xml(title)} de ${xml(item.name)}">${marker(markerId)}${parts.join('')}</svg><p class="board-legend"><strong>Leyenda:</strong> ${labels.join(' · ')}</p></figure>`;
}

export function renderBoardDiagrams(rawItem = {}) {
  const item = completeExercise(rawItem);
  const arrows = item.diagram?.arrows || [];
  if (!arrows.length) return boardSvg(item, [], 'Gráfico 1 · Posición y espacio', 1);
  const chunks = arrows.length > 4 ? [arrows.slice(0, Math.ceil(arrows.length / 2)), arrows.slice(Math.ceil(arrows.length / 2))] : [arrows];
  const figures = [boardSvg(item, [], 'Gráfico 1 · Posición inicial', 1)];
  chunks.slice(0, 2).forEach((chunk, index) => figures.push(boardSvg(item, chunk, `Gráfico ${index + 2} · Acción ${index + 1}`, index + 2)));
  return `<div class="exercise-board-sequence">${figures.join('')}</div>`;
}

export function sessionBlockType(category) {
  if (category === 'Calentamiento') return 'warmup';
  if (category === 'Partido condicionado / Small-sided games') return 'final';
  return 'main';
}

export function addExerciseToSession(session = {}, exercise = {}) {
  const block = {
    type: sessionBlockType(exercise.category),
    exerciseId: exercise.id,
    duration: Number(exercise.duration) || 1,
    notes: '',
  };
  const blocks = [...(session.blocks || []), block];
  return { ...session, blocks, totalDuration: blocks.reduce((sum, item) => sum + Number(item.duration || 0), 0) };
}

export function moveSessionBlock(blocks, index, direction) {
  const copy = (blocks || []).map((block) => ({ ...block }));
  const target = index + direction;
  if (index < 0 || index >= copy.length || target < 0 || target >= copy.length) return copy;
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}

export function removeSessionBlock(blocks, index) {
  return (blocks || []).filter((_, blockIndex) => blockIndex !== index).map((block) => ({ ...block }));
}

export function sessionDurationStatus(blocks = [], target = 60) {
  const goal = Number(target) > 0 ? Number(target) : 60;
  const total = blocks.reduce((sum, block) => sum + (Number(block.duration) || 0), 0);
  const difference = goal - total;
  const exact = difference === 0;
  const message = exact
    ? `Sesión completa: ${goal} min exactos.`
    : difference > 0 ? `Faltan ${difference} min para llegar a ${goal}.` : `Sobran ${Math.abs(difference)} min: ajusta los bloques hasta ${goal}.`;
  return { total, difference, exact, message };
}

export function buildFlexibleTrainingSession(values = {}, metadata = {}) {
  const date = clean(values.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new TypeError('Selecciona una fecha válida para la sesión.');
  const available = new Set(metadata.availableExerciseIds || []);
  const blocks = (values.blocks || []).map((block) => {
    if (!available.has(block.exerciseId)) throw new TypeError('La sesión contiene un ejercicio que ya no está disponible.');
    const duration = Number(block.duration);
    if (!Number.isInteger(duration) || duration < 1 || duration > 60) throw new RangeError('Cada bloque debe durar entre 1 y 60 minutos.');
    return { type: block.type, exerciseId: block.exerciseId, duration, notes: clean(block.notes) };
  });
  if (!blocks.length) throw new RangeError('Añade al menos un ejercicio a la sesión.');
  const target = Number(values.targetDuration) > 0 ? Number(values.targetDuration) : 60;
  const status = sessionDurationStatus(blocks, target);
  return {
    id: metadata.id,
    recordType: 'trainingSession',
    date,
    name: clean(values.name) || 'Sesión de entrenamiento',
    targetDuration: target,
    material: clean(values.material),
    notes: clean(values.notes),
    blocks,
    totalDuration: status.total,
    createdAt: metadata.createdAt,
    updatedAt: metadata.now,
  };
}
