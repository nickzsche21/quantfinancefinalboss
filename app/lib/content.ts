export type Lesson = {
  index: string;
  title: string;
  track: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  minutes: number;
  source: string;
  premise: string;
  objectives: string[];
  explanation: string;
  exercise: string;
  takeaway: string;
  keyTerms: { term: string; def: string }[];
  formula?: string;
  workedExample: string;
  pitfalls: string[];
  furtherReading: { title: string; note: string }[];
  labHint?: string;
};

export const lessons: Lesson[] = [
  {
    index: "01",
    title: "What quantitative finance is",
    track: "Foundations",
    level: "Beginner",
    minutes: 14,
    source: "original synthesis",
    premise: "Quantitative finance turns assumptions about markets into models that can be measured, challenged, and improved—not into prophecies.",
    objectives: [
      "Separate forecasting, pricing, and risk problems",
      "Recognize where data ends and assumptions begin",
      "Write a falsifiable research question",
      "Map a claim to data → model → decision → cost",
    ],
    explanation:
      "A quant workflow is a chain: question, data, representation, model, decision rule, costs, and risk. A result is only as strong as its weakest link. The job is not to make equations look sophisticated; it is to make every assumption visible enough to test.\n\nPricing, forecasting, and risk management answer different questions with different loss functions. A pricing model may be useful while being a terrible forecast. A forecast may be directionally correct and still lose money after costs. Confusing these jobs is how smart people ship dumb systems.\n\nHonest research starts by naming what would falsify the claim. If you cannot state the failure condition, you are storytelling, not researching.",
    exercise:
      "Take one market claim you believe. Rewrite it as: (1) observation window, (2) decision time, (3) action rule, (4) cost assumption, (5) explicit failure condition. Share the failure condition first—not the edge.",
    takeaway: "The model is not the market. It is a deliberately incomplete instrument for asking a precise question.",
    keyTerms: [
      { term: "Alpha", def: "Risk-adjusted excess return after costs—not raw outperformance or a pretty equity curve." },
      { term: "Research question", def: "A claim that can be measured, timed, and falsified with data available at decision time." },
      { term: "Assumption surface", def: "The set of untested beliefs a model relies on (liquidity, stationarity, no jumps, etc.)." },
    ],
    workedExample:
      "Claim: “Mean reversion works on SPY.” Better: “On SPY 5-minute bars, when z-score of the last 20 returns exceeds ±2, a one-bar fade earns positive mean PnL after 1 bp costs, walk-forward 2018–2024, with drawdown kill at −8%.” Now you have something to kill.",
    pitfalls: [
      "Starting with a model before naming the decision and costs",
      "Treating a backtest as proof instead of a controlled experiment",
      "Mixing pricing math with forecasting language",
    ],
    furtherReading: [
      { title: "Ernest Chan — Quantitative Trading (selected chapters)", note: "Practical framing of strategy research as a process." },
      { title: "stefan-jansen/machine-learning-for-trading", note: "Open curriculum on point-in-time research design." },
    ],
  },
  {
    index: "02",
    title: "Returns and compounding",
    track: "Foundations",
    level: "Beginner",
    minutes: 20,
    source: "computational-finance-course",
    premise: "Small choices in return definitions change aggregation, interpretation, and portfolio math.",
    objectives: [
      "Compute simple and log returns",
      "Compound across time correctly",
      "Translate between annualized and periodic quantities",
      "Know when each return type is the right tool",
    ],
    explanation:
      "Simple returns describe the percentage change in wealth over one interval: R = (Pₜ − Pₜ₋₁) / Pₜ₋₁. Log returns r = ln(Pₜ / Pₜ₋₁) add across time, which makes them convenient for modeling. Portfolio aggregation across assets happens naturally with simple returns and weights.\n\nAnnualization is a scaling convention. Multiplying a daily mean by 252 does not create a guarantee about next year; it creates a comparable unit. Volatility annualization with √252 assumes independent increments—often false when volatility clusters.\n\nWhen people mix return definitions in the same spreadsheet, they create silent accounting bugs that look like strategy edge.",
    exercise: "Convert five daily prices into simple and log returns. Reconstruct terminal wealth from both. Annualize mean and vol two ways and write what assumption each method needs.",
    takeaway: "Use the return definition that matches the operation: simple across assets, logarithmic across time.",
    keyTerms: [
      { term: "Simple return", def: "Fractional wealth change over one period; correct for portfolio weighting." },
      { term: "Log return", def: "Natural log of price ratio; additive across time under continuous compounding." },
      { term: "Annualization", def: "Unit conversion of mean/vol; not a forecast of future path quality." },
    ],
    formula: "R_t = P_t/P_{t-1} − 1    ·    r_t = ln(P_t/P_{t-1})    ·    ∏(1+R_i) = exp(∑ r_i)",
    workedExample:
      "Prices: 100 → 110 → 99. Simple returns: +10%, −10%. Wealth factor: 1.10 × 0.90 = 0.99 (−1%). Log returns: ln(1.1)+ln(0.9) ≈ −0.01005, exp of sum recovers 0.99. Mean of simple returns is not the compounded growth rate.",
    pitfalls: [
      "Averaging simple returns and treating the average as compounded growth",
      "Annualizing vol with √252 while returns are autocorrelated",
      "Mixing log and simple returns in portfolio attribution",
    ],
    furtherReading: [
      { title: "Wilmott — frequently asked questions in quantitative finance", note: "Clear return and compounding traps." },
      { title: "Computational Finance Course notebooks", note: "Return construction drills from Lech Grzelak materials." },
    ],
  },
  {
    index: "03",
    title: "Probability distributions",
    track: "Probability",
    level: "Beginner",
    minutes: 26,
    source: "computational-finance-course",
    premise: "A distribution is a complete statement about uncertainty—not just a mean and a volatility.",
    objectives: [
      "Interpret density, CDF, quantiles, and expected shortfall",
      "Compare Gaussian vs heavy-tailed behavior",
      "Connect moments to capital and risk decisions",
      "Read a QQ-plot mentally",
    ],
    explanation:
      "Financial outcomes are asymmetric, dependent, and often heavy-tailed. Mean and variance summarize only part of that structure. The CDF answers “what fraction of outcomes are worse than x?” Quantiles answer threshold questions used in VaR. Expected shortfall (CVaR) describes average severity beyond a quantile.\n\nGaussian models are popular because they close formulas. Markets often show kurtosis and skew that make Gaussian tails too thin. Two portfolios with identical volatility can have radically different 1% loss severity.\n\nBefore fitting a fancy model, plot the empirical distribution, the tails, and the dependence structure. Many “model failures” are distribution-choice failures.",
    exercise: "Compare the 1% loss quantile of a Gaussian sample with a Student-t sample calibrated to the same variance. Report both VaR and expected shortfall.",
    takeaway: "Two distributions with identical volatility can imply radically different capital requirements.",
    keyTerms: [
      { term: "VaR", def: "A loss quantile at a chosen confidence level—not the expected loss in the tail." },
      { term: "Expected shortfall", def: "Average loss conditional on exceeding VaR; more tail-sensitive than VaR." },
      { term: "Heavy tails", def: "Outcomes in the extremes occur more often than a Gaussian of same variance predicts." },
    ],
    formula: "VaR_α = −q_α(R)    ·    ES_α = −E[R | R ≤ q_α]",
    workedExample:
      "Daily returns σ = 1%. Gaussian 1% VaR ≈ 2.33%. A Student-t with ν=4 calibrated to same σ can show VaR near 2.6–3% and much higher ES. Capital sized to Gaussian VaR understates stress.",
    pitfalls: [
      "Reporting only Sharpe and never inspecting left-tail shape",
      "Using historical VaR without regime context",
      "Assuming independence when aggregating risk across days",
    ],
    furtherReading: [
      { title: "McNeil, Frey, Embrechts — Quantitative Risk Management", note: "Gold standard on tails, dependence, ES." },
      { title: "r/quant — common interview probability questions", note: "Forces intuition under pressure." },
    ],
  },
  {
    index: "04",
    title: "Brownian motion",
    track: "Stochastic",
    level: "Intermediate",
    minutes: 28,
    source: "computational-finance-course",
    premise: "Brownian motion is the continuous-time noise source beneath many classical pricing models.",
    objectives: [
      "State independent normal increments",
      "Simulate a discretized path with √Δt scaling",
      "Explain quadratic variation",
      "Connect BM to the Black–Scholes noise term",
    ],
    explanation:
      "Standard Brownian motion W has continuous paths, W₀=0, independent increments, and Wₜ−Wₛ ~ N(0, t−s). The √t scaling of standard deviation is the deepest practical rule: noise grows slower than linear time but is still unbounded over long horizons.\n\nPaths are nowhere classically differentiable—hence stochastic calculus. Quadratic variation of W over [0,T] is T, which is why Itô’s lemma has a second-order term that ordinary calculus lacks.\n\nSimulation uses discrete increments ΔW = Z√Δt with Z~N(0,1). Finer Δt changes path roughness but not the terminal distribution’s variance scale if the model is consistent.",
    exercise: "Open the Brownian lab, change the seed, then double time resolution. Compare path roughness and terminal dispersion across seeds.",
    takeaway: "Randomness accumulates with √t, not t—a scaling rule that echoes throughout risk modeling.",
    keyTerms: [
      { term: "Wiener process", def: "Another name for standard Brownian motion used in SDEs." },
      { term: "Quadratic variation", def: "Limit of summed squared increments; equal to T for Brownian motion on [0,T]." },
      { term: "Euler discretization", def: "Approximate SDE simulation with finite time steps." },
    ],
    formula: "W_t − W_s ∼ N(0, t−s)    ·    ΔW ≈ Z√Δt,  Z∼N(0,1)",
    workedExample:
      "Over 1 year, σ=20% annualized Brownian shock has std ≈ 0.20. Over 1 day (1/252), std ≈ 0.20/√252 ≈ 1.26%. That daily scaling is why “small” daily moves compound into large yearly uncertainty.",
    pitfalls: [
      "Scaling volatility with t instead of √t",
      "Confusing path continuity with predictability",
      "Ignoring discretization error in Greeks and hedges",
    ],
    furtherReading: [
      { title: "Steven Shreve — Stochastic Calculus for Finance I/II", note: "Rigorous but readable BM foundations." },
      { title: "Lab: BROWNIAN", note: "Interactive path simulator in this product." },
    ],
    labHint: "brownian",
  },
  {
    index: "05",
    title: "Geometric Brownian motion",
    track: "Stochastic",
    level: "Intermediate",
    minutes: 30,
    source: "computational-finance-course",
    premise: "GBM converts additive Brownian shocks into positive, multiplicative price paths.",
    objectives: [
      "Derive the log-price process",
      "Distinguish mean growth from median growth",
      "Identify structural limits of constant vol",
      "Simulate GBM paths reproducibly",
    ],
    explanation:
      "GBM assumes dS = μS dt + σS dW. Log prices are Gaussian; prices are lognormal and stay positive. The drift of log-price is μ − σ²/2, so the median terminal price grows slower than the mean when volatility is high—a classic interview trap.\n\nGBM is central to Black–Scholes because it yields closed forms. It cannot produce volatility clustering, jumps, leverage effects, or changing return distributions. Use it as a controlled laboratory, not as a literal market photograph.\n\nWhen you raise σ, average terminal price can rise while typical outcomes worsen—because the distribution becomes more skewed.",
    exercise: "Simulate paths at 10%, 30%, and 70% volatility. Plot mean vs median terminal price. Explain the gap.",
    takeaway: "A convenient state process can be useful for pricing while remaining a poor literal description of markets.",
    keyTerms: [
      { term: "Lognormal", def: "A variable whose log is normal; support is positive." },
      { term: "Itô correction", def: "The −σ²/2 term in log-drift from quadratic variation." },
      { term: "Risk-neutral drift", def: "Under pricing measure, μ is replaced by r−q for non-dividend issues (simplified)." },
    ],
    formula: "S_t = S_0 exp[(μ − σ²/2)t + σW_t]",
    workedExample:
      "S₀=100, μ=0, σ=80%, t=1. Median S₁ = 100·e^{−0.5·0.64} ≈ 72.6. Mean S₁ = 100. High vol with zero drift: typical path loses, average is propped by rare huge winners.",
    pitfalls: [
      "Using mean return as “what I should expect to see”",
      "Fitting GBM to assets with clear jump risk",
      "Ignoring dividends and borrow when mapping to options",
    ],
    furtherReading: [
      { title: "Hull — Options, Futures, and Other Derivatives", note: "GBM to Black–Scholes bridge." },
      { title: "Lab: GBM", note: "Path laboratory in this product." },
    ],
    labHint: "gbm",
  },
  {
    index: "06",
    title: "Options basics",
    track: "Derivatives",
    level: "Beginner",
    minutes: 24,
    source: "computational-finance-course",
    premise: "An option is a nonlinear payoff whose value is driven by the distribution of future states—not by a directional slogan.",
    objectives: [
      "Draw call and put payoffs vs profit",
      "Define moneyness and time value",
      "State put–call parity intuition",
      "Separate insurance from leverage narratives",
    ],
    explanation:
      "A European call pays max(S−K, 0) at expiry; a put pays max(K−S, 0). Premium is paid up front, so profit = payoff − future value of premium. Intrinsic value is immediate exercise value; time value is the remainder before expiry.\n\nMoneyness (ITM/ATM/OTM) describes where spot sits relative to strike. Deep OTM options are cheap for a reason: probability mass and risk-neutral pricing, not free lottery tickets.\n\nPut–call parity links calls, puts, spot, and bonds for European options: C − P = DF·(F − K) in forward form. If parity is violated after costs, arbitrageurs notice.",
    exercise: "Sketch payoff and profit for long call, long put, and covered call at the same strike. Mark breakevens.",
    takeaway: "Option value comes from the distribution of future states, not merely today’s intrinsic value.",
    keyTerms: [
      { term: "Intrinsic value", def: "Value if exercised immediately; max(S−K,0) for calls." },
      { term: "Time value", def: "Market price minus intrinsic; reflects remaining uncertainty." },
      { term: "Put–call parity", def: "Model-free European relation between call, put, forward, and strike." },
    ],
    formula: "Call payoff = (S_T − K)+    ·    Put payoff = (K − S_T)+    ·    C − P = e^{−rT}(F − K)",
    workedExample:
      "Spot 100, K=100, call premium 8. At expiry S=110, payoff 10, profit 2 if we ignore rates. At S=100, payoff 0, profit −8. “Being right on direction” is not enough if move < premium.",
    pitfalls: [
      "Confusing payoff diagrams with profit after premium",
      "Buying OTM options as if probability equals payoff odds",
      "Ignoring early exercise differences for American options",
    ],
    furtherReading: [
      { title: "Natenberg — Option Volatility & Pricing", note: "Practitioner intuition without mysticism." },
      { title: "Lab: BLACK–SCHOLES", note: "Price and Greeks live in this product." },
    ],
    labHint: "black-scholes",
  },
  {
    index: "07",
    title: "Black–Scholes intuition",
    track: "Derivatives",
    level: "Intermediate",
    minutes: 22,
    source: "computational-finance-course",
    premise: "Dynamic replication—not a directional forecast—is the engine of Black–Scholes pricing.",
    objectives: [
      "Explain delta hedging in words",
      "Describe risk-neutral valuation without mysticism",
      "Name the critical assumptions",
      "Predict how price moves with σ, T, and S",
    ],
    explanation:
      "If an option can be continuously replicated with the underlying and cash, its price must match the replicating portfolio or an arbitrage exists. The hedge removes instantaneous market direction from the local pricing equation.\n\nRisk-neutral probabilities are a valuation device: we price as if investors required the risk-free return on all traded assets, then discount at r. This is not a claim about real-world beliefs.\n\nRaise volatility and both calls and puts get more valuable in Black–Scholes—because optionalities benefit from dispersion under the model’s assumptions.",
    exercise: "In the Black–Scholes lab, raise volatility while holding spot and strike fixed. Explain why both call and put values increase.",
    takeaway: "The formula is the final line; replication is the argument that gives it meaning.",
    keyTerms: [
      { term: "Delta hedge", def: "Hold ∂V/∂S units of the underlying to cancel local directional risk." },
      { term: "Risk-neutral measure", def: "Pricing probability measure making discounted assets martingales." },
      { term: "No-arbitrage price", def: "Price enforced by replication/hedging bounds, not by forecast consensus." },
    ],
    formula: "C = S e^{−qT} N(d₁) − K e^{−rT} N(d₂)",
    workedExample:
      "ATM call, S=K=100, r=0, T=1, σ=20% → rough price near 8. ATM call with σ=40% is much higher. You did not “predict” a move; you paid for a wider distribution of outcomes.",
    pitfalls: [
      "Treating risk-neutral probs as real-world forecasts",
      "Ignoring discrete hedging error and costs",
      "Using BS as a truth machine instead of a quoting language",
    ],
    furtherReading: [
      { title: "Joséphine / standard BS derivations in Shreve II", note: "Replication → PDE → formula." },
      { title: "Lab: BLACK–SCHOLES + IMPLIED VOL", note: "Price and invert live." },
    ],
    labHint: "black-scholes",
  },
  {
    index: "08",
    title: "The Black–Scholes equation",
    track: "Derivatives",
    level: "Advanced",
    minutes: 36,
    source: "computational-finance-course",
    premise: "Itô’s lemma and a self-financing hedge turn a stochastic price process into a deterministic PDE.",
    objectives: [
      "Trace the PDE derivation step by step",
      "Interpret theta, convexity, and financing terms",
      "Connect terminal payoff to boundary conditions",
      "State when the PDE story fails in markets",
    ],
    explanation:
      "Start from GBM for S and apply Itô to V(S,t). Form a portfolio long the option and short Δ units of the underlying. Choose Δ = V_S to cancel the dW term. The portfolio is instantaneously riskless, so it must earn r, producing the Black–Scholes PDE.\n\nEach term has a balance-sheet reading: time decay, diffusion convexity (½σ²S²V_SS), and financing of the hedge. Boundary conditions encode the contract—European call uses (S−K)+ at T.\n\nClosed form exists for Europeans under constant coefficients. Numerical PDE or Monte Carlo is required for many exotics and early-exercise features.",
    exercise: "Write the PDE and label time decay, convexity, financing. Check which term dominates near expiry ATM.",
    takeaway: "The PDE is a balance sheet for local option risk.",
    keyTerms: [
      { term: "Itô’s lemma", def: "Chain rule for stochastic processes including second-order dW²→dt terms." },
      { term: "Self-financing", def: "Portfolio rebalancing with no external cash injection except financing at r." },
      { term: "Terminal condition", def: "Payoff function that anchors the PDE solution at expiry." },
    ],
    formula: "V_t + (r−q)S V_S + ½ σ² S² V_SS − rV = 0",
    workedExample:
      "Near ATM close to expiry, gamma peaks: the ½σ²S²V_SS term is large and theta is large negative for long options. Market makers feel this as “bleed” if they are long gamma without realized move.",
    pitfalls: [
      "Memorizing the formula without the hedge argument",
      "Forgetting dividends / borrow in the drift term",
      "Applying European PDE logic unchanged to Americans",
    ],
    furtherReading: [
      { title: "Shreve II — chapters on BS PDE", note: "Clean derivation path." },
      { title: "Wilmott on quantitative finance", note: "PDE intuition for practitioners." },
    ],
  },
  {
    index: "09",
    title: "Greeks as local sensitivities",
    track: "Derivatives",
    level: "Intermediate",
    minutes: 32,
    source: "computational-finance-course",
    premise: "Greeks are local derivatives of a model price—not permanent properties of a contract.",
    objectives: [
      "Interpret delta, gamma, vega, theta, rho",
      "Relate gamma to hedging instability",
      "Estimate first-order PnL attribution",
      "Understand why Greeks go stale",
    ],
    explanation:
      "Delta ≈ ∂V/∂S: hedge ratio. Gamma ≈ ∂²V/∂S²: how fast delta changes—critical for discrete hedging. Vega ≈ ∂V/∂σ: sensitivity to implied vol input. Theta ≈ ∂V/∂t: model time decay. Rho ≈ ∂V/∂r: rates sensitivity.\n\nA first-order Taylor story: ΔV ≈ δΔS + ½γ(ΔS)² + νΔσ + θΔt + … Realized PnL of a hedged book is largely about gamma vs realized move and vega vs implied move.\n\nGreeks depend on the model and the market state. Recompute them; do not tattoo yesterday’s delta on today’s book.",
    exercise: "Use BS lab. Estimate delta PnL for a $1 spot move, reprice fully, and attribute residual to gamma.",
    takeaway: "A hedge built from stale Greeks is a new position, not the old hedge.",
    keyTerms: [
      { term: "Gamma scalping", def: "Trading the rehedge of a long-gamma book when spot moves." },
      { term: "Charm / vanna", def: "Cross sensitivities (delta vs time, delta vs vol) that matter in real books." },
      { term: "Sticky strike vs sticky delta", def: "Different assumptions for how the vol surface moves with spot." },
    ],
    formula: "ΔV ≈ δ ΔS + ½ γ (ΔS)² + ν Δσ + θ Δt",
    workedExample:
      "Long ATM call, δ=0.5, γ=0.05 per dollar. Spot +$2: linear predicts +1.0, convexity adds ~0.1. If you hedged only with stale delta, residual is gamma PnL.",
    pitfalls: [
      "Hedging with overnight delta and ignoring gamma near events",
      "Comparing vegas across options without notional/expiry normalization",
      "Treating theta as cash you will definitely earn",
    ],
    furtherReading: [
      { title: "Taleb — Dynamic Hedging (selected)", note: "Practical greek risk language." },
      { title: "Lab: BLACK–SCHOLES", note: "Read delta/d1/d2 outputs while stressing inputs." },
    ],
    labHint: "black-scholes",
  },
  {
    index: "10",
    title: "Implied volatility",
    track: "Derivatives",
    level: "Intermediate",
    minutes: 28,
    source: "computational-finance-course",
    premise: "Implied volatility is the σ that makes a model price match a market price—a coordinate system for options.",
    objectives: [
      "Invert BS for σ numerically",
      "Read smiles, skews, and term structure",
      "Avoid treating IV as a pure forecast",
      "See where inversion is unstable",
    ],
    explanation:
      "There is no closed-form inverse for BS volatility; use bisection or Newton on price residual. Across strikes you get a smile/skew; across expiries a term structure; together a surface.\n\nIV is a language for quoting. It embeds supply/demand, tail pricing, and model misspecification. A rising IV does not uniquely mean “the market predicts higher realized vol”—it means option prices rose in IV units.\n\nNear deep OTM prices and numerical floors, inversion becomes sensitive: tiny price noise maps to large σ noise.",
    exercise: "Use the implied-vol lab. Recover σ from price, then perturb market price by 1% and measure σ change ATM vs deep OTM.",
    takeaway: "Implied volatility is a price coordinate—a compact language for option markets.",
    keyTerms: [
      { term: "Skew", def: "Pattern where lower strikes often carry higher IV in equities (crash premium)." },
      { term: "Variance swap intuition", def: "Related to integrated variance; links vol products to the surface." },
      { term: "Mark-to-model", def: "Valuing with a model surface; risk depends on surface dynamics assumptions." },
    ],
    formula: "Find σ s.t. BS(S,K,r,T,σ) = MarketPrice",
    workedExample:
      "ATM call market 8.02 with S=100,K=105-style params might invert to ~20%. If market price jumps to 9.00 with other inputs fixed, IV rises—even if your realized-vol forecast is unchanged.",
    pitfalls: [
      "Comparing IV across underlyings without checking total variance σ²T",
      "Fitting a huge surface model to sparse liquid strikes",
      "Ignoring bid/ask: mid IV can be fiction on wide markets",
    ],
    furtherReading: [
      { title: "Gatheral — The Volatility Surface", note: "Modern surface intuition." },
      { title: "Lab: IMPLIED VOL", note: "Bisection inversion in this product." },
    ],
    labHint: "implied-vol",
  },
  {
    index: "11",
    title: "Monte Carlo pricing",
    track: "Numerical",
    level: "Intermediate",
    minutes: 34,
    source: "financial-models-numerical-methods",
    premise: "Monte Carlo converts an expectation into a controlled numerical experiment with measurable error.",
    objectives: [
      "Price as discounted average payoff",
      "Report standard error and intervals",
      "Use seeds for reproducibility",
      "Know when MC is the right tool",
    ],
    explanation:
      "Simulate terminal states under the pricing measure, evaluate payoff, average, discount. Error falls roughly like 1/√N—slow but flexible for path-dependent contracts.\n\nA point estimate without standard error hides numerical uncertainty. Always report SE or a confidence interval. Antithetic variates, control variates, and quasi-MC can reduce variance when designed carefully.\n\nMC shines for high-dimensional or path-dependent payoffs. PDEs can be better in low dimension with early exercise (with care).",
    exercise: "Compare estimates at 1k, 10k, 100k paths. Check whether BS value sits inside each 95% interval.",
    takeaway: "A simulation result is incomplete until it reports its sampling error.",
    keyTerms: [
      { term: "Standard error", def: "Sample std of the estimator; ≈ s/√N for i.i.d. draws." },
      { term: "Risk-neutral paths", def: "Simulate with pricing drift, not real-world forecast drift, for pricing." },
      { term: "Variance reduction", def: "Techniques that keep expectation right while shrinking estimator variance." },
    ],
    formula: "V ≈ e^{−rT} (1/N) ∑ payoff(S_T^{(i)})    ·    SE ≈ σ̂_payoff / √N",
    workedExample:
      "If discounted payoff sample std is 15 and N=10_000, SE≈0.15. Quoting price to four decimals without SE is cosplay precision.",
    pitfalls: [
      "Using real-world drift for option pricing paths",
      "Stopping at a pretty mean without SE",
      "Correlated seeds that accidentally reduce diversity",
    ],
    furtherReading: [
      { title: "Glasserman — Monte Carlo Methods in Financial Engineering", note: "The MC bible." },
      { title: "Lab: MONTE CARLO", note: "Live estimator with interval readout." },
    ],
    labHint: "monte-carlo",
  },
  {
    index: "12",
    title: "Heston intuition",
    track: "Model Zoo",
    level: "Advanced",
    minutes: 33,
    source: "financial-models-numerical-methods",
    premise: "Heston makes variance a stochastic, mean-reverting state correlated with price shocks.",
    objectives: [
      "Interpret κ, θ, ξ, ρ, v₀",
      "Connect ρ to equity skew",
      "See vol-of-vol clustering paths",
      "Respect calibration fragility",
    ],
    explanation:
      "Variance v_t mean-reverts to θ at speed κ, with vol-of-vol ξ and correlation ρ between spot and variance shocks. Negative ρ in equities produces the leverage effect: spots drop, variance jumps up, creating put skew.\n\nMore realism means more parameters and more ways to fit noise. Calibration can be unstable across days; Feller condition 2κθ > ξ² affects variance positivity in theory.\n\nUse Heston when you need skew/term structure richer than BS—but keep a kill test for parameter instability.",
    exercise: "Open Heston lab. Compare low vs high ξ paths. Explain clustered turbulence.",
    takeaway: "A richer model can fit more market structure, but it also creates more ways to fit noise.",
    keyTerms: [
      { term: "Vol-of-vol (ξ)", def: "How violently variance itself moves." },
      { term: "Mean reversion (κ)", def: "Speed pulling variance toward long-run θ." },
      { term: "Leverage correlation (ρ)", def: "Link between spot shocks and variance shocks." },
    ],
    formula: "dv_t = κ(θ − v_t)dt + ξ√v_t dW^v_t",
    workedExample:
      "Two calibrations fit today’s ATM IV but disagree on wing IV and on future variance distribution. Same “Heston,” different risk—always stress parameters.",
    pitfalls: [
      "Calibrating daily without regularization and calling instability “alpha”",
      "Ignoring that simulated variance can hit numerical issues",
      "Using Heston for one-day options where jumps dominate",
    ],
    furtherReading: [
      { title: "Heston 1993 paper", note: "Original SV setup." },
      { title: "Lab: HESTON", note: "Path intuition in this product." },
    ],
    labHint: "heston",
  },
  {
    index: "13",
    title: "Mean reversion",
    track: "Stochastic",
    level: "Intermediate",
    minutes: 22,
    source: "financial-models-numerical-methods",
    premise: "Mean reversion is a conditional tendency toward an equilibrium—not a promise every deviation pays.",
    objectives: [
      "Define restoring force statistically",
      "Estimate half-life from AR(1)",
      "Separate economic equilibrium from sample mean",
      "Test stability of the equilibrium",
    ],
    explanation:
      "A process is mean-reverting if expected changes oppose distance from a level. Half-life is the expected time for a shock to decay by half under a linear model—useful, model-dependent, and fragile when the equilibrium drifts.\n\nPairs trading and rate models lean on reversion. Structural breaks, policy shifts, and liquidity regimes can turn “reversion” into a trap that bleeds theta-like losses until the break completes.\n\nAlways estimate rolling half-lives and ask whether the equilibrium is an economic anchor or a historical accident.",
    exercise: "Estimate AR(1) on a spread, convert to half-life, repeat on rolling windows. Report stability.",
    takeaway: "Before trading reversion, test whether the equilibrium itself is stable.",
    keyTerms: [
      { term: "Half-life", def: "ln(2)/κ style measure of shock decay speed under linear reversion." },
      { term: "Ornstein–Uhlenbeck", def: "Canonical continuous-time Gaussian reversion model." },
      { term: "Structural break", def: "A change in parameters that invalidates historical equilibrium." },
    ],
    formula: "X_t = φ X_{t-1} + ε_t    ·    half-life ≈ ln(2)/ln(1/|φ|)  (discrete AR(1))",
    workedExample:
      "φ=0.9 on daily data → half-life ≈ 6.6 days. If rolling φ wanders from 0.7 to 0.98, your “edge horizon” is not a constant—position sizing must adapt or die.",
    pitfalls: [
      "Fitting full-sample reversion and trading a broken regime",
      "Ignoring borrow and short constraints in pairs",
      "Confusing correlation with a stationary spread",
    ],
    furtherReading: [
      { title: "Chan — Algorithmic Trading", note: "Practical mean reversion research habits." },
      { title: "Lab: OU PROCESS", note: "Continuous-time reversion paths." },
    ],
    labHint: "ou",
  },
  {
    index: "14",
    title: "Ornstein–Uhlenbeck",
    track: "Model Zoo",
    level: "Advanced",
    minutes: 30,
    source: "financial-models-numerical-methods",
    premise: "OU is a continuous-time Gaussian model of noisy motion around a long-run level.",
    objectives: [
      "Write the SDE and conditional mean",
      "Relate κ to half-life",
      "Know when Gaussian support is wrong",
      "Simulate and interpret paths",
    ],
    explanation:
      "dX = κ(θ − X)dt + σ dW. Conditional mean reverts exponentially to θ; variance approaches σ²/(2κ). Estimation is tractable; the model can go negative—bad for variances or rates without floors.\n\nOU is a building block for Vasicek rates and for residual models. It is not a license to trade every z-score.\n\nWhen σ is large and κ small, “reversion” is slow and noise dominates—your hold time may be longer than your capital’s patience.",
    exercise: "In the OU lab, change start value and σ. Contrast expected pull vs realized path behavior.",
    takeaway: "Mean reversion describes a distribution of future states, not a deterministic return path.",
    keyTerms: [
      { term: "Stationary variance", def: "Long-run variance σ²/(2κ) for OU." },
      { term: "Vasicek", def: "Short-rate model built on OU dynamics." },
      { term: "Gaussian support", def: "Process can take any real value; may be unrealistic." },
    ],
    formula: "E[X_t | X_0] = θ + (X_0 − θ)e^{−κt}",
    workedExample:
      "X₀ far above θ with large κ: expected path dives quickly, but a single path can still wander higher first. Trading the expectation without path risk management is how accounts die.",
    pitfalls: [
      "Using OU for quantities that cannot go negative without reflection/CIR",
      "Estimating κ on noisy high-frequency data without microstructure filters",
      "Ignoring parameter uncertainty in half-life",
    ],
    furtherReading: [
      { title: "cantaro86 numerical methods notebooks", note: "Simulation and estimation patterns." },
      { title: "Lab: OU PROCESS", note: "Interactive state paths." },
    ],
    labHint: "ou",
  },
  {
    index: "15",
    title: "Feature leakage",
    track: "Research",
    level: "Intermediate",
    minutes: 22,
    source: "machine-learning-for-trading",
    premise: "Leakage is when training inputs contain information that would not exist at prediction time.",
    objectives: [
      "Detect target and preprocessing leakage",
      "Build time-aware transforms",
      "Audit feature availability timestamps",
      "Design a leakage unit test",
    ],
    explanation:
      "Leakage enters through labels, global normalization, revised fundamentals, survivorship, or CV that shuffles time. It produces incredible validation scores for impossible problems.\n\nEvery feature needs an as-of timestamp. Fit scalers, PCA, and target encoding inside each training fold only. If deleting future rows changes historical feature values, you leaked.\n\nr/MachineLearning and r/algotrading are full of “98% accuracy” posts that are leakage cosplay. Your edge is process discipline.",
    exercise: "For five features, write the earliest knowable timestamp. Quarantine any feature that cannot answer clearly. Implement one automated check.",
    takeaway: "If the feature matrix knows the future, the backtest is a data-quality bug report.",
    keyTerms: [
      { term: "Point-in-time", def: "Data as it was knowable then—not as revised later." },
      { term: "Purged CV", def: "Time-aware validation that removes leakage across folds (see López de Prado)." },
      { term: "Embargo", def: "Gap between train and test to reduce label overlap in time series." },
    ],
    workedExample:
      "Standardizing features with the full-sample mean/std includes future information. A stock that becomes huge later shifts historical z-scores. Fit StandardScaler only on past windows.",
    pitfalls: [
      "Random K-fold on trading data",
      "Using adjusted prices incorrectly across corporate actions without timing",
      "Labeling with future returns that overlap features",
    ],
    furtherReading: [
      { title: "López de Prado — Advances in Financial Machine Learning", note: "Purged CV, meta-labeling, leakage hygiene." },
      { title: "stefan-jansen ML for Trading", note: "Chapter patterns on features and CV." },
    ],
  },
  {
    index: "16",
    title: "Look-ahead bias",
    track: "Backtesting",
    level: "Beginner",
    minutes: 18,
    source: "machine-learning-for-trading",
    premise: "Look-ahead lets a historical decision use data published or finalized later.",
    objectives: [
      "Separate event time from availability time",
      "Spot close-to-close timing errors",
      "Design signal → order → fill timelines",
      "Write a point-in-time join rule",
    ],
    explanation:
      "Earnings, index membership, and even “daily close” have conventions. Joining by calendar date can place future information into past decisions. A valid backtest models when data was observable and when an order could execute.\n\nClassic bug: using same-bar close to signal and fill. If you trade on close, you often cannot also fill at that close without special assumptions.\n\nDraw the timeline. If any arrow points backward in information time, you time-traveled.",
    exercise: "Draw timestamps for signal calc, data availability, order submission, and fill. Find impossible orderings in a sample strategy.",
    takeaway: "Correct values at the wrong time are still wrong data.",
    keyTerms: [
      { term: "Availability time", def: "When a data point could be known to a decision process." },
      { term: "Information set", def: "σ-algebra / filtration of knowable facts at t—in practice, your feature store." },
      { term: "Same-bar fill", def: "Assuming execution at the price that generated the signal—often invalid." },
    ],
    workedExample:
      "Signal uses Friday close; fill assumed Friday close; costs zero. Reality: signal after close, fill next open with gap risk. Edge may vanish under next-open fills.",
    pitfalls: [
      "Merging fundamentals on fiscal period end instead of publish date",
      "Using revised macro series as if first-print existed",
      "Ignoring time zones in multi-market systems",
    ],
    furtherReading: [
      { title: "Cemetery case: THE TIME TRAVELER", note: "Interactive autopsy in this product." },
      { title: "AFML timing chapters / Jansen PIT data", note: "Operational patterns." },
    ],
  },
  {
    index: "17",
    title: "Survivorship bias",
    track: "Backtesting",
    level: "Beginner",
    minutes: 20,
    source: "machine-learning-for-trading",
    premise: "Testing only today’s survivors removes historical failures from the opportunity set.",
    objectives: [
      "Construct point-in-time universes",
      "Include delisting returns",
      "Measure survivor-only distortion",
      "Audit index membership history",
    ],
    explanation:
      "Current constituents are selected by survival and addition rules. Projecting them backward imports future knowledge and usually flatters quality factors and momentum narratives.\n\nDelisted names, bankruptcies, and index deletes are not edge cases—they are the left tail. Without them, risk looks too calm and returns too high.\n\nBuild security masters with membership intervals. At each rebalance, ask: could I know this universe then?",
    exercise: "Compare a strategy on current index members vs point-in-time membership. Report performance and turnover gaps.",
    takeaway: "A universe is a time series, not a static list.",
    keyTerms: [
      { term: "Security master", def: "Database of identifiers, listings, and life events over time." },
      { term: "Delisting return", def: "Terminal return when a name exits—often ugly, often missing in lazy datasets." },
      { term: "Point-in-time membership", def: "Who was in the index/universe as of date t." },
    ],
    workedExample:
      "Backtest “quality” on today’s S&P names from 2005→now. You excluded companies that died or were removed after deterioration. Quality premium may be overstated.",
    pitfalls: [
      "Downloading a current ticker list and pulling “full history”",
      "Dropping NaNs from dead names without modeling exit",
      "Survivorship in crypto pairs and delisted perps",
    ],
    furtherReading: [
      { title: "Cemetery case: THE IMMORTAL INDEX", note: "Autopsy workflow in this product." },
      { title: "Classic CRSP survivorship literature", note: "Why equity research learned this the hard way." },
    ],
  },
  {
    index: "18",
    title: "Transaction costs",
    track: "Backtesting",
    level: "Intermediate",
    minutes: 25,
    source: "machine-learning-for-trading",
    premise: "A gross signal becomes a strategy only after spread, impact, borrow, fees, and delay.",
    objectives: [
      "Model turnover-linked costs",
      "Separate spread from impact",
      "Stress capacity assumptions",
      "Find break-even cost levels",
    ],
    explanation:
      "Costs depend on what, when, size, and venue. Midpoint fills with infinite liquidity are fan fiction. Crossing spread is a floor; impact rises with participation rate; borrow fees punish shorts; delays change exposure.\n\nAlways recompute net of several cost levels. If edge dies at 5–15 bps per turn, you do not have a strategy—you have a gross curiosity.\n\nCapacity is part of the research claim. A strategy that only works on $10k notional is a different product than one that works on $10m.",
    exercise: "Recompute a backtest at 0, 5, 15, 40 bps per turn. Find break-even cost and implied capacity story.",
    takeaway: "If a strategy dies under small realistic costs, it never existed net of implementation.",
    keyTerms: [
      { term: "Participation rate", def: "Order size relative to volume; drives impact." },
      { term: "Implementation shortfall", def: "Gap between decision price and achieved execution." },
      { term: "Capacity", def: "Capital level where edge is eroded by impact and constraints." },
    ],
    formula: "Net ≈ Gross − Turnover × CostPerTurn − Borrow − Fees",
    workedExample:
      "Gross Sharpe 1.8, turnover 50×/year, cost 10 bps/turn → 5 percentage points drag before other frictions. Gross beauty, net mediocrity.",
    pitfalls: [
      "Optimizing gross Sharpe then sprinkling costs later",
      "Using one cost for mega-caps and micro-caps",
      "Ignoring short locate and borrow variability",
    ],
    furtherReading: [
      { title: "Cemetery case: THE FREE FILL", note: "Cost autopsy in this product." },
      { title: "Almgren–Chriss / impact models overview", note: "Why size matters." },
    ],
  },
  {
    index: "19",
    title: "Backtest validation",
    track: "Research",
    level: "Advanced",
    minutes: 36,
    source: "machine-learning-for-trading",
    premise: "Validation measures whether a research process generalizes—not whether one curve fit the past.",
    objectives: [
      "Use walk-forward evaluation",
      "Nest model selection inside training",
      "Account for multiple testing",
      "Freeze a final holdout",
    ],
    explanation:
      "Time-aware splits preserve causal order. Hyperparameters belong inside training folds; the final holdout stays untouched until the process freezes. When you try many ideas, the best observed result is partly a selection statistic—deflate or require nested validation.\n\nWalk-forward is not a single method; it is a family. Expanding vs rolling windows answer different stationarity assumptions.\n\nThe unit of validation is the full pipeline: data rules, features, model, costs, and selection policy.",
    exercise: "Design expanding-window scheme with train, tune, embargo, final test. State what may change at each stage.",
    takeaway: "The unit being validated is the full decision process, including selection.",
    keyTerms: [
      { term: "Walk-forward", def: "Sequential retrain/test along time." },
      { term: "Multiple testing", def: "Many trials inflate the chance of a lucky “winner.”" },
      { term: "Holdout contamination", def: "Peeking at final test during research iterations." },
    ],
    workedExample:
      "You try 200 feature sets, pick the best test Sharpe 2.1. Under naive nulls, order statistics say the max of 200 noisy Sharpes is biased upward. Nested CV or trial deflation is mandatory for honesty.",
    pitfalls: [
      "Tuning on the test set “just to check”",
      "Ignoring economic significance vs statistical noise",
      "Changing the story after seeing the holdout",
    ],
    furtherReading: [
      { title: "Bailey & López de Prado — probability of backtest overfitting", note: "Multiple testing reality check." },
      { title: "Research pipeline gates in this product", note: "Operational checklist sequence." },
    ],
  },
  {
    index: "20",
    title: "Portfolio optimization basics",
    track: "Portfolio",
    level: "Intermediate",
    minutes: 32,
    source: "financial-models-numerical-methods",
    premise: "Portfolio construction converts uncertain forecasts into constrained exposures—optimization amplifies belief.",
    objectives: [
      "Read μ and Σ inputs critically",
      "Interpret mean–variance trade-offs",
      "See estimation error → extreme weights",
      "Apply constraints and shrinkage intuition",
    ],
    explanation:
      "Mean–variance optimizes expected return vs variance. Math is clean; inputs are filthy. Tiny errors in expected returns create extreme weights—the “error maximization” property.\n\nConstraints, regularization, risk parity, and Bayesian shrinkage often matter more than a fancier solver. A numerically optimal unconstrained portfolio can be operationally insane.\n\nOptimization is a language for encoding beliefs and limits. If your beliefs are noise, the portfolio will speak noise loudly.",
    exercise: "Perturb one asset’s expected return by 1%. Measure weight change with and without position caps.",
    takeaway: "Optimization amplifies input confidence—deserved or not.",
    keyTerms: [
      { term: "Efficient frontier", def: "Mean–variance optimal trade-off curve under a model." },
      { term: "Shrinkage", def: "Pulling noisy estimates toward structured targets to stabilize weights." },
      { term: "Risk parity", def: "Allocate so risk contributions are balanced rather than maximizing μ." },
    ],
    formula: "max_w  wᵀμ − (λ/2) wᵀΣw    s.t. constraints",
    workedExample:
      "Two-asset toy: unconstrained optimizers may dump 150% in the slightly higher μ asset. Add long-only and 10% caps; solution becomes boring—and often more honest.",
    pitfalls: [
      "Feeding raw historical means as if they were known α",
      "Reoptimizing daily with no turnover penalty",
      "Ignoring factor exposures while targeting vol",
    ],
    furtherReading: [
      { title: "PyPortfolioOpt docs", note: "Practical optimizers and caveats." },
      { title: "Lab: MEAN–VARIANCE / RISK", note: "Interactive portfolio metrics in this product." },
    ],
    labHint: "portfolio",
  },
];

export type ModelRecord = {
  name: string;
  family: string;
  status: string;
  accent: "lime" | "amber" | "blue";
  note: string;
  equation: string;
  intuition: string;
  assumptions: string[];
  failure: string;
  parameters: { name: string; meaning: string }[];
  whenToUse: string;
  workedExample: string;
};

export const models: ModelRecord[] = [
  {
    name: "Black–Scholes–Merton",
    family: "Diffusion",
    status: "LAB LIVE",
    accent: "lime",
    note: "Closed-form European option pricing under lognormal diffusion—the market’s quoting language.",
    equation: "dSₜ = μSₜdt + σSₜdWₜ",
    intuition: "A continuously rebalanced stock-and-cash portfolio replicates the option’s local risk; no-arbitrage pins the price.",
    assumptions: ["Continuous trading", "Constant volatility and rate", "No jumps or transaction costs", "European exercise"],
    failure: "Volatility smiles, jumps, discrete hedging, dividends, and liquidity make the hedge imperfect.",
    parameters: [
      { name: "σ", meaning: "Constant diffusion volatility (often replaced by implied vol in practice)." },
      { name: "r, q", meaning: "Rate and dividend/borrow yield entering the forward." },
      { name: "T, K", meaning: "Expiry and strike defining the contract." },
    ],
    whenToUse: "Baseline European values, teaching Greeks, quoting in IV space, controlling numerical methods.",
    workedExample: "S=100, K=105, r=5%, σ=20%, T=1, call ≈ $8.02 in the lab—use as regression target for MC/binomial.",
  },
  {
    name: "Geometric Brownian Motion",
    family: "Stochastic process",
    status: "LAB LIVE",
    accent: "lime",
    note: "Positive price paths with constant drift and volatility; backbone of classical option theory.",
    equation: "Sₜ = S₀ exp[(μ − σ²/2)t + σWₜ]",
    intuition: "Proportional shocks accumulate in log price; positivity is built in; mean and median diverge with σ.",
    assumptions: ["Independent increments", "Constant drift", "Constant volatility", "Lognormal prices"],
    failure: "Real returns cluster, jump, skew, and change regime.",
    parameters: [
      { name: "μ", meaning: "Real-world drift (replace for pricing measure)." },
      { name: "σ", meaning: "Diffusion scale on returns." },
    ],
    whenToUse: "Toy paths, teaching Itô correction, BS derivation, Monte Carlo baselines.",
    workedExample: "High σ with μ=0: mean price stays near S₀ while median decays—interview classic.",
  },
  {
    name: "Heston",
    family: "Stochastic volatility",
    status: "LAB LIVE",
    accent: "amber",
    note: "Mean-reverting variance with leverage-sensitive dynamics for richer smiles.",
    equation: "dvₜ = κ(θ − vₜ)dt + ξ√vₜdWᵛₜ",
    intuition: "Variance is its own state; correlation with spot creates skew; vol-of-vol creates wings.",
    assumptions: ["Continuous paths", "Square-root variance", "Stable long-run variance", "Constant parameters"],
    failure: "Calibration can be unstable; short-dated jumps remain poorly represented.",
    parameters: [
      { name: "κ, θ", meaning: "Speed and long-run variance level." },
      { name: "ξ, ρ, v₀", meaning: "Vol-of-vol, spot-var correlation, initial variance." },
    ],
    whenToUse: "When BS smile is too rigid and you need a parametric SV story.",
    workedExample: "Raise ξ: variance paths become turbulent; clustered quiet/wild regions appear.",
  },
  {
    name: "Merton Jump Diffusion",
    family: "Lévy / jumps",
    status: "LAB LIVE",
    accent: "amber",
    note: "Lognormal diffusion plus discontinuous compound-Poisson jumps for crash-like moves.",
    equation: "dS/S = (μ − λk)dt + σdW + (J − 1)dN",
    intuition: "Most moves are continuous; rare events arrive with random size—tails fatten.",
    assumptions: ["Poisson arrivals", "Independent jump sizes", "Constant intensity", "Diffusion between jumps"],
    failure: "Jump intensity and size can change exactly in stress—when you need them most.",
    parameters: [
      { name: "λ", meaning: "Jump intensity (expected jumps per unit time)." },
      { name: "J", meaning: "Jump size distribution (often lognormal)." },
    ],
    whenToUse: "Teaching discontinuous risk; crude crash premia; comparing to pure diffusion.",
    workedExample: "Same σ diffusion with λ>0 produces occasional vertical path breaks in the lab.",
  },
  {
    name: "Ornstein–Uhlenbeck",
    family: "Mean reversion",
    status: "LAB LIVE",
    accent: "amber",
    note: "Gaussian process pulled toward a long-run level—rates, spreads, residuals.",
    equation: "dXₜ = κ(θ − Xₜ)dt + σdWₜ",
    intuition: "Distance from θ creates expected pull; noise never dies; stationary variance σ²/(2κ).",
    assumptions: ["Fixed equilibrium", "Constant reversion speed", "Gaussian shocks", "Stationary parameters"],
    failure: "Structural breaks and drifting equilibria make historical reversion misleading.",
    parameters: [
      { name: "κ", meaning: "Reversion speed (half-life link)." },
      { name: "θ, σ", meaning: "Long-run level and noise scale." },
    ],
    whenToUse: "Residual modeling, pedagogical reversion, Vasicek-style rate toys.",
    workedExample: "Start far from θ: expected path returns, single path can diverge first.",
  },
  {
    name: "Kalman Filter",
    family: "State space",
    status: "LAB LIVE",
    accent: "blue",
    note: "Recursive latent-state estimation under linear Gaussian noise.",
    equation: "x̂ₜ|ₜ = x̂ₜ|ₜ₋₁ + Kₜ(yₜ − Hx̂ₜ|ₜ₋₁)",
    intuition: "Blend forecast and observation by relative uncertainty—the Kalman gain.",
    assumptions: ["Linear transition", "Gaussian noise", "Known covariances", "Correct state spec"],
    failure: "Nonlinearity, outliers, and bad covariances create overconfident states.",
    parameters: [
      { name: "Q, R", meaning: "Process and measurement noise covariances." },
      { name: "K", meaning: "Gain balancing model vs observation." },
    ],
    whenToUse: "Noisy observations of a latent fair value; pairs residual filtering; pedagogy.",
    workedExample: "Filter noisy GBM observations: smoothed path tracks latent level with lag vs noise trade-off.",
  },
  {
    name: "Mean–Variance",
    family: "Portfolio",
    status: "LAB LIVE",
    accent: "blue",
    note: "Expected-return and covariance trade-offs under constraints—optimization as belief amplifier.",
    equation: "max wᵀμ − (λ/2)wᵀΣw",
    intuition: "Pay expected return for modeled variance; constraints keep solutions tradable.",
    assumptions: ["Single-period", "Stable μ, Σ", "Variance proxies risk", "Frictionless rebalance"],
    failure: "Noisy forecasts produce concentrated, unstable weights—error maximization.",
    parameters: [
      { name: "μ, Σ", meaning: "Expected returns and covariance—the true battleground." },
      { name: "λ / risk aversion", meaning: "Trade-off dial between return and variance." },
    ],
    whenToUse: "Pedagogy, constrained allocation sketches, comparing risk models—not raw α dumps.",
    workedExample: "1% μ perturbation can swing unconstrained weights wildly; caps stabilize.",
  },
];

export const pipeline = [
  {
    index: "01",
    name: "DATA",
    copy: "Build a point-in-time, bias-aware research universe.",
    checklist: [
      "Record observation and availability timestamps",
      "Preserve delisted securities and corporate actions",
      "Version every raw input and transformation",
      "Document timezone and session conventions",
    ],
    failure: "Using a cleaned current universe to explain the past.",
    deepDive:
      "Data is not a neutral substrate. Adjustments, vendor revisions, and survivorship rewrite history. Freeze snapshots. Prefer event-time + availability-time pairs over “date keys.” If you cannot rebuild a feature from raw logs, you do not control your research.",
  },
  {
    index: "02",
    name: "FEATURES",
    copy: "Transform observations without leaking the future.",
    checklist: [
      "Fit transforms inside each training fold",
      "Lag data to true availability",
      "Document missing-value rules",
      "Unit-test: future deletion leaves past features unchanged",
    ],
    failure: "Global normalization learns from the holdout period.",
    deepDive:
      "Features are claims about what was knowable. Scaling, PCA, embeddings, and target encoding all leak if fit globally. Write the knowable-at-t test for every column.",
  },
  {
    index: "03",
    name: "MODELS",
    copy: "Fit the simplest model that can test the hypothesis.",
    checklist: [
      "Define a naive baseline first",
      "Bound complexity deliberately",
      "Track every experiment with seeds and data versions",
      "Prefer interpretable failures early",
    ],
    failure: "Complexity substitutes for a clear hypothesis.",
    deepDive:
      "A linear model that fails cleanly teaches more than a black box that “kind of works.” Complexity is a budget: spend it only after simple baselines die for understood reasons.",
  },
  {
    index: "04",
    name: "VALIDATION",
    copy: "Use time-aware splits and honest model selection.",
    checklist: [
      "Preserve causal order",
      "Nest hyperparameter selection",
      "Keep one final untouched test",
      "Account for multiple trials",
    ],
    failure: "The test set becomes another training set through repeated inspection.",
    deepDive:
      "Validation is governance. If selection happens outside the folds, your metrics are advertisements. Deflate, nest, embargo, and write the selection policy before looking.",
  },
  {
    index: "05",
    name: "BACKTEST",
    copy: "Translate predictions into explicit trading rules.",
    checklist: [
      "State signal time and order time",
      "Model feasible fills",
      "Reconcile positions and cash",
      "Log every order assumption",
    ],
    failure: "Predictions are evaluated without a realizable portfolio rule.",
    deepDive:
      "A score is not a trade. Position sizing, side, timing, and holding rules convert research into a path of holdings. If two researchers cannot implement the same rule from your write-up, it is not a backtest—it is vibes.",
  },
  {
    index: "06",
    name: "COSTS",
    copy: "Model turnover, spreads, impact, borrow, and delay.",
    checklist: [
      "Stress multiple cost levels",
      "Model liquidity by instrument",
      "Report capacity assumptions",
      "Include borrow and short constraints",
    ],
    failure: "Every order fills instantly at the midpoint.",
    deepDive:
      "Costs are part of the alpha definition. Publish break-even cost and the capacity story. Gross-only results are marketing.",
  },
  {
    index: "07",
    name: "PORTFOLIO",
    copy: "Turn signals into constrained exposures and weights.",
    checklist: [
      "Cap concentration",
      "Neutralize unintended factors",
      "Model rebalance policy and turnover",
      "Simulate operational constraints",
    ],
    failure: "A small forecast difference creates an extreme allocation.",
    deepDive:
      "Portfolio construction is where fragile forecasts become concentrated bets. Constraints are not “anti-quant”—they are anti-delusion.",
  },
  {
    index: "08",
    name: "RISK",
    copy: "Stress assumptions, tails, concentration, and failure modes.",
    checklist: [
      "Run historical and hypothetical shocks",
      "Expose factor and liquidity concentration",
      "Write kill conditions before go-live",
      "Monitor live vs research distribution shift",
    ],
    failure: "Risk is reduced to one backward-looking volatility number.",
    deepDive:
      "Risk is the research of how you are wrong. Pre-commit kill rules. If you only discover risk after drawdowns, you never had a risk process—you had hope.",
  },
] as const;

export const tools = [
  { name: "QuantLib", workflow: "Pricing", language: "C++ / Python", access: "Open source", url: "https://github.com/lballabio/QuantLib", blurb: "Industrial open-source pricing library—curves, options, exotics." },
  { name: "PyPortfolioOpt", workflow: "Portfolio", language: "Python", access: "Open source", url: "https://github.com/robertmartin8/PyPortfolioOpt", blurb: "Mean–variance, risk models, and practical allocation helpers." },
  { name: "vectorbt", workflow: "Backtesting", language: "Python", access: "Open source", url: "https://github.com/polakowo/vectorbt", blurb: "Fast vectorized backtesting for research iteration." },
  { name: "statsmodels", workflow: "Time series", language: "Python", access: "Open source", url: "https://github.com/statsmodels/statsmodels", blurb: "Classical stats, ARIMA, HAC SE, diagnostics." },
  { name: "Riskfolio-Lib", workflow: "Risk", language: "Python", access: "Open source", url: "https://github.com/dcajasn/Riskfolio-Lib", blurb: "Portfolio optimization with rich risk measures." },
  { name: "TA-Lib", workflow: "Indicators", language: "C / Python", access: "Open source", url: "https://github.com/TA-Lib/ta-lib", blurb: "Battle-tested technical indicators—still useful as features, not oracles." },
  { name: "Zipline", workflow: "Backtesting", language: "Python", access: "Open source", url: "https://github.com/quantopian/zipline", blurb: "Event-driven backtester lineage from Quantopian." },
  { name: "mlfinlab", workflow: "ML workflow", language: "Python", access: "Commercial", url: "https://github.com/hudson-and-thames/mlfinlab", blurb: "AFML-inspired tooling; check license before use." },
  { name: "FinQuant", workflow: "Portfolio", language: "Python", access: "Open source", url: "https://github.com/fmilthaler/FinQuant", blurb: "Lightweight portfolio analysis for education." },
  { name: "QuantConnect LEAN", workflow: "Research engine", language: "C# / Python", access: "Open source", url: "https://github.com/QuantConnect/Lean", blurb: "Full research/trading engine you can run and inspect." },
  { name: "cvxpy", workflow: "Portfolio", language: "Python", access: "Open source", url: "https://github.com/cvxpy/cvxpy", blurb: "Convex optimization modeling—encode constraints honestly." },
  { name: "arch", workflow: "Time series", language: "Python", access: "Open source", url: "https://github.com/bashtage/arch", blurb: "Volatility models (GARCH family) for residual reality checks." },
] as const;

export const graves = [
  {
    name: "THE SHARPE MIRAGE",
    cause: "Overfit parameters",
    note: "A beautiful in-sample ratio produced by repeated selection.",
    symptom: "Performance collapses when parameters move slightly or the sample advances.",
    diagnosis: "The search process selected noise and the reported Sharpe ignored the number of trials.",
    repair: "Freeze a selection protocol, use nested walk-forward validation, and report parameter sensitivity.",
    test: "Does a broad neighborhood of settings survive a genuinely untouched period?",
    lesson: "Multiple testing turns the max Sharpe into a trophy for noise.",
  },
  {
    name: "THE TIME TRAVELER",
    cause: "Look-ahead bias",
    note: "Tomorrow’s close quietly entered today’s feature set.",
    symptom: "Fills look uncannily precise and results change when signals are delayed one bar.",
    diagnosis: "The backtest aligned data by date instead of the moment each value became observable.",
    repair: "Track availability timestamps and enforce signal, order, and fill sequencing.",
    test: "Can every feature value be reconstructed using only information available at decision time?",
    lesson: "Calendar joins are not information-set joins.",
  },
  {
    name: "THE IMMORTAL INDEX",
    cause: "Survivorship bias",
    note: "Dead securities vanished from the historical universe.",
    symptom: "The strategy favors persistent winners and rarely encounters delistings or distressed names.",
    diagnosis: "Today’s constituents were projected backward, importing knowledge of future survival.",
    repair: "Use point-in-time memberships, delisting returns, and historical security masters.",
    test: "At each rebalance, could the strategy have known exactly this universe?",
    lesson: "Universes have birth and death certificates.",
  },
  {
    name: "THE FREE FILL",
    cause: "Transaction costs",
    note: "Every order filled at mid with infinite liquidity.",
    symptom: "The edge scales without limit and turnover appears harmless.",
    diagnosis: "The simulator omitted spread, impact, borrow, delay, or participation constraints.",
    repair: "Model costs by instrument and size, then stress them well beyond the base case.",
    test: "What cost level erases the edge, and is that level plausible for the intended capacity?",
    lesson: "Gross alpha is a draft. Net alpha is the submission.",
  },
  {
    name: "THE LEAKY LABEL",
    cause: "Feature leakage",
    note: "Preprocessing learned from observations beyond the training fold.",
    symptom: "Cross-validation is excellent while live or forward performance is ordinary.",
    diagnosis: "A transform, label, or imputation rule used data from outside its training window.",
    repair: "Fit the entire preprocessing pipeline independently inside each temporal fold.",
    test: "If the future rows are deleted, are all historical feature values unchanged?",
    lesson: "Validation theater collapses when the future is sealed.",
  },
  {
    name: "THE REGIME TOURIST",
    cause: "Non-stationarity",
    note: "One market regime was mistaken for a permanent law.",
    symptom: "The strategy works in one volatility, rate, or liquidity environment and fails elsewhere.",
    diagnosis: "The estimated relationship was conditional on a regime the model treated as universal.",
    repair: "Validate across regimes, add monitoring, reduce leverage, and define kill conditions.",
    test: "Which observable state variables explain when the edge disappears?",
    lesson: "A regime is a co-author of your backtest—credit it.",
  },
] as const;

export const sources = [
  { id: "awesome-quant", repo: "wilsonfreitas/awesome-quant", commit: "9289247", branch: "main", license: "No root license detected", surface: "Quant Stack", why: "Map of open tools—not a syllabus, but a shelf." },
  { id: "computational-finance-course", repo: "LechGrzelak/Computational-Finance-Course", commit: "f2c192d", branch: "main", license: "BSD-3-Clause", surface: "Derivatives School", why: "Stochastic calculus and pricing pedagogy with code." },
  { id: "machine-learning-for-trading", repo: "stefan-jansen/machine-learning-for-trading", commit: "4592d5b", branch: "main", license: "MIT", surface: "Research Pipeline", why: "Point-in-time ML research habits that survive peer review." },
  { id: "financial-models-numerical-methods", repo: "cantaro86/Financial-Models-Numerical-Methods", commit: "585ed19", branch: "master", license: "AGPL-3.0 — isolated", surface: "Model Zoo", why: "Numerical methods and model laboratories with rigor." },
];

export const quests = [
  "Price a call without memorizing the formula",
  "Prove put–call parity numerically",
  "Catch the time traveler",
  "Build a point-in-time split",
  "Estimate Monte Carlo error",
  "Stress a volatility assumption",
  "Autopsy a free-fill backtest",
  "Map one model to three tools",
  "Find the hidden regime change",
  "Ship a cited research memo",
];

/** Curated free resources — Reddit r/quant style “what should I actually study?” */
export const freeResources = [
  { title: "MIT 18.S096 topics in math of data / quant playlists", kind: "Course", note: "Math-first lectures people still recommend for foundations.", url: "https://ocw.mit.edu" },
  { title: "Stanford RL for Finance (PDF book)", kind: "Book", note: "Free RL×finance text often linked from r/quant.", url: "https://stanford.edu/~ashlearn/RLForFinanceBook/book.pdf" },
  { title: "ESL — Elements of Statistical Learning", kind: "Book", note: "r/quant’s “Hull of ML”: free PDF from the authors.", url: "https://hastie.su.domains/ElemStatLearn/" },
  { title: "QuantLib", kind: "Code", note: "Read real pricing code; don’t only read blogs.", url: "https://github.com/lballabio/QuantLib" },
  { title: "LEAN engine", kind: "Code", note: "Full open research/trading stack you can audit.", url: "https://github.com/QuantConnect/Lean" },
  { title: "AFML concepts (book + discussions)", kind: "Method", note: "Purged CV, meta-labeling, fractional differentiation debates.", url: "https://www.amazon.com/Advances-Financial-Machine-Learning-Marcos/dp/1119482089" },
] as const;

export const tracks = [
  { id: "Foundations", blurb: "What the job is, returns, and how not to lie with averages." },
  { id: "Probability", blurb: "Distributions, tails, and risk language beyond volatility." },
  { id: "Stochastic", blurb: "Brownian building blocks and mean reversion." },
  { id: "Derivatives", blurb: "Options, BS, Greeks, implied vol—the contract desk." },
  { id: "Numerical", blurb: "Monte Carlo and computation with honest error bars." },
  { id: "Model Zoo", blurb: "Heston, OU, jumps—when BS is not enough." },
  { id: "Research", blurb: "Leakage, validation, and process design." },
  { id: "Backtesting", blurb: "Look-ahead, survivorship, costs—the cemetery feeders." },
  { id: "Portfolio", blurb: "From forecasts to constrained exposures." },
] as const;

export const SITE = {
  github: "https://github.com/nickzsche21/quantfinancefinalboss",
  live: "https://quantfinancefinalboss.vercel.app",
  twitterShare:
    "https://twitter.com/intent/tweet?text=" +
    encodeURIComponent(
      "No Free Alpha — free open-source quant syllabus: 20 deep lessons, 12 live labs, model dossiers, research pipeline & backtest cemetery. No profit promises.\n\nhttps://quantfinancefinalboss.vercel.app\nhttps://github.com/nickzsche21/quantfinancefinalboss",
    ),
} as const;
