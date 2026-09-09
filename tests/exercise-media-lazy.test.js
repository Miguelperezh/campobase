import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { EJERCICIOS_VALIDADOS } from '../js/ejercicios-validados.js';

const projectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

function mp4Path(item) {
  const anim = item.animacion || {};
  return anim.mp4 || String(anim.gif || '').replace(/\.gif$/i, '.mp4');
}

test('todas las demostraciones validadas tienen un MP4 disponible', async () => {
  const missing = [];
  for (const item of EJERCICIOS_VALIDADOS) {
    const path = mp4Path(item);
    if (!path) {
      missing.push(`${item.id}: sin ruta MP4`);
      continue;
    }
    try {
      await access(fileURLToPath(new URL(`../${path}`, import.meta.url)));
    } catch {
      missing.push(`${item.id}: ${path}`);
    }
  }
  assert.deepEqual(missing, [], `Faltan MP4 para:\n${missing.join('\n')}`);
});

test('las demostraciones MP4 no se descargan al renderizar la lista', async () => {
  const viewer = await projectFile('js/ejercicio-viewer.js');
  assert.match(viewer, /data-src=\\"\$\{esc\(videoSrc\)\}\\"/);
  assert.match(viewer, /preload=\\"none\\"/);
  assert.match(viewer, /function ensureVideoLoaded\(\)/);
  assert.match(viewer, /const videoSrc = anim\.mp4 \|\|/);
  assert.doesNotMatch(viewer, /class=\\"frame-video\\" src=/);
  assert.doesNotMatch(viewer, /class=\\"frame-video\\"[^>]*preload=\\"auto\\"/);
});
