"use client";

import { useRef, useState } from "react";
import Image from "@/components/media/SmartImage";
import { CalendarDays, Scale } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { scriptLang } from "@/i18n/config";
import AddControl from "../AddControl/AddControl";
import { useCompare, toggleCompare } from "../compareStore";
import { useMonth } from "../hooks";
import { monthsText, seasonInfo } from "../plantsModel";
import { PT } from "../plantsText";
import styles from "./PlantCard.module.css";

const SIZES = "(min-width: 1180px) 290px, (min-width: 760px) 31vw, 47vw";

/* Ek paudha — Apple Store jaisa saaf card
   - Ivory "product" photo; desktop pe hover → asli pedh ki photo dheere se ubharti hai
   - Card pe kahin bhi tap → detail panel (sirf + / − / tulna button alag kaam karte hain) */
export default function PlantCard({ plant, onOpen, onCompareFull, priority = false }) {
  const { lang, other, t } = useLang();
  const month = useMonth();
  const compare = useCompare();
  const mediaRef = useRef(null);
  const [peek, setPeek] = useState(false); // pedh ki photo tabhi load ho jab mouse aaye
  const [treeReady, setTreeReady] = useState(false);

  const name = t(plant.name);
  const inCompare = compare.includes(plant.id);
  const now = seasonInfo(plant, month)?.now;
  const nVar = plant.varieties.length;

  return (
    <article
      className={styles.card}
      onPointerEnter={(e) => e.pointerType === "mouse" && setPeek(true)}
      data-tree={treeReady ? "ready" : "no"}
    >
      <div ref={mediaRef} className={styles.media}>
        <Image src={plant.shot} alt="" fill sizes={SIZES} className={styles.shot} priority={priority} />
        {peek && plant.tree !== plant.shot ? (
          <Image src={plant.tree} alt="" fill sizes={SIZES} className={styles.tree} onLoad={() => setTreeReady(true)} />
        ) : null}

        <div className={styles.tags}>
          {plant.grafted ? <span className={styles.tag}>{t(PT.grafted)}</span> : null}
          {now ? <span className={`${styles.tag} ${styles.now}`}>{t(PT.picks.now)}</span> : null}
        </div>

        <button
          type="button"
          className={styles.cmp}
          aria-pressed={inCompare}
          aria-label={`${t(inCompare ? PT.comparing : PT.compare)} — ${name}`}
          title={t(inCompare ? PT.comparing : PT.compare)}
          onClick={() => {
            if (!toggleCompare(plant.id)) onCompareFull?.();
          }}
        >
          <Scale size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name} lang={scriptLang(name)}>
          {/* ::after poore card ko clickable banata hai */}
          <button type="button" className={styles.open} onClick={() => onOpen(plant.id)} aria-label={PT.open[lang](name)}>
            {name}
          </button>
        </h3>
        <p className={styles.sub}>
          <span lang={other}>{plant.name[other]}</span>
          {nVar ? <span> · {PT.varietiesN[lang](nVar)}</span> : null}
        </p>
        {plant.months.length ? (
          <p className={styles.season}>
            <CalendarDays size={14} strokeWidth={2} aria-hidden="true" />
            <span>
              {t(PT.plantIn)}: {monthsText(plant.months, lang, { short: true })}
            </span>
          </p>
        ) : null}
        <div className={styles.action}>
          <AddControl plant={plant} flyFrom={mediaRef} onMulti={() => onOpen(plant.id)} />
        </div>
      </div>
    </article>
  );
}
