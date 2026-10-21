"use client";

import { useLang } from "@/i18n/LangProvider";
import { scriptLang } from "@/i18n/config";
import styles from "./TiltTile.module.css";

// Band ki ek tile ka andar ka design: ya to paudhe ki photo + naam,
// ya brand tile (dawn gradient + bada text).
// Naam page ki language mein bada, doosri language mein chhota (dono log pehchan lein).
export default function TiltTile({ item, decorative }) {
  const { t } = useLang();

  if (item.type === "brand") {
    return (
      <div className={styles.brand}>
        <span className={styles.brandBig}>{t(item.big)}</span>
        <span className={styles.brandSmall}>{t(item.small)}</span>
      </div>
    );
  }

  return (
    <figure className={styles.photo}>
      {/* Plain <img>: har tile 10–16 slices mein repeat hoti hai, next/image yahan bhaari padta */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.src} alt={decorative ? "" : t(item.alt)} draggable={false} loading="eager" />
      <figcaption className={styles.caption}>
        <span>{t(item.name)}</span>
        <span className={styles.en} lang={scriptLang(t(item.sub))}>
          {t(item.sub)}
        </span>
      </figcaption>
    </figure>
  );
}
