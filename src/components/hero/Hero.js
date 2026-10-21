"use client";

import LocaleLink from "@/i18n/LocaleLink";
import { useLang } from "@/i18n/LangProvider";
import TiltedBand from "./TiltedBand/TiltedBand";
import TiltTile from "./TiltTile/TiltTile";
import { HERO, HERO_TILES } from "./heroData";
import { whatsappLink, WA_TEXT } from "@/lib/site";
import styles from "./Hero.module.css";

const renderTile = (item, k) => <TiltTile item={item} decorative={k !== 0} />;

export default function Hero() {
  const { t } = useLang();
  return (
    <section className={styles.hero} data-theme="light" aria-label="SNP Biotech">
      <div className={styles.glow} aria-hidden="true" />


      <div className={`container ${styles.top}`}>
        <p className={`eyebrow ${styles.eyebrow} ${styles.fadeUp}`} style={{ "--d": "0ms" }}>
          {t(HERO.eyebrow)}
        </p>
        <h1 className={`hero-title ${styles.title}`}>
          {t(HERO.titleLines).map((line, i) => (
            <span key={line} className={styles.mask}>
              <span className={styles.rise} style={{ "--d": `${120 + i * 110}ms` }}>
                {line}
              </span>
            </span>
          ))}
        </h1>
      </div>

      {/* Band beech wali row mein — heading aur buttons se kabhi nahi takrata */}
      <div className={styles.bandRow}>
        <TiltedBand items={HERO_TILES} renderTile={renderTile} />
      </div>

      <div className={`container ${styles.bottom}`}>
        <p className={`${styles.line} ${styles.fadeUp}`} style={{ "--d": "420ms" }}>
          {t(HERO.line)}
        </p>
        <div className={`${styles.actions} ${styles.fadeUp}`} style={{ "--d": "540ms" }}>
          <LocaleLink href={HERO.primary.href} className={styles.primary}>
            {t(HERO.primary.label)}
          </LocaleLink>
          <a
            href={whatsappLink(t(WA_TEXT.general))}
            className={styles.secondary}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t(HERO.secondary.label)}
          </a>
        </div>
      </div>
    </section>
  );
}
