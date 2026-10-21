import { lang as rootLang } from "next/root-params";
import LocaleLink from "@/i18n/LocaleLink";
import { tr } from "@/i18n/config";
import styles from "./PagePlaceholder.module.css";

// Jo pages abhi bane nahi — navbar ke link 404 na dein, saaf "jald aa raha hai" dikhe.
// Server component: language URL se (next/root-params), text content/pages.js se.
export default async function PagePlaceholder({ page }) {
  const lang = await rootLang();
  return (
    <main id="main" className={styles.page} data-theme="light">
      <div className={`container ${styles.inner}`}>
        <p className="eyebrow" lang="en">
          {page.eyebrow}
        </p>
        <h1 className={`display ${styles.title}`}>{tr(page.title, lang)}</h1>
        <p className={styles.line}>{tr(page.line, lang)}</p>
        <LocaleLink href="/" className={styles.back} lang="en">
          ← Back to Home
        </LocaleLink>
      </div>
    </main>
  );
}
