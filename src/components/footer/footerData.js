// =========================================================
// Footer ka text + links (hi / en)
// Phone / WhatsApp / pata → lib/site.js se aate hain (ek jagah badlo, poori site mein badle)
// =========================================================

export const FOOTER = {
  line: {
    hi: "10+ साल से उत्तर प्रदेश के किसानों के साथ — सही किस्म, मज़बूत पौधे, सच्ची सलाह।",
    en: "Standing with Uttar Pradesh's farmers for 10+ years — the right variety, strong plants, honest advice.",
  },
  call: { hi: "कॉल करें", en: "Call us" },
  whatsapp: { hi: "WhatsApp करें", en: "WhatsApp us" },

  cols: {
    plants: { hi: "पौधे", en: "Plants" },
    pages: { hi: "पेज", en: "Pages" },
    contact: { hi: "संपर्क", en: "Contact" },
  },
  allPlants: { hi: "सभी पौधे", en: "All plants" },

  // Navbar ke links English mein hain — footer mein dono languages
  pages: [
    { href: "/", label: { hi: "होम", en: "Home" } },
    { href: "/plants", label: { hi: "हमारे पौधे", en: "Our Plants" } },
    { href: "/our-story", label: { hi: "हमारी कहानी", en: "Our Story" } },
    { href: "/how-we-grow", label: { hi: "पौधे कैसे तैयार होते हैं", en: "How We Grow" } },
    { href: "/contact", label: { hi: "नर्सरी आइए", en: "Visit the Nursery" } },
  ],

  phoneLabel: { hi: "फ़ोन", en: "Phone" },
  waLabel: { hi: "WhatsApp", en: "WhatsApp" },
  addressLabel: { hi: "पता", en: "Address" },
  hoursLabel: { hi: "समय", en: "Hours" },
  directions: { hi: "रास्ता देखें", en: "Get directions" },

  // मौसम की पट्टी
  season: {
    now: { hi: (m, names) => `${m} — अभी लगाने का मौसम: ${names}`, en: (m, names) => `${m} — in season now: ${names}` },
    next: {
      hi: (m, nextM, names) => `अभी ${m} है · अगला मौसम ${nextM} से: ${names}`,
      en: (m, nextM, names) => `It's ${m} · next season from ${nextM}: ${names}`,
    },
    cta: { hi: "पौधे देखें", en: "See plants" },
  },

  rights: { hi: "सर्वाधिकार सुरक्षित।", en: "All rights reserved." },
  madeBy: { hi: "वेबसाइट:", en: "Website by" },
  toTop: { hi: "ऊपर जाएँ", en: "Back to top" },
};
