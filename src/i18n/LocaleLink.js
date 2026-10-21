"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { useLang } from "./LangProvider";
import { localize } from "./config";

// Next Link jaisa hi — bas href apne aap current language ka ho jaata hai.
// <LocaleLink href="/plants">  →  Hindi pe /plants, English pe /en/plants
const LocaleLink = forwardRef(function LocaleLink({ href, ...props }, ref) {
  const { lang } = useLang();
  return <Link ref={ref} href={localize(lang, href)} {...props} />;
});

export default LocaleLink;
