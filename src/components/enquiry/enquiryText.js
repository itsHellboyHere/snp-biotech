// Puchhtachh form ka text (hi / en)
export const ET = {
  eyebrow: { hi: "संदेश भेजें", en: "Send a message" },
  title: { hi: "कोई सवाल? हम कॉल करेंगे।", en: "Got a question? We'll call you." },
  line: {
    hi: "नाम और मोबाइल छोड़िए — पौधे, किस्म, डिलीवरी या नर्सरी आने के बारे में, जो भी पूछना हो।",
    en: "Leave your name and number — ask about plants, varieties, delivery or visiting the nursery.",
  },
  points: [
    { hi: "कोई ऐप या ईमेल ज़रूरी नहीं", en: "No app or email needed" },
    { hi: "आपका नंबर सिर्फ़ हमारे पास रहेगा", en: "Your number stays with us only" },
  ],

  direct: { hi: "या सीधे:", en: "Or directly:" },
  call: { hi: "कॉल", en: "Call" },
  name: { hi: "आपका नाम", en: "Your name" },
  namePh: { hi: "जैसे — रमेश कुमार", en: "e.g. Ramesh Kumar" },
  phone: { hi: "मोबाइल नंबर", en: "Mobile number" },
  phonePh: { hi: "98765 43210", en: "98765 43210" },
  place: { hi: "गाँव / शहर", en: "Village / town" },
  placePh: { hi: "जैसे — रामपुर, सीतापुर", en: "e.g. Rampur, Sitapur" },
  optional: { hi: "ज़रूरी नहीं", en: "optional" },
  type: { hi: "किस बारे में?", en: "What about?" },
  types: {
    visit: { hi: "नर्सरी आना है", en: "Visit nursery" },
    order: { hi: "पौधे ऑर्डर", en: "Order plants" },
    bulk: { hi: "बड़ा ऑर्डर", en: "Bulk order" },
    delivery: { hi: "डिलीवरी", en: "Delivery" },
    other: { hi: "कुछ और", en: "Something else" },
  },
  date: { hi: "कब आना चाहते हैं?", en: "When would you like to come?" },
  message: { hi: "संदेश", en: "Message" },
  messagePh: {
    hi: "जैसे — 2 बीघा में आम लगाना है, कौन-सी किस्म ठीक रहेगी?",
    en: "e.g. I want to plant mango on 2 bigha — which variety is best?",
  },
  withList: { hi: (k, n) => `मेरी सूची साथ भेजें (${k} तरह के · ${n} पौधे)`, en: (k, n) => `Send my list too (${k} kinds · ${n} plants)` },

  submit: { hi: "संदेश भेजें", en: "Send message" },
  sending: { hi: "भेज रहे हैं…", en: "Sending…" },

  errors: {
    name: { required: { hi: "नाम लिखिए", en: "Please enter your name" }, long: { hi: "नाम थोड़ा छोटा लिखिए", en: "Name is too long" } },
    phone: {
      required: { hi: "मोबाइल नंबर लिखिए", en: "Please enter your mobile number" },
      invalid: { hi: "10 अंकों का सही मोबाइल नंबर लिखिए", en: "Enter a valid 10-digit mobile number" },
    },
    date: { invalid: { hi: "सही तारीख़ चुनिए", en: "Pick a valid date" } },
    message: { long: { hi: "संदेश 600 अक्षर तक", en: "Message can be up to 600 characters" } },
  },

  done: {
    title: { hi: "संदेश पहुँच गया ✓", en: "Message sent ✓" },
    line: {
      hi: (name) => `धन्यवाद ${name} जी! हम जल्द आपको कॉल करेंगे।`,
      en: (name) => `Thank you, ${name}! We'll call you soon.`,
    },
    again: { hi: "एक और संदेश भेजें", en: "Send another message" },
  },
  fail: {
    title: { hi: "अभी भेज नहीं पाए", en: "Couldn't send right now" },
    line: {
      hi: "चिंता मत कीजिए — यही संदेश WhatsApp पर भेज दीजिए, सब लिखा हुआ मिलेगा।",
      en: "No worries — send the same message on WhatsApp, it's all filled in.",
    },
    rate: {
      hi: "थोड़ी देर में बहुत सारे संदेश आए — कुछ मिनट बाद फिर कोशिश करें, या WhatsApp कर दें।",
      en: "Too many messages in a short time — try again in a few minutes, or WhatsApp us.",
    },
    whatsapp: { hi: "WhatsApp पर भेजें", en: "Send on WhatsApp" },
    retry: { hi: "फिर से कोशिश करें", en: "Try again" },
  },
  // WhatsApp fallback message
  wa: {
    hi: (d) =>
      [
        `नमस्ते SNP Biotech! मेरा नाम ${d.name} है।`,
        d.place ? `गाँव/शहर: ${d.place}` : null,
        `विषय: ${d.typeLabel}`,
        d.date ? `आने की तारीख़: ${d.date}` : null,
        d.message ? `संदेश: ${d.message}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    en: (d) =>
      [
        `Hello SNP Biotech! My name is ${d.name}.`,
        d.place ? `Village/town: ${d.place}` : null,
        `About: ${d.typeLabel}`,
        d.date ? `Visit date: ${d.date}` : null,
        d.message ? `Message: ${d.message}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
  },
};
