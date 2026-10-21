"use client";

import { AnimatePresence, motion } from "motion/react";
import { SearchX, MessageCircle } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { whatsappLink } from "@/lib/site";
import PlantCard from "../PlantCard/PlantCard";
import { PT } from "../plantsText";
import styles from "./PlantGrid.module.css";

const EASE = [0.16, 1, 0.3, 1];

/* Cards ka grid — filter badle to cards apni nayi jagah smooth khiskte hain (layout animation),
   jo hat rahe hain woh halke se ghul jaate hain. Phone 2 · tablet 3 · desktop 4 column. */
export default function PlantGrid({ plants, query, onOpen, onCompareFull, onReset }) {
  const { lang, t } = useLang();

  if (!plants.length) {
    const q = query.trim();
    return (
      <div className={styles.empty} role="status">
        <SearchX size={34} strokeWidth={1.6} aria-hidden="true" />
        <h3 className={`h3 ${styles.emptyTitle}`}>{t(PT.empty.title)}</h3>
        <p className={styles.emptyLine}>{t(PT.empty.line)}</p>
        <div className={styles.emptyActions}>
          <a
            className={styles.ask}
            href={whatsappLink(PT.askMsg[lang](q.slice(0, 60)))}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={17} strokeWidth={2} aria-hidden="true" />
            {t(PT.empty.ask)}
          </a>
          <button type="button" className={styles.reset} onClick={onReset}>
            {t(PT.empty.reset)}
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.ul className={styles.grid} layout="position" transition={{ duration: 0.6, ease: EASE }}>
      <AnimatePresence mode="popLayout">
        {plants.map((p, i) => (
          <motion.li
            key={p.id}
            className={styles.item}
            layout
            // Scroll pe neeche se halke-halke, ek row ke cards thoda aage-peeche
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "0px 0px -40px 0px" }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
            transition={{ duration: 0.7, ease: EASE, delay: (i % 4) * 0.06 }}
          >
            <PlantCard plant={p} onOpen={onOpen} onCompareFull={onCompareFull} priority={i < 4} />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
