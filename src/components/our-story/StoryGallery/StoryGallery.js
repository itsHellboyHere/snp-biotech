"use client";

import Image from "@/components/media/SmartImage";
import { useState } from "react";
import { Expand } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import Lightbox from "@/components/gallery/Lightbox/Lightbox";
import SampleTag from "@/components/visit/SampleTag/SampleTag";
import { GALLERY } from "../storyData";
import { galleryPhotos } from "../storyModel";
import { ST } from "../storyText";
import styles from "./StoryGallery.module.css";

/* नर्सरी की तस्वीरें — bento grid (pehli photo sabse badi), tap karo → bada karke (Lightbox)
   Photos jitni bhi hon, grid apne aap aage badhta hai */
export default function StoryGallery() {
  const { t } = useLang();
  const photos = galleryPhotos();
  const [index, setIndex] = useState(null);
  if (!photos.length) return null;

  return (
    <section className={styles.section} data-theme="light" aria-labelledby="gallery-title">
      <div className="container">
        <header className={styles.head}>
          <p className="eyebrow">
            {t(ST.gallery.eyebrow)} <SampleTag block={GALLERY} />
          </p>
          <h2 id="gallery-title" className={`h1 ${styles.title}`}>
            {t(ST.gallery.title)}
          </h2>
        </header>

        <ul className={styles.grid} aria-label={t(ST.gallery.label)}>
          {photos.map((p, i) => (
            <li key={`${p.src}-${i}`} className={styles.tile}>
              <button
                type="button"
                className={styles.open}
                onClick={() => setIndex(i)}
                aria-label={`${t(ST.gallery.open)}: ${t(p.caption ?? p.alt)}`}
              >
                <Image
                  src={p.src}
                  alt={t(p.alt) ?? ""}
                  width={p.w}
                  height={p.h}
                  sizes={i === 0 ? "(min-width: 900px) 50vw, 100vw" : "(min-width: 900px) 25vw, 50vw"}
                  className={styles.img}
                />
                <span className={styles.shade} aria-hidden="true" />
                {p.caption ? <span className={styles.caption}>{t(p.caption)}</span> : null}
                <span className={styles.expand} aria-hidden="true">
                  <Expand size={16} strokeWidth={2.2} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Lightbox
        photos={photos}
        index={index}
        onIndex={setIndex}
        labels={{ close: t(ST.lightbox.close), prev: t(ST.lightbox.prev), next: t(ST.lightbox.next) }}
      />
    </section>
  );
}
