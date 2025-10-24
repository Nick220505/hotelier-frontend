import React from "react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayoutWrapper } from "./client-layout-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hotelier",
  description:
    "Sistema integral de gestión hotelera. Simplifica la administración de tu hotel con herramientas modernas y eficientes.",
  keywords: [
    "hotel",
    "management",
    "gestión hotelera",
    "PMS",
    "sistema hotelero",
    "hotelier",
  ],
  authors: [{ name: "Hotelier Team" }],
  creator: "Hotelier",
  publisher: "Hotelier",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Hotelier",
    description: "Sistema integral de gestión hotelera",
    type: "website",
    locale: "es_ES",
    siteName: "Hotelier",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotelier",
    description: "Sistema integral de gestión hotelera",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
