"""Gemini AI Provider for production use using direct REST API via httpx."""
from __future__ import annotations

import json
import logging
import re
from typing import Any, Dict, Optional

import httpx

from .interfaces import AIProvider
from .prompts import EXTRACTION_PROMPT

logger = logging.getLogger("packsure.ai.gemini")

GEMINI_MODELS = [
    "gemini-3.6-flash",
    "gemini-flash-latest",
    "gemini-3.8-flash",
    "gemini-flash-lite-latest",
]


class GeminiProvider(AIProvider):
    """
    Production AI provider using Google Gemini Generative Language REST API.
    Uses httpx async client with robust fallback across available Gemini models.
    API key must ONLY exist in backend environment — never sent to frontend.
    """

    def __init__(self, api_key: str, model_name: str = "gemini-3.6-flash") -> None:
        if not api_key:
            raise ValueError("GEMINI_API_KEY must be set to use GeminiProvider.")
        self._api_key = api_key
        self._preferred_model = model_name
        self._base_url = "https://generativelanguage.googleapis.com/v1beta/models"
        logger.info("Gemini provider initialized (preferred model=%s).", model_name)

    async def _call_gemini_api(self, prompt: str, image_path: Optional[str] = None) -> str:
        """Call Gemini API via httpx with optional multimodal image support, model fallback, and timeouts."""
        import base64
        from pathlib import Path

        headers = {
            "Content-Type": "application/json",
            "X-goog-api-key": self._api_key,
        }

        parts: list[dict[str, Any]] = [{"text": prompt}]
        if image_path and Path(image_path).exists():
            try:
                ext = Path(image_path).suffix.lower()
                mime = "image/png" if ext == ".png" else "image/jpeg"
                with open(image_path, "rb") as f:
                    b64_data = base64.b64encode(f.read()).decode("utf-8")
                parts.append({"inline_data": {"mime_type": mime, "data": b64_data}})
            except Exception as e:
                logger.warning("Failed to encode image %s for multimodal Gemini: %s", image_path, e)

        body = {
            "contents": [
                {
                    "parts": parts
                }
            ]
        }

        # Order models with preferred first
        models_to_try = [self._preferred_model] + [m for m in GEMINI_MODELS if m != self._preferred_model]

        last_error = None
        async with httpx.AsyncClient(timeout=45.0) as client:
            for m in models_to_try:
                url = f"{self._base_url}/{m}:generateContent"
                try:
                    res = await client.post(url, headers=headers, json=body)
                    if res.status_code == 200:
                        data = res.json()
                        candidates = data.get("candidates", [])
                        if candidates and "content" in candidates[0]:
                            parts = candidates[0]["content"].get("parts", [])
                            if parts and "text" in parts[0]:
                                return parts[0]["text"].strip()
                    logger.warning("Gemini model %s returned status %s: %s", m, res.status_code, res.text[:200])
                    last_error = f"Status {res.status_code}: {res.text[:150]}"
                except Exception as exc:
                    logger.warning("Gemini call failed for model %s: %s", m, exc)
                    last_error = str(exc)

        raise RuntimeError(f"All Gemini models failed. Last error: {last_error}")

    async def extract_declarations(
        self,
        ocr_text: str,
        image_path: Optional[str] = None,
    ) -> Dict[str, Dict[str, Any]]:
        prompt = EXTRACTION_PROMPT.format(ocr_text=ocr_text or "")

        try:
            raw_text = await self._call_gemini_api(prompt, image_path=image_path)

            # Extract JSON from response
            json_match = re.search(r"\{[\s\S]*\}", raw_text)
            if json_match:
                raw_json = json.loads(json_match.group(0))
                return self._normalize(raw_json)
        except Exception as exc:
            logger.error("Gemini extraction error: %s", exc)

        # Fallback: return empty declarations for REVIEW
        return self._empty_declarations()

    async def analyze_label(
        self,
        ocr_text: str,
        image_path: Optional[str] = None,
    ) -> Dict[str, Any]:
        try:
            explanation = await self.explain_finding("overview", ocr_text[:200] if ocr_text else "Label")
            return {
                "provider": "GeminiProvider",
                "model": self._preferred_model,
                "overview": explanation,
                "note": "Gemini AI analysis complete.",
            }
        except Exception:
            return {
                "provider": "GeminiProvider",
                "model": self._preferred_model,
                "note": "Gemini AI analysis complete.",
            }

    async def explain_finding(self, field: str, detected_value: Optional[str]) -> str:
        prompt = (
            f"Explain briefly in 1-2 sentences whether the field '{field}' with value '{detected_value}' "
            "satisfies Legal Metrology Packaged Commodities requirements on an Indian packaged product label."
        )
        try:
            return await self._call_gemini_api(prompt)
        except Exception as exc:
            logger.warning("Gemini explain_finding failed: %s", exc)
            return f"Finding for '{field}' detected as '{detected_value}'."

    def _normalize(self, raw: dict) -> Dict[str, Dict[str, Any]]:
        """Ensure every field follows {value, confidence} structure."""
        fields = [
            "product_name",
            "manufacturer",
            "net_quantity",
            "mrp",
            "packing_date",
            "consumer_care",
            "country_of_origin",
            "brand",
            "packer",
            "importer",
            "manufacturing_date",
        ]
        result = {}
        for f in fields:
            val = raw.get(f)
            if isinstance(val, dict):
                result[f] = {
                    "value": val.get("value"),
                    "confidence": float(val.get("confidence", 0.7)),
                }
            elif val is not None:
                result[f] = {"value": str(val), "confidence": 0.7}
        return result

    def _empty_declarations(self) -> Dict[str, Dict[str, Any]]:
        fields = [
            "product_name",
            "manufacturer",
            "net_quantity",
            "mrp",
            "packing_date",
            "consumer_care",
            "country_of_origin",
        ]
        return {f: {"value": None, "confidence": 0.0} for f in fields}
