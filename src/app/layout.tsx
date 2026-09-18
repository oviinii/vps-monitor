import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VPS Monitor • Uptime",
  description: "Monitora containers e portas da VPS e avisa no Telegram",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#0a0a0f] text-white antialiased">{children}</body>
    </html>
  );
}
