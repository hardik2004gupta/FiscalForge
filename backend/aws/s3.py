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

from backend.models import S3Bucket

if TYPE_CHECKING:
    from mypy_boto3_s3 import S3Client


def get_s3_buckets(
    client: "S3Client | None" = None,
) -> list[S3Bucket]:
    """
    Retrieve all S3 buckets with size and object count metadata.

    Bucket size comes from CloudWatch BucketSizeBytes metric (daily granularity).
    Object count comes from CloudWatch NumberOfObjects metric.

    Phase 2: implement list_buckets + CloudWatch metric calls.
    """
    raise NotImplementedError("Phase 2: S3 inventory")
