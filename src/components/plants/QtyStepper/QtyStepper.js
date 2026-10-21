"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { MAX_QTY } from "../plantsModel";
import { PT } from "../plantsText";
import styles from "./QtyStepper.module.css";

const HOLD_DELAY = 420; // itni der dabaye rakho → apne aap chalne lage (ms)
const HOLD_EVERY = 90; // phir har itne ms mein ek step
const clamp = (n) => Math.min(MAX_QTY, Math.max(0, n));

/* − 1 + : ek-ek karke (paudhe ka "step" data mein badla ja sakta hai)
   - Button dabaye rakho → tez chalta hai; ~1.5 second baad 10-10 ki chhalaang
   - Beech ke number pe tap karke seedha likh bhi sakte hain (jaise 250)
   - 0 = list se hat gaya (parent decide karta hai kya dikhana hai) */
export default function QtyStepper({ value, step = 1, onChange, size = "md", label }) {
  const { t } = useLang();
  const [draft, setDraft] = useState(null); // likhte waqt ka text; null = value dikhao

  // Hold ke dauran timer purani value na pakde — hamesha taaza value + onChange
  const live = useRef({ value, onChange });
  useEffect(() => {
    live.current = { value, onChange };
  });
  const hold = useRef({ wait: 0, tick: 0, count: 0 });

  const bump = (dir, n = step) => {
    const { value: v, onChange: change } = live.current;
    const next = dir > 0 ? clamp(v < step ? step : v + n) : v - n > 0 ? v - n : 0;
    if (next !== v) {
      live.current.value = next; // agla tick isi se aage badhe
      change(next);
    }
  };

  const stop = () => {
    clearTimeout(hold.current.wait);
    clearInterval(hold.current.tick);
  };
  // Unmount pe timer band (jaise dabaye-dabaye 0 hua aur stepper "जोड़ें" ban gaya)
  useEffect(() => {
    const h = hold.current;
    return () => {
      clearTimeout(h.wait);
      clearInterval(h.tick);
    };
  }, []);

  // Kaunsa button (−1 / +1) — data-dir se; handlers render mein call nahi hote
  const dirOf = (e) => Number(e.currentTarget.dataset.dir);

  const onDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault(); // phone pe text select / zoom na ho
    const dir = dirOf(e);
    stop();
    bump(dir);
    hold.current.count = 0;
    hold.current.wait = setTimeout(() => {
      hold.current.tick = setInterval(() => {
        hold.current.count += 1;
        // pehle ~16 baar ek-ek, phir 10-10 (bade order jaldi)
        bump(dir, hold.current.count > 16 ? Math.max(step, 10) : step);
        if (dir < 0 && live.current.value === 0) stop();
      }, HOLD_EVERY);
    }, HOLD_DELAY);
  };

  // Keyboard (Enter/Space) wala click — mouse/touch pointer se pehle hi sambhal liya
  const onKeyClick = (e) => {
    if (e.detail === 0) bump(dirOf(e));
  };

  const commit = (raw) => {
    setDraft(null);
    const n = clamp(Math.floor(Number(String(raw).replace(/\D/g, "")) || 0));
    if (n !== value) onChange(n);
  };

  return (
    <div className={styles.stepper} data-size={size} role="group" aria-label={label ?? t(PT.qty)}>
      <button type="button" className={styles.btn} aria-label={t(PT.less)}
        data-dir="-1"
        onPointerDown={onDown}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onContextMenu={(e) => e.preventDefault()}
        onClick={onKeyClick}
      >
        <Minus size={16} strokeWidth={2.4} aria-hidden="true" />
      </button>
      <input
        className={styles.input}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={t(PT.qty)}
        value={draft ?? String(value)}
        onFocus={(e) => e.target.select()}
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, "").slice(0, 4))}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          if (e.key === "Escape") setDraft(null);
        }}
        lang="en"
      />
      <button type="button" className={styles.btn} aria-label={t(PT.more)}
        data-dir="1"
        onPointerDown={onDown}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onContextMenu={(e) => e.preventDefault()}
        onClick={onKeyClick}
      >
        <Plus size={16} strokeWidth={2.4} aria-hidden="true" />
      </button>
    </div>
  );
}
