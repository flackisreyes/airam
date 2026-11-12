"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { parseISODate, toISODate } from "@/lib/booking/time";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

type Props = {
  selected: string;
  onSelect: (iso: string) => void;
  minDate?: string;
  /** Clases extra y contenido (p. ej. puntos) por día. */
  decorate?: (iso: string) => { className?: string; badge?: ReactNode };
};

/** Calendario mensual compacto para el panel. */
export function MonthGrid({ selected, onSelect, minDate, decorate }: Props) {
  const [view, setView] = useState(() => {
    const d = selected ? parseISODate(selected) : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const cells = useMemo(() => {
    const first = new Date(view.year, view.month, 1);
    const offset = (first.getDay() + 6) % 7;
    const days = new Date(view.year, view.month + 1, 0).getDate();
    const out: (string | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= days; d++) out.push(toISODate(new Date(view.year, view.month, d)));
    while (out.length % 7) out.push(null);
    return out;
  }, [view]);

  const move = (delta: number) =>
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const rawLabel = new Date(view.year, view.month, 1).toLocaleDateString("es-MX", { month: "long", year: "numeric" });
  const label = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);

  return (
    <div className="rounded-3xl bg-nude-50 p-4 shadow-sm ring-1 ring-nude-100">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="Mes anterior"
          className="grid size-9 place-items-center rounded-full hover:bg-nude-100"
        >
          <ChevronLeft className="size-4" />
        </button>
        <p className="font-display text-xl text-ink-900">{label}</p>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Mes siguiente"
          className="grid size-9 place-items-center rounded-full hover:bg-nude-100"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-[0.65rem] font-semibold uppercase text-ink-500">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-1">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((iso, i) => {
          if (!iso) return <span key={`e${i}`} />;
          const past = !!minDate && iso < minDate;
          const deco = decorate?.(iso) ?? {};
          return (
            <button
              key={iso}
              type="button"
              disabled={past}
              onClick={() => onSelect(iso)}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition",
                past && "cursor-not-allowed opacity-35",
                iso === selected ? "bg-ink-900 font-semibold text-cream" : cn("hover:bg-nude-100", deco.className),
              )}
            >
              {parseISODate(iso).getDate()}
              {deco.badge}
            </button>
          );
        })}
      </div>
    </div>
  );
}
