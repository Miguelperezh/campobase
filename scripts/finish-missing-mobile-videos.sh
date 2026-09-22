#!/usr/bin/env bash
set -euo pipefail
ROOT=/tmp/campobase-mobile-missing
mkdir -p "$ROOT"
cat > /tmp/missing.txt <<'EOF'
library-v2-preview/pdf98-058/ejercicio.mp4
library-v2-preview/pdf98-060/ejercicio.mp4
library-v2-preview/pdf98-063/ejercicio.mp4
library-v2-preview/pdf98-068/ejercicio.mp4
library-v2-preview/pdf98-071/ejercicio.mp4
library-v2-preview/pdf98-072/ejercicio.mp4
library-v2-preview/pdf98-079/ejercicio.mp4
library-v2-preview/pdf98-084/ejercicio.mp4
library-v2-preview/pdf98-087/ejercicio.mp4
library-v2-preview/pdf98-090/ejercicio.mp4
library-v2-preview/pdf98-095/ejercicio.mp4
library-v2-preview/pdf98-096/ejercicio.mp4
library-v2-preview/pdf98-097/ejercicio.mp4
library-v2-preview/pdf98-098/ejercicio.mp4
EOF

existing_asset() {
  local needle="$1"
  gh api --paginate repos/Miguelperezh/campobase/releases/391449607/assets -f per_page=100 --jq '.[].name' | grep -Fxq "$needle"
}

while IFS= read -r path; do
  [ -n "$path" ] || continue
  asset="${path//\//__}"
  mobile="${asset%.mp4}-mobile.mp4"
  echo "PROCESS $asset -> $mobile"

  if existing_asset "$mobile"; then
    echo "SKIP exists $mobile"
    continue
  fi

  curl -L --fail --retry 3     -o "$ROOT/original.mp4"     "https://github.com/Miguelperezh/campobase/releases/download/campobase-videos-v1/$asset"

  ffmpeg -hide_banner -loglevel error -y     -i "$ROOT/original.mp4"     -map 0:v:0     -vf "scale='min(1152,iw)':-2:flags=lanczos,fps=30"     -c:v libx264 -profile:v baseline -level:v 3.1     -pix_fmt yuv420p -preset veryfast -crf 23     -x264-params "bframes=0:ref=2:keyint=60:min-keyint=30:scenecut=40"     -movflags +faststart -an "$ROOT/$mobile"

  gh release upload campobase-videos-v1 "$ROOT/$mobile"
  rm -f "$ROOT/original.mp4" "$ROOT/$mobile"
done < /tmp/missing.txt
