"use client";

import { useLang } from "@/i18n/LangProvider";
import { VT } from "../visitText";
import styles from "./SampleTag.module.css";

// Dev mein yaad dilata hai ki ye block abhi "नमूना" (placeholder) hai.
// Live site pe ye kabhi nahi dikhta (placeholder block hi chhup jaata hai — visitModel.isLive).
export default function SampleTag({ block }) {
  const { t } = useLang();
  if (block?.confirmed || process.env.NODE_ENV === "production") return null;
  return <span className={styles.tag}>{t(VT.sample)}</span>;
}
