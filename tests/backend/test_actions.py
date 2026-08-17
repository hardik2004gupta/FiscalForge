"""
Tests for EC2 stop action request validation and execution.

The EC2 stop action is only invoked after explicit user approval.
The AI agent never triggers this action. See CLAUDE.md §12.

Phase 2: remove pytest.skip() calls as the EC2 adapter is implemented.
"""
from __future__ import annotations

import pytest


class TestEC2StopRequestValidation:
    """Test EC2StopRequest model validation."""

    def test_valid_instance_id_accepted(self) -> None:
        """Standard EC2 instance ID format should pass validation."""
        from backend.models import EC2StopRequest

        req = EC2StopRequest(instance_id="i-1234567890abcdef0")
        assert req.instance_id == "i-1234567890abcdef0"

    def test_short_instance_id_accepted(self) -> None:
        """8-character hex instance IDs (older format) should also be accepted."""
        from backend.models import EC2StopRequest

        req = EC2StopRequest(instance_id="i-12345678")
        assert req.instance_id == "i-12345678"

    def test_invalid_format_rejected(self) -> None:
        """Non-EC2 instance ID strings should raise ValidationError."""
        from pydantic import ValidationError
        from backend.models import EC2StopRequest

        with pytest.raises(ValidationError):
            EC2StopRequest(instance_id="not-an-instance-id")

    def test_empty_string_rejected(self) -> None:
        """Empty instance ID should raise ValidationError."""
        from pydantic import ValidationError
        from backend.models import EC2StopRequest

        with pytest.raises(ValidationError):
            EC2StopRequest(instance_id="")

    def test_wrong_prefix_rejected(self) -> None:
        """Instance IDs without 'i-' prefix should be rejected."""
        from pydantic import ValidationError
        from backend.models import EC2StopRequest

        with pytest.raises(ValidationError):
            EC2StopRequest(instance_id="r-1234567890abcdef0")  # RDS format


class TestEC2StopAction:
    """Test EC2 stop action execution with mocked boto3 (Phase 2)."""

    def test_stop_running_instance_returns_stopping_state(self) -> None:
        """Phase 2: stopping a running instance should return new_state='stopping'."""
        pytest.skip("Phase 2: implement with mocked boto3")

    def test_stop_already_stopped_instance(self) -> None:
        """Phase 2: stopping an already-stopped instance should be handled gracefully."""
        pytest.skip("Phase 2")

    def test_stop_nonexistent_instance_raises_error(self) -> None:
        """Phase 2: stopping a non-existent instance should return an error response."""
        pytest.skip("Phase 2")

    def test_mock_stop_action_does_not_call_aws(self) -> None:
        """Phase 2: mock mode stop should not make real boto3 calls."""
        pytest.skip("Phase 2")
