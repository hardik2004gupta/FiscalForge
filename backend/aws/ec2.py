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

from backend.config import get_config
from backend.models import EC2Instance, EC2StopResponse

if TYPE_CHECKING:
    from mypy_boto3_ec2 import EC2Client

# Approximate On-Demand monthly cost (USD) in us-east-1 for common instance types.
# Used as estimated_cost when the real pricing API is not available.
_INSTANCE_MONTHLY_COST: dict[str, float] = {
    "t3.nano": 3.80,
    "t3.micro": 7.59,
    "t3.small": 15.18,
    "t3.medium": 30.37,
    "t3.large": 60.74,
    "t3.xlarge": 121.47,
    "t3.2xlarge": 242.95,
    "m5.large": 70.08,
    "m5.xlarge": 140.16,
    "m5.2xlarge": 280.32,
    "m5.4xlarge": 560.64,
    "c5.large": 62.05,
    "c5.xlarge": 124.10,
    "r5.large": 91.98,
    "r5.xlarge": 183.96,
}
_DEFAULT_MONTHLY_COST = 50.0


def get_ec2_instances(
    client: EC2Client | None = None,
    region: str = "us-east-1",
) -> list[EC2Instance]:
    """
    Retrieve all EC2 instances in the account.

    Returns instances with state, type, region, and estimated monthly cost.
    CPU utilization is populated separately via the CloudWatch adapter.
    """
    config = get_config()
    if config.mock_aws:
        from backend.mock.resources import get_mock_resource_inventory

        return get_mock_resource_inventory().ec2

    import boto3
    from botocore.exceptions import BotoCoreError, ClientError

    if client is None:
        client = boto3.client("ec2", region_name=config.aws_region)

    try:
        response = client.describe_instances()
    except (BotoCoreError, ClientError) as exc:
        raise RuntimeError(f"EC2 API error: {exc}") from exc

    instances: list[EC2Instance] = []
    for reservation in response.get("Reservations", []):
        for raw in reservation.get("Instances", []):
            instance_type = raw.get("InstanceType", "")
            state = raw.get("State", {}).get("Name", "unknown")
            launch_time = raw.get("LaunchTime")
            instances.append(
                EC2Instance(
                    id=raw["InstanceId"],
                    type=instance_type,
                    state=state,
                    region=config.aws_region,
                    launch_time=launch_time.isoformat() if launch_time else None,
                    estimated_cost=_INSTANCE_MONTHLY_COST.get(instance_type, _DEFAULT_MONTHLY_COST),
                    utilization=None,  # populated separately via CloudWatch
                )
            )
    return instances


def stop_ec2_instance(
    instance_id: str,
    client: EC2Client | None = None,
) -> EC2StopResponse:
    """
    Stop a single EC2 instance.

    This function is ONLY called by handler._handle_ec2_stop() after the user
    has explicitly approved the action in the UI.
    The AI agent never calls this function directly.
    See CLAUDE.md §12 AI Safety Contract.
    """
    config = get_config()
    if config.mock_aws:
        return EC2StopResponse(
            success=True,
            instance_id=instance_id,
            new_state="stopping",
        )

    import boto3
    from botocore.exceptions import BotoCoreError, ClientError

    if client is None:
        client = boto3.client("ec2", region_name=config.aws_region)

    try:
        response = client.stop_instances(InstanceIds=[instance_id])
    except (BotoCoreError, ClientError) as exc:
        raise RuntimeError(f"EC2 stop failed: {exc}") from exc

    stopping = response.get("StoppingInstances", [])
    if not stopping:
        return EC2StopResponse(success=False, instance_id=instance_id, new_state="unknown")

    new_state = stopping[0].get("CurrentState", {}).get("Name", "unknown")
    return EC2StopResponse(success=True, instance_id=instance_id, new_state=new_state)
