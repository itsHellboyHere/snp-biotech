import { notFound } from "next/navigation";

// Jo URL kisi page se match na ho (jaise /purana-link) → apna 404 (app/[lang]/not-found.js),
// site ke navbar/footer ke saath — Next ka saada safed 404 nahi
export default function CatchAll() {
  notFound();
}
