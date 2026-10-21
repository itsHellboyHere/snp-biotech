"use client";

import { useSyncExternalStore } from "react";
import { getPlant, getVariety, cleanNote, MAX_QTY } from "./plantsModel";

// =========================================================
// "मेरी सूची" — chhota sa store (React ke bahar), browser mein yaad rehta hai
//
// Surakshit kyun:
// - localStorage se jo bhi aaye, use aankh band karke nahi maante — har item jaancha jaata hai:
//   paudha data mein hai? kism sahi hai? ginti 1–9999? Nahi to chupchaap hata do.
//   (Kal koi paudha data se hata do → purani list tootegi nahi.)
// - Private mode / storage band → try/catch, list bas is tab tak rahegi.
// - Doosre tab mein list badli → yahan bhi update ("storage" event).
// =========================================================

const KEY = "snp:order:v1";
const MAX_ITEMS = 60;
const EMPTY = Object.freeze({ items: Object.freeze([]), note: "" });

let state = EMPTY;
let loaded = false;
const listeners = new Set();

export const clampQty = (n) => Math.min(MAX_QTY, Math.max(0, Math.floor(Number(n) || 0)));
const keyOf = (id, variety) => `${id}|${variety ?? ""}`;

function sanitize(raw) {
  const items = [];
  const keys = new Set();
  for (const x of Array.isArray(raw?.items) ? raw.items : []) {
    const p = getPlant(x?.id);
    if (!p) continue;
    const variety = getVariety(p, x.variety) ? x.variety : null;
    const qty = clampQty(x.qty);
    const k = keyOf(p.id, variety);
    if (!qty || keys.has(k)) continue;
    keys.add(k);
    items.push(Object.freeze({ id: p.id, variety, qty }));
    if (items.length >= MAX_ITEMS) break;
  }
  return Object.freeze({ items: Object.freeze(items), note: cleanNote(raw?.note) });
}

function read() {
  try {
    return sanitize(JSON.parse(window.localStorage.getItem(KEY) || "null"));
  } catch {
    return EMPTY;
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  state = read();
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY) return;
    state = read();
    listeners.forEach((l) => l());
  });
}

function commit(next) {
  state = sanitize(next);
  try {
    if (state.items.length || state.note) window.localStorage.setItem(KEY, JSON.stringify(state));
    else window.localStorage.removeItem(KEY);
  } catch {
    /* storage band hai — koi baat nahi */
  }
  listeners.forEach((l) => l());
}

function subscribe(fn) {
  ensureLoaded();
  listeners.add(fn);
  return () => listeners.delete(fn);
}
const getSnapshot = () => {
  ensureLoaded();
  return state;
};
const getServerSnapshot = () => EMPTY;

/* ---------- Actions ---------- */
// qty 0 = hata do · naya item list ke aakhir mein
export function setQty(id, variety, qty) {
  ensureLoaded();
  const q = clampQty(qty);
  const k = keyOf(id, variety);
  const exists = state.items.some((it) => keyOf(it.id, it.variety) === k);
  const items = exists
    ? state.items.map((it) => (keyOf(it.id, it.variety) === k ? { ...it, qty: q } : it))
    : [...state.items, { id, variety: variety ?? null, qty: q }];
  commit({ ...state, items });
}

// Ek line ki kism badlo — list mein jagah wahi rahe
export function changeVariety(id, from, to) {
  ensureLoaded();
  const items = state.items.map((it) =>
    it.id === id && (it.variety ?? null) === (from ?? null) ? { ...it, variety: to ?? null } : it
  );
  commit({ ...state, items });
}

export function removeItem(id, variety) {
  setQty(id, variety, 0);
}

export function setNote(note) {
  ensureLoaded();
  commit({ ...state, note });
}

export function clearOrder() {
  ensureLoaded();
  commit(EMPTY);
}

/* ---------- Hooks ---------- */
export function useOrder() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function totalOf(items) {
  return items.reduce((s, it) => s + it.qty, 0);
}

export function qtyOf(items, id, variety) {
  const k = keyOf(id, variety);
  return items.find((it) => keyOf(it.id, it.variety) === k)?.qty ?? 0;
}
