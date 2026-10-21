// =========================================================
// "How We Grow" — home ka teaser card + page ka text (hi / en)
// Frames wahi jo Story film mein hain (public/hero/...)
// =========================================================

// Teaser card mein badalti tasveerein — har ek Story ke ek hissa ki
// segment = STORY_SEGMENTS ka index (naam wahin se aata hai)
export const TEASER_SLIDES = [
  { segment: 0, desktop: "/hero/desktop/frame_0019.webp", mobile: "/hero/mobile/frame_0012.webp" },
  { segment: 1, desktop: "/hero/desktop/frame_0052.webp", mobile: "/hero/mobile/frame_0031.webp" },
  { segment: 2, desktop: "/hero/desktop/frame_0077.webp", mobile: "/hero/mobile/frame_0046.webp" },
  { segment: 3, desktop: "/hero/desktop/frame_0102.webp", mobile: "/hero/mobile/frame_0062.webp" },
  { segment: 4, desktop: "/hero/desktop/frame_0132.webp", mobile: "/hero/mobile/frame_0079.webp" },
];

export const TEASER_INTERVAL = 2800; // ms — har tasveer kitni der

export const GROW_TEASER = {
  eyebrow: { hi: "हम पौधे कैसे तैयार करते हैं", en: "How we grow" },
  title: { hi: "बीज से बाग़ तक।", en: "From seed to orchard." },
  line: {
    hi: "देखिए, हमारी नर्सरी में हर पौधा किन पाँच कदमों से गुज़रता है।",
    en: "See the five stages every plant goes through at our nursery.",
  },
  cta: { hi: "पूरी प्रक्रिया देखें", en: "Watch the full process" },
  href: "/how-we-grow",
};

// How We Grow page — Story film ka intro (page ka h1)
export const GROW_INTRO = {
  eyebrow: { hi: "हम पौधे कैसे तैयार करते हैं", en: "How we grow" },
  title: { hi: "बीज से बाग़ तक।", en: "From seed to orchard." },
  line: {
    hi: "हमारी नर्सरी में हर पौधा पाँच कदमों से गुज़रता है — स्क्रॉल करके देखिए।",
    en: "Every plant at our nursery goes through five stages — scroll to watch.",
  },
};

// Film ke baad: hamara tarika, kadam-dar-kadam
// TODO: client se har kadam confirm karna (khaas kar "मातृ पौधा" aur "खुली धूप" wali baat)
export const GROW_STEPS = {
  eyebrow: { hi: "हमारा तरीका", en: "Our method" },
  title: { hi: "हर पौधे के पीछे, सालों का अनुभव।", en: "Years of experience behind every plant." },
  steps: [
    {
      title: { hi: "सही मातृ पौधा", en: "The right mother plant" },
      line: {
        hi: "कलम सिर्फ़ चुने हुए, स्वस्थ और फल देने वाले पौधों से ली जाती है — ताकि किस्म पक्की रहे।",
        en: "Scions come only from selected, healthy, fruiting mother plants — so the variety stays true.",
      },
    },
    {
      title: { hi: "हाथ से कलम", en: "Grafted by hand" },
      line: {
        hi: "अनुभवी माली हर पौधे की कलम हाथ से बाँधते हैं और जुड़ने तक उस पर नज़र रखते हैं।",
        en: "Experienced gardeners graft every plant by hand and watch over it until the graft takes.",
      },
    },
    {
      title: { hi: "रोज़ की देखभाल", en: "Daily care" },
      line: {
        hi: "पानी, धूप, खाद और कीट-रोग से बचाव — हर दिन, सही मात्रा में।",
        en: "Water, sunlight, nutrition and pest protection — every day, in the right measure.",
      },
    },
    {
      title: { hi: "खुली धूप में मज़बूत", en: "Hardened in the open" },
      line: {
        hi: "बेचने से पहले पौधे खुली धूप में रखे जाते हैं, ताकि आपके खेत में आसानी से लग जाएँ।",
        en: "Before sale, plants are hardened in open sunlight so they settle easily in your field.",
      },
    },
    {
      title: { hi: "सुरक्षित पैकिंग", en: "Packed with care" },
      line: {
        hi: "जड़ और मिट्टी बैग में सुरक्षित — नर्सरी से सीधे आपके खेत तक।",
        en: "Roots and soil stay safe in the bag — straight from our nursery to your farm.",
      },
    },
  ],
};

export const GROW_CTA = {
  title: { hi: "अपने बाग़ के लिए पौधे चाहिए?", en: "Planting an orchard?" },
  line: {
    hi: "किस्म, संख्या और डिलीवरी — WhatsApp पर पूछिए, हम जल्द जवाब देंगे।",
    en: "Variety, quantity, delivery — ask us on WhatsApp and we'll reply soon.",
  },
  whatsapp: { hi: "WhatsApp पर पूछें", en: "Ask on WhatsApp" },
  plants: { label: { hi: "पौधे देखें", en: "Explore plants" }, href: "/plants" },
};
