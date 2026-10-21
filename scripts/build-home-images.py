"""
Home ke naye sections ki tasveerein — media-src/home-raw/*.jpg → public/home/*.webp
Chalao: python3 scripts/build-home-images.py   (zaroorat: pip install pillow numpy)
- tree-*   : upar se pedh — background + parchhai hata ke (transparent), 240px
- fruit-*  : fal — beech se crop, 220px (gol "sikkon" mein dikhte hain)
- rings    : pedh ke chhalle — gol hissa crop, 900px
- chat-*   : WhatsApp chat wali photo, 600x800
"""
import numpy as np
from PIL import Image, ImageFilter

RAW, OUT = "media-src/home-raw", "public/home"


def tree(name):
    im = Image.open(f"{RAW}/{name}.jpg").convert("RGB")
    hsv = np.asarray(im.convert("HSV")).astype(np.float32) / 255
    a = np.asarray(im).astype(np.float32)
    sat, val = hsv[..., 1], hsv[..., 2]
    # Patte/fal = gehra rang (saturation); parchhai aur background feeke
    m = np.clip((sat - 0.24) / 0.14, 0, 1)
    m = np.maximum(m, np.clip((0.45 - val) / 0.15, 0, 1))
    mask = Image.fromarray((m * 255).astype(np.uint8))
    mask = mask.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(9)).filter(ImageFilter.GaussianBlur(1.2))
    al = np.asarray(mask).astype(np.float32) / 255
    img = Image.fromarray(np.dstack([a, al * 255]).astype(np.uint8), "RGBA")
    img = img.crop(Image.fromarray((al > 0.1).astype(np.uint8) * 255).getbbox())
    w, h = img.size
    s = max(w, h)
    sq = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    sq.paste(img, ((s - w) // 2, (s - h) // 2))
    sq.resize((240, 240), Image.LANCZOS).save(f"{OUT}/{name}.webp", "WEBP", quality=82, method=6)


for t in ["tree-mango", "tree-guava", "tree-lemon", "tree-litchi"]:
    tree(t)

for f in ["mango", "guava", "litchi", "chikoo", "kinnow", "mosambi", "lemon", "pear"]:
    im = Image.open(f"{RAW}/fruit-{f}.jpg").convert("RGB")
    w, h = im.size
    c = int(w * 0.86)
    off = int(h * 0.02)
    im = im.crop(((w - c) // 2, (h - c) // 2 - off, (w + c) // 2, (h + c) // 2 - off))
    im.resize((220, 220), Image.LANCZOS).save(f"{OUT}/fruit-{f}.webp", "WEBP", quality=78, method=6)

im = Image.open(f"{RAW}/rings.jpg").convert("RGB")
w, h = im.size
m = int(w * 0.095)
im.crop((m, m, w - m, h - m)).resize((900, 900), Image.LANCZOS).save(f"{OUT}/rings.webp", "WEBP", quality=74, method=6)

Image.open(f"{RAW}/chat-guava.jpg").convert("RGB").resize((600, 800), Image.LANCZOS).save(
    f"{OUT}/chat-guava.webp", "WEBP", quality=72, method=6
)
print("done")
