import { lang as rootLang } from "next/root-params";
import PlantsExplorer from "@/components/plants/PlantsExplorer";
import GrowthScroll from "@/components/plants/GrowthScroll/GrowthScroll";
import BulkBand from "@/components/plants/BulkBand/BulkBand";
import { PLANTS } from "@/components/plants/plantsModel";
import { PAGES } from "@/content/pages";
import { pageMetadata } from "@/i18n/seo";
import { localize, tr } from "@/i18n/config";
import { site } from "@/lib/site";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, webPageJsonLd } from "@/components/seo/schema";
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

  // Google ke liye: ye page + breadcrumb + is page pe kaun-kaun se paudhe hain
  const listUrl = `${site.url}${localize(lang, PAGE.path)}`;
  const jsonLd = [
    webPageJsonLd(lang, {
      path: PAGE.path,
      type: "CollectionPage",
      name: PAGE.meta.title,
      description: PAGE.meta.description,
      image: PLANTS[0]?.shot,
    }),
    breadcrumbJsonLd(lang, { path: PAGE.path, name: PAGE.title }),
    {
      "@type": "ItemList",
      "@id": `${listUrl}#plants`,
      name: tr(PAGE.meta.title, lang),
      url: listUrl,
      numberOfItems: PLANTS.length,
      itemListElement: PLANTS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${p.name[lang] ?? p.name.hi} (${p.name[lang === "en" ? "hi" : "en"]})`,
        url: `${site.url}${localize(lang, `${PAGE.path}?plant=${p.id}`)}`,
        image: `${site.url}${p.shot}`,
      })),
    },
  ];

  return (
    <main id="main" className={styles.page} data-theme="light">
      <JsonLd data={jsonLd} />
      <PlantsExplorer />
      <GrowthScroll />
      <BulkBand />
    </main>
  );
}
