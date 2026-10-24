import { lang as rootLang } from "next/root-params";
import Hero from "@/components/hero/Hero";
import JsonLd from "@/components/seo/JsonLd";
import { businessJsonLd, websiteJsonLd, webPageJsonLd } from "@/components/seo/schema";
import { PAGES } from "@/content/pages";
import PlantCategories from "@/components/categories/PlantCategories/PlantCategories";
import Bagh from "@/components/bagh/Bagh";
import GrowTeaser from "@/components/grow/GrowTeaser/GrowTeaser";
import TrustRings from "@/components/trust/TrustRings/TrustRings";
import BaghPlanner from "@/components/planner/BaghPlanner/BaghPlanner";
import OrderChat from "@/components/order/OrderChat/OrderChat";
import SeasonWheel from "@/components/seasons/SeasonWheel/SeasonWheel";

// Home — text language apne aap LangProvider se aata hai (/ = Hindi, /en = English)
export default async function HomePage() {
  const lang = await rootLang();
  // Google: website + nursery (naam, pata, samay, phone) + ye page
  const jsonLd = [
    websiteJsonLd(lang),
    businessJsonLd(lang),
    webPageJsonLd(lang, { path: "/", name: PAGES.home.meta.title, description: PAGES.home.meta.description }),
  ];
  return (
    <main id="main">
      <JsonLd data={jsonLd} />
      <Hero />
      <PlantCategories />
      <Bagh />
      <TrustRings />
      <GrowTeaser />
      <BaghPlanner />
      <OrderChat />
      <SeasonWheel />
    </main>
  );
}
