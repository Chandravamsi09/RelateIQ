"""
RelateIQ Enterprise Python SDK - Asynchronous Ticket Resource Client
Domain: support
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.ticket_client import TicketModel

class AsyncTicketClient:
    """Asynchronous non-blocking client for Tickets operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, ticket_id: str) -> Optional[TicketModel]:
        """Asynchronously fetch single Ticket by ID."""
        async with self._session.get(f"/api/v1/tickets/{ticket_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return TicketModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[TicketModel]:
        """Asynchronously list Tickets records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/tickets", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [TicketModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> TicketModel:
        """Asynchronously create new Ticket."""
        async with self._session.post(f"/api/v1/tickets", json=payload) as resp:
            data = await resp.json()
            return TicketModel(data.get("data", {}))

    async def update_async(self, ticket_id: str, payload: Dict[str, Any]) -> TicketModel:
        """Asynchronously update existing Ticket."""
        async with self._session.put(f"/api/v1/tickets/{ticket_id}", json=payload) as resp:
            data = await resp.json()
            return TicketModel(data.get("data", {}))

    async def delete_async(self, ticket_id: str) -> bool:
        """Asynchronously delete Ticket."""
        async with self._session.delete(f"/api/v1/tickets/{ticket_id}") as resp:
            return resp.status == 200
