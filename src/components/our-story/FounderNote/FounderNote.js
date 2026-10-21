"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { LogoMark } from "@/components/nav/Logo";
import ScrollHighlight from "@/components/bagh/ScrollHighlight/ScrollHighlight";
import SampleTag from "@/components/visit/SampleTag/SampleTag";
import { FOUNDER } from "../storyData";
import { founder } from "../storyModel";
import { ST } from "../storyText";
import styles from "./FounderNote.module.css";

/* संस्थापक की बात (light) — unke shabd scroll ke saath ek-ek karke roshan hote hain
   (home page wala ScrollHighlight hi), [[khaas line]] sunehri ho jaati hai.
   Photo nahi → brand ke patte; naam/pad neeche hastakshar ki tarah */
export default function FounderNote() {
  const { t } = useLang();
  const f = founder();
  if (!f) return null;

  return (
    <section className={styles.section} data-theme="light" aria-labelledby="founder-title">
      <div className={`container ${styles.grid}`}>
        <figure className={styles.portrait}>
          {f.photo ? (
            <Image
              src={f.photo.src}
              alt={t(f.name)}
              width={f.photo.w}
              height={f.photo.h}
              sizes="(min-width: 1000px) 34vw, 70vw"
              className={styles.img}
            />
          ) : (
            <div className={styles.markBox} aria-hidden="true">
              <LogoMark className={styles.mark} />
            </div>
          )}
          <span className={styles.quoteBadge} aria-hidden="true">
            <Quote size={22} strokeWidth={2.2} />
          </span>
        </figure>

        <div className={styles.copy}>
          <p id="founder-title" className="eyebrow">
            {t(ST.founder.eyebrow)} <SampleTag block={FOUNDER} />
          </p>
          <blockquote className={styles.block}>
            <ScrollHighlight text={t(f.quote)} className={styles.quote} tone="light" />
          </blockquote>
          <div className={styles.sign}>
            <span className={styles.rule} aria-hidden="true" />
            <div>
              <p className={styles.name}>{t(f.name)}</p>
              <p className={styles.role}>{t(f.role)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
