"use client";

import Image from "next/image";
import { cldLoader, isCld } from "@/lib/cloudinary";

/* =========================================================
   next/image jaisa hi — bas ek farak:
   - Photo Cloudinary pe hai (lib/cloudinary/manifest.json) → Cloudinary se,
     har screen ke liye sahi size + format (Vercel ki image limit bachti hai)
   - Nahi hai → normal next/image (Vercel optimise karta hai)
   Use:  import Image from "@/components/media/SmartImage";  — baaki sab same
   ========================================================= */
export default function SmartImage({ alt, ...props }) {
  if (typeof props.src === "string" && isCld(props.src)) return <Image alt={alt} {...props} loader={cldLoader} />;
  return <Image alt={alt} {...props} />;
}
