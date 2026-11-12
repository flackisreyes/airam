import { checkPassword, createSession, destroySession, devLoginEnabled, isAdminConfigured } from "@/lib/booking/auth";

export const dynamic = "force-dynamic";

// Freno básico contra fuerza bruta (por instancia del servidor).
const attempts = new Map<string, { count: number; until: number }>();

/** Iniciar sesión. */
export async function POST(req: Request) {
  // Entrada directa sin contraseña: solo en desarrollo local.
  if (new URL(req.url).searchParams.has("dev")) {
    if (!devLoginEnabled) return Response.json({ error: "No disponible." }, { status: 403 });
    await createSession();
    return Response.json({ ok: true });
  }

  if (!isAdminConfigured())
    return Response.json({ error: "Falta configurar ADMIN_PASSWORD en el servidor." }, { status: 500 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const a = attempts.get(ip);
  if (a && a.count >= 5 && a.until > Date.now())
    return Response.json({ error: "Demasiados intentos. Espera unos minutos." }, { status: 429 });

  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (typeof password !== "string" || !checkPassword(password)) {
    const count = a && a.until > Date.now() ? a.count + 1 : 1;
    attempts.set(ip, { count, until: Date.now() + 10 * 60_000 });
    return Response.json({ error: "Contraseña incorrecta." }, { status: 401 });
  }
  attempts.delete(ip);
  await createSession();
  return Response.json({ ok: true });
}

/** Cerrar sesión. */
export async function DELETE() {
  await destroySession();
  return Response.json({ ok: true });
}
