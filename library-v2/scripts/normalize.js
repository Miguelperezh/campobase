import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'library-v2', 'data');
const AUDIT_FILE = path.join(DATA_DIR, 'source_audit.json');
const CATALOG_FILE = path.join(DATA_DIR, 'catalog.json');
const CATALOG_JS_FILE = path.join(DATA_DIR, 'catalog-data.js');

if (!fs.existsSync(AUDIT_FILE)) {
  throw new Error(`No se encontró el archivo de auditoría: ${AUDIT_FILE}`);
}

const auditRecords = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf8'));

console.log(`=== NORMALIZACIÓN CANÓNICA DE ${auditRecords.length} EJERCICIOS ===\n`);

const GENERIC_TITLES = new Set([
  'EJERCICIO',
  'DESCRIPCIÓN DEL EJERCICIO Y REGLAS',
  'SESIÓN DE ENTRENAMIENTO',
]);

const SUPABASE_STORAGE_BASE = 'https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/library-v2-preview';

function deriveVisibleTitle(raw, collection) {
  const original = (raw.nombre || '').trim();
  if (collection === 'PDF98' && GENERIC_TITLES.has(original.toUpperCase())) {
    const candidate = (raw.que_se_busca && raw.que_se_busca[0])
      || (raw.objetivos?.generales && raw.objetivos.generales[0])
      || (raw.objetivos?.general && raw.objetivos.general[0]);
    if (candidate && candidate.trim()) {
      return candidate.trim();
    }
  }
  return original || 'Ejercicio';
}

function normalizeExercise(record) {
  const raw = record.raw_json;
  const collection = record.collection;
  const id = record.exercise_id;

  const visibleTitle = deriveVisibleTitle(raw, collection);
  const originalTitle = (raw.nombre || '').trim();

  // 1. Identidad
  const identidad = {
    id,
    nombre: visibleTitle,
    titulo_original_fuente: originalTitle,
  };

  // 2. Clasificación
  const categoria = raw.clasificacion?.categoria_fuente
    || raw.clasificacion?.categoria_principal
    || null;
  const subcategoria = raw.clasificacion?.subcategoria || null;
  const etiquetas = Array.isArray(raw.clasificacion?.etiquetas)
    ? [...new Set(raw.clasificacion.etiquetas.filter(Boolean))]
    : [];

  // 3. Qué se trabaja
  const ambitos = Array.isArray(raw.clasificacion?.contenidos_trabajados)
    ? raw.clasificacion.contenidos_trabajados
    : [];
  let contenidos = [];
  if (Array.isArray(raw.que_se_trabaja)) {
    for (const item of raw.que_se_trabaja) {
      if (typeof item === 'string') contenidos.push(item);
      else if (item && typeof item.contenido === 'string') contenidos.push(item.contenido);
    }
  }
  for (const amb of ambitos) {
    if (Array.isArray(amb.contenidos)) {
      for (const c of amb.contenidos) {
        if (typeof c === 'string') contenidos.push(c);
      }
    }
  }
  contenidos = [...new Set(contenidos.filter((s) => typeof s === 'string' && s.trim()))];

  // 4. Objetivos
  const objGeneral = Array.isArray(raw.objetivos?.general)
    ? raw.objetivos.general
    : (Array.isArray(raw.objetivos?.generales) ? raw.objetivos.generales : []);
  const objSecundarios = Array.isArray(raw.objetivos?.secundarios) ? raw.objetivos.secundarios : [];
  const objTacticos = Array.isArray(raw.objetivos?.tacticos) ? raw.objetivos.tacticos : [];
  const objTecnicos = [
    ...(Array.isArray(raw.objetivos?.tecnicos) ? raw.objetivos.tecnicos : []),
    ...(Array.isArray(raw.objetivos?.tecnicos_ofensivos) ? raw.objetivos.tecnicos_ofensivos : []),
    ...(Array.isArray(raw.objetivos?.tecnicos_defensivos) ? raw.objetivos.tecnicos_defensivos : []),
  ];
  const objCoordinativos = Array.isArray(raw.objetivos?.coordinativos) ? raw.objetivos.coordinativos : [];
  const objFisicos = Array.isArray(raw.objetivos?.fisicos) ? raw.objetivos.fisicos : [];
  const objOtros = [
    ...(Array.isArray(raw.objetivos?.cognitivos) ? raw.objetivos.cognitivos : []),
    ...(Array.isArray(raw.objetivos?.socio_afectivos) ? raw.objetivos.socio_afectivos : []),
    ...(Array.isArray(raw.objetivos?.volitivos) ? raw.objetivos.volitivos : []),
  ];

  // 5. Organización
  const jugadoresRaw = raw.organizacion?.numero_total_jugadores
    ?? raw.organizacion?.numero_representado
    ?? raw.organizacion?.descripcion_fuente
    ?? null;
  const porteros = raw.organizacion?.porteros_representados
    ?? (typeof raw.organizacion?.porteros === 'number' ? raw.organizacion.porteros : null);
  const atacantes = raw.organizacion?.atacantes_representados ?? 0;
  const defensores = raw.organizacion?.defensores_representados ?? 0;
  const neutros = raw.organizacion?.neutros_representados ?? 0;
  const jugadoresDeCampo = (atacantes + defensores + neutros) > 0
    ? (atacantes + defensores + neutros)
    : null;
  const entrenadores = raw.organizacion?.entrenadores_representados ?? null;
  const rawRoles = Array.isArray(raw.organizacion?.roles_iniciales)
    ? raw.organizacion.roles_iniciales
    : (Array.isArray(raw.roles) ? raw.roles : []);
  const roles = rawRoles.map((r) => ({
    id: r.id || null,
    rol: r.rol || r.nombre || null,
    funcion: r.funcion || r.cometido || null,
    descripcion: r.descripcion || null,
    grupo: r.grupo || null,
  })).filter((r) => r.rol || r.funcion || r.id);

  const grupos = Array.isArray(raw.organizacion?.grupos) ? raw.organizacion.grupos : [];
  const equipos = Array.isArray(raw.organizacion?.equipos) ? raw.organizacion.equipos : [];

  // 6. Material
  const materiales = Array.isArray(raw.materiales)
    ? raw.materiales.map((m) => ({
        nombre: m.tipo || m.nombre || 'Material',
        cantidad: m.cantidad ?? m.cantidad_representada ?? null,
        funcion: m.funcion || null,
        detalle: m.origen || m.detalle || null,
      })).filter((m) => m.nombre)
    : [];

  // 7. Espacio
  const espacio = {
    zona: raw.espacio?.zona_utilizada || raw.espacio?.tipo || null,
    forma: raw.espacio?.forma || null,
    dimensiones: raw.espacio?.dimensiones || raw.espacio?.dimensiones_fuente || null,
    organizacion: raw.espacio?.orientacion || null,
  };

  // 8. Desarrollo
  const explicacion = raw.explicacion?.completa
    || raw.explicacion?.breve
    || (typeof raw.explicacion === 'string' ? raw.explicacion : null);
  const pasos = Array.isArray(raw.explicacion?.desarrollo_paso_a_paso)
    ? raw.explicacion.desarrollo_paso_a_paso
    : [];
  const fases = Array.isArray(raw.fases)
    ? raw.fases.map((f, idx) => ({
        orden: f.orden ?? idx + 1,
        descripcion: f.descripcion || f.accion_principal || null,
        accion_principal: f.accion_principal || null,
        resultado: f.resultado || null,
        que_ocurre_despues: f.que_ocurre_despues || null,
      })).filter((f) => f.descripcion || f.accion_principal)
    : [];

  // 9. Rotaciones
  const rotaciones = {
    reglas: Array.isArray(raw.reglas) ? raw.reglas : [],
    cambio_de_rol: raw.rotaciones?.cambio_rol || null,
    fin_de_repeticion: raw.rotaciones?.fin_repeticion || null,
  };

  // 10. Carga
  const duracion = raw.tiempos_fuente?.duracion_total
    || raw.tiempos_fuente?.duracion_bloque
    || raw.tiempos_recomendados_editoriales?.duracion_bloque
    || null;
  const series = raw.series || null;
  const repeticiones = raw.repeticiones || null;
  const descansos = raw.tiempos_fuente?.descanso
    || raw.tiempos_recomendados_editoriales?.pausa_repeticion
    || null;
  const intensidad = raw.intensidad || null; // NUNCA inventada

  // 11. Coaching
  const puntosEntrenador = Array.isArray(raw.que_debemos_observar) ? raw.que_debemos_observar : [];
  const consignas = Array.isArray(raw.que_se_busca) ? raw.que_se_busca : [];
  const errores = Array.isArray(raw.errores) ? raw.errores : [];
  const correcciones = [
    ...(Array.isArray(raw.correcciones) ? raw.correcciones : []),
    ...(Array.isArray(raw.correcciones_fuente) ? raw.correcciones_fuente : []),
    ...(Array.isArray(raw.correcciones_editoriales) ? raw.correcciones_editoriales : []),
  ];

  // 12. Variantes
  const variantes = Array.isArray(raw.variantes_fuente) ? raw.variantes_fuente : [];

  // 13. Leyenda
  let leyenda = null;
  if (raw.leyenda && typeof raw.leyenda === 'object') {
    leyenda = {
      jugadores: raw.leyenda.jugadores || raw.leyenda.jugadores_y_roles || null,
      materiales: raw.leyenda.materiales || null,
      zonas: raw.leyenda.zonas || null,
      acciones: raw.leyenda.acciones || raw.leyenda.acciones_graficas || null,
    };
  }

  // 14. Media
  const media = {
    preview: `library-v2/assets/previews/${id}.png`,
    video: `${SUPABASE_STORAGE_BASE}/${id}/ejercicio.mp4`,
  };

  // 15. Trazabilidad interna QA
  const qaInterna = {
    source_zip: record.source_zip,
    source_folder: record.source_folder,
    collection: record.collection,
    hash_data_json: record.hash_data_json,
    hash_preview: record.hash_preview,
    hash_mp4: record.hash_mp4,
  };

  return {
    ...identidad,
    categoria,
    subcategoria,
    etiquetas,
    ambitos,
    contenidos,
    objetivos: {
      general: objGeneral,
      secundarios: objSecundarios,
      tacticos: objTacticos,
      tecnicos: objTecnicos,
      coordinativos: objCoordinativos,
      fisicos: objFisicos,
      otros: objOtros,
    },
    organizacion: {
      jugadores: jugadoresRaw,
      jugadores_de_campo: jugadoresDeCampo,
      porteros,
      entrenadores,
      roles,
      grupos,
      equipos,
      oposicion: raw.organizacion?.oposicion || null,
    },
    materiales,
    espacio,
    desarrollo: {
      explicacion,
      pasos,
      fases,
    },
    rotaciones,
    carga: {
      duracion,
      series,
      repeticiones,
      descansos,
      intensidad,
    },
    coaching: {
      puntos_entrenador: puntosEntrenador,
      consignas,
      errores,
      correcciones,
    },
    variantes,
    leyenda,
    media,
    _qa: qaInterna,
  };
}

const catalog = auditRecords.map(normalizeExercise);

fs.writeFileSync(CATALOG_FILE, JSON.stringify(catalog, null, 2), 'utf8');
fs.writeFileSync(CATALOG_JS_FILE, 'window.CATALOG_V2 = ' + JSON.stringify(catalog) + ';\n', 'utf8');

console.log(`Catálogo canónico generado exitosamente:`);
console.log(`Total ejercicios: ${catalog.length}/248`);
console.log(`Tamaño catalog.json: ${(fs.statSync(CATALOG_FILE).size / 1024).toFixed(1)} KB`);
console.log(`Tamaño catalog-data.js: ${(fs.statSync(CATALOG_JS_FILE).size / 1024).toFixed(1)} KB`);
