"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/i18n/LangProvider";
import { scriptLang } from "@/i18n/config";
import { TRUST } from "@/components/trust/trustData";
import { ST } from "../storyText";
import styles from "./StoryNumbers.module.css";

/* दस साल का हिसाब (dark patti) — numbers dikhte hi 0 se gin-te hue badhte hain
   Data ek hi jagah: components/trust/trustData.js (home ke "छल्ले" wale hi asli numbers)
   Server pe poora number likha jaata hai → Google / bina JS sahi number padhe */

const nf = new Intl.NumberFormat("en-IN");
const easeOut = (x) => 1 - Math.pow(1 - x, 3);

// "10+" → { value: 10, suffix: "+" }
function parseBig(big = "") {
  const m = /^(\d+)(.*)$/.exec(String(big));
  return m ? { value: Number(m[1]), suffix: m[2] } : null;
}

// "10+ साल" pehle, phir trustData ke teen asli numbers
const YEARS = parseBig(TRUST.center.big);
const STATS = [
  ...(YEARS ? [{ value: YEARS.value, suffix: YEARS.suffix, label: ST.numbers.years }] : []),
  ...TRUST.stats,
];

export default function StoryNumbers() {
  const { t } = useLang();
  const listRef = useRef(null);
  const numRefs = useRef([]);

  useEffect(() => {
    const els = numRefs.current.slice(0, STATS.length);
    const show = (k) =>
      STATS.forEach((s, i) => {
        if (els[i]) els[i].textContent = nf.format(Math.round(s.value * k));
      });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    show(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now) => {
          const k = easeOut(Math.min(1, (now - t0) / 1600));
          show(k);
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );
    io.observe(listRef.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      show(1);
    };
  }, []);

  return (
    <section className={styles.section} aria-labelledby="numbers-title">
      <div className="container">
        <h2 id="numbers-title" className={`eyebrow ${styles.eyebrow}`}>
          {t(ST.numbers.eyebrow)}
        </h2>
        <ul ref={listRef} className={styles.list}>
          {STATS.map((s, i) => {
            const suffix = t(s.suffix) ?? "";
            return (
              <li key={i} className={styles.stat}>
                <span className={styles.value} lang="en">
                  <span
                    ref={(el) => {
                      numRefs.current[i] = el;
                    }}
                  >
                    {nf.format(s.value)}
                  </span>
                  <span className={styles.suffix} lang={scriptLang(suffix)}>
                    {suffix}
                  </span>
                </span>
                <span className={styles.label}>{t(s.label)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
