"""Mock AI Provider — returns realistic demo data without any external API call."""
from __future__ import annotations

import random
from typing import Any, Dict, Optional

from .interfaces import AIProvider


class MockAIProvider(AIProvider):
    """
    Development AI provider that returns plausible mock declarations.
    Use this when GEMINI_API_KEY is not available or AI_PROVIDER=mock.
    """

    async def extract_declarations(
        self,
        ocr_text: str,
        image_path: Optional[str] = None,
    ) -> Dict[str, Dict[str, Any]]:
        """Generate mock declarations based on OCR text hints."""
        text_lower = ocr_text.lower() if ocr_text else ""

        declarations = {
            "product_name": {
                "value": self._extract_hint(ocr_text, ["biscuit", "snack", "butter", "masala", "spice"], "Demo Product"),
                "confidence": round(random.uniform(0.88, 0.97), 2),
            },
            "manufacturer": {
                "value": self._extract_hint(ocr_text, ["pvt", "ltd", "foods", "industries"], "Demo Manufacturer Pvt Ltd"),
                "confidence": round(random.uniform(0.85, 0.95), 2),
            },
            "net_quantity": {
                "value": self._detect_quantity(ocr_text),
                "confidence": round(random.uniform(0.90, 0.99), 2),
            },
            "mrp": {
                "value": self._detect_mrp(ocr_text),
                "confidence": round(random.uniform(0.90, 0.99), 2),
            },
            "packing_date": {
                "value": self._detect_date(ocr_text),
                "confidence": round(random.uniform(0.80, 0.95), 2),
            },
            "consumer_care": {
                "value": self._detect_consumer_care(ocr_text),
                "confidence": round(random.uniform(0.70, 0.90), 2),
            },
            "country_of_origin": {
                "value": "India",
                "confidence": round(random.uniform(0.88, 0.98), 2),
            },
        }
        return declarations

    async def analyze_label(
        self,
        ocr_text: str,
        image_path: Optional[str] = None,
    ) -> Dict[str, Any]:
        return {
            "provider": "MockAIProvider",
            "language_detected": "English",
            "label_type": "Principal Display Panel",
            "estimated_confidence": round(random.uniform(0.82, 0.93), 2),
            "note": "Mock analysis — no external API called.",
        }

    async def classify_label(self, image_path: Optional[str] = None) -> Dict[str, Any]:
        return {
            "is_label": True,
            "confidence": 0.5,
            "reason": "Mock provider accepted the image for demo analysis.",
            "provider": "MockAIProvider",
        }

    async def explain_finding(self, field: str, detected_value: Optional[str]) -> str:
        if detected_value:
            return f"[Mock] '{field}' was detected with value: {detected_value}."
        return f"[Mock] '{field}' could not be detected in the package image."

    # ── Private helpers ───────────────────────────────────────────────────────

    def _extract_hint(self, text: str, keywords: list, fallback: str) -> str:
        if not text:
            return fallback
        for kw in keywords:
            if kw.lower() in text.lower():
                # Try to return a nearby phrase
                idx = text.lower().find(kw.lower())
                snippet = text[max(0, idx - 5):idx + 40].strip().split("\n")[0].strip()
                if snippet:
                    return snippet[:80]
        return fallback

    def _detect_quantity(self, text: str) -> Optional[str]:
        import re
        patterns = [
            r"(\d+(?:\.\d+)?)\s*(gms?|kg|g|ml|l|liter|litre|n|pieces?)",
            r"net\s*(?:qty|quantity|wt|weight)[:\s]*(\d+(?:\.\d+)?)\s*(\w+)",
        ]
        for pat in patterns:
            m = re.search(pat, text, re.IGNORECASE)
            if m:
                return m.group(0).strip()
        return "Demo Net Qty: 100 g"

    def _detect_mrp(self, text: str) -> Optional[str]:
        import re
        m = re.search(r"(?:mrp|m\.r\.p\.?|₹|rs\.?)\s*\.?\s*(\d+(?:\.\d{1,2})?)", text, re.IGNORECASE)
        if m:
            return f"₹{m.group(1)}"
        return "₹10.00"

    def _detect_date(self, text: str) -> Optional[str]:
        import re
        m = re.search(r"\b(\d{2}[\/\-]\d{4}|\d{4}[\/\-]\d{2})\b", text)
        if m:
            return m.group(0)
        return "08/2026"

    def _detect_consumer_care(self, text: str) -> Optional[str]:
        import re
        phone = re.search(r"\b(1800[\s\-]?\d{3}[\s\-]?\d{3,4}|\b\d{10}\b)", text)
        email = re.search(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}", text)
        if phone:
            return phone.group(0)
        if email:
            return email.group(0)
        # Return a mock value with 70% probability
        if random.random() > 0.3:
            return "1800-XXX-XXXX | consumer@demo.in"
        return None
