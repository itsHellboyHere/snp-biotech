"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import SampleTag from "@/components/visit/SampleTag/SampleTag";
import SinceSeal from "../SinceSeal/SinceSeal";
import { HERO_PHOTO } from "../storyData";
import { FOUNDED_YEAR, heroPhoto } from "../storyModel";
import { ST } from "../storyText";
import styles from "./StoryHero.module.css";

/* Upar ka hissa (dark): "एक कलम से शुरू हुआ भरोसा।" + nursery ki photo + ghoomti "SINCE 2016" mohar
   Photo confirm nahi → bada sunehra saal (2016) dikhta hai, khaali dabba kabhi nahi */
export default function StoryHero() {
  const { lang, t } = useLang();
  const photo = heroPhoto();

  const toJourney = (e) => {
    const el = document.getElementById("journey");
    if (!el) return;
    e.preventDefault();
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -8 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={`eyebrow ${styles.rise}`}>{t(ST.hero.eyebrow)}</p>
          <h1 className={`display ${styles.title} ${styles.rise}`}>{t(ST.hero.title)}</h1>
          <p className={`${styles.line} ${styles.rise}`}>{ST.hero.line[lang](FOUNDED_YEAR)}</p>
          <a href="#journey" className={`${styles.scroll} ${styles.rise}`} onClick={toJourney}>
            <span className={styles.scrollIcon}>
              <ArrowDown size={18} strokeWidth={2} aria-hidden="true" />
            </span>
            {t(ST.hero.scroll)}
          </a>
        </div>

        <div className={`${styles.media} ${styles.riseMedia}`}>
          {photo ? (
            <div className={styles.photo}>
              <Image
                src={photo.src}
                alt={t(photo.alt)}
                width={photo.w}
                height={photo.h}
                sizes="(min-width: 1000px) 48vw, 100vw"
                className={styles.img}
                priority
              />
              <span className={styles.tag}>
                <SampleTag block={HERO_PHOTO} />
              </span>
            </div>
          ) : (
            <div className={styles.yearBox} aria-hidden="true">
              <span className={`${styles.bigYear} text-gradient`} lang="en">
                {FOUNDED_YEAR}
              </span>
            </div>
          )}
          <SinceSeal text={ST.hero.seal(FOUNDED_YEAR)} className={styles.seal} />
        </div>
      </div>
    </header>
  );
}
