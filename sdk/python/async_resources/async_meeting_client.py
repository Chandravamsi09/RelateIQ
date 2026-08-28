"""
RelateIQ Enterprise Python SDK - Asynchronous Meeting Resource Client
Domain: omnichannel
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.meeting_client import MeetingModel

class AsyncMeetingClient:
    """Asynchronous non-blocking client for Meetings operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, meeting_id: str) -> Optional[MeetingModel]:
        """Asynchronously fetch single Meeting by ID."""
        async with self._session.get(f"/api/v1/meetings/{meeting_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return MeetingModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[MeetingModel]:
        """Asynchronously list Meetings records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/meetings", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [MeetingModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> MeetingModel:
        """Asynchronously create new Meeting."""
        async with self._session.post(f"/api/v1/meetings", json=payload) as resp:
            data = await resp.json()
            return MeetingModel(data.get("data", {}))

    async def update_async(self, meeting_id: str, payload: Dict[str, Any]) -> MeetingModel:
        """Asynchronously update existing Meeting."""
        async with self._session.put(f"/api/v1/meetings/{meeting_id}", json=payload) as resp:
            data = await resp.json()
            return MeetingModel(data.get("data", {}))

    async def delete_async(self, meeting_id: str) -> bool:
        """Asynchronously delete Meeting."""
        async with self._session.delete(f"/api/v1/meetings/{meeting_id}") as resp:
            return resp.status == 200
