// =========================================================
// "आपका बाग़ कितना बड़ा है?" — बाग़ planner (hi / en)
// Ginti = lagbhag (aam dooriyon ke hisaab se). TODO: client se dooriyan/ginti confirm
// 1 बीघा ≈ 0.6 एकड़ (UP ka pakka bigha) — jagah ke hisaab se badalta hai
// =========================================================

export const PLANNER = {
  eyebrow: { hi: "बाग़ planner", en: "Orchard planner" },
  title: { hi: "आपका बाग़ कितना बड़ा है?", en: "How big is your orchard?" },
  line: {
    hi: "ज़मीन और पौधा चुनिए — देखिए कितने पौधे लगेंगे।",
    en: "Pick your land and plant — see how many plants will fit.",
  },
  sizeLabel: { hi: "ज़मीन", en: "Land" },
  fruitLabel: { hi: "पौधा", en: "Plant" },
  about: { hi: "लगभग", en: "About" },
  plantsOf: { hi: (name) => `${name} के पौधे`, en: (name) => `${name} plants` },
  spacingLabel: { hi: "पौधे से पौधे की दूरी", en: "Spacing" },
  note: {
    hi: "दूरी किस्म और मिट्टी के हिसाब से बदलती है — सही सलाह हम WhatsApp पर देंगे।",
    en: "Spacing depends on variety and soil — we'll advise you on WhatsApp.",
  },
  cta: { hi: "इसी हिसाब से WhatsApp पर पूछें", en: "Ask on WhatsApp with this plan" },
  // WhatsApp message — size + ginti + paudha apne aap bhar jaata hai
  message: {
    hi: (sizeMsg, n, fruit) => `नमस्ते SNP Biotech! ${sizeMsg}, मुझे लगभग ${n} ${fruit} के पौधे चाहिए।`,
    en: (sizeMsg, n, fruit) => `Hello SNP Biotech! ${sizeMsg}, I need about ${n} ${fruit} plants.`,
  },
};

// scale = khet kitna bada dikhe (1 = poora) · aspect = chaudai / lambai
export const SIZES = [
  {
    id: "aangan",
    label: { hi: "घर का आँगन", en: "Home garden" },
    msg: { hi: "मेरे घर के आँगन के लिए", en: "For my home garden" },
    tag: { hi: "आँगन", en: "Garden" },
    scale: 0.36,
    aspect: 1.2,
  },
  {
    id: "bigha",
    label: { hi: "1 बीघा", en: "1 bigha" },
    msg: { hi: "मेरे पास 1 बीघा ज़मीन है", en: "I have 1 bigha of land" },
    tag: { hi: "1 बीघा", en: "1 bigha" },
    scale: 0.74,
    aspect: 1.35,
  },
  {
    id: "acre",
    label: { hi: "1 एकड़", en: "1 acre" },
    msg: { hi: "मेरे पास 1 एकड़ ज़मीन है", en: "I have 1 acre of land" },
    tag: { hi: "1 एकड़", en: "1 acre" },
    scale: 1,
    aspect: 1.6,
  },
];

// count = lagbhag kitne paudhe (size id ke hisaab se)
export const FRUITS = [
  {
    id: "mango",
    name: { hi: "आम", en: "mango" },
    label: { hi: "आम", en: "Mango" },
    tree: "/home/tree-mango.webp",
    spacing: { hi: "लगभग 10 × 10 मीटर", en: "about 10 × 10 m" },
    count: { aangan: 2, bigha: 25, acre: 40 },
  },
  {
    id: "guava",
    name: { hi: "अमरूद", en: "guava" },
    label: { hi: "अमरूद", en: "Guava" },
    tree: "/home/tree-guava.webp",
    spacing: { hi: "लगभग 6 × 6 मीटर", en: "about 6 × 6 m" },
    count: { aangan: 4, bigha: 70, acre: 110 },
  },
  {
    id: "lemon",
    name: { hi: "नींबू", en: "lemon" },
    label: { hi: "नींबू", en: "Lemon" },
    tree: "/home/tree-lemon.webp",
    spacing: { hi: "लगभग 6 × 6 मीटर", en: "about 6 × 6 m" },
    count: { aangan: 4, bigha: 70, acre: 110 },
  },
  {
    id: "litchi",
    name: { hi: "लीची", en: "litchi" },
    label: { hi: "लीची", en: "Litchi" },
    tree: "/home/tree-litchi.webp",
    spacing: { hi: "लगभग 10 × 10 मीटर", en: "about 10 × 10 m" },
    count: { aangan: 2, bigha: 25, acre: 40 },
  },
];
