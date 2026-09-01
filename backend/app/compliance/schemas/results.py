from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

ComplianceStatus = Literal["PASS", "FAIL", "WARNING", "REVIEW"]


class ComplianceResult(BaseModel):
    rule_id: str
    reference: str
    field: str
    detected_value: str | None
    expected_condition: str
    status: ComplianceStatus
    explanation: str
    confidence: float = Field(ge=0, le=1)
    requires_manual_review: bool


class ComplianceEvaluation(BaseModel):
    results: list[ComplianceResult]
    ruleset: str
    disclaimer: str
