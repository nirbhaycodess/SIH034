"""Pydantic v2 schemas for authentication."""
from __future__ import annotations

from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    model_config = {"json_schema_extra": {"example": {"email": "priya.sharma@packsure.gov.in", "password": "Inspector@123"}}}


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "INSPECTOR"

    model_config = {"json_schema_extra": {"example": {"name": "New Inspector", "email": "new@packsure.gov.in", "password": "Secure@123", "role": "INSPECTOR"}}}


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str
