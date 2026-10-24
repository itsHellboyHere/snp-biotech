import { site } from "@/lib/site";
import { DEFAULT_LOCALE, LOCALES, localize } from "@/i18n/config";
import { PLANTS } from "@/components/plants/plantsModel";

// =========================================================
// /sitemap.xml — Google ko har page ke dono versions (Hindi + English) + photos batata hai
// Naya page bane → yahan PAGES mein jodo
// priority: Google ke liye ishaara ki kaun-sa page zyada zaroori hai (1 = sabse)
// =========================================================
const PAGES = [
  { path: "/", priority: 1, changeFrequency: "weekly", images: ["/brand/og.jpg"] },
  {
    path: "/plants",
    priority: 0.9,
    changeFrequency: "weekly",
    images: PLANTS.map((p) => p.shot).filter(Boolean),
  },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/our-story", priority: 0.7, changeFrequency: "monthly" },
  { path: "/how-we-grow", priority: 0.6, changeFrequency: "monthly" },
];

export default function sitemap() {
  const abs = (p) => new URL(p, site.url).toString();
  const lastModified = new Date(); // har deploy pe taaza

  return PAGES.flatMap(({ path, priority, changeFrequency, images }) => {
    const languages = Object.fromEntries(
      LOCALES.map((l) => [l === "hi" ? "hi-IN" : "en-IN", abs(localize(l, path))])
    );
    languages["x-default"] = abs(localize(DEFAULT_LOCALE, path));

    return LOCALES.map((lang) => ({
      url: abs(localize(lang, path)),
      lastModified,
      changeFrequency,
      // English copy thoda kam zaroori — zyaadatar log Hindi mein dhoondhte hain
      priority: lang === DEFAULT_LOCALE ? priority : Math.round(priority * 0.9 * 10) / 10,
      alternates: { languages },
      ...(images?.length ? { images: images.map(abs) } : {}),
    }));
  });
}
