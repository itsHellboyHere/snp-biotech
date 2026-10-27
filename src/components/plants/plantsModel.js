// =========================================================
// plantsData.js ka "chowkidaar" + helpers (server aur browser dono pe chalta hai)
//
// 1. Har entry jaanchta hai — galat id, category, naam, photo path wagairah ho to
//    woh entry chhod di jaati hai (page nahi tootta) aur dev mein warning aati hai.
// 2. Kami wali fields ke default bharta hai (step 10, show true, [] …).
// 3. Search, mausam, per-acre ginti, WhatsApp message — sab yahin se.
// =========================================================

import { MONTHS } from "@/components/seasons/seasonData";
import { CATEGORIES as RAW_CATEGORIES, CATEGORY_ALIASES, PLANTS as RAW_PLANTS } from "./plantsData";

const ACRE_M2 = 4047; // 1 एकड़ = 4047 वर्ग मीटर
export const MAX_QTY = 9999;
const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PATH_RE = /^\/[\w\-./]+$/; // sirf apni site ki photo — "https://" ya "javascript:" nahi

const warn = (...a) => {
  if (process.env.NODE_ENV !== "production") console.warn("[plantsData]", ...a);
};

const isText = (v) => Boolean(v && typeof v === "object" && typeof v.hi === "string" && v.hi.trim());
const text = (v) => (isText(v) ? Object.freeze({ hi: v.hi.trim(), en: (v.en || v.hi).trim() }) : null);
const path = (v) => (typeof v === "string" && PATH_RE.test(v) ? v : null);
const months = (v) =>
  Array.isArray(v) ? [...new Set(v.filter((m) => Number.isInteger(m) && m >= 0 && m < 12))].sort((a, b) => a - b) : [];

// Search ke liye text ko ek jaisa banao: chhote akshar, nukta (ज़ → ज) aur maatra-chinh saaf
export function normalize(s = "") {
  return String(s)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-़ͯ]/g, "") // accents + nukta
    .replace(/ँ/g, "ं") // ँ → ं
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, " ")
    .trim();
}

function cleanVariety(v, plantId, seen) {
  if (!v || !ID_RE.test(v.id ?? "") || seen.has(v.id) || !isText(v.name)) {
    warn(`"${plantId}" ki ek kism galat hai (id / name dekho):`, v);
    return null;
  }
  seen.add(v.id);
  return Object.freeze({ id: v.id, name: text(v.name), note: text(v.note), img: path(v.img) });
}

function cleanPlant(raw, index, catIds, seenIds) {
  const id = raw?.id;
  const fail = (why) => {
    warn(`Entry #${index + 1} (${id ?? "bina id"}) chhod di — ${why}`);
    return null;
  };
  if (!raw || typeof raw !== "object") return fail("object nahi hai");
  if (!ID_RE.test(id ?? "")) return fail('id sirf a-z, 0-9 aur "-" ho');
  if (seenIds.has(id)) return fail("yeh id pehle se hai");
  if (!catIds.has(raw.category)) return fail(`category "${raw.category}" CATEGORIES mein nahi hai`);
  if (!isText(raw.name)) return fail("name.hi zaroori hai");
  const shot = path(raw.shot);
  const tree = path(raw.tree);
  if (!shot && !tree) return fail("shot ya tree — kam se kam ek photo chahiye");
  if (raw.show === false) return null; // jaan-boojh ke chhupaya
  seenIds.add(id);

  const vSeen = new Set();
  const varieties = (Array.isArray(raw.varieties) ? raw.varieties : [])
    .map((v) => cleanVariety(v, id, vSeen))
    .filter(Boolean);

  const sp = Array.isArray(raw.spacing) && raw.spacing.length === 2 && raw.spacing.every((n) => n > 0 && n < 100)
    ? raw.spacing
    : null;
  const perAcre = sp ? Math.max(1, Math.round(ACRE_M2 / (sp[0] * sp[1]) / 5) * 5) : null;
  const name = text(raw.name);
  const aka = Array.isArray(raw.aka) ? raw.aka.filter((a) => typeof a === "string") : [];

  return Object.freeze({
    id,
    order: index,
    category: raw.category,
    name,
    aka,
    line: text(raw.line),
    shot: shot ?? tree,
    tree: tree ?? shot,
    realPhotos: Object.freeze((Array.isArray(raw.realPhotos) ? raw.realPhotos : []).map(path).filter(Boolean)),
    // true = shot / tree client ki ASLI nursery photos hain (detail ke tab ke naam badalte hain)
    real: raw.real === true,
    grafted: raw.grafted !== false,
    months: Object.freeze(months(raw.months)),
    harvest: Object.freeze(months(raw.harvest)),
    spacing: sp ? Object.freeze([...sp]) : null,
    perAcre,
    step: Number.isInteger(raw.step) && raw.step > 0 && raw.step <= 1000 ? raw.step : 1,
    varieties: Object.freeze(varieties),
    // search ka "bhusa" — hi + en naam, aka, kismein ek saath
    haystack: normalize(
      [name.hi, name.en, ...aka, ...varieties.flatMap((v) => [v.name.hi, v.name.en])].join(" ")
    ),
  });
}

function build() {
  const catIds = new Set(RAW_CATEGORIES.map((c) => c.id));
  const seen = new Set();
  const plants = RAW_PLANTS.map((p, i) => cleanPlant(p, i, catIds, seen)).filter(Boolean);
  const used = new Set(plants.map((p) => p.category));
  const categories = RAW_CATEGORIES.filter((c) => used.has(c.id)).map((c) =>
    Object.freeze({ ...c, count: plants.filter((p) => p.category === c.id).length })
  );
  return { plants: Object.freeze(plants), categories: Object.freeze(categories) };
}

const DATA = build();
export const PLANTS = DATA.plants;
export const CATEGORIES = DATA.categories;
const BY_ID = new Map(PLANTS.map((p) => [p.id, p]));

export function getPlant(id) {
  return typeof id === "string" ? BY_ID.get(id) ?? null : null;
}
export function getVariety(plant, varietyId) {
  return plant?.varieties.find((v) => v.id === varietyId) ?? null;
}
export function resolveCategory(id) {
  if (!id) return "all";
  const c = CATEGORY_ALIASES[id] ?? id;
  return CATEGORIES.some((x) => x.id === c) ? c : "all";
}

// "dasheri", "आम", "amrud" — har shabd haystack mein milna chahiye
export function filterPlants(list, { category = "all", query = "" } = {}) {
  const words = normalize(query).split(" ").filter(Boolean);
  return list.filter(
    (p) => (category === "all" || p.category === category) && words.every((w) => p.haystack.includes(w))
  );
}

/* ---------- Mahine ---------- */
// [1,2,6,7,8] → "फ़रवरी–मार्च, जुलाई–सितंबर" · [11,0,1] → "दिसंबर–फ़रवरी"
export function monthsText(list, lang, { short = false } = {}) {
  if (!list?.length) return null;
  const names = (short ? MONTHS.short : MONTHS.full)[lang] ?? MONTHS.full.hi;
  if (list.length === 12) return lang === "en" ? "All year" : "साल भर";
  const set = new Set(list);
  // shuruaat wahan se jahan pichhla mahina khaali ho (dec→jan jaise ghere sambhale)
  const starts = list.filter((m) => !set.has((m + 11) % 12));
  const runs = starts.map((s) => {
    let e = s;
    while (set.has((e + 1) % 12)) e = (e + 1) % 12;
    return s === e ? names[s] : `${names[s]}–${names[e]}`;
  });
  return runs.join(", ");
}

// Is mahine se agla sahi mahina kitni door hai (0 = abhi)
export function seasonInfo(plant, month) {
  if (month < 0 || !plant.months.length) return null;
  if (plant.months.includes(month)) return { now: true, inMonths: 0, month };
  const dist = plant.months.map((m) => [((m - month + 12) % 12), m]).sort((a, b) => a[0] - b[0])[0];
  return { now: false, inMonths: dist[0], month: dist[1] };
}

export function monthName(m, lang) {
  return (MONTHS.full[lang] ?? MONTHS.full.hi)[m];
}

/* ---------- Order list → WhatsApp message ---------- */
// User ka note: control characters hatao, 300 akshar tak
export function cleanNote(s) {
  return String(s ?? "")
    .replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, " ")
    .slice(0, 300);
}

export function orderLines(items, lang) {
  return items
    .map((it) => {
      const p = getPlant(it.id);
      if (!p) return null;
      const v = getVariety(p, it.variety);
      const name = p.name[lang] ?? p.name.hi;
      return `• ${name}${v ? ` (${v.name[lang] ?? v.name.hi})` : ""} – ${it.qty}`;
    })
    .filter(Boolean);
}

export function buildOrderMessage(items, note, lang, words) {
  const lines = orderLines(items, lang);
  const total = items.reduce((s, it) => s + it.qty, 0);
  const n = cleanNote(note).trim();
  return [
    words.hello,
    ...lines,
    "",
    `${words.total}: ${total} ${words.plants}`,
    n ? `${words.note}: ${n}` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");
}
