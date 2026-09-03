"""Inspection management routes."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query
from pymongo.database import Database

from ...core.dependencies import get_current_user, get_db
from ...schemas.inspection import InspectionCreate, InspectionUpdate, inspection_to_out
from ...schemas.product import product_to_out
from ...utils.pagination import paginate

router = APIRouter(prefix="/inspections", tags=["Inspections"])


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _generate_inspection_number(db: Database) -> str:
    count = db["inspections"].count_documents({})
    year = utcnow().year
    return f"PS-{year}-{count + 1:06d}"


def _enrich_inspection(insp: dict, db: Database) -> dict:
    """Add nested product, declarations, checks, violations to an inspection dict."""
    insp_id = insp["_id"]
    insp["_product"] = db["products"].find_one({"_id": insp.get("product_id")})
    if insp["_product"]:
        insp["_product"] = product_to_out(insp["_product"])
    insp["_declarations"] = [
        {**d, "_id": str(d["_id"]), "inspection_id": str(d["inspection_id"])}
        for d in db["declarations"].find({"inspection_id": insp_id})
    ]
    insp["_compliance_checks"] = [
        {**c, "_id": str(c["_id"]), "inspection_id": str(c["inspection_id"])}
        for c in db["compliance_checks"].find({"inspection_id": insp_id})
    ]
    insp["_violations"] = [
        {**v, "_id": str(v["_id"]), "inspection_id": str(v["inspection_id"])}
        for v in db["violations"].find({"inspection_id": insp_id})
    ]
    insp["_evidence"] = []
    report = db["reports"].find_one({"inspection_id": insp_id})
    if report:
        insp["_report"] = {"report_number": report.get("report_number"), "generated_at": report.get("generated_at")}
    else:
        insp["_report"] = None
    return insp


@router.get("")
def list_inspections(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    product_id: Optional[str] = None,
    _: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    query: dict = {}
    if status:
        query["status"] = status.upper()
    if product_id:
        query["product_id"] = ObjectId(product_id)

    result = paginate(db["inspections"], query, page, page_size)
    items = []
    for insp in result["items"]:
        # Lightweight product info only for list view
        product = db["products"].find_one({"_id": insp.get("product_id")})
        insp["_product"] = product_to_out(product) if product else None
        items.append(inspection_to_out(insp, include_nested=True))
    result["items"] = items
    return {"success": True, "data": result}


@router.get("/{inspection_id}")
def get_inspection(
    inspection_id: str,
    _: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    try:
        insp = db["inspections"].find_one({"_id": ObjectId(inspection_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid inspection ID format.")
    if not insp:
        raise HTTPException(status_code=404, detail="Inspection not found.")

    insp = _enrich_inspection(insp, db)
    return {"success": True, "data": inspection_to_out(insp, include_nested=True)}


@router.post("", status_code=201)
def create_inspection(
    body: InspectionCreate,
    current_user: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    try:
        product_oid = ObjectId(body.product_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid product_id.")

    if not db["products"].find_one({"_id": product_oid}):
        raise HTTPException(status_code=404, detail="Product not found.")

    doc = {
        "_id": ObjectId(),
        "inspection_number": _generate_inspection_number(db),
        "product_id": product_oid,
        "inspector_id": current_user["_id"],
        "status": "DRAFT",
        "compliance_score": None,
        "ai_confidence": None,
        "remarks": body.remarks,
        "images": [],
        "created_at": utcnow(),
        "updated_at": utcnow(),
    }
    db["inspections"].insert_one(doc)
    return {"success": True, "data": inspection_to_out(doc), "message": "Inspection created."}


@router.patch("/{inspection_id}")
def update_inspection(
    inspection_id: str,
    body: InspectionUpdate,
    _: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    updates = {k: v for k, v in body.model_dump(exclude_unset=True).items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No updates provided.")
    updates["updated_at"] = utcnow()

    result = db["inspections"].find_one_and_update(
        {"_id": ObjectId(inspection_id)},
        {"$set": updates},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Inspection not found.")
    return {"success": True, "data": inspection_to_out(result)}


@router.delete("/{inspection_id}", status_code=204)
def delete_inspection(
    inspection_id: str,
    current_user: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    if current_user.get("role") not in ("ADMIN",):
        raise HTTPException(status_code=403, detail="Only admins can delete inspections.")
    result = db["inspections"].delete_one({"_id": ObjectId(inspection_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inspection not found.")
