// =========================================================
// "पौधे लगाने का सही समय" — 12 महीने का पहिया (hi / en)
// months = kin mahinon mein lagana sahi hai (0 = जनवरी … 11 = दिसंबर)
// TODO: client se har paudhe ka season confirm (UP ke hisaab se aam andaaza hai)
// =========================================================

export const SEASON = {
  eyebrow: { hi: "पौधे लगाने का सही समय", en: "When to plant" },
  title: { hi: "कब लगाएँ? पहिया बताएगा।", en: "When to plant? Ask the wheel." },
  line: {
    hi: "ऊपर वाला महीना आज का है। रंगीन हिस्सा = उस पौधे को लगाने का सबसे अच्छा समय।",
    en: "The month at the top is today. The coloured part is the best time to plant.",
  },
  now: { hi: "अभी", en: "Now" },
  nowIs: { hi: (m) => `अभी ${m} है`, en: (m) => `It's ${m} now` },
  inSeason: { hi: "अभी लगाने का सही समय है ✓", en: "Right time to plant now ✓" },
  nextIn: {
    hi: (m, n) => `अगला सही समय: ${m} (${n} महीने बाद)`,
    en: (m, n) => `Next window: ${m} (in ${n} month${n > 1 ? "s" : ""})`,
  },
  bookAhead: {
    hi: "पहले से बुक कर लीजिए — मौसम आते ही पौधे तैयार मिलेंगे।",
    en: "Book ahead — your plants will be ready when the season starts.",
  },
  bestTime: { hi: "सही समय", en: "Best time" },
  pick: { hi: "पौधा चुनिए", en: "Pick a plant" },
  cta: { hi: "बुकिंग के लिए WhatsApp करें", en: "Book on WhatsApp" },
  message: {
    hi: (fruit) => `नमस्ते SNP Biotech! मुझे ${fruit} के पौधों की बुकिंग करनी है।`,
    en: (fruit) => `Hello SNP Biotech! I'd like to book ${fruit} plants.`,
  },
};

export const MONTHS = {
  short: {
    hi: ["जन", "फ़र", "मार्च", "अप्रै", "मई", "जून", "जुला", "अग", "सित", "अक्टू", "नव", "दिस"],
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  full: {
    hi: ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
    en: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
};

export const SEASON_FRUITS = [
  { id: "mango", name: { hi: "आम", en: "Mango" }, img: "/home/fruit-mango.webp", color: "#f6b941", months: [6, 7, 8] },
  { id: "guava", name: { hi: "अमरूद", en: "Guava" }, img: "/home/fruit-guava.webp", color: "#8fd16a", months: [1, 2, 6, 7, 8] },
  { id: "litchi", name: { hi: "लीची", en: "Litchi" }, img: "/home/fruit-litchi.webp", color: "#e04a5f", months: [7, 8] },
  { id: "chikoo", name: { hi: "चीकू", en: "Chikoo" }, img: "/home/fruit-chikoo.webp", color: "#b07a44", months: [1, 2, 6, 7, 8] },
  { id: "kinnow", name: { hi: "किन्नू", en: "Kinnow" }, img: "/home/fruit-kinnow.webp", color: "#f08a2c", months: [1, 2, 6, 7, 8] },
  { id: "mosambi", name: { hi: "मौसमी", en: "Mosambi" }, img: "/home/fruit-mosambi.webp", color: "#9ccf4f", months: [1, 2, 6, 7, 8] },
  { id: "lemon", name: { hi: "नींबू", en: "Lemon" }, img: "/home/fruit-lemon.webp", color: "#d9c93a", months: [1, 2, 6, 7, 8] },
  { id: "pear", name: { hi: "नाशपाती", en: "Pear" }, img: "/home/fruit-pear.webp", color: "#b5cf5a", months: [11, 0, 1] },
];
