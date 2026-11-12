import { requireAdmin } from "@/lib/booking/auth";
import { getBlocked, saveBlocked } from "@/lib/booking/repo";
import { parseBlocked } from "@/lib/booking/validate";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return Response.json(await getBlocked());
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = parseBlocked(await req.json().catch(() => null));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  await saveBlocked(parsed.value);
  return Response.json(await getBlocked());
}
