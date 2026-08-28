"""
RelateIQ Enterprise Python SDK - Asynchronous Deal Resource Client
Domain: pipeline
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.deal_client import DealModel

class AsyncDealClient:
    """Asynchronous non-blocking client for Deals operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, deal_id: str) -> Optional[DealModel]:
        """Asynchronously fetch single Deal by ID."""
        async with self._session.get(f"/api/v1/deals/{deal_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return DealModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[DealModel]:
        """Asynchronously list Deals records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/deals", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [DealModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> DealModel:
        """Asynchronously create new Deal."""
        async with self._session.post(f"/api/v1/deals", json=payload) as resp:
            data = await resp.json()
            return DealModel(data.get("data", {}))

    async def update_async(self, deal_id: str, payload: Dict[str, Any]) -> DealModel:
        """Asynchronously update existing Deal."""
        async with self._session.put(f"/api/v1/deals/{deal_id}", json=payload) as resp:
            data = await resp.json()
            return DealModel(data.get("data", {}))

    async def delete_async(self, deal_id: str) -> bool:
        """Asynchronously delete Deal."""
        async with self._session.delete(f"/api/v1/deals/{deal_id}") as resp:
            return resp.status == 200
