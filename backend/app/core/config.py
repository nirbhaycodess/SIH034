from dataclasses import dataclass
from os import getenv


@dataclass(frozen=True)
class Settings:
    app_name: str = "PackSure AI API"
    api_prefix: str = "/api/v1"
    cors_origins: tuple[str, ...] = ("http://localhost:5173",)
    environment: str = getenv("ENVIRONMENT", "development")


settings = Settings()
