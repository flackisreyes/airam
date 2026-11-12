import { freeSlotsFor } from "@/lib/booking/availability";
import { createAppointment, getAvailability, maxBookableDate } from "@/lib/booking/repo";
import { nowInSalon } from "@/lib/booking/time";
import { parseBookingInput } from "@/lib/booking/validate";

export const dynamic = "force-dynamic";

/** Crea una solicitud de cita (estado "pendiente") y bloquea el horario. */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Solicitud no válida." }, { status: 400 });
  }
  const parsed = parseBookingInput(body);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  const input = parsed.value;

  const availability = await getAvailability();
  if (input.date > maxBookableDate(availability.schedule, availability.today))
    return Response.json({ error: "Esa fecha todavía no está abierta para reservas." }, { status: 400 });

  const free = freeSlotsFor(availability, input.date, nowInSalon().minutes);
  if (!free.includes(input.time))
    return Response.json({ error: "Ese horario ya no está disponible. Elige otro, por favor." }, { status: 409 });

  const appt = await createAppointment(input);
  if (!appt)
    return Response.json({ error: "Alguien acaba de reservar ese horario. Elige otro, por favor." }, { status: 409 });

  return Response.json({ id: appt.id }, { status: 201 });
}
