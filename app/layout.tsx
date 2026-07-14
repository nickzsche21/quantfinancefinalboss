import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const body = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://quantfinancefinalboss.vercel.app"),
  title: "No Free Alpha — Free Open-Source Quant Syllabus",
  description:
    "Free open-source quantitative finance university: 20 deep lessons, 12 live numerical labs, model dossiers, research pipeline, and backtest cemetery. No profit promises.",
  keywords: ["quant finance", "open source", "derivatives", "backtesting", "black scholes", "free syllabus"],
  openGraph: {
    title: "No Free Alpha — Free Open-Source Quant Syllabus",
    description: "20 deep lessons · 12 live labs · model dossiers · research pipeline · failure autopsies. Built in public.",
    type: "website",
    images: [{ url: "/og.png", width: 1735, height: 909, alt: "NO FREE ALPHA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "No Free Alpha — Free Open-Source Quant Syllabus",
    description: "No free alpha. Free syllabus though. 20 lessons, live labs, cemetery of bad backtests.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
