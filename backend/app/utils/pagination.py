from __future__ import annotations
from typing import Any, Dict, List, Optional


def paginate(
    collection,
    query: Dict[str, Any],
    page: int = 1,
    page_size: int = 20,
    sort_field: str = "created_at",
    sort_dir: int = -1,
    projection: Optional[Dict[str, int]] = None,
) -> Dict[str, Any]:
    """MongoDB-level pagination — never loads all documents into memory."""
    page = max(1, page)
    page_size = min(100, max(1, page_size))
    skip = (page - 1) * page_size

    total = collection.count_documents(query)
    cursor = (
        collection.find(query, projection)
        .sort(sort_field, sort_dir)
        .skip(skip)
        .limit(page_size)
    )
    items = list(cursor)

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size,
    }
