"""
RelateIQ Enterprise Python SDK - Asynchronous TicketComment Resource Client
Domain: support
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.ticketcomment_client import TicketCommentModel

class AsyncTicketCommentClient:
    """Asynchronous non-blocking client for TicketComments operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, ticketcomment_id: str) -> Optional[TicketCommentModel]:
        """Asynchronously fetch single TicketComment by ID."""
        async with self._session.get(f"/api/v1/ticketcomments/{ticketcomment_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return TicketCommentModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[TicketCommentModel]:
        """Asynchronously list TicketComments records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/ticketcomments", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [TicketCommentModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> TicketCommentModel:
        """Asynchronously create new TicketComment."""
        async with self._session.post(f"/api/v1/ticketcomments", json=payload) as resp:
            data = await resp.json()
            return TicketCommentModel(data.get("data", {}))

    async def update_async(self, ticketcomment_id: str, payload: Dict[str, Any]) -> TicketCommentModel:
        """Asynchronously update existing TicketComment."""
        async with self._session.put(f"/api/v1/ticketcomments/{ticketcomment_id}", json=payload) as resp:
            data = await resp.json()
            return TicketCommentModel(data.get("data", {}))

    async def delete_async(self, ticketcomment_id: str) -> bool:
        """Asynchronously delete TicketComment."""
        async with self._session.delete(f"/api/v1/ticketcomments/{ticketcomment_id}") as resp:
            return resp.status == 200
