"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { whatsappLink } from "@/lib/site";
import { PLANNER, SIZES, FRUITS } from "../plannerData";
import styles from "./BaghPlanner.module.css";

/* =========================================================
   बाग़ planner — ज़मीन + पौधा chuno → upar se dikhta khet,
   jisme paudhe apni jagah "ugte" hain + lagbhag ginti + WhatsApp
   ========================================================= */

const nf = new Intl.NumberFormat("en-IN");

// Khet ke andar paudhon ki kataarein: ginti + khet ka aakaar → columns/rows
function layout(count, aspect) {
  const cols = Math.max(1, Math.round(Math.sqrt(count * aspect)));
  const rows = Math.ceil(count / cols);
  return { cols, rows };
}

export default function BaghPlanner() {
  const { lang, t } = useLang();
  const [sizeId, setSizeId] = useState("acre");
  const [fruitId, setFruitId] = useState("mango");
  // Paudhe tabhi "ugein" jab khet screen pe aaye (pehle se ug ke na baithe hon)
  const fieldRef = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(fieldRef.current);
    return () => io.disconnect();
  }, []);

  const size = SIZES.find((s) => s.id === sizeId);
  const fruit = FRUITS.find((f) => f.id === fruitId);
  const count = fruit.count[size.id];
  const { cols, rows } = useMemo(() => layout(count, size.aspect), [count, size.aspect]);

  const message = PLANNER.message[lang](t(size.msg), count, t(fruit.name));

  return (
    <section className={styles.section} data-theme="light" aria-labelledby="planner-title">
      <div className="container">
        <header className={styles.head}>
          <p className="eyebrow">{t(PLANNER.eyebrow)}</p>
          <h2 id="planner-title" className={`display ${styles.title}`}>
            {t(PLANNER.title)}
          </h2>
          <p className={styles.line}>{t(PLANNER.line)}</p>
        </header>

        {/* ---------- Chunav ---------- */}
        <div className={styles.controls}>
          <div className={styles.group}>
            <span className={styles.groupLabel}>{t(PLANNER.sizeLabel)}</span>
            <div className={styles.segment} role="radiogroup" aria-label={t(PLANNER.sizeLabel)}>
              <span
                className={styles.segmentThumb}
                style={{ "--i": SIZES.findIndex((s) => s.id === sizeId), "--n": SIZES.length }}
                aria-hidden="true"
              />
              {SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={s.id === sizeId}
                  className={styles.segmentBtn}
                  data-on={s.id === sizeId ? "true" : "false"}
                  onClick={() => setSizeId(s.id)}
                >
                  {t(s.label)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.group}>
            <span className={styles.groupLabel}>{t(PLANNER.fruitLabel)}</span>
            <div className={styles.chips} role="radiogroup" aria-label={t(PLANNER.fruitLabel)}>
              {FRUITS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={f.id === fruitId}
                  className={styles.chip}
                  data-on={f.id === fruitId ? "true" : "false"}
                  onClick={() => setFruitId(f.id)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- chhota pehle se optimised webp */}
                  <img src={f.tree} alt="" className={styles.chipTree} width="28" height="28" loading="lazy" />
                  {t(f.label)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- Khet + jaankari ---------- */}
        <div className={styles.stage}>
          <div ref={fieldRef} className={styles.fieldWrap} data-seen={seen ? "true" : "false"}>
            <div
              className={styles.field}
              style={{ "--scale": size.scale, "--aspect": size.aspect }}
              aria-hidden="true"
            >
              <span className={styles.fieldTag}>{t(size.tag)}</span>
              {/* key badalte hi paudhe dobara "ugte" hain */}
              <div
                key={`${fruit.id}-${size.id}`}
                className={styles.trees}
                style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
              >
                {Array.from({ length: count }, (_, i) => (
                  <span
                    key={i}
                    className={styles.tree}
                    style={{ "--d": `${Math.round((i / count) * 520 + ((i * 37) % 7) * 18)}ms` }}
                  >
                    {/* Plain img: ek hi chhoti webp 100+ baar — next/image yahan bhaari padta */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={fruit.tree} alt="" draggable={false} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <aside className={styles.panel} aria-live="polite">
            <p className={styles.about}>{t(PLANNER.about)}</p>
            <p className={styles.count} lang="en">
              {nf.format(count)}
            </p>
            <p className={styles.what}>{PLANNER.plantsOf[lang](t(fruit.label))}</p>
            <dl className={styles.facts}>
              <div>
                <dt>{t(PLANNER.sizeLabel)}</dt>
                <dd>{t(size.label)}</dd>
              </div>
              <div>
                <dt>{t(PLANNER.spacingLabel)}</dt>
                <dd>{t(fruit.spacing)}</dd>
              </div>
            </dl>
            <p className={styles.note}>{t(PLANNER.note)}</p>
            <a href={whatsappLink(message)} className={styles.cta} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
              {t(PLANNER.cta)}
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
