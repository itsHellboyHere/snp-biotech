// =========================================================
// पौधों की सूची — Plants page ka POORA data isi file mein hai
//
// Naya paudha jodna ho → PLANTS mein neeche wale TEMPLATE jaisa ek object jodo. Bas.
// Chips, ginti, search, mausam ka carousel, tulna (compare) — sab apne aap update.
//
// Galti se koi field chhoot jaaye / galat ho jaaye to page NAHI tootega:
// plantsModel.js har entry jaanchta hai — kharab entry chhod deta hai aur
// dev mode mein console pe batata hai ki kya galat hai.
//
// TODO(client): asli list, kismein, dooriyan, mausam aur photos confirm karwane hain.
// =========================================================

/* ---------- TEMPLATE (copy karke bharo) ----------
{
  id: "jamun",                          // a-z, 0-9, "-" · URL mein jaata hai (/plants?plant=jamun) · badalna mat
  category: "fruit",                    // neeche CATEGORIES ki koi id
  name: { hi: "जामुन", en: "Jamun" },
  aka: ["jamun", "java plum"],          // search ke liye aur naam (Hinglish spelling bhi)
  line: { hi: "…", en: "…" },           // ek line — detail panel mein
  shot: "/plants/jamun.webp",           // ivory background wali "product" photo (900px, 1:1)
  tree: "/hero-trees/jamun.webp",       // asli pedh ki photo (1:1)
  realPhotos: [],                       // client ki asli nursery photos (detail mein "असली पौधा" tab)
  grafted: true,                        // कलमी? (card pe tag)
  months: [6, 7, 8],                    // lagane ke mahine · 0 = जनवरी … 11 = दिसंबर
  harvest: [5, 6],                      // fal ke mahine (na ho to [] )
  spacing: [8, 8],                      // meter mein [lambai, chaudai] → "1 एकड़ में ~" apne aap
  step: 1,                              // + / − kitne se badhe (default 1 · bade order ke liye +10/+50/+100 alag se hain)
  varieties: [                          // kismein (optional) · img na ho to "shot" dikhegi
    { id: "ras-raj", name: { hi: "रसराज", en: "Rasraj" }, note: { hi: "…", en: "…" }, img: "/plants/jamun-rasraj.webp" },
  ],
  show: true,                           // false = site pe chhupa (data rehta hai)
},
-------------------------------------------------- */

// Chips isi order mein dikhte hain. Jis category mein ek bhi paudha nahi, uska chip apne aap chhupta hai.
export const CATEGORIES = [
  { id: "fruit", label: { hi: "फलदार", en: "Fruit" } },
  { id: "citrus", label: { hi: "नींबू वर्गीय", en: "Citrus" } },
  { id: "timber", label: { hi: "इमारती लकड़ी", en: "Timber" } },
  { id: "shade", label: { hi: "छायादार", en: "Shade" } },
  { id: "flower", label: { hi: "फूल वाले", en: "Flowering" } },
];

// Purane / doosre links ke liye — "/plants?cat=more" jaise
export const CATEGORY_ALIASES = { more: "fruit", fruits: "fruit", lemon: "citrus" };

// TODO(client): har paudhe ke mahine, dooriyan aur kismein confirm (UP ke hisaab se aam andaaza hai)
export const PLANTS = [
  {
    id: "mango",
    category: "fruit",
    name: { hi: "आम", en: "Mango" },
    aka: ["aam", "am", "mango", "dasheri", "dussehri", "langra", "chausa", "amrapali"],
    line: {
      hi: "फलों का राजा — उत्तर प्रदेश का सबसे प्यारा पेड़।",
      en: "The king of fruits — Uttar Pradesh's favourite tree.",
    },
    shot: "/plants/mango-dasheri.webp",
    tree: "/hero-trees/mango.webp",
    grafted: true,
    months: [6, 7, 8],
    harvest: [5, 6],
    spacing: [10, 10],
    varieties: [
      {
        id: "dasheri",
        name: { hi: "दशहरी", en: "Dasheri" },
        note: { hi: "लंबा, मीठा और बिना रेशे का", en: "Long, sweet and fibreless" },
        img: "/plants/mango-dasheri.webp",
      },
      {
        id: "langra",
        name: { hi: "लंगड़ा", en: "Langra" },
        note: { hi: "पकने पर भी हरा, ख़ूब ख़ुशबूदार", en: "Stays green when ripe, very aromatic" },
        img: "/plants/mango-langra.webp",
      },
      {
        id: "chausa",
        name: { hi: "चौसा", en: "Chausa" },
        note: { hi: "बड़ा और बहुत रसीला, देर से पकता है", en: "Large and very juicy, ripens late" },
        img: "/plants/mango-chausa.webp",
      },
      {
        id: "amrapali",
        name: { hi: "आम्रपाली", en: "Amrapali" },
        note: { hi: "छोटा पेड़, गहरा नारंगी गूदा — घर के लिए भी", en: "Compact tree, deep orange flesh — great for homes" },
        img: "/plants/mango-amrapali.webp",
      },
    ],
  },
  {
    id: "guava",
    category: "fruit",
    name: { hi: "अमरूद", en: "Guava" },
    aka: ["amrud", "amrood", "amarood", "guava", "taiwan", "safeda", "lalit", "pink"],
    line: {
      hi: "जल्दी फल देने वाला, घर और बाग़ दोनों के लिए।",
      en: "Quick to bear fruit — for homes and orchards alike.",
    },
    shot: "/plants/guava-taiwan.webp",
    tree: "/hero-trees/guava.webp",
    grafted: true,
    months: [1, 2, 6, 7, 8],
    harvest: [10, 11, 0],
    spacing: [6, 6],
    varieties: [
      {
        id: "taiwan-pink",
        name: { hi: "ताइवान पिंक", en: "Taiwan Pink" },
        note: { hi: "अंदर से गुलाबी, स्वाद में मीठा", en: "Pink inside, sweet to taste" },
        img: "/plants/guava-taiwan.webp",
      },
      {
        id: "allahabad-safeda",
        name: { hi: "इलाहाबादी सफ़ेदा", en: "Allahabad Safeda" },
        note: { hi: "सफ़ेद गूदा — UP की पुरानी पहचान", en: "White flesh — a UP classic" },
        img: "/plants/guava-safeda.webp",
      },
      {
        id: "lalit",
        name: { hi: "ललित", en: "Lalit" },
        note: { hi: "केसरिया छिलका, गुलाबी गूदा", en: "Saffron skin, pink flesh" },
        img: "/plants/guava-lalit.webp",
      },
    ],
  },
  {
    id: "litchi",
    category: "fruit",
    name: { hi: "लीची", en: "Litchi" },
    aka: ["lichi", "litchi", "lychee", "shahi"],
    line: { hi: "गर्मियों की मिठास — रसीली, ख़ुशबूदार।", en: "The sweetness of summer — juicy and fragrant." },
    shot: "/plants/litchi.webp",
    tree: "/hero-trees/litchi.webp",
    grafted: true,
    months: [7, 8],
    harvest: [4, 5],
    spacing: [10, 10],
    varieties: [
      { id: "shahi", name: { hi: "शाही", en: "Shahi" }, note: { hi: "गहरा लाल, बहुत मीठा", en: "Deep red, very sweet" } },
      { id: "china", name: { hi: "चाइना", en: "China" }, note: { hi: "बड़ा फल, थोड़ी देर से", en: "Bigger fruit, a little later" } },
    ],
  },
  {
    id: "chikoo",
    category: "fruit",
    name: { hi: "चीकू", en: "Chikoo" },
    aka: ["chiku", "chikoo", "sapota", "sapodilla", "kalipatti"],
    line: { hi: "शहद जैसा मीठा, साल में दो बार फल।", en: "Honey-sweet, fruits twice a year." },
    shot: "/plants/chikoo.webp",
    tree: "/hero-trees/chikoo.webp",
    grafted: true,
    months: [1, 2, 6, 7, 8],
    harvest: [1, 2, 3],
    spacing: [8, 8],
    varieties: [
      { id: "kalipatti", name: { hi: "काली पत्ती", en: "Kalipatti" }, note: { hi: "मीठा, अंडाकार फल", en: "Sweet, oval fruit" } },
      { id: "cricket-ball", name: { hi: "क्रिकेट बॉल", en: "Cricket Ball" }, note: { hi: "बड़ा, गोल फल", en: "Big, round fruit" } },
    ],
  },
  {
    id: "pear",
    category: "fruit",
    name: { hi: "नाशपाती", en: "Pear" },
    aka: ["nashpati", "naspati", "pear", "patharnakh"],
    line: { hi: "कुरकुरी और रसीली — सर्दियों में लगाइए।", en: "Crisp and juicy — plant it in winter." },
    shot: "/plants/pear.webp",
    tree: "/hero-trees/pear.webp",
    grafted: true,
    months: [11, 0, 1],
    harvest: [6, 7],
    spacing: [6, 6],
  },
  {
    id: "amla",
    category: "fruit",
    name: { hi: "आँवला", en: "Amla" },
    aka: ["amla", "aonla", "anwla", "awla", "gooseberry", "indian gooseberry"],
    line: { hi: "सेहत का ख़ज़ाना — कम देखभाल में भरपूर फल।", en: "A health treasure — plenty of fruit, little care." },
    shot: "/plants/amla.webp",
    tree: "/hero-trees/amla.webp",
    grafted: true,
    months: [6, 7, 8],
    harvest: [10, 11, 0],
    spacing: [8, 8],
    varieties: [
      { id: "na-7", name: { hi: "NA-7", en: "NA-7" }, note: { hi: "बड़ा फल, भरपूर पैदावार", en: "Big fruit, heavy yield" } },
      { id: "chakaiya", name: { hi: "चकैया", en: "Chakaiya" }, note: { hi: "अचार-मुरब्बे के लिए", en: "Great for pickle and murabba" } },
    ],
  },
  {
    id: "kinnow",
    category: "citrus",
    name: { hi: "किन्नू", en: "Kinnow" },
    aka: ["kinnu", "kinnow", "kino", "santra", "mandarin", "orange"],
    line: { hi: "सर्दियों का रसीला संतरा — जूस के लिए सबसे अच्छा।", en: "Winter's juicy mandarin — best for juice." },
    shot: "/plants/kinnow.webp",
    tree: "/hero-trees/kinnow.webp",
    grafted: true,
    months: [1, 2, 6, 7, 8],
    harvest: [11, 0, 1],
    spacing: [6, 6],
  },
  {
    id: "mosambi",
    category: "citrus",
    name: { hi: "मौसमी", en: "Mosambi" },
    aka: ["mosambi", "mausami", "musambi", "sweet lime", "sweet lemon"],
    line: { hi: "हल्का मीठा, रस से भरा — हर घर का फल।", en: "Mildly sweet and full of juice — a household favourite." },
    shot: "/plants/mosambi.webp",
    tree: "/hero-trees/mosambi.webp",
    grafted: true,
    months: [1, 2, 6, 7, 8],
    harvest: [9, 10, 11],
    spacing: [6, 6],
  },
  {
    id: "lemon",
    category: "citrus",
    name: { hi: "कागज़ी नींबू", en: "Kagzi Lemon" },
    aka: ["nimbu", "neembu", "nimboo", "lemon", "lime", "kagzi", "kagji"],
    line: { hi: "पतला छिलका, ख़ूब रस — साल भर काम का।", en: "Thin skin, lots of juice — useful all year." },
    shot: "/plants/lemon.webp",
    tree: "/hero-trees/lemon.webp",
    grafted: true,
    months: [1, 2, 6, 7, 8],
    harvest: [6, 7, 8, 9],
    spacing: [6, 6],
  },
  {
    id: "teak",
    category: "timber",
    name: { hi: "सागवान", en: "Teak" },
    aka: ["sagwan", "sagon", "sagaun", "teak", "timber"],
    line: { hi: "मज़बूत, क़ीमती लकड़ी — आने वाले कल की बचत।", en: "Strong, valuable timber — savings for tomorrow." },
    shot: "/plants/teak.webp",
    tree: "/hero-trees/teak.webp",
    grafted: false,
    months: [5, 6, 7],
    harvest: [],
    spacing: [3, 3],
  },
  {
    id: "neem",
    category: "shade",
    name: { hi: "नीम", en: "Neem" },
    aka: ["neem", "nim", "margosa"],
    line: { hi: "घनी छाँव और साफ़ हवा — आँगन का साथी।", en: "Dense shade and clean air — a courtyard companion." },
    shot: "/plants/neem.webp",
    tree: "/hero-trees/neem.webp",
    grafted: false,
    months: [6, 7, 8],
    harvest: [],
    spacing: [6, 6],
  },
  {
    id: "gulmohar",
    category: "flower",
    name: { hi: "गुलमोहर", en: "Gulmohar" },
    aka: ["gulmohar", "gulmohur", "flame tree", "flame of the forest", "flower"],
    line: { hi: "गर्मियों में लाल-नारंगी फूलों की छतरी।", en: "A canopy of red-orange blooms every summer." },
    shot: "/plants/gulmohar.webp",
    tree: "/hero-trees/gulmohar.webp",
    grafted: false,
    months: [6, 7, 8],
    harvest: [],
    spacing: [8, 8],
  },
];
