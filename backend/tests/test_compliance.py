"""Tests for compliance engine and mock AI provider."""
from __future__ import annotations

import asyncio
import sys
from pathlib import Path

# Allow running tests from the backend directory
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest

from app.compliance.engine import ComplianceEngine
from app.ai.mock_provider import MockAIProvider


# ── Compliance Engine Tests ───────────────────────────────────────────────────

class TestComplianceEngine:
    def setup_method(self):
        self.engine = ComplianceEngine()

    def test_all_fields_present_returns_compliant(self):
        declarations = {
            "product_name": {"value": "Test Biscuits", "confidence": 0.95},
            "manufacturer": {"value": "Test Foods Pvt Ltd", "confidence": 0.92},
            "net_quantity": {"value": "100 g", "confidence": 0.99},
            "mrp": {"value": "₹10", "confidence": 0.99},
            "packing_date": {"value": "08/2026", "confidence": 0.88},
            "consumer_care": {"value": "1800-123-456", "confidence": 0.85},
        }
        summary = self.engine.run(declarations)
        assert summary.status == "COMPLIANT"
        assert summary.score >= 80
        assert summary.failed == 0

    def test_missing_fields_returns_non_compliant(self):
        declarations = {}  # No fields
        summary = self.engine.run(declarations)
        assert summary.status == "NON_COMPLIANT"
        assert summary.failed > 0
        assert summary.score < 50

    def test_some_missing_returns_needs_review_or_non_compliant(self):
        declarations = {
            "product_name": {"value": "Test Product", "confidence": 0.90},
            "manufacturer": {"value": "Test Mfr", "confidence": 0.88},
            # Missing: net_quantity, mrp, packing_date, consumer_care
        }
        summary = self.engine.run(declarations)
        assert summary.status in {"NON_COMPLIANT", "NEEDS_REVIEW"}
        assert summary.failed >= 1

    def test_low_confidence_returns_review(self):
        declarations = {
            "product_name": {"value": "Test", "confidence": 0.20},  # Below threshold
            "manufacturer": {"value": "Mfr", "confidence": 0.15},
        }
        summary = self.engine.run(declarations)
        # Low confidence means REVIEW status per result
        reviews = [r for r in summary.results if r.status == "REVIEW"]
        assert len(reviews) >= 1

    def test_mrp_without_currency_symbol_is_warning(self):
        declarations = {
            "product_name": {"value": "Test", "confidence": 0.95},
            "manufacturer": {"value": "Mfr", "confidence": 0.95},
            "net_quantity": {"value": "200 g", "confidence": 0.95},
            "mrp": {"value": "10.00", "confidence": 0.95},  # No ₹ symbol
            "packing_date": {"value": "09/2026", "confidence": 0.95},
            "consumer_care": {"value": "18001234567", "confidence": 0.95},
        }
        summary = self.engine.run(declarations)
        mrp_result = next((r for r in summary.results if r.field_name == "mrp"), None)
        assert mrp_result is not None
        assert mrp_result.status == "WARNING"

    def test_score_is_between_0_and_99(self):
        for declarations in [
            {},  # No fields
            {"product_name": {"value": "X", "confidence": 0.95}},  # One field
            {
                "product_name": {"value": "X", "confidence": 0.95},
                "manufacturer": {"value": "Y", "confidence": 0.95},
                "net_quantity": {"value": "100 g", "confidence": 0.95},
                "mrp": {"value": "₹10", "confidence": 0.95},
                "packing_date": {"value": "08/2026", "confidence": 0.95},
                "consumer_care": {"value": "1800-123", "confidence": 0.95},
            },
        ]:
            summary = self.engine.run(declarations)
            assert 0 <= summary.score <= 99


# ── Mock AI Provider Tests ────────────────────────────────────────────────────

class TestMockAIProvider:
    def setup_method(self):
        self.provider = MockAIProvider()

    def test_extract_declarations_returns_dict(self):
        result = asyncio.run(self.provider.extract_declarations("Some OCR text here"))
        assert isinstance(result, dict)
        assert len(result) > 0

    def test_extract_declarations_fields_have_value_and_confidence(self):
        result = asyncio.run(self.provider.extract_declarations("Parle Glucose Biscuits 130g MRP ₹10"))
        for field, data in result.items():
            assert "value" in data
            assert "confidence" in data
            if data["value"] is not None:
                assert 0.0 <= data["confidence"] <= 1.0

    def test_mrp_detected_from_text(self):
        result = asyncio.run(self.provider.extract_declarations("MRP: ₹25.50"))
        mrp = result.get("mrp", {})
        assert mrp.get("value") is not None
        assert "25" in str(mrp.get("value", ""))

    def test_quantity_detected(self):
        result = asyncio.run(self.provider.extract_declarations("Net Weight: 200 g"))
        qty = result.get("net_quantity", {})
        assert qty.get("value") is not None

    def test_analyze_label_returns_metadata(self):
        result = asyncio.run(self.provider.analyze_label("some text"))
        assert isinstance(result, dict)
        assert "provider" in result

    def test_explain_finding_with_value(self):
        result = asyncio.run(self.provider.explain_finding("mrp", "₹10"))
        assert isinstance(result, str)
        assert len(result) > 0

    def test_explain_finding_without_value(self):
        result = asyncio.run(self.provider.explain_finding("mrp", None))
        assert isinstance(result, str)
        assert len(result) > 0


# ── Integration: Engine + MockAI ─────────────────────────────────────────────

class TestEngineWithMockAI:
    def test_full_pipeline_returns_valid_summary(self):
        provider = MockAIProvider()
        engine = ComplianceEngine()
        ocr_text = "Parle Glucose Biscuits 130g MRP ₹10 Mfg: Parle Products Pvt Ltd Mumbai Consumer care: 1800-22-8888"

        declarations = asyncio.run(provider.extract_declarations(ocr_text))
        summary = engine.run(declarations)

        assert summary.status in {"COMPLIANT", "NEEDS_REVIEW", "NON_COMPLIANT"}
        assert 0 <= summary.score <= 99
        assert len(summary.results) > 0
        assert isinstance(summary.label, str)
