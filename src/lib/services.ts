export type Service = {
  id: string;
  name: string;
  url: string; // http check
  port: number;
  container?: string;
  description: string;
};

// Ajuste HOST conforme onde o monitor roda. Em Docker no VPS, use host.docker.internal ou IP
const HOST = process.env.MONITOR_HOST || "http://localhost";

export const SERVICES: Service[] = [
  { id: "valores-tarot", name: "Valores Tarot", url: `${HOST}:3000/login`, port: 3000, container: "valores-tarot-app-1", description: "Sistema Tarot (SQLite)" },
  { id: "zinbox", name: "Zinbox", url: `${HOST}:3002`, port: 3002, container: "zinbox", description: "CRM Zinbox" },
  { id: "lead-backend", name: "Lead Backend", url: `${HOST}:3001`, port: 3001, container: "lead-backend", description: "Lead Integra API" },
  { id: "lead-frontend", name: "Lead Frontend", url: `${HOST}:5173`, port: 5173, container: "lead-frontend", description: "Lead Frontend" },
  { id: "compras", name: "Compras App", url: `${HOST}:3003`, port: 3003, container: "compras-app", description: "Compras" },
  { id: "mock-openwa", name: "Mock OpenWA", url: `${HOST}:8000`, port: 8000, container: "lead-mock-openwa", description: "Mock WhatsApp" },
  { id: "caddy", name: "Caddy (80/443)", url: `${HOST}:80`, port: 80, container: "ma-web", description: "Reverse proxy" },
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
