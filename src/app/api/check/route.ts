import { SERVICES, checkService } from "@/lib/services";
import { sendTelegram, formatAlert } from "@/lib/telegram";

// memória simples para evitar spam: só avisa quando muda de estado
const lastState = new Map<string, boolean>(); // id -> ok
let lastCheck: any = null;

export async function GET() {
  const results: any[] = [];
  for (const svc of SERVICES) {
    const r = await checkService(svc);
    const prev = lastState.get(svc.id);
    const changed = prev !== undefined && prev !== r.ok;
    results.push({ service: svc, result: r, changed });
    // envia alerta se caiu ou voltou
    if (prev === undefined) {
      lastState.set(svc.id, r.ok);
      if (!r.ok) await sendTelegram(formatAlert(svc, r, false));
    } else if (changed) {
      lastState.set(svc.id, r.ok);
      await sendTelegram(formatAlert(svc, r, r.ok));
    } else {
      lastState.set(svc.id, r.ok);
    }
  }
  lastCheck = { at: new Date().toISOString(), results };
  return Response.json({ at: lastCheck.at, results: results.map((r) => ({ id: r.service.id, name: r.service.name, port: r.service.port, url: r.service.url, ok: r.result.ok, ms: r.result.ms, status: r.result.status, error: r.result.error })) });
}

// para debug: ver último estado sem checar de novo
export async function POST() {
  return GET();
}
