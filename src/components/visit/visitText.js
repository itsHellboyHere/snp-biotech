// "नर्सरी आइए" page ka saara UI text (hi / en)
export const VT = {
  eyebrow: { hi: "नर्सरी आइए", en: "Visit the nursery" },
  title: { hi: "आइए, पौधे खुद देखिए।", en: "Come, see the plants yourself." },
  line: {
    hi: "हर पौधा अपने हाथ से चुनिए, सलाह लीजिए — और सीधे अपने खेत ले जाइए।",
    en: "Pick every plant by hand, get advice — and take them straight to your farm.",
  },

  // ---------- खुली / बंद ----------
  status: {
    open: { hi: (t) => `अभी खुली है · ${t} तक`, en: (t) => `Open now · until ${t}` },
    closing: { hi: (t) => `जल्द बंद होगी · ${t} तक`, en: (t) => `Closing soon · until ${t}` },
    closed: { hi: (d, t) => `अभी बंद · ${d} ${t} खुलेगी`, en: (d, t) => `Closed · opens ${d} ${t}` },
    today: { hi: "आज", en: "today" },
    tomorrow: { hi: "कल", en: "tomorrow" },
  },

  directions: { hi: "रास्ता देखें", en: "Get directions" },
  call: { hi: "कॉल करें", en: "Call" },
  whatsapp: { hi: "WhatsApp करें", en: "WhatsApp" },
  visitMsg: {
    hi: "नमस्ते SNP Biotech! मैं नर्सरी आना चाहता/चाहती हूँ — कब आ सकता/सकती हूँ?",
    en: "Hello SNP Biotech! I'd like to visit the nursery — when can I come?",
  },

  // ---------- नक्शा ----------
  map: {
    eyebrow: { hi: "पता", en: "Address" },
    title: { hi: "आपसे हमारी नर्सरी तक", en: "From you to our nursery" },
    you: { hi: "आप", en: "You" },
    open: { hi: "नक्शा खोलें", en: "Open map" },
    frameTitle: { hi: "SNP Biotech नर्सरी का नक्शा", en: "Map of SNP Biotech nursery" },
    distance: { hi: "मेरी दूरी देखें", en: "How far am I?" },
    locating: { hi: "पता लगा रहे हैं…", en: "Finding you…" },
    result: {
      hi: (km) => `आप लगभग ${km} km दूर हैं (सीधी दूरी)`,
      en: (km) => `You're about ${km} km away (straight line)`,
    },
    denied: {
      hi: "लोकेशन नहीं मिली — कोई बात नहीं, “रास्ता देखें” दबाइए।",
      en: "Couldn't get your location — just tap “Get directions”.",
    },
    privacy: {
      hi: "आपकी लोकेशन सिर्फ़ आपके फ़ोन पर गिनी जाती है, कहीं सेव नहीं होती।",
      en: "Your location is only used on your phone — never saved.",
    },
  },

  // ---------- रास्ते की पहचान ----------
  how: { hi: "रास्ते की पहचान", en: "Landmarks on the way" },

  // ---------- समय ----------
  hours: {
    title: { hi: "खुलने का समय", en: "Opening hours" },
    today: { hi: "आज", en: "Today" },
    closed: { hi: "बंद", en: "Closed" },
    pending: {
      hi: "समय जल्द यहाँ अपडेट होगा — तब तक आने से पहले एक कॉल कर लें।",
      en: "Hours will be updated here soon — please call before you come.",
    },
  },

  // ---------- आने से पहले ----------
  before: {
    title: { hi: "आने से पहले", en: "Before you come" },
    bulk: {
      hi: "बड़ा ऑर्डर? पहले कॉल करें — पौधे गिनकर तैयार मिलेंगे।",
      en: "Big order? Call ahead — your plants will be counted and ready.",
    },
    listTitle: { hi: "आपकी सूची तैयार है", en: "Your list is ready" },
    listMeta: { hi: (k, n) => `${k} तरह के · ${n} पौधे`, en: (k, n) => `${k} kinds · ${n} plants` },
    listLine: {
      hi: "आने से पहले WhatsApp कर दें — पौधे अलग करके रखे मिलेंगे।",
      en: "WhatsApp it before you come — we'll keep your plants aside.",
    },
    listSend: { hi: "सूची WhatsApp पर भेजें", en: "Send list on WhatsApp" },
    listNote: { hi: "मैं ये पौधे लेने नर्सरी आऊँगा/आऊँगी।", en: "I'll come to the nursery to pick these up." },
    emptyTitle: { hi: "पौधे पहले से चुन लें", en: "Pick your plants first" },
    emptyLine: {
      hi: "सूची बनाकर आएँगे तो नर्सरी में समय बचेगा।",
      en: "Come with a list and save time at the nursery.",
    },
    emptyCta: { hi: "पौधे चुनें", en: "Choose plants" },
  },

  // ---------- झलक ----------
  glimpse: {
    title: { hi: "नर्सरी की झलक", en: "A look inside" },
    line: { hi: "आने से पहले देख लीजिए — यहीं तैयार होते हैं आपके पौधे।", en: "Have a look — this is where your plants grow up." },
    label: { hi: "नर्सरी की फ़ोटो", en: "Nursery photos" },
  },

  // ---------- डिलीवरी ----------
  delivery: {
    title: { hi: "आ नहीं सकते? हम पौधे भेजते हैं।", en: "Can't come? We'll deliver." },
    line: {
      hi: (area, min) => `${area} · ${min} — WhatsApp पर पूछिए।`,
      en: (area, min) => `${area} · ${min} — just ask on WhatsApp.`,
    },
    cta: { hi: "डिलीवरी के लिए पूछें", en: "Ask about delivery" },
    msg: {
      hi: "नमस्ते SNP Biotech! क्या आप मेरे यहाँ पौधों की डिलीवरी कर सकते हैं?",
      en: "Hello SNP Biotech! Can you deliver plants to my place?",
    },
  },

  sample: { hi: "नमूना डेटा", en: "Sample data" },
};
