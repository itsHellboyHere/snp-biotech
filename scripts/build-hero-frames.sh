#!/usr/bin/env bash
# =========================================================
# Hero frames builder
# media-src/hero-raw/clip1..4.mp4  →  public/hero/{desktop,mobile}/frame_XXXX.webp
#
# Chalane ke liye (Mac):  brew install ffmpeg   (ek baar)
#                         bash scripts/build-hero-frames.sh
# Grok se clips dobara banao toh bas ye script phir se chala do.
# =========================================================
set -euo pipefail

RAW="media-src/hero-raw"
OUT="public/hero"
TMP="media-src/.build"

DESKTOP_FRAMES=150   # desktop pe kitne frames
MOBILE_FRAMES=90     # phone pe kam frames → kam data, kam RAM
XF=1.2               # do clips ke beech dissolve (seconds)
C2_SPEED=1.6         # clip2 mein change kam hai, isliye thoda tez

mkdir -p "$TMP" "$OUT/desktop" "$OUT/mobile"
rm -f "$OUT"/desktop/*.webp "$OUT"/mobile/*.webp

dur() { ffprobe -v error -select_streams v:0 -show_entries stream=duration -of csv=p=0 "$1"; }
D1=$(dur "$RAW/clip1.mp4"); D2=$(echo "$(dur "$RAW/clip2.mp4") / $C2_SPEED" | bc -l)
D3=$(dur "$RAW/clip3.mp4"); D4=$(dur "$RAW/clip4.mp4")

O1=$(echo "$D1 - $XF" | bc -l)
O2=$(echo "$O1 + $D2 - $XF" | bc -l)
O3=$(echo "$O2 + $D3 - $XF" | bc -l)
TOTAL=$(echo "$O3 + $D4" | bc -l)
echo "Total timeline: ${TOTAL}s"

# $1 = crop filter for clips 1-3, $2 = crop filter for clip 4, $3 = output file
stitch() {
  ffmpeg -v error -y \
    -i "$RAW/clip1.mp4" -i "$RAW/clip2.mp4" -i "$RAW/clip3.mp4" -i "$RAW/clip4.mp4" \
    -filter_complex "
      [0:v:0]$1,fps=24,format=yuv420p,settb=AVTB,setpts=PTS-STARTPTS[a];
      [1:v:0]$1,setpts=(PTS-STARTPTS)/$C2_SPEED,fps=24,format=yuv420p,settb=AVTB[b];
      [2:v:0]$1,fps=24,format=yuv420p,settb=AVTB,setpts=PTS-STARTPTS[c];
      [3:v:0]$2,fps=24,format=yuv420p,settb=AVTB,setpts=PTS-STARTPTS[d];
      [a][b]xfade=transition=fade:duration=$XF:offset=$O1[ab];
      [ab][c]xfade=transition=fade:duration=$XF:offset=$O2[abc];
      [abc][d]xfade=transition=fade:duration=$XF:offset=$O3[v]" \
    -map "[v]" -an -c:v libx264 -crf 14 -preset slow "$3"
}

# Desktop: poora 16:9 frame
stitch "null" "null" "$TMP/hero-desktop.mp4"

# Mobile: 9:16 crop. Clip 1-3 mein paudha beech mein hai.
# Clip 4 mein ped thoda left (≈37% width) pe hai, isliye wahan crop left shift.
stitch "crop=ih*9/16:ih:(iw-ih*9/16)/2:0" "crop=ih*9/16:ih:iw*0.37-ih*9/32:0" "$TMP/hero-mobile.mp4"

FPS_D=$(echo "$DESKTOP_FRAMES / $TOTAL" | bc -l)
FPS_M=$(echo "$MOBILE_FRAMES / $TOTAL" | bc -l)

ffmpeg -v error -y -i "$TMP/hero-desktop.mp4" \
  -vf "fps=$FPS_D,scale=1280:-2:flags=lanczos" \
  -c:v libwebp -quality 70 -compression_level 6 -frames:v $DESKTOP_FRAMES \
  "$OUT/desktop/frame_%04d.webp"

ffmpeg -v error -y -i "$TMP/hero-mobile.mp4" \
  -vf "fps=$FPS_M,scale=405:-2:flags=lanczos" \
  -c:v libwebp -quality 64 -compression_level 6 -frames:v $MOBILE_FRAMES \
  "$OUT/mobile/frame_%04d.webp"

echo "Desktop: $(ls "$OUT"/desktop | wc -l) frames, $(du -sh "$OUT"/desktop | cut -f1)"
echo "Mobile:  $(ls "$OUT"/mobile | wc -l) frames, $(du -sh "$OUT"/mobile | cut -f1)"
