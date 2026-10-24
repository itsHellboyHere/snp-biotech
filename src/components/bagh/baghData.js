// =========================================================
// "बाग़" segment — text (hi / en), video, aur scroll timing ek jagah
// Video: scripts/build-bagh-video.sh se banti hai (public/bagh/...)
// Upload hone ke baad Cloudinary se aati hai (har phone ko sahi codec) — warna public/ se
// =========================================================

import { cldImageUrl, cldVideoUrl } from "@/lib/cloudinary";

export const BAGH_VIDEO = {
  desktop: { src: cldVideoUrl("/bagh/bagh-desktop.mp4"), poster: cldImageUrl("/bagh/poster-desktop.webp", { width: 1920 }) },
  mobile: { src: cldVideoUrl("/bagh/bagh-mobile.mp4"), poster: cldImageUrl("/bagh/poster-mobile.webp", { width: 1080 }) },
};

export const BAGH = {
  // Bada shabd jiske andar video dikhti hai
  word: { hi: "बाग़", en: "Orchard" },
  // Shuru mein video ke kone pe — visitor samjhe ye kya hai
  caption: { hi: "हमारी नर्सरी · उत्तर प्रदेश", en: "Our nursery · Uttar Pradesh" },
  // Shabd ke neeche chhoti line
  sub: { hi: "10+ साल से, एक-एक पौधा ध्यान से।", en: "10+ years, one plant at a time." },
  // Gradient wale fal — tone = CSS mein rang
  fruits: {
    hi: [
      { text: "आम.", tone: "mango" },
      { text: "अमरूद.", tone: "guava" },
      { text: "लीची.", tone: "litchi" },
    ],
    en: [
      { text: "Mango.", tone: "mango" },
      { text: "Guava.", tone: "guava" },
      { text: "Litchi.", tone: "litchi" },
    ],
  },
  headline: { hi: "आपका बाग़, हमारे पौधे।", en: "Your orchard. Our plants." },
  more: {
    hi: "साथ में किन्नू, मौसमी, नींबू, चीकू और नाशपाती भी।",
    en: "Plus kinnow, mosambi, lemon, chikoo and pear.",
  },
};

// "क्यों SNP" — scroll ke saath ek-ek shabd roshan hota hai.
// [[...]] wala hissa roshan hone pe gradient rang leta hai.
export const WHY = {
  eyebrow: { hi: "क्यों SNP", en: "Why SNP" },
  text: {
    hi: "हम दस साल से उत्तर प्रदेश में कलमी फलदार पौधे तैयार कर रहे हैं। [[हर पौधा सही किस्म, मज़बूत जड़ और भरपूर फल के लिए।]] बीज से लेकर आपके खेत तक, हर कदम पर हमारी देखभाल।",
    en: "For over ten years, we've raised grafted fruit plants in Uttar Pradesh. [[Every plant is chosen for the right variety, strong roots and a generous harvest.]] From seed to your field, we care for every step.",
  },
};

// Scroll timing (0 → 1 = poora pinned hissa)
export const BAGH_TIMING = {
  captionOut: [0.04, 0.1], // video ka caption jaata hai
  zoomStart: 0.08, // yahan tak sirf poori video
  curtainIn: [0.06, 0.14], // dark parda halke se aata hai
  zoomEnd: 0.48, // shabd apni jagah pe
  subIn: [0.42, 0.5],
  subOut: [0.6, 0.66],
  wordOut: [0.62, 0.72], // video bujhti hai → shabd gayab
  fruitsStart: 0.7, // har fal thoda baad mein
  fruitsGap: 0.05,
  fruitsDur: 0.08,
  headIn: [0.86, 0.93],
  moreIn: [0.9, 0.97],
};
