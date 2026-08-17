"""
Realistic mock cost data for local development and testing.

Mock data matches the shape of real Cost Explorer responses after normalization.
Used when FISCALFORGE_MOCK_AWS=true.

Values are representative of a small AWS account with EC2, RDS, S3, and Lambda.
"""
from __future__ import annotations

from backend.models import CostSummary, DailyCost, ServiceCost


def get_mock_cost_summary() -> CostSummary:
    """Return a realistic mock CostSummary for development and testing."""
    return CostSummary(
        total_cost=4281.62,
        previous_cost=3810.41,
        change_percent=12.36,
        daily_costs=[
            DailyCost(date="2024-01-01", cost=138.76),
            DailyCost(date="2024-01-02", cost=141.22),
            DailyCost(date="2024-01-03", cost=143.81),
            DailyCost(date="2024-01-04", cost=139.54),
            DailyCost(date="2024-01-05", cost=142.08),
            DailyCost(date="2024-01-06", cost=144.91),
            DailyCost(date="2024-01-07", cost=138.99),
            DailyCost(date="2024-01-08", cost=141.67),
            DailyCost(date="2024-01-09", cost=143.12),
            DailyCost(date="2024-01-10", cost=140.33),
            DailyCost(date="2024-01-11", cost=138.55),
            DailyCost(date="2024-01-12", cost=141.89),
            DailyCost(date="2024-01-13", cost=143.22),
            DailyCost(date="2024-01-14", cost=139.78),
            DailyCost(date="2024-01-15", cost=142.44),
            DailyCost(date="2024-01-16", cost=140.91),
            DailyCost(date="2024-01-17", cost=138.33),
            DailyCost(date="2024-01-18", cost=141.05),
            DailyCost(date="2024-01-19", cost=144.62),
            DailyCost(date="2024-01-20", cost=139.87),
            DailyCost(date="2024-01-21", cost=142.14),
            DailyCost(date="2024-01-22", cost=145.33),
            DailyCost(date="2024-01-23", cost=140.76),
            DailyCost(date="2024-01-24", cost=143.21),
            DailyCost(date="2024-01-25", cost=141.55),
            DailyCost(date="2024-01-26", cost=138.92),
            DailyCost(date="2024-01-27", cost=140.44),
            DailyCost(date="2024-01-28", cost=143.88),
            DailyCost(date="2024-01-29", cost=141.33),
            DailyCost(date="2024-01-30", cost=142.67),
        ],
        services=[
            ServiceCost(name="Amazon EC2", cost=1820.10),
            ServiceCost(name="Amazon RDS", cost=920.20),
            ServiceCost(name="Amazon S3", cost=341.45),
            ServiceCost(name="AWS Lambda", cost=112.33),
            ServiceCost(name="Amazon CloudFront", cost=287.54),
            ServiceCost(name="Other", cost=800.00),
        ],
    )
