// =========================================================
// Site khulne wala loader — saari settings ek jagah
//
// ACTIVE = kaunsa loader chale: "seed" | "rings" | "curtain" | "off"
// Sirf yahi line decide karti hai — website mein loader chunne ka koi UI / URL nahi.
// =========================================================

export const LOADER = {
  ACTIVE: "seed",
  // false = har baar site khulne / refresh pe loader (normal websites jaisa)
  // true  = ek tab mein sirf pehli baar
  ONCE_PER_TAB: false,
  SESSION_KEY: "snp:loader:v1",
  MAX_MS: 3500, // internet kitna bhi slow ho, isse zyada nahi rukega
  INNER_FACTOR: 0.6, // Home ke alawa page (WhatsApp link se /plants) → chhota version
  REDUCED_MS: 500, // "animation kam karo" wale ke liye
};

// Har variant ki timing (ms)
//   min  = kam se kam itna chale (animation poori dikhe)
//   hold = load poora hone ke baad ka "finale" (patte khulna / logo aana)
//   exit = site dikhne wala transition
//   counter = "year" (2016→2026) ya "percent" (0→100)
export const VARIANT_TIMING = {
  seed: { min: 1600, hold: 1050, exit: 950, counter: "percent" },
  rings: { min: 1600, hold: 750, exit: 950, counter: "year" },
  curtain: { min: 1900, hold: 350, exit: 950, counter: "percent" },
};

export const LOADER_TEXT = {
  tagline: { hi: "आपकी भरोसेमंद पौधों की नर्सरी", en: "Your trusted plant nursery" },
  since: { hi: "उत्तर प्रदेश · 2016 से", en: "Uttar Pradesh · since 2016" },
  growing: { hi: "साल दर साल", en: "year by year" },
  preparing: { hi: "पौधे तैयार हो रहे हैं", en: "Preparing your plants" },
  // "पर्दा" loader ke ghoomte shabd — aakhri wala ruk jaata hai
  words: {
    hi: ["बीज", "पौधा", "पेड़", "बाग़।"],
    en: ["Seed", "Sapling", "Tree", "Orchard."],
  },
  fromYear: 2016,
  toYear: 2026,
};
