"use client";

import { useEffect, useRef } from "react";
import LocaleLink from "@/i18n/LocaleLink";
import { useLang } from "@/i18n/LangProvider";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STORY_FRAMES, STORY_SEGMENTS, STORY_INTRO, frameSrc } from "./storyConfig";
import { loadFrames, nearestLoaded, drawCover } from "./frameLoader";
import styles from "./Story.module.css";

/* =========================================================
   Story — Apple-style scroll film
   1. Card chhota (rounded) dikhta hai → scroll pe poori screen mein phailta hai
   2. Phir frames scroll ke saath chalte hain, 5 segments mein
   3. Neeche segment bar batati hai kahani kahan tak pahunchi (tap = wahan jao)
   Sab kuch ek hi scroll value (0→1) se calculate — kabhi atakta nahi
   ========================================================= */

const PORTRAIT_QUERY = "(max-aspect-ratio: 1/1)";
const EXPAND = 0.12; // scroll ka pehla 12%: card phailta hai
const TAIL = 0.04; // aakhri 4%: aakhri frame pe thoda thehrav

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// intro: heading ka text badalna ho (jaise How We Grow page pe) · titleAs: "h1" jab page ka main heading ho
export default function Story({ intro: introOverride, titleAs: Title = "h2" }) {
  const { t, other } = useLang();
  const intro = { ...STORY_INTRO, ...introOverride };
  const trackRef = useRef(null);
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const uiRef = useRef(null);
  const captionRefs = useRef([]);
  const fillRefs = useRef([]);
  const segBtnRefs = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const track = trackRef.current;
    const card = cardRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });

    const isPortrait = window.matchMedia(PORTRAIT_QUERY).matches;
    const set = isPortrait ? STORY_FRAMES.mobile : STORY_FRAMES.desktop;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection?.saveData === true;

    const state = { frame: 0 };
    let cw = 0;
    let ch = 0;
    let raf = 0;
    let disposed = false;

    const render = () => {
      raf = 0;
      if (disposed) return;
      const img = nearestLoaded(loader.images, Math.round(state.frame));
      if (!img || !cw) return;
      drawCover(ctx, img, cw, ch);
      if (!track.dataset.ready) track.dataset.ready = "true";
    };
    const requestRender = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = Math.round(canvas.clientWidth * dpr);
      ch = Math.round(canvas.clientHeight * dpr);
      canvas.width = cw;
      canvas.height = ch;
      ctx.imageSmoothingQuality = "high";
      requestRender();
    };

    // Frames tabhi load hon jab story screen ke paas aaye — hero ki images ko pehle jagah mile
    // (phone pe data aur speed dono bachte hain)
    let loader = { images: new Array(set.count).fill(null), cancel() {} };
    const startLoading = () => {
      loader = loadFrames(set, {
        saveData: saveData || reduceMotion,
        onFrame: (i) => {
          if (Math.abs(i - state.frame) <= 3 || !track.dataset.ready) requestRender();
        },
      });
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          startLoading();
        }
      },
      { rootMargin: "150% 0px" }
    );
    io.observe(track);

    // ---------- UI: scroll value (0→1) se sab kuch ----------
    const setLayer = (el, opacity, y, blur) => {
      el.style.opacity = opacity.toFixed(3);
      el.style.visibility = opacity < 0.01 ? "hidden" : "visible";
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      el.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "none";
    };

    const FADE = 0.035; // segment caption ka fade (video progress mein)
    let activeIndex = -1;

    const apply = (s) => {
      if (disposed || !uiRef.current) return;

      // 1. Card expand: inset + rounded corners → full screen
      const e = easeInOut(clamp01(s / EXPAND));
      const k = 1 - e;
      const vh = window.innerHeight;
      const side = isPortrait ? 14 : Math.max(24, window.innerWidth * 0.06);
      card.style.clipPath = `inset(${(vh * 0.1 * k).toFixed(1)}px ${(side * k).toFixed(1)}px ${(
        vh * 0.12 * k
      ).toFixed(1)}px ${(side * k).toFixed(1)}px round ${(28 * k).toFixed(1)}px)`;

      // 2. Video progress
      const f = clamp01((s - EXPAND) / (1 - EXPAND - TAIL));
      state.frame = f * (set.count - 1);
      requestRender();

      // 3. UI (captions + bar) card phailne ke baad hi
      const ui = clamp01((s - EXPAND * 0.55) / (EXPAND * 0.45));
      uiRef.current.style.opacity = ui.toFixed(3);
      uiRef.current.style.pointerEvents = ui > 0.5 ? "auto" : "none";

      // 4. Captions — ek time pe ek
      STORY_SEGMENTS.forEach((seg, i) => {
        const el = captionRefs.current[i];
        if (!el) return;
        const tin = seg.start === 0 ? 1 : clamp01((f - seg.start) / FADE);
        const tout = seg.end === 1 ? 0 : clamp01((f - (seg.end - FADE)) / FADE);
        const t = easeOut(tin);
        setLayer(el, t * (1 - tout), (1 - t) * 24 - tout * 24, (1 - tin) * 8 + tout * 8);

        // 5. Segment bar fill
        const fill = fillRefs.current[i];
        if (fill) fill.style.transform = `scaleX(${clamp01((f - seg.start) / (seg.end - seg.start)).toFixed(3)})`;
      });

      // Active segment (accessibility + highlight)
      const idx = Math.max(0, STORY_SEGMENTS.findIndex((seg) => f < seg.end || seg.end === 1));
      if (idx !== activeIndex) {
        activeIndex = idx;
        segBtnRefs.current.forEach((btn, i) => {
          if (!btn) return;
          btn.dataset.active = i === idx ? "true" : "false";
          btn.setAttribute("aria-current", i === idx ? "step" : "false");
        });
      }
    };

    resize();
    window.addEventListener("resize", resize);

    let gsapCtx;
    if (reduceMotion) {
      track.dataset.static = "true";
      apply(1);
    } else {
      const proxy = { s: 0 };
      gsapCtx = gsap.context(() => {
        gsap.to(proxy, {
          s: 1,
          ease: "none",
          onUpdate: () => {
            if (!disposed) apply(proxy.s);
          },
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
      }, track);
      apply(0);
    }

    return () => {
      disposed = true;
      io.disconnect();
      loader.cancel();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      gsapCtx?.revert();
    };
  }, []);

  // Segment pe tap → kahani ke us hisse pe smooth scroll
  const goTo = (seg) => {
    const track = trackRef.current;
    if (!track) return;
    const s = EXPAND + (seg.start + 0.02) * (1 - EXPAND - TAIL);
    const top = track.getBoundingClientRect().top + window.scrollY;
    const y = top + s * (track.offsetHeight - window.innerHeight);
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section id="story" className={styles.story} data-theme="light" aria-labelledby="story-title">
      <header className={`container ${styles.intro}`}>
        <p className="eyebrow">{t(intro.eyebrow)}</p>
        <Title id="story-title" className={`display ${styles.title}`}>
          {t(intro.title)}
        </Title>
        <p className={styles.lead}>{t(intro.line)}</p>
      </header>

      <div ref={trackRef} className={styles.track}>
        <div className={styles.stage}>
          <div ref={cardRef} className={styles.card}>
            <picture>
              <source media={PORTRAIT_QUERY} srcSet={frameSrc(STORY_FRAMES.mobile, 0)} />
              <img
                className={styles.poster}
                src={frameSrc(STORY_FRAMES.desktop, 0)}
                alt={t(STORY_INTRO.posterAlt)}
                decoding="async"
              />
            </picture>
            <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
            <div className={styles.shade} aria-hidden="true" />
          </div>

          <div ref={uiRef} className={styles.ui}>
            <div className={`container ${styles.captions}`}>
              {STORY_SEGMENTS.map((seg, i) => (
                <div
                  key={seg.id}
                  ref={(el) => {
                    captionRefs.current[i] = el;
                  }}
                  className={`${styles.caption} ${i === 0 ? styles.first : ""}`}
                >
                  <h3 className={`h1 ${styles.capTitle}`}>{t(seg.title)}</h3>
                  <p className={styles.capLine}>{t(seg.line)}</p>
                  <p className={styles.capEn} lang={other}>
                    {seg.title[other]}
                  </p>
                  {seg.cta ? (
                    <LocaleLink href={seg.cta.href} className={styles.cta}>
                      {t(seg.cta.label)}
                    </LocaleLink>
                  ) : null}
                </div>
              ))}
            </div>

            <nav className={styles.segments} aria-label={t(STORY_INTRO.navLabel)}>
              {STORY_SEGMENTS.map((seg, i) => (
                <button
                  key={seg.id}
                  type="button"
                  ref={(el) => {
                    segBtnRefs.current[i] = el;
                  }}
                  className={styles.seg}
                  data-active={i === 0 ? "true" : "false"}
                  onClick={() => goTo(seg)}
                >
                  <span className={styles.segLabel}>{t(seg.label)}</span>
                  <span className={styles.segTrack} aria-hidden="true">
                    <span
                      ref={(el) => {
                        fillRefs.current[i] = el;
                      }}
                      className={styles.segFill}
                    />
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
