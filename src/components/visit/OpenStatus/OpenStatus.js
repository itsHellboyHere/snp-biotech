"use client";

import { useSyncExternalStore } from "react";
import { useLang } from "@/i18n/LangProvider";
import { HOURS } from "../visitData";
import { DAY_NAMES, fmtTime, isLive, openStatus } from "../visitModel";
import { VT } from "../visitText";
import styles from "./OpenStatus.module.css";

// Har 30 second mein "abhi" ka minute — badge khud update hota rahe (server pe -1)
const subscribe = (cb) => {
  const id = setInterval(cb, 30000);
  return () => clearInterval(id);
};
const getMinute = () => Math.floor(Date.now() / 60000);
const getServer = () => -1;

/* 🟢 अभी खुली है · शाम 6 बजे तक   🟠 जल्द बंद होगी   ⚪ अभी बंद · कल सुबह 8 बजे खुलेगी
   India ke samay se (visitor kahin bhi ho). Placeholder samay live site pe nahi dikhta. */
export default function OpenStatus({ className = "" }) {
  const { lang } = useLang();
  const minute = useSyncExternalStore(subscribe, getMinute, getServer);
  if (!isLive(HOURS)) return null;
  // Server / pehla render: samay pata nahi → utni hi jagah ka khaali pill (layout na hile)
  if (minute < 0) return <span className={`${styles.badge} ${styles.ghost} ${className}`} aria-hidden="true" />;

  const s = openStatus(new Date(minute * 60000));
  if (!s) return null;

  let text;
  if (s.state === "closed") {
    const day =
      s.next.inDays === 0
        ? VT.status.today[lang]
        : s.next.inDays === 1
          ? VT.status.tomorrow[lang]
          : DAY_NAMES[lang][s.next.day];
    text = VT.status.closed[lang](day, fmtTime(s.next.at, lang));
  } else {
    text = VT.status[s.state][lang](fmtTime(s.closeAt, lang));
  }

  return (
    <span className={`${styles.badge} ${className}`} data-state={s.state} role="status">
      <span className={styles.dot} aria-hidden="true" />
      {text}
    </span>
  );
}
