export async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.log("[telegram] missing env TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID, skip:", text.slice(0, 80));
    return { skipped: true };
  }
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) console.error("[telegram] error", j);
  return j;
}

export function formatAlert(svc: { name: string; url: string; port: number }, result: { status?: number; error?: string; ms: number }, isUp: boolean) {
  const icon = isUp ? "✅" : "🚨";
  const status = isUp ? "VOLTOU" : "Caiu";
  return `${icon} <b>${svc.name} ${status}</b>\n` + `Porta: ${svc.port}\nURL: ${svc.url}\n` + (result.error ? `Erro: ${result.error}\n` : `Status: ${result.status} • ${result.ms}ms\n`) + `Hora: ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}`;
}
