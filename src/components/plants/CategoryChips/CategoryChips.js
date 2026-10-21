"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/i18n/LangProvider";
import { CATEGORIES, PLANTS } from "../plantsModel";
import { PT } from "../plantsText";
import styles from "./CategoryChips.module.css";

/* Category chips — scroll pe navbar ke neeche chipak jaate hain.
   Navbar chhupe (neeche scroll) to chips upar tak khisak jaate hain (html[data-nav]).
   Phone pe sideways swipe; chuna hua chip apne aap beech mein aa jaata hai. */
export default function CategoryChips({ value, onChange, resultCount }) {
  const { lang, t } = useLang();
  const rowRef = useRef(null);
  const options = [{ id: "all", label: PT.all, count: PLANTS.length }, ...CATEGORIES];

  useEffect(() => {
    const row = rowRef.current;
    const el = row?.querySelector('[aria-pressed="true"]');
    if (!row || !el) return;
    const left = el.offsetLeft - (row.clientWidth - el.offsetWidth) / 2;
    row.scrollTo({ left, behavior: "smooth" });
  }, [value]);

  return (
    <div className={styles.bar}>
      <div className={`container ${styles.inner}`}>
        <div ref={rowRef} className={styles.row} role="toolbar" aria-label={t(PT.chipsLabel)}>
          {options.map((c) => (
            <button
              key={c.id}
              type="button"
              className={styles.chip}
              aria-pressed={value === c.id}
              onClick={() => onChange(c.id)}
            >
              {t(c.label)}
              <span className={styles.n} lang="en">
                {c.count}
              </span>
            </button>
          ))}
        </div>
        <p className={styles.count} aria-live="polite">
          {PT.count[lang](resultCount)}
        </p>
      </div>
    </div>
  );
}
