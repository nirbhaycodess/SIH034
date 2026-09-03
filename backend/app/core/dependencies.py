from __future__ import annotations

from typing import Generator, List

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from pymongo.database import Database

from ..core.security import decode_token
from ..database.mongodb import get_database

security = HTTPBearer()


def get_db() -> Generator[Database, None, None]:
    """FastAPI dependency that yields the shared MongoDB database instance."""
    yield get_database()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Database = Depends(get_db),
) -> dict:
    """Decode JWT and return the current user document from MongoDB."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(credentials.credentials)
        if payload.get("type") != "access":
            raise credentials_exception
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    from bson import ObjectId

    user = db["users"].find_one({"_id": ObjectId(user_id), "is_active": True})
    if user is None:
        raise credentials_exception
    return user


def require_role(*roles: str):
    """Factory that returns a dependency requiring at least one of the given roles."""

    async def _checker(current_user: dict = Depends(get_current_user)) -> dict:
        if current_user.get("role") not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access requires one of these roles: {list(roles)}",
            )
        return current_user

    return _checker
