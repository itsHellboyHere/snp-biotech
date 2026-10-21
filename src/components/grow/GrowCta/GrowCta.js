"use client";

import { MessageCircle, ArrowRight } from "lucide-react";
import LocaleLink from "@/i18n/LocaleLink";
import { useLang } from "@/i18n/LangProvider";
import { whatsappLink, WA_TEXT } from "@/lib/site";
import { GROW_CTA } from "../growData";
import styles from "./GrowCta.module.css";

// Page ke aakhir mein: "पौधे चाहिए?" — WhatsApp + Plants page
export default function GrowCta() {
  const { t } = useLang();
  return (
    <section className={styles.section} data-theme="light">
      <div className="container">
        <div className={styles.card}>
          <div className={styles.glow} aria-hidden="true" />
          <h2 className={`h1 ${styles.title}`}>{t(GROW_CTA.title)}</h2>
          <p className={styles.line}>{t(GROW_CTA.line)}</p>
          <div className={styles.actions}>
            <a
              href={whatsappLink(t(WA_TEXT.general))}
              className={styles.primary}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
              {t(GROW_CTA.whatsapp)}
            </a>
            <LocaleLink href={GROW_CTA.plants.href} className={styles.secondary}>
              {t(GROW_CTA.plants.label)}
              <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
            </LocaleLink>
          </div>
        </div>
      </div>
    </section>
  );
}
