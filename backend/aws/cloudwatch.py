"""
AWS CloudWatch adapter — resource metrics.

Responsible for all CloudWatch API calls.
No other module should call boto3 CloudWatch directly.

IAM permissions required (see CLAUDE.md §13):
    cloudwatch:GetMetricStatistics
    cloudwatch:GetMetricData
"""

from __future__ import annotations

import datetime
from typing import TYPE_CHECKING

from backend.config import get_config

if TYPE_CHECKING:
    from mypy_boto3_cloudwatch import CloudWatchClient

# 14-day evaluation window per Phase 2 architectural decision.
# Longer window reduces false positives from short-term CPU spikes.
_EC2_CPU_EVALUATION_DAYS = 14


def get_ec2_cpu_utilization(
    instance_id: str,
    days: int = _EC2_CPU_EVALUATION_DAYS,
    client: CloudWatchClient | None = None,
) -> float | None:
    """
    Return average EC2 CPU utilization percentage over the last N days.

    Returns None when no datapoints are available (e.g., stopped instances).
    """
    config = get_config()
    if config.mock_aws:
        from backend.mock.metrics import get_mock_cpu_utilization

        return get_mock_cpu_utilization(instance_id)

    import boto3
    from botocore.exceptions import BotoCoreError, ClientError

    if client is None:
        client = boto3.client("cloudwatch", region_name=config.aws_region)

    end_time = datetime.datetime.utcnow()
    start_time = end_time - datetime.timedelta(days=days)

    try:
        response = client.get_metric_statistics(
            Namespace="AWS/EC2",
            MetricName="CPUUtilization",
            Dimensions=[{"Name": "InstanceId", "Value": instance_id}],
            StartTime=start_time,
            EndTime=end_time,
            Period=days * 86400,
            Statistics=["Average"],
            Unit="Percent",
        )
    except (BotoCoreError, ClientError) as exc:
        raise RuntimeError(f"CloudWatch CPU metrics error: {exc}") from exc

    datapoints = response.get("Datapoints", [])
    if not datapoints:
        return None
    return round(datapoints[0]["Average"], 2)


def get_s3_bucket_size_gb(
    bucket_name: str,
    client: CloudWatchClient | None = None,
) -> float:
    """
    Return S3 bucket size in GB from CloudWatch BucketSizeBytes metric.
    """
    config = get_config()
    if config.mock_aws:
        from backend.mock.metrics import get_mock_s3_bucket_size_gb

        return get_mock_s3_bucket_size_gb(bucket_name)

    import boto3
    from botocore.exceptions import BotoCoreError, ClientError

    if client is None:
        client = boto3.client("cloudwatch", region_name=config.aws_region)

    end_time = datetime.datetime.utcnow()
    start_time = end_time - datetime.timedelta(days=2)

    try:
        response = client.get_metric_statistics(
            Namespace="AWS/S3",
            MetricName="BucketSizeBytes",
            Dimensions=[
                {"Name": "BucketName", "Value": bucket_name},
                {"Name": "StorageType", "Value": "StandardStorage"},
            ],
            StartTime=start_time,
            EndTime=end_time,
            Period=86400,
            Statistics=["Average"],
            Unit="Bytes",
        )
    except (BotoCoreError, ClientError) as exc:
        raise RuntimeError(f"CloudWatch S3 size error: {exc}") from exc

    datapoints = response.get("Datapoints", [])
    if not datapoints:
        return 0.0
    bytes_val = max(dp["Average"] for dp in datapoints)
    return round(bytes_val / (1024**3), 2)
