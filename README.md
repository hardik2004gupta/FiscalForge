# FiscalForge

**Serverless AWS FinOps Platform with Agentic AI**

> Understand your AWS spend. Find savings. Act with confidence.

FiscalForge answers four questions about your AWS account:

1. How much am I spending?
2. Where is the money going?
3. Which resources might be wasting money?
4. What should I do about it?

---

## Architecture

```
Next.js Frontend
      ↓
API Gateway (HTTP API)
      ↓
ONE Python Lambda
      ↓
AWS APIs (Cost Explorer, EC2, RDS, S3, CloudWatch)
      ↓
Deterministic Optimization Engine
      ↓
ONE LangGraph AI Agent
```

One frontend. One API boundary. One Lambda. One agent. No microservices.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Recharts |
| Backend | Python 3.11, AWS Lambda, API Gateway HTTP API |
| AI | LangGraph, OpenAI GPT-4o |
| Infrastructure | Terraform |
| CI/CD | GitHub Actions |

---

## Local Development (Mock Mode)

No AWS account required for local development. All AWS calls are replaced with realistic mock data.

### Prerequisites

- Node.js 20+
- Python 3.11+
- pip

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`. The dev server proxies `/api/*` to `http://localhost:8000`.

### Backend

```bash
pip install -r requirements.txt
```

Create `.env` from the example:

```bash
cp .env.example .env
```

Run the Lambda handler locally using the mock server:

```bash
FISCALFORGE_MOCK_AWS=true python -m backend.dev_server
```

The mock backend runs at `http://localhost:8000`.

### Environment Variables

Copy `.env.example` and fill in values:

```
FISCALFORGE_MOCK_AWS=true   # Set false for real AWS
AWS_REGION=us-east-1
OPENAI_API_KEY=             # Required only for the AI advisor
OPENAI_MODEL=gpt-4o
```

**Never commit `.env`** — it is in `.gitignore`.

---

## Running Tests

```bash
pytest tests/ -v
```

Tests run in mock mode and make no live AWS calls. All optimization rules, cost calculations, and resource normalization logic are covered.

```bash
ruff check backend/ tests/
ruff format --check backend/ tests/
mypy backend/
```

---

## Application Routes

| Route | Description |
|---|---|
| `/` | Marketing homepage |
| `/dashboard` | KPI cards, cost trend chart, service breakdown |
| `/costs` | Detailed cost analytics with spending trend |
| `/resources` | EC2, RDS, S3 inventory + optimization recommendations |
| `/advisor` | AI cost advisor chat interface |

---

## API Reference

### `GET /api/costs`

Returns total and daily cost data with period-over-period comparison.

```json
{
  "total_cost": 4281.62,
  "previous_cost": 3810.41,
  "change_percent": 12.36,
  "daily_costs": [
    {"date": "2024-01-01", "cost": 142.05}
  ],
  "services": [
    {"name": "EC2", "cost": 1820.10}
  ]
}
```

### `GET /api/resources`

Returns EC2, RDS, and S3 inventory with utilization data.

### `GET /api/recommendations`

Returns deterministic optimization findings with severity and estimated savings.

### `POST /api/advisor`

Sends a message to the LangGraph AI advisor.

Request: `{"message": "Why did my costs increase?"}`

Response: `{"response": "Your AWS spend increased by..."}`

### `POST /api/actions/ec2/stop`

Stops an EC2 instance. **Only called after explicit user confirmation in the UI.**

Request: `{"instance_id": "i-1234567890abcdef0"}`

---

## AI Safety Boundary

The AI advisor **never executes AWS actions**. It can only recommend.

```
AI Advisor → Recommendation → User Approval Dialog → POST /api/actions/ec2/stop → Lambda → AWS
```

The user sees a confirmation dialog before any EC2 stop action executes. The AI has no access to the action endpoint.

---

## AWS Deployment

### Prerequisites

- AWS CLI configured with sufficient permissions
- Terraform 1.6+
- Python 3.11 (for building the Lambda package)

### Step 1: Build the Lambda package

```bash
./scripts/build_lambda.sh
```

Output: `dist/fiscalforge-backend.zip`

### Step 2: Deploy infrastructure

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

Terraform provisions:
- Lambda function (`fiscalforge-backend-dev`)
- API Gateway HTTP API
- IAM role with least-privilege policy
- CloudWatch log group (14-day retention)

### Step 3: Configure secrets

`OPENAI_API_KEY` is intentionally absent from Terraform to avoid committing secrets. Inject it after deployment:

```bash
aws lambda update-function-configuration \
  --function-name fiscalforge-backend-dev \
  --environment "Variables={
    FISCALFORGE_MOCK_AWS=false,
    OPENAI_MODEL=gpt-4o,
    OPENAI_API_KEY=sk-...
  }"
```

If `OPENAI_API_KEY` is not set, the advisor returns a friendly unavailable message — the rest of the application continues to work normally.

### Step 4: Configure the frontend

Set the API Gateway URL (from `terraform output api_gateway_url`) as the frontend environment variable:

```
NEXT_PUBLIC_API_URL=https://<id>.execute-api.us-east-1.amazonaws.com
```

### Terraform Variables

| Variable | Default | Description |
|---|---|---|
| `aws_region` | `us-east-1` | AWS region |
| `environment` | `dev` | dev / staging / prod |
| `lambda_memory_mb` | `512` | Lambda memory (MB) |
| `lambda_timeout_seconds` | `30` | Lambda timeout |
| `lambda_zip_path` | `../dist/fiscalforge-backend.zip` | Path to built zip |
| `log_retention_days` | `14` | CloudWatch log retention |
| `frontend_origin` | `*` | CORS allowed origin (tighten for production) |
| `openai_model` | `gpt-4o` | OpenAI model for advisor |
| `mock_aws` | `false` | Deploy in mock-data mode |

---

## IAM Permissions

The Lambda IAM role uses least-privilege. Granted permissions:

| Service | Permissions | Reason |
|---|---|---|
| Cost Explorer | `GetCostAndUsage`, `GetCostForecast` | Read spending data |
| EC2 | `DescribeInstances`, `DescribeInstanceStatus`, `StopInstances` | Inventory + stop action |
| RDS | `DescribeDBInstances` | Inventory |
| S3 | `ListAllMyBuckets`, `GetBucketLocation`, `GetBucketAcl` | Inventory metadata |
| CloudWatch | `GetMetricStatistics`, `GetMetricData` | EC2 CPU utilization |
| CloudWatch Logs | `CreateLogGroup`, `CreateLogStream`, `PutLogEvents` | Lambda logging |

`ec2:TerminateInstances` is **not granted**. No destructive permissions.

---

## Optimization Engine

Cost optimization findings are deterministic and rule-based — the AI explains them, it does not discover them.

| Rule | Condition | Severity |
|---|---|---|
| EC2 Underutilization | Average CPU < 10% over 7 days | High |
| EC2 Rightsizing | Running > N days AND CPU < 10% | Medium |
| NAT Gateway | Minimal traffic detected | Medium |
| S3 Storage | Large bucket with infrequent access | Low |

Same input always produces the same output. Every rule is independently testable.

---

## Observability

Lambda logs are written as structured JSON to CloudWatch:

```
/aws/lambda/fiscalforge-backend-dev
```

Every request is logged with method, path, duration, and status. Errors include error code and message — never stack traces or credentials.

Monitor:
- Lambda invocations and error rate
- Lambda duration (p95)
- API Gateway 4xx and 5xx rates

---

## CI/CD

GitHub Actions runs on every push and pull request:

| Job | Checks |
|---|---|
| Backend | ruff lint, ruff format, mypy, pytest |
| Frontend | TypeScript type check, ESLint, Next.js build |
| Terraform | `terraform fmt -check`, `terraform init`, `terraform validate` |
| Build Lambda | Builds `fiscalforge-backend.zip` (main branch only) |

The Lambda artifact is uploaded with 7-day retention. Deployment (`terraform apply`) requires manual execution — it is not automated.

---

## Security

- AWS credentials are never in frontend code or browser storage
- The browser never calls AWS APIs directly
- No secrets in committed files — `.env` and `*.tfvars` are gitignored
- Lambda uses an IAM role — no hardcoded credentials
- `OPENAI_API_KEY` is injected post-deploy, not in Terraform state
- EC2 termination is not permitted — only stop
- All destructive actions require explicit user confirmation

---

## Project Structure

```
fiscalforge/
├── frontend/               Next.js application
│   ├── app/                Route pages (/, /dashboard, /costs, /resources, /advisor)
│   ├── components/         Reusable UI components
│   ├── lib/api.ts          Centralized API client
│   └── types/              TypeScript interfaces
├── backend/                Python Lambda application
│   ├── handler.py          Entry point and routing
│   ├── aws/                AWS service adapters
│   ├── optimization/       Deterministic optimization rules
│   └── agent/              LangGraph advisor agent
├── terraform/              Infrastructure as Code
├── scripts/                Build scripts
├── tests/                  Backend unit tests
└── .github/workflows/      CI/CD pipeline
```

---

## Development Phases

| Phase | Status | Description |
|---|---|---|
| Phase 0 | Complete | Engineering contract (CLAUDE.md) |
| Phase 1 | Complete | Repository foundation and CI setup |
| Phase 2 | Complete | AWS integrations, optimization engine, AI agent |
| Phase 3 | Complete | Premium frontend, full API integration |
| Phase 4 | Complete | Terraform, CI/CD, packaging, security, testing |
