import { requireAdmin } from "@/lib/booking/auth";
import { type AppointmentPatch, STATUSES, deleteAppointment, updateAppointment } from "@/lib/booking/repo";
import { ISO_DATE_RE, TIME_RE } from "@/lib/booking/time";
import type { AppointmentStatus } from "@/lib/booking/types";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const b = ((await req.json().catch(() => null)) ?? {}) as Record<string, unknown>;

  const patch: AppointmentPatch = {};
  if (b.status !== undefined) {
    if (!STATUSES.includes(b.status as AppointmentStatus))
      return Response.json({ error: "Estado no válido." }, { status: 400 });
    patch.status = b.status as AppointmentStatus;
  }
  if (b.date !== undefined || b.time !== undefined) {
    if (typeof b.date !== "string" || !ISO_DATE_RE.test(b.date) || typeof b.time !== "string" || !TIME_RE.test(b.time))
      return Response.json({ error: "Fecha u hora no válida." }, { status: 400 });
    patch.date = b.date;
    patch.time = b.time;
  }
  if (typeof b.notes === "string") patch.notes = b.notes.slice(0, 1000);

  const result = await updateAppointment(id, patch);
  if (result === "not-found") return Response.json({ error: "La cita no existe." }, { status: 404 });
  if (result === "conflict")
    return Response.json({ error: "Ese horario ya está ocupado por otra cita." }, { status: 409 });
  return Response.json(result);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  await deleteAppointment(id);
  return Response.json({ ok: true });
}
