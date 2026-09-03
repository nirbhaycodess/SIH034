"""Seed PackSure AI MongoDB database with demo data."""
from __future__ import annotations

import sys
from datetime import datetime, timezone
from pathlib import Path

# Allow running as: python -m app.database.seed from the backend/ directory
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from bson import ObjectId

from app.core.security import hash_password
from app.database.mongodb import connect_to_mongo, get_database
from app.database.indexes import create_indexes


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def seed() -> None:
    db = get_database()

    # ── Clear existing demo data ──────────────────────────────────────────────
    for col in ["users", "products", "inspections", "declarations",
                "compliance_checks", "violations", "evidence", "reports", "ocr_results"]:
        db[col].drop()

    create_indexes()

    # ── Users ─────────────────────────────────────────────────────────────────
    admin_id = ObjectId()
    inspector_id = ObjectId()
    reviewer_id = ObjectId()

    db["users"].insert_many([
        {
            "_id": admin_id,
            "name": "Admin User",
            "email": "admin@packsure.gov.in",
            "password_hash": hash_password("Admin@123"),
            "role": "ADMIN",
            "is_active": True,
            "created_at": utcnow(),
            "updated_at": utcnow(),
        },
        {
            "_id": inspector_id,
            "name": "Priya Sharma",
            "email": "priya.sharma@packsure.gov.in",
            "password_hash": hash_password("Inspector@123"),
            "role": "INSPECTOR",
            "is_active": True,
            "created_at": utcnow(),
            "updated_at": utcnow(),
        },
        {
            "_id": reviewer_id,
            "name": "Rajesh Kumar",
            "email": "rajesh.kumar@packsure.gov.in",
            "password_hash": hash_password("Reviewer@123"),
            "role": "REVIEWER",
            "is_active": True,
            "created_at": utcnow(),
            "updated_at": utcnow(),
        },
    ])

    # ── Products ──────────────────────────────────────────────────────────────
    prod1_id = ObjectId()
    prod2_id = ObjectId()
    prod3_id = ObjectId()
    prod4_id = ObjectId()

    db["products"].insert_many([
        {
            "_id": prod1_id,
            "product_name": "Demo Glucose Biscuits",
            "brand": "Demo Parle",
            "category": "Food & Beverages",
            "manufacturer": "Demo Foods Pvt Ltd, Mumbai",
            "packer": "Demo Foods Pvt Ltd",
            "importer": None,
            "barcode": "8901019100030",
            "images": [],
            "created_at": utcnow(),
            "updated_at": utcnow(),
        },
        {
            "_id": prod2_id,
            "product_name": "Demo Masala Snack",
            "brand": "Demo Snacks Co",
            "category": "Food & Beverages",
            "manufacturer": "Demo Snacks Pvt Ltd, Delhi",
            "packer": "Demo Snacks Pvt Ltd",
            "importer": None,
            "barcode": "8902519100025",
            "images": [],
            "created_at": utcnow(),
            "updated_at": utcnow(),
        },
        {
            "_id": prod3_id,
            "product_name": "Demo Pasteurized Butter",
            "brand": "Demo Dairy",
            "category": "Dairy & Refrigerated",
            "manufacturer": "Demo Dairy Cooperative Ltd",
            "packer": "Demo Dairy Cooperative Ltd",
            "importer": None,
            "barcode": "8901063100017",
            "images": [],
            "created_at": utcnow(),
            "updated_at": utcnow(),
        },
        {
            "_id": prod4_id,
            "product_name": "Demo Garam Masala",
            "brand": "Demo Spices",
            "category": "Spices & Condiments",
            "manufacturer": "Demo Spices Ltd, Rajasthan",
            "packer": "Demo Spices Ltd",
            "importer": None,
            "barcode": "8901234567890",
            "images": [],
            "created_at": utcnow(),
            "updated_at": utcnow(),
        },
    ])

    # ── Inspections ───────────────────────────────────────────────────────────
    insp1_id = ObjectId()
    insp2_id = ObjectId()
    insp3_id = ObjectId()

    db["inspections"].insert_many([
        {
            "_id": insp1_id,
            "inspection_number": "PS-2026-000001",
            "product_id": prod1_id,
            "inspector_id": inspector_id,
            "status": "COMPLIANT",
            "compliance_score": 88,
            "ai_confidence": 0.93,
            "remarks": "Demo inspection — all mandatory fields detected.",
            "images": [],
            "created_at": utcnow(),
            "updated_at": utcnow(),
        },
        {
            "_id": insp2_id,
            "inspection_number": "PS-2026-000002",
            "product_id": prod2_id,
            "inspector_id": inspector_id,
            "status": "NEEDS_REVIEW",
            "compliance_score": 65,
            "ai_confidence": 0.78,
            "remarks": "Demo inspection — consumer care not detected.",
            "images": [],
            "created_at": utcnow(),
            "updated_at": utcnow(),
        },
        {
            "_id": insp3_id,
            "inspection_number": "PS-2026-000003",
            "product_id": prod4_id,
            "inspector_id": inspector_id,
            "status": "NON_COMPLIANT",
            "compliance_score": 42,
            "ai_confidence": 0.85,
            "remarks": "Demo inspection — multiple violations detected.",
            "images": [],
            "created_at": utcnow(),
            "updated_at": utcnow(),
        },
    ])

    # ── Declarations ──────────────────────────────────────────────────────────
    db["declarations"].insert_many([
        {"inspection_id": insp1_id, "field_name": "product_name", "field_value": "Demo Glucose Biscuits", "confidence": 0.96, "source": "MOCK_AI", "bounding_box": {"x1": 50, "y1": 20, "x2": 400, "y2": 60}, "created_at": utcnow()},
        {"inspection_id": insp1_id, "field_name": "manufacturer", "field_value": "Demo Foods Pvt Ltd, Mumbai", "confidence": 0.93, "source": "MOCK_AI", "bounding_box": {"x1": 50, "y1": 80, "x2": 400, "y2": 110}, "created_at": utcnow()},
        {"inspection_id": insp1_id, "field_name": "net_quantity", "field_value": "130 g", "confidence": 0.98, "source": "MOCK_AI", "bounding_box": {"x1": 50, "y1": 120, "x2": 200, "y2": 150}, "created_at": utcnow()},
        {"inspection_id": insp1_id, "field_name": "mrp", "field_value": "₹10", "confidence": 0.99, "source": "MOCK_AI", "bounding_box": {"x1": 50, "y1": 160, "x2": 200, "y2": 190}, "created_at": utcnow()},
        {"inspection_id": insp1_id, "field_name": "consumer_care", "field_value": "1800-xxx-xxxx", "confidence": 0.88, "source": "MOCK_AI", "bounding_box": {"x1": 50, "y1": 200, "x2": 300, "y2": 230}, "created_at": utcnow()},
    ])

    # ── Compliance Checks ─────────────────────────────────────────────────────
    db["compliance_checks"].insert_many([
        {"inspection_id": insp1_id, "field_name": "manufacturer", "rule_id": "RULE-DEMO-001", "status": "PASS", "detected_value": "Demo Foods Pvt Ltd, Mumbai", "expected_condition": "Manufacturer information detected", "explanation": "Manufacturer declaration detected by AI engine.", "confidence": 0.93, "requires_manual_review": False, "created_at": utcnow()},
        {"inspection_id": insp1_id, "field_name": "net_quantity", "rule_id": "RULE-DEMO-002", "status": "PASS", "detected_value": "130 g", "expected_condition": "Net quantity detected", "explanation": "Net quantity detected in standard metric unit (g).", "confidence": 0.98, "requires_manual_review": False, "created_at": utcnow()},
        {"inspection_id": insp1_id, "field_name": "mrp", "rule_id": "RULE-DEMO-003", "status": "PASS", "detected_value": "₹10", "expected_condition": "MRP information detected", "explanation": "MRP declaration detected by AI engine.", "confidence": 0.99, "requires_manual_review": False, "created_at": utcnow()},
        {"inspection_id": insp1_id, "field_name": "consumer_care", "rule_id": "RULE-DEMO-004", "status": "PASS", "detected_value": "1800-xxx-xxxx", "expected_condition": "Consumer care information detected", "explanation": "Consumer care helpline detected.", "confidence": 0.88, "requires_manual_review": False, "created_at": utcnow()},
        # Insp2 — consumer_care missing
        {"inspection_id": insp2_id, "field_name": "manufacturer", "rule_id": "RULE-DEMO-001", "status": "PASS", "detected_value": "Demo Snacks Pvt Ltd", "expected_condition": "Manufacturer information detected", "explanation": "Manufacturer detected.", "confidence": 0.90, "requires_manual_review": False, "created_at": utcnow()},
        {"inspection_id": insp2_id, "field_name": "net_quantity", "rule_id": "RULE-DEMO-002", "status": "PASS", "detected_value": "75 g", "expected_condition": "Net quantity detected", "explanation": "Net quantity detected.", "confidence": 0.95, "requires_manual_review": False, "created_at": utcnow()},
        {"inspection_id": insp2_id, "field_name": "mrp", "rule_id": "RULE-DEMO-003", "status": "WARNING", "detected_value": "₹20", "expected_condition": "MRP information detected", "explanation": 'MRP detected but "incl. of all taxes" clause not clearly visible.', "confidence": 0.75, "requires_manual_review": True, "created_at": utcnow()},
        {"inspection_id": insp2_id, "field_name": "consumer_care", "rule_id": "RULE-DEMO-004", "status": "FAIL", "detected_value": None, "expected_condition": "Consumer care information detected", "explanation": "No consumer care contact information detected.", "confidence": 0.80, "requires_manual_review": True, "created_at": utcnow()},
    ])

    # ── Violations ────────────────────────────────────────────────────────────
    v1_id = ObjectId()
    v2_id = ObjectId()
    db["violations"].insert_many([
        {
            "_id": v1_id,
            "inspection_id": insp2_id,
            "rule_id": "RULE-DEMO-004",
            "title": "Consumer care information not detected",
            "description": "No consumer care telephone number or email address was detected on the package label.",
            "severity": "MEDIUM",
            "evidence_id": None,
            "confidence": 0.80,
            "status": "OPEN",
            "created_at": utcnow(),
        },
        {
            "_id": v2_id,
            "inspection_id": insp3_id,
            "rule_id": "RULE-DEMO-002",
            "title": "Net quantity declaration not detected",
            "description": "Net quantity could not be identified on the principal display panel.",
            "severity": "HIGH",
            "evidence_id": None,
            "confidence": 0.82,
            "status": "OPEN",
            "created_at": utcnow(),
        },
    ])

    print("✅ Seed data inserted successfully.")
    print("\nDemo accounts:")
    print("  admin@packsure.gov.in        / Admin@123     (ADMIN)")
    print("  priya.sharma@packsure.gov.in / Inspector@123 (INSPECTOR)")
    print("  rajesh.kumar@packsure.gov.in / Reviewer@123  (REVIEWER)")


if __name__ == "__main__":
    connect_to_mongo()
    seed()
