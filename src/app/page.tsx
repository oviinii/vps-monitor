"use client";
import { useEffect, useState } from "react";

type Svc = { id: string; name: string; port: number; url: string; description: string; ok: boolean; ms: number; status?: number; error?: string };

export default function Page() {
  const [data, setData] = useState<{ at: string; services: Svc[] } | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      const j = await res.json();
      setData(j);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  const allOk = data?.services.every((s) => s.ok);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <header className="flex flex-wrap items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-purple-600 grid place-items-center font-black">◉</div>
        <div>
          <h1 className="text-xl font-black tracking-tight">VPS Monitor</h1>
          <p className="text-xs text-zinc-400">187.127.52.68 • checa a cada 30s • alerta no Telegram</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-black ${allOk ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>{allOk ? "● TUDO OK" : "● FALHA"}</span>
          <button onClick={load} disabled={loading} className="border border-white/10 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-white/5 disabled:opacity-50">
            {loading ? "..." : "Recarregar"}
          </button>
          <button onClick={() => fetch("/api/check").then(() => load())} className="bg-amber-400 text-zinc-900 rounded-xl px-4 py-2 text-sm font-black hover:bg-amber-300">
            Testar alerta
          </button>
        </div>
      </header>

      {data && <p className="text-xs text-zinc-500">Última checagem: {new Date(data.at).toLocaleString("pt-BR")} • {data.services.filter((s) => s.ok).length}/{data.services.length} online</p>}

      <div className="grid md:grid-cols-2 gap-3">
        {data?.services.map((s) => (
          <div key={s.id} className={`rounded-2xl border p-4 flex items-start gap-3 ${s.ok ? "bg-zinc-900 border-white/5" : "bg-red-500/10 border-red-500/20"}`}>
            <div className={`w-3 h-3 rounded-full mt-1 ${s.ok ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]" : "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse"}`} />
            <div className="flex-1 min-w-0">
              <p className="font-bold leading-none">{s.name} <span className="text-zinc-500 font-mono text-xs">:{s.port}</span></p>
              <p className="text-xs text-zinc-500 truncate">{s.description} • {s.url}</p>
              <p className={`text-xs font-semibold mt-1 ${s.ok ? "text-emerald-400" : "text-red-400"}`}>
                {s.ok ? `OK • ${s.ms}ms • ${s.status}` : `FALHA • ${s.error || s.status} • ${s.ms}ms`}
              </p>
            </div>
            <span className={`text-xs font-black px-2.5 py-1 rounded-full ${s.ok ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}>{s.ok ? "UP" : "DOWN"}</span>
          </div>
        ))}
        {!data && <p className="text-zinc-500 col-span-2 py-12 text-center">Carregando...</p>}
      </div>

      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm">
        <p className="font-bold">Como funciona</p>
        <ul className="list-disc ml-5 mt-2 text-zinc-400 space-y-1">
          <li>Checa `fetch` em cada URL/porta com timeout 5s. Se `ok` muda (UP→DOWN ou DOWN→UP), envia Telegram.</li>
          <li>Configure `TELEGRAM_BOT_TOKEN` e `TELEGRAM_CHAT_ID` no `.env` (crie bot em @BotFather, Pegue chatId via @userinfobot).</li>
          <li>Na VPS adicione cron: `* * * * * curl -s http://localhost:3005/api/check &gt; /dev/null` para checagem a cada minuto mesmo sem acessar o painel.</li>
          <li>Logs: `docker logs vps-monitor -f`</li>
        </ul>
      </div>
    </div>
  );
}
