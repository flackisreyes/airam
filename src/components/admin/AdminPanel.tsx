"use client";

import { CalendarCog, CalendarX2, ClipboardList, LogOut, RefreshCw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Appointment, Availability } from "@/lib/booking/types";
import { cn } from "@/lib/utils";
import { AppointmentsTab } from "./AppointmentsTab";
import { BlockingTab } from "./BlockingTab";
import { ScheduleTab } from "./ScheduleTab";
import { api } from "./api";

const TABS = [
  { id: "citas", label: "Citas", icon: ClipboardList },
  { id: "bloqueos", label: "Bloquear días y horas", icon: CalendarX2 },
  { id: "horario", label: "Horario", icon: CalendarCog },
] as const;

type TabId = (typeof TABS)[number]["id"];

export type PanelData = { appointments: Appointment[]; availability: Availability };

export function AdminPanel({ storageWarning, localStorage }: { storageWarning: boolean; localStorage: boolean }) {
  const [tab, setTab] = useState<TabId>("citas");
  const [data, setData] = useState<PanelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setData(await api<PanelData>("/api/admin/appointments"));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
    // Refresca al volver a la pestaña para ver citas nuevas.
    const onFocus = () => document.visibilityState === "visible" && reload();
    document.addEventListener("visibilitychange", onFocus);
    return () => document.removeEventListener("visibilitychange", onFocus);
  }, [reload]);

  const logout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.reload();
  };

  const pending = data?.appointments.filter((a) => a.status === "pending" && a.date >= data.availability.today).length ?? 0;

  return (
    <div className="min-h-dvh bg-cream">
      <header className="sticky top-0 z-20 border-b border-nude-200 bg-nude-50/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <Link href="/" className="font-display text-2xl text-ink-900">
              Estética Airam
            </Link>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-champagne-600">Administración</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={reload}
              aria-label="Actualizar"
              className="grid size-10 place-items-center rounded-full text-ink-600 hover:bg-nude-100"
            >
              <RefreshCw className={cn("size-4", loading && "animate-spin")} />
            </button>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm text-ink-600 hover:bg-nude-100"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm transition",
                tab === id
                  ? "border-champagne-500 font-semibold text-ink-900"
                  : "border-transparent text-ink-500 hover:text-ink-800",
              )}
            >
              <Icon className="size-4" />
              {label}
              {id === "citas" && pending > 0 && (
                <span className="rounded-full bg-blush-500 px-2 py-0.5 text-[0.65rem] font-bold text-night">
                  {pending}
                </span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {storageWarning && (
          <Notice>
            Modo demostración: las citas son de ejemplo. Puedes probar todo, pero los cambios se borran cuando Vercel
            reinicia el servidor.
          </Notice>
        )}
        {localStorage && (
          <Notice tone="info">
            Modo local: los datos se guardan en <code>.data/db.json</code> en este ordenador.
          </Notice>
        )}
        {error && <Notice>{error}</Notice>}

        {!data ? (
          <p className="py-20 text-center text-sm text-ink-500">Cargando…</p>
        ) : tab === "citas" ? (
          <AppointmentsTab data={data} reload={reload} />
        ) : tab === "bloqueos" ? (
          <BlockingTab data={data} reload={reload} />
        ) : (
          <ScheduleTab schedule={data.availability.schedule} reload={reload} />
        )}
      </main>
    </div>
  );
}

function Notice({ children, tone = "warn" }: { children: React.ReactNode; tone?: "warn" | "info" }) {
  return (
    <p
      className={cn(
        "mb-4 flex items-start gap-2 rounded-2xl px-4 py-3 text-sm",
        tone === "warn" ? "bg-blush-100 text-danger" : "bg-champagne-100 text-champagne-600",
      )}
    >
      <TriangleAlert className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
