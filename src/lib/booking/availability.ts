import type { Availability } from "./types";
import { buildSlots, toMinutes, weekday } from "./time";

/**
 * Horarios libres para un día según horario, bloqueos y citas ocupadas.
 * `nowMinutes` solo se aplica si el día es hoy.
 */
export function freeSlotsFor(a: Availability, date: string, nowMinutes?: number, ignoreTime?: string) {
  const { schedule, blocked, taken, today } = a;
  if (date < today) return [];
  if (schedule.closedWeekdays.includes(weekday(date))) return [];
  if (blocked.dates.includes(date)) return [];
  const blockedSlots = new Set(blocked.slots[date] ?? []);
  const takenSlots = new Set((taken[date] ?? []).filter((t) => t !== ignoreTime));
  let slots = buildSlots(schedule.firstSlot, schedule.lastSlot, schedule.stepMinutes).filter(
    (s) => !blockedSlots.has(s) && !takenSlots.has(s),
  );
  if (date === today && nowMinutes !== undefined) {
    const cutoff = nowMinutes + schedule.sameDayLeadMinutes;
    slots = slots.filter((s) => toMinutes(s) >= cutoff);
  }
  return slots;
}
