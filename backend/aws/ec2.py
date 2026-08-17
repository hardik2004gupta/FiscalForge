"""
AWS EC2 adapter — instance inventory and stop action.

Responsible for all EC2 API calls.
No other module should call boto3 EC2 directly.

IAM permissions required (see CLAUDE.md §13):
    ec2:DescribeInstances
    ec2:DescribeInstanceStatus
    ec2:StopInstances   ← only for stop action, not termination
"""
from __future__ import annotations

from typing import TYPE_CHECKING

from backend.models import EC2Instance, EC2StopResponse

if TYPE_CHECKING:
    from mypy_boto3_ec2 import EC2Client


def get_ec2_instances(
    client: "EC2Client | None" = None,
    region: str = "us-east-1",
) -> list[EC2Instance]:
    """
    Retrieve all EC2 instances in the account.

    Returns instances with state, type, region, and estimated monthly cost.
    CPU utilization is populated separately via the CloudWatch adapter
    because it requires separate API calls per instance.

    Phase 2: implement describe_instances call.
    """
    raise NotImplementedError("Phase 2: EC2 inventory")


def stop_ec2_instance(
    instance_id: str,
    client: "EC2Client | None" = None,
) -> EC2StopResponse:
    """
    Stop a single EC2 instance.

    This function is ONLY called by handler._handle_ec2_stop() after the user
    has explicitly approved the action in the UI.
    The AI agent never calls this function directly.
    See CLAUDE.md §12 AI Safety Contract.

    Phase 2: implement stop_instances call.
    """
    raise NotImplementedError("Phase 2: EC2 stop action")
