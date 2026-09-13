import os
import sys
import json
import hashlib
import zipfile

ROOT_DIR = os.getcwd()
OUT_DIR = os.path.join(ROOT_DIR, 'library-v2')
PREVIEWS_DIR = os.path.join(OUT_DIR, 'assets', 'previews')
DATA_DIR = os.path.join(OUT_DIR, 'data')

os.makedirs(PREVIEWS_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

ZIPS = [
    {
        'collection': 'PDF150',
        'path': os.path.expanduser('~/Desktop/Pack 150/PDF150_001_050.zip'),
        'expected': 50,
    },
    {
        'collection': 'PDF150',
        'path': os.path.expanduser('~/Desktop/Pack 150/PDF150_051_100.zip'),
        'expected': 50,
    },
    {
        'collection': 'PDF150',
        'path': os.path.expanduser('~/Desktop/Pack 150/PDF150_101_150.zip'),
        'expected': 50,
    },
    {
        'collection': 'PDF98',
        'path': os.path.expanduser('~/Desktop/98 EJERCICIOS/PDF98_001_020.zip'),
        'expected': 20,
    },
    {
        'collection': 'PDF98',
        'path': os.path.expanduser('~/Desktop/98 EJERCICIOS/PDF98_021_040.zip'),
        'expected': 20,
    },
    {
        'collection': 'PDF98',
        'path': os.path.expanduser('~/Desktop/98 EJERCICIOS/PDF98_041_060.zip'),
        'expected': 20,
    },
    {
        'collection': 'PDF98',
        'path': os.path.expanduser('~/Desktop/98 EJERCICIOS/PDF98_061_080.zip'),
        'expected': 20,
    },
    {
        'collection': 'PDF98',
        'path': os.path.expanduser('~/Desktop/98 EJERCICIOS/PDF98_081_098.zip'),
        'expected': 18,
    },
]

def sha256(data_bytes):
    return hashlib.sha256(data_bytes).hexdigest()

print("=== AUDITORÍA FÍSICA Y EXTRACCIÓN DE LOS 8 ZIP ===\n")

audit_records = []
total_150 = 0
total_98 = 0

for item in ZIPS:
    zip_path = item['path']
    zip_name = os.path.basename(zip_path)
    collection = item['collection']
    expected = item['expected']

    if not os.path.exists(zip_path):
        raise FileNotFoundError(f"ZIP no encontrado: {zip_path}")

    print(f"Auditoría de: {zip_name} ({collection})...")
    with zipfile.ZipFile(zip_path, 'r') as z:
        names = z.namelist()
        data_json_files = [n for n in names if n.endswith('/data.json')]
        print(f"  -> data.json encontrados: {len(data_json_files)} (esperados: {expected})")
        if len(data_json_files) != expected:
            raise ValueError(f"Discrepancia en {zip_name}: esperados {expected}, encontrados {len(data_json_files)}")

        for data_path in data_json_files:
            folder = os.path.dirname(data_path)
            preview_path = f"{folder}/preview.png"
            mp4_path = f"{folder}/ejercicio.mp4"

            if preview_path not in names:
                raise FileNotFoundError(f"Falta preview.png en: {folder} ({zip_name})")
            if mp4_path not in names:
                raise FileNotFoundError(f"Falta ejercicio.mp4 en: {folder} ({zip_name})")

            # Leer data.json
            json_bytes = z.read(data_path)
            json_data = json.loads(json_bytes.decode('utf-8'))
            hash_json = sha256(json_bytes)

            # Leer preview.png
            preview_bytes = z.read(preview_path)
            hash_preview = sha256(preview_bytes)

            # Leer ejercicio.mp4
            mp4_bytes = z.read(mp4_path)
            hash_mp4 = sha256(mp4_bytes)

            exercise_id = json_data.get('exercise_id') or json_data.get('id')
            if not exercise_id:
                raise ValueError(f"Sin ID de ejercicio en {data_path}")

            # Guardar preview localmente para UI
            preview_out = os.path.join(PREVIEWS_DIR, f"{exercise_id}.png")
            with open(preview_out, 'wb') as f:
                f.write(preview_bytes)

            audit_records.append({
                'exercise_id': exercise_id,
                'collection': collection,
                'source_zip': zip_name,
                'source_folder': folder,
                'hash_data_json': hash_json,
                'hash_preview': hash_preview,
                'hash_mp4': hash_mp4,
                'size_preview': len(preview_bytes),
                'size_mp4': len(mp4_bytes),
                'raw_json': json_data
            })

            if collection == 'PDF150':
                total_150 += 1
            elif collection == 'PDF98':
                total_98 += 1

# Guardar registro de auditoría
audit_path = os.path.join(DATA_DIR, 'source_audit.json')
with open(audit_path, 'w', encoding='utf-8') as f:
    json.dump(audit_records, f, indent=2, ensure_ascii=False)

print("\n=== RESUMEN AUDITORÍA CERTIFICADA ===")
print(f"ZIP AUDITADOS: {len(ZIPS)}/8")
print(f"TOTAL: {total_150 + total_98}")
print(f"PDF150: {total_150}")
print(f"PDF98: {total_98}")
print(f"JSON: {len(audit_records)}/248")
print(f"PREVIEWS: {len(os.listdir(PREVIEWS_DIR))}/248")
print(f"MP4: {len(audit_records)}/248")
print(f"Archivo de auditoría: {audit_path}")
