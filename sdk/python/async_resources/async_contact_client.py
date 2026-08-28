"""
RelateIQ Enterprise Python SDK - Asynchronous Contact Resource Client
Domain: crm
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.contact_client import ContactModel

class AsyncContactClient:
    """Asynchronous non-blocking client for Contacts operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, contact_id: str) -> Optional[ContactModel]:
        """Asynchronously fetch single Contact by ID."""
        async with self._session.get(f"/api/v1/contacts/{contact_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return ContactModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[ContactModel]:
        """Asynchronously list Contacts records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/contacts", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [ContactModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> ContactModel:
        """Asynchronously create new Contact."""
        async with self._session.post(f"/api/v1/contacts", json=payload) as resp:
            data = await resp.json()
            return ContactModel(data.get("data", {}))

    async def update_async(self, contact_id: str, payload: Dict[str, Any]) -> ContactModel:
        """Asynchronously update existing Contact."""
        async with self._session.put(f"/api/v1/contacts/{contact_id}", json=payload) as resp:
            data = await resp.json()
            return ContactModel(data.get("data", {}))

    async def delete_async(self, contact_id: str) -> bool:
        """Asynchronously delete Contact."""
        async with self._session.delete(f"/api/v1/contacts/{contact_id}") as resp:
            return resp.status == 200
