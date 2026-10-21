"use client";

import { useMemo } from "react";
import { ArrowRight, CalendarDays } from "lucide-react";
import LocaleLink from "@/i18n/LocaleLink";
import { useLang } from "@/i18n/LangProvider";
import { useMonth } from "@/components/plants/hooks";
import { PLANTS, seasonInfo, monthName } from "@/components/plants/plantsModel";
import { FOOTER } from "../footerData";
import styles from "./SeasonStrip.module.css";

/* Footer ki "मौसम की पट्टी" — har page ke neeche, har mahine apne aap badalti hai:
   "अभी अक्टूबर है · अगला मौसम दिसंबर से: नाशपाती" → Plants page */
export default function SeasonStrip() {
  const { lang, t } = useLang();
  const month = useMonth();

  const text = useMemo(() => {
    if (month < 0) return null;
    const infos = PLANTS.map((p) => ({ p, s: seasonInfo(p, month) })).filter((x) => x.s);
    const now = infos.filter((x) => x.s.now);
    const list = (xs) =>
      xs
        .slice(0, 3)
        .map((x) => t(x.p.name))
        .join(", ");
    if (now.length) return FOOTER.season.now[lang](monthName(month, lang), list(now));
    const soonest = Math.min(...infos.map((x) => x.s.inMonths));
    const next = infos.filter((x) => x.s.inMonths === soonest);
    if (!next.length) return null;
    return FOOTER.season.next[lang](monthName(month, lang), monthName(next[0].s.month, lang), list(next));
  }, [month, lang, t]);

  return (
    <LocaleLink href="/plants" className={styles.strip} data-ready={text ? "true" : "false"}>
      <CalendarDays className={styles.icon} size={18} strokeWidth={2} aria-hidden="true" />
      <span className={styles.text}>{text ?? " "}</span>
      <span className={styles.cta}>
        {t(FOOTER.season.cta)}
        <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
      </span>
    </LocaleLink>
  );
}
