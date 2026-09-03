"""Product schemas."""
from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel


class ProductCreate(BaseModel):
    product_name: str
    brand: str
    category: str
    manufacturer: str
    packer: Optional[str] = None
    importer: Optional[str] = None
    barcode: Optional[str] = None


class ProductUpdate(BaseModel):
    product_name: Optional[str] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    manufacturer: Optional[str] = None
    packer: Optional[str] = None
    importer: Optional[str] = None
    barcode: Optional[str] = None


def product_to_out(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "product_name": doc.get("product_name", ""),
        "brand": doc.get("brand", ""),
        "category": doc.get("category", ""),
        "manufacturer": doc.get("manufacturer", ""),
        "packer": doc.get("packer"),
        "importer": doc.get("importer"),
        "barcode": doc.get("barcode"),
        "images": doc.get("images", []),
        "created_at": doc.get("created_at"),
        "updated_at": doc.get("updated_at"),
    }
