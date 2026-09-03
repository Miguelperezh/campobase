// Renderizador y reproductor de la ficha de ejercicio validado.
// Vista rápida (textos + GIF protagonista) + "Ver detalles" + tiempo editable.

import { FRAME_DURATIONS } from './frame-durations.js';

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);

const list = (values) => `<ul class="plain-list">${(values || []).map((v) => `<li>${esc(v)}</li>`).join('')}</ul>`;

export function renderValidatedExerciseHTML(item) {
  const vr = item.vista_rapida || {};
  const det = item.detalle || {};
  const anim = item.animacion || {};
  const total = anim.total || 0;
  const frameMs = anim.frameMs || 100;
  const framesBase = anim.frames || '';
  const tiempo = parseDuration(vr.tiempo_estimado_15);

  const pillsTrabaja = (vr.que_se_trabaja || []).map((t) => `<span class="pill trabaja">${esc(t)}</span>`).join('');

  // Series: si todas comparten la misma instrucción (o el mismo núcleo), se muestra
  // el texto una sola vez y solo se indica cuántas series son. Si difieren, se muestra cada una.
  const seriesList = vr.series || [];
  const normalizar = (t) => (t || '').trim().replace(/la misma\s+/gi, 'la ');
  const nucleo = (t) => normalizar(t).split('.')[0].trim();
  const nucleos = seriesList.map((s) => nucleo(s.instruccion));
  const todasIguales = seriesList.length > 1 && nucleos.every((n) => n === nucleos[0]);
  let series;
  if (todasIguales) {
    series = `<div class="serie"><span class="n">${seriesList.length}×</span><div class="t">${esc(seriesList[0].instruccion)}</div></div>`;
  } else {
    series = seriesList.map((s, i) =>
      `<div class="serie"><span class="n">${i + 1}</span><div class="t">${esc(s.instruccion)}</div></div>`
    ).join('');
  }

  const detalleBloques = [
    ['Objetivos', det.objetivos],
    ['Claves del entrenador', det.claves_entrenador],
    ['Montaje', det.montaje],
    ['Desarrollo paso a paso', det.desarrollo],
    ['Qué buscamos', det.que_buscamos],
    ['Qué observar', det.que_observar],
    ['Correcciones', det.correcciones],
    ['Reglas', det.reglas],
    ['Si sale mal', det.si_sale_mal],
    ['Si sale bien', det.si_sale_bien],
    ['Variantes', det.variantes],
  ].filter(([, v]) => Array.isArray(v) && v.length)
    .map(([titulo, valores]) => `<h3>${esc(titulo)}</h3>${list(valores)}`).join('');

  const fuente = det.fuente || {};
  const fuenteTexto = fuente.documento
    ? `Fuente: ${esc(fuente.documento)}${fuente.adaptacion_operativa ? ' · Adaptación operativa' : ''}`
    : '';

  return `
  <div class="ejercicio-validado" data-id="${esc(item.id)}" data-total="${total}" data-framems="${frameMs}" data-frames="${esc(framesBase)}">
    <div class="pills">
      <span class="pill tipo">${esc(vr.tipo_principal)}</span>
      ${pillsTrabaja}
    </div>
    <h2 class="nombre">${esc(item.nombre)}</h2>

    <div class="datos">
      <div class="dato"><small>Tiempo estimado (15 jug.)</small><strong>${esc(vr.tiempo_estimado_15)}</strong><input type="number" class="tiempo-ejercicio" value="${tiempo}" min="1" max="120" step="1"><small class="editable">editable</small></div>
      <div class="dato"><small>Jugadores</small><strong>${esc(vr.jugadores?.total ?? '')}</strong><span class="sub">${esc(vr.jugadores?.organizacion ?? '')}</span></div>
      <div class="dato"><small>Material</small><strong>${esc(vr.material)}</strong></div>
    </div>

    <div class="series">${series}</div>
    <div class="explicacion">${esc(vr.explicacion_breve)}</div>

    <div class="player">
      <div class="stage"><img class="frame-img" src="${esc(framesBase)}000.jpg" alt="Animación del ejercicio"></div>
      <div class="controls">
        <button type="button" class="btn-prev" title="Paso anterior">⏮</button>
        <button type="button" class="btn-play primary" title="Reproducir / Pausar">▶</button>
        <button type="button" class="btn-next" title="Paso siguiente">⏭</button>
        <button type="button" class="btn-restart" title="Reiniciar">↺</button>
        <button type="button" class="btn-full" title="Pantalla completa">⛶</button>
        <div class="speed">
          <button type="button" data-s="0.5">0.5×</button>
          <button type="button" data-s="1" class="on">1×</button>
          <button type="button" data-s="2">2×</button>
        </div>
      </div>
    </div>

    <div class="leyenda"><strong>Leyenda:</strong> ${esc(vr.leyenda)}</div>

    <div class="acciones">
      <button type="button" class="add-exercise-to-session primary" data-id="${esc(item.id)}">+ Añadir a sesión</button>
      <button type="button" class="btn-detalle">Ver detalles</button>
    </div>

    <div class="detalle">${detalleBloques}${fuenteTexto ? `<div class="fuente">${fuenteTexto}</div>` : ''}</div>

    <div class="lightbox"><img src="${esc(framesBase)}000.jpg" alt="Animación ampliada"><span class="hint">Clic fuera para cerrar · rueda/pellizco para zoom · arrastra para mover</span></div>
  </div>`;
}

function parseDuration(text) {
  const match = String(text ?? '').match(/(\d+)\s*-\s*(\d+)/);
  if (match) return Math.round((Number(match[1]) + Number(match[2])) / 2);
  const single = String(text ?? '').match(/(\d+)/);
  return single ? Number(single[1]) : 15;
}

// Inicializa el reproductor y el visor de un contenedor de ficha validada.
export function initValidatedExerciseViewer(root) {
  if (!root || root.dataset._viewerInit) return;
  root.dataset._viewerInit = '1';

  const total = Number(root.dataset.total) || 0;
  const frameMs = Number(root.dataset.framems) || 100;
  const framesBase = root.dataset.frames || '';
  const exerciseId = root.dataset.id || '';
  // Duraciones reales de cada frame (respetan las pausas entre variantes/series).
  const durations = FRAME_DURATIONS[exerciseId] || [];

  const img = root.querySelector('.frame-img');
  const btnPlay = root.querySelector('.btn-play');

  let idx = 0, playing = false, speed = 1;
  let frames = [];        // frames precargados en memoria (objetos Image)
  let loaded = 0;         // cuántos frames se han cargado ya
  let ready = false;      // true cuando todos están precargados
  let rafId = null;       // id de requestAnimationFrame
  let lastTime = 0;       // timestamp del último frame mostrado

  function frameSrc(i) {
    return framesBase + String(i).padStart(3, '0') + '.jpg';
  }

  // Duración real del frame actual (ms), con la velocidad aplicada.
  function currentFrameMs() {
    const base = durations[idx] || frameMs;
    return base / speed;
  }

  // Precarga todos los frames en memoria para que la reproducción sea fluida.
  function preload() {
    frames = new Array(total);
    for (let i = 0; i < total; i++) {
      const im = new Image();
      im.onload = () => {
        loaded++;
        if (loaded >= total) { ready = true; }
      };
      im.onerror = () => { loaded++; if (loaded >= total) ready = true; };
      im.src = frameSrc(i);
      frames[i] = im;
    }
  }

  function show(i) {
    idx = Math.max(0, Math.min(total - 1, i));
    // Usa el frame precargado si está listo; si no, cae a la URL directa.
    const cached = frames[idx];
    img.src = (cached && cached.complete && cached.naturalWidth > 0) ? cached.src : frameSrc(idx);
    const lb = root.querySelector('.lightbox');
    if (lb && lb.classList.contains('open')) lb.querySelector('img').src = img.src;
  }

  // Reproducción con requestAnimationFrame: respeta la duración real de cada frame.
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
    playing = true; btnPlay.textContent = '⏸';
    window.__viewersPlaying = (window.__viewersPlaying || 0) + 1;
    lastTime = performance.now();
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
  }
  function pause() {
    if (playing) window.__viewersPlaying = Math.max(0, (window.__viewersPlaying || 0) - 1);
    playing = false; btnPlay.textContent = '▶';
    cancelAnimationFrame(rafId);
  }

  btnPlay.addEventListener('click', () => playing ? pause() : play());
  root.querySelector('.btn-prev').addEventListener('click', () => { pause(); show(idx - 1); });
  root.querySelector('.btn-next').addEventListener('click', () => { pause(); show(idx + 1); });
  root.querySelector('.btn-restart').addEventListener('click', () => { pause(); show(0); });
  root.querySelectorAll('.speed button').forEach((b) => {
    b.addEventListener('click', () => {
      root.querySelectorAll('.speed button').forEach((x) => x.classList.remove('on'));
      b.classList.add('on'); speed = parseFloat(b.getAttribute('data-s'));
      if (playing) play();
    });
  });

  // Detalle
  const detalle = root.querySelector('.detalle');
  const btnDetalle = root.querySelector('.btn-detalle');
  btnDetalle.addEventListener('click', () => {
    detalle.classList.toggle('open');
    btnDetalle.textContent = detalle.classList.contains('open') ? 'Ocultar detalles' : 'Ver detalles';
  });

  // Visor a pantalla completa (zoom + pan + pellizco)
  const btnFull = root.querySelector('.btn-full');
  btnFull.addEventListener('click', () => {
    const lb = root.querySelector('.lightbox');
    lb.querySelector('img').src = img.src;
    lb.classList.add('open');
    resetLightbox(lb);
  });

  show(0);
  preload();
}

// Visor genérico (se crea una vez por ficha en el HTML; aquí se inicializa el comportamiento).
function resetLightbox(box) {
  const lbImg = box.querySelector('img');
  box.dataset.zoom = '1';
  box.dataset.tx = '0';
  box.dataset.ty = '0';
  applyLightbox(box);
}
function applyLightbox(box) {
  const lbImg = box.querySelector('img');
  const z = Number(box.dataset.zoom || 1);
  const tx = Number(box.dataset.tx || 0);
  const ty = Number(box.dataset.ty || 0);
  lbImg.style.transform = `translate(${tx}px,${ty}px) scale(${z})`;
}

// Se llama desde app.js tras insertar el HTML, para conectar el visor de cada ficha.
export function attachLightbox(root) {
  const box = root.querySelector('.lightbox');
  if (!box || box.dataset._lbInit) return;
  box.dataset._lbInit = '1';
  const lbImg = box.querySelector('img');
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
