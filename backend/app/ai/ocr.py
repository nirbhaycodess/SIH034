"""OCR abstraction layer using PaddleOCR with graceful fallback."""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

logger = logging.getLogger("packsure.ocr")

# Try to import PaddleOCR — it's heavy and optional
try:
    from paddleocr import PaddleOCR as _PaddleOCR

    _paddle_available = True
except ImportError:
    _paddle_available = False
    logger.info("PaddleOCR not available — using fallback text extraction.")


class OCRResult:
    def __init__(self, text: str, confidence: float, bounding_box: List[int]):
        self.text = text
        self.confidence = confidence
        self.bounding_box = bounding_box  # [x1, y1, x2, y2]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "text": self.text,
            "confidence": self.confidence,
            "bounding_box": self.bounding_box,
        }


class OCREngine:
    """
    OCR abstraction. Uses PaddleOCR if available, falls back to metadata extraction.
    Never crashes the server — always returns results or empty list.
    """

    def __init__(self) -> None:
        self._engine: Any = None
        if _paddle_available:
            try:
                self._engine = _PaddleOCR(use_angle_cls=True, lang="en", show_log=False)
                logger.info("PaddleOCR engine initialized.")
            except Exception as exc:
                logger.warning("PaddleOCR init failed: %s — using fallback.", exc)

    def run(self, image_path: str) -> List[OCRResult]:
        """Run OCR on an image file. Returns list of OCRResult objects."""
        try:
            if self._engine is not None:
                return self._run_paddle(image_path)
            return self._fallback_extraction(image_path)
        except Exception as exc:
            logger.error("OCR failed for %s: %s", image_path, exc)
            return []

    def full_text(self, results: List[OCRResult]) -> str:
        """Concatenate all OCR text lines into a single string."""
        return "\n".join(r.text for r in results)

    def _run_paddle(self, image_path: str) -> List[OCRResult]:
        raw = self._engine.ocr(image_path, cls=True)
        results = []
        if not raw or not raw[0]:
            return results
        for line in raw[0]:
            bbox_points = line[0]
            text, conf = line[1]
            x_coords = [int(p[0]) for p in bbox_points]
            y_coords = [int(p[1]) for p in bbox_points]
            bbox = [min(x_coords), min(y_coords), max(x_coords), max(y_coords)]
            results.append(OCRResult(text=text, confidence=float(conf), bounding_box=bbox))
        return results

    def _fallback_extraction(self, image_path: str) -> List[OCRResult]:
        """
        When PaddleOCR is unavailable, return empty results.
        The AI provider will still attempt extraction from any metadata.
        """
        logger.debug("OCR fallback: no PaddleOCR, returning empty for %s", image_path)
        return []


# Global singleton
_ocr_engine: Optional[OCREngine] = None


def get_ocr_engine() -> OCREngine:
    global _ocr_engine
    if _ocr_engine is None:
        _ocr_engine = OCREngine()
    return _ocr_engine
