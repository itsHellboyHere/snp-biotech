"use client";

import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import LocaleLink from "@/i18n/LocaleLink";
import { whatsappLink, WA_TEXT } from "@/lib/site";
import { ST } from "../storyText";
import styles from "./StoryCta.module.css";

/* Aakhri patti — "अगला छल्ला, आपके बाग़ का।" (home ke chhallon se jude)
   पौधे देखें (mukhya) · नर्सरी आइए · WhatsApp — teeno rasta aage */
export default function StoryCta() {
  const { lang, t } = useLang();

  return (
    <section className={styles.section} aria-labelledby="story-cta-title">
      <div className={styles.rings} aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} style={{ "--i": i }} />
        ))}
      </div>
      <div className={`container ${styles.inner}`}>
        <h2 id="story-cta-title" className={`display ${styles.title}`}>
          {t(ST.cta.title)}
        </h2>
        <p className={styles.line}>{t(ST.cta.line)}</p>
        <div className={styles.actions}>
          <LocaleLink href="/plants" className={styles.primary}>
            {t(ST.cta.plants)}
            <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
          </LocaleLink>
          <LocaleLink href="/contact" className={styles.secondary}>
            <MapPin size={18} strokeWidth={2} aria-hidden="true" />
            {t(ST.cta.visit)}
          </LocaleLink>
          <a
            href={whatsappLink(WA_TEXT.general[lang])}
            className={styles.secondary}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
            {t(ST.cta.whatsapp)}
          </a>
        </div>
      </div>
    </section>
  );
}
