export type OptionType = "call" | "put";

export function normalCdf(x: number) {
  const sign = x < 0 ? -1 : 1;
  const value = Math.abs(x) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * value);
  const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-value * value);
  return 0.5 * (1 + sign * erf);
}

export function blackScholes(spot: number, strike: number, maturity: number, rate: number, volatility: number, type: OptionType) {
  const rootT = Math.sqrt(maturity);
  const d1 = (Math.log(spot / strike) + (rate + volatility * volatility / 2) * maturity) / (volatility * rootT);
  const d2 = d1 - volatility * rootT;
  const call = spot * normalCdf(d1) - strike * Math.exp(-rate * maturity) * normalCdf(d2);
  const put = strike * Math.exp(-rate * maturity) * normalCdf(-d2) - spot * normalCdf(-d1);
  return { price: type === "call" ? call : put, d1, d2, delta: type === "call" ? normalCdf(d1) : normalCdf(d1) - 1 };
}

function mulberry32(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(random: () => number) {
  const u = Math.max(random(), Number.EPSILON);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
}

export function simulatePath(kind: "brownian" | "gbm", spot: number, drift: number, volatility: number, steps: number, seed: number) {
  const random = mulberry32(seed);
  const dt = 1 / steps;
  const values = [kind === "gbm" ? spot : 0];
  for (let index = 0; index < steps; index += 1) {
    const shock = gaussian(random);
    values.push(kind === "gbm"
      ? values[index] * Math.exp((drift - volatility * volatility / 2) * dt + volatility * Math.sqrt(dt) * shock)
      : values[index] + Math.sqrt(dt) * shock);
  }
  return values;
}

export function monteCarlo(spot: number, strike: number, maturity: number, rate: number, volatility: number, simulations: number, seed: number, type: OptionType) {
  const random = mulberry32(seed);
  let sum = 0;
  let sumSquares = 0;
  for (let index = 0; index < simulations; index += 1) {
    const terminal = spot * Math.exp((rate - volatility * volatility / 2) * maturity + volatility * Math.sqrt(maturity) * gaussian(random));
    const payoff = type === "call" ? Math.max(terminal - strike, 0) : Math.max(strike - terminal, 0);
    sum += payoff;
    sumSquares += payoff * payoff;
  }
  const discount = Math.exp(-rate * maturity);
  const mean = sum / simulations;
  const variance = Math.max(sumSquares / simulations - mean * mean, 0);
  return { price: discount * mean, standardError: discount * Math.sqrt(variance / simulations) };
}

export function binomialOption(spot: number, strike: number, maturity: number, rate: number, volatility: number, steps: number, type: OptionType) {
  const dt = maturity / steps;
  const up = Math.exp(volatility * Math.sqrt(dt));
  const down = 1 / up;
  const probability = (Math.exp(rate * dt) - down) / (up - down);
  const values = Array.from({ length: steps + 1 }, (_, index) => {
    const terminal = spot * up ** (steps - index) * down ** index;
    return type === "call" ? Math.max(terminal - strike, 0) : Math.max(strike - terminal, 0);
  });
  for (let step = steps - 1; step >= 0; step -= 1) {
    for (let index = 0; index <= step; index += 1) values[index] = Math.exp(-rate * dt) * (probability * values[index] + (1 - probability) * values[index + 1]);
  }
  return values[0];
}

export function impliedVolatility(marketPrice: number, spot: number, strike: number, maturity: number, rate: number, type: OptionType) {
  let low = 0.0001;
  let high = 4;
  for (let index = 0; index < 80; index += 1) {
    const midpoint = (low + high) / 2;
    if (blackScholes(spot, strike, maturity, rate, midpoint, type).price < marketPrice) low = midpoint;
    else high = midpoint;
  }
  return (low + high) / 2;
}

export function simulateExtendedPath(kind: "ou" | "heston" | "merton", spot: number, drift: number, volatility: number, steps: number, seed: number) {
  const random = mulberry32(seed);
  const dt = 1 / steps;
  const values = [spot];
  let variance = volatility * volatility;
  for (let index = 0; index < steps; index += 1) {
    const z1 = gaussian(random);
    if (kind === "ou") {
      values.push(values[index] + 2.4 * (spot - values[index]) * dt + volatility * spot * 0.18 * Math.sqrt(dt) * z1);
    } else if (kind === "heston") {
      const z2 = -0.65 * z1 + Math.sqrt(1 - 0.65 ** 2) * gaussian(random);
      variance = Math.max(variance + 2.1 * (volatility * volatility - variance) * dt + 0.35 * Math.sqrt(Math.max(variance, 0)) * Math.sqrt(dt) * z2, 0);
      values.push(values[index] * Math.exp((drift - variance / 2) * dt + Math.sqrt(variance * dt) * z1));
    } else {
      const jump = random() < 0.7 * dt ? Math.exp(-0.04 + 0.12 * gaussian(random)) : 1;
      values.push(values[index] * Math.exp((drift - volatility * volatility / 2) * dt + volatility * Math.sqrt(dt) * z1) * jump);
    }
  }
  return values;
}

export function kalmanFilter(values: number[], processNoise = 0.01, measurementNoise = 0.12) {
  let estimate = values[0];
  let variance = 1;
  return values.map((measurement) => {
    variance += processNoise;
    const gain = variance / (variance + measurementNoise);
    estimate += gain * (measurement - estimate);
    variance *= 1 - gain;
    return estimate;
  });
}

export function portfolioMetrics(volatility: number, rate: number) {
  const weights = [0.45, 0.35, 0.2];
  const returns = [0.08, 0.055, 0.035].map((value, index) => value + (volatility - 0.2) * [0.12, 0.05, -0.02][index]);
  const vols = [volatility, volatility * 0.65, volatility * 0.35];
  const correlations = [[1, 0.45, 0.05], [0.45, 1, 0.18], [0.05, 0.18, 1]];
  const expectedReturn = weights.reduce((sum, weight, index) => sum + weight * returns[index], 0);
  let variance = 0;
  for (let i = 0; i < weights.length; i += 1) for (let j = 0; j < weights.length; j += 1) variance += weights[i] * weights[j] * vols[i] * vols[j] * correlations[i][j];
  const portfolioVolatility = Math.sqrt(variance);
  return { expectedReturn, volatility: portfolioVolatility, sharpe: (expectedReturn - rate) / portfolioVolatility };
}

export function riskMetrics(volatility: number, seed: number) {
  const random = mulberry32(seed);
  const returns = Array.from({ length: 10000 }, () => volatility / Math.sqrt(252) * gaussian(random)).sort((a, b) => a - b);
  const cutoff = Math.max(Math.floor(returns.length * 0.05), 1);
  const valueAtRisk = -returns[cutoff];
  const expectedShortfall = -returns.slice(0, cutoff).reduce((sum, value) => sum + value, 0) / cutoff;
  return { valueAtRisk, expectedShortfall };
}
