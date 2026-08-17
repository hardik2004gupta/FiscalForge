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

from backend.models import RecommendationSummary, ResourceInventory


def run_optimization(
    inventory: ResourceInventory,
    cpu_utilizations: dict[str, float | None],
) -> RecommendationSummary:
    """
    Run all optimization rules against the current resource inventory.

    Args:
        inventory:         EC2, RDS, S3 resource data from AWS adapters.
        cpu_utilizations:  Map of instance_id → average CPU % (7-day window).
                           Value is None for stopped/unavailable instances.

    Returns:
        RecommendationSummary with all findings sorted by severity and
        aggregated total_estimated_savings.

    Phase 2: implement by calling rules.check_* for each resource.
    """
    raise NotImplementedError("Phase 2: Optimization engine")
