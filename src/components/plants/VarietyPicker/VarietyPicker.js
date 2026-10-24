"use client";

import Image from "@/components/media/SmartImage";
import { useLang } from "@/i18n/LangProvider";
import { scriptLang } from "@/i18n/config";
import { PT } from "../plantsText";
import styles from "./VarietyPicker.module.css";

/* MacBook ke rang chunne jaisa: kism ka gola dabao → upar ki photo badal jaati hai.
   Photo wali kism = gol photo · bina photo = naam wala chip */
export default function VarietyPicker({ plant, value, onChange }) {
  const { t } = useLang();
  if (!plant.varieties.length) return null;
  // value null = "किस्म: आप सलाह दें" (card se bina kism joda tha) — koi gola chuna hua nahi
  const current = plant.varieties.find((v) => v.id === value) ?? null;
  const label = current ? t(current.name) : null;

  return (
    <div className={styles.wrap}>
      <div className={styles.row} role="radiogroup" aria-label={t(PT.variety)}>
        {plant.varieties.map((v) => {
          const on = v.id === current?.id;
          const name = t(v.name);
          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={on}
              className={v.img ? styles.swatch : styles.chip}
              data-on={on ? "true" : "false"}
              onClick={() => onChange(v.id)}
              title={name}
              aria-label={v.img ? name : undefined}
            >
              {v.img ? (
                <span className={styles.swatchInner}>
                  <Image src={v.img} alt="" width={52} height={52} className={styles.swatchImg} />
                </span>
              ) : (
                <span lang={scriptLang(name)}>{name}</span>
              )}
            </button>
          );
        })}
      </div>
      <p className={styles.current} aria-live="polite">
        {current ? (
          <>
            <span className={styles.kicker}>{t(PT.variety)}:</span>{" "}
            <strong lang={scriptLang(label)}>{label}</strong>
            {current.note ? <span className={styles.note}> — {t(current.note)}</span> : null}
          </>
        ) : (
          <span className={styles.kicker}>
            {t(PT.list.anyVariety)} · {t(PT.variety)} ↑
          </span>
        )}
      </p>
    </div>
  );
}
