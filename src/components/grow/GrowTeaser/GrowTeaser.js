"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import LocaleLink from "@/i18n/LocaleLink";
import { useLang } from "@/i18n/LangProvider";
import { STORY_SEGMENTS } from "@/components/story/storyConfig";
import { GROW_TEASER, TEASER_SLIDES, TEASER_INTERVAL } from "../growData";
import styles from "./GrowTeaser.module.css";

const PORTRAIT = "(max-aspect-ratio: 1/1)";

// Home pe "बीज से बाग़ तक" ka chhota card — poori film How We Grow page pe.
// Card mein paudhe ki 5 haalat dheere-dheere badalti hain (बीज → बाग़),
// upar chips batate hain abhi kaunsa kadam hai. Poora card ek link hai.
export default function GrowTeaser() {
  const { t } = useLang();
  const cardRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [running, setRunning] = useState(false);

  // Sirf dikhne pe chale (battery + data), Reduce Motion pe ruka rahe
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => setRunning(e.isIntersecting), { threshold: 0.25 });
    io.observe(cardRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % TEASER_SLIDES.length), TEASER_INTERVAL);
    return () => clearInterval(id);
  }, [running]);

  return (
    <section className={styles.section} data-theme="light" aria-labelledby="grow-teaser-title">
      <div className="container">
        <LocaleLink
          ref={cardRef}
          href={GROW_TEASER.href}
          className={styles.card}
          data-running={running ? "true" : "false"}
          style={{ "--interval": `${TEASER_INTERVAL}ms` }}
        >
          <div className={styles.slides} aria-hidden="true">
            {TEASER_SLIDES.map((s, i) => (
              <picture key={s.desktop} className={styles.slide} data-active={i === current ? "true" : "false"}>
                <source media={PORTRAIT} srcSet={s.mobile} />
                <img src={s.desktop} alt="" loading="lazy" decoding="async" />
              </picture>
            ))}
          </div>
          <div className={styles.shade} aria-hidden="true" />

          {/* Kadam: बीज · अंकुर · पौधा · फल · नर्सरी */}
          <ol className={styles.steps} aria-hidden="true">
            {TEASER_SLIDES.map((s, i) => (
              <li
                key={s.segment}
                className={styles.step}
                data-state={i < current ? "done" : i === current ? "active" : "next"}
              >
                <span className={styles.stepLabel}>{t(STORY_SEGMENTS[s.segment].label)}</span>
                <span className={styles.stepTrack}>
                  <span className={styles.stepFill} />
                </span>
              </li>
            ))}
          </ol>

          <div className={styles.copy}>
            <p className={`eyebrow ${styles.eyebrow}`}>{t(GROW_TEASER.eyebrow)}</p>
            <h2 id="grow-teaser-title" className={`h1 ${styles.title}`}>
              {t(GROW_TEASER.title)}
            </h2>
            <p className={styles.line}>{t(GROW_TEASER.line)}</p>
            <span className={styles.cta}>
              {t(GROW_TEASER.cta)}
              <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
            </span>
          </div>
        </LocaleLink>
      </div>
    </section>
  );
}
