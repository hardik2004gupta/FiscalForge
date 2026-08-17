"""
AWS Cost Explorer adapter.

Responsible for all Cost Explorer API calls.
No other module should call boto3 Cost Explorer directly.

IAM permissions required (see CLAUDE.md §13):
    ce:GetCostAndUsage
    ce:GetCostForecast
"""
from __future__ import annotations

from typing import TYPE_CHECKING

from backend.models import CostSummary

if TYPE_CHECKING:
    from mypy_boto3_ce import CostExplorerClient


def get_cost_summary(
    client: "CostExplorerClient | None" = None,
    days: int = 30,
) -> CostSummary:
    """
    Retrieve cost summary from AWS Cost Explorer.

    Fetches current period vs. previous period costs, daily breakdown,
    and per-service costs. Uses BLENDED cost type.

    Args:
        client:  Optional boto3 Cost Explorer client (injected for testing).
        days:    Number of days for the current period (default 30).

    Phase 2: implement GetCostAndUsage calls.
    """
    raise NotImplementedError("Phase 2: Cost Explorer integration")
