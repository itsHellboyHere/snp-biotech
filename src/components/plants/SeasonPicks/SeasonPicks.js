"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "@/components/media/SmartImage";
import { Pause, Play } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { scriptLang } from "@/i18n/config";
import AddControl from "../AddControl/AddControl";
import { useMonth } from "../hooks";
import { PLANTS, seasonInfo, monthName } from "../plantsModel";
import { PT } from "../plantsText";
import styles from "./SeasonPicks.module.css";

const DURATION = 5000; // har card kitni der (ms)
const MAX = 6;

/* =========================================================
   "अभी लगाने का मौसम" — Apple ke "Get the highlights" jaisa carousel
   - Aaj ke mahine se khud chunta hai: abhi lagne wale paudhe pehle,
     warna jinka mausam sabse paas hai ("दिसंबर से · 2 महीने बाद")
   - Apne aap aage badhta hai (screen pe ho tab), neeche dots mein progress
   - Haath lagaya (swipe/drag) to ruk jaata hai · ⏯ button
   ========================================================= */
export default function SeasonPicks({ onOpen }) {
  const { lang, other, t } = useLang();
  const month = useMonth();
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);

  const picks = useMemo(() => {
    if (month < 0) return [];
    const ranked = PLANTS.map((p) => ({ p, s: seasonInfo(p, month) }))
      .filter((x) => x.s)
      .sort((a, b) => a.s.inMonths - b.s.inMonths || a.p.order - b.p.order);
    const now = ranked.filter((x) => x.s.now);
    return (now.length >= 2 ? now : ranked).slice(0, MAX);
  }, [month]);
  const anyNow = picks.some((x) => x.s.now);

  // Kaunsa card abhi beech mein hai — scroll se nikaalo
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    const first = track?.firstElementChild;
    if (!first) return;
    const step = first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || "0");
    // Desktop pe aakhri 2-3 card ek saath dikhte hain → end tak pahunche = aakhri card active
    const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
    const i = atEnd ? picks.length - 1 : Math.round(track.scrollLeft / step);
    setActive(Math.min(picks.length - 1, Math.max(0, i)));
  }, [picks.length]);

  const goTo = useCallback((i) => {
    const track = trackRef.current;
    const el = track?.children[i];
    if (!el) return;
    track.scrollTo({ left: el.offsetLeft - track.firstElementChild.offsetLeft, behavior: "smooth" });
  }, []);

  // Screen pe hai tabhi chale
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [picks.length]);

  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const running = playing && inView && !reduced && picks.length > 1;

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => goTo((active + 1) % picks.length), DURATION);
    return () => clearTimeout(id);
  }, [running, active, picks.length, goTo]);

  const stop = () => setPlaying(false);
  const title = anyNow ? PT.picks.titleNow : PT.picks.titleNext;
  const eyebrow =
    month < 0
      ? t(PT.picks.eyebrowFallback)
      : (anyNow ? PT.picks.eyebrowNow : PT.picks.eyebrowNext)[lang](monthName(month, lang));

  return (
    <section className={styles.section} aria-labelledby="picks-title">
      <div className={`container ${styles.head}`}>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="picks-title" className={`h2 ${styles.title}`}>
            {month < 0 ? <span className={styles.ghostText}>&nbsp;</span> : t(title)}
          </h2>
        </div>
      </div>

      <ul
        ref={trackRef}
        className={styles.track}
        onScroll={onScroll}
        onPointerDown={stop}
        onWheel={(e) => Math.abs(e.deltaX) > Math.abs(e.deltaY) && stop()}
        aria-label={t(PT.picks.label)}
      >
        {month < 0
          ? Array.from({ length: 3 }, (_, i) => <li key={i} className={`${styles.card} ${styles.skeleton}`} />)
          : picks.map(({ p, s }, i) => {
              const name = t(p.name);
              return (
                <li key={p.id} className={styles.card} data-active={i === active ? "true" : "false"}>
                  <Image
                    src={p.tree}
                    alt=""
                    fill
                    sizes="(min-width: 1000px) 420px, (min-width: 640px) 46vw, 80vw"
                    className={styles.img}
                    priority={i === 0}
                  />
                  <div className={styles.shade} aria-hidden="true" />
                  <span className={styles.badge} data-now={s.now ? "true" : "false"}>
                    {s.now ? t(PT.picks.now) : PT.picks.soon[lang](monthName(s.month, lang), s.inMonths)}
                  </span>
                  <div className={styles.copy}>
                    <h3 className={styles.name} lang={scriptLang(name)}>
                      <button type="button" className={styles.open} onClick={() => onOpen(p.id)} aria-label={PT.open[lang](name)}>
                        {name}
                      </button>
                    </h3>
                    <p className={styles.sub} lang={other}>
                      {p.name[other]}
                    </p>
                    {p.line ? <p className={styles.line}>{t(p.line)}</p> : null}
                    <div className={styles.action}>
                      <AddControl plant={p} tone="lime" onMulti={() => onOpen(p.id)} />
                    </div>
                  </div>
                </li>
              );
            })}
      </ul>

      {picks.length > 1 ? (
        <div className={styles.controls}>
          <div className={styles.dots}>
            {picks.map(({ p }, i) => (
              <button
                key={p.id}
                type="button"
                className={styles.dot}
                data-active={i === active ? "true" : "false"}
                aria-label={PT.picks.goTo[lang](t(p.name))}
                aria-current={i === active ? "true" : undefined}
                onClick={() => {
                  stop();
                  goTo(i);
                }}
              >
                {i === active ? (
                  <span
                    key={`${active}-${running}`}
                    className={styles.fill}
                    data-running={running ? "true" : "false"}
                    style={{ "--dur": `${DURATION}ms` }}
                  />
                ) : null}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={styles.play}
            onClick={() => setPlaying((v) => !v)}
            aria-label={t(playing ? PT.picks.pause : PT.picks.play)}
          >
            {playing ? <Pause size={16} strokeWidth={2.2} aria-hidden="true" /> : <Play size={16} strokeWidth={2.2} aria-hidden="true" />}
          </button>
        </div>
      ) : null}
    </section>
  );
}
