import { NextResponse } from "next/server";

// URL saaf rakhne ke liye:
//   /en/...  → English, seedha jaane do
//   /hi/...  → /...  pe redirect (Hindi ka ek hi URL rahe — SEO ke liye zaroori)
//   baaki    → andar se /hi/... dikhao (browser mein URL wahi rahega)
// Koi auto-redirect browser ki language dekh ke NAHI — Google ko dono versions milte rahein.
export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();

  if (pathname === "/hi" || pathname.startsWith("/hi/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/hi${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // _next, api aur files (.webp, .ico, .xml...) ko chhod ke sab
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
