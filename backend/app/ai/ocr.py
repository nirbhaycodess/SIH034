"""Mandatory PaddleOCR extraction for uploaded product labels."""
from __future__ import annotations

from functools import lru_cache
from typing import Any


@lru_cache(maxsize=1)
def _get_ocr() -> Any:
    """Create one PaddleOCR engine for the process."""
    try:
        from paddleocr import PaddleOCR
    except ImportError as exc:
        raise RuntimeError(
            "PaddleOCR is required. Install paddlepaddle and paddleocr before starting the API."
        ) from exc

    return PaddleOCR(use_angle_cls=True, lang="en", show_log=False)


def extract_text(image_path: str) -> dict[str, Any]:
    """Extract text and line confidence values; fail explicitly if OCR fails."""
    if not image_path:
        raise ValueError("An image path is required for PaddleOCR.")

    result = _get_ocr().ocr(image_path, cls=True)
    lines: list[dict[str, Any]] = []

    for page in result or []:
        for item in page or []:
            if not isinstance(item, (list, tuple)) or len(item) < 2:
                continue
            text_data = item[1]
            if not isinstance(text_data, (list, tuple)) or len(text_data) < 2:
                continue
            text = str(text_data[0]).strip()
            if text:
                lines.append({
                    "text": text,
                    "confidence": float(text_data[1]),
                    "bounding_box": item[0],
                })

    return {
        "text": "\n".join(line["text"] for line in lines),
        "lines": lines,
        "engine": "PaddleOCR",
    }
