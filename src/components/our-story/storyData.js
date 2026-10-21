// =========================================================
// "हमारी कहानी" page ka SAARA data — client ka asli data aate hi sirf yahi file badlo
//
// Niyam (har block pe):
//   confirmed: false → sirf dev mein dikhta hai ("नमूना डेटा" tag ke saath), live site pe chhup jaata hai
//   confirmed: true  → client ne pakka kar diya, live site pe dikhega
// Photos: public/our-story/ mein daalo (ya Cloudinary URL) — w/h asli photo ke hisaab se
// Text hamesha { hi: "...", en: "..." } — English na ho to Hindi dikhegi
// =========================================================

// ---------- 1. Hero photo (nursery ki sabse achhi wide photo) ----------
export const HERO_PHOTO = {
  confirmed: false, // TODO: client ki asli photo
  src: "/visit/mother-trees.webp",
  w: 1200,
  h: 800,
  alt: { hi: "SNP Biotech नर्सरी के मदर प्लांट", en: "Mother plants at SNP Biotech nursery" },
};

// ---------- 2. Safar — saal dar saal (purane se naya, kram apne aap lag jaata hai) ----------
// Har item: { year, title, line, photo? }  ·  photo: { src, w, h, alt }
export const MILESTONES = {
  confirmed: false, // TODO: client se har saal ki asli baat + photo
  items: [
    {
      year: 2016,
      title: { hi: "पहली क्यारी", en: "The first bed" },
      line: {
        hi: "एक छोटे से खेत और आम की कुछ सौ कलमों से शुरुआत।",
        en: "It began with a small plot and a few hundred mango grafts.",
      },
      photo: {
        src: "/visit/grafting.webp",
        w: 1200,
        h: 800,
        alt: { hi: "आम के पौधे पर कलम बाँधते हाथ", en: "Hands grafting a mango sapling" },
      },
    },
    {
      year: 2018,
      title: { hi: "मदर प्लांट का बाग़", en: "The mother-plant orchard" },
      line: {
        hi: "हर किस्म के जाँचे हुए मदर पेड़ लगाए — कलम आज भी यहीं से आती है।",
        en: "Tested mother trees for every variety — every graft still comes from here.",
      },
      photo: {
        src: "/visit/mother-trees.webp",
        w: 1200,
        h: 800,
        alt: { hi: "आम के बड़े मदर पेड़", en: "Mature mango mother trees" },
      },
    },
    {
      year: 2020,
      title: { hi: "शेड-नेट और नई किस्में", en: "Shade nets, new varieties" },
      line: {
        hi: "नन्हे पौधों के लिए शेड-नेट; अमरूद, नींबू और किन्नू भी जुड़े।",
        en: "Shade nets for young plants; guava, lemon and kinnow joined the range.",
      },
      photo: {
        src: "/visit/nursery-rows.webp",
        w: 1600,
        h: 1066,
        alt: { hi: "शेड-नेट के नीचे पौधों की कतारें", en: "Rows of saplings under a shade net" },
      },
    },
    {
      year: 2022,
      title: { hi: "दूर के किसानों तक", en: "Reaching farther farms" },
      line: {
        hi: "पूरे उत्तर प्रदेश में डिलीवरी — गाड़ी से सीधे खेत तक।",
        en: "Delivery across Uttar Pradesh — straight from our truck to the farm.",
      },
      photo: {
        src: "/visit/delivery.webp",
        w: 1200,
        h: 800,
        alt: { hi: "पौधों से भरी डिलीवरी गाड़ी", en: "A delivery truck loaded with saplings" },
      },
    },
    {
      year: 2024,
      title: { hi: "5 एकड़ की नर्सरी", en: "Five acres strong" },
      line: {
        hi: "नर्सरी बढ़कर 5 एकड़ हुई; सागवान, नीम और गुलमोहर भी आए।",
        en: "The nursery grew to five acres; teak, neem and gulmohar arrived.",
      },
      photo: {
        src: "/visit/gate.webp",
        w: 1200,
        h: 800,
        alt: { hi: "नर्सरी का गेट", en: "The nursery gate" },
      },
    },
    {
      year: 2026,
      title: { hi: "50,000+ पौधे, 1,000+ परिवार", en: "50,000+ plants, 1,000+ families" },
      line: {
        hi: "और अब ऑनलाइन — घर बैठे सूची बनाइए, WhatsApp पर ऑर्डर कीजिए।",
        en: "And now online — build your list at home, order on WhatsApp.",
      },
    },
  ],
};

// ---------- 3. Sansthapak ki baat ----------
// quote mein [[...]] wala hissa scroll pe sunehra chamakta hai (sabse khaas line)
export const FOUNDER = {
  confirmed: false, // TODO: naam, pad, photo aur unke apne shabd
  name: { hi: "संस्थापक का नाम", en: "Founder's name" },
  role: { hi: "संस्थापक, SNP Biotech", en: "Founder, SNP Biotech" },
  photo: null, // jaise { src: "/our-story/founder.webp", w: 900, h: 1100 }
  quote: {
    hi: "जब हमने शुरुआत की, तब एक ही बात तय की थी — [[किसान को वही पौधा मिले जो हम अपने खेत में लगाएँ।]] आम का पेड़ बीस-तीस साल चलता है। गलत किस्म का एक पौधा किसान के इतने साल खराब कर देता है — इसलिए हर कलम हम अपने मदर प्लांट से ही लेते हैं।",
    en: "When we started, we decided one thing — [[a farmer should get the same plant we would put in our own field.]] A mango tree lives twenty, thirty years. One wrong sapling can waste that many years — so every graft comes only from our own mother plants.",
  },
};

// ---------- 4. Hamare vaade (dhyaan: ye claims hain — client se pakka karwao) ----------
// icon: "sprout" | "shield" | "calendar" | "phone" | "truck" | "leaf"
export const PROMISES = {
  confirmed: false, // TODO: client har vaade ko "haan, ye hum karte hain" bole
  items: [
    {
      icon: "sprout",
      title: { hi: "मदर प्लांट से कलम", en: "Grafts from mother plants" },
      line: {
        hi: "हर किस्म की कलम अपने जाँचे हुए मदर पेड़ से — जो नाम बोला, वही किस्म।",
        en: "Every graft from our own tested mother trees — the variety we name is the variety you get.",
      },
    },
    {
      icon: "shield",
      title: { hi: "स्वस्थ पौधा ही जाता है", en: "Only healthy plants leave" },
      line: {
        hi: "भेजने से पहले हर पौधे की जड़, तना और पत्ते देखे जाते हैं।",
        en: "Roots, stem and leaves of every plant are checked before it leaves.",
      },
    },
    {
      icon: "calendar",
      title: { hi: "पहले सलाह, फिर बिक्री", en: "Advice first, then the sale" },
      line: {
        hi: "कौन-सी किस्म, कब लगाएँ, कितनी दूरी पर — पहले यह बताते हैं।",
        en: "Which variety, when to plant, how far apart — we tell you that first.",
      },
    },
    {
      icon: "phone",
      title: { hi: "बेचने के बाद भी साथ", en: "With you after the sale" },
      line: {
        hi: "पौधा लगाने के बाद कोई दिक्कत? फ़ोन कीजिए, हम बताएँगे।",
        en: "Any trouble after planting? Call us and we'll guide you.",
      },
    },
  ],
};

// ---------- 5. Nursery ki tasveerein (bento + bada karke dekhna) ----------
// Pehli photo sabse badi dikhti hai — sabse achhi wahi rakho
export const GALLERY = {
  confirmed: false, // TODO: client ki asli photos (kam se kam 5)
  photos: [
    {
      src: "/visit/nursery-rows.webp",
      w: 1600,
      h: 1066,
      alt: { hi: "शेड-नेट के नीचे पौधों की कतारें", en: "Rows of saplings under a shade net" },
      caption: { hi: "शेड-नेट में तैयार होते पौधे", en: "Saplings growing under shade net" },
    },
    {
      src: "/visit/grafting.webp",
      w: 1200,
      h: 800,
      alt: { hi: "आम के पौधे पर कलम बाँधते हाथ", en: "Hands grafting a mango sapling" },
      caption: { hi: "हाथ से लगाई कलम", en: "Grafted by hand" },
    },
    {
      src: "/visit/mother-trees.webp",
      w: 1200,
      h: 800,
      alt: { hi: "आम के बड़े मदर पेड़", en: "Mature mango mother trees" },
      caption: { hi: "मदर प्लांट का बाग़", en: "The mother-plant orchard" },
    },
    {
      src: "/visit/gate.webp",
      w: 1200,
      h: 800,
      alt: { hi: "नर्सरी का हरा गेट", en: "The green nursery gate" },
      caption: { hi: "नर्सरी का गेट", en: "The nursery gate" },
    },
    {
      src: "/visit/delivery.webp",
      w: 1200,
      h: 800,
      alt: { hi: "पौधों से भरी डिलीवरी गाड़ी", en: "A delivery truck loaded with saplings" },
      caption: { hi: "खेत तक डिलीवरी", en: "Delivery to the farm" },
    },
  ],
};

// ---------- 6. Kisaano ki zubaani (SIRF asli — har ek pe apna confirmed) ----------
// Asli testimonial jodne ka tareeka (TEMPLATE):
// {
//   confirmed: true,
//   name: { hi: "रमेश कुमार", en: "Ramesh Kumar" },
//   place: { hi: "सीतापुर", en: "Sitapur" },
//   plant: { hi: "दशहरी आम · 200 पौधे", en: "Dasheri mango · 200 plants" },
//   since: 2019,                       // kab se jude (optional)
//   quote: { hi: "...", en: "..." },   // unke apne shabd — badhaa-chadhaa ke nahi
// }
// Neeche wale NAMOONE hain — naam jaan-boojh ke "(…)" mein, taaki galti se bhi asli na lagein
export const VOICES = {
  items: [
    {
      confirmed: false,
      name: { hi: "(किसान का नाम)", en: "(Farmer's name)" },
      place: { hi: "(गाँव, ज़िला)", en: "(Village, district)" },
      plant: { hi: "आम · कलमी पौधे", en: "Mango · grafted plants" },
      since: 2019,
      quote: {
        hi: "यहाँ से लिए आम के पौधे तीसरे साल से फल देने लगे। किस्म भी वही निकली जो बताई थी।",
        en: "The mango plants from here started fruiting in the third year — and the variety was exactly what they said.",
      },
    },
    {
      confirmed: false,
      name: { hi: "(किसान का नाम)", en: "(Farmer's name)" },
      place: { hi: "(गाँव, ज़िला)", en: "(Village, district)" },
      plant: { hi: "अमरूद · ललित", en: "Guava · Lalit" },
      since: 2021,
      quote: {
        hi: "पौधे लगाने के बाद भी फ़ोन पर पूरी सलाह मिली। एक भी पौधा खराब नहीं हुआ।",
        en: "Even after planting, they guided us on the phone. Not a single plant failed.",
      },
    },
    {
      confirmed: false,
      name: { hi: "(किसान का नाम)", en: "(Farmer's name)" },
      place: { hi: "(गाँव, ज़िला)", en: "(Village, district)" },
      plant: { hi: "सागवान · 500 पौधे", en: "Teak · 500 plants" },
      since: 2023,
      quote: {
        hi: "बड़ा ऑर्डर था, फिर भी गाड़ी समय पर खेत तक आई और पौधे ताज़े थे।",
        en: "It was a big order, yet the truck reached our field on time and the plants were fresh.",
      },
    },
  ],
};
