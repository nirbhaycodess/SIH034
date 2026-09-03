"""Health check endpoint."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from pymongo.database import Database

from ...core.dependencies import get_db
from ...core.config import settings

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", summary="Health check")
def health_check(db: Database = Depends(get_db)):
    """Check API and database connectivity."""
    try:
        db.command("ping")
        db_status = "connected"
    except Exception:
        db_status = "disconnected"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
        "version": settings.app_version,
        "environment": settings.environment,
        "ai_provider": settings.ai_provider,
    }
