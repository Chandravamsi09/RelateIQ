"""
RelateIQ Enterprise Python SDK - Asynchronous SalesQuota Resource Client
Domain: sales_ops
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.salesquota_client import SalesQuotaModel

class AsyncSalesQuotaClient:
    """Asynchronous non-blocking client for SalesQuotas operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, salesquota_id: str) -> Optional[SalesQuotaModel]:
        """Asynchronously fetch single SalesQuota by ID."""
        async with self._session.get(f"/api/v1/salesquotas/{salesquota_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return SalesQuotaModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[SalesQuotaModel]:
        """Asynchronously list SalesQuotas records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/salesquotas", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [SalesQuotaModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> SalesQuotaModel:
        """Asynchronously create new SalesQuota."""
        async with self._session.post(f"/api/v1/salesquotas", json=payload) as resp:
            data = await resp.json()
            return SalesQuotaModel(data.get("data", {}))

    async def update_async(self, salesquota_id: str, payload: Dict[str, Any]) -> SalesQuotaModel:
        """Asynchronously update existing SalesQuota."""
        async with self._session.put(f"/api/v1/salesquotas/{salesquota_id}", json=payload) as resp:
            data = await resp.json()
            return SalesQuotaModel(data.get("data", {}))

    async def delete_async(self, salesquota_id: str) -> bool:
        """Asynchronously delete SalesQuota."""
        async with self._session.delete(f"/api/v1/salesquotas/{salesquota_id}") as resp:
            return resp.status == 200
