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

    // Se deja vacío hasta confirmar un correo real; el formulario usa WhatsApp.
    email: '',

    calle: 'Primera Seccion',
    ciudad: 'La Libertad',
    estado: 'Puebla',
    cp: '73691',
    horario: 'Lunes a sábado, 8:00 a 18:00 h',

    // Coordenadas tomadas de la ficha del negocio en Google Maps, no de un punto
    // suelto: el pin cae exactamente sobre el taller.
    coordenadas: { lat: 19.7525019, lng: -97.6118393 },

    // Identificador de la ficha en Google Maps. Es lo que permite enlazar al
    // negocio (con foto, horario y telefono) en vez de a unas coordenadas sueltas.
    googleMapsCid: '6556532899348934989',

    // Codigo Plus: mas facil de dictar por telefono que las coordenadas.
    codigoPlus: 'Q93Q+27 La Libertad, Puebla',
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

/** Ficha del negocio en Google Maps: abre el lugar con su foto, horario y telefono. */
export const mapsUrl = `https://maps.google.com/?cid=${site.contacto.googleMapsCid}`;

/** Abre Google Maps con la ruta ya trazada hasta el taller. */
export const comoLlegarUrl =
  `https://www.google.com/maps/dir/?api=1&destination=${lat}%2C${lng}`;

export const whatsappUrl = (mensaje: string) =>
  `https://wa.me/${site.contacto.whatsapp}?text=${encodeURIComponent(mensaje)}`;

export const telUrl = `tel:${site.contacto.telefono.replace(/[^\d+]/g, '')}`;

/** Rutas absolutas: asi el menu tambien funciona desde /gracias y /404. */
export const nav = [
  { href: '/', label: 'Inicio' },
  { href: '/#productos', label: 'Productos' },
  { href: '/#proceso', label: 'Proceso' },
  { href: '/#historia', label: 'Historia' },
  { href: '/#calidad', label: 'Calidad' },
  { href: '/#galeria', label: 'Galería' },
  { href: '/#contacto', label: 'Contacto' },
] as const;
