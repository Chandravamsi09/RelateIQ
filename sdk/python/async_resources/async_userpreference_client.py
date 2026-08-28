"""
RelateIQ Enterprise Python SDK - Asynchronous UserPreference Resource Client
Domain: settings
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.userpreference_client import UserPreferenceModel

class AsyncUserPreferenceClient:
    """Asynchronous non-blocking client for UserPreferences operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, userpreference_id: str) -> Optional[UserPreferenceModel]:
        """Asynchronously fetch single UserPreference by ID."""
        async with self._session.get(f"/api/v1/userpreferences/{userpreference_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return UserPreferenceModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[UserPreferenceModel]:
        """Asynchronously list UserPreferences records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/userpreferences", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [UserPreferenceModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> UserPreferenceModel:
        """Asynchronously create new UserPreference."""
        async with self._session.post(f"/api/v1/userpreferences", json=payload) as resp:
            data = await resp.json()
            return UserPreferenceModel(data.get("data", {}))

    async def update_async(self, userpreference_id: str, payload: Dict[str, Any]) -> UserPreferenceModel:
        """Asynchronously update existing UserPreference."""
        async with self._session.put(f"/api/v1/userpreferences/{userpreference_id}", json=payload) as resp:
            data = await resp.json()
            return UserPreferenceModel(data.get("data", {}))

    async def delete_async(self, userpreference_id: str) -> bool:
        """Asynchronously delete UserPreference."""
        async with self._session.delete(f"/api/v1/userpreferences/{userpreference_id}") as resp:
            return resp.status == 200
