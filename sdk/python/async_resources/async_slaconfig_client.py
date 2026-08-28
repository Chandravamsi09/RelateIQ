"""
RelateIQ Enterprise Python SDK - Asynchronous SLAConfig Resource Client
Domain: support
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.slaconfig_client import SLAConfigModel

class AsyncSLAConfigClient:
    """Asynchronous non-blocking client for SLAConfigs operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, slaconfig_id: str) -> Optional[SLAConfigModel]:
        """Asynchronously fetch single SLAConfig by ID."""
        async with self._session.get(f"/api/v1/slaconfigs/{slaconfig_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return SLAConfigModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[SLAConfigModel]:
        """Asynchronously list SLAConfigs records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/slaconfigs", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [SLAConfigModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> SLAConfigModel:
        """Asynchronously create new SLAConfig."""
        async with self._session.post(f"/api/v1/slaconfigs", json=payload) as resp:
            data = await resp.json()
            return SLAConfigModel(data.get("data", {}))

    async def update_async(self, slaconfig_id: str, payload: Dict[str, Any]) -> SLAConfigModel:
        """Asynchronously update existing SLAConfig."""
        async with self._session.put(f"/api/v1/slaconfigs/{slaconfig_id}", json=payload) as resp:
            data = await resp.json()
            return SLAConfigModel(data.get("data", {}))

    async def delete_async(self, slaconfig_id: str) -> bool:
        """Asynchronously delete SLAConfig."""
        async with self._session.delete(f"/api/v1/slaconfigs/{slaconfig_id}") as resp:
            return resp.status == 200
