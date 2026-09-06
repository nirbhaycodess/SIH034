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
11. is_label — Boolean indicating whether the image is a product label (true) or just normal text/image (false). Return {"value": true, "confidence": 0.99} if it looks like a label, otherwise {"value": false, "confidence": 0.99}.

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

COMPLIANCE_EVALUATION_PROMPT = """
You are a strict Legal Metrology Inspector in India.
Your task is to evaluate the provided packaging label data (OCR Text and Extracted Fields) against the Legal Metrology (Packaged Commodities) Rules, 2011.

CRITICAL INSTRUCTIONS (ANTI-HALLUCINATION):
- ONLY use the legal rules provided in this prompt. Do NOT hallucinate or invent rules that do not exist in the provided text.
- Evaluate correctness, completeness, and placement of declarations based on available data.
- Identify missing, misleading, or non-compliant declarations.
- Be extremely careful when evaluating Rule 7 (Principal Display Panel font heights) and Rule 9 (Readability). Do NOT misread tables or guess font sizes if exact dimensions are missing—flag them as 'REVIEW'.
- If data is missing or unreadable, flag it for manual review rather than making assumptions.

LEGAL METROLOGY RULES (EXCERPTS):
1. Rule 6 (Mandatory Declarations):
   - Name and Address of manufacturer/packer/importer MUST be clear and complete.
   - Common/Generic name of commodity MUST be explicitly stated.
   - Net quantity MUST be stated in standard units.
   - Month & Year of manufacture/packing/import MUST be present.
   - Maximum Retail Price (MRP) MUST be prefixed with "₹" or "Rs." and explicitly state "inclusive of all taxes".
   - Consumer Care details MUST include a telephone number AND email address.
2. Rule 7 (Principal Display Panel (PDP) & Font Heights):
   - For Net Quantity <= 200g/ml, minimum numeral height = 1mm.
   - For Net Quantity > 200g/ml and <= 500g/ml, minimum numeral height = 2mm.
   - For Net Quantity > 500g/ml, minimum numeral height = 4mm.
   - Area of PDP MUST be sufficient to accommodate all mandatory declarations grouped together.
3. Rule 9 (Readability, Prominence, and Placement):
   - Declarations must be legible, prominent, definite, and plain.
   - Color contrast between the text and background must be sufficient for clear readability.
   - No declaration shall be obscured or masked by any other printed information or graphics.
4. Rule 13 (Standard Units):
   - Use standard SI units (g, kg, ml, l, cm, m).
   - "Dozen", "score", "gross" are prohibited for packaged commodities.
5. Rule 5 & Second Schedule (Standard Quantities):
   - Commodities must be packed in standard specified sizes. 
   - Examples: Biscuits (25g, 50g, 75g, 100g, 150g, 200g, 250g, 300g); Tea (25g, 50g, 100g, 250g, 500g, 1kg).
   - If a product is in a non-standard size, it MUST boldly declare "Not a standard pack size" under Rule 5.
6. Rule 4 (Misleading Declarations):
   - The label shall not contain any misleading statement regarding quantity, quality, or nature of the commodity.
7. Label Detection Requirement:
   - The uploaded image must be a product label. If the `is_label` field is false, the label is considered invalid and the inspection should fail with high severity.
8. Label Detection Requirement:
   - The uploaded image must be a product label. If the `is_label` field is false, the label is considered invalid and the inspection should fail with high severity.

EXTRACTED LABEL DATA & AI OCR EVIDENCE:
{declarations_json}

OUTPUT FORMAT:
Respond ONLY with a valid JSON array of evaluation results for the checked rules. Do not include markdown formatting like ```json.
[
  {{
    "rule_id": "Rule 6",
    "field_name": "mrp",
    "status": "PASS", // PASS, FAIL, WARNING, or REVIEW
    "expected_condition": "MRP MUST be prefixed and explicitly state inclusive of all taxes.",
    "explanation": "Detected MRP as Rs. 50 inclusive of taxes.",
    "severity_if_fail": "HIGH"
  }},
  {{
    "rule_id": "Rule 9",
    "field_name": "readability",
    "status": "REVIEW",
    "expected_condition": "Color contrast and legibility.",
    "explanation": "Background contrast unclear in OCR, physical inspection required.",
    "severity_if_fail": "MEDIUM"
  }}
]
"""

