"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLang } from "@/i18n/LangProvider";
import { LOCALES, LOCALE_LABELS, localize, stripLocale } from "@/i18n/config";
import styles from "./LangToggle.module.css";

// हिं | EN — glass pill, safed "thumb" active language ke peeche slide karta hai.
// Usi page ke doosre language version pe le jaata hai (/plants ↔ /en/plants),
// ?cat=mango jaise filters bhi saath jaate hain.
//
// Thumb click pe TURANT slide kare (useOptimistic), aur navigation khatam hote hi
// asli language pe laut aaye. Pehle local state tha — Next.js pichhla page memory mein
// zinda rakhta hai, to browser "Back" pe purana "EN chuna" wapas aa jaata tha (galat thumb).
export default function LangToggle({ className = "", onSwitch, tone = "light" }) {
  const { lang } = useLang();
  const router = useRouter();
  const { path } = stripLocale(usePathname() || "/");
  const [shown, setShown] = useOptimistic(lang);
  const [, startTransition] = useTransition();

  const onPick = (e, target, href) => {
    // Cmd/Ctrl/Shift click = naya tab — browser ko apna kaam karne do
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (target === lang) return;
    onSwitch?.();
    const { search, hash } = window.location;
    startTransition(() => {
      setShown(target);
      router.push(`${href}${search}${hash}`);
    });
  };

  return (
    <div className={`${styles.toggle} ${className}`} role="group" aria-label="Language · भाषा" data-lang={shown} data-tone={tone}>
      <span className={styles.thumb} aria-hidden="true" />
      {LOCALES.map((l) => {
        const href = localize(l, path);
        return (
          <Link
            key={l}
            href={href}
            hrefLang={l}
            lang={l}
            className={styles.opt}
            data-on={shown === l ? "true" : "false"}
            aria-current={lang === l ? "true" : undefined}
            aria-label={LOCALE_LABELS[l].name}
            onClick={(e) => onPick(e, l, href)}
          >
            {LOCALE_LABELS[l].short}
          </Link>
        );
      })}
    </div>
  );
}
