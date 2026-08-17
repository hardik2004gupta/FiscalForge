"""FiscalForge backend configuration — reads from environment variables."""
from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Config:
    aws_region: str
    mock_aws: bool
    openai_api_key: str
    openai_model: str


_config: Config | None = None


def get_config() -> Config:
    """Return application configuration, reading environment variables once."""
    global _config
    if _config is None:
        _config = Config(
            aws_region=os.environ.get("AWS_REGION", "us-east-1"),
            mock_aws=os.environ.get("FISCALFORGE_MOCK_AWS", "false").lower() == "true",
            openai_api_key=os.environ.get("OPENAI_API_KEY", ""),
            openai_model=os.environ.get("OPENAI_MODEL", "gpt-4o"),
        )
    return _config


def reset_config() -> None:
    """Reset cached config — used in tests when environment variables change."""
    global _config
    _config = None
