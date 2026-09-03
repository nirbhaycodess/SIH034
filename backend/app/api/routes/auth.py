"""Authentication routes: register, login, refresh, me."""
from __future__ import annotations

from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError
from pymongo.database import Database

from ...core.dependencies import get_current_user, get_db
from ...core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from ...schemas.auth import LoginRequest, RefreshRequest, RegisterRequest, TokenResponse
from ...schemas.user import user_to_out
from ...services.audit_service import log_action

router = APIRouter(prefix="/auth", tags=["Auth"])


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


ALLOWED_ROLES = {"ADMIN", "INSPECTOR", "REVIEWER"}


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, db: Database = Depends(get_db)):
    """Create a new user account."""
    if body.role not in ALLOWED_ROLES:
        raise HTTPException(status_code=400, detail=f"Role must be one of {ALLOWED_ROLES}")

    if db["users"].find_one({"email": body.email}):
        raise HTTPException(status_code=409, detail="Email already registered.")

    user_doc = {
        "_id": ObjectId(),
        "name": body.name.strip(),
        "email": body.email.lower().strip(),
        "password_hash": hash_password(body.password),
        "role": body.role,
        "is_active": True,
        "created_at": utcnow(),
        "updated_at": utcnow(),
    }
    db["users"].insert_one(user_doc)
    log_action(db, "USER_REGISTERED", "user", str(user_doc["_id"]))

    return {"success": True, "data": user_to_out(user_doc), "message": "Account created."}


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Database = Depends(get_db)):
    """Authenticate and return JWT tokens."""
    user = db["users"].find_one({"email": body.email.lower().strip()})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    if not user.get("is_active", True):
        raise HTTPException(status_code=403, detail="Account is disabled.")

    token_data = {"sub": str(user["_id"]), "email": user["email"], "role": user["role"]}
    log_action(db, "USER_LOGIN", "user", str(user["_id"]))

    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "token_type": "bearer",
    }


@router.post("/refresh", response_model=TokenResponse)
def refresh(body: RefreshRequest, db: Database = Depends(get_db)):
    """Exchange a refresh token for a new access token."""
    try:
        payload = decode_token(body.refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type.")
        user_id = payload.get("sub")
        user = db["users"].find_one({"_id": ObjectId(user_id), "is_active": True})
        if not user:
            raise HTTPException(status_code=401, detail="User not found or inactive.")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token.")

    token_data = {"sub": str(user["_id"]), "email": user["email"], "role": user["role"]}
    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "token_type": "bearer",
    }


@router.get("/me")
def me(current_user: dict = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return {"success": True, "data": user_to_out(current_user)}


@router.post("/logout")
def logout(current_user: dict = Depends(get_current_user), db: Database = Depends(get_db)):
    """Logout (client should discard tokens)."""
    log_action(db, "USER_LOGOUT", "user", str(current_user["_id"]))
    return {"success": True, "message": "Logged out successfully."}
