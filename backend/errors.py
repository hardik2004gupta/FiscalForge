"""Error codes and Lambda error response builder."""

from __future__ import annotations

import json
from enum import StrEnum


class ErrorCode(StrEnum):
    AWS_SERVICE_ERROR = "AWS_SERVICE_ERROR"
    INVALID_REQUEST = "INVALID_REQUEST"
    AGENT_ERROR = "AGENT_ERROR"
    ACTION_REJECTED = "ACTION_REJECTED"
    INTERNAL_ERROR = "INTERNAL_ERROR"


def error_response(
    code: ErrorCode,
    message: str,
    status_code: int = 500,
) -> dict:
    """Build a consistent Lambda proxy error response.

    Never expose raw boto3 exceptions, stack traces, or credentials.
    """
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"error": str(code), "message": message}),
    }


def ok_response(body: dict, status_code: int = 200) -> dict:
    """Build a successful Lambda proxy response."""
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
    }
