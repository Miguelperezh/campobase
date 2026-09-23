import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MODULE_CONFIG } from '../js/redesign-nav.js';
import { shareOrDownloadPrintDoc, executePrint } from '../js/print-session-export.js';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const app = read('js/app.js');
const nav = read('js/redesign-nav.js');
const styles = read('styles-redesign.css');
const printExport = read('js/print-session-export.js');

test('Partidos revierte la subpestaña Delegado y conserva exactamente 4 pestañas limpias', () => {
  const partidosConfig = MODULE_CONFIG.partidos;
  assert.ok(partidosConfig, 'MODULE_CONFIG.partidos debe existir');
  assert.equal(partidosConfig.subTabs.length, 4, 'Partidos debe tener exactamente 4 pestañas superiores');
  const tabIds = partidosConfig.subTabs.map((t) => t.id);
  assert.deepEqual(tabIds, ['convocatorias', 'preparacion', 'partido', 'calendario']);
  assert.equal(tabIds.includes('delegado'), false, 'La subpestaña Delegado no debe estar en subTabs de Partidos');
});

test('Botón Mostrar/Ocultar al delegado está disponible en Partido en Vivo y en la lista de Alineación', () => {
  // En Partido en vivo: #unlock-delegate siempre visible para owner y conmuta estado
  assert.match(app, /unlockBtn = roleCanUseOwnerFeatures\(state\.role\)/);
  assert.match(app, /state\.timer\.delegateUnlocked \? 'Ocultar al Delegado' : 'Mostrar al Delegado'/);
  assert.match(app, /target\.id === 'unlock-delegate'/);
  assert.match(app, /state\.timer\.delegateUnlocked = !state\.timer\.delegateUnlocked/);

  // En la lista de Alineación (preparaciones): botón directo en cada tarjeta de partido preparado
  assert.match(app, /prep-toggle-delegate/);
  assert.match(app, /prep\.delegateShown \? 'Ocultar al Delegado' : 'Mostrar al Delegado'/);
  assert.match(app, /togglePrepDelegateForMatch/);
  assert.match(app, /target\.matches\('\.prep-toggle-delegate'\)/);
});

test('El delegado entra con PIN 0000 y queda aislado exclusivamente en Partido en Vivo', () => {
  // Autenticación con PIN 0000
  assert.match(app, /pin === '0000'/);
  assert.match(app, /applyRole\('delegate'\)/);
  assert.match(app, /Introduce el PIN de Migue, del delegado \(0000\)/);

  // Aislamiento CSS estricto: oculta barras de navegación, buscador, ajustes y cabecera
  assert.match(styles, /body\.delegate-mode #cb-bottom-nav/);
  assert.match(styles, /body\.delegate-mode #cb-sub-nav/);
  assert.match(styles, /body\.delegate-mode \.cb-topbar/);
  assert.match(styles, /body\.delegate-mode \.search-bar/);
  assert.match(styles, /body\.delegate-mode \.view:not\(#delegado\)\s*\{\s*display:\s*none\s*!important;\s*\}/);
  assert.match(styles, /body\.delegate-mode #delegado\s*\{\s*display:\s*block\s*!important;/);

  // redesign-nav oculta sub-nav si está en delegate-mode o view delegado
  assert.match(nav, /document\.body\.classList\.contains\('delegate-mode'\) \|\| activeViewId === 'delegado'/);
});

test('Guardar en el móvil y exportación de ficha soporta Web Share y descarga directa', () => {
  // Función exportada para móvil
  assert.equal(typeof shareOrDownloadPrintDoc, 'function');
  assert.match(printExport, /export async function shareOrDownloadPrintDoc/);
  assert.match(printExport, /navigator\.share/);
  assert.match(printExport, /isMobileDevice/);

  // Botones destacados en la barra flotante para móvil
  assert.match(printExport, /cb-print-btn-share/);
  assert.match(printExport, /cb-print-btn-download/);
  assert.match(printExport, /cb-print-btn-print/);
  assert.match(printExport, /Guardar \/ Compartir \(WhatsApp, Archivos\)/);

  // Estilos en styles-redesign.css
  assert.match(styles, /\.cb-print-btn-share/);
  assert.match(styles, /\.cb-print-btn-download/);
});
