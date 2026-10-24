// Google ke liye structured data ka <script> — ek page ka saara data ek "@graph" mein
// <JsonLd data={[website, business, breadcrumb]} />
// "<" escape — data mein kabhi kuch ajeeb aaye to bhi script tag na toote
export default function JsonLd({ data }) {
  const list = (Array.isArray(data) ? data : [data]).filter(Boolean);
  if (!list.length) return null;
  const json = { "@context": "https://schema.org", "@graph": list };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }} />
  );
}
