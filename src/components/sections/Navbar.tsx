"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarHeart, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/ui/SocialIcons";
import { navLinks } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("#inicio");

  // Fondo al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Resalta la sección visible
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Bloquea scroll con el menú móvil abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500",
        scrolled
          ? "bg-cream/85 py-2 shadow-[0_8px_30px_-12px_rgba(42,36,36,0.15)] backdrop-blur-xl"
          : "bg-transparent py-4",
      )}
    >
      <nav className="container-x flex items-center justify-between" aria-label="Principal">
        <a
          href="#inicio"
          aria-label="Estética Airam – Inicio"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3"
        >
          <Logo size="sm" priority />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="text-[0.6rem] font-medium uppercase tracking-[0.45em] text-ink-600">Estética</span>
            <span className="font-script text-3xl text-gold">Airam</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  "relative px-3 py-2 text-[0.72rem] font-medium uppercase tracking-[0.2em] transition-colors",
                  active === link.href ? "text-champagne-600" : "text-ink-700 hover:text-champagne-600",
                )}
              >
                {link.label}
                {active === link.href && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-0.5 h-px bg-champagne-500"
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href="#reservar" className="btn btn-primary hidden !px-5 !py-3 sm:inline-flex">
            <CalendarHeart className="size-4" />
            Agenda tu cita
          </a>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-ink-800 transition hover:bg-blush-100 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[68px] bottom-0 overflow-y-auto bg-cream/98 backdrop-blur-xl lg:hidden"
          >
            <ul className="container-x flex flex-col gap-1 py-8">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-nude-200 py-4 font-display text-3xl text-ink-800 transition-colors hover:text-champagne-600"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="container-x flex flex-col gap-6 pb-12">
              <a href="#reservar" onClick={() => setOpen(false)} className="btn btn-primary w-full">
                <CalendarHeart className="size-4" />
                Agenda tu cita
              </a>
              <SocialLinks className="justify-center" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
