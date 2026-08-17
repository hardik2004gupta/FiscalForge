"""
AWS S3 adapter — bucket metadata.

Responsible for all S3 API calls.
No other module should call boto3 S3 directly.

IAM permissions required (see CLAUDE.md §13):
    s3:ListAllMyBuckets
    s3:GetBucketLocation
    s3:GetBucketAcl

Note: object-level access (GetObject, PutObject, DeleteObject) is NOT granted.
FiscalForge only reads bucket metadata, never object content.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from backend.config import get_config
from backend.models import S3Bucket

if TYPE_CHECKING:
    from mypy_boto3_s3 import S3Client

# S3 Standard storage pricing: ~$0.023 per GB per month (us-east-1)
_S3_COST_PER_GB = 0.023


def get_s3_buckets(
    client: S3Client | None = None,
) -> list[S3Bucket]:
    """
    Retrieve all S3 buckets with size metadata from CloudWatch.

    Bucket size comes from CloudWatch BucketSizeBytes metric (daily granularity).
    """
    config = get_config()
    if config.mock_aws:
        from backend.mock.resources import get_mock_resource_inventory

        return get_mock_resource_inventory().s3

    import boto3
    from botocore.exceptions import BotoCoreError, ClientError

    if client is None:
        client = boto3.client("s3", region_name=config.aws_region)

    try:
        response = client.list_buckets()
    except (BotoCoreError, ClientError) as exc:
        raise RuntimeError(f"S3 API error: {exc}") from exc

    from backend.aws.cloudwatch import get_s3_bucket_size_gb

    buckets: list[S3Bucket] = []
    for raw in response.get("Buckets", []):
        name = raw["Name"]

        try:
            loc = client.get_bucket_location(Bucket=name)
            region: str = str(loc.get("LocationConstraint") or "us-east-1")
        except (BotoCoreError, ClientError):
            region = config.aws_region

        size_gb = get_s3_bucket_size_gb(name)

        buckets.append(
            S3Bucket(
                name=name,
                region=region,
                size_gb=size_gb,
                object_count=0,
                estimated_cost=round(size_gb * _S3_COST_PER_GB, 2),
            )
        )
    return buckets
