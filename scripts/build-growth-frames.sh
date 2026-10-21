#!/usr/bin/env bash
# "पौधे से पेड़" scroll-scrub ke frames — Grok ki 10s timelapse se
# Input:  media-src/growth-raw/growth-16x9.mp4 (1280x720, 24fps, 241 frames)
# Output: public/plants/growth/d/001.webp…  (desktop, 16:9, 960x540)
#         public/plants/growth/m/001.webp…  (phone, 4:3 beech se, 640x480)
# Har 5th frame = 48 frames; canvas beech ke frames ko crossfade karta hai (growth dheemi hai, scroll pe smooth hi lagta hai)
# Chalao: bash scripts/build-growth-frames.sh
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=media-src/growth-raw/growth-16x9.mp4
OUT=public/plants/growth
mkdir -p "$OUT/d" "$OUT/m"
PICK="select='not(mod(n\,5))',setpts=N/TB,hqdn3d=3:3:6:6"
ffmpeg -v error -y -i "$SRC" -vf "$PICK,scale=960:540" -vsync vfr -frames:v 48 -c:v libwebp -quality 34 -compression_level 6 "$OUT/d/%03d.webp"
ffmpeg -v error -y -i "$SRC" -vf "$PICK,crop=960:720,scale=640:480" -vsync vfr -frames:v 48 -c:v libwebp -quality 36 -compression_level 6 "$OUT/m/%03d.webp"
echo "desktop: $(ls $OUT/d | wc -l) frames, $(du -sh $OUT/d | cut -f1)"
echo "phone:   $(ls $OUT/m | wc -l) frames, $(du -sh $OUT/m | cut -f1)"
