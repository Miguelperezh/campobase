import os
import sys
import json
import zipfile
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT_DIR = os.getcwd()
DATA_DIR = os.path.join(ROOT_DIR, 'library-v2', 'data')
AUDIT_FILE = os.path.join(DATA_DIR, 'source_audit.json')

with open(AUDIT_FILE, 'r', encoding='utf-8') as f:
    audit_records = json.load(f)

SUPABASE_URL = 'https://mdzpygfwugawlmknywxa.supabase.co'
KEY = 'sb_publishable_j7duh_i5pNnMZMtT0YT-fg_l76UA_gH'
BUCKET = 'ejercicio-videos'
PREFIX = 'library-v2-preview'

ZIP_CACHE = {}

def get_zip(zip_name):
    if zip_name not in ZIP_CACHE:
        if 'PDF150' in zip_name:
            p = os.path.expanduser(f'~/Desktop/Pack 150/{zip_name}')
        else:
            p = os.path.expanduser(f'~/Desktop/98 EJERCICIOS/{zip_name}')
        ZIP_CACHE[zip_name] = zipfile.ZipFile(p, 'r')
    return ZIP_CACHE[zip_name]

def upload_single_mp4(record):
    ex_id = record['exercise_id']
    zip_name = record['source_zip']
    folder = record['source_folder']
    mp4_path = f"{folder}/ejercicio.mp4"

    target_key = f"{PREFIX}/{ex_id}/ejercicio.mp4"
    public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{target_key}"

    # Comprobar si ya existe con HEAD request
    try:
        head_req = urllib.request.Request(public_url, method='HEAD')
        with urllib.request.urlopen(head_req, timeout=5) as resp:
            if resp.status == 200:
                return (ex_id, True, 'already_exists')
    except Exception:
        pass

    # Leer mp4 del ZIP
    z = get_zip(zip_name)
    mp4_data = z.read(mp4_path)

    upload_url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{target_key}"
    req = urllib.request.Request(upload_url, data=mp4_data, headers={
        'apikey': KEY,
        'Authorization': f'Bearer {KEY}',
        'Content-Type': 'video/mp4',
        'x-upsert': 'true'
    }, method='POST')

    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                if resp.status == 200:
                    return (ex_id, True, 'uploaded')
        except Exception as e:
            if attempt == 2:
                return (ex_id, False, str(e))

    return (ex_id, False, 'unknown_failure')

print(f"=== SUBIDA DE {len(audit_records)} VÍDEOS MP4 A SUPABASE STORAGE ===")
print(f"Destino: {BUCKET}/{PREFIX}/{{id}}/ejercicio.mp4\n")

uploaded_count = 0
failed = []

with ThreadPoolExecutor(max_workers=8) as executor:
    futures = {executor.submit(upload_single_mp4, r): r['exercise_id'] for r in audit_records}
    for idx, future in enumerate(as_completed(futures), 1):
        ex_id, success, status = future.result()
        if success:
            uploaded_count += 1
            if idx % 25 == 0 or idx == len(audit_records):
                print(f"Progreso: {idx}/{len(audit_records)} ({uploaded_count} verificados/subidos)")
        else:
            print(f"ERROR al subir {ex_id}: {status}")
            failed.append((ex_id, status))

print("\n=== RESUMEN DE SUBIDA ===")
print(f"Total objetivos: {len(audit_records)}")
print(f"Completados con éxito: {uploaded_count}")
print(f"Fallidos: {len(failed)}")

if failed:
    sys.exit(1)
