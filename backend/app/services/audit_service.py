"""Audit log service."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, Optional

from pymongo.database import Database


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def log_action(
    db: Database,
    action: str,
    resource_type: str,
    resource_id: Optional[str] = None,
    user_id: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> None:
    """Write an audit log entry. Never raises — log failures are silent."""
    try:
        db["audit_logs"].insert_one({
            "user_id": user_id,
            "action": action,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "timestamp": utcnow(),
            "metadata": metadata or {},
        })
    except Exception:
        pass  # Audit logs must never break the main flow
