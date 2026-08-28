"""
RelateIQ Enterprise Python SDK - Asynchronous User Resource Client
Domain: identity
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.user_client import UserModel

class AsyncUserClient:
    """Asynchronous non-blocking client for Users operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, user_id: str) -> Optional[UserModel]:
        """Asynchronously fetch single User by ID."""
        async with self._session.get(f"/api/v1/users/{user_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return UserModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[UserModel]:
        """Asynchronously list Users records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/users", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [UserModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> UserModel:
        """Asynchronously create new User."""
        async with self._session.post(f"/api/v1/users", json=payload) as resp:
            data = await resp.json()
            return UserModel(data.get("data", {}))

    async def update_async(self, user_id: str, payload: Dict[str, Any]) -> UserModel:
        """Asynchronously update existing User."""
        async with self._session.put(f"/api/v1/users/{user_id}", json=payload) as resp:
            data = await resp.json()
            return UserModel(data.get("data", {}))

    async def delete_async(self, user_id: str) -> bool:
        """Asynchronously delete User."""
        async with self._session.delete(f"/api/v1/users/{user_id}") as resp:
            return resp.status == 200
