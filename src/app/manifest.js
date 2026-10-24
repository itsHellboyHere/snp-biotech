// =========================================================
// /manifest.webmanifest — Android / Chrome ka "Home screen pe jodo" (Add to Home screen)
// Next.js khud <link rel="manifest"> har page pe laga deta hai.
// - Icon: logo ke patte, ivory background (apple-icon jaisa) — public/brand/icon-*.png
// - maskable: Android ke gol / squircle icon ke liye (patte beech ke safe zone mein)
// - Khulne pe splash: gehra hara (loader jaisa), upar ki bar bhi wahi rang
// =========================================================

export default function manifest() {
  return {
    name: "SNP Biotech — पौधों की नर्सरी",
    short_name: "SNP Biotech",
    description: "आम, अमरूद, लीची, नींबू, सागवान और भी — उन्नत कलमी पौधे, मुरादाबाद (उ.प्र.)।",
    lang: "hi",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0a1a12",
    theme_color: "#0a1a12",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
