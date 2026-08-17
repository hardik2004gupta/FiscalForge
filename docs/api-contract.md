# FiscalForge API Contract

> This document is the integration contract between the Next.js frontend and the Lambda backend.
> TypeScript types mirror these shapes exactly — see `frontend/types/`.
> Backend Pydantic models are the authoritative source — see `backend/models.py`.

Base URL: `NEXT_PUBLIC_API_URL` (set to API Gateway endpoint after Terraform deployment)

All responses use `Content-Type: application/json`.

---

## Endpoints

### GET /api/costs

Retrieve AWS spending for the current and previous period.

**Request:** No body. No required parameters.

**Response 200:**
```json
{
  "total_cost": 4281.62,
  "previous_cost": 3810.41,
  "change_percent": 12.36,
  "daily_costs": [
    {"date": "2024-01-01", "cost": 138.76}
  ],
  "services": [
    {"name": "Amazon EC2", "cost": 1820.10},
    {"name": "Amazon RDS", "cost": 920.20},
    {"name": "Amazon S3", "cost": 341.45},
    {"name": "AWS Lambda", "cost": 112.33}
  ]
}
```

**Fields:**
| Field | Type | Description |
|---|---|---|
| `total_cost` | float | Total spend for current period (USD) |
| `previous_cost` | float | Total spend for previous period (USD) |
| `change_percent` | float | Signed percentage change (positive = increase) |
| `daily_costs` | array | Per-day cost breakdown for current period |
| `services` | array | Per-service cost breakdown for current period |

**AWS source:** Cost Explorer `GetCostAndUsage`

---

### GET /api/resources

Retrieve EC2, RDS, and S3 inventory.

**Request:** No body.

**Response 200:**
```json
{
  "ec2": [
    {
      "id": "i-0a1b2c3d4e5f67890",
      "type": "t3.large",
      "state": "running",
      "region": "us-east-1",
      "launch_time": "2023-11-01T08:00:00Z",
      "estimated_cost": 60.74,
      "utilization": 8.2
    }
  ],
  "rds": [
    {
      "id": "prod-postgres-01",
      "engine": "postgres",
      "instance_class": "db.t3.medium",
      "status": "available",
      "region": "us-east-1",
      "estimated_cost": 52.56
    }
  ],
  "s3": [
    {
      "name": "my-bucket",
      "region": "us-east-1",
      "size_gb": 245.8,
      "object_count": 18342,
      "estimated_cost": 5.65
    }
  ]
}
```

**EC2 fields:**
| Field | Type | Description |
|---|---|---|
| `id` | string | EC2 instance ID (`i-...`) |
| `type` | string | Instance type (e.g. `t3.large`) |
| `state` | string | `running` \| `stopped` \| `pending` \| `terminated` |
| `region` | string | AWS region |
| `launch_time` | string\|null | ISO 8601 UTC timestamp |
| `estimated_cost` | float | Monthly cost estimate (USD) |
| `utilization` | float\|null | Average CPU % over 7 days; null if unavailable |

**AWS sources:** EC2 `DescribeInstances`, CloudWatch `GetMetricStatistics`

---

### GET /api/recommendations

Retrieve deterministic optimization findings.

**Request:** No body.

**Response 200:**
```json
{
  "recommendations": [
    {
      "id": "rec-001",
      "resource_id": "i-0a1b2c3d4e5f67890",
      "type": "EC2_UNDERUTILIZED",
      "severity": "high",
      "reason": "Average CPU utilization is 8.2% over the past 7 days (threshold: 10%)",
      "estimated_savings": 45.00
    }
  ],
  "total_estimated_savings": 842.00
}
```

**Recommendation fields:**
| Field | Type | Description |
|---|---|---|
| `id` | string | Unique recommendation ID |
| `resource_id` | string | AWS resource identifier |
| `type` | string | `EC2_UNDERUTILIZED` \| `EC2_RIGHTSIZING` \| `S3_STORAGE_OPTIMIZATION` \| `NAT_GATEWAY_OPTIMIZATION` |
| `severity` | string | `high` \| `medium` \| `low` |
| `reason` | string | Human-readable explanation (shown in UI and passed to AI) |
| `estimated_savings` | float | Monthly savings estimate (USD) |

**Source:** Deterministic optimization rules engine. No AI involved.

---

### POST /api/advisor

Query the AI cost advisor.

**Request:**
```json
{"message": "Why did my AWS cost increase this month?"}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `message` | string | Yes | 1–2000 characters |

**Response 200:**
```json
{"response": "Your AWS spend increased by 12.4% this month..."}
```

**Behavior:** The AI agent calls the read-only data tools (cost summary, resources, recommendations), reasons over the AWS-derived data, and returns a grounded natural-language response. The agent does not execute AWS actions.

---

### POST /api/actions/ec2/stop

Stop an EC2 instance after explicit user approval.

**Security:** This endpoint is only called after the user has explicitly confirmed the action in the UI confirmation dialog. The AI agent never calls this endpoint.

**Request:**
```json
{"instance_id": "i-1234567890abcdef0"}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `instance_id` | string | Yes | Must match `^i-[0-9a-f]{8,17}$` |

**Response 200:**
```json
{
  "success": true,
  "instance_id": "i-1234567890abcdef0",
  "new_state": "stopping"
}
```

**AWS action:** `ec2:StopInstances` (not `ec2:TerminateInstances`)

---

## Error Responses

All errors use a consistent format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable description"
}
```

**Error codes:**

| Code | HTTP Status | Meaning |
|---|---|---|
| `AWS_SERVICE_ERROR` | 502 | boto3 call to AWS failed |
| `INVALID_REQUEST` | 400 | Missing or malformed request data |
| `AGENT_ERROR` | 502 | LangGraph agent execution failed |
| `ACTION_REJECTED` | 422 | Action preconditions not met |
| `INTERNAL_ERROR` | 500 | Unexpected internal error |

Raw boto3 exceptions and stack traces are never exposed in responses.

---

## Frontend Integration Notes

- All API calls go through `frontend/lib/api.ts` — components never call `fetch()` directly.
- The `ApiError` class in `api.ts` wraps error responses for type-safe error handling.
- Every data-fetching component must handle: loading state, error state, empty state.
- `NEXT_PUBLIC_API_URL` is the only environment variable the frontend needs.
- AWS credentials must never appear in any frontend code or environment variable.
