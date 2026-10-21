"use client";

import { useLang } from "@/i18n/LangProvider";
import PhotoStrip from "@/components/gallery/PhotoStrip/PhotoStrip";
import SampleTag from "../SampleTag/SampleTag";
import { GLIMPSE } from "../visitData";
import { isLive } from "../visitModel";
import { VT } from "../visitText";
import styles from "./NurseryGlimpse.module.css";

// "नर्सरी की झलक" — gate, shade-net, kalam, mother plants (client ki asli photos aate hi)
export default function NurseryGlimpse() {
  const { lang, t } = useLang();
  if (!isLive(GLIMPSE) || !GLIMPSE.photos?.length) return null;

  return (
    <section className={styles.section} aria-labelledby="glimpse-title">
      <div className={`container ${styles.head}`}>
        <h2 id="glimpse-title" className="h2">
          {t(VT.glimpse.title)} <SampleTag block={GLIMPSE} />
        </h2>
        <p className={styles.line}>{t(VT.glimpse.line)}</p>
      </div>
      <PhotoStrip
        photos={GLIMPSE.photos}
        label={t(VT.glimpse.label)}
        prevLabel={lang === "en" ? "Previous photo" : "पिछली फ़ोटो"}
        nextLabel={lang === "en" ? "Next photo" : "अगली फ़ोटो"}
      />
    </section>
  );
}
