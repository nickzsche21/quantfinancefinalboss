import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const body = Newsreader({
  subsets: ["latin"],
  variable: "--font-body",
  style: ["normal", "italic"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://quantfinancefinalboss.vercel.app"),
  title: "No Free Alpha — The Independent Quant Review",
  description:
    "An editorial, interactive guide to quantitative finance: rigorous lessons, live numerical labs, model dossiers, research workflows and failure autopsies.",
  keywords: ["quant finance", "derivatives", "machine learning", "backtesting", "open source"],
  openGraph: {
    title: "No Free Alpha — The Independent Quant Review",
    description: "Models, markets, live laboratories, and the beautiful ways research can lie to you.",
    type: "website",
    images: [{ url: "/og.png", width: 1735, height: 909, alt: "NO FREE ALPHA — The Independent Quant Review" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
