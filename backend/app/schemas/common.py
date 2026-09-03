"""Common schema helpers."""
from __future__ import annotations

from datetime import datetime
from typing import Any, List, Optional


def doc_to_dict(doc: dict) -> dict:
    """Convert MongoDB _id ObjectId to string 'id'."""
    if doc is None:
        return {}
    result = {k: v for k, v in doc.items() if k != "_id"}
    result["id"] = str(doc["_id"])
    # Convert any nested ObjectIds
    for k, v in result.items():
        if hasattr(v, "generation_time"):  # ObjectId check
            result[k] = str(v)
    return result
