"""
RelateIQ Enterprise Python SDK - Asynchronous EmailCampaign Resource Client
Domain: marketing
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.emailcampaign_client import EmailCampaignModel

class AsyncEmailCampaignClient:
    """Asynchronous non-blocking client for EmailCampaigns operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, emailcampaign_id: str) -> Optional[EmailCampaignModel]:
        """Asynchronously fetch single EmailCampaign by ID."""
        async with self._session.get(f"/api/v1/emailcampaigns/{emailcampaign_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return EmailCampaignModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[EmailCampaignModel]:
        """Asynchronously list EmailCampaigns records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/emailcampaigns", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [EmailCampaignModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> EmailCampaignModel:
        """Asynchronously create new EmailCampaign."""
        async with self._session.post(f"/api/v1/emailcampaigns", json=payload) as resp:
            data = await resp.json()
            return EmailCampaignModel(data.get("data", {}))

    async def update_async(self, emailcampaign_id: str, payload: Dict[str, Any]) -> EmailCampaignModel:
        """Asynchronously update existing EmailCampaign."""
        async with self._session.put(f"/api/v1/emailcampaigns/{emailcampaign_id}", json=payload) as resp:
            data = await resp.json()
            return EmailCampaignModel(data.get("data", {}))

    async def delete_async(self, emailcampaign_id: str) -> bool:
        """Asynchronously delete EmailCampaign."""
        async with self._session.delete(f"/api/v1/emailcampaigns/{emailcampaign_id}") as resp:
            return resp.status == 200
