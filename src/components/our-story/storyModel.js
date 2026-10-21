// =========================================================
// "हमारी कहानी" data ki jaanch — galat / adhoora data page nahi todta, chupchaap chhoot jaata hai
// (dev mein console pe batata hai kya chhoota, taaki theek kar sako)
// =========================================================

import { isLive } from "@/lib/live";
import { site } from "@/lib/site";
import { FOUNDER, GALLERY, HERO_PHOTO, MILESTONES, PROMISES, VOICES } from "./storyData";

const dev = process.env.NODE_ENV !== "production";
const warn = (...a) => dev && console.warn("[storyData]", ...a);

const hasText = (v) => typeof v === "string" ? v.trim().length > 0 : Boolean(v?.hi?.trim?.());
const validYear = (y) => Number.isInteger(y) && y >= 1950 && y <= 2100;

function cleanPhoto(p) {
  if (!p || typeof p.src !== "string" || !p.src) return null;
  const w = Number(p.w) > 0 ? Number(p.w) : 1200;
  const h = Number(p.h) > 0 ? Number(p.h) : 800;
  return { ...p, w, h, alt: p.alt ?? "" };
}

// Shuruaat ka saal — site.established hi asli source (footer, rings, hero sab ek jaisa)
export const FOUNDED_YEAR = validYear(site.established) ? site.established : 2016;

export const heroPhoto = () => (isLive(HERO_PHOTO) ? cleanPhoto(HERO_PHOTO) : null);

// Saal ke kram mein, bina title wale / galat saal wale chhod ke
export function milestones() {
  if (!isLive(MILESTONES)) return [];
  const out = [];
  for (const m of Array.isArray(MILESTONES.items) ? MILESTONES.items : []) {
    if (!validYear(m?.year) || !hasText(m?.title)) {
      warn("milestone chhoda (saal ya title galat):", m);
      continue;
    }
    out.push({ ...m, photo: cleanPhoto(m.photo) });
  }
  return out.sort((a, b) => a.year - b.year);
}

export function founder() {
  if (!isLive(FOUNDER) || !hasText(FOUNDER.quote)) return null;
  return { ...FOUNDER, photo: cleanPhoto(FOUNDER.photo) };
}

export function promises() {
  if (!isLive(PROMISES)) return [];
  return (PROMISES.items ?? []).filter((p) => {
    const ok = hasText(p?.title);
    if (!ok) warn("vaada chhoda (title nahi):", p);
    return ok;
  });
}

export function galleryPhotos() {
  if (!isLive(GALLERY)) return [];
  return (GALLERY.photos ?? []).map(cleanPhoto).filter(Boolean);
}

// Testimonials: har ek ka apna confirmed — live site pe sirf asli wale
export function voices() {
  return (VOICES.items ?? []).filter((v) => {
    if (!hasText(v?.quote) || !hasText(v?.name)) {
      warn("testimonial chhoda (quote / naam nahi):", v);
      return false;
    }
    return isLive(v);
  });
}

// "abc [[def]] ghi" → "abc def ghi" (Google / screen reader ke liye saaf text)
export const plainQuote = (s = "") => s.replace(/\[\[|\]\]/g, "");
