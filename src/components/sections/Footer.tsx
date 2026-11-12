import { Clock, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { navLinks, services } from "@/lib/data";
import { fullAddress, site } from "@/lib/site";
import { whatsappUrl } from "@/lib/utils";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink-900 text-nude-200">
      <div className="h-px bg-gradient-to-r from-transparent via-champagne-400 to-transparent" aria-hidden />

      {/* Llamado a la acción */}
      <div className="container-x flex flex-col items-center justify-between gap-6 border-b border-white/10 py-12 text-center md:flex-row md:text-left">
        <div>
          <p className="font-display text-3xl text-cream md:text-4xl">
            ¿Lista para tu <em className="text-gold">cambio de look</em>?
          </p>
          <p className="mt-2 text-sm text-nude-300">Agenda hoy y déjate consentir por nuestras expertas.</p>
        </div>
        <a href="#reservar" className="btn btn-primary shrink-0">
          Agenda tu cita
        </a>
      </div>

      <div className="container-x grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
        <div>
          <Logo className="!size-28" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-nude-300">
            {site.tagline}. Cuidamos cada detalle para que luzcas y te sientas espectacular.
          </p>
          <SocialLinks light className="mt-6" />
        </div>

        <nav aria-label="Pie de página">
          <h3 className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-champagne-300">Navegación</h3>
          <ul className="space-y-3 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-champagne-300">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#reservar" className="transition-colors hover:text-champagne-300">
                Reservar cita
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-champagne-300">Servicios</h3>
          <ul className="space-y-3 text-sm">
            {services.slice(0, 7).map((s) => (
              <li key={s.id}>
                <a href="#servicios" className="transition-colors hover:text-champagne-300">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-champagne-300">Contacto</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-champagne-400" />
              {fullAddress}
            </li>
            <li>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-champagne-300">
                <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-champagne-400" />
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex gap-3 hover:text-champagne-300">
                <Mail className="mt-0.5 size-4 shrink-0 text-champagne-400" />
                {site.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-champagne-400" />
              <span>
                {site.hours.map((h) => (
                  <span key={h.days} className="block">
                    {h.days}: {h.time}
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-nude-400 md:flex-row">
          <p>
            © {year} {site.name}. Todos los derechos reservados.
          </p>
          <p>Hecho con amor para resaltar tu belleza ✨</p>
        </div>
      </div>
    </footer>
  );
}
