"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/i18n/LangProvider";
import SampleTag from "@/components/visit/SampleTag/SampleTag";
import { MILESTONES } from "../storyData";
import { milestones } from "../storyModel";
import { ST } from "../storyText";
import styles from "./StoryTimeline.module.css";

/* =========================================================
   सफ़र — saal dar saal, aur scroll ke saath ek hara tana "ugta" hai.
   Tana jis saal tak pahunchta hai, wahan do patte phoot-te hain aur card roshan hota hai.

   Desktop (≥900px, kaafi oonchi screen): page ruk jaata hai (sticky) aur saal
     baayein → daayein khiskte hain — Apple jaisa horizontal scroll.
   Phone / chhoti oonchai: upar se neeche list, tana baayein kinare pe neeche badhta hai.
   "Animation kam karo" setting: sab seedha dikh jaata hai, koi scroll-khel nahi.
   CSS ke media query aur yahan ke H_QUERY ek hi hone chahiye.
   ========================================================= */

const H_QUERY = "(min-width: 900px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";
const V_QUERY = "not all and (min-width: 900px) and (min-height: 640px)";

const clamp01 = (v) => Math.min(1, Math.max(0, v));

export default function StoryTimeline() {
  const { t } = useLang();
  const items = milestones();

  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const railRef = useRef(null);
  const fillRef = useRef(null);
  const tipRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    if (!items.length) return;
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const track = trackRef.current;
    const rail = railRef.current;
    const fill = fillRef.current;
    const tip = tipRef.current;
    const nodes = () => itemRefs.current.slice(0, items.length).filter(Boolean);
    let disposed = false;

    // Kaunse saal tak tana pahuncha → un par data-on
    const light = (reach, axis) => {
      for (const el of nodes()) {
        const at = axis === "x" ? el.offsetLeft + 12 : el.offsetTop + 14;
        const on = at <= reach ? "true" : "false";
        if (el.dataset.on !== on) el.dataset.on = on;
      }
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      fill.style.transform = "none";
      for (const el of nodes()) el.dataset.on = "true";
    }

    const mm = gsap.matchMedia();

    // ---------- Desktop: rukta page, saal sideways ----------
    mm.add(H_QUERY, () => {
      let overflow = 0;
      const measure = () => {
        overflow = Math.max(0, track.scrollWidth - window.innerWidth);
        section.style.height = `${window.innerHeight + overflow}px`;
      };
      const apply = (p) => {
        if (disposed) return;
        const x = p * overflow;
        track.style.transform = `translate3d(${-x.toFixed(1)}px,0,0)`;
        // "Kalam" screen pe 30% se 75% tak chalti hai — aakhri saal bhi roshan ho jaata hai
        const pen = x + window.innerWidth * (0.3 + 0.45 * p) - rail.offsetLeft;
        const w = rail.offsetWidth || 1;
        const reach = Math.min(w, Math.max(0, pen));
        fill.style.transform = `scaleX(${(reach / w).toFixed(4)})`;
        tip.style.transform = `translate3d(${reach.toFixed(1)}px,0,0)`;
        tip.style.opacity = reach > 4 && reach < w - 2 ? "1" : "0";
        light(reach, "x");
      };

      measure();
      ScrollTrigger.addEventListener("refreshInit", measure);
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (s) => apply(s.progress),
        onRefresh: (s) => apply(s.progress),
      });
      apply(st.progress);
      // Fonts / photos aane se chaudai badle to dobara naapo
      const ro = new ResizeObserver(() => ScrollTrigger.refresh());
      ro.observe(track);

      return () => {
        ro.disconnect();
        ScrollTrigger.removeEventListener("refreshInit", measure);
        st.kill();
        section.style.height = "";
        track.style.transform = "";
        tip.style.transform = "";
      };
    });

    // ---------- Phone: upar se neeche ----------
    if (!reduce) {
      mm.add(V_QUERY, () => {
        const apply = (p) => {
          if (disposed) return;
          const h = rail.offsetHeight || 1;
          const reach = p * h;
          fill.style.transform = `scaleY(${clamp01(p).toFixed(4)})`;
          tip.style.transform = `translate3d(0,${reach.toFixed(1)}px,0)`;
          tip.style.opacity = p > 0.01 && p < 0.995 ? "1" : "0";
          light(reach, "y");
        };
        const st = ScrollTrigger.create({
          trigger: rail,
          start: "top 72%",
          end: "bottom 60%",
          onUpdate: (s) => apply(s.progress),
          onRefresh: (s) => apply(s.progress),
        });
        apply(st.progress);
        return () => {
          st.kill();
          tip.style.transform = "";
        };
      });
    }

    return () => {
      disposed = true;
      mm.revert();
    };
  }, [items.length]);

  if (!items.length) return null;
  const last = items.length - 1;

  return (
    <section id="journey" ref={sectionRef} className={styles.section} aria-labelledby="journey-title">
      <div className={styles.sticky}>
        <div ref={trackRef} className={styles.track}>
          <header className={styles.head}>
            <p className="eyebrow">{t(ST.timeline.eyebrow)}</p>
            <h2 id="journey-title" className={`h1 ${styles.title}`}>
              {t(ST.timeline.title)}
            </h2>
            <p className={styles.line}>
              {t(ST.timeline.line)} <SampleTag block={MILESTONES} />
            </p>
          </header>

          <div ref={railRef} className={styles.rail}>
            <div className={styles.stem} aria-hidden="true">
              <span ref={fillRef} className={styles.fill} />
              <span ref={tipRef} className={styles.tip}>
                <LeafTip />
              </span>
            </div>

            <ol className={styles.list} aria-label={t(ST.timeline.label)}>
              {items.map((m, i) => (
                <li
                  key={`${m.year}-${i}`}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className={styles.item}
                  data-on="false"
                >
                  <span className={styles.node} aria-hidden="true">
                    <Sprout />
                  </span>
                  <article className={styles.card}>
                    {m.photo ? (
                      <div className={styles.photo}>
                        <Image
                          src={m.photo.src}
                          alt={t(m.photo.alt)}
                          width={m.photo.w}
                          height={m.photo.h}
                          sizes="(min-width: 900px) 380px, 86vw"
                          className={styles.img}
                        />
                      </div>
                    ) : null}
                    <div className={styles.body}>
                      <p className={styles.yearRow}>
                        <span className={`${styles.year} text-gradient`} lang="en">
                          {m.year}
                        </span>
                        {i === last ? <span className={styles.now}>{t(ST.timeline.now)}</span> : null}
                      </p>
                      <h3 className={`h3 ${styles.cardTitle}`}>{t(m.title)}</h3>
                      {m.line ? <p className={styles.cardLine}>{t(m.line)}</p> : null}
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

// Har saal pe phootne wale do patte
function Sprout() {
  return (
    <svg className={styles.sprout} viewBox="0 0 40 40">
      <path className={styles.leafL} d="M20 22 C12 22 7 17 6 9 C14 9 19 14 20 22 Z" />
      <path className={styles.leafR} d="M20 22 C28 22 33 17 34 9 C26 9 21 14 20 22 Z" />
    </svg>
  );
}

// Badhte tane ki nok pe chhota patta
function LeafTip() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <path d="M3 21 C3 11 9 4 21 3 C20 15 13 21 3 21 Z" fill="currentColor" />
      <path d="M4 20 L15 9" stroke="#0a1a12" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}
