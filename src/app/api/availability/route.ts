import { getAvailability } from "@/lib/booking/repo";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await getAvailability(), { headers: { "Cache-Control": "no-store" } });
}
