"""
AWS RDS adapter — database instance inventory.

Responsible for all RDS API calls.
No other module should call boto3 RDS directly.

IAM permissions required (see CLAUDE.md §13):
    rds:DescribeDBInstances
"""
from __future__ import annotations

from typing import TYPE_CHECKING

from backend.models import RDSInstance

if TYPE_CHECKING:
    from mypy_boto3_rds import RDSClient


def get_rds_instances(
    client: "RDSClient | None" = None,
    region: str = "us-east-1",
) -> list[RDSInstance]:
    """
    Retrieve all RDS instances in the account.

    Returns instances with engine, class, status, region, and estimated cost.
    RDS does not expose CPU utilization via describe_db_instances;
    CloudWatch metrics would be needed for utilization-based recommendations.

    Phase 2: implement describe_db_instances call.
    """
    raise NotImplementedError("Phase 2: RDS inventory")
