"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { getPlant, resolveCategory } from "./plantsModel";

/* ---------- Aaj ka mahina (sirf browser mein; server pe -1) ---------- */
const noop = () => () => {};
export function useMonth() {
  return useSyncExternalStore(
    noop,
    () => new Date().getMonth(),
    () => -1
  );
}

/* ---------- Hydration ke baad true (portal / browser-only cheezein) ---------- */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false
  );
}

/* ---------- Screen chaudi hai? (sheet: neeche se ya side se) ---------- */
export function useMedia(query) {
  return useSyncExternalStore(
    useCallback(
      (cb) => {
        const mq = window.matchMedia(query);
        mq.addEventListener("change", cb);
        return () => mq.removeEventListener("change", cb);
      },
      [query]
    ),
    () => window.matchMedia(query).matches,
    () => false
  );
}

/* ---------- URL = state:  /plants?cat=citrus&plant=mango ----------
   - Link share karo → wahi filter / wahi paudha khulega
   - Home ke cards seedha sahi jagah laate hain
   - Phone ka "Back" button khula panel band karta hai (plant khulte waqt pushState) */
export function usePlantsUrl() {
  const sp = useSearchParams();
  const rawCat = sp.get("cat");
  // "?cat=mango" jaise purane link: category nahi, paudha hai → us paudhe ko kholo
  const catAsPlant = resolveCategory(rawCat) === "all" ? getPlant(rawCat) : null;
  const cat = resolveCategory(rawCat);
  const plantId = getPlant(sp.get("plant"))?.id ?? catAsPlant?.id ?? null;

  const update = useCallback((changes, { push = false } = {}) => {
    const next = new URLSearchParams(window.location.search);
    for (const [k, v] of Object.entries(changes)) {
      if (v == null || v === "" || v === "all") next.delete(k);
      else next.set(k, v);
    }
    const qs = next.toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
    window.history[push ? "pushState" : "replaceState"](null, "", url);
  }, []);

  // legacy = paudha "?cat=" mein aaya tha → band karte waqt woh bhi hatana hai
  return { cat, plantId, legacy: Boolean(catAsPlant), update };
}
