"use client";

import Image from "next/image";
import { ArrowRight, Check, MessageCircle, PhoneCall, Sprout, Truck, Wallet } from "lucide-react";
import LocaleLink from "@/i18n/LocaleLink";
import { useLang } from "@/i18n/LangProvider";
import { whatsappLink } from "@/lib/site";
import { useOrder, totalOf } from "@/components/plants/orderStore";
import { buildOrderMessage, getPlant, getVariety } from "@/components/plants/plantsModel";
import { PT } from "@/components/plants/plantsText";
import SampleTag from "../SampleTag/SampleTag";
import { FACILITIES } from "../visitData";
import { isLive } from "../visitModel";
import { VT } from "../visitText";
import styles from "./BeforeYouCome.module.css";

const ICONS = { truck: Truck, wallet: Wallet, sprout: Sprout };

/* "आने से पहले" — kaam ki baatein + Plants page ki "मेरी सूची" yahan bhi
   Suchi hai → "आने से पहले WhatsApp कर दें — पौधे अलग करके रखे मिलेंगे"
   Suchi nahi → "पौधे पहले से चुन लें" → Plants page */
export default function BeforeYouCome() {
  const { lang, t } = useLang();
  const { items, note } = useOrder();
  const total = totalOf(items);
  const facilities = isLive(FACILITIES) ? (FACILITIES.items ?? []).filter((f) => f.show && f.text) : [];

  // Suchi ke saath "मैं ये पौधे लेने नर्सरी आऊँगा" bhi jud jaata hai
  const visitNote = [note?.trim(), VT.before.listNote[lang]].filter(Boolean).join(" · ");
  const message = items.length ? buildOrderMessage(items, visitNote, lang, PT.order[lang] ?? PT.order.hi) : null;

  const thumbs = items.slice(0, 4).map((it) => {
    const p = getPlant(it.id);
    return { key: `${it.id}|${it.variety}`, src: getVariety(p, it.variety)?.img ?? p?.shot };
  });

  return (
    <section className={styles.section} aria-labelledby="before-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.tips}>
          <h2 id="before-title" className="h2">
            {t(VT.before.title)}
          </h2>
          <ul className={styles.list}>
            <li>
              <span className={styles.icon}>
                <PhoneCall size={18} strokeWidth={2} aria-hidden="true" />
              </span>
              {t(VT.before.bulk)}
            </li>
            {facilities.map((f) => {
              const Icon = ICONS[f.icon] ?? Check;
              return (
                <li key={f.id}>
                  <span className={styles.icon}>
                    <Icon size={18} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <span>
                    {t(f.text)} <SampleTag block={FACILITIES} />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ---------- Meri suchi ---------- */}
        <div className={styles.listCard} data-empty={items.length ? "false" : "true"}>
          {items.length ? (
            <>
              <div className={styles.thumbs} aria-hidden="true">
                {thumbs.map((x) =>
                  x.src ? (
                    <span key={x.key} className={styles.thumb}>
                      <Image src={x.src} alt="" width={56} height={56} />
                    </span>
                  ) : null
                )}
              </div>
              <h3 className={`h3 ${styles.listTitle}`}>{t(VT.before.listTitle)}</h3>
              <p className={styles.meta}>{VT.before.listMeta[lang](items.length, total)}</p>
              <p className={styles.listLine}>{t(VT.before.listLine)}</p>
              <a href={whatsappLink(message)} className={styles.send} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
                {t(VT.before.listSend)}
              </a>
            </>
          ) : (
            <>
              <span className={styles.emptyIcon} aria-hidden="true">
                <Sprout size={26} strokeWidth={1.8} />
              </span>
              <h3 className={`h3 ${styles.listTitle}`}>{t(VT.before.emptyTitle)}</h3>
              <p className={styles.listLine}>{t(VT.before.emptyLine)}</p>
              <LocaleLink href="/plants" className={styles.send}>
                {t(VT.before.emptyCta)}
                <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
              </LocaleLink>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
