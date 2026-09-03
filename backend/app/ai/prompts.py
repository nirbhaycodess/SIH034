"""Prompts for Gemini AI provider."""

EXTRACTION_PROMPT = """
You are an AI assistant helping analyze Indian packaged commodity labels.
Your task is to extract mandatory declarations from the OCR text below.

IMPORTANT:
- Only extract what is clearly present in the text.
- Do NOT invent or guess values that are not in the text.
- Return a confidence score between 0.0 and 1.0 for each field.
- If a field is not found, return {{"value": null, "confidence": 0.0}}.

Extract the following fields:
1. product_name — Product name/generic name
2. manufacturer — Manufacturer/packer/importer name and address
3. net_quantity — Net weight/volume/count with unit
4. mrp — Maximum Retail Price with currency symbol
5. packing_date — Month and year of packing or manufacture
6. consumer_care — Consumer care phone/email
7. country_of_origin — Country where product was made
8. brand — Brand name
9. packer — Packer name (if different from manufacturer)
10. importer — Importer name (for imported goods)

OCR Text:
---
{ocr_text}
---

Respond ONLY with a valid JSON object in exactly this format:
{{
  "product_name": {{"value": "...", "confidence": 0.95}},
  "manufacturer": {{"value": "...", "confidence": 0.91}},
  "net_quantity": {{"value": "...", "confidence": 0.98}},
  "mrp": {{"value": "...", "confidence": 0.99}},
  "packing_date": {{"value": "...", "confidence": 0.87}},
  "consumer_care": {{"value": "...", "confidence": 0.85}},
  "country_of_origin": {{"value": "...", "confidence": 0.92}},
  "brand": {{"value": "...", "confidence": 0.94}},
  "packer": {{"value": null, "confidence": 0.0}},
  "importer": {{"value": null, "confidence": 0.0}}
}}
"""
