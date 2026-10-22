import Logo from "@/components/nav/Logo";
import { LOADER_TEXT } from "../loaderConfig";
import styles from "./CurtainLoader.module.css";

/* =========================================================
   C · पर्दा — Apple / Lusion jaisa minimal (light ivory)
   loading: beech mein bade shabd neeche se upar ghoomte hain —
            बीज → पौधा → पेड़ → बाग़। (aakhri ruk jaata hai)
            neeche patli line + "0 → 100%" · upar logo aur "उत्तर प्रदेश · 2016 से"
   done:    aakhri shabd hare rang mein, line poori
   exit:    poora parda upar uthta hai, neeche ka kinara gol hota hua — site dikhti hai
   ========================================================= */
export default function CurtainLoader({ phase, lang, counterRef }) {
  const words = LOADER_TEXT.words[lang];

  return (
    <div className={styles.wrap} data-phase={phase}>
      <div className={styles.inner}>
        <header className={styles.top} aria-hidden="true">
          <Logo className={styles.logo} />
          <span className={styles.since}>{LOADER_TEXT.since[lang]}</span>
        </header>

        <div className={styles.words} aria-hidden="true">
          {words.map((w, i) => (
            <span key={w} className={styles.word} style={{ "--i": i }} data-last={i === words.length - 1 ? "true" : "false"}>
              <span>{w}</span>
            </span>
          ))}
        </div>

        <footer className={styles.bottom} aria-hidden="true">
          <span className={styles.label}>{LOADER_TEXT.preparing[lang]}</span>
          <span className={styles.pct} lang="en">
            <span ref={counterRef}>0</span>
            <small>%</small>
          </span>
        </footer>
      </div>
      <span className={styles.bar} aria-hidden="true" />
    </div>
  );
}
