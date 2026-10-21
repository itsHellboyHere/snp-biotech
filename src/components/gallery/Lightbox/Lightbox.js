"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { useHydrated } from "@/components/plants/hooks";
import styles from "./Lightbox.module.css";

/* =========================================================
   Photo bada karke dekhna — reusable (Our Story gallery, aage kahin bhi)
   <Lightbox photos={[...]} index={2 | null} onIndex={setIndex} labels={{close, prev, next}} />
   - index null = band
   - Esc band · ← → aage-peeche · phone pe swipe · neeche khinchne pe band
   - Khulte hi page ka scroll ruk jaata hai (Lenis bhi), band hote hi wahi button pe focus wapas
   ========================================================= */

const EASE = [0.16, 1, 0.3, 1];
const SWIPE = 70; // px — itna khinchne pe agli photo

export default function Lightbox({ photos = [], index, onIndex, labels = {} }) {
  const { t } = useLang();
  const hydrated = useHydrated(); // portal sirf browser mein (server pe document nahi hota)
  const open = index != null && photos[index] != null;
  const n = photos.length;
  const closeRef = useRef(null);
  const backTo = useRef(null);

  const go = (d) => onIndex(((index + d) % n + n) % n);
  const close = () => onIndex(null);

  // Keyboard + scroll lock + focus
  useEffect(() => {
    if (!open) return;
    backTo.current = document.activeElement;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    window.__lenis?.stop();
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      html.style.overflow = prevOverflow;
      window.__lenis?.start();
      backTo.current?.focus?.({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onIndex(null);
      else if (e.key === "ArrowRight" && n > 1) onIndex((index + 1) % n);
      else if (e.key === "ArrowLeft" && n > 1) onIndex((index - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, n, onIndex]);

  if (!hydrated) return null;
  const p = open ? photos[index] : null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="lightbox"
          className={styles.backdrop}
          role="dialog"
          aria-modal="true"
          aria-label={t(p.alt) || undefined}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          data-lenis-prevent
        >
          <div className={styles.bar}>
            <span className={styles.count} lang="en">
              {index + 1} / {n}
            </span>
            <button ref={closeRef} type="button" className={styles.btn} onClick={close} aria-label={labels.close ?? "Close"}>
              <X size={22} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.stage} onClick={(e) => e.target === e.currentTarget && close()}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.figure
                key={p.src + index}
                className={styles.figure}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EASE }}
                drag
                dragSnapToOrigin
                dragElastic={0.6}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                onDragEnd={(_, info) => {
                  const { x, y } = info.offset;
                  if (Math.abs(y) > 120 && Math.abs(y) > Math.abs(x)) close();
                  else if (n > 1 && x < -SWIPE) go(1);
                  else if (n > 1 && x > SWIPE) go(-1);
                }}
              >
                <Image
                  src={p.src}
                  alt={t(p.alt) ?? ""}
                  width={p.w ?? 1600}
                  height={p.h ?? 1066}
                  sizes="(min-width: 1200px) 1100px, 100vw"
                  className={styles.img}
                  draggable={false}
                  priority
                />
                {p.caption ? <figcaption className={styles.caption}>{t(p.caption)}</figcaption> : null}
              </motion.figure>
            </AnimatePresence>
          </div>

          {n > 1 ? (
            <>
              <button
                type="button"
                className={`${styles.btn} ${styles.prev}`}
                onClick={() => go(-1)}
                aria-label={labels.prev ?? "Previous"}
              >
                <ChevronLeft size={24} strokeWidth={2} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.next}`}
                onClick={() => go(1)}
                aria-label={labels.next ?? "Next"}
              >
                <ChevronRight size={24} strokeWidth={2} aria-hidden="true" />
              </button>
            </>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
