"""
AWS Lambda entry point — routes API Gateway HTTP API proxy events.

Architecture:
    API Gateway → handler() → _route() → module handler → AWS adapters

Routes (all implemented in Phase 2):
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
from typing import Any

from backend.config import get_config
from backend.errors import ErrorCode, error_response
from backend.logging_config import get_logger

logger = get_logger(__name__)

# Route table: (HTTP method, path) → handler function
_ROUTES: dict[tuple[str, str], Any] = {}


def handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    """Main Lambda handler — receives API Gateway HTTP API proxy events."""
    config = get_config()

    http_ctx = event.get("requestContext", {}).get("http", {})
    method = http_ctx.get("method", "").upper()
    path = event.get("rawPath", "")

    logger.info("request", extra={"method": method, "path": path, "mock": config.mock_aws})

    try:
        return _route(method, path, event, config)
    except NotImplementedError as exc:
        logger.warning("route_not_implemented", extra={"path": path, "detail": str(exc)})
        return error_response(ErrorCode.INTERNAL_ERROR, "Not yet implemented", 501)
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
    routes: dict[tuple[str, str], Any] = {
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


# ─── Route handlers (Phase 2 implementation) ─────────────────────────────────


def _handle_costs(event: dict[str, Any], config: Any) -> dict[str, Any]:
    """GET /api/costs — Phase 2: call aws.cost_explorer.get_cost_summary()"""
    raise NotImplementedError("Phase 2")


def _handle_resources(event: dict[str, Any], config: Any) -> dict[str, Any]:
    """GET /api/resources — Phase 2: call aws.ec2, aws.rds, aws.s3 adapters"""
    raise NotImplementedError("Phase 2")


def _handle_recommendations(event: dict[str, Any], config: Any) -> dict[str, Any]:
    """GET /api/recommendations — Phase 2: call optimization.engine.run_optimization()"""
    raise NotImplementedError("Phase 2")


def _handle_advisor(event: dict[str, Any], config: Any) -> dict[str, Any]:
    """POST /api/advisor — Phase 2: invoke agent.graph.run_advisor()"""
    raise NotImplementedError("Phase 2")


def _handle_ec2_stop(event: dict[str, Any], config: Any) -> dict[str, Any]:
    """POST /api/actions/ec2/stop — Phase 2: call aws.ec2.stop_instance()

    Security: this handler is only reached after explicit user approval in the UI.
    The AI agent never calls this endpoint. See CLAUDE.md §12 AI Safety Contract.
    """
    raise NotImplementedError("Phase 2")
