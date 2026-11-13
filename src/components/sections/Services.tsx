"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CalendarHeart } from "lucide-react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { services } from "@/lib/data";
import { whatsappUrl } from "@/lib/utils";

export function Services() {
  return (
    <section id="servicios" className="relative bg-cream py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Nuestros servicios"
          title={
            <>
              Belleza integral, <em className="text-gold">hecha para ti</em>
            </>
          }
          description="Cada servicio está pensado para realzar tu belleza natural, con técnicas actuales y productos profesionales."
        />

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-nude-50 shadow-[0_20px_50px_-25px_rgba(42,36,36,0.25)] ring-1 ring-nude-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-25px_rgba(195,129,122,0.45)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-[50%_25%] transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/50 via-night/0 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
                  <span className="absolute left-5 top-5 grid size-12 place-items-center rounded-full bg-nude-50/90 text-champagne-600 shadow-lg backdrop-blur transition-transform duration-500 group-hover:rotate-12">
                    <Icon className="size-5" />
                  </span>
                  <span className="absolute bottom-4 right-5 font-display text-5xl italic text-white/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-display text-2xl font-semibold text-ink-900">{service.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-500">{service.description}</p>
                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-nude-100 pt-5">
                    <a
                      href={whatsappUrl(
                        `¡Hola Estética Airam! ✨ Me gustaría recibir información sobre el servicio de *${service.title}*.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-champagne-600 transition-colors hover:text-blush-600"
                    >
                      <WhatsAppIcon className="size-4" />
                      Consultar
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                    <a
                      href={`#reservar`}
                      onClick={() =>
                        window.dispatchEvent(new CustomEvent("select-service", { detail: service.title }))
                      }
                      className="inline-flex items-center gap-1.5 rounded-full bg-blush-50 px-4 py-2 text-xs font-medium text-ink-700 transition-colors hover:bg-blush-100"
                    >
                      <CalendarHeart className="size-3.5" />
                      Agendar
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
