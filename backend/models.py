"""
FiscalForge data models — single source of truth for all API shapes.

These Pydantic models define the contract between:
  - Backend Lambda responses
  - Frontend TypeScript interfaces (frontend/types/)
  - Test fixtures (tests/fixtures/)

Keep models minimal. Do not add fields not required by the API contract
documented in CLAUDE.md §21 and docs/api-contract.md.
"""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


# ─── Cost Models ─────────────────────────────────────────────────────────────


class DailyCost(BaseModel):
    date: str  # ISO date: "2024-01-15"
    cost: float


class ServiceCost(BaseModel):
    name: str   # AWS service display name, e.g. "Amazon EC2"
    cost: float


class CostSummary(BaseModel):
    total_cost: float
    previous_cost: float
    change_percent: float
    daily_costs: list[DailyCost]
    services: list[ServiceCost]


# ─── Resource Models ──────────────────────────────────────────────────────────


class EC2Instance(BaseModel):
    id: str                         # e.g. "i-0a1b2c3d4e5f67890"
    type: str                       # e.g. "t3.large"
    state: str                      # running | stopped | pending | terminated
    region: str
    launch_time: str | None = None  # ISO 8601 UTC
    estimated_cost: float           # monthly USD estimate
    utilization: float | None = None  # average CPU % over evaluation period


class RDSInstance(BaseModel):
    id: str             # DB identifier
    engine: str         # e.g. "postgres", "mysql"
    instance_class: str  # e.g. "db.t3.medium"
    status: str
    region: str
    estimated_cost: float


class S3Bucket(BaseModel):
    name: str
    region: str
    size_gb: float
    object_count: int
    estimated_cost: float


class ResourceInventory(BaseModel):
    ec2: list[EC2Instance]
    rds: list[RDSInstance]
    s3: list[S3Bucket]


# ─── Recommendation Models ────────────────────────────────────────────────────


RecommendationType = Literal[
    "EC2_UNDERUTILIZED",
    "EC2_RIGHTSIZING",
    "S3_STORAGE_OPTIMIZATION",
    "NAT_GATEWAY_OPTIMIZATION",
]

SeverityLevel = Literal["high", "medium", "low"]


class Recommendation(BaseModel):
    id: str
    resource_id: str
    type: RecommendationType
    severity: SeverityLevel
    reason: str            # Human-readable; shown in the UI and passed to the AI
    estimated_savings: float  # Monthly USD


class RecommendationSummary(BaseModel):
    recommendations: list[Recommendation]
    total_estimated_savings: float


# ─── Advisor Models ───────────────────────────────────────────────────────────


class AdvisorRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)


class AdvisorResponse(BaseModel):
    response: str


# ─── Action Models ────────────────────────────────────────────────────────────


class EC2StopRequest(BaseModel):
    # Validated against AWS EC2 instance ID format
    instance_id: str = Field(..., pattern=r"^i-[0-9a-f]{8,17}$")


class EC2StopResponse(BaseModel):
    success: bool
    instance_id: str
    new_state: str  # "stopping" on success


# ─── Error Model ─────────────────────────────────────────────────────────────


class ErrorResponse(BaseModel):
    error: str    # ErrorCode enum value
    message: str
