import { LogoMark } from "@/components/nav/Logo";
import { LOADER_TEXT } from "../loaderConfig";
import styles from "./RingsLoader.module.css";

/* =========================================================
   B · छल्ले — "हर छल्ला, एक साल" (Home ke rings se juda)
   loading: beech mein saal 2016 → 2026 ginta hai, har saal ek naya chhalla
            bahar ki taraf banta hai (jitna load, utne chhalle)
   done:    saal ki jagah logo ke patte, saare chhalle ek pal chamakte hain
   exit:    chhalle tezi se bahar udte hain (zoom-through) aur parat ghul jaati hai
   ========================================================= */
const YEARS = LOADER_TEXT.toYear - LOADER_TEXT.fromYear + 1; // 11 chhalle

export default function RingsLoader({ phase, lang, counterRef }) {
  return (
    <div className={styles.wrap} data-phase={phase} style={{ "--n": YEARS }}>
      <div className={styles.rings} aria-hidden="true">
        {Array.from({ length: YEARS }, (_, i) => (
          <span key={i} style={{ "--i": i }} />
        ))}
      </div>

      <div className={styles.center} aria-hidden="true">
        <span ref={counterRef} className={styles.year} lang="en">
          {LOADER_TEXT.fromYear}
        </span>
        <span className={styles.unit}>{LOADER_TEXT.growing[lang]}</span>
        <LogoMark className={styles.mark} />
      </div>

      <p className={styles.tag} aria-hidden="true">
        <span lang="en">SNP BIOTECH</span> · {LOADER_TEXT.tagline[lang]}
      </p>
    </div>
  );
}
