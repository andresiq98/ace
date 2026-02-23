import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ACE — Tênis Competitivo",
  description: "Liga privada de tênis entre amigos. Compete, pontue, suba no ranking.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#09090B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-background text-foreground overflow-hidden">
        <div className="mx-auto max-w-[430px] h-screen h-[100dvh] relative overflow-hidden bg-background shadow-[0_0_120px_rgba(204,255,0,0.04)]">
          {children}
        </div>
      </body>
    </html>
  );
}
