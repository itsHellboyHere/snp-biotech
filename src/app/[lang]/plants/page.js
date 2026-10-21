import { lang as rootLang } from "next/root-params";
import PlantsExplorer from "@/components/plants/PlantsExplorer";
import GrowthScroll from "@/components/plants/GrowthScroll/GrowthScroll";
import BulkBand from "@/components/plants/BulkBand/BulkBand";
import { PLANTS } from "@/components/plants/plantsModel";
import { PAGES } from "@/content/pages";
import { pageMetadata } from "@/i18n/seo";
import { localize, tr } from "@/i18n/config";
import { site } from "@/lib/site";
import styles from "@/components/plants/PlantsExplorer.module.css";

const PAGE = PAGES.plants;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMetadata(lang, PAGE.path, PAGE.meta);
}

// Plants page: header + mausam carousel + catalogue (filter, search, detail, tulna, meri suchi)
// → "पौधे से पेड़" scroll film → bade order ka band
export default async function PlantsPage() {
  const lang = await rootLang();

  // Google ke liye: is page pe kaun-kaun se paudhe hain (structured data)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: tr(PAGE.meta.title, lang),
    url: `${site.url}${localize(lang, PAGE.path)}`,
    itemListElement: PLANTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${p.name[lang] ?? p.name.hi} (${p.name[lang === "en" ? "hi" : "en"]})`,
      url: `${site.url}${localize(lang, `${PAGE.path}?plant=${p.id}`)}`,
      image: `${site.url}${p.shot}`,
    })),
  };

  return (
    <main id="main" className={styles.page} data-theme="light">
      <script
        type="application/ld+json"
        // "<" escape — data mein kabhi kuch ajeeb aaye to bhi script tag na toote
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PlantsExplorer />
      <GrowthScroll />
      <BulkBand />
    </main>
  );
}
