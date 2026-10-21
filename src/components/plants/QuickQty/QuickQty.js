"use client";

import { useLang } from "@/i18n/LangProvider";
import { useOrder, setQty, qtyOf } from "../orderStore";
import { MAX_QTY } from "../plantsModel";
import { PT } from "../plantsText";
import styles from "./QuickQty.module.css";

// Bade order ke liye ek tap: +10 / +50 / +100 (abhi ki ginti mein judta hai)
export const QUICK_STEPS = [10, 50, 100];

export default function QuickQty({ plant, variety = null }) {
  const { t } = useLang();
  const { items } = useOrder();
  const qty = qtyOf(items, plant.id, variety);

  return (
    <div className={styles.row} role="group" aria-label={t(PT.quick)}>
      <span className={styles.label}>{t(PT.quick)}</span>
      {QUICK_STEPS.map((n) => (
        <button
          key={n}
          type="button"
          className={styles.chip}
          onClick={() => setQty(plant.id, variety, Math.min(MAX_QTY, qty + n))}
          lang="en"
        >
          +{n}
        </button>
      ))}
    </div>
  );
}
