import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotelier - Management Simplified",
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
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Hotelier - Management Simplified",
    description: "Sistema integral de gestión hotelera",
    type: "website",
    locale: "es_ES",
    siteName: "Hotelier",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotelier - Management Simplified",
    description: "Sistema integral de gestión hotelera",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};
