import { frameSrc } from "./storyConfig";

// Load order: pehla + aakhri frame, phir har 8th, 4th, 2nd, baaki.
// Isse 4G pe bhi scroll turant kaam karta hai — beech ke frames baad mein bharte hain.
function loadOrder(count) {
  const seen = new Set([0, count - 1]);
  const order = [0, count - 1];
  for (const step of [8, 4, 2, 1]) {
    for (let i = 0; i < count; i += step) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  return order;
}

// Frames background mein load karo. saveData (Data Saver ON) ho toh sirf har 3rd frame.
export function loadFrames(set, { saveData = false, onFrame } = {}) {
  const images = new Array(set.count).fill(null);
  const order = loadOrder(set.count).filter(
    (i) => !saveData || i % 3 === 0 || i === set.count - 1
  );
  let cursor = 0;
  let cancelled = false;

  const next = () => {
    if (cancelled || cursor >= order.length) return;
    const index = order[cursor++];
    const img = new Image();
    img.decoding = "async";
    img.src = frameSrc(set, index);
    img
      .decode()
      .then(() => {
        if (cancelled) return;
        images[index] = img;
        onFrame?.(index);
      })
      .catch(() => {})
      .finally(next);
  };

  // Ek saath 6 downloads — zyada karne se phone ka network choke hota hai
  for (let k = 0; k < 6; k++) next();

  return {
    images,
    cancel() {
      cancelled = true;
    },
  };
}

// Jo frame chahiye woh abhi load nahi hua? Sabse paas wala loaded frame do.
export function nearestLoaded(images, index) {
  if (images[index]) return images[index];
  for (let d = 1; d < images.length; d++) {
    if (images[index - d]) return images[index - d];
    if (images[index + d]) return images[index + d];
  }
  return null;
}

// CSS "object-fit: cover" jaisa — canvas bhar do, image ka ratio na bigde
export function drawCover(ctx, img, cw, ch) {
  const ir = img.naturalWidth / img.naturalHeight;
  const cr = cw / ch;
  let w, h;
  if (ir > cr) {
    h = ch;
    w = ch * ir;
  } else {
    w = cw;
    h = cw / ir;
  }
  ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
}
