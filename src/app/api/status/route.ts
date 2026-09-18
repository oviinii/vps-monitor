import { SERVICES, checkService } from "@/lib/services";

export async function GET() {
  const results = await Promise.all(
    SERVICES.map(async (svc) => {
      const r = await checkService(svc);
      return { id: svc.id, name: svc.name, port: svc.port, url: svc.url, description: svc.description, ok: r.ok, ms: r.ms, status: r.status, error: r.error };
    })
  );
  return Response.json({ at: new Date().toISOString(), services: results });
}
