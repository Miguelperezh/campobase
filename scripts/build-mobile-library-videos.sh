#!/usr/bin/env bash
set -euo pipefail
SHARD="${1:?shard}"
TOTAL="${2:?total}"
ROOT=/tmp/campobase-mobile-batch
mkdir -p "$ROOT"

python3 - "$SHARD" "$TOTAL" <<'PY' > /tmp/mobile-list.txt
import json, sys
shard=int(sys.argv[1]); total=int(sys.argv[2])
with open('scripts/github-release-video-manifest.json','r',encoding='utf-8') as f:
    data=json.load(f)
items=[]
for row in data:
    name=row.get('name','')
    if not (name.startswith('library-v2-preview/') and name.endswith('/ejercicio.mp4')):
        continue
    items.append(name)
for i,name in enumerate(sorted(items)):
    if i % total == shard:
        print(name)
PY

count=0
while IFS= read -r path; do
  [ -n "$path" ] || continue
  asset="${path//\//__}"
  mobile="${asset%.mp4}-mobile.mp4"
  echo "[$SHARD/$TOTAL] $asset -> $mobile"

  if gh release view campobase-videos-v1 --json assets --jq '.assets[].name' | grep -Fxq "$mobile"; then
    echo "SKIP exists $mobile"
    continue
  fi

  curl -L --fail --retry 3     -o "$ROOT/original.mp4"     "https://github.com/Miguelperezh/campobase/releases/download/campobase-videos-v1/$asset"

  ffmpeg -hide_banner -loglevel error -y     -i "$ROOT/original.mp4"     -map 0:v:0     -vf "scale='min(1152,iw)':-2:flags=lanczos,fps=30"     -c:v libx264     -profile:v baseline     -level:v 3.1     -pix_fmt yuv420p     -preset veryfast     -crf 23     -x264-params "bframes=0:ref=2:keyint=60:min-keyint=30:scenecut=40"     -movflags +faststart     -an     "$ROOT/$mobile"

  test -s "$ROOT/$mobile"
  gh release upload campobase-videos-v1 "$ROOT/$mobile"
  rm -f "$ROOT/original.mp4" "$ROOT/$mobile"
  count=$((count+1))
done < /tmp/mobile-list.txt

echo "generated=$count shard=$SHARD total=$TOTAL"
