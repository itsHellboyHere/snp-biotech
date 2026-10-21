"use client";

import { useEffect, useState } from "react";

// Neeche scroll → navbar chhupe, upar scroll → wapas aaye.
// Chhoti-moti hilne pe (threshold) kuch nahi badalta — jhilmilahat nahi.
export function useNavScroll({ threshold = 8, topZone = 80 } = {}) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const delta = y - lastY;
      setScrolled(y > 12);
      if (y < topZone) setHidden(false);
      else if (Math.abs(delta) > threshold) setHidden(delta > 0);
      if (Math.abs(delta) > threshold || y < topZone) lastY = y;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, topZone]);

  return { hidden, scrolled };
}
