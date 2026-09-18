#!/usr/bin/env node
import { readFile, mkdtemp, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const SUPABASE_BASE = 'https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos';
const R2_BUCKET = 'campobase-videos';
const R2_PUBLIC_BASE = 'https://pub-15e00678d78749c6861d652d01832b5c.r2.dev';
const manifest = JSON.parse(await readFile(new URL('./r2-migration-manifest.json', import.meta.url), 'utf8'));

const onlyArg = process.argv.find((v) => v.startsWith('--only='));
const limitArg = process.argv.find((v) => v.startsWith('--limit='));
const dryRun = process.argv.includes('--dry-run');
const only = onlyArg ? onlyArg.slice('--only='.length) : null;
const limit = limitArg ? Number(limitArg.slice('--limit='.length)) : null;

let items = only ? manifest.filter((x) => x.name === only) : manifest;
if (only && items.length !== 1) throw new Error(`No existe en el manifiesto: ${only}`);
if (Number.isFinite(limit) && limit > 0) items = items.slice(0, limit);

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('error', reject);
    p.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${cmd} terminó con código ${code}`)));
  });
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await import('node:fs/promises').then((fs) => fs.writeFile(dest, buf));
  return buf.length;
}

console.log(`Migrando ${items.length} vídeo(s) a R2${dryRun ? ' [DRY RUN]' : ''}...`);
const dir = await mkdtemp(join(tmpdir(), 'campobase-r2-'));
let ok = 0;
try {
  for (const [index, item] of items.entries()) {
    const encoded = item.name.split('/').map(encodeURIComponent).join('/');
    const source = `${SUPABASE_BASE}/${encoded}`;
    const target = `${R2_BUCKET}/${item.name}`;
    const local = join(dir, `video-${index}.mp4`);
    console.log(`[${index + 1}/${items.length}] ${item.name}`);
    if (dryRun) continue;

    const bytes = await download(source, local);
    if (Number(item.size) !== bytes) {
      throw new Error(`Tamaño distinto en ${item.name}: esperado ${item.size}, descargado ${bytes}`);
    }

    await run('npx', [
      'wrangler', 'r2', 'object', 'put', target,
      '--file', local,
      '--content-type', 'video/mp4',
      '--cache-control', 'public, max-age=86400',
      '--remote',
      '--force'
    ]);

    const check = await fetch(`${R2_PUBLIC_BASE}/${encoded}`, { method: 'HEAD' });
    if (!check.ok) throw new Error(`R2 no responde para ${item.name}: HTTP ${check.status}`);
    const r2Size = Number(check.headers.get('content-length'));
    if (Number.isFinite(r2Size) && r2Size > 0 && r2Size !== bytes) {
      throw new Error(`Tamaño R2 distinto en ${item.name}: ${r2Size} != ${bytes}`);
    }
    ok += 1;
  }
} finally {
  await rm(dir, { recursive: true, force: true });
}
console.log(`Completado: ${ok}/${items.length} subidos y verificados.`);
