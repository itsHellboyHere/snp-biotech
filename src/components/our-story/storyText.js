// "हमारी कहानी" page ka UI text (hi / en) — headings, buttons, labels
// Asli data (saal, naam, photos, testimonials) storyData.js mein hai
export const ST = {
  hero: {
    eyebrow: { hi: "हमारी कहानी", en: "Our story" },
    title: { hi: "एक कलम से शुरू हुआ भरोसा।", en: "It began with a single graft." },
    line: {
      hi: (year) =>
        `${year} से हम उत्तर प्रदेश के किसानों के लिए उन्नत कलमी पौधे तैयार कर रहे हैं — अपने मदर प्लांट से, अपने हाथों से।`,
      en: (year) =>
        `Since ${year}, we have raised quality grafted plants for farmers across Uttar Pradesh — from our own mother plants, by our own hands.`,
    },
    scroll: { hi: "सफ़र देखिए", en: "See the journey" },
    seal: (year) => `SNP BIOTECH • SINCE ${year} • NURSERY • `,
  },
  timeline: {
    eyebrow: { hi: "सफ़र", en: "The journey" },
    title: { hi: "साल दर साल, कलम दर कलम।", en: "Year by year, graft by graft." },
    line: {
      hi: "जैसे-जैसे आप आगे बढ़ेंगे, तना भी बढ़ेगा।",
      en: "Keep scrolling — the stem grows with you.",
    },
    now: { hi: "आज", en: "Today" },
    label: { hi: "SNP Biotech का सफ़र", en: "The SNP Biotech journey" },
  },
  founder: {
    eyebrow: { hi: "संस्थापक की बात", en: "From the founder" },
  },
  numbers: {
    eyebrow: { hi: "दस साल का हिसाब", en: "Ten years, in numbers" },
    years: { hi: "साल का अनुभव", en: "years of experience" },
  },
  promises: {
    eyebrow: { hi: "हमारे वादे", en: "Our promises" },
    title: { hi: "हर पौधे के साथ चार वादे।", en: "Four promises with every plant." },
  },
  gallery: {
    eyebrow: { hi: "नर्सरी की तस्वीरें", en: "Inside the nursery" },
    title: { hi: "आइए, थोड़ा अंदर से देखिए।", en: "Take a look inside." },
    open: { hi: "बड़ा करके देखें", en: "View larger" },
    label: { hi: "नर्सरी की फ़ोटो", en: "Nursery photos" },
  },
  voices: {
    eyebrow: { hi: "किसानों की ज़ुबानी", en: "In farmers' words" },
    title: { hi: "हमारी कहानी, उनके बाग़ में।", en: "Our story, in their orchards." },
    since: { hi: (y) => `${y} से साथ`, en: (y) => `With us since ${y}` },
    share: { hi: "आपने हमसे पौधे लिए हैं? अपना अनुभव भेजिए", en: "Bought plants from us? Share your experience" },
    shareMsg: {
      hi: "नमस्ते SNP Biotech! मैं आपकी नर्सरी के पौधों के बारे में अपना अनुभव बताना चाहता/चाहती हूँ:\n",
      en: "Hello SNP Biotech! I'd like to share my experience with your plants:\n",
    },
  },
  cta: {
    title: { hi: "अगला छल्ला, आपके बाग़ का।", en: "The next ring is your orchard's." },
    line: {
      hi: "पौधे चुनिए, सूची बनाइए — या सीधे नर्सरी आकर देखिए।",
      en: "Pick your plants and build a list — or come see the nursery yourself.",
    },
    plants: { hi: "पौधे देखें", en: "Browse plants" },
    visit: { hi: "नर्सरी आइए", en: "Visit the nursery" },
    whatsapp: { hi: "WhatsApp करें", en: "WhatsApp us" },
  },
  lightbox: {
    close: { hi: "बंद करें", en: "Close" },
    prev: { hi: "पिछली फ़ोटो", en: "Previous photo" },
    next: { hi: "अगली फ़ोटो", en: "Next photo" },
  },
};
