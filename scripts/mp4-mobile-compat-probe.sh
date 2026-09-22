#!/usr/bin/env bash
set -euo pipefail

BASE="https://github.com/Miguelperezh/campobase/releases/download/campobase-videos-v1"
FILES=(
  "library-v2-preview__f7-120__ejercicio.mp4"
  "library-v2-preview__f7-126__ejercicio.mp4"
  "library-v2-preview__f7-127__ejercicio.mp4"
  "library-v2-preview__f7-135__ejercicio.mp4"
  "CAMPOBASE-VIDEO-3-FINALIZACIONES-CENTRO-EXTERIOR-CENTRO-LATERAL__video.mp4"
)

for name in "${FILES[@]}"; do
  echo "=== $name ==="
  curl -L --fail --retry 3 -o "/tmp/$name" "$BASE/$name"
  ffprobe -v error     -show_entries stream=index,codec_name,codec_long_name,profile,codec_type,pix_fmt,level,width,height,r_frame_rate,avg_frame_rate,color_range,color_space,color_transfer,color_primaries     -show_entries format=format_name,duration,size,bit_rate,start_time     -of json "/tmp/$name"
  echo "--- atoms ---"
  python3 - "/tmp/$name" <<'PY'
import sys
p=sys.argv[1]
b=open(p,'rb').read()
for atom in (b'ftyp',b'moov',b'mdat'):
    print(atom.decode(), b.find(atom))
PY
done
