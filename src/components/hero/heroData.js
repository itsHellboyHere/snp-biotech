// Hero ka text + band ki tiles — dono languages { hi, en }.
// Grok ki nayi images aane pe bas `src` badlo.
export const HERO = {
  eyebrow: { hi: "10+ साल का भरोसा · उत्तर प्रदेश", en: "10+ years of trust · Uttar Pradesh" },
  titleLines: {
    hi: ["पौधे जो पीढ़ियों", "तक फल दें।"],
    en: ["Plants that fruit", "for generations."],
  },
  line: {
    hi: "आम, अमरूद, लीची से नींबू तक — उन्नत किस्म के कलमी पौधे, सीधे हमारी नर्सरी से।",
    en: "From mango, guava and litchi to lemon — high-yield grafted plants, straight from our nursery.",
  },
  primary: { label: { hi: "पौधे देखें", en: "Explore plants" }, href: "/plants" },
  secondary: { label: { hi: "WhatsApp पर पूछें", en: "Ask on WhatsApp" } },
};

// Grok se bani asli pedh ki tasveerein (zameen mein lage, ek jaisi roshni) — scripts/build-hero-trees.py
// TODO: client ki list aane pe sagwan / neem / aamla / gulmohar bhi (public/hero-trees mein taiyaar hain)
const G = "/hero-trees";

// Photo tile: name = bada naam (page ki language), sub = chhota naam (doosri language)
// Brand tile: big + small
export const HERO_TILES = [
  {
    type: "photo",
    src: `${G}/mango.webp`,
    name: { hi: "आम", en: "Mango" },
    sub: { hi: "Mango", en: "आम" },
    alt: { hi: "फलों से लदा आम का पेड़", en: "A mango tree loaded with fruit" },
  },
  { type: "brand", big: { hi: "10+ साल", en: "10+ years" }, small: { hi: "नर्सरी का अनुभव", en: "of nursery experience" } },
  {
    type: "photo",
    src: `${G}/guava.webp`,
    name: { hi: "अमरूद", en: "Guava" },
    sub: { hi: "Taiwan pink guava", en: "ताइवान पिंक अमरूद" },
    alt: { hi: "अमरूद का पेड़", en: "A guava tree" },
  },
  {
    type: "photo",
    src: `${G}/litchi.webp`,
    name: { hi: "लीची", en: "Litchi" },
    sub: { hi: "Litchi", en: "लीची" },
    alt: { hi: "लाल लीचियों से लदा पेड़", en: "A litchi tree with red fruit" },
  },
  { type: "brand", big: { hi: "कलमी", en: "Grafted" }, small: { hi: "ग्राफ्टेड पौधे, जल्दी फल", en: "plants that fruit sooner" } },
  {
    type: "photo",
    src: `${G}/chikoo.webp`,
    name: { hi: "चीकू", en: "Chikoo" },
    sub: { hi: "Chikoo", en: "चीकू" },
    alt: { hi: "चीकू का पेड़", en: "A chikoo tree" },
  },
  {
    type: "photo",
    src: `${G}/kinnow.webp`,
    name: { hi: "किन्नू", en: "Kinnow" },
    sub: { hi: "Kinnow", en: "किन्नू" },
    alt: { hi: "संतरी किन्नुओं से लदा पेड़", en: "A kinnow tree full of orange fruit" },
  },
  { type: "brand", big: { hi: "सीधे नर्सरी से", en: "Nursery direct" }, small: { hi: "आपके खेत तक", en: "to your farm" } },
  {
    type: "photo",
    src: `${G}/mosambi.webp`,
    name: { hi: "मौसमी", en: "Mosambi" },
    sub: { hi: "Mosambi", en: "मौसमी" },
    alt: { hi: "मौसमी का पेड़", en: "A mosambi tree" },
  },
  {
    type: "photo",
    src: `${G}/lemon.webp`,
    name: { hi: "कागज़ी नींबू", en: "Kagzi lemon" },
    sub: { hi: "Kagzi lemon", en: "कागज़ी नींबू" },
    alt: { hi: "पीले नींबुओं से लदा पेड़", en: "A lemon tree with yellow lemons" },
  },
  {
    type: "photo",
    src: `${G}/pear.webp`,
    name: { hi: "नाशपाती", en: "Pear" },
    sub: { hi: "Pear", en: "नाशपाती" },
    alt: { hi: "नाशपाती का पेड़", en: "A pear tree" },
  },
];
