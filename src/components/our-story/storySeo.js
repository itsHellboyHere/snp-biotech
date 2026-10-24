// Google ke liye "हमारी कहानी": AboutPage + nursery (wahi @id jo poori site pe) + breadcrumb
// Sirf CONFIRMED data jaata hai (isConfirmed) — namoona naam / saal kabhi Google tak nahi pahunchta
import { isConfirmed } from "@/lib/live";
import { tr } from "@/i18n/config";
import { PAGES } from "@/content/pages";
import { breadcrumbJsonLd, businessJsonLd, webPageJsonLd } from "@/components/seo/schema";
import { FOUNDER, MILESTONES } from "./storyData";
import { FOUNDED_YEAR } from "./storyModel";

export function aboutPageJsonLd(lang, path) {
  const page = PAGES.story;
  const business = businessJsonLd(lang);

  // Saal aur sansthapak tabhi jab client ne pakka kiya ho
  if (isConfirmed(MILESTONES)) business.foundingDate = String(FOUNDED_YEAR);
  if (isConfirmed(FOUNDER)) business.founder = { "@type": "Person", name: tr(FOUNDER.name, "en") };

  return [
    webPageJsonLd(lang, { path, type: "AboutPage", name: page.meta.title, description: page.meta.description }),
    business,
    breadcrumbJsonLd(lang, { path, name: page.title }),
  ];
}
