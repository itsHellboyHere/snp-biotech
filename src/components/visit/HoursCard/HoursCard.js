"use client";

import { Clock } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { callLink } from "@/lib/site";
import SampleTag from "../SampleTag/SampleTag";
import { HOURS } from "../visitData";
import { DAY_NAMES, WEEK, fmtTime, isLive, nowIST } from "../visitModel";
import { useHydrated } from "@/components/plants/hooks";
import { VT } from "../visitText";
import styles from "./HoursCard.module.css";

const ORDER = [1, 2, 3, 4, 5, 6, 0]; // सोमवार se shuru

/* खुलने का समय — poora hafta, aaj ka din chamakta hai.
   Samay abhi confirm nahi → live site pe "आने से पहले कॉल करें" */
export default function HoursCard() {
  const { lang, t } = useLang();
  const hydrated = useHydrated(); // "aaj" sirf browser mein (India time se)
  const today = hydrated ? nowIST().day : -1;
  const live = isLive(HOURS);

  return (
    <div className={styles.card}>
      <h2 className={`h3 ${styles.title}`}>
        <Clock size={22} strokeWidth={1.8} aria-hidden="true" />
        {t(VT.hours.title)} <SampleTag block={HOURS} />
      </h2>

      {live ? (
        <>
          <ul className={styles.list}>
            {ORDER.map((d) => {
              const slots = WEEK[d] ?? [];
              const isToday = d === today;
              return (
                <li key={d} className={styles.row} data-today={isToday ? "true" : "false"}>
                  <span className={styles.day}>
                    {DAY_NAMES[lang][d]}
                    {isToday ? <span className={styles.todayTag}>{t(VT.hours.today)}</span> : null}
                  </span>
                  <span className={styles.time}>
                    {slots.length
                      ? slots.map((s) => `${fmtTime(s.open, lang)} – ${fmtTime(s.close, lang)}`).join(", ")
                      : t(VT.hours.closed)}
                  </span>
                </li>
              );
            })}
          </ul>
          {HOURS.note ? <p className={styles.note}>{t(HOURS.note)}</p> : null}
        </>
      ) : (
        <p className={styles.note}>
          {t(VT.hours.pending)}{" "}
          <a href={callLink()} className={styles.callLink}>
            {t(VT.call)} →
          </a>
        </p>
      )}
    </div>
  );
}
