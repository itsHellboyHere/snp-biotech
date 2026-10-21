"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, CheckCheck, Mic, Plus } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { whatsappLink, WA_TEXT } from "@/lib/site";
import { ORDER, STEPS, MESSAGES } from "../orderData";
import styles from "./OrderChat.module.css";

/* =========================================================
   ऑर्डर कैसे करें — phone pe WhatsApp chat jo dikhte hi
   "khud likhi jaati hai" (SNP ke jawab se pehle typing…).
   Baayein 3 kadam chat ke saath-saath jalte hain.
   Screen se jaake wapas aao to dobara chalti hai.
   ========================================================= */

const GAP_ME = 900; // grahak ka message
const GAP_SNP = 650; // typing ke baad SNP ka jawab
const TYPING = 1100; // "typing…" kitni der

export default function OrderChat() {
  const { t } = useLang();
  const phoneRef = useRef(null);
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const [round, setRound] = useState(0); // har baar dikhne pe naya round

  // Dikhne pe chalao; poori tarah screen se jaane pe reset (dobara chalegi)
  useEffect(() => {
    // Reduce Motion: poori chat seedha dikhao (animation nahi)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = setTimeout(() => setShown(MESSAGES.length), 0);
      return () => clearTimeout(id);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.35) setRound((r) => (r % 2 === 0 ? r + 1 : r));
        else if (!e.isIntersecting) setRound((r) => (r % 2 === 1 ? r + 1 : r));
      },
      { threshold: [0, 0.35] }
    );
    io.observe(phoneRef.current);
    return () => io.disconnect();
  }, []);

  // Round odd = chal rahi · even = ruki/reset
  useEffect(() => {
    if (round === 0) return;
    const timers = [];
    if (round % 2 === 0) {
      timers.push(
        setTimeout(() => {
          setShown(0);
          setTyping(false);
        }, 0)
      );
      return () => timers.forEach(clearTimeout);
    }
    let at = 300;
    MESSAGES.forEach((m, i) => {
      if (m.from === "snp") {
        timers.push(setTimeout(() => setTyping(true), at));
        at += TYPING;
        timers.push(
          setTimeout(() => {
            setTyping(false);
            setShown(i + 1);
          }, at)
        );
        at += GAP_SNP;
      } else {
        at += GAP_ME * (i === 0 ? 0.4 : 1);
        timers.push(setTimeout(() => setShown(i + 1), at));
      }
    });
    return () => timers.forEach(clearTimeout);
  }, [round]);

  const lastStep = shown > 0 ? MESSAGES[shown - 1].step : -1;
  const activeStep = typing && shown < MESSAGES.length ? MESSAGES[shown].step : lastStep;

  return (
    <section className={styles.section} aria-labelledby="order-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={`eyebrow ${styles.eyebrow}`}>{t(ORDER.eyebrow)}</p>
          <h2 id="order-title" className={`display ${styles.title}`}>
            {t(ORDER.title)}
          </h2>
          <p className={styles.line}>{t(ORDER.line)}</p>

          <ol className={styles.steps}>
            {STEPS.map((s, i) => (
              <li
                key={i}
                className={styles.step}
                data-state={i < activeStep ? "done" : i === activeStep ? "active" : "next"}
              >
                <span className={styles.stepNum} lang="en" aria-hidden="true">
                  {i + 1}
                </span>
                <span className={styles.stepText}>
                  <span className={styles.stepTitle}>{t(s.title)}</span>
                  <span className={styles.stepLine}>{t(s.line)}</span>
                </span>
              </li>
            ))}
          </ol>

          <a
            href={whatsappLink(t(WA_TEXT.general))}
            className={styles.cta}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
            {t(ORDER.cta)}
          </a>
        </div>

        {/* ---------- Phone ---------- */}
        <figure className={styles.phoneWrap}>
          <figcaption className={styles.example}>{t(ORDER.example)}</figcaption>
          <div ref={phoneRef} className={styles.phone}>
            <div className={styles.screen}>
              <div className={styles.bar}>
                <span className={styles.avatar} aria-hidden="true">
                  <svg viewBox="0 0 32 32">
                    <path d="M16 29V15" stroke="#c6f36b" strokeWidth="2.4" strokeLinecap="round" />
                    <path d="M16 17C16 10 11 5 3 5c0 8 5 12 13 12Z" fill="#8fd16a" />
                    <path d="M16 14c0-6.5 4.5-11 13-11 0 7.5-4.5 11-13 11Z" fill="#f6b941" />
                  </svg>
                </span>
                <span className={styles.who}>
                  <span className={styles.name} lang="en">
                    {ORDER.contact.name}
                  </span>
                  <span className={styles.status}>{typing ? "typing…" : t(ORDER.contact.status)}</span>
                </span>
              </div>

              <div className={styles.chat} role="log" aria-label={t(ORDER.example)}>
                {MESSAGES.slice(0, shown).map((m, i) => (
                  <div key={`${round}-${i}`} className={styles.msg} data-from={m.from}>
                    {m.image ? (
                      <span className={styles.photo}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- chat ke andar chhoti optimised webp */}
                        <img src={m.image.src} alt={t(m.image.alt)} width={m.image.w} height={m.image.h} loading="lazy" />
                      </span>
                    ) : (
                      <span className={styles.text}>{t(m.text)}</span>
                    )}
                    <span className={styles.meta} lang="en">
                      {m.time}
                      {m.from === "me" ? <CheckCheck size={14} strokeWidth={2.2} className={styles.ticks} aria-hidden="true" /> : null}
                    </span>
                  </div>
                ))}
                {typing ? (
                  <div className={`${styles.msg} ${styles.typing}`} data-from="snp" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                ) : null}
              </div>

              <div className={styles.input} aria-hidden="true">
                <Plus size={20} strokeWidth={2} />
                <span className={styles.field}>{t(ORDER.inputHint)}</span>
                <span className={styles.mic}>
                  <Mic size={18} strokeWidth={2} />
                </span>
              </div>
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
