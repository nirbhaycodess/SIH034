from ..schemas.inspection import ComplianceCheck, Declaration, Inspection, Violation
from ..schemas.product import Product
from ..schemas.report import Report

declarations = [
    Declaration(label="Product name", value="FreshGlow Herbal Shampoo", confidence=98),
    Declaration(label="Brand", value="FreshGlow", confidence=97),
    Declaration(label="Manufacturer", value="Aarav Consumer Products Pvt. Ltd.", confidence=94),
    Declaration(label="Net quantity", value="340 ml", confidence=99),
    Declaration(label="MRP", value="₹299.00", confidence=91),
    Declaration(label="Packing date", value="August 2026", confidence=96),
]

violations = [
    Violation(id="V-01", title="Customer care details missing", severity="High", description="No consumer care contact was identified on the mock label.", rule="Rule 6(1)(l)"),
    Violation(id="V-02", title="MRP declaration requires review", severity="Medium", description="Inclusive-tax text needs inspector confirmation.", rule="Rule 6(1)(e)"),
]

checks = [
    ComplianceCheck(requirement="Product identity declaration", detected_value="FreshGlow Herbal Shampoo", status="PASS", explanation="Product name is clearly visible."),
    ComplianceCheck(requirement="Net quantity declaration", detected_value="340 ml", status="PASS", explanation="Quantity is stated in the prescribed unit."),
    ComplianceCheck(requirement="Manufacturer information", detected_value="Aarav Consumer Products Pvt. Ltd.", status="PASS", explanation="Name and address were detected."),
    ComplianceCheck(requirement="Maximum retail price", detected_value="₹299.00", status="WARNING", explanation="Inclusive-tax text requires an inspector review."),
    ComplianceCheck(requirement="Consumer care details", detected_value="Not detected", status="FAIL", explanation="No contact details found in the mock scan."),
]

inspections = [
    Inspection(id="INS-2026-00482", product="FreshGlow Herbal Shampoo", manufacturer="Aarav Consumer Products", date="30 Aug 2026", score=82, status="NEEDS REVIEW", inspector="Priya Sharma", category="Personal Care", declarations=declarations, checks=checks, violations=violations),
    Inspection(id="INS-2026-00481", product="Nature Harvest Oats", manufacturer="Harvest Foods India", date="30 Aug 2026", score=96, status="COMPLIANT", inspector="Rohan Mehta", category="Food & Beverages"),
    Inspection(id="INS-2026-00480", product="PowerCell AA Batteries", manufacturer="VoltWorks Ltd.", date="29 Aug 2026", score=64, status="VIOLATION", inspector="Priya Sharma", category="Electronics", violations=violations),
]

products = [
    Product(id="PRD-1", name=x.product, brand=x.product.split()[0], manufacturer=x.manufacturer, category=x.category, last_inspection=x.date, status=x.status, violations=len(x.violations))
    for x in inspections
]

reports = [
    Report(id=f"REP-{x.id[4:]}", inspection_id=x.id, product=x.product, date=x.date, status=x.status, inspector=x.inspector, download_url=f"/api/v1/reports/REP-{x.id[4:]}/download")
    for x in inspections
]
