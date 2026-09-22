#!/usr/bin/env bash
set -euo pipefail
GH="https://github.com/Miguelperezh/campobase/releases/download/campobase-videos-v1/library-v2-preview__f7-126__ejercicio.mp4"
SB="https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/library-v2-preview/f7-126/ejercicio.mp4"

probe() {
  local label="$1"; local url="$2"
  echo "=== $label HEAD ==="
  curl -L -sS -D - -o /dev/null "$url" | grep -Ei '^(HTTP/|content-type:|content-disposition:|accept-ranges:|content-length:|content-range:|cache-control:)' || true
  echo "=== $label RANGE 0-1023 ==="
  curl -L -sS -H 'Range: bytes=0-1023' -D - -o /dev/null "$url" | grep -Ei '^(HTTP/|content-type:|content-disposition:|accept-ranges:|content-length:|content-range:|cache-control:)' || true
  echo "=== $label RANGE tail ==="
  curl -L -sS -H 'Range: bytes=250000-' -D - -o /dev/null "$url" | grep -Ei '^(HTTP/|content-type:|content-disposition:|accept-ranges:|content-length:|content-range:|cache-control:)' || true
}
probe GitHub "$GH"
probe Supabase "$SB"
