// =========================================================
// Plants page ka saara UI text — dono languages { hi, en }
// Function wale text: ginti / naam andar bharte hain
// =========================================================

export const PT = {
  // ---------- Header ----------
  eyebrow: { hi: "हमारे पौधे", en: "Our plants" },
  title: { hi: "हर बाग़ के लिए, सही पौधा।", en: "The right plant for every orchard." },
  line: {
    hi: "फलदार, नींबू वर्गीय, इमारती और छायादार — सब एक जगह। पौधे चुनिए, सूची बनाइए, WhatsApp पर भेजिए।",
    en: "Fruit, citrus, timber and shade trees in one place. Pick your plants, build a list, send it on WhatsApp.",
  },
  searchLabel: { hi: "पौधा खोजें", en: "Search plants" },
  searchPh: { hi: "पौधा खोजें… जैसे आम, dasheri", en: "Search… e.g. mango, आम" },
  clearSearch: { hi: "खोज साफ़ करें", en: "Clear search" },
  how: [
    { hi: "पौधा चुनें", en: "Pick plants" },
    { hi: "गिनती डालें", en: "Set quantity" },
    { hi: "WhatsApp पर भेजें", en: "Send on WhatsApp" },
  ],

  // ---------- Chips / grid ----------
  all: { hi: "सभी", en: "All" },
  chipsLabel: { hi: "पौधों की श्रेणी", en: "Plant categories" },
  count: { hi: (n) => `${n} पौधे`, en: (n) => `${n} plant${n === 1 ? "" : "s"}` },
  gridTitle: { hi: "सभी पौधे", en: "All plants" },
  empty: {
    title: { hi: "ऐसा कोई पौधा नहीं मिला", en: "No plant found" },
    line: { hi: "हो सकता है हमारे पास हो — एक बार WhatsApp पर पूछ लीजिए।", en: "We may still have it — just ask us on WhatsApp." },
    ask: { hi: "WhatsApp पर पूछें", en: "Ask on WhatsApp" },
    reset: { hi: "सभी पौधे दिखाएँ", en: "Show all plants" },
  },
  askMsg: {
    hi: (q) => `नमस्ते SNP Biotech! क्या आपके पास "${q}" का पौधा मिलेगा?`,
    en: (q) => `Hello SNP Biotech! Do you have "${q}" plants?`,
  },

  // ---------- Card ----------
  grafted: { hi: "कलमी", en: "Grafted" },
  plantIn: { hi: "लगाएँ", en: "Plant" },
  add: { hi: "सूची में जोड़ें", en: "Add to list" },
  addShort: { hi: "जोड़ें", en: "Add" },
  added: { hi: "सूची में", en: "In list" },
  multi: { hi: (k, n) => `${k} किस्में · ${n} पौधे`, en: (k, n) => `${k} varieties · ${n} plants` },
  compare: { hi: "तुलना करें", en: "Compare" },
  comparing: { hi: "तुलना में है", en: "In compare" },
  compareFull: { hi: "एक बार में 3 पौधों की तुलना", en: "Compare up to 3 plants" },
  open: { hi: (n) => `${n} — पूरी जानकारी`, en: (n) => `${n} — full details` },
  varietiesN: { hi: (n) => `${n} किस्में`, en: (n) => `${n} varieties` },

  // ---------- Qty ----------
  less: { hi: "कम करें", en: "Decrease" },
  more: { hi: "बढ़ाएँ", en: "Increase" },
  qty: { hi: "गिनती", en: "Quantity" },
  quick: { hi: "ज़्यादा पौधे?", en: "Buying more?" },
  remove: { hi: "हटाएँ", en: "Remove" },

  // ---------- Season picks (Apple "Get the highlights") ----------
  picks: {
    eyebrowNow: { hi: (m) => `${m} · अभी का मौसम`, en: (m) => `${m} · in season` },
    eyebrowNext: { hi: (m) => `अभी ${m} है`, en: (m) => `It's ${m}` },
    eyebrowFallback: { hi: "मौसम के हिसाब से", en: "By season" },
    titleNow: { hi: "अभी लगाने का मौसम", en: "Plant these now" },
    titleNext: { hi: "अगला मौसम, पहले से बुकिंग।", en: "Next season — book early." },
    now: { hi: "अभी लगाएँ ✓", en: "Plant now ✓" },
    soon: { hi: (m, n) => `${m} से · ${n} महीने बाद`, en: (m, n) => `From ${m} · in ${n} mo` },
    label: { hi: "मौसम के पौधे", en: "Seasonal plants" },
    pause: { hi: "रोकें", en: "Pause" },
    play: { hi: "चलाएँ", en: "Play" },
    goTo: { hi: (n) => `${n} पर जाएँ`, en: (n) => `Go to ${n}` },
  },

  // ---------- Detail ----------
  close: { hi: "बंद करें", en: "Close" },
  tabFruit: { hi: "फल", en: "Fruit" },
  tabLeaf: { hi: "झलक", en: "Close-up" },
  tabTree: { hi: "पेड़", en: "Tree" },
  tabReal: { hi: "असली पौधा", en: "Real plant" },
  tabPlant: { hi: "पौधा", en: "Plant" },
  tabInFruit: { hi: "फल के साथ", en: "In fruit" },
  tabMore: { hi: "और", en: "More" },
  photoTabs: { hi: "फ़ोटो", en: "Photos" },
  variety: { hi: "किस्म चुनें", en: "Choose a variety" },
  facts: {
    season: { hi: "लगाने का समय", en: "Planting time" },
    harvest: { hi: "फल का मौसम", en: "Fruiting season" },
    spacing: { hi: "पौधे से पौधे की दूरी", en: "Spacing" },
    perAcre: { hi: "1 एकड़ में", en: "Per acre" },
    type: { hi: "पौधा", en: "Plant type" },
    varieties: { hi: "किस्में", en: "Varieties" },
  },
  about: { hi: "लगभग", en: "about" },
  meters: { hi: (a, b) => `${a} × ${b} मीटर`, en: (a, b) => `${a} × ${b} m` },
  perAcre: { hi: (n) => `लगभग ${n} पौधे`, en: (n) => `about ${n} plants` },
  typeGrafted: { hi: "कलमी (ग्राफ़्टेड)", en: "Grafted" },
  typeSeedling: { hi: "नर्सरी में तैयार पौधा", en: "Nursery-raised sapling" },
  none: { hi: "—", en: "—" },
  inSeason: { hi: "अभी लगाने का सही समय है ✓", en: "Right time to plant now ✓" },
  nextSeason: {
    hi: (m, n) => `अगला सही समय: ${m} (${n} महीने बाद) — पहले से बुक करें`,
    en: (m, n) => `Next window: ${m} (in ${n} month${n > 1 ? "s" : ""}) — book ahead`,
  },
  inListOther: { hi: "सूची में:", en: "In your list:" },
  askNow: { hi: "WhatsApp पर पूछें", en: "Ask on WhatsApp" },
  askPlant: {
    hi: (p) => `नमस्ते SNP Biotech! मुझे ${p} के पौधे के बारे में जानकारी चाहिए।`,
    en: (p) => `Hello SNP Biotech! I'd like to know about ${p} plants.`,
  },
  note: {
    hi: "दूरी और गिनती मिट्टी और किस्म के हिसाब से बदलती है — सही सलाह WhatsApp पर देंगे।",
    en: "Spacing and counts depend on soil and variety — we'll advise you on WhatsApp.",
  },

  // ---------- Compare ----------
  cmp: {
    title: { hi: "पौधों की तुलना", en: "Compare plants" },
    open: { hi: "तुलना देखें", en: "Compare" },
    n: { hi: (n) => `${n} चुने`, en: (n) => `${n} selected` },
    hint: { hi: "एक और पौधा चुनिए", en: "Pick one more plant" },
    clear: { hi: "तुलना हटाएँ", en: "Clear compare" },
    removeOne: { hi: (p) => `${p} हटाएँ`, en: (p) => `Remove ${p}` },
    add: { hi: "+ पौधा जोड़ें", en: "+ Add plant" },
  },

  // ---------- Order list ("मेरी सूची") ----------
  list: {
    title: { hi: "मेरी सूची", en: "My list" },
    total: { hi: (n) => `${n} पौधे`, en: (n) => `${n} plant${n === 1 ? "" : "s"}` },
    kinds: { hi: (n) => `${n} तरह के`, en: (n) => `${n} kind${n === 1 ? "" : "s"}` },
    open: { hi: "सूची देखें", en: "View list" },
    send: { hi: "WhatsApp पर भेजें", en: "Send on WhatsApp" },
    go: { hi: "भेजें", en: "Send" },
    clear: { hi: "सूची खाली करें", en: "Clear list" },
    sum: { hi: "कुल", en: "Total" },
    noteLabel: { hi: "नोट (ज़रूरी नहीं)", en: "Note (optional)" },
    notePh: {
      hi: "जैसे — गाँव/शहर का नाम, कब चाहिए…",
      en: "e.g. your village/town, when you need them…",
    },
    price: {
      hi: "दाम और उपलब्धता हम WhatsApp पर बताएँगे।",
      en: "We'll share prices and availability on WhatsApp.",
    },
    emptyTitle: { hi: "सूची अभी ख़ाली है", en: "Your list is empty" },
    emptyLine: { hi: "किसी पौधे पर “सूची में जोड़ें” दबाइए।", en: "Tap “Add to list” on any plant." },
    anyVariety: { hi: "किस्म: आप सलाह दें", en: "Variety: your advice" },
  },
  // WhatsApp message — ek hi baar mein poori list
  order: {
    hi: { hello: "नमस्ते SNP Biotech! मुझे ये पौधे चाहिए:", total: "कुल", plants: "पौधे", note: "नोट" },
    en: { hello: "Hello SNP Biotech! I'd like these plants:", total: "Total", plants: "plants", note: "Note" },
  },

  // ---------- पौधे से पेड़ (scroll film) ----------
  growth: {
    eyebrow: { hi: "पौधे से पेड़ तक", en: "From sapling to tree" },
    steps: [
      {
        title: { hi: "आज — नर्सरी से तैयार कलमी पौधा।", en: "Today — a grafted sapling, nursery-ready." },
        line: { hi: "सही किस्म, मज़बूत जड़ें, लगाने को तैयार।", en: "The right variety, strong roots, ready to plant." },
      },
      {
        title: { hi: "देखभाल — धूप, पानी और थोड़ा सब्र।", en: "Care — sun, water and a little patience." },
        line: { hi: "हर मौसम में हम सलाह के लिए साथ हैं।", en: "We're a call away, every season." },
      },
      {
        title: { hi: "कल — फलों से लदा आपका बाग़।", en: "Tomorrow — your orchard, heavy with fruit." },
        line: { hi: "आज का एक पौधा, बरसों की फ़सल।", en: "One sapling today, harvests for years." },
      },
    ],
    cta: { hi: "अपना पौधा चुनें", en: "Choose your plant" },
    alt: {
      hi: "छोटा कलमी आम का पौधा धीरे-धीरे फलों से लदा पेड़ बनता है",
      en: "A small grafted mango sapling slowly grows into a tree heavy with fruit",
    },
  },

  // ---------- Bulk band ----------
  bulk: {
    eyebrow: { hi: "बड़ा ऑर्डर", en: "Bulk orders" },
    title: { hi: "100+ पौधे चाहिए?", en: "Need 100+ plants?" },
    line: {
      hi: "नया बाग़, फ़ार्म, स्कूल या संस्था — सीधे बात कीजिए, हम पूरी योजना में मदद करेंगे।",
      en: "A new orchard, farm, school or institution — talk to us directly and we'll help you plan it all.",
    },
    call: { hi: "कॉल करें", en: "Call us" },
    whatsapp: { hi: "WhatsApp करें", en: "WhatsApp us" },
    msg: {
      hi: "नमस्ते SNP Biotech! मुझे बड़ी संख्या में (100+) पौधे चाहिए, बात करनी है।",
      en: "Hello SNP Biotech! I need a large number (100+) of plants and would like to talk.",
    },
  },
};
