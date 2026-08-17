"""
Tests for the deterministic optimization rules engine.

Every optimization rule must have:
  - At least one test that confirms the rule triggers (positive case)
  - At least one test that confirms the rule does NOT trigger (negative case)

Phase 2: remove pytest.skip() calls as rules are implemented.
See CLAUDE.md §10 Optimization Engine Contract.
"""
from __future__ import annotations

import pytest

from backend.models import EC2Instance, S3Bucket


@pytest.fixture
def underutilized_ec2() -> EC2Instance:
    """EC2 instance with CPU below threshold — should trigger underutilization rules."""
    return EC2Instance(
        id="i-0a1b2c3d4e5f67890",
        type="t3.large",
        state="running",
        region="us-east-1",
        launch_time="2023-11-01T08:00:00Z",
        estimated_cost=60.74,
        utilization=8.2,
    )


@pytest.fixture
def healthy_ec2() -> EC2Instance:
    """EC2 instance with normal CPU — should NOT trigger underutilization rules."""
    return EC2Instance(
        id="i-0c3d4e5f678901234",
        type="t3.medium",
        state="running",
        region="us-east-1",
        launch_time="2024-01-10T09:15:00Z",
        estimated_cost=30.37,
        utilization=52.4,
    )


@pytest.fixture
def stopped_ec2() -> EC2Instance:
    """Stopped EC2 instance — should never trigger any optimization rule."""
    return EC2Instance(
        id="i-0d4e5f67890123456",
        type="t3.small",
        state="stopped",
        region="us-west-2",
        launch_time="2023-12-01T11:00:00Z",
        estimated_cost=0.0,
        utilization=None,
    )


@pytest.fixture
def large_s3_bucket() -> S3Bucket:
    """Large S3 bucket that exceeds the storage threshold."""
    return S3Bucket(
        name="fiscalforge-logs-archive",
        region="us-east-1",
        size_gb=1024.5,
        object_count=892100,
        estimated_cost=23.56,
    )


@pytest.fixture
def small_s3_bucket() -> S3Bucket:
    """Small S3 bucket below the storage threshold."""
    return S3Bucket(
        name="fiscalforge-assets",
        region="us-east-1",
        size_gb=12.3,
        object_count=4521,
        estimated_cost=0.28,
    )


class TestEC2UnderutilizationRule:
    """Test Rule 1: EC2_UNDERUTILIZED."""

    def test_low_cpu_running_instance_triggers_recommendation(
        self, underutilized_ec2: EC2Instance
    ) -> None:
        """Phase 2: instance with CPU < 10% should produce EC2_UNDERUTILIZED recommendation."""
        pytest.skip("Phase 2: implement check_ec2_underutilization()")

    def test_healthy_cpu_instance_produces_no_recommendation(
        self, healthy_ec2: EC2Instance
    ) -> None:
        """Phase 2: instance with healthy CPU should return None."""
        pytest.skip("Phase 2")

    def test_stopped_instance_produces_no_recommendation(
        self, stopped_ec2: EC2Instance
    ) -> None:
        """Phase 2: stopped instance should return None regardless of CPU."""
        pytest.skip("Phase 2")

    def test_recommendation_severity_is_high(self, underutilized_ec2: EC2Instance) -> None:
        """Phase 2: EC2_UNDERUTILIZED severity should be 'high'."""
        pytest.skip("Phase 2")


class TestEC2RightsizingRule:
    """Test Rule 2: EC2_RIGHTSIZING."""

    def test_long_running_low_cpu_triggers_recommendation(
        self, underutilized_ec2: EC2Instance
    ) -> None:
        """Phase 2: long-running instance with low CPU should produce EC2_RIGHTSIZING."""
        pytest.skip("Phase 2: implement check_ec2_rightsizing()")

    def test_new_low_cpu_instance_does_not_trigger(
        self, underutilized_ec2: EC2Instance
    ) -> None:
        """Phase 2: recently launched instance should not trigger rightsizing."""
        pytest.skip("Phase 2")

    def test_recommendation_severity_is_medium(self, underutilized_ec2: EC2Instance) -> None:
        """Phase 2: EC2_RIGHTSIZING severity should be 'medium'."""
        pytest.skip("Phase 2")


class TestS3StorageOptimizationRule:
    """Test Rule 4: S3_STORAGE_OPTIMIZATION."""

    def test_large_bucket_triggers_recommendation(self, large_s3_bucket: S3Bucket) -> None:
        """Phase 2: bucket > threshold should produce S3_STORAGE_OPTIMIZATION."""
        pytest.skip("Phase 2: implement check_s3_storage_optimization()")

    def test_small_bucket_produces_no_recommendation(self, small_s3_bucket: S3Bucket) -> None:
        """Phase 2: small bucket should return None."""
        pytest.skip("Phase 2")

    def test_recommendation_severity_is_low(self, large_s3_bucket: S3Bucket) -> None:
        """Phase 2: S3_STORAGE_OPTIMIZATION severity should be 'low'."""
        pytest.skip("Phase 2")


class TestRecommendationStructure:
    """Test that Recommendation model enforces the required structure."""

    def test_recommendation_requires_all_fields(self) -> None:
        """Recommendation should reject construction with missing required fields."""
        from pydantic import ValidationError
        from backend.models import Recommendation

        with pytest.raises(ValidationError):
            Recommendation()  # type: ignore[call-arg]

    def test_recommendation_type_must_be_valid(self) -> None:
        """Recommendation.type must be a recognized RecommendationType value."""
        from pydantic import ValidationError
        from backend.models import Recommendation

        with pytest.raises(ValidationError):
            Recommendation(
                id="rec-001",
                resource_id="i-xxx",
                type="INVALID_TYPE",  # type: ignore[arg-type]
                severity="high",
                reason="test",
                estimated_savings=10.0,
            )

    def test_recommendation_severity_must_be_valid(self) -> None:
        """Recommendation.severity must be high, medium, or low."""
        from pydantic import ValidationError
        from backend.models import Recommendation

        with pytest.raises(ValidationError):
            Recommendation(
                id="rec-001",
                resource_id="i-xxx",
                type="EC2_UNDERUTILIZED",
                severity="critical",  # type: ignore[arg-type]
                reason="test",
                estimated_savings=10.0,
            )
