from fastapi import APIRouter, File, HTTPException, UploadFile, status

from ...schemas.analysis import ImageAnalysisResponse
from ...services.analysis import ImageAnalysisService

router = APIRouter()
analysis_service = ImageAnalysisService()


@router.post("/images", response_model=ImageAnalysisResponse)
@router.post("/images/analyze", response_model=ImageAnalysisResponse, include_in_schema=False)
async def analyze_image(file: UploadFile = File(...)) -> ImageAnalysisResponse:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="Please upload an image.")
    result = analysis_service.analyze(await file.read())
    return ImageAnalysisResponse(
        filename=file.filename or "upload",
        fields=result.fields,
        ocr_status=result.status,
        ocr_error=result.error,
    )
