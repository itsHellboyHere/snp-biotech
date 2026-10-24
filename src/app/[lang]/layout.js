import { notFound } from "next/navigation";
import { Sora, Plus_Jakarta_Sans, Tiro_Devanagari_Hindi, Mukta } from "next/font/google";
import "lenis/dist/lenis.css";
import "../globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Navbar from "@/components/nav/Navbar/Navbar";
import Footer from "@/components/footer/Footer/Footer";
import Loader from "@/components/loader/Loader";
import LoaderBoot from "@/components/loader/LoaderBoot";
import { LangProvider } from "@/i18n/LangProvider";
import { LOCALES, hasLocale } from "@/i18n/config";
import { pageMetadata } from "@/i18n/seo";
import { PAGES } from "@/content/pages";
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

/* ---------- SEO (har language ka apna) ----------
   Home ka title/description: content/pages.js (PAGES.home). Baaki pages apna-apna dete hain,
   aur template se peeche " · SNP Biotech" lag jaata hai. */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const base = pageMetadata(lang, "/", PAGES.home.meta);
  return {
    ...base,
    metadataBase: new URL(site.url),
    title: { default: base.title, template: "%s · SNP Biotech" },
    applicationName: "SNP Biotech",
    authors: [{ name: "SNP Biotech", url: site.url }],
    creator: "CreatorMonk",
    publisher: "SNP Biotech",
    category: "agriculture",
    // Google: poori photo preview + lamba snippet dikhane ki ijaazat
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    // iPhone khud numbers / pate ko link na banaye (hum khud sahi links dete hain)
    formatDetection: { telephone: false, email: false, address: false },
    // Google Search Console: Vercel → Environment Variables mein GOOGLE_SITE_VERIFICATION
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
      : {}),
    // Local SEO — jagah ka sanket
    other: {
      "geo.region": "IN-UP",
      "geo.placename": "Agwanpur, Moradabad",
    },
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
    // suppressHydrationWarning: LoaderBoot script <html> pe data-loader lagata hai (React se pehle)
    <html lang={lang} id="top" className={fontVariables} suppressHydrationWarning>
      <body>
        {/* Sabse pehle: dobara aane pe loader ki jhalak bhi na dikhe */}
        <LoaderBoot />
        <LangProvider lang={lang}>
          <SmoothScroll />
          {/* Site khulne wala loader — kaunsa: components/loader/loaderConfig.js (ACTIVE) */}
          <Loader />
          <Navbar />
          {children}
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
