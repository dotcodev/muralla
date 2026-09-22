// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Cambia esta URL por el dominio real antes de publicar (afecta sitemap y metadatos).
const SITE = 'https://murallaladrillera.com';

export default defineConfig({
  site: SITE,
  integrations: [
    sitemap({
      // /gracias y /404 van con noindex: listarlas seria una senal contradictoria.
      filter: (page) => !/\/(gracias|404)\/?$/.test(page),
    }),
  ],
  image: {
    // Genera srcset/sizes automaticamente para cada <Image />.
    layout: 'constrained',
    responsiveStyles: true,
  },
  build: {
    // Los CSS pequenos se insertan en el HTML: menos round-trips en la primera carga.
    inlineStylesheets: 'auto',
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Fraunces',
      cssVariable: '--font-display',
      weights: ['400 800'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-body',
      weights: ['400 600'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
    },
  ],
});
