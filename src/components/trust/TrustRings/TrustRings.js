"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "@/components/media/SmartImage";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/i18n/LangProvider";
import { scriptLang } from "@/i18n/config";
import { TRUST } from "../trustData";
import styles from "./TrustRings.module.css";

/* =========================================================
   पेड़ के छल्ले — asli lakdi ke tane pe chhalle scroll ke saath
   ek-ek karke "khinchte" hain (beech se bahar). Har chhalla = ek saal.
   Ek chhota pill chhalle ke saath bahar chalta hai aur saal dikhata hai.
   Neeche ke numbers dikhte hi gin-te hue badhte hain.
   ========================================================= */

const R_MIN = 7; // sabse andar ka chhalla (SVG units, disc = 100)
const R_MAX = 46.5; // sabse bahar ka
const PILL_ANGLE = -38 * (Math.PI / 180); // pill kis kone pe chale (upar-daayein)

// i-th chhalle ka radius (n = kul chhalle)
const ringRadius = (i, n) => R_MIN + ((R_MAX - R_MIN) * i) / Math.max(1, n - 1);

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const nf = new Intl.NumberFormat("en-IN");

export default function TrustRings() {
  const { t } = useLang();
  const years = useMemo(() => {
    const list = [];
    for (let y = TRUST.fromYear; y <= TRUST.toYear; y++) list.push(y);
    return list;
  }, []);
  const n = years.length;

  const sectionRef = useRef(null);
  const discRef = useRef(null);
  const imgRef = useRef(null);
  const ringRefs = useRef([]);
  const pillRef = useRef(null);
  const pillTextRef = useRef(null);
  const statsRef = useRef(null);
  const numRefs = useRef([]);

  // ---------- Chhalle: scroll value (0→1) se ----------
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastYear = -1;
    let disposed = false;

    const apply = (p) => {
      // Unmount / hot-reload ke baad purana scroll callback aa sakta hai — tab kuch na karo
      if (disposed || !pillRef.current || !imgRef.current) return;
      const head = p * n; // kitne chhalle ban chuke (1.5 = doosra aadha)
      ringRefs.current.forEach((el, i) => {
        if (!el) return;
        const lit = clamp01(head - i);
        el.style.strokeDashoffset = (1 - easeOut(lit)).toFixed(4);
        // purane chhalle thode dheeme, naya wala sabse chamakdar
        const age = clamp01(head - i - 1);
        el.style.opacity = lit <= 0 ? "0" : (1 - age * 0.55).toFixed(3);
      });

      // Pill: abhi wale chhalle pe, saal ke saath
      const idx = Math.min(n - 1, Math.max(0, Math.ceil(head) - 1));
      const r = ringRadius(Math.min(n - 1, Math.max(0, head - 0.5)), n);
      const x = 50 + r * Math.cos(PILL_ANGLE);
      const y = 50 + r * Math.sin(PILL_ANGLE);
      pillRef.current.style.left = `${x.toFixed(2)}%`;
      pillRef.current.style.top = `${y.toFixed(2)}%`;
      pillRef.current.style.opacity = head > 0.05 ? "1" : "0";
      if (idx !== lastYear) {
        lastYear = idx;
        pillTextRef.current.textContent = String(years[idx]);
      }

      // Tana halka sa ghoomta + paas aata hai
      imgRef.current.style.transform = `rotate(${((1 - p) * -24).toFixed(2)}deg) scale(${(0.94 + p * 0.06).toFixed(4)})`;
    };

    if (reduce) {
      apply(1);
      return;
    }

    const proxy = { p: 0 };
    const ctx = gsap.context(() => {
      gsap.to(proxy, {
        p: 1,
        ease: "none",
        onUpdate: () => apply(proxy.p),
        scrollTrigger: {
          trigger: discRef.current,
          start: "top 85%",
          end: "bottom 45%",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);
    apply(0);
    return () => {
      disposed = true;
      ctx.revert();
    };
  }, [n, years]);

  // ---------- Numbers: dikhte hi 0 se gin-te hue ----------
  useEffect(() => {
    const els = numRefs.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const show = (k) =>
      TRUST.stats.forEach((s, i) => {
        if (els[i]) els[i].textContent = nf.format(Math.round(s.value * k));
      });
    if (reduce) {
      show(1);
      return;
    }
    show(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now) => {
          const k = easeOut(clamp01((now - t0) / 1800));
          show(k);
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(statsRef.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="trust-title">
      <div className={`container ${styles.grid}`}>
        <header className={styles.head}>
          <p className={`eyebrow ${styles.eyebrow}`}>{t(TRUST.eyebrow)}</p>
          <h2 id="trust-title" className={`display ${styles.title}`}>
            {t(TRUST.title)}
          </h2>
          <p className={styles.line}>{t(TRUST.line)}</p>
        </header>

        <div ref={discRef} className={styles.disc}>
          <div ref={imgRef} className={styles.wood}>
            <Image src={TRUST.ringsImage} alt="" fill sizes="(max-width: 960px) 84vw, 540px" className={styles.woodImg} />
          </div>
          <svg className={styles.rings} viewBox="0 0 100 100" aria-hidden="true">
            {years.map((y, i) => (
              <circle
                key={y}
                ref={(el) => {
                  ringRefs.current[i] = el;
                }}
                cx="50"
                cy="50"
                r={ringRadius(i, n)}
                pathLength="1"
                transform="rotate(-90 50 50)"
              />
            ))}
          </svg>
          <div className={styles.center} aria-hidden="true">
            <span className={styles.big} lang="en">
              {TRUST.center.big}
            </span>
            <span className={styles.small}>{t(TRUST.center.small)}</span>
          </div>
          <span ref={pillRef} className={styles.pill} aria-hidden="true">
            <span ref={pillTextRef} lang="en">
              {years[0]}
            </span>
          </span>
          <p className="sr-only">
            {TRUST.fromYear}–{TRUST.toYear}: {TRUST.center.big} {t(TRUST.center.small)}
          </p>
        </div>

        <ul ref={statsRef} className={styles.stats}>
          {TRUST.stats.map((s, i) => (
            <li key={i} className={styles.stat}>
              <span className={styles.value} lang="en">
                <span
                  ref={(el) => {
                    numRefs.current[i] = el;
                  }}
                >
                  {nf.format(s.value)}
                </span>
                <span className={styles.suffix} lang={scriptLang(t(s.suffix))}>
                  {t(s.suffix)}
                </span>
              </span>
              <span className={styles.label}>{t(s.label)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
