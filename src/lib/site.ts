/**
 * Configuración central del negocio.
 * ⚠️ Sustituye los valores marcados con TODO por los datos reales de Estética Airam.
 */
export const site = {
  name: "Estética Airam",
  tagline: "Resalta tu belleza, descubre tu mejor versión",
  description:
    "Estética Airam en Tarandacuao, Guanajuato: cortes, colorimetría, balayage, peinados, maquillaje profesional, tratamientos capilares, alaciados, manicure y pedicure. Agenda tu cita por WhatsApp.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.esteticaairam.com",
  locale: "es_MX",

  // Número de WhatsApp en formato internacional SIN "+", espacios ni guiones (52 + 10 dígitos).
  whatsapp: "524211088897",
  phoneDisplay: "421 108 88 97",
  email: "erickareyes329@gmail.com",

  address: {
    street: "Calle Allende 157",
    city: "Tarandacuao",
    region: "Guanajuato",
    postalCode: "38790",
    country: "MX",
  },

  // TODO: enlaces reales de redes sociales
  socials: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    tiktok: "https://www.tiktok.com/",
  },

  hours: [
    { days: "Lunes a Sábado", time: "12:00 – 20:00" },
    { days: "Domingo", time: "Cerrado" },
  ],

  /** Horarios disponibles en el formulario de citas (24 h). */
  booking: {
    firstSlot: "12:00",
    lastSlot: "19:00",
    stepMinutes: 30,
    closedWeekdays: [0], // 0 = domingo
  },
} as const;

export const fullAddress = `${site.address.street}, ${site.address.postalCode} ${site.address.city}, ${site.address.region}`;

/** Mapa embebido de Google Maps sin API key. Puedes reemplazarlo por el enlace "Insertar mapa" de tu ficha. */
export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  fullAddress,
)}&output=embed`;

export const mapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  fullAddress,
)}`;
