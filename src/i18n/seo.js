import { DEFAULT_LOCALE, LOCALES, localize, tr } from "./config";


// Share karne pe dikhne wali photo — public/brand/og.jpg (1200×630, logo)
const OG_IMAGE = { url: "/brand/og.jpg", width: 1200, height: 630, alt: "SNP Biotech — Your trusted plant nursery" };

// Har page ke liye SEO: title + description + hreflang (Google ko batata hai
// "is page ka Hindi version ye hai, English ye") + canonical
export function alternatesFor(lang, path = "/") {
  const languages = Object.fromEntries(LOCALES.map((l) => [l, localize(l, path)]));
  languages["x-default"] = localize(DEFAULT_LOCALE, path);
  return { canonical: localize(lang, path), languages };
}

// pageMetadata("en", "/plants", { title: {hi, en}, description: {hi, en} })
export function pageMetadata(lang, path, { title, description } = {}) {
  return {
    ...(title ? { title: tr(title, lang) } : {}),
    ...(description ? { description: tr(description, lang) } : {}),
    alternates: alternatesFor(lang, path),
    openGraph: {
      locale: lang === "en" ? "en_IN" : "hi_IN",
      alternateLocale: lang === "en" ? ["hi_IN"] : ["en_IN"],
      url: localize(lang, path),
      // WhatsApp / Facebook pe link share karo to yeh logo wali photo dikhe (har page pe)
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
  };
}
