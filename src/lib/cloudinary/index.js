// =========================================================
// Cloudinary helpers — local path ("/plants/mango-dasheri.webp") → Cloudinary URL
//
// manifest.json `npm run media:upload` khud likhta hai (kya upload hua, kis version pe).
// Jo file manifest mein NAHI hai → wahi purana local path (public/) — site kabhi nahi tootti,
// chahe upload abhi hua ho ya nahi.
//
// Har URL mein:
//   f_auto → har browser ko uska sabse halka format (AVIF / WebP / AV1 / H.265…)
//   q_auto → aankh ko farak na dikhe utni hi quality
//   v123   → version — photo badlo to naya URL, purana cache apne aap hat jaata hai
// =========================================================

import manifest from "./manifest.json";

const BASE = manifest.cloud ? `https://res.cloudinary.com/${manifest.cloud}` : null;

function entry(src) {
  if (!BASE || typeof src !== "string") return null;
  return manifest.assets[src.split("?")[0]] ?? null;
}

// Ye file Cloudinary pe hai?
export function isCld(src) {
  return Boolean(entry(src));
}

// Photo ka URL — width di to utni chaudi (c_limit: kabhi asli se badi nahi)
export function cldImageUrl(src, { width, quality } = {}) {
  const e = entry(src);
  if (!e) return src;
  const t = ["f_auto", quality ? `q_${quality}` : "q_auto", width ? `w_${Math.round(width)}` : null, width ? "c_limit" : null]
    .filter(Boolean)
    .join(",");
  return `${BASE}/image/upload/${t}/v${e.v}/${e.id}`;
}

// Video ka URL — har phone ko sahi codec (iPhone H.265/H.264, Chrome AV1/VP9)
export function cldVideoUrl(src) {
  const e = entry(src);
  if (!e) return src;
  return `${BASE}/video/upload/f_auto:video,q_auto/v${e.v}/${e.id}`;
}

// next/image ka loader — SmartImage isse use karta hai
export function cldLoader({ src, width, quality }) {
  return cldImageUrl(src, { width, quality });
}
