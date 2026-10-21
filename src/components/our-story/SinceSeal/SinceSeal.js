import { LogoMark } from "@/components/nav/Logo";
import styles from "./SinceSeal.module.css";

/* Gol ghoomti mohar — "SNP BIOTECH • SINCE 2016 • NURSERY •" beech mein patte
   Sirf sajaavat (aria-hidden) — saal ki asli jaankari hero ke text mein hai */
export default function SinceSeal({ text, className = "" }) {
  return (
    <div className={`${styles.seal} ${className}`} aria-hidden="true">
      <svg className={styles.ring} viewBox="0 0 200 200">
        <defs>
          <path id="since-seal-path" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className={styles.text}>
          <textPath href="#since-seal-path" textLength="488" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <LogoMark className={styles.mark} />
    </div>
  );
}
