"""
LangGraph agent tools — read-only access to FiscalForge data.

The agent has EXACTLY THREE tools. No more.
No action tools (stop_ec2, delete_s3, etc.) may ever be added here.
See CLAUDE.md §11 Agentic AI Contract and §12 AI Safety Contract.

Tool inputs come from the same AWS adapters and optimization engine used
by the API endpoints, so the agent always reasons over consistent data.
"""
from __future__ import annotations


def get_cost_summary() -> dict:
    """
    Tool: get_cost_summary
    Returns current AWS spending vs. previous period, daily costs,
    and per-service cost breakdown.

    Phase 2: call aws.cost_explorer.get_cost_summary() and return as dict.
    """
    raise NotImplementedError("Phase 2: cost summary tool")


def get_resources() -> dict:
    """
    Tool: get_resources
    Returns EC2 instances (with CPU utilization), RDS databases, and S3 buckets.

    Phase 2: call aws.ec2, aws.rds, aws.s3 adapters and return as dict.
    """
    raise NotImplementedError("Phase 2: resources tool")


def get_recommendations() -> dict:
    """
    Tool: get_recommendations
    Returns deterministic optimization findings from the rules engine,
    including severity, reason, and estimated monthly savings per finding.

    Phase 2: call optimization.engine.run_optimization() and return as dict.
    """
    raise NotImplementedError("Phase 2: recommendations tool")


# ─── Safety note ─────────────────────────────────────────────────────────────
# There is no stop_ec2(), terminate_ec2(), delete_s3(), or any other action
# tool in this module. The agent is advisory only.
# AWS actions are executed by handler._handle_ec2_stop() after user approval.
