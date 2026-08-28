"""
RelateIQ Enterprise Python SDK - Asynchronous Activity Resource Client
Domain: omnichannel
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.activity_client import ActivityModel

class AsyncActivityClient:
    """Asynchronous non-blocking client for Activities operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, activity_id: str) -> Optional[ActivityModel]:
        """Asynchronously fetch single Activity by ID."""
        async with self._session.get(f"/api/v1/activities/{activity_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return ActivityModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[ActivityModel]:
        """Asynchronously list Activities records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/activities", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [ActivityModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> ActivityModel:
        """Asynchronously create new Activity."""
        async with self._session.post(f"/api/v1/activities", json=payload) as resp:
            data = await resp.json()
            return ActivityModel(data.get("data", {}))

    async def update_async(self, activity_id: str, payload: Dict[str, Any]) -> ActivityModel:
        """Asynchronously update existing Activity."""
        async with self._session.put(f"/api/v1/activities/{activity_id}", json=payload) as resp:
            data = await resp.json()
            return ActivityModel(data.get("data", {}))

    async def delete_async(self, activity_id: str) -> bool:
        """Asynchronously delete Activity."""
        async with self._session.delete(f"/api/v1/activities/{activity_id}") as resp:
            return resp.status == 200
