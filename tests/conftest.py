"""
Shared pytest fixtures for FiscalForge tests.

All tests run with mock AWS mode enabled by default.
Tests must never make real AWS API calls.
See CLAUDE.md §17 Testing Contract.
"""
from __future__ import annotations

import pytest


@pytest.fixture(autouse=True)
def use_mock_aws(monkeypatch: pytest.MonkeyPatch) -> None:
    """Force mock AWS mode for every test. Resets config cache after the test."""
    monkeypatch.setenv("FISCALFORGE_MOCK_AWS", "true")
    monkeypatch.setenv("AWS_REGION", "us-east-1")
    monkeypatch.setenv("OPENAI_API_KEY", "test-key-not-real")
    monkeypatch.setenv("OPENAI_MODEL", "gpt-4o")
    # Reset cached config so monkeypatched env vars take effect
    from backend.config import reset_config
    reset_config()
    yield
    reset_config()
