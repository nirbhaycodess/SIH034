from ..schemas.rules import ComplianceRule

# These are intentionally sample presence checks, not verified Legal Metrology rules.
DEMO_RULES: tuple[ComplianceRule, ...] = tuple(
    ComplianceRule(
        rule_id=f"DEMO-PRESENCE-{field.upper()}",
        reference="DEMO/SAMPLE - pending verified Legal Metrology dataset",
        field=field,
        expected_condition=f"{field} contains a non-empty declaration",
        validator="presence",
    )
    for field in (
        "product_name",
        "manufacturer",
        "packer",
        "importer",
        "net_quantity",
        "mrp",
        "manufacturing_date",
        "consumer_care",
        "country_of_origin",
    )
)
