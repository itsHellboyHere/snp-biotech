"use client";

import { Search, X } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { PT } from "../plantsText";
import styles from "./PlantsHeader.module.css";

/* Page ka upar wala hissa — chhota aur kaam ka (paudhe pehli screen mein hi dikhne chahiye)
   Title · ek line · search · "कैसे ऑर्डर करें" ke 3 kadam */
export default function PlantsHeader({ query, onQuery }) {
  const { t } = useLang();
  return (
    <header className={styles.head}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className="eyebrow">{t(PT.eyebrow)}</p>
          <h1 className={`h1 ${styles.title}`}>{t(PT.title)}</h1>
          <p className={styles.line}>{t(PT.line)}</p>
        </div>

        <div className={styles.side}>
          <form className={styles.search} role="search" onSubmit={(e) => e.preventDefault()}>
            <Search className={styles.icon} size={19} strokeWidth={2} aria-hidden="true" />
            <input
              className={styles.input}
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              spellCheck={false}
              maxLength={60}
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder={t(PT.searchPh)}
              aria-label={t(PT.searchLabel)}
            />
            {query ? (
              <button type="button" className={styles.clear} onClick={() => onQuery("")} aria-label={t(PT.clearSearch)}>
                <X size={16} strokeWidth={2.2} aria-hidden="true" />
              </button>
            ) : null}
          </form>

          <ol className={styles.how}>
            {PT.how.map((s, i) => (
              <li key={i}>
                <span className={styles.num} lang="en">
                  {i + 1}
                </span>
                {t(s)}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </header>
  );
}
