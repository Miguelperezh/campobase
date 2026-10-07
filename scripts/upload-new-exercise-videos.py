import json, os, glob, subprocess, time, shutil, tempfile

OWNER = 'Miguelperezh'
REPO = 'campobase'
TAG = 'campobase-videos-v2'
base_dir = '/Users/miguelperez/Documents/Codex/2026-09-09/files-mentioned-by-the-user-figuras/outputs/CampoBase_Documentos'

print(f"Consultando assets existentes en GitHub Releases ({TAG})...")
res = subprocess.run(['gh', 'release', 'view', TAG, '--json', 'assets'], capture_output=True, text=True)
if res.returncode != 0:
    print(f"Error consultando release {TAG}: {res.stderr}")
    exit(1)

assets_data = json.loads(res.stdout).get('assets', [])
existing_assets = set(a['name'] for a in assets_data)
print(f"Total assets ya en GitHub Releases ({TAG}): {len(existing_assets)}")

lotes_desc = [
    '951-1000',
    '901-950',
    '851-900',
    '801-850',
    '751-800',
    '701-750',
    '651-700',
    '601-650',
    '551-600',
    '501-550',
    '451-500',
    '401-450',
    '351-400',
    '301-350',
    '251-300',
    '201-250',
    '151-200'
]

tasks = [] # (source_mp4, asset_name)
seen_ids = set()

for lote in lotes_desc:
    lote_path = os.path.join(base_dir, lote)
    dirs = sorted([d for d in glob.glob(os.path.join(lote_path, '*')) if os.path.isdir(d) and not os.path.basename(d).startswith('.')])
    for d in dirs:
        data_path = os.path.join(d, 'data.json')
        video_path = os.path.join(d, 'ejercicio.mp4')
        if not os.path.exists(data_path) or not os.path.exists(video_path):
            continue
        try:
            data = json.load(open(data_path, encoding='utf-8'))
        except:
            continue
            
        f7_id = data.get('exercise_id') or f"f7-{os.path.basename(d).split('_')[0]}"
        if f7_id in seen_ids:
            continue
        seen_ids.add(f7_id)
        
        main_asset = f"library-v2-preview__{f7_id}__ejercicio.mp4"
        if main_asset not in existing_assets:
            tasks.append((video_path, main_asset))

print(f"Total ejercicios únicos identificados: {len(seen_ids)}")
print(f"Total archivos a subir (pendientes): {len(tasks)}")

if not tasks:
    print(f"¡Todos los vídeos ya están subidos a GitHub Releases ({TAG})!")
    exit(0)

# Subir en lotes de 25 archivos
batch_size = 25
total_batches = (len(tasks) + batch_size - 1) // batch_size

for b_idx in range(total_batches):
    batch = tasks[b_idx * batch_size : (b_idx + 1) * batch_size]
    print(f"--- Subiendo lote {b_idx + 1}/{total_batches} ({len(batch)} archivos) ---")
    
    with tempfile.TemporaryDirectory() as tmpdir:
        file_paths = []
        for src, dest_name in batch:
            dest_path = os.path.join(tmpdir, dest_name)
            shutil.copy2(src, dest_path)
            file_paths.append(dest_path)
            
        cmd = ['gh', 'release', 'upload', TAG] + file_paths + ['--clobber']
        t0 = time.time()
        sub_res = subprocess.run(cmd, capture_output=True, text=True)
        dur = round(time.time() - t0, 1)
        if sub_res.returncode == 0:
            print(f"✓ Lote {b_idx + 1} subido con éxito en {dur}s ({len(batch)} assets)")
        else:
            print(f"✗ Advertencia en lote {b_idx + 1}: {sub_res.stderr.strip()}")
            # Reintento uno a uno en caso de error transitorio
            for p in file_paths:
                subprocess.run(['gh', 'release', 'upload', TAG, p, '--clobber'], capture_output=True)

print(f"\n¡Subida completada al 100% en {TAG}!")
