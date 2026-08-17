"""
Realistic mock CloudWatch metrics for local development and testing.

Maps instance IDs to CPU utilization values that match mock/resources.py.
Kept in sync manually — if resources.py changes, update this file.
"""
from __future__ import annotations


def get_mock_cpu_utilization(instance_id: str) -> float | None:
    """
    Return mock average CPU utilization for an EC2 instance.

    Returns None for stopped or unrecognized instances,
    matching the behavior of the real CloudWatch adapter.
    """
    _utilization_map: dict[str, float] = {
        "i-0a1b2c3d4e5f67890": 8.2,   # underutilized
        "i-0b2c3d4e5f6789012": 6.5,   # underutilized
        "i-0c3d4e5f678901234": 52.4,  # healthy
        # i-0d4e5f67890123456 is stopped — returns None (not in map)
    }
    return _utilization_map.get(instance_id)


def get_mock_s3_bucket_size_gb(bucket_name: str) -> float:
    """
    Return mock S3 bucket size in GB.

    Matches values in mock/resources.py S3Bucket.size_gb fields.
    """
    _size_map: dict[str, float] = {
        "fiscalforge-data-prod": 245.8,
        "fiscalforge-logs-archive": 1024.5,
        "fiscalforge-assets": 12.3,
    }
    return _size_map.get(bucket_name, 0.0)
