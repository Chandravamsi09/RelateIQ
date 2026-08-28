"""
RelateIQ Enterprise Python SDK - Asynchronous Territory Resource Client
Domain: sales_ops
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.territory_client import TerritoryModel

class AsyncTerritoryClient:
    """Asynchronous non-blocking client for Territories operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, territory_id: str) -> Optional[TerritoryModel]:
        """Asynchronously fetch single Territory by ID."""
        async with self._session.get(f"/api/v1/territories/{territory_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return TerritoryModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[TerritoryModel]:
        """Asynchronously list Territories records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/territories", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [TerritoryModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> TerritoryModel:
        """Asynchronously create new Territory."""
        async with self._session.post(f"/api/v1/territories", json=payload) as resp:
            data = await resp.json()
            return TerritoryModel(data.get("data", {}))

    async def update_async(self, territory_id: str, payload: Dict[str, Any]) -> TerritoryModel:
        """Asynchronously update existing Territory."""
        async with self._session.put(f"/api/v1/territories/{territory_id}", json=payload) as resp:
            data = await resp.json()
            return TerritoryModel(data.get("data", {}))

    async def delete_async(self, territory_id: str) -> bool:
        """Asynchronously delete Territory."""
        async with self._session.delete(f"/api/v1/territories/{territory_id}") as resp:
            return resp.status == 200
