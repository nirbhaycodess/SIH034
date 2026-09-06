"""Create all MongoDB indexes for PackSure AI."""
from __future__ import annotations

import logging

from pymongo import ASCENDING, DESCENDING, IndexModel, TEXT

from .mongodb import get_database

logger = logging.getLogger("packsure.indexes")


def create_indexes() -> None:
    db = get_database()

    # ── users ────────────────────────────────────────────────────────────────
    db["users"].create_indexes([
        IndexModel([("email", ASCENDING)], unique=True, name="users_email_unique"),
        IndexModel([("role", ASCENDING)], name="users_role"),
    ])

    # ── products ─────────────────────────────────────────────────────────────
    db["products"].create_indexes([
        IndexModel([("product_name", TEXT), ("brand", TEXT), ("manufacturer", TEXT)], name="products_text"),
        IndexModel([("brand", ASCENDING)], name="products_brand"),
        IndexModel([("manufacturer", ASCENDING)], name="products_manufacturer"),
        IndexModel([("barcode", ASCENDING)], sparse=True, name="products_barcode"),
        IndexModel([("category", ASCENDING)], name="products_category"),
        IndexModel([("created_at", DESCENDING)], name="products_created_at"),
    ])

    # ── inspections ───────────────────────────────────────────────────────────
    db["inspections"].create_indexes([
        IndexModel([("inspection_number", ASCENDING)], unique=True, name="inspections_number_unique"),
        IndexModel([("product_id", ASCENDING)], name="inspections_product_id"),
        IndexModel([("inspector_id", ASCENDING)], name="inspections_inspector_id"),
        IndexModel([("status", ASCENDING)], name="inspections_status"),
        IndexModel([("created_at", DESCENDING)], name="inspections_created_at"),
        IndexModel([("status", ASCENDING), ("created_at", DESCENDING)], name="inspections_status_date"),
    ])

    # ── declarations ──────────────────────────────────────────────────────────
    db["declarations"].create_indexes([
        IndexModel([("inspection_id", ASCENDING)], name="declarations_inspection_id"),
        IndexModel([("inspection_id", ASCENDING), ("field_name", ASCENDING)], name="declarations_compound"),
    ])

    # ── compliance_checks ─────────────────────────────────────────────────────
    db["compliance_checks"].create_indexes([
        IndexModel([("inspection_id", ASCENDING)], name="compliance_inspection_id"),
        IndexModel([("inspection_id", ASCENDING), ("status", ASCENDING)], name="compliance_compound"),
    ])

    # ── violations ────────────────────────────────────────────────────────────
    db["violations"].create_indexes([
        IndexModel([("inspection_id", ASCENDING)], name="violations_inspection_id"),
        IndexModel([("severity", ASCENDING)], name="violations_severity"),
        IndexModel([("status", ASCENDING)], name="violations_status"),
    ])

    # ── evidence ──────────────────────────────────────────────────────────────
    db["evidence"].create_indexes([
        IndexModel([("inspection_id", ASCENDING)], name="evidence_inspection_id"),
    ])

    # ── reports ───────────────────────────────────────────────────────────────
    db["reports"].create_indexes([
        IndexModel([("inspection_id", ASCENDING)], name="reports_inspection_id"),
        IndexModel([("report_number", ASCENDING)], unique=True, name="reports_number_unique"),
    ])

    # ── ocr_results ───────────────────────────────────────────────────────────
    db["ocr_results"].create_indexes([
        IndexModel([("inspection_id", ASCENDING)], name="ocr_inspection_id"),
        IndexModel([("analysis_id", ASCENDING)], name="ocr_analysis_id"),
    ])

    # ── audit_logs ────────────────────────────────────────────────────────────
    db["audit_logs"].create_indexes([
        IndexModel([("user_id", ASCENDING)], name="audit_user_id"),
        IndexModel([("timestamp", DESCENDING)], name="audit_timestamp"),
        IndexModel([("action", ASCENDING)], name="audit_action"),
        IndexModel([("resource_type", ASCENDING), ("resource_id", ASCENDING)], name="audit_resource"),
    ])

    logger.info("All MongoDB indexes created successfully.")


if __name__ == "__main__":
    import sys
    sys.path.insert(0, ".")
    from app.database.mongodb import connect_to_mongo
    connect_to_mongo()
    create_indexes()
    print("Indexes created.")
