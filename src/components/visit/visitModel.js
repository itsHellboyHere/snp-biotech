// =========================================================
// "नर्सरी आइए" ke helpers — samay (India time), khuli/band, dooriyan, map links
// Server aur browser dono pe chalta hai. Galat data (jaise "25:99") page nahi todta — chhod diya jaata hai.
// =========================================================

import { site } from "@/lib/site";
import { isLive } from "@/lib/live";
import { HOURS } from "./visitData";

const IST = "Asia/Kolkata";

// Placeholder data sirf dev mein — live site pe tabhi dikhe jab client ne confirm kiya ho
// (niyam ab lib/live.js mein — Visit + Our Story dono wahi use karte hain)
export { isLive };

// "08:30" → 510 (minutes) · galat ho to null
export function parseHM(s) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(s ?? "").trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 24 || min > 59 || (h === 24 && min > 0)) return null;
  return h * 60 + min;
}

// Saare slot saaf karke: { 0: [{open, close}], 1: [...], … }
function buildWeek() {
  const week = Object.fromEntries(Array.from({ length: 7 }, (_, d) => [d, []]));
  for (const row of Array.isArray(HOURS.week) ? HOURS.week : []) {
    const open = parseHM(row?.open);
    const close = parseHM(row?.close);
    if (open == null || close == null || close <= open) {
      if (process.env.NODE_ENV !== "production") console.warn("[visitData] HOURS ka galat slot chhoda:", row);
      continue;
    }
    for (const d of Array.isArray(row.days) ? row.days : []) {
      if (Number.isInteger(d) && d >= 0 && d < 7) week[d].push({ open, close });
    }
  }
  for (const d of Object.keys(week)) week[d].sort((a, b) => a.open - b.open);
  return week;
}
export const WEEK = buildWeek();

// India ka abhi ka din + minute (visitor duniya mein kahin bhi ho)
export function nowIST(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: IST,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t)?.value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

/* Abhi khuli hai?
   → { state: "open" | "closing" | "closed", closeAt, next: { inDays, at } } */
export function openStatus(date = new Date()) {
  const { day, minutes } = nowIST(date);
  const today = WEEK[day] ?? [];
  const slot = today.find((s) => minutes >= s.open && minutes < s.close);
  if (slot) return { state: slot.close - minutes <= 60 ? "closing" : "open", closeAt: slot.close };
  for (let i = 0; i < 8; i++) {
    const d = (day + i) % 7;
    const s = (WEEK[d] ?? []).find((x) => i > 0 || x.open > minutes);
    if (s) return { state: "closed", next: { inDays: i, day: d, at: s.open } };
  }
  return null; // hafte mein koi samay hi nahi
}

// 480 → "सुबह 8 बजे" / "8 am" · 810 → "दोपहर 1:30 बजे" / "1:30 pm"
export function fmtTime(min, lang) {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  const h12 = h % 12 || 12;
  const mm = m ? `:${String(m).padStart(2, "0")}` : "";
  if (lang === "en") return `${h12}${mm} ${h < 12 ? "am" : "pm"}`;
  const part = h < 12 ? "सुबह" : h < 16 ? "दोपहर" : h < 19 ? "शाम" : "रात";
  return `${part} ${h12}${mm} बजे`;
}

export const DAY_NAMES = {
  hi: ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

/* ---------- Jagah ----------
   Asli pin (site.geo, confirmed: true) mile to wahi — sabse sateek.
   Tab tak Google Maps mein pata (site.mapsQuery) khojte hain — kabhi galat (namoona) jagah nahi. */
const GEO = site.geo;
export const hasGeo = Boolean(GEO?.confirmed && Number.isFinite(GEO.lat) && Number.isFinite(GEO.lng));
const query = () => encodeURIComponent(site.mapsQuery || "");

// Phone pe seedha Google Maps app ka navigation
export function directionsUrl() {
  if (hasGeo) return `https://www.google.com/maps/dir/?api=1&destination=${GEO.lat},${GEO.lng}`;
  if (site.mapsUrl) return site.mapsUrl;
  if (site.mapsQuery) return `https://www.google.com/maps/dir/?api=1&destination=${query()}`;
  return null;
}

// Tap karne pe hi load hone wala map (API key nahi chahiye)
export function embedUrl(lang) {
  const hl = lang === "en" ? "en" : "hi";
  if (hasGeo) return `https://maps.google.com/maps?q=${GEO.lat},${GEO.lng}&z=15&hl=${hl}&output=embed`;
  if (site.mapsQuery) return `https://maps.google.com/maps?q=${query()}&z=14&hl=${hl}&output=embed`;
  return null;
}

// Do jagah ke beech seedhi doori (km) — Haversine
export function distanceKm(from) {
  if (!hasGeo) return null;
  const R = 6371;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(GEO.lat - from.lat);
  const dLng = rad(GEO.lng - from.lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(from.lat)) * Math.cos(rad(GEO.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
