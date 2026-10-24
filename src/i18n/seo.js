import { DEFAULT_LOCALE, LOCALES, localize, tr } from "./config";

// Share karne pe dikhne wali photo — public/brand/og.jpg (1200×630, logo)
const OG_ALT = {
  hi: "SNP Biotech — मुरादाबाद की भरोसेमंद पौधों की नर्सरी",
  en: "SNP Biotech — Trusted plant nursery in Moradabad, Uttar Pradesh",
};
const ogImage = (lang) => ({ url: "/brand/og.jpg", width: 1200, height: 630, alt: tr(OG_ALT, lang), type: "image/jpeg" });

// Har page ke liye SEO: title + description + hreflang (Google ko batata hai
// "is page ka Hindi version ye hai, English ye") + canonical
export function alternatesFor(lang, path = "/") {
  const languages = Object.fromEntries(LOCALES.map((l) => [l === "hi" ? "hi-IN" : "en-IN", localize(l, path)]));
  languages["x-default"] = localize(DEFAULT_LOCALE, path);
  return { canonical: localize(lang, path), languages };
}

// pageMetadata("en", "/plants", { title: {hi, en}, description: {hi, en} })
// Title/description wahi jo search result mein dikhe — WhatsApp / Facebook share pe bhi wahi
export function pageMetadata(lang, path, { title, description } = {}) {
  const t = title ? tr(title, lang) : undefined;
  const d = description ? tr(description, lang) : undefined;
  const img = ogImage(lang);
  return {
    ...(t ? { title: t } : {}),
    ...(d ? { description: d } : {}),
    alternates: alternatesFor(lang, path),
    openGraph: {
      type: "website",
      siteName: "SNP Biotech",
      locale: lang === "en" ? "en_IN" : "hi_IN",
      alternateLocale: lang === "en" ? ["hi_IN"] : ["en_IN"],
      url: localize(lang, path),
      ...(t ? { title: t } : {}),
      ...(d ? { description: d } : {}),
      images: [img],
    },
    twitter: {
      card: "summary_large_image",
      ...(t ? { title: t } : {}),
      ...(d ? { description: d } : {}),
      images: [{ url: img.url, alt: img.alt }],
    },
  };
}
