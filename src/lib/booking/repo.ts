import "server-only";
import { randomUUID } from "node:crypto";
import { site } from "@/lib/site";
import { store } from "./store";
import { addDays, nowInSalon } from "./time";
import type { Appointment, AppointmentStatus, Availability, Blocked, Schedule } from "./types";

const K = {
  schedule: "airam:schedule",
  blocked: "airam:blocked",
  appointments: "airam:appointments",
  slot: (date: string, time: string) => `airam:slot:${date}:${time}`,
};

export const defaultSchedule: Schedule = {
  firstSlot: site.booking.firstSlot,
  lastSlot: site.booking.lastSlot,
  stepMinutes: site.booking.stepMinutes,
  closedWeekdays: [...site.booking.closedWeekdays],
  maxDaysAhead: 60,
  sameDayLeadMinutes: 60,
};

export async function getSchedule(): Promise<Schedule> {
  return { ...defaultSchedule, ...((await store.get<Partial<Schedule>>(K.schedule)) ?? {}) };
}

export async function saveSchedule(s: Schedule) {
  await store.set(K.schedule, s);
}

export async function getBlocked(): Promise<Blocked> {
  const b = await store.get<Partial<Blocked>>(K.blocked);
  return { dates: b?.dates ?? [], slots: b?.slots ?? {} };
}

export async function saveBlocked(b: Blocked) {
  // Limpia días sin horas y fechas pasadas.
  const today = nowInSalon().date;
  const slots = Object.fromEntries(
    Object.entries(b.slots).filter(([d, list]) => d >= today && list.length > 0).map(([d, l]) => [d, [...new Set(l)].sort()]),
  );
  await store.set(K.blocked, { dates: [...new Set(b.dates.filter((d) => d >= today))].sort(), slots });
}

export async function listAppointments(): Promise<Appointment[]> {
  const all = await store.hgetall<Appointment>(K.appointments);
  return Object.values(all).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

export async function getAppointment(id: string) {
  return store.hget<Appointment>(K.appointments, id);
}

export async function getAvailability(): Promise<Availability> {
  const [schedule, blocked, appointments] = await Promise.all([getSchedule(), getBlocked(), listAppointments()]);
  const today = nowInSalon().date;
  const taken: Record<string, string[]> = {};
  for (const a of appointments) {
    if (a.status === "cancelled" || a.date < today) continue;
    (taken[a.date] ??= []).push(a.time);
  }
  return { schedule, blocked, taken, today };
}

export function maxBookableDate(schedule: Schedule, today: string) {
  return addDays(today, schedule.maxDaysAhead);
}

/** Reserva el hueco de forma atómica. Devuelve false si ya estaba ocupado. */
async function claimSlot(date: string, time: string, id: string) {
  return store.setNX(K.slot(date, time), id);
}

async function releaseSlot(date: string, time: string, id: string) {
  const owner = await store.get<string>(K.slot(date, time));
  if (owner === id) await store.del(K.slot(date, time));
}

export async function createAppointment(
  data: Omit<Appointment, "id" | "status" | "createdAt">,
  status: AppointmentStatus = "pending",
): Promise<Appointment | null> {
  const id = randomUUID();
  if (!(await claimSlot(data.date, data.time, id))) return null;
  const appt: Appointment = { ...data, id, status, createdAt: new Date().toISOString() };
  await store.hset(K.appointments, id, appt);
  return appt;
}

export type AppointmentPatch = Partial<Pick<Appointment, "status" | "date" | "time" | "notes">>;

/** Actualiza una cita. Devuelve "conflict" si el nuevo horario está ocupado. */
export async function updateAppointment(id: string, patch: AppointmentPatch) {
  const current = await getAppointment(id);
  if (!current) return "not-found" as const;
  const next: Appointment = { ...current, ...patch };

  const wasActive = current.status !== "cancelled";
  const isActive = next.status !== "cancelled";
  const moved = next.date !== current.date || next.time !== current.time;

  if (isActive && (moved || !wasActive)) {
    if (!(await claimSlot(next.date, next.time, id))) {
      // Puede que el hueco ya fuera suyo (p. ej. reactivar sin moverse).
      const owner = await store.get<string>(K.slot(next.date, next.time));
      if (owner !== id) return "conflict" as const;
    }
  }
  if (wasActive && (moved || !isActive)) await releaseSlot(current.date, current.time, id);

  await store.hset(K.appointments, id, next);
  return next;
}

export async function deleteAppointment(id: string) {
  const current = await getAppointment(id);
  if (!current) return;
  await releaseSlot(current.date, current.time, id);
  await store.hdel(K.appointments, id);
}

export const STATUSES: AppointmentStatus[] = ["pending", "confirmed", "cancelled"];
