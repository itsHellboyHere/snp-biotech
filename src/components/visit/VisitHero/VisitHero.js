"use client";

import Image from "@/components/media/SmartImage";
import { MapPin, Navigation, Phone, MessageCircle } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { LogoMark } from "@/components/nav/Logo";
import { site, callLink, whatsappLink } from "@/lib/site";
import OpenStatus from "../OpenStatus/OpenStatus";
import SampleTag from "../SampleTag/SampleTag";
import { HERO_PHOTO } from "../visitData";
import { directionsUrl, isLive } from "../visitModel";
import { VT } from "../visitText";
import styles from "./VisitHero.module.css";

/* Page ka upar wala hissa: khuli/band · pata · [रास्ता] [कॉल] [WhatsApp] · nursery ki photo
   Photo abhi placeholder hai → live site pe tab tak brand ke patte dikhenge */
export default function VisitHero() {
  const { lang, t } = useLang();
  const dir = directionsUrl();
  const showPhoto = isLive(HERO_PHOTO);

  return (
    <header className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className="eyebrow">{t(VT.eyebrow)}</p>
          <h1 className={`h1 ${styles.title}`}>{t(VT.title)}</h1>
          <p className={styles.line}>{t(VT.line)}</p>

          <OpenStatus />

          {site.address ? (
            <p className={styles.address}>
              <MapPin size={18} strokeWidth={2} aria-hidden="true" />
              <span>{t(site.address)}</span>
            </p>
          ) : null}

          <div className={styles.actions}>
            {dir ? (
              <a href={dir} className={styles.primary} target="_blank" rel="noopener noreferrer">
                <Navigation size={18} strokeWidth={2} aria-hidden="true" />
                {t(VT.directions)}
              </a>
            ) : null}
            <a href={callLink()} className={styles.secondary}>
              <Phone size={18} strokeWidth={2} aria-hidden="true" />
              {t(VT.call)}
            </a>
            <a
              href={whatsappLink(VT.visitMsg[lang])}
              className={styles.secondary}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
              {t(VT.whatsapp)}
            </a>
          </div>
        </div>

        <div className={styles.media}>
          {showPhoto ? (
            <>
              <Image
                src={HERO_PHOTO.src}
                alt={t(HERO_PHOTO.alt)}
                width={HERO_PHOTO.w}
                height={HERO_PHOTO.h}
                sizes="(min-width: 1000px) 46vw, 100vw"
                className={styles.img}
                priority
              />
              <span className={styles.tag}>
                <SampleTag block={HERO_PHOTO} />
              </span>
            </>
          ) : (
            <div className={styles.markBox} aria-hidden="true">
              <LogoMark className={styles.mark} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
