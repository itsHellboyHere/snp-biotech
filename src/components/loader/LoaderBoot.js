import { LOADER } from "./loaderConfig";

/* =========================================================
   Sirf tab kaam ka jab loaderConfig.js mein ONCE_PER_TAB: true ho —
   <body> ki sabse pehli chhoti script (React ka intezaar nahi): is tab mein loader
   pehle dekh liya → <html data-loader="skip"> → dobara aane pe ek pal ki jhalak bhi nahi.
   ONCE_PER_TAB: false (abhi) → kuch nahi karta, loader har baar chalta hai.
   ========================================================= */
export default function LoaderBoot() {
  if (LOADER.ACTIVE === "off" || !LOADER.ONCE_PER_TAB) return null;
  const code = `try{if(sessionStorage.getItem(${JSON.stringify(
    LOADER.SESSION_KEY
  )}))document.documentElement.setAttribute("data-loader","skip")}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
