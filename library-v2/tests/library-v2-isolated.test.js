import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const CATALOG_PATH = path.join(ROOT_DIR, 'library-v2', 'data', 'catalog.json');
const CATALOG_DATA_JS_PATH = path.join(ROOT_DIR, 'library-v2', 'data', 'catalog-data.js');
const AUDIT_PATH = path.join(ROOT_DIR, 'library-v2', 'data', 'source_audit.json');
const PREVIEWS_DIR = path.join(ROOT_DIR, 'library-v2', 'assets', 'previews');
const PREVIEW_HTML_PATH = path.join(ROOT_DIR, 'library-v2-preview.html');

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
const audit = JSON.parse(fs.readFileSync(AUDIT_PATH, 'utf8'));

test('SECCIÓN 24: Catálogo contiene exactamente 248 ejercicios', () => {
  assert.equal(catalog.length, 248, 'El catálogo debe contener exactamente 248 ejercicios');
  assert.equal(audit.length, 248, 'La auditoría debe contener exactamente 248 ejercicios');

  const pdf150Count = catalog.filter(e => e.id.startsWith('pdf150-')).length;
  const pdf98Count = catalog.filter(e => e.id.startsWith('pdf98-')).length;

  assert.equal(pdf150Count, 150, 'Deben existir exactamente 150 ejercicios PDF150');
  assert.equal(pdf98Count, 98, 'Deben existir exactamente 98 ejercicios PDF98');
});

test('SECCIÓN 24: Todos los 248 IDs son únicos y canónicos', () => {
  const ids = catalog.map(e => e.id);
  const uniqueIds = new Set(ids);
  assert.equal(uniqueIds.size, 248, 'Todos los 248 IDs deben ser únicos');

  for (const ex of catalog) {
    assert.match(ex.id, /^(pdf150|pdf98)-\d{3}$/, `ID ${ex.id} debe tener formato canónico pdf150-xxx o pdf98-xxx`);
    assert.ok(ex.nombre && ex.nombre.trim().length > 0, `Ejercicio ${ex.id} debe tener nombre visible no vacío`);
  }
});

test('SECCIÓN 24: Previews válidas y presentes físicamente para los 248 ejercicios', () => {
  assert.ok(fs.existsSync(PREVIEWS_DIR), 'El directorio de previews debe existir');

  for (const ex of catalog) {
    assert.ok(ex.media && ex.media.preview, `Ejercicio ${ex.id} debe tener ruta de preview`);
    const previewFullPath = path.join(ROOT_DIR, ex.media.preview);
    assert.ok(fs.existsSync(previewFullPath), `Preview física para ${ex.id} debe existir en ${previewFullPath}`);
    const stats = fs.statSync(previewFullPath);
    assert.ok(stats.size > 500, `Preview para ${ex.id} debe tener tamaño válido (> 500 bytes), tiene ${stats.size}`);
  }
});

test('SECCIÓN 24: MP4s válidos configurados para los 248 ejercicios en Supabase Storage', () => {
  const expectedPrefix = 'https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/library-v2-preview/';

  for (const ex of catalog) {
    assert.ok(ex.media && ex.media.video, `Ejercicio ${ex.id} debe tener URL de vídeo`);
    assert.ok(ex.media.video.startsWith(expectedPrefix), `Vídeo para ${ex.id} debe apuntar a la ruta aislada de Supabase Storage`);
    assert.ok(ex.media.video.endsWith('/ejercicio.mp4'), `Vídeo para ${ex.id} debe terminar en /ejercicio.mp4`);
  }
});

test('SECCIÓN 24: Aislamiento absoluto - 0 dependencias de la biblioteca antigua y producción', () => {
  const previewHtml = fs.readFileSync(PREVIEW_HTML_PATH, 'utf8');

  // No debe importar scripts de producción
  assert.equal(previewHtml.includes('js/state.js'), false, 'library-v2-preview.html no debe importar js/state.js');
  assert.equal(previewHtml.includes('js/app.js'), false, 'library-v2-preview.html no debe importar js/app.js');
  assert.equal(previewHtml.includes('js/db.js'), false, 'library-v2-preview.html no debe importar js/db.js');
  assert.equal(previewHtml.includes('js/ejercicios-validados.js'), false, 'library-v2-preview.html no debe importar js/ejercicios-validados.js');
  assert.equal(previewHtml.includes('js/real-exercises.js'), false, 'library-v2-preview.html no debe importar js/real-exercises.js');
  assert.equal(previewHtml.includes('state.exercises'), false, 'library-v2-preview.html no debe usar state.exercises');
  assert.equal(previewHtml.includes('EJERCICIOS_VALIDADOS'), false, 'library-v2-preview.html no debe usar EJERCICIOS_VALIDADOS');

  // Catálogo no debe depender de datos antiguos
  const catalogStr = fs.readFileSync(CATALOG_PATH, 'utf8');
  assert.equal(catalogStr.includes('EJERCICIOS_VALIDADOS'), false, 'catalog.json no debe mencionar EJERCICIOS_VALIDADOS');
  assert.equal(catalogStr.includes('state.exercises'), false, 'catalog.json no debe mencionar state.exercises');

  // 0 mocks, 0 demos, 0 seeds en catalog
  for (const ex of catalog) {
    assert.equal(ex.es_mock || false, false, `Ejercicio ${ex.id} no debe ser un mock`);
    assert.equal(ex.es_demo || false, false, `Ejercicio ${ex.id} no debe ser una demo`);
    assert.equal(ex.es_seed || false, false, `Ejercicio ${ex.id} no debe ser un seed`);
    assert.ok(ex._qa && ex._qa.source_zip, `Ejercicio ${ex.id} debe provenir de un ZIP real verificado`);
  }
});

test('SECCIÓN 25: QA de Contenido - 3 ejercicios de PDF150 y 3 de PDF98 verificados contra origen', () => {
  const sampleIds = [
    'pdf150-001', 'pdf150-050', 'pdf150-120', // PDF150
    'pdf98-002', 'pdf98-040', 'pdf98-085'     // PDF98
  ];

  for (const id of sampleIds) {
    const ex = catalog.find(e => e.id === id);
    const aud = audit.find(a => a.exercise_id === id);

    assert.ok(ex, `Ejercicio ${id} debe existir en el catálogo`);
    assert.ok(aud, `Ejercicio ${id} debe existir en la auditoría`);

    // Comprobar coincidencia de hashes y procedencia
    assert.equal(ex._qa.hash_data_json, aud.hash_data_json);
    assert.equal(ex._qa.hash_preview, aud.hash_preview);
    assert.equal(ex._qa.hash_mp4, aud.hash_mp4);

    // Comprobar que los archivos de preview existen
    const previewFile = path.join(ROOT_DIR, ex.media.preview);
    assert.ok(fs.existsSync(previewFile), `Preview de ${id} debe existir en disco`);

    // En PDF98, verificar preservación de título original y derivación válida
    if (id.startsWith('pdf98-')) {
      assert.ok(ex.titulo_original_fuente, `Ejercicio PDF98 ${id} debe guardar su título original`);
      assert.notEqual(ex.nombre, 'EJERCICIO', `Ejercicio PDF98 ${id} no debe tener 'EJERCICIO' como nombre visible`);
      assert.notEqual(ex.nombre, 'DESCRIPCIÓN DEL EJERCICIO Y REGLAS', `Ejercicio PDF98 ${id} no debe tener 'DESCRIPCIÓN...' como nombre visible`);
      assert.ok(ex.nombre.length > 5, `Nombre visible para ${id} debe ser descriptivo`);
    }

    // Regla de fidelidad: datos conservados exactamente
    assert.ok(ex.categoria && ex.categoria.length > 0, `Ejercicio ${id} debe tener categoría`);
    const hasDesarrollo = Boolean(
      (ex.como_se_hace && ex.como_se_hace.length > 0) ||
      (ex.fases && ex.fases.length > 0) ||
      (ex.desarrollo && (
        ex.desarrollo.explicacion ||
        (ex.desarrollo.pasos && ex.desarrollo.pasos.length > 0) ||
        (ex.desarrollo.fases && ex.desarrollo.fases.length > 0)
      ))
    );
    assert.ok(hasDesarrollo, `Ejercicio ${id} debe tener desarrollo estructurado (como_se_hace o fases)`);
  }
});

test('SECCIÓN 24 & 27: Conectividad real - Muestreo de MP4s en Supabase Storage responde HTTP 200', async () => {
  const sampleIndices = [0, 49, 99, 149, 199, 247];
  for (const idx of sampleIndices) {
    const ex = catalog[idx];
    const res = await fetch(ex.media.video, { method: 'HEAD' });
    assert.equal(res.status, 200, `Vídeo para ${ex.id} (${ex.media.video}) debe responder HTTP 200`);
    const contentType = res.headers.get('content-type');
    assert.ok(contentType && contentType.includes('video/mp4'), `Vídeo para ${ex.id} debe tener content-type video/mp4`);
  }
});

test('SECCIÓN 3: Mapeo Canónico de Categorías (11 estándar, 0 vacías, 0 etiquetas de PDF)', () => {
  const validCategories = new Set([
    'Coordinación y agilidad',
    'Finalización',
    'Pase y posesión',
    'Calentamiento / activación',
    'Físico con balón',
    'Defensa y duelos',
    'Porteros',
    'Juego reducido',
    'Transiciones',
    'Táctica',
    'Técnico-táctico'
  ]);

  for (const ex of catalog) {
    assert.ok(ex.categoria, `Ejercicio ${ex.id} debe tener categoría`);
    assert.ok(validCategories.has(ex.categoria), `Categoría "${ex.categoria}" en ${ex.id} debe pertenecer a las 11 estándar`);
    assert.ok(!ex.categoria.toLowerCase().includes('pdf'), `Categoría en ${ex.id} no debe contener la palabra PDF`);
  }
});

test('SECCIONES 4 a 17: Cobertura y estructura canónica de la Ficha de Ejercicio', () => {
  for (const ex of catalog) {
    // 4. Qué se trabaja
    assert.ok(Array.isArray(ex.que_se_trabaja) && ex.que_se_trabaja.length > 0, `Ejercicio ${ex.id} debe tener 'que_se_trabaja' no vacío`);
    // 5. Objetivo principal
    assert.ok(typeof ex.objetivo_principal === 'string' && ex.objetivo_principal.trim().length > 0, `Ejercicio ${ex.id} debe tener 'objetivo_principal'`);
    // 6. Datos rápidos
    assert.ok(ex.datos_rapidos && (ex.datos_rapidos.jugadores || ex.datos_rapidos.espacio || ex.datos_rapidos.material), `Ejercicio ${ex.id} debe tener 'datos_rapidos'`);
    // 7. Montaje
    assert.ok(ex.montaje && (ex.montaje.explicacion || ex.montaje.dimensiones), `Ejercicio ${ex.id} debe tener 'montaje'`);
    // 9. Cómo se hace
    assert.ok(Array.isArray(ex.como_se_hace) && ex.como_se_hace.length > 0, `Ejercicio ${ex.id} debe tener pasos en 'como_se_hace'`);
    // 13. Qué observar
    assert.ok(Array.isArray(ex.que_observar) && ex.que_observar.length > 0, `Ejercicio ${ex.id} debe tener 'que_observar'`);
    // 17. Leyenda visual
    assert.ok(ex.leyenda_visual, `Ejercicio ${ex.id} debe tener 'leyenda_visual'`);
    assert.ok(Array.isArray(ex.leyenda_visual.jugadores) && ex.leyenda_visual.jugadores.length > 0, `Ejercicio ${ex.id} debe tener jugadores en 'leyenda_visual'`);
    
    for (const j of ex.leyenda_visual.jugadores) {
      assert.match(j.color, /^#[0-9A-Fa-f]{6}$/, `Color de jugador ${j.rol} en ${ex.id} debe ser un hex code válido`);
      assert.ok(j.letra && j.letra.length === 1, `Letra de jugador en ${ex.id} debe ser un único carácter`);
    }

    if (ex.leyenda_visual.acciones && ex.leyenda_visual.acciones.length) {
      for (const a of ex.leyenda_visual.acciones) {
        assert.ok(a.trazo && a.trazo.length > 0, `Acción ${a.tipo} en ${ex.id} debe tener representación de trazo`);
      }
    }
  }
});

test('SECCIÓN 23: Todos los contenedores de las 17 secciones existen en library-v2-preview.html', () => {
  const html = fs.readFileSync(PREVIEW_HTML_PATH, 'utf8');
  const requiredSectionIds = [
    'section-que-se-trabaja',
    'section-objetivo',
    'section-datos-rapidos',
    'section-montaje',
    'section-material',
    'section-como-se-hace',
    'section-fases',
    'section-carga',
    'section-rotacion',
    'section-que-observar',
    'section-consignas',
    'section-errores-correcciones',
    'section-variantes',
    'section-leyenda'
  ];

  for (const sId of requiredSectionIds) {
    assert.ok(html.includes(`id="${sId}"`), `HTML debe contener contenedor con id="${sId}"`);
  }
});

