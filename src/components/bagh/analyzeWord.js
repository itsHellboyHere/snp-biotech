// =========================================================
// Shabd ko ek chhupe canvas pe bana ke teen cheezein nikalta hai:
// 1. path  — shabd ka outline (SVG path). Browser bahut bade AKSHAR draw nahi karte
//            (≈5000 device px ke baad gayab), lekin PATH kisi bhi zoom pe saaf banta hai.
// 2. box   — shabd ki asli seema (ink ka box)
// 3. focus — shabd ka sabse "mota" hissa: wahan zoom karo to poori screen letter ke andar
// Sab text units mein: SVG <text font-size={size}> jaise, origin = baseline ka shuru
// =========================================================

const THRESHOLD = 0.5;

export function analyzeWord({ word, font, stroke = 0, aspect = 16 / 9, res = 4 }) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.font = font;
  const m = ctx.measureText(word);

  const pad = stroke + 6;
  const bx = -m.actualBoundingBoxLeft - pad;
  const by = -m.actualBoundingBoxAscent - pad;
  const bw = m.actualBoundingBoxLeft + m.actualBoundingBoxRight + pad * 2;
  const bh = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent + pad * 2;

  const w = Math.max(4, Math.ceil(bw * res));
  const h = Math.max(4, Math.ceil(bh * res));
  canvas.width = w;
  canvas.height = h;

  // Canvas size badalne se settings reset hoti hain — dobara lagao
  ctx.setTransform(res, 0, 0, res, -bx * res, -by * res);
  ctx.font = font;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#000";
  ctx.fillText(word, 0, 0);
  if (stroke > 0) {
    ctx.lineWidth = stroke;
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#000";
    ctx.strokeText(word, 0, 0);
  }

  const { data } = ctx.getImageData(0, 0, w, h);
  const alpha = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) alpha[i] = data[i * 4 + 3] / 255;

  // canvas pixel (center) → text units
  const tx = (px) => bx + (px + 0.5) / res;
  const ty = (py) => by + (py + 0.5) / res;

  const path = tracePath(alpha, w, h, tx, ty);
  const { box, focus, focusHalf } = findFocus(alpha, w, h, aspect, res, bx, by);
  return { path, box, focus, focusHalf };
}

// ---------- 1. Outline: marching squares → loops → simplify → SVG path ----------
function tracePath(alpha, w, h, tx, ty) {
  const val = (x, y) => alpha[y * w + x];
  const H = (x, y) => (y * w + x) * 2; // cell ki upar/neeche wali edge
  const V = (x, y) => (y * w + x) * 2 + 1; // left/right wali edge

  // Edge pe outline kahan se guzarta hai (anti-aliasing se sub-pixel jagah)
  const point = (id) => {
    const idx = id >> 1;
    const x = idx % w;
    const y = (idx / w) | 0;
    if ((id & 1) === 0) {
      const a = val(x, y);
      const b = val(x + 1, y);
      return [x + (THRESHOLD - a) / (b - a), y];
    }
    const a = val(x, y);
    const b = val(x, y + 1);
    return [x, y + (THRESHOLD - a) / (b - a)];
  };

  const links = new Map();
  const link = (a, b) => {
    (links.get(a) || links.set(a, []).get(a)).push(b);
    (links.get(b) || links.set(b, []).get(b)).push(a);
  };

  for (let y = 0; y < h - 1; y++) {
    for (let x = 0; x < w - 1; x++) {
      const tl = val(x, y) >= THRESHOLD;
      const tr = val(x + 1, y) >= THRESHOLD;
      const br = val(x + 1, y + 1) >= THRESHOLD;
      const bl = val(x, y + 1) >= THRESHOLD;
      const c = (tl << 3) | (tr << 2) | (br << 1) | bl;
      if (c === 0 || c === 15) continue;
      const top = H(x, y);
      const bottom = H(x, y + 1);
      const left = V(x, y);
      const right = V(x + 1, y);
      const center = (val(x, y) + val(x + 1, y) + val(x + 1, y + 1) + val(x, y + 1)) / 4 >= THRESHOLD;
      switch (c) {
        case 1:
        case 14:
          link(left, bottom);
          break;
        case 2:
        case 13:
          link(bottom, right);
          break;
        case 3:
        case 12:
          link(left, right);
          break;
        case 4:
        case 11:
          link(top, right);
          break;
        case 6:
        case 9:
          link(top, bottom);
          break;
        case 7:
        case 8:
          link(top, left);
          break;
        case 5: // tr + bl bhare (saddle)
          if (center) {
            link(left, top);
            link(bottom, right);
          } else {
            link(top, right);
            link(left, bottom);
          }
          break;
        case 10: // tl + br bhare (saddle)
          if (center) {
            link(top, right);
            link(left, bottom);
          } else {
            link(left, top);
            link(bottom, right);
          }
          break;
        default:
          break;
      }
    }
  }

  // Edges ko jod ke band loops banao
  const seen = new Set();
  const parts = [];
  for (const start of links.keys()) {
    if (seen.has(start)) continue;
    const loop = [];
    let prev = -1;
    let cur = start;
    while (cur !== undefined && !seen.has(cur)) {
      seen.add(cur);
      loop.push(point(cur));
      const nb = links.get(cur);
      const nxt = nb[0] !== prev ? nb[0] : nb[1];
      prev = cur;
      cur = nxt;
    }
    if (loop.length < 3) continue;
    const pts = simplify(loop, 0.2);
    let d = `M${tx(pts[0][0]).toFixed(2)} ${ty(pts[0][1]).toFixed(2)}`;
    for (let i = 1; i < pts.length; i++) d += `L${tx(pts[i][0]).toFixed(2)} ${ty(pts[i][1]).toFixed(2)}`;
    parts.push(`${d}Z`);
  }
  return parts.join("");
}

// Ramer–Douglas–Peucker: seedhi lines pe faltu points hatao (curves saaf rehte hain)
function simplify(pts, eps) {
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = 1;
  keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    let maxD = 0;
    let idx = -1;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / len;
      if (d > maxD) {
        maxD = d;
        idx = i;
      }
    }
    if (maxD > eps && idx > 0) {
      keep[idx] = 1;
      stack.push([a, idx], [idx, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

// ---------- 2 + 3. Ink box + zoom ke liye sabse mota hissa ----------
function findFocus(alpha, w, h, aspect, res, bx, by) {
  // Summed-area table: kisi bhi rectangle mein kitne pixel bhare hain — O(1) mein
  const W1 = w + 1;
  const sat = new Uint32Array(W1 * (h + 1));
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < h; y++) {
    let row = 0;
    for (let x = 0; x < w; x++) {
      const on = alpha[y * w + x] >= THRESHOLD ? 1 : 0;
      if (on) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      row += on;
      sat[(y + 1) * W1 + x + 1] = sat[y * W1 + x + 1] + row;
    }
  }

  if (maxX < 0) {
    return { box: { x: 0, y: -100, w: 100, h: 100 }, focus: { x: 50, y: -50 }, focusHalf: 1 };
  }

  // Kya (cx, cy) ke charon taraf screen ke aspect wala rectangle (aadhi oonchai r) poora bhara hai?
  const fits = (cx, cy, r) => {
    const x0 = Math.floor(cx - r * aspect);
    const x1 = Math.ceil(cx + r * aspect);
    const y0 = Math.floor(cy - r);
    const y1 = Math.ceil(cy + r);
    if (x0 < 0 || y0 < 0 || x1 > w || y1 > h) return false;
    const sum = sat[y1 * W1 + x1] - sat[y0 * W1 + x1] - sat[y1 * W1 + x0] + sat[y0 * W1 + x0];
    return sum >= (x1 - x0) * (y1 - y0) * 0.995;
  };

  let best = { r: 0, x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
  const step = Math.max(2, Math.round(Math.min(w, h) / 120));
  const rMax = Math.min(h / 2, w / (2 * aspect));
  for (let y = minY; y <= maxY; y += step) {
    for (let x = minX; x <= maxX; x += step) {
      if (alpha[y * w + x] < THRESHOLD) continue;
      if (!fits(x, y, best.r + 0.5)) continue;
      let lo = best.r + 0.5;
      let hi = rMax;
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2;
        if (fits(x, y, mid)) lo = mid;
        else hi = mid;
      }
      best = { r: lo, x, y };
    }
  }

  return {
    box: { x: bx + minX / res, y: by + minY / res, w: (maxX - minX + 1) / res, h: (maxY - minY + 1) / res },
    focus: { x: bx + (best.x + 0.5) / res, y: by + (best.y + 0.5) / res },
    focusHalf: Math.max(best.r / res, 0.05),
  };
}
