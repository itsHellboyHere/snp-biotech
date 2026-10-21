// Google ke liye "AboutPage" + "Organization" structured data
// Sirf CONFIRMED data jaata hai (isConfirmed) — namoona naam / saal kabhi Google tak nahi pahunchta
import { site } from "@/lib/site";
import { localize, tr } from "@/i18n/config";
import { isConfirmed } from "@/lib/live";
import { FOUNDER, MILESTONES } from "./storyData";
import { FOUNDED_YEAR } from "./storyModel";

const realPhone = (p) => (p && !/0{8,}/.test(p) ? p : null); // "+910000000000" jaisa placeholder nahi

export function aboutPageJsonLd(lang, path) {
  const org = {
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: `${site.url}/brand/snp-logo.svg`,
    image: `${site.url}/brand/og.jpg`,
    address: { "@type": "PostalAddress", addressRegion: "Uttar Pradesh", addressCountry: "IN" },
    areaServed: "Uttar Pradesh, India",
  };

  // Saal tabhi jab safar (milestones) client ne pakka kiya ho
  if (isConfirmed(MILESTONES)) org.foundingDate = String(FOUNDED_YEAR);
  if (isConfirmed(FOUNDER)) org.founder = { "@type": "Person", name: tr(FOUNDER.name, "en") };
  const phone = realPhone(site.phone);
  if (phone) org.telephone = phone;

  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: tr({ hi: "हमारी कहानी — SNP Biotech", en: "Our Story — SNP Biotech" }, lang),
    url: `${site.url}${localize(lang, path)}`,
    inLanguage: lang === "en" ? "en-IN" : "hi-IN",
    mainEntity: org,
  };
}
