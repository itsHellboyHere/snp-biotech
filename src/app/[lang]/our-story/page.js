import { lang as rootLang } from "next/root-params";
import StoryHero from "@/components/our-story/StoryHero/StoryHero";
import StoryTimeline from "@/components/our-story/StoryTimeline/StoryTimeline";
import FounderNote from "@/components/our-story/FounderNote/FounderNote";
import StoryNumbers from "@/components/our-story/StoryNumbers/StoryNumbers";
import StoryPromises from "@/components/our-story/StoryPromises/StoryPromises";
import StoryGallery from "@/components/our-story/StoryGallery/StoryGallery";
import StoryVoices from "@/components/our-story/StoryVoices/StoryVoices";
import StoryCta from "@/components/our-story/StoryCta/StoryCta";
import { aboutPageJsonLd } from "@/components/our-story/storySeo";
import { PAGES } from "@/content/pages";
import { pageMetadata } from "@/i18n/seo";
import styles from "@/components/our-story/StoryPage.module.css";

const PAGE = PAGES.story;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMetadata(lang, PAGE.path, PAGE.meta);
}

// हमारी कहानी: शुरुआत (dark) → सफ़र, बढ़ता तना (dark) → संस्थापक की बात (light) → दस साल का हिसाब (dark)
//              → चार वादे (light) → तस्वीरें (light) → किसानों की ज़ुबानी (dark) → अगला छल्ला (dark)
// Saara data: components/our-story/storyData.js — jo confirm nahi, wo live site pe apne aap chhupta hai
export default async function OurStoryPage() {
  const lang = await rootLang();
  const jsonLd = aboutPageJsonLd(lang, PAGE.path);

  return (
    <main id="main" className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <StoryHero />
      <StoryTimeline />
      <FounderNote />
      <StoryNumbers />
      <StoryPromises />
      <StoryGallery />
      <StoryVoices />
      <StoryCta />
    </main>
  );
}
