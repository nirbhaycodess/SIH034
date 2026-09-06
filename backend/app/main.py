"""
PackSure AI — FastAPI Application Entry Point
Smart India Hackathon 2026 | Problem Statement SIH26034
"""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from .api.router import api_router
from .core.config import settings
from .core.logging import setup_logging
from .database.mongodb import close_mongo_connection, connect_to_mongo
from .database.indexes import create_indexes

# ── Logging ───────────────────────────────────────────────────────────────────
setup_logging()
logger = logging.getLogger("packsure")


# ── Lifespan ──────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info("🚀 PackSure AI starting up…")
    try:
        connect_to_mongo()
        logger.info("✅ MongoDB connected.")
        create_indexes()
        logger.info("✅ MongoDB indexes ensured.")

        # Test Cloudinary connection
        from .services.cloudinary_service import test_connection as cloudinary_ping
        if cloudinary_ping():
            logger.info("✅ Cloudinary connected — cloud: %s", settings.cloudinary_cloud_name)
        else:
            logger.warning("⚠️  Cloudinary connection failed — check CLOUDINARY_* env vars.")

        # Ensure upload/report directories exist
        settings.upload_path.mkdir(parents=True, exist_ok=True)
        settings.report_path.mkdir(parents=True, exist_ok=True)

        logger.info("✅ PackSure AI ready — environment=%s, ai_provider=%s",
                    settings.environment, settings.ai_provider)
    except Exception as exc:
        logger.error("❌ Startup failed: %s", exc)
        # Don't exit — let health endpoint report degraded state

    yield

    logger.info("🛑 PackSure AI shutting down…")
    close_mongo_connection()
    logger.info("✅ MongoDB disconnected.")


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "PackSure AI — AI-assisted compliance checking for packaged commodities. "
        "Smart India Hackathon 2026 | SIH26034."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(api_router, prefix=settings.api_prefix)

# ── Serve uploaded images ─────────────────────────────────────────────────────
import os
_upload_dir = os.path.abspath(settings.upload_dir)
os.makedirs(_upload_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=_upload_dir), name="uploads")

# ── Global error handlers ─────────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error("Unhandled exception at %s: %s", request.url.path, exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": {"code": "INTERNAL_ERROR", "message": "An internal server error occurred."}},
    )


@app.get("/", include_in_schema=False)
def root():
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "health": f"{settings.api_prefix}/health",
    }
