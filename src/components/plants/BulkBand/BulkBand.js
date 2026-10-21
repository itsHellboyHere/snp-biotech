"use client";

import { MessageCircle, Phone } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { whatsappLink, callLink } from "@/lib/site";
import { PT } from "../plantsText";
import styles from "./BulkBand.module.css";

// Page ke aakhir mein: "100+ पौधे चाहिए?" — seedha call / WhatsApp
export default function BulkBand() {
  const { lang, t } = useLang();
  return (
    <section className={styles.section} aria-labelledby="bulk-title">
      <div className="container">
        <div className={styles.card}>
          <div className={styles.glow} aria-hidden="true" />
          <p className={`eyebrow ${styles.eyebrow}`}>{t(PT.bulk.eyebrow)}</p>
          <h2 id="bulk-title" className={`display ${styles.title}`}>
            {t(PT.bulk.title)}
          </h2>
          <p className={styles.line}>{t(PT.bulk.line)}</p>
          <div className={styles.actions}>
            <a href={callLink()} className={styles.secondary}>
              <Phone size={18} strokeWidth={2} aria-hidden="true" />
              {t(PT.bulk.call)}
            </a>
            <a
              href={whatsappLink(PT.bulk.msg[lang])}
              className={styles.primary}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
              {t(PT.bulk.whatsapp)}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
