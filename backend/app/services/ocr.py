from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Protocol

import numpy as np

from .errors import OCRProviderError


@dataclass(frozen=True)
class OCRLine:
    text: str
    confidence: float


class OCRProvider(Protocol):
    def read(self, image: np.ndarray) -> list[OCRLine]:
        ...


class PaddleOCRProvider:
    """Adapter around PaddleOCR, isolated so another provider can be injected."""

    def __init__(self) -> None:
        try:
            from paddleocr import PaddleOCR
        except ImportError as exc:
            raise OCRProviderError(
                "PaddleOCR is not installed. Install backend requirements to enable OCR."
            ) from exc
        try:
            self._ocr = PaddleOCR(use_angle_cls=True, lang="en", show_log=False)
        except Exception as exc:
            raise OCRProviderError("PaddleOCR could not be initialized.") from exc

    def read(self, image: np.ndarray) -> list[OCRLine]:
        try:
            result: Any = self._ocr.ocr(image, cls=True)
        except Exception as exc:
            raise OCRProviderError("PaddleOCR could not process the image.") from exc
        lines: list[OCRLine] = []
        for page in result or []:
            for item in page or []:
                if len(item) >= 2 and item[1]:
                    text, confidence = item[1]
                    lines.append(OCRLine(str(text).strip(), float(confidence)))
        return lines
