from fastapi import APIRouter
from .routes import auth, compliance, inspections, uploads

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(inspections.router, prefix="/inspections", tags=["Inspections"])
api_router.include_router(uploads.router, prefix="/uploads", tags=["Uploads"])
api_router.include_router(compliance.router, prefix="/compliance", tags=["Compliance"])
