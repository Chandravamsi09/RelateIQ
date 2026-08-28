"""
RelateIQ Enterprise Python SDK - Asynchronous Quote Resource Client
Domain: cpq
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.quote_client import QuoteModel

class AsyncQuoteClient:
    """Asynchronous non-blocking client for Quotes operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, quote_id: str) -> Optional[QuoteModel]:
        """Asynchronously fetch single Quote by ID."""
        async with self._session.get(f"/api/v1/quotes/{quote_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return QuoteModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[QuoteModel]:
        """Asynchronously list Quotes records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/quotes", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [QuoteModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> QuoteModel:
        """Asynchronously create new Quote."""
        async with self._session.post(f"/api/v1/quotes", json=payload) as resp:
            data = await resp.json()
            return QuoteModel(data.get("data", {}))

    async def update_async(self, quote_id: str, payload: Dict[str, Any]) -> QuoteModel:
        """Asynchronously update existing Quote."""
        async with self._session.put(f"/api/v1/quotes/{quote_id}", json=payload) as resp:
            data = await resp.json()
            return QuoteModel(data.get("data", {}))

    async def delete_async(self, quote_id: str) -> bool:
        """Asynchronously delete Quote."""
        async with self._session.delete(f"/api/v1/quotes/{quote_id}") as resp:
            return resp.status == 200
