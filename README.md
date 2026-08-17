# FiscalForge

**Serverless AWS FinOps Platform with Agentic AI**

> Understand your AWS spend. Find savings. Act with confidence.

---

## Overview

FiscalForge analyzes AWS cost and resource data, identifies optimization opportunities through deterministic rules, and uses an AI agent to explain findings in natural language.

**Core architecture:** Next.js → API Gateway → Python Lambda → AWS APIs → Optimization Engine → LangGraph AI Agent

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS, shadcn/ui, Recharts |
| Backend | Python 3.11, AWS Lambda, API Gateway |
| AWS SDK | boto3 |
| Cost Data | AWS Cost Explorer |
| Resources | EC2, RDS, S3, CloudWatch |
| AI Agent | LangGraph, OpenAI GPT-4o |
| Infrastructure | Terraform |
| CI/CD | GitHub Actions |
| Testing | pytest, moto |
| Quality | Ruff, mypy |

---

## Application Pages

| Route | Purpose |
|---|---|
| `/` | Marketing homepage |
| `/dashboard` | Primary AWS cost overview and KPI cards |
| `/costs` | Detailed cost analytics with charts |
| `/resources` | EC2, RDS, and S3 inventory |
| `/advisor` | AI cost advisor chat |

---

## Architecture

```
Next.js Dashboard
      ↓ HTTPS
API Gateway
      ↓
AWS Lambda (Python — single function)
      ↓
AWS APIs: Cost Explorer / EC2 / RDS / S3 / CloudWatch
      ↓
Optimization Engine (deterministic rules)
      ↓
LangGraph AI Agent (read-only — advisory only)
      ↓
Recommendations → User Approval → Action API → Lambda → AWS
```

The AI agent is **read-only**. All AWS actions require explicit user confirmation before Lambda executes them.

---

## Repository Structure

```
fiscalforge/
├── frontend/           Next.js app (App Router)
│   ├── app/            Pages: /, /dashboard, /costs, /resources, /advisor
│   ├── components/     Reusable UI components (Phase 3)
│   ├── lib/            Centralized API client, config, utilities
│   └── types/          TypeScript interfaces matching backend models
├── backend/            Python Lambda application
│   ├── handler.py      Lambda entry point and request router
│   ├── models.py       Pydantic data models (source of truth)
│   ├── aws/            AWS service adapters (Cost Explorer, EC2, RDS, S3)
│   ├── optimization/   Deterministic rules engine
│   ├── agent/          LangGraph advisor agent
│   └── mock/           Realistic mock data for local development
├── terraform/          AWS infrastructure as code (Phase 4)
├── tests/              pytest test suite with mocked boto3
├── docs/               Architecture and API contract documentation
└── .github/workflows/  CI: test, lint, type-check, terraform validate
```

---

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 20+
- AWS CLI (optional — mock mode available without credentials)

### Environment Setup

```bash
cp .env.example .env
# FISCALFORGE_MOCK_AWS=true is the default — no AWS account needed
```

### Backend

```bash
pip install -r requirements.txt
pytest tests/
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Mock AWS Mode

Run with realistic mock data — no AWS credentials required:

```bash
FISCALFORGE_MOCK_AWS=true
```

---

## API Endpoints

```
GET  /api/costs                  AWS spending data and period comparison
GET  /api/resources              EC2, RDS, S3 inventory with utilization
GET  /api/recommendations        Deterministic optimization findings
POST /api/advisor                AI advisor natural language query
POST /api/actions/ec2/stop       Approved EC2 stop (requires user confirmation)
```

Full contract: [docs/api-contract.md](docs/api-contract.md)

---

## Security

- AWS credentials are never in frontend code or source files
- Lambda uses an IAM role with least-privilege permissions
- AI agent is advisory only — AWS actions require explicit user approval
- See [CLAUDE.md §19](CLAUDE.md) for the complete security contract

---

## Development Status

| Phase | Status | Description |
|---|---|---|
| Phase 0 | ✅ Complete | Engineering contract (CLAUDE.md) |
| Phase 1 | ✅ Complete | Repository foundation and architecture skeleton |
| Phase 2 | 🔲 Planned | AWS integrations, optimization engine, AI agent |
| Phase 3 | 🔲 Planned | Premium frontend, full API integration |
| Phase 4 | 🔲 Planned | Terraform, CI/CD, observability, deployment |

---

## Engineering Contract

See [CLAUDE.md](CLAUDE.md) — the binding engineering contract for all implementation phases.
