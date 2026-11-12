import { requireAdmin } from "@/lib/booking/auth";
import { createAppointment, getAvailability, listAppointments } from "@/lib/booking/repo";

import { parseBookingInput } from "@/lib/booking/validate";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const [appointments, availability] = await Promise.all([listAppointments(), getAvailability()]);
  return Response.json({ appointments, availability });
}

/** Crear una cita manualmente (p. ej. una que llegó por teléfono). Ya entra confirmada. */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = parseBookingInput(await req.json().catch(() => null));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  const appt = await createAppointment(parsed.value, "confirmed");
  if (!appt) return Response.json({ error: "Ese horario ya está ocupado por otra cita." }, { status: 409 });
  return Response.json(appt, { status: 201 });
}
