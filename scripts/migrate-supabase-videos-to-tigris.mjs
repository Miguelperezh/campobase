#!/usr/bin/env node
import { createHash, createHmac } from 'node:crypto';
import { readFile, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SUPABASE_BASE = 'https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos';
const DEFAULT_ENDPOINT = 'https://t3.storage.dev';
const DEFAULT_REGION = 'auto';

const required = ['TIGRIS_ACCESS_KEY_ID', 'TIGRIS_SECRET_ACCESS_KEY', 'TIGRIS_BUCKET'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Falta la variable de entorno ${key}. No guardes credenciales en Git.`);
    process.exit(2);
  }
}

const ACCESS_KEY = process.env.TIGRIS_ACCESS_KEY_ID;
const SECRET_KEY = process.env.TIGRIS_SECRET_ACCESS_KEY;
const BUCKET = process.env.TIGRIS_BUCKET;
const ENDPOINT = process.env.TIGRIS_ENDPOINT || DEFAULT_ENDPOINT;
const REGION = process.env.TIGRIS_REGION || DEFAULT_REGION;

const manifest = JSON.parse(await readFile(new URL('./tigris-video-manifest.json', import.meta.url), 'utf8'));
const onlyArg = process.argv.find((v) => v.startsWith('--only='));
const limitArg = process.argv.find((v) => v.startsWith('--limit='));
const dryRun = process.argv.includes('--dry-run');
const only = onlyArg ? onlyArg.slice('--only='.length) : null;
const limit = limitArg ? Number(limitArg.slice('--limit='.length)) : null;

let items = only ? manifest.filter((x) => x.name === only) : manifest;
if (only && items.length !== 1) throw new Error(`No existe en el manifiesto: ${only}`);
if (Number.isFinite(limit) && limit > 0) items = items.slice(0, limit);

const sha256 = (data) => createHash('sha256').update(data).digest('hex');
const hmac = (key, data, enc) => createHmac('sha256', key).update(data).digest(enc);

function amzDate(now = new Date()) {
  return now.toISOString().replace(/[:-]|\.\d{3}/g, '');
}
function dateStamp(amz) { return amz.slice(0, 8); }
function signingKey(secret, date, region, service) {
  const kDate = hmac(Buffer.from('AWS4' + secret, 'utf8'), date);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  return hmac(kService, 'aws4_request');
}
function encodeKey(key) {
  return key.split('/').map(encodeURIComponent).join('/');
}

async function putObject(key, body) {
  const endpoint = new URL(ENDPOINT);
  const host = `${BUCKET}.${endpoint.host}`;
  const path = '/' + encodeKey(key);
  const url = `${endpoint.protocol}//${host}${path}`;
  const now = amzDate();
  const stamp = dateStamp(now);
  const payloadHash = sha256(body);
  const canonicalHeaders =
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${now}\n`;
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
  const canonicalRequest = [
    'PUT',
    path,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');
  const scope = `${stamp}/${REGION}/s3/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    now,
    scope,
    sha256(canonicalRequest),
  ].join('\n');
  const signature = hmac(signingKey(SECRET_KEY, stamp, REGION, 's3'), stringToSign, 'hex');
  const authorization =
    `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: authorization,
      'x-amz-date': now,
      'x-amz-content-sha256': payloadHash,
      'content-type': 'video/mp4',
      'cache-control': 'public, max-age=86400',
    },
    body,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`PUT ${key}: HTTP ${res.status} ${text.slice(0, 500)}`);
  }
  return url;
}

async function fetchSource(item) {
  const url = `${SUPABASE_BASE}/${encodeKey(item.name)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET Supabase ${item.name}: HTTP ${res.status}`);
  const body = Buffer.from(await res.arrayBuffer());
  if (Number(item.size) !== body.length) {
    throw new Error(`Tamaño distinto en ${item.name}: esperado ${item.size}, descargado ${body.length}`);
  }
  return body;
}

async function verifyPublic(url, expectedSize) {
  let res = await fetch(url, { method: 'HEAD' });
  if (!res.ok) {
    res = await fetch(url, { headers: { Range: 'bytes=0-0' } });
  }
  if (!res.ok && res.status !== 206) throw new Error(`URL pública no disponible: HTTP ${res.status}`);
  const type = res.headers.get('content-type') || '';
  if (type && !type.toLowerCase().includes('video/mp4')) {
    throw new Error(`Content-Type inesperado: ${type}`);
  }
  const length = Number(res.headers.get('content-length'));
  if (res.status === 200 && Number.isFinite(length) && length > 0 && length !== expectedSize) {
    throw new Error(`Tamaño remoto distinto: ${length} != ${expectedSize}`);
  }
}

console.log(`Tigris: ${items.length} vídeo(s)${dryRun ? ' [DRY RUN]' : ''}`);
let done = 0;
for (const [i, item] of items.entries()) {
  console.log(`[${i + 1}/${items.length}] ${item.name}`);
  if (dryRun) continue;
  const body = await fetchSource(item);
  const url = await putObject(item.name, body);
  await verifyPublic(url, body.length);
  done += 1;
}
console.log(`Completado: ${done}/${items.length} subidos y verificados.`);
