# CLAUDE.md — FiscalForge Engineering Contract

---

## 1. Project Identity

```
Project:      FiscalForge
Description:  Serverless AWS FinOps Platform with Agentic AI
Tagline:      "Understand your AWS spend. Find savings. Act with confidence."
```

**Purpose:**
FiscalForge is a small, production-style application intentionally designed to demonstrate:

- Software Engineering (frontend architecture, REST APIs, Python, TypeScript, testing, error handling)
- AWS and serverless architecture (Lambda, API Gateway, IAM, Cost Explorer)
- Infrastructure as Code (Terraform)
- Cost analytics and resource inventory
- Deterministic optimization engine
- Agentic AI with human-approval safety boundary
- DevOps and observability

**Interview Positioning:**
Every architectural decision in this project must be explainable in a 30-second interview answer. The project is designed to be *simple and defensible*, not *complex and impressive*. Complexity that cannot be explained is a liability.

---

## 2. Source of Truth

The primary product and architecture specification is:

```
FiscalForge - AWS FinOps Platform with Agentic AI _ MVP Architecture Documentation.md
```

`CLAUDE.md` is the engineering execution contract derived from that specification.

When implementing:

1. Follow `CLAUDE.md`.
2. Preserve the architecture document's boundaries.
3. Do not invent additional architecture without explicit justification.
4. If a requirement is ambiguous, prefer the simplest implementation consistent with the architecture.
5. Never introduce complexity merely to make the project appear more impressive.

---

## 3. Core Architectural Invariant

**This invariant must never be violated.**

```
Next.js
   ↓
API Gateway
   ↓
ONE Python Lambda Backend
   ↓
AWS APIs
   ↓
Deterministic Optimization Engine
   ↓
ONE LangGraph AI Agent
```

The system must remain:

```
1 Frontend
1 API boundary
1 Lambda backend
1 Optimization Engine
1 AI Agent
```

- No microservices architecture.
- No multiple Lambda functions.
- No multi-agent architecture.
- No event-driven pipelines.
- No streaming infrastructure.

---

## 4. MVP Scope and Boundary

FiscalForge MVP must answer exactly four questions:

1. How much am I spending?
2. Where is the money going?
3. Which resources might be wasting money?
4. What should I do about it?

Everything outside these four questions is secondary and should not be implemented during MVP phases.

---

## 5. Technology Contract

**Approved technologies only. Do not add technologies outside this stack without explicit architectural justification.**

### Frontend
- Next.js (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- shadcn/ui
- Recharts
- Lucide icons

### Backend
- Python 3.11+
- AWS Lambda (single function)
- API Gateway (HTTP API)
- boto3
- Pydantic (data models)

### AWS Services
- AWS Cost Explorer
- EC2
- RDS
- S3
- CloudWatch
- IAM

### AI
- LangGraph
- OpenAI (GPT-4o or equivalent)

### Infrastructure
- Terraform

### CI/CD
- GitHub Actions

### Testing and Quality
- pytest
- Mocked boto3 (unittest.mock or moto)
- Ruff (linting and formatting)
- mypy (type checking)

---

## 6. Explicitly Forbidden Technologies

**Hard prohibition. Do NOT introduce any of the following:**

| Forbidden | Why |
|---|---|
| Kubernetes | Massive operational overhead; not needed for Lambda workload |
| Kafka | No event streaming requirement in MVP |
| Spark | No large-scale data processing requirement |
| Airflow | No pipeline orchestration requirement |
| Redis | No caching layer needed |
| Any database (PostgreSQL, DynamoDB, etc.) | AWS APIs are the data source; no persistence layer required |
| Microservices | Violates the single-Lambda invariant |
| Multiple Lambda functions | Violates the single-Lambda invariant |
| Event-driven pipelines | No async processing requirement |
| Data lakes / S3 data stores | AWS Cost Explorer is the data source, not a custom data lake |
| Complex ML models | Optimization is deterministic; AI explains findings |
| Multi-agent systems | One LangGraph agent is the contract |
| Complex authentication (Cognito, OAuth, etc.) | Unnecessary complexity for MVP |
| AWS Organizations / multi-account | Out of scope for MVP |
| Real-time streaming (WebSockets, SSE) | Not required for cost analytics |
| Custom ML forecasting infrastructure | Cost Explorer provides native forecasting |
| Prometheus | CloudWatch is sufficient for MVP |
| Grafana | CloudWatch is sufficient for MVP |
| OpenTelemetry | CloudWatch is sufficient for MVP |
| Unnecessary message queues | No async requirement |
| Unnecessary caching layers | Responses are lightweight |

Also prohibited: adding any infrastructure solely because it appears impressive on a resume. If the project cannot run without it, justify it. If it exists to pad the stack, remove it.

---

## 7. Frontend Contract

### Routes (exactly five)

```
/            Marketing homepage
/dashboard   Primary application screen — AWS overview and KPIs
/costs       Detailed cost analytics with charts
/resources   AWS resource inventory (EC2, RDS, S3)
/advisor     AI cost advisor with chat interface
```

No additional routes should be created without strong justification.

### Design Requirements
- Dark-mode-first design
- Enterprise-oriented visual language
- Polished, data-dense but readable
- Responsive (desktop primary, tablet acceptable)
- Accessible (ARIA labels, contrast ratios)
- Visually distinctive — not a generic admin template

### Homepage Requirements
- Hero with tagline and CTA buttons ("Open Dashboard", "View Architecture")
- Product visual showing the data flow
- Must feel like a real FinOps product landing page

### Dashboard Requirements (primary screen)
KPI cards:
- Total Spend
- Monthly Change (%)
- Potential Savings
- Resource Count

Charts:
- Cost trend line chart (7d / 30d / 90d toggle)
- Cost by service breakdown

Optimization summary:
- Count by severity (High / Medium / Low)

### Component Standards
- Reusable components in `frontend/components/`
- No duplicated UI logic
- Centralized API client in `frontend/lib/api.ts`
- All API calls go through the centralized client
- Predictable state management (React hooks; no unnecessary global state library)

---

## 8. Backend Contract

**The backend is ONE Python Lambda application. This is not negotiable.**

### API Routes

```
GET  /api/costs              Cost Explorer data, period comparison
GET  /api/resources          EC2 + RDS + S3 inventory
GET  /api/recommendations    Deterministic optimization findings
POST /api/advisor            AI agent interaction
POST /api/actions/ec2/stop   Approved EC2 stop action
```

### Lambda Responsibilities
- AWS data retrieval (boto3)
- Response normalization and aggregation
- Deterministic optimization rule execution
- AI advisor orchestration (LangGraph)
- Approved EC2 action execution
- Consistent error handling
- Structured CloudWatch logging

### Lambda Must NOT
- Directly expose raw boto3 exceptions
- Expose stack traces or internal details
- Store state between invocations
- Call external services other than AWS and OpenAI

### Backend Module Layout

```
backend/
├── handler.py          Lambda entry point; routes requests
├── config.py           Environment and configuration
├── models.py           Pydantic data models
├── aws/
│   ├── cost_explorer.py
│   ├── ec2.py
│   ├── rds.py
│   └── s3.py
├── optimization/
│   └── rules.py        Deterministic optimization rules
└── agent/
    ├── graph.py        LangGraph agent definition
    └── tools.py        Agent tools (get_cost_summary, get_resources, get_recommendations)
```

---

## 9. AWS Data Contract

### Supported AWS Data Sources
- Cost Explorer (spending data, period comparison, service breakdown)
- EC2 (instance inventory, state, utilization via CloudWatch)
- RDS (database inventory, instance class, status)
- S3 (bucket list, size, object count metadata)
- CloudWatch (EC2 CPU metrics for optimization rules)

### Security Invariant: Data Access Flow

```
Browser
   ↓
API Gateway
   ↓
Lambda
   ↓
AWS
```

**The frontend must NEVER directly access AWS APIs.**

AWS credentials must NEVER exist in:
- Frontend code
- Browser storage (localStorage, sessionStorage, cookies)
- Committed source files
- Git history
- Environment variables visible to the browser (NEXT_PUBLIC_ prefixed vars for AWS secrets)

Lambda accesses AWS via an IAM role. No hardcoded credentials anywhere.

---

## 10. Optimization Engine Contract

### Fundamental Rule

Optimization discovery is **deterministic and rule-based**. The AI does not discover optimization signals — it explains them.

### Implemented Rules (MVP)

```
Rule 1: EC2 UNDERUTILIZATION
  Condition: EC2 average CPU < 10% over evaluation period
  Finding:   Potentially underutilized EC2 instance
  Action:    Recommend rightsizing or stopping

Rule 2: EC2 RIGHTSIZING CANDIDATE
  Condition: EC2 running > N days AND average CPU < 10%
  Finding:   Long-running low-utilization instance
  Action:    Recommend rightsizing to smaller instance type

Rule 3: NAT GATEWAY OPTIMIZATION
  Condition: NAT Gateway exists with minimal traffic
  Finding:   Potential cost optimization
  Action:    Review NAT Gateway necessity

Rule 4: S3 STORAGE OPTIMIZATION
  Condition: Large S3 bucket with infrequent access patterns
  Finding:   Storage optimization candidate
  Action:    Review storage class or lifecycle policies
```

### Recommendation Structure

Every recommendation must contain:

```python
class Recommendation(BaseModel):
    id: str
    resource_id: str
    type: str           # EC2_RIGHTSIZING, EC2_UNDERUTILIZED, S3_STORAGE, NAT_GATEWAY
    severity: str       # high, medium, low
    reason: str         # Human-readable explanation
    estimated_savings: float  # Monthly USD estimate
```

### Quality Standards
- Rules must be deterministic (same input → same output, always)
- Rules must be independently testable
- Rules must be explainable without reading the code
- Rules must not depend on AI for their logic

---

## 11. Agentic AI Contract

FiscalForge uses **exactly one AI agent**. No multi-agent architecture.

### Agent Framework
LangGraph (Python)

### Agent Tools (exactly three)

```python
get_cost_summary()      # Returns recent AWS spending from Cost Explorer
get_resources()         # Returns EC2/RDS/S3 inventory
get_recommendations()   # Returns deterministic optimization findings
```

### Agent Responsibilities
- Analyze AWS-derived structured data
- Explain cost changes between periods
- Explain optimization opportunities
- Answer FinOps questions in natural language
- Suggest actions (recommend only; never execute)

### Agent Must NOT
- Invent AWS metrics not present in actual data
- Generate plausible-sounding but fabricated spending numbers
- Directly execute any AWS action
- Claim to have executed an AWS action
- Mix measured values with estimates without clear labeling

### Agent Communication Standards
The agent must distinguish between:
- Measured values (from AWS APIs)
- Calculated values (derived from measured data)
- Estimates (approximations with stated basis)
- Recommendations (suggested actions requiring human approval)

---

## 12. AI Safety Contract

**This is an inviolable architectural invariant.**

The AI agent must NEVER directly execute AWS actions.

### Required Execution Flow

```
AI
 ↓
Recommendation (AI output only)
 ↓
User Approval (explicit UI confirmation)
 ↓
Action API (POST /api/actions/ec2/stop)
 ↓
Lambda
 ↓
AWS (boto3 execution)
```

### MVP Allowed Actions
```
EC2 Stop     ← Only approved action for MVP
```

### Explicitly Prohibited AI Actions
- EC2 termination (not in MVP at all)
- S3 bucket deletion
- RDS deletion
- Any automatic destructive operation
- Any infrastructure modification without human approval

The AI says: "I recommend stopping instance i-1234567890abcdef0."
The user clicks: "Approve and Stop."
Lambda executes: `ec2.stop_instances(InstanceIds=[...])`

This flow must not be shortcut under any circumstances.

---

## 13. IAM Contract

One IAM role for Lambda. Least privilege.

### Required Permissions

```
Cost Explorer:
  ce:GetCostAndUsage
  ce:GetCostForecast

EC2:
  ec2:DescribeInstances
  ec2:DescribeInstanceStatus
  ec2:StopInstances

RDS:
  rds:DescribeDBInstances

S3:
  s3:ListAllMyBuckets
  s3:GetBucketLocation
  s3:GetBucketAcl

CloudWatch:
  cloudwatch:GetMetricStatistics
  cloudwatch:GetMetricData

Lambda (execution):
  logs:CreateLogGroup
  logs:CreateLogStream
  logs:PutLogEvents
```

### IAM Hard Rules
- Never use `AdministratorAccess` in any committed Terraform or CloudFormation
- Never use `*` resource ARN unless a service API requires it and it cannot be scoped
- If broader permissions are temporarily used for local testing, they must not be committed
- Treat IAM configuration as a key interview talking point: justify every permission

---

## 14. Terraform Contract

Terraform is the single source of truth for AWS infrastructure.

### Managed Resources
- Lambda function and configuration
- API Gateway (HTTP API)
- IAM role and policies
- CloudWatch log groups
- Lambda permissions for API Gateway

### File Structure

```
terraform/
├── main.tf        Lambda, API Gateway, Log Groups
├── iam.tf         IAM role, policies, permission attachments
├── variables.tf   Region, environment, Lambda config (memory, timeout)
└── outputs.tf     API Gateway URL, Lambda ARN, Log Group names
```

### Terraform Standards
- No unnecessary modules for an MVP of this size — flat structure is correct
- All resources tagged with `project = "fiscalforge"` and `environment`
- Variables must have descriptions
- Outputs must have descriptions
- `terraform fmt` enforced in CI
- `terraform validate` enforced in CI

---

## 15. Local Development Contract

FiscalForge must support local development without live AWS access.

### Mock Mode

```bash
FISCALFORGE_MOCK_AWS=true
```

When set:
- All boto3 calls are replaced with mock implementations
- Mock data must be realistic and representative
- Simulated EC2 stop action returns a success response without touching AWS
- Frontend development works fully in mock mode
- All tests run in mock mode by default

### Mock Data Standards
- Mock data must closely resemble actual AWS API response shapes
- Mock cost data must include multiple services and realistic amounts
- Mock resource data must include EC2 instances with varying utilization states
- Mock recommendations must include all severity levels

### Separation Rule
Mock implementations live in `backend/aws/mock/` or as conditional branches in each AWS adapter. Mock logic must NEVER be mixed into production business logic paths.

### Environment Configuration

```
.env.example          Checked in — shows all required variables without values
.env                  Never committed — contains actual values
```

Required environment variables:
```
FISCALFORGE_MOCK_AWS=false
AWS_REGION=us-east-1
OPENAI_API_KEY=
```

---

## 16. Error Handling Contract

### Backend Error Structure

All backend errors must use this consistent format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable description"
}
```

### Defined Error Codes
```
AWS_SERVICE_ERROR          boto3 call failed
INVALID_REQUEST            Missing or malformed request parameters
AGENT_ERROR                LangGraph agent execution failed
ACTION_REJECTED            Action preconditions not met
INTERNAL_ERROR             Unexpected internal error
```

### Backend Must NOT Expose
- Raw boto3 exceptions (ClientError, BotoCoreError)
- Python stack traces
- Internal module paths
- Credentials or API keys
- AWS account IDs in error messages unless intentional

### Frontend Error Requirements
Every data-fetching component must implement:
- Loading state (skeleton or spinner)
- Error state with message and retry button
- Empty state when data is available but empty

---

## 17. Testing Contract

### Unit Tests Required

```
tests/
├── test_costs.py          Cost calculations, percentage changes, aggregation
├── test_resources.py      Resource normalization, field mapping
└── test_optimization.py   All optimization rules, recommendation generation
```

### Test Coverage Requirements
- Every optimization rule must have at least one passing test and one failing test
- Cost percentage change calculation must be tested with positive, negative, and zero-change cases
- API response formatting must be tested for correct field names and types
- EC2 stop action logic must be tested with mocked boto3

### AWS Mocking Rule
**Tests must NEVER make calls to a live AWS account.**

Use `unittest.mock.patch` or `moto` to mock all boto3 calls. Tests must pass in an environment with no AWS credentials configured.

### CI Test Requirements
- All tests must pass on every pull request
- Tests run via: `pytest tests/`
- Coverage need not be 100% but all business logic paths must be covered

---

## 18. Code Quality Contract

### Python Standards
- Type hints on all functions and class attributes
- Pydantic models for all data structures crossing API boundaries
- Functions should be small and single-purpose
- Module names must clearly reflect their responsibility
- Ruff for linting and formatting (`ruff check`, `ruff format`)
- mypy for type checking

### TypeScript Standards
- `strict: true` in tsconfig.json
- No `any` types unless unavoidable with a comment explaining why
- Interfaces/types for all API response shapes in `frontend/types/`
- Reusable components; no duplicated UI logic
- Centralized API client; components do not call `fetch` directly

### General Standards
- No dead code (commented-out blocks, unused imports, unused variables)
- No duplicated business logic between modules
- No unnecessary abstractions
- No giant files — split modules when a file exceeds ~200 lines meaningfully
- Meaningful names that communicate intent
- Comments only to explain WHY, never WHAT

---

## 19. Security Contract

### Absolute Prohibitions
- AWS credentials in frontend code
- AWS credentials in committed files
- OpenAI API keys in committed files
- `.env` files committed to version control
- Browser → AWS direct access
- AI → AWS direct action (without human approval)
- Unnecessary IAM permissions
- Destructive AWS actions without explicit user confirmation

### Required Security Practices
- All secrets via environment variables
- `.env.example` committed with placeholder values and documentation
- `.gitignore` must exclude `.env`, `*.tfvars`, `*.pem`, `*.key`
- Lambda uses IAM role; no hardcoded credentials in Lambda code

---

## 20. Observability Contract

### Primary Tool: AWS CloudWatch

Monitor:
- Lambda invocations (count)
- Lambda errors (count and rate)
- Lambda duration (p50, p95)
- API Gateway 4xx and 5xx error rates

### Logging Standards
- Structured JSON logs from Lambda
- Every request logged with: route, duration, status
- Errors logged with: error code, message, resource context (no credentials)
- Log group: `/aws/lambda/fiscalforge-backend`

### Dashboard Status Display
The application dashboard should show:
```
System Status       Operational / Degraded
Last AWS Sync       N minutes ago
API Error Rate      %
Lambda p95          ms
```

### Explicitly Not Required for MVP
- Prometheus
- Grafana
- OpenTelemetry
- Custom metrics beyond CloudWatch defaults
- Distributed tracing

---

## 21. API Contract

### Endpoint Specifications

#### GET /api/costs

Response:
```json
{
  "total_cost": 4281.62,
  "previous_cost": 3810.41,
  "change_percent": 12.36,
  "daily_costs": [
    {"date": "2024-01-01", "cost": 142.05}
  ],
  "services": [
    {"name": "EC2", "cost": 1820.10},
    {"name": "RDS", "cost": 920.20}
  ]
}
```

#### GET /api/resources

Response:
```json
{
  "ec2": [{"id": "i-xxx", "type": "t3.medium", "state": "running", "region": "us-east-1", "estimated_cost": 45.0, "utilization": 8.2}],
  "rds": [{"id": "prod-db", "engine": "postgres", "class": "db.t3.micro", "status": "available", "region": "us-east-1", "estimated_cost": 25.0}],
  "s3": [{"name": "my-bucket", "region": "us-east-1", "size_gb": 120.5, "object_count": 4500, "estimated_cost": 2.77}]
}
```

#### GET /api/recommendations

Response:
```json
{
  "recommendations": [
    {
      "id": "rec-001",
      "resource_id": "i-xxx",
      "type": "EC2_UNDERUTILIZED",
      "severity": "high",
      "reason": "Average CPU utilization below 10% over 7 days",
      "estimated_savings": 45.0
    }
  ],
  "total_estimated_savings": 842.0
}
```

#### POST /api/advisor

Request:
```json
{"message": "Why did my AWS cost increase this month?"}
```

Response:
```json
{"response": "Your AWS spend increased by 18%..."}
```

#### POST /api/actions/ec2/stop

Request:
```json
{"instance_id": "i-1234567890abcdef0"}
```

Response:
```json
{"success": true, "instance_id": "i-1234567890abcdef0", "new_state": "stopping"}
```

---

## 22. Repository Contract

### Directory Structure

```
fiscalforge/
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx              Homepage
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── costs/
│   │   │   └── page.tsx
│   │   ├── resources/
│   │   │   └── page.tsx
│   │   └── advisor/
│   │       └── page.tsx
│   ├── components/               Reusable UI components
│   ├── lib/
│   │   └── api.ts                Centralized API client
│   └── types/
│       └── index.ts              TypeScript interfaces
│
├── backend/
│   ├── handler.py                Lambda entry point
│   ├── config.py                 Configuration management
│   ├── models.py                 Pydantic data models
│   ├── aws/
│   │   ├── cost_explorer.py      Cost Explorer adapter
│   │   ├── ec2.py                EC2 adapter
│   │   ├── rds.py                RDS adapter
│   │   └── s3.py                 S3 adapter
│   ├── optimization/
│   │   └── rules.py              Deterministic optimization rules
│   └── agent/
│       ├── graph.py              LangGraph agent definition
│       └── tools.py              Agent tool implementations
│
├── terraform/
│   ├── main.tf
│   ├── iam.tf
│   ├── variables.tf
│   └── outputs.tf
│
├── tests/
│   ├── test_costs.py
│   ├── test_resources.py
│   └── test_optimization.py
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── CLAUDE.md                     This file
├── README.md
├── requirements.txt
├── .env.example
└── .gitignore
```

Do not arbitrarily restructure this without a strong reason.

---

## 23. CI/CD Contract

### Pull Request Checks

```yaml
# All must pass before merge
- pytest tests/
- ruff check backend/
- ruff format --check backend/
- mypy backend/
- terraform fmt -check terraform/
- terraform validate terraform/
```

### Main Branch Deployment

```
test → build Lambda zip → terraform plan → (manual approve) → terraform apply
```

For MVP, manual approval before `terraform apply` is acceptable and expected.

---

## 24. Development Phase Contract

Implementation must happen incrementally, in order.

```
Phase 0   Engineering contract (CLAUDE.md) ← CURRENT PHASE
Phase 1   Repository foundation: skeleton, structure, CI setup
Phase 2   AWS integrations, optimization engine, AI agent
Phase 3   Premium frontend, full API integration
Phase 4   Terraform, CI/CD, observability, testing, deployment
```

**Never attempt to build the entire system in one uncontrolled pass.**

Each phase must leave the repository in a runnable, committable state.

---

## 25. Change Management Rules

Before making any significant change:

1. Read `CLAUDE.md`.
2. Read the architecture document.
3. Prefer the existing design.
4. Choose the simplest compatible solution.
5. Do not introduce a new dependency unless clearly necessary.
6. Do not introduce new infrastructure unless clearly necessary.
7. Preserve interview explainability.

If a requested implementation conflicts with the architecture, **explicitly identify the conflict before changing the architecture**. Do not silently deviate.

---

## 26. Definition of Done

FiscalForge MVP is complete only when a user can:

- [ ] Open the FiscalForge homepage and see a polished product landing page
- [ ] Navigate to the dashboard
- [ ] View total AWS spending with a period comparison
- [ ] View daily spending trends as a chart (7d / 30d / 90d)
- [ ] View cost by AWS service
- [ ] View EC2 inventory with instance state and utilization
- [ ] View RDS inventory with instance class and status
- [ ] View S3 inventory with bucket sizes and estimated costs
- [ ] See optimization recommendations with severity and estimated savings
- [ ] See total potential savings displayed prominently
- [ ] Ask the AI advisor a cost question in natural language
- [ ] Receive an AI response grounded in actual AWS-derived data
- [ ] See the AI distinguish between measured data and estimates
- [ ] Request an EC2 stop action from the UI
- [ ] See an explicit confirmation dialog before the action executes
- [ ] Approve the action and see it succeed through Lambda
- [ ] Deploy the Lambda and API Gateway infrastructure with `terraform apply`
- [ ] Run `pytest tests/` and see all tests pass
- [ ] Push to main and see GitHub Actions CI pass
- [ ] View Lambda invocation logs in CloudWatch

**Do not claim a feature is complete because the code exists. It must work or have a clearly documented limitation.**

---

## 27. Interview-First Engineering Principle

Every architectural decision must be answerable in one sentence.

| Decision | One-Sentence Answer |
|---|---|
| Why Lambda? | The workload is request-driven and doesn't require a continuously running server. |
| Why API Gateway? | It gives the frontend a clean HTTP boundary and prevents direct browser-to-AWS access. |
| Why Terraform? | Infrastructure must be reproducible, not manually configured. |
| Why one Lambda? | A single application is easier to deploy, debug, and explain than microservices. |
| Why rule-based optimization? | Cost recommendations must be deterministic, explainable, and testable. |
| Why LangGraph? | The agent needs to call AWS data tools and reason over the results before responding. |
| Why not let AI execute actions? | A wrong model decision should not cause a destructive cloud change without human approval. |
| Why not Kubernetes? | Lambda handles the workload without a container orchestrator. |
| Why not a database? | AWS APIs are the data source; there's no derived data that needs persistence. |

Prefer **simple and defensible** over **complex and impressive**.

---

## 28. Claude Code Operating Rules

**Every future Claude Code session working on FiscalForge must follow these rules.**

### Before Starting Any Task
1. Read `CLAUDE.md` before modifying the repository.
2. Inspect existing implementation before creating new files.
3. Reuse existing components and utilities.
4. Do not duplicate functionality.

### Architectural Rules
5. Do not change architecture casually.
6. Do not add dependencies without justification documented in the PR.
7. Do not introduce forbidden technologies (Section 6).
8. Keep changes scoped to the requested phase.

### Quality Rules
9. Run relevant tests after implementation.
10. Fix errors instead of ignoring them.
11. Never claim success without verifying behavior.
12. Never leave knowingly broken imports, routes, or build configuration.

### Security Rules
13. Never commit secrets.
14. Never weaken IAM for convenience.
15. Never allow the AI agent to execute AWS actions directly.
16. Never put AWS credentials in frontend code.

### Ambiguity Resolution
When a task is ambiguous:
- Choose the smallest reasonable implementation
- Preserve existing architecture
- Favor readability
- Favor interview explainability
- Ask rather than invent complexity

---

## 29. Implementation Discipline

When implementing any feature, follow this sequence:

```
Understand the requirement
       ↓
Inspect existing code in relevant modules
       ↓
Plan the minimal change required
       ↓
Implement
       ↓
Run tests (pytest, ruff, mypy)
       ↓
Verify actual behavior (not just code existence)
       ↓
Report exactly what changed and what was verified
```

**Do not:**
- Generate large amounts of speculative code
- Implement future features "while you're here"
- Refactor unrelated code during a feature task
- Add infrastructure beyond what the current task requires
- Mark a task complete without running verification

---

## 30. Phase 0 Verification Checklist

Phase 0 is complete when:

- [x] `CLAUDE.md` exists at the repository root
- [x] `CLAUDE.md` accurately reflects the architecture document
- [x] Core architectural invariant (one Lambda, one agent, one API) is explicit
- [x] All forbidden technologies are explicitly listed
- [x] AI safety boundary is explicitly defined
- [x] MVP scope (four questions) is explicit
- [x] Definition of Done is explicit and measurable
- [x] No application code was created
- [x] No Terraform resources were created
- [x] No frontend/backend dependencies were installed
- [x] The architecture document was not modified

**The only deliverable of Phase 0 is this file.**
