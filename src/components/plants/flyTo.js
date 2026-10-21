// Apple Store ka "Add to Bag" feel: paudhe ki chhoti photo udke neeche wali "मेरी सूची" patti mein
// Web Animations API — koi library nahi. Animation band (reduced motion) ho to kuch nahi.
export const DOCK_TARGET_ID = "order-dock-target";

export function flyTo(fromEl, src) {
  if (typeof window === "undefined" || !fromEl || !src) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Dock pehli baar aa raha ho to thoda ruk ke uski jagah lo
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const target = document.getElementById(DOCK_TARGET_ID);
      if (!target) return;
      const a = fromEl.getBoundingClientRect();
      const b = target.getBoundingClientRect();
      const size = 56;
      const sx = a.left + a.width / 2 - size / 2;
      const sy = a.top + a.height / 2 - size / 2;
      const dx = b.left + b.width / 2 - size / 2 - sx;
      const dy = b.top + b.height / 2 - size / 2 - sy;

      const ghost = document.createElement("img");
      ghost.src = src;
      ghost.alt = "";
      ghost.setAttribute("aria-hidden", "true");
      Object.assign(ghost.style, {
        position: "fixed",
        left: `${sx}px`,
        top: `${sy}px`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        objectFit: "cover",
        zIndex: "120",
        pointerEvents: "none",
        boxShadow: "0 10px 30px -10px rgba(10,26,18,.55)",
      });
      document.body.appendChild(ghost);

      // Seedhi line nahi — halka sa upar uthke girta hai (arc)
      const lift = Math.min(160, Math.abs(dy) * 0.35 + 60);
      const anim = ghost.animate(
        [
          { transform: "translate(0,0) scale(.6)", opacity: 0 },
          { transform: "translate(0,0) scale(1.15)", opacity: 1, offset: 0.15 },
          { transform: `translate(${dx * 0.55}px, ${dy * 0.55 - lift}px) scale(.85)`, offset: 0.55 },
          { transform: `translate(${dx}px, ${dy}px) scale(.35)`, opacity: 0.9 },
        ],
        { duration: 780, easing: "cubic-bezier(.5,0,.3,1)" }
      );
      anim.onfinish = () => {
        ghost.remove();
        target.animate([{ transform: "scale(1)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }], {
          duration: 420,
          easing: "cubic-bezier(.16,1,.3,1)",
        });
      };
    })
  );
}
