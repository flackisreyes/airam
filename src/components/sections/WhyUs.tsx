"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Logo } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { images, reasons, salonSpace } from "@/lib/data";

export function WhyUs() {
  return (
    <section id="nosotros" className="relative overflow-hidden bg-cream py-24 md:py-32">
      <div className="container-x grid items-center gap-16 lg:grid-cols-2">
        {/* Collage */}
        <Reveal className="relative mx-auto w-full max-w-lg">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
            <Image
              src={images.salon}
              alt="Interior de Estética Airam"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-10 -right-4 aspect-square w-2/5 overflow-hidden rounded-[1.5rem] border-[6px] border-cream shadow-xl sm:-right-10">
            <Image src={images.salonDetail} alt="Detalle del salón" fill sizes="20vw" className="object-cover" />
          </div>
          <Logo className="absolute -left-4 -top-6 !size-28 border-4 border-cream sm:-left-8 sm:!size-32" />
        </Reveal>

        {/* Ventajas */}
        <div>
          <SectionHeading
            align="left"
            eyebrow="¿Por qué elegirnos?"
            title={
              <>
                Mucho más que un salón, <em className="text-gold">una experiencia</em>
              </>
            }
            description="En Estética Airam unimos técnica, pasión y calidez para que cada visita sea un momento especial dedicado a ti."
          />

          <ul className="mt-10 space-y-4">
            {reasons.map((reason, i) => {
              const Icon = reason.icon;
              return (
                <motion.li
                  key={reason.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="group flex items-start gap-5 rounded-2xl border border-transparent p-4 transition-all duration-300 hover:border-nude-200 hover:bg-nude-50 hover:shadow-lg"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blush-100 to-champagne-100 text-champagne-600 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink-900">{reason.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-500">{reason.description}</p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Conoce nuestro espacio */}
      <div className="container-x mt-28 md:mt-36">
        <Reveal className="text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-champagne-600">Nuestro salón</p>
          <h3 className="mt-3 font-display text-4xl font-medium text-ink-900">
            Conoce <em className="text-gold">nuestro espacio</em>
          </h3>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ink-500">
            Un lugar cálido y lleno de detalles, pensado para que te sientas como en casa mientras te consentimos.
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-3 md:gap-6">
          {salonSpace.map((photo, i) => (
            <li key={photo.src}>
              <Reveal delay={i * 0.1} className="group relative aspect-[3/4] overflow-hidden rounded-[1.5rem] shadow-xl">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className={`object-cover transition-transform duration-700 group-hover:scale-105 ${photo.position}`}
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
