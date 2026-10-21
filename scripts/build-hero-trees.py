"""
Hero band ki pedh wali tasveerein — media-src/hero-raw2/hero-*.jpg (Grok, 1408²) → public/hero-trees/*.webp (640², ~75KB)
Chalao: python3 scripts/build-hero-trees.py   (zaroorat: pip install pillow)
"""
import os
from PIL import Image

SRC, OUT = "media-src/hero-raw2", "public/hero-trees"
os.makedirs(OUT, exist_ok=True)
for f in sorted(os.listdir(SRC)):
    if not f.endswith(".jpg"):
        continue
    name = f[len("hero-"):-4]
    Image.open(f"{SRC}/{f}").convert("RGB").resize((640, 640), Image.LANCZOS).save(
        f"{OUT}/{name}.webp", "WEBP", quality=70, method=6
    )
    print(name)
