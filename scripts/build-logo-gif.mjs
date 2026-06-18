// Builds assets/logo.gif — the animated tsundere mascot: always turned away and
// blushing, eyes squeezing shut ">< " then softening to "‿ ‿", with a gentle bob.
//
// Usage (from the repo root):
//   npm i sharp gifenc          # build-only deps — NOT shipped with the plugin
//   node scripts/build-logo-gif.mjs
//
// Matching static stills live alongside the GIF:
//   assets/logo-xx.svg / .png   the ">< " (squeezed-shut) face
//   assets/logo.svg    / .png   the "‿ ‿" (smiling) face
// Tweak the `frames` / `eyes` / `blush` tables below and re-run to retune.

import sharp from 'sharp';
import pkg from 'gifenc';
const { GIFEncoder, quantize, applyPalette } = pkg;
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

// tight crop around the mascot (includes the -5px bob headroom), rendered at 4x
const VBX = 50, VBY = 54, VBW = 140, VBH = 100, SCALE = 4, OW = VBW * SCALE, OH = VBH * SCALE;
const BODY = '#C8765A', EYE = '#1a1a1a', BLUSH = '#E2554A';

const r = (x, y, w, h, fill, op = 1) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${op < 1 ? ` fill-opacity="${op}"` : ''}/>`;

// body + 4 legs (two pairs at the edges) + 2 arm nubs — constant across frames
const bodyParts = [
  r(68, 66, 104, 58, BODY),
  r(68, 124, 12, 24, BODY), r(88, 124, 12, 24, BODY), r(140, 124, 12, 24, BODY), r(160, 124, 12, 24, BODY),
  r(56, 96, 12, 16, BODY), r(172, 96, 12, 16, BODY),
].join('');

const eyes = {
  // smiling "‿ ‿", shifted left (turned away, dere)
  smileL: [[74,78,8,5],[82,82,10,5],[92,78,8,5],[106,78,8,5],[114,82,10,5],[124,78,8,5]],
  // squeezed shut ">< ", shifted left (turned away, flustered)
  xxL:    [[74,75,6,3],[80,78,6,3],[86,81,6,3],[80,84,6,3],[74,87,6,3],
           [124,75,6,3],[118,78,6,3],[112,81,6,3],[118,84,6,3],[124,87,6,3]],
};
const blush = {
  left: [[76, 90, 18, 9], [112, 90, 18, 9]],
};

function buildSVG({ eye, bl, blOp = 1, dy = 0 }) {
  const eyeR = eyes[eye].map(a => r(...a, EYE)).join('');
  const blR = (blush[bl] || []).map(a => r(...a, BLUSH, blOp)).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${VBW}" height="${VBH}" viewBox="${VBX} ${VBY} ${VBW} ${VBH}" shape-rendering="crispEdges"><g transform="translate(0,${dy})">${bodyParts}${eyeR}${blR}</g></svg>`;
}

// the loop — always turned away & blushing (no neutral face), eyes squeeze then soften
const frames = [
  { eye: 'xxL',    bl: 'left', blOp: 1.0, dy: 0,  delay: 450 }, // squeezed shut ><, blush strong ("hmph!")
  { eye: 'xxL',    bl: 'left', blOp: 0.6, dy: -5, delay: 180 }, // bob up, blush dips
  { eye: 'smileL', bl: 'left', blOp: 0.9, dy: 0,  delay: 400 }, // eyes soften to ‿ (dere leak)
  { eye: 'smileL', bl: 'left', blOp: 0.6, dy: -5, delay: 180 }, // bob, blush pulse
];

const gif = GIFEncoder();
for (const f of frames) {
  const { data } = await sharp(Buffer.from(buildSVG(f)))
    .resize(OW, OH).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const palette = quantize(data, 256, { format: 'rgba4444' });
  const index = applyPalette(data, palette, 'rgba4444');
  gif.writeFrame(index, OW, OH, { palette, transparent: true, delay: f.delay });
}
gif.finish();
const out = Buffer.from(gif.bytes());
const outPath = fileURLToPath(new URL('../assets/logo.gif', import.meta.url));
writeFileSync(outPath, out);
console.log('wrote', outPath, '—', out.length, 'bytes,', frames.length, 'frames,', OW + 'x' + OH);
