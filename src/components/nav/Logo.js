import {
  MARK_VIEWBOX,
  MARK_PATHS,
  WORD_VIEWBOX,
  WORD_SNP,
  WORD_BIOTECH,
  WORD_BIOTECH_SHIFT,
  TAGLINE,
  FULL_VIEWBOX,
  FULL_VIEWBOX_NO_TAG,
} from "@/components/brand/brandData";

/* =========================================================
   SNP Biotech logo — bilkul Canva wala design:
   patte "SNP" aur "BIOTECH" ke beech se ugte hain, tana BIOTECH ke "I" pe rukta hai.
   - Patte hamesha brand ke hare (#4cab14) mein
   - Text ka rang = CSS `color` (currentColor) → light pe gehra hara, dark pe safed
   ========================================================= */

const Leaves = () =>
  MARK_PATHS.map((p, i) => <path key={i} fill={p.fill} d={p.d} />);

// Pura logo · tagline={false} → navbar jaisi chhoti jagah ke liye
export default function Logo({ className = "", tagline = false, title = "SNP Biotech" }) {
  return (
    <svg
      className={className}
      viewBox={tagline ? FULL_VIEWBOX : FULL_VIEWBOX_NO_TAG}
      role="img"
      aria-label={tagline ? `${title} — Your trusted plant nursery` : title}
      focusable="false"
    >
      {/* Canva jaisa hi kram: SNP → patte → BIOTECH → tagline */}
      <g fill="currentColor">
        {WORD_SNP.map((d, i) => (
          <path key={`s${i}`} d={d} />
        ))}
      </g>
      <Leaves />
      <g fill="currentColor">
        {WORD_BIOTECH.map((d, i) => (
          <path key={`b${i}`} d={d} />
        ))}
        {tagline
          ? TAGLINE.map((d, i) => (
              <path key={`t${i}`} d={d} />
            ))
          : null}
      </g>
    </svg>
  );
}

// Sirf do patte — favicon jaisi chhoti jagah
export function LogoMark({ className = "" }) {
  return (
    <svg className={className} viewBox={MARK_VIEWBOX} aria-hidden="true" focusable="false">
      <Leaves />
    </svg>
  );
}

// "SNP BIOTECH" ek line mein — sirf sajavat ke liye (footer ka bada naam)
export function LogoWord({ className = "" }) {
  return (
    <svg className={className} viewBox={WORD_VIEWBOX} aria-hidden="true" focusable="false">
      <g fill="currentColor">
        {WORD_SNP.map((d, i) => (
          <path key={`s${i}`} d={d} />
        ))}
        <g transform={WORD_BIOTECH_SHIFT}>
          {WORD_BIOTECH.map((d, i) => (
            <path key={`b${i}`} d={d} />
          ))}
        </g>
      </g>
    </svg>
  );
}
