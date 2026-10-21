"use client";

import { useEffect, useRef, useState } from "react";
import LocaleLink from "@/i18n/LocaleLink";
import { useLang } from "@/i18n/LangProvider";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import CategoryCard from "../CategoryCard/CategoryCard";
import { CATEGORIES, CATEGORY_INTRO } from "../categoryData";
import styles from "./PlantCategories.module.css";

const EASE = [0.16, 1, 0.3, 1];

// Home ka "हमारे पौधे" section
// Desktop: 2×2 grid · Phone: horizontal swipe (ek card + agle ki jhalak) + dots
export default function PlantCategories() {
  const { t } = useLang();
  const trackRef = useRef(null);
  const cellRefs = useRef([]);
  const [current, setCurrent] = useState(0);

  // Phone pe kaunsa card beech mein hai → dot highlight
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(Number(e.target.dataset.index));
        });
      },
      { root: track, threshold: 0.6 }
    );
    cellRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const goTo = (i) => {
    const track = trackRef.current;
    const cell = cellRefs.current[i];
    if (!track || !cell) return;
    track.scrollTo({ left: cell.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft), behavior: "smooth" });
  };

  return (
    <section id="plants-home" className={styles.section} data-theme="light" aria-labelledby="plants-title">
      <div className={`container ${styles.head}`}>
        <div className={styles.headText}>
          <p className="eyebrow">{t(CATEGORY_INTRO.eyebrow)}</p>
          <h2 id="plants-title" className={`display ${styles.title}`}>
            {t(CATEGORY_INTRO.title)}
          </h2>
          <p className={styles.line}>{t(CATEGORY_INTRO.line)}</p>
        </div>
        <LocaleLink href={CATEGORY_INTRO.all.href} className={styles.all}>
          {t(CATEGORY_INTRO.all.label)}
          <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </LocaleLink>
      </div>

      {/* Animation poori patti pe trigger hoti hai (har card pe alag nahi) — phone pe
          agla card side mein screen se bahar hota hai, alag trigger pe wo kabhi "dikhta"
          hi nahi tha aur jhalak (peek) khaali reh jaati thi */}
      <motion.div
        ref={trackRef}
        className={styles.track}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      >
        {CATEGORIES.map((item, i) => (
          <motion.div
            key={item.id}
            ref={(el) => {
              cellRefs.current[i] = el;
            }}
            data-index={i}
            className={styles.cell}
            variants={{
              hidden: { opacity: 0, y: 40 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
            }}
          >
            <CategoryCard item={item} />
          </motion.div>
        ))}
      </motion.div>

      <div className={styles.dots} role="tablist" aria-label={t(CATEGORY_INTRO.dotsLabel)}>
        {CATEGORIES.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={current === i}
            aria-label={t(item.title)}
            className={styles.dot}
            data-on={current === i ? "true" : "false"}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
