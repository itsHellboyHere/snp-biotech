// =========================================================
// Website ka pura pata (share photo / OG, sitemap, Google ke links isi se bante hain)
// Kram: NEXT_PUBLIC_SITE_URL → DOMAIN (neeche) → Vercel ka apna pata → localhost
// Google ko HAMESHA yahi pata batate hain (canonical) — snp-biotech.vercel.app pe
// "index mat karo" lagta hai (proxy.js), taaki do jagah same site na dikhe.
// =========================================================
const DOMAIN = "https://snpbiotech.in"; // asli domain (Vercel → Domains mein jud gaya, Oct 2026)

function siteUrl() {
  const clean = (u) => u.replace(/\/+$/, "");
  if (process.env.NEXT_PUBLIC_SITE_URL) return clean(process.env.NEXT_PUBLIC_SITE_URL);
  if (DOMAIN) return clean(DOMAIN);
  // Vercel khud deta hai (production ka pata, jaise snp-biotech.vercel.app)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

// Business details ek jagah — client se confirm hote hi yahin update karo
export const site = {
  name: "SNP Biotech",
  url: siteUrl(), // sirf server pe use hota hai (metadata, sitemap, JSON-LD, email)
  established: 2016, // TODO: exact saal confirm
  whatsapp: "919568555404", // WhatsApp number, bina "+" ke (91 = India)
  phone: "+919568555404", // calling number
  // Website ke form (puchhtachh) yahan aate hain — Resend account isi Gmail se bana hai.
  // Domain verify hone tak Resend SIRF isi email pe bhej sakta hai.
  enquiryEmail: "snpbiotech5@gmail.com",
  // Email kis naam/pate se aaye — snpbiotech.in Resend mein verify (inbox ki zaroorat nahi, sirf bhejne ka naam)
  enquiryFrom: "SNP Biotech Website <enquiry@snpbiotech.in>",
  // Pura pata (client ne diya, Oct 2026) — footer + Visit page + Google (JSON-LD) pe
  address: {
    hi: "अगवानपुर चौराहा, मुरादाबाद–नूरपुर रोड, ज़िला मुरादाबाद, उत्तर प्रदेश – 244301",
    en: "Agwanpur Chauraha, Moradabad–Noorpur Road, District Moradabad, Uttar Pradesh – 244301",
  },
  // Google ke liye tukdon mein (schema.org PostalAddress)
  postal: {
    street: "Agwanpur Chauraha, Moradabad–Noorpur Road",
    locality: "Agwanpur",
    district: "Moradabad",
    region: "Uttar Pradesh",
    pin: "244301",
  },
  // Google Maps mein ye khoja jaata hai — jab tak asli pin (geo) nahi, map + "रास्ता देखें" isi se
  mapsQuery: "SNP Biotech, Agwanpur Chauraha, Moradabad–Noorpur Road, Moradabad, Uttar Pradesh 244301",
  mapsUrl: null, // TODO: Google Maps ka "Share → Copy link" (mile to sabse sateek)
  // TODO: nursery ka asli pin (WhatsApp location se) — tab tak map pate (mapsQuery) se chalta hai
  geo: { lat: null, lng: null, confirmed: false },
  hours: { hi: "रोज़ सुबह 8 – शाम 5 · सातों दिन", en: "Daily 8 am – 5 pm · all 7 days" },
  // Google mein "ye wahi business hai" batane ke liye — client ke social pages / Google Maps listing
  // TODO: jaise "https://www.facebook.com/…", "https://www.instagram.com/…", "https://g.page/…"
  social: [],
};

// "+919876543210" / "919876543210" → "+91 98765 43210" (padhne mein aasaan)
export function displayPhone(raw = "") {
  const d = String(raw).replace(/\D/g, "");
  const n = d.length > 10 ? d.slice(-10) : d;
  if (n.length !== 10) return raw;
  return `+91 ${n.slice(0, 5)} ${n.slice(5)}`;
}

// WhatsApp pe jaane wala message — visitor ki language mein (hi / en)
export const WA_TEXT = {
  general: {
    hi: "नमस्ते SNP Biotech, मुझे पौधों के बारे में जानकारी चाहिए।",
    en: "Hello SNP Biotech, I'd like to know more about your plants.",
  },
  order: {
    hi: (item) => `नमस्ते SNP Biotech! मुझे ${item} के पौधे चाहिए।`,
    en: (item) => `Hello SNP Biotech! I'd like to order ${item} plants.`,
  },
};

export function callLink() {
  return `tel:${site.phone}`;
}

export function whatsappLink(text = WA_TEXT.general.hi) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
