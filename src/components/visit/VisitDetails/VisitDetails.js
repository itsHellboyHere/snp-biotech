import HowToReach from "../HowToReach/HowToReach";
import HoursCard from "../HoursCard/HoursCard";
import styles from "./VisitDetails.module.css";

// "रास्ते की पहचान" + "खुलने का समय" — desktop pe aamne-saamne, phone pe ek ke neeche ek
export default function VisitDetails() {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.grid}`}>
        <HowToReach />
        <HoursCard />
      </div>
    </section>
  );
}
