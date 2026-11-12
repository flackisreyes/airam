import {
  Award,
  Brush,
  Crown,
  Droplets,
  Flower2,
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
import { unsplash } from "./utils";

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
 * Fotografías de stock (Unsplash) de referencia.
 * Sustitúyelas por fotos reales del salón: colócalas en /public/images
 * y usa rutas como "/images/corte.jpg".
 */
export const images = {
  hero: "/images/inicio-airam.jpg",
  salon: unsplash("1560066984-138dadb4c035", 1200),
  salonDetail: unsplash("1521590832167-7bcbfaa6381f", 900),
  booking: unsplash("1595475884562-073c30d45670", 1200),
  // Antes y después: deben ser fotos de la MISMA clienta.
  before: "/images/antes-cabello.jpg", // foto real del salón
  after: "/images/despues-cabello.jpg", // foto real del salón
};

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
    image: unsplash("1562322140-8baeececf3df", 800),
    icon: Scissors,
  },
  {
    id: "tintes",
    title: "Tintes y colorimetría",
    description:
      "Diagnóstico de color profesional para lograr el tono ideal, brillante y duradero.",
    image: unsplash("1580618672591-eb180b1a973f", 800),
    icon: Palette,
  },
  {
    id: "balayage",
    title: "Balayage y mechas",
    description:
      "Iluminaciones naturales, babylights y balayage con técnicas que cuidan la fibra capilar.",
    image: unsplash("1633681926022-84c23e8cb2d6", 800),
    icon: Sparkles,
  },
  {
    id: "peinados",
    title: "Peinados para eventos",
    description:
      "Recogidos, ondas y trenzas para bodas, XV años, graduaciones y ocasiones especiales.",
    image: unsplash("1519699047748-de8e457a634e", 800),
    icon: Crown,
  },
  {
    id: "maquillaje",
    title: "Maquillaje profesional",
    description:
      "Maquillaje social, de novia y de noche con productos de alta gama y acabado impecable.",
    image: unsplash("1487412947147-5cebf100ffc2", 800),
    icon: Brush,
  },
  {
    id: "tratamientos-capilares",
    title: "Tratamientos capilares",
    description:
      "Hidratación profunda, reconstrucción y botox capilar para un cabello sano y radiante.",
    image: unsplash("1527799820374-dcf8d9d4a388", 800),
    icon: Droplets,
  },
  {
    id: "alaciados",
    title: "Alaciados",
    description:
      "Alaciado permanente, keratina y nanoplastia para un liso sedoso, sin frizz y fácil de peinar.",
    image: unsplash("1595476108010-b4d1f102b1b1", 800),
    icon: Waves,
  },
  {
    id: "manicure-pedicure",
    title: "Manicure y pedicure",
    description:
      "Uñas impecables: gelish, acrílico, diseños personalizados y spa para manos y pies.",
    image: unsplash("1604654894610-df63bc536371", 800),
    icon: Hand,
  },
  {
    id: "belleza",
    title: "Cuidado y tratamientos de belleza",
    description:
      "Faciales, diseño de cejas, pestañas y rituales de cuidado para consentir tu piel.",
    image: unsplash("1570172619644-dfd03ed5d881", 800),
    icon: Flower2,
  },
];

/* ───────────────────────── Galería ───────────────────────── */

export const galleryCategories = [
  "Todos",
  "Cambios de look",
  "Diseños de cabello",
  "Peinados",
  "Maquillaje",
  "Tratamientos",
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

export const gallery: GalleryItem[] = [
  // ── Fotos reales del salón (carpeta recursos) ──
  { src: "/images/trabajos/balayage-rubio.jpg", alt: "Balayage rubio con alaciado", category: "Diseños de cabello", tall: true, position: "object-top" },
  { src: "/images/trabajos/maquillaje-peinado-ondas.jpg", alt: "Maquillaje con delineado y peinado de ondas", category: "Maquillaje", tall: true, position: "object-top" },
  { src: "/images/despues-cabello.jpg", alt: "Cambio de look: mechas rubias y alaciado", category: "Cambios de look", tall: true, position: "object-top" },
  { src: "/images/trabajos/unas-almendra-flores.jpg", alt: "Uñas almendradas con francés y flores secas", category: "Uñas", tall: true },
  // ── Fotos de referencia (stock): sustituir por fotos reales ──
  { src: unsplash("1492106087820-71f1a00d2b11", 1200), alt: "Cambio de look con cabello largo y brillante", category: "Cambios de look", tall: true },
  { src: unsplash("1516975080664-ed2fc6a32937", 1200), alt: "Maquillaje profesional de noche", category: "Maquillaje" },
  { src: unsplash("1559599101-f09722fb4948", 1200), alt: "Resultado de tratamiento capilar", category: "Tratamientos" },
  { src: unsplash("1526045478516-99145907023c", 1200), alt: "Diseño de cabello con ondas suaves", category: "Diseños de cabello", tall: true },
  { src: unsplash("1519415510236-718bdfcd89c8", 1200), alt: "Peinado elegante para evento", category: "Peinados" },
  { src: unsplash("1512496015851-a90fb38ba796", 1200), alt: "Maquillaje natural y luminoso", category: "Maquillaje", tall: true },
  { src: unsplash("1599351431202-1e0f0137899a", 1200), alt: "Alaciado con acabado sedoso", category: "Tratamientos" },
  { src: unsplash("1531123897727-8f129e1688ce", 1200), alt: "Nuevo estilo y color de cabello", category: "Cambios de look" },
  { src: unsplash("1610992015732-2449b76344bc", 1200), alt: "Detalle de manicure", category: "Uñas" },
  { src: unsplash("1508214751196-bcfd4ca60f91", 1200), alt: "Diseño de cabello con movimiento", category: "Diseños de cabello" },
  { src: unsplash("1515377905703-c4788e51af15", 1200), alt: "Peinado y estilo para sesión", category: "Peinados", tall: true },
  { src: unsplash("1596462502278-27bfdc403348", 1200), alt: "Productos y pinceles de maquillaje", category: "Maquillaje" },
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
    image: unsplash("1580618672591-eb180b1a973f", 900),
  },
  {
    badge: "Paquete Novia",
    title: "Día de novia",
    description: "Luce radiante en tu gran día con un paquete completo de belleza.",
    includes: ["Prueba de peinado y maquillaje", "Peinado y maquillaje del evento", "Manicure de regalo"],
    image: unsplash("1519699047748-de8e457a634e", 900),
    featured: true,
  },
  {
    badge: "2x1",
    title: "Manos y pies",
    description: "Manicure y pedicure spa con precio especial al reservarlos juntos.",
    includes: ["Manicure spa", "Pedicure spa", "Esmaltado en gel"],
    image: unsplash("1519014816548-bf5fe059798b", 900),
  },
];
