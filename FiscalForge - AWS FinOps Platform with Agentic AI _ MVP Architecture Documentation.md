# FiscalForge
## Serverless AWS FinOps Platform with Agentic AI

**MVP Architecture & Technical Design Document**

---

## 1. Product Overview

### 1.1 Project Name

**FiscalForge**

### 1.2 Tagline

> **Understand your AWS spend. Find savings. Act with confidence.**

### 1.3 One-Line Description

FiscalForge is a serverless AWS FinOps platform that collects AWS cost and resource information, visualizes spending and optimization opportunities, and uses an AI agent to explain cost-saving recommendations.

### 1.4 Primary Goal

Build a small but production-style application that demonstrates:

- AWS cloud integration
- Serverless backend development
- Infrastructure as Code
- Cost analytics
- Resource inventory
- Agentic AI
- Basic controlled cloud actions
- Clean dashboard UX

The original project already establishes the core concept around Streamlit, boto3, Lambda, API Gateway, Terraform, Plotly, and LangChain + GPT-4o. FiscalForge simplifies and reorganizes those capabilities into an interview-friendly architecture.

---

# 2. MVP Philosophy

The most important design decision is:

> **Do not build a huge FinOps platform. Build a small system with clear engineering boundaries.**

FiscalForge MVP should answer four questions:

1. **How much am I spending?**
2. **Where is the money going?**
3. **Which resources might be wasting money?**
4. **What should I do about it?**

Everything else is secondary.

---

# 3. MVP Scope

## Included

### Cost Intelligence

- Total AWS spend
- Daily/weekly cost trend
- Cost by AWS service
- Cost comparison with previous period
- Basic cost anomaly detection

### Resource Inventory

Initially support:

- EC2
- RDS
- S3

Optional lightweight networking check:

- NAT Gateway

The original project already identifies Cost Explorer, EC2, RDS, S3 and NAT Gateway as important AWS data sources.

### Optimization

Detect simple opportunities such as:

- Low-utilization EC2
- Unused/low-traffic resources
- Expensive resources
- Unused NAT Gateway
- Basic storage optimization opportunities

### Agentic AI

The AI advisor can:

- Analyze collected cost information
- Analyze resource information
- Explain optimization opportunities
- Answer questions about AWS spending
- Suggest actions

### Controlled Actions

For MVP, support only:

- Stop EC2

Do **not** initially implement:

- EC2 termination
- S3 bucket deletion
- RDS deletion
- Automatic destructive actions

The original project includes destructive operations such as EC2 termination and S3 deletion, but these significantly increase the security and interview complexity.

---

# 4. What MVP Does NOT Include

To keep the project easy to explain, avoid:

- Kubernetes
- Kafka
- Airflow
- Spark
- Redis
- Microservices
- Event-driven pipelines
- Multiple databases
- Complex ML models
- Multi-agent systems
- Complex authentication
- Multi-account AWS Organizations
- Automatic resource deletion
- Real-time streaming
- Custom ML forecasting infrastructure

These technologies can make a project look impressive but make the architecture much harder to defend during interviews.

---

# 5. High-Level Architecture

```text
                         FISCALFORGE
                              │
                              ▼
                    ┌──────────────────┐
                    │    Web Dashboard │
                    │     Next.js      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   API Gateway    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   AWS Lambda     │
                    │   Backend API    │
                    └────────┬─────────┘
                             │
             ┌───────────────┼────────────────┐
             │               │                │
             ▼               ▼                ▼
       Cost Explorer       EC2/RDS/S3      CloudWatch
             │               │                │
             └───────────────┼────────────────┘
                             ▼
                    ┌──────────────────┐
                    │ Optimization     │
                    │ Engine           │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Agentic AI      │
                    │ LangGraph + LLM  │
                    └──────────────────┘
```

### Core architectural principle

**One frontend + one API + one Lambda backend + AWS APIs + one AI agent.**

That is the entire system.

---

# 6. Architecture Layers

FiscalForge has five simple layers.

```text
┌──────────────────────────────────────┐
│  1. Presentation                     │
│  Next.js Dashboard                   │
├──────────────────────────────────────┤
│  2. API                              │
│  API Gateway                         │
├──────────────────────────────────────┤
│  3. Application Logic                │
│  AWS Lambda                          │
├──────────────────────────────────────┤
│  4. AWS Data                         │
│  Cost Explorer / EC2 / RDS / S3      │
├──────────────────────────────────────┤
│  5. Intelligence                     │
│  Optimization Engine + AI Agent     │
└──────────────────────────────────────┘
```

Terraform manages the infrastructure across these layers.

---

# 7. Frontend Architecture

## Technology

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts

### Why Next.js?

The original tutorial uses Streamlit for the dashboard.

For FiscalForge, Next.js provides a stronger SWE signal while keeping the application straightforward.

---

## Frontend Pages

Keep the application to **five pages**.

### `/`

Marketing / landing page.

### `/dashboard`

Main AWS overview.

### `/costs`

Detailed cost analytics.

### `/resources`

AWS resource inventory.

### `/advisor`

AI cost advisor.

That's enough.

---

# 8. Home Page

The homepage is not part of the backend architecture.

Its purpose is to make the project look like a real product.

### Hero

**FiscalForge**

> Serverless AWS FinOps Platform with Agentic AI

Supporting text:

> Understand cloud spending, identify optimization opportunities, and make safer infrastructure decisions.

Buttons:

- **Open Dashboard**
- **View Architecture**

### Product visual

Show a simplified architecture:

```text
AWS Account
     ↓
Cost & Resource Data
     ↓
FiscalForge
     ↓
Insights
     ↓
Optimization
```

---

# 9. Dashboard

The dashboard is the primary application screen.

## KPI Cards

```text
Total Spend
$4,281

Monthly Change
+12.4%

Potential Savings
$842/mo

Resources
147
```

---

## Cost Trend

Display:

- Last 7 days
- Last 30 days
- Last 90 days

Use a simple line chart.

---

## Cost by Service

Example:

```text
EC2          $1,820
RDS            $920
S3             $341
Lambda         $112
Other        $1,088
```

---

## Optimization Summary

```text
12 opportunities found

High impact      3
Medium impact    6
Low impact       3
```

---

# 10. Costs Page

The Costs page focuses on analytics.

## Filters

- Date range
- AWS service
- Region

Avoid excessive filtering in MVP.

---

## Metrics

```text
Current Period
Previous Period
Percentage Change
Average Daily Cost
Projected Monthly Cost
```

---

## Charts

### Chart 1

Daily AWS spending.

### Chart 2

Cost by service.

### Chart 3

Cost change by service.

---

# 11. Resource Inventory

The Resources page queries AWS APIs through Lambda.

## Supported resources

### EC2

Display:

- Instance ID
- Instance type
- State
- Region
- Launch date
- Estimated cost
- Utilization status

### RDS

Display:

- Database identifier
- Engine
- Instance class
- Status
- Region
- Estimated cost

### S3

Display:

- Bucket
- Region
- Size
- Object count
- Estimated storage cost

---

# 12. Backend Architecture

The backend should be **one Lambda application** for MVP.

Do not create separate microservices.

```text
API Gateway
     │
     ▼
AWS Lambda
     │
     ├── /costs
     ├── /resources
     ├── /recommendations
     ├── /advisor
     └── /actions
```

This is much easier to explain than multiple Lambda services.

---

# 13. Lambda Responsibilities

The Lambda acts as the application's backend.

### `/costs`

Calls AWS Cost Explorer.

Returns:

```json
{
  "total": 4281.62,
  "previous_period": 3810.41,
  "change_percent": 12.36,
  "daily_costs": [],
  "service_costs": []
}
```

---

### `/resources`

Collects:

- EC2
- RDS
- S3

Returns normalized resource objects.

---

### `/recommendations`

Runs deterministic optimization rules.

Example:

```text
EC2 CPU < 10%
        ↓
Potentially underutilized
        ↓
Generate recommendation
```

---

### `/advisor`

Passes relevant data to the AI agent.

---

### `/actions`

Handles approved actions.

For MVP:

```text
POST /actions/ec2/stop
```

---

# 14. AWS Data Sources

FiscalForge uses boto3 to communicate directly with AWS.

```text
                 boto3
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
Cost Explorer     EC2         RDS
       │           │           │
       └───────────┼───────────┘
                   │
                   ▼
                  S3
```

The source project uses boto3 for AWS SDK interactions and separates cost, inventory, and service-action modules.

---

# 15. Cost Data Flow

When the user opens the dashboard:

```text
User
 │
 ▼
Next.js
 │
 ▼
API Gateway
 │
 ▼
Lambda
 │
 ▼
Cost Explorer
 │
 ▼
AWS Cost Data
 │
 ▼
Lambda transforms response
 │
 ▼
JSON response
 │
 ▼
Dashboard
```

This is intentionally simple.

There is no Kafka.

There is no Spark.

There is no data lake.

There is no unnecessary ETL platform.

---

# 16. Resource Data Flow

```text
User
 │
 ▼
Dashboard
 │
 ▼
API Gateway
 │
 ▼
Lambda
 │
 ├── EC2 API
 ├── RDS API
 └── S3 API
 │
 ▼
Normalize responses
 │
 ▼
Return JSON
 │
 ▼
Dashboard
```

---

# 17. Optimization Engine

The optimization engine is **rule-based**.

This is an important design decision.

Do not use AI to determine everything.

### Example rules

```text
Rule 1:
EC2 average CPU < 10%
→ Underutilized EC2

Rule 2:
EC2 instance running for long period
AND low utilization
→ Rightsizing candidate

Rule 3:
NAT Gateway has minimal traffic
→ Potential cost optimization

Rule 4:
Large unused S3 storage
→ Storage optimization candidate
```

The engine produces structured recommendations.

Example:

```json
{
  "resource": "prod-api-01",
  "type": "EC2_RIGHTSIZING",
  "severity": "medium",
  "estimated_savings": 92,
  "reason": "Low average CPU utilization"
}
```

---

# 18. Why Rule-Based Optimization?

Because it is:

- deterministic
- explainable
- testable
- easy to debug
- easy to discuss in interviews

The AI doesn't need to discover the problem.

The AI explains the problem.

That distinction makes the architecture stronger.

---

# 19. Agentic AI Architecture

FiscalForge uses **one AI agent**.

Not multiple agents.

```text
                    User
                     │
                     ▼
               AI Advisor
                     │
                     ▼
                 LangGraph
                     │
             ┌───────┴────────┐
             ▼                ▼
       Cost Tool        Resource Tool
             │                │
             └───────┬────────┘
                     ▼
                 AWS Data
                     │
                     ▼
                  LLM
                     │
                     ▼
             Recommendation
```

---

# 20. AI Tools

Keep only three tools.

### Tool 1

`get_cost_summary()`

Returns recent AWS spending.

### Tool 2

`get_resources()`

Returns EC2/RDS/S3 inventory.

### Tool 3

`get_recommendations()`

Returns deterministic optimization findings.

That's enough to legitimately call it an agentic AI feature.

---

# 21. Example AI Interaction

User:

> Why did my AWS cost increase this month?

Agent:

```text
1. Fetch cost summary
2. Compare current vs previous period
3. Identify services with largest increases
4. Fetch relevant resources
5. Explain likely causes
6. Recommend actions
```

Example response:

> Your AWS spend increased by 18% this month, primarily due to EC2 costs. Three instances account for most of the increase, and two show consistently low utilization. Right-sizing these instances could reduce estimated monthly spending by approximately $140.

The AI is therefore performing **reasoning over real application data**, rather than acting as a generic chatbot.

---

# 22. AI Safety Boundary

The AI agent should **never directly perform destructive AWS actions**.

Architecture:

```text
AI
 │
 ▼
Recommendation
 │
 ▼
User Approval
 │
 ▼
Action API
 │
 ▼
Lambda
 │
 ▼
AWS
```

For MVP:

```text
AI → Suggest
User → Approve
Lambda → Execute
```

This is easy to explain and demonstrates responsible agent integration.

---

# 23. EC2 Action Flow

Example:

```text
User clicks "Stop Instance"
          │
          ▼
Confirmation dialog
          │
          ▼
POST /actions/ec2/stop
          │
          ▼
API Gateway
          │
          ▼
Lambda
          │
          ▼
boto3 EC2.stop_instances()
          │
          ▼
AWS
          │
          ▼
Result
          │
          ▼
Dashboard
```

No AI is involved in the actual execution.

---

# 24. Authentication

For the MVP, keep authentication simple.

### Development

Local AWS credentials:

```text
AWS CLI
aws configure
```

The source project similarly expects AWS CLI configuration for local execution.

### Production

Use an AWS IAM role for Lambda.

Do **not** put AWS credentials in the frontend.

---

# 25. IAM Architecture

Use one IAM role for Lambda.

Permissions should follow least privilege.

Example:

```text
Lambda IAM Role

Cost Explorer
    Read

EC2
    Describe
    Stop

RDS
    Describe

S3
    List / Get metadata

CloudWatch
    Read metrics
```

Avoid:

```text
AdministratorAccess
```

This is an excellent interview talking point.

---

# 26. Terraform Architecture

Terraform manages:

```text
terraform/
│
├── main.tf
├── variables.tf
├── outputs.tf
└── iam.tf
```

Keep Terraform simple.

### `main.tf`

Creates:

- Lambda
- API Gateway
- IAM role

### `iam.tf`

Creates Lambda permissions.

### `variables.tf`

Contains:

- AWS region
- environment
- Lambda configuration

### `outputs.tf`

Outputs:

- API Gateway URL
- Lambda ARN

The original tutorial already follows the concept of Terraform variables, outputs, Lambda deployment and API Gateway provisioning.

---

# 27. Deployment Architecture

```text
Developer
    │
    ▼
GitHub
    │
    ▼
GitHub Actions
    │
    ├── Test
    ├── Lint
    └── Terraform Validate
            │
            ▼
       Terraform Apply
            │
            ▼
           AWS
```

For MVP, you don't need an elaborate deployment platform.

---

# 28. CI/CD

Use one GitHub Actions workflow.

### Pull Request

```text
pytest
ruff
mypy
terraform fmt
terraform validate
```

### Main branch

```text
test
 ↓
build
 ↓
terraform plan
 ↓
deploy
```

This is enough to demonstrate DevOps knowledge.

---

# 29. Observability

Use AWS CloudWatch.

Monitor:

- Lambda invocations
- Lambda errors
- Lambda duration
- API Gateway errors

Dashboard can display:

```text
System Status       Operational
Last AWS Sync       2 minutes ago
API Error Rate      0.2%
Lambda p95          180 ms
```

Do not add Prometheus/Grafana unless you genuinely need them.

For this project, CloudWatch is sufficient.

---

# 30. Error Handling

The backend should return consistent errors.

Example:

```json
{
  "error": "AWS_SERVICE_ERROR",
  "message": "Unable to retrieve EC2 inventory"
}
```

Frontend displays:

```text
Unable to load EC2 resources.

[ Retry ]
```

Never expose raw AWS exceptions to users.

---

# 31. Project Structure

Recommended MVP repository:

```text
fiscalforge/
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── dashboard/
│   │   ├── costs/
│   │   ├── resources/
│   │   └── advisor/
│   │
│   ├── components/
│   ├── lib/
│   └── types/
│
├── backend/
│   ├── handler.py
│   ├── aws/
│   │   ├── cost_explorer.py
│   │   ├── ec2.py
│   │   ├── rds.py
│   │   └── s3.py
│   │
│   ├── optimization/
│   │   └── rules.py
│   │
│   ├── agent/
│   │   ├── graph.py
│   │   └── tools.py
│   │
│   └── models.py
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
├── README.md
├── requirements.txt
└── .env.example
```

---

# 32. Data Models

Keep the models small.

## CostSummary

```text
total_cost
previous_cost
change_percent
daily_costs
service_costs
```

## Resource

```text
id
type
region
status
estimated_cost
utilization
```

## Recommendation

```text
id
resource_id
type
severity
reason
estimated_savings
```

---

# 33. API Design

Keep the API extremely small.

```text
GET  /api/costs
GET  /api/resources
GET  /api/recommendations
POST /api/advisor
POST /api/actions/ec2/stop
```

That's it.

You can explain the entire API in under one minute.

---

# 34. API Example

### GET `/api/costs`

Response:

```json
{
  "total_cost": 4281.62,
  "previous_cost": 3810.41,
  "change_percent": 12.36,
  "services": [
    {
      "name": "EC2",
      "cost": 1820.10
    },
    {
      "name": "RDS",
      "cost": 920.20
    }
  ]
}
```

---

# 35. Testing Strategy

Don't over-engineer testing.

### Unit tests

Test:

- cost calculations
- percentage changes
- optimization rules
- API response formatting

### Mock AWS

Never make your unit tests depend on a real AWS account.

```text
Test
 ↓
Mock boto3
 ↓
Fake AWS response
 ↓
Test business logic
```

This is a good SWE interview discussion.

---

# 36. Security Model

FiscalForge follows four simple principles.

### 1. No AWS credentials in frontend

```text
Browser ✗ AWS credentials
```

### 2. Lambda uses IAM role

```text
Lambda → IAM Role → AWS
```

### 3. Least privilege

Only grant required AWS operations.

### 4. Human approval

AI recommends actions.

AI does not execute destructive actions.

---

# 37. End-to-End Request Example

Suppose the user opens the dashboard.

```text
1. Browser requests /api/costs

2. API Gateway receives request

3. Lambda starts

4. Lambda calls Cost Explorer

5. AWS returns cost data

6. Lambda normalizes the data

7. Lambda returns JSON

8. Next.js renders charts
```

For optimization:

```text
1. Dashboard requests recommendations

2. Lambda gets resource data

3. Optimization rules execute

4. Rules identify low-utilization EC2

5. Recommendation is generated

6. Dashboard displays potential savings
```

For AI:

```text
1. User asks AI a question

2. Agent receives question

3. Agent calls cost/resource tools

4. Tools return real AWS data

5. LLM explains findings

6. User receives recommendation
```

This is the complete system.

---

# 38. Interview Explanation

Your 30-second explanation:

> **FiscalForge is a serverless AWS FinOps platform I built to help understand cloud spending and identify optimization opportunities. The frontend is a Next.js dashboard, while API Gateway routes requests to a Python Lambda backend. The Lambda uses boto3 to query Cost Explorer and services like EC2, RDS and S3. I added a lightweight rule-based optimization engine for deterministic recommendations and a LangGraph agent that uses those AWS tools to explain the findings in natural language. Terraform provisions the Lambda, API Gateway and IAM infrastructure, and GitHub Actions handles testing and deployment.**

That's enough.

---

# 39. "Why Lambda?"

Answer:

> I chose Lambda because the workload is request-driven and doesn't require a continuously running server. Cost and resource queries are relatively lightweight, so serverless reduces operational overhead and fits the project naturally.

---

# 40. "Why API Gateway?"

> API Gateway gives the frontend a clean HTTP boundary to the AWS backend and prevents the browser from directly interacting with AWS services.

---

# 41. "Why Terraform?"

> I wanted the AWS infrastructure to be reproducible rather than manually configured. Terraform lets me provision the Lambda, API Gateway and IAM resources consistently.

---

# 42. "Why AI?"

> The deterministic optimization engine identifies potential issues, while the AI agent makes those findings easier to explore. Users can ask questions such as why costs increased or which resources are potential savings opportunities.

---

# 43. "Why not let the AI execute AWS actions?"

> I deliberately separated recommendation from execution. The AI can analyze infrastructure and recommend an action, but the user must explicitly approve it before the backend performs the AWS operation. This reduces the risk of an incorrect model decision causing a destructive cloud change.

This is probably your strongest architecture answer.

---

# 44. "Why rules instead of ML for optimization?"

> The initial optimization signals are deterministic because cost recommendations need to be explainable and reproducible. AI is used for reasoning and explanation rather than inventing the underlying metrics.

Excellent interview answer.

---

# 45. MVP Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js |
| Language | TypeScript |
| UI | Tailwind + shadcn/ui |
| Charts | Recharts |
| Backend | Python |
| API | API Gateway |
| Compute | AWS Lambda |
| AWS SDK | boto3 |
| Cost Data | AWS Cost Explorer |
| Resources | EC2, RDS, S3 |
| AI | LangGraph + OpenAI |
| IaC | Terraform |
| CI/CD | GitHub Actions |
| Monitoring | CloudWatch |
| Testing | pytest |
| Code Quality | Ruff |

---

# 46. What Makes This Resume-Worthy

FiscalForge demonstrates four skill groups without making the architecture complicated.

### Software Engineering

```text
Next.js
Python
REST APIs
AWS Lambda
Testing
Error handling
```

### DevOps / Cloud

```text
AWS
Terraform
IAM
API Gateway
CI/CD
CloudWatch
Serverless
```

### Data Engineering

```text
AWS cost ingestion
Data normalization
Cost analytics
Aggregation
Anomaly detection
```

### AI Engineering

```text
LangGraph
Tool calling
LLM reasoning
Structured AWS data
AI-assisted recommendations
```

---

# 47. Resume Project Description

**FiscalForge — Serverless AWS FinOps Platform with Agentic AI**  
`Next.js · Python · AWS Lambda · API Gateway · Terraform · boto3 · LangGraph · OpenAI · CloudWatch`

- Built a serverless AWS FinOps platform that analyzes Cost Explorer data and EC2/RDS/S3 inventory through a Python Lambda backend exposed via API Gateway.
- Developed a deterministic optimization engine to identify underutilized resources, cost anomalies, and potential savings opportunities from AWS infrastructure data.
- Integrated a LangGraph agent with AWS data tools and OpenAI to provide contextual cost analysis and explain optimization recommendations.
- Provisioned AWS infrastructure with Terraform and implemented CI checks for Python tests, linting, and infrastructure validation.

---

# 48. MVP Definition of Done

FiscalForge MVP is complete when a user can:

- [ ] Open a polished FiscalForge homepage
- [ ] Open the dashboard
- [ ] View total AWS spending
- [ ] View spending trends
- [ ] View cost by service
- [ ] View EC2/RDS/S3 inventory
- [ ] See optimization recommendations
- [ ] See estimated savings
- [ ] Ask the AI advisor a cost question
- [ ] See the AI use AWS-derived information
- [ ] Request an EC2 stop action
- [ ] Explicitly approve the action
- [ ] Execute the action through Lambda
- [ ] Deploy infrastructure using Terraform
- [ ] Run automated tests through GitHub Actions
- [ ] View basic CloudWatch logs

---

# 49. Final Architecture

```text
                         ┌──────────────────────┐
                         │      FiscalForge     │
                         │      Web App         │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      Next.js         │
                         │     Dashboard        │
                         └──────────┬───────────┘
                                    │
                                  HTTPS
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    API Gateway       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    AWS Lambda        │
                         │    Python Backend    │
                         └──────────┬───────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
      ┌─────────────┐       ┌──────────────┐       ┌─────────────┐
      │Cost Explorer│       │ AWS Services │       │ CloudWatch  │
      │             │       │ EC2/RDS/S3   │       │             │
      └──────┬──────┘       └──────┬───────┘       └─────────────┘
             │                      │
             └──────────┬───────────┘
                        ▼
               ┌───────────────────┐
               │ Optimization      │
               │ Rules Engine      │
               └─────────┬─────────┘
                         │
                         ▼
               ┌───────────────────┐
               │ LangGraph Agent   │
               │ + OpenAI          │
               └─────────┬─────────┘
                         │
                    Recommendations
                         │
                         ▼
                  ┌──────────────┐
                  │ User Approval│
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ Action API   │
                  └──────┬───────┘
                         │
                         ▼
                       AWS

                  ┌──────────────┐
                  │  Terraform   │
                  └──────┬───────┘
                         │
                         ▼
             Lambda + API Gateway + IAM

                  ┌──────────────┐
                  │GitHub Actions│
                  └──────────────┘
```

## Final design principle

**Keep the architecture boring and make the product polished.**

The MVP should have:

> **1 frontend → 1 API → 1 Lambda backend → AWS APIs → 1 optimization engine → 1 AI agent.**

That is enough to demonstrate serious **SWE + DevOps + Data Engineering + Agentic AI** capability without giving an interviewer a 20-minute architecture puzzle to untangle.