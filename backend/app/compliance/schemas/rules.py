from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

RuleStatus = Literal["PASS", "FAIL", "WARNING", "REVIEW"]


class ComplianceRule(BaseModel):
    """Configurable rule definition; demo rules are not legal guidance."""

    rule_id: str
    reference: str
    field: str
    expected_condition: str
    validator: str
    missing_status: RuleStatus = "REVIEW"
    pass_status: RuleStatus = "PASS"
    fail_status: RuleStatus = "FAIL"
    enabled: bool = True
    demo: bool = True
    manual_review: bool = False
    confidence_threshold: float = Field(default=0.8, ge=0, le=1)
