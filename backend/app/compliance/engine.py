"""
Deterministic Compliance Engine for PackSure AI.

IMPORTANT:
- This engine makes decisions deterministically based on structured declarations.
- AI providers (Gemini, Mock) supply extracted text/values.
- The COMPLIANCE DECISION is always made by this engine, never by the AI provider.
- All rules are clearly marked as DEMO rules.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from .rules.demo_rules import DEMO_RULES, FIELD_TO_RULE_MAP, DemoRule

logger = logging.getLogger("packsure.compliance")

CONFIDENCE_THRESHOLD = 0.5  # Below this, result is REVIEW not PASS/FAIL


@dataclass
class ComplianceResult:
    rule_id: str
    field_name: str
    status: str  # PASS | FAIL | WARNING | REVIEW
    detected_value: Optional[str]
    expected_condition: str
    explanation: str
    confidence: float
    requires_manual_review: bool
    severity_if_fail: str
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


@dataclass
class ComplianceSummary:
    score: int
    status: str  # COMPLIANT | NON_COMPLIANT | NEEDS_REVIEW
    passed: int
    warnings: int
    failed: int
    reviews: int
    results: List[ComplianceResult]
    label: str = "[DEMO] AI-assisted preliminary compliance assessment. Not a legally binding determination."


class ComplianceEngine:
    """
    Deterministic rule engine.
    Input: dict of extracted declarations {field_name: {"value": ..., "confidence": ...}}
    Output: ComplianceSummary
    """

    def run(self, declarations: Dict[str, Dict[str, Any]]) -> ComplianceSummary:
        results: List[ComplianceResult] = []

        for rule in DEMO_RULES:
            if not rule.enabled:
                continue
            result = self._evaluate_rule(rule, declarations)
            results.append(result)

        return self._compute_summary(results)

    def _evaluate_rule(
        self, rule: DemoRule, declarations: Dict[str, Dict[str, Any]]
    ) -> ComplianceResult:
        decl = declarations.get(rule.field)

        if decl is None:
            # Field not extracted at all
            return ComplianceResult(
                rule_id=rule.rule_id,
                field_name=rule.field,
                status="FAIL",
                detected_value=None,
                expected_condition=f"{rule.name} detected",
                explanation=f"[DEMO] {rule.name} was not detected in the package image.",
                confidence=0.9,
                requires_manual_review=True,
                severity_if_fail=rule.severity_if_fail,
            )

        value = decl.get("value")
        confidence = float(decl.get("confidence", 0.0))

        if value is None or str(value).strip() == "" or str(value).lower() == "none":
            return ComplianceResult(
                rule_id=rule.rule_id,
                field_name=rule.field,
                status="FAIL",
                detected_value=None,
                expected_condition=f"{rule.name} detected",
                explanation=f"[DEMO] {rule.name} could not be extracted from the package image.",
                confidence=confidence,
                requires_manual_review=True,
                severity_if_fail=rule.severity_if_fail,
            )

        if confidence < CONFIDENCE_THRESHOLD:
            return ComplianceResult(
                rule_id=rule.rule_id,
                field_name=rule.field,
                status="REVIEW",
                detected_value=str(value),
                expected_condition=f"{rule.name} detected with sufficient confidence",
                explanation=f"[DEMO] {rule.name} was detected but with low confidence ({confidence:.0%}). Manual review recommended.",
                confidence=confidence,
                requires_manual_review=True,
                severity_if_fail=rule.severity_if_fail,
            )

        # Run field-specific additional validation
        status, explanation = self._field_specific_check(rule.field, str(value), confidence)

        return ComplianceResult(
            rule_id=rule.rule_id,
            field_name=rule.field,
            status=status,
            detected_value=str(value),
            expected_condition=f"{rule.name} detected",
            explanation=explanation,
            confidence=confidence,
            requires_manual_review=(status in {"WARNING", "REVIEW"}),
            severity_if_fail=rule.severity_if_fail,
        )

    def _field_specific_check(self, field: str, value: str, confidence: float) -> tuple[str, str]:
        """Optional additional checks per field. Returns (status, explanation)."""

        if field == "mrp":
            # Check for ₹ / Rs symbol
            if "₹" in value or "rs" in value.lower() or "rs." in value.lower():
                return "PASS", "[DEMO] MRP declaration detected by AI engine."
            return "WARNING", "[DEMO] MRP detected but currency symbol (₹/Rs) not clearly visible. Manual review recommended."

        if field == "net_quantity":
            # Check for standard units
            val_lower = value.lower()
            if any(u in val_lower for u in ["g", "kg", "ml", "l", "liter", "litre", "n", "piece"]):
                return "PASS", "[DEMO] Net quantity detected in metric unit."
            return "WARNING", "[DEMO] Net quantity detected but unit abbreviation may be non-standard. Physical verification recommended."

        if field == "packing_date":
            return "PASS", "[DEMO] Packing/manufacturing date detected by AI engine."

        # Default: detected = PASS
        return "PASS", f"[DEMO] {field.replace('_', ' ').title()} detected by AI engine."

    def _compute_summary(self, results: List[ComplianceResult]) -> ComplianceSummary:
        passed = sum(1 for r in results if r.status == "PASS")
        warnings = sum(1 for r in results if r.status == "WARNING")
        failed = sum(1 for r in results if r.status == "FAIL")
        reviews = sum(1 for r in results if r.status == "REVIEW")
        total = len(results)

        if total == 0:
            score = 0
        else:
            score = int((passed * 100 + warnings * 50) / (total * 100) * 100)
            score = max(0, min(99, score))

        if failed == 0 and reviews == 0 and warnings == 0:
            status = "COMPLIANT"
        elif failed > 0:
            status = "NON_COMPLIANT"
        else:
            status = "NEEDS_REVIEW"

        return ComplianceSummary(
            score=score,
            status=status,
            passed=passed,
            warnings=warnings,
            failed=failed,
            reviews=reviews,
            results=results,
        )
