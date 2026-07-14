"use client";

import { useMemo, useState } from "react";
import { binomialOption, blackScholes, impliedVolatility, kalmanFilter, monteCarlo, OptionType, portfolioMetrics, riskMetrics, simulateExtendedPath, simulatePath } from "../lib/quant";

type LabMode = "black-scholes" | "brownian" | "gbm" | "monte-carlo" | "binomial" | "implied-vol" | "heston" | "merton" | "ou" | "kalman" | "portfolio" | "risk";

const modes: { id: LabMode; label: string }[] = [
  { id: "black-scholes", label: "BLACK–SCHOLES" },
  { id: "brownian", label: "BROWNIAN" },
  { id: "gbm", label: "GBM" },
  { id: "monte-carlo", label: "MONTE CARLO" },
  { id: "binomial", label: "BINOMIAL" },
  { id: "implied-vol", label: "IMPLIED VOL" },
  { id: "heston", label: "HESTON" },
  { id: "merton", label: "MERTON JUMP" },
  { id: "ou", label: "OU PROCESS" },
  { id: "kalman", label: "KALMAN" },
  { id: "portfolio", label: "MEAN–VARIANCE" },
  { id: "risk", label: "PORTFOLIO RISK" },
];

export function LabPanel() {
  const [mode, setMode] = useState<LabMode>("black-scholes");
  const [spot, setSpot] = useState(100);
  const [strike, setStrike] = useState(105);
  const [volatility, setVolatility] = useState(20);
  const [rate, setRate] = useState(5);
  const [optionType, setOptionType] = useState<OptionType>("call");
  const [seed, setSeed] = useState(7);

  const result = useMemo(() => {
    if (mode === "black-scholes") {
      const value = blackScholes(spot, strike, 1, rate / 100, volatility / 100, optionType);
      return { kind: "metric" as const, label: "THEORETICAL FAIR VALUE", primary: `$${value.price.toFixed(4)}`, secondary: `Δ ${value.delta.toFixed(4)} · d₁ ${value.d1.toFixed(4)} · d₂ ${value.d2.toFixed(4)}` };
    }
    if (mode === "monte-carlo") {
      const value = monteCarlo(spot, strike, 1, rate / 100, volatility / 100, 12000, seed, optionType);
      return { kind: "metric" as const, label: "ESTIMATED FAIR VALUE", primary: `$${value.price.toFixed(4)}`, secondary: `95% interval ± ${(1.96 * value.standardError).toFixed(4)} · 12,000 simulations` };
    }
    if (mode === "binomial") {
      const value = binomialOption(spot, strike, 1, rate / 100, volatility / 100, 150, optionType);
      return { kind: "metric" as const, label: "150-STEP TREE VALUE", primary: `$${value.toFixed(4)}`, secondary: "Risk-neutral backward induction · European exercise" };
    }
    if (mode === "implied-vol") {
      const market = blackScholes(spot, strike, 1, rate / 100, volatility / 100, optionType).price;
      const value = impliedVolatility(market, spot, strike, 1, rate / 100, optionType);
      return { kind: "metric" as const, label: "INVERTED VOLATILITY", primary: `${(value * 100).toFixed(3)}%`, secondary: `Market price $${market.toFixed(4)} · bisection residual < 10⁻⁸` };
    }
    if (mode === "portfolio") {
      const value = portfolioMetrics(volatility / 100, rate / 100);
      return { kind: "metric" as const, label: "PORTFOLIO SHARPE", primary: value.sharpe.toFixed(3), secondary: `E[R] ${(value.expectedReturn * 100).toFixed(2)}% · σ ${(value.volatility * 100).toFixed(2)}%` };
    }
    if (mode === "risk") {
      const value = riskMetrics(volatility / 100, seed);
      return { kind: "metric" as const, label: "1-DAY 95% EXPECTED SHORTFALL", primary: `${(value.expectedShortfall * 100).toFixed(3)}%`, secondary: `Historical-simulation VaR ${(value.valueAtRisk * 100).toFixed(3)}% · 10,000 draws` };
    }
    if (mode === "kalman") {
      const noisy = simulatePath("gbm", spot, rate / 100, volatility / 100, 96, seed);
      return { kind: "path" as const, values: kalmanFilter(noisy), label: "Filtered latent state" };
    }
    if (mode === "heston" || mode === "merton" || mode === "ou") return { kind: "path" as const, values: simulateExtendedPath(mode, spot, rate / 100, volatility / 100, 96, seed), label: "Simulated state path" };
    return { kind: "path" as const, values: simulatePath(mode, spot, rate / 100, volatility / 100, 96, seed), label: "Simulated state path" };
  }, [mode, spot, strike, rate, volatility, optionType, seed]);

  const chartValues = result.kind === "path" ? result.values.filter((_, index) => index % 2 === 0) : [];
  const low = chartValues.length ? Math.min(...chartValues) : 0;
  const high = chartValues.length ? Math.max(...chartValues) : 1;

  return (
    <section className="lab-panel" aria-labelledby="lab-heading">
      <div className="section-heading lab-heading">
        <div><span className="eyebrow">CONTROLLED NUMERICAL LAB / 01</span><h2 id="lab-heading">Touch the model.<br /><em>Break the assumption.</em></h2></div>
        <p>Twelve deterministic labs—pricing, paths, vol, filtering, portfolio, risk. Change any input; results recalculate on your device. Reproducible seeds. No server required.</p>
      </div>

      <div className="lab-workbench">
        <div className="lab-tabs" role="tablist" aria-label="Numerical lab">
          {modes.map((item) => <button key={item.id} role="tab" aria-selected={mode === item.id} onClick={() => setMode(item.id)}>{item.label}</button>)}
        </div>
        <div className="lab-grid">
          <div className="lab-controls">
            <div className="control-heading"><span>PARAMETERS</span><button onClick={() => setSeed((seed + 137) % 1000)}>NEW SEED ↻</button></div>
            <NumberField label="SPOT" value={spot} onChange={setSpot} min={1} max={500} />
            <NumberField label="STRIKE" value={strike} onChange={setStrike} min={1} max={500} />
            <NumberField label="VOLATILITY %" value={volatility} onChange={setVolatility} min={1} max={120} />
            <NumberField label="RATE %" value={rate} onChange={setRate} min={-10} max={30} />
            <label className="field"><span>OPTION</span><select value={optionType} onChange={(event) => setOptionType(event.target.value as OptionType)}><option value="call">European call</option><option value="put">European put</option></select></label>
            <NumberField label="SEED" value={seed} onChange={setSeed} min={0} max={999} />
          </div>

          <div className="lab-output" aria-live="polite">
            <div className="lab-output-top"><span>{modes.find((item) => item.id === mode)?.label} / MODEL OUTPUT</span><span className="live-dot"><i /> REPRODUCIBLE</span></div>
            {result.kind === "path" ? <><div className="path-chart" aria-label={result.label}>{chartValues.map((value, index) => <i key={`${index}-${value}`} style={{ height: `${12 + ((value - low) / Math.max(high - low, 0.0001)) * 78}%` }} />)}</div><div className="metric-row"><Metric label="START" value={chartValues[0]?.toFixed(3) ?? "—"} /><Metric label="TERMINAL" value={chartValues.at(-1)?.toFixed(3) ?? "—"} /><Metric label="RANGE" value={(high - low).toFixed(3)} /></div></> : <div className="price-result"><span>{result.label}</span><strong>{result.primary}</strong><p>{result.secondary}</p></div>}
            <div className="formula-strip">{formulaFor(mode)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formulaFor(mode: LabMode) {
  return {
    "black-scholes": "C = S₀N(d₁) − Ke⁻ʳᵀN(d₂)",
    brownian: "Wₜ₊Δ = Wₜ + √Δt · Z",
    gbm: "Sₜ₊Δ = Sₜ exp[(μ−σ²/2)Δt + σ√Δt·Z]",
    "monte-carlo": "V₀ = e⁻ʳᵀ E[max(±(Sₜ−K), 0)]",
    binomial: "Vᵢ,ⱼ = e⁻ʳΔᵗ[pVᵢ₊₁,ⱼ + (1−p)Vᵢ₊₁,ⱼ₊₁]",
    "implied-vol": "find σ : BS(S, K, T, r, σ) − Vmarket = 0",
    heston: "dvₜ = κ(θ−vₜ)dt + ξ√vₜ dWᵛ",
    merton: "dS/S = (μ−λk)dt + σdW + (J−1)dN",
    ou: "dXₜ = κ(θ−Xₜ)dt + σdWₜ",
    kalman: "x̂ₜ|ₜ = x̂ₜ|ₜ₋₁ + Kₜ(yₜ−Hx̂ₜ|ₜ₋₁)",
    portfolio: "max (wᵀμ − rƒ) / √(wᵀΣw)",
    risk: "ES₉₅ = −E[R | R ≤ q₀.₀₅]",
  }[mode];
}

function NumberField({ label, value, onChange, min, max }: { label: string; value: number; onChange: (value: number) => void; min: number; max: number }) {
  return <label className="field"><span>{label}</span><input type="number" value={value} min={min} max={max} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><span>{label}</span><strong>{value}</strong></div>;
}
