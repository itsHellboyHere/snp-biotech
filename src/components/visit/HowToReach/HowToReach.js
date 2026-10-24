"use client";

import { Fuel, Milestone, Phone, Route, Landmark, Signpost } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import SampleTag from "../SampleTag/SampleTag";
import { LANDMARKS } from "../visitData";
import { isLive } from "../visitModel";
import { VT } from "../visitText";
import styles from "./HowToReach.module.css";

// Data mein icon ka naam → lucide icon (naya icon chahiye to yahan jodo)
const ICONS = { road: Route, fuel: Fuel, sign: Signpost, temple: Landmark, milestone: Milestone, phone: Phone };

/* "रास्ते की पहचान" — gaanv mein log nishaan se pahunchte hain:
   ① Moradabad–Noorpur Road ② Agwanpur Chauraha ③ na mile to call */
export default function HowToReach() {
  const { t } = useLang();
  const steps = (LANDMARKS.steps ?? []).filter((s) => s?.text);
  if (!isLive(LANDMARKS) || !steps.length) return null;

  return (
    <div className={styles.card}>
      <h2 className={`h3 ${styles.title}`}>
        {t(VT.how)} <SampleTag block={LANDMARKS} />
      </h2>
      <ol className={styles.steps}>
        {steps.map((s, i) => {
          const Icon = ICONS[s.icon] ?? Milestone;
          return (
            <li key={i} className={styles.step}>
              <span className={styles.num} lang="en">
                {i + 1}
              </span>
              <Icon className={styles.icon} size={20} strokeWidth={1.8} aria-hidden="true" />
              <p className={styles.text}>{t(s.text)}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
