"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ZoomIn } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { Lightbox } from "@/components/ui/Lightbox";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gallery, galleryCategories, images } from "@/lib/data";
import { cn } from "@/lib/utils";

type Filter = (typeof galleryCategories)[number];

export function Gallery() {
  const [filter, setFilter] = useState<Filter>("Todos");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const items = useMemo(
    () => (filter === "Todos" ? gallery : gallery.filter((g) => g.category === filter)),
    [filter],
  );

  return (
    <section id="galeria" className="relative bg-gradient-to-b from-nude-50 to-blush-50 py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Galería"
          title={
            <>
              Nuestro trabajo <em className="text-gold">habla por nosotros</em>
            </>
          }
          description="Cambios de look, diseños de cabello, peinados, maquillajes y resultados de tratamientos."
        />

        {/* Antes y después */}
        <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <BeforeAfter
              before={images.before}
              after={images.after}
              beforePosition="object-right scale-[1.35] origin-[50%_45%]"
              afterPosition="object-center scale-[1.35] origin-[45%_45%]"
              alt="de cobrizo a mechas rubias con alaciado en Estética Airam"
            />
          </Reveal>
          <Reveal delay={0.15} className="text-center lg:text-left">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-champagne-600">Antes y después</p>
            <h3 className="mt-3 font-display text-4xl font-medium text-ink-900">Transformaciones que enamoran</h3>
            <p className="mt-4 leading-relaxed text-ink-500">
              Desliza para descubrir el cambio. Cada transformación comienza con un diagnóstico personalizado para lograr
              el resultado que sueñas, cuidando siempre la salud de tu cabello.
            </p>
            <p className="mt-4 text-xs italic text-ink-500/80">*Fotografías reales de nuestro salón.</p>
          </Reveal>
        </div>

        {/* Filtros */}
        <div className="no-scrollbar -mx-5 mt-20 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:justify-center md:px-0">
          {galleryCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              aria-pressed={filter === cat}
              className={cn(
                "relative shrink-0 rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] transition-colors",
                filter === cat ? "text-night" : "bg-nude-100/70 text-ink-600 hover:bg-nude-200",
              )}
            >
              {filter === cat && (
                <motion.span
                  layoutId="gallery-filter"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-champagne-600 to-champagne-400"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{cat}</span>
            </button>
          ))}
        </div>

        {/* Mosaico */}
        <motion.ul layout className="mt-10 grid auto-rows-[220px] grid-cols-2 gap-3 md:auto-rows-[260px] md:gap-5 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <motion.li
                layout
                key={item.src}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={cn(item.tall && "row-span-2")}
              >
                <button
                  type="button"
                  onClick={() => setLightbox(i)}
                  className="group relative block h-full w-full overflow-hidden rounded-2xl bg-nude-200 md:rounded-3xl"
                  aria-label={`Ampliar: ${item.alt}`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className={cn(
                      "object-cover transition-transform duration-700 group-hover:scale-110",
                      item.position,
                    )}
                  />
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-night/0 opacity-0 transition-all duration-500 group-hover:bg-night/45 group-hover:opacity-100">
                    <ZoomIn className="size-7 text-white" />
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white">
                      {item.category}
                    </span>
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      <Lightbox items={items} index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} />
    </section>
  );
}
