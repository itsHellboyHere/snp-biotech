import Story from "@/components/story/Story";
import GrowSteps from "@/components/grow/GrowSteps/GrowSteps";
import GrowCta from "@/components/grow/GrowCta/GrowCta";
import { GROW_INTRO } from "@/components/grow/growData";
import { PAGES } from "@/content/pages";
import { pageMetadata } from "@/i18n/seo";
import { lang as rootLang } from "next/root-params";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, webPageJsonLd } from "@/components/seo/schema";

const PAGE = PAGES.grow;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMetadata(lang, PAGE.path, PAGE.meta);
}

// How We Grow: "बीज से बाग़ तक" film (pehle home pe thi) → hamara tarika → CTA
export default async function HowWeGrowPage() {
  const lang = await rootLang();
  const jsonLd = [
    webPageJsonLd(lang, { path: PAGE.path, name: PAGE.meta.title, description: PAGE.meta.description }),
    breadcrumbJsonLd(lang, { path: PAGE.path, name: PAGE.title }),
  ];
  return (
    <main id="main">
      <JsonLd data={jsonLd} />
      <Story intro={GROW_INTRO} titleAs="h1" />
      <GrowSteps />
      <GrowCta />
    </main>
  );
}
