"use client";

import { createContext, useContext, useMemo } from "react";
import { DEFAULT_LOCALE, otherLocale, tr } from "./config";

// Har client component ko pata rahe abhi kaunsi language hai — bina props pass kiye
const LangContext = createContext({ lang: DEFAULT_LOCALE, other: "en", t: (v) => tr(v, DEFAULT_LOCALE) });

export function LangProvider({ lang, children }) {
  const value = useMemo(() => ({ lang, other: otherLocale(lang), t: (v) => tr(v, lang) }), [lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

// const { lang, other, t } = useLang();  →  t({ hi: "आम", en: "Mango" })
export function useLang() {
  return useContext(LangContext);
}
