"""Analysis pipeline service — orchestrates Gemini image analysis and compliance."""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from bson import ObjectId
from pymongo.database import Database

from ..ai.image_processing import get_image_quality
from ..ai.ocr import extract_text
from ..compliance.engine import ComplianceEngine
from ..core.config import settings

logger = logging.getLogger("packsure.analysis")


def get_ai_provider():
    """Return the configured AI provider."""
    if settings.ai_provider.lower() == "gemini":
        if not settings.gemini_api_key:
            raise RuntimeError("AI_PROVIDER=gemini requires GEMINI_API_KEY.")
        from ..ai.gemini_provider import GeminiProvider
        return GeminiProvider(api_key=settings.gemini_api_key)

    from ..ai.mock_provider import MockAIProvider
    return MockAIProvider()


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


async def run_analysis_pipeline(inspection_id: str, db: Database) -> Dict[str, Any]:
    """
    Full AI analysis pipeline:
    1. Get inspection + images
    2. Run mandatory PaddleOCR and persist its output
    3. Let Gemini verify the image is a product label
    4. Let Gemini extract declarations from PaddleOCR text
    5. Let Gemini evaluate compliance against the configured rules
    6. Save results to MongoDB
    7. Return complete result
    """
    insp_oid = ObjectId(inspection_id)
    inspection = db["inspections"].find_one({"_id": insp_oid})
    if not inspection:
        raise ValueError(f"Inspection {inspection_id} not found.")

    # Update status to PROCESSING
    db["inspections"].update_one(
        {"_id": insp_oid},
        {"$set": {"status": "PROCESSING", "updated_at": utcnow()}},
    )

    try:
        # 1. Get images
        image_paths = inspection.get("local_image_paths") or inspection.get("images", [])
        if isinstance(image_paths, str):
            image_paths = [image_paths]
        quality_data = {}

        ai_provider = get_ai_provider()

        for img_path in image_paths:
            try:
                quality_data = get_image_quality(img_path)

            except Exception as exc:
                logger.error("Image quality analysis error for %s: %s", img_path, exc)

        primary_img = image_paths[0] if image_paths else None
        if not primary_img:
            raise ValueError("Inspection has no image for PaddleOCR.")
        if primary_img.startswith(("http://", "https://")):
            raise ValueError("PaddleOCR requires a local inspection image.")

        ocr_result = extract_text(primary_img)
        db["ocr_results"].delete_many({"inspection_id": insp_oid})
        db["ocr_results"].insert_one({
            "inspection_id": insp_oid,
            "engine": ocr_result["engine"],
            "text": ocr_result["text"],
            "lines": ocr_result["lines"],
            "created_at": utcnow(),
        })

        label_gate = await ai_provider.classify_label(image_path=primary_img)
        if not label_gate["is_label"]:
            summary = {
                "inspection_id": inspection_id,
                "status": "NEEDS_REVIEW",
                "compliance_score": 0,
                "ai_confidence": label_gate["confidence"],
                "label_gate": label_gate,
                "message": "Inspection stopped: uploaded image is not a product label.",
            }
            db["inspections"].update_one(
                {"_id": insp_oid},
                {"$set": {"status": "NEEDS_REVIEW", "updated_at": utcnow()}},
            )
            return summary

        declarations = await ai_provider.extract_declarations(
            ocr_result["text"], image_path=primary_img
        )
        label_meta = await ai_provider.analyze_label(
            ocr_result["text"], image_path=primary_img
        )

        # 5. Save declarations to MongoDB
        db["declarations"].delete_many({"inspection_id": insp_oid})  # Clear old
        declaration_docs = []
        for field_name, field_data in declarations.items():
            if field_data.get("value") is not None:
                doc = {
                    "inspection_id": insp_oid,
                    "field_name": field_name,
                    "field_value": str(field_data["value"]),
                    "confidence": field_data.get("confidence", 0.0),
                    "source": f"{settings.ai_provider.upper()}_AI",
                    "bounding_box": None,
                    "created_at": utcnow(),
                }
                db["declarations"].insert_one(doc)
                declaration_docs.append(doc)

        # 5. Run AI-driven compliance engine
        engine = ComplianceEngine()

        ai_results = await ai_provider.evaluate_compliance_ai(declarations)
        summary = engine.run_ai_results(ai_results, declarations)

        # 7. Save compliance checks to MongoDB
        db["compliance_checks"].delete_many({"inspection_id": insp_oid})
        compliance_docs = []
        for result in summary.results:
            doc = {
                "inspection_id": insp_oid,
                "field_name": result.field_name,
                "rule_id": result.rule_id,
                "status": result.status,
                "detected_value": result.detected_value,
                "expected_condition": result.expected_condition,
                "explanation": result.explanation,
                "confidence": result.confidence,
                "requires_manual_review": result.requires_manual_review,
                "created_at": utcnow(),
            }
            db["compliance_checks"].insert_one(doc)
            compliance_docs.append(doc)

        # 8. Create violations for FAIL results
        db["violations"].delete_many({"inspection_id": insp_oid})
        violation_docs = []
        for result in summary.results:
            if result.status in {"FAIL", "WARNING"}:
                doc = {
                    "inspection_id": insp_oid,
                    "rule_id": result.rule_id,
                    "title": f"[DEMO] {result.field_name.replace('_', ' ').title()} issue detected",
                    "description": result.explanation,
                    "severity": result.severity_if_fail if result.status == "FAIL" else "LOW",
                    "evidence_id": None,
                    "confidence": result.confidence,
                    "status": "OPEN",
                    "created_at": utcnow(),
                }
                db["violations"].insert_one(doc)
                violation_docs.append(doc)

        # 9. Update inspection with final score and status
        db["inspections"].update_one(
            {"_id": insp_oid},
            {
                "$set": {
                    "status": summary.status,
                    "compliance_score": summary.score,
                    "ai_confidence": label_meta.get("estimated_confidence", 0.85),
                    "updated_at": utcnow(),
                }
            },
        )

        return {
            "inspection_id": inspection_id,
            "status": summary.status,
            "compliance_score": summary.score,
            "ai_confidence": label_meta.get("estimated_confidence", 0.85),
            "declarations": {k: v for k, v in declarations.items()},
            "ocr_text": ocr_result["text"],
            "ocr_engine": ocr_result["engine"],
            "summary": {
                "passed": summary.passed,
                "warnings": summary.warnings,
                "failed": summary.failed,
                "reviews": summary.reviews,
                "label": summary.label,
            },
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
            "violations_count": len(violation_docs),
            "image_quality": quality_data,
        }

    except Exception as exc:
        logger.error("Analysis pipeline error: %s", exc, exc_info=True)
        db["inspections"].update_one(
            {"_id": insp_oid},
            {"$set": {"status": "FAILED", "updated_at": utcnow()}},
        )
        raise
