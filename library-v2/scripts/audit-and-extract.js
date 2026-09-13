import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

const ROOT_DIR = process.cwd();
const OUT_DIR = path.join(ROOT_DIR, 'library-v2');
const PREVIEWS_DIR = path.join(OUT_DIR, 'assets', 'previews');
const DATA_DIR = path.join(OUT_DIR, 'data');

fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });

const ZIPS = [
  {
    collection: 'PDF150',
    path: path.join(process.env.HOME, 'Desktop/Pack 150/PDF150_001_050.zip'),
    expected: 50,
  },
  {
    collection: 'PDF150',
    path: path.join(process.env.HOME, 'Desktop/Pack 150/PDF150_051_100.zip'),
    expected: 50,
  },
  {
    collection: 'PDF150',
    path: path.join(process.env.HOME, 'Desktop/Pack 150/PDF150_101_150.zip'),
    expected: 50,
  },
  {
    collection: 'PDF98',
    path: path.join(process.env.HOME, 'Desktop/98 EJERCICIOS/PDF98_001_020.zip'),
    expected: 20,
  },
  {
    collection: 'PDF98',
    path: path.join(process.env.HOME, 'Desktop/98 EJERCICIOS/PDF98_021_040.zip'),
    expected: 20,
  },
  {
    collection: 'PDF98',
    path: path.join(process.env.HOME, 'Desktop/98 EJERCICIOS/PDF98_041_060.zip'),
    expected: 20,
  },
  {
    collection: 'PDF98',
    path: path.join(process.env.HOME, 'Desktop/98 EJERCICIOS/PDF98_061_080.zip'),
    expected: 20,
  },
  {
    collection: 'PDF98',
    path: path.join(process.env.HOME, 'Desktop/98 EJERCICIOS/PDF98_081_098.zip'),
    expected: 18,
  },
];

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

console.log('=== AUDITORÍA FÍSICA Y EXTRACCIÓN DE LOS 8 ZIP ===\n');

const auditRecords = [];
let total150 = 0;
let total98 = 0;

for (const zipDef of ZIPS) {
  const zipFile = zipDef.path;
  const zipName = path.basename(zipFile);
  if (!fs.existsSync(zipFile)) {
    throw new Error(`Archivo no encontrado: ${zipFile}`);
  }

  console.log(`Auditoría de: ${zipName}...`);
  const listRaw = execSync(`zipinfo -1 "${zipFile}"`, { maxBuffer: 50 * 1024 * 1024 }).toString();
  const lines = listRaw.split('\n').filter(Boolean);

  const dataJsonPaths = lines.filter((l) => l.endsWith('/data.json'));
  console.log(`  -> data.json encontrados: ${dataJsonPaths.length} (esperados: ${zipDef.expected})`);
  if (dataJsonPaths.length !== zipDef.expected) {
    throw new Error(`Discrepancia en ${zipName}: esperados ${zipDef.expected}, encontrados ${dataJsonPaths.length}`);
  }

  for (const dataPath of dataJsonPaths) {
    const folder = path.dirname(dataPath);
    const previewPath = `${folder}/preview.png`;
    const mp4Path = `${folder}/ejercicio.mp4`;

    if (!lines.includes(previewPath)) {
      throw new Error(`Falta preview.png en: ${folder} (${zipName})`);
    }
    if (!lines.includes(mp4Path)) {
      throw new Error(`Falta ejercicio.mp4 en: ${folder} (${zipName})`);
    }

    // Extraer data.json
    const jsonBuf = execSync(`unzip -p "${zipFile}" "${dataPath}"`, { maxBuffer: 20 * 1024 * 1024 });
    const jsonData = JSON.parse(jsonBuf.toString('utf8'));
    const hashDataJson = sha256(jsonBuf);

    // Extraer preview.png
    const previewBuf = execSync(`unzip -p "${zipFile}" "${previewPath}"`, { maxBuffer: 20 * 1024 * 1024 });
    const hashPreview = sha256(previewBuf);

    // Extraer mp4 y calcular hash
    const mp4Buf = execSync(`unzip -p "${zipFile}" "${mp4Path}"`, { maxBuffer: 100 * 1024 * 1024 });
    const hashMp4 = sha256(mp4Buf);

    const exerciseId = jsonData.exercise_id || jsonData.id;
    if (!exerciseId) {
      throw new Error(`Sin ID de ejercicio en: ${dataPath}`);
    }

    // Guardar preview en directorio de assets
    const previewOutPath = path.join(PREVIEWS_DIR, `${exerciseId}.png`);
    fs.writeFileSync(previewOutPath, previewBuf);

    auditRecords.push({
      exercise_id: exerciseId,
      collection: zipDef.collection,
      source_zip: zipName,
      source_folder: folder,
      hash_data_json: hashDataJson,
      hash_preview: hashPreview,
      hash_mp4: hashMp4,
      size_preview: previewBuf.length,
      size_mp4: mp4Buf.length,
      raw_json: jsonData,
    });

    if (zipDef.collection === 'PDF150') total150 += 1;
    if (zipDef.collection === 'PDF98') total98 += 1;
  }
}

// Guardar auditoría completa
fs.writeFileSync(path.join(DATA_DIR, 'source_audit.json'), JSON.stringify(auditRecords, null, 2));

console.log('\n=== RESUMEN AUDITORÍA CERTIFICADA ===');
console.log(`ZIPs auditados: ${ZIPS.length}/8`);
console.log(`PDF150: ${total150}/150`);
console.log(`PDF98: ${total98}/98`);
console.log(`TOTAL: ${total150 + total98}/248`);
console.log(`Previews extraídas: ${fs.readdirSync(PREVIEWS_DIR).length}/248`);
console.log(`Archivo de auditoría guardado en: ${path.join(DATA_DIR, 'source_audit.json')}`);
