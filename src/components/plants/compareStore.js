"use client";

import { useSyncExternalStore } from "react";
import { getPlant } from "./plantsModel";

// Tulna (compare) ke liye chune hue paudhe — max 3, sirf is visit tak (sessionStorage)
export const MAX_COMPARE = 3;
const KEY = "snp:compare:v1";
const EMPTY = Object.freeze([]);

let ids = EMPTY;
let loaded = false;
const listeners = new Set();

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = JSON.parse(window.sessionStorage.getItem(KEY) || "[]");
    ids = Object.freeze([...new Set(Array.isArray(raw) ? raw : [])].filter((id) => getPlant(id)).slice(0, MAX_COMPARE));
  } catch {
    ids = EMPTY;
  }
}

function commit(next) {
  ids = Object.freeze(next);
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* koi baat nahi */
  }
  listeners.forEach((l) => l());
}

const subscribe = (fn) => {
  ensureLoaded();
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const getSnapshot = () => {
  ensureLoaded();
  return ids;
};
const getServerSnapshot = () => EMPTY;

// Returns false jab 3 pehle se chune hon
export function toggleCompare(id) {
  ensureLoaded();
  if (ids.includes(id)) {
    commit(ids.filter((x) => x !== id));
    return true;
  }
  if (ids.length >= MAX_COMPARE || !getPlant(id)) return false;
  commit([...ids, id]);
  return true;
}

export function clearCompare() {
  commit([]);
}

export function useCompare() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
