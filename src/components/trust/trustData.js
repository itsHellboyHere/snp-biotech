// =========================================================
// "पेड़ के छल्ले" — bharose ke aankde (hi / en)
// Stats client ke diye hue asli numbers hain (Oct 2026) — badlein to yahin badlo
// =========================================================

export const TRUST = {
  eyebrow: { hi: "हमारा अनुभव", en: "Our experience" },
  title: { hi: "हर छल्ला, एक साल।", en: "Every ring, a year." },
  line: {
    hi: "पेड़ की उम्र उसके छल्लों में लिखी होती है। हमारी नर्सरी ने ऐसे दस से ज़्यादा छल्ले जोड़े हैं।",
    en: "A tree's age is written in its rings. Our nursery has added more than ten.",
  },
  center: { big: "10+", small: { hi: "साल", en: "years" } },
  fromYear: 2016, // TODO: site.established ke saath confirm
  toYear: 2026, // har saal +1 (ya client ka current saal)
  ringsImage: "/home/rings.webp",
  stats: [
    { value: 50000, suffix: "+", label: { hi: "पौधे किसानों तक पहुँचे", en: "plants delivered to farmers" } },
    { value: 1000, suffix: "+", label: { hi: "किसान परिवार जुड़े", en: "farming families served" } },
    { value: 5, suffix: { hi: " एकड़", en: " acres" }, label: { hi: "में फैली नर्सरी", en: "of nursery land" } },
  ],
};
