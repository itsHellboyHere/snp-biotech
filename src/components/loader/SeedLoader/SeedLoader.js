import { LogoMark, LogoWord } from "@/components/nav/Logo";
import { LOADER_TEXT } from "../loaderConfig";
import styles from "./SeedLoader.module.css";

/* =========================================================
   A · बीज — "बीज से बाग़"  (--p = asli load progress 0→1)

   loading: mitti ki patli rekha pe ek lime beej dhadakta hai
            → neeche jaden, upar halka mudta tana — dono progress ke saath badhte hain
            → tane ki nok pe nanhi kopal, peeche roshni ka ghera badhta hai,
              hawa mein pollen jaise kan tairte hain
            → neeche bada "48%" + patli line + "पौधे तैयार हो रहे हैं"
   done:    kopal asli logo ke do patton mein khil jaati hai (spring),
            "SNP BIOTECH" blur se sharp hote hue likha jaata hai, phir tagline
   exit:    patton ke paas se ek chamakta chhalla failta hai — andar se website
   ========================================================= */

// Pollen ke kan — tay jagah (har render pe same, server = browser)
const MOTES = [
  { x: 12, s: 2, d: 9, t: 0.2 },
  { x: 22, s: 3, d: 11, t: 2.4 },
  { x: 31, s: 2, d: 8, t: 4.1 },
  { x: 38, s: 2, d: 12, t: 1.1 },
  { x: 46, s: 3, d: 10, t: 3.3 },
  { x: 54, s: 2, d: 9, t: 0.8 },
  { x: 61, s: 2, d: 13, t: 2.9 },
  { x: 68, s: 3, d: 8, t: 4.6 },
  { x: 76, s: 2, d: 11, t: 1.7 },
  { x: 84, s: 2, d: 10, t: 3.8 },
  { x: 90, s: 3, d: 12, t: 0.5 },
  { x: 17, s: 2, d: 14, t: 5.2 },
  { x: 72, s: 2, d: 14, t: 5.9 },
  { x: 50, s: 2, d: 15, t: 6.4 },
];

export default function SeedLoader({ phase, lang, counterRef }) {
  return (
    <div className={styles.wrap} data-phase={phase}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.motes} aria-hidden="true">
        {MOTES.map((m, i) => (
          <span key={i} style={{ "--x": `${m.x}%`, "--s": `${m.s}px`, "--d": `${m.d}s`, "--t": `${m.t}s` }} />
        ))}
      </div>

      {/* Kono mein halka editorial text */}
      <div className={styles.corners} aria-hidden="true">
        <span lang="en">SNP BIOTECH</span>
        <span>{LOADER_TEXT.since[lang]}</span>
      </div>

      <div className={styles.center} aria-hidden="true">
        <div className={styles.plant}>
          <span className={styles.aura} />
          <span className={styles.ground} />

          {/* Jaden — mitti ke neeche, upar se neeche khulti */}
          <svg className={styles.roots} viewBox="0 0 120 34" fill="none">
            <path d="M60 0 C58 10 50 16 42 24 C38 28 34 30 30 33" />
            <path d="M60 0 C62 12 70 18 78 25 C82 29 86 31 90 33" />
            <path d="M60 0 C60 12 59 22 60 33" />
          </svg>

          {/* Tana — halka S mod, neeche se upar khulta */}
          <svg className={styles.stem} viewBox="0 0 120 120" fill="none">
            <path d="M60 120 C55 96 66 72 60 46 C58 34 60 18 60 0" />
          </svg>

          <span className={styles.seed} />

          {/* Nanhi kopal (loading) → asli logo ke patte (done) */}
          <svg className={styles.bud} viewBox="0 0 40 30">
            <path d="M20 28 C12 27 6 21 4 12 C12 12 18 18 20 28 Z" />
            <path d="M20 28 C28 27 34 21 36 12 C28 12 22 18 20 28 Z" />
          </svg>
          <span className={styles.sprout}>
            <LogoMark className={styles.mark} />
          </span>
        </div>

        <div className={styles.word}>
          <LogoWord className={styles.wordSvg} />
        </div>
        <p className={styles.tag}>{LOADER_TEXT.tagline[lang]}</p>
      </div>

      {/* Neeche: bada % + line + kya ho raha hai */}
      <div className={styles.foot} aria-hidden="true">
        <span className={styles.pct} lang="en">
          <span ref={counterRef}>0</span>
          <small>%</small>
        </span>
        <span className={styles.track}>
          <i />
        </span>
        <span className={styles.label}>{LOADER_TEXT.preparing[lang]}</span>
      </div>

      <span className={styles.ring} aria-hidden="true" />
    </div>
  );
}
