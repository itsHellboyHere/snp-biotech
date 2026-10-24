// =========================================================
// Google ke liye structured data (schema.org JSON-LD) — poori site ka EK jagah
//
// Ek hi "business" (GardenStore = nursery) ki pehchaan @id se — har page usi ko point karta hai,
// taaki Google samjhe: ye sab pages ek hi nursery ke hain (Knowledge Panel / Maps / local search).
// Sirf ASLI data jaata hai: phone placeholder nahi, pin tabhi jab confirmed, samay tabhi jab confirmed.
// =========================================================

import { site } from "@/lib/site";
import { localize, tr } from "@/i18n/config";
import { isLive } from "@/lib/live";
import { HOURS } from "@/components/visit/visitData";
import { WEEK, hasGeo, directionsUrl } from "@/components/visit/visitModel";

export const BUSINESS_ID = `${site.url}/#business`;
export const WEBSITE_ID = `${site.url}/#website`;

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hm = (min) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
const realPhone = (p) => (p && !/0{8,}/.test(p) ? p : null); // "+910000000000" jaisa placeholder nahi
export const abs = (path) => `${site.url}${path}`;
const inLang = (lang) => (lang === "en" ? "en-IN" : "hi-IN");

// ---------- Nursery (LocalBusiness → GardenStore) ----------
export function businessJsonLd(lang) {
  const data = {
    "@type": ["GardenStore", "LocalBusiness"],
    "@id": BUSINESS_ID,
    name: site.name,
    alternateName: ["एसएनपी बायोटेक", "SNP Biotech Nursery", "SNP Biotech Agwanpur"],
    url: abs(localize(lang, "/")),
    logo: abs("/brand/snp-logo.svg"),
    image: [abs("/brand/og.jpg")],
    description: tr(
      {
        hi: "अगवानपुर चौराहा, मुरादाबाद (उत्तर प्रदेश) की नर्सरी — आम, अमरूद, लीची, किन्नू, नींबू, आँवला के उन्नत कलमी पौधे और सागवान, नीम, गुलमोहर।",
        en: "Plant nursery at Agwanpur Chauraha, Moradabad (Uttar Pradesh) — quality grafted mango, guava, litchi, kinnow, lemon and amla plants, plus teak, neem and gulmohar.",
      },
      lang
    ),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.postal?.street,
      addressLocality: site.postal?.locality,
      addressRegion: site.postal?.region ?? "Uttar Pradesh",
      postalCode: site.postal?.pin,
      addressCountry: "IN",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Moradabad" },
      { "@type": "State", name: "Uttar Pradesh" },
    ],
    knowsAbout: ["Grafted mango plants", "Guava plants", "Litchi plants", "Citrus plants", "Teak plants", "Fruit orchard planting"],
    knowsLanguage: ["hi", "en"],
    currenciesAccepted: "INR",
  };

  const phone = realPhone(site.phone);
  if (phone) {
    data.telephone = phone;
    data.contactPoint = {
      "@type": "ContactPoint",
      telephone: phone,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["Hindi", "English"],
    };
  }
  if (site.enquiryEmail) data.email = site.enquiryEmail;

  if (hasGeo) data.geo = { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng };
  const map = directionsUrl();
  if (map) data.hasMap = map;

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

  if (site.social?.length) data.sameAs = site.social;
  return data;
}

// ---------- Website (naam + bhasha) ----------
export function websiteJsonLd(lang) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: abs("/"),
    name: site.name,
    alternateName: "एसएनपी बायोटेक नर्सरी",
    inLanguage: ["hi-IN", "en-IN"],
    publisher: { "@id": BUSINESS_ID },
    description: tr(
      { hi: "मुरादाबाद (उ.प्र.) की पौधों की नर्सरी — उन्नत कलमी पौधे।", en: "Plant nursery in Moradabad, UP — quality grafted plants." },
      lang
    ),
  };
}

// ---------- Har page (WebPage / AboutPage / ContactPage / CollectionPage) ----------
export function webPageJsonLd(lang, { path, type = "WebPage", name, description, image }) {
  const url = abs(localize(lang, path));
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: tr(name, lang),
    ...(description ? { description: tr(description, lang) } : {}),
    inLanguage: inLang(lang),
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": BUSINESS_ID },
    primaryImageOfPage: { "@type": "ImageObject", url: abs(image ?? "/brand/og.jpg") },
    breadcrumb: { "@id": `${url}#breadcrumb` },
  };
}

// ---------- Breadcrumb: Home › Plants (search result mein upar dikhta hai) ----------
const HOME_NAME = { hi: "होम", en: "Home" };
export function breadcrumbJsonLd(lang, { path, name }) {
  const url = abs(localize(lang, path));
  const items = [{ name: HOME_NAME, path: "/" }, ...(path === "/" ? [] : [{ name, path }])];
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tr(it.name, lang),
      item: abs(localize(lang, it.path)),
    })),
  };
}
