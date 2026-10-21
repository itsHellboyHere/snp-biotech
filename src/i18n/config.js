// =========================================================
// Language setup — ek jagah
// Hindi = default, URL mein koi prefix nahi:  /plants
// English = /en prefix:                         /en/plants
// (Andar se Hindi pages /hi/... pe bane hain — proxy.js chupke se rewrite karta hai)
// =========================================================

export const LOCALES = ["hi", "en"];
export const DEFAULT_LOCALE = "hi";

export const LOCALE_LABELS = {
  hi: { short: "हिं", name: "हिन्दी" },
  en: { short: "EN", name: "English" },
};

export function hasLocale(value) {
  return LOCALES.includes(value);
}

export function otherLocale(lang) {
  return lang === "en" ? "hi" : "en";
}

// Data mein text { hi: "...", en: "..." } likha hota hai — yahan se sahi wala nikalta hai.
// English na likha ho to Hindi dikhegi (site kabhi khaali nahi dikhegi).
export function tr(value, lang) {
  if (value && typeof value === "object" && !Array.isArray(value) && "hi" in value) {
    return value[lang] ?? value[DEFAULT_LOCALE];
  }
  return value;
}

// "/plants" → Hindi: "/plants" · English: "/en/plants"
export function localize(lang, href = "/") {
  if (typeof href !== "string" || !href.startsWith("/")) return href; // https://, tel:, #id
  const clean = stripLocale(href).path;
  if (lang === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${lang}` : `/${lang}${clean}`;
}

// "/en/plants?cat=mango" → { lang: "en", path: "/plants?cat=mango" }
export function stripLocale(pathname = "/") {
  const match = pathname.match(/^\/(hi|en)(?=\/|\?|#|$)/);
  if (!match) return { lang: DEFAULT_LOCALE, path: pathname || "/" };
  const rest = pathname.slice(match[0].length); // "", "/plants", "?x=1"
  return { lang: match[1], path: rest.startsWith("/") ? rest : `/${rest}` };
}

// Text kis script mein hai? Devanagari → "hi", warna "en". (lang attribute → sahi font)
export function scriptLang(text = "") {
  return /[ऀ-ॿ]/.test(text) ? "hi" : "en";
}
