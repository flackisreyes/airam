"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, Check, MessageCircle, Plus, Search, Trash2, X } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { promotions, services } from "@/lib/data";
import { buildSlots, formatLongDate } from "@/lib/booking/time";
import type { Appointment, AppointmentStatus, Availability } from "@/lib/booking/types";
import { cn } from "@/lib/utils";
import type { PanelData } from "./AdminPanel";
import { api, clientWhatsapp } from "./api";

const FILTERS = [
  { id: "upcoming", label: "Próximas" },
  { id: "pending", label: "Por confirmar" },
  { id: "past", label: "Pasadas" },
  { id: "cancelled", label: "Canceladas" },
  { id: "all", label: "Todas" },
] as const;
type Filter = (typeof FILTERS)[number]["id"];

const STATUS_STYLE: Record<AppointmentStatus, { label: string; className: string }> = {
  pending: { label: "Por confirmar", className: "bg-champagne-100 text-champagne-600" },
  confirmed: { label: "Confirmada", className: "bg-emerald-50 text-emerald-700" },
  cancelled: { label: "Cancelada", className: "bg-nude-100 text-ink-500 line-through" },
};

const serviceOptions = [
  ...services.map((s) => s.title),
  ...promotions.map((p) => `Promoción: ${p.title}`),
  "Otro / Asesoría personalizada",
];

/** Horas que el admin puede asignar: todas las del horario menos las ocupadas por otras citas. */
function adminSlots(a: Availability, date: string, ignoreTime?: string) {
  const taken = new Set((a.taken[date] ?? []).filter((t) => t !== ignoreTime));
  return buildSlots(a.schedule.firstSlot, a.schedule.lastSlot, a.schedule.stepMinutes).filter((s) => !taken.has(s));
}

export function AppointmentsTab({ data, reload }: { data: PanelData; reload: () => Promise<void> }) {
  const { appointments, availability } = data;
  const today = availability.today;
  const [filter, setFilter] = useState<Filter>("upcoming");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = appointments.filter((a) => {
      switch (filter) {
        case "upcoming":
          return a.date >= today && a.status !== "cancelled";
        case "pending":
          return a.date >= today && a.status === "pending";
        case "past":
          return a.date < today && a.status !== "cancelled";
        case "cancelled":
          return a.status === "cancelled";
        default:
          return true;
      }
    });
    if (q) list = list.filter((a) => `${a.name} ${a.phone} ${a.service}`.toLowerCase().includes(q));
    if (filter === "past" || filter === "all" || filter === "cancelled") list = [...list].reverse();
    return list;
  }, [appointments, filter, query, today]);

  const groups = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const a of filtered) map.set(a.date, [...(map.get(a.date) ?? []), a]);
    return [...map.entries()];
  }, [filtered]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm transition",
                filter === f.id ? "bg-ink-900 text-cream" : "bg-nude-50 text-ink-600 ring-1 ring-nude-200 hover:bg-nude-100",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <label className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-nude-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar clienta…"
              className="field !py-2 !pl-9"
            />
          </label>
          <button type="button" onClick={() => setCreating(true)} className="btn btn-primary shrink-0 !px-4 !py-2">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Nueva cita</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {creating && <NewAppointment availability={availability} onClose={() => setCreating(false)} reload={reload} />}
      </AnimatePresence>

      {groups.length === 0 ? (
        <p className="rounded-3xl bg-nude-50 py-16 text-center text-sm text-ink-500 ring-1 ring-nude-100">
          No hay citas en esta vista.
        </p>
      ) : (
        <div className="space-y-6">
          {groups.map(([date, list]) => (
            <section key={date}>
              <h2 className="mb-2 flex items-baseline gap-2 font-display text-xl text-ink-900">
                {formatLongDate(date)}
                {date === today && (
                  <span className="rounded-full bg-champagne-100 px-2 py-0.5 font-sans text-[0.65rem] font-semibold uppercase tracking-wider text-champagne-600">
                    Hoy
                  </span>
                )}
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {list.map((a) => (
                  <AppointmentCard key={a.id} appt={a} availability={availability} reload={reload} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function AppointmentCard({
  appt,
  availability,
  reload,
}: {
  appt: Appointment;
  availability: Availability;
  reload: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moving, setMoving] = useState(false);
  const [newDate, setNewDate] = useState(appt.date);
  const [newTime, setNewTime] = useState(appt.time);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      await reload();
      setMoving(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const patch = (body: Record<string, unknown>) =>
    run(() => api(`/api/admin/appointments/${appt.id}`, { method: "PATCH", body }));

  const remove = () => {
    if (!confirm(`¿Eliminar definitivamente la cita de ${appt.name}?`)) return;
    run(() => api(`/api/admin/appointments/${appt.id}`, { method: "DELETE" }));
  };

  const firstName = appt.name.split(" ")[0];
  const confirmMsg = `¡Hola ${firstName}! ✨ Te confirmamos tu cita en Estética Airam para *${appt.service}* el ${formatLongDate(appt.date).toLowerCase()} a las ${appt.time} h. ¡Te esperamos! 💖`;

  const moveSlots = adminSlots(availability, newDate, newDate === appt.date ? appt.time : undefined);
  const status = STATUS_STYLE[appt.status];

  return (
    <article className={cn("rounded-3xl bg-nude-50 p-5 shadow-sm ring-1 ring-nude-100", busy && "opacity-60")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-3xl leading-none text-ink-900">{appt.time}</p>
          <p className="mt-2 font-semibold text-ink-800">{appt.name}</p>
          <p className="text-sm text-ink-500">{appt.service}</p>
        </div>
        <span className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-semibold", status.className)}>
          {status.label}
        </span>
      </div>

      <a
        href={clientWhatsapp(appt.phone, "")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm text-ink-600 underline decoration-nude-300 underline-offset-2"
      >
        {appt.phone}
      </a>
      {appt.notes && <p className="mt-2 rounded-xl bg-nude-50 px-3 py-2 text-sm text-ink-600">“{appt.notes}”</p>}

      {moving && (
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-nude-50 p-3">
          <input
            type="date"
            value={newDate}
            min={availability.today}
            onChange={(e) => {
              setNewDate(e.target.value);
              setNewTime("");
            }}
            className="field !py-2"
          />
          <select value={newTime} onChange={(e) => setNewTime(e.target.value)} className="field !py-2">
            <option value="">Hora…</option>
            {moveSlots.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!newDate || !newTime || busy}
            onClick={() => patch({ date: newDate, time: newTime })}
            className="btn btn-primary col-span-1 !py-2 disabled:opacity-50"
          >
            Guardar
          </button>
          <button type="button" onClick={() => setMoving(false)} className="btn btn-outline !py-2">
            Cancelar
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-nude-100 pt-4">
        {appt.status === "pending" && (
          <Action onClick={() => patch({ status: "confirmed" })} icon={Check} tone="primary">
            Confirmar
          </Action>
        )}
        {appt.status !== "cancelled" && (
          <a
            href={clientWhatsapp(appt.phone, appt.status === "pending" || appt.status === "confirmed" ? confirmMsg : "")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
          >
            <MessageCircle className="size-3.5" />
            Escribir
          </a>
        )}
        {appt.status !== "cancelled" && (
          <Action onClick={() => setMoving((m) => !m)} icon={CalendarClock}>
            Cambiar fecha
          </Action>
        )}
        {appt.status !== "cancelled" ? (
          <Action onClick={() => patch({ status: "cancelled" })} icon={X}>
            Cancelar cita
          </Action>
        ) : (
          <Action onClick={() => patch({ status: "pending" })} icon={CalendarClock}>
            Reactivar
          </Action>
        )}
        <Action onClick={remove} icon={Trash2} tone="danger">
          Eliminar
        </Action>
      </div>
    </article>
  );
}

function Action({
  onClick,
  icon: Icon,
  children,
  tone,
}: {
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  tone?: "primary" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition",
        tone === "primary"
          ? "bg-ink-900 text-cream hover:bg-ink-700"
          : tone === "danger"
            ? "text-danger hover:bg-blush-50"
            : "bg-nude-100 text-ink-700 hover:bg-nude-200",
      )}
    >
      <Icon className="size-3.5" />
      {children}
    </button>
  );
}

function NewAppointment({
  availability,
  onClose,
  reload,
}: {
  availability: Availability;
  onClose: () => void;
  reload: () => Promise<void>;
}) {
  const [f, setF] = useState({ name: "", phone: "", service: "", date: availability.today, time: "", notes: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("/api/admin/appointments", { method: "POST", body: f });
      await reload();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      onSubmit={submit}
      className="mb-6 grid gap-3 rounded-3xl bg-nude-50 p-5 shadow-sm ring-1 ring-champagne-300 sm:grid-cols-2"
    >
      <p className="font-display text-2xl text-ink-900 sm:col-span-2">Nueva cita</p>
      <input required placeholder="Nombre" value={f.name} onChange={set("name")} className="field" />
      <input required placeholder="Teléfono (10 dígitos)" value={f.phone} onChange={set("phone")} className="field" />
      <select required value={f.service} onChange={set("service")} className="field sm:col-span-2">
        <option value="">Servicio…</option>
        {serviceOptions.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <input
        required
        type="date"
        min={availability.today}
        value={f.date}
        onChange={(e) => setF((s) => ({ ...s, date: e.target.value, time: "" }))}
        className="field"
      />
      <select required value={f.time} onChange={set("time")} className="field">
        <option value="">Hora…</option>
        {adminSlots(availability, f.date).map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <input placeholder="Notas (opcional)" value={f.notes} onChange={set("notes")} className="field sm:col-span-2" />
      {error && <p className="text-sm text-danger sm:col-span-2">{error}</p>}
      <div className="flex gap-2 sm:col-span-2">
        <button type="submit" disabled={busy} className="btn btn-primary disabled:opacity-60">
          Guardar cita
        </button>
        <button type="button" onClick={onClose} className="btn btn-outline">
          Cancelar
        </button>
      </div>
    </motion.form>
  );
}
