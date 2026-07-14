import type { ReactNode } from "react";
import Link from "next/link";

export function DocumentPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <main className="document-page">
      <Link className="document-brand" href="/">
        <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#03040A" />
          <circle cx="32" cy="32" r="22" fill="none" stroke="#00F5A0" strokeWidth="1.5" />
          <circle cx="32" cy="32" r="14" fill="none" stroke="#FF3D71" strokeWidth="2.2" />
          <path d="M20 32h24" stroke="#FF3D71" strokeWidth="2.6" />
        </svg>
        NO FREE ALPHA
      </Link>
      <header><small>{eyebrow}</small><h1>{title}</h1></header>
      <article>{children}</article>
      <footer><Link href="/">← Return to syllabus</Link><span>Educational use only · Not investment advice · Free open source</span></footer>
    </main>
  );
}
