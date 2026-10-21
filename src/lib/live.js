// =========================================================
// "Kya ye data live site pe dikhe?" — poori website ka ek hi niyam
//
// Har placeholder block pe `confirmed: false` hota hai.
//   - Dev (npm run dev) mein sab dikhta hai, "नमूना डेटा" tag ke saath → design check ho sake
//   - Live site (production) pe SIRF wahi dikhta hai jo client ne confirm kiya (confirmed: true)
// Isse naqli photo / naam / saal / testimonial kabhi galti se live nahi jaate.
// =========================================================

export function isLive(block) {
  return Boolean(block?.confirmed) || process.env.NODE_ENV !== "production";
}

// Google (JSON-LD) ke liye aur bhi sakht: sirf confirmed — dev mein bhi naqli data schema mein na jaaye
export function isConfirmed(block) {
  return block?.confirmed === true;
}
