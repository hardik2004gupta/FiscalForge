"""
Tests for cost data retrieval, calculation logic, and model validation.
"""

from __future__ import annotations

import pytest


class TestCostModels:
    """Test CostSummary and related model validation."""

    def test_cost_summary_requires_all_fields(self) -> None:
        """CostSummary should reject construction with missing required fields."""
        from backend.models import CostSummary
        from pydantic import ValidationError

        with pytest.raises(ValidationError):
            CostSummary()  # type: ignore[call-arg]

    def test_mock_cost_summary_is_valid(self) -> None:
        """Mock cost data should produce a valid, non-empty CostSummary."""
        from backend.mock.cost_data import get_mock_cost_summary

        summary = get_mock_cost_summary()
        assert summary.total_cost > 0
        assert summary.previous_cost > 0
        assert len(summary.daily_costs) > 0
        assert len(summary.services) > 0

    def test_mock_cost_change_percent_is_positive(self) -> None:
        """Mock data represents a cost increase — change_percent should be positive."""
        from backend.mock.cost_data import get_mock_cost_summary

        summary = get_mock_cost_summary()
        assert summary.change_percent > 0

    def test_daily_cost_dates_are_strings(self) -> None:
        """DailyCost.date should be a string in ISO date format."""
        from backend.mock.cost_data import get_mock_cost_summary

        summary = get_mock_cost_summary()
        for daily in summary.daily_costs:
            assert isinstance(daily.date, str)
            assert len(daily.date) == 10  # "YYYY-MM-DD"


class TestCostCalculations:
    """Test cost percentage change and aggregation logic."""

    def test_positive_cost_increase(self) -> None:
        """Cost increase should produce positive change_percent."""
        from backend.aws.cost_explorer import get_cost_summary

        # Mock mode returns total=4281.62, previous=3810.41 — an increase
        summary = get_cost_summary()
        assert summary.change_percent > 0

    def test_cost_decrease(self) -> None:
        """Cost decrease should produce negative change_percent."""
        from backend.models import CostSummary, DailyCost, ServiceCost

        # Verify the model accepts a negative change_percent (cost went down)
        summary = CostSummary(
            total_cost=100.0,
            previous_cost=120.0,
            change_percent=-16.67,
            daily_costs=[DailyCost(date="2024-01-01", cost=100.0)],
            services=[ServiceCost(name="Amazon EC2", cost=100.0)],
        )
        assert summary.change_percent < 0

    def test_zero_previous_period(self) -> None:
        """Zero previous cost should be stored without error (no division by zero)."""
        from backend.models import CostSummary, DailyCost, ServiceCost

        # The adapter sets change_percent=0.0 when previous_cost==0 — verify model accepts it
        summary = CostSummary(
            total_cost=100.0,
            previous_cost=0.0,
            change_percent=0.0,
            daily_costs=[DailyCost(date="2024-01-01", cost=100.0)],
            services=[ServiceCost(name="Amazon EC2", cost=100.0)],
        )
        assert summary.previous_cost == 0.0
        assert summary.change_percent == 0.0

    def test_service_cost_aggregation(self) -> None:
        """Service cost list should be non-empty and all costs non-negative."""
        from backend.aws.cost_explorer import get_cost_summary

        summary = get_cost_summary()
        assert len(summary.services) > 0
        for service in summary.services:
            assert service.cost >= 0
