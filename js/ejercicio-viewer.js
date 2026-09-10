// Renderizador y reproductor de la ficha de ejercicio validado.
// Biblioteca completa en datos, pero vídeo, listeners pesados y detalle bajo demanda.

import { renderVideoSectionHTML } from './ejercicio-videos.js';
import { attachMediaLightbox } from './media-lightbox.js';

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);
const list = (values) => `<ul class="plain-list">${(values || []).map((v) => `<li>${esc(v)}</li>`).join('')}</ul>`;
const itemRegistry = new Map();
let viewerObserver = null;

function detailHTML(item) {
  const det = item?.detalle || {};
  return [
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
  ].filter(([, values]) => Array.isArray(values) && values.length)
    .map(([title, values]) => `<h3>${esc(title)}</h3>${list(values)}`).join('');
}

export function renderValidatedExerciseHTML(item, options = {}) {
  const vr = item.vista_rapida || {};
  const anim = item.animacion || {};
  const videoSrc = anim.mp4 || (anim.gif || '').replace(/\.gif$/i, '.mp4');
  const realVideo = item.video || '';
  const tiempo = parseDuration(vr.tiempo_estimado_15);
  const videosHTML = renderVideoSectionHTML(options.videos || [], { role: options.role, exerciseId: item.id });
  const pillsTrabaja = (vr.que_se_trabaja || []).map((t) => `<span class="pill trabaja">${esc(t)}</span>`).join('');

  itemRegistry.set(String(item.id), item);

  const seriesList = vr.series || [];
  const normalizar = (text) => (text || '').trim().replace(/la misma\s+/gi, 'la ');
  const nucleo = (text) => normalizar(text).split('.')[0].trim();
  const nucleos = seriesList.map((serie) => nucleo(serie.instruccion));
  const todasIguales = seriesList.length > 1 && nucleos.every((value) => value === nucleos[0]);
  const series = todasIguales
    ? `<div class="serie"><span class="n">${seriesList.length}×</span><div class="t">${esc(seriesList[0].instruccion)}</div></div>`
    : seriesList.map((serie, index) => `<div class="serie"><span class="n">${index + 1}</span><div class="t">${esc(serie.instruccion)}</div></div>`).join('');

  const placeholder = videoSrc
    ? '<div class="video-placeholder" style="display:flex;position:absolute;inset:0;z-index:2;align-items:center;justify-content:center;padding:1rem;text-align:center;background:#0c3b2e;color:#fff">Cargando vista previa…</div>'
    : '<div class="video-placeholder" style="display:flex;align-items:center;justify-content:center;min-height:180px;padding:1rem;text-align:center;background:#0c3b2e;color:#fff">Demostración no disponible</div>';

  return `
  <div class="ejercicio-validado" data-id="${esc(item.id)}" data-video="${esc(videoSrc)}" style="content-visibility:auto;contain-intrinsic-size:auto 900px">
    <div class="pills"><span class="pill tipo">${esc(vr.tipo_principal)}</span>${pillsTrabaja}</div>
    <h2 class="nombre">${esc(item.nombre)}</h2>

    <div class="datos">
      <div class="dato"><small>Tiempo estimado (15 jug.)</small><strong>${esc(vr.tiempo_estimado_15)}</strong><input type="number" class="tiempo-ejercicio" value="${tiempo}" min="1" max="120" step="1"><small class="editable">editable</small></div>
      <div class="dato"><small>Jugadores</small><strong>${esc(vr.jugadores?.total ?? '')}</strong><span class="sub">${esc(vr.jugadores?.organizacion ?? '')}</span></div>
      <div class="dato"><small>Material</small><strong>${esc(vr.material)}</strong></div>
    </div>

    <div class="series">${series}</div>
    <div class="explicacion">${esc(vr.explicacion_breve)}</div>

    <div class="player">
      <div class="stage" style="position:relative">${placeholder}<video class="frame-video" data-src="${esc(videoSrc)}" playsinline muted loop preload="none" style="display:block"></video></div>
      <div class="controls">
        <button type="button" class="btn-prev" title="Paso anterior">⏮</button>
        <button type="button" class="btn-play primary" title="Reproducir / Pausar">▶</button>
        <button type="button" class="btn-next" title="Paso siguiente">⏭</button>
        <button type="button" class="btn-restart" title="Reiniciar">↺</button>
        <button type="button" class="btn-full" title="Pantalla completa">⛶</button>
        <div class="speed"><button type="button" data-s="1" class="on">1×</button><button type="button" data-s="2">2×</button><button type="button" data-s="4">4×</button></div>
      </div>
    </div>

    <div class="leyenda"><strong>Leyenda:</strong> ${esc(vr.leyenda)}</div>

    ${realVideo ? `
    <div class="videos real-video">
      <h3>Vídeo real</h3>
      <div class="video-item">
        <video class="real-video-el" controls preload="none" playsinline data-src="${esc(realVideo)}"></video>
        <div class="video-meta"><span class="video-name">Demostración en vídeo</span><button type="button" class="real-video-full" title="Ampliar">⛶ Ampliar</button></div>
      </div>
    </div>` : ''}

    ${videosHTML}

    <div class="acciones"><button type="button" class="add-exercise-to-session primary" data-id="${esc(item.id)}">+ Añadir a sesión</button><button type="button" class="btn-detalle">Ver detalles</button></div>
    <div class="detalle" data-lazy-detail="1"></div>

    <div class="lightbox"><button type="button" class="lb-close" title="Cerrar">✕</button><div class="lb-controls"><button type="button" class="lb-prev" title="Paso anterior">⏮</button><button type="button" class="lb-play" title="Reproducir / Pausar">▶</button><button type="button" class="lb-next" title="Paso siguiente">⏭</button><button type="button" class="lb-restart" title="Reiniciar">↺</button><div class="speed"><button type="button" data-s="1" class="on">1×</button><button type="button" data-s="2">2×</button><button type="button" data-s="4">4×</button></div></div><span class="hint">Rueda/pellizco: zoom · arrastra solo el vídeo</span><button type="button" class="tg-close-full" title="Cerrar animación">Cerrar animación</button></div>
    ${realVideo ? `<div class="lightbox real-video-lightbox"><button type="button" class="lb-close" title="Cerrar">✕</button><div class="lb-controls"><button type="button" class="lb-play" title="Reproducir / Pausar">▶</button><div class="speed"><button type="button" data-s="1" class="on">1×</button><button type="button" data-s="1.5">1.5×</button><button type="button" data-s="2">2×</button></div></div><span class="hint">Rueda/pellizco: zoom · arrastra solo el vídeo</span><button type="button" class="tg-close-full" title="Cerrar vídeo">Cerrar vídeo</button></div>` : ''}
  </div>`;
}

function parseDuration(text) {
  const match = String(text ?? '').match(/(\d+)\s*-\s*(\d+)/);
  if (match) return Math.round((Number(match[1]) + Number(match[2])) / 2);
  const single = String(text ?? '').match(/(\d+)/);
  return single ? Number(single[1]) : 15;
}

function validatedRoot(root) {
  if (!root) return null;
  return root.matches?.('.ejercicio-validado') ? root : root.querySelector?.('.ejercicio-validado');
}

function ensureVideoLoaded(video, placeholder, previewOnly = false) {
  if (!video) return Promise.resolve(false);
  const src = video.dataset.src;
  if (!src) return Promise.resolve(false);
  if (video.readyState >= 2 && video.getAttribute('src')) {
    if (placeholder) placeholder.style.display = 'none';
    return Promise.resolve(true);
  }
  if (video._loadPromise) return video._loadPromise;

  if (placeholder) {
    placeholder.textContent = previewOnly ? 'Cargando vista previa…' : 'Cargando demostración…';
    placeholder.style.display = 'flex';
  }
  if (!video.getAttribute('src')) video.src = src;
  video.preload = previewOnly ? 'metadata' : 'auto';
  video.load();

  video._loadPromise = new Promise((resolve) => {
    const cleanup = () => {
      video.removeEventListener('loadeddata', ready);
      video.removeEventListener('error', failed);
    };
    const ready = () => {
      cleanup();
      video.pause();
      try { video.currentTime = 0; } catch {}
      if (placeholder) placeholder.style.display = 'none';
      resolve(true);
    };
    const failed = () => {
      cleanup();
      if (placeholder) {
        placeholder.textContent = 'No se pudo cargar la demostración. Comprueba la conexión y vuelve a intentarlo.';
        placeholder.style.display = 'flex';
      }
      video.removeAttribute('src');
      video.load();
      video._loadPromise = null;
      resolve(false);
    };
    if (video.readyState >= 2) return ready();
    video.addEventListener('loadeddata', ready, { once: true });
    video.addEventListener('error', failed, { once: true });
  });
  return video._loadPromise;
}

function initLazyStandaloneVideo(video) {
  if (!video?.dataset.src || video.dataset._lazyStandalone) return;
  video.dataset._lazyStandalone = '1';
  const load = (preload = 'metadata') => {
    if (!video.getAttribute('src')) {
      video.src = video.dataset.src;
      video.preload = preload;
      video.load();
    } else if (preload === 'auto') video.preload = 'auto';
  };
  video.addEventListener('pointerdown', () => load('auto'), { once: true });
  video.addEventListener('play', () => load('auto'));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      load('metadata');
    }, { rootMargin: '300px 0px' });
    observer.observe(video);
  }
}

function activateValidatedExerciseViewer(root) {
  if (!root || root.dataset._viewerInit === '1') return;
  root.dataset._viewerInit = '1';
  root.dataset._viewerScheduled = '1';

  const video = root.querySelector('.frame-video');
  const placeholder = root.querySelector('.video-placeholder');
  const btnPlay = root.querySelector('.btn-play');
  const lb = root.querySelector(':scope > .lightbox:not(.real-video-lightbox)');
  const lbPlay = lb?.querySelector('.lb-play');
  let speed = 1;
  let countedPlaying = false;

  const setSpeed = (value) => {
    speed = value;
    if (video) video.playbackRate = value;
    root.querySelectorAll(':scope > .player .speed button, :scope > .lightbox:not(.real-video-lightbox) .speed button').forEach((button) => button.classList.toggle('on', parseFloat(button.dataset.s) === value));
  };

  const markPlaying = (playing) => {
    if (playing && !countedPlaying) {
      window.__viewersPlaying = (window.__viewersPlaying || 0) + 1;
      countedPlaying = true;
    } else if (!playing && countedPlaying) {
      window.__viewersPlaying = Math.max(0, (window.__viewersPlaying || 0) - 1);
      countedPlaying = false;
    }
  };

  const play = async () => {
    if (!video || !await ensureVideoLoaded(video, placeholder, false)) return;
    try {
      video.playbackRate = speed;
      await video.play();
      if (btnPlay) btnPlay.textContent = '⏸';
      if (lbPlay) lbPlay.textContent = '⏸';
      markPlaying(true);
    } catch {
      if (placeholder) {
        placeholder.textContent = 'Pulsa ▶ de nuevo para reproducir la demostración.';
        placeholder.style.display = 'flex';
      }
    }
  };
  const pause = () => {
    if (!video) return;
    video.pause();
    if (btnPlay) btnPlay.textContent = '▶';
    if (lbPlay) lbPlay.textContent = '▶';
    markPlaying(false);
  };
  const toggle = () => (video?.paused ? play() : pause());
  const step = async (delta) => {
    if (!video || !await ensureVideoLoaded(video, placeholder, false)) return;
    pause();
    video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + delta));
  };

  btnPlay?.addEventListener('click', toggle);
  lbPlay?.addEventListener('click', toggle);
  root.querySelector('.btn-prev')?.addEventListener('click', () => step(-0.125));
  root.querySelector('.btn-next')?.addEventListener('click', () => step(0.125));
  root.querySelector('.btn-restart')?.addEventListener('click', async () => { pause(); if (video && await ensureVideoLoaded(video, placeholder, false)) video.currentTime = 0; });
  lb?.querySelector('.lb-prev')?.addEventListener('click', () => step(-0.125));
  lb?.querySelector('.lb-next')?.addEventListener('click', () => step(0.125));
  lb?.querySelector('.lb-restart')?.addEventListener('click', async () => { pause(); if (video && await ensureVideoLoaded(video, placeholder, false)) video.currentTime = 0; });
  root.querySelectorAll(':scope > .player .speed button, :scope > .lightbox:not(.real-video-lightbox) .speed button').forEach((button) => button.addEventListener('click', () => setSpeed(parseFloat(button.dataset.s))));

  const detail = root.querySelector(':scope > .detalle');
  const detailButton = root.querySelector(':scope > .acciones .btn-detalle');
  detailButton?.addEventListener('click', () => {
    if (detail?.dataset.lazyDetail === '1') {
      detail.innerHTML = detailHTML(itemRegistry.get(String(root.dataset.id)));
      detail.dataset.lazyDetail = '0';
    }
    detail?.classList.toggle('open');
    detailButton.textContent = detail?.classList.contains('open') ? 'Ocultar detalles' : 'Ver detalles';
  });

  const stage = root.querySelector(':scope > .player .stage');
  const controller = lb && stage ? attachMediaLightbox({ box: lb, stage, mediaSelector: '.frame-video' }) : null;
  root.querySelector('.btn-full')?.addEventListener('click', async () => {
    if (!video || !await ensureVideoLoaded(video, placeholder, false)) return;
    controller?.open();
  });

  const realVideo = root.querySelector('.real-video-el');
  const realLb = root.querySelector(':scope > .real-video-lightbox');
  const realStage = realVideo?.parentElement;
  if (realVideo) initLazyStandaloneVideo(realVideo);
  if (realVideo && realLb && realStage) {
    const realController = attachMediaLightbox({ box: realLb, stage: realStage, mediaSelector: '.real-video-el' });
    root.querySelector('.real-video-full')?.addEventListener('click', () => {
      if (!realVideo.getAttribute('src') && realVideo.dataset.src) {
        realVideo.src = realVideo.dataset.src;
        realVideo.preload = 'auto';
        realVideo.load();
      }
      realController?.open();
    });
    const realPlay = realLb.querySelector('.lb-play');
    realPlay?.addEventListener('click', () => {
      if (realVideo.paused) realVideo.play().then(() => { realPlay.textContent = '⏸'; }).catch(() => {});
      else { realVideo.pause(); realPlay.textContent = '▶'; }
    });
    realLb.querySelectorAll('.speed button').forEach((button) => button.addEventListener('click', () => {
      const next = parseFloat(button.dataset.s);
      realVideo.playbackRate = next;
      realLb.querySelectorAll('.speed button').forEach((candidate) => candidate.classList.toggle('on', candidate === button));
    }));
  }

  if (video?.dataset.src) ensureVideoLoaded(video, placeholder, true);
  setSpeed(speed);
}

function getViewerObserver() {
  if (!viewerObserver && typeof IntersectionObserver !== 'undefined') {
    viewerObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        viewerObserver.unobserve(entry.target);
        activateValidatedExerciseViewer(entry.target);
      }
    }, { rootMargin: '350px 0px' });
  }
  return viewerObserver;
}

export function initValidatedExerciseViewer(root) {
  const target = validatedRoot(root);
  if (!target || target.dataset._viewerScheduled === '1' || target.dataset._viewerInit === '1') return;
  target.dataset._viewerScheduled = '1';
  const observer = getViewerObserver();
  if (observer) observer.observe(target);
  else activateValidatedExerciseViewer(target);
}

// Compatibilidad con las llamadas existentes de app.js y Sesiones. La preparación
// real del lightbox se hace cuando la ficha se acerca al viewport.
export function attachLightbox(root) {
  const target = validatedRoot(root);
  if (!target) return;
  target.dataset._lightboxRequested = '1';
  initValidatedExerciseViewer(target);
}
