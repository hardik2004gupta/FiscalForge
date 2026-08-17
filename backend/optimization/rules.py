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

import uuid

from backend.models import EC2Instance, Recommendation, S3Bucket

# ─── Rule thresholds ──────────────────────────────────────────────────────────

# EC2 average CPU below this percentage triggers underutilization finding.
CPU_UNDERUTILIZATION_THRESHOLD: float = 10.0

# EC2 must have been running at least this many days to trigger rightsizing.
# Prevents flagging recently launched instances.
RIGHTSIZING_MIN_RUNNING_DAYS: int = 14

# S3 buckets larger than this trigger a storage optimization finding.
S3_LARGE_BUCKET_GB_THRESHOLD: float = 100.0


# ─── Rule implementations (Phase 2) ──────────────────────────────────────────


def check_ec2_underutilization(instance: EC2Instance) -> Recommendation | None:
    """
    Rule: EC2_UNDERUTILIZED
    Condition: instance is running AND average CPU < CPU_UNDERUTILIZATION_THRESHOLD
    Severity:  high
    Savings:   estimated from instance type pricing (Phase 2)

    Phase 2: implement rule logic.
    """
    raise NotImplementedError("Phase 2: EC2 underutilization rule")


def check_ec2_rightsizing(
    instance: EC2Instance,
    running_days: int,
) -> Recommendation | None:
    """
    Rule: EC2_RIGHTSIZING
    Condition: running_days > RIGHTSIZING_MIN_RUNNING_DAYS AND low CPU
    Severity:  medium
    Savings:   estimated savings from one instance-type tier reduction

    Phase 2: implement rule logic.
    """
    raise NotImplementedError("Phase 2: EC2 rightsizing rule")


def check_s3_storage_optimization(bucket: S3Bucket) -> Recommendation | None:
    """
    Rule: S3_STORAGE_OPTIMIZATION
    Condition: bucket size > S3_LARGE_BUCKET_GB_THRESHOLD
    Severity:  low
    Savings:   estimated savings from S3 Intelligent-Tiering

    Phase 2: implement rule logic.
    """
    raise NotImplementedError("Phase 2: S3 storage optimization rule")
