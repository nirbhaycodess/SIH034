from fastapi import APIRouter
from ...schemas.common import LoginRequest, TokenResponse

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest) -> TokenResponse:
    """Mock authentication endpoint. Credentials are not validated."""
    return TokenResponse(access_token="mock-access-token", user={"id": "USR-1", "name": "Priya Sharma", "email": credentials.email, "role": "Enforcement Officer"})
