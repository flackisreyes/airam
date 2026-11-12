"use client";

import { Ban, CalendarCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { buildSlots, formatLongDate, weekday } from "@/lib/booking/time";
import type { Blocked } from "@/lib/booking/types";
import { cn } from "@/lib/utils";
import type { PanelData } from "./AdminPanel";
import { MonthGrid } from "./MonthGrid";
import { api } from "./api";

export function BlockingTab({ data, reload }: { data: PanelData; reload: () => Promise<void> }) {
  const { availability, appointments } = data;
  const { schedule, today } = availability;
  const [blocked, setBlocked] = useState<Blocked>(availability.blocked);
  const [selected, setSelected] = useState(today);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (next: Blocked) => {
    const prev = blocked;
    setBlocked(next); // actualización optimista
    setSaving(true);
    setError(null);
    try {
      setBlocked(await api<Blocked>("/api/admin/blocked", { method: "PUT", body: next }));
      reload();
    } catch (e) {
      setBlocked(prev);
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const dayClosed = blocked.dates.includes(selected);
  const weeklyClosed = schedule.closedWeekdays.includes(weekday(selected));
  const blockedSlots = new Set(blocked.slots[selected] ?? []);
  const dayAppointments = appointments.filter((a) => a.date === selected && a.status !== "cancelled");
  const apptByTime = new Map(dayAppointments.map((a) => [a.time, a]));
  const slots = buildSlots(schedule.firstSlot, schedule.lastSlot, schedule.stepMinutes);

  const toggleDay = () =>
    save({
      ...blocked,
      dates: dayClosed ? blocked.dates.filter((d) => d !== selected) : [...blocked.dates, selected],
    });

  const toggleSlot = (t: string) => {
    const list = blockedSlots.has(t) ? [...blockedSlots].filter((s) => s !== t) : [...blockedSlots, t];
    save({ ...blocked, slots: { ...blocked.slots, [selected]: list } });
  };

  const upcomingClosed = [...blocked.dates].filter((d) => d >= today).sort();

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
      <div className="space-y-4">
        <MonthGrid
          selected={selected}
          onSelect={setSelected}
          minDate={today}
          decorate={(iso) => {
            const closed = blocked.dates.includes(iso) || schedule.closedWeekdays.includes(weekday(iso));
            const partial = (blocked.slots[iso]?.length ?? 0) > 0;
            const count = appointments.filter((a) => a.date === iso && a.status !== "cancelled").length;
            return {
              className: closed ? "bg-blush-50 text-blush-500 line-through" : partial ? "bg-champagne-100" : undefined,
              badge:
                count > 0 ? (
                  <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-ink-800 px-1 text-[0.55rem] font-bold leading-4 text-cream">
                    {count}
                  </span>
                ) : null,
            };
          }}
        />
        <ul className="space-y-1 px-1 text-xs text-ink-500">
          <li className="flex items-center gap-2">
            <span className="size-3 rounded bg-blush-50 ring-1 ring-blush-200" /> Día cerrado
          </li>
          <li className="flex items-center gap-2">
            <span className="size-3 rounded bg-champagne-100 ring-1 ring-champagne-300" /> Algunas horas bloqueadas
          </li>
          <li className="flex items-center gap-2">
            <span className="grid size-3 place-items-center rounded-full bg-ink-800 text-[0.45rem] text-cream">2</span>
            Citas ese día
          </li>
        </ul>

        {upcomingClosed.length > 0 && (
          <div className="rounded-3xl bg-white p-4 ring-1 ring-nude-100">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">Próximos días cerrados</p>
            <div className="flex flex-wrap gap-2">
              {upcomingClosed.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelected(d)}
                  className="rounded-full bg-blush-50 px-3 py-1 text-xs text-blush-600 hover:bg-blush-100"
                >
                  {formatLongDate(d)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-nude-100 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl text-ink-900">{formatLongDate(selected)}</h2>
            <p className="mt-1 text-sm text-ink-500">
              {weeklyClosed
                ? "Este día de la semana está cerrado en el horario semanal."
                : dayClosed
                  ? "Día cerrado: no se puede reservar."
                  : "Toca una hora para bloquearla o desbloquearla."}
            </p>
          </div>
          {!weeklyClosed && (
            <button
              type="button"
              disabled={saving}
              onClick={toggleDay}
              className={cn("btn !py-2.5", dayClosed ? "btn-outline" : "btn-primary")}
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : dayClosed ? (
                <CalendarCheck className="size-4" />
              ) : (
                <Ban className="size-4" />
              )}
              {dayClosed ? "Abrir este día" : "Cerrar todo el día"}
            </button>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-blush-600">{error}</p>}

        {dayClosed && dayAppointments.length > 0 && (
          <p className="mt-4 rounded-2xl bg-champagne-100 px-4 py-3 text-sm text-champagne-600">
            Ojo: hay {dayAppointments.length} cita(s) este día. Cerrar el día no las cancela; avísales o muévelas desde
            la pestaña Citas.
          </p>
        )}

        {!weeklyClosed && !dayClosed && (
          <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5">
            {slots.map((t) => {
              const appt = apptByTime.get(t);
              const isBlocked = blockedSlots.has(t);
              if (appt)
                return (
                  <div
                    key={t}
                    title={`${appt.name} · ${appt.service}`}
                    className="rounded-xl bg-ink-900 px-2 py-2 text-center text-cream"
                  >
                    <p className="text-sm font-semibold">{t}</p>
                    <p className="truncate text-[0.65rem] text-nude-300">{appt.name.split(" ")[0]}</p>
                  </div>
                );
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleSlot(t)}
                  className={cn(
                    "rounded-xl border px-2 py-2 text-center transition",
                    isBlocked
                      ? "border-blush-200 bg-blush-50 text-blush-500"
                      : "border-nude-200 text-ink-700 hover:border-champagne-400 hover:bg-champagne-100",
                  )}
                >
                  <p className={cn("text-sm font-semibold", isBlocked && "line-through")}>{t}</p>
                  <p className="text-[0.65rem]">{isBlocked ? "Bloqueada" : "Libre"}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
