"use client";

import { useEffect } from "react";
import LocaleLink from "@/i18n/LocaleLink";
import { useLang } from "@/i18n/LangProvider";
import LangToggle from "../LangToggle/LangToggle";
import { AnimatePresence, motion } from "motion/react";
import { X, ArrowUpRight, Phone, MessageCircle } from "lucide-react";
import { NAV_LINKS } from "../navData";
import Logo from "../Logo";
import { whatsappLink, callLink, WA_TEXT } from "@/lib/site";
import styles from "./MobileMenu.module.css";

const EASE = [0.16, 1, 0.3, 1];
const MotionLink = motion.create(LocaleLink);

// Phone ka menu — upar se glass sheet, links ek-ek karke aate hain
export default function MobileMenu({ open, active, onClose, onNavigate }) {
  const { t } = useLang();
  // Menu khula ho to peeche ka page scroll na ho, aur Esc se band
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.top}>
              <Logo className={styles.brand} />
              <div className={styles.topActions}>
                <LangToggle onSwitch={onClose} />
                <button type="button" className={styles.close} aria-label="Close menu" onClick={onClose}>
                  <X size={20} strokeWidth={2} aria-hidden="true" />
                </button>
              </div>
            </div>

            <nav className={styles.links} aria-label="Main">
              {NAV_LINKS.map((link, i) => (
                <MotionLink
                  key={link.id}
                  href={link.href}
                  className={styles.link}
                  data-active={active === link.id ? "true" : "false"}
                  aria-current={active === link.id ? "page" : undefined}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.08 + i * 0.06 }}
                  onClick={(e) => onNavigate(e, link.href)}
                >
                  <span>{link.label}</span>
                  <ArrowUpRight size={22} strokeWidth={1.75} aria-hidden="true" />
                </MotionLink>
              ))}
            </nav>

            <motion.div
              className={styles.actions}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.08 + NAV_LINKS.length * 0.06 }}
            >
              <a href={callLink()} className={styles.call}>
                <Phone size={18} strokeWidth={2} aria-hidden="true" />
                Call
              </a>
              <a href={whatsappLink(t(WA_TEXT.general))} className={styles.whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
                WhatsApp
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
