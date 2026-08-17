"""
Optimization engine — orchestrates deterministic rule evaluation.

Data flow:
    AWS adapters → ResourceInventory + CPU metrics
                 → run_optimization()
                 → rules.check_*()
                 → RecommendationSummary

The engine is the only caller of individual rules.
The handler calls the engine; the agent reads the engine's output via tools.
"""

from __future__ import annotations

import datetime

from backend.models import Recommendation, RecommendationSummary, ResourceInventory

_SEVERITY_ORDER: dict[str, int] = {"high": 0, "medium": 1, "low": 2}


def run_optimization(
    inventory: ResourceInventory,
    cpu_utilizations: dict[str, float | None],
) -> RecommendationSummary:
    """
    Run all optimization rules against the current resource inventory.

    Args:
        inventory:         EC2, RDS, S3 resource data from AWS adapters.
        cpu_utilizations:  Map of instance_id → average CPU % (14-day window).
                           Value is None for stopped/unavailable instances.

    Returns:
        RecommendationSummary with all findings sorted by severity and
        aggregated total_estimated_savings.
    """
    from backend.optimization.rules import (
        check_ec2_rightsizing,
        check_ec2_underutilization,
        check_s3_storage_optimization,
    )

    recommendations: list[Recommendation] = []
    now = datetime.datetime.now(tz=datetime.UTC)

    for instance in inventory.ec2:
        # Attach CPU utilization from the CloudWatch map before rule evaluation.
        instance = instance.model_copy(update={"utilization": cpu_utilizations.get(instance.id)})

        rec = check_ec2_underutilization(instance)
        if rec is not None:
            recommendations.append(rec)

        running_days = 0
        if instance.launch_time:
            try:
                launch = datetime.datetime.fromisoformat(
                    instance.launch_time.replace("Z", "+00:00")
                )
                running_days = (now - launch).days
            except ValueError:
                running_days = 0

        rec = check_ec2_rightsizing(instance, running_days)
        if rec is not None:
            recommendations.append(rec)

    for bucket in inventory.s3:
        rec = check_s3_storage_optimization(bucket)
        if rec is not None:
            recommendations.append(rec)

    recommendations.sort(key=lambda r: _SEVERITY_ORDER.get(r.severity, 99))

    return RecommendationSummary(
        recommendations=recommendations,
        total_estimated_savings=round(sum(r.estimated_savings for r in recommendations), 2),
    )
