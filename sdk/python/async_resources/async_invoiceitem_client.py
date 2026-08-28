"""
RelateIQ Enterprise Python SDK - Asynchronous InvoiceItem Resource Client
Domain: billing
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.invoiceitem_client import InvoiceItemModel

class AsyncInvoiceItemClient:
    """Asynchronous non-blocking client for InvoiceItems operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, invoiceitem_id: str) -> Optional[InvoiceItemModel]:
        """Asynchronously fetch single InvoiceItem by ID."""
        async with self._session.get(f"/api/v1/invoiceitems/{invoiceitem_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return InvoiceItemModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[InvoiceItemModel]:
        """Asynchronously list InvoiceItems records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/invoiceitems", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [InvoiceItemModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> InvoiceItemModel:
        """Asynchronously create new InvoiceItem."""
        async with self._session.post(f"/api/v1/invoiceitems", json=payload) as resp:
            data = await resp.json()
            return InvoiceItemModel(data.get("data", {}))

    async def update_async(self, invoiceitem_id: str, payload: Dict[str, Any]) -> InvoiceItemModel:
        """Asynchronously update existing InvoiceItem."""
        async with self._session.put(f"/api/v1/invoiceitems/{invoiceitem_id}", json=payload) as resp:
            data = await resp.json()
            return InvoiceItemModel(data.get("data", {}))

    async def delete_async(self, invoiceitem_id: str) -> bool:
        """Asynchronously delete InvoiceItem."""
        async with self._session.delete(f"/api/v1/invoiceitems/{invoiceitem_id}") as resp:
            return resp.status == 200
