"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Crosshair, Map as MapIcon, Navigation, MapPin } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { LogoMark } from "@/components/nav/Logo";
import { site } from "@/lib/site";
import { useHydrated } from "@/components/plants/hooks";
import SampleTag from "../SampleTag/SampleTag";
import { directionsUrl, distanceKm, embedUrl, hasGeo } from "../visitModel";
import { VT } from "../visitText";
import styles from "./RouteCard.module.css";

// "आप" se nursery tak ka raasta (SVG coordinates, viewBox 600×420)
const ROUTE = "M92 338 C 170 330, 190 250, 268 246 S 360 270, 392 206 S 450 120, 486 112";

/* =========================================================
   Pata + "नक्शा" card
   - Halka sa banaya hua naksha (bhaari Google Map nahi) — scroll pe "आप" se
     nursery tak bindiyon wala raasta khinchta hai
   - [नक्शा खोलें] dabao tabhi asli Google Map load hota hai (page tez rehta hai)
   - [मेरी दूरी देखें] → phone ki location se seedhi doori (kahin save nahi hoti)
   ========================================================= */
export default function RouteCard() {
  const { lang, t } = useLang();
  const cardRef = useRef(null);
  const drawRef = useRef(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [dist, setDist] = useState({ state: "idle", km: null }); // idle | busy | done | error
  const dir = directionsUrl();
  const embed = embedUrl(lang);
  // Location wala button sirf browser mein (server pe navigator nahi hota → hydration safe)
  const hydrated = useHydrated();
  const canLocate = hydrated && hasGeo && "geolocation" in navigator;

  // Scroll ke saath raasta khinchna (0 → 1)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const path = drawRef.current;
    if (!path) return;
    let disposed = false;
    const apply = (p) => {
      if (!disposed) path.style.strokeDashoffset = String(1 - p);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(1);
      return;
    }
    apply(0);
    const proxy = { p: 0 };
    const ctx = gsap.context(() => {
      gsap.to(proxy, {
        p: 1,
        ease: "none",
        onUpdate: () => apply(proxy.p),
        scrollTrigger: { trigger: cardRef.current, start: "top 85%", end: "center 45%", scrub: 0.6 },
      });
    });
    return () => {
      disposed = true;
      ctx.revert();
    };
  }, []);

  const locate = () => {
    if (!canLocate) return;
    setDist({ state: "busy", km: null });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const km = distanceKm({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setDist(km == null ? { state: "error", km: null } : { state: "done", km: km < 10 ? km.toFixed(1) : Math.round(km) });
      },
      () => setDist({ state: "error", km: null }),
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 }
    );
  };

  return (
    <section className={styles.section} aria-labelledby="route-title">
      <div className="container">
        <div ref={cardRef} className={styles.card}>
          {/* ---------- Jaankari ---------- */}
          <div className={styles.info}>
            <p className="eyebrow">
              {t(VT.map.eyebrow)} <SampleTag block={site.geo} />
            </p>
            <h2 id="route-title" className={`h2 ${styles.title}`}>
              {t(VT.map.title)}
            </h2>
            {site.address ? (
              <p className={styles.address}>
                <MapPin size={18} strokeWidth={2} aria-hidden="true" />
                <span>{t(site.address)}</span>
              </p>
            ) : null}

            <div className={styles.actions}>
              {dir ? (
                <a href={dir} className={styles.primary} target="_blank" rel="noopener noreferrer">
                  <Navigation size={18} strokeWidth={2} aria-hidden="true" />
                  {t(VT.directions)}
                </a>
              ) : null}
              {embed && !mapOpen ? (
                <button type="button" className={styles.secondary} onClick={() => setMapOpen(true)}>
                  <MapIcon size={18} strokeWidth={2} aria-hidden="true" />
                  {t(VT.map.open)}
                </button>
              ) : null}
              {canLocate ? (
                <button type="button" className={styles.secondary} onClick={locate} disabled={dist.state === "busy"}>
                  <Crosshair size={18} strokeWidth={2} aria-hidden="true" />
                  {dist.state === "busy" ? t(VT.map.locating) : t(VT.map.distance)}
                </button>
              ) : null}
            </div>

            <p className={styles.result} aria-live="polite">
              {dist.state === "done" ? <strong>{VT.map.result[lang](dist.km)}</strong> : null}
              {dist.state === "error" ? t(VT.map.denied) : null}
            </p>
            {canLocate ? <p className={styles.privacy}>{t(VT.map.privacy)}</p> : null}
          </div>

          {/* ---------- Naksha ---------- */}
          <div className={styles.map}>
            {mapOpen && embed ? (
              <iframe
                className={styles.frame}
                src={embed}
                title={t(VT.map.frameTitle)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <svg className={styles.art} viewBox="0 0 600 420" role="img" aria-label={t(VT.map.title)}>
                <defs>
                  <mask id="routeMask">
                    <path
                      ref={drawRef}
                      d={ROUTE}
                      pathLength="1"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="16"
                      strokeLinecap="round"
                      strokeDasharray="1"
                      strokeDashoffset="1"
                    />
                  </mask>
                  <radialGradient id="routeGlow" cx="0.8" cy="0.25" r="0.6">
                    <stop offset="0" stopColor="#c6f36b" stopOpacity="0.45" />
                    <stop offset="1" stopColor="#c6f36b" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Khet ke tukde */}
                <rect width="600" height="420" fill="#f1ecdf" />
                <g opacity="0.9">
                  <rect x="-20" y="20" width="200" height="130" rx="18" fill="#e3ebcf" transform="rotate(-6 80 85)" />
                  <rect x="200" y="-30" width="170" height="150" rx="18" fill="#ebe4d0" transform="rotate(4 285 45)" />
                  <rect x="20" y="180" width="150" height="110" rx="18" fill="#dfe8c8" transform="rotate(3 95 235)" />
                  <rect x="430" y="210" width="200" height="160" rx="18" fill="#e5edd2" transform="rotate(-4 530 290)" />
                  <rect x="230" y="320" width="190" height="130" rx="18" fill="#ece5d2" transform="rotate(5 325 385)" />
                  <rect x="400" y="20" width="230" height="140" rx="18" fill="#dde7c3" transform="rotate(-3 515 90)" />
                </g>
                {/* Sadkein */}
                <g fill="none" stroke="#fffaf0" strokeLinecap="round">
                  <path d="M-10 300 C 150 280, 300 330, 610 250" strokeWidth="14" />
                  <path d="M380 -10 C 360 120, 420 260, 360 430" strokeWidth="10" />
                  <path d="M-10 120 C 120 140, 240 90, 360 120" strokeWidth="8" />
                </g>
                <rect width="600" height="420" fill="url(#routeGlow)" />

                {/* Raasta: halki line + scroll pe khinchti bindiyaan */}
                <path d={ROUTE} fill="none" stroke="rgba(10,26,18,0.12)" strokeWidth="4" strokeLinecap="round" />
                <path
                  d={ROUTE}
                  fill="none"
                  stroke="#1b3a28"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="0.1 14"
                  mask="url(#routeMask)"
                />

                {/* आप */}
                <g transform="translate(92 338)">
                  <circle r="20" fill="#c6f36b" opacity="0.35" className={styles.pulse} />
                  <circle r="9" fill="#c6f36b" stroke="#1b3a28" strokeWidth="3" />
                  <g transform="translate(0 30)">
                    <rect x="-26" y="-2" width="52" height="26" rx="13" fill="#0a1a12" />
                    <text y="16" textAnchor="middle" className={styles.youText}>
                      {t(VT.map.you)}
                    </text>
                  </g>
                </g>

                {/* Nursery ka pin */}
                <g transform="translate(486 112)">
                  <ellipse cx="0" cy="4" rx="16" ry="5" fill="rgba(10,26,18,0.18)" />
                  <path d="M0 2 C -6 -10, -26 -22, -26 -42 A 26 26 0 1 1 26 -42 C 26 -22, 6 -10, 0 2 Z" fill="#183d2b" />
                  <circle cx="0" cy="-42" r="19" fill="#fffdf9" />
                </g>
              </svg>
            )}
            {!mapOpen ? (
              <span className={styles.pinMark} aria-hidden="true">
                <LogoMark />
              </span>
            ) : null}
            {!mapOpen && dist.state === "done" ? (
              <span className={styles.kmPill} lang="en">
                ≈ {dist.km} km
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
