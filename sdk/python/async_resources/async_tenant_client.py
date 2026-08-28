"""
RelateIQ Enterprise Python SDK - Asynchronous Tenant Resource Client
Domain: identity
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.tenant_client import TenantModel

class AsyncTenantClient:
    """Asynchronous non-blocking client for Tenants operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, tenant_id: str) -> Optional[TenantModel]:
        """Asynchronously fetch single Tenant by ID."""
        async with self._session.get(f"/api/v1/tenants/{tenant_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return TenantModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[TenantModel]:
        """Asynchronously list Tenants records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/tenants", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [TenantModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> TenantModel:
        """Asynchronously create new Tenant."""
        async with self._session.post(f"/api/v1/tenants", json=payload) as resp:
            data = await resp.json()
            return TenantModel(data.get("data", {}))

    async def update_async(self, tenant_id: str, payload: Dict[str, Any]) -> TenantModel:
        """Asynchronously update existing Tenant."""
        async with self._session.put(f"/api/v1/tenants/{tenant_id}", json=payload) as resp:
            data = await resp.json()
            return TenantModel(data.get("data", {}))

    async def delete_async(self, tenant_id: str) -> bool:
        """Asynchronously delete Tenant."""
        async with self._session.delete(f"/api/v1/tenants/{tenant_id}") as resp:
            return resp.status == 200
