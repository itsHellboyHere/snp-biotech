#!/usr/bin/env bash
# "बाग़" segment ki video — Grok ki raw video se web-ready files banata hai
# Input:  media-src/bagh-raw/bagh-16x9.mp4  (desktop, 1280x720)
#         media-src/bagh-raw/bagh-9x16.mp4  (phone, 720x1280)
# Output: public/bagh/bagh-desktop.mp4 + bagh-mobile.mp4 (~2MB each, bina awaaz)
#         public/bagh/poster-desktop.webp + poster-mobile.webp (pehla frame / Data Saver)
# Chalao: bash scripts/build-bagh-video.sh
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=media-src/bagh-raw
OUT=public/bagh
mkdir -p "$OUT"

# hqdn3d = halka noise hatao (patton ka noise bahut data khaata hai) · crf 32 = chhoti file
# faststart = video download hote hote chalne lage · -an = awaaz hatao
encode() {
  ffmpeg -v error -y -i "$1" -an -map 0:v:0 -c:v libx264 -preset slow -crf 32 \
    -profile:v high -pix_fmt yuv420p -movflags +faststart \
    -vf "hqdn3d=1.5:1.5:6:6,scale=$3" "$2"
}
encode "$SRC/bagh-16x9.mp4" "$OUT/bagh-desktop.mp4" 1280:720
encode "$SRC/bagh-9x16.mp4" "$OUT/bagh-mobile.mp4" 720:1280

ffmpeg -v error -y -i "$OUT/bagh-desktop.mp4" -frames:v 1 -c:v libwebp -quality 50 "$OUT/poster-desktop.webp"
ffmpeg -v error -y -i "$OUT/bagh-mobile.mp4" -frames:v 1 -c:v libwebp -quality 50 "$OUT/poster-mobile.webp"

ls -lh "$OUT"
