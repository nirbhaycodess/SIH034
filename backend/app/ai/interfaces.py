"""AI Provider abstraction layer."""
from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional


class AIProvider(ABC):
    """
    Abstract interface for AI label analysis providers.
    Implementations: MockAIProvider, GeminiProvider.
    
    IMPORTANT: AI providers extract declarations only.
    Compliance decisions are always made by ComplianceEngine, not AI.
    """

    @abstractmethod
    async def extract_declarations(
        self,
        ocr_text: str,
        image_path: Optional[str] = None,
    ) -> Dict[str, Dict[str, Any]]:
        """
        Extract structured declarations from OCR text / image.
        Returns: {field_name: {"value": str|None, "confidence": float}}
        """
        ...

    @abstractmethod
    async def analyze_label(
        self,
        ocr_text: str,
        image_path: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Return general label analysis metadata."""
        ...

    @abstractmethod
    async def explain_finding(self, field: str, detected_value: Optional[str]) -> str:
        """Explain an extraction finding in plain English."""
        ...
