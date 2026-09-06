"""
AI-Driven Compliance Engine for PackSure AI.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

logger = logging.getLogger("packsure.compliance")


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
    label: str = "AI-assisted Legal Metrology compliance assessment."


class ComplianceEngine:
    """
    AI-driven rule engine.
    Input: list of dictionaries returned by evaluate_compliance_ai.
    Output: ComplianceSummary
    """

    def run_ai_results(self, ai_results: List[Dict[str, Any]], declarations: Dict[str, Dict[str, Any]]) -> ComplianceSummary:
        results: List[ComplianceResult] = []

        for res in ai_results:
            field_name = res.get("field_name", "general")
            # Try to get the detected value from the original declarations
            detected_value = None
            if field_name in declarations:
                detected_value = declarations[field_name].get("value")
                
            status = res.get("status", "REVIEW").upper()
            
            results.append(ComplianceResult(
                rule_id=res.get("rule_id", "Unknown"),
                field_name=field_name,
                status=status,
                detected_value=detected_value,
                expected_condition=res.get("expected_condition", ""),
                explanation=res.get("explanation", ""),
                confidence=0.9, # AI evaluation confidence
                requires_manual_review=(status in {"WARNING", "REVIEW"}),
                severity_if_fail=res.get("severity_if_fail", "MEDIUM")
            ))

        return self._compute_summary(results)

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
            score = max(0, min(100, score))

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
