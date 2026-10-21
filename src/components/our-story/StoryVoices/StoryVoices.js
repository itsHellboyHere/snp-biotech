"use client";

import { MessageCircle, Quote } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { whatsappLink } from "@/lib/site";
import SampleTag from "@/components/visit/SampleTag/SampleTag";
import { voices } from "../storyModel";
import { ST } from "../storyText";
import styles from "./StoryVoices.module.css";

/* किसानों की ज़ुबानी (dark) — SIRF asli testimonials (har ek ka apna confirmed)
   Ek bhi asli nahi → poora section live site pe chhup jaata hai (naqli kabhi nahi)
   Neeche "अपना अनुभव भेजिए" → WhatsApp — isi se asli testimonials jama honge */
export default function StoryVoices() {
  const { lang, t } = useLang();
  const list = voices();
  if (!list.length) return null;

  return (
    <section className={styles.section} aria-labelledby="voices-title">
      <div className="container">
        <header className={styles.head}>
          <p className="eyebrow">{t(ST.voices.eyebrow)}</p>
          <h2 id="voices-title" className={`h1 ${styles.title}`}>
            {t(ST.voices.title)}
          </h2>
        </header>
      </div>

      <ul className={styles.track}>
        {list.map((v, i) => (
          <li key={i} className={styles.card}>
            <figure className={styles.figure}>
              <Quote className={styles.mark} size={28} strokeWidth={2} aria-hidden="true" />
              <blockquote className={styles.quote}>
                <p>{t(v.quote)}</p>
              </blockquote>
              {v.plant ? <span className={styles.plant}>{t(v.plant)}</span> : null}
              <figcaption className={styles.who}>
                <span className={styles.avatar} aria-hidden="true">
                  {String(t(v.name) ?? "").replace(/[()]/g, "").trim().charAt(0) || "•"}
                </span>
                <span className={styles.meta}>
                  <span className={styles.name}>
                    {t(v.name)} <SampleTag block={v} />
                  </span>
                  <span className={styles.place}>
                    {[t(v.place), Number.isInteger(v.since) ? ST.voices.since[lang](v.since) : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className="container">
        <a
          href={whatsappLink(ST.voices.shareMsg[lang])}
          className={styles.share}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
          {t(ST.voices.share)}
        </a>
      </div>
    </section>
  );
}
