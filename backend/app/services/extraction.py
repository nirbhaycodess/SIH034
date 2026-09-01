from __future__ import annotations

import re

from ..schemas.analysis import DeclarationExtraction, ExtractedField
from .ocr import OCRLine

_LABELS: dict[str, tuple[str, ...]] = {
    "product_name": ("product name", "name of product"),
    "manufacturer": ("manufacturer", "manufactured by", "mfd by"),
    "packer": ("packer", "packed by"),
    "importer": ("importer", "imported by"),
    "net_quantity": ("net quantity", "net qty", "quantity"),
    "mrp": ("mrp", "maximum retail price"),
    "manufacturing_date": ("manufacturing date", "mfg date", "mfd date", "date of manufacture"),
    "consumer_care": ("consumer care", "customer care", "care number", "helpline"),
    "country_of_origin": ("country of origin", "made in", "origin"),
}


def _value_after_label(text: str, labels: tuple[str, ...]) -> str | None:
    lowered = text.lower()
    for label in sorted(labels, key=len, reverse=True):
        match = re.search(rf"\b{re.escape(label)}\b\s*[:\-]?\s*(.+)$", lowered)
        if match:
            start = match.start(1)
            return text[start:].strip(" :-")
    return None


def extract_declarations(lines: list[OCRLine]) -> DeclarationExtraction:
    extracted: dict[str, ExtractedField] = {}
    for field, labels in _LABELS.items():
        candidates = [
            (value, line.confidence)
            for line in lines
            if (value := _value_after_label(line.text, labels))
        ]
        if candidates:
            value, confidence = max(candidates, key=lambda candidate: candidate[1])
            extracted[field] = ExtractedField(value=value, confidence=round(confidence, 3))
        else:
            extracted[field] = ExtractedField()
    return DeclarationExtraction(**extracted)
