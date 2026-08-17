"""
Realistic mock AWS resource data for local development and testing.

Includes instances that deliberately trigger optimization rules:
- i-0a1b... and i-0b2c... → CPU < 10%, long-running → triggers rules 1 and 2
- i-0c3d... → healthy CPU → no recommendations
- i-0d4e... → stopped → no recommendations
- fiscalforge-logs-archive → large bucket → triggers S3 rule
"""
from __future__ import annotations

from backend.models import EC2Instance, RDSInstance, ResourceInventory, S3Bucket


def get_mock_resource_inventory() -> ResourceInventory:
    """Return a realistic mock ResourceInventory for development and testing."""
    return ResourceInventory(
        ec2=[
            EC2Instance(
                id="i-0a1b2c3d4e5f67890",
                type="t3.large",
                state="running",
                region="us-east-1",
                launch_time="2023-11-01T08:00:00Z",
                estimated_cost=60.74,
                utilization=8.2,      # Underutilized — triggers EC2_UNDERUTILIZED + EC2_RIGHTSIZING
            ),
            EC2Instance(
                id="i-0b2c3d4e5f6789012",
                type="m5.xlarge",
                state="running",
                region="us-east-1",
                launch_time="2023-10-15T14:30:00Z",
                estimated_cost=140.16,
                utilization=6.5,      # Underutilized — triggers EC2_UNDERUTILIZED + EC2_RIGHTSIZING
            ),
            EC2Instance(
                id="i-0c3d4e5f678901234",
                type="t3.medium",
                state="running",
                region="us-east-1",
                launch_time="2024-01-10T09:15:00Z",
                estimated_cost=30.37,
                utilization=52.4,     # Healthy utilization — no recommendations
            ),
            EC2Instance(
                id="i-0d4e5f67890123456",
                type="t3.small",
                state="stopped",
                region="us-west-2",
                launch_time="2023-12-01T11:00:00Z",
                estimated_cost=0.0,
                utilization=None,     # Stopped — no recommendations
            ),
        ],
        rds=[
            RDSInstance(
                id="prod-postgres-01",
                engine="postgres",
                instance_class="db.t3.medium",
                status="available",
                region="us-east-1",
                estimated_cost=52.56,
            ),
            RDSInstance(
                id="staging-mysql-01",
                engine="mysql",
                instance_class="db.t3.micro",
                status="available",
                region="us-east-1",
                estimated_cost=15.33,
            ),
        ],
        s3=[
            S3Bucket(
                name="fiscalforge-data-prod",
                region="us-east-1",
                size_gb=245.8,
                object_count=18342,
                estimated_cost=5.65,
            ),
            S3Bucket(
                name="fiscalforge-logs-archive",
                region="us-east-1",
                size_gb=1024.5,         # Large — triggers S3_STORAGE_OPTIMIZATION
                object_count=892100,
                estimated_cost=23.56,
            ),
            S3Bucket(
                name="fiscalforge-assets",
                region="us-east-1",
                size_gb=12.3,
                object_count=4521,
                estimated_cost=0.28,
            ),
        ],
    )
