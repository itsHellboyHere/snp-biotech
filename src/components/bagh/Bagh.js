"use client";

import { useLang } from "@/i18n/LangProvider";
import BaghReveal from "./BaghReveal/BaghReveal";
import ScrollHighlight from "./ScrollHighlight/ScrollHighlight";
import { WHY } from "./baghData";
import styles from "./Bagh.module.css";

// Home ka dark section: "बाग़" video-text reveal → "क्यों SNP" paragraph
export default function Bagh() {
  const { t } = useLang();
  return (
    <section className={styles.section} aria-labelledby="bagh-title">
      <BaghReveal />
      <div className={`container ${styles.why}`}>
        <ScrollHighlight eyebrow={t(WHY.eyebrow)} text={t(WHY.text)} />
      </div>
    </section>
  );
}
