import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const projectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('el controlador de pizarra reutilizable exporta initTacticBoard y usa el patrón in situ', async () => {
  const controller = await projectFile('js/tactic-board-controller.js');
  assert.match(controller, /export function initTacticBoard/);
  // Durante el arrastre se actualiza in situ (setAttribute), no se re-renderiza el contenedor.
  assert.match(controller, /updatePieceInPlace/);
  assert.match(controller, /setAttribute\('cx'/);
  assert.match(controller, /setAttribute\('cy'/);
  // El re-render solo ocurre al soltar (pointerup), no en cada pointermove.
  assert.match(controller, /const up = \(\) => \{[\s\S]*?render\(\)/);
});

test('el controlador cubre mover, balón, borrar línea, limpiar y los cinco tipos de flecha', async () => {
  const controller = await projectFile('js/tactic-board-controller.js');
  assert.match(controller, /tool === 'select'/);
  assert.match(controller, /tool === 'ball'/);
  assert.match(controller, /tool === 'erase'/);
  assert.match(controller, /tool === 'clear'/);
  assert.match(controller, /ARROW_KINDS\.has\(tool\)/);
  assert.match(controller, /createTacticMove\(start, to, tool\)/);
  assert.match(controller, /moveTacticPiece\(getState\(\), side, idx, p\)/);
});

test('el controlador sincroniza pizarra normal y ampliada a través del mismo estado', async () => {
  const controller = await projectFile('js/tactic-board-controller.js');
  assert.match(controller, /const roots = \[board, boardFull\]\.filter\(Boolean\)/);
  assert.match(controller, /for \(const root of roots\) root\.addEventListener\('pointerdown', begin\)/);
  assert.match(controller, /for \(const bar of \[tools, toolsFull\]\.filter\(Boolean\)\)/);
});
