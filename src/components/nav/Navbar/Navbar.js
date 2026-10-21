"use client";

import { useEffect, useRef, useState } from "react";
import LocaleLink from "@/i18n/LocaleLink";
import { useLang } from "@/i18n/LangProvider";
import { stripLocale } from "@/i18n/config";
import LangToggle from "../LangToggle/LangToggle";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, Phone } from "lucide-react";
import MobileMenu from "../MobileMenu/MobileMenu";
import Logo from "../Logo";
import { NAV_LINKS, isActive } from "../navData";
import { useNavScroll } from "../useNavScroll";
import { whatsappLink, callLink, WA_TEXT } from "@/lib/site";
import { useOrder } from "@/components/plants/orderStore";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { hidden, scrolled } = useNavScroll();
  const { t } = useLang();
  // "/en/plants" → "/plants" (dono languages mein same link active ho)
  const pathname = stripLocale(usePathname() || "/").path;
  // Active = jo page abhi khula hai
  const active = NAV_LINKS.find((l) => isActive(pathname, l.href))?.id ?? null;
  const [hoverId, setHoverId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  // "मेरी सूची" mein kitne paudhe — Plants link pe chhota badge (har page pe dikhe)
  const listCount = useOrder().items.length;

  // Navbar chhupi/dikhi — Plants page ke sticky chips isi hisaab se upar-neeche hote hain
  useEffect(() => {
    document.documentElement.dataset.nav = hidden && !menuOpen ? "hidden" : "shown";
  }, [hidden, menuOpen]);

  const linkRefs = useRef({});
  const textRefs = useRef({});
  const pillRef = useRef(null);
  const lineRef = useRef(null);

  // Do alag indicator — seedha CSS variables, React re-render nahi:
  // 1. Pill = ACTIVE page (jo abhi khula hai) — glass pill, text bold
  // 2. Line = HOVER — text ke neeche patli gradient line
  useEffect(() => {
    const pill = pillRef.current;
    const line = lineRef.current;
    if (!pill || !line) return;
    const place = () => {
      const a = active && linkRefs.current[active];
      if (a) {
        pill.style.setProperty("--x", `${a.offsetLeft}px`);
        pill.style.setProperty("--w", `${a.offsetWidth}px`);
        pill.style.opacity = "1";
      } else {
        pill.style.opacity = "0";
      }

      const h = hoverId && linkRefs.current[hoverId];
      const t = hoverId && textRefs.current[hoverId];
      if (h && t) {
        line.style.setProperty("--x", `${h.offsetLeft + t.offsetLeft}px`);
        line.style.setProperty("--w", `${t.offsetWidth}px`);
        line.style.opacity = "1";
      } else {
        line.style.opacity = "0";
      }
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active, hoverId, listCount]);

  // Menu khula ho aur screen desktop size ki ho jaaye (rotate / resize) → menu band
  useEffect(() => {
    if (!menuOpen) return;
    const mq = window.matchMedia("(min-width: 1080px)");
    // "change" + page ka size dono dekho — kuch browsers / devtools resize pe "change" nahi bhejte
    const check = () => {
      if (mq.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", check);
    const ro = new ResizeObserver(check);
    ro.observe(document.documentElement);
    return () => {
      mq.removeEventListener("change", check);
      ro.disconnect();
    };
  }, [menuOpen]);

  // Usi page pe dobara click = upar smooth scroll; doosra page = Next.js Link khud le jayega
  const onLinkClick = (e, href) => {
    setMenuOpen(false);
    if (pathname === href) {
      e.preventDefault();
      if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={styles.wrap}
        data-hidden={hidden && !menuOpen ? "true" : "false"}
        data-scrolled={scrolled ? "true" : "false"}
      >
        <div className={styles.bar}>
          <div className={styles.inner}>
            <LocaleLink href="/" className={styles.logo} onClick={(e) => onLinkClick(e, "/")} aria-label="SNP Biotech — Home">
              <Logo className={styles.logoSvg} />
            </LocaleLink>

            <nav className={styles.nav} aria-label="Main" onMouseLeave={() => setHoverId(null)}>
              <span ref={pillRef} className={styles.pill} aria-hidden="true" />
              {NAV_LINKS.map((link) => (
                <LocaleLink
                  key={link.id}
                  ref={(el) => {
                    linkRefs.current[link.id] = el;
                  }}
                  href={link.href}
                  className={styles.link}
                  data-active={active === link.id ? "true" : "false"}
                  data-hover={hoverId === link.id ? "true" : "false"}
                  aria-current={active === link.id ? "page" : undefined}
                  onMouseEnter={() => setHoverId(link.id)}
                  onFocus={() => setHoverId(link.id)}
                  onBlur={() => setHoverId(null)}
                  onClick={(e) => onLinkClick(e, link.href)}
                >
                  <span
                    ref={(el) => {
                      textRefs.current[link.id] = el;
                    }}
                  >
                    {link.label}
                  </span>
                  {link.id === "plants" && listCount > 0 ? (
                    <span className={styles.badge} aria-label={`${listCount} in list`}>
                      {listCount}
                    </span>
                  ) : null}
                </LocaleLink>
              ))}
              <span ref={lineRef} className={styles.line} aria-hidden="true" />
            </nav>

            <div className={styles.actions}>
              <LangToggle className={styles.lang} />
              <a href={callLink()} className={styles.call} aria-label="Call SNP Biotech">
                <Phone size={17} strokeWidth={1.9} aria-hidden="true" />
              </a>
              <a
                href={whatsappLink(t(WA_TEXT.general))}
                className={styles.cta}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Order on WhatsApp"
              >
                <MessageCircle size={17} strokeWidth={2} aria-hidden="true" />
                <span className={styles.ctaText}>Order on WhatsApp</span>
              </a>
              <button
                type="button"
                className={styles.menuBtn}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
              >
                <Menu size={20} strokeWidth={1.9} aria-hidden="true" />
                {listCount > 0 ? <span className={styles.menuDot} aria-hidden="true" /> : null}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} active={active} onClose={() => setMenuOpen(false)} onNavigate={onLinkClick} />
    </>
  );
}
