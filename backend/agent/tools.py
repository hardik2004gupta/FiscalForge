"""
LangGraph agent tools — read-only access to FiscalForge data.

The agent has EXACTLY THREE tools. No more.
No action tools (stop_ec2, delete_s3, etc.) may ever be added here.
See CLAUDE.md §11 Agentic AI Contract and §12 AI Safety Contract.

Tool inputs come from the same AWS adapters and optimization engine used
by the API endpoints, so the agent always reasons over consistent data.
"""

from __future__ import annotations

from typing import Any


def get_cost_summary() -> dict[str, Any]:
    """
    Tool: get_cost_summary
    Returns current AWS spending vs. previous period, daily costs,
    and per-service cost breakdown.
    """
    from backend.aws.cost_explorer import get_cost_summary as _get_cost_summary

    return _get_cost_summary().model_dump()


def get_resources() -> dict[str, Any]:
    """
    Tool: get_resources
    Returns EC2 instances (with CPU utilization), RDS databases, and S3 buckets.
    """
    from backend.aws.cloudwatch import get_ec2_cpu_utilization
    from backend.aws.ec2 import get_ec2_instances
    from backend.aws.rds import get_rds_instances
    from backend.aws.s3 import get_s3_buckets
    from backend.models import ResourceInventory

    ec2_instances = get_ec2_instances()
    enriched_ec2 = [
        instance.model_copy(
            update={
                "utilization": (
                    get_ec2_cpu_utilization(instance.id) if instance.state == "running" else None
                )
            }
        )
        for instance in ec2_instances
    ]

    inventory = ResourceInventory(
        ec2=enriched_ec2,
        rds=get_rds_instances(),
        s3=get_s3_buckets(),
    )
    return inventory.model_dump()


def get_recommendations() -> dict[str, Any]:
    """
    Tool: get_recommendations
    Returns deterministic optimization findings from the rules engine,
    including severity, reason, and estimated monthly savings per finding.
    """
    from backend.aws.cloudwatch import get_ec2_cpu_utilization
    from backend.aws.ec2 import get_ec2_instances
    from backend.aws.rds import get_rds_instances
    from backend.aws.s3 import get_s3_buckets
    from backend.models import ResourceInventory
    from backend.optimization.engine import run_optimization

    ec2_instances = get_ec2_instances()
    cpu_utilizations: dict[str, float | None] = {
        inst.id: (get_ec2_cpu_utilization(inst.id) if inst.state == "running" else None)
        for inst in ec2_instances
    }
    inventory = ResourceInventory(
        ec2=ec2_instances,
        rds=get_rds_instances(),
        s3=get_s3_buckets(),
    )
    return run_optimization(inventory, cpu_utilizations).model_dump()


# ─── Safety note ─────────────────────────────────────────────────────────────
# There is no stop_ec2(), terminate_ec2(), delete_s3(), or any other action
# tool in this module. The agent is advisory only.
# AWS actions are executed by handler._handle_ec2_stop() after user approval.
