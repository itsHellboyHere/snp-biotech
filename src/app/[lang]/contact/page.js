import { lang as rootLang } from "next/root-params";
import VisitHero from "@/components/visit/VisitHero/VisitHero";
import RouteCard from "@/components/visit/RouteCard/RouteCard";
import VisitDetails from "@/components/visit/VisitDetails/VisitDetails";
import BeforeYouCome from "@/components/visit/BeforeYouCome/BeforeYouCome";
import NurseryGlimpse from "@/components/visit/NurseryGlimpse/NurseryGlimpse";
import DeliveryBand from "@/components/visit/DeliveryBand/DeliveryBand";
import EnquiryForm from "@/components/enquiry/EnquiryForm/EnquiryForm";
import { localBusinessJsonLd } from "@/components/visit/visitSeo";
import { PAGES } from "@/content/pages";
import { pageMetadata } from "@/i18n/seo";
import styles from "@/components/visit/VisitPage.module.css";

const PAGE = PAGES.visit;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMetadata(lang, PAGE.path, PAGE.meta);
}

// नर्सरी आइए: खुली/बंद + पता → संदेश form (email — sabse zaroori) → नक्शा (raasta) → पहचान + समय → आने से पहले (+ मेरी सूची) → झलक → डिलीवरी
// Saara data: components/visit/visitData.js + lib/site.js
export default async function VisitPage() {
  const lang = await rootLang();
  const jsonLd = localBusinessJsonLd(lang, PAGE.path);

  return (
    <main id="main" className={styles.page} data-theme="light">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <VisitHero />
      <EnquiryForm defaultType="visit" />
      <RouteCard />
      <VisitDetails />
      <BeforeYouCome />
      <NurseryGlimpse />
      <DeliveryBand />
    </main>
  );
}
