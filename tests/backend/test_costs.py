"""
Tests for cost data retrieval, calculation logic, and model validation.

Phase 2: remove pytest.skip() calls and implement assertions as
         aws.cost_explorer and calculation utilities are built.
"""
from __future__ import annotations

import pytest


class TestCostModels:
    """Test CostSummary and related model validation."""

    def test_cost_summary_requires_all_fields(self) -> None:
        """CostSummary should reject construction with missing required fields."""
        from pydantic import ValidationError
        from backend.models import CostSummary

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
    """Test cost percentage change and aggregation logic.

    These tests will verify the calculation utilities built in Phase 2.
    """

    def test_positive_cost_increase(self) -> None:
        """Phase 2: cost increase should produce positive change_percent."""
        pytest.skip("Phase 2: implement calculate_change_percent()")

    def test_cost_decrease(self) -> None:
        """Phase 2: cost decrease should produce negative change_percent."""
        pytest.skip("Phase 2")

    def test_zero_previous_period(self) -> None:
        """Phase 2: zero previous cost should be handled without division error."""
        pytest.skip("Phase 2")

    def test_service_cost_aggregation(self) -> None:
        """Phase 2: service costs should aggregate correctly across API responses."""
        pytest.skip("Phase 2")
