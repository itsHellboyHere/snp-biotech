"use client";

import { ArrowUp, MapPin, MessageCircle, Phone, Clock } from "lucide-react";
import LocaleLink from "@/i18n/LocaleLink";
import { useLang } from "@/i18n/LangProvider";
import Logo, { LogoWord } from "@/components/nav/Logo";
import LangToggle from "@/components/nav/LangToggle/LangToggle";
import { CATEGORIES } from "@/components/plants/plantsModel";
import { site, callLink, whatsappLink, WA_TEXT, displayPhone } from "@/lib/site";
import SeasonStrip from "../SeasonStrip/SeasonStrip";
import { FOOTER } from "../footerData";
import styles from "./Footer.module.css";

const YEAR = new Date().getFullYear(); // build ke waqt ka saal

/* =========================================================
   Footer — har page ke neeche
   1. Logo + ek line + Call / WhatsApp
   2. मौसम की पट्टी (har mahine apne aap)
   3. Links: पौधे (category) · पेज · संपर्क
   4. Neeche bada "SNP BIOTECH" (Apple / Fly.io jaisa) + © + भाषा + ऊपर जाएँ
   ========================================================= */
export default function Footer() {
  const { t } = useLang();

  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer} data-site-footer>
      <div className={styles.glow} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        {/* ---------- 1. Brand + contact ---------- */}
        <div className={styles.top}>
          <div className={styles.brand}>
            <LocaleLink href="/" aria-label="SNP Biotech — Home">
              <Logo className={styles.logo} tagline />
            </LocaleLink>
            <p className={styles.line}>{t(FOOTER.line)}</p>
          </div>
          <div className={styles.actions}>
            <a href={callLink()} className={styles.secondary}>
              <Phone size={18} strokeWidth={2} aria-hidden="true" />
              {t(FOOTER.call)}
            </a>
            <a
              href={whatsappLink(t(WA_TEXT.general))}
              className={styles.primary}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
              {t(FOOTER.whatsapp)}
            </a>
          </div>
        </div>

        {/* ---------- 2. Mausam ---------- */}
        <SeasonStrip />

        {/* ---------- 3. Links ---------- */}
        <nav className={styles.cols} aria-label="Footer">
          <div>
            <h2 className={styles.colTitle}>{t(FOOTER.cols.plants)}</h2>
            <ul className={styles.list}>
              <li>
                <LocaleLink href="/plants">{t(FOOTER.allPlants)}</LocaleLink>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <LocaleLink href={`/plants?cat=${c.id}`}>{t(c.label)}</LocaleLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={styles.colTitle}>{t(FOOTER.cols.pages)}</h2>
            <ul className={styles.list}>
              {FOOTER.pages.map((p) => (
                <li key={p.href}>
                  <LocaleLink href={p.href}>{t(p.label)}</LocaleLink>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.contact}>
            <h2 className={styles.colTitle}>{t(FOOTER.cols.contact)}</h2>
            <ul className={styles.list}>
              <li>
                <a href={callLink()} className={styles.row}>
                  <Phone size={16} strokeWidth={2} aria-hidden="true" />
                  <span>
                    <span className={styles.rowLabel}>{t(FOOTER.phoneLabel)}</span>
                    <span lang="en">{displayPhone(site.phone)}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={whatsappLink(t(WA_TEXT.general))} className={styles.row} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />
                  <span>
                    <span className={styles.rowLabel}>{t(FOOTER.waLabel)}</span>
                    <span lang="en">{displayPhone(site.whatsapp)}</span>
                  </span>
                </a>
              </li>
              {site.address ? (
                <li>
                  <a
                    href={site.mapsUrl || "#"}
                    className={styles.row}
                    target={site.mapsUrl ? "_blank" : undefined}
                    rel="noopener noreferrer"
                  >
                    <MapPin size={16} strokeWidth={2} aria-hidden="true" />
                    <span>
                      <span className={styles.rowLabel}>{t(FOOTER.addressLabel)}</span>
                      <span>{t(site.address)}</span>
                      {site.mapsUrl ? <span className={styles.rowLink}>{t(FOOTER.directions)} →</span> : null}
                    </span>
                  </a>
                </li>
              ) : null}
              {site.hours ? (
                <li>
                  <span className={styles.row}>
                    <Clock size={16} strokeWidth={2} aria-hidden="true" />
                    <span>
                      <span className={styles.rowLabel}>{t(FOOTER.hoursLabel)}</span>
                      <span>{t(site.hours)}</span>
                    </span>
                  </span>
                </li>
              ) : null}
            </ul>
          </div>
        </nav>
      </div>

      {/* ---------- 4. Bada naam + neeche ki line ---------- */}
      <div className={styles.giant} aria-hidden="true">
        <div className={styles.giantInner}>
          <LogoWord className={styles.giantWord} />
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p className={styles.copy}>
          © {site.established}–{YEAR} SNP Biotech. {t(FOOTER.rights)}{" "}
          <span className={styles.credit}>
            {t(FOOTER.madeBy)}{" "}
            <a href="https://creatormonk.in" target="_blank" rel="noopener" lang="en">
              CreatorMonk
            </a>
          </span>
        </p>
        <div className={styles.bottomActions}>
          <LangToggle tone="dark" />
          <button type="button" className={styles.toTopBtn} onClick={toTop} aria-label={t(FOOTER.toTop)}>
            <ArrowUp size={18} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
