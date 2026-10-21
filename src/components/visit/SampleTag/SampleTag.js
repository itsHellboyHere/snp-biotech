"use client";

import { useLang } from "@/i18n/LangProvider";
import { isSample } from "@/lib/live";
import { VT } from "../visitText";
import styles from "./SampleTag.module.css";

// Dev mein yaad dilata hai ki ye block abhi "नमूना" (placeholder) hai.
// Live site pe kabhi nahi dikhta — sirf localhost pe yaad dilane ke liye (lib/live.js)
export default function SampleTag({ block }) {
  const { t } = useLang();
  if (!isSample(block)) return null;
  return <span className={styles.tag}>{t(VT.sample)}</span>;
}
