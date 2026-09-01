from __future__ import annotations

from dataclasses import dataclass

from ..schemas.analysis import DeclarationExtraction
from .errors import ImageAnalysisError, OCRProviderError
from .extraction import extract_declarations
from .ocr import OCRLine, OCRProvider, PaddleOCRProvider
from .preprocessing import preprocess_image


@dataclass(frozen=True)
class AnalysisResult:
    fields: DeclarationExtraction
    status: str
    error: str | None = None


class ImageAnalysisService:
    def __init__(self, ocr_provider: OCRProvider | None = None) -> None:
        self._ocr_provider = ocr_provider

    def analyze(self, image_bytes: bytes) -> AnalysisResult:
        try:
            image = preprocess_image(image_bytes)
            provider = self._ocr_provider or PaddleOCRProvider()
            lines: list[OCRLine] = provider.read(image)
            if not lines:
                return AnalysisResult(DeclarationExtraction(), "no_text", "No text was detected.")
            return AnalysisResult(extract_declarations(lines), "completed")
        except (ImageAnalysisError, OCRProviderError, RuntimeError) as exc:
            return AnalysisResult(DeclarationExtraction(), "failed", str(exc))
