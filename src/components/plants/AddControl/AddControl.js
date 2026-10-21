"use client";

import { Plus, Layers } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import QtyStepper from "../QtyStepper/QtyStepper";
import { useOrder, setQty, qtyOf, totalOf } from "../orderStore";
import { flyTo } from "../flyTo";
import { PT } from "../plantsText";
import styles from "./AddControl.module.css";

/* "सूची में जोड़ें" ↔ − 10 + — card, carousel aur detail teeno yahi use karte hain
   - mode "auto" (card): paudhe ki ek hi line list mein ho to usi ka stepper;
     2+ kismein judi hon to "2 किस्में · 50 पौधे" (tap → detail khulta hai)
   - mode "exact" (detail): sirf chuni hui kism ki ginti */
export default function AddControl({ plant, variety = null, mode = "auto", size = "md", flyFrom, onMulti, tone = "dark" }) {
  const { lang, t } = useLang();
  const { items } = useOrder();
  const mine = items.filter((it) => it.id === plant.id);

  const add = (v) => {
    setQty(plant.id, v, plant.step);
    flyTo(flyFrom?.current, plant.shot);
  };

  if (mode === "auto" && mine.length > 1) {
    return (
      <button type="button" className={styles.multi} data-size={size} onClick={onMulti}>
        <Layers size={16} strokeWidth={2} aria-hidden="true" />
        {PT.multi[lang](mine.length, totalOf(mine))}
      </button>
    );
  }

  const line = mode === "auto" ? mine[0] : null;
  const v = mode === "auto" ? line?.variety ?? null : variety;
  const qty = mode === "auto" ? line?.qty ?? 0 : qtyOf(items, plant.id, variety);

  if (!qty) {
    return (
      <button type="button" className={styles.add} data-size={size} data-tone={tone} onClick={() => add(v)}>
        <Plus size={size === "lg" ? 19 : 16} strokeWidth={2.4} aria-hidden="true" />
        <span className={styles.full}>{t(PT.add)}</span>
        <span className={styles.short}>{t(PT.addShort)}</span>
      </button>
    );
  }

  return <QtyStepper value={qty} step={plant.step} size={size} onChange={(n) => setQty(plant.id, v, n)} />;
}
