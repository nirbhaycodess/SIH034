"""Main API router — mounts all sub-routers."""
from __future__ import annotations

from fastapi import APIRouter

from .routes.health import router as health_router
from .routes.auth import router as auth_router
from .routes.users import router as users_router
from .routes.products import router as products_router
from .routes.inspections import router as inspections_router
from .routes.uploads import router as uploads_router
from .routes.analysis import router as analysis_router
from .routes.reports import router as reports_router
from .routes.analytics import router as analytics_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(products_router)
api_router.include_router(inspections_router)
api_router.include_router(uploads_router)
api_router.include_router(analysis_router)
api_router.include_router(reports_router)
api_router.include_router(analytics_router)
