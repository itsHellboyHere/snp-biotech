"use client";

import { ArrowRight, Home, MessageCircle } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import LocaleLink from "@/i18n/LocaleLink";
import { LogoMark } from "@/components/nav/Logo";
import { whatsappLink, WA_TEXT } from "@/lib/site";
import styles from "./NotFound.module.css";

const TEXT = {
  eyebrow: { hi: "पेज नहीं मिला", en: "Page not found" },
  title: { hi: "यह क्यारी अभी खाली है।", en: "This bed is still empty." },
  line: {
    hi: "जो पेज आप ढूँढ रहे थे, वह यहाँ नहीं है — शायद लिंक पुराना है। पौधे देखिए या सीधे हमसे पूछिए।",
    en: "The page you were looking for isn't here — the link may be old. Browse our plants or just ask us.",
  },
  plants: { hi: "पौधे देखें", en: "Browse plants" },
  home: { hi: "होम", en: "Home" },
  wa: { hi: "WhatsApp करें", en: "WhatsApp us" },
};

// 404 — galat / purana link. Google ko 404 status apne aap jaata hai (index nahi hota).
export default function NotFound() {
  const { lang, t } = useLang();
  return (
    <main id="main" className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.mark} aria-hidden="true">
          <span lang="en">4</span>
          <LogoMark className={styles.leaf} />
          <span lang="en">4</span>
        </div>
        <p className="eyebrow">{t(TEXT.eyebrow)}</p>
        <h1 className={`h1 ${styles.title}`}>{t(TEXT.title)}</h1>
        <p className={styles.line}>{t(TEXT.line)}</p>
        <div className={styles.actions}>
          <LocaleLink href="/plants" className={styles.primary}>
            {t(TEXT.plants)}
            <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
          </LocaleLink>
          <LocaleLink href="/" className={styles.secondary}>
            <Home size={18} strokeWidth={2} aria-hidden="true" />
            {t(TEXT.home)}
          </LocaleLink>
          <a href={whatsappLink(WA_TEXT.general[lang])} className={styles.secondary} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
            {t(TEXT.wa)}
          </a>
        </div>
      </div>
    </main>
  );
}
