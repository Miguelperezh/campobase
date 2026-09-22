#!/usr/bin/env bash
set -euo pipefail
ROOT=/tmp/campobase-mobile-video-probe
mkdir -p "$ROOT"
URL="https://github.com/Miguelperezh/campobase/releases/download/campobase-videos-v1/library-v2-preview__f7-126__ejercicio.mp4"
curl -L --fail --retry 3 -o "$ROOT/original.mp4" "$URL"
ffmpeg -y -i "$ROOT/original.mp4" -map 0 -c copy -movflags +faststart "$ROOT/faststart-copy.mp4"
ffmpeg -y -i "$ROOT/original.mp4" -map 0:v:0 -vf "scale=1152:720:flags=lanczos,fps=30" -c:v libx264 -profile:v baseline -level:v 3.1 -pix_fmt yuv420p -preset medium -crf 22 -x264-params "bframes=0:ref=2:keyint=60:min-keyint=30:scenecut=40" -movflags +faststart -an "$ROOT/transcoded-mobile.mp4"
echo "=== ffprobe ==="
for f in "$ROOT"/*.mp4; do
  echo "--- $f"
  ffprobe -v error -show_entries stream=codec_name,profile,pix_fmt,level,codec_tag_string,width,height -show_entries format=format_name,format_long_name,duration,bit_rate -of json "$f"
  python3 - "$f" <<'PY'
import sys
b=open(sys.argv[1],'rb').read()
print({a.decode():b.find(a) for a in (b'ftyp',b'moov',b'mdat')})
PY
done
