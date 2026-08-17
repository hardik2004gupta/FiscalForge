"""
AWS Cost Explorer adapter.

Responsible for all Cost Explorer API calls.
No other module should call boto3 Cost Explorer directly.

IAM permissions required (see CLAUDE.md §13):
    ce:GetCostAndUsage
    ce:GetCostForecast
"""

from __future__ import annotations

import datetime
from typing import TYPE_CHECKING

from backend.config import get_config
from backend.models import CostSummary, DailyCost, ServiceCost

if TYPE_CHECKING:
    from mypy_boto3_ce import CostExplorerClient


def get_cost_summary(
    client: CostExplorerClient | None = None,
    days: int = 30,
) -> CostSummary:
    """
    Retrieve cost summary from AWS Cost Explorer.

    Fetches current period vs. previous period costs, daily breakdown,
    and per-service costs. Uses BLENDED cost type.

    Args:
        client:  Optional boto3 Cost Explorer client (injected for testing).
        days:    Number of days for the current period (default 30).
    """
    config = get_config()
    if config.mock_aws:
        from backend.mock.cost_data import get_mock_cost_summary

        return get_mock_cost_summary()

    import boto3
    from botocore.exceptions import BotoCoreError, ClientError

    if client is None:
        client = boto3.client("ce", region_name=config.aws_region)

    today = datetime.date.today()
    current_end = today
    current_start = today - datetime.timedelta(days=days)
    previous_end = current_start
    previous_start = current_start - datetime.timedelta(days=days)

    try:
        current_response = client.get_cost_and_usage(
            TimePeriod={
                "Start": current_start.isoformat(),
                "End": current_end.isoformat(),
            },
            Granularity="DAILY",
            Metrics=["BlendedCost"],
        )
        previous_response = client.get_cost_and_usage(
            TimePeriod={
                "Start": previous_start.isoformat(),
                "End": previous_end.isoformat(),
            },
            Granularity="MONTHLY",
            Metrics=["BlendedCost"],
        )
        service_response = client.get_cost_and_usage(
            TimePeriod={
                "Start": current_start.isoformat(),
                "End": current_end.isoformat(),
            },
            Granularity="MONTHLY",
            Metrics=["BlendedCost"],
            GroupBy=[{"Type": "DIMENSION", "Key": "SERVICE"}],
        )
    except (BotoCoreError, ClientError) as exc:
        raise RuntimeError(f"Cost Explorer API error: {exc}") from exc

    daily_costs: list[DailyCost] = []
    total_cost = 0.0
    for result in current_response.get("ResultsByTime", []):
        date_str = result["TimePeriod"]["Start"]
        amount = float(result["Total"]["BlendedCost"]["Amount"])
        daily_costs.append(DailyCost(date=date_str, cost=round(amount, 2)))
        total_cost += amount

    previous_cost = 0.0
    for result in previous_response.get("ResultsByTime", []):
        previous_cost += float(result["Total"]["BlendedCost"]["Amount"])

    if previous_cost == 0.0:
        change_percent = 0.0
    else:
        change_percent = round((total_cost - previous_cost) / previous_cost * 100, 2)

    services: list[ServiceCost] = []
    for result in service_response.get("ResultsByTime", []):
        for group in result.get("Groups", []):
            name = group["Keys"][0]
            cost = float(group["Metrics"]["BlendedCost"]["Amount"])
            if cost > 0.0:
                services.append(ServiceCost(name=name, cost=round(cost, 2)))
    services.sort(key=lambda s: s.cost, reverse=True)

    return CostSummary(
        total_cost=round(total_cost, 2),
        previous_cost=round(previous_cost, 2),
        change_percent=change_percent,
        daily_costs=daily_costs,
        services=services,
    )
