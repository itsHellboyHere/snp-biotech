#!/usr/bin/env python3
# =========================================================
# Client ki ASLI nursery photos → website ke liye taiyaar (Instagram jaisi 1:1)
#
# Source:  media-src/client-photos/<plant>-<n>.jpeg   (WhatsApp se aayi originals)
# Output:  public/plants/real/<name>.webp   → Plants page (card, detail, compare, order)
#          public/hero-real/<name>.webp     → Hero ki tilted band (halki, 720px)
#
# Nayi photo aaye → media-src/client-photos mein daalo, neeche PHOTOS mein ek line,
# phir:  python3 scripts/build-real-photos.py
#
# crop = (x, y, size) original pixels mein — 1:1 square, paudha + thaili beech mein.
# None = poori photo ke beech se sabse bada square.
# =========================================================
import os
from PIL import Image, ImageEnhance, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "media-src", "client-photos")
OUT_PLANTS = os.path.join(ROOT, "public", "plants", "real")
OUT_HERO = os.path.join(ROOT, "public", "hero-real")

CARD = 1080  # Instagram post size
HERO = 720

#        source file        output name   crop (x, y, size)    hero?
PHOTOS = [
    ("mango-1.jpeg",   "mango-1",   None,              False),
    ("mango-2.jpeg",   "mango-2",   (10, 0, 780),      True),   # "Banana Mango" tag neeche kat jaata hai
    ("guava-1.jpeg",   "guava-1",   (0, 100, 820),     True),
    ("guava-2.jpeg",   "guava-2",   (0, 120, 524),     False),
    ("litchi-1.jpeg",  "litchi-1",  (0, 40, 750),      True),
    ("chikoo-1.jpeg",  "chikoo-1",  None,              False),
    ("chikoo-2.jpeg",  "chikoo-2",  None,              True),   # sirf 350px aayi hai
    ("kinnow-1.jpeg",  "kinnow-1",  None,              False),
    ("kinnow-2.jpeg",  "kinnow-2",  (0, 60, 806),      True),
    ("mosambi-1.jpeg", "mosambi-1", (0, 150, 774),     True),
    ("mosambi-2.jpeg", "mosambi-2", (0, 260, 415),     False),
    ("lemon-1.jpeg",   "lemon-1",   None,              True),
    ("lemon-2.jpeg",   "lemon-2",   (0, 125, 375),     False),
]


def square(im, crop):
    if crop:
        x, y, s = crop
        s = min(s, im.width - x, im.height - y)
        return im.crop((x, y, x + s, y + s))
    s = min(im.size)
    x, y = (im.width - s) // 2, (im.height - s) // 2
    return im.crop((x, y, x + s, y + s))


def grade(im):
    # Sab photos ek "feed" jaisi dikhein — halka sa, natural (filter nahi lagta)
    im = ImageEnhance.Contrast(im).enhance(1.05)
    im = ImageEnhance.Color(im).enhance(1.06)
    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v * 1.015)))  # thodi garmahat — dhoop jaisi
    return Image.merge("RGB", (r, g, b))


def save(im, size, path, quality):
    out = im.resize((size, size), Image.LANCZOS) if im.width != size else im
    if im.width < size:  # chhoti photo badi ki → thoda sharp
        out = out.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
    out.save(path, "WEBP", quality=quality, method=6)
    return os.path.getsize(path) // 1024


def main():
    os.makedirs(OUT_PLANTS, exist_ok=True)
    os.makedirs(OUT_HERO, exist_ok=True)
    for src, name, crop, hero in PHOTOS:
        im = grade(square(Image.open(os.path.join(SRC, src)).convert("RGB"), crop))
        # Chhoti photo ko 1080 tak nahi khinchte — max 2x
        card = min(CARD, im.width * 2)
        kb = save(im, card, os.path.join(OUT_PLANTS, f"{name}.webp"), 80)
        line = f"{name:<11} {im.width}px → card {card}px ({kb}KB)"
        if hero:
            kb = save(im, HERO, os.path.join(OUT_HERO, f"{name}.webp"), 76)
            line += f" · hero {HERO}px ({kb}KB)"
        print(line)


if __name__ == "__main__":
    main()
