"""
AWS RDS adapter — database instance inventory.

Responsible for all RDS API calls.
No other module should call boto3 RDS directly.

IAM permissions required (see CLAUDE.md §13):
    rds:DescribeDBInstances
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from backend.config import get_config
from backend.models import RDSInstance

if TYPE_CHECKING:
    from mypy_boto3_rds import RDSClient

# Approximate On-Demand monthly cost (USD, Multi-AZ off) for common DB classes.
_RDS_MONTHLY_COST: dict[str, float] = {
    "db.t3.micro": 13.14,
    "db.t3.small": 26.28,
    "db.t3.medium": 52.56,
    "db.t3.large": 105.12,
    "db.r5.large": 175.20,
    "db.r5.xlarge": 350.40,
    "db.r5.2xlarge": 700.80,
}
_DEFAULT_RDS_COST = 50.0


def get_rds_instances(
    client: RDSClient | None = None,
    region: str = "us-east-1",
) -> list[RDSInstance]:
    """
    Retrieve all RDS instances in the account.

    Returns instances with engine, class, status, region, and estimated cost.
    """
    config = get_config()
    if config.mock_aws:
        from backend.mock.resources import get_mock_resource_inventory

        return get_mock_resource_inventory().rds

    import boto3
    from botocore.exceptions import BotoCoreError, ClientError

    if client is None:
        client = boto3.client("rds", region_name=config.aws_region)

    try:
        response = client.describe_db_instances()
    except (BotoCoreError, ClientError) as exc:
        raise RuntimeError(f"RDS API error: {exc}") from exc

    instances: list[RDSInstance] = []
    for raw in response.get("DBInstances", []):
        instance_class = raw.get("DBInstanceClass", "")
        instances.append(
            RDSInstance(
                id=raw["DBInstanceIdentifier"],
                engine=raw.get("Engine", "unknown"),
                instance_class=instance_class,
                status=raw.get("DBInstanceStatus", "unknown"),
                region=config.aws_region,
                estimated_cost=_RDS_MONTHLY_COST.get(instance_class, _DEFAULT_RDS_COST),
            )
        )
    return instances
