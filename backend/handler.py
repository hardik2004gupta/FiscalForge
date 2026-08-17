"""
AWS Lambda entry point — routes API Gateway HTTP API proxy events.

Architecture:
    API Gateway → handler() → _route() → module handler → AWS adapters

Routes:
    GET  /api/costs                  → aws.cost_explorer
    GET  /api/resources              → aws.ec2 + aws.rds + aws.s3
    GET  /api/recommendations        → optimization.engine
    POST /api/advisor                → agent.graph
    POST /api/actions/ec2/stop       → aws.ec2.stop_instance

There is ONE Lambda function. Do not split into multiple functions.
See CLAUDE.md §3 Core Architectural Invariant.
"""

from __future__ import annotations

import json
from typing import Any, Callable

from backend.config import get_config
from backend.errors import ErrorCode, error_response, ok_response
from backend.logging_config import get_logger

logger = get_logger(__name__)


def handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    """Main Lambda handler — receives API Gateway HTTP API proxy events."""
    config = get_config()

    http_ctx = event.get("requestContext", {}).get("http", {})
    method = http_ctx.get("method", "").upper()
    path = event.get("rawPath", "")

    logger.info("request", extra={"method": method, "path": path, "mock": config.mock_aws})

    try:
        return _route(method, path, event, config)
    except Exception as exc:
        logger.error("unhandled_exception", extra={"error": str(exc)})
        return error_response(ErrorCode.INTERNAL_ERROR, "An unexpected error occurred")


def _route(
    method: str,
    path: str,
    event: dict[str, Any],
    config: Any,
) -> dict[str, Any]:
    """Dispatch to the correct handler by method + path."""
    RouteHandler = Callable[[dict[str, Any], Any], dict[str, Any]]
    routes: dict[tuple[str, str], RouteHandler] = {
        ("GET", "/api/costs"): _handle_costs,
        ("GET", "/api/resources"): _handle_resources,
        ("GET", "/api/recommendations"): _handle_recommendations,
        ("POST", "/api/advisor"): _handle_advisor,
        ("POST", "/api/actions/ec2/stop"): _handle_ec2_stop,
    }

    fn = routes.get((method, path))
    if fn is None:
        return error_response(
            ErrorCode.INVALID_REQUEST,
            f"Unknown route: {method} {path}",
            404,
        )

    return fn(event, config)


# ─── Route handlers ───────────────────────────────────────────────────────────


def _handle_costs(event: dict[str, Any], config: Any) -> dict[str, Any]:
    """GET /api/costs"""
    try:
        from backend.aws.cost_explorer import get_cost_summary

        summary = get_cost_summary()
        return ok_response(summary.model_dump())
    except Exception as exc:
        logger.error("costs_error", extra={"error": str(exc)})
        return error_response(ErrorCode.AWS_SERVICE_ERROR, "Failed to retrieve cost data", 502)


def _handle_resources(event: dict[str, Any], config: Any) -> dict[str, Any]:
    """GET /api/resources"""
    try:
        from backend.aws.cloudwatch import get_ec2_cpu_utilization
        from backend.aws.ec2 import get_ec2_instances
        from backend.aws.rds import get_rds_instances
        from backend.aws.s3 import get_s3_buckets
        from backend.models import ResourceInventory

        ec2_instances = get_ec2_instances()
        enriched_ec2 = []
        for instance in ec2_instances:
            cpu = get_ec2_cpu_utilization(instance.id) if instance.state == "running" else None
            enriched_ec2.append(instance.model_copy(update={"utilization": cpu}))

        inventory = ResourceInventory(
            ec2=enriched_ec2,
            rds=get_rds_instances(),
            s3=get_s3_buckets(),
        )
        return ok_response(inventory.model_dump())
    except Exception as exc:
        logger.error("resources_error", extra={"error": str(exc)})
        return error_response(
            ErrorCode.AWS_SERVICE_ERROR, "Failed to retrieve resource inventory", 502
        )


def _handle_recommendations(event: dict[str, Any], config: Any) -> dict[str, Any]:
    """GET /api/recommendations"""
    try:
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
        summary = run_optimization(inventory, cpu_utilizations)
        return ok_response(summary.model_dump())
    except Exception as exc:
        logger.error("recommendations_error", extra={"error": str(exc)})
        return error_response(ErrorCode.INTERNAL_ERROR, "Failed to generate recommendations", 500)


def _handle_advisor(event: dict[str, Any], config: Any) -> dict[str, Any]:
    """POST /api/advisor"""
    # Fast-fail if OpenAI is not configured — keeps the rest of the app working
    # even when the advisor is unavailable. See CLAUDE.md §31.
    if not config.openai_api_key:
        logger.warning("advisor_unavailable", extra={"reason": "OPENAI_API_KEY not configured"})
        return error_response(
            ErrorCode.AGENT_ERROR,
            "AI advisor is not configured. Set OPENAI_API_KEY to enable it.",
            503,
        )

    try:
        from pydantic import ValidationError

        from backend.agent.graph import run_advisor
        from backend.models import AdvisorRequest

        body = event.get("body") or "{}"
        if isinstance(body, str):
            body = json.loads(body)

        try:
            req = AdvisorRequest(**body)
        except (ValidationError, TypeError):
            return error_response(
                ErrorCode.INVALID_REQUEST,
                "Field 'message' is required (1–2000 characters)",
                400,
            )

        response_text = run_advisor(req.message)
        return ok_response({"response": response_text})
    except Exception as exc:
        logger.error("advisor_error", extra={"error": str(exc)})
        return error_response(ErrorCode.AGENT_ERROR, "Advisor agent encountered an error", 502)


def _handle_ec2_stop(event: dict[str, Any], config: Any) -> dict[str, Any]:
    """POST /api/actions/ec2/stop

    Security: this handler is only reached after explicit user approval in the UI.
    The AI agent never calls this endpoint. See CLAUDE.md §12 AI Safety Contract.
    """
    try:
        from pydantic import ValidationError

        from backend.aws.ec2 import stop_ec2_instance
        from backend.models import EC2StopRequest

        body = event.get("body") or "{}"
        if isinstance(body, str):
            body = json.loads(body)

        try:
            req = EC2StopRequest(**body)
        except (ValidationError, TypeError):
            return error_response(ErrorCode.INVALID_REQUEST, "Invalid instance_id format", 400)

        result = stop_ec2_instance(req.instance_id)
        return ok_response(result.model_dump())
    except Exception as exc:
        logger.error("ec2_stop_error", extra={"error": str(exc)})
        return error_response(ErrorCode.AWS_SERVICE_ERROR, "Failed to stop EC2 instance", 502)
