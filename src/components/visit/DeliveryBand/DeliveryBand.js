"use client";

import Image from "@/components/media/SmartImage";
import { MessageCircle } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { whatsappLink } from "@/lib/site";
import SampleTag from "../SampleTag/SampleTag";
import { DELIVERY } from "../visitData";
import { isLive } from "../visitModel";
import { VT } from "../visitText";
import styles from "./DeliveryBand.module.css";

// "आ नहीं सकते? हम पौधे भेजते हैं।" — sirf tab jab client delivery karta ho (DELIVERY.show)
export default function DeliveryBand() {
  const { lang, t } = useLang();
  if (!DELIVERY.show || !isLive(DELIVERY)) return null;

  return (
    <section className={styles.section} aria-labelledby="delivery-title">
      <div className="container">
        <div className={styles.card}>
          {DELIVERY.img?.src ? (
            <Image
              src={DELIVERY.img.src}
              alt=""
              fill
              sizes="(min-width: 1320px) 1220px, 100vw"
              className={styles.img}
            />
          ) : null}
          <div className={styles.shade} aria-hidden="true" />
          <div className={styles.copy}>
            <SampleTag block={DELIVERY} />
            <h2 id="delivery-title" className={`h1 ${styles.title}`}>
              {t(VT.delivery.title)}
            </h2>
            <p className={styles.line}>{VT.delivery.line[lang](t(DELIVERY.area), t(DELIVERY.min))}</p>
            <a
              href={whatsappLink(VT.delivery.msg[lang])}
              className={styles.cta}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
              {t(VT.delivery.cta)}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
