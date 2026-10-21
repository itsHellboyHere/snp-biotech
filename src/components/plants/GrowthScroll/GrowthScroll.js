"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { PT } from "../plantsText";
import styles from "./GrowthScroll.module.css";

/* =========================================================
   "पौधे से पेड़" — MacBook ke lid khulne jaisa scroll moment
   Grok ki timelapse ke 48 frames canvas pe; scroll = samay.
   Do frames ke beech crossfade → 48 frames mein bhi makkhan jaisa smooth.
   - Phone: 4:3 frames (640px), desktop: 16:9 (960px)
   - Section ke paas aane pe hi download shuru · Data Saver pe aadhe frames
   ========================================================= */

const COUNT = 48;
const SETS = { d: "/plants/growth/d/", m: "/plants/growth/m/" };
const src = (set, i) => `${SETS[set]}${String(i + 1).padStart(3, "0")}.webp`;
const clamp01 = (v) => Math.min(1, Math.max(0, v));

// Pehla + aakhri, phir har 8th, 4th, 2nd… — kam net pe bhi scroll turant kaam kare
function order(n) {
  const seen = new Set([0, n - 1]);
  const out = [0, n - 1];
  for (const step of [8, 4, 2, 1]) {
    for (let i = 0; i < n; i += step) {
      if (seen.has(i)) continue;
      seen.add(i);
      out.push(i);
    }
  }
  return out;
}

function nearest(images, i) {
  if (images[i]) return images[i];
  for (let d = 1; d < images.length; d++) {
    if (images[i - d]) return images[i - d];
    if (images[i + d]) return images[i + d];
  }
  return null;
}

export default function GrowthScroll() {
  const { t } = useLang();
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const copyRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const ctx2d = canvas.getContext("2d");
    const set = window.matchMedia("(max-width: 760px)").matches ? "m" : "d";
    const saveData = Boolean(navigator.connection?.saveData);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const images = new Array(COUNT).fill(null);
    let disposed = false;
    let progress = reduce ? 1 : 0;
    let lastStep = -1;

    // ---------- Canvas size (retina, max 2x) ----------
    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      draw();
    };

    // Image ko canvas mein "cover" karke banao (kinare kat jaayein, khaali jagah na rahe)
    const paint = (img, alpha) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx2d.globalAlpha = alpha;
      ctx2d.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    function draw() {
      if (disposed || !canvas.width) return;
      const f = progress * (COUNT - 1);
      const i = Math.floor(f);
      const a = f - i;
      const base = nearest(images, i);
      if (!base) return;
      paint(base, 1);
      const next = images[Math.min(COUNT - 1, i + 1)];
      if (a > 0.01 && next && next !== base) paint(next, a);
      ctx2d.globalAlpha = 1;
    }

    // ---------- Text + progress bar ----------
    const apply = (p) => {
      if (disposed) return;
      progress = p;
      draw();
      const step = Math.min(2, Math.floor(p * 3 * 0.999 + 0.0001));
      if (step !== lastStep && copyRef.current) {
        lastStep = step;
        copyRef.current.dataset.step = String(step);
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${clamp01(p).toFixed(4)})`;
    };

    // ---------- Frames: paas aane pe load ----------
    let started = false;
    const load = () => {
      if (started) return;
      started = true;
      const list = order(COUNT).filter((i) => !saveData || i % 2 === 0 || i === COUNT - 1);
      let cursor = 0;
      const next = () => {
        if (disposed || cursor >= list.length) return;
        const idx = list[cursor++];
        const img = new Image();
        img.decoding = "async";
        img.src = src(set, idx);
        img
          .decode()
          .then(() => {
            if (disposed) return;
            images[idx] = img;
            draw();
          })
          .catch(() => {})
          .finally(next);
      };
      for (let k = 0; k < 4; k++) next();
    };
    const io = new IntersectionObserver(([e]) => e.isIntersecting && load(), { rootMargin: "120% 0px" });
    io.observe(section);

    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    let gctx;
    if (reduce) {
      apply(1);
    } else {
      const proxy = { p: 0 };
      gctx = gsap.context(() => {
        gsap.to(proxy, {
          p: 1,
          ease: "none",
          onUpdate: () => apply(proxy.p),
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });
      }, section);
      apply(0);
    }

    return () => {
      disposed = true;
      io.disconnect();
      ro.disconnect();
      gctx?.revert();
    };
  }, []);

  const toCatalogue = () => {
    const el = document.getElementById("catalogue");
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="growth-title">
      <div className={styles.sticky}>
        <div className={styles.stage}>
          <canvas ref={canvasRef} className={styles.canvas} role="img" aria-label={t(PT.growth.alt)} />
          <div className={styles.shade} aria-hidden="true" />
        </div>

        <div ref={copyRef} className={`container ${styles.copy}`} data-step="0">
          <p className={`eyebrow ${styles.eyebrow}`}>{t(PT.growth.eyebrow)}</p>
          <h2 id="growth-title" className="sr-only">
            {t(PT.growth.eyebrow)}
          </h2>
          <div className={styles.steps}>
            {PT.growth.steps.map((s, i) => (
              <div key={i} className={styles.step} data-i={i}>
                <p className={`h1 ${styles.stepTitle}`}>{t(s.title)}</p>
                <p className={styles.stepLine}>{t(s.line)}</p>
              </div>
            ))}
          </div>
          <div className={styles.bottom}>
            <div className={styles.bar} aria-hidden="true">
              <span ref={barRef} className={styles.fill} />
            </div>
            <button type="button" className={styles.cta} onClick={toCatalogue}>
              {t(PT.growth.cta)}
              <ArrowUp size={17} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
