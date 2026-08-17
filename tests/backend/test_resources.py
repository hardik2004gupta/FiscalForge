"""
Tests for resource inventory normalization and field mapping.

Phase 2: remove pytest.skip() calls as AWS adapters are implemented.
"""
from __future__ import annotations

import pytest


class TestEC2Models:
    """Test EC2Instance model validation and mock data."""

    def test_ec2_instance_requires_all_fields(self) -> None:
        """EC2Instance should reject construction with missing required fields."""
        from pydantic import ValidationError
        from backend.models import EC2Instance

        with pytest.raises(ValidationError):
            EC2Instance()  # type: ignore[call-arg]

    def test_mock_inventory_has_running_and_stopped_instances(self) -> None:
        """Mock data should include instances in multiple states."""
        from backend.mock.resources import get_mock_resource_inventory

        inventory = get_mock_resource_inventory()
        states = {i.state for i in inventory.ec2}
        assert "running" in states
        assert "stopped" in states

    def test_mock_ec2_includes_underutilized_instances(self) -> None:
        """Mock inventory should include instances with CPU < 10% for rule testing."""
        from backend.mock.resources import get_mock_resource_inventory
        from backend.optimization.rules import CPU_UNDERUTILIZATION_THRESHOLD

        inventory = get_mock_resource_inventory()
        underutilized = [
            i for i in inventory.ec2
            if i.utilization is not None and i.utilization < CPU_UNDERUTILIZATION_THRESHOLD
        ]
        assert len(underutilized) >= 2, "Mock data needs underutilized instances for rule testing"


class TestRDSModels:
    """Test RDSInstance model validation and mock data."""

    def test_rds_instance_requires_all_fields(self) -> None:
        """RDSInstance should reject construction with missing required fields."""
        from pydantic import ValidationError
        from backend.models import RDSInstance

        with pytest.raises(ValidationError):
            RDSInstance()  # type: ignore[call-arg]

    def test_mock_rds_cost_is_non_negative(self) -> None:
        """All mock RDS instances should have non-negative estimated costs."""
        from backend.mock.resources import get_mock_resource_inventory

        inventory = get_mock_resource_inventory()
        for instance in inventory.rds:
            assert instance.estimated_cost >= 0


class TestS3Models:
    """Test S3Bucket model validation and mock data."""

    def test_s3_bucket_requires_all_fields(self) -> None:
        """S3Bucket should reject construction with missing required fields."""
        from pydantic import ValidationError
        from backend.models import S3Bucket

        with pytest.raises(ValidationError):
            S3Bucket()  # type: ignore[call-arg]

    def test_mock_s3_includes_large_bucket(self) -> None:
        """Mock data should include a bucket large enough to trigger S3 rule."""
        from backend.mock.resources import get_mock_resource_inventory
        from backend.optimization.rules import S3_LARGE_BUCKET_GB_THRESHOLD

        inventory = get_mock_resource_inventory()
        large_buckets = [b for b in inventory.s3 if b.size_gb > S3_LARGE_BUCKET_GB_THRESHOLD]
        assert len(large_buckets) >= 1, "Mock data needs a large bucket for S3 rule testing"


class TestResourceInventoryNormalization:
    """Test ResourceInventory adapter normalization (Phase 2)."""

    def test_ec2_normalization_from_boto3_response(self) -> None:
        """Phase 2: EC2 adapter should normalize boto3 describe_instances response."""
        pytest.skip("Phase 2: implement EC2 adapter")

    def test_rds_normalization_from_boto3_response(self) -> None:
        """Phase 2: RDS adapter should normalize boto3 describe_db_instances response."""
        pytest.skip("Phase 2")

    def test_s3_normalization_from_boto3_response(self) -> None:
        """Phase 2: S3 adapter should normalize boto3 list_buckets response."""
        pytest.skip("Phase 2")
