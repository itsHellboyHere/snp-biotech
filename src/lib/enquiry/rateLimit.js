// Ek hi jagah (IP) se thode samay mein bahut saare form → roko (spam / galti se baar-baar)
// Note: serverless pe har instance ki apni yaad hoti hai — ye pehli deewar hai,
// honeypot + time-trap + (chaho to aage Cloudflare Turnstile) saath milke kaam karte hain.

const WINDOW_MS = 10 * 60 * 1000; // 10 minute
const MAX_HITS = 5;
const hits = new Map(); // ip → [timestamps]

export function rateLimited(key) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(key, list);
  // Map bahut bada na ho jaaye
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return list.length > MAX_HITS;
}

// Double-tap / network retry pe ek hi email (Resend ko bhi Idempotency-Key jaata hai)
const recentIds = new Map(); // id → time
export function seenBefore(id) {
  if (!id) return false;
  const now = Date.now();
  for (const [k, t] of recentIds) if (now - t > WINDOW_MS) recentIds.delete(k);
  if (recentIds.has(id)) return true;
  recentIds.set(id, now);
  return false;
}
