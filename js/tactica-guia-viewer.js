// Visor de la ficha completa de una táctica del manual (guía por bloques).
// Reutiliza la pizarra editable validada (tactic-board-controller) y reproduce
// la animación por frames webp con las duraciones verificadas de cada bloque.
// La pizarra es independiente del GIF: se abre plegada y no reproduce sus
// movimientos. El reproductor y la pizarra ampliados tienen cierre inferior.

import { defaultTactic, renderTacticBoard } from './tactics.js';
import { initTacticBoard } from './tactic-board-controller.js';
import { TACTICA_1231_FRAMES } from './tactica-1231-frames.js';

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);

// Estado de pizarra por táctica (se conserva al cambiar de bloque).
const boardStates = new Map();

function boardStateFor(tactica) {
  if (!boardStates.has(tactica.id)) {
    boardStates.set(tactica.id, { ...defaultTactic('F7', tactica.formacion), id: `guia-${tactica.id}`, name: 'Mi pizarra de explicación', moves: [] });
  }
  return boardStates.get(tactica.id);
}

export function renderTacticaGuiaHTML(tactica) {
  const bloques = tactica.bloques || [];
  const multi = bloques.length > 1;
  const blocksNav = multi
    ? `<nav class="tg-blocks" data-tg-blocks>${bloques.map((b, i) => `<button type="button" class="tg-block-btn" data-tg-block="${i}"><small>BLOQUE ${i + 1}</small>${esc(b.nombre_corto)}</button>`).join('')}</nav>`
    : '';

  return `
  <div class="tactica-guia" data-id="${esc(tactica.id)}" data-formacion="${esc(tactica.formacion)}">
    <div class="tg-head">
      <span class="pill accent">${esc(tactica.formacion)}</span>
      <h3>${esc(tactica.nombre)}</h3>
      <p class="tg-org">${esc(tactica.organizacion || '')}</p>
      <p class="tg-principio">${esc(tactica.principio || '')}</p>
    </div>
    ${blocksNav}
    <div class="tg-block">
      <div class="tg-block-head">
        <span class="pill" data-tg-badge></span>
        <h4 data-tg-title></h4>
        <p class="tg-goal" data-tg-goal></p>
      </div>
      <details class="tg-board-section">
        <summary>Mi pizarra de explicación</summary>
        <div class="tg-board-head"><p>Independiente del GIF: úsala para explicar lo que quieras.</p><button type="button" class="secondary" data-tg-board-open>⛶ Ampliar pizarra</button></div>
        <div class="tactic-tools" data-tg-board-tools role="toolbar" aria-label="Herramientas de la pizarra"></div>
        <div data-tg-board></div>
        <p class="tg-board-help">Mueve jugadores y rivales. Dibuja pases, movimientos, conducciones, disparos o sprints. También puedes colocar el balón, borrar una línea o limpiar la pizarra.</p>
      </details>
      <div class="tg-player-shell" data-tg-player-shell>
        <div class="tg-stage" data-tg-stage><img data-tg-frame alt="Animación táctica del bloque seleccionado"></div>
        <div class="tg-controls">
          <button type="button" class="secondary" data-tg-prev title="Paso anterior">⏮</button>
          <button type="button" class="primary" data-tg-play title="Reproducir o pausar">▶</button>
          <button type="button" class="secondary" data-tg-next title="Paso siguiente">⏭</button>
          <button type="button" class="secondary" data-tg-restart title="Reiniciar">↺</button>
          <button type="button" class="secondary" data-tg-full title="Pantalla completa">⛶</button>
          <div class="tg-speed" data-tg-speed><button type="button" data-s="1" class="on">1×</button><button type="button" data-s="2">2×</button><button type="button" data-s="4">4×</button></div>
        </div>
        <button type="button" class="tg-close-full" data-tg-player-close>Cerrar animación</button>
      </div>
      <div class="tg-coach">
        <div class="tg-key"><strong>Idea que quiero que recuerden</strong><span data-tg-key></span></div>
        <div><h4>Secuencia de decisiones</h4><ol data-tg-decisions></ol></div>
        <div><h4>Qué vigilo como entrenador</h4><ul data-tg-watch></ul></div>
        <div><h4>Consignas cortas</h4><div class="tg-calls" data-tg-calls></div></div>
        <button type="button" class="secondary" data-tg-errors-toggle>Ver errores frecuentes</button>
        <div class="tg-errors" data-tg-errors><h4>Errores frecuentes</h4><ul data-tg-error-list></ul></div>
      </div>
    </div>
    <div class="live-tactics-lightbox live-tactics" data-tg-board-lightbox>
      <button type="button" class="lb-close" data-tg-board-close-x title="Cerrar">✕</button>
      <div class="lb-board">
        <div class="tactic-tools" data-tg-board-tools-full role="toolbar" aria-label="Herramientas de la pizarra ampliada"></div>
        <div data-tg-board-full></div>
        <button type="button" class="tg-close-full" data-tg-board-close>Cerrar pizarra</button>
      </div>
    </div>
  </div>`;
}

export function initTacticaGuia(root, tactica) {
  if (!root || root.dataset._guiaInit) return;
  root.dataset._guiaInit = '1';

  const bloques = tactica.bloques || [];
  let current = 0;
  let frameIndex = 0;
  let speed = 1;
  let playing = false;
  let timer = null;

  const $ = (sel) => root.querySelector(sel);
  const $$ = (sel) => root.querySelectorAll(sel);

  const frameData = () => TACTICA_1231_FRAMES[String(current + 1)];
  const framePath = () => { const d = frameData(); return `${d.base}${String(frameIndex).padStart(3, '0')}.webp`; };

  function renderFrame() {
    const d = frameData();
    if (!d) return;
    frameIndex = Math.max(0, Math.min(d.total - 1, frameIndex));
    $('[data-tg-frame]').src = framePath();
  }
  function pause() { playing = false; clearTimeout(timer); $('[data-tg-play]').textContent = '▶'; }
  function schedule() {
    if (!playing) return;
    const d = frameData();
    const delay = (d.durations[frameIndex] || 420) / speed;
    timer = setTimeout(() => { frameIndex = (frameIndex + 1) % d.total; renderFrame(); schedule(); }, delay);
  }
  function togglePlay() { if (playing) { pause(); return; } playing = true; $('[data-tg-play]').textContent = '⏸'; schedule(); }
  function setSpeed(v) {
    speed = v;
    $$('[data-tg-speed] button').forEach((b) => b.classList.toggle('on', Number(b.dataset.s) === speed));
    if (playing) { clearTimeout(timer); schedule(); }
  }

  function renderBlock() {
    const b = bloques[current];
    $$('[data-tg-block]').forEach((x, i) => x.classList.toggle('active', i === current));
    $('[data-tg-badge]').textContent = `Bloque ${current + 1} de ${bloques.length} · ${b.nombre_corto}`;
    $('[data-tg-title]').textContent = b.titulo;
    $('[data-tg-goal]').textContent = b.objetivo;
    $('[data-tg-key]').textContent = b.idea_clave;
    $('[data-tg-decisions]').innerHTML = b.decisiones.map((x) => `<li>${esc(x)}</li>`).join('');
    $('[data-tg-watch]').innerHTML = b.que_vigilar.map((x) => `<li>${esc(x)}</li>`).join('');
    $('[data-tg-calls]').innerHTML = b.consignas.map((x) => `<span>«${esc(x)}»</span>`).join('');
    $('[data-tg-error-list]').innerHTML = b.errores.map((x) => `<li>${esc(x)}</li>`).join('');
    $('[data-tg-errors]').classList.remove('open');
    $('[data-tg-errors-toggle]').textContent = 'Ver errores frecuentes';
    pause();
    frameIndex = 0;
    renderFrame();
  }

  // Pizarra editable (independiente del bloque).
  const boardState = boardStateFor(tactica);
  const board = $('[data-tg-board]');
  const boardFull = $('[data-tg-board-full]');
  const tools = $('[data-tg-board-tools]');
  const toolsFull = $('[data-tg-board-tools-full]');
  const renderBoard = () => {
    board.innerHTML = renderTacticBoard(boardState);
    boardFull.innerHTML = renderTacticBoard(boardState);
  };
  initTacticBoard({ board, boardFull, tools, toolsFull, getState: () => boardState, setState: (s) => { Object.assign(boardState, s); }, render: renderBoard });

  const lightbox = $('[data-tg-board-lightbox]');
  const closeBoard = () => lightbox.classList.remove('open');
  $('[data-tg-board-open]').addEventListener('click', () => { renderBoard(); lightbox.classList.add('open'); });
  $('[data-tg-board-close-x]').addEventListener('click', closeBoard);
  $('[data-tg-board-close]').addEventListener('click', closeBoard);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeBoard(); });

  // Reproductor.
  $('[data-tg-prev]').addEventListener('click', () => { pause(); frameIndex--; renderFrame(); });
  $('[data-tg-next]').addEventListener('click', () => { pause(); frameIndex++; renderFrame(); });
  $('[data-tg-play]').addEventListener('click', togglePlay);
  $('[data-tg-restart]').addEventListener('click', () => { pause(); frameIndex = 0; renderFrame(); });
  $('[data-tg-speed]').addEventListener('click', (e) => { const b = e.target.closest('button[data-s]'); if (b) setSpeed(Number(b.dataset.s)); });

  const playerShell = $('[data-tg-player-shell]');
  const openFull = () => playerShell.requestFullscreen?.();
  const closePlayerFull = () => { if (document.fullscreenElement) document.exitFullscreen(); };
  $('[data-tg-full]').addEventListener('click', openFull);
  $('[data-tg-stage]').addEventListener('click', openFull);
  $('[data-tg-player-close]').addEventListener('click', closePlayerFull);

  $('[data-tg-errors-toggle]').addEventListener('click', () => {
    const open = $('[data-tg-errors]').classList.toggle('open');
    $('[data-tg-errors-toggle]').textContent = open ? 'Ocultar errores frecuentes' : 'Ver errores frecuentes';
  });

  $$('[data-tg-block]').forEach((btn) => btn.addEventListener('click', () => { current = Number(btn.dataset.tgBlock); renderBlock(); }));

  renderBlock();
}
