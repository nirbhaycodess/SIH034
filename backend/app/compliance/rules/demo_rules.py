"""
DEMO COMPLIANCE RULES for PackSure AI.

IMPORTANT DISCLAIMER:
These rules are clearly marked as DEMO rules for the Smart India Hackathon.
They are NOT a complete or authoritative interpretation of the
Legal Metrology (Packaged Commodities) Rules, 2011 or any other legislation.
They are designed as demonstration rules only.
Verified legal rules should be added by qualified legal/metrology experts.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import List


@dataclass
class DemoRule:
    rule_id: str
    name: str
    field: str
    description: str
    enabled: bool
    version: str
    severity_if_fail: str  # LOW, MEDIUM, HIGH, CRITICAL


# ── Demo Rule Registry ────────────────────────────────────────────────────────
# These are AI-detection presence rules only.
# They check whether information was detected, NOT full legal compliance.

DEMO_RULES: List[DemoRule] = [
    DemoRule(
        rule_id="RULE-DEMO-001",
        name="Manufacturer / Packer Information",
        field="manufacturer",
        description="[DEMO] Checks whether manufacturer or packer information was detected by the AI engine.",
        enabled=True,
        version="demo-1",
        severity_if_fail="HIGH",
    ),
    DemoRule(
        rule_id="RULE-DEMO-002",
        name="Net Quantity Declaration",
        field="net_quantity",
        description="[DEMO] Checks whether net quantity information was detected by the AI engine.",
        enabled=True,
        version="demo-1",
        severity_if_fail="HIGH",
    ),
    DemoRule(
        rule_id="RULE-DEMO-003",
        name="Maximum Retail Price (MRP)",
        field="mrp",
        description="[DEMO] Checks whether MRP information was detected by the AI engine.",
        enabled=True,
        version="demo-1",
        severity_if_fail="HIGH",
    ),
    DemoRule(
        rule_id="RULE-DEMO-004",
        name="Consumer Care Information",
        field="consumer_care",
        description="[DEMO] Checks whether consumer care contact information was detected by the AI engine.",
        enabled=True,
        version="demo-1",
        severity_if_fail="MEDIUM",
    ),
    DemoRule(
        rule_id="RULE-DEMO-005",
        name="Product Name / Brand",
        field="product_name",
        description="[DEMO] Checks whether the product name was detected by the AI engine.",
        enabled=True,
        version="demo-1",
        severity_if_fail="MEDIUM",
    ),
    DemoRule(
        rule_id="RULE-DEMO-006",
        name="Packing / Manufacturing Date",
        field="packing_date",
        description="[DEMO] Checks whether a packing or manufacturing date was detected by the AI engine.",
        enabled=True,
        version="demo-1",
        severity_if_fail="MEDIUM",
    ),
]

DEMO_RULES_MAP = {r.rule_id: r for r in DEMO_RULES}
FIELD_TO_RULE_MAP = {r.field: r for r in DEMO_RULES if r.enabled}
