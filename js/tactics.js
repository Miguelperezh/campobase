// Fase 3 — Tácticas: pizarra táctica con movimientos animados (F7 y F11)
// y tácticas guardadas por rival o situación.
// Formato de una táctica:
//   { id, recordType:'tactic', name, rival, situation, format:'F7'|'F11',
//     team:[{x,y,n}], opponent:[{x,y,n}], ball:{x,y},
//     moves:[{from:{x,y},to:{x,y},kind:'pass'|'move'|'dribble'|'shot',label}],
//     notes, createdAt, updatedAt }

const clean = (value) => String(value ?? '').trim();

export const TACTIC_FORMATS = Object.freeze(['F7', 'F11']);

// Posiciones iniciales por formato (coordenadas en viewBox 0..100, campo vertical).
const F7_TEAM = Object.freeze([
  { x: 50, y: 88, n: '1' },   // portero
  { x: 30, y: 70, n: '2' },   // lateral izq
  { x: 50, y: 74, n: '3' },   // central
  { x: 70, y: 70, n: '4' },   // lateral der
  { x: 30, y: 50, n: '5' },   // interior izq
  { x: 50, y: 46, n: '6' },   // pivote
  { x: 70, y: 50, n: '7' },   // interior der
]);
const F7_OPPONENT = Object.freeze([
  { x: 50, y: 12, n: '1' },
  { x: 30, y: 30, n: '2' },
  { x: 50, y: 26, n: '3' },
  { x: 70, y: 30, n: '4' },
  { x: 30, y: 50, n: '5' },
  { x: 50, y: 54, n: '6' },
  { x: 70, y: 50, n: '7' },
]);
const F11_TEAM = Object.freeze([
  { x: 50, y: 92, n: '1' },
  { x: 20, y: 78, n: '2' },
  { x: 40, y: 80, n: '3' },
  { x: 60, y: 80, n: '4' },
  { x: 80, y: 78, n: '5' },
  { x: 30, y: 60, n: '6' },
  { x: 50, y: 58, n: '8' },
  { x: 70, y: 60, n: '10' },
  { x: 25, y: 40, n: '7' },
  { x: 50, y: 36, n: '9' },
  { x: 75, y: 40, n: '11' },
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

export function defaultTactic(format = 'F7') {
  const isF11 = format === 'F11';
  return {
    format,
    team: (isF11 ? F11_TEAM : F7_TEAM).map((p) => ({ ...p })),
    opponent: (isF11 ? F11_OPPONENT : F7_OPPONENT).map((p) => ({ ...p })),
    ball: { x: 50, y: 50 },
    moves: [],
  };
}

const xml = (value) => clean(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);

const arrowClass = (kind) => ({ move: 'tac-move', dribble: 'tac-dribble', shot: 'tac-shot', pass: 'tac-pass' }[kind] || 'tac-pass');
const actionLabel = (kind) => ({ move: '- - - → = movimiento sin balón', dribble: '════→ = conducción', shot: '━━━━→ = disparo', pass: '────→ = pase' }[kind] || '────→ = pase');

// Renderiza la pizarra táctica como SVG con movimientos animados.
export function renderTacticBoard(tactic = {}) {
  const t = { ...defaultTactic(tactic.format || 'F7'), ...tactic };
  const markerId = `tac-arrow-${clean(t.id || 'nueva').replace(/[^a-z0-9-]/gi, '')}`;
  const parts = [];
  // Campo (vertical)
  parts.push('<rect class="tac-field" x="4" y="4" width="92" height="92" rx="3"/>');
  parts.push('<path class="tac-line" d="M50 4v92 M4 50h92"/>');
  parts.push('<circle class="tac-line" cx="50" cy="50" r="9"/>');
  // Áreas
  parts.push('<rect class="tac-area" x="4" y="4" width="92" height="16"/>');
  parts.push('<rect class="tac-area" x="4" y="80" width="92" height="16"/>');
  // Flechas de movimiento (animadas con animateMotion sobre el balón y líneas)
  for (const move of (t.moves || [])) {
    const cls = arrowClass(move.kind);
    parts.push(`<path class="tac-arrow ${cls}" d="M${move.from.x} ${move.from.y} L${move.to.x} ${move.to.y}" marker-end="url(#${markerId})"/>`);
  }
  // Jugadores del equipo (círculos rojos)
  for (const p of (t.team || [])) {
    parts.push(`<g class="tac-player"><circle cx="${p.x}" cy="${p.y}" r="4.5"/><text x="${p.x}" y="${p.y + 1.7}">${xml(p.n)}</text></g>`);
  }
  // Rival (círculos negros)
  for (const p of (t.opponent || [])) {
    parts.push(`<g class="tac-opponent"><circle cx="${p.x}" cy="${p.y}" r="4.5"/><text x="${p.x}" y="${p.y + 1.7}">${xml(p.n)}</text></g>`);
  }
  // Balón animado siguiendo el primer movimiento
  const ball = t.ball || { x: 50, y: 50 };
  const firstMove = (t.moves || [])[0];
  const ballPath = firstMove ? `M${firstMove.from.x} ${firstMove.from.y} L${firstMove.to.x} ${firstMove.to.y}` : `M${ball.x} ${ball.y} L${ball.x} ${ball.y}`;
  parts.push(`<circle class="tac-ball" r="2.4"><animateMotion dur="3s" repeatCount="indefinite" path="${ballPath}"/></circle>`);
  // Leyenda
  const usedKinds = [...new Set((t.moves || []).map((m) => m.kind || 'pass'))];
  const labels = ['● = mi equipo', '● = rival', '⚽ = balón'];
  labels.push(...usedKinds.map(actionLabel));
  return `<figure class="tactic-board"><svg viewBox="0 0 100 100" role="img" aria-label="Pizarra táctica de ${xml(t.name || 'táctica')}">${marker(markerId)}${parts.join('')}</svg><p class="board-legend"><strong>Leyenda:</strong> ${labels.join(' · ')}</p></figure>`;
}

const marker = (id) => `<defs><marker id="${id}" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6z"/></marker></defs>`;

export function buildTactic(values, metadata = {}) {
  const name = clean(values.name);
  if (!name) throw new TypeError('La táctica necesita un nombre.');
  const format = clean(values.format) || 'F7';
  if (!TACTIC_FORMATS.includes(format)) throw new TypeError('Selecciona un formato válido.');
  return {
    id: metadata.id,
    recordType: 'tactic',
    name,
    rival: clean(values.rival),
    situation: clean(values.situation),
    format,
    team: Array.isArray(values.team) ? values.team : defaultTactic(format).team,
    opponent: Array.isArray(values.opponent) ? values.opponent : defaultTactic(format).opponent,
    ball: values.ball || { x: 50, y: 50 },
    moves: Array.isArray(values.moves) ? values.moves : [],
    notes: clean(values.notes),
    createdAt: metadata.createdAt,
    updatedAt: metadata.now,
  };
}

export function sortTactics(tactics) {
  if (!Array.isArray(tactics)) throw new TypeError('Las tácticas deben ser una lista.');
  return [...tactics].sort((a, b) => String(b.updatedAt || 0) - String(a.updatedAt || 0));
}
