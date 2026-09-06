"""Analysis routes — trigger AI pipeline and return compliance results."""
from __future__ import annotations

from uuid import uuid4

from bson import ObjectId
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pymongo.database import Database

from ...core.config import settings
from ...core.dependencies import get_current_user, get_db
from ...services.ai_service import run_analysis_pipeline
from ...services.cloudinary_service import upload_label_image
from ...utils.files import secure_save_path, validate_image_file

router = APIRouter(prefix="/analysis", tags=["Analysis"])


@router.post("/analyze")
async def analyze_inspection(
    inspection_id: str = Form(...),
    file: UploadFile = File(None),
    current_user: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    """
    Trigger AI analysis pipeline for an existing inspection.
    Optionally upload an image in the same request.
    """
    # Validate inspection exists
    try:
        insp = db["inspections"].find_one({"_id": ObjectId(inspection_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid inspection_id.")
    if not insp:
        raise HTTPException(status_code=404, detail="Inspection not found.")

    # If image provided, save it and attach to inspection
    if file and file.filename:
        from datetime import datetime, timezone
        content = await file.read()
        try:
            validate_image_file(file.filename, content_type=file.content_type, size=len(content),
                                max_bytes=settings.max_upload_size_bytes)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))

        dest_path = secure_save_path(settings.upload_path, file.filename)
        dest_path.write_bytes(content)
        try:
            cloudinary_result = upload_label_image(dest_path, inspection_id)
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"Cloudinary upload failed: {exc}")

        db["inspections"].update_one(
            {"_id": ObjectId(inspection_id)},
            {"$push": {
                "images": cloudinary_result["url"],
                "image_public_ids": cloudinary_result["public_id"],
            },
             "$set": {"updated_at": datetime.now(timezone.utc)}},
        )

    # Run pipeline
    try:
        result = await run_analysis_pipeline(inspection_id, db)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Analysis pipeline failed: {exc}")

    return {"success": True, "data": result, "message": "Analysis complete."}


@router.post("/quick-analyze")
async def quick_analyze(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: Database = Depends(get_db),
):
    """
    Quick analysis without creating an inspection record.
    Uploads image, runs full AI + compliance pipeline, returns results.
    Does NOT save to database.
    """
    from datetime import datetime, timezone
    from ...ai.image_processing import get_image_quality
    from ...compliance.engine import ComplianceEngine
    from ...services.ai_service import get_ai_provider

    content = await file.read()
    try:
        validate_image_file(file.filename, content_type=file.content_type, size=len(content),
                            max_bytes=settings.max_upload_size_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    dest_path = secure_save_path(settings.upload_path, file.filename)
    dest_path.write_bytes(content)
    try:
        cloudinary_result = upload_label_image(dest_path, f"quick_{uuid4().hex}")
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Cloudinary upload failed: {exc}")

    ai = get_ai_provider()
    label_gate = await ai.classify_label(image_path=str(dest_path))
    if not label_gate["is_label"]:
        return {
            "success": True,
            "data": {
                "status": "NEEDS_REVIEW",
                "compliance_score": 0,
                "ai_provider": label_gate["provider"],
                "label_gate": label_gate,
                "declarations": {},
                "compliance_checks": [{
                    "rule_id": "LABEL_GATE",
                    "field_name": "is_label",
                    "status": "WARNING",
                    "detected_value": "Not a product label",
                    "explanation": f"Inspection stopped before validation: {label_gate['reason']}",
                    "confidence": label_gate["confidence"],
                }],
                "summary": {
                    "passed": 0,
                    "warnings": 1,
                    "failed": 0,
                    "reviews": 0,
                    "label": "Upload a product label image to continue.",
                },
                "image_url": cloudinary_result["url"],
                "image_public_id": cloudinary_result["public_id"],
            },
            "message": "Image rejected by Gemini label check. No compliance checks were run.",
        }

    quality = get_image_quality(str(dest_path))
    declarations = await ai.extract_declarations("", image_path=str(dest_path))
    label_meta = await ai.analyze_label("", image_path=str(dest_path))

    engine = ComplianceEngine()
    if hasattr(ai, "evaluate_compliance_ai"):
        ai_results = await ai.evaluate_compliance_ai(declarations)
        summary = engine.run_ai_results(ai_results, declarations)
    else:
        summary = engine.run_ai_results([], declarations)

    return {
        "success": True,
        "data": {
            "status": summary.status,
            "compliance_score": summary.score,
            "ai_provider": label_meta.get("provider"),
            "declarations": declarations,
            "compliance_checks": [
                {
                    "rule_id": r.rule_id,
                    "field_name": r.field_name,
                    "status": r.status,
                    "detected_value": r.detected_value,
                    "explanation": r.explanation,
                    "confidence": r.confidence,
                }
                for r in summary.results
            ],
            "summary": {
                "passed": summary.passed,
                "warnings": summary.warnings,
                "failed": summary.failed,
                "reviews": summary.reviews,
                "label": summary.label,
            },
            "image_quality": quality,
            "ocr_text_preview": "Gemini read the uploaded image directly.",
            "image_url": cloudinary_result["url"],
            "image_public_id": cloudinary_result["public_id"],
        },
        "message": "[DEMO] Quick analysis complete. Results are not saved.",
    }
