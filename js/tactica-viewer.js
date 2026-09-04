// Visor de táctica interactiva: reproduce el GIF animado de una táctica del
// manual de Migue (Unión Viera Alevín D) con play/pausa, paso a paso, velocidad
// y pantalla completa (con sus propios controles). No modifica la pizarra táctica
// actual: se abre como una capa "interactiva" sobre la táctica guardada.

import { TACTICA_FRAME_DURATIONS } from './tactica-frame-durations.js';

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);

// Genera el HTML del visor de una táctica interactiva.
export function renderTacticaInteractivaHTML(tactica) {
  const vr = tactica.vista_rapida || {};
  const det = tactica.detalle || {};
  const anim = tactica.animacion || {};
  const total = anim.total || 0;
  const frameMs = anim.frameMs || 100;
  const framesBase = anim.frames || '';

  const pillsTrabaja = (vr.que_se_trabaja || []).map((t) => `<span class="pill trabaja">${esc(t)}</span>`).join('');

  // Bloques de detalle (claves dinámicas del JSON de táctica).
  const detalleBloques = Object.entries(det)
    .filter(([k, v]) => k !== 'fuente' && Array.isArray(v) && v.length)
    .map(([k, v]) => {
      const titulo = {
        que_busco: 'Qué busco',
        con_balon: 'Con balón',
        al_perder: 'Al perder el balón',
        en_defensa: 'En defensa',
        en_ataque: 'En ataque',
        cuando_usarla: 'Cuándo usarla',
        que_gano: 'Qué gano',
        que_vigilar: 'Qué vigilar',
        regla_equilibrio: 'Regla de equilibrio',
        principios: 'Principios',
      }[k] || k.replace(/_/g, ' ');
      return `<h3>${esc(titulo)}</h3><ul class="plain-list">${v.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
    }).join('');

  const fuente = det.fuente || {};
  const fuenteTexto = fuente.documento
    ? `Fuente: ${esc(fuente.documento)}${fuente.seccion ? ` · ${esc(fuente.seccion)}` : ''}`
    : '';

  return `
  <div class="tactica-interactiva" data-id="${esc(tactica.id)}" data-total="${total}" data-framems="${frameMs}" data-frames="${esc(framesBase)}">
    <div class="pills">
      <span class="pill tipo">${esc(vr.tipo_principal || 'Táctica')}</span>
      <span class="pill sistema">${esc(vr.sistema || tactica.formacion || '')}</span>
      ${pillsTrabaja}
    </div>
    <h2 class="nombre">${esc(tactica.nombre)}</h2>

    <div class="player">
      <div class="stage"><img class="frame-img" src="${esc(framesBase)}000.jpg" alt="Animación de la táctica"></div>
      <div class="controls">
        <button type="button" class="btn-prev" title="Paso anterior">⏮</button>
        <button type="button" class="btn-play primary" title="Reproducir / Pausar">▶</button>
        <button type="button" class="btn-next" title="Paso siguiente">⏭</button>
        <button type="button" class="btn-restart" title="Reiniciar">↺</button>
        <button type="button" class="btn-full" title="Pantalla completa">⛶</button>
        <div class="speed">
          <button type="button" data-s="2" class="on">1×</button>
          <button type="button" data-s="4">2×</button>
          <button type="button" data-s="8">4×</button>
        </div>
      </div>
    </div>

    <div class="leyenda"><strong>Leyenda:</strong> ${esc(vr.leyenda || '')}</div>

    <div class="detalle">${detalleBloques}${fuenteTexto ? `<div class="fuente">${fuenteTexto}</div>` : ''}</div>

    <div class="lightbox">
      <img class="lb-img" src="${esc(framesBase)}000.jpg" alt="Animación ampliada">
      <div class="lb-controls">
        <button type="button" class="lb-prev" title="Paso anterior">⏮</button>
        <button type="button" class="lb-play" title="Reproducir / Pausar">▶</button>
        <button type="button" class="lb-next" title="Paso siguiente">⏭</button>
        <button type="button" class="lb-restart" title="Reiniciar">↺</button>
        <div class="speed">
          <button type="button" data-s="2" class="on">1×</button>
          <button type="button" data-s="4">2×</button>
          <button type="button" data-s="8">4×</button>
        </div>
      </div>
      <span class="hint">Clic fuera para cerrar · rueda/pellizco para zoom · arrastra para mover</span>
    </div>
  </div>`;
}

// Inicializa el reproductor de una táctica interactiva.
export function initTacticaViewer(root) {
  if (!root || root.dataset._viewerInit) return;
  root.dataset._viewerInit = '1';

  const total = Number(root.dataset.total) || 0;
  const frameMs = Number(root.dataset.framems) || 100;
  const framesBase = root.dataset.frames || '';
  const tacticaId = root.dataset.id || '';
  const durations = TACTICA_FRAME_DURATIONS[tacticaId] || [];

  const img = root.querySelector('.frame-img');
  const btnPlay = root.querySelector('.btn-play');
  const lb = root.querySelector('.lightbox');
  const lbImg = root.querySelector('.lb-img');
  const lbPlay = root.querySelector('.lb-play');

  let idx = 0, playing = false, speed = 2;
  let frames = [];
  let rafId = null;
  let lastTime = 0;

  function frameSrc(i) {
    return framesBase + String(i).padStart(3, '0') + '.jpg';
  }

  function currentFrameMs() {
    const base = durations[idx] || frameMs;
    return base / speed;
  }

  function preload() {
    frames = new Array(total);
    for (let i = 0; i < total; i++) {
      const im = new Image();
      im.onload = () => {};
      im.onerror = () => {};
      im.src = frameSrc(i);
      frames[i] = im;
    }
  }

  function show(i) {
    idx = Math.max(0, Math.min(total - 1, i));
    const cached = frames[idx];
    const src = (cached && cached.complete && cached.naturalWidth > 0) ? cached.src : frameSrc(idx);
    img.src = src;
    if (lb.classList.contains('open')) lbImg.src = src;
  }

  function tick(now) {
    if (!playing) return;
    if (now - lastTime >= currentFrameMs()) {
      lastTime = now;
      idx = idx >= total - 1 ? 0 : idx + 1;
      show(idx);
    }
    rafId = requestAnimationFrame(tick);
  }
  function play() {
    playing = true;
    btnPlay.textContent = '⏸'; lbPlay.textContent = '⏸';
    window.__viewersPlaying = (window.__viewersPlaying || 0) + 1;
    lastTime = performance.now();
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
  }
  function pause() {
    if (playing) window.__viewersPlaying = Math.max(0, (window.__viewersPlaying || 0) - 1);
    playing = false;
    btnPlay.textContent = '▶'; lbPlay.textContent = '▶';
    cancelAnimationFrame(rafId);
  }
  function toggle() { playing ? pause() : play(); }

  function setSpeed(s) {
    speed = s;
    root.querySelectorAll('.speed button').forEach((x) => x.classList.toggle('on', parseFloat(x.getAttribute('data-s')) === s));
    if (playing) play();
  }

  btnPlay.addEventListener('click', toggle);
  lbPlay.addEventListener('click', toggle);
  root.querySelector('.btn-prev').addEventListener('click', () => { pause(); show(idx - 1); });
  root.querySelector('.btn-next').addEventListener('click', () => { pause(); show(idx + 1); });
  root.querySelector('.btn-restart').addEventListener('click', () => { pause(); show(0); });
  root.querySelector('.lb-prev').addEventListener('click', () => { pause(); show(idx - 1); });
  root.querySelector('.lb-next').addEventListener('click', () => { pause(); show(idx + 1); });
  root.querySelector('.lb-restart').addEventListener('click', () => { pause(); show(0); });
  root.querySelectorAll('.speed button').forEach((b) => {
    b.addEventListener('click', () => setSpeed(parseFloat(b.getAttribute('data-s'))));
  });

  // Pantalla completa
  const btnFull = root.querySelector('.btn-full');
  btnFull.addEventListener('click', () => {
    lbImg.src = img.src;
    lb.classList.add('open');
    resetLightbox(lb);
  });

  show(0);
  preload();
}

function resetLightbox(box) {
  box.dataset.zoom = '1';
  box.dataset.tx = '0';
  box.dataset.ty = '0';
  applyLightbox(box);
}
function applyLightbox(box) {
  const lbImg = box.querySelector('.lb-img');
  const z = Number(box.dataset.zoom || 1);
  const tx = Number(box.dataset.tx || 0);
  const ty = Number(box.dataset.ty || 0);
  lbImg.style.transform = `translate(${tx}px,${ty}px) scale(${z})`;
}

// Conecta el visor de pantalla completa (zoom + pan + pellizco).
export function attachTacticaLightbox(root) {
  const box = root.querySelector('.lightbox');
  if (!box || box.dataset._lbInit) return;
  box.dataset._lbInit = '1';
  const lbImg = box.querySelector('.lb-img');
  const MINZ = 0.5, MAXZ = 8;

  box.addEventListener('click', (e) => { if (e.target === box) { box.classList.remove('open'); resetLightbox(box); } });

  box.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    let z = Number(box.dataset.zoom || 1);
    const nz = Math.max(MINZ, Math.min(MAXZ, z * factor));
    const rect = lbImg.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    const k = nz / z;
    let tx = Number(box.dataset.tx || 0), ty = Number(box.dataset.ty || 0);
    tx = cx - (cx - tx) * k; ty = cy - (cy - ty) * k;
    box.dataset.zoom = nz; box.dataset.tx = tx; box.dataset.ty = ty;
    applyLightbox(box);
  }, { passive: false });

  let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
  box.addEventListener('mousedown', (e) => {
    if (e.target === box) return;
    dragging = true; box.classList.add('dragging');
    sx = e.clientX; sy = e.clientY; ox = Number(box.dataset.tx || 0); oy = Number(box.dataset.ty || 0);
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    box.dataset.tx = ox + (e.clientX - sx); box.dataset.ty = oy + (e.clientY - sy);
    applyLightbox(box);
  });
  window.addEventListener('mouseup', () => { dragging = false; box.classList.remove('dragging'); });

  let pinch = null;
  box.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      dragging = true; box.classList.add('dragging');
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; ox = Number(box.dataset.tx || 0); oy = Number(box.dataset.ty || 0);
    } else if (e.touches.length === 2) {
      dragging = false;
      const a = e.touches[0], b = e.touches[1];
      pinch = { dist: Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY), zoom: Number(box.dataset.zoom || 1), cx: (a.clientX + b.clientX) / 2, cy: (a.clientY + b.clientY) / 2 };
    }
  }, { passive: false });
  box.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && dragging) {
      box.dataset.tx = ox + (e.touches[0].clientX - sx); box.dataset.ty = oy + (e.touches[0].clientY - sy);
      applyLightbox(box);
    } else if (e.touches.length === 2 && pinch) {
      const a = e.touches[0], b = e.touches[1];
      const d = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
      const nz = Math.max(MINZ, Math.min(MAXZ, pinch.zoom * (d / pinch.dist)));
      const rect = lbImg.getBoundingClientRect();
      const k = nz / Number(box.dataset.zoom || 1);
      const cx = pinch.cx - rect.left, cy = pinch.cy - rect.top;
      let tx = Number(box.dataset.tx || 0), ty = Number(box.dataset.ty || 0);
      tx = cx - (cx - tx) * k; ty = cy - (cy - ty) * k;
      box.dataset.zoom = nz; box.dataset.tx = tx; box.dataset.ty = ty;
      applyLightbox(box);
    }
  }, { passive: false });
  box.addEventListener('touchend', () => { dragging = false; pinch = null; box.classList.remove('dragging'); });

  box.addEventListener('dblclick', (e) => {
    if (e.target === box) return;
    if (Number(box.dataset.zoom || 1) > 1) resetLightbox(box);
    else { box.dataset.zoom = '2.5'; applyLightbox(box); }
  });
}
