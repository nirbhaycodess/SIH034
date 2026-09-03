"""File utility helpers — safe names, UUID filenames, path traversal protection."""
from __future__ import annotations

import mimetypes
import re
import uuid
from pathlib import Path
from typing import Optional

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def safe_filename(original: str) -> str:
    """Return a UUID-based filename preserving the original extension."""
    ext = Path(original).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        ext = ".jpg"
    return f"{uuid.uuid4().hex}{ext}"


def validate_image_file(filename: str, content_type: Optional[str] = None, size: int = 0, max_bytes: int = 10 * 1024 * 1024) -> None:
    """Raise ValueError if file is not a valid image."""
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"File extension '{ext}' is not allowed. Use JPG, PNG, or WEBP.")

    if content_type and content_type.split(";")[0].strip() not in ALLOWED_MIME_TYPES:
        raise ValueError(f"Content-Type '{content_type}' is not an allowed image type.")

    if size > max_bytes:
        raise ValueError(f"File size {size / 1024 / 1024:.1f} MB exceeds maximum {max_bytes / 1024 / 1024:.0f} MB.")


def secure_save_path(upload_dir: Path, filename: str) -> Path:
    """Return an absolute save path, preventing path traversal."""
    safe = Path(safe_filename(filename))
    dest = (upload_dir / safe).resolve()
    if not str(dest).startswith(str(upload_dir.resolve())):
        raise ValueError("Path traversal attempt detected.")
    return dest
