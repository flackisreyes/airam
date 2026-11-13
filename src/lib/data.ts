import {
  Award,
  Brush,
  Crown,
  Gem,
  HeartHandshake,
  Palette,
  Scissors,
  Sofa,
  Sparkles,
  UserRound,
  Waves,
  Hand,
  type LucideIcon,
} from "lucide-react";

/* ───────────────────────── Navegación ───────────────────────── */

export const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#galeria", label: "Galería" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#promociones", label: "Promociones" },
  { href: "#testimonios", label: "Opiniones" },
  { href: "#contacto", label: "Contacto" },
] as const;

/* ───────────────────────── Imágenes ─────────────────────────
 * Fotografías reales del salón (carpeta recursos).
 * Sustitúyelas por fotos reales del salón: colócalas en /public/images
 * y usa rutas como "/images/corte.jpg".
 */
export const images = {
  hero: "/images/inicio-airam.jpg",
  salon: "/images/trabajos/salon-peinado-ondas.jpg",
  salonDetail: "/images/trabajos/salon-trabajando.jpg",
  booking: "/images/trabajos/maquillaje-elegante.jpg",
  // Antes y después: deben ser fotos de la MISMA clienta.
  before: "/images/antes-cabello.jpg", // foto real del salón
  after: "/images/despues-cabello.jpg", // foto real del salón
};

/* Fotos del local, para la franja "Conoce nuestro espacio". */
export const salonSpace = [
  { src: "/images/salon/salon-recepcion.jpg", alt: "Recepción de Estética Airam con el letrero de Ericka Reyes", position: "object-center" },
  { src: "/images/salon/salon-espejo.jpg", alt: "Tocador con espejo iluminado y sillón profesional", position: "object-center" },
  { src: "/images/salon/salon-tocador.jpg", alt: "Área de trabajo con mural de maquillaje en la pared", position: "object-top" },
];

/* ───────────────────────── Servicios ───────────────────────── */

export type Service = {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    id: "cortes",
    title: "Cortes de cabello",
    description:
      "Cortes a la medida de tu rostro y estilo: desde puntas perfectas hasta un cambio de look total.",
    image: "/images/trabajos/mechas-castano-espalda.jpg",
    icon: Scissors,
  },
  {
    id: "tintes",
    title: "Tintes y colorimetría",
    description:
      "Diagnóstico de color profesional para lograr el tono ideal, brillante y duradero.",
    image: "/images/trabajos/mechas-castano-lacio.jpg",
    icon: Palette,
  },
  {
    id: "balayage",
    title: "Balayage y mechas",
    description:
      "Iluminaciones naturales, babylights y balayage con técnicas que cuidan la fibra capilar.",
    image: "/images/trabajos/cambio-look-rubio.jpg",
    icon: Sparkles,
  },
  {
    id: "peinados",
    title: "Peinados para eventos",
    description:
      "Recogidos, ondas y trenzas para bodas, XV años, graduaciones y ocasiones especiales.",
    image: "/images/trabajos/coleta-ondas.jpg",
    icon: Crown,
  },
  {
    id: "maquillaje",
    title: "Maquillaje profesional",
    description:
      "Maquillaje social, de novia y de noche con productos de alta gama y acabado impecable.",
    image: "/images/trabajos/maquillaje-plata.jpg",
    icon: Brush,
  },
  {
    id: "alaciados",
    title: "Alaciados",
    description:
      "Alaciado permanente, keratina y nanoplastia para un liso sedoso, sin frizz y fácil de peinar.",
    image: "/images/trabajos/balayage-cenizo.jpg",
    icon: Waves,
  },
  {
    id: "manicure-pedicure",
    title: "Manicure y pedicure",
    description:
      "Uñas impecables: gelish, acrílico, diseños personalizados y spa para manos y pies.",
    image: "/images/trabajos/unas-frances-dorado.jpg",
    icon: Hand,
  },
];

/* ───────────────────────── Galería ───────────────────────── */

export const galleryCategories = [
  "Todos",
  "Cambios de look",
  "Diseños de cabello",
  "Peinados",
  "Maquillaje",
  "Uñas",
] as const;

export type GalleryCategory = Exclude<(typeof galleryCategories)[number], "Todos">;

export type GalleryItem = {
  src: string;
  alt: string;
  category: GalleryCategory;
  tall?: boolean;
  /** Encuadre de la miniatura (por defecto centrado). */
  position?: string;
};

/** Todas son fotos reales del salón (carpeta recursos). Son verticales, por eso van en formato alto. */
const t = "/images/trabajos";
export const gallery: GalleryItem[] = [
  { src: `${t}/cambio-look-rubio.jpg`, alt: "Cambio de look a rubio con mechas largas", category: "Cambios de look", tall: true, position: "object-top" },
  { src: `${t}/maquillaje-plata.jpg`, alt: "Maquillaje con sombra plateada y ondas", category: "Maquillaje", tall: true, position: "object-top" },
  { src: `${t}/coleta-ondas.jpg`, alt: "Coleta alta con ondas definidas", category: "Peinados", tall: true, position: "object-top" },
  { src: `${t}/unas-frances-dorado.jpg`, alt: "Uñas almendradas con francés dorado", category: "Uñas", tall: true },
  { src: `${t}/mechas-rubias-largo.jpg`, alt: "Mechas rubias en cabello largo y lacio", category: "Diseños de cabello", tall: true, position: "object-top" },
  { src: `${t}/maquillaje-vainilla.jpg`, alt: "Maquillaje vainilla con brillo dorado", category: "Maquillaje", tall: true, position: "object-top" },
  { src: `${t}/recogido-maquillaje.jpg`, alt: "Recogido con rizos y maquillaje de noche", category: "Peinados", tall: true, position: "object-top" },
  { src: `${t}/mechas-castano-lacio.jpg`, alt: "Mechas sobre castaño con alaciado", category: "Cambios de look", tall: true, position: "object-top" },
  { src: `${t}/maquillaje-ojo-detalle.jpg`, alt: "Detalle de ojo ahumado en tonos morados", category: "Maquillaje", tall: true },
  { src: `${t}/balayage-cenizo.jpg`, alt: "Balayage cenizo con acabado lacio", category: "Diseños de cabello", tall: true, position: "object-top" },
  { src: `${t}/unas-dorado-verde.jpg`, alt: "Uñas con glitter dorado y verde", category: "Uñas", tall: true },
  { src: `${t}/maquillaje-rosa.jpg`, alt: "Maquillaje con sombra rosa y labios fucsia", category: "Maquillaje", tall: true, position: "object-top" },
  { src: `${t}/salon-peinado-ondas.jpg`, alt: "Peinado de ondas en el salón Airam", category: "Peinados", tall: true },
  { src: `${t}/maquillaje-natural.jpg`, alt: "Maquillaje natural con delineado", category: "Maquillaje", tall: true, position: "object-top" },
  { src: `${t}/mechas-castano-espalda.jpg`, alt: "Mechas iluminadas en castaño oscuro", category: "Diseños de cabello", tall: true, position: "object-top" },
  { src: `${t}/maquillaje-dorado-glitter.jpg`, alt: "Maquillaje dorado con glitter y labios rojos", category: "Maquillaje", tall: true, position: "object-top" },
  { src: "/images/despues-cabello.jpg", alt: "Cambio de look: mechas rubias y alaciado", category: "Cambios de look", tall: true, position: "object-top" },
  { src: `${t}/maquillaje-elegante.jpg`, alt: "Maquillaje elegante con labios vino", category: "Maquillaje", tall: true, position: "object-top" },
  { src: `${t}/balayage-rubio.jpg`, alt: "Balayage rubio con alaciado", category: "Diseños de cabello", tall: true, position: "object-top" },
  { src: `${t}/maquillaje-dorado-suave.jpg`, alt: "Maquillaje dorado suave", category: "Maquillaje", tall: true, position: "object-top" },
  { src: `${t}/unas-almendra-flores.jpg`, alt: "Uñas almendradas con francés y flores secas", category: "Uñas", tall: true },
  { src: `${t}/maquillaje-peinado-ondas.jpg`, alt: "Maquillaje con delineado y peinado de ondas", category: "Maquillaje", tall: true, position: "object-top" },
  { src: `${t}/salon-trabajando.jpg`, alt: "Alaciado en el salón Airam", category: "Peinados", tall: true },
];

/* ───────────────────────── ¿Por qué elegirnos? ───────────────────────── */

export type Reason = { title: string; description: string; icon: LucideIcon };

export const reasons: Reason[] = [
  {
    title: "Atención personalizada",
    description: "Escuchamos lo que deseas y diseñamos cada servicio pensando en ti.",
    icon: UserRound,
  },
  {
    title: "Profesionales especializados",
    description: "Estilistas en constante capacitación en las últimas técnicas y tendencias.",
    icon: Award,
  },
  {
    title: "Productos de calidad",
    description: "Trabajamos con marcas profesionales que cuidan y protegen tu cabello y piel.",
    icon: Gem,
  },
  {
    title: "Ambiente cómodo y agradable",
    description: "Un espacio acogedor y relajante para que disfrutes cada minuto.",
    icon: Sofa,
  },
  {
    title: "Compromiso con tu satisfacción",
    description: "Tu felicidad con el resultado es nuestra mejor carta de presentación.",
    icon: HeartHandshake,
  },
];

/* ───────────────────────── Testimonios ─────────────────────────
 * ⚠️ DEMOSTRATIVOS: sustitúyelos por opiniones reales de clientas
 * (con su permiso) y cambia `testimonialsAreDemo` a false.
 */
export const testimonialsAreDemo = true;

export const testimonials = [
  {
    name: "Clienta de ejemplo 1",
    service: "Balayage",
    rating: 5,
    text: "Texto de ejemplo: me encantó el resultado de mi balayage, se ve natural y luminoso. La atención fue excelente.",
  },
  {
    name: "Clienta de ejemplo 2",
    service: "Peinado y maquillaje",
    rating: 5,
    text: "Texto de ejemplo: me arreglaron para la boda de mi hermana y me sentí espectacular toda la noche.",
  },
  {
    name: "Clienta de ejemplo 3",
    service: "Tratamiento capilar",
    rating: 5,
    text: "Texto de ejemplo: mi cabello estaba muy maltratado y después del tratamiento quedó suave y brillante.",
  },
  {
    name: "Clienta de ejemplo 4",
    service: "Manicure",
    rating: 5,
    text: "Texto de ejemplo: un lugar muy limpio y agradable, el diseño de uñas quedó tal como lo imaginé.",
  },
  {
    name: "Clienta de ejemplo 5",
    service: "Corte y color",
    rating: 5,
    text: "Texto de ejemplo: me asesoraron con el tono perfecto para mi piel. Ya agendé mi siguiente cita.",
  },
  {
    name: "Clienta de ejemplo 6",
    service: "Alaciado",
    rating: 5,
    text: "Texto de ejemplo: el alaciado me ahorra muchísimo tiempo cada mañana. ¡Súper recomendado!",
  },
];

/* ───────────────────────── Promociones ─────────────────────────
 * Promociones de ejemplo: ajusta textos, descuentos y vigencias.
 */
export type Promotion = {
  badge: string;
  title: string;
  description: string;
  includes: string[];
  image: string;
  featured?: boolean;
};

export const promotions: Promotion[] = [
  {
    badge: "-20%",
    title: "Martes de color",
    description: "Descuento especial en tintes y colorimetría todos los martes.",
    includes: ["Diagnóstico de color", "Tinte completo o retoque", "Tratamiento de brillo"],
    image: "/images/trabajos/mechas-rubias-largo.jpg",
  },
  {
    badge: "Paquete Novia",
    title: "Día de novia",
    description: "Luce radiante en tu gran día con un paquete completo de belleza.",
    includes: ["Prueba de peinado y maquillaje", "Peinado y maquillaje del evento", "Manicure de regalo"],
    image: "/images/trabajos/recogido-maquillaje.jpg",
    featured: true,
  },
  {
    badge: "2x1",
    title: "Manos y pies",
    description: "Manicure y pedicure spa con precio especial al reservarlos juntos.",
    includes: ["Manicure spa", "Pedicure spa", "Esmaltado en gel"],
    image: "/images/trabajos/unas-dorado-verde.jpg",
  },
];
