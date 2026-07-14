import { DocumentPage } from "../components/DocumentPage";
import { sources } from "../lib/content";

export default function SourcesPage() {
  return <DocumentPage eyebrow="SOURCE LEDGER / LOCKED 2026-07-13" title="Sources and provenance.">
    <p>NO FREE ALPHA is an independent educational reorganization. It is not affiliated with or endorsed by any repository author. Repository code is never executed during ingestion.</p>
    <div className="document-sources">{sources.map((source) => <section key={source.id}><span>{source.surface}</span><h2>{source.repo}</h2><dl><div><dt>Commit</dt><dd><code>{source.commit}</code></dd></div><div><dt>Branch</dt><dd>{source.branch}</dd></div><div><dt>License</dt><dd>{source.license}</dd></div><div><dt>Transformation</dt><dd>Metadata extraction / original summaries</dd></div></dl><a href={`https://github.com/${source.repo}/tree/${source.commit}`} target="_blank" rel="noreferrer">Open locked source ↗</a></section>)}</div>
    <h2>Transformation policy</h2><p>Long source prose, entire PDFs, slides, and book content are not republished. Mathematical ideas are explained independently. Adapted code and unknown licenses require human review; AGPL-associated implementations stay isolated.</p>
  </DocumentPage>;
}
