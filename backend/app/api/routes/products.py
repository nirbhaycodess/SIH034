"""Product repository routes."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query
from pymongo.database import Database

from ...core.dependencies import get_current_user, get_db
from ...schemas.product import ProductCreate, ProductUpdate, product_to_out
from ...utils.pagination import paginate

router = APIRouter(prefix="/products", tags=["Products"])


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


@router.get("")
def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    category: Optional[str] = None,
    _: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    query: dict = {}
    if search:
        query["$text"] = {"$search": search}
    if category:
        query["category"] = {"$regex": category, "$options": "i"}

    result = paginate(db["products"], query, page, page_size)
    result["items"] = [product_to_out(p) for p in result["items"]]
    return {"success": True, "data": result}


@router.get("/{product_id}")
def get_product(
    product_id: str,
    _: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    product = db["products"].find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    return {"success": True, "data": product_to_out(product)}


@router.post("", status_code=201)
def create_product(
    body: ProductCreate,
    current_user: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    doc = {
        "_id": ObjectId(),
        **body.model_dump(),
        "images": [],
        "created_by": current_user["_id"],
        "created_at": utcnow(),
        "updated_at": utcnow(),
    }
    db["products"].insert_one(doc)
    return {"success": True, "data": product_to_out(doc), "message": "Product created."}


@router.patch("/{product_id}")
def update_product(
    product_id: str,
    body: ProductUpdate,
    _: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    updates = {k: v for k, v in body.model_dump(exclude_unset=True).items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No updates provided.")
    updates["updated_at"] = utcnow()

    result = db["products"].find_one_and_update(
        {"_id": ObjectId(product_id)},
        {"$set": updates},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Product not found.")
    return {"success": True, "data": product_to_out(result)}


@router.delete("/{product_id}", status_code=204)
def delete_product(
    product_id: str,
    current_user: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    if current_user.get("role") not in ("ADMIN",):
        raise HTTPException(status_code=403, detail="Only admins can delete products.")
    result = db["products"].delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found.")
