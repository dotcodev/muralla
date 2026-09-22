/**
 * Datos del negocio.
 *
 * Este es el unico archivo que hay que tocar para actualizar textos de contacto,
 * redes y CTAs. Todo lo marcado con  // TODO  son datos que faltan por confirmar
 * con el cliente antes de publicar.
 */

export const site = {
  nombre: 'Muralla',
  nombreCompleto: 'Muralla Ladrillera',
  tagline: 'Ladrillera artesanal',
  descripcion:
    'Ladrillera artesanal en La Libertad, Puebla: ladrillo de barro moldeado, secado al sol y cocido pieza por pieza. Surtimos obra, fachada y proyectos a medida.',

  // TODO confirmar dominio definitivo (tambien en astro.config.mjs y public/robots.txt).
  url: 'https://murallaladrillera.com',

  contacto: {
    // Numero unico para llamada y WhatsApp: 233 106 5833.
    whatsapp: '522331065833', // 52 (Mexico) + los 10 digitos, sin signos
    whatsappVisible: '233 106 5833',
    telefono: '+52 233 106 5833',

    // TODO correo de ventas (depende del dominio definitivo).
    email: 'ventas@murallaladrillera.com',

    calle: 'Primera Seccion',
    ciudad: 'La Libertad',
    estado: 'Puebla',
    cp: '73691',
    horario: 'Lunes a sabado, 8:00 a 18:00 h',

    coordenadas: { lat: 19.7527665, lng: -97.6106141 },
  },

  /**
   * Redes sociales. Deja la cadena vacia y el icono no se muestra:
   * hoy solo existe el perfil de Facebook.
   */
  redes: {
    facebook: 'https://www.facebook.com/ladrilleramuralla',
    instagram: '',
    tiktok: '',
  },

  /**
   * Endpoint del formulario de contacto.
   *
   * El sitio es estatico, asi que el formulario necesita un servicio externo.
   * Pega aqui la URL de Formspree / Web3Forms / Getform y listo.
   * Si se queda vacio, el formulario abre el cliente de correo del visitante.
   */
  formEndpoint: '',
} as const;

const { lat, lng } = site.contacto.coordenadas;

/** Direccion completa en una linea. */
export const direccionCompleta =
  `${site.contacto.calle}, ${site.contacto.cp} ${site.contacto.ciudad}, ${site.contacto.estado}`;

/** Ficha del taller en Google Maps, armada desde las coordenadas. */
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}`;

export const whatsappUrl = (mensaje: string) =>
  `https://wa.me/${site.contacto.whatsapp}?text=${encodeURIComponent(mensaje)}`;

export const telUrl = `tel:${site.contacto.telefono.replace(/[^\d+]/g, '')}`;

/** Rutas absolutas: asi el menu tambien funciona desde /gracias y /404. */
export const nav = [
  { href: '/#productos', label: 'Productos' },
  { href: '/#proceso', label: 'Proceso' },
  { href: '/#calidad', label: 'Calidad' },
  { href: '/#galeria', label: 'Galeria' },
  { href: '/#contacto', label: 'Contacto' },
] as const;
