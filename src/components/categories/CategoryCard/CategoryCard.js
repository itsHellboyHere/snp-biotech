"use client";

import { useEffect, useRef } from "react";
import LocaleLink from "@/i18n/LocaleLink";
import { useLang } from "@/i18n/LangProvider";
import { scriptLang } from "@/i18n/config";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageCircle, ArrowRight } from "lucide-react";
import { whatsappLink, WA_TEXT } from "@/lib/site";
import { CARD_UI } from "../categoryData";
import styles from "./CategoryCard.module.css";

// Ek category card — upar text, neeche paudha.
// Scroll pe paudha halka sa upar tairta hai (parallax), hover pe thoda bada.
export default function CategoryCard({ item }) {
  const { lang, t } = useLang();
  const chips = t(item.chips);
  const cardRef = useRef(null);
  const mediaRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const phone = window.matchMedia("(max-width: 899px)").matches;
      gsap.fromTo(
        mediaRef.current,
        { yPercent: phone ? 4 : 10 },
        {
          yPercent: phone ? -2 : -3,
          ease: "none",
          scrollTrigger: { trigger: cardRef.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
        }
      );
    }, cardRef);
    return () => ctx.revert();
  }, []);

  return (
    <article ref={cardRef} className={`${styles.card} ${styles[item.theme]} ${item.dark ? styles.dark : ""}`}>
      <div className={styles.copy}>
        <p className={styles.label} lang={scriptLang(t(item.label))}>
          {t(item.label)}
        </p>
        <h3 className={styles.title}>{t(item.title)}</h3>
        <p className={styles.line}>{t(item.line)}</p>

        {chips.length > 1 ? (
          <ul className={styles.chips} aria-label={t(CARD_UI.chipsLabel)}>
            {chips.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        ) : null}

        <div className={styles.actions}>
          <LocaleLink href={item.href} className={styles.primary}>
            {t(CARD_UI.view)}
            <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
          </LocaleLink>
          <a
            href={whatsappLink(WA_TEXT.order[lang](t(item.order)))}
            className={styles.secondary}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />
            {t(CARD_UI.order)}
          </a>
        </div>
      </div>

      <div className={styles.stage}>
        <div ref={mediaRef} className={styles.media}>
          <Image
            src={item.img.src}
            alt={t(item.img.alt)}
            width={item.img.w}
            height={item.img.h}
            sizes="(max-width: 900px) 80vw, 40vw"
            className={styles.img}
          />
        </div>
      </div>
    </article>
  );
}
