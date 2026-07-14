# NO FREE ALPHA

> No free alpha. Free syllabus though.

NO FREE ALPHA is a source-attributed interactive quant-finance university. It reorganizes four public GitHub repositories into a curriculum, Model Zoo, Quant Stack, research pipeline, failure-mode cemetery, roadmap, and controlled numerical labs.

This repository contains the working product and the ingestion system behind it. Repository notebooks and scripts are parsed structurally and never executed.

## What works

- Locked clones, recursive inventories, license discovery, and provenance manifests for all four sources.
- Safe Markdown, notebook, Python AST, and PDF metadata extraction.
- 557 normalized source records plus 621 unique Awesome Quant links.
- Twenty seed lessons, seven model cards, eight pipeline stages, six backtest autopsies, and ten quests.
- Twelve controlled labs spanning diffusion, option pricing, implied volatility, stochastic volatility, jumps, filtering, portfolio construction, and risk.
- Independent Python quant engine with numerical tests and a FastAPI calculation boundary.
- Responsive terminal UI, global search, roadmap assessment, source ledger, and legal routes.

## Architecture

- `app/` — strict TypeScript web product.
- `apps/api/` — FastAPI boundary and Alembic migration baseline.
- `packages/quant_engine/` — independent numerical implementations.
- `scripts/` — clone, inventory, extract, normalize, validate, seed, and report commands.
- `data/` — registry, provenance, inventories, normalized artifacts, fixtures, and local database output.
- `source-repositories/` — ignored, reproducible source clones.
- `docs/` — product, architecture, ingestion, coverage, license, deployment, and progress documentation.

## Prerequisites

- Node.js 22.13 or newer
- pnpm 11
- Python 3.12 or newer
- Git
- Docker Desktop only when running PostgreSQL, Redis, and the API container

## Setup

```bash
cp .env.example .env
pnpm install
docker compose up -d
python -m pip install -r apps/api/requirements.txt
```

PowerShell equivalent for the first command:

```powershell
Copy-Item .env.example .env
```

No paid API or hosted credential is required.

## Ingestion

```bash
python scripts/clone_sources.py
python scripts/inventory_sources.py
python scripts/extract_all.py
python scripts/normalize_content.py
python scripts/validate_provenance.py
python scripts/generate_reports.py
python scripts/seed_database.py
```

Use `--repo <canonical-id>` for a single clone and `--refresh` to fast-forward clean clones. The clone command refuses to refresh a working tree with local changes.

## Development

```bash
pnpm dev
```

The web app runs at `http://localhost:3000`. The containerized API runs at `http://localhost:8000`, with health at `/api/v1/health` and OpenAPI at `/docs`.

## Testing and validation

```bash
python -m unittest packages.quant_engine.tests.test_quant_engine -v
pnpm lint
pnpm exec tsc --noEmit
pnpm build
pnpm test
python scripts/validate_provenance.py
```

Numerical tests cover a Black–Scholes reference value, put–call parity, implied-volatility inversion, Monte Carlo error tolerance, reproducibility, positivity, and input boundaries.

## Deployment

Build the web surface with `pnpm build` and deploy through the configured Sites workflow or another compatible host. Deploy the API container separately, run the Alembic migration against managed PostgreSQL, and point the web runtime at `NEXT_PUBLIC_API_BASE_URL`.

Source refreshes produce review artifacts only; they never publish automatically.

## Licensing and attribution

See [ATTRIBUTION.md](ATTRIBUTION.md), [LICENSE-COMPLIANCE.md](LICENSE-COMPLIANCE.md), and [docs/licenses.md](docs/licenses.md). The Financial Models–Numerical Methods source is detected as AGPL-3.0 and remains isolated; product numerical code is independently implemented.

## Known limitations

- Authenticated progress, admin review UI, public profiles, semantic search, subscriptions, and LLM augmentation remain disabled.
- Normalized machine records stay human-review-required; only curated seed content is presented as published.
- One upstream filename is invalid on Windows and is inventoried through GitHub’s locked tree API.

Educational use only. Not investment advice. No affiliation or endorsement is implied.
