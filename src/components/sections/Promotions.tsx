"use client";

import { motion } from "framer-motion";
import { Check, Gift, Tag } from "lucide-react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { promotions } from "@/lib/data";
import { cn, whatsappUrl } from "@/lib/utils";

export function Promotions() {
  return (
    <section id="promociones" className="relative overflow-hidden bg-night py-24 md:py-32">
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-champagne-500/10 blur-3xl" aria-hidden />

      <div className="container-x relative">
        <SectionHeading
          light
          eyebrow="Promociones"
          title={
            <>
              Paquetes y descuentos <em className="text-gold">especiales</em>
            </>
          }
          description="Consiéntete con nuestras promociones del mes. Pregunta por vigencia y disponibilidad."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {promotions.map((promo, i) => (
            <motion.article
              key={promo.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "group relative rounded-[2rem] p-px transition-transform duration-500 hover:-translate-y-2",
                promo.featured
                  ? "bg-gradient-to-br from-champagne-300 via-champagne-500 to-blush-300 lg:-translate-y-4 lg:hover:-translate-y-6"
                  : "bg-gradient-to-br from-champagne-500/40 to-white/5",
              )}
            >
              <div className="flex h-full flex-col overflow-hidden rounded-[calc(2rem-1px)] bg-night-800">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night-800 via-night-800/20 to-transparent" />
                  <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blush-400 to-blush-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-night shadow-lg">
                    <Tag className="size-3.5" />
                    {promo.badge}
                  </span>
                  {promo.featured && (
                    <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-champagne-400 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-night">
                      <Gift className="size-3.5" />
                      Favorito
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-7 pt-2">
                  <h3 className="font-display text-3xl font-medium text-ink-900">{promo.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{promo.description}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {promo.includes.map((inc) => (
                      <li key={inc} className="flex items-center gap-3 text-sm text-ink-700">
                        <Check className="size-4 shrink-0 text-champagne-400" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={whatsappUrl(
                      `¡Hola Estética Airam! ✨ Me interesa la promoción *${promo.title}* (${promo.badge}). ¿Me pueden dar más información?`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("btn mt-8 w-full", promo.featured ? "btn-primary" : "border border-champagne-400/50 text-champagne-200 hover:bg-champagne-400 hover:text-night")}
                  >
                    <WhatsAppIcon className="size-4" />
                    Consultar promoción
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
