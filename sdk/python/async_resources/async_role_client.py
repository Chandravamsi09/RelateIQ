"""
RelateIQ Enterprise Python SDK - Asynchronous Role Resource Client
Domain: identity
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.role_client import RoleModel

class AsyncRoleClient:
    """Asynchronous non-blocking client for Roles operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, role_id: str) -> Optional[RoleModel]:
        """Asynchronously fetch single Role by ID."""
        async with self._session.get(f"/api/v1/roles/{role_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return RoleModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[RoleModel]:
        """Asynchronously list Roles records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/roles", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [RoleModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> RoleModel:
        """Asynchronously create new Role."""
        async with self._session.post(f"/api/v1/roles", json=payload) as resp:
            data = await resp.json()
            return RoleModel(data.get("data", {}))

    async def update_async(self, role_id: str, payload: Dict[str, Any]) -> RoleModel:
        """Asynchronously update existing Role."""
        async with self._session.put(f"/api/v1/roles/{role_id}", json=payload) as resp:
            data = await resp.json()
            return RoleModel(data.get("data", {}))

    async def delete_async(self, role_id: str) -> bool:
        """Asynchronously delete Role."""
        async with self._session.delete(f"/api/v1/roles/{role_id}") as resp:
            return resp.status == 200
