import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=IBM+Plex+Mono:wght@400;500;600&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
