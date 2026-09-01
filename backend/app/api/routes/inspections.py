from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from ...schemas.inspection import AnalysisResponse, Inspection, InspectionCreate
from ...services.mock_data import inspections

router = APIRouter()


@router.get("", response_model=list[Inspection])
async def list_inspections() -> list[Inspection]:
    return inspections


@router.post("", response_model=Inspection, status_code=status.HTTP_201_CREATED)
async def create_inspection(payload: InspectionCreate) -> Inspection:
    inspection = Inspection(id=f"INS-2026-{len(inspections) + 483:05d}", product=payload.product, manufacturer=payload.manufacturer, date=datetime.now().strftime("%d %b %Y"), score=0, status="DRAFT", inspector="Priya Sharma", category=payload.category)
    inspections.insert(0, inspection)
    return inspection


@router.get("/{inspection_id}", response_model=Inspection)
async def get_inspection(inspection_id: str) -> Inspection:
    inspection = next((item for item in inspections if item.id == inspection_id), None)
    if inspection is None:
        raise HTTPException(status_code=404, detail="Inspection not found")
    return inspection


@router.post("/{inspection_id}/analyze", response_model=AnalysisResponse)
async def analyze_inspection(inspection_id: str) -> AnalysisResponse:
    inspection = await get_inspection(inspection_id)
    return AnalysisResponse(inspection=inspection, analyzed_at=datetime.now(timezone.utc))
