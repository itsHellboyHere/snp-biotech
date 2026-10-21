// Business details ek jagah — client se confirm hote hi yahin update karo
export const site = {
  name: "SNP Biotech",
  url: "https://snpbiotech.in", // TODO: asli domain confirm (SEO links isi se bante hain)
  established: 2016, // TODO: exact saal confirm
  whatsapp: "910000000000", // TODO: WhatsApp number, bina "+" ke
  phone: "+910000000000", // TODO: calling number
  // TODO: pura pata (gaanv / tehsil / zila) — footer + Visit page pe dikhta hai
  address: { hi: "उत्तर प्रदेश", en: "Uttar Pradesh, India" },
  mapsUrl: null, // TODO: Google Maps ka "Share → Copy link"
  // TODO: nursery ka asli pin (WhatsApp location se) — abhi NAMOONA (Lucknow), sirf dev mein dikhta hai
  geo: { lat: 26.8467, lng: 80.9462, confirmed: false },
  hours: null, // TODO: jaise { hi: "रोज़ सुबह 8 – शाम 6", en: "Daily 8 am – 6 pm" }
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
