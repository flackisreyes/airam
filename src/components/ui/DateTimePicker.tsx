"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { freeSlotsFor } from "@/lib/booking/availability";
import { addDays, formatLongDate, parseISODate, toISODate } from "@/lib/booking/time";
import type { Availability } from "@/lib/booking/types";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

type Props = {
  /** Fecha seleccionada YYYY-MM-DD ("" si ninguna). */
  date: string;
  /** Hora seleccionada "HH:MM" ("" si ninguna). */
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  /** Disponibilidad del servidor; null mientras carga. */
  availability: Availability | null;
};

function nowMinutes() {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}

export function DateTimePicker({ date, time, onDateChange, onTimeChange, availability }: Props) {
  const today = availability?.today ?? "";
  const maxDate = availability ? addDays(today, availability.schedule.maxDaysAhead) : "";

  const [view, setView] = useState(() => {
    const base = date ? parseISODate(date) : new Date();
    return { year: base.getFullYear(), month: base.getMonth() };
  });
  const [direction, setDirection] = useState(1);

  const rawMonth = new Date(view.year, view.month, 1).toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });
  const monthLabel = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);

  // Celdas del mes (semana empieza en lunes)
  const cells = useMemo(() => {
    const first = new Date(view.year, view.month, 1);
    const offset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const out: (string | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(toISODate(new Date(view.year, view.month, d)));
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [view]);

  const slotsFor = (iso: string) => (availability ? freeSlotsFor(availability, iso, nowMinutes()) : []);
  const isDisabled = (iso: string) => !availability || iso > maxDate || slotsFor(iso).length === 0;

  const firstOfView = toISODate(new Date(view.year, view.month, 1));
  const lastOfView = toISODate(new Date(view.year, view.month + 1, 0));
  const canPrev = !!today && firstOfView > today;
  const canNext = !!maxDate && lastOfView < maxDate;

  const move = (delta: number) => {
    setDirection(delta);
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const selectDate = (iso: string) => {
    onDateChange(iso);
    if (time && !slotsFor(iso).includes(time)) onTimeChange("");
  };

  const daySlots = date ? slotsFor(date) : [];

  return (
    <div className="grid gap-6 md:grid-cols-[1.15fr_1fr]">
      {/* Calendario */}
      <div className="relative rounded-2xl border border-nude-200 bg-nude-50/60 p-4">
        {!availability && (
          <div className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-nude-50/70">
            <Loader2 className="size-6 animate-spin text-champagne-500" />
          </div>
        )}
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={!canPrev}
            aria-label="Mes anterior"
            className="grid size-8 place-items-center rounded-full text-ink-600 transition hover:bg-blush-100 disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <p className="font-display text-lg text-ink-900" aria-live="polite">
            {monthLabel}
          </p>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={!canNext}
            aria-label="Mes siguiente"
            className="grid size-8 place-items-center rounded-full text-ink-600 transition hover:bg-blush-100 disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 text-center text-[0.65rem] font-semibold uppercase tracking-wider text-ink-500">
          {WEEKDAYS.map((d) => (
            <span key={d} className="py-1">
              {d}
            </span>
          ))}
        </div>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={`${view.year}-${view.month}`}
              custom={direction}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -24 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-7 gap-1"
            >
              {cells.map((iso, i) => {
                if (!iso) return <span key={`e${i}`} />;
                const disabled = isDisabled(iso);
                const selected = iso === date;
                const isToday = iso === today;
                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={disabled}
                    onClick={() => selectDate(iso)}
                    aria-pressed={selected}
                    aria-label={formatLongDate(iso)}
                    className={cn(
                      "relative aspect-square rounded-xl text-sm transition",
                      selected
                        ? "bg-ink-900 font-semibold text-cream shadow-md"
                        : disabled
                          ? "cursor-not-allowed text-nude-300 line-through decoration-nude-200"
                          : "text-ink-800 hover:bg-blush-100",
                    )}
                  >
                    {parseISODate(iso).getDate()}
                    {isToday && !selected && (
                      <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-champagne-500" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Horarios */}
      <div className="flex flex-col">
        <p className="mb-3 text-sm text-ink-600">
          {date ? (
            <>
              Horarios para <span className="font-semibold text-ink-900">{formatLongDate(date)}</span>
            </>
          ) : (
            "Elige primero un día en el calendario."
          )}
        </p>
        {date ? (
          daySlots.length > 0 ? (
            <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto pr-1">
              {daySlots.map((s) => {
                const selected = s === time;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onTimeChange(s)}
                    aria-pressed={selected}
                    className={cn(
                      "rounded-xl border py-2.5 text-sm transition",
                      selected
                        ? "border-ink-900 bg-ink-900 font-semibold text-cream"
                        : "border-nude-200 text-ink-700 hover:border-champagne-400 hover:bg-champagne-100",
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="rounded-2xl bg-blush-50 p-4 text-sm text-blush-600">
              Ya no quedan horarios libres este día. Elige otra fecha.
            </p>
          )
        ) : (
          <div className="grid flex-1 place-items-center rounded-2xl border border-dashed border-nude-200 p-6 text-center text-xs text-nude-400">
            Los horarios disponibles aparecerán aquí
          </div>
        )}
      </div>
    </div>
  );
}
