"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Scale } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { useOrder, totalOf } from "../orderStore";
import { useCompare } from "../compareStore";
import { getPlant, getVariety } from "../plantsModel";
import { DOCK_TARGET_ID } from "../flyTo";
import { PT } from "../plantsText";
import styles from "./Dock.module.css";

const EASE = [0.16, 1, 0.3, 1];

/* Neeche tairti patti (Apple ka sticky "Buy" bar):
   [⚖ 2 · तुलना]  [🌱🌱 मेरी सूची · 100 पौधे  भेजें →]
   Kuch chuna hi nahi → chhupi rehti hai */
export default function Dock({ onOpenList, onOpenCompare, hidden = false }) {
  const { lang, t } = useLang();
  const { items } = useOrder();
  const compare = useCompare();
  const total = totalOf(items);
  const show = !hidden && (items.length > 0 || compare.length > 0);

  // Aakhri 3 jode gaye paudhon ki photo (ek ke upar ek)
  const thumbs = [...items]
    .reverse()
    .slice(0, 3)
    .map((it) => {
      const p = getPlant(it.id);
      return { key: `${it.id}|${it.variety}`, src: getVariety(p, it.variety)?.img ?? p?.shot };
    })
    .filter((x) => x.src);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className={styles.dock}
          data-order-dock
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <AnimatePresence initial={false}>
            {compare.length ? (
              <motion.button
                key="cmp"
                type="button"
                layout
                className={styles.cmp}
                onClick={onOpenCompare}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                aria-label={`${t(PT.cmp.open)} — ${PT.cmp.n[lang](compare.length)}`}
              >
                <Scale size={18} strokeWidth={2} aria-hidden="true" />
                <span className={styles.cmpN} lang="en">
                  {compare.length}
                </span>
                <span className={styles.cmpText}>{t(PT.cmp.open)}</span>
              </motion.button>
            ) : null}
          </AnimatePresence>

          {items.length ? (
            <motion.button
              layout
              type="button"
              className={styles.list}
              onClick={onOpenList}
              aria-label={`${t(PT.list.open)} — ${PT.list.total[lang](total)}`}
            >
              <span id={DOCK_TARGET_ID} className={styles.thumbs} aria-hidden="true">
                {thumbs.map((x, i) => (
                  <span key={x.key} className={styles.thumb} style={{ zIndex: 3 - i }}>
                    <Image src={x.src} alt="" width={36} height={36} />
                  </span>
                ))}
              </span>
              <span className={styles.text}>
                <span className={styles.kicker}>{t(PT.list.title)}</span>
                <motion.span key={total} className={styles.total} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                  {PT.list.total[lang](total)}
                </motion.span>
              </span>
              <span className={styles.go}>
                <span className={styles.goText}>{t(PT.list.go)}</span>
                <ArrowRight size={17} strokeWidth={2.4} aria-hidden="true" />
              </span>
            </motion.button>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
