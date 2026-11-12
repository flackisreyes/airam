import { requireAdmin } from "@/lib/booking/auth";
import { getSchedule, saveSchedule } from "@/lib/booking/repo";
import { parseSchedule } from "@/lib/booking/validate";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return Response.json(await getSchedule());
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = parseSchedule(await req.json().catch(() => null));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  await saveSchedule(parsed.value);
  return Response.json(parsed.value);
}
