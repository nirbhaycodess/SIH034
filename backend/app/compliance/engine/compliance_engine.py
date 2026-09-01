from __future__ import annotations

from collections.abc import Iterable

from ...schemas.analysis import DeclarationExtraction
from ..schemas.results import ComplianceEvaluation, ComplianceResult
from ..schemas.rules import ComplianceRule
from ..validators.presence import validate_presence


class ComplianceEngine:
    """Evaluates declarations with configured deterministic validators only."""

    def __init__(self, rules: Iterable[ComplianceRule], ruleset_name: str = "demo-sample") -> None:
        self._rules = tuple(rules)
        self._ruleset_name = ruleset_name

    def evaluate(self, declarations: DeclarationExtraction) -> ComplianceEvaluation:
        results: list[ComplianceResult] = []
        for rule in self._rules:
            if not rule.enabled:
                continue
            extracted = getattr(declarations, rule.field, None)
            value = extracted.value if extracted else None
            confidence = extracted.confidence if extracted else 0
            if rule.validator != "presence":
                raise ValueError(f"Unsupported compliance validator: {rule.validator}")

            valid, explanation = validate_presence(value)
            status = rule.pass_status if valid else rule.missing_status
            manual_review = rule.manual_review or confidence < rule.confidence_threshold
            if manual_review and status == "PASS":
                status = "WARNING"
                explanation = f"{explanation} Confidence is below the configured review threshold."
            results.append(
                ComplianceResult(
                    rule_id=rule.rule_id,
                    reference=rule.reference,
                    field=rule.field,
                    detected_value=value,
                    expected_condition=rule.expected_condition,
                    status=status,
                    explanation=explanation,
                    confidence=confidence,
                    requires_manual_review=manual_review,
                )
            )
        return ComplianceEvaluation(
            results=results,
            ruleset=self._ruleset_name,
            disclaimer="Demo/sample rules only. Not a legal compliance determination.",
        )
