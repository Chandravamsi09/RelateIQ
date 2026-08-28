"""
RelateIQ Enterprise Python SDK - Asynchronous QuoteLineItem Resource Client
Domain: cpq
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.quotelineitem_client import QuoteLineItemModel

class AsyncQuoteLineItemClient:
    """Asynchronous non-blocking client for QuoteLineItems operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, quotelineitem_id: str) -> Optional[QuoteLineItemModel]:
        """Asynchronously fetch single QuoteLineItem by ID."""
        async with self._session.get(f"/api/v1/quotelineitems/{quotelineitem_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return QuoteLineItemModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[QuoteLineItemModel]:
        """Asynchronously list QuoteLineItems records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/quotelineitems", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [QuoteLineItemModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> QuoteLineItemModel:
        """Asynchronously create new QuoteLineItem."""
        async with self._session.post(f"/api/v1/quotelineitems", json=payload) as resp:
            data = await resp.json()
            return QuoteLineItemModel(data.get("data", {}))

    async def update_async(self, quotelineitem_id: str, payload: Dict[str, Any]) -> QuoteLineItemModel:
        """Asynchronously update existing QuoteLineItem."""
        async with self._session.put(f"/api/v1/quotelineitems/{quotelineitem_id}", json=payload) as resp:
            data = await resp.json()
            return QuoteLineItemModel(data.get("data", {}))

    async def delete_async(self, quotelineitem_id: str) -> bool:
        """Asynchronously delete QuoteLineItem."""
        async with self._session.delete(f"/api/v1/quotelineitems/{quotelineitem_id}") as resp:
            return resp.status == 200
