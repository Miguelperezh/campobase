// Vídeos de ejercicios en CampoBase.
// Los archivos viven en Supabase Storage (bucket público `ejercicio-videos`) y la
// metadata (ruta, nombre, orden) se guarda como `recordType: 'exerciseVideo'` en el
// store `settings` (tabla `configuracion`), de modo que se sincroniza entre dispositivos
// con el mismo mecanismo que ejercicios, sesiones y tácticas.
//
// El reproductor usa la URL pública del bucket, así que cualquier dispositivo con la
// metadata puede reproducir el vídeo sin descargarlo a IndexedDB.

import { SUPABASE_URL, VIDEO_BUCKET } from './supabase-client.js';

// Límite global de Supabase en el plan Free: 50 MB por archivo.
export const VIDEO_MAX_BYTES = 50 * 1024 * 1024;

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);

// Ruta del archivo dentro del bucket: <exerciseId>/<videoId>.<ext>.
export function videoPath(exerciseId, videoId, extension) {
  const safeExercise = String(exerciseId ?? '').replace(/[^a-zA-Z0-9_-]/g, '');
  const safeVideo = String(videoId ?? '').replace(/[^a-zA-Z0-9_-]/g, '');
  const safeExt = String(extension ?? 'mp4').toLowerCase().replace(/[^a-z0-9]/g, '') || 'mp4';
  if (!safeExercise || !safeVideo) throw new TypeError('El vídeo necesita un ejercicio y un identificador válidos.');
  return `${safeExercise}/${safeVideo}.${safeExt}`;
}

// URL pública de reproducción (sin token, bucket público).
export function videoPublicUrl(path) {
  const segments = String(path ?? '').split('/').map((segment) => encodeURIComponent(segment)).join('/');
  return `${SUPABASE_URL}/storage/v1/object/public/${VIDEO_BUCKET}/${segments}`;
}

// Construye y valida el registro de metadata de un vídeo.
export function buildVideoRecord(values, metadata = {}) {
  const exerciseId = String(values.exerciseId ?? '').trim();
  if (!exerciseId) throw new TypeError('El vídeo debe estar vinculado a un ejercicio.');
  const path = String(values.path ?? '').trim();
  if (!path) throw new TypeError('El vídeo necesita una ruta de almacenamiento.');
  const mime = String(values.mime ?? '');
  if (!/^video\//.test(mime)) throw new TypeError('El archivo debe ser un vídeo.');
  const size = Number(values.size);
  if (!Number.isFinite(size) || size <= 0) throw new TypeError('El tamaño del vídeo no es válido.');
  if (size > VIDEO_MAX_BYTES) throw new RangeError('El vídeo supera el límite de 50 MB.');
  return {
    id: metadata.id,
    recordType: 'exerciseVideo',
    exerciseId,
    nombre: String(values.nombre ?? '').trim() || 'Vídeo',
    path,
    mime,
    size,
    orden: Number.isFinite(Number(values.orden)) ? Number(values.orden) : 0,
    createdAt: metadata.createdAt,
    updatedAt: metadata.now,
  };
}

export function sortVideos(videos) {
  if (!Array.isArray(videos)) throw new TypeError('Los vídeos deben ser una lista.');
  return [...videos].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0) || (a.createdAt ?? 0) - (b.createdAt ?? 0));
}

// HTML de la sección de vídeos de un ejercicio. Solo Migue (owner) puede subir o borrar.
export function renderVideoSectionHTML(videos = [], { role = null, exerciseId = '' } = {}) {
  const canManage = role === 'owner';
  const list = sortVideos(videos);
  if (!list.length && !canManage) return '';
  const items = list.map((video) => `
    <div class="video-item" data-video-id="${esc(video.id)}">
      <video controls preload="metadata" playsinline src="${esc(videoPublicUrl(video.path))}"></video>
      <div class="video-meta">
        <span class="video-name">${esc(video.nombre)}</span>
        ${canManage ? `<button type="button" class="delete-video danger compact" data-video-id="${esc(video.id)}" aria-label="Borrar vídeo">Borrar</button>` : ''}
      </div>
    </div>`).join('');
  const upload = canManage
    ? `<label class="button secondary compact video-upload">Añadir vídeo<input type="file" accept="video/*" class="video-file-input" data-exercise-id="${esc(exerciseId)}" hidden></label>`
    : '';
  return `
    <div class="videos" data-exercise-id="${esc(exerciseId)}">
      <h3>Vídeos</h3>
      ${items || '<p class="meta">Sin vídeos todavía.</p>'}
      ${upload}
    </div>`;
}

// Conecta la subida y el borrado de la sección de vídeos de un contenedor.
export function initVideoSection(root, { onUpload, onDelete } = {}) {
  if (!root || root.dataset._videoInit) return;
  root.dataset._videoInit = '1';
  const input = root.querySelector('.video-file-input');
  if (input) {
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      input.value = '';
      if (!file) return;
      if (onUpload) await onUpload(input.dataset.exerciseId, file);
    });
  }
  root.querySelectorAll('.delete-video').forEach((button) => {
    button.addEventListener('click', async () => {
      if (onDelete) await onDelete(button.dataset.videoId);
    });
  });
}
