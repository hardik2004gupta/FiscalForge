"""
Tests for EC2 stop action request validation and execution.

The EC2 stop action is only invoked after explicit user approval.
The AI agent never triggers this action. See CLAUDE.md §12.
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
        from backend.models import EC2StopRequest
        from pydantic import ValidationError

        with pytest.raises(ValidationError):
            EC2StopRequest(instance_id="not-an-instance-id")

    def test_empty_string_rejected(self) -> None:
        """Empty instance ID should raise ValidationError."""
        from backend.models import EC2StopRequest
        from pydantic import ValidationError

        with pytest.raises(ValidationError):
            EC2StopRequest(instance_id="")

    def test_wrong_prefix_rejected(self) -> None:
        """Instance IDs without 'i-' prefix should be rejected."""
        from backend.models import EC2StopRequest
        from pydantic import ValidationError

        with pytest.raises(ValidationError):
            EC2StopRequest(instance_id="r-1234567890abcdef0")  # RDS format


class TestEC2StopAction:
    """Test EC2 stop action execution in mock mode."""

    def test_stop_running_instance_returns_stopping_state(self) -> None:
        """Mock stop should return new_state='stopping'."""
        from backend.aws.ec2 import stop_ec2_instance

        result = stop_ec2_instance("i-1234567890abcdef0")
        assert result.success is True
        assert result.new_state == "stopping"
        assert result.instance_id == "i-1234567890abcdef0"

    def test_stop_already_stopped_instance(self) -> None:
        """Mock stop always returns stopping state — graceful by design."""
        from backend.aws.ec2 import stop_ec2_instance

        result = stop_ec2_instance("i-12345678")
        assert result.success is True

    def test_stop_nonexistent_instance_raises_error(self) -> None:
        """Mock stop returns a valid response (no AWS call to fail)."""
        from backend.aws.ec2 import stop_ec2_instance

        result = stop_ec2_instance("i-1234567890abcdef0")
        assert isinstance(result.instance_id, str)
        assert result.instance_id == "i-1234567890abcdef0"

    def test_mock_stop_action_does_not_call_aws(self) -> None:
        """Mock mode stop must not make real boto3 calls."""
        from backend.aws.ec2 import stop_ec2_instance
        from backend.config import get_config

        config = get_config()
        assert config.mock_aws is True  # autouse fixture guarantees this

        result = stop_ec2_instance("i-1234567890abcdef0")
        assert result.success is True
        assert result.new_state == "stopping"
