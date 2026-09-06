"""Cloudinary service — upload, delete, and generate URLs for label images."""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional

import cloudinary
import cloudinary.uploader
import cloudinary.api

from ..core.config import settings

logger = logging.getLogger("packsure.cloudinary")

# ── Configure Cloudinary once at import time ──────────────────────────────────
cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret,
    secure=True,
)

# Folder structure on Cloudinary
FOLDERS = {
    "label":     "packsure/labels",       # product label photos
    "evidence":  "packsure/evidence",     # violation evidence images
    "report":    "packsure/reports",      # generated PDF reports
    "avatar":    "packsure/avatars",      # user profile pictures
}


def upload_label_image(
    file_path: str | Path,
    inspection_id: str,
    *,
    eager_transforms: bool = True,
) -> dict:
    """
    Upload a product label image to Cloudinary.

    Returns:
        dict with keys: url, secure_url, public_id, width, height, format
    """
    folder = FOLDERS["label"]
    public_id = f"{folder}/insp_{inspection_id}"

    options: dict = {
        "folder": folder,
        "public_id": f"insp_{inspection_id}",
        "overwrite": True,
        "resource_type": "image",
        "use_filename": False,
        "unique_filename": False,
        "tags": ["label", "inspection", inspection_id],
        "transformation": [
            # Auto quality + format (WebP where supported)
            {"quality": "auto", "fetch_format": "auto"},
        ],
    }

    if eager_transforms:
        # Pre-generate a 800px-wide thumbnail used in the AI Evidence View
        options["eager"] = [
            {"width": 800, "crop": "limit", "quality": "auto", "fetch_format": "auto"},
            {"width": 400, "crop": "limit", "quality": "auto", "fetch_format": "auto"},
        ]

    result = cloudinary.uploader.upload(str(file_path), **options)
    logger.info("Uploaded label image: public_id=%s  url=%s", result["public_id"], result["secure_url"])
    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
        "width": result.get("width"),
        "height": result.get("height"),
        "format": result.get("format"),
        "bytes": result.get("bytes"),
    }


def upload_evidence_image(
    file_path: str | Path,
    violation_id: str,
) -> dict:
    """Upload a violation evidence image."""
    folder = FOLDERS["evidence"]
    result = cloudinary.uploader.upload(
        str(file_path),
        folder=folder,
        public_id=f"viol_{violation_id}",
        overwrite=True,
        resource_type="image",
        tags=["evidence", "violation", violation_id],
        transformation=[{"quality": "auto", "fetch_format": "auto"}],
    )
    logger.info("Uploaded evidence image: public_id=%s", result["public_id"])
    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
    }


def upload_report_pdf(
    file_path: str | Path,
    report_id: str,
) -> dict:
    """Upload a generated PDF report to Cloudinary."""
    folder = FOLDERS["report"]
    result = cloudinary.uploader.upload(
        str(file_path),
        folder=folder,
        public_id=f"report_{report_id}",
        overwrite=True,
        resource_type="raw",         # PDFs use resource_type=raw
        tags=["report", report_id],
    )
    logger.info("Uploaded PDF report: public_id=%s", result["public_id"])
    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
    }


def upload_avatar(
    file_path: str | Path,
    user_id: str,
) -> dict:
    """Upload a user avatar image."""
    folder = FOLDERS["avatar"]
    result = cloudinary.uploader.upload(
        str(file_path),
        folder=folder,
        public_id=f"user_{user_id}",
        overwrite=True,
        resource_type="image",
        transformation=[
            {"width": 200, "height": 200, "crop": "fill", "gravity": "face",
             "quality": "auto", "fetch_format": "auto"},
        ],
    )
    logger.info("Uploaded avatar: public_id=%s", result["public_id"])
    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
    }


def delete_image(public_id: str, resource_type: str = "image") -> bool:
    """Delete an asset from Cloudinary by public_id."""
    try:
        result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
        deleted = result.get("result") == "ok"
        logger.info("Deleted Cloudinary asset: %s  result=%s", public_id, result)
        return deleted
    except Exception as exc:
        logger.error("Failed to delete Cloudinary asset %s: %s", public_id, exc)
        return False


def get_optimized_url(
    public_id: str,
    *,
    width: Optional[int] = None,
    height: Optional[int] = None,
    quality: str = "auto",
    format: str = "auto",
) -> str:
    """
    Generate an optimised Cloudinary URL for an existing asset.
    Useful for generating thumbnails on-the-fly.
    """
    transforms: list[dict] = [{"quality": quality, "fetch_format": format}]
    if width:
        transforms[0]["width"] = width
    if height:
        transforms[0]["height"] = height
    if width or height:
        transforms[0]["crop"] = "limit"

    return cloudinary.CloudinaryImage(public_id).build_url(transformation=transforms)


def test_connection() -> bool:
    """Ping Cloudinary to verify credentials are correct."""
    try:
        result = cloudinary.api.ping()
        logger.info("✅ Cloudinary ping OK: %s", result)
        return True
    except Exception as exc:
        logger.error("❌ Cloudinary connection failed: %s", exc)
        return False

