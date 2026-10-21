import Story from "@/components/story/Story";
import GrowSteps from "@/components/grow/GrowSteps/GrowSteps";
import GrowCta from "@/components/grow/GrowCta/GrowCta";
import { GROW_INTRO } from "@/components/grow/growData";
import { PAGES } from "@/content/pages";
import { pageMetadata } from "@/i18n/seo";

const PAGE = PAGES.grow;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMetadata(lang, PAGE.path, PAGE.meta);
}

// How We Grow: "बीज से बाग़ तक" film (pehle home pe thi) → hamara tarika → CTA
export default function HowWeGrowPage() {
  return (
    <main id="main">
      <Story intro={GROW_INTRO} titleAs="h1" />
      <GrowSteps />
      <GrowCta />
    </main>
  );
}
