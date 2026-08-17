# FiscalForge Architecture

> Implementation-focused architecture documentation.
> For product scope and engineering contract, see [CLAUDE.md](../CLAUDE.md).

---

## System Layers

```
┌──────────────────────────────────────┐
│  1. Presentation                     │
│  Next.js App Router (TypeScript)     │
│  Routes: / /dashboard /costs         │
│          /resources /advisor         │
├──────────────────────────────────────┤
│  2. API Boundary                     │
│  API Gateway (HTTP API)              │
│  Terminates HTTPS, routes to Lambda  │
├──────────────────────────────────────┤
│  3. Application Logic                │
│  AWS Lambda — ONE Python function    │
│  handler.py routes all five endpoints│
├──────────────────────────────────────┤
│  4. AWS Data                         │
│  Cost Explorer / EC2 / RDS / S3      │
│  CloudWatch (EC2 CPU metrics)        │
├──────────────────────────────────────┤
│  5. Intelligence                     │
│  Optimization Engine (deterministic) │
│  LangGraph Agent (read-only, 1 agent)│
└──────────────────────────────────────┘
```

---

## Data Flows

### Cost Data Flow

```
User opens /dashboard
    ↓
Next.js calls getCosts() via lib/api.ts
    ↓
GET /api/costs → API Gateway
    ↓
Lambda handler._handle_costs()
    ↓
aws.cost_explorer.get_cost_summary()
    ↓
boto3 → AWS Cost Explorer GetCostAndUsage
    ↓
Normalize to CostSummary model
    ↓
JSON response → Recharts line + bar charts
```

### Resource Inventory Flow

```
User opens /resources
    ↓
Next.js calls getResources()
    ↓
GET /api/resources → Lambda
    ↓
handler._handle_resources()
    ↓  (parallel)
├── aws.ec2.get_ec2_instances()
├── aws.rds.get_rds_instances()
└── aws.s3.get_s3_buckets()
    ↓
CloudWatch CPU metrics for EC2 instances
    ↓
Normalize to ResourceInventory model
    ↓
JSON response → EC2/RDS/S3 tables
```

### Optimization Flow

```
User opens /dashboard or /resources
    ↓
GET /api/recommendations → Lambda
    ↓
handler._handle_recommendations()
    ↓
Fetch resource inventory + CPU utilizations
    ↓
optimization.engine.run_optimization()
    ↓
For each resource, evaluate:
  rules.check_ec2_underutilization()
  rules.check_ec2_rightsizing()
  rules.check_s3_storage_optimization()
    ↓
Sort by severity (high → medium → low)
    ↓
RecommendationSummary → UI
```

### AI Advisor Flow

```
User types question in /advisor
    ↓
Next.js calls queryAdvisor()
    ↓
POST /api/advisor → Lambda
    ↓
handler._handle_advisor()
    ↓
agent.graph.run_advisor(message)
    ↓
LangGraph ReAct loop:
  Tool selection → call one or more of:
    get_cost_summary()
    get_resources()
    get_recommendations()
    ↓
  Tools return AWS-derived data
    ↓
  LLM reasons over real data
    ↓
Grounded natural-language response
    ↓
POST /api/advisor response → chat UI
```

### EC2 Stop Action Flow (Human Approval Required)

```
AI recommends stopping an instance
    ↓
User clicks "Approve and Stop" in UI
    ↓
Confirmation dialog shown
    ↓
User confirms
    ↓
stopEC2Instance(instanceId) via lib/api.ts
    ↓
POST /api/actions/ec2/stop → Lambda
    ↓
handler._handle_ec2_stop()
    ↓
Parse + validate EC2StopRequest (instance ID format)
    ↓
aws.ec2.stop_instance(instance_id)
    ↓
boto3 → EC2.stop_instances()
    ↓
EC2StopResponse → UI success/error state
```

**The AI agent never calls the action endpoint. It only recommends.**

---

## Module Boundaries

### `backend/handler.py`
Single Lambda entry point. Reads HTTP method and path from API Gateway event.
Routes to the correct internal handler function. No business logic here.

### `backend/aws/`
All boto3 calls live here. No other module uses boto3 directly.
- `cost_explorer.py` — Cost Explorer GetCostAndUsage
- `ec2.py` — describe_instances, stop_instances
- `rds.py` — describe_db_instances
- `s3.py` — list_buckets, CloudWatch bucket size
- `cloudwatch.py` — GetMetricStatistics for EC2 CPU

### `backend/optimization/`
Pure deterministic logic. No boto3, no AI calls.
- `rules.py` — individual rule functions (check_ec2_underutilization, etc.)
- `engine.py` — orchestrates rules, aggregates Recommendation list

### `backend/agent/`
LangGraph AI advisor. Read-only tools only. No action tools.
- `tools.py` — get_cost_summary, get_resources, get_recommendations
- `graph.py` — LangGraph compiled agent
- `prompts.py` — system prompt

### `backend/mock/`
Realistic mock data for local development and CI.
Active when `FISCALFORGE_MOCK_AWS=true`.
- `cost_data.py` — mock CostSummary
- `resources.py` — mock ResourceInventory
- `metrics.py` — mock CloudWatch CPU metrics

### `frontend/lib/api.ts`
The only module that calls `fetch()`. All pages and components import from here.
Never import `fetch` directly in a page or component.

---

## Mock Mode Architecture

```
FISCALFORGE_MOCK_AWS=true
         ↓
AWS adapter function checks config.mock_aws
         ↓
    True:  return mock.cost_data.get_mock_cost_summary()
    False: call boto3 → real AWS
```

Business logic (optimization rules, handler routing) does not know or care
whether data comes from real AWS or mock modules.

---

## Infrastructure

Managed by Terraform (Phase 4):

```
terraform/
├── main.tf      Provider + Lambda + API Gateway + CloudWatch log group
├── iam.tf       Lambda execution role with least-privilege policy
├── variables.tf Region, environment, Lambda config
└── outputs.tf   API Gateway URL, Lambda ARN, log group name
```

---

## Phase 2 Architectural Decisions

The following decisions were made during Phase 2 implementation and are now
part of the authoritative architecture:

### CloudWatch Evaluation Window: 14 Days

EC2 CPU utilization is measured over a **14-day trailing window** (not 7 days).

- **Why:** A 14-day window produces a more stable signal, reducing false positives
  from short-term CPU spikes (e.g., a weekly batch job would be missed in 7 days).
- **Where:** `backend/aws/cloudwatch.py` → `_EC2_CPU_EVALUATION_DAYS = 14`
- **Constant:** `get_ec2_cpu_utilization(days=14)` is the default call.

### EC2 Rightsizing Threshold: 30 Days Running

An EC2 instance must have been running for at least **30 days** before the
`EC2_RIGHTSIZING` rule fires.

- **Why:** Instances under 30 days are still in their initial sizing period.
  Recommending a downsize before the workload is established leads to churn.
- **Where:** `backend/optimization/rules.py` → `RIGHTSIZING_MIN_RUNNING_DAYS = 30`

### Cost Estimations

Monthly cost estimates are derived from On-Demand pricing in us-east-1:
- EC2: lookup table in `backend/aws/ec2.py` (`_INSTANCE_MONTHLY_COST`)
- RDS: lookup table in `backend/aws/rds.py` (`_RDS_MONTHLY_COST`)
- S3: `$0.023/GB/month` (`_S3_COST_PER_GB` in `backend/aws/s3.py`)

Estimated savings are approximate:
- EC2_UNDERUTILIZED: 50% of monthly instance cost (stop the instance)
- EC2_RIGHTSIZING: 30% of monthly instance cost (next smaller type)
- S3_STORAGE_OPTIMIZATION: 40% of S3 cost (Intelligent-Tiering)

### Mock Mode Boundary

Mock data is injected at the **adapter layer** only. Business logic
(optimization rules, handler routing, agent tools) is identical in mock
and real modes. The config singleton (`backend/config.py`) is reset between
tests via `reset_config()` to pick up monkeypatched env vars.

---

## CI Pipeline

```
Pull Request:
  backend job   → ruff lint → ruff format → mypy → pytest
  frontend job  → npm install → tsc → next build
  terraform job → terraform fmt -check → terraform init -backend=false → terraform validate

Main branch:
  All PR checks + (Phase 4) build Lambda zip → terraform plan → manual approve → terraform apply
```
