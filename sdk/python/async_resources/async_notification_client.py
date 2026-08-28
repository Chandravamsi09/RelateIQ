"""
RelateIQ Enterprise Python SDK - Asynchronous Notification Resource Client
Domain: collaboration
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.notification_client import NotificationModel

class AsyncNotificationClient:
    """Asynchronous non-blocking client for Notifications operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, notification_id: str) -> Optional[NotificationModel]:
        """Asynchronously fetch single Notification by ID."""
        async with self._session.get(f"/api/v1/notifications/{notification_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return NotificationModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[NotificationModel]:
        """Asynchronously list Notifications records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/notifications", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [NotificationModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> NotificationModel:
        """Asynchronously create new Notification."""
        async with self._session.post(f"/api/v1/notifications", json=payload) as resp:
            data = await resp.json()
            return NotificationModel(data.get("data", {}))

    async def update_async(self, notification_id: str, payload: Dict[str, Any]) -> NotificationModel:
        """Asynchronously update existing Notification."""
        async with self._session.put(f"/api/v1/notifications/{notification_id}", json=payload) as resp:
            data = await resp.json()
            return NotificationModel(data.get("data", {}))

    async def delete_async(self, notification_id: str) -> bool:
        """Asynchronously delete Notification."""
        async with self._session.delete(f"/api/v1/notifications/{notification_id}") as resp:
            return resp.status == 200
