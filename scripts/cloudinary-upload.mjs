#!/usr/bin/env node
// =========================================================
// Zaroori files Cloudinary pe upload — `npm run media:upload`
//
// - List: src/lib/cloudinary/assets.mjs (sirf wahi jaata hai, poora public/ nahi)
// - Key: .env / .env.local ka CLOUDINARY_URL (cloudinary://KEY:SECRET@CLOUD) — kabhi print nahi hoti
// - Jo file pehle upload ho chuki aur badli nahi (md5 same) → chhod deta hai
// - `npm run media:upload -- --force` → sab dobara
// - Aakhir mein src/lib/cloudinary/manifest.json likhta hai → site apne aap Cloudinary URL use karti hai
// Koi package nahi chahiye (Node 18+ ka fetch / FormData / crypto)
// =========================================================

import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CLOUDINARY_ASSETS, CLOUDINARY_FOLDER } from "../src/lib/cloudinary/assets.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = join(ROOT, "src/lib/cloudinary/manifest.json");
const FORCE = process.argv.includes("--force");
const VIDEO = new Set([".mp4", ".webm", ".mov"]);

// ---------- CLOUDINARY_URL padho (.env.local pehle, phir .env) ----------
function readEnvUrl() {
  if (process.env.CLOUDINARY_URL) return process.env.CLOUDINARY_URL;
  for (const f of [".env.local", ".env"]) {
    const p = join(ROOT, f);
    if (!existsSync(p)) continue;
    const line = readFileSync(p, "utf8")
      .split(/\r?\n/)
      .find((l) => /^\s*CLOUDINARY_URL\s*=/.test(l));
    if (line) return line.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "");
  }
  return null;
}

const url = readEnvUrl();
const m = url && /^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/.exec(url);
if (!m) {
  console.error("✗ CLOUDINARY_URL nahi mila / galat hai. .env mein: CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME");
  process.exit(1);
}
const [, API_KEY, API_SECRET, CLOUD] = m;

const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : { cloud: null, assets: {} };
manifest.cloud = CLOUD;
manifest.assets ??= {};

const sign = (params) => {
  const base = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(base + API_SECRET).digest("hex");
};

async function upload(localPath, withFolder = true) {
  const file = join(ROOT, "public", localPath);
  const ext = extname(localPath).toLowerCase();
  const type = VIDEO.has(ext) ? "video" : "image";
  // "/plants/mango-dasheri.webp" → "snp-biotech/plants/mango-dasheri"
  const id = `${CLOUDINARY_FOLDER}/${localPath.replace(/^\//, "").replace(/\.[^.]+$/, "")}`;
  const params = {
    public_id: id,
    overwrite: "true",
    invalidate: "true",
    timestamp: String(Math.floor(Date.now() / 1000)),
  };
  // Media Library mein "snp-biotech/plants" jaise folder mein dikhe
  if (withFolder) params.asset_folder = id.split("/").slice(0, -1).join("/");

  const form = new FormData();
  form.append("file", new Blob([readFileSync(file)]), localPath.split("/").pop());
  for (const [k, v] of Object.entries(params)) form.append(k, v);
  form.append("api_key", API_KEY);
  form.append("signature", sign(params));

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/${type}/upload`, { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message ?? `HTTP ${res.status}`;
    // Purane (fixed folder) account mein asset_folder nahi chalta → bina uske dobara
    if (withFolder && /asset_folder/i.test(msg)) return upload(localPath, false);
    throw new Error(msg);
  }
  return { id: data.public_id, v: data.version, type, bytes: data.bytes };
}

const md5 = (p) => createHash("md5").update(readFileSync(p)).digest("hex");
let done = 0;
let skipped = 0;
let failed = 0;

console.log(`☁  Cloudinary: ${CLOUD} · ${CLOUDINARY_ASSETS.length} files ki list\n`);
for (const localPath of CLOUDINARY_ASSETS) {
  const file = join(ROOT, "public", localPath);
  if (!existsSync(file)) {
    console.warn(`  ⚠ nahi mili, chhoda: public${localPath}`);
    failed++;
    continue;
  }
  const hash = md5(file);
  const prev = manifest.assets[localPath];
  if (!FORCE && prev?.hash === hash && prev?.cloud === CLOUD) {
    skipped++;
    continue;
  }
  try {
    const r = await upload(localPath);
    manifest.assets[localPath] = { id: r.id, v: r.v, type: r.type, hash, cloud: CLOUD };
    console.log(`  ✓ ${localPath}  →  ${r.id}  (${(r.bytes / 1024).toFixed(0)} KB)`);
    done++;
    // Har file ke baad likho — beech mein ruke to bhi jo hua wo yaad rahe
    writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  } catch (err) {
    console.error(`  ✗ ${localPath}: ${err.message}`);
    failed++;
  }
}

// List se hata di gayi files manifest se bhi hatao (site wapas local file use kare)
for (const k of Object.keys(manifest.assets)) if (!CLOUDINARY_ASSETS.includes(k)) delete manifest.assets[k];
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");

console.log(`\nHo gaya: ${done} upload · ${skipped} pehle se the · ${failed} dikkat`);
console.log("Ab src/lib/cloudinary/manifest.json commit karo — site Cloudinary se photos/video lene lagegi.");
if (failed) process.exitCode = 1;
