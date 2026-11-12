import { site } from "./site";

/** Une clases condicionales sin dependencias externas. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Construye un enlace de WhatsApp con mensaje prellenado. */
export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** URL optimizada de Unsplash (Next/Image vuelve a optimizarla). */
export function unsplash(id: string, width = 1600) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}

/** Genera horarios "HH:MM" entre dos horas con un intervalo en minutos. */
export function timeSlots(from: string, to: string, step: number) {
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const slots: string[] = [];
  for (let t = toMin(from); t <= toMin(to); t += step) {
    const h = String(Math.floor(t / 60)).padStart(2, "0");
    const m = String(t % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
  }
  return slots;
}
