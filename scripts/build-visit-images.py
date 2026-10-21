"""Visit Nursery page ki photos — Grok ki placeholder (TODO: client ki asli photos se badlo)
Input:  media-src/visit-raw/<naam>-<n>.jpg (1728x1152, 3:2)
Output: public/visit/<naam>.webp
Chalao: python3 scripts/build-visit-images.py
Client ki asli photo aaye → media-src/visit-raw mein daalo, PICKS mein naam badlo, dobara chalao."""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "media-src/visit-raw", ROOT / "public/visit"
OUT.mkdir(parents=True, exist_ok=True)

# out-naam: (source, chaudai)
PICKS = {
    "nursery-rows": ("rows-3", 1600),
    "gate": ("gate-4", 1200),
    "grafting": ("grafting-3", 1200),
    "mother-trees": ("mother-2", 1200),
    "delivery": ("pickup-3", 1200),
}
CROP = 0.93  # beech ka 93% — kone ka Grok watermark kat jaata hai

for out, (src, width) in PICKS.items():
    im = ImageOps.exif_transpose(Image.open(SRC / f"{src}.jpg")).convert("RGB")
    w, h = im.size
    cw, ch = int(w * CROP), int(h * CROP)
    l, t = (w - cw) // 2, (h - ch) // 2
    im = im.crop((l, t, l + cw, t + ch))
    im = im.resize((width, round(width * ch / cw)), Image.LANCZOS)
    im.save(OUT / f"{out}.webp", "WEBP", quality=78, method=6)
    print(out, im.size, (OUT / f"{out}.webp").stat().st_size // 1024, "KB")
