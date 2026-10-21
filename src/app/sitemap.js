import { site } from "@/lib/site";
import { LOCALES, localize } from "@/i18n/config";

// /sitemap.xml — Google ko har page ke dono versions (Hindi + English) batata hai
const PATHS = ["/", "/plants", "/our-story", "/how-we-grow", "/contact"];

export default function sitemap() {
  const abs = (p) => new URL(p, site.url).toString();
  return PATHS.flatMap((path) =>
    LOCALES.map((lang) => ({
      url: abs(localize(lang, path)),
      changeFrequency: "monthly",
      priority: path === "/" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, abs(localize(l, path))])),
      },
    }))
  );
}
