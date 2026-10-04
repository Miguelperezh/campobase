import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildMatchPlanHtml } from '../js/print-match-plan.js';
import { plannedMinutes } from '../js/match-moments.js';

const appSource = fs.readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const printMatchPlanSource = fs.readFileSync(new URL('../js/print-match-plan.js', import.meta.url), 'utf8');
const printSessionExportSource = fs.readFileSync(new URL('../js/print-session-export.js', import.meta.url), 'utf8');
const indexHtmlSource = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const claudePlantillaCss = fs.readFileSync(new URL('../css/claude-plantilla.css', import.meta.url), 'utf8');
const claudePartidoCss = fs.readFileSync(new URL('../css/claude-partido.css', import.meta.url), 'utf8');
const claudeHoyCss = fs.readFileSync(new URL('../css/claude-hoy.css', import.meta.url), 'utf8');
const claudeEntrenoCss = fs.readFileSync(new URL('../css/claude-entreno.css', import.meta.url), 'utf8');

const mockPlayers = [
  { id: 'p1', name: 'Mateo Moyano', number: 1, positions: ['Portero'] },
  { id: 'p13', name: 'Carlos Campillo', number: 13, positions: ['Portero'] },
  { id: 'p3', name: 'Antonio Roldán', number: 3, positions: ['Medio'] },
  { id: 'p5', name: 'Diego Andrés', number: 5, positions: ['Defensa'] },
  { id: 'p7', name: 'Alejandro Pedrós', number: 7, positions: ['Delantero'] },
  { id: 'p8', name: 'Alejandro Suárez', number: 8, positions: ['Defensa'] },
  { id: 'p9', name: 'Ignacio Poladura', number: 9, positions: ['Delantero'] },
  { id: 'p11', name: 'Aitor Navarro', number: 11, positions: ['Defensa'] },
  { id: 'p12', name: 'Javier Navarro', number: 12, positions: ['Medio'] },
  { id: 'p15', name: 'Pelayo Marrero', number: 15, positions: ['Medio'] },
  { id: 'p16', name: 'Pablo Montesdeoca', number: 16, positions: ['Defensa'] },
  { id: 'p18', name: 'Dylan Campanario', number: 18, positions: ['Defensa'] },
];

const mockMatchF7 = {
  id: 'match-alevin-test',
  opponent: 'Huracán A',
  round: '5',
  date: '2026-10-15',
  time: '11:00',
  pitch: 'Pepe Gonçalvez',
  venue: 'home',
  format: 'F7',
};

test('Paginación dinámica del PDF de Plan de Partido: <= 3 momentos genera 2 páginas', () => {
  const prep2Moments = {
    matchId: 'match-alevin-test',
    formacion: '1-3-2-1',
    moments: [
      {
        id: 'm-0',
        minute: 0,
        formation: '1-3-2-1',
        team: [
          { pos: 'Portero', playerId: 'p1' },
          { pos: 'Defensa izq.', playerId: 'p18' },
          { pos: 'Central', playerId: 'p16' },
          { pos: 'Defensa der.', playerId: 'p5' },
          { pos: 'Medio izq.', playerId: 'p3' },
          { pos: 'Medio der.', playerId: 'p15' },
          { pos: 'Delantero', playerId: 'p7' },
        ],
      },
      {
        id: 'm-35',
        minute: 35,
        formation: '1-3-2-1',
        team: [
          { pos: 'Portero', playerId: 'p13' },
          { pos: 'Defensa izq.', playerId: 'p8' },
          { pos: 'Central', playerId: 'p11' },
          { pos: 'Defensa der.', playerId: 'p5' },
          { pos: 'Medio izq.', playerId: 'p12' },
          { pos: 'Medio der.', playerId: 'p9' },
          { pos: 'Delantero', playerId: 'p7' },
        ],
      },
    ],
  };

  const html = buildMatchPlanHtml({
    match: mockMatchF7,
    prep: prep2Moments,
    players: mockPlayers,
    callup: { availableIds: mockPlayers.map((p) => p.id) },
  });

  assert.ok(html.includes('cbx-pmp-page-1'), 'Debe incluir página 1');
  assert.ok(html.includes('cbx-pmp-page-2'), 'Debe incluir página 2');
  assert.ok(!html.includes('cbx-pmp-page-1b'), 'No debe incluir página 1b cuando hay <= 3 momentos');
  assert.ok(html.includes('Página 1 de 2'), 'Pie de página 1 debe indicar "Página 1 de 2"');
  assert.ok(html.includes('Página 2 de 2'), 'Pie de página 2 debe indicar "Página 2 de 2"');
});

test('Paginación dinámica del PDF de Plan de Partido: > 3 momentos pagina a 3 hojas limpias', () => {
  const prep4Moments = {
    matchId: 'match-alevin-test',
    formacion: '1-3-2-1',
    moments: [
      {
        id: 'm-0',
        minute: 0,
        formation: '1-3-2-1',
        team: [
          { pos: 'Portero', playerId: 'p1' },
          { pos: 'Defensa izq.', playerId: 'p18' },
          { pos: 'Central', playerId: 'p16' },
          { pos: 'Defensa der.', playerId: 'p5' },
          { pos: 'Medio izq.', playerId: 'p3' },
          { pos: 'Medio der.', playerId: 'p15' },
          { pos: 'Delantero', playerId: 'p7' },
        ],
      },
      {
        id: 'm-17',
        minute: 17,
        formation: '1-3-2-1',
        team: [
          { pos: 'Portero', playerId: 'p1' },
          { pos: 'Defensa izq.', playerId: 'p8' },
          { pos: 'Central', playerId: 'p16' },
          { pos: 'Defensa der.', playerId: 'p11' },
          { pos: 'Medio izq.', playerId: 'p12' },
          { pos: 'Medio der.', playerId: 'p15' },
          { pos: 'Delantero', playerId: 'p9' },
        ],
      },
      {
        id: 'm-35',
        minute: 35,
        formation: '1-3-2-1',
        team: [
          { pos: 'Portero', playerId: 'p13' },
          { pos: 'Defensa izq.', playerId: 'p8' },
          { pos: 'Central', playerId: 'p16' },
          { pos: 'Defensa der.', playerId: 'p11' },
          { pos: 'Medio izq.', playerId: 'p12' },
          { pos: 'Medio der.', playerId: 'p15' },
          { pos: 'Delantero', playerId: 'p9' },
        ],
      },
      {
        id: 'm-52',
        minute: 52,
        formation: '1-3-2-1',
        team: [
          { pos: 'Portero', playerId: 'p13' },
          { pos: 'Defensa izq.', playerId: 'p18' },
          { pos: 'Central', playerId: 'p16' },
          { pos: 'Defensa der.', playerId: 'p5' },
          { pos: 'Medio izq.', playerId: 'p3' },
          { pos: 'Medio der.', playerId: 'p15' },
          { pos: 'Delantero', playerId: 'p7' },
        ],
      },
      {
        id: 'm-60',
        minute: 60,
        formation: '1-3-2-1',
        team: [
          { pos: 'Portero', playerId: 'p13' },
          { pos: 'Defensa izq.', playerId: 'p8' },
          { pos: 'Central', playerId: 'p11' },
          { pos: 'Defensa der.', playerId: 'p5' },
          { pos: 'Medio izq.', playerId: 'p12' },
          { pos: 'Medio der.', playerId: 'p9' },
          { pos: 'Delantero', playerId: 'p7' },
        ],
      },
    ],
  };

  const html = buildMatchPlanHtml({
    match: mockMatchF7,
    prep: prep4Moments,
    players: mockPlayers,
    callup: { availableIds: mockPlayers.map((p) => p.id) },
  });

  assert.ok(html.includes('cbx-pmp-page-1'), 'Debe incluir página 1');
  assert.ok(html.includes('cbx-pmp-page-1b'), 'Debe incluir página 1b para la segunda tanda de cambios');
  assert.ok(html.includes('cbx-pmp-page-2'), 'Debe incluir página 2');
  assert.ok(html.includes('Página 1 de 3'), 'Debe numerar Página 1 de 3');
  assert.ok(html.includes('Página 2 de 3'), 'Debe numerar Página 2 de 3');
  assert.ok(html.includes('Página 3 de 3'), 'Debe numerar Página 3 de 3');
});

test('Rotación masiva en Alevines (>= 4 cambios): añade clase .is-multi-changes y CSS en 2 columnas', () => {
  const prepMassiveChange = {
    matchId: 'match-alevin-test',
    formacion: '1-3-2-1',
    moments: [
      {
        id: 'm-0',
        minute: 0,
        formation: '1-3-2-1',
        team: [
          { pos: 'Portero', playerId: 'p1' },
          { pos: 'Defensa izq.', playerId: 'p18' },
          { pos: 'Central', playerId: 'p16' },
          { pos: 'Defensa der.', playerId: 'p5' },
          { pos: 'Medio izq.', playerId: 'p3' },
          { pos: 'Medio der.', playerId: 'p15' },
          { pos: 'Delantero', playerId: 'p7' },
        ],
      },
      {
        id: 'm-35',
        minute: 35,
        formation: '1-3-2-1',
        // Cambian 6 jugadores de campo a la vez
        team: [
          { pos: 'Portero', playerId: 'p1' },
          { pos: 'Defensa izq.', playerId: 'p8' },
          { pos: 'Central', playerId: 'p11' },
          { pos: 'Defensa der.', playerId: 'p12' },
          { pos: 'Medio izq.', playerId: 'p9' },
          { pos: 'Medio der.', playerId: 'p13' },
          { pos: 'Delantero', playerId: 'p3' },
        ],
      },
    ],
  };

  const html = buildMatchPlanHtml({
    match: mockMatchF7,
    prep: prepMassiveChange,
    players: mockPlayers,
    callup: { availableIds: mockPlayers.map((p) => p.id) },
  });

  assert.ok(html.includes('is-multi-changes'), 'El momento con >= 4 cambios debe tener la clase is-multi-changes');
  assert.ok(claudePartidoCss.includes('.cbx-pmp-moment-changes.is-multi-changes'), 'CSS debe definir la regla is-multi-changes');
  assert.ok(claudePartidoCss.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'), 'CSS debe maquetar en 2 columnas');
});

test('generatePdfBlob en print-session-export.js escala proporcionalmente y no recorta a 297mm', () => {
  assert.ok(!printSessionExportSource.includes('Math.min(imgHeight, 297)'), 'No debe recortar rígidamente con Math.min');
  assert.ok(printSessionExportSource.includes('scaleFactor = 297 / imgHeight'), 'Debe calcular factor de escala proporcional cuando imgHeight > 297');
});

test('Cálculo de minutos exactos en F7 70′ con sustituciones volantes completas', () => {
  const prep = {
    moments: [
      {
        minute: 0,
        team: [
          { playerId: 'p1' },
          { playerId: 'p2' },
          { playerId: 'p3' },
          { playerId: 'p4' },
          { playerId: 'p5' },
          { playerId: 'p6' },
          { playerId: 'p7' },
        ],
      },
      {
        minute: 35,
        team: [
          { playerId: 'p1' },
          { playerId: 'p8' },
          { playerId: 'p9' },
          { playerId: 'p10' },
          { playerId: 'p11' },
          { playerId: 'p12' },
          { playerId: 'p7' },
        ],
      },
    ],
  };

  const minutes = plannedMinutes(prep.moments, 70);
  assert.equal(minutes['p1'], 70, 'El jugador que no sale juega 70′');
  assert.equal(minutes['p2'], 35, 'El titular sustituido juega 35′');
  assert.equal(minutes['p8'], 35, 'El suplente que entra al min 35 juega 35′');

  // Suma total de minutos de campo debe ser exactamente 7 puestos * 70 = 490 minutos
  let totalMin = 0;
  for (const m of Object.values(minutes)) {
    totalMin += m;
  }
  assert.equal(totalMin, 490, 'La suma total de minutos jugados debe ser exactamente 70′ × 7 puestos = 490′');
});

test('Convocatoria permite generar rotación equitativa y ajustar cambios en preparación', () => {
  assert.ok(appSource.includes('generateAndSaveCallupRotation'), 'app.js debe definir generateAndSaveCallupRotation');
  assert.ok(appSource.includes('cbx-generate-callup-rotation-btn'), 'app.js debe renderizar el botón de generar rotación equitativa');
  assert.ok(appSource.includes('⚡ Generar rotación equitativa'), 'Debe incluir el texto del botón interactivo');
  assert.ok(appSource.includes('✏️ Ajustar cambios en Preparación'), 'Debe incluir acceso directo a ajustar cambios');
});

test('Ajustes: index.html contiene tarjetas de previsualización en vivo para Especialistas, Dorsales y WhatsApp', () => {
  assert.ok(indexHtmlSource.includes('id="specialists-colors-card"'), 'index.html debe contener el panel specialists-colors-card');
  assert.ok(indexHtmlSource.includes('id="cbx-specialists-preview-box"'), 'Debe contener la caja de vista previa de especialistas');
  assert.ok(indexHtmlSource.includes('id="cbx-sp-lead-bg-swatches"'), 'Debe contener swatches para fondo de 1.er lanzador');
  assert.ok(indexHtmlSource.includes('id="cbx-sp-lead-ink-swatches"'), 'Debe contener swatches para texto de 1.er lanzador');
  assert.ok(indexHtmlSource.includes('id="cbx-sp-sub-bg-swatches"'), 'Debe contener swatches para fondo de 2.º lanzador');
  assert.ok(indexHtmlSource.includes('id="cbx-sp-sub-ink-swatches"'), 'Debe contener swatches para texto de 2.º lanzador');
  assert.ok(indexHtmlSource.includes('id="cbx-reset-specialists-btn"'), 'Debe contener botón para restablecer especialistas');

  assert.ok(indexHtmlSource.includes('id="cbx-preview-dorsal-box"'), 'Debe contener la caja de vista previa del dorsal');
  assert.ok(indexHtmlSource.includes('id="cbx-preview-dorsal-badge"'), 'Debe contener el badge de muestra de dorsal');
  assert.ok(indexHtmlSource.includes('id="cbx-dorsal-bg-swatches"'), 'Debe contener swatches para fondo del dorsal');
  assert.ok(indexHtmlSource.includes('id="cbx-dorsal-ink-swatches"'), 'Debe contener swatches para texto del dorsal');

  assert.ok(indexHtmlSource.includes('id="cbx-wa-bg-swatches"'), 'Debe contener swatches para fondo de WhatsApp');
  assert.ok(indexHtmlSource.includes('id="cbx-wa-ink-swatches"'), 'Debe contener swatches para texto de WhatsApp');
  assert.ok(indexHtmlSource.includes('id="cbx-preview-wa-sample"'), 'Debe contener el botón de muestra de WhatsApp');
});

test('EXTENDED_SWATCH_CONFIGS y applyCustomTheme en app.js gestionan las nuevas variables', () => {
  assert.ok(appSource.includes('spLeadBg:'), 'EXTENDED_SWATCH_CONFIGS debe tener spLeadBg');
  assert.ok(appSource.includes('spLeadInk:'), 'EXTENDED_SWATCH_CONFIGS debe tener spLeadInk');
  assert.ok(appSource.includes('spSubBg:'), 'EXTENDED_SWATCH_CONFIGS debe tener spSubBg');
  assert.ok(appSource.includes('spSubInk:'), 'EXTENDED_SWATCH_CONFIGS debe tener spSubInk');
  assert.ok(appSource.includes('dorsalBg:'), 'EXTENDED_SWATCH_CONFIGS debe tener dorsalBg');
  assert.ok(appSource.includes('dorsalInk:'), 'EXTENDED_SWATCH_CONFIGS debe tener dorsalInk');
  assert.ok(appSource.includes('waBg:'), 'EXTENDED_SWATCH_CONFIGS debe tener waBg');

  assert.ok(appSource.includes("target.style.setProperty('--sp-lead-bg'"), 'applyCustomTheme debe setear --sp-lead-bg');
  assert.ok(appSource.includes("target.style.setProperty('--sp-lead-ink'"), 'applyCustomTheme debe setear --sp-lead-ink');
  assert.ok(appSource.includes("target.style.setProperty('--sp-sub-bg'"), 'applyCustomTheme debe setear --sp-sub-bg');
  assert.ok(appSource.includes("target.style.setProperty('--sp-sub-ink'"), 'applyCustomTheme debe setear --sp-sub-ink');
  assert.ok(appSource.includes("target.style.setProperty('--dorsal-bg'"), 'applyCustomTheme debe setear --dorsal-bg');
  assert.ok(appSource.includes("target.style.setProperty('--dorsal-ink'"), 'applyCustomTheme debe setear --dorsal-ink');
  assert.ok(appSource.includes("target.style.setProperty('--wa-bg'"), 'applyCustomTheme debe setear --wa-bg');
  assert.ok(appSource.includes("target.style.setProperty('--wa-ink'"), 'applyCustomTheme debe setear --wa-ink');
});

test('Las hojas de estilo CSS respetan las variables de dorsal, especialistas y WhatsApp', () => {
  assert.ok(claudePlantillaCss.includes('var(--sp-lead-bg'), 'claude-plantilla.css debe usar --sp-lead-bg');
  assert.ok(claudePlantillaCss.includes('var(--sp-sub-bg'), 'claude-plantilla.css debe usar --sp-sub-bg');
  assert.ok(claudePlantillaCss.includes('var(--dorsal-bg'), 'claude-plantilla.css debe usar --dorsal-bg');
  assert.ok(claudePlantillaCss.includes('var(--wa-bg'), 'claude-plantilla.css debe usar --wa-bg');

  assert.ok(claudePartidoCss.includes('var(--dorsal-bg'), 'claude-partido.css debe usar --dorsal-bg');
  assert.ok(claudePartidoCss.includes('var(--wa-bg'), 'claude-partido.css debe usar --wa-bg');
  assert.ok(claudeHoyCss.includes('var(--wa-bg'), 'claude-hoy.css debe usar --wa-bg');
  assert.ok(claudeEntrenoCss.includes('var(--wa-bg'), 'claude-entreno.css debe usar --wa-bg');
});

test('Ajustes y previsualizaciones: index.html y app.js incluyen preview de fuente de app y botón secundario', () => {
  const freshIndexHtml = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const freshAppSource = fs.readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');

  assert.ok(freshIndexHtml.includes('id="cbx-font-preview-box"'), 'index.html debe tener cbx-font-preview-box');
  assert.ok(freshIndexHtml.includes('id="cbx-preview-banner-btn2"'), 'index.html debe tener cbx-preview-banner-btn2');
  assert.ok(freshAppSource.includes('previewBannerBtn2 = $(\'#cbx-preview-banner-btn2\')'), 'app.js debe actualizar previewBannerBtn2');
  assert.ok(freshAppSource.includes('fontPreviewBox = $(\'#cbx-font-preview-box\')'), 'app.js debe actualizar fontPreviewBox');
});

test('Plan de Partido PDF: auto-genera rotación cuando hay suplentes y preserva 70′ oficiales', () => {
  const freshPrintSource = fs.readFileSync(new URL('../js/print-match-plan.js', import.meta.url), 'utf8');
  const freshPartidoCss = fs.readFileSync(new URL('../css/claude-partido.css', import.meta.url), 'utf8');
  const freshExportSource = fs.readFileSync(new URL('../js/print-session-export.js', import.meta.url), 'utf8');

  // Nombres de titulares no se truncan con ellipsis en el PDF
  assert.ok(!freshPartidoCss.includes('.cbx-pmp-starter-name {\n  font-size: 11px;\n  font-weight: 800;\n  color: #0f172a;\n  line-height: 1.2;\n  overflow: hidden;\n  text-overflow: ellipsis;'), 'cbx-pmp-starter-name no debe usar text-overflow: ellipsis');
  assert.ok(freshPartidoCss.includes('-webkit-line-clamp: 2'), 'cbx-pmp-starter-name debe permitir 2 líneas con line-clamp');

  // Timeout seguro Promise.race con html2canvas
  assert.ok(freshExportSource.includes("new Error('html2canvas timeout')"), 'Debe controlar timeout de html2canvas');

  // Generación de plan cuando no hay ventanas intermedias pero hay 12 convocados
  const htmlAuto = buildMatchPlanHtml({
    match: mockMatchF7,
    players: mockPlayers,
    callup: { availableIds: mockPlayers.map((p) => p.id) },
  });

  assert.ok(htmlAuto.includes('MINUTO'), 'Debe generar ventanas de cambio automáticas');
  assert.ok(htmlAuto.includes('/ 70′'), 'La duración total debe ser 70′');
  assert.ok(htmlAuto.includes('Carlos Campillo'), 'Debe incluir a los jugadores completos');
});

test('Ajuste rápido de colores in-context: modal de tuerca y botones de tuerca en todas las pantallas', () => {
  const freshIndexHtml = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const freshAppSource = fs.readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
  const freshPartidoCss = fs.readFileSync(new URL('../css/claude-partido.css', import.meta.url), 'utf8');

  // Modal en index.html
  assert.ok(freshIndexHtml.includes('id="cbx-quick-color-dialog"'), 'index.html debe contener el diálogo cbx-quick-color-dialog');
  assert.ok(freshIndexHtml.includes('id="cbx-quick-color-body"'), 'index.html debe contener cbx-quick-color-body');
  assert.ok(freshIndexHtml.includes('id="cbx-quick-color-reset"'), 'index.html debe contener cbx-quick-color-reset');
  assert.ok(freshIndexHtml.includes('id="cbx-quick-color-save"'), 'index.html debe contener cbx-quick-color-save');

  // Botón de tuerca superior discreto en topbar de index.html
  assert.ok(freshIndexHtml.includes('id="topbar-quick-color-btn"'), 'index.html debe tener el botón superior topbar-quick-color-btn');
  assert.ok(freshIndexHtml.includes('class="topbar-gear-btn"'), 'index.html debe usar la clase topbar-gear-btn');

  // app.js define y delega openQuickColorDialog con soporte multi-pantalla
  assert.ok(freshAppSource.includes('function openQuickColorDialog('), 'app.js debe definir openQuickColorDialog');
  assert.ok(freshAppSource.includes("currentTab === 'dorsales'"), 'openQuickColorDialog debe gestionar dorsales');
  assert.ok(freshAppSource.includes("currentTab === 'whatsapp'"), 'openQuickColorDialog debe gestionar whatsapp');
  assert.ok(freshAppSource.includes("currentTab === 'tactic-board'"), 'openQuickColorDialog debe gestionar tactic-board');
  assert.ok(freshAppSource.includes("currentTab === 'live'"), 'openQuickColorDialog debe gestionar live');
  assert.ok(freshAppSource.includes('openQuickColorDialog(gearBtn.dataset.gearTarget'), 'wireEvents debe delegar clicks de tuerca');

  // Estilos CSS para el botón de tuerca superior y compatibilidad
  assert.ok(freshPartidoCss.includes('.topbar-gear-btn'), 'claude-partido.css debe definir estilos para .topbar-gear-btn');
  assert.ok(freshPartidoCss.includes('.cbx-context-gear-btn'), 'claude-partido.css debe definir estilos para .cbx-context-gear-btn');
});

test('Visibilidad y alternancia del rival en Partido en vivo y en Tácticas', () => {
  const freshAppSource = fs.readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
  const freshPartidoCss = fs.readFileSync(new URL('../css/claude-partido.css', import.meta.url), 'utf8');

  // app.js importa LIVE_OPPONENT sin errores de referencia
  assert.ok(freshAppSource.includes("import { LIVE_FORMATIONS, LIVE_OPPONENT"), 'app.js debe importar LIVE_OPPONENT');

  // Botón visible de rival en live tactics
  assert.ok(freshAppSource.includes('toggle-rival-head-btn'), 'Pizarra en vivo debe tener botón de rival en el encabezado');
  assert.ok(freshAppSource.includes('live-rival-btn'), 'Pizarra en vivo debe usar clase live-rival-btn');
  assert.ok(freshAppSource.includes('liveTacticsShowOpponent = !liveTacticsShowOpponent'), 'wireTacticsBoard debe alternar el estado del rival');

  // Tácticas de Claude maneja alternancia y draft con oponentes
  assert.ok(freshAppSource.includes("target.id === 'cbx-toggle-rival-btn'"), 'wireEvents debe escuchar #cbx-toggle-rival-btn');
  assert.ok(freshAppSource.includes('claudeTacticShowRival = !claudeTacticShowRival'), 'wireEvents debe alternar claudeTacticShowRival');

  // Fichas de rival visibles con contraste y sombra
  assert.ok(freshPartidoCss.includes('.tac-opponent circle'), 'claude-partido.css debe dar estilo a los círculos del rival');
  assert.ok(freshPartidoCss.includes('fill: var(--tb-rival'), 'Fichas del rival deben usar --tb-rival');
  assert.ok(freshPartidoCss.includes('filter: drop-shadow('), 'Fichas del rival deben tener drop-shadow');
});

test('Protección de contraste en dorsales y botones de WhatsApp', () => {
  const freshStylesRedesign = fs.readFileSync(new URL('../styles-redesign.css', import.meta.url), 'utf8');
  const freshPlantillaCss = fs.readFileSync(new URL('../css/claude-plantilla.css', import.meta.url), 'utf8');
  const freshPartidoCss = fs.readFileSync(new URL('../css/claude-partido.css', import.meta.url), 'utf8');

  // Exclusiones en styles-redesign.css para no teñir dorsales ni botones WhatsApp con color de texto global
  assert.ok(freshStylesRedesign.includes(':not(.cbx-callup-number)'), 'styles-redesign.css debe excluir .cbx-callup-number');
  assert.ok(freshStylesRedesign.includes(':not(.staff-wa-btn)'), 'styles-redesign.css debe excluir .staff-wa-btn');

  // .cbx-callup-number en claude-partido.css tiene !important
  assert.ok(freshPartidoCss.includes('color: var(--dorsal-ink, var(--bnInk, #ffffff)) !important;'), '.cbx-callup-number debe forzar dorsal-ink con !important');
  assert.ok(freshPartidoCss.includes('background: var(--dorsal-bg, var(--bn, var(--cbx-hero, #0a251b))) !important;'), '.cbx-callup-number debe forzar dorsal-bg con !important');

  // .staff-wa-btn en claude-plantilla.css usa variables wa-ink y wa-bg
  assert.ok(freshPlantillaCss.includes('color: var(--wa-ink, #053b1d) !important;'), '.staff-wa-btn debe usar --wa-ink con !important');
  assert.ok(freshPlantillaCss.includes('background: var(--wa-bg, #25d366) !important;'), '.staff-wa-btn debe usar --wa-bg con !important');
});

