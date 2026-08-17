"""
AWS CloudWatch adapter — resource metrics.

Responsible for all CloudWatch API calls.
No other module should call boto3 CloudWatch directly.

IAM permissions required (see CLAUDE.md §13):
    cloudwatch:GetMetricStatistics
    cloudwatch:GetMetricData
"""
from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from mypy_boto3_cloudwatch import CloudWatchClient


def get_ec2_cpu_utilization(
    instance_id: str,
    days: int = 7,
    client: "CloudWatchClient | None" = None,
) -> float | None:
    """
    Return average EC2 CPU utilization percentage over the last N days.

    Used by the optimization engine to detect underutilized instances.
    Returns None when no datapoints are available (e.g., stopped instances).

    The 7-day evaluation period is the default; the optimization engine
    may override this when checking rightsizing candidates.

    Phase 2: implement GetMetricStatistics for AWS/EC2 CPUUtilization.
    """
    raise NotImplementedError("Phase 2: CloudWatch EC2 CPU metrics")


def get_s3_bucket_size_gb(
    bucket_name: str,
    client: "CloudWatchClient | None" = None,
) -> float:
    """
    Return S3 bucket size in GB from CloudWatch BucketSizeBytes metric.

    Phase 2: implement GetMetricStatistics for AWS/S3 BucketSizeBytes.
    """
    raise NotImplementedError("Phase 2: CloudWatch S3 bucket size")
