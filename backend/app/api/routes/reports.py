"""Reports routes — generate and download PDF reports."""
from __future__ import annotations

from pathlib import Path

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from pymongo.database import Database

from ...core.dependencies import get_current_user, get_db
from ...services.report_service import generate_pdf_report
from ...utils.pagination import paginate

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("")
def list_reports(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    _: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    result = paginate(db["reports"], {}, page, page_size, "generated_at", -1)
    items = []
    for r in result["items"]:
        items.append({
            "id": str(r["_id"]),
            "report_number": r.get("report_number"),
            "inspection_id": str(r.get("inspection_id", "")),
            "generated_at": r.get("generated_at"),
        })
    result["items"] = items
    return {"success": True, "data": result}


@router.post("/generate/{inspection_id}")
def generate_report(
    inspection_id: str,
    _: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    """Generate a PDF report for an inspection."""
    try:
        result = generate_pdf_report(inspection_id, db)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Report generation failed: {exc}")

    return {
        "success": True,
        "data": {
            "report_number": result["report_number"],
            "download_url": f"/api/v1/reports/download/{inspection_id}",
            "inspection_id": inspection_id,
        },
        "message": "Report generated successfully.",
    }


@router.get("/download/{inspection_id}")
def download_report(
    inspection_id: str,
    _: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    """Download the PDF report for an inspection."""
    report = db["reports"].find_one({"inspection_id": ObjectId(inspection_id)})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found. Generate it first.")

    file_path = Path(report.get("file_path", ""))
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Report file missing. Please regenerate.")

    return FileResponse(
        path=str(file_path),
        media_type="application/pdf",
        filename=file_path.name,
        headers={"Content-Disposition": f'attachment; filename="{file_path.name}"'},
    )
