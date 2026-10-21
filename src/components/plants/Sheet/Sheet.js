"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useDragControls } from "motion/react";
import { X } from "lucide-react";
import { useHydrated, useMedia } from "../hooks";
import styles from "./Sheet.module.css";

const EASE = [0.16, 1, 0.3, 1];

/* =========================================================
   Sheet — phone ke app jaisa panel
   - Phone: neeche se upar aata hai, handle ko neeche kheencho → band
   - Desktop: variant "panel" = daayein se side panel · "modal" = beech mein bada card
   - Esc / bahar click → band · peeche ka page scroll nahi hota · focus andar
   ========================================================= */
export default function Sheet({ open, onClose, label, closeLabel = "Close", variant = "panel", header, footer, children }) {
  const hydrated = useHydrated();
  const wide = useMedia("(min-width: 900px)");
  const side = wide && variant === "panel";
  const drag = useDragControls();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement;
    window.__lenis?.stop();
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    // Animation shuru hote hi focus panel pe (screen reader + keyboard)
    const id = requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }));
    return () => {
      cancelAnimationFrame(id);
      window.__lenis?.start();
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      if (prevFocus && typeof prevFocus.focus === "function") prevFocus.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!hydrated) return null;

  const motionProps = side
    ? { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } }
    : wide
      ? { initial: { opacity: 0, y: 40, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 30, scale: 0.98 } }
      : { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } };

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className={styles.root}
          data-variant={side ? "side" : wide ? "modal" : "bottom"}
          initial={{ opacity: 1 }}
          exit={{ opacity: 1, transition: { duration: 0.45 } }}
        >
          <motion.div
            className={styles.scrim}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            {...motionProps}
            transition={{ duration: 0.55, ease: EASE }}
            drag={!wide ? "y" : false}
            dragListener={false}
            dragControls={drag}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose();
            }}
          >
            <div className={styles.top} onPointerDown={(e) => !wide && drag.start(e)}>
              <span className={styles.handle} aria-hidden="true" />
              <div className={styles.headRow}>
                <div className={styles.head}>{header}</div>
                <button type="button" className={styles.close} onClick={onClose} aria-label={closeLabel}>
                  <X size={18} strokeWidth={2} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className={styles.body} data-lenis-prevent>
              {children}
            </div>
            {footer ? <div className={styles.footer}>{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
