// =========================================================
// Puchhtachh ka email — client (SNP Biotech) ki Gmail mein jaisa dikhega
// Gmail mein phone pe padhne layak: saaf table, ek tap mein Call / WhatsApp
// Har user text HTML-escape hota hai (koi email mein code / link ghusa na sake)
// =========================================================

import { getPlant, getVariety } from "@/components/plants/plantsModel";

const TYPE_LABEL = {
  visit: "नर्सरी आना चाहते हैं",
  order: "पौधे ऑर्डर करने हैं",
  bulk: "बड़ा ऑर्डर (100+)",
  delivery: "डिलीवरी के बारे में",
  other: "कुछ और पूछना है",
};

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const fmtDate = (s) =>
  s
    ? new Date(`${s}T12:00:00+05:30`).toLocaleDateString("hi-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      })
    : null;

function itemLines(items) {
  return items.map((it) => {
    const p = getPlant(it.id);
    const v = getVariety(p, it.variety);
    return { name: `${p?.name.hi ?? it.id}${v ? ` (${v.name.hi})` : ""}`, qty: it.qty };
  });
}

export function buildEnquiryEmail(d, { page = "/contact", site = "" } = {}) {
  const typeLabel = TYPE_LABEL[d.type] ?? TYPE_LABEL.other;
  const phone91 = `91${d.phone}`;
  const items = itemLines(d.items);
  const total = items.reduce((s, x) => s + x.qty, 0);
  const when = new Date().toLocaleString("hi-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });

  const subject = `🌱 नई पूछताछ: ${d.name} · ${typeLabel}${total ? ` · ${total} पौधे` : ""}`;

  // [label, HTML (escape kiya hua), saada text]
  const rows = [
    ["नाम", esc(d.name), d.name],
    [
      "मोबाइल",
      `<a href="tel:+${phone91}" style="color:#183d2b">+91 ${esc(d.phone.slice(0, 5))} ${esc(d.phone.slice(5))}</a>`,
      `+91 ${d.phone}`,
    ],
    d.place ? ["गाँव / शहर", esc(d.place), d.place] : null,
    ["किस बारे में", esc(typeLabel), typeLabel],
    d.date ? ["कब आना है", esc(fmtDate(d.date)), fmtDate(d.date)] : null,
    d.message ? ["संदेश", esc(d.message).replace(/\n/g, "<br>"), d.message] : null,
    ["भाषा", d.lang === "en" ? "English" : "हिन्दी", d.lang === "en" ? "English" : "हिन्दी"],
  ].filter(Boolean);

  const itemsHtml = items.length
    ? `<h3 style="margin:24px 0 8px;font-size:16px;color:#183d2b">पौधों की सूची — कुल ${total}</h3>
       <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
         ${items
           .map(
             (x) => `<tr>
               <td style="padding:8px 0;border-bottom:1px solid #ece5d6">${esc(x.name)}</td>
               <td style="padding:8px 0;border-bottom:1px solid #ece5d6;text-align:right;font-weight:700">${x.qty}</td>
             </tr>`
           )
           .join("")}
       </table>`
    : "";

  const waText = encodeURIComponent(`नमस्ते ${d.name} जी, SNP Biotech से — आपकी पूछताछ मिली।`);
  const html = `<!doctype html><html><body style="margin:0;background:#f5f1e8;font-family:Arial,'Noto Sans Devanagari',sans-serif;color:#0a1a12">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px">
    <div style="background:#fffdf9;border-radius:18px;padding:24px;border:1px solid #ece5d6">
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;color:#4f8a5b;font-weight:700">SNP BIOTECH · वेबसाइट से नई पूछताछ</p>
      <h2 style="margin:0 0 16px;font-size:22px;color:#183d2b">${esc(d.name)} — ${esc(typeLabel)}</h2>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:15px">
        ${rows
          .map(
            ([k, v]) => `<tr>
              <td style="padding:9px 12px 9px 0;color:#8a877c;white-space:nowrap;vertical-align:top;border-bottom:1px solid #f1ecdf">${k}</td>
              <td style="padding:9px 0;border-bottom:1px solid #f1ecdf">${v}</td>
            </tr>`
          )
          .join("")}
      </table>
      ${itemsHtml}
      <div style="margin-top:24px">
        <a href="tel:+${phone91}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 18px;border-radius:999px;background:#0a1a12;color:#f5f1e8;text-decoration:none;font-weight:700">📞 कॉल करें</a>
        <a href="https://wa.me/${phone91}?text=${waText}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 18px;border-radius:999px;background:#c6f36b;color:#0a1a12;text-decoration:none;font-weight:700">WhatsApp करें</a>
      </div>
    </div>
    <p style="font-size:12px;color:#8a877c;text-align:center;margin:16px 0 0">${esc(when)} · ${esc(site)}${esc(page)}</p>
  </div></body></html>`;

  const text = [
    `नई पूछताछ — ${typeLabel}`,
    ...rows.map(([k, , plain]) => `${k}: ${plain}`),
    ...(items.length ? ["", `पौधे (कुल ${total}):`, ...items.map((x) => `• ${x.name} – ${x.qty}`)] : []),
    "",
    `कॉल: +${phone91}`,
    `WhatsApp: https://wa.me/${phone91}`,
  ].join("\n");

  return { subject, html, text };
}
