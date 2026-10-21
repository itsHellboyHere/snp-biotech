"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { scriptLang } from "@/i18n/config";
import Sheet from "../Sheet/Sheet";
import AddControl from "../AddControl/AddControl";
import { useCompare, toggleCompare, clearCompare } from "../compareStore";
import { getPlant, monthsText } from "../plantsModel";
import { PT } from "../plantsText";
import styles from "./CompareSheet.module.css";

/* MacBook ka "Compare models" — 2-3 paudhe aamne-saamne
   Har row: upar chhota label, neeche har paudhe ki value (phone pe bhi saaf padhne mein aata hai) */
export default function CompareSheet({ open, onClose, onOpenPlant }) {
  const { lang, t } = useLang();
  const ids = useCompare();
  const plants = ids.map(getPlant).filter(Boolean);
  const cols = { "--cols": Math.max(plants.length, 2) };
  const dash = t(PT.none);

  const rows = [
    { label: PT.facts.season, get: (p) => monthsText(p.months, lang) ?? dash },
    { label: PT.facts.harvest, get: (p) => monthsText(p.harvest, lang) ?? dash },
    { label: PT.facts.spacing, get: (p) => (p.spacing ? PT.meters[lang](...p.spacing) : dash) },
    { label: PT.facts.perAcre, get: (p) => (p.perAcre ? PT.perAcre[lang](p.perAcre) : dash) },
    { label: PT.facts.type, get: (p) => t(p.grafted ? PT.typeGrafted : PT.typeSeedling) },
    {
      label: PT.facts.varieties,
      get: (p) => (p.varieties.length ? p.varieties.map((v) => t(v.name)).join(", ") : dash),
    },
  ];

  return (
    <Sheet
      open={open}
      onClose={onClose}
      variant="modal"
      label={t(PT.cmp.title)}
      closeLabel={t(PT.close)}
      header={<h2 className={styles.title}>{t(PT.cmp.title)}</h2>}
      footer={
        plants.length ? (
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.clear}
              onClick={() => {
                clearCompare();
                onClose();
              }}
            >
              {t(PT.cmp.clear)}
            </button>
          </div>
        ) : null
      }
    >
      <div className={styles.table}>
        {/* Paudhe */}
        <div className={styles.plants} style={cols}>
          {plants.map((p) => {
            const name = t(p.name);
            return (
              <div key={p.id} className={styles.plant}>
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => toggleCompare(p.id)}
                  aria-label={PT.cmp.removeOne[lang](name)}
                >
                  <X size={14} strokeWidth={2.4} aria-hidden="true" />
                </button>
                <button type="button" className={styles.photo} onClick={() => onOpenPlant(p.id)} aria-label={PT.open[lang](name)}>
                  <Image src={p.shot} alt="" fill sizes="(min-width: 900px) 260px, 30vw" className={styles.img} />
                </button>
                <p className={styles.name} lang={scriptLang(name)}>
                  {name}
                </p>
                <div className={styles.add}>
                  <AddControl plant={p} onMulti={() => onOpenPlant(p.id)} />
                </div>
              </div>
            );
          })}
          {plants.length < 2 ? (
            <button type="button" className={styles.more} onClick={onClose}>
              {t(PT.cmp.add)}
              <span>{t(PT.cmp.hint)}</span>
            </button>
          ) : null}
        </div>

        {/* Jaankari */}
        {rows.map((r) => (
          <div key={r.label.en} className={styles.row}>
            <p className={styles.label}>{t(r.label)}</p>
            <div className={styles.values} style={cols}>
              {plants.map((p) => (
                <p key={p.id} className={styles.value}>
                  {r.get(p)}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Sheet>
  );
}
