"use client";

import { motion } from "framer-motion";
import { Info, Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials, testimonialsAreDemo } from "@/lib/data";

export function Testimonials() {
  return (
    <section id="testimonios" className="relative bg-gradient-to-b from-blush-50 to-cream py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Testimonios"
          title={
            <>
              Lo que dicen <em className="text-gold">nuestras clientas</em>
            </>
          }
        />

        {testimonialsAreDemo && (
          <p className="mx-auto mt-6 flex max-w-xl items-center justify-center gap-2 rounded-full border border-champagne-300 bg-champagne-100/60 px-5 py-2.5 text-center text-xs text-champagne-600">
            <Info className="size-4 shrink-0" />
            Opiniones de ejemplo con fines demostrativos. Se sustituirán por reseñas reales.
          </p>
        )}

        <div className="no-scrollbar -mx-5 mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              className="relative w-[85%] shrink-0 snap-center rounded-[1.75rem] bg-nude-50 p-8 shadow-[0_20px_50px_-25px_rgba(42,36,36,0.2)] ring-1 ring-nude-100 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-25px_rgba(195,129,122,0.4)] md:w-auto"
            >
              <Quote className="absolute right-7 top-7 size-10 text-blush-100" aria-hidden />
              {testimonialsAreDemo && (
                <span className="mb-4 inline-block rounded-full bg-nude-100 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-ink-500">
                  Demostrativo
                </span>
              )}
              <div className="flex gap-1" aria-label={`${t.rating} de 5 estrellas`}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={s < t.rating ? "size-4 fill-champagne-400 text-champagne-400" : "size-4 text-nude-200"}
                  />
                ))}
              </div>
              <blockquote className="mt-5 font-display text-xl leading-snug text-ink-800">“{t.text}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-nude-100 pt-5">
                <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-blush-200 to-champagne-200 font-display text-lg font-semibold text-ink-800">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink-800">{t.name}</span>
                  <span className="text-xs text-champagne-600">{t.service}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
