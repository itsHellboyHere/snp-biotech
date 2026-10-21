// =========================================================
// "ऑर्डर कैसे करें" — WhatsApp chat (hi / en)
// from: "me" = grahak (daayein, hara) · "snp" = nursery (baayein, safed)
// step = baayein wale 3 kadam mein se kaunsa us waqt jale
// TODO: delivery wali line client se confirm (kahan tak delivery hoti hai)
// =========================================================

export const ORDER = {
  eyebrow: { hi: "ऑर्डर कैसे करें", en: "How to order" },
  title: { hi: "बस एक WhatsApp मैसेज।", en: "Just one WhatsApp message." },
  line: {
    hi: "कोई फ़ॉर्म नहीं, कोई ऐप नहीं — जैसे घर वालों से बात करते हैं, वैसे ही।",
    en: "No forms, no apps — just chat with us like you would with family.",
  },
  example: { hi: "उदाहरण बातचीत", en: "Example chat" },
  contact: { name: "SNP Biotech", status: { hi: "ऑनलाइन", en: "online" } },
  inputHint: { hi: "मैसेज लिखें", en: "Message" },
  cta: { hi: "अभी WhatsApp करें", en: "Message us now" },
};

export const STEPS = [
  {
    title: { hi: "पूछिए", en: "Ask" },
    line: { hi: "WhatsApp पर पौधा और संख्या लिखिए।", en: "Message us the plant and quantity." },
  },
  {
    title: { hi: "देखिए, तय कीजिए", en: "See & decide" },
    line: { hi: "हम पौधों की फ़ोटो, किस्म और दाम भेजते हैं।", en: "We send photos, variety and price." },
  },
  {
    title: { hi: "पौधे पाइए", en: "Get your plants" },
    line: { hi: "डिलीवरी करवाइए या नर्सरी से सीधे ले जाइए।", en: "Get delivery, or pick up at the nursery." },
  },
];

export const MESSAGES = [
  { from: "me", step: 0, time: "10:41", text: { hi: "नमस्ते, 50 अमरूद के पौधे चाहिए 🌱", en: "Hi, I need 50 guava plants 🌱" } },
  {
    from: "snp",
    step: 1,
    time: "10:42",
    text: { hi: "नमस्ते! ताइवान पिंक अमरूद तैयार है — ये देखिए 👇", en: "Hello! Taiwan Pink guava is ready — have a look 👇" },
  },
  {
    from: "snp",
    step: 1,
    time: "10:42",
    image: { src: "/home/chat-guava.webp", w: 600, h: 800, alt: { hi: "नर्सरी में अमरूद के पौधे", en: "Guava plants at the nursery" } },
  },
  {
    from: "me",
    step: 2,
    time: "10:44",
    text: { hi: "बढ़िया! गाँव तक कैसे मिलेंगे?", en: "Great! How do I get them to my village?" },
  },
  {
    from: "snp",
    step: 2,
    time: "10:45",
    text: {
      hi: "पता भेजिए — डिलीवरी करवा देंगे, या नर्सरी से ले जाइए 🚚",
      en: "Send your address — we'll arrange delivery, or pick up at the nursery 🚚",
    },
  },
  { from: "me", step: 2, time: "10:45", text: { hi: "ठीक है, पता भेज रहा हूँ 👍", en: "Perfect, sending my address 👍" } },
];
