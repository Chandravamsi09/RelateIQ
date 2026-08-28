"""
RelateIQ Enterprise Python SDK - Asynchronous Account Resource Client
Domain: crm
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.account_client import AccountModel

class AsyncAccountClient:
    """Asynchronous non-blocking client for Accounts operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, account_id: str) -> Optional[AccountModel]:
        """Asynchronously fetch single Account by ID."""
        async with self._session.get(f"/api/v1/accounts/{account_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return AccountModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[AccountModel]:
        """Asynchronously list Accounts records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/accounts", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [AccountModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> AccountModel:
        """Asynchronously create new Account."""
        async with self._session.post(f"/api/v1/accounts", json=payload) as resp:
            data = await resp.json()
            return AccountModel(data.get("data", {}))

    async def update_async(self, account_id: str, payload: Dict[str, Any]) -> AccountModel:
        """Asynchronously update existing Account."""
        async with self._session.put(f"/api/v1/accounts/{account_id}", json=payload) as resp:
            data = await resp.json()
            return AccountModel(data.get("data", {}))

    async def delete_async(self, account_id: str) -> bool:
        """Asynchronously delete Account."""
        async with self._session.delete(f"/api/v1/accounts/{account_id}") as resp:
            return resp.status == 200
