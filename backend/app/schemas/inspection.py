"""Inspection schemas."""
from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel


ALLOWED_STATUSES = {"PROCESSING", "COMPLIANT", "NON_COMPLIANT", "NEEDS_REVIEW", "FAILED"}


class InspectionCreate(BaseModel):
    product_id: str
    remarks: Optional[str] = None


class InspectionUpdate(BaseModel):
    remarks: Optional[str] = None
    status: Optional[str] = None


def inspection_to_out(doc: dict, include_nested: bool = False) -> dict:
    out = {
        "id": str(doc["_id"]),
        "inspection_number": doc.get("inspection_number", ""),
        "product_id": str(doc.get("product_id", "")),
        "inspector_id": str(doc.get("inspector_id", "")),
        "status": doc.get("status", "NEEDS_REVIEW"),
        "compliance_score": doc.get("compliance_score"),
        "ai_confidence": doc.get("ai_confidence"),
        "remarks": doc.get("remarks", ""),
        "images": doc.get("images", []),
        "created_at": doc.get("created_at"),
        "updated_at": doc.get("updated_at"),
    }
    if include_nested:
        out["product"] = doc.get("_product")
        out["declarations"] = doc.get("_declarations", [])
        out["ocr_result"] = doc.get("_ocr_result")
        out["compliance_checks"] = doc.get("_compliance_checks", [])
        out["violations"] = doc.get("_violations", [])
        out["evidence"] = doc.get("_evidence", [])
        out["report"] = doc.get("_report")
    return out
