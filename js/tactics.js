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
});

export const FORMATION_NAMES = Object.freeze(['1-3-2-1', '1-2-3-1', '1-2-2-2']);

export function defaultTactic(format = 'F7', formation = '1-3-2-1') {
  const isF11 = format === 'F11';
  const formations = { '1-3-2-1': FORMATION_1321, '1-2-3-1': FORMATION_1231, '1-2-2-2': FORMATION_1222 };
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

const arrowClass = (kind) => ({ move: 'tac-move', dribble: 'tac-dribble', shot: 'tac-shot', pass: 'tac-pass' }[kind] || 'tac-pass');
const actionLabel = (kind) => ({ move: '- - - → = movimiento sin balón', dribble: '════→ = conducción', shot: '━━━━→ = disparo', pass: '────→ = pase' }[kind] || '────→ = pase');

// Renderiza la pizarra táctica como SVG con movimientos animados.
export function renderTacticBoard(tactic = {}) {
  const t = { ...defaultTactic(tactic.format || 'F7', tactic.formation), ...tactic };
  const markerId = `tac-arrow-${clean(t.id || 'nueva').replace(/[^a-z0-9-]/gi, '')}`;
  const parts = [];
  parts.push('<rect class="tac-field" x="4" y="4" width="92" height="92" rx="3"/>');
  parts.push('<path class="tac-line" d="M50 4v92 M4 50h92"/>');
  parts.push('<circle class="tac-line" cx="50" cy="50" r="9"/>');
  parts.push('<rect class="tac-area" x="4" y="4" width="92" height="16"/>');
  parts.push('<rect class="tac-area" x="4" y="80" width="92" height="16"/>');
  for (const move of (t.moves || [])) {
    const cls = arrowClass(move.kind);
    parts.push(`<path class="tac-arrow ${cls}" d="M${move.from.x} ${move.from.y} L${move.to.x} ${move.to.y}" marker-end="url(#${markerId})"/>`);
  }
  for (const p of (t.team || [])) {
    parts.push(`<g class="tac-player"><circle cx="${p.x}" cy="${p.y}" r="4.5"/><text x="${p.x}" y="${p.y + 1.7}">${xml(p.n)}</text></g>`);
  }
  for (const p of (t.opponent || [])) {
    parts.push(`<g class="tac-opponent"><circle cx="${p.x}" cy="${p.y}" r="4.5"/><text x="${p.x}" y="${p.y + 1.7}">${xml(p.n)}</text></g>`);
  }
  const ball = t.ball || { x: 50, y: 50 };
  const firstMove = (t.moves || [])[0];
  const ballPath = firstMove ? `M${firstMove.from.x} ${firstMove.from.y} L${firstMove.to.x} ${firstMove.to.y}` : `M${ball.x} ${ball.y} L${ball.x} ${ball.y}`;
  parts.push(`<circle class="tac-ball" r="2.4"><animateMotion dur="3s" repeatCount="indefinite" path="${ballPath}"/></circle>`);
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
