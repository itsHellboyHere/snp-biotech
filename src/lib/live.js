// =========================================================
// "Kya ye data site pe dikhe?" — poori website ka ek hi niyam
//
// Abhi (client ka data aane tak): SHOW_PLACEHOLDERS = true → sab kuch live site pe bhi dikhta hai,
// namoona (confirmed: false) data bhi. "नमूना डेटा" tag sirf dev (localhost) mein dikhta hai.
// Client ka asli data aate hi us block pe `confirmed: true` karo.
// Sab asli ho jaaye (ya naqli chhupana ho) → SHOW_PLACEHOLDERS = false
// Google (JSON-LD schema) mein hamesha SIRF confirmed data jaata hai — isConfirmed.
// =========================================================

export const SHOW_PLACEHOLDERS = true;

export function isLive(block) {
  return Boolean(block?.confirmed) || SHOW_PLACEHOLDERS;
}

// "नमूना डेटा" tag — sirf dev mein, taaki yaad rahe kya badalna hai
export function isSample(block) {
  return !block?.confirmed && process.env.NODE_ENV !== "production";
}

export function isConfirmed(block) {
  return block?.confirmed === true;
}
