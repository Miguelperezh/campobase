// Fase 3 — Tácticas: pizarra táctica con formaciones reales (F7) y explicación
// de ataque y defensa, basada en el manual de campo de Migue (Unión Viera Alevín D).
// Formato de una táctica:
//   { id, recordType:'tactic', name, rival, situation, format:'F7'|'F11',
//     formation:'1-3-2-1'|'1-2-3-1'|'1-2-2-2'|'custom',
//     team:[{x,y,n,pos}], opponent:[{x,y,n}], ball:{x,y},
//     moves:[{from:{x,y},to:{x,y},kind:'pass'|'move'|'dribble'|'shot',label}],
//     attack:[...], defense:[...], notes, createdAt, updatedAt }

const clean = (value) => String(value ?? '').trim();

export const TACTIC_FORMATS = Object.freeze(['F7', 'F11']);

// Formaciones F7 del manual de Migue (coordenadas en viewBox 0..100, campo vertical).
// 1-3-2-1: 1 portero · 2/3 defensas · 4 central (se incorpora) · 7/11 medios · 9 delantero
const FORMATION_1321 = Object.freeze([
  { x: 50, y: 90, n: '1', pos: 'Portero' },
  { x: 25, y: 72, n: '2', pos: 'Defensa izq.' },
  { x: 50, y: 76, n: '3', pos: 'Defensa der.' },
  { x: 50, y: 62, n: '4', pos: 'Central (se incorpora)' },
  { x: 30, y: 48, n: '7', pos: 'Medio/banda izq.' },
  { x: 70, y: 48, n: '11', pos: 'Medio/banda der.' },
  { x: 50, y: 30, n: '9', pos: 'Delantero' },
]);

// 1-2-3-1: 1 portero · 2/3 defensas · 4 mediocentro · 7/11 medios · 9 delantero
const FORMATION_1231 = Object.freeze([
  { x: 50, y: 90, n: '1', pos: 'Portero' },
  { x: 30, y: 74, n: '2', pos: 'Defensa izq.' },
  { x: 70, y: 74, n: '3', pos: 'Defensa der.' },
  { x: 50, y: 60, n: '4', pos: 'Mediocentro' },
  { x: 30, y: 46, n: '7', pos: 'Medio/banda izq.' },
  { x: 70, y: 46, n: '11', pos: 'Medio/banda der.' },
  { x: 50, y: 30, n: '9', pos: 'Delantero' },
]);

// 1-2-2-2: 1 portero · 2/3 defensas · 4/7 medios · 11/9 arriba
const FORMATION_1222 = Object.freeze([
  { x: 50, y: 90, n: '1', pos: 'Portero' },
  { x: 30, y: 74, n: '2', pos: 'Defensa izq.' },
  { x: 70, y: 74, n: '3', pos: 'Defensa der.' },
  { x: 40, y: 58, n: '4', pos: 'Medio' },
  { x: 60, y: 58, n: '7', pos: 'Medio' },
  { x: 35, y: 38, n: '11', pos: 'Delantero izq.' },
  { x: 65, y: 38, n: '9', pos: 'Delantero der.' },
]);

const FORMATION_1312 = Object.freeze([
  { x: 50, y: 90, n: '1', pos: 'Portero' },
  { x: 24, y: 72, n: '2', pos: 'Defensa izq.' },
  { x: 50, y: 75, n: '4', pos: 'Defensa central' },
  { x: 76, y: 72, n: '3', pos: 'Defensa der.' },
  { x: 50, y: 55, n: '7', pos: 'Mediocentro' },
  { x: 34, y: 34, n: '11', pos: 'Delantero izq.' },
  { x: 66, y: 34, n: '9', pos: 'Delantero der.' },
]);

const FORMATION_1132 = Object.freeze([
  { x: 50, y: 90, n: '1', pos: 'Portero' },
  { x: 50, y: 73, n: '4', pos: 'Cierre' },
  { x: 24, y: 55, n: '2', pos: 'Medio izq.' },
  { x: 50, y: 57, n: '7', pos: 'Mediocentro' },
  { x: 76, y: 55, n: '3', pos: 'Medio der.' },
  { x: 36, y: 34, n: '11', pos: 'Delantero izq.' },
  { x: 64, y: 34, n: '9', pos: 'Delantero der.' },
]);

const F7_OPPONENT = Object.freeze([
  { x: 50, y: 10, n: '1' },
  { x: 30, y: 28, n: '2' },
  { x: 50, y: 24, n: '3' },
  { x: 70, y: 28, n: '4' },
  { x: 30, y: 50, n: '5' },
  { x: 50, y: 54, n: '6' },
  { x: 70, y: 50, n: '7' },
]);

const F11_TEAM = Object.freeze([
  { x: 50, y: 92, n: '1', pos: 'Portero' },
  { x: 20, y: 78, n: '2', pos: 'Lateral izq.' },
  { x: 40, y: 80, n: '3', pos: 'Central' },
  { x: 60, y: 80, n: '4', pos: 'Central' },
  { x: 80, y: 78, n: '5', pos: 'Lateral der.' },
  { x: 30, y: 60, n: '6', pos: 'Mediocentro' },
  { x: 50, y: 58, n: '8', pos: 'Mediocentro' },
  { x: 70, y: 60, n: '10', pos: 'Mediapunta' },
  { x: 25, y: 40, n: '7', pos: 'Extremo izq.' },
  { x: 50, y: 36, n: '9', pos: 'Delantero' },
  { x: 75, y: 40, n: '11', pos: 'Extremo der.' },
]);
const F11_OPPONENT = Object.freeze([
  { x: 50, y: 8, n: '1' },
  { x: 20, y: 22, n: '2' },
  { x: 40, y: 20, n: '3' },
  { x: 60, y: 20, n: '4' },
  { x: 80, y: 22, n: '5' },
  { x: 30, y: 40, n: '6' },
  { x: 50, y: 42, n: '8' },
  { x: 70, y: 40, n: '10' },
  { x: 25, y: 60, n: '7' },
  { x: 50, y: 64, n: '9' },
  { x: 75, y: 60, n: '11' },
]);

// Explicación táctica de cada formación (del manual de Migue).
export const FORMATION_GUIDES = Object.freeze({
  '1-3-2-1': {
    name: 'Sistema base · 1-3-2-1',
    queBusco: 'Parto de tres jugadores protegiendo por detrás del balón, dos medios y un delantero. El sistema debe dar seguridad sin convertir al equipo en un bloque estático. Las posiciones son referencias iniciales; los jugadores se mueven según la jugada.',
    conBalon: [
      '2 y 3 dan amplitud en la primera línea.',
      '7 y 11 ofrecen líneas de pase por fuera y por dentro.',
      '9 mantiene profundidad y evita venir siempre al balón.',
      '4 puede abandonar la línea de tres y sumarse al mediocampo cuando existe equilibrio detrás.',
    ],
    sinBalon: [
      '3 jugadores protegen por detrás del balón.',
      'El 4 protege primero el centro.',
      'Si 2 o 3 salen a banda, el 4 corrige por dentro y cubre el espacio.',
      'No perseguir rivales por todo el campo: proteger la estructura.',
    ],
    alPerder: [
      'El 4 recupera la zona central entre 3 y 2.',
      'Correcciones: «4, vuelve», «4, entre los dos», «4, cierra dentro».',
    ],
  },
  '1-2-3-1': {
    name: 'Variante 1 · 1-2-3-1',
    queBusco: 'La utilizo cuando necesito más presencia estable en mediocampo y puedo asumir jugar con dos defensas. El 4 actúa ya como mediocentro claro.',
    conBalon: [
      'Tres referencias en mediocampo.',
      'Más apoyos para salir y circular.',
      '7 y 11 pueden dar amplitud sin dejar solo al 4.',
    ],
    sinBalon: [
      '2 y 3 no pueden quedar demasiado separados.',
      'Si 4 se va demasiado arriba, aparece espacio delante de los defensas.',
      'Tras pérdida, 4 debe reaccionar rápido para proteger el centro.',
    ],
    alPerder: ['El 4 reacciona rápido para proteger el centro.'],
  },
  '1-2-2-2': {
    name: 'Variante 2 · 1-2-2-2',
    queBusco: 'La valoro cuando necesito más presencia arriba, el 9 está muy aislado o el rival defiende muy atrás. No es una orden automática por ir perdiendo.',
    conBalon: [
      'Más presencia arriba con dos delanteros.',
      'Los dos medios dan equilibrio.',
    ],
    sinBalon: [
      'Regla de equilibrio: si uno de los dos medios avanza claramente, el otro mantiene equilibrio.',
      'Si ambos suben a la vez, el equipo queda abierto por dentro.',
    ],
    alPerder: ['Un medio mantiene equilibrio mientras el otro presiona.'],
  },
  '1-3-1-2': {
    name: 'Variante 3 · 1-3-1-2',
    queBusco: 'Mantengo una primera línea de tres y añado dos referencias arriba. Es útil para fijar a los defensas rivales y atacar con apoyos cercanos sin renunciar a la protección de la portería.',
    conBalon: [
      'Los dos delanteros se separan para no ocupar el mismo carril.',
      'El 7 se ofrece por detrás del balón y decide hacia qué lado continuar.',
      '2 y 3 avanzan por turno; si uno sube, los otros dos defensas guardan equilibrio.',
    ],
    sinBalon: [
      'El 7 protege el espacio central delante de los tres defensas.',
      'El punta más cercano orienta la salida rival hacia una banda y el otro cierra el pase interior.',
      'La línea de tres bascula junta, sin perseguir fuera de su zona.',
    ],
    alPerder: ['El 7 frena el primer pase y los dos delanteros regresan por dentro antes de abrirse.'],
  },
  '1-1-3-2': {
    name: 'Variante 4 · 1-1-3-2',
    queBusco: 'Busco superioridad en mediocampo y dos jugadores cerca de portería. Es una estructura ofensiva para momentos controlados: exige que el cierre lea bien la cobertura y que los medios reaccionen juntos tras pérdida.',
    conBalon: [
      'Los medios exteriores dan amplitud y el 7 ofrece apoyo por dentro.',
      'Los dos delanteros alternan apoyo y profundidad: uno viene y el otro ataca el espacio.',
      'El cierre conduce solo si un medio ocupa su espalda y existe pase seguro.',
    ],
    sinBalon: [
      'Los tres medios forman una línea estrecha delante del cierre.',
      'No permitir un pase directo por el centro; orientar al rival hacia fuera.',
      'El portero juega adelantado para proteger el espacio a la espalda del cierre.',
    ],
    alPerder: ['El medio más cercano presiona; los otros dos cierran dentro y uno de los delanteros baja a ayudar.'],
  },
});

export const FORMATION_NAMES = Object.freeze(['1-3-2-1', '1-2-3-1', '1-2-2-2', '1-3-1-2', '1-1-3-2']);

export function defaultTactic(format = 'F7', formation = '1-3-2-1') {
  const isF11 = format === 'F11';
  const formations = { '1-3-2-1': FORMATION_1321, '1-2-3-1': FORMATION_1231, '1-2-2-2': FORMATION_1222, '1-3-1-2': FORMATION_1312, '1-1-3-2': FORMATION_1132 };
  const team = isF11
    ? F11_TEAM.map((p) => ({ ...p }))
    : (formations[formation] || FORMATION_1321).map((p) => ({ ...p }));
  return {
    format,
    formation: isF11 ? 'custom' : (FORMATION_NAMES.includes(formation) ? formation : '1-3-2-1'),
    team,
    opponent: (isF11 ? F11_OPPONENT : F7_OPPONENT).map((p) => ({ ...p })),
    ball: { x: 50, y: 50 },
    moves: [],
    attack: [],
    defense: [],
  };
}

const xml = (value) => clean(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);

const arrowClass = (kind) => ({ move: 'tac-move', dribble: 'tac-dribble', shot: 'tac-shot', pass: 'tac-pass', sprint: 'tac-sprint' }[kind] || 'tac-pass');
const actionLabel = (kind) => ({ move: '- - - → = movimiento sin balón', dribble: '════→ = conducción', shot: '━━━━→ = disparo', pass: '────→ = pase', sprint: '≋≋≋→ = sprint' }[kind] || '────→ = pase');

// Herramientas de la pizarra interactiva.
export const TACTIC_TOOLS = Object.freeze([
  { id: 'select', label: 'Mover', icon: '✋' },
  { id: 'pass', label: 'Pase', icon: '➜' },
  { id: 'move', label: 'Movimiento', icon: '↝' },
  { id: 'dribble', label: 'Conducción', icon: '⚡' },
  { id: 'shot', label: 'Disparo', icon: '🎯' },
  { id: 'sprint', label: 'Sprint', icon: '💨' },
  { id: 'ball', label: 'Balón', icon: '⚽' },
]);

const TOOL_KINDS = new Set(['pass', 'move', 'dribble', 'shot', 'sprint']);

// Crea una flecha táctica; devuelve null si el trazo es demasiado corto.
export function createTacticMove(from, to, kind) {
  if (!TOOL_KINDS.has(kind)) throw new TypeError('Herramienta de flecha no válida.');
  if (Math.hypot(to.x - from.x, to.y - from.y) <= 2) return null;
  return { from: { ...from }, to: { ...to }, kind };
}

// Mueve una pieza (jugador, rival o balón) sin mutar la táctica original y
// limitando las coordenadas al campo (4..96).
export function moveTacticPiece(tactic, side, idx, point) {
  const t = { ...tactic, team: tactic.team.map((p) => ({ ...p })), opponent: tactic.opponent.map((p) => ({ ...p })), ball: { ...tactic.ball } };
  const clamp = (v) => Math.max(4, Math.min(96, v));
  const p = { x: clamp(point.x), y: clamp(point.y) };
  if (side === 'team') { if (!t.team[idx]) throw new TypeError('Pieza no válida.'); t.team[idx] = { ...t.team[idx], ...p }; }
  else if (side === 'opponent') { if (!t.opponent[idx]) throw new TypeError('Pieza no válida.'); t.opponent[idx] = { ...t.opponent[idx], ...p }; }
  else if (side === 'ball') { t.ball = p; }
  else throw new TypeError('Pieza no válida.');
  return t;
}

// Renderiza la pizarra táctica como SVG interactivo (arrastrar jugadores,
// dibujar flechas, colocar balón). Los elementos llevan data-atributos para
// que app.js maneje los eventos de puntero.
export function renderTacticBoard(tactic = {}, options = {}) {
  const t = { ...defaultTactic(tactic.format || 'F7', tactic.formation), ...tactic };
  const editable = options.editable !== false;
  const markerId = `tac-arrow-${clean(t.id || 'nueva').replace(/[^a-z0-9-]/gi, '')}`;
  const parts = [];
  parts.push('<rect class="tac-field" x="4" y="4" width="92" height="92" rx="3"/>');
  parts.push('<path class="tac-line" d="M50 4v92 M4 50h92"/>');
  parts.push('<circle class="tac-line" cx="50" cy="50" r="9"/>');
  parts.push('<rect class="tac-area" x="4" y="4" width="92" height="16"/>');
  parts.push('<rect class="tac-area" x="4" y="80" width="92" height="16"/>');
  if (editable) parts.push('<rect class="tac-capture" x="4" y="4" width="92" height="92" data-piece="capture"/>');
  for (const move of (t.moves || [])) {
    const cls = arrowClass(move.kind);
    parts.push(`<path class="tac-arrow ${cls}" d="M${move.from.x} ${move.from.y} L${move.to.x} ${move.to.y}" marker-end="url(#${markerId})" data-piece="arrow" data-kind="${xml(move.kind)}"/>`);
  }
  for (let i = 0; i < (t.team || []).length; i++) {
    const p = t.team[i];
    parts.push(`<g class="tac-player" data-piece="team" data-idx="${i}"><circle cx="${p.x}" cy="${p.y}" r="3.2"/><text x="${p.x}" y="${p.y + 1.2}">${xml(p.n)}</text></g>`);
  }
  for (let i = 0; i < (t.opponent || []).length; i++) {
    const p = t.opponent[i];
    parts.push(`<g class="tac-opponent" data-piece="opponent" data-idx="${i}"><circle cx="${p.x}" cy="${p.y}" r="3.2"/><text x="${p.x}" y="${p.y + 1.2}">${xml(p.n)}</text></g>`);
  }
  const ball = t.ball || { x: 50, y: 50 };
  parts.push(`<g class="tac-ball" data-piece="ball"><circle cx="${ball.x}" cy="${ball.y}" r="2.2"/></g>`);
  const usedKinds = [...new Set((t.moves || []).map((m) => m.kind || 'pass'))];
  const labels = ['<span class="tac-legend-team">●</span> = mi equipo', '<span class="tac-legend-rival">●</span> = rival', '⚽ = balón'];
  labels.push(...usedKinds.map(actionLabel));
  return `<figure class="tactic-board"><svg viewBox="0 0 100 100" role="img" aria-label="Pizarra táctica de ${xml(t.name || 'táctica')}">${marker(markerId)}${parts.join('')}</svg><p class="board-legend"><strong>Leyenda:</strong> ${labels.join(' · ')}</p></figure>`;
}

const marker = (id) => `<defs><marker id="${id}" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6z"/></marker></defs>`;

export function buildTactic(values, metadata = {}) {
  const name = clean(values.name);
  if (!name) throw new TypeError('La táctica necesita un nombre.');
  const format = clean(values.format) || 'F7';
  if (!TACTIC_FORMATS.includes(format)) throw new TypeError('Selecciona un formato válido.');
  const formation = clean(values.formation) || '1-3-2-1';
  return {
    id: metadata.id,
    recordType: 'tactic',
    name,
    rival: clean(values.rival),
    situation: clean(values.situation),
    format,
    formation: FORMATION_NAMES.includes(formation) ? formation : 'custom',
    team: Array.isArray(values.team) ? values.team : defaultTactic(format, formation).team,
    opponent: Array.isArray(values.opponent) ? values.opponent : defaultTactic(format, formation).opponent,
    ball: values.ball || { x: 50, y: 50 },
    moves: Array.isArray(values.moves) ? values.moves : [],
    attack: Array.isArray(values.attack) ? values.attack : [],
    defense: Array.isArray(values.defense) ? values.defense : [],
    notes: clean(values.notes),
    createdAt: metadata.createdAt,
    updatedAt: metadata.now,
  };
}

export function sortTactics(tactics) {
  if (!Array.isArray(tactics)) throw new TypeError('Las tácticas deben ser una lista.');
  return [...tactics].sort((a, b) => String(b.updatedAt || 0) - String(a.updatedAt || 0));
}
