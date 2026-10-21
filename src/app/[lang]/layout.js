import { notFound } from "next/navigation";
import { Sora, Plus_Jakarta_Sans, Tiro_Devanagari_Hindi, Mukta } from "next/font/google";
import "lenis/dist/lenis.css";
import "../globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Navbar from "@/components/nav/Navbar/Navbar";
import Footer from "@/components/footer/Footer/Footer";
import { LangProvider } from "@/i18n/LangProvider";
import { LOCALES, hasLocale } from "@/i18n/config";
import { pageMetadata } from "@/i18n/seo";
import { site } from "@/lib/site";

/* ---------- Fonts ----------
   English: Sora (headings, logo, bade links) + Plus Jakarta Sans (normal text, buttons)
   Hindi:   Tiro Devanagari Hindi (headings) + Mukta (text)
   <html lang> se globals.css sahi font chunta hai */

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const tiroHindi = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  weight: "400",
  variable: "--font-tiro",
  display: "swap",
});

const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-mukta",
  display: "swap",
});

const fontVariables = [sora, jakarta, tiroHindi, mukta].map((f) => f.variable).join(" ");

/* ---------- Dono languages build time pe hi ban jaati hain (fast + SEO) ---------- */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

/* ---------- SEO (har language ka apna) ---------- */
const SEO = {
  title: {
    hi: "SNP Biotech — आपकी भरोसेमंद पौधों की नर्सरी, उत्तर प्रदेश",
    en: "SNP Biotech — Your Trusted Plant Nursery in Uttar Pradesh",
  },
  description: {
    hi: "10+ साल से उत्तर प्रदेश के किसानों के लिए आम, अमरूद, लीची, चीकू, किन्नू, मौसमी, नींबू, नाशपाती और आँवला के उन्नत कलमी पौधे — साथ में सागवान, नीम और गुलमोहर भी।",
    en: "For 10+ years, high-quality grafted mango, guava, litchi, chikoo, kinnow, mosambi, lemon, pear and amla plants for farmers across Uttar Pradesh — plus teak, neem and gulmohar.",
  },
};

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const base = pageMetadata(lang, "/", SEO);
  return {
    ...base,
    metadataBase: new URL(site.url),
    title: { default: base.title, template: "%s · SNP Biotech" },
    openGraph: { ...base.openGraph, siteName: site.name, type: "website" },
  };
}

/* ---------- Mobile viewport ----------
   viewportFit: "cover" → iPhone notch / home bar tak design jaaye
   themeColor → phone browser ki top bar bhi dark green ho */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a1a12",
};

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} id="top" className={fontVariables}>
      <body>
        <LangProvider lang={lang}>
          <SmoothScroll />
          <Navbar />
          {children}
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
