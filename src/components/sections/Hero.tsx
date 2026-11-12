"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, CalendarHeart, Gem, MessageCircleHeart, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { Logo } from "@/components/ui/Logo";
import { images } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-blush-50 via-cream to-nude-100 pt-28 pb-20 md:pt-32 lg:min-h-screen lg:pb-24"
    >
      {/* Decoración */}
      <div className="pointer-events-none absolute -left-40 top-20 size-[28rem] rounded-full bg-blush-200/50 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-[26rem] rounded-full bg-champagne-500/15 blur-3xl" aria-hidden />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        {/* Texto */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="mb-8 flex justify-center lg:justify-start"
          >
            <Logo size="lg" priority />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease }}
            className="font-display text-5xl font-medium leading-[1.05] text-ink-900 sm:text-6xl xl:text-7xl"
          >
            Resalta tu belleza,{" "}
            <span className="text-gold animate-shimmer italic">descubre tu mejor versión</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-500 lg:mx-0"
          >
            En Estética Airam cuidamos cada detalle para que luzcas y te sientas espectacular.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <a href="#reservar" className="btn btn-primary w-full sm:w-auto">
              <CalendarHeart className="size-4" />
              Agenda tu cita
            </a>
            <a href="#servicios" className="btn btn-outline w-full sm:w-auto">
              Conoce nuestros servicios
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium uppercase tracking-[0.2em] text-ink-600 lg:justify-start"
          >
            {["Atención personalizada", "Productos profesionales", "Resultados que enamoran"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Sparkles className="size-3.5 text-champagne-500" />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Imagen */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="absolute -inset-3 translate-x-4 translate-y-4 rounded-t-full rounded-b-[2rem] border border-champagne-400/70" aria-hidden />
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2rem] bg-nude-200 shadow-2xl shadow-blush-300/40">
            <motion.div style={{ y: imageY }} className="absolute inset-0 -top-[6%] h-[112%]">
              <Image
                src={images.hero}
                alt="Maquillaje y peinado profesional en Estética Airam"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover object-[50%_15%]"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-night/25 via-transparent to-transparent" aria-hidden />
          </div>

          {/* Tarjetas flotantes */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.9, ease }}
            className="absolute -left-4 bottom-16 sm:-left-10"
          >
            <div className="animate-float flex items-center gap-3 rounded-2xl bg-nude-50/90 px-4 py-3 shadow-xl backdrop-blur">
              <span className="grid size-10 place-items-center rounded-full bg-blush-100 text-blush-600">
                <Gem className="size-5" />
              </span>
              <span className="text-left">
                <span className="block font-display text-lg leading-none text-ink-900">Calidad premium</span>
                <span className="text-xs text-ink-500">Marcas profesionales</span>
              </span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease }}
            className="absolute -right-2 top-16 sm:-right-8"
          >
            <div className="animate-float flex items-center gap-3 rounded-2xl bg-nude-50/90 px-4 py-3 shadow-xl backdrop-blur [animation-delay:1.5s]">
              <span className="grid size-10 place-items-center rounded-full bg-champagne-100 text-champagne-600">
                <MessageCircleHeart className="size-5" />
              </span>
              <span className="text-left">
                <span className="block font-display text-lg leading-none text-ink-900">Agenda fácil</span>
                <span className="text-xs text-ink-500">Directo por WhatsApp</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <a
        href="#servicios"
        aria-label="Ir a servicios"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-ink-500 transition hover:text-champagne-600 lg:block"
      >
        <ArrowDown className="size-5 animate-bounce" />
      </a>
    </section>
  );
}
