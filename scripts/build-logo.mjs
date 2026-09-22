import sharp from 'sharp';
import fs from 'node:fs';

const SRC = '/Users/dbit/Library/CloudStorage/GoogleDrive-parradabito@gmail.com/Mi unidad/Muralla/Brand/muralla-01.jpg';
const OUT = 'src/assets/marca';
fs.mkdirSync(OUT, { recursive: true });

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

// Distance from white, per channel. Solid artwork is far from white; the paper is at 0.
const dist = (r, g, b) => Math.max(255 - r, 255 - g, 255 - b);

let maxD = 0;
for (let p = 0; p < data.length; p += channels) {
  const d = dist(data[p], data[p + 1], data[p + 2]);
  if (d > maxD) maxD = d;
}
// Everything past this is fully opaque; below it is the antialiased edge ramp.
const T = maxD * 0.55;

const out = Buffer.alloc(width * height * 4);
for (let p = 0, q = 0; p < data.length; p += channels, q += 4) {
  const r = data[p], g = data[p + 1], b = data[p + 2];
  const a = Math.min(1, dist(r, g, b) / T);
  if (a < 0.004) { out[q] = out[q + 1] = out[q + 2] = out[q + 3] = 0; continue; }
  // Un-matte the white paper so edges stay clean over any background.
  const un = (c) => Math.min(255, Math.max(0, Math.round((c - 255 * (1 - a)) / a)));
  out[q] = un(r); out[q + 1] = un(g); out[q + 2] = un(b);
  out[q + 3] = Math.round(a * 255);
}

const trimmed = await sharp(out, { raw: { width, height, channels: 4 } })
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 2 })
  .png()
  .toBuffer();
const meta = await sharp(trimmed).metadata();
console.log(`lockup ${meta.width}x${meta.height}  maxD=${maxD} T=${T.toFixed(0)}`);

await sharp(trimmed).resize({ width: 1000 }).png({ compressionLevel: 9, palette: true })
  .toFile(`${OUT}/muralla-logo.png`);

const mark = await sharp(trimmed)
  .extract({ left: 0, top: 0, width: meta.width, height: Math.round(meta.height * 0.70) })
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 2 })
  .png()
  .toBuffer();
await sharp(mark).resize({ width: 512 }).png({ compressionLevel: 9, palette: true })
  .toFile(`${OUT}/muralla-isotipo.png`);

// Logotipo horizontal para la barra: el bloque de texto sale aparte del emblema,
// asi el header se mantiene bajo sin sacrificar legibilidad.
await sharp(trimmed)
  .extract({
    left: 0,
    top: Math.round(meta.height * 0.72),
    width: meta.width,
    height: meta.height - Math.round(meta.height * 0.72),
  })
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 2 })
  .resize({ width: 700 })
  .png({ compressionLevel: 9, palette: true })
  .toFile(`${OUT}/muralla-tipografia.png`);

// Favicons live in public/ so they are served at stable paths.
fs.mkdirSync('public', { recursive: true });
for (const size of [32, 180]) {
  const pad = Math.round(size * 0.14);
  await sharp(mark)
    .resize({ width: size - pad * 2, height: size - pad * 2, fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: pad, bottom: pad, left: pad, right: pad,
              background: { r: 26, g: 22, b: 19, alpha: 1 } })
    .png({ compressionLevel: 9 })
    .toFile(size === 32 ? 'public/favicon.png' : 'public/apple-touch-icon.png');
}
console.log('ok');
