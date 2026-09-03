"""Analytics routes — MongoDB aggregation pipelines for dashboards."""
from __future__ import annotations

from datetime import datetime, timezone, timedelta

from bson import ObjectId
from fastapi import APIRouter, Depends, Query
from pymongo.database import Database

from ...core.dependencies import get_current_user, get_db

router = APIRouter(prefix="/analytics", tags=["Analytics"])


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


@router.get("/dashboard")
def dashboard_summary(
    _: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    """High-level dashboard KPIs."""
    total_inspections = db["inspections"].count_documents({})
    compliant = db["inspections"].count_documents({"status": "COMPLIANT"})
    non_compliant = db["inspections"].count_documents({"status": "NON_COMPLIANT"})
    needs_review = db["inspections"].count_documents({"status": "NEEDS_REVIEW"})
    total_violations = db["violations"].count_documents({})
    open_violations = db["violations"].count_documents({"status": "OPEN"})
    total_products = db["products"].count_documents({})

    # Average compliance score
    pipeline = [
        {"$match": {"compliance_score": {"$ne": None}}},
        {"$group": {"_id": None, "avg_score": {"$avg": "$compliance_score"}}},
    ]
    avg_result = list(db["inspections"].aggregate(pipeline))
    avg_score = round(avg_result[0]["avg_score"], 1) if avg_result else 0.0

    # Compliance rate
    compliance_rate = round((compliant / total_inspections) * 100, 1) if total_inspections > 0 else 0.0

    return {
        "success": True,
        "data": {
            "total_inspections": total_inspections,
            "compliant": compliant,
            "non_compliant": non_compliant,
            "needs_review": needs_review,
            "total_violations": total_violations,
            "open_violations": open_violations,
            "total_products": total_products,
            "avg_compliance_score": avg_score,
            "compliance_rate": compliance_rate,
        },
    }


@router.get("/inspections/by-status")
def inspections_by_status(
    _: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    """Inspection count grouped by status."""
    pipeline = [
        {"$group": {"_id": "$status", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    result = list(db["inspections"].aggregate(pipeline))
    return {
        "success": True,
        "data": [{"status": r["_id"] or "UNKNOWN", "count": r["count"]} for r in result],
    }


@router.get("/inspections/by-category")
def inspections_by_category(
    _: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    """Inspection count grouped by product category (via join)."""
    pipeline = [
        {"$lookup": {
            "from": "products",
            "localField": "product_id",
            "foreignField": "_id",
            "as": "product",
        }},
        {"$unwind": {"path": "$product", "preserveNullAndEmptyArrays": True}},
        {"$group": {"_id": "$product.category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10},
    ]
    result = list(db["inspections"].aggregate(pipeline))
    return {
        "success": True,
        "data": [{"category": r["_id"] or "Uncategorized", "count": r["count"]} for r in result],
    }


@router.get("/inspections/trend")
def inspections_trend(
    days: int = Query(30, ge=1, le=365),
    _: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    """Daily inspection count trend for the last N days."""
    since = utcnow() - timedelta(days=days)
    pipeline = [
        {"$match": {"created_at": {"$gte": since}}},
        {"$group": {
            "_id": {
                "year": {"$year": "$created_at"},
                "month": {"$month": "$created_at"},
                "day": {"$dayOfMonth": "$created_at"},
            },
            "count": {"$sum": 1},
            "compliant": {"$sum": {"$cond": [{"$eq": ["$status", "COMPLIANT"]}, 1, 0]}},
            "non_compliant": {"$sum": {"$cond": [{"$eq": ["$status", "NON_COMPLIANT"]}, 1, 0]}},
        }},
        {"$sort": {"_id.year": 1, "_id.month": 1, "_id.day": 1}},
    ]
    result = list(db["inspections"].aggregate(pipeline))
    return {
        "success": True,
        "data": [
            {
                "date": f"{r['_id']['year']}-{r['_id']['month']:02d}-{r['_id']['day']:02d}",
                "total": r["count"],
                "compliant": r["compliant"],
                "non_compliant": r["non_compliant"],
            }
            for r in result
        ],
    }


@router.get("/violations/by-severity")
def violations_by_severity(
    _: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    """Violation count by severity."""
    pipeline = [
        {"$group": {"_id": "$severity", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    result = list(db["violations"].aggregate(pipeline))
    return {
        "success": True,
        "data": [{"severity": r["_id"] or "UNKNOWN", "count": r["count"]} for r in result],
    }


@router.get("/violations/by-rule")
def violations_by_rule(
    limit: int = Query(10, ge=1, le=50),
    _: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    """Most frequently violated rules."""
    pipeline = [
        {"$group": {"_id": "$rule_id", "count": {"$sum": 1}, "title": {"$first": "$title"}}},
        {"$sort": {"count": -1}},
        {"$limit": limit},
    ]
    result = list(db["violations"].aggregate(pipeline))
    return {
        "success": True,
        "data": [{"rule_id": r["_id"], "title": r["title"], "count": r["count"]} for r in result],
    }


@router.get("/compliance/score-distribution")
def score_distribution(
    _: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    """Histogram of compliance scores in bands of 10."""
    pipeline = [
        {"$match": {"compliance_score": {"$ne": None}}},
        {"$bucket": {
            "groupBy": "$compliance_score",
            "boundaries": [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            "default": "Other",
            "output": {"count": {"$sum": 1}},
        }},
    ]
    result = list(db["inspections"].aggregate(pipeline))
    return {
        "success": True,
        "data": [{"range": f"{r['_id']}-{r['_id'] + 9}", "count": r["count"]} for r in result if r["_id"] != "Other"],
    }
