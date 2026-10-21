"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import styles from "./PhotoStrip.module.css";

/* Sideways photo ki patti (Visit page + aage Our Story mein bhi) — reusable
   photos: [{ src, w, h, alt: {hi,en}, caption: {hi,en} }]
   Phone pe swipe · desktop pe ‹ › buttons · photos lazy load */
export default function PhotoStrip({ photos = [], label, prevLabel = "Previous", nextLabel = "Next" }) {
  const { t } = useLang();
  const trackRef = useRef(null);
  const list = photos.filter((p) => p?.src);
  if (!list.length) return null;

  const scrollBy = (dir) => {
    const track = trackRef.current;
    const card = track?.firstElementChild;
    if (!card) return;
    track.scrollBy({ left: dir * (card.getBoundingClientRect().width + 14), behavior: "smooth" });
  };

  return (
    <div className={styles.wrap}>
      <ul ref={trackRef} className={styles.track} aria-label={label}>
        {list.map((p, i) => (
          <li key={`${p.src}-${i}`} className={styles.card}>
            <Image
              src={p.src}
              alt={t(p.alt) ?? ""}
              width={p.w ?? 1200}
              height={p.h ?? 800}
              sizes="(min-width: 900px) 560px, 82vw"
              className={styles.img}
            />
            {p.caption ? <p className={styles.caption}>{t(p.caption)}</p> : null}
          </li>
        ))}
      </ul>
      {list.length > 1 ? (
        <div className={`container ${styles.nav}`}>
          <button type="button" className={styles.btn} onClick={() => scrollBy(-1)} aria-label={prevLabel}>
            <ChevronLeft size={20} strokeWidth={2.2} aria-hidden="true" />
          </button>
          <button type="button" className={styles.btn} onClick={() => scrollBy(1)} aria-label={nextLabel}>
            <ChevronRight size={20} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
