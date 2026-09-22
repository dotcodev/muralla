/**
 * Genera la imagen que se ve al compartir el enlace (WhatsApp, Facebook, etc.).
 * 1200x630 es la medida que esperan todas las plataformas.
 */
import sharp from 'sharp';

const FOTO = 'src/assets/fotos/secado-panoramica.jpg';
const LOGO = 'src/assets/marca/muralla-logo.png';
const SALIDA = 'public/og.jpg';

const W = 1200;
const H = 630;

const fondo = await sharp(FOTO)
  .resize({ width: W, height: H, fit: 'cover', position: 'attention' })
  .toBuffer();

// Velo oscuro para que el logotipo dorado despegue del barro.
const velo = Buffer.from(
  `<svg width="${W}" height="${H}">
     <defs>
       <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
         <stop offset="0%" stop-color="#17120f" stop-opacity="0.82"/>
         <stop offset="50%" stop-color="#17120f" stop-opacity="0.62"/>
         <stop offset="100%" stop-color="#17120f" stop-opacity="0.86"/>
       </linearGradient>
     </defs>
     <rect width="${W}" height="${H}" fill="url(#v)"/>
   </svg>`,
);

const logo = await sharp(LOGO).resize({ width: 430 }).toBuffer();
const { height: logoH } = await sharp(logo).metadata();

await sharp(fondo)
  .composite([
    { input: velo, top: 0, left: 0 },
    { input: logo, top: Math.round((H - logoH) / 2), left: Math.round((W - 430) / 2) },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(SALIDA);

const { size } = await sharp(SALIDA).metadata();
console.log(`${SALIDA} ${W}x${H} ${(size / 1024).toFixed(0)} KB`);
