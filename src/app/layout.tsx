import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "Cobra Pro Max - Batalha de Minhocas Arena",
  description: "Cobra Pro Max (com.cobrapromax.game) - O melhor jogo de cobras online em tela horizontal.",
  applicationName: "Cobra Pro Max",
  manifest: "/manifest.json",
  icons: { icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }, { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }], apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }] },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Cobra Pro Max" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 1, userScalable: false, themeColor: "#0c2b5e" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#0c2b5e] text-white antialiased overflow-hidden select-none touch-none">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
