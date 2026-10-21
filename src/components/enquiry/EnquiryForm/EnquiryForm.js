"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, CheckCircle2, MessageCircle, Phone, RotateCcw, Send } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { callLink, whatsappLink } from "@/lib/site";
import { ENQUIRY_TYPES, LIMITS, validateEnquiry } from "@/lib/enquiry/validate";
import { useOrder, totalOf } from "@/components/plants/orderStore";
import { orderLines } from "@/components/plants/plantsModel";
import { useHydrated } from "@/components/plants/hooks";
import { ET } from "../enquiryText";
import styles from "./EnquiryForm.module.css";

const EASE = [0.16, 1, 0.3, 1];
const EMPTY = { name: "", phone: "", place: "", type: "visit", date: "", message: "" };
const todayIST = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

/* =========================================================
   Puchhtachh form → /api/enquiry → client ki Gmail (Resend)
   - Galti turant dikhti hai (wahi jaanch jo server pe hoti hai)
   - Bot se bachaav: chhupa field + "itni jaldi bhara?" check + server pe limit
   - Kuch bhi fail ho → wahi sab likha hua WhatsApp ka button (koi puchhtachh nahi khoti)
   - "मेरी सूची" ho to saath bhej sakte hain
   ========================================================= */
export default function EnquiryForm({ defaultType = "visit" }) {
  const { lang, t } = useLang();
  const uid = useId();
  const hydrated = useHydrated();
  const { items } = useOrder();
  const [values, setValues] = useState({ ...EMPTY, type: defaultType });
  const [withList, setWithList] = useState(true);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done | fail | rate
  const [sentName, setSentName] = useState("");
  const startedRef = useRef(null); // pehli baar kab chhua (bot jaal)
  const idRef = useRef(null); // ek submission = ek id (retry pe dobara email nahi)
  const honeyRef = useRef(null);
  const formRef = useRef(null);

  const hasList = items.length > 0;
  const sendList = hasList && withList;
  const set = (k) => (e) => {
    const v = e.target.value;
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const errText = (field) => {
    const code = errors[field];
    return code ? t(ET.errors[field]?.[code] ?? ET.errors.name.required) : null;
  };

  // WhatsApp wala rasta — form mein jo likha, wahi
  const waMessage = () => {
    const typeLabel = t(ET.types[values.type]);
    const base = ET.wa[lang]({ ...values, typeLabel });
    return sendList ? `${base}\n\n${orderLines(items, lang).join("\n")}` : base;
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...values, withList: sendList, items: sendList ? items : [], lang };
    const v = validateEnquiry(payload);
    if (!v.ok) {
      setErrors(v.errors);
      const first = ["name", "phone", "date", "message"].find((f) => v.errors[f]);
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    idRef.current ??= typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          id: idRef.current,
          startedAt: startedRef.current,
          page: window.location.pathname,
          company: honeyRef.current?.value ?? "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setSentName(v.data.name);
        setStatus("done");
        setValues({ ...EMPTY, type: defaultType });
        idRef.current = null;
        startedRef.current = null;
      } else if (res.status === 429) {
        setStatus("rate");
      } else if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
      } else {
        setStatus("fail");
      }
    } catch {
      setStatus("fail");
    }
  };

  const id = (f) => `${uid}-${f}`;

  return (
    <section className={styles.section} aria-labelledby={id("title")}>
      <div className="container">
        <div className={styles.card}>
          {/* ---------- Baayein: kya aur kyun ---------- */}
          <div className={styles.intro}>
            <p className={`eyebrow ${styles.eyebrow}`}>{t(ET.eyebrow)}</p>
            <h2 id={id("title")} className={`h2 ${styles.title}`}>
              {t(ET.title)}
            </h2>
            <p className={styles.line}>{t(ET.line)}</p>
            <ul className={styles.points}>
              {ET.points.map((p, i) => (
                <li key={i}>
                  <Check size={16} strokeWidth={2.6} aria-hidden="true" />
                  {t(p)}
                </li>
              ))}
            </ul>
            <div className={styles.direct}>
              <span className={styles.directLabel}>{t(ET.direct)}</span>
              <a href={callLink()} className={styles.directBtn}>
                <Phone size={16} strokeWidth={2} aria-hidden="true" />
                {t(ET.call)}
              </a>
              <a href={whatsappLink(waMessage())} className={styles.directBtn} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />
                WhatsApp
              </a>
            </div>
          </div>

          {/* ---------- Daayein: form / jawab ---------- */}
          <div className={styles.panel}>
            <AnimatePresence mode="wait" initial={false}>
              {status === "done" ? (
                <motion.div
                  key="done"
                  className={styles.done}
                  role="status"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <CheckCircle2 size={44} strokeWidth={1.6} aria-hidden="true" />
                  <h3 className="h3">{t(ET.done.title)}</h3>
                  <p>{ET.done.line[lang](sentName)}</p>
                  <button type="button" className={styles.ghost} onClick={() => setStatus("idle")}>
                    {t(ET.done.again)}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  className={styles.form}
                  onSubmit={submit}
                  onFocusCapture={() => {
                    startedRef.current ??= Date.now();
                  }}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Bot jaal — insaan ko dikhta hi nahi */}
                  <div className={styles.honey} aria-hidden="true">
                    <label>
                      Company
                      <input ref={honeyRef} type="text" name="company" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>

                  <div className={styles.row2}>
                    <Field id={id("name")} label={t(ET.name)} error={errText("name")}>
                      <input
                        id={id("name")}
                        name="name"
                        className={styles.input}
                        value={values.name}
                        onChange={set("name")}
                        placeholder={t(ET.namePh)}
                        autoComplete="name"
                        maxLength={LIMITS.name + 5}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? id("name-err") : undefined}
                        required
                      />
                    </Field>
                    <Field id={id("phone")} label={t(ET.phone)} error={errText("phone")}>
                      <div className={styles.phoneWrap}>
                        <span className={styles.prefix} lang="en">
                          +91
                        </span>
                        <input
                          id={id("phone")}
                          name="phone"
                          className={`${styles.input} ${styles.phone}`}
                          value={values.phone}
                          onChange={set("phone")}
                          placeholder={t(ET.phonePh)}
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          maxLength={16}
                          aria-invalid={Boolean(errors.phone)}
                          aria-describedby={errors.phone ? id("phone-err") : undefined}
                          required
                          lang="en"
                        />
                      </div>
                    </Field>
                  </div>

                  <Field id={id("place")} label={t(ET.place)} hint={t(ET.optional)}>
                    <input
                      id={id("place")}
                      name="place"
                      className={styles.input}
                      value={values.place}
                      onChange={set("place")}
                      placeholder={t(ET.placePh)}
                      autoComplete="address-level2"
                      maxLength={LIMITS.place}
                    />
                  </Field>

                  <fieldset className={styles.types}>
                    <legend className={styles.label}>{t(ET.type)}</legend>
                    <div className={styles.chips}>
                      {ENQUIRY_TYPES.map((tp) => (
                        <label key={tp} className={styles.chip} data-on={values.type === tp ? "true" : "false"}>
                          <input
                            type="radio"
                            name="type"
                            value={tp}
                            checked={values.type === tp}
                            onChange={set("type")}
                            className="sr-only"
                          />
                          {t(ET.types[tp])}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {values.type === "visit" ? (
                    <Field id={id("date")} label={t(ET.date)} hint={t(ET.optional)} error={errText("date")}>
                      <input
                        id={id("date")}
                        name="date"
                        type="date"
                        className={styles.input}
                        value={values.date}
                        onChange={set("date")}
                        min={hydrated ? todayIST() : undefined}
                        aria-invalid={Boolean(errors.date)}
                      />
                    </Field>
                  ) : null}

                  <Field id={id("message")} label={t(ET.message)} hint={t(ET.optional)} error={errText("message")}>
                    <textarea
                      id={id("message")}
                      name="message"
                      className={`${styles.input} ${styles.textarea}`}
                      value={values.message}
                      onChange={set("message")}
                      placeholder={t(ET.messagePh)}
                      rows={3}
                      maxLength={LIMITS.message + 20}
                      aria-invalid={Boolean(errors.message)}
                    />
                  </Field>

                  {hasList ? (
                    <label className={styles.check}>
                      <input type="checkbox" checked={withList} onChange={(e) => setWithList(e.target.checked)} />
                      <span>{ET.withList[lang](items.length, totalOf(items))}</span>
                    </label>
                  ) : null}

                  {status === "fail" || status === "rate" ? (
                    <div className={styles.fail} role="alert">
                      <strong>{t(ET.fail.title)}</strong>
                      <p>{t(status === "rate" ? ET.fail.rate : ET.fail.line)}</p>
                      <div className={styles.failActions}>
                        <a href={whatsappLink(waMessage())} className={styles.wa} target="_blank" rel="noopener noreferrer">
                          <MessageCircle size={17} strokeWidth={2} aria-hidden="true" />
                          {t(ET.fail.whatsapp)}
                        </a>
                        <button type="submit" className={styles.ghost}>
                          <RotateCcw size={15} strokeWidth={2} aria-hidden="true" />
                          {t(ET.fail.retry)}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button type="submit" className={styles.submit} disabled={status === "sending"}>
                      {status === "sending" ? t(ET.sending) : t(ET.submit)}
                      <Send size={17} strokeWidth={2.2} aria-hidden="true" />
                    </button>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// Label + input + galti ka sandesh — ek jaisa har jagah
function Field({ id, label, hint, error, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {hint ? <span className={styles.hint}> · {hint}</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
