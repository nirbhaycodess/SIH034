# PackSure AI Backend

FastAPI REST API for PackSure AI. Image analysis uses OpenCV preprocessing and PaddleOCR, with declaration extraction isolated behind an injectable OCR provider.

The extraction step is deterministic label parsing; no LLM is used for legal or compliance decisions. Each field includes the OCR confidence (0 to 1), and missing fields are returned with a null value and zero confidence.

## Run locally

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Use Python 3.10-3.12 for the PaddleOCR/PaddlePaddle runtime. The selected OCR provider can be replaced by implementing `OCRProvider` and passing it to `ImageAnalysisService`.

Open the API documentation at `http://localhost:8000/docs`.

## Frontend configuration

Create a `.env` file at the frontend project root:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

The frontend falls back to local mock data if this value is omitted or the backend is unavailable.

## Mobile app

The Expo React Native client is in `mobile/`. Start it with `npm install` and `npx expo start`. For an Android emulator it uses `http://10.0.2.2:8000`; for a physical phone, replace `API_URL` in `mobile/App.tsx` with the computer's LAN IP.

## Current endpoints

- `POST /api/v1/auth/login`
- `GET /api/v1/inspections`, `GET /api/v1/inspections/{inspection_id}`, `POST /api/v1/inspections`
- `POST /api/v1/inspections/{inspection_id}/analyze`
- `POST /api/v1/uploads/images`
- `POST /api/v1/uploads/images/analyze` (multipart field: `file`)
- `POST /api/v1/compliance/evaluate` (structured declarations JSON)
- `GET /api/v1/products`, `GET /api/v1/products/{product_id}`
- `GET /api/v1/reports`, `POST /api/v1/reports`, `GET /api/v1/reports/{report_id}/download`

## Compliance engine

The compliance engine is separate from OCR and uses deterministic, configurable validators. Its initial ruleset is explicitly marked `DEMO/SAMPLE` and only checks whether each extracted field is present. It is not a legal determination; replace `DEMO_RULES` with a verified Legal Metrology rules dataset before production use.
