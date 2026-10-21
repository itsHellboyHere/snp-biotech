// =========================================================
// "नर्सरी आइए" page ka POORA data — client ka asli data aate hi yahin bharo
//
// HAR BLOCK MEIN `confirmed`:
//   false → NAMOONA (placeholder) data. Sirf dev (localhost) mein dikhta hai,
//           "नमूना" tag ke saath. Production (live site) pe ye block apne aap CHHUP jaata hai —
//           galat samay / galat pata / nakli photo kabhi live nahi jaayegi.
//   true  → client ne confirm kiya → live site pe bhi dikhega.
//
// Pata, phone, WhatsApp, lat/lng, Maps link → lib/site.js (footer bhi wahi use karta hai)
// =========================================================

/* ---------- खुलने का समय ----------
   days: 0 = रविवार, 1 = सोमवार … 6 = शनिवार · samay 24 ghante wala "HH:MM" (India time)
   Ek din ke do slot bhi chal jaate hain (jaise dopahar ki chhutti):
   { days: [1], open: "08:00", close: "12:30" }, { days: [1], open: "14:00", close: "18:00" } */
export const HOURS = {
  confirmed: false, // TODO(client): asli samay
  week: [
    { days: [1, 2, 3, 4, 5, 6], open: "08:00", close: "18:00" },
    { days: [0], open: "08:00", close: "13:00" },
  ],
  // Mausam mein kuch alag ho to (warna null)
  note: {
    hi: "पौधे लगाने के मौसम (जुलाई–सितंबर) में समय बदल सकता है — आने से पहले एक कॉल कर लें।",
    en: "Hours may change in planting season (July–September) — please call before you come.",
  },
};

/* ---------- रास्ते की पहचान (गाँव में लोग निशान से पहुँचते हैं) ---------- */
export const LANDMARKS = {
  confirmed: false, // TODO(client): highway, paas ka gaanv, petrol pump / mandir, board ka rang
  steps: [
    { icon: "road", text: { hi: "NH-__ से ____ की ओर आइए।", en: "Take NH-__ towards ____." } },
    { icon: "fuel", text: { hi: "____ पेट्रोल पंप के बाद बाएँ मुड़ें।", en: "Turn left after the ____ petrol pump." } },
    { icon: "sign", text: { hi: "हरे बोर्ड पर “SNP Biotech” लिखा दिखेगा — वही गेट।", en: "Look for the green “SNP Biotech” board — that's the gate." } },
  ],
};

/* ---------- सुविधाएँ ("आने से पहले" में दिखती हैं) — show: false = छुपा ---------- */
export const FACILITIES = {
  confirmed: false, // TODO(client): parking + payment confirm
  items: [
    {
      id: "parking",
      icon: "truck",
      show: true,
      text: { hi: "ट्रैक्टर-ट्रॉली / पिकअप खड़ी करने की जगह है।", en: "Space to park a tractor-trolley or pickup." },
    },
    {
      id: "payment",
      icon: "wallet",
      show: true,
      text: { hi: "UPI और नकद — दोनों से भुगतान।", en: "Pay by UPI or cash." },
    },
    {
      id: "advice",
      icon: "sprout",
      show: true,
      text: { hi: "किस्म और दूरी की सलाह — मुफ़्त।", en: "Free advice on variety and spacing." },
    },
  ],
};

/* ---------- डिलीवरी — show: false = band hi nahi dikhega ---------- */
export const DELIVERY = {
  confirmed: false, // TODO(client): delivery karte hain? kahan tak? kam se kam kitne paudhe?
  show: true,
  area: { hi: "आस-पास के ज़िलों में", en: "Nearby districts" },
  min: { hi: "बड़े ऑर्डर पर", en: "On bulk orders" },
  img: { src: "/visit/delivery.webp", w: 1200, h: 800 },
};

/* ---------- फ़ोटो ---------- */
// TODO(client): asli photos aate hi src badlo (scripts/build-visit-images.py) aur confirmed: true
export const HERO_PHOTO = {
  confirmed: false,
  src: "/visit/nursery-rows.webp",
  w: 1600,
  h: 1066,
  alt: { hi: "शेड-नेट के नीचे पौधों की कतारें", en: "Rows of saplings under a shade net" },
};

export const GLIMPSE = {
  confirmed: false,
  photos: [
    {
      src: "/visit/gate.webp",
      w: 1200,
      h: 800,
      alt: { hi: "नर्सरी का हरा गेट", en: "The green nursery gate" },
      caption: { hi: "नर्सरी का गेट", en: "The gate" },
    },
    {
      src: "/visit/nursery-rows.webp",
      w: 1600,
      h: 1066,
      alt: { hi: "शेड-नेट के नीचे पौधों की कतारें", en: "Rows of saplings under a shade net" },
      caption: { hi: "शेड-नेट में तैयार पौधे", en: "Saplings under shade net" },
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
      alt: { hi: "मदर प्लांट — आम के बड़े पेड़", en: "Mother plants — mature mango trees" },
      caption: { hi: "मदर प्लांट", en: "Mother plants" },
    },
  ],
};
