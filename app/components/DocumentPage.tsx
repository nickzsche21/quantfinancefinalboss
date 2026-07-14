import type { ReactNode } from "react";
import Link from "next/link";

export function DocumentPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <main className="document-page">
      <Link className="document-brand" href="/"><span>N∅</span> NO FREE ALPHA</Link>
      <header><small>{eyebrow}</small><h1>{title}</h1></header>
      <article>{children}</article>
      <footer><Link href="/">← Return to terminal</Link><span>Educational use only · Not investment advice</span></footer>
    </main>
  );
}
