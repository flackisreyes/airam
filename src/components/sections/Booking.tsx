"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Loader2, MessageSquareText, Phone, Sparkles, UserRound } from "lucide-react";
import Image from "next/image";
import { type FormEvent, type ReactNode, useCallback, useEffect, useState } from "react";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { images, promotions, services } from "@/lib/data";
import { site } from "@/lib/site";
import type { Availability } from "@/lib/booking/types";
import { cn, whatsappUrl } from "@/lib/utils";

type FormState = {
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = { name: "", phone: "", service: "", date: "", time: "", notes: "" };

const serviceOptions = [
  ...services.map((s) => s.title),
  ...promotions.map((p) => `Promoción: ${p.title}`),
  "Otro / Asesoría personalizada",
];

type IconType = React.ComponentType<{ className?: string }>;

const steps: { icon: IconType; text: string }[] = [
  { icon: Sparkles, text: "Elige tu servicio favorito" },
  { icon: CalendarDays, text: "Selecciona fecha y horario" },
  { icon: WhatsAppIcon, text: "Envía tu solicitud por WhatsApp" },
];

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Escribe tu nombre.";
  const digits = f.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) e.phone = "Escribe un número de WhatsApp válido (10 dígitos).";
  if (!f.service) e.service = "Elige un servicio.";
  if (!f.date) e.date = "Elige una fecha en el calendario.";
  else if (!f.time) e.time = "Elige un horario.";
  return e;
}

export function Booking() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const loadAvailability = useCallback(async () => {
    try {
      const res = await fetch("/api/availability", { cache: "no-store" });
      if (res.ok) setAvailability(await res.json());
    } catch {
      /* se reintenta al enviar */
    }
  }, []);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  // Preselección del servicio desde las tarjetas de servicios
  useEffect(() => {
    const onSelect = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (serviceOptions.includes(detail)) setForm((f) => ({ ...f, service: detail }));
    };
    window.addEventListener("select-service", onSelect);
    return () => window.removeEventListener("select-service", onSelect);
  }, []);

  const update = (key: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const found = validate(form);
    setErrors(found);
    setSubmitError(null);
    if (Object.keys(found).length > 0) return;

    // Abrimos la pestaña ya (en el clic) para que el navegador no la bloquee tras la espera.
    const tab = window.open("", "_blank");
    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      // Si el servidor falla (p. ej. base de datos caída) seguimos con WhatsApp para no perder la cita.
      if (!res.ok && res.status < 500) {
        const { error } = (await res.json().catch(() => ({}))) as { error?: string };
        tab?.close();
        setSubmitError(error ?? "No pudimos registrar tu cita. Inténtalo de nuevo.");
        if (res.status === 409) {
          setForm((f) => ({ ...f, time: "" }));
          loadAvailability();
        }
        return;
      }
    } catch {
      /* sin respuesta del servidor: seguimos con WhatsApp */
    } finally {
      setSubmitting(false);
    }

    const lines = [
      "¡Hola Estética Airam! ✨ Me gustaría agendar una cita:",
      "",
      `👤 *Nombre:* ${form.name.trim()}`,
      `📱 *WhatsApp:* ${form.phone.trim()}`,
      `💇‍♀️ *Servicio:* ${form.service}`,
      `📅 *Fecha:* ${formatDate(form.date)}`,
      `🕐 *Hora:* ${form.time} h`,
    ];
    if (form.notes.trim()) lines.push(`📝 *Comentarios:* ${form.notes.trim()}`);
    lines.push("", "Quedo atenta a su confirmación. ¡Gracias! 💖");

    const url = whatsappUrl(lines.join("\n"));
    if (tab) {
      tab.opener = null;
      tab.location.href = url;
    } else {
      window.location.href = url;
    }
    setSentUrl(url);
    loadAvailability();
  };

  const reset = () => {
    setForm(initialState);
    setSentUrl(null);
  };

  return (
    <section id="reservar" className="relative bg-cream py-24 md:py-32">
      <div className="container-x">
        <Reveal className="grid overflow-hidden rounded-[2.5rem] bg-nude-50 shadow-[0_40px_80px_-40px_rgba(63,224,232,0.25)] ring-1 ring-nude-100 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Panel informativo */}
          <div className="relative min-h-[340px] overflow-hidden bg-night p-8 text-ink-900 md:p-12">
            <Image src={images.booking} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover opacity-35" />
            <div className="absolute inset-0 bg-gradient-to-br from-night/90 via-night/70 to-champagne-500/25" />
            <div className="relative flex h-full flex-col">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-champagne-300">Reservaciones</p>
              <h2 className="mt-4 font-display text-4xl font-medium leading-tight md:text-5xl">
                Agenda tu cita <em className="text-gold">en minutos</em>
              </h2>
              <p className="mt-5 max-w-sm leading-relaxed text-ink-600">
                Completa el formulario y envíanos tu solicitud por WhatsApp. Te confirmaremos la disponibilidad lo antes
                posible.
              </p>
              <ul className="mt-10 space-y-5 text-sm">
                {steps.map(({ icon: Icon, text }, i) => (
                  <li key={text} className="flex items-center gap-4">
                    <span className="grid size-10 place-items-center rounded-full border border-champagne-400/50 text-champagne-300">
                      <Icon className="size-4" />
                    </span>
                    <span>
                      <span className="mr-2 font-display text-lg text-champagne-300">0{i + 1}.</span>
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-10 text-xs text-ink-500">
                {site.hours.map((h) => (
                  <p key={h.days}>
                    <span className="text-champagne-300">{h.days}:</span> {h.time}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {sentUrl ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full flex-col items-center justify-center py-12 text-center"
                >
                  <CheckCircle2 className="size-16 text-champagne-500" />
                  <h3 className="mt-6 font-display text-3xl text-ink-900">¡Solicitud lista, {form.name.split(" ")[0]}!</h3>
                  <p className="mt-3 max-w-sm text-ink-500">
                    Abrimos WhatsApp con los datos de tu cita. Solo presiona <strong>enviar</strong> en el chat y te
                    confirmaremos a la brevedad.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      <WhatsAppIcon className="size-4" />
                      Abrir WhatsApp de nuevo
                    </a>
                    <button type="button" onClick={reset} className="btn btn-outline">
                      Nueva cita
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={onSubmit}
                  noValidate
                  className="grid gap-5 sm:grid-cols-2"
                >
                  <Field label="Nombre completo" icon={UserRound} error={errors.name} className="sm:col-span-2">
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="¿Cómo te llamas?"
                      value={form.name}
                      onChange={(e) => update("name")(e.target.value)}
                      className="field"
                      aria-invalid={!!errors.name}
                    />
                  </Field>

                  <Field label="Número de WhatsApp" icon={Phone} error={errors.phone}>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="10 dígitos"
                      value={form.phone}
                      onChange={(e) => update("phone")(e.target.value)}
                      className="field"
                      aria-invalid={!!errors.phone}
                    />
                  </Field>

                  <Field label="Servicio deseado" icon={Sparkles} error={errors.service}>
                    <select
                      id="service"
                      value={form.service}
                      onChange={(e) => update("service")(e.target.value)}
                      className={cn("field", !form.service && "text-nude-400")}
                      aria-invalid={!!errors.service}
                    >
                      <option value="" disabled>
                        Selecciona un servicio
                      </option>
                      {serviceOptions.map((s) => (
                        <option key={s} value={s} className="text-ink-800">
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    as="div"
                    label="Fecha y hora de tu cita"
                    icon={CalendarDays}
                    error={errors.date ?? errors.time}
                    className="sm:col-span-2"
                  >
                    <DateTimePicker
                      date={form.date}
                      time={form.time}
                      onDateChange={update("date")}
                      onTimeChange={update("time")}
                      availability={availability}
                    />
                  </Field>

                  <Field label="Comentarios (opcional)" icon={MessageSquareText} className="sm:col-span-2">
                    <textarea
                      id="notes"
                      rows={3}
                      placeholder="Cuéntanos qué te gustaría lograr…"
                      value={form.notes}
                      onChange={(e) => update("notes")(e.target.value)}
                      className="field resize-none"
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    {submitError && (
                      <p role="alert" className="mb-3 rounded-xl bg-blush-50 px-4 py-3 text-sm text-danger">
                        {submitError}
                      </p>
                    )}
                    <button type="submit" disabled={submitting} className="btn btn-primary w-full !py-4 disabled:opacity-70">
                      {submitting ? <Loader2 className="size-5 animate-spin" /> : <WhatsAppIcon className="size-5" />}
                      {submitting ? "Reservando tu horario…" : "Enviar solicitud por WhatsApp"}
                    </button>
                    <p className="mt-3 text-center text-xs text-ink-500">
                      Tu cita queda confirmada cuando te respondamos por WhatsApp.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

type FieldProps = {
  /** "div" cuando el contenido tiene varios controles (evita que la etiqueta active el primero). */
  as?: "label" | "div";
  label: string;
  icon: IconType;
  error?: string;
  className?: string;
  children: ReactNode;
};

function Field({ as: Tag = "label", label, icon: Icon, error, className, children }: FieldProps) {
  return (
    <Tag className={cn("block", className)}>
      <span className="mb-2 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink-600">
        <Icon className="size-3.5 text-champagne-500" />
        {label}
      </span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 block text-xs text-danger"
            role="alert"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </Tag>
  );
}
