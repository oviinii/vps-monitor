export type Service = {
  id: string;
  name: string;
  url: string; // http check
  port: number;
  container?: string;
  description: string;
};

// Links de acesso reais (como o usuário acessa) — IP público + trycloudflare
const PUBLIC_IP = "http://187.127.52.68";
const HOST = process.env.MONITOR_HOST || PUBLIC_IP;

export const SERVICES: Service[] = [
  { id: "valores-tarot", name: "Valores Tarot", url: `${PUBLIC_IP}:3000/login`, port: 3000, container: "valores-tarot-app-1", description: "Acesso: http://187.127.52.68:3000/login" },
  { id: "zinbox", name: "Zinbox", url: `${PUBLIC_IP}:3002`, port: 3002, container: "zinbox", description: "Acesso: http://187.127.52.68:3002" },
  { id: "lead-backend", name: "Lead Backend", url: `${PUBLIC_IP}:3001`, port: 3001, container: "lead-backend", description: "Acesso: http://187.127.52.68:3001" },
  { id: "lead-frontend", name: "Lead Frontend", url: `${PUBLIC_IP}:5173`, port: 5173, container: "lead-frontend", description: "Acesso: http://187.127.52.68:5173" },
  { id: "compras", name: "Compras App", url: `${PUBLIC_IP}:3003`, port: 3003, container: "compras-app", description: "Acesso: http://187.127.52.68:3003" },
  { id: "mock-openwa", name: "Mock OpenWA", url: `${PUBLIC_IP}:8000`, port: 8000, container: "lead-mock-openwa", description: "Acesso: http://187.127.52.68:8000" },
  { id: "multi-atendimento", name: "Multi Atendimento", url: `https://checkout-combine-sam-utils.trycloudflare.com`, port: 443, container: "ma-web", description: "Acesso: https://checkout-combine-sam-utils.trycloudflare.com (via Caddy 80/443)" },
];

export async function checkService(s: Service, timeoutMs = 5000): Promise<{ ok: boolean; ms: number; status?: number; error?: string }> {
  const start = Date.now();
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(s.url, { signal: controller.signal, cache: "no-store" });
    clearTimeout(t);
    const ms = Date.now() - start;
    return { ok: res.ok || res.status < 500, ms, status: res.status };
  } catch (e: any) {
    clearTimeout(t);
    const ms = Date.now() - start;
    return { ok: false, ms, error: e.message || "fetch failed" };
  }
}
