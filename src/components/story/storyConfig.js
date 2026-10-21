// =========================================================
// Story ("बीज से बाग़ तक") ki saari settings ek jagah
// Frames: scripts/build-hero-frames.sh se bante hain (public/hero/...)
// =========================================================

export const STORY_FRAMES = {
  // Laptop / landscape — poora 16:9 frame
  desktop: { path: "/hero/desktop/frame_", count: 150 },
  // Phone / portrait — 9:16 crop, kam frames (kam data + kam RAM)
  mobile: { path: "/hero/mobile/frame_", count: 90 },
};

export function frameSrc(set, index) {
  return `${set.path}${String(index + 1).padStart(4, "0")}.webp`;
}

export const STORY_INTRO = {
  eyebrow: { hi: "हमारी कहानी", en: "Our story" },
  title: { hi: "बीज से बाग़ तक।", en: "From seed to orchard." },
  line: { hi: "देखिए, हमारी नर्सरी में एक पौधा कैसे तैयार होता है।", en: "See how a plant is raised at our nursery." },
  posterAlt: { hi: "बीज से अंकुर निकलता हुआ", en: "A seed sprouting" },
  navLabel: { hi: "कहानी के हिस्से", en: "Story chapters" },
};

// Segments — start/end video ke hisaab se (0 → 1 = poora video)
// label: neeche wali segment bar · title + line: card pe caption
// Caption ke neeche chhoti line = title doosri language mein (Hindi page pe English, English pe Hindi)
export const STORY_SEGMENTS = [
  {
    id: "seed",
    label: { hi: "बीज", en: "Seed" },
    title: { hi: "सही किस्म से शुरुआत।", en: "It starts with the right variety." },
    line: {
      hi: "अच्छी फसल की नींव, सही किस्म के बीज से पड़ती है।",
      en: "A good harvest begins with the right variety of seed.",
    },
    start: 0,
    end: 0.25,
  },
  {
    id: "sprout",
    label: { hi: "अंकुर", en: "Sprout" },
    title: { hi: "देखभाल से मज़बूत जड़ें।", en: "Care that builds strong roots." },
    line: {
      hi: "हर पौधे को पानी, धूप और पोषण सही मात्रा में मिलता है।",
      en: "Every plant gets the right amount of water, sunlight and nutrition.",
    },
    start: 0.25,
    end: 0.43,
  },
  {
    id: "sapling",
    label: { hi: "पौधा", en: "Sapling" },
    title: { hi: "कलमी पौधा, तैयार।", en: "Grafted, and ready." },
    line: {
      hi: "कलमी पौधे जल्दी फल देते हैं और किस्म पक्की रहती है।",
      en: "Grafted plants fruit sooner, and the variety stays true.",
    },
    start: 0.43,
    end: 0.6,
  },
  {
    id: "fruit",
    label: { hi: "फल", en: "Fruit" },
    title: { hi: "आपके खेत में मीठे फल।", en: "Sweet fruit, in your own field." },
    line: {
      hi: "आम, अमरूद, लीची, चीकू, किन्नू, मौसमी, नींबू और नाशपाती।",
      en: "Mango, guava, litchi, chikoo, kinnow, mosambi, lemon and pear.",
    },
    start: 0.6,
    end: 0.76,
  },
  {
    id: "nursery",
    label: { hi: "नर्सरी", en: "Nursery" },
    title: { hi: "10+ साल से, उत्तर प्रदेश में।", en: "10+ years, in Uttar Pradesh." },
    line: { hi: "सीधे हमारी नर्सरी से आपके खेत तक।", en: "Straight from our nursery to your farm." },
    start: 0.76,
    end: 1,
    cta: { label: { hi: "पौधे देखें", en: "Explore plants" }, href: "/plants" },
  },
];
