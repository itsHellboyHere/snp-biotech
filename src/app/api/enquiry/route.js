// =========================================================
// POST /api/enquiry — website ka form → client ki Gmail (Resend se)
//
// .env (aur Vercel → Settings → Environment Variables) mein:
//   RESEND_API_KEY=re_xxx            ← Resend dashboard → API Keys (SECRET — sirf env mein)
//   ENQUIRY_TO=…  (optional)         ← warna lib/site.js ka enquiryEmail (snpbiotech5@gmail.com)
//   ENQUIRY_FROM="SNP Biotech <onboarding@resend.dev>"
//      (domain verify hone tak resend.dev wala; tab tak email SIRF Resend account
//       wali Gmail pe hi jaata hai — isliye Resend account client ki Gmail se banana)
//
// Key nahi hai? Dev mein email console mein dikhta hai (form poora test ho jaata hai).
// Production mein bina key → 503, aur form visitor ko WhatsApp ka rasta dikhata hai.
// =========================================================

import { NextResponse } from "next/server";
import { validateEnquiry } from "@/lib/enquiry/validate";
import { buildEnquiryEmail } from "@/lib/enquiry/email";
import { rateLimited, seenBefore } from "@/lib/enquiry/rateLimit";
import { site } from "@/lib/site";

const MAX_BODY = 20_000; // ~20KB — isse bada form ho hi nahi sakta
const MIN_FILL_MS = 2500; // isse jaldi bhara form = bot
const isDev = process.env.NODE_ENV !== "production";

const json = (data, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request) {
  // 1. Sirf apni hi website se (doosri site ka form yahan post na kar sake)
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    if (origin && host && new URL(origin).host !== host) return json({ ok: false, error: "forbidden" }, 403);
  } catch {
    return json({ ok: false, error: "forbidden" }, 403);
  }

  // 2. Size + JSON
  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ ok: false, error: "too_large" }, 413);
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "bad_json" }, 400);
  }

  // 3. Bot jaal: chhupa field bhara ho ya form 2.5s se pehle aaya → chupchaap "ok" (bot ko pata na chale)
  const tooFast = Number.isFinite(body?.startedAt) && Date.now() - body.startedAt < MIN_FILL_MS;
  if (body?.company || tooFast) return json({ ok: true });

  // 4. Ek IP se 10 minute mein 5 se zyada nahi
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";
  if (rateLimited(ip)) return json({ ok: false, error: "rate_limited" }, 429);

  // 5. Poori jaanch (browser wali hi — par yahan dobara, bharosa nahi)
  const v = validateEnquiry(body);
  if (!v.ok) return json({ ok: false, error: "invalid", errors: v.errors }, 422);

  // 6. Same form dobara (double-tap / retry) → ek hi email
  const id = typeof body.id === "string" && /^[\w-]{8,64}$/.test(body.id) ? body.id : null;
  if (seenBefore(id)) return json({ ok: true, duplicate: true });

  const mail = buildEnquiryEmail(v.data, { page: typeof body.page === "string" ? body.page.slice(0, 80) : "", site: site.url });
  const key = process.env.RESEND_API_KEY;
  const to = (process.env.ENQUIRY_TO || site.enquiryEmail || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // 7. Abhi key nahi → dev mein console pe dikhao
  if (!key || !to.length) {
    if (isDev) {
      console.info(`\n──── [enquiry · DEV] email jo jaata ────\nSubject: ${mail.subject}\n${mail.text}\n────────────────────────────────────\n`);
      return json({ ok: true, dev: true });
    }
    console.error("[enquiry] RESEND_API_KEY set nahi hai (ya koi \"to\" email nahi)");
    return json({ ok: false, error: "not_configured" }, 503);
  }

  // 8. Resend se bhejo (SDK ki zaroorat nahi — seedha API)
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        ...(id ? { "Idempotency-Key": id } : {}),
      },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM || "SNP Biotech Website <onboarding@resend.dev>",
        to,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        tags: [{ name: "type", value: v.data.type }],
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("[enquiry] Resend error", res.status, await res.text().catch(() => ""));
      return json({ ok: false, error: "send_failed" }, 502);
    }
    return json({ ok: true });
  } catch (err) {
    console.error("[enquiry] Resend fetch fail", err);
    return json({ ok: false, error: "send_failed" }, 502);
  }
}
