"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import { buildSlots } from "@/lib/booking/time";
import type { Schedule } from "@/lib/booking/types";
import { cn } from "@/lib/utils";
import { api } from "./api";

// Orden lunes → domingo
const DAYS = [
  { n: 1, label: "Lunes" },
  { n: 2, label: "Martes" },
  { n: 3, label: "Miércoles" },
  { n: 4, label: "Jueves" },
  { n: 5, label: "Viernes" },
  { n: 6, label: "Sábado" },
  { n: 0, label: "Domingo" },
];

export function ScheduleTab({ schedule, reload }: { schedule: Schedule; reload: () => Promise<void> }) {
  const [s, setS] = useState<Schedule>(schedule);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof Schedule>(k: K, v: Schedule[K]) => {
    setS((p) => ({ ...p, [k]: v }));
    setSaved(false);
  };

  const toggleDay = (n: number) =>
    set("closedWeekdays", s.closedWeekdays.includes(n) ? s.closedWeekdays.filter((d) => d !== n) : [...s.closedWeekdays, n]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      setS(await api<Schedule>("/api/admin/schedule", { method: "PUT", body: s }));
      setSaved(true);
      reload();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const preview = buildSlots(s.firstSlot, s.lastSlot, s.stepMinutes);

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6 rounded-3xl bg-nude-50 p-6 shadow-sm ring-1 ring-nude-100">
        <div>
          <h2 className="font-display text-2xl text-ink-900">Días que abres</h2>
          <p className="text-sm text-ink-500">Los días apagados no aparecerán disponibles en la web.</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {DAYS.map(({ n, label }) => {
              const open = !s.closedWeekdays.includes(n);
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => toggleDay(n)}
                  aria-pressed={open}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm transition",
                    open
                      ? "border-ink-900 bg-ink-900 text-cream"
                      : "border-nude-200 text-ink-400 line-through hover:bg-nude-50",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Labeled label="Primera cita">
            <input type="time" value={s.firstSlot} onChange={(e) => set("firstSlot", e.target.value)} className="field" />
          </Labeled>
          <Labeled label="Última cita">
            <input type="time" value={s.lastSlot} onChange={(e) => set("lastSlot", e.target.value)} className="field" />
          </Labeled>
          <Labeled label="Minutos entre citas">
            <select
              value={s.stepMinutes}
              onChange={(e) => set("stepMinutes", Number(e.target.value))}
              className="field"
            >
              {[15, 20, 30, 45, 60, 90, 120].map((m) => (
                <option key={m} value={m}>
                  {m} min
                </option>
              ))}
            </select>
          </Labeled>
          <Labeled label="Reservar con hasta (días)">
            <input
              type="number"
              min={1}
              max={365}
              value={s.maxDaysAhead}
              onChange={(e) => set("maxDaysAhead", Number(e.target.value))}
              className="field"
            />
          </Labeled>
          <Labeled label="Margen para citas del mismo día (min)" className="sm:col-span-2">
            <input
              type="number"
              min={0}
              max={1440}
              step={15}
              value={s.sameDayLeadMinutes}
              onChange={(e) => set("sameDayLeadMinutes", Number(e.target.value))}
              className="field"
            />
          </Labeled>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}
        <button type="submit" disabled={saving} className="btn btn-primary w-full disabled:opacity-60">
          {saving ? <Loader2 className="size-4 animate-spin" /> : saved && <CheckCircle2 className="size-4" />}
          {saved ? "Guardado" : "Guardar horario"}
        </button>
      </div>

      <div className="rounded-3xl bg-nude-50 p-6 shadow-sm ring-1 ring-nude-100">
        <h2 className="font-display text-2xl text-ink-900">Vista previa</h2>
        <p className="text-sm text-ink-500">Horas que verán tus clientas cada día abierto ({preview.length}).</p>
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {preview.map((t) => (
            <span key={t} className="rounded-lg border border-nude-200 py-1.5 text-center text-sm text-ink-700">
              {t}
            </span>
          ))}
        </div>
        <p className="mt-6 text-xs text-ink-500">
          Cambiar el horario no afecta a las citas ya agendadas. Para cerrar días sueltos (vacaciones, festivos) usa la
          pestaña «Bloquear días y horas».
        </p>
      </div>
    </form>
  );
}

function Labeled({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-ink-600">{label}</span>
      {children}
    </label>
  );
}
