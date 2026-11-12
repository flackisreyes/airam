# Estética Airam — Sitio web

Página web de **Estética Airam** hecha con Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion y Lucide React.

## Requisitos

- [Node.js](https://nodejs.org/) 20 LTS o superior (incluye npm).

## Ejecutar en local

```bash
npm install
npm run dev
```

Abre http://localhost:3000

Compilación de producción:

```bash
npm run build
npm start
```

## Personalizar (antes de publicar)

| Qué | Dónde |
| --- | --- |
| WhatsApp, teléfono, correo, dirección, redes, horarios | `src/lib/site.ts` |
| Servicios, galería, ventajas, testimonios, promociones | `src/lib/data.ts` |
| Colores y tipografías | `src/app/globals.css` (`@theme`) y `src/app/layout.tsx` |
| URL pública (SEO) | variable `NEXT_PUBLIC_SITE_URL` (ver `.env.example`) |

**WhatsApp:** el número va en formato internacional sin `+` ni espacios, p. ej. `5215512345678`.

**Fotografías:** el sitio usa fotos de stock de Unsplash como referencia. Para usar fotos reales del salón,
cópialas a `public/images/` y cambia las rutas en `src/lib/data.ts` (p. ej. `"/images/balayage-1.jpg"`).
Las fotos de "antes y después" deben ser de la misma clienta y con su autorización.

**Testimonios:** son de ejemplo y se muestran marcados como "Demostrativo". Sustitúyelos por reseñas reales
en `src/lib/data.ts` y cambia `testimonialsAreDemo` a `false`.

**Mapa:** se genera a partir de la dirección. Si prefieres el mapa exacto de tu ficha de Google, copia la URL de
"Compartir → Insertar un mapa" en `mapsEmbedUrl` (`src/lib/site.ts`).

## Estructura

```
src/
├─ app/
│  ├─ layout.tsx        # Fuentes, metadatos SEO y Open Graph
│  ├─ page.tsx          # Página principal (une las secciones)
│  ├─ globals.css       # Tema (colores, utilidades, botones)
│  ├─ sitemap.ts / robots.ts / icon.svg
├─ components/
│  ├─ sections/         # Navbar, Hero, Services, Gallery, WhyUs, Promotions,
│  │                    # Testimonials, Booking, Contact, Footer
│  └─ ui/               # Logo, Reveal, SectionHeading, BeforeAfter, Lightbox,
│                       # SocialIcons, WhatsAppFloat, JsonLd
└─ lib/
   ├─ site.ts           # Datos del negocio
   ├─ data.ts           # Contenido
   └─ utils.ts          # Helpers (WhatsApp, horarios, clases)
```

## Funcionalidades

- Navegación fija con resaltado de sección activa y menú móvil.
- Portada animada con parallax y llamados a la acción.
- 9 tarjetas de servicio con hover, consulta directa por WhatsApp y botón "Agendar" que preselecciona el servicio.
- Galería con filtros animados, ampliación (lightbox con teclado ← → Esc) y comparador antes/después.
- Formulario de citas con validación (fecha mínima, domingos cerrados, horarios) que abre WhatsApp con el mensaje armado.
- Promociones, testimonios, mapa de Google, horarios, redes y botón flotante de WhatsApp.
- SEO: metadatos, Open Graph, `sitemap.xml`, `robots.txt` y datos estructurados `BeautySalon` (schema.org).

## Desplegar

La forma más sencilla es [Vercel](https://vercel.com/): sube el proyecto a GitHub, impórtalo en Vercel y
define `NEXT_PUBLIC_SITE_URL` con tu dominio. También funciona en cualquier hosting con Node (`npm run build && npm start`).
