"""Image upload route — saves to Cloudinary, attaches URL to inspection."""
from __future__ import annotations

import logging
import tempfile
from pathlib import Path
from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from pymongo.database import Database

from ...core.config import settings
from ...core.dependencies import get_current_user, get_db
from ...services.cloudinary_service import (
    upload_label_image,
    upload_evidence_image,
    upload_avatar,
    delete_image,
    test_connection,
)

logger = logging.getLogger("packsure.api.uploads")
router = APIRouter(prefix="/uploads", tags=["Uploads"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}


def _validate(file: UploadFile, content: bytes) -> None:
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, f"Unsupported type: {file.content_type}. Use JPEG, PNG, or WebP.")
    if len(content) > settings.max_upload_size_bytes:
        raise HTTPException(413, f"File too large (max {settings.max_upload_size_mb} MB).")


async def _temp_save(file: UploadFile, content: bytes) -> Path:
    suffix = Path(file.filename or "upload.jpg").suffix or ".jpg"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(content)
        return Path(tmp.name)


# ── Cloudinary connection health check ────────────────────────────────────────
@router.get("/ping", summary="Ping Cloudinary")
async def cloudinary_ping():
    ok = test_connection()
    if ok:
        return {"status": "ok", "provider": "Cloudinary", "cloud": settings.cloudinary_cloud_name}
    raise HTTPException(503, "Cloudinary unreachable. Check CLOUDINARY_* env vars.")


# ── Main label image upload ────────────────────────────────────────────────────
@router.post("/image", summary="Upload label image → Cloudinary")
async def upload_image(
    file: UploadFile = File(...),
    inspection_id: str = Form(None),
    current_user: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    """
    Upload a product label image.
    - Stores on Cloudinary (not local disk).
    - Attaches the Cloudinary URL to the inspection record if inspection_id is provided.
    """
    content = await file.read()
    _validate(file, content)
    tmp = await _temp_save(file, content)

    try:
        insp_id = inspection_id or "unlinked"
        result = upload_label_image(tmp, insp_id)

        # Attach Cloudinary URL to inspection
        if inspection_id:
            try:
                db["inspections"].update_one(
                    {"_id": ObjectId(inspection_id)},
                    {
                        "$push": {
                            "images": result["url"],
                            "image_public_ids": result["public_id"],
                        },
                        "$set": {"updated_at": datetime.now(timezone.utc)},
                    },
                )
            except Exception:
                raise HTTPException(400, "Invalid inspection_id.")

        return {
            "success": True,
            "data": {
                "image_url": result["url"],
                "public_id": result["public_id"],
                "width": result["width"],
                "height": result["height"],
                "format": result["format"],
                "size_bytes": result["bytes"],
                "inspection_id": inspection_id,
                "provider": "cloudinary",
            },
            "message": "Image uploaded to Cloudinary successfully.",
        }
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Cloudinary label upload error: %s", exc)
        raise HTTPException(500, f"Upload failed: {str(exc)}")
    finally:
        tmp.unlink(missing_ok=True)


# ── Evidence image upload ─────────────────────────────────────────────────────
@router.post("/evidence/{violation_id}", summary="Upload evidence image for a violation")
async def upload_evidence(
    violation_id: str,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    content = await file.read()
    _validate(file, content)
    tmp = await _temp_save(file, content)

    try:
        result = upload_evidence_image(tmp, violation_id)
        db["violations"].update_one(
            {"_id": violation_id},
            {"$set": {
                "evidence_image_url": result["url"],
                "evidence_public_id": result["public_id"],
                "updated_at": datetime.now(timezone.utc),
            }}
        )
        return {"success": True, "data": result, "message": "Evidence uploaded."}
    except Exception as exc:
        raise HTTPException(500, f"Upload failed: {str(exc)}")
    finally:
        tmp.unlink(missing_ok=True)


# ── Avatar upload ─────────────────────────────────────────────────────────────
@router.post("/avatar", summary="Upload user profile avatar")
async def upload_user_avatar(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    content = await file.read()
    _validate(file, content)
    tmp = await _temp_save(file, content)

    user_id = str(current_user.get("_id", "unknown"))
    try:
        result = upload_avatar(tmp, user_id)
        db["users"].update_one(
            {"_id": current_user["_id"]},
            {"$set": {"avatar_url": result["url"], "updated_at": datetime.now(timezone.utc)}}
        )
        return {"success": True, "data": {"avatar_url": result["url"]}, "message": "Avatar uploaded."}
    except Exception as exc:
        raise HTTPException(500, f"Upload failed: {str(exc)}")
    finally:
        tmp.unlink(missing_ok=True)


# ── Delete asset ──────────────────────────────────────────────────────────────
@router.delete("/{public_id:path}", summary="Delete Cloudinary asset")
async def delete_asset(
    public_id: str,
    resource_type: str = "image",
    current_user: dict = Depends(get_current_user),
):
    deleted = delete_image(public_id, resource_type=resource_type)
    if deleted:
        return {"success": True, "deleted": public_id}
    raise HTTPException(404, f"Asset not found: {public_id}")
