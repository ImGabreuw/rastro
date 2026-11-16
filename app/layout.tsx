import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rastro | Evidências públicas de contratos de TI",
  description:
    "Protótipo de consulta de evidências documentais públicas de contratações de TI.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
