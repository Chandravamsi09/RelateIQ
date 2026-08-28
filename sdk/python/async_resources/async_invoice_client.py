"""
RelateIQ Enterprise Python SDK - Asynchronous Invoice Resource Client
Domain: billing
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.invoice_client import InvoiceModel

class AsyncInvoiceClient:
    """Asynchronous non-blocking client for Invoices operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, invoice_id: str) -> Optional[InvoiceModel]:
        """Asynchronously fetch single Invoice by ID."""
        async with self._session.get(f"/api/v1/invoices/{invoice_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return InvoiceModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[InvoiceModel]:
        """Asynchronously list Invoices records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/invoices", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [InvoiceModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> InvoiceModel:
        """Asynchronously create new Invoice."""
        async with self._session.post(f"/api/v1/invoices", json=payload) as resp:
            data = await resp.json()
            return InvoiceModel(data.get("data", {}))

    async def update_async(self, invoice_id: str, payload: Dict[str, Any]) -> InvoiceModel:
        """Asynchronously update existing Invoice."""
        async with self._session.put(f"/api/v1/invoices/{invoice_id}", json=payload) as resp:
            data = await resp.json()
            return InvoiceModel(data.get("data", {}))

    async def delete_async(self, invoice_id: str) -> bool:
        """Asynchronously delete Invoice."""
        async with self._session.delete(f"/api/v1/invoices/{invoice_id}") as resp:
            return resp.status == 200
