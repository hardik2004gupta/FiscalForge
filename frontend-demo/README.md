# FiscalForge Frontend Demo

A completely standalone Next.js application demonstrating the full FiscalForge UI with zero runtime dependencies on any backend, AWS service, or external API.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables required.

## What This Is

`frontend-demo/` is a production-quality interactive demo of FiscalForge that runs entirely in the browser with deterministic static data. It is completely independent from `frontend/`, `backend/`, and any AWS infrastructure.

**Works with Wi-Fi off. No accounts. No keys. No setup.**

## Routes

| Route | Description |
|---|---|
| `/` | Marketing homepage with architecture flow |
| `/dashboard` | KPI cards, cost trend chart, service breakdown, optimization summary |
| `/costs` | Spending trend (30D/90D toggle), event markers, service cost table |
| `/resources` | EC2/RDS/S3 tabs with search, recommendations panel |
| `/advisor` | Simulated AI advisor with keyword-based responses |

## Key Demo Features

**EC2 Stop Workflow** — Click any "Stop" button in `/resources → EC2`. An explicit confirmation dialog appears (simulating the human-approval step). Confirming shows a loading state, then updates the row to "Stopping" — no real AWS call is made.

**AI Advisor** — Ask any question in `/advisor`. Keyword matching returns responses grounded in the actual demo data values. No OpenAI API call is made.

**Period toggle** — The cost charts on `/dashboard` and `/costs` toggle between 30D and 90D views.

## Data

All data lives in `lib/demo-data/` and is deterministic (no `Math.random()`):

| File | Contents |
|---|---|
| `overview.ts` | KPIs, system status, account metadata |
| `costs.ts` | 90 daily cost entries + service breakdown summing to $18,426.72 |
| `resources.ts` | 42 EC2 + 8 RDS + 88 S3 = 138 resources |
| `recommendations.ts` | 17 findings totaling $3,284/month savings |
| `advisor.ts` | Keyword-response map + 6 suggested questions |

## Stack

- Next.js 15 (App Router)
- TypeScript strict mode
- Tailwind CSS v3 with custom design tokens
- Recharts (area charts with gradient fill)
- Lucide icons
- No backend. No database. No external requests.

## Verification

```bash
npm run type-check   # tsc --noEmit
npm run lint         # next lint
npm run build        # next build
```

All three pass with zero errors.

## Relationship to the Main Project

`frontend-demo/` is a sibling to `frontend/` and shares no imports with it. The real `frontend/` calls the actual Lambda backend via API Gateway. This demo replaces all API calls with static local data, making it suitable for offline demos, portfolio presentations, and CI previews without any infrastructure.
