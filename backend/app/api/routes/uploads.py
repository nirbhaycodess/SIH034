"""Image upload route — saves file to disk, optionally attaches to inspection."""
from __future__ import annotations

from pathlib import Path

from bson import ObjectId
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pymongo.database import Database

from ...core.config import settings
from ...core.dependencies import get_current_user, get_db
from ...utils.files import secure_save_path, validate_image_file

router = APIRouter(prefix="/uploads", tags=["Uploads"])


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    inspection_id: str = Form(None),
    current_user: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    """Upload an image. Optionally attach to an inspection."""
    # Validate
    content = await file.read()
    try:
        validate_image_file(
            file.filename,
            content_type=file.content_type,
            size=len(content),
            max_bytes=settings.max_upload_size_bytes,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    # Save to disk
    upload_dir = settings.upload_path
    dest_path = secure_save_path(upload_dir, file.filename)
    dest_path.write_bytes(content)

    img_path_str = str(dest_path)

    # Attach to inspection if provided
    if inspection_id:
        from datetime import datetime, timezone
        try:
            db["inspections"].update_one(
                {"_id": ObjectId(inspection_id)},
                {
                    "$push": {"images": img_path_str},
                    "$set": {"updated_at": datetime.now(timezone.utc)},
                },
            )
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid inspection_id.")

    return {
        "success": True,
        "data": {
            "file_path": img_path_str,
            "file_name": dest_path.name,
            "size_bytes": len(content),
            "inspection_id": inspection_id,
        },
        "message": "Image uploaded successfully.",
    }
