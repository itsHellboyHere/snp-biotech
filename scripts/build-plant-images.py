"""Plants page ki "product shot" photos — Grok ki raw 1408px jpg se web-ready webp.
Input:  media-src/plants-raw/<naam>-<1..4>.jpg  (Grok ki 4 photos har prompt pe)
Output: public/plants/<naam>.webp (900px, ~50KB)
Chalao: python3 scripts/build-plant-images.py
Nayi photo? PICKS mein naam + kaunsi (1-4) jodo aur dobara chalao."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "media-src/plants-raw", ROOT / "public/plants"
OUT.mkdir(parents=True, exist_ok=True)

PICKS = {
    "mango-dasheri": "dasheri-1", "mango-langra": "langra-2", "mango-chausa": "chausa-3",
    "mango-amrapali": "amrapali-2", "guava-taiwan": "taiwan-3", "guava-safeda": "safeda-2",
    "guava-lalit": "lalit-3", "litchi": "litchi-2", "kinnow": "kinnow-3", "mosambi": "mosambi-2",
    "lemon": "lemon-2", "chikoo": "chikoo-2", "pear": "pear-2", "amla": "amla-1",
    "teak": "teak-2", "neem": "neem-2", "gulmohar": "gulmohar-2",
}
SIZE, CROP = 900, 0.88  # beech ka 88% — kone ka Grok watermark kat jaata hai

for out, src in PICKS.items():
    im = Image.open(SRC / f"{src}.jpg").convert("RGB")
    w, h = im.size
    c = int(min(w, h) * CROP)
    l, t = (w - c) // 2, (h - c) // 2
    im = im.crop((l, t, l + c, t + c)).resize((SIZE, SIZE), Image.LANCZOS)
    im.save(OUT / f"{out}.webp", "WEBP", quality=80, method=6)
    print(out, (OUT / f"{out}.webp").stat().st_size // 1024, "KB")
