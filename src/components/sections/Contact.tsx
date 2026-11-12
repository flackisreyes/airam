import { Clock, Mail, MapPin, Navigation } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLinks, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { fullAddress, mapsDirectionsUrl, mapsEmbedUrl, site } from "@/lib/site";
import { whatsappUrl } from "@/lib/utils";

export function Contact() {
  return (
    <section id="contacto" className="relative bg-gradient-to-b from-cream to-nude-100 py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Ubicación y contacto"
          title={
            <>
              Te esperamos <em className="text-gold">con gusto</em>
            </>
          }
          description="Visítanos o escríbenos. Estaremos felices de atenderte y resolver tus dudas."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <Reveal className="space-y-4">
            <InfoCard icon={<MapPin className="size-5" />} title="Dirección">
              <p>{fullAddress}</p>
              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-champagne-600 hover:text-blush-600"
              >
                <Navigation className="size-3.5" /> Cómo llegar
              </a>
            </InfoCard>

            <InfoCard icon={<WhatsAppIcon className="size-5" />} title="WhatsApp">
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-champagne-600">
                {site.phoneDisplay}
              </a>
            </InfoCard>

            <InfoCard icon={<Mail className="size-5" />} title="Correo">
              <a href={`mailto:${site.email}`} className="hover:text-champagne-600">
                {site.email}
              </a>
            </InfoCard>

            <InfoCard icon={<Clock className="size-5" />} title="Horarios de atención">
              <ul className="space-y-1">
                {site.hours.map((h) => (
                  <li key={h.days} className="flex justify-between gap-4">
                    <span>{h.days}</span>
                    <span className="font-medium text-ink-800">{h.time}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>

            <div className="rounded-3xl bg-nude-50 p-6 ring-1 ring-nude-100">
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-ink-600">Síguenos</p>
              <SocialLinks />
            </div>
          </Reveal>

          <Reveal delay={0.15} className="relative min-h-[420px] overflow-hidden rounded-[2rem] shadow-xl ring-1 ring-nude-200">
            <iframe
              title={`Mapa de ubicación de ${site.name}`}
              src={mapsEmbedUrl}
              className="absolute inset-0 h-full w-full border-0 grayscale-[30%] sepia-[15%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5 rounded-3xl bg-nude-50 p-6 ring-1 ring-nude-100 transition-shadow duration-300 hover:shadow-lg">
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blush-100 to-champagne-100 text-champagne-600">
        {icon}
      </span>
      <div className="flex-1 text-sm leading-relaxed text-ink-500">
        <h3 className="mb-1 font-display text-xl font-semibold text-ink-900">{title}</h3>
        {children}
      </div>
    </div>
  );
}
