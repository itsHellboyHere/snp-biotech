"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Lenis (smooth wheel scroll) + GSAP ek hi clock pe — hero ka frame-scrub isi pe chalta hai.
// Phone pe Lenis touch ko smooth NAHI karta (native scroll hi best lagta hai).
export default function SmoothScroll() {
  const pathname = usePathname();

  // Naya page khule to seedha top se shuru ho (Lenis purani position yaad na rakhe)
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true, force: true });
    ScrollTrigger.refresh();
  }, [pathname]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    window.__lenis = lenis; // doosre components (jaise story segments) smooth scrollTo kar sakein
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, []);

  return null;
}
