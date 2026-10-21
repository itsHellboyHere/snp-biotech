import { site } from "@/lib/site";

// /robots.txt — sab pages crawl karne do, sitemap ka pata do
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
