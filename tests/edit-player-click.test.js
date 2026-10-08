import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('no hay shadowing de editPlayer en wireEvents que cause TDZ ReferenceError al editar jugadores', async () => {
  const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
  const wireStart = app.indexOf('function wireEvents(');
  const wireEnd = app.indexOf('init().catch(handleError);');
  const wireCode = app.slice(wireStart, wireEnd);

  // Asegura que no se declare una constante o variable local 'editPlayer' dentro del listener
  assert.doesNotMatch(wireCode, /\b(?:const|let|var)\s+editPlayer\s*=/);
  // Asegura que la llamada a editPlayer exista
  assert.match(wireCode, /if\s*\(editPlayerBtn\)\s*editPlayer\(editPlayerBtn\.dataset\.id\)/);
});
