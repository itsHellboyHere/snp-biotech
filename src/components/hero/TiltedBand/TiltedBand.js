"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./TiltedBand.module.css";

/* =========================================================
   TiltedBand — ek ghoomti hui 3D "cylinder" row
   ---------------------------------------------------------
   Tiles right se left ek cylinder ke andar ghoomti hain: beech mein seedhi,
   kinaron pe aapki taraf mudti hui, aur kinaron pe fade.

   CSS box mud nahi sakta, isliye har tile ko patli vertical strips (slices)
   mein kaata hai. Har strip cylinder pe apne angle pe rakhi hai, aur poori
   tile ek hi CSS animation se cylinder pe ghoomti hai — sab GPU pe chalta hai,
   JS sirf size naapta hai aur tile ko agli image deta hai jab woh screen se
   bahar hoti hai.

   Phone pe: kam slices (10), halka curve, badi tiles — smooth aur readable.
   ========================================================= */

// Camera cylinder ke radius ka kitne guna door hai
const CAMERA = 1.6;
// maxWidth: ek tile hero ki chaudai ka max itna % — phone pe bagal wali tiles bhi dikhein
// tileHeight: band ki apni height ka % (band ab heading aur buttons ke BEECH ki jagah mein hai,
// isliye kinaron pe phoolti tiles bhi text pe nahi chadhti)
// aspect: tile ki chaudai / oonchai. Kam aur badi tiles = zyada premium (example jaisa).
const DEFAULTS = {
  // Kam aur badi tiles + tez curve = example jaisa: beech mein seedhi, kinaron pe
  // aapki taraf mud kar phoolti hui aur fade hoti hui
  mobile: { aspect: 4 / 5, tileHeight: 76, maxWidth: 60, curve: 60, axis: 50, slices: 12, fade: 3 },
  desktop: { aspect: 16 / 10, tileHeight: 80, maxWidth: 36, curve: 76, axis: 50, slices: 20, fade: 5 },
};

const toRad = (deg) => (Math.min(85, Math.max(5, deg)) * Math.PI) / 180;
const round = (n) => +n.toFixed(4);

// Cylinder radius (hero width ka hissa) jisse frame ka kinara `bend` radians pe aaye
function arc(bend) {
  return (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend));
}

function measure(width, height, conf, gap) {
  const aspect = conf.aspect;
  const bend = toRad(conf.curve);
  const h = Math.min((conf.tileHeight / 100) * height, ((conf.maxWidth / 100) * width) / aspect);
  const radius = width * arc(bend);
  if (!(h > 0) || !(radius > 0)) return { columns: 2, sweep: 0, unit: 0, limit: 0 };

  const deg = (rad) => (rad * 180) / Math.PI;
  const unit = deg(h / radius); // ek tile-height kitne degree ka arc hai
  const pitch = (aspect + gap / 100) * unit;
  const limit = deg(bend) + (aspect * unit) / 2;
  const columns = Math.min(40, Math.max(2, Math.ceil((2 * limit) / pitch)));
  const sweep = round((columns * pitch) / 2);
  return { columns, sweep, unit: round(unit), limit: round(Math.min(sweep, limit)) };
}

export default function TiltedBand({
  items,
  renderTile,
  speed = 4.5, // ek tile aage badhne mein kitne second
  gap = 6,
  breakpoint = 720,
  mobile,
  desktop,
  className = "",
}) {
  const ref = useRef(null);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const tileClass = `tb-t-${id}`;

  // Props objects har render pe naye bante hain — string key se effect sirf asli change pe chale
  const confKey = JSON.stringify({ mobile, desktop });

  // null jab tak size naapa nahi — tab tak band chhupa rehta hai
  const [layout, setLayout] = useState(null);
  // har tile abhi kaunsi image dikha rahi hai (sirf screen ke bahar badalti hai)
  const [shown, setShown] = useState({});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const custom = JSON.parse(confKey);
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const mode = width < breakpoint ? "mobile" : "desktop";
      const conf = { ...DEFAULTS[mode], ...custom[mode] };
      const next = { ...measure(width, height, conf, gap), conf, mode };
      next.sig = `${mode}-${next.columns}-${String(next.sweep).replace(".", "_")}`;
      setLayout((prev) => (prev && prev.sig === next.sig && prev.unit === next.unit ? prev : next));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [gap, breakpoint, confKey]);

  // Saari images pehle se load — tile wapas aate waqt load karna late hota
  useEffect(() => {
    for (const item of items) if (item.src) new Image().src = item.src;
  }, [items]);

  // Layout badla (jaise phone → desktop resize) to tiles ki purani image-position bekaar —
  // render ke dauraan hi reset (React ka "adjust state on prop change" pattern)
  const sig = layout?.sig ?? "init";
  const [shownSig, setShownSig] = useState(sig);
  if (shownSig !== sig) {
    setShownSig(sig);
    setShown({});
  }

  // Har layout ka apna keyframe naam — browser purani animation pe atka na rahe
  const orbit = `tb-o-${id}-${sig}`;

  const conf = layout?.conf ?? { ...DEFAULTS.desktop, ...desktop };
  const aspectRatio = conf.aspect;
  const { columns, sweep, unit, limit } = layout ?? measure(1200, 800, conf, gap);
  const slices = conf.slices;
  const bend = toRad(conf.curve);

  // Har length tile-height ka multiple hai (container query units)
  const u = (n) =>
    `calc(${round(n)} * min(${conf.tileHeight}cqh, ${round(conf.maxWidth / aspectRatio)}cqw))`;

  const r = 100 * arc(bend);
  const radius = `${r.toFixed(3)}cqw`;
  const turn = (deg) =>
    `translateZ(${radius}) rotateY(${round(deg)}deg) translateZ(-${radius})`;

  const hide = round(((sweep - limit) / (2 * sweep || 1)) * 100);
  const css =
    `@keyframes ${orbit}{` +
    `from{transform:${turn(-sweep)}}to{transform:${turn(sweep)}}` +
    `0%,${hide}%,${100 - hide}%,100%{visibility:hidden}` +
    `${hide + 0.001}%,${100 - hide - 0.001}%{visibility:visible}}` +
    `@media(prefers-reduced-motion:reduce){.${tileClass}{animation-play-state:paused}}`;

  const share = aspectRatio / slices;
  const duration = columns * speed;
  const mask = `linear-gradient(90deg,transparent,#000 ${conf.fade}%,#000 ${100 - conf.fade}%,transparent)`;

  return (
    <div ref={ref} className={`${styles.root} ${className}`}>
      <style>{css}</style>

      <div
        key={sig} /* layout badle to saari tiles naye sire se mount — kuch atakta nahi */
        aria-hidden="true"
        className={styles.stage}
        style={{
          opacity: layout ? 1 : 0,
          perspective: `${(r * CAMERA).toFixed(3)}cqw`,
          perspectiveOrigin: `50% ${conf.axis}%`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        {Array.from({ length: columns }, (_, t) => {
          const first = columns - 1 - t;
          const item = items[(shown[t] ?? first) % Math.max(items.length, 1)];
          return (
            <div
              key={t}
              className={`${tileClass} ${styles.tile}`}
              style={{
                left: `calc(50% - ${u(aspectRatio / 2)})`,
                top: `calc(${conf.axis}% - ${u(0.5)})`,
                width: u(aspectRatio),
                height: u(1),
                animation: `${orbit} ${duration}s linear ${-t * speed}s infinite`,
              }}
              onAnimationIteration={(e) => {
                const lap = Math.round(e.elapsedTime / duration);
                setShown((prev) => {
                  const next = lap * columns + first;
                  return prev[t] === next ? prev : { ...prev, [t]: next };
                });
              }}
            >
              {Array.from({ length: slices }, (_, k) => (
                <div
                  key={k}
                  className={`${styles.slice} ${k === 0 ? styles.sliceFirst : ""} ${
                    k === slices - 1 ? styles.sliceLast : ""
                  }`}
                  style={{
                    left: u((aspectRatio - share) / 2),
                    // 1px extra taaki strips ke beech baal jitni line na dikhe
                    width: k === slices - 1 ? u(share) : `calc(${u(share)} + 1px)`,
                    height: u(1),
                    transform: turn((aspectRatio / 2 - (k + 0.5) * share) * unit),
                  }}
                >
                  <div
                    className={styles.face}
                    style={{ left: u(-k * share), width: u(aspectRatio), height: u(1) }}
                  >
                    {item ? renderTile(item, k) : null}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
