// Visor de táctica interactiva: MP4 bajo demanda + pantalla completa estable.

import { attachMediaLightbox } from './media-lightbox.js';

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);

export function renderTacticaInteractivaHTML(tactica) {
  const vr = tactica.vista_rapida || {};
  const det = tactica.detalle || {};
  const anim = tactica.animacion || {};
  const videoSrc = anim.mp4 || (anim.gif || '').replace(/\.gif$/i, '.mp4');
  const pillsTrabaja = (vr.que_se_trabaja || []).map((t) => `<span class="pill trabaja">${esc(t)}</span>`).join('');
  const detalleBloques = Object.entries(det)
    .filter(([key, value]) => key !== 'fuente' && Array.isArray(value) && value.length)
    .map(([key, value]) => {
      const title = {
        que_busco: 'Qué busco', con_balon: 'Con balón', al_perder: 'Al perder el balón',
        en_defensa: 'En defensa', en_ataque: 'En ataque', cuando_usarla: 'Cuándo usarla',
        que_gano: 'Qué gano', que_vigilar: 'Qué vigilar', regla_equilibrio: 'Regla de equilibrio',
        principios: 'Principios',
      }[key] || key.replace(/_/g, ' ');
      return `<h3>${esc(title)}</h3><ul class="plain-list">${value.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`;
    }).join('');
  const source = det.fuente || {};
  const sourceText = source.documento ? `Fuente: ${esc(source.documento)}${source.seccion ? ` · ${esc(source.seccion)}` : ''}` : '';

  return `
  <div class="tactica-interactiva" data-id="${esc(tactica.id)}" data-video="${esc(videoSrc)}">
    <div class="pills"><span class="pill tipo">${esc(vr.tipo_principal || 'Táctica')}</span><span class="pill sistema">${esc(vr.sistema || tactica.formacion || '')}</span>${pillsTrabaja}</div>
    <h2 class="nombre">${esc(tactica.nombre)}</h2>
    <div class="player">
      <div class="stage"><video class="frame-video" data-src="${esc(videoSrc)}" playsinline muted loop preload="none"></video></div>
      <div class="controls">
        <button type="button" class="btn-prev" title="Paso anterior">⏮</button>
        <button type="button" class="btn-play primary" title="Reproducir / Pausar">▶</button>
        <button type="button" class="btn-next" title="Paso siguiente">⏭</button>
        <button type="button" class="btn-restart" title="Reiniciar">↺</button>
        <button type="button" class="btn-full" title="Pantalla completa">⛶</button>
        <div class="speed"><button type="button" data-s="2" class="on">1×</button><button type="button" data-s="4">2×</button><button type="button" data-s="8">4×</button></div>
      </div>
    </div>
    <div class="leyenda"><strong>Leyenda:</strong> ${esc(vr.leyenda || '')}</div>
    <div class="detalle">${detalleBloques}${sourceText ? `<div class="fuente">${sourceText}</div>` : ''}</div>
    <div class="lightbox"><button type="button" class="lb-close" title="Cerrar">✕</button><div class="lb-controls"><button type="button" class="lb-prev" title="Paso anterior">⏮</button><button type="button" class="lb-play" title="Reproducir / Pausar">▶</button><button type="button" class="lb-next" title="Paso siguiente">⏭</button><button type="button" class="lb-restart" title="Reiniciar">↺</button><div class="speed"><button type="button" data-s="2" class="on">1×</button><button type="button" data-s="4">2×</button><button type="button" data-s="8">4×</button></div></div><span class="hint">Rueda/pellizco: zoom · arrastra solo el vídeo</span><button type="button" class="tg-close-full" title="Cerrar táctica">Cerrar táctica</button></div>
  </div>`;
}

function ensureLoaded(video, preload = 'metadata') {
  if (!video?.dataset.src) return Promise.resolve(false);
  if (video.readyState >= 2 && video.getAttribute('src')) return Promise.resolve(true);
  if (video._loadPromise) return video._loadPromise;
  if (!video.getAttribute('src')) video.src = video.dataset.src;
  video.preload = preload;
  video.load();
  video._loadPromise = new Promise((resolve) => {
    const done = () => { cleanup(); resolve(true); };
    const failed = () => { cleanup(); video.removeAttribute('src'); video.load(); video._loadPromise = null; resolve(false); };
    const cleanup = () => { video.removeEventListener('loadeddata', done); video.removeEventListener('error', failed); };
    if (video.readyState >= 2) return done();
    video.addEventListener('loadeddata', done, { once: true });
    video.addEventListener('error', failed, { once: true });
  });
  return video._loadPromise;
}

export function initTacticaViewer(root) {
  if (!root || root.dataset._viewerInit) return;
  root.dataset._viewerInit = '1';
  const video = root.querySelector('.frame-video');
  const stage = root.querySelector('.stage');
  const btnPlay = root.querySelector('.btn-play');
  const lb = root.querySelector('.lightbox');
  const lbPlay = lb?.querySelector('.lb-play');
  let speed = 2;
  let countedPlaying = false;

  const setSpeed = (value) => {
    speed = value;
    if (video) video.playbackRate = value;
    root.querySelectorAll('.speed button').forEach((button) => button.classList.toggle('on', parseFloat(button.dataset.s) === value));
  };
  const markPlaying = (playing) => {
    if (playing && !countedPlaying) { window.__viewersPlaying = (window.__viewersPlaying || 0) + 1; countedPlaying = true; }
    if (!playing && countedPlaying) { window.__viewersPlaying = Math.max(0, (window.__viewersPlaying || 0) - 1); countedPlaying = false; }
  };
  const play = async () => {
    if (!video || !await ensureLoaded(video, 'auto')) return;
    try {
      video.playbackRate = speed;
      await video.play();
      if (btnPlay) btnPlay.textContent = '⏸';
      if (lbPlay) lbPlay.textContent = '⏸';
      markPlaying(true);
    } catch {}
  };
  const pause = () => {
    video?.pause();
    if (btnPlay) btnPlay.textContent = '▶';
    if (lbPlay) lbPlay.textContent = '▶';
    markPlaying(false);
  };
  const toggle = () => video?.paused ? play() : pause();
  const step = async (delta) => {
    if (!video || !await ensureLoaded(video, 'auto')) return;
    pause();
    video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + delta));
  };

  btnPlay?.addEventListener('click', toggle);
  lbPlay?.addEventListener('click', toggle);
  root.querySelector('.btn-prev')?.addEventListener('click', () => step(-0.125));
  root.querySelector('.btn-next')?.addEventListener('click', () => step(0.125));
  root.querySelector('.btn-restart')?.addEventListener('click', async () => { pause(); if (video && await ensureLoaded(video, 'auto')) video.currentTime = 0; });
  lb?.querySelector('.lb-prev')?.addEventListener('click', () => step(-0.125));
  lb?.querySelector('.lb-next')?.addEventListener('click', () => step(0.125));
  lb?.querySelector('.lb-restart')?.addEventListener('click', async () => { pause(); if (video && await ensureLoaded(video, 'auto')) video.currentTime = 0; });
  root.querySelectorAll('.speed button').forEach((button) => button.addEventListener('click', () => setSpeed(parseFloat(button.dataset.s))));

  const controller = lb && stage ? attachMediaLightbox({ box: lb, stage, mediaSelector: '.frame-video' }) : null;
  root.querySelector('.btn-full')?.addEventListener('click', async () => {
    if (!video || !await ensureLoaded(video, 'auto')) return;
    controller?.open();
  });

  if (video?.dataset.src && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      ensureLoaded(video, 'metadata');
    }, { rootMargin: '300px 0px' });
    observer.observe(root);
  }
  setSpeed(speed);
}

export function attachTacticaLightbox(root) {
  if (!root) return;
  const box = root.querySelector('.lightbox');
  const stage = root.querySelector('.stage');
  if (box && stage) attachMediaLightbox({ box, stage, mediaSelector: '.frame-video' });
}
