import { ISO_DATE_RE, TIME_RE, toMinutes } from "./time";
import type { Blocked, Schedule } from "./types";

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function parseBookingInput(body: unknown): Result<{
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes: string;
}> {
  const b = (body ?? {}) as Record<string, unknown>;
  const name = str(b.name, 100);
  const phone = str(b.phone, 30);
  const service = str(b.service, 150);
  const date = str(b.date, 10);
  const time = str(b.time, 5);
  const notes = str(b.notes, 1000);
  const digits = phone.replace(/\D/g, "");
  if (name.length < 2) return { ok: false, error: "Escribe tu nombre." };
  if (digits.length < 10 || digits.length > 13) return { ok: false, error: "Número de WhatsApp no válido." };
  if (!service) return { ok: false, error: "Elige un servicio." };
  if (!ISO_DATE_RE.test(date)) return { ok: false, error: "Fecha no válida." };
  if (!TIME_RE.test(time)) return { ok: false, error: "Hora no válida." };
  return { ok: true, value: { name, phone, service, date, time, notes } };
}

export function parseSchedule(body: unknown): Result<Schedule> {
  const b = (body ?? {}) as Record<string, unknown>;
  const firstSlot = str(b.firstSlot, 5);
  const lastSlot = str(b.lastSlot, 5);
  const stepMinutes = Number(b.stepMinutes);
  const maxDaysAhead = Number(b.maxDaysAhead);
  const sameDayLeadMinutes = Number(b.sameDayLeadMinutes);
  const closedWeekdays = Array.isArray(b.closedWeekdays)
    ? [...new Set(b.closedWeekdays.map(Number).filter((n) => Number.isInteger(n) && n >= 0 && n <= 6))].sort()
    : [];
  if (!TIME_RE.test(firstSlot) || !TIME_RE.test(lastSlot)) return { ok: false, error: "Horas no válidas." };
  if (toMinutes(lastSlot) < toMinutes(firstSlot))
    return { ok: false, error: "La última cita debe ser después de la primera." };
  if (!Number.isInteger(stepMinutes) || stepMinutes < 5 || stepMinutes > 240)
    return { ok: false, error: "El intervalo debe estar entre 5 y 240 minutos." };
  if (!Number.isInteger(maxDaysAhead) || maxDaysAhead < 1 || maxDaysAhead > 365)
    return { ok: false, error: "Los días de antelación deben estar entre 1 y 365." };
  if (!Number.isInteger(sameDayLeadMinutes) || sameDayLeadMinutes < 0 || sameDayLeadMinutes > 1440)
    return { ok: false, error: "El margen del mismo día debe estar entre 0 y 1440 minutos." };
  if (closedWeekdays.length === 7) return { ok: false, error: "No puedes cerrar todos los días." };
  return { ok: true, value: { firstSlot, lastSlot, stepMinutes, closedWeekdays, maxDaysAhead, sameDayLeadMinutes } };
}

export function parseBlocked(body: unknown): Result<Blocked> {
  const b = (body ?? {}) as Record<string, unknown>;
  const dates = Array.isArray(b.dates) ? b.dates.filter((d): d is string => typeof d === "string" && ISO_DATE_RE.test(d)) : [];
  const slots: Record<string, string[]> = {};
  if (b.slots && typeof b.slots === "object") {
    for (const [d, list] of Object.entries(b.slots as Record<string, unknown>)) {
      if (!ISO_DATE_RE.test(d) || !Array.isArray(list)) continue;
      const valid = list.filter((t): t is string => typeof t === "string" && TIME_RE.test(t));
      if (valid.length) slots[d] = valid;
    }
  }
  return { ok: true, value: { dates, slots } };
}
