"use client";

import { CalendarCheck, Leaf, PhoneCall, ShieldCheck, Sprout, Truck } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import SampleTag from "@/components/visit/SampleTag/SampleTag";
import { PROMISES } from "../storyData";
import { promises } from "../storyModel";
import { ST } from "../storyText";
import styles from "./StoryPromises.module.css";

// storyData mein icon ka naam → asli icon (naya chahiye to yahan jodo)
const ICONS = { sprout: Sprout, shield: ShieldCheck, calendar: CalendarCheck, phone: PhoneCall, truck: Truck, leaf: Leaf };

/* हमारे वादे (light) — 01–04 numbered cards, hover pe halka uthna
   Ye claims hain → PROMISES.confirmed client ke "haan" ke baad hi true */
export default function StoryPromises() {
  const { t } = useLang();
  const list = promises();
  if (!list.length) return null;

  return (
    <section className={styles.section} data-theme="light" aria-labelledby="promises-title">
      <div className="container">
        <header className={styles.head}>
          <p className="eyebrow">
            {t(ST.promises.eyebrow)} <SampleTag block={PROMISES} />
          </p>
          <h2 id="promises-title" className={`h1 ${styles.title}`}>
            {t(ST.promises.title)}
          </h2>
        </header>

        <ol className={styles.grid}>
          {list.map((p, i) => {
            const Icon = ICONS[p.icon] ?? Leaf;
            return (
              <li key={i} className={styles.card}>
                <div className={styles.top}>
                  <span className={styles.icon}>
                    <Icon size={22} strokeWidth={1.9} aria-hidden="true" />
                  </span>
                  <span className={styles.num} lang="en" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className={`h3 ${styles.cardTitle}`}>{t(p.title)}</h3>
                {p.line ? <p className={styles.line}>{t(p.line)}</p> : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
