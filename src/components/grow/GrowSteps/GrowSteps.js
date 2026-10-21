"use client";

import { motion } from "motion/react";
import { useLang } from "@/i18n/LangProvider";
import { GROW_STEPS } from "../growData";
import styles from "./GrowSteps.module.css";

const EASE = [0.16, 1, 0.3, 1];

// How We Grow page — film ke baad "हमारा तरीका": 5 kadam, ek ke neeche ek.
// Desktop: number | naam | detail ek line mein · Phone: number + naam, neeche detail
export default function GrowSteps() {
  const { t } = useLang();
  return (
    <section className={styles.section} data-theme="light" aria-labelledby="grow-steps-title">
      <div className="container">
        <header className={styles.head}>
          <p className="eyebrow">{t(GROW_STEPS.eyebrow)}</p>
          <h2 id="grow-steps-title" className={`display ${styles.title}`}>
            {t(GROW_STEPS.title)}
          </h2>
        </header>

        <ol className={styles.list}>
          {GROW_STEPS.steps.map((step, i) => (
            <motion.li
              key={step.title.en}
              className={styles.row}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
            >
              <span className={styles.num} lang="en" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={`h3 ${styles.name}`}>{t(step.title)}</h3>
              <p className={styles.line}>{t(step.line)}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
