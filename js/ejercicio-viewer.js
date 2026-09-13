// Renderizador y reproductor oficial V2 de fichas de ejercicios validados.
// Implementa las 17 secciones completas, controles interactivos, zoom táctico con clamping,
// leyenda visual bajo el vídeo y botones accesibles de cierre (superior con safe-area e inferior fijo).

import { renderVideoSectionHTML } from './ejercicio-videos.js';
import { attachMediaLightbox } from './media-lightbox.js';
import { findValidatedExercise } from './ejercicios-validados.js';

export function attachLightbox(root) {
  if (root) attachMediaLightbox(root);
}

const viewerTargets = new Set();
let viewerObserver = null;

export function pruneDisconnectedViewerTargets() {
  for (const target of viewerTargets) {
    if (!target.isConnected) {
      viewerTargets.delete(target);
      if (viewerObserver) viewerObserver.unobserve(target);
    }
  }
}

export function activateValidatedExerciseViewer(root) {
  initValidatedExerciseViewer(root);
}

export function ensureVideoLoaded(video, placeholder, previewOnly = false) {
  if (!video) return Promise.resolve(false);
  const src = video.dataset.src;
  if (!src) return Promise.resolve(false);
  if (video.readyState >= 2 && video.getAttribute('src')) {
    if (placeholder) placeholder.style.display = 'none';
    return Promise.resolve(true);
  }
  if (video._loadPromise) return video._loadPromise;
  if (!video.getAttribute('src')) video.src = src;
  video.preload = previewOnly ? 'metadata' : 'auto';
  video.load();
  video._loadPromise = new Promise((resolve) => {
    const ready = () => { cleanup(); resolve(true); };
    const failed = () => { cleanup(); resolve(false); };
    const cleanup = () => {
      video.removeEventListener('loadeddata', ready);
      video.removeEventListener('error', failed);
    };
    if (video.readyState >= 2) return ready();
    video.addEventListener('loadeddata', ready, { once: true });
    video.addEventListener('error', failed, { once: true });
  });
  return video._loadPromise;
}

if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
  viewerObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        activateValidatedExerciseViewer(entry.target);
      }
    }
  }, { rootMargin: '350px 0px' });
}

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);

/**
 * Renderiza la ficha completa V2 (17 secciones) para el visor modal o detalle.
 */
export function renderValidatedExerciseHTML(ex, options = {}) {
  const media = ex.media || {};
  const videoSrc = media.video || media.mp4 || (ex.animacion?.mp4) || '';
  const previewSrc = media.preview || (ex.animacion?.preview) || '';
  const realVideo = ex.video || '';
  const dr = ex.datos_rapidos || {};
  const org = ex.organizacion || {};

  // Tags en cabecera
  const tags = [ex.categoria, ...(ex.etiquetas || [])].filter(Boolean);
  const tagsHtml = tags.map(t => `<span class="brand-badge">${esc(t)}</span>`).join('');

  // 1. Qué se trabaja
  let queTrabajaHtml = '';
  if (ex.que_se_trabaja && ex.que_se_trabaja.length) {
    queTrabajaHtml = `
      <div id="section-que-se-trabaja" class="section-block">
        <h3>🎯 Qué se trabaja</h3>
        <div class="concept-chips">
          ${ex.que_se_trabaja.map(c => `<span class="concept-pill">${esc(c)}</span>`).join('')}
        </div>
      </div>`;
  }

  // 2. Objetivos
  let objHtml = '';
  if (ex.objetivo_principal || (ex.objetivos_secundarios && ex.objetivos_secundarios.length)) {
    objHtml = `
      <div id="section-objetivo" class="section-block">
        <h3>🏆 Objetivo del ejercicio</h3>
        ${ex.objetivo_principal ? `<div class="main-objective-box">${esc(ex.objetivo_principal)}</div>` : ''}
        ${ex.objetivos_secundarios && ex.objetivos_secundarios.length ? `
          <div style="margin-top:0.75rem">
            <div class="sub-label">Objetivos complementarios:</div>
            <ul class="plain-list bullet-list">
              ${ex.objetivos_secundarios.map(o => `<li>${esc(o)}</li>`).join('')}
            </ul>
          </div>` : ''}
      </div>`;
  }

  // 3. Datos rápidos
  const rapItems = [];
  if (dr.jugadores) rapItems.push(`<div class="quick-fact-card"><span class="fact-label">👥 Jugadores</span><span class="fact-value">${esc(dr.jugadores)}</span></div>`);
  if (dr.duracion) rapItems.push(`<div class="quick-fact-card"><span class="fact-label">⏱ Duración</span><span class="fact-value">${esc(dr.duracion)}</span></div>`);
  if (dr.espacio) rapItems.push(`<div class="quick-fact-card"><span class="fact-label">📐 Espacio</span><span class="fact-value">${esc(dr.espacio)}</span></div>`);
  if (dr.material) rapItems.push(`<div class="quick-fact-card"><span class="fact-label">📦 Material</span><span class="fact-value">${esc(dr.material)}</span></div>`);
  let datosRapidosHtml = '';
  if (rapItems.length) {
    datosRapidosHtml = `
      <div id="section-datos-rapidos" class="section-block">
        <div class="quick-facts-grid">${rapItems.join('')}</div>
      </div>`;
  }

  // 4. Montaje
  let montajeHtml = '';
  if (ex.montaje && (ex.montaje.dimensiones || ex.montaje.espacio_tipo || ex.montaje.explicacion)) {
    const badges = [];
    if (ex.montaje.dimensiones) badges.push(`<span class="chip-metric">📏 ${esc(ex.montaje.dimensiones)}</span>`);
    if (ex.montaje.espacio_tipo) badges.push(`<span class="chip-metric">📍 ${esc(ex.montaje.espacio_tipo)}</span>`);
    montajeHtml = `
      <div id="section-montaje" class="section-block">
        <h3>📐 Montaje y dimensiones</h3>
        ${badges.length ? `<div class="chips-row">${badges.join('')}</div>` : ''}
        ${ex.montaje.explicacion ? `<p class="section-text">${esc(ex.montaje.explicacion).replace(/\n/g, '<br>')}</p>` : ''}
      </div>`;
  }

  // 5. Material operativo
  let materialHtml = '';
  if (ex.materiales && ex.materiales.length) {
    materialHtml = `
      <div id="section-material" class="section-block">
        <h3>📦 Material necesario</h3>
        <ul class="plain-list material-list">
          ${ex.materiales.map(m => `
            <li>
              <strong>${m.icono ? m.icono + ' ' : ''}${esc(m.nombre)}${m.cantidad ? ` (x${m.cantidad})` : ''}:</strong>
              ${esc(m.funcion || 'Material de la tarea')}
            </li>`).join('')}
        </ul>
      </div>`;
  }

  // 6. Cómo se hace (Paso a paso)
  let comoSeHaceHtml = '';
  if (ex.como_se_hace && ex.como_se_hace.length) {
    comoSeHaceHtml = `
      <div id="section-como-se-hace" class="section-block">
        <h3>⚙️ Cómo se hace (Paso a paso)</h3>
        <div class="numbered-steps">
          ${ex.como_se_hace.map((step, idx) => `
            <div class="step-item">
              <span class="step-num">${idx + 1}</span>
              <div class="step-text">${esc(step)}</div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  // 7. Fases
  let fasesHtml = '';
  if (ex.fases && ex.fases.length) {
    fasesHtml = `
      <div id="section-fases" class="section-block">
        <h3>🔄 Fases de la tarea</h3>
        <div class="phases-list">
          ${ex.fases.map(f => `
            <div class="phase-card">
              <div class="phase-title">
                <span>${esc(f.titulo || `Fase ${f.orden || ''}`)}</span>
                ${f.poseedor_balon ? `<span class="phase-ball">⚽ Balón: <strong>${esc(f.poseedor_balon)}</strong></span>` : ''}
              </div>
              <div class="phase-desc">${esc(f.descripcion || '')}</div>
              ${f.que_ocurre_despues ? `<div class="phase-meta">👉 <em>Siguiente:</em> ${esc(f.que_ocurre_despues)}</div>` : ''}
              ${f.condicion_final && f.condicion_final !== f.descripcion ? `<div class="phase-meta">🏁 <em>Cierre:</em> ${esc(f.condicion_final)}</div>` : ''}
            </div>`).join('')}
        </div>
      </div>`;
  }

  // 8. Series y carga
  let cargaHtml = '';
  const cargaItems = [];
  if (ex.carga?.duracion) cargaItems.push(`<div class="quick-fact-card"><span class="fact-label">⏱ Duración</span><span class="fact-value">${esc(ex.carga.duracion)}</span></div>`);
  if (ex.carga?.series) cargaItems.push(`<div class="quick-fact-card"><span class="fact-label">🔁 Series</span><span class="fact-value">${esc(ex.carga.series)}</span></div>`);
  if (ex.carga?.repeticiones) cargaItems.push(`<div class="quick-fact-card"><span class="fact-label">🔄 Repeticiones</span><span class="fact-value">${esc(ex.carga.repeticiones)}</span></div>`);
  if (ex.carga?.descanso) cargaItems.push(`<div class="quick-fact-card"><span class="fact-label">🛑 Descanso</span><span class="fact-value">${esc(ex.carga.descanso)}</span></div>`);
  if (cargaItems.length || ex.carga?.ciclo_repeticion) {
    cargaHtml = `
      <div id="section-carga" class="section-block">
        <h3>⏱ Series, repeticiones y descansos</h3>
        ${cargaItems.length ? `<div class="quick-facts-grid">${cargaItems.join('')}</div>` : ''}
        ${ex.carga?.ciclo_repeticion ? `<div class="carga-cycle"><strong>Dinámica del ciclo:</strong> ${esc(ex.carga.ciclo_repeticion)}</div>` : ''}
      </div>`;
  }

  // 9. Rotación
  let rotacionHtml = '';
  const hasRot = ex.rotacion && (ex.rotacion.explicacion || (ex.rotacion.detalles && ex.rotacion.detalles.length) || (ex.rotacion.reglas && ex.rotacion.reglas.length));
  if (hasRot) {
    rotacionHtml = `
      <div id="section-rotacion" class="section-block">
        <h3>🔁 Rotación de jugadores</h3>
        ${ex.rotacion.explicacion ? `<p class="section-text">${esc(ex.rotacion.explicacion)}</p>` : ''}
        ${ex.rotacion.detalles && ex.rotacion.detalles.length ? `
          <ul class="plain-list bullet-list">
            ${ex.rotacion.detalles.map(d => `<li>${esc(d)}</li>`).join('')}
          </ul>` : ''}
        ${ex.rotacion.reglas && ex.rotacion.reglas.length ? `
          <div class="rot-rules">
            <strong>Reglas de cambio:</strong>
            <ul class="plain-list bullet-list">
              ${ex.rotacion.reglas.map(r => `<li>${esc(r)}</li>`).join('')}
            </ul>
          </div>` : ''}
      </div>`;
  }

  // 10. Qué observar
  let queObservarHtml = '';
  if (ex.que_observar && ex.que_observar.length) {
    queObservarHtml = `
      <div id="section-que-observar" class="section-block">
        <h3>👀 Qué debe observar el entrenador</h3>
        <ul class="plain-list bullet-list">
          ${ex.que_observar.map(item => `<li>${esc(item)}</li>`).join('')}
        </ul>
      </div>`;
  }

  // 11. Consignas del entrenador
  let consignasHtml = '';
  if (ex.consignas && ex.consignas.length) {
    consignasHtml = `
      <div id="section-consignas" class="section-block">
        <h3>🗣️ Consignas del entrenador</h3>
        <div class="consignas-list">
          ${ex.consignas.map(c => `
            <div class="consigna-quote">
              <span class="quote-icon">📢</span>
              <div class="quote-body">"${esc(c)}"</div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  // 12. Errores y correcciones (DEDUPLICADOS para evitar repeticiones)
  let erroresHtml = '';
  if (ex.errores_correcciones && ex.errores_correcciones.length) {
    const seen = new Set();
    const unique = [];
    for (const ec of ex.errores_correcciones) {
      const err = (ec.error || '').trim();
      const corr = (ec.correccion || '').trim();
      if (!err && !corr) continue;
      const key = `${err.toLowerCase()}___${corr.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push({ error: err, correccion: corr });
    }
    if (unique.length) {
      erroresHtml = `
        <div id="section-errores-correcciones" class="section-block">
          <h3>⚠️ Errores habituales y correcciones</h3>
          <div class="error-corr-grid">
            ${unique.map(ec => `
              <div class="error-corr-card">
                ${ec.error ? `
                  <div class="err-row">
                    <span class="err-tag">Error habitual</span>
                    <span class="err-text">${esc(ec.error)}</span>
                  </div>` : ''}
                ${ec.correccion ? `
                  <div class="corr-row">
                    <span class="corr-tag">Corrección clave</span>
                    <span class="corr-text">${esc(ec.correccion)}</span>
                  </div>` : ''}
              </div>`).join('')}
          </div>
        </div>`;
    }
  }

  // 13. Variantes
  let variantesHtml = '';
  if (ex.variantes && ex.variantes.length) {
    variantesHtml = `
      <div id="section-variantes" class="section-block">
        <h3>🔀 Variantes progresivas</h3>
        <ul class="plain-list bullet-list">
          ${ex.variantes.map(v => {
            if (typeof v === 'string') return `<li>${esc(v)}</li>`;
            const name = v.variante || v.nombre || 'Variante';
            const desc = v.variacion || v.descripcion || '';
            const obj = v.objetivo ? `<em class="var-objective">(${esc(v.objetivo)})</em>` : '';
            return `<li><strong>${esc(name)}:</strong> ${esc(desc)} ${obj}</li>`;
          }).join('')}
        </ul>
      </div>`;
  }

  // 14. Leyenda visual (DIRECTAMENTE BAJO EL VÍDEO)
  let leyendaHtml = '';
  const ley = ex.leyenda_visual;
  const hasJugadores = ley?.jugadores && ley.jugadores.length;
  const hasMateriales = ley?.materiales && ley.materiales.length;
  const hasAcciones = ley?.acciones && ley.acciones.length;
  const hasZonas = ley?.zonas && ley.zonas.length;

  if (hasJugadores || hasMateriales || hasAcciones || hasZonas) {
    let subBlocks = '';
    if (hasJugadores) {
      subBlocks += `
        <div class="legend-category">
          <div class="legend-subtitle">Jugadores y roles</div>
          <div class="legend-items-grid">
            ${ley.jugadores.map(j => `
              <div class="legend-card">
                <div class="legend-player-token" style="background:${j.color || '#3477DB'};">${esc(j.letra || 'J')}</div>
                <div class="legend-info">
                  <div class="legend-title">${esc(j.rol)}</div>
                  ${j.funcion ? `<div class="legend-detail">${esc(j.funcion)}</div>` : ''}
                </div>
              </div>`).join('')}
          </div>
        </div>`;
    }
    if (hasMateriales) {
      subBlocks += `
        <div class="legend-category">
          <div class="legend-subtitle">Materiales en diagrama</div>
          <div class="legend-items-grid">
            ${ley.materiales.map(m => `
              <div class="legend-card">
                <div class="legend-mat-icon">${m.icono || '📦'}</div>
                <div class="legend-info">
                  <div class="legend-title">${esc(m.nombre)}${m.cantidad ? ` (x${m.cantidad})` : ''}</div>
                  ${m.funcion ? `<div class="legend-detail">${esc(m.funcion)}</div>` : ''}
                </div>
              </div>`).join('')}
          </div>
        </div>`;
    }
    if (hasAcciones) {
      subBlocks += `
        <div class="legend-category">
          <div class="legend-subtitle">Acciones y desplazamientos</div>
          <div class="legend-items-grid">
            ${ley.acciones.map(a => `
              <div class="legend-card">
                <span class="legend-action-visual">${esc(a.trazo || '──────▶')}</span>
                <div class="legend-info">
                  <div class="legend-title">${esc(a.nombre || a.tipo)}</div>
                  ${a.significado ? `<div class="legend-detail">${esc(a.significado)}</div>` : ''}
                </div>
              </div>`).join('')}
          </div>
        </div>`;
    }
    if (hasZonas) {
      subBlocks += `
        <div class="legend-category">
          <div class="legend-subtitle">Zonas del campo</div>
          <div class="legend-items-grid">
            ${ley.zonas.map(z => `
              <div class="legend-card">
                <span class="legend-zone-visual">${esc(z.id || 'ZONA')}</span>
                <div class="legend-info">
                  <div class="legend-title">${esc(z.id || 'Zona')}</div>
                  ${z.detalle ? `<div class="legend-detail">${esc(z.detalle)}</div>` : ''}
                </div>
              </div>`).join('')}
          </div>
        </div>`;
    }
    leyendaHtml = `
      <div id="section-leyenda" class="section-block section-leyenda-subvideo">
        <div class="section-head-mini">
          <h3>🗺️ Leyenda del ejercicio</h3>
          <span class="pill-legend-info">Guía visual de la animación</span>
        </div>
        <div class="modal-leyenda-content">${subBlocks}</div>
      </div>`;
  }

  const videosHTML = renderVideoSectionHTML(options.videos || [], { role: options.role, exerciseId: ex.id });

  return `
  <div class="ejercicio-v2-sheet ejercicio-validado" data-id="${esc(ex.id)}" data-video="${esc(videoSrc)}" style="content-visibility:auto;contain-intrinsic-size:auto 900px" data-lazy-detail="1">
    <!-- Cabecera de la ficha con botón superior accesible -->
    <div class="sheet-head">
      <div class="sheet-title-group">
        <div class="sheet-tags">${tagsHtml}</div>
        <h2 class="sheet-title">${esc(ex.nombre)}</h2>
      </div>
      <button type="button" class="sheet-top-close-btn" data-close aria-label="Cerrar ejercicio">✕</button>
    </div>

    <!-- Reproductor de animación con controles y zoom integrado -->
    <div class="exercise-video-wrap">
      <button type="button" class="theater-exit-btn hidden" title="Salir de pantalla completa" aria-label="Salir de pantalla completa">✕ Salir</button>
      <div class="video-stage" style="position:relative">
        <video class="frame-video" data-src="${esc(videoSrc)}" poster="${esc(previewSrc)}" playsinline muted loop preload="none"></video>
        <div class="video-overlay-play" title="Reproducir animación">
          <span class="overlay-play-icon">▶</span>
        </div>
      </div>

      <!-- Barra de progreso / seek -->
      <div class="v-progress-container">
        <input type="range" class="v-seek-bar" min="0" max="100" step="0.1" value="0" aria-label="Línea de tiempo de la animación">
      </div>

      <!-- Selector interactivo de zonas para enfocar y ampliar -->
      <div class="v-zones-bar" role="toolbar" aria-label="Zonas tácticas para enfocar y ampliar">
        <span class="v-zones-label">🔍 Zona a ampliar:</span>
        <div class="v-zones-track">
          <button type="button" class="v-zone-chip active" data-zone="all" title="Todo el campo (vista general 100%)">🏟️ Todo (100%)</button>
          <button type="button" class="v-zone-chip" data-zone="goal" title="Área rival / Portería / Finalización">🥅 Área / Gol</button>
          <button type="button" class="v-zone-chip" data-zone="midfield" title="Centro del campo / Construcción">⚙️ Centro</button>
          <button type="button" class="v-zone-chip" data-zone="defense" title="Zona defensiva / Inicio de jugada">🛡️ Defensa</button>
          <button type="button" class="v-zone-chip" data-zone="left" title="Banda izquierda">◀ Banda Izq</button>
          <button type="button" class="v-zone-chip" data-zone="right" title="Banda derecha">▶ Banda Der</button>
        </div>
      </div>

      <!-- Controles tácticos: Organizados en 2 filas fijas, compactas y siempre visibles -->
      <div class="v-controls-bar">
        <!-- Fila 1: Reproducción, saltos 5s, tiempo, bucle y botón de pantalla completa -->
        <div class="v-controls-row v-controls-playback-row">
          <div class="v-controls-subgroup">
            <button type="button" class="v-btn v-btn-play primary" title="Reproducir / Pausar">▶</button>
            <button type="button" class="v-btn v-btn-rewind" title="Retroceder 5 segundos">⏪ 5s</button>
            <button type="button" class="v-btn v-btn-forward" title="Adelantar 5 segundos">5s ⏩</button>
            <span class="v-time-display">00:00 / 00:00</span>
          </div>
          <div class="v-controls-subgroup">
            <button type="button" class="v-btn v-btn-loop active" title="Bucle continuo (repetir)" aria-label="Repetir en bucle">🔁</button>
            <button type="button" class="v-btn v-btn-fullscreen" title="Ampliar a pantalla completa" aria-label="Ampliar a pantalla completa">⛶ <span class="v-btn-text">Ampliar</span></button>
          </div>
        </div>

        <!-- Fila 2: Velocidad y controles de zoom táctico con clamping -->
        <div class="v-controls-row v-controls-tools-row">
          <div class="v-tools-item">
            <span class="v-tools-label">Velocidad:</span>
            <div class="v-speed-group" title="Velocidad de reproducción">
              <button type="button" class="v-btn-speed" data-speed="0.5">0.5×</button>
              <button type="button" class="v-btn-speed active" data-speed="1.0">1×</button>
              <button type="button" class="v-btn-speed" data-speed="1.5">1.5×</button>
            </div>
          </div>

          <div class="v-tools-item">
            <span class="v-tools-label">Zoom:</span>
            <div class="v-zoom-group" title="Zoom táctico">
              <button type="button" class="v-btn v-btn-zoom-out" title="Alejar zoom" aria-label="Alejar zoom">🔍−</button>
              <button type="button" class="v-btn v-btn-zoom-reset" title="Restablecer zoom al 100%" aria-label="Restablecer zoom">100%</button>
              <button type="button" class="v-btn v-btn-zoom-in" title="Acercar zoom" aria-label="Acercar zoom">🔍+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Leyenda visual (inmediatamente después del vídeo) -->
    ${leyendaHtml}

    <!-- Secciones operativas del ejercicio -->
    <div class="sheet-sections-body">
      ${queTrabajaHtml}
      ${objHtml}
      ${datosRapidosHtml}
      ${montajeHtml}
      ${materialHtml}
      ${comoSeHaceHtml}
      ${fasesHtml}
      ${cargaHtml}
      ${rotacionHtml}
      ${queObservarHtml}
      ${consignasHtml}
      ${erroresHtml}
      ${variantesHtml}
      ${realVideo ? `
        <div class="section-block real-video-block">
          <h3>🎥 Demostración real en vídeo</h3>
          <div class="video-item">
            <video class="real-video-el" controls preload="none" playsinline src="${esc(realVideo)}"></video>
          </div>
        </div>` : ''}
      ${videosHTML}
    </div>

    <!-- Barra de acciones: Añadir a sesión + botón de cierre inferior fijo -->
    <div class="sheet-bottom-bar">
      <button type="button" class="add-exercise-to-session primary btn-add-session" data-id="${esc(ex.id)}">
        + Añadir a sesión
      </button>
      <button type="button" class="modal-bottom-close-btn" data-close>
        ✕ Cerrar Ejercicio
      </button>
    </div>
  </div>`;
}

/**
 * Renderiza la tarjeta compacta para la cuadrícula de la biblioteca (#exercises-list).
 */
export function renderExerciseGridCard(ex) {
  const media = ex.media || {};
  const preview = media.preview || ex.preview || '';
  const dr = ex.datos_rapidos || {};
  const tags = [ex.categoria, ...(ex.etiquetas || [])].slice(0, 2);

  return `
  <article class="panel exercise-card exercise-v2-card" data-exercise-id="${esc(ex.id)}">
    <div class="card-thumb-wrap view-exercise" data-exercise-id="${esc(ex.id)}">
      ${preview ? `<img src="${esc(preview)}" alt="${esc(ex.nombre)}" class="card-preview-img" loading="lazy">` : `<div class="card-thumb-placeholder">⚽ CampoBase</div>`}
      <span class="card-play-badge">▶</span>
      ${dr.duracion ? `<span class="card-duration-badge">${esc(dr.duracion)}</span>` : ''}
    </div>

    <div class="card-content">
      <div class="card-head-line">
        <div class="card-tags">${tags.map(t => `<span class="pill">${esc(t)}</span>`).join('')}</div>
        <button type="button" class="favorite-exercise ${ex.favorite ? 'active' : ''}" data-id="${esc(ex.id)}" aria-label="Favorito">
          ${ex.favorite ? '★' : '☆'}
        </button>
      </div>

      <h3 class="card-title view-exercise" data-exercise-id="${esc(ex.id)}">${esc(ex.nombre)}</h3>

      <div class="card-meta-facts">
        ${dr.jugadores ? `<span>👥 ${esc(dr.jugadores)}</span>` : ''}
        ${dr.material ? `<span>📦 ${esc(dr.material)}</span>` : ''}
      </div>

      <div class="button-row card-actions">
        <button type="button" class="view-exercise primary" data-exercise-id="${esc(ex.id)}">
          Ver ejercicio
        </button>
        <button type="button" class="add-exercise-to-session secondary" data-id="${esc(ex.id)}">
          + Sesión
        </button>
      </div>
    </div>
  </article>`;
}

/**
 * Inicializa el reproductor interactivo y controles de zoom táctico con clamping
 */
export function initValidatedExerciseViewer(root) {
  if (!root || root.dataset._viewerInit) return;
  root.dataset._viewerInit = '1';

  const video = root.querySelector('.frame-video');
  const stage = root.querySelector('.video-stage');
  const btnPlay = root.querySelector('.v-btn-play');
  const overlayPlay = root.querySelector('.video-overlay-play');
  const seekBar = root.querySelector('.v-seek-bar');
  const timeDisplay = root.querySelector('.v-time-display');
  const btnLoop = root.querySelector('.v-btn-loop');
  const btnFullscreen = root.querySelector('.v-btn-fullscreen');
  const speedButtons = root.querySelectorAll('.v-btn-speed');
  const btnZoomIn = root.querySelector('.v-btn-zoom-in');
  const btnZoomOut = root.querySelector('.v-btn-zoom-out');
  const btnZoomReset = root.querySelector('.v-btn-zoom-reset');
  const btnRewind = root.querySelector('.v-btn-rewind');
  const btnForward = root.querySelector('.v-btn-forward');

  if (!video) return;

  // Estado del reproductor y zoom
  let zoom = 1.0;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  function formatTime(sec) {
    if (!sec || isNaN(sec) || !isFinite(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function updateTime() {
    if (!video.duration) return;
    const current = video.currentTime;
    const duration = video.duration;
    if (seekBar && !seekBar.matches(':active')) {
      seekBar.value = (current / duration) * 100;
    }
    if (timeDisplay) {
      timeDisplay.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
    }
  }

  async function togglePlay() {
    await ensureVideoLoaded(video);
    const src = video.dataset.src;
    if (!video.getAttribute('src')) video.src = src;
    if (video.paused) {
      video.play().then(() => {
        if (btnPlay) btnPlay.textContent = '⏸';
        if (overlayPlay) overlayPlay.style.display = 'none';
      }).catch(console.warn);
    } else {
      video.pause();
      if (btnPlay) btnPlay.textContent = '▶';
      if (overlayPlay) overlayPlay.style.display = 'flex';
    }
  }

  if (btnPlay) btnPlay.addEventListener('click', togglePlay);
  if (overlayPlay) overlayPlay.addEventListener('click', togglePlay);
  if (video) video.addEventListener('click', togglePlay);

  video.addEventListener('timeupdate', updateTime);
  video.addEventListener('loadedmetadata', updateTime);
  video.addEventListener('ended', () => {
    if (!video.loop) {
      if (btnPlay) btnPlay.textContent = '▶';
      if (overlayPlay) overlayPlay.style.display = 'flex';
    }
  });

  if (seekBar) {
    seekBar.addEventListener('input', () => {
      if (video.duration) {
        video.currentTime = (seekBar.value / 100) * video.duration;
      }
    });
  }

  if (btnRewind) {
    btnRewind.addEventListener('click', () => {
      video.currentTime = Math.max(0, video.currentTime - 5);
    });
  }

  if (btnForward) {
    btnForward.addEventListener('click', () => {
      if (video.duration) video.currentTime = Math.min(video.duration, video.currentTime + 5);
    });
  }

  if (btnLoop) {
    btnLoop.addEventListener('click', () => {
      video.loop = !video.loop;
      btnLoop.classList.toggle('active', video.loop);
    });
  }

  speedButtons.forEach((b) => {
    b.addEventListener('click', () => {
      const spd = parseFloat(b.dataset.speed) || 1.0;
      video.playbackRate = spd;
      speedButtons.forEach(btn => btn.classList.toggle('active', btn === b));
    });
  });

  // ZOOM Y PAN TÁCTICO CON CLAMPING
  const zoneChips = root.querySelectorAll('.v-zone-chip');
  const theaterExitBtn = root.querySelector('.theater-exit-btn');

  function clampPan() {
    if (zoom <= 1.0) {
      panX = 0;
      panY = 0;
      return;
    }
    const rect = stage ? stage.getBoundingClientRect() : { width: 360, height: 240 };
    const maxPanX = (rect.width * (zoom - 1)) / 2;
    const maxPanY = (rect.height * (zoom - 1)) / 2;
    panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
    panY = Math.max(-maxPanY, Math.min(maxPanY, panY));
  }

  function updateTransform() {
    clampPan();
    video.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
    if (btnZoomReset) btnZoomReset.textContent = `${Math.round(zoom * 100)}%`;
    if (stage) stage.classList.toggle('is-zoomed', zoom > 1.0);
  }

  function applyZoom(newZoom) {
    zoom = Math.max(1.0, Math.min(3.0, Math.round(newZoom * 10) / 10));
    if (zoom === 1.0) {
      panX = 0;
      panY = 0;
      zoneChips.forEach((btn) => btn.classList.toggle('active', btn.dataset.zone === 'all'));
    }
    updateTransform();
  }

  function focusZone(zoneKey) {
    zoneChips.forEach((btn) => btn.classList.toggle('active', btn.dataset.zone === zoneKey));
    if (zoneKey === 'all') {
      applyZoom(1.0);
      return;
    }
    zoom = 1.85;
    const rect = stage ? stage.getBoundingClientRect() : { width: 360, height: 240 };
    const maxPanX = (rect.width * (zoom - 1)) / 2;
    const maxPanY = (rect.height * (zoom - 1)) / 2;

    switch (zoneKey) {
      case 'goal':
        // Portería y área de finalización
        panX = -maxPanX * 0.85;
        panY = 0;
        break;
      case 'midfield':
        // Centro del campo
        panX = 0;
        panY = 0;
        break;
      case 'defense':
        // Zona defensiva y salida
        panX = maxPanX * 0.85;
        panY = 0;
        break;
      case 'left':
        // Banda izquierda
        panX = 0;
        panY = maxPanY * 0.85;
        break;
      case 'right':
        // Banda derecha
        panX = 0;
        panY = -maxPanY * 0.85;
        break;
    }
    updateTransform();
  }

  zoneChips.forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      focusZone(chip.dataset.zone);
    });
  });

  if (btnZoomIn) btnZoomIn.addEventListener('click', () => applyZoom(zoom + 0.25));
  if (btnZoomOut) btnZoomOut.addEventListener('click', () => applyZoom(zoom - 0.25));
  if (btnZoomReset) btnZoomReset.addEventListener('click', () => applyZoom(1.0));

  // Panning al arrastrar cuando hay zoom
  if (stage) {
    stage.addEventListener('mousedown', (e) => {
      if (zoom <= 1.0) return;
      isDragging = true;
      startX = e.clientX - panX;
      startY = e.clientY - panY;
      stage.style.cursor = 'grabbing';
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      panX = e.clientX - startX;
      panY = e.clientY - startY;
      updateTransform();
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      if (stage) stage.style.cursor = zoom > 1.0 ? 'grab' : 'default';
    });

    // Soporte táctil móvil (pinch-to-zoom y pan)
    let initialPinchDist = 0;
    let initialZoom = 1.0;

    stage.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        initialPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialZoom = zoom;
      } else if (e.touches.length === 1 && zoom > 1.0) {
        isDragging = true;
        startX = e.touches[0].clientX - panX;
        startY = e.touches[0].clientY - panY;
      }
    }, { passive: true });

    stage.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && initialPinchDist > 0) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = dist / initialPinchDist;
        applyZoom(initialZoom * factor);
      } else if (e.touches.length === 1 && isDragging) {
        panX = e.touches[0].clientX - startX;
        panY = e.touches[0].clientY - startY;
        updateTransform();
      }
    }, { passive: true });

    stage.addEventListener('touchend', () => {
      isDragging = false;
      initialPinchDist = 0;
    });
  }

  // Modo Teatro / Ampliar a pantalla completa
  function toggleTheater(force) {
    const wrap = root.querySelector('.exercise-video-wrap');
    if (!wrap) return;
    const dialog = root.closest('dialog') || document.querySelector('#exercise-detail-dialog');
    const willBeFull = typeof force === 'boolean' ? force : !wrap.classList.contains('theater-fullscreen');
    wrap.classList.toggle('theater-fullscreen', willBeFull);
    if (dialog) {
      dialog.classList.toggle('is-theater-active', willBeFull);
    }
    if (theaterExitBtn) theaterExitBtn.classList.toggle('hidden', !willBeFull);
    if (btnFullscreen) {
      btnFullscreen.classList.toggle('active', willBeFull);
      btnFullscreen.innerHTML = willBeFull ? '✕ <span class="v-btn-text">Reducir</span>' : '⛶ <span class="v-btn-text">Ampliar</span>';
    }
    applyZoom(1.0);
    zoneChips.forEach((btn) => btn.classList.toggle('active', btn.dataset.zone === 'all'));
  }

  if (btnFullscreen) btnFullscreen.addEventListener('click', () => toggleTheater());
  if (theaterExitBtn) theaterExitBtn.addEventListener('click', () => toggleTheater(false));

  const parentDialog = root.closest('dialog');
  if (parentDialog) {
    parentDialog.addEventListener('close', () => {
      toggleTheater(false);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const wrap = root.querySelector('.exercise-video-wrap.theater-fullscreen');
      if (wrap) toggleTheater(false);
    }
  });
}
