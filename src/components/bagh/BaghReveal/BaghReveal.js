"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/i18n/LangProvider";
import { BAGH, BAGH_VIDEO, BAGH_TIMING as T } from "../baghData";
import { analyzeWord } from "../analyzeWord";
import styles from "./BaghReveal.module.css";

/* =========================================================
   "बाग़" — Apple MacBook Pro jaisa video → shabd → gradient text
   1. Poori screen pe nursery ki video
   2. Scroll pe video ek bade shabd ("बाग़" / "Orchard") ke andar simat jaati hai
      (canvas pe dark parda, shabd ki shape ka ched — usme se video dikhti hai)
   3. Video bujhti hai, gradient mein "आम. अमरूद. लीची." aate hain + headline
   Sab kuch ek scroll value (0→1) se — reload / tez scroll pe kabhi atakta nahi
   ========================================================= */

const PORTRAIT = "(max-aspect-ratio: 1/1)";
const FONT_SIZE = 200; // shabd naapne ka size (text units) — asli size JS scale se
// Shuru ka zoom kitna bada ho sakta hai (shabd ab PATH hai, isliye bada zoom bhi saaf)
const MAX_ZOOM = 80;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const range = (s, [a, b]) => clamp01((s - a) / (b - a));

export default function BaghReveal() {
  const { lang, t } = useLang();
  const word = t(BAGH.word);
  const fruits = t(BAGH.fruits);

  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const mediaRef = useRef(null);
  const videoRef = useRef(null);
  const coverRef = useRef(null);
  const textRef = useRef(null);
  const captionRef = useRef(null);
  const subRef = useRef(null);
  const fruitRefs = useRef([]);
  const headRef = useRef(null);
  const moreRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    const stage = stageRef.current;
    const media = mediaRef.current;
    const video = videoRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection?.saveData === true;
    const useVideo = !reduceMotion && !saveData;

    let disposed = false;
    let geo = null;
    const cover = coverRef.current;
    const cctx = cover.getContext("2d");
    let dpr = 1;
    let curtain = "#050d09";
    let progress = 0;
    let portrait = window.matchMedia(PORTRAIT).matches;
    let near = false; // video load karni hai?
    let inView = false; // video chalani hai?

    // ---------- Video: sirf paas aane pe load, sirf dikhne pe chale ----------
    const setSource = () => {
      if (!useVideo || !near) return;
      const src = (portrait ? BAGH_VIDEO.mobile : BAGH_VIDEO.desktop).src;
      if (video.dataset.src === src) return;
      video.dataset.src = src;
      media.dataset.playing = "false";
      video.src = src;
      video.load();
      syncPlay();
    };

    const syncPlay = () => {
      if (!useVideo || !video.dataset.src) return;
      const should = inView && progress < T.wordOut[1];
      if (should && video.paused) video.play().catch(() => {});
      else if (!should && !video.paused) video.pause();
    };

    const onPlaying = () => {
      media.dataset.playing = "true";
    };
    video.addEventListener("playing", onPlaying);

    const ioNear = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !near) {
          near = true;
          setSource();
        }
      },
      { rootMargin: "100% 0px" }
    );
    const ioView = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      syncPlay();
    });
    ioNear.observe(track);
    ioView.observe(track);

    // ---------- Text layers ----------
    const setLayer = (el, opacity, y = 0, blur = 0) => {
      if (!el) return;
      el.style.opacity = opacity.toFixed(3);
      el.style.visibility = opacity < 0.01 ? "hidden" : "visible";
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      el.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "none";
    };

    // ---------- Shabd ka hisaab: kitna bada, kahan, zoom kahan se ----------
    const layout = () => {
      if (disposed) return;
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      if (!W || !H) return;

      const cs = getComputedStyle(textRef.current);
      const stroke = lang === "hi" ? 7 : 2; // Hindi (Tiro) ko thoda mota — zyada video dikhe
      const font = `${cs.fontStyle} ${cs.fontWeight} ${FONT_SIZE}px ${cs.fontFamily}`;
      const { path, box, focus, focusHalf } = analyzeWord({
        word,
        font,
        stroke,
        aspect: W / H,
        res: Math.min(W, H) < 600 ? 3 : 4, // phone pe thoda halka
      });

      // Canvas = screen jitna (Retina pe 2x tak) — zoom kitna bhi ho, canvas utna hi
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cover.width = Math.round(W * dpr);
      cover.height = Math.round(H * dpr);
      curtain = getComputedStyle(stage).backgroundColor || curtain;

      const landscape = W > H;
      const k = Math.min(((landscape ? 0.8 : 0.88) * W) / box.w, ((landscape ? 0.44 : 0.3) * H) / box.h);
      const cy = H * (landscape ? 0.46 : 0.44);
      const fit = { x: W / 2 - k * (box.x + box.w / 2), y: cy - k * (box.y + box.h / 2) };
      // Shuru ka zoom: screen letter ke mote hisse ke andar → (lagbhag) poori screen video
      const s0 = Math.max(k * 1.5, Math.min(MAX_ZOOM, (1.15 * (H / 2)) / focusHalf));

      geo = { W, H, k, fit, s0, focus, shape: new Path2D(path) };
      subRef.current.style.top = `${(fit.y + k * (box.y + box.h) + Math.max(20, H * 0.04)).toFixed(1)}px`;
      cover.dataset.ready = "true";
      apply(progress);
    };

    // ---------- Scroll value (0→1) se sab kuch ----------
    const apply = (s) => {
      progress = s;
      if (disposed || !geo) return;
      const { W, H, k, fit, s0, focus, shape } = geo;

      // 1. Zoom: bahut bade se (screen letter ke andar) → shabd apni jagah
      const z = easeInOut(clamp01((s - T.zoomStart) / (T.zoomEnd - T.zoomStart)));
      const out = easeInOut(range(s, T.wordOut));
      // log scale = zoom ki speed ek jaisi lagti hai (camera jaisa)
      const scale = Math.exp(lerp(Math.log(s0), Math.log(k), z)) * (1 - 0.06 * out);
      const fx = lerp(W / 2, k * focus.x + fit.x, z);
      const fy = lerp(H / 2, k * focus.y + fit.y, z);
      // Parda bharo, phir shabd ki shape kaat do (destination-out = ched)
      cctx.setTransform(1, 0, 0, 1, 0, 0);
      cctx.globalCompositeOperation = "source-over";
      cctx.clearRect(0, 0, cover.width, cover.height);
      cctx.fillStyle = curtain;
      cctx.fillRect(0, 0, cover.width, cover.height);
      cctx.globalCompositeOperation = "destination-out";
      const sd = scale * dpr;
      cctx.setTransform(sd, 0, 0, sd, (fx - scale * focus.x) * dpr, (fy - scale * focus.y) * dpr);
      cctx.fill(shape, "evenodd");

      // Parda zoom ke saath halke se aata hai (shuru mein sirf video)
      cover.style.opacity = easeOut(range(s, T.curtainIn)).toFixed(3);

      // 2. Video bujhti hai → shabd parde mein ghul jaata hai
      media.style.opacity = (1 - out).toFixed(3);
      syncPlay();

      // 3. Caption (shuru) + shabd ke neeche line
      const cap = 1 - easeOut(range(s, T.captionOut));
      setLayer(captionRef.current, cap, (1 - cap) * -10);
      const subIn = easeOut(range(s, T.subIn));
      const subOut = range(s, T.subOut);
      setLayer(subRef.current, subIn * (1 - subOut), (1 - subIn) * 18 - subOut * 12, (1 - subIn) * 6);

      // 4. Fal — ek ke baad ek, neeche se + blur se saaf
      fruitRefs.current.forEach((el, i) => {
        const a = T.fruitsStart + i * T.fruitsGap;
        const p = easeOut(range(s, [a, a + T.fruitsDur]));
        setLayer(el, p, (1 - p) * 40, (1 - p) * 10);
      });

      // 5. Headline + chhoti line
      const h = easeOut(range(s, T.headIn));
      setLayer(headRef.current, h, (1 - h) * 24, (1 - h) * 6);
      const m = easeOut(range(s, T.moreIn));
      setLayer(moreRef.current, m, (1 - m) * 18);
    };

    // ---------- Resize (rotate bhi) ----------
    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        const p = window.matchMedia(PORTRAIT).matches;
        if (p !== portrait) {
          portrait = p;
          setSource();
        }
        layout();
      });
    };
    window.addEventListener("resize", onResize);

    // Font aane se pehle bhi layout (fallback font), aane ke baad sahi wala
    layout();
    const cs = getComputedStyle(textRef.current);
    document.fonts
      ?.load(`${cs.fontStyle} ${cs.fontWeight} ${FONT_SIZE}px ${cs.fontFamily}`, word)
      .then(() => !disposed && layout())
      .catch(() => {});

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
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      }, track);
      apply(0);
    }

    return () => {
      disposed = true;
      ioNear.disconnect();
      ioView.disconnect();
      video.removeEventListener("playing", onPlaying);
      video.pause();
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", onResize);
      gsapCtx?.revert();
    };
  }, [word, lang]);

  return (
    <div ref={trackRef} className={styles.track}>
      <div ref={stageRef} className={styles.stage}>
        {/* Video + poster (poster = jab tak video na chale / Data Saver) */}
        <div ref={mediaRef} className={styles.media} data-playing="false">
          <picture>
            <source media={PORTRAIT} srcSet={BAGH_VIDEO.mobile.poster} />
            <img className={styles.poster} src={BAGH_VIDEO.desktop.poster} alt="" loading="lazy" decoding="async" />
          </picture>
          <video ref={videoRef} className={styles.video} muted playsInline loop preload="none" aria-hidden="true" />
        </div>

        {/* Parda: dark rang, shabd ki shape ka ched (canvas) */}
        <canvas ref={coverRef} className={styles.cover} aria-hidden="true" />

        {/* Sirf font naapne + load karane ke liye (dikhta nahi) */}
        <span ref={textRef} className={styles.measure} aria-hidden="true">
          {word}
        </span>

        <p ref={captionRef} className={styles.caption}>
          <span className={styles.dot} aria-hidden="true" />
          {t(BAGH.caption)}
        </p>

        <p ref={subRef} className={styles.sub}>
          {t(BAGH.sub)}
        </p>

        <div className={styles.end}>
          <p className={styles.fruits}>
            <span className="sr-only">{word}. </span>
            {fruits.map((f, i) => (
              <span
                key={f.text}
                ref={(el) => {
                  fruitRefs.current[i] = el;
                }}
                className={`${styles.fruit} ${styles[f.tone]}`}
              >
                {f.text}
              </span>
            ))}
          </p>
          <h2 id="bagh-title" ref={headRef} className={`h2 ${styles.head}`}>
            {t(BAGH.headline)}
          </h2>
          <p ref={moreRef} className={styles.more}>
            {t(BAGH.more)}
          </p>
        </div>
      </div>
    </div>
  );
}
