from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field

InspectionStatus = Literal["COMPLIANT", "NEEDS REVIEW", "VIOLATION", "DRAFT"]
CheckStatus = Literal["PASS", "WARNING", "FAIL", "REVIEW"]


class Declaration(BaseModel):
    label: str
    value: str
    confidence: int = Field(ge=0, le=100)


class ComplianceCheck(BaseModel):
    requirement: str
    detected_value: str
    status: CheckStatus
    explanation: str


class Violation(BaseModel):
    id: str
    title: str
    severity: Literal["High", "Medium", "Low"]
    description: str
    rule: str


class Inspection(BaseModel):
    id: str
    product: str
    manufacturer: str
    date: str
    score: int = Field(ge=0, le=100)
    status: InspectionStatus
    inspector: str
    category: str
    declarations: list[Declaration] = []
    checks: list[ComplianceCheck] = []
    violations: list[Violation] = []


class InspectionCreate(BaseModel):
    product: str = "Untitled package"
    manufacturer: str = "Not provided"
    category: str = "Uncategorised"


class AnalysisResponse(BaseModel):
    inspection: Inspection
    analyzed_at: datetime
    is_mock: bool = True
    message: str = "Mock compliance analysis completed. OCR and AI are not enabled."


class UploadResponse(BaseModel):
    filename: str
    content_type: str | None
    size_bytes: int
    url: str
    is_mock: bool = True
