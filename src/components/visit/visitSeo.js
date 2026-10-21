// Google ke liye "LocalBusiness" structured data — Maps / "nursery near me" mein
// pata, samay, phone aur "Directions" seedha dikh sake.
// Sirf CONFIRMED data jaata hai (placeholder kabhi Google tak nahi pahunchta — isLive).
import { site } from "@/lib/site";
import { localize, tr } from "@/i18n/config";
import { HOURS } from "./visitData";
import { WEEK, isLive } from "./visitModel";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hm = (min) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
const realPhone = (p) => (p && !/0{8,}/.test(p) ? p : null); // "+910000000000" jaisa placeholder nahi

export function localBusinessJsonLd(lang, path) {
  const data = {
    "@context": "https://schema.org",
    "@type": "GardenStore",
    name: site.name,
    url: `${site.url}${localize(lang, path)}`,
    image: `${site.url}/brand/og.jpg`,
    logo: `${site.url}/brand/snp-logo.svg`,
    description: tr(
      {
        hi: "फलदार, नींबू वर्गीय, इमारती और छायादार पौधों की नर्सरी — उत्तर प्रदेश।",
        en: "Nursery for fruit, citrus, timber and shade plants in Uttar Pradesh.",
      },
      lang
    ),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address ? tr(site.address, "en") : undefined,
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
  };

  const phone = realPhone(site.phone);
  if (phone) data.telephone = phone;

  if (site.geo && isLive(site.geo)) {
    data.geo = { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng };
    data.hasMap = `https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}`;
  }

  if (isLive(HOURS)) {
    data.openingHoursSpecification = Object.entries(WEEK).flatMap(([d, slots]) =>
      slots.map((s) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${DAYS[d]}`,
        opens: hm(s.open),
        closes: hm(s.close),
      }))
    );
  }

  return data;
}
