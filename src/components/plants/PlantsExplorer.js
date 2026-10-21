"use client";

import { Suspense, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/i18n/LangProvider";
import PlantsHeader from "./PlantsHeader/PlantsHeader";
import SeasonPicks from "./SeasonPicks/SeasonPicks";
import CategoryChips from "./CategoryChips/CategoryChips";
import PlantGrid from "./PlantGrid/PlantGrid";
import PlantDetail from "./PlantDetail/PlantDetail";
import CompareSheet from "./CompareSheet/CompareSheet";
import OrderSheet from "./OrderSheet/OrderSheet";
import Dock from "./Dock/Dock";
import { usePlantsUrl } from "./hooks";
import { PLANTS, filterPlants, getPlant } from "./plantsModel";
import { PT } from "./plantsText";
import styles from "./PlantsExplorer.module.css";

/* =========================================================
   Plants page ka "dimaag" — saare hisse yahan jud ke kaam karte hain
   URL (?cat= / ?plant=) = filter + khula paudha · search · sheets · dock
   ========================================================= */

// Build ke waqt (static HTML) URL nahi hota — tab "sab paudhe" dikhao (Google ko poori list milti hai)
const STATIC_URL = { cat: "all", plantId: null, legacy: false, update: () => {} };

export default function PlantsExplorer() {
  return (
    <Suspense fallback={<Catalogue url={STATIC_URL} />}>
      <WithUrl />
    </Suspense>
  );
}

function WithUrl() {
  return <Catalogue url={usePlantsUrl()} />;
}

function Catalogue({ url }) {
  const { t } = useLang();
  const { cat, plantId, legacy, update } = url;
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query); // likhte waqt typing atke nahi
  const [sheet, setSheet] = useState(null); // "list" | "compare" | null
  const [toast, setToast] = useState(null);
  const pushed = useRef(false);
  const catalogueRef = useRef(null);

  const plants = useMemo(() => filterPlants(PLANTS, { category: cat, query: q }), [cat, q]);
  const plant = getPlant(plantId);

  // Browser "Back" se panel band hua → ab hamara push nahi bacha
  useEffect(() => {
    if (!plantId) pushed.current = false;
  }, [plantId]);

  const openPlant = useCallback(
    (id) => {
      setSheet(null);
      if (plantId === id) return;
      update({ plant: id }, { push: !plantId });
      if (!plantId) pushed.current = true;
    },
    [update, plantId]
  );

  const closePlant = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    } else {
      update({ plant: null, ...(legacy ? { cat: null } : {}) });
    }
  }, [update, legacy]);

  const setCategory = useCallback(
    (id) => {
      update({ cat: id });
      // Chips upar chipke hon to grid ki shuruaat pe le jao (nayi list upar se dikhe)
      const el = catalogueRef.current;
      if (el && el.getBoundingClientRect().top < 0) {
        if (window.__lenis) window.__lenis.scrollTo(el, { offset: -64, duration: 0.9 });
        else el.scrollIntoView({ behavior: "smooth" });
      }
    },
    [update]
  );

  const showFull = useCallback(() => setToast(Date.now()), []);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(id);
  }, [toast]);

  const closeSheet = useCallback(() => setSheet(null), []);

  return (
    <>
      <PlantsHeader
        query={query}
        onQuery={(v) => {
          setQuery(v);
          // Search poori list mein ho — category filter laga ho to hata do
          if (v && cat !== "all") update({ cat: null });
        }}
      />

      {/* Kuch khoj rahe hain to carousel hata do — nateeje seedha search ke neeche */}
      {query ? null : <SeasonPicks onOpen={openPlant} />}

      <section id="catalogue" ref={catalogueRef} className={styles.catalogue} aria-labelledby="catalogue-title">
        <h2 id="catalogue-title" className="sr-only">
          {t(PT.gridTitle)}
        </h2>
        <CategoryChips value={cat} onChange={setCategory} resultCount={plants.length} />
        <div className={`container ${styles.grid}`}>
          <PlantGrid
            plants={plants}
            query={q}
            onOpen={openPlant}
            onCompareFull={showFull}
            onReset={() => {
              setQuery("");
              update({ cat: null });
            }}
          />
        </div>
      </section>

      <PlantDetail plant={plant} onClose={closePlant} onCompareFull={showFull} />
      <CompareSheet open={sheet === "compare"} onClose={closeSheet} onOpenPlant={openPlant} />
      <OrderSheet open={sheet === "list"} onClose={closeSheet} onOpenPlant={openPlant} />
      <Dock
        hidden={Boolean(plant) || Boolean(sheet)}
        onOpenList={() => setSheet("list")}
        onOpenCompare={() => setSheet("compare")}
      />

      <AnimatePresence>
        {toast ? (
          <motion.p
            key={toast}
            className={styles.toast}
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {t(PT.compareFull)}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </>
  );
}
