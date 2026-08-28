"""
RelateIQ Enterprise Python SDK - Asynchronous Lead Resource Client
Domain: pipeline
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.lead_client import LeadModel

class AsyncLeadClient:
    """Asynchronous non-blocking client for Leads operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, lead_id: str) -> Optional[LeadModel]:
        """Asynchronously fetch single Lead by ID."""
        async with self._session.get(f"/api/v1/leads/{lead_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return LeadModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[LeadModel]:
        """Asynchronously list Leads records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/leads", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [LeadModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> LeadModel:
        """Asynchronously create new Lead."""
        async with self._session.post(f"/api/v1/leads", json=payload) as resp:
            data = await resp.json()
            return LeadModel(data.get("data", {}))

    async def update_async(self, lead_id: str, payload: Dict[str, Any]) -> LeadModel:
        """Asynchronously update existing Lead."""
        async with self._session.put(f"/api/v1/leads/{lead_id}", json=payload) as resp:
            data = await resp.json()
            return LeadModel(data.get("data", {}))

    async def delete_async(self, lead_id: str) -> bool:
        """Asynchronously delete Lead."""
        async with self._session.delete(f"/api/v1/leads/{lead_id}") as resp:
            return resp.status == 200
