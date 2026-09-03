"""PDF Report generation service using ReportLab."""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional

from bson import ObjectId
from pymongo.database import Database

from ..core.config import settings

logger = logging.getLogger("packsure.reports")

try:
    from reportlab.lib import colors
    from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.lib.units import mm
    from reportlab.platypus import (
        HRFlowable,
        Paragraph,
        SimpleDocTemplate,
        Spacer,
        Table,
        TableStyle,
    )
    _reportlab_available = True
except ImportError:
    _reportlab_available = False
    logger.warning("ReportLab not installed — PDF generation disabled.")


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _report_number(db: Database) -> str:
    count = db["reports"].count_documents({})
    return f"PS-RPT-{count + 1:06d}"


def generate_pdf_report(inspection_id: str, db: Database) -> Dict[str, Any]:
    """Generate a professional PDF report for an inspection."""
    if not _reportlab_available:
        raise RuntimeError("ReportLab is not installed. Run: pip install reportlab")

    insp_oid = ObjectId(inspection_id)

    # Gather all data
    inspection = db["inspections"].find_one({"_id": insp_oid})
    if not inspection:
        raise ValueError(f"Inspection {inspection_id} not found.")

    product = db["products"].find_one({"_id": inspection.get("product_id")}) or {}
    inspector = db["users"].find_one({"_id": inspection.get("inspector_id")}) or {}
    declarations = list(db["declarations"].find({"inspection_id": insp_oid}))
    checks = list(db["compliance_checks"].find({"inspection_id": insp_oid}))
    violations = list(db["violations"].find({"inspection_id": insp_oid}))

    # File path
    report_num = _report_number(db)
    filename = f"{inspection.get('inspection_number', inspection_id)}_report.pdf"
    report_dir = settings.report_path
    file_path = str(report_dir / filename)

    # Build PDF
    doc = SimpleDocTemplate(
        file_path,
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )

    styles = getSampleStyleSheet()
    story = []

    # ── Title ─────────────────────────────────────────────────────────────────
    title_style = ParagraphStyle("Title", fontSize=18, fontName="Helvetica-Bold",
                                  textColor=colors.HexColor("#1e3a5f"), spaceAfter=4, alignment=TA_CENTER)
    sub_style = ParagraphStyle("Sub", fontSize=10, fontName="Helvetica",
                                textColor=colors.grey, spaceAfter=2, alignment=TA_CENTER)

    story.append(Paragraph("PACKSURE AI", title_style))
    story.append(Paragraph("AI-Assisted Inspection Report", sub_style))
    story.append(Spacer(1, 6 * mm))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#1e3a5f")))
    story.append(Spacer(1, 4 * mm))

    # ── Meta info ─────────────────────────────────────────────────────────────
    bold = ParagraphStyle("Bold", fontSize=9, fontName="Helvetica-Bold")
    normal = ParagraphStyle("Normal", fontSize=9, fontName="Helvetica")

    meta_data = [
        ["Inspection ID:", inspection.get("inspection_number", str(inspection_id))],
        ["Report Number:", report_num],
        ["Date:", utcnow().strftime("%d %b %Y, %H:%M UTC")],
        ["Inspector:", inspector.get("name", "N/A")],
        ["Product:", product.get("product_name", "N/A")],
        ["Manufacturer:", product.get("manufacturer", "N/A")],
        ["Category:", product.get("category", "N/A")],
        ["Status:", inspection.get("status", "N/A")],
        ["Compliance Score:", f"{inspection.get('compliance_score', 'N/A')}%"],
        ["AI Confidence:", f"{float(inspection.get('ai_confidence', 0)) * 100:.0f}%"],
    ]

    meta_table = Table(
        [[Paragraph(r, bold), Paragraph(str(v), normal)] for r, v in meta_data],
        colWidths=[50 * mm, 110 * mm],
    )
    meta_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f0f4f8")),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.grey),
        ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#d1d5db")),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 6 * mm))

    # ── Declarations ──────────────────────────────────────────────────────────
    h2 = ParagraphStyle("H2", fontSize=11, fontName="Helvetica-Bold",
                         textColor=colors.HexColor("#1e3a5f"), spaceAfter=3)
    story.append(Paragraph("Detected Declarations", h2))

    if declarations:
        decl_data = [["Field", "Detected Value", "Confidence"]]
        for d in declarations:
            decl_data.append([
                d.get("field_name", "").replace("_", " ").title(),
                d.get("field_value", ""),
                f"{float(d.get('confidence', 0)) * 100:.0f}%",
            ])
        decl_table = Table(decl_data, colWidths=[45 * mm, 90 * mm, 25 * mm])
        decl_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1e3a5f")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
            ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#d1d5db")),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ]))
        story.append(decl_table)
    else:
        story.append(Paragraph("No declarations detected.", normal))

    story.append(Spacer(1, 6 * mm))

    # ── Compliance Checks ─────────────────────────────────────────────────────
    story.append(Paragraph("Compliance Checks", h2))
    story.append(Paragraph(
        "[DEMO] These checks are an AI-assisted preliminary assessment only.",
        ParagraphStyle("Disclaimer", fontSize=7, textColor=colors.grey, fontName="Helvetica-Oblique"),
    ))
    story.append(Spacer(1, 2 * mm))

    if checks:
        status_colors = {"PASS": "#22c55e", "FAIL": "#ef4444", "WARNING": "#f59e0b", "REVIEW": "#3b82f6"}
        check_data = [["Rule ID", "Field", "Status", "Explanation"]]
        for c in checks:
            check_data.append([
                c.get("rule_id", ""),
                c.get("field_name", "").replace("_", " ").title(),
                c.get("status", ""),
                (c.get("explanation", "")[:80] + "...") if len(c.get("explanation", "")) > 80 else c.get("explanation", ""),
            ])
        check_table = Table(check_data, colWidths=[30 * mm, 30 * mm, 20 * mm, 80 * mm])
        check_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1e3a5f")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 7),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
            ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#d1d5db")),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ]))
        story.append(check_table)
    else:
        story.append(Paragraph("No compliance checks available.", normal))

    story.append(Spacer(1, 6 * mm))

    # ── Violations ────────────────────────────────────────────────────────────
    if violations:
        story.append(Paragraph("Potential Issues Detected", h2))
        for v in violations:
            sev = v.get("severity", "MEDIUM")
            sev_colors = {"HIGH": "#ef4444", "CRITICAL": "#dc2626", "MEDIUM": "#f59e0b", "LOW": "#6b7280"}
            story.append(Paragraph(
                f"<font color='{sev_colors.get(sev, '#6b7280')}'><b>[{sev}]</b></font> {v.get('title', '')}",
                ParagraphStyle("Violation", fontSize=9, fontName="Helvetica", spaceAfter=2),
            ))
            story.append(Paragraph(v.get("description", ""), normal))
            story.append(Spacer(1, 2 * mm))

        story.append(Spacer(1, 4 * mm))

    # ── Inspector Remarks ─────────────────────────────────────────────────────
    if inspection.get("remarks"):
        story.append(Paragraph("Inspector Remarks", h2))
        story.append(Paragraph(inspection["remarks"], normal))
        story.append(Spacer(1, 4 * mm))

    # ── Disclaimer ────────────────────────────────────────────────────────────
    story.append(HRFlowable(width="100%", thickness=1, color=colors.grey))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph(
        "⚠ DISCLAIMER: This report is an AI-assisted preliminary assessment and should be reviewed "
        "by an authorized enforcement official before any legal action is taken. "
        "All compliance checks are marked [DEMO] and do not constitute a legally binding determination. "
        "PackSure AI — Smart India Hackathon (SIH26034).",
        ParagraphStyle("Disclaimer", fontSize=7, textColor=colors.grey, fontName="Helvetica-Oblique", alignment=TA_CENTER),
    ))

    doc.build(story)

    # Save report to MongoDB
    report_doc = {
        "inspection_id": insp_oid,
        "report_number": report_num,
        "file_path": file_path,
        "generated_at": utcnow(),
    }
    db["reports"].replace_one(
        {"inspection_id": insp_oid},
        report_doc,
        upsert=True,
    )

    return {
        "report_number": report_num,
        "file_path": file_path,
        "inspection_id": inspection_id,
    }
