"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, Trash2, X, Sprout } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { scriptLang } from "@/i18n/config";
import { whatsappLink } from "@/lib/site";
import Sheet from "../Sheet/Sheet";
import QtyStepper from "../QtyStepper/QtyStepper";
import { useOrder, setQty, removeItem, setNote, clearOrder, totalOf } from "../orderStore";
import { getPlant, getVariety, buildOrderMessage } from "../plantsModel";
import { PT } from "../plantsText";
import styles from "./OrderSheet.module.css";

const EASE = [0.16, 1, 0.3, 1];

/* "मेरी सूची" — sab paudhe ek jagah, ginti badlo, note likho, ek hi WhatsApp message mein bhejo:
   नमस्ते SNP Biotech! मुझे ये पौधे चाहिए:
   • आम (दशहरी) – 50
   • अमरूद – 30
   कुल: 80 पौधे
   नोट: गाँव रामपुर, अगस्त में चाहिए */
export default function OrderSheet({ open, onClose, onOpenPlant }) {
  const { lang, t } = useLang();
  const { items, note } = useOrder();
  const total = totalOf(items);
  const message = buildOrderMessage(items, note, lang, PT.order[lang] ?? PT.order.hi);

  return (
    <Sheet
      open={open}
      onClose={onClose}
      label={t(PT.list.title)}
      closeLabel={t(PT.close)}
      header={
        <div className={styles.head}>
          <h2 className={styles.title}>{t(PT.list.title)}</h2>
          {items.length ? (
            <p className={styles.meta}>
              {PT.list.kinds[lang](items.length)} · {PT.list.total[lang](total)}
            </p>
          ) : null}
        </div>
      }
      footer={
        items.length ? (
          <div className={styles.footer}>
            <a className={styles.send} href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={20} strokeWidth={2} aria-hidden="true" />
              {t(PT.list.send)}
            </a>
            <p className={styles.price}>{t(PT.list.price)}</p>
          </div>
        ) : null
      }
    >
      {items.length ? (
        <div className={styles.body}>
          <ul className={styles.items}>
            <AnimatePresence initial={false}>
              {items.map((it) => {
                const p = getPlant(it.id);
                if (!p) return null;
                const v = getVariety(p, it.variety);
                const name = t(p.name);
                return (
                  <motion.li
                    key={`${it.id}|${it.variety}`}
                    className={styles.item}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <div className={styles.row}>
                      <button
                        type="button"
                        className={styles.thumb}
                        onClick={() => onOpenPlant(p.id)}
                        aria-label={PT.open[lang](name)}
                      >
                        <Image src={v?.img ?? p.shot} alt="" width={64} height={64} />
                      </button>
                      <div className={styles.info}>
                        <p className={styles.name} lang={scriptLang(name)}>
                          {name}
                        </p>
                        <p className={styles.variety}>{v ? t(v.name) : t(PT.list.anyVariety)}</p>
                      </div>
                      <button
                        type="button"
                        className={styles.remove}
                        onClick={() => removeItem(it.id, it.variety)}
                        aria-label={`${t(PT.remove)} — ${name}`}
                      >
                        <X size={16} strokeWidth={2.2} aria-hidden="true" />
                      </button>
                    </div>
                    <div className={styles.qty}>
                      <QtyStepper value={it.qty} step={p.step} onChange={(n) => setQty(it.id, it.variety, n)} />
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>

          <div className={styles.sum}>
            <span>{t(PT.list.sum)}</span>
            <strong>{PT.list.total[lang](total)}</strong>
          </div>

          <label className={styles.noteBox}>
            <span className={styles.noteLabel}>{t(PT.list.noteLabel)}</span>
            <textarea
              className={styles.note}
              rows={2}
              maxLength={300}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t(PT.list.notePh)}
            />
          </label>

          <button type="button" className={styles.clear} onClick={clearOrder}>
            <Trash2 size={15} strokeWidth={2} aria-hidden="true" />
            {t(PT.list.clear)}
          </button>
        </div>
      ) : (
        <div className={styles.empty}>
          <Sprout size={36} strokeWidth={1.5} aria-hidden="true" />
          <p className={styles.emptyTitle}>{t(PT.list.emptyTitle)}</p>
          <p>{t(PT.list.emptyLine)}</p>
        </div>
      )}
    </Sheet>
  );
}
