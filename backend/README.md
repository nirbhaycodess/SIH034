# PackSure AI — Backend

FastAPI + MongoDB backend for the PackSure AI compliance checking system.
**Smart India Hackathon 2026 | Problem Statement SIH26034**

## Quick Start

### Prerequisites
- Python 3.12+
- MongoDB (local or Atlas)
- `c:\Users\Nirbhay\Documents\SIH034\backend\.venv\` (already created)

### 1. Set up environment
```powershell
# Copy and fill in .env
copy .env.example .env
# Edit .env: set MONGODB_URI, JWT_SECRET_KEY, etc.
```

### 2. Install dependencies
```powershell
.venv\Scripts\python.exe -m pip install -r requirements.txt
```

### 3. Seed database (optional demo data)
```powershell
.venv\Scripts\python.exe -m app.database.seed
```

### 4. Run the server
```powershell
.venv\Scripts\uvicorn.exe app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs  
Health check: http://localhost:8000/api/v1/health

### 5. Run tests
```powershell
.venv\Scripts\python.exe -m pytest tests/ -v
```

## Frontend Integration

Add to `c:\Users\Nirbhay\Documents\SIH034\.env.local`:
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

The frontend `api.ts` automatically uses the real backend when `VITE_API_BASE_URL` is set,
with full mock fallback when it's not.

## Demo Accounts (after seeding)
| Email | Password | Role |
|-------|----------|------|
| `admin@packsure.gov.in` | `Admin@123` | ADMIN |
| `priya.sharma@packsure.gov.in` | `Inspector@123` | INSPECTOR |
| `rajesh.kumar@packsure.gov.in` | `Reviewer@123` | REVIEWER |

## API Endpoints

All endpoints are prefixed with `/api/v1`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login → JWT tokens |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/auth/me` | Current user |
| GET | `/users` | List users (ADMIN) |
| GET | `/products` | List products |
| POST | `/products` | Create product |
| GET | `/inspections` | List inspections |
| POST | `/inspections` | Create inspection |
| GET | `/inspections/{id}` | Get inspection detail |
| POST | `/uploads/image` | Upload image |
| POST | `/analysis/analyze` | Run AI pipeline |
| POST | `/analysis/quick-analyze` | Quick analysis (no DB save) |
| GET | `/reports` | List reports |
| POST | `/reports/generate/{id}` | Generate PDF report |
| GET | `/reports/download/{id}` | Download PDF |
| GET | `/analytics/dashboard` | Dashboard KPIs |
| GET | `/analytics/inspections/by-status` | Status breakdown |
| GET | `/analytics/inspections/trend` | Daily trend |
| GET | `/analytics/violations/by-severity` | Violations by severity |
| GET | `/analytics/compliance/score-distribution` | Score histogram |

## AI Architecture

```
Image Upload
    ↓
Gemini label gate and multimodal OCR
    ↓
AI Declaration Extraction (app/ai/mock_provider.py or gemini_provider.py)
    ↓
Deterministic Compliance Engine (app/compliance/engine.py)
    ↓
Compliance scoring (app/compliance/engine.py)
    ↓
Results returned and saved to MongoDB where applicable
```

> ⚠️ **IMPORTANT**: AI providers extract declarations only.  
> All compliance decisions are made deterministically by `ComplianceEngine`.  
> Never allow the AI to make the final legal compliance decision.

## Tech Stack
- **FastAPI** 0.115 + **Uvicorn** (ASGI)
- **Pydantic** v2 + **pydantic-settings**
- **PyMongo** 4.10 (no ORM)
- **python-jose** (JWT) + **passlib/bcrypt** (passwords)
- **Google Gemini** multimodal OCR and validation
- **ReportLab** (PDF reports)
- **MongoDB** (Atlas compatible)

## Disclaimer

All compliance rules are clearly marked `[DEMO]` and are for demonstration purposes only.
They are not a complete or authoritative interpretation of the Legal Metrology (Packaged Commodities) Rules, 2011.
