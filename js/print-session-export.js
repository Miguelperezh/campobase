// js/print-session-export.js
// Exportación e impresión profesional y ultra-compacta de sesiones y ejercicios de CampoBase.
// Diseñado para entrenadores: formato de ficha de campo para carpeta con pinza,
// ahorro de tinta (fondo blanco eco-ink) y paginación estricta (1 página por ejercicio,
// 2 ejercicios por cara en sesiones completas).

import { findValidatedExercise } from './ejercicios-validados.js';

const esc = (value = '') => String(value ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[c]);

function isUsableImage(url = '') {
  const str = String(url || '').trim();
  if (!str) return false;
  if (/\/ejercicio-previews\//i.test(str)) return false;
  if (/\.(?:mp4|webm|mov|m4v)(?:$|[?#])/i.test(str)) return false;
  return true;
}

export function resolveExerciseData(exerciseOrId, state) {
  let ex = exerciseOrId;
  const id = typeof exerciseOrId === 'string' ? exerciseOrId : exerciseOrId?.id;
  
  const validated = id ? findValidatedExercise(id) : null;
  if (typeof exerciseOrId === 'string' && !validated && state?.exercises) {
    ex = state.exercises.find((item) => item.id === id);
  }

  const name = validated?.nombre || ex?.name || ex?.nombre || 'Ejercicio de entrenamiento';
  const category = validated?.categoria || ex?.category || ex?.categoria || 'General';
  const rawDuration = validated?.vista_rapida?.duracion || validated?.datos_rapidos?.duracion || ex?.duration || ex?.duracion || '';
  const duration = typeof rawDuration === 'number' ? `${rawDuration} min` : String(rawDuration || '15 min').replace(/aproximadamente\.?/gi, '').trim();
  const space = validated?.vista_rapida?.espacio || validated?.datos_rapidos?.espacio || ex?.space || ex?.espacio || '';
  const players = validated?.vista_rapida?.jugadores || validated?.datos_rapidos?.jugadores || ex?.players || ex?.jugadores || '';
  
  // Material
  let material = validated?.vista_rapida?.material || validated?.datos_rapidos?.material || ex?.material || '';
  if (!material && Array.isArray(validated?.materiales) && validated.materiales.length) {
    material = validated.materiales.map((m) => m.cantidad ? `${m.cantidad} ${m.nombre}` : m.nombre).join(', ');
  }

  // Preview Image
  let preview = '';
  const rawPreview = validated?.media?.preview || validated?.preview || ex?.preview || ex?.media?.preview || ex?.boardPreview || '';
  if (isUsableImage(rawPreview)) {
    preview = rawPreview;
  }

  // Dynamic / Description
  let description = '';
  if (Array.isArray(validated?.como_se_hace) && validated.como_se_hace.length) {
    description = validated.como_se_hace.join('\n');
  } else if (validated?.explicacion) {
    description = validated.explicacion;
  } else if (validated?.descripcion) {
    description = validated.descripcion;
  } else if (ex?.description) {
    description = ex.description;
  } else if (ex?.notes) {
    description = ex.notes;
  }

  // Rules / Provocation
  let rules = '';
  if (Array.isArray(validated?.reglas) && validated.reglas.length) {
    rules = validated.reglas.join('\n');
  } else if (validated?.reglas) {
    rules = String(validated.reglas);
  } else if (ex?.rules) {
    rules = ex.rules;
  }

  // Consignas / Tips
  let tips = '';
  if (Array.isArray(validated?.consignas) && validated.consignas.length) {
    tips = validated.consignas.slice(0, 4).join('\n');
  } else if (validated?.consignas) {
    tips = String(validated.consignas);
  } else if (ex?.tips) {
    tips = Array.isArray(ex.tips) ? ex.tips.join('\n') : String(ex.tips);
  } else if (ex?.consignas) {
    tips = Array.isArray(ex.consignas) ? ex.consignas.join('\n') : String(ex.consignas);
  }

  // Organization
  let organization = '';
  if (validated?.montaje?.explicacion) {
    organization = validated.montaje.explicacion;
  } else if (validated?.carga?.ciclo_repeticion) {
    organization = validated.carga.ciclo_repeticion;
  } else if (ex?.organization) {
    organization = ex.organization;
  } else if (ex?.organizacion) {
    organization = ex.organizacion;
  }

  return {
    id,
    name,
    category,
    duration,
    space,
    players,
    material,
    preview,
    description,
    rules,
    tips,
    organization,
  };
}

/**
 * Genera el HTML para imprimir un único ejercicio en estricto formato de 1 SOLA PÁGINA A4.
 */
export function buildSingleExerciseHtml(exerciseOrId, state) {
  const data = resolveExerciseData(exerciseOrId, state);
  const teamName = state?.teamName || state?.settings?.teamName || 'CampoBase';

  const previewHtml = data.preview
    ? `<img src="${esc(data.preview)}" alt="Diagrama de ${esc(data.name)}" class="cb-print-field-img" />`
    : `<div class="cb-print-pitch-diagram">
        <div class="cb-print-pitch-lines">
          <div class="cb-print-pitch-circle"></div>
          <div class="cb-print-pitch-half"></div>
        </div>
        <span class="cb-print-pitch-label">⚽ ${esc(data.name)}</span>
       </div>`;

  return `
    <div id="cb-print-root" class="cb-print-root cb-print-exercise-page">
      <header class="cb-print-header">
        <div class="cb-print-brand-row">
          <span class="cb-print-logo">⚽ CAMPOBASE</span>
          <span class="cb-print-doc-badge">FICHA TÉCNICA DE ENTRENAMIENTO</span>
          <span class="cb-print-team-name">${esc(teamName)}</span>
        </div>
        <h1 class="cb-print-title">${esc(data.name)}</h1>
        <div class="cb-print-tags-row">
          <span class="cb-print-pill accent">🏷️ ${esc(data.category)}</span>
          <span class="cb-print-pill">⏱️ ${esc(data.duration)}</span>
          ${data.space ? `<span class="cb-print-pill">📐 ${esc(data.space)}</span>` : ''}
          ${data.players ? `<span class="cb-print-pill">👥 ${esc(data.players)}</span>` : ''}
        </div>
      </header>

      <div class="cb-print-exercise-layout">
        <!-- Parte superior: Gráfico del campo a ancho completo -->
        <div class="cb-print-stage-box">
          ${previewHtml}
        </div>

        <!-- Parte inferior: 2 columnas equilibradas para no saltar de página -->
        <div class="cb-print-columns-grid">
          <div class="cb-print-col">
            ${data.material ? `
            <div class="cb-print-card">
              <h3 class="cb-print-card-title">📦 Material Necesario</h3>
              <p class="cb-print-card-text">${esc(data.material)}</p>
            </div>` : ''}

            ${data.organization ? `
            <div class="cb-print-card">
              <h3 class="cb-print-card-title">👥 Organización y Espacio</h3>
              <p class="cb-print-card-text">${esc(data.organization)}</p>
            </div>` : ''}
          </div>

          <div class="cb-print-col">
            <div class="cb-print-card">
              <h3 class="cb-print-card-title">📋 Desarrollo de la Tarea</h3>
              <p class="cb-print-card-text pre-line">${esc(data.description || 'Sin descripción detallada.')}</p>
            </div>

            ${data.rules ? `
            <div class="cb-print-card">
              <h3 class="cb-print-card-title">⚡ Reglas de Provocación</h3>
              <p class="cb-print-card-text pre-line">${esc(data.rules)}</p>
            </div>` : ''}

            ${data.tips ? `
            <div class="cb-print-card">
              <h3 class="cb-print-card-title">💡 Consignas del Entrenador</h3>
              <p class="cb-print-card-text pre-line">${esc(data.tips)}</p>
            </div>` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Imprime un único ejercicio en estricto formato de 1 SOLA PÁGINA A4.
 */
export function printSingleExercise(exerciseOrId, state) {
  const html = buildSingleExerciseHtml(exerciseOrId, state);
  if (!html) return;
  executePrint(html);
}

/**
 * Genera el HTML de la sesión completa en formato ultra-compacto (2 tareas por página A4).
 */
export function buildTrainingSessionHtml(sessionOrId, state) {
  const session = typeof sessionOrId === 'string'
    ? state?.trainingSessions?.find((s) => s.id === sessionOrId)
    : sessionOrId;

  if (!session) {
    if (typeof window !== 'undefined' && typeof window.toast === 'function') {
      window.toast('No se encontró la sesión a imprimir.');
    }
    return '';
  }

  const teamName = state?.teamName || state?.settings?.teamName || 'CampoBase';
  const sessionName = session.name || 'Sesión de Entrenamiento';
  const sessionDate = session.date ? new Date(session.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const blocks = Array.isArray(session.blocks) ? session.blocks : [];

  // Calcular duración total
  const totalDuration = blocks.reduce((sum, b) => sum + (Number(b.duration) || 0), 0) || session.totalDuration || session.targetDuration || 90;

  // Material total de la sesión
  const totalMaterial = session.material || blocks.map((b) => {
    const data = resolveExerciseData(b.exerciseId, state);
    return data.material;
  }).filter(Boolean).join(', ');

  const blocksHtml = blocks.map((block, idx) => {
    const data = resolveExerciseData(block.exerciseId, state);
    const blockDuration = block.duration ? `${block.duration} min` : data.duration;
    const blockPhase = block.type === 'warmup' ? 'Calentamiento' : block.type === 'main' ? 'Parte Principal' : block.type === 'final' ? 'Juego / Vuelta a la Calma' : data.category;
    
    const previewHtml = data.preview
      ? `<img src="${esc(data.preview)}" alt="Diagrama" class="cb-print-session-task-img" />`
      : `<div class="cb-print-session-task-placeholder">⚽ CampoBase</div>`;

    return `
      <article class="cb-print-session-task">
        <div class="cb-print-task-head">
          <div class="cb-print-task-left">
            <span class="cb-print-task-badge">#${idx + 1}</span>
            <span class="cb-print-task-phase">${esc(blockPhase)}</span>
            <h2 class="cb-print-task-title">${esc(data.name)}</h2>
          </div>
          <div class="cb-print-task-right">
            <span class="cb-print-pill-duration">⏱️ ${esc(blockDuration)}</span>
          </div>
        </div>

        <div class="cb-print-task-body">
          <div class="cb-print-task-media">
            ${previewHtml}
            ${data.space ? `<div class="cb-print-task-submeta">📐 ${esc(data.space)}</div>` : ''}
            ${data.players ? `<div class="cb-print-task-submeta">👥 ${esc(data.players)}</div>` : ''}
          </div>
          <div class="cb-print-task-info">
            ${data.material ? `<div class="cb-print-task-material"><strong>📦 Material:</strong> ${esc(data.material)}</div>` : ''}
            <div class="cb-print-task-desc">${esc(block.notes || data.description || 'Sin descripción.')}</div>
            ${data.rules ? `<div class="cb-print-task-rules"><strong>⚡ Reglas:</strong> ${esc(data.rules)}</div>` : ''}
          </div>
        </div>
      </article>
    `;
  }).join('');

  return `
    <div id="cb-print-root" class="cb-print-root cb-print-session-page">
      <header class="cb-print-header">
        <div class="cb-print-brand-row">
          <span class="cb-print-logo">⚽ CAMPOBASE</span>
          <span class="cb-print-doc-badge">HOJA DE SESIÓN DE ENTRENAMIENTO</span>
          <span class="cb-print-team-name">${esc(teamName)}</span>
        </div>
        <h1 class="cb-print-title">${esc(sessionName)}</h1>
        <div class="cb-print-meta-grid">
          <div><strong>📅 Fecha:</strong> ${esc(sessionDate)}</div>
          ${session.time ? `<div><strong>⏰ Hora:</strong> ${esc(session.time)}</div>` : ''}
          ${session.pitch ? `<div><strong>🏟️ Campo:</strong> ${esc(session.pitch)}</div>` : ''}
          <div><strong>⏱️ Tiempo Total:</strong> ${esc(totalDuration)} min (${blocks.length} tareas)</div>
        </div>
        ${totalMaterial ? `<div class="cb-print-summary-box"><strong>📦 Material total necesario:</strong> ${esc(totalMaterial)}</div>` : ''}
        ${session.notes ? `<div class="cb-print-summary-box"><strong>📝 Observaciones:</strong> ${esc(session.notes)}</div>` : ''}
      </header>

      <div class="cb-print-session-tasks-list">
        ${blocksHtml}
      </div>
    </div>
  `;
}

/**
 * Imprime una sesión completa en formato ultra-compacto (2 tareas por página A4).
 */
export function printTrainingSession(sessionOrId, state) {
  const html = buildTrainingSessionHtml(sessionOrId, state);
  if (!html) return;
  executePrint(html);
}

function executePrint(htmlContent) {
  if (typeof document === 'undefined') return;
  let container = document.getElementById('cb-print-root');
  if (container) {
    container.remove();
  }

  container = document.createElement('div');
  container.id = 'cb-print-root';
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  // Asegurar que las imágenes carguen antes de abrir el diálogo de impresión
  const images = [...container.querySelectorAll('img')];
  if (images.length === 0) {
    triggerBrowserPrint(container);
    return;
  }

  let loaded = 0;
  const onDone = () => {
    loaded++;
    if (loaded >= images.length) {
      triggerBrowserPrint(container);
    }
  };

  images.forEach((img) => {
    if (img.complete) {
      onDone();
    } else {
      img.addEventListener('load', onDone, { once: true });
      img.addEventListener('error', onDone, { once: true });
    }
  });

  // Timeout de seguridad por si una imagen tarda
  const imgTimeout = setTimeout(() => {
    if (loaded < images.length) {
      triggerBrowserPrint(container);
    }
  }, 600);
  if (imgTimeout?.unref) imgTimeout.unref();
}

function triggerBrowserPrint(container) {
  if (typeof window === 'undefined') return;
  const cleanup = () => {
    if (container && container.parentNode) {
      container.remove();
    }
  };

  window.addEventListener('afterprint', cleanup, { once: true });
  // Fallback si afterprint no salta en ciertos navegadores móviles
  const cleanupTimeout = setTimeout(cleanup, 60000);
  if (cleanupTimeout?.unref) cleanupTimeout.unref();

  if (typeof window.print === 'function') {
    window.print();
  }
}

