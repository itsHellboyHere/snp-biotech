"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  CalendarDays,
  Ruler,
  Trees,
  Apple,
  Scale,
  MessageCircle,
  Sprout,
} from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { scriptLang } from "@/i18n/config";
import { whatsappLink } from "@/lib/site";
import Sheet from "../Sheet/Sheet";
import AddControl from "../AddControl/AddControl";
import VarietyPicker from "../VarietyPicker/VarietyPicker";
import QuickQty from "../QuickQty/QuickQty";
import { useOrder, changeVariety } from "../orderStore";
import { useCompare, toggleCompare } from "../compareStore";
import { useMonth } from "../hooks";
import { getVariety, monthsText, seasonInfo, monthName } from "../plantsModel";
import { PT } from "../plantsText";
import styles from "./PlantDetail.module.css";

/* Paudhe ka detail panel — phone pe neeche se sheet, desktop pe side panel
   Photo (फल / पेड़ / असली पौधा) · kism picker · mausam · dooriyan · per acre · order */
export default function PlantDetail({ plant, onClose, onCompareFull }) {
  const { t } = useLang();
  const { items } = useOrder();
  // Chuni hui kism — body (photo badle) aur footer (order) dono ko chahiye.
  // { id } ke saath rakhte hain taaki doosra paudha khule to apne aap reset ho.
  const [pick, setPick] = useState({ id: null, v: null });
  // Default: list mein jo line hai wahi (bina kism wali bhi) · warna pehli kism
  const line = plant ? items.find((it) => it.id === plant.id) : null;
  const variety = plant
    ? pick.id === plant.id
      ? pick.v
      : line
        ? line.variety
        : (plant.varieties[0]?.id ?? null)
    : null;

  // Card se "बिना किस्म" जोड़ा था → यहाँ किस्म चुनी तो वही line उस किस्म की बन जाए (दो line नहीं)
  const chooseVariety = (v) => {
    const generic = items.find(
      (it) => it.id === plant.id && it.variety === null,
    );
    if (
      generic &&
      v &&
      !items.some((it) => it.id === plant.id && it.variety === v)
    ) {
      changeVariety(plant.id, null, v);
    }
    setPick({ id: plant.id, v });
  };

  return (
    <Sheet
      open={Boolean(plant)}
      onClose={onClose}
      label={plant ? t(plant.name) : ""}
      closeLabel={t(PT.close)}
      header={plant ? <DetailHead plant={plant} /> : null}
      footer={
        plant ? (
          <DetailFooter
            plant={plant}
            variety={variety}
            onCompareFull={onCompareFull}
          />
        ) : null
      }
    >
      {plant ? (
        <DetailBody
          key={plant.id}
          plant={plant}
          variety={variety}
          onVariety={chooseVariety}
        />
      ) : null}
    </Sheet>
  );
}

function DetailHead({ plant }) {
  const { other, t } = useLang();
  const name = t(plant.name);
  return (
    <div className={styles.head}>
      <h2 className={styles.title} lang={scriptLang(name)}>
        {name}
      </h2>
      <p className={styles.sub} lang={other}>
        {plant.name[other]}
      </p>
    </div>
  );
}

function DetailBody({ plant, variety, onVariety }) {
  const { lang, t } = useLang();
  const month = useMonth();
  const { items } = useOrder();
  const v = getVariety(plant, variety);
  const isFruit = plant.harvest.length > 0;

  const tabs = [
    {
      id: "shot",
      label: isFruit ? PT.tabFruit : PT.tabLeaf,
      src: v?.img ?? plant.shot,
    },
    plant.tree !== plant.shot
      ? { id: "tree", label: PT.tabTree, src: plant.tree }
      : null,
    ...plant.realPhotos.map((src, i) => ({
      id: `real-${i}`,
      label: PT.tabReal,
      src,
      real: i,
    })),
  ].filter(Boolean);
  const [tab, setTab] = useState("shot");
  const current = tabs.find((x) => x.id === tab) ?? tabs[0];

  const info = seasonInfo(plant, month);
  const others = items.filter(
    (it) => it.id === plant.id && it.variety !== variety,
  );

  const facts = [
    plant.months.length && {
      icon: CalendarDays,
      label: PT.facts.season,
      value: monthsText(plant.months, lang),
    },
    isFruit && {
      icon: Apple,
      label: PT.facts.harvest,
      value: monthsText(plant.harvest, lang),
    },
    plant.spacing && {
      icon: Ruler,
      label: PT.facts.spacing,
      value: PT.meters[lang](...plant.spacing),
    },
    plant.perAcre && {
      icon: Trees,
      label: PT.facts.perAcre,
      value: PT.perAcre[lang](plant.perAcre),
    },
    {
      icon: Sprout,
      label: PT.facts.type,
      value: t(plant.grafted ? PT.typeGrafted : PT.typeSeedling),
    },
  ].filter(Boolean);

  return (
    <div className={styles.body}>
      {/* ---------- Photo ---------- */}
      <div className={styles.media}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={current.src}
            className={styles.frame}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={current.src}
              alt={t(plant.name)}
              fill
              sizes="(min-width: 900px) 430px, 92vw"
              className={styles.img}
              priority
            />
          </motion.div>
        </AnimatePresence>
        {tabs.length > 1 ? (
          <div
            className={styles.tabs}
            role="tablist"
            aria-label={t(PT.photoTabs)}
          >
            {tabs.map((x) => (
              <button
                key={x.id}
                type="button"
                role="tab"
                aria-selected={x.id === current.id}
                className={styles.tab}
                onClick={() => setTab(x.id)}
              >
                {t(x.label)}
                {x.real > 0 ? ` ${x.real + 1}` : ""}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {plant.line ? <p className={styles.line}>{t(plant.line)}</p> : null}

      {info ? (
        <p className={styles.season} data-now={info.now ? "true" : "false"}>
          {info.now
            ? t(PT.inSeason)
            : PT.nextSeason[lang](monthName(info.month, lang), info.inMonths)}
        </p>
      ) : null}

      {plant.varieties.length ? (
        <VarietyPicker
          plant={plant}
          value={variety}
          onChange={(id) => {
            onVariety(id);
            setTab("shot");
          }}
        />
      ) : null}

      <dl className={styles.facts}>
        {facts.map((f) => (
          <div key={f.label.en} className={styles.fact}>
            <dt>
              <f.icon size={15} strokeWidth={2} aria-hidden="true" />
              {t(f.label)}
            </dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>

      {others.length ? (
        <p className={styles.others}>
          <span>{t(PT.inListOther)}</span>{" "}
          {others
            .map(
              (it) =>
                `${it.variety ? t(getVariety(plant, it.variety)?.name) : t(PT.list.anyVariety)} – ${it.qty}`,
            )
            .join(" · ")}
        </p>
      ) : null}

      <p className={styles.note}>{t(PT.note)}</p>
    </div>
  );
}

function DetailFooter({ plant, variety, onCompareFull }) {
  const { lang, t } = useLang();
  const compare = useCompare();
  const v = getVariety(plant, variety);
  const inCompare = compare.includes(plant.id);
  const label = `${t(plant.name)}${v ? ` (${t(v.name)})` : ""}`;

  return (
    <>
      <QuickQty plant={plant} variety={v?.id ?? null} />
      <div className={styles.footer}>
        <div className={styles.main}>
          <AddControl
            plant={plant}
            variety={v?.id ?? null}
            mode="exact"
            size="lg"
          />
        </div>
        <button
          type="button"
          className={styles.iconBtn}
          aria-pressed={inCompare}
          aria-label={t(inCompare ? PT.comparing : PT.compare)}
          title={t(inCompare ? PT.comparing : PT.compare)}
          onClick={() => {
            if (!toggleCompare(plant.id)) onCompareFull?.();
          }}
        >
          <Scale size={19} strokeWidth={2} aria-hidden="true" />
        </button>
        <a
          className={styles.iconBtn}
          href={whatsappLink(PT.askPlant[lang](label))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t(PT.askNow)}
          title={t(PT.askNow)}
        >
          <MessageCircle size={19} strokeWidth={2} aria-hidden="true" />
        </a>
      </div>
    </>
  );
}
