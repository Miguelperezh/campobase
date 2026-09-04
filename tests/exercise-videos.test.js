import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VIDEO_MAX_BYTES,
  buildVideoRecord,
  sortVideos,
  videoPath,
  videoPublicUrl,
  renderVideoSectionHTML,
} from '../js/ejercicio-videos.js';

test('construye un registro de vídeo válido con su metadata', () => {
  const record = buildVideoRecord(
    { exerciseId: 'EX-1', nombre: 'Demo.mp4', path: 'EX-1/v1.mp4', mime: 'video/mp4', size: 1000, orden: 0 },
    { id: 'v1', createdAt: 1, now: 2 },
  );
  assert.equal(record.recordType, 'exerciseVideo');
  assert.equal(record.exerciseId, 'EX-1');
  assert.equal(record.nombre, 'Demo.mp4');
  assert.equal(record.path, 'EX-1/v1.mp4');
  assert.equal(record.size, 1000);
});

test('rechaza vídeos sin ejercicio, sin ruta, que no son vídeo o demasiado grandes', () => {
  assert.throws(() => buildVideoRecord({ exerciseId: '', path: 'x.mp4', mime: 'video/mp4', size: 1 }, { id: 'v' }), /ejercicio/i);
  assert.throws(() => buildVideoRecord({ exerciseId: 'E', path: '', mime: 'video/mp4', size: 1 }, { id: 'v' }), /ruta/i);
  assert.throws(() => buildVideoRecord({ exerciseId: 'E', path: 'x.mp4', mime: 'image/png', size: 1 }, { id: 'v' }), /vídeo/i);
  assert.throws(() => buildVideoRecord({ exerciseId: 'E', path: 'x.mp4', mime: 'video/mp4', size: VIDEO_MAX_BYTES + 1 }, { id: 'v' }), /50 MB/i);
});

test('ordena los vídeos por orden y, a igual orden, por fecha de creación', () => {
  const videos = [
    { id: 'b', orden: 1, createdAt: 2 },
    { id: 'a', orden: 0, createdAt: 1 },
    { id: 'c', orden: 0, createdAt: 3 },
  ];
  assert.deepEqual(sortVideos(videos).map((v) => v.id), ['a', 'c', 'b']);
});

test('genera la ruta y la URL pública del vídeo', () => {
  assert.equal(videoPath('EX-1', 'v1', 'mp4'), 'EX-1/v1.mp4');
  assert.equal(
    videoPublicUrl('EX-1/v1.mp4'),
    'https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/EX-1/v1.mp4',
  );
});

test('la sección de vídeos muestra reproductor y solo Migue puede subir o borrar', () => {
  const videos = [{ id: 'v1', nombre: 'Demo', path: 'EX-1/v1.mp4', orden: 0, createdAt: 1 }];
  const owner = renderVideoSectionHTML(videos, { role: 'owner', exerciseId: 'EX-1' });
  assert.match(owner, /<video/);
  assert.match(owner, /video-file-input/);
  assert.match(owner, /delete-video/);
  const delegate = renderVideoSectionHTML(videos, { role: 'delegate', exerciseId: 'EX-1' });
  assert.match(delegate, /<video/);
  assert.doesNotMatch(delegate, /video-file-input/);
  assert.doesNotMatch(delegate, /delete-video/);
});

test('sin vídeos y sin permiso de Migue no se pinta la sección', () => {
  assert.equal(renderVideoSectionHTML([], { role: 'delegate', exerciseId: 'EX-1' }), '');
  assert.match(renderVideoSectionHTML([], { role: 'owner', exerciseId: 'EX-1' }), /Sin vídeos todavía/);
});
