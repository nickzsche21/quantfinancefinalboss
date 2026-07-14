"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { graves, lessons, models, pipeline, quests, sources, tools } from "../lib/content";
import { LabPanel } from "./LabPanel";

type View = "terminal" | "curriculum" | "models" | "stack" | "pipeline" | "cemetery" | "roadmap";
type Selection =
  | { kind: "lesson"; id: string }
  | { kind: "model"; id: string }
  | { kind: "pipeline"; id: string }
  | { kind: "grave"; id: string };

const nav: { id: View; label: string; key: string }[] = [
  { id: "terminal", label: "Front Page", key: "01" },
  { id: "curriculum", label: "Curriculum", key: "02" },
  { id: "models", label: "Model Index", key: "03" },
  { id: "stack", label: "Quant Stack", key: "04" },
  { id: "pipeline", label: "Research", key: "05" },
  { id: "cemetery", label: "Cemetery", key: "06" },
  { id: "roadmap", label: "Roadmap", key: "07" },
];

const LESSON_PROGRESS_KEY = "nfa.completed-lessons.v1";
const QUEST_PROGRESS_KEY = "nfa.completed-quests.v1";

function readStoredList(key: string): string[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function TerminalApp() {
  const [view, setView] = useState<View>("terminal");
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setCompletedLessons(readStoredList(LESSON_PROGRESS_KEY)), 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape" && query) setQuery("");
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [query]);

  const navigate = (next: View) => {
    setView(next);
    setSelection(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleLesson = useCallback((id: string) => {
    setCompletedLessons((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      window.localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const closeReader = useCallback(() => setSelection(null), []);

  const searchResults = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return [
      ...lessons.map((item) => ({ type: "LESSON", name: item.title, meta: `${item.track} · ${item.source}`, target: "curriculum" as View, selection: { kind: "lesson", id: item.index } as Selection })),
      ...models.map((item) => ({ type: "MODEL", name: item.name, meta: item.family, target: "models" as View, selection: { kind: "model", id: item.name } as Selection })),
      ...tools.map((item) => ({ type: "TOOL", name: item.name, meta: `${item.workflow} · ${item.language}`, target: "stack" as View, selection: null })),
    ].filter((item) => `${item.name} ${item.meta}`.toLowerCase().includes(needle)).slice(0, 8);
  }, [query]);

  return (
    <div className="terminal-shell">
      <header className="topbar">
        <button className="brand" onClick={() => navigate("terminal")} aria-label="No Free Alpha front page">
          <span className="brand-mark">N∅</span>
          <span className="brand-type">NO FREE ALPHA<small>THE OPEN QUANT REVIEW</small></span>
        </button>
        <div className="global-search">
          <span aria-hidden="true">⌕</span>
          <input ref={searchRef} aria-label="Search lessons, models, and tools" placeholder="Search the review…" value={query} onChange={(event) => setQuery(event.target.value)} />
          <kbd>⌘ K</kbd>
          {query && (
            <div className="search-results">
              <div className="search-caption">{searchResults.length} RESULTS</div>
              {searchResults.map((item) => (
                <button key={`${item.type}-${item.name}`} onClick={() => { setView(item.target); setSelection(item.selection); setQuery(""); }}>
                  <span>{item.type}</span><strong>{item.name}</strong><small>{item.meta}</small>
                </button>
              ))}
              {!searchResults.length && <p>No grounded record found. Try “Heston” or “backtest”.</p>}
            </div>
          )}
        </div>
        <button className="progress-state" onClick={() => navigate("curriculum")} aria-label={`${completedLessons.length} of 20 lessons complete`}>
          <span>{completedLessons.length}<i>/20</i></span><small>LESSONS COMPLETE</small>
        </button>
      </header>

      <aside className="sidebar">
        <nav aria-label="Publication sections">
          {nav.map((item) => (
            <button key={item.id} className={view === item.id ? "active" : ""} aria-current={view === item.id ? "page" : undefined} onClick={() => navigate(item.id)}>
              <span>{item.key}</span><b>{item.label}</b>
            </button>
          ))}
        </nav>
        <div className="edition-note"><span>VOL. 01</span><b>JULY 2026</b></div>
      </aside>

      <main className="main-stage">
        {view === "terminal" && <TerminalHome onNavigate={navigate} completed={completedLessons.length} />}
        {view === "curriculum" && <Curriculum completed={completedLessons} onOpen={(id) => setSelection({ kind: "lesson", id })} />}
        {view === "models" && <ModelZoo onOpen={(id) => setSelection({ kind: "model", id })} />}
        {view === "stack" && <QuantStack />}
        {view === "pipeline" && <ResearchPipeline onOpen={(id) => setSelection({ kind: "pipeline", id })} />}
        {view === "cemetery" && <Cemetery onOpen={(id) => setSelection({ kind: "grave", id })} />}
        {view === "roadmap" && <Roadmap completedLessons={completedLessons} onOpen={(id) => setSelection({ kind: "lesson", id })} />}
      </main>

      {selection && <ContentReader selection={selection} completedLessons={completedLessons} onToggleLesson={toggleLesson} onClose={closeReader} onSelect={setSelection} />}
    </div>
  );
}

function TerminalHome({ onNavigate, completed }: { onNavigate: (view: View) => void; completed: number }) {
  return (
    <>
      <div className="ticker-strip" aria-hidden="true">
        <div className="ticker-track">
          <span>NO FREE ALPHA</span><span>NO PROFIT PROMISES</span><span>CITED SOURCES ONLY</span><span>MODELS ARE CONTRACTS</span><span>BACKTESTS LIE BEAUTIFULLY</span><span>EDUCATION · NOT ADVICE</span>
          <span>NO FREE ALPHA</span><span>NO PROFIT PROMISES</span><span>CITED SOURCES ONLY</span><span>MODELS ARE CONTRACTS</span><span>BACKTESTS LIE BEAUTIFULLY</span><span>EDUCATION · NOT ADVICE</span>
        </div>
      </div>

      <section className="hero">
        <div className="hero-spine" aria-hidden="true">
          <span>VOL. 01</span>
          <span>ISSUE 01</span>
          <span>JULY 2026</span>
          <span>N∅</span>
        </div>

        <article className="hero-copy">
          <div className="hero-masthead">
            <span className="eyebrow">THE INDEPENDENT QUANT REVIEW</span>
            <span className="hero-folio">FOLIO 001 · OPEN · NOT ADVICE</span>
          </div>

          <p className="hero-kicker">A SYLLABUS FOR PEOPLE WHO DISTRUST PRETTY CURVES</p>

          <h1>
            <span className="hero-line">No Free</span>
            <span className="hero-line hero-line-accent">Alpha<span className="hero-period">.</span></span>
          </h1>

          <div className="hero-lower">
            <p className="hero-dek">
              The serious guide to models, markets, and the <i>beautiful ways</i> research can lie to you.
            </p>
            <div className="hero-actions">
              <button className="primary-cta" onClick={() => onNavigate("curriculum")}>
                READ THE CURRICULUM <span>↗</span>
              </button>
              <button className="text-cta" onClick={() => onNavigate("roadmap")}>
                BUILD YOUR EDITION <span>→</span>
              </button>
            </div>
            <div className="hero-proof">
              <span>OPEN SOURCE</span>
              <span>CITED</span>
              <span>INTERACTIVE</span>
              <span>{completed}/20 COMPLETE</span>
            </div>
          </div>

          <span className="hero-giant" aria-hidden="true">∅</span>
          <span className="hero-slash" aria-hidden="true" />
        </article>

        <aside className="cover-story">
          <div className="cover-chart" aria-hidden="true">
            {[42, 48, 45, 55, 52, 68, 61, 74, 58, 82, 70, 88, 64, 91, 55, 78, 40, 66, 32, 48, 22, 38, 18, 28].map((h, i) => (
              <i key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
          <span className="cover-stamp" aria-hidden="true">VOID OF<br />GUARANTEES</span>
          <div className="cover-kicker"><span>FEATURED AUTOPSY</span><b>CASE 01 · 8 MIN</b></div>
          <p className="cover-number">01</p>
          <h2>Beautiful backtests have <em>ugly</em> secrets.</h2>
          <p>Leakage. Free fills. Dead securities. Every flattering lie hiding inside a smooth equity curve.</p>
          <button onClick={() => onNavigate("cemetery")}>READ THE AUTOPSIES <span>↗</span></button>
          <div className="cover-footer">
            <span>RESEARCH INTEGRITY</span>
            <strong>94<small>/100</small></strong>
            <i>After costs + bias checks</i>
          </div>
        </aside>
      </section>

      <section className="manifest-strip" aria-label="Publication summary">
        <p><strong data-label="REPOS">04</strong><span>Source repositories</span></p>
        <p><strong data-label="LESSONS">20</strong><span>Editorial lessons</span></p>
        <p><strong data-label="MODELS">07</strong><span>Model dossiers</span></p>
        <p><strong data-label="LABS">12</strong><span>Live laboratories</span></p>
        <p className="manifest-zero"><strong data-label="PROMISES">00</strong><span>Profit promises</span></p>
      </section>

      <section className="editorial-paths">
        <div className="paths-heading">
          <span>CHOOSE YOUR DESK</span>
          <h2>Study the market from the angle that <em>matters.</em></h2>
          <p>Each desk combines reading, models, live experiments, and explicit failure checks. No hype desk. No guru track.</p>
        </div>
        <div className="path-grid">
          <button onClick={() => onNavigate("curriculum")}>
            <span className="path-index">01</span>
            <span>DERIVATIVES</span>
            <strong>Price the contract.<br />Question the model.</strong>
            <p>Probability, stochastic processes, options, Greeks, and numerical pricing.</p>
            <b>ENTER DESK ↗</b>
          </button>
          <button onClick={() => onNavigate("pipeline")}>
            <span className="path-index">02</span>
            <span>RESEARCH</span>
            <strong>Turn an idea into<br />an honest test.</strong>
            <p>Point-in-time data, validation, backtests, costs, portfolios, and risk.</p>
            <b>ENTER DESK ↗</b>
          </button>
          <button className="path-danger" onClick={() => onNavigate("cemetery")}>
            <span className="path-index">03</span>
            <span>FAILURE</span>
            <strong>Learn from the<br />strategies that died.</strong>
            <p>Six interactive autopsies for the mistakes most likely to survive peer review.</p>
            <b>ENTER CEMETERY ↗</b>
          </button>
        </div>
      </section>

      <LabPanel />

      <section className="source-ledger">
        <div className="section-heading compact"><div><span className="eyebrow">THE SOURCE LEDGER</span><h2>Built in public.<br /><em>Edited with receipts.</em></h2></div><button onClick={() => onNavigate("stack")}>EXPLORE THE STACK <span>↗</span></button></div>
        <div className="ledger-grid">
          {sources.map((source) => <article key={source.id}><span>{source.surface}</span><h3>{source.repo}</h3><p>{source.license}</p><div><code>{source.branch}@{source.commit}</code><a href={`https://github.com/${source.repo}/tree/${source.commit}`} target="_blank" rel="noreferrer">SOURCE ↗</a></div></article>)}
        </div>
      </section>

      <footer className="site-footer"><strong>NO FREE ALPHA</strong><span>Independent education · Not investment advice · No affiliation or endorsement</span><nav><a href="/sources">Sources</a><a href="/legal/disclaimer">Disclaimer</a><a href="/legal/privacy">Privacy</a></nav></footer>
    </>
  );
}

function PageIntro({ index, kicker, title, copy }: { index: string; kicker: string; title: string; copy: string }) {
  return <header className="page-intro"><span>{index} / {kicker}</span><h1>{title}</h1><p>{copy}</p></header>;
}

function Curriculum({ completed, onOpen }: { completed: string[]; onOpen: (id: string) => void }) {
  return <div className="page-view"><PageIntro index="02" kicker="CURRICULUM" title="Learn the machinery, not the mythology." copy="Twenty edited lessons from compounding to portfolio construction. Every lesson opens into a focused reader with practice, sources, and progress tracking." /><div className="curriculum-progress"><span><b>{completed.length}</b> of 20 complete</span><i style={{ width: `${(completed.length / lessons.length) * 100}%` }} /></div><div className="lesson-table"><div className="table-head"><span>NO.</span><span>LESSON</span><span>TRACK</span><span>LEVEL</span><span>STATUS</span></div>{lessons.map((lesson) => <button className={`lesson-row ${completed.includes(lesson.index) ? "complete" : ""}`} key={lesson.index} onClick={() => onOpen(lesson.index)}><span>{lesson.index}</span><span className="lesson-title"><strong>{lesson.title}</strong><small>SOURCE · {lesson.source}</small></span><span>{lesson.track}</span><span className={`level ${lesson.level.toLowerCase()}`}>{lesson.level}</span><span>{completed.includes(lesson.index) ? "READ ✓" : `${lesson.minutes}m ↗`}</span></button>)}</div></div>;
}

function ModelZoo({ onOpen }: { onOpen: (id: string) => void }) {
  return <div className="page-view"><PageIntro index="03" kicker="MODEL INDEX" title="Every model is a contract with reality." copy="Open each dossier for the equation, intuition, assumptions, and the precise conditions under which the model stops deserving your trust." /><div className="card-grid">{models.map((model, index) => <button className="model-card" key={model.name} onClick={() => onOpen(model.name)}><span className="model-top"><span>0{index + 1} · {model.family}</span><i className={model.accent}>{model.status}</i></span><span className="model-body"><strong>{model.name}</strong><span>{model.note}</span></span><span className="model-foot"><small>ASSUMPTIONS EXPOSED</small><b>OPEN DOSSIER ↗</b></span></button>)}</div></div>;
}

function QuantStack() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...Array.from(new Set(tools.map((tool) => tool.workflow)))];
  const visible = filter === "All" ? tools : tools.filter((tool) => tool.workflow === filter);
  return <div className="page-view"><PageIntro index="04" kicker="QUANT STACK" title="The tools, minus the link-dump entropy." copy="A curated working index derived from Awesome Quant. Filter by workflow and open any project at its source." /><div className="filter-row">{categories.map((category) => <button className={filter === category ? "active" : ""} key={category} onClick={() => setFilter(category)}>{category}</button>)}</div><div className="tool-table"><div><span>PROJECT</span><span>WORKFLOW</span><span>LANGUAGE</span><span>ACCESS</span></div>{visible.map((tool) => <a href={tool.url} target="_blank" rel="noreferrer" key={tool.name}><strong>{tool.name}</strong><span>{tool.workflow}</span><span>{tool.language}</span><span>{tool.access} ↗</span></a>)}</div><p className="provenance-note">wilsonfreitas/awesome-quant @ 9289247 · human review required where licensing is unknown.</p></div>;
}

function ResearchPipeline({ onOpen }: { onOpen: (id: string) => void }) {
  return <div className="page-view"><PageIntro index="05" kicker="RESEARCH" title="An idea is not a backtest. A backtest is not a strategy." copy="Eight editorial gates turn a market hunch into a reproducible research decision. Open every gate for its exit checklist and failure test." /><div className="pipeline-list">{pipeline.map((stage) => <button key={stage.name} onClick={() => onOpen(stage.index)}><span>{stage.index}</span><span><strong>{stage.name}</strong><small>{stage.copy}</small></span><b>{stage.index === "08" ? "SHIP / KILL" : "OPEN GATE ↗"}</b></button>)}</div><div className="bias-banner"><span>THE EDITORIAL RULE</span><strong>If information was unavailable at decision time, it does not belong in the feature matrix.</strong><small>machine-learning-for-trading · point-in-time validation</small></div></div>;
}

function Cemetery({ onOpen }: { onOpen: (id: string) => void }) {
  return <div className="page-view cemetery"><PageIntro index="06" kicker="ALPHA CEMETERY" title="Here lie the backtests that looked incredible." copy="Six complete educational autopsies. Open a file to inspect the symptom, diagnosis, repair, and the test that would have caught it." /><div className="grave-grid">{graves.map((grave, index) => <button key={grave.name} onClick={() => onOpen(grave.name)}><span className="grave-number">0{index + 1}</span><small>CAUSE · {grave.cause}</small><strong>{grave.name}</strong><p>{grave.note}</p><b>OPEN CASE FILE ↗</b></button>)}</div></div>;
}

function Roadmap({ completedLessons, onOpen }: { completedLessons: string[]; onOpen: (id: string) => void }) {
  const [goal, setGoal] = useState("Derivatives");
  const [complete, setComplete] = useState<string[]>([]);
  useEffect(() => {
    const timer = window.setTimeout(() => setComplete(readStoredList(QUEST_PROGRESS_KEY)), 0);
    return () => window.clearTimeout(timer);
  }, []);
  const path = lessons.filter((lesson) => goal === "Derivatives" ? ["Probability", "Stochastic", "Derivatives", "Numerical"].includes(lesson.track) : goal === "ML Research" ? ["Probability", "Research", "Backtesting"].includes(lesson.track) : goal === "Portfolio" ? ["Foundations", "Probability", "Portfolio"].includes(lesson.track) : ["Probability", "Portfolio", "Backtesting"].includes(lesson.track)).slice(0, 6);
  const toggleQuest = (quest: string) => setComplete((current) => { const next = current.includes(quest) ? current.filter((item) => item !== quest) : [...current, quest]; window.localStorage.setItem(QUEST_PROGRESS_KEY, JSON.stringify(next)); return next; });
  return <div className="page-view"><PageIntro index="07" kicker="ROADMAP" title="Choose a destination. Get the prerequisites." copy="Select a desk, work through its reading order, and keep a private practice ledger on this device." /><div className="roadmap-builder"><div className="goal-picker"><span>01 / CHOOSE A DESK</span>{["Derivatives", "ML Research", "Portfolio", "Risk"].map((item) => <button className={goal === item ? "active" : ""} onClick={() => setGoal(item)} key={item}>{item}<b>→</b></button>)}</div><div className="skill-tree"><span>YOUR {goal.toUpperCase()} READING ORDER</span>{path.map((lesson, index) => <button className={completedLessons.includes(lesson.index) ? "complete" : ""} key={lesson.index} onClick={() => onOpen(lesson.index)}><i>{completedLessons.includes(lesson.index) ? "✓" : index + 1}</i><span><strong>{lesson.title}</strong><small>{lesson.level} · {lesson.minutes} minutes</small></span><b>{completedLessons.includes(lesson.index) ? "READ" : "OPEN ↗"}</b></button>)}</div><aside><span>{complete.length}/10 PRACTICE NOTES</span>{quests.map((quest, index) => <button className={complete.includes(quest) ? "complete" : ""} onClick={() => toggleQuest(quest)} key={quest}><i>{complete.includes(quest) ? "✓" : index + 1}</i><span>{quest}</span></button>)}</aside></div></div>;
}

function ContentReader({ selection, completedLessons, onToggleLesson, onClose, onSelect }: { selection: Selection; completedLessons: string[]; onToggleLesson: (id: string) => void; onClose: () => void; onSelect: (selection: Selection) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("reader-open");
    closeRef.current?.focus();
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.classList.remove("reader-open"); };
  }, [onClose, selection]);

  const lesson = selection.kind === "lesson" ? lessons.find((item) => item.index === selection.id) : undefined;
  const model = selection.kind === "model" ? models.find((item) => item.name === selection.id) : undefined;
  const stage = selection.kind === "pipeline" ? pipeline.find((item) => item.index === selection.id) : undefined;
  const grave = selection.kind === "grave" ? graves.find((item) => item.name === selection.id) : undefined;
  const nextLesson = lesson ? lessons[(lessons.indexOf(lesson) + 1) % lessons.length] : undefined;

  return (
    <div className="reader-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <article className="content-reader" role="dialog" aria-modal="true" aria-labelledby="reader-title">
        <header className="reader-bar"><span>NO FREE ALPHA / READER</span><button ref={closeRef} onClick={onClose} aria-label="Close reader">CLOSE <b>×</b></button></header>
        {lesson && <><div className="reader-hero"><span>LESSON {lesson.index} · {lesson.track}</span><h2 id="reader-title">{lesson.title}</h2><p>{lesson.premise}</p><div><i className={`level ${lesson.level.toLowerCase()}`}>{lesson.level}</i><small>{lesson.minutes} MIN READ</small></div></div><div className="reader-content"><section><span>LEARNING OBJECTIVES</span><ul>{lesson.objectives.map((item) => <li key={item}>{item}</li>)}</ul></section><section><span>THE IDEA</span><p>{lesson.explanation}</p></section><blockquote><span>PRACTICE</span>{lesson.exercise}</blockquote><section><span>TAKEAWAY</span><p>{lesson.takeaway}</p></section><footer><small>SOURCE FAMILY</small><code>{lesson.source}</code></footer></div><button className={`reader-complete ${completedLessons.includes(lesson.index) ? "complete" : ""}`} onClick={() => onToggleLesson(lesson.index)}>{completedLessons.includes(lesson.index) ? "LESSON COMPLETE ✓" : "MARK LESSON COMPLETE"}</button>{nextLesson && <button className="reader-next" onClick={() => onSelect({ kind: "lesson", id: nextLesson.index })}><span>NEXT LESSON · {nextLesson.index}</span><strong>{nextLesson.title} ↗</strong></button>}</>}
        {model && <><div className="reader-hero"><span>MODEL DOSSIER · {model.family}</span><h2 id="reader-title">{model.name}</h2><p>{model.note}</p><div><i className={model.accent}>{model.status}</i><small>ASSUMPTIONS EXPOSED</small></div></div><div className="reader-content"><section><span>CORE EQUATION</span><pre>{model.equation}</pre></section><section><span>INTUITION</span><p>{model.intuition}</p></section><section><span>MODEL CONTRACT</span><ul>{model.assumptions.map((item) => <li key={item}>{item}</li>)}</ul></section><blockquote className="failure"><span>WHERE IT BREAKS</span>{model.failure}</blockquote></div></>}
        {stage && <><div className="reader-hero"><span>RESEARCH GATE · {stage.index}</span><h2 id="reader-title">{stage.name}</h2><p>{stage.copy}</p></div><div className="reader-content"><section><span>EXIT CHECKLIST</span><ol>{stage.checklist.map((item) => <li key={item}>{item}</li>)}</ol></section><blockquote className="failure"><span>FAILURE THIS GATE CATCHES</span>{stage.failure}</blockquote><section><span>SHIP RULE</span><p>Do not advance because the result looks promising. Advance only when every item above can be reproduced and defended.</p></section></div></>}
        {grave && <><div className="reader-hero grave-reader"><span>ALPHA CEMETERY · CASE FILE</span><h2 id="reader-title">{grave.name}</h2><p>{grave.note}</p></div><div className="reader-content autopsy-grid"><section><span>01 / SYMPTOM</span><p>{grave.symptom}</p></section><section><span>02 / DIAGNOSIS</span><p>{grave.diagnosis}</p></section><section><span>03 / REPAIR</span><p>{grave.repair}</p></section><blockquote><span>04 / THE TEST</span>{grave.test}</blockquote></div></>}
      </article>
    </div>
  );
}
