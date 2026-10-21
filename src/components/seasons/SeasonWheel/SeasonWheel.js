"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { MessageCircle } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { whatsappLink } from "@/lib/site";
import { SEASON, MONTHS, SEASON_FRUITS } from "../seasonData";
import styles from "./SeasonWheel.module.css";

/* =========================================================
   12 महीने का पहिया — ghadi jaisa: UPAR = aaj ka mahina,
   ghadi ki disha mein = aane wale mahine.
   Paudha chuno → uske lagane ke mahine rangeen ho jaate hain,
   beech mein: "abhi sahi samay" ya "agla samay X mahine baad".
   ========================================================= */

const C = 200; // SVG center (viewBox 400)
const R0 = 128; // mahino ki patti — andar
const R1 = 188; // bahar
const GAP = 1.4; // patti ke tukdon ke beech (degree)

// Aaj ka mahina — sirf browser mein (server pe -1, taaki build ka mahina na chipke)
const subscribe = () => () => {};
const getMonth = () => new Date().getMonth();
const getServerMonth = () => -1;

const polar = (r, deg) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
};

function sector(r0, r1, a0, a1) {
  const [x0, y0] = polar(r1, a0);
  const [x1, y1] = polar(r1, a1);
  const [x2, y2] = polar(r0, a1);
  const [x3, y3] = polar(r0, a0);
  const f = (n) => n.toFixed(2);
  return `M${f(x0)} ${f(y0)}A${r1} ${r1} 0 0 1 ${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}A${r0} ${r0} 0 0 0 ${f(x3)} ${f(y3)}Z`;
}

// [6,7,8,1,2] → [[1,2],[6,8]] (lagaataar mahino ke tukde, saal ke paar bhi)
function ranges(months) {
  const set = new Set(months);
  const out = [];
  for (let m = 0; m < 12; m++) {
    if (!set.has(m) || set.has((m + 11) % 12)) continue; // sirf shuruaat se
    let end = m;
    while (set.has((end + 1) % 12) && (end + 1) % 12 !== m) end = (end + 1) % 12;
    out.push([m, end]);
  }
  if (!out.length && set.size === 12) out.push([0, 11]);
  return out;
}

// Aaj se agla sahi mahina kitni door (0 = abhi)
function monthsUntil(months, now) {
  for (let d = 0; d < 12; d++) if (months.includes((now + d) % 12)) return d;
  return -1;
}

export default function SeasonWheel() {
  const { lang, t } = useLang();
  const month = useSyncExternalStore(subscribe, getMonth, getServerMonth);
  const now = month < 0 ? 0 : month;

  // Shuru mein: jo abhi lag sakta hai, warna jiska mausam sabse jaldi aa raha
  const defaultId = useMemo(() => {
    const sorted = [...SEASON_FRUITS].sort((a, b) => monthsUntil(a.months, now) - monthsUntil(b.months, now));
    return sorted[0].id;
  }, [now]);
  const [picked, setPicked] = useState(null);
  const fruit = SEASON_FRUITS.find((f) => f.id === (picked ?? defaultId));

  const short = MONTHS.short[lang];
  const full = MONTHS.full[lang];
  const until = monthsUntil(fruit.months, now);
  const windows = ranges(fruit.months)
    .map(([a, b]) => (a === b ? full[a] : `${full[a]} – ${full[b]}`))
    .join(" · ");

  // Ghadi ghumao: aaj ka mahina upar — tab, jab pahiya screen pe aaye (visitor ghoomna dekhe)
  const wheelRef = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.45 }
    );
    io.observe(wheelRef.current);
    return () => io.disconnect();
  }, []);
  const rot = seen ? -now * 30 : 0;

  return (
    <section className={styles.section} data-theme="light" aria-labelledby="season-title">
      <div className={`container ${styles.grid}`}>
        <header className={styles.head}>
          <p className="eyebrow">{t(SEASON.eyebrow)}</p>
          <h2 id="season-title" className={`display ${styles.title}`}>
            {t(SEASON.title)}
          </h2>
          <p className={styles.line}>{t(SEASON.line)}</p>
        </header>

        {/* ---------- Pahiya ---------- */}
        <div ref={wheelRef} className={styles.wheelWrap}>
          <svg className={styles.wheel} viewBox="0 0 400 400" role="img" aria-label={`${t(fruit.name)}: ${windows}`}>
            <defs>
              <clipPath id="season-coin">
                <circle cx={C} cy={C} r="86" />
              </clipPath>
            </defs>

            {/* "Abhi" ka teer — hamesha upar */}
            <path className={styles.pointer} d={`M${C - 9} 4 L${C + 9} 4 L${C} 18 Z`} />

            <g className={styles.ring} style={{ transform: `rotate(${rot}deg)` }}>
              {short.map((label, m) => {
                const a0 = m * 30 + GAP / 2;
                const a1 = (m + 1) * 30 - GAP / 2;
                const on = fruit.months.includes(m);
                const [lx, ly] = polar((R0 + R1) / 2, m * 30 + 15);
                return (
                  <g key={m}>
                    <path
                      d={sector(R0, R1, a0, a1)}
                      className={styles.seg}
                      data-on={on ? "true" : "false"}
                      data-now={m === now && month >= 0 ? "true" : "false"}
                      style={on ? { fill: fruit.color } : undefined}
                    />
                    <text
                      x={lx}
                      y={ly}
                      className={styles.label}
                      data-on={on ? "true" : "false"}
                      style={{ transform: `rotate(${-rot}deg)`, transformOrigin: `${lx}px ${ly}px` }}
                    >
                      {label}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Beech mein fal ka sikka */}
            <circle cx={C} cy={C} r="96" className={styles.coinRing} style={{ stroke: fruit.color }} />
            <image
              key={fruit.id}
              href={fruit.img}
              x={C - 86}
              y={C - 86}
              width="172"
              height="172"
              clipPath="url(#season-coin)"
              className={styles.coin}
              preserveAspectRatio="xMidYMid slice"
            />
          </svg>
          {month >= 0 ? (
            <span className={styles.nowTag}>
              {t(SEASON.now)} · {full[now]}
            </span>
          ) : null}
        </div>

        {/* ---------- Pehle chunav, phir jawab (card) ---------- */}
        <div className={styles.info}>
          <p className={styles.pick}>{t(SEASON.pick)}</p>
          <div className={styles.fruits} role="radiogroup" aria-label={t(SEASON.pick)}>
            {SEASON_FRUITS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={f.id === fruit.id}
                className={styles.fruitBtn}
                data-on={f.id === fruit.id ? "true" : "false"}
                style={{ "--c": f.color }}
                onClick={() => setPicked(f.id)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- chhoti optimised webp */}
                <img src={f.img} alt="" width="56" height="56" loading="lazy" />
                <span>{t(f.name)}</span>
              </button>
            ))}
          </div>

          <div className={styles.card} aria-live="polite">
            <p className={styles.fruitName}>{t(fruit.name)}</p>
            <p className={styles.best}>
              <span>{t(SEASON.bestTime)}:</span> {windows}
            </p>
            {month >= 0 ? (
              <p className={styles.status} data-now={until === 0 ? "true" : "false"}>
                {until === 0 ? t(SEASON.inSeason) : SEASON.nextIn[lang](full[(now + until) % 12], until)}
              </p>
            ) : null}
            {until !== 0 ? <p className={styles.ahead}>{t(SEASON.bookAhead)}</p> : null}
            <a
              href={whatsappLink(SEASON.message[lang](t(fruit.name)))}
              className={styles.cta}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
              {t(SEASON.cta)}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
