# Muralla Ladrillera — sitio web

Sitio estático construido con [Astro](https://astro.build). Se publica como HTML plano:
sin framework de cliente, sin JS de terceros y con las imágenes convertidas a WebP en
tiempo de compilación.

## Por qué Astro

- **Cero JavaScript por defecto.** Astro no manda runtime al navegador. Lo único que viaja
  son ~2 KB propios: el menú móvil y el visor de la galería.
- **Imágenes resueltas en el build.** `astro:assets` genera cada foto en varios anchos y en
  WebP, y escribe el `srcset`/`sizes` correcto. En un sitio de fotografía de producto eso es
  lo que decide el tiempo de carga.
- **Tipografías autoalojadas.** La API de fuentes de Astro descarga y subsetea Fraunces e
  Inter durante el build: no hay petición a Google Fonts en producción.
- **Se publica en cualquier hosting estático** — Netlify, Vercel, Cloudflare Pages, GitHub
  Pages o un bucket— y no hay servidor que mantener ni actualizar.

Peso de la portada en móvil: ~36 KB de HTML, ~27 KB de CSS, 85 KB de fuentes y 36 KB de la
foto principal. Sin archivos JS externos.

## Comandos

El proyecto usa **pnpm**, y solo pnpm. Está fijado en `packageManager` de
`package.json`; `package-lock.json` y `yarn.lock` están en el `.gitignore` a propósito.

```bash
pnpm install
```

```bash
pnpm dev
```

```bash
pnpm build
```

`pnpm preview` sirve la carpeta `dist/` ya compilada y `pnpm check` valida tipos.

## Antes de publicar

Todos los datos del negocio viven en un solo archivo: [`src/data/site.ts`](src/data/site.ts).

Ya están cargados los datos reales:

| Campo | Valor |
| --- | --- |
| Teléfono y WhatsApp | 233 106 5833 (`+52 233 106 5833` / `wa.me/522331065833`) |
| Taller | Primera Sección, 73691 La Libertad, Puebla |
| Coordenadas | 19.7527665, −97.6106141 — de ahí sale el enlace a Google Maps |
| Horario | Lunes a sábado, 8:00 a 18:00 h |
| Facebook | facebook.com/ladrilleramuralla |

Siguen marcados con `// TODO` los que faltan:

| Campo | Qué falta |
| --- | --- |
| `contacto.email` | Correo de ventas (depende del dominio definitivo) |
| `formEndpoint` | Servicio del formulario (ver abajo) |
| `site.url` | Dominio definitivo — cámbialo también en `astro.config.mjs` y en `public/robots.txt` |

### Mapa

El mapa vive en [`src/components/Mapa.astro`](src/components/Mapa.astro), al cierre de la
portada. Usa el embed de Google Maps **sin llave de API**, apuntando a las coordenadas del
taller, y carga en diferido (`loading="lazy"`): al estar al final de la página no descarga
nada hasta que el visitante se acerca.

Se descartó OpenStreetMap: esa zona de La Libertad no está mapeada y el recuadro salía en
blanco. Google sí tiene el trazado de las secciones y los comercios de referencia.

Las coordenadas salen de la ficha del negocio en Google Maps, no de un punto suelto en el
mapa: así «Cómo llegar» resuelve el destino como «Ladrillera "Muralla"» en vez de unas
coordenadas anónimas. Los tres enlaces del sitio apuntan a cosas distintas a propósito:

- **«Cómo llegar»** → `comoLlegarUrl`, abre Google Maps con la ruta ya trazada.
- **La dirección del pie** → `mapsUrl`, abre la ficha del negocio (foto, horario, teléfono).
- **El recuadro del mapa** → coordenadas. Buscar por nombre no funciona en el embed sin
  llave de API: devuelve el recuadro en blanco.

Si más adelante quieren evitar las cookies de Google, la alternativa es cambiar el iframe por
un botón que lo cargue al hacer clic.

### Redes sociales

Los iconos viven en [`src/components/Redes.astro`](src/components/Redes.astro) y aparecen en
el pie y junto al botón de WhatsApp. Facebook, Instagram y TikTok ya están listos, pero
**solo se dibuja el icono cuya URL esté llena** en `site.redes`. Hoy se ve únicamente
Facebook; cuando abran Instagram o TikTok, basta con pegar la URL y aparecen solos. Los
perfiles activos también se publican en `sameAs` de los datos estructurados.

### Formulario de contacto

El sitio es estático, así que el formulario necesita un servicio externo. Pega la URL de
Formspree, Web3Forms o Getform en `formEndpoint` y configura ahí el redirect a `/gracias`.

Mientras `formEndpoint` esté vacío, el formulario abre el cliente de correo del visitante con
los datos ya armados. Funciona, pero conviene conectar el servicio antes de lanzar.

### Textos sin verificar

El horario (lunes a sábado, 8:00 a 18:00) se dejó como estaba: conviene confirmarlo.

La descripción del proceso (extracción, amasado, moldeo, secado y cocción) está escrita a
partir de las fotos del taller. Conviene que el cliente la lea y corrija los detalles de su
operación antes de publicar. **No se inventaron cifras**: no hay años de experiencia, piezas
al mes, medidas ni resistencias. Cuando el cliente entregue esos datos, el lugar natural para
las fichas técnicas es la sección de productos.

### Botón de WhatsApp

[`BotonWhatsApp.astro`](src/components/BotonWhatsApp.astro) usa el glifo oficial de la marca
y su verde oficial `#25D366`. Aparece en dos formas:

- **Flotante**, en la esquina inferior derecha de todas las páginas. En escritorio despliega
  el texto al pasar el cursor; en móvil se queda como círculo para no tapar contenido.
- **En línea**, dentro de la sección de contacto.

El mensaje que se precarga en el chat se pasa por la prop `mensaje`.

## SEO

Lo que ya está resuelto:

- **Imagen al compartir** (`public/og.jpg`, 1200×630). Es la que se ve al pegar el enlace en
  WhatsApp o Facebook. La genera `scripts/build-og.mjs` a partir de la foto del patio y el
  logotipo; si cambian la foto, se vuelve a correr con `node scripts/build-og.mjs`.
- **Título con intención local**: «Ladrillo de barro artesanal en Puebla | Muralla Ladrillera».
- **Datos estructurados `LocalBusiness`** con dirección completa, coordenadas, teléfono,
  horario, enlace a Maps, perfiles sociales y catálogo de productos. Es lo que Google usa
  para armar la ficha del negocio.
- **Sitemap** que solo lista la portada: `/gracias` y `/404` van con `noindex`, así que
  incluirlas sería una señal contradictoria.
- **Jerarquía de encabezados limpia**: un solo `h1`, un `h2` por sección y `h3` para las
  tarjetas. Los rótulos del pie no son encabezados.
- Canonical, `robots.txt`, textos alternativos en todas las fotos y `lang="es-MX"`.

Lo que falta y no depende del código:

1. **Reclamar la ficha de Google.** El negocio **ya existe** en Google Maps como
   «Ladrillera "Muralla"», con el teléfono correcto y foto, pero está **sin reclamar** (la
   ficha muestra «Reclamar este negocio») y **mal categorizado: aparece como "Estanco"**, que
   es una tabaquería. Reclamarla y corregir la categoría es la acción de SEO local con más
   impacto, por encima de cualquier ajuste del sitio. Al hacerlo, dejar el nombre, teléfono y
   dirección idénticos a los de aquí: esa coherencia es lo que Google premia.
2. **Dominio propio** y alta en Google Search Console.
3. **Reseñas** en la ficha de Google.

## Estructura

```
src/
  assets/
    fotos/      Fotografías ya reducidas a 2400 px (fuente para astro:assets)
    marca/      Logotipo con fondo transparente, emblema y tipografía
  components/   Una sección de la portada por archivo
  data/site.ts  Datos del negocio y navegación
  layouts/      Cabecera del documento, metadatos y datos estructurados
  pages/        index, gracias, 404
  styles/       Tokens de color, tipografía y utilidades
scripts/
  build-logo.mjs  Regenera los recortes del logotipo desde el original
  build-og.mjs    Regenera la imagen que se ve al compartir el enlace
```

### Sobre las imágenes

Las fotos en `src/assets/fotos/` son versiones reducidas de los originales de 4000×6000 px
que están en Google Drive (`Muralla/Fotos`). Los originales **no** se versionan: pesan 72 MB
y Astro no necesita más de 2400 px para generar todas las variantes.

Para añadir una foto nueva: redúcela y colócala en esa carpeta, luego impórtala en el
componente correspondiente. `Image` se encarga del resto.

### Sobre el logotipo

El original (`Muralla/Brand/muralla-01.jpg`) es un JPG sobre fondo blanco. `build-logo.mjs`
le quita el fondo y genera tres piezas: el lockup vertical (pie de página), el emblema y el
bloque tipográfico (los dos últimos forman el logotipo horizontal de la barra). Si llega un
logotipo vectorial, reemplaza estos PNG por el SVG y borra el script.

Las otras imágenes de la carpeta `Brand` son bocetos de stock con marca de agua
(«Scalebranding») y no se usaron.

## Publicar

El sitio se despliega en **Vercel**. El resultado de `pnpm build` queda en `dist/` y es HTML
estático.

La configuración ya está en [`vercel.json`](vercel.json), así que al importar el repo no hay
que llenar nada a mano:

| Ajuste | Dónde está definido |
| --- | --- |
| Framework | `vercel.json` → `astro` |
| Build command | `vercel.json` → `pnpm build` |
| Output directory | `vercel.json` → `dist` |
| Versión de Node | `package.json` → `engines.node: 22.x` |
| Gestor de paquetes | se detecta solo por `pnpm-lock.yaml` |

`vercel.json` también fija el cacheo: todo lo que Astro emite en `/_astro/` lleva un hash en
el nombre, así que se puede cachear un año como inmutable — si el archivo cambia, cambia su
URL. El favicon y la imagen de compartir van a una semana.

**Ojo:** Vercel no lee `.nvmrc`; toma la versión de Node de `engines.node`. El `.nvmrc` se
queda para quien use nvm en local.

### Un paso que no hay que olvidar

`site` en [`astro.config.mjs`](astro.config.mjs) apunta a `https://murallaladrillera.com`,
que todavía no existe. De ahí salen el canonical, el sitemap y la URL de la imagen al
compartir.

Mientras el sitio viva en la URL de Vercel (`*.vercel.app`), esos tres apuntarán al dominio
equivocado. No rompe nada visible, pero conviene:

- si el dominio propio se conecta de inmediato, dejarlo como está;
- si va a tardar, poner la URL de Vercel en `site` (y en `public/robots.txt`) y cambiarla el
  día que se conecte el dominio.
