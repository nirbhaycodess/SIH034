"""User management routes."""
from __future__ import annotations

from typing import Optional

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query
from pymongo.database import Database

from ...core.dependencies import get_current_user, get_db, require_role
from ...schemas.user import UserUpdate, user_to_out
from ...utils.pagination import paginate

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("")
def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    role: Optional[str] = None,
    _: dict = Depends(require_role("ADMIN")),
    db: Database = Depends(get_db),
):
    query = {}
    if role:
        query["role"] = role
    result = paginate(db["users"], query, page, page_size, "created_at", -1)
    result["items"] = [user_to_out(u) for u in result["items"]]
    return {"success": True, "data": result}


@router.get("/{user_id}")
def get_user(
    user_id: str,
    current_user: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    # Users can view their own profile; admins can view any
    if str(current_user["_id"]) != user_id and current_user.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="Access denied.")
    user = db["users"].find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"success": True, "data": user_to_out(user)}


@router.patch("/{user_id}")
def update_user(
    user_id: str,
    body: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    from datetime import datetime, timezone
    if str(current_user["_id"]) != user_id and current_user.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="Access denied.")

    updates = {k: v for k, v in body.model_dump(exclude_unset=True).items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No updates provided.")
    updates["updated_at"] = datetime.now(timezone.utc)

    result = db["users"].find_one_and_update(
        {"_id": ObjectId(user_id)},
        {"$set": updates},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"success": True, "data": user_to_out(result)}
