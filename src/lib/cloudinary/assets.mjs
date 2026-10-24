// =========================================================
// Cloudinary pe SIRF ye files jaati hain — "zaroori" list (ek hi jagah)
//
// Kya hai:  bhaari video + permanent photos jo next/image se baar-baar alag size mein maangi jaati hain
// Kya NAHI: scroll frames (hero, growth — Vercel pe hi theek), namoona (AI) photos
//           (client ki asli aate hi unhe yahan jodo), chhote tiles, logo/og image
//
// Nayi file jodni ho: path yahan likho → Terminal mein `npm run media:upload`
// (sirf nayi / badli hui file upload hoti hai, baaki chhod deta hai)
// =========================================================

export const CLOUDINARY_FOLDER = "snp-biotech";

export const CLOUDINARY_ASSETS = [
  // ---------- Bagh video (sabse bhaari) ----------
  "/bagh/bagh-desktop.mp4",
  "/bagh/bagh-mobile.mp4",
  "/bagh/poster-desktop.webp",
  "/bagh/poster-mobile.webp",

  // ---------- Paudhon ki photos (Plants page: card, detail, list, compare) ----------
  "/plants/mango-dasheri.webp",
  "/plants/mango-langra.webp",
  "/plants/mango-chausa.webp",
  "/plants/mango-amrapali.webp",
  "/plants/guava-taiwan.webp",
  "/plants/guava-lalit.webp",
  "/plants/guava-safeda.webp",
  "/plants/litchi.webp",
  "/plants/chikoo.webp",
  "/plants/pear.webp",
  "/plants/amla.webp",
  "/plants/kinnow.webp",
  "/plants/mosambi.webp",
  "/plants/lemon.webp",
  "/plants/teak.webp",
  "/plants/neem.webp",
  "/plants/gulmohar.webp",

  // ---------- Home ----------
  "/categories/mango.webp",
  "/categories/guava.webp",
  "/categories/citrus.webp",
  "/categories/more.webp",
  "/home/rings.webp",
];
