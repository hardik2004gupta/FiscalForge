"""
Deterministic optimization rules.

Each rule is a pure function: same inputs always produce the same outputs.
No AWS calls, no AI calls, no randomness.

Rule inputs come from AWS adapters (already normalized).
Rule outputs are Recommendation objects.

Adding a new rule:
  1. Define the function here following the pattern below.
  2. Register it in engine.py.
  3. Add a test in tests/backend/test_optimization.py.

See CLAUDE.md §10 Optimization Engine Contract.
"""

from __future__ import annotations

from backend.models import EC2Instance, Recommendation, S3Bucket

# ─── Rule thresholds ──────────────────────────────────────────────────────────

# EC2 average CPU below this percentage triggers underutilization finding.
CPU_UNDERUTILIZATION_THRESHOLD: float = 10.0

# EC2 must have been running at least this many days to trigger rightsizing.
# Prevents flagging recently launched instances.
# Phase 2 decision: changed from 14 to 30 days for more stable signal.
RIGHTSIZING_MIN_RUNNING_DAYS: int = 30

# S3 buckets larger than this trigger a storage optimization finding.
S3_LARGE_BUCKET_GB_THRESHOLD: float = 100.0


# ─── Rule implementations ─────────────────────────────────────────────────────


def check_ec2_underutilization(instance: EC2Instance) -> Recommendation | None:
    """
    Rule: EC2_UNDERUTILIZED
    Condition: instance is running AND average CPU < CPU_UNDERUTILIZATION_THRESHOLD
    Severity:  high
    Savings:   50% of estimated monthly cost (stop or significantly downsize)
    """
    if instance.state != "running":
        return None
    if instance.utilization is None:
        return None
    if instance.utilization >= CPU_UNDERUTILIZATION_THRESHOLD:
        return None

    savings = round(instance.estimated_cost * 0.5, 2)
    return Recommendation(
        id=f"rec-underutil-{instance.id}",
        resource_id=instance.id,
        type="EC2_UNDERUTILIZED",
        severity="high",
        reason=(
            f"Average CPU utilization is {instance.utilization}% over the past 14 days "
            f"(threshold: {CPU_UNDERUTILIZATION_THRESHOLD}%). "
            "Consider stopping or rightsizing this instance."
        ),
        estimated_savings=savings,
    )


def check_ec2_rightsizing(
    instance: EC2Instance,
    running_days: int,
) -> Recommendation | None:
    """
    Rule: EC2_RIGHTSIZING
    Condition: running_days > RIGHTSIZING_MIN_RUNNING_DAYS AND CPU < threshold
    Severity:  medium
    Savings:   30% of estimated monthly cost (one instance-type tier reduction)
    """
    if instance.state != "running":
        return None
    if running_days <= RIGHTSIZING_MIN_RUNNING_DAYS:
        return None
    if instance.utilization is None:
        return None
    if instance.utilization >= CPU_UNDERUTILIZATION_THRESHOLD:
        return None

    savings = round(instance.estimated_cost * 0.3, 2)
    return Recommendation(
        id=f"rec-rightsize-{instance.id}",
        resource_id=instance.id,
        type="EC2_RIGHTSIZING",
        severity="medium",
        reason=(
            f"Instance has been running for {running_days} days with an average CPU "
            f"utilization of {instance.utilization}%. Downsizing to the next smaller "
            f"instance type could save approximately ${savings}/month."
        ),
        estimated_savings=savings,
    )


def check_s3_storage_optimization(bucket: S3Bucket) -> Recommendation | None:
    """
    Rule: S3_STORAGE_OPTIMIZATION
    Condition: bucket size > S3_LARGE_BUCKET_GB_THRESHOLD
    Severity:  low
    Savings:   40% of estimated monthly cost via S3 Intelligent-Tiering
    """
    if bucket.size_gb <= S3_LARGE_BUCKET_GB_THRESHOLD:
        return None

    savings = round(bucket.estimated_cost * 0.4, 2)
    return Recommendation(
        id=f"rec-s3-{bucket.name}",
        resource_id=bucket.name,
        type="S3_STORAGE_OPTIMIZATION",
        severity="low",
        reason=(
            f"Bucket '{bucket.name}' contains {bucket.size_gb} GB of data. "
            "Enabling S3 Intelligent-Tiering could reduce storage costs by up to 40% "
            "for infrequently accessed objects."
        ),
        estimated_savings=savings,
    )
