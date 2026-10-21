"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ScrollHighlight.module.css";

/* =========================================================
   Apple "Performance" jaisa paragraph — scroll ke saath ek-ek shabd roshan
   text mein [[...]] wala hissa roshan hone pe gradient rang leta hai
   Reusable: <ScrollHighlight eyebrow="..." text="..." className="..." tone="light" />
   tone="light" → ivory background pe [[...]] ka gradient gehra (lime safed pe padha nahi jaata)
   ========================================================= */

const SPREAD = 4; // ek saath kitne shabd "jal rahe" hon (naram kinara)
const DIM = 0.16; // bujhe shabd ki roshni

// "abc [[def ghi]] jkl" → [{ w: "abc" }, { w: "def", hl: true }, ...]
function toWords(text) {
  return text
    .split(/(\[\[.*?\]\])/)
    .filter(Boolean)
    .flatMap((part) => {
      const hl = part.startsWith("[[");
      const clean = hl ? part.slice(2, -2) : part;
      return clean
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => ({ w, hl }));
    });
}

export default function ScrollHighlight({ eyebrow, text, id, className = "", tone = "dark" }) {
  const words = useMemo(() => toWords(text), [text]);
  const paraRef = useRef(null);
  const wordRefs = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const els = wordRefs.current.slice(0, words.length);
    const last = new Array(els.length).fill(-1);

    const paint = (p) => {
      const n = els.length;
      const head = p * (n + SPREAD);
      for (let i = 0; i < n; i++) {
        const lit = Math.round(Math.min(1, Math.max(0, (head - i) / SPREAD)) * 100) / 100;
        if (lit === last[i]) continue;
        last[i] = lit;
        const el = els[i];
        if (!el) continue;
        el.style.opacity = (DIM + (1 - DIM) * lit).toFixed(2);
        el.dataset.lit = lit > 0.6 ? "true" : "false";
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      paint(1);
      return;
    }

    const st = ScrollTrigger.create({
      trigger: paraRef.current,
      start: "top 82%",
      end: "bottom 42%",
      onUpdate: (self) => paint(self.progress),
      onRefresh: (self) => paint(self.progress),
    });
    paint(st.progress);
    return () => st.kill();
  }, [words]);

  return (
    <div className={`${styles.wrap} ${className}`} data-tone={tone}>
      {eyebrow ? <p className={`eyebrow ${styles.eyebrow}`}>{eyebrow}</p> : null}
      <p ref={paraRef} id={id} className={styles.para}>
        {words.map((item, i) => (
          <span key={i}>
            <span
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
              className={`${styles.word} ${item.hl ? styles.hl : ""}`}
              data-lit="false"
            >
              {item.w}
            </span>{" "}
          </span>
        ))}
      </p>
    </div>
  );
}
