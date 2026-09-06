from __future__ import annotations

import logging
from pymongo import MongoClient
from pymongo.database import Database

from ..core.config import settings

logger = logging.getLogger("packsure.db")
_client: MongoClient | None = None


def connect_to_mongo() -> None:
    """Create the shared MongoDB Atlas client. Called once at startup."""
    global _client
    _client = MongoClient(
        settings.mongodb_uri,
        serverSelectionTimeoutMS=10000,
        connectTimeoutMS=10000,
        socketTimeoutMS=60000,
        retryWrites=True,
        tls=True,
    )
    # Ping to verify Atlas connectivity
    _client.admin.command("ping")
    logger.info("✅ Connected to MongoDB Atlas — database: %s", settings.mongodb_database)


def close_mongo_connection() -> None:
    """Close the MongoDB client. Called at shutdown."""
    global _client
    if _client is not None:
        _client.close()
        _client = None
        logger.info("MongoDB connection closed.")


def get_client() -> MongoClient:
    if _client is None:
        raise RuntimeError("MongoDB client is not initialized. Call connect_to_mongo() first.")
    return _client


def get_database() -> Database:
    """Return the shared database instance (no new connection per request)."""
    return get_client()[settings.mongodb_database]
