// Navbar ke links — har link ek alag PAGE hai (multi-page site).
// Naya page banao to bas yahan ek line jodo.
export const NAV_LINKS = [
  { id: "home", label: "Home", href: "/" },
  { id: "plants", label: "Plants", href: "/plants" },
  { id: "story", label: "Our Story", href: "/our-story" },
  { id: "grow", label: "How We Grow", href: "/how-we-grow" },
  { id: "visit", label: "Visit Nursery", href: "/contact" },
];

// Abhi kaunsa page khula hai — "/" sirf exact match, baaki sub-pages bhi gine jaate hain
export function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
