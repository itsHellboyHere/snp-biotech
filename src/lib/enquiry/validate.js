// =========================================================
// Puchhtachh (enquiry) form ki jaanch — browser aur server DONO yahi use karte hain
// (browser pe turant galti dikhe, server pe dobara jaanch — koi bhi seedha API ko kuch bhi na bhej sake)
// =========================================================

import { getPlant, getVariety, cleanNote, MAX_QTY } from "@/components/plants/plantsModel";

export const ENQUIRY_TYPES = ["visit", "order", "bulk", "delivery", "other"];
export const LIMITS = { name: 60, place: 80, message: 600, items: 60 };

// Control characters / zero-width hata ke, ek line ka saaf text
function cleanLine(s, max) {
  return String(s ?? "")
    .normalize("NFC")
    .replace(/[\u0000-\u001f\u007f\u200b-\u200f\u2028\u2029]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

// "+91 98765-43210" / "098765 43210" / "9876543210" → "9876543210" · galat → null
export function normalizePhone(raw) {
  let d = String(raw ?? "").replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

// "2026-11-05" → wahi (aaj se 1 saal tak) · khaali → null · galat → false
function cleanDate(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T12:00:00+05:30`);
  if (Number.isNaN(d.getTime())) return false;
  const day = 86400000;
  const diff = d.getTime() - Date.now();
  return diff > -2 * day && diff < 366 * day ? s : false;
}

// Suchi ke items — sirf data mein maujood paudhe/kismein, ginti 1–9999
function cleanItems(raw) {
  const out = [];
  const seen = new Set();
  for (const x of Array.isArray(raw) ? raw.slice(0, LIMITS.items) : []) {
    const p = getPlant(x?.id);
    if (!p) continue;
    const variety = getVariety(p, x.variety) ? x.variety : null;
    const qty = Math.min(MAX_QTY, Math.max(0, Math.floor(Number(x.qty) || 0)));
    const k = `${p.id}|${variety ?? ""}`;
    if (!qty || seen.has(k)) continue;
    seen.add(k);
    out.push({ id: p.id, variety, qty });
  }
  return out;
}

/* → { ok: true, data } ya { ok: false, errors: { field: "code" } }
   codes: required · long · invalid  (UI inhe apni bhasha mein dikhata hai) */
export function validateEnquiry(input = {}) {
  const errors = {};
  const name = cleanLine(input.name, LIMITS.name + 1);
  if (!name) errors.name = "required";
  else if (name.length > LIMITS.name) errors.name = "long";

  const phone = normalizePhone(input.phone);
  if (!String(input.phone ?? "").trim()) errors.phone = "required";
  else if (!phone) errors.phone = "invalid";

  const type = ENQUIRY_TYPES.includes(input.type) ? input.type : "other";
  const place = cleanLine(input.place, LIMITS.place);

  const date = type === "visit" ? cleanDate(input.date) : null;
  if (date === false) errors.date = "invalid";

  const message = cleanNote(input.message).trim();
  if (String(input.message ?? "").length > LIMITS.message) errors.message = "long";

  const items = input.withList ? cleanItems(input.items) : [];
  const lang = input.lang === "en" ? "en" : "hi";

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { name, phone, type, place, date, message, items, lang } };
}
