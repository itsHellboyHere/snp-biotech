import { site } from "@/lib/site";

// /robots.txt — saare pages crawl karne do, sirf andar ka API nahi; sitemap ka pata do
// (snp-biotech.vercel.app jaisa doosra pata → proxy.js "noindex" header lagata hai, Google wahan index nahi karega)
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
