"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLang } from "@/i18n/LangProvider";
import { LOADER, VARIANT_TIMING, LOADER_TEXT } from "./loaderConfig";
import SeedLoader from "./SeedLoader/SeedLoader";
import RingsLoader from "./RingsLoader/RingsLoader";
import CurtainLoader from "./CurtainLoader/CurtainLoader";
import styles from "./Loader.module.css";

/* =========================================================
   Site khulne wala loader — engine (teeno variants ka saajha)

   - Server ke HTML mein hi aata hai → JS aane se pehle hi screen pe (gaon ka 2G bhi)
   - Progress ASLI hai: fonts + poora page (photos) load → tab 100%
     (beech mein dheere-dheere badhta rehta hai taaki ruka hua na lage)
   - Kam se kam `min` chale (animation poori dikhe), zyada se zyada MAX_MS
   - Har baar site khulne / refresh pe (ONCE_PER_TAB: true karo to ek tab mein sirf pehli baar).
     Site ke andar link se page badalne pe NAHI — normal websites jaisa
   - Chalte waqt page scroll band
   - Variant sirf dikhawat hai: unhe --p (0→1) CSS variable + phase milta hai
     phase: loading → done (finale) → exit (site dikhna) → gone
   ========================================================= */

const VARIANTS = { seed: SeedLoader, rings: RingsLoader, curtain: CurtainLoader };

// Kaunsa loader — SIRF loaderConfig.js ka ACTIVE decide karta hai (website mein koi UI / URL nahi).
// ONCE_PER_TAB: true ho to is tab mein dekh chuke → "off". Pehli baar ka faisla yaad rakho,
// warna khatam hote waqt sessionStorage badalne se loader beech mein gayab ho jaata.
let BOOT = null;
function readBoot() {
  if (BOOT) return BOOT;
  let choice = LOADER.ACTIVE;
  try {
    if (LOADER.ONCE_PER_TAB && window.sessionStorage.getItem(LOADER.SESSION_KEY)) choice = "off";
  } catch {
    // private mode / storage band — loader chalne do
  }
  BOOT = choice;
  return BOOT;
}
const noSubscribe = () => () => {};

export default function Loader() {
  const { lang } = useLang();
  const choice = useSyncExternalStore(noSubscribe, readBoot, () => LOADER.ACTIVE);

  const rootRef = useRef(null);
  const counterRef = useRef(null);
  const [phase, setPhase] = useState("loading");

  const Comp = VARIANTS[choice];
  const timing = VARIANT_TIMING[choice];
  const active = Boolean(Comp) && phase !== "gone";

  useEffect(() => {
    if (!Comp) return;
    const root = rootRef.current;
    const lenis = window.__lenis;
    lenis?.stop();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isHome = /^\/(en\/?)?$/.test(window.location.pathname);
    let min = timing.min * (isHome ? 1 : LOADER.INNER_FACTOR);
    const max = LOADER.MAX_MS;
    if (reduce) min = Math.min(min, LOADER.REDUCED_MS);

    let fontsDone = !document.fonts;
    let loadDone = document.readyState === "complete";
    document.fonts?.ready.then(() => {
      fontsDone = true;
    });
    const onLoad = () => {
      loadDone = true;
    };
    if (!loadDone) window.addEventListener("load", onLoad, { once: true });
    const { fromYear, toYear } = LOADER_TEXT;
    const writeCounter = (p) => {
      const el = counterRef.current;
      if (!el) return;
      const txt =
        timing.counter === "year"
          ? String(Math.round(fromYear + (toYear - fromYear) * p))
          : String(Math.round(p * 100));
      if (el.textContent !== txt) el.textContent = txt;
    };

    const start = performance.now();
    let shown = 0;
    let raf = 0;
    const timers = [];

    const finish = () => {
      setPhase("done");
      timers.push(
        setTimeout(() => setPhase("exit"), reduce ? 150 : timing.hold),
        setTimeout(
          () => {
            setPhase("gone");
            if (LOADER.ONCE_PER_TAB) {
              try {
                window.sessionStorage.setItem(LOADER.SESSION_KEY, "1");
              } catch {
                // storage band — koi baat nahi
              }
            }
            window.__lenis?.start();
          },
          (reduce ? 150 : timing.hold) + (reduce ? 300 : timing.exit)
        )
      );
    };

    const tick = (now) => {
      const t = now - start;
      const real = (fontsDone ? 0.35 : 0) + (loadDone ? 0.65 : 0);
      // Asli kaam ruka ho tab bhi dheere badhe (0.9 tak) — "atka hua" na lage
      const creep = 0.88 * (1 - Math.exp(-t / 900));
      let target = Math.max(real, creep);
      if (real < 1) target = Math.min(target, 0.92);
      if (t >= max) target = 1;
      const goal = Math.min(target, t / min); // kam se kam `min` tak chale
      shown += (goal - shown) * 0.2;
      if (goal >= 1 && shown > 0.996) shown = 1;
      root.style.setProperty("--p", shown.toFixed(4));
      writeCounter(shown);
      if (shown >= 1) finish();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener("load", onLoad);
      window.__lenis?.start();
    };
    // Sirf faisla badalne pe dobara (hydration ke baad ONCE_PER_TAB wala "off" aa sakta hai)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choice]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-phase={phase}
      data-loader-root=""
      role="status"
      aria-live="polite"
      aria-label={lang === "en" ? "SNP Biotech is loading" : "SNP Biotech खुल रहा है"}
      style={{ "--p": 0 }}
    >
      <Comp phase={phase} lang={lang} counterRef={counterRef} />
    </div>
  );
}
