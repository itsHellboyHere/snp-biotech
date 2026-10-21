// Home pe 4 category cards — text dono languages { hi, en }. Images / rang yahin badlo.
// label: card ke upar chhota naam (doosri language mein — dono log pehchan lein)
// order: WhatsApp message mein jaane wala naam
// theme: CategoryCard.module.css ki class (rang) · dark: dark card (light text)
export const CATEGORY_INTRO = {
  eyebrow: { hi: "हमारे पौधे", en: "Our plants" },
  title: { hi: "हर बाग़ के लिए, सही पौधा।", en: "The right plant, for every orchard." },
  line: {
    hi: "कलमी फलदार पौधे — सीधे हमारी नर्सरी से आपके खेत तक।",
    en: "Grafted fruit plants — straight from our nursery to your farm.",
  },
  all: { label: { hi: "सभी पौधे देखें", en: "View all plants" }, href: "/plants" },
  dotsLabel: { hi: "पौधों की श्रेणियाँ", en: "Plant categories" },
};

export const CARD_UI = {
  view: { hi: "देखें", en: "View" },
  order: { hi: "ऑर्डर", en: "Order" },
  chipsLabel: { hi: "पौधे", en: "Plants" },
};

export const CATEGORIES = [
  {
    id: "mango",
    label: { hi: "Mango", en: "आम" },
    title: { hi: "आम", en: "Mango" },
    line: {
      hi: "उत्तर प्रदेश का सबसे प्यारा फल — कलमी पौधे, लगाने को तैयार।",
      en: "Uttar Pradesh's favourite fruit — grafted plants, ready to plant.",
    },
    chips: { hi: ["आम"], en: ["Mango"] },
    img: {
      src: "/categories/mango.webp",
      w: 617,
      h: 880,
      alt: { hi: "फलों से लदा आम का कलमी पौधा, काले नर्सरी बैग में", en: "A grafted mango plant loaded with fruit, in a black nursery bag" },
    },
    href: "/plants?plant=mango",
    order: { hi: "आम", en: "mango" },
    theme: "mango",
  },
  {
    id: "guava",
    label: { hi: "Taiwan Pink Guava", en: "ताइवान पिंक अमरूद" },
    title: { hi: "अमरूद", en: "Guava" },
    line: {
      hi: "अंदर से गुलाबी, स्वाद में मीठा — घर और बाग़ दोनों के लिए।",
      en: "Pink inside, sweet to taste — for homes and orchards alike.",
    },
    chips: { hi: ["ताइवान पिंक"], en: ["Taiwan Pink"] },
    img: {
      src: "/categories/guava.webp",
      w: 586,
      h: 880,
      alt: { hi: "अमरूद का पौधा, साथ में कटा हुआ गुलाबी अमरूद", en: "A guava plant beside a sliced pink guava" },
    },
    href: "/plants?plant=guava",
    order: { hi: "ताइवान पिंक अमरूद", en: "Taiwan Pink guava" },
    theme: "guava",
  },
  {
    id: "citrus",
    label: { hi: "Citrus", en: "नींबू वर्गीय" },
    title: { hi: "नींबू वर्गीय", en: "Citrus" },
    line: { hi: "रसीले फल, हर रसोई के काम के।", en: "Juicy fruit, useful in every kitchen." },
    chips: { hi: ["किन्नू", "मौसमी", "कागज़ी नींबू"], en: ["Kinnow", "Mosambi", "Kagzi lemon"] },
    img: {
      src: "/categories/citrus.webp",
      w: 1012,
      h: 880,
      alt: { hi: "किन्नू, मौसमी और कागज़ी नींबू के पौधे", en: "Kinnow, mosambi and kagzi lemon plants" },
    },
    href: "/plants?cat=citrus",
    order: { hi: "नींबू वर्गीय (किन्नू / मौसमी / कागज़ी नींबू)", en: "citrus (kinnow / mosambi / kagzi lemon)" },
    theme: "citrus",
  },
  {
    id: "more",
    label: { hi: "Special Fruits", en: "और भी ख़ास" },
    title: { hi: "और भी ख़ास", en: "Something special" },
    line: {
      hi: "बाग़ में कुछ अलग — मीठे और कम मिलने वाले फल।",
      en: "Something different for your orchard — sweet, hard-to-find fruit.",
    },
    chips: { hi: ["लीची", "चीकू", "नाशपाती"], en: ["Litchi", "Chikoo", "Pear"] },
    img: {
      src: "/categories/more.webp",
      w: 1002,
      h: 880,
      alt: { hi: "लीची, चीकू और नाशपाती के पौधे", en: "Litchi, chikoo and pear plants" },
    },
    href: "/plants?cat=fruit",
    order: { hi: "लीची / चीकू / नाशपाती", en: "litchi / chikoo / pear" },
    theme: "more",
    dark: true,
  },
];
