// Hero ka text + band ki tiles — dono languages { hi, en }.
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

// Client ki ASLI nursery photos (720px, 1:1) — scripts/build-real-photos.py banata hai
// Nayi photo: media-src/client-photos mein daalo → script mein "hero? True" → yahan ek tile
// (Purani Grok wali pedh ki photos public/hero-trees mein padi hain — ab hero mein nahi)
// TODO(client): nashpati, aamla, sagwan, neem, gulmohar ki asli photo aaye to unki tile bhi
const R = "/hero-real";

// Photo tile: name = bada naam (page ki language), sub = chhota naam (doosri language)
// Brand tile: big + small
export const HERO_TILES = [
  {
    type: "photo",
    src: `${R}/mango-2.webp`,
    name: { hi: "आम", en: "Mango" },
    sub: { hi: "Mango", en: "आम" },
    alt: { hi: "नर्सरी की कतारों के बीच आम का कलमी पौधा", en: "A grafted mango plant between nursery rows" },
  },
  { type: "brand", big: { hi: "10+ साल", en: "10+ years" }, small: { hi: "नर्सरी का अनुभव", en: "of nursery experience" } },
  {
    type: "photo",
    src: `${R}/guava-1.webp`,
    name: { hi: "अमरूद", en: "Guava" },
    sub: { hi: "Taiwan pink guava", en: "ताइवान पिंक अमरूद" },
    alt: { hi: "थैली में लगे ताइवान पिंक अमरूद के तीन पौधे", en: "Three Taiwan pink guava plants in grow bags" },
  },
  {
    type: "photo",
    src: `${R}/litchi-1.webp`,
    name: { hi: "लीची", en: "Litchi" },
    sub: { hi: "Litchi", en: "लीची" },
    alt: { hi: "लाल लीचियों से लदा पेड़", en: "A litchi tree with red fruit" },
  },
  { type: "brand", big: { hi: "कलमी", en: "Grafted" }, small: { hi: "ग्राफ्टेड पौधे, जल्दी फल", en: "plants that fruit sooner" } },
  {
    type: "photo",
    src: `${R}/chikoo-2.webp`,
    name: { hi: "चीकू", en: "Chikoo" },
    sub: { hi: "Chikoo", en: "चीकू" },
    alt: { hi: "गमले में फलों से लदा चीकू का पेड़", en: "A potted chikoo tree full of fruit" },
  },
  {
    type: "photo",
    src: `${R}/kinnow-2.webp`,
    name: { hi: "किन्नू", en: "Kinnow" },
    sub: { hi: "Kinnow", en: "किन्नू" },
    alt: { hi: "हरे किन्नुओं से लदा पौधा", en: "A kinnow plant loaded with green fruit" },
  },
  { type: "brand", big: { hi: "सीधे नर्सरी से", en: "Nursery direct" }, small: { hi: "आपके खेत तक", en: "to your farm" } },
  {
    type: "photo",
    src: `${R}/mosambi-1.webp`,
    name: { hi: "मौसमी", en: "Mosambi" },
    sub: { hi: "Mosambi", en: "मौसमी" },
    alt: { hi: "थैली में फल लगा मौसमी का पौधा", en: "A fruiting mosambi plant in a grow bag" },
  },
  {
    type: "photo",
    src: `${R}/lemon-1.webp`,
    name: { hi: "कागज़ी नींबू", en: "Kagzi lemon" },
    sub: { hi: "Kagzi lemon", en: "कागज़ी नींबू" },
    alt: { hi: "थैली में नींबू लगा कागज़ी नींबू का पौधा", en: "A Kagzi lemon plant with fruit, in a grow bag" },
  },
];
